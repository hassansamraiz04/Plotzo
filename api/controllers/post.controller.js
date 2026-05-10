import jwt from "jsonwebtoken";
import util from "util";
import prisma from "../prisma/prisma.js";
import { validatePostPayload } from "../utils/postValidation.js";
import { normalizeAddressKey } from "../utils/normalize.js";

const verifyAsync = util.promisify(jwt.verify);

const parseIntMaybe = (v) => {
  const n = Number.parseInt(v, 10);
  return Number.isFinite(n) ? n : undefined;
};

export const getPosts = async (req, res) => {
  const q = req.query;
  try {
    const city = typeof q.city === "string" && q.city.trim().length ? q.city.trim() : undefined;
    const type =
      typeof q.type === "string" && q.type.trim().length ? q.type.trim() : undefined;
    const property =
      typeof q.property === "string" && q.property.trim().length
        ? q.property.trim()
        : undefined;
    const bedroom = parseIntMaybe(q.bedroom);
    const bathroom = parseIntMaybe(q.bathroom);
    const minPrice = parseIntMaybe(q.minPrice);
    const maxPrice = parseIntMaybe(q.maxPrice);
    const minArea = parseIntMaybe(q.minArea);
    const maxArea = parseIntMaybe(q.maxArea);
    const furnished =
      typeof q.furnished === "string" && q.furnished.trim().length
        ? q.furnished.trim().toLowerCase()
        : undefined;

    const detailFilter = {};
    if (Number.isFinite(minArea) || Number.isFinite(maxArea)) {
      detailFilter.size = {
        ...(Number.isFinite(minArea) ? { gte: minArea } : {}),
        ...(Number.isFinite(maxArea) ? { lte: maxArea } : {}),
      };
    }

    const priceFilter = {};
    if (Number.isFinite(minPrice)) priceFilter.gte = minPrice;
    if (Number.isFinite(maxPrice)) priceFilter.lte = maxPrice;

    const where = {
      ...(city ? { city: { contains: city } } : {}),
      ...(type ? { type } : {}),
      ...(property ? { property } : {}),
      ...(Number.isFinite(bedroom) ? { bedroom } : {}),
      ...(Number.isFinite(bathroom) ? { bathroom } : {}),
      ...(Object.keys(priceFilter).length ? { price: priceFilter } : {}),
      ...(Object.keys(detailFilter).length
        ? { postDetail: { is: detailFilter } }
        : {}),
    };
    if (furnished) {
      where.postDetail = {
        ...(where.postDetail || {}),
        is: {
          ...((where.postDetail && where.postDetail.is) || {}),
          furnished,
        },
      };
    }

    let orderBy = { createdAt: "desc" };
    if (q.sortBy === "priceAsc") orderBy = { price: "asc" };
    else if (q.sortBy === "priceDesc") orderBy = { price: "desc" };
    else if (q.sortBy === "newest") orderBy = { createdAt: "desc" };
    else if (q.sortBy === "oldest") orderBy = { createdAt: "asc" };

    const posts = await prisma.post.findMany({ where, orderBy });
    res.status(200).json(posts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to get posts" });
  }
};

export const getPost = async (req, res) => {
  const id = req.params.id;
  try {
    const post = await prisma.post.findUnique({
      where: { id },
      include: {
        postDetail: true,
        user: {
          select: {
            id: true,
            username: true,
            avatar: true,
          },
        },
      },
    });

    if (!post) return res.status(404).json({ message: "Listing not found" });

    let isSaved = false;
    let token =
      req.cookies?.token ||
      (req.headers.authorization?.startsWith("Bearer ")
        ? req.headers.authorization.slice(7)
        : null);

    if (token && process.env.JWT_SECRET_KEY) {
      try {
        const payload = await verifyAsync(token, process.env.JWT_SECRET_KEY);
        const saved = await prisma.savedPost.findUnique({
          where: {
            userId_postId: {
              postId: id,
              userId: payload.id,
            },
          },
        });
        isSaved = Boolean(saved);
      } catch {
        isSaved = false;
      }
    }

    res.status(200).json({ ...post, isSaved });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to get post" });
  }
};

export const addPost = async (req, res) => {
  const validated = validatePostPayload(req.body);
  if (!validated.ok) {
    return res.status(400).json({ errors: validated.errors });
  }

  const { postData, postDetail } = validated.value;

  try {
    const normAddr = normalizeAddressKey(postData.address);
    const normCity = normalizeAddressKey(postData.city);

    const existing = await prisma.post.findMany({
      where: { userId: req.userId },
      select: { id: true, address: true, city: true, title: true },
    });

    const duplicate = existing.find(
      (p) =>
        normalizeAddressKey(p.address) === normAddr &&
        normalizeAddressKey(p.city) === normCity
    );
    if (duplicate) {
      return res.status(409).json({
        message:
          "A listing with this address already exists under your seller account.",
        duplicateOf: duplicate.id,
      });
    }

    const newPost = await prisma.post.create({
      data: {
        title: postData.title,
        price: postData.price,
        images: postData.images,
        address: postData.address,
        city: postData.city,
        bedroom: postData.bedroom,
        bathroom: postData.bathroom,
        latitude: postData.latitude,
        longitude: postData.longitude,
        type: postData.type,
        property: postData.property,
        userId: req.userId,
        postDetail: {
          create: postDetail,
        },
      },
    });

    res.status(201).json(newPost);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to create post" });
  }
};

export const updatePost = async (req, res) => {
  const validated = validatePostPayload(req.body);
  if (!validated.ok) {
    return res.status(400).json({ errors: validated.errors });
  }

  const id = req.params.id;
  const { postData, postDetail } = validated.value;

  try {
    const post = await prisma.post.findUnique({ where: { id } });
    if (!post) return res.status(404).json({ message: "Listing not found" });
    if (post.userId !== req.userId) {
      return res.status(403).json({
        message: "Only the listing owner can update this listing",
        code: "FORBIDDEN_OWNER",
      });
    }

    const normAddr = normalizeAddressKey(postData.address);
    const normCity = normalizeAddressKey(postData.city);

    const siblings = await prisma.post.findMany({
      where: { userId: req.userId, NOT: { id } },
      select: { address: true, city: true },
    });
    const conflict = siblings.find(
      (p) =>
        normalizeAddressKey(p.address) === normAddr &&
        normalizeAddressKey(p.city) === normCity
    );
    if (conflict) {
      return res.status(409).json({
        message: "Another listing already uses this address for your account.",
      });
    }

    const updated = await prisma.post.update({
      where: { id },
      data: {
        title: postData.title,
        price: postData.price,
        images: postData.images,
        address: postData.address,
        city: postData.city,
        bedroom: postData.bedroom,
        bathroom: postData.bathroom,
        latitude: postData.latitude,
        longitude: postData.longitude,
        type: postData.type,
        property: postData.property,
        postDetail: {
          upsert: {
            create: postDetail,
            update: postDetail,
          },
        },
      },
    });

    res.status(200).json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update post" });
  }
};

export const deletePost = async (req, res) => {
  const id = req.params.id;
  const tokenUserId = req.userId;

  try {
    const post = await prisma.post.findUnique({
      where: { id },
    });

    if (!post) return res.status(404).json({ message: "Listing not found" });
    if (post.userId !== tokenUserId) {
      return res.status(403).json({
        message: "Only the listing owner can delete this listing",
        code: "FORBIDDEN_OWNER",
      });
    }

    await prisma.$transaction([
      prisma.savedPost.deleteMany({
        where: { postId: id },
      }),
      prisma.postDetail.deleteMany({
        where: { postId: id },
      }),
      prisma.post.delete({
        where: { id },
      }),
    ]);

    res.status(200).json({ message: "Post deleted", code: "POST_DELETED" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to delete post" });
  }
};
