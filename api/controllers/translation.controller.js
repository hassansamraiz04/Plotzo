import crypto from "crypto";
import prisma from "../prisma/prisma.js";
import { createLRU } from "../utils/memoryCache.js";

const lru = createLRU(Number(process.env.TRANSLATION_LRU_MAX || "500"));

const TTL_MS =
  Number(process.env.TRANSLATION_CACHE_MS || "") || 1000 * 60 * 60 * 24 * 7;

function fingerprint(sourceLang, targetLang, text) {
  return crypto
    .createHash("sha256")
    .update(`${sourceLang}|${targetLang}|${text}`)
    .digest("hex");
}

async function translateViaMyMemory(text, sourceLang, targetLang) {
  const pair = `${encodeURIComponent(sourceLang)}|${encodeURIComponent(targetLang)}`;
  const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(
    text
  )}&langpair=${pair}`;
  const resp = await fetch(url, { method: "GET" });
  if (!resp.ok) throw new Error("Translation provider unavailable");
  const data = await resp.json();
  if (data.responseStatus !== 200 || !data.responseData?.translatedText) {
    throw new Error(data.responseData?.error || "Translation failed");
  }
  return String(data.responseData.translatedText);
}

async function translateViaLibre(text, sourceLang, targetLang) {
  const base =
    process.env.LIBRETRANSLATE_URL?.replace(/\/$/, "") ||
    "https://libretranslate.de";
  const apiKey = process.env.LIBRETRANSLATE_API_KEY;
  const body = {
    q: text,
    source: sourceLang === "auto" ? "auto" : sourceLang,
    target: targetLang,
    format: "text",
    ...(apiKey ? { api_key: apiKey } : {}),
  };
  const resp = await fetch(`${base}/translate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!resp.ok) {
    const txt = await resp.text();
    throw new Error(txt || `LibreTranslate HTTP ${resp.status}`);
  }
  const data = await resp.json();
  return String(data.translatedText || "");
}

/**
 * Translate user-visible property description snippets.
 */
export const translateText = async (req, res) => {
  const rawText = typeof req.body?.text === "string" ? req.body.text : "";
  const targetLang = String(req.body?.targetLang || "es").slice(0, 12);
  const sourceLang =
    typeof req.body?.sourceLang === "string" &&
    req.body.sourceLang.trim().length > 0
      ? req.body.sourceLang.trim().slice(0, 12)
      : "auto";

  if (!rawText.trim() || rawText.length > 16000) {
    return res
      .status(400)
      .json({ message: "Invalid text payload (must be ≤ 16000 chars)" });
  }

  const fp = fingerprint(sourceLang, targetLang, rawText);
  const mem = lru.get(fp);
  if (mem) {
    return res.status(200).json({ translated: mem, cached: true, fingerprint: fp });
  }

  const now = Date.now();

  try {
    const persisted = await prisma.translationCache.findUnique({
      where: { fingerprint: fp },
    });
    if (persisted?.expiresAt && persisted.expiresAt.getTime() > now) {
      lru.set(fp, persisted.translated);
      return res.status(200).json({
        translated: persisted.translated,
        cached: true,
        fingerprint: fp,
      });
    }
  } catch (e) {
    // Prisma disconnected / TTL index missing → continue uncached network path
    console.warn("Translation DB cache read failed:", e.message);
  }

  let translated;
  const preferLibre =
    process.env.USING_LIBRETRANSLATE === "true" ||
    Boolean(process.env.LIBRETRANSLATE_URL);

  try {
    if (preferLibre) {
      translated = await translateViaLibre(rawText, sourceLang, targetLang);
    } else {
      const srcMy =
        sourceLang === "auto" ? "en" : sourceLang; // heuristic when auto
      translated = await translateViaMyMemory(rawText, srcMy, targetLang);
    }
  } catch (e) {
    if (preferLibre) {
      try {
        const srcMy =
          sourceLang === "auto" ? "en" : sourceLang;
        translated = await translateViaMyMemory(rawText, srcMy, targetLang);
      } catch (fallbackErr) {
        console.error(fallbackErr);
        return res
          .status(502)
          .json({ message: "Translation service temporarily unavailable" });
      }
    } else {
      console.error(e);
      return res
        .status(502)
        .json({ message: "Translation service temporarily unavailable" });
    }
  }

  lru.set(fp, translated);

  const expiresAt = new Date(now + TTL_MS);

  prisma.translationCache
    .upsert({
      where: { fingerprint: fp },
      create: {
        fingerprint: fp,
        sourceLang,
        targetLang,
        originalText: rawText,
        translated,
        expiresAt,
      },
      update: {
        translated,
        originalText: rawText,
        sourceLang,
        targetLang,
        expiresAt,
      },
    })
    .catch(() => {});

  return res.status(200).json({
    translated,
    cached: false,
    fingerprint: fp,
  });
};
