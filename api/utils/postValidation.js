import validator from "validator";

const MAX_TITLE = 200;
const MAX_ADDRESS = 500;
const MAX_CITY = 120;
const MAX_DESC = 20000;
const MAX_IMAGES = 24;

const allowedType = new Set(["buy", "rent"]);
const allowedProperty = new Set(["apartment", "house", "condo", "land"]);

export function validatePostPayload(body) {
  const errors = [];
  const postData = body?.postData;
  const postDetail = body?.postDetail;

  if (!postData || typeof postData !== "object") {
    return { ok: false, errors: ["postData is required"] };
  }
  if (!postDetail || typeof postDetail !== "object") {
    return { ok: false, errors: ["postDetail is required"] };
  }

  const title = String(postData.title || "").trim();
  const address = String(postData.address || "").trim();
  const city = String(postData.city || "").trim();
  const type = String(postData.type || "").trim();
  const property = String(postData.property || "").trim();
  const latitude = String(postData.latitude || "").trim();
  const longitude = String(postData.longitude || "").trim();
  const images = Array.isArray(postData.images) ? postData.images : [];

  if (!title || title.length > MAX_TITLE) errors.push("title is invalid");
  if (!address || address.length > MAX_ADDRESS) errors.push("address is invalid");
  if (!city || city.length > MAX_CITY) errors.push("city is invalid");
  if (!allowedType.has(type)) errors.push("type must be buy or rent");
  if (!allowedProperty.has(property)) errors.push("property enum is invalid");

  const price = Number(postData.price);
  const bedroom = Number(postData.bedroom);
  const bathroom = Number(postData.bathroom);
  if (!Number.isFinite(price) || price <= 0) errors.push("price must be a positive number");
  if (!Number.isInteger(bedroom) || bedroom < 1) errors.push("bedroom must be an integer ≥ 1");
  if (!Number.isInteger(bathroom) || bathroom < 1)
    errors.push("bathroom must be an integer ≥ 1");

  if (!latitude || !validator.isFloat(latitude)) errors.push("latitude must be numeric");
  if (!longitude || !validator.isFloat(longitude)) errors.push("longitude must be numeric");

  if (!images.length) errors.push("at least one image is required");
  if (images.length > MAX_IMAGES) errors.push("too many images");
  if (images.some((u) => typeof u !== "string" || !validator.isURL(u, { protocols: ["http", "https"], require_protocol: true }))) {
    errors.push("each image must be a valid http(s) URL");
  }

  const desc = String(postDetail.desc || "").replace(/<[^>]*>/g, "").trim(); // coarse strip for length
  const descHtml = String(postDetail.desc || "");
  if (!descHtml || descHtml.length > MAX_DESC) errors.push("description is required or too long");

  const utilities = postDetail.utilities != null ? String(postDetail.utilities) : null;
  const pet = postDetail.pet != null ? String(postDetail.pet) : null;
  const furnished =
    postDetail.furnished != null ? String(postDetail.furnished).toLowerCase() : null;
  if (furnished && !["furnished", "unfurnished"].includes(furnished)) {
    errors.push("furnished must be furnished or unfurnished");
  }

  ["school", "bus", "restaurant", "size"].forEach((k) => {
    if (postDetail[k] == null || postDetail[k] === "") return;
    const n = Number(postDetail[k]);
    if (!Number.isFinite(n) || n < 0) errors.push(`${k} must be a non-negative number`);
  });

  if (errors.length) return { ok: false, errors };

  return {
    ok: true,
    value: {
      postData: {
        title,
        price: Math.round(price),
        address,
        city,
        bedroom,
        bathroom,
        latitude,
        longitude,
        images,
        type,
        property,
      },
      postDetail: {
        desc: descHtml,
        furnished: furnished || undefined,
        utilities: utilities || undefined,
        pet: pet || undefined,
        income: postDetail.income ? String(postDetail.income).slice(0, 240) : undefined,
        school: postDetail.school != null ? Number(postDetail.school) : undefined,
        bus: postDetail.bus != null ? Number(postDetail.bus) : undefined,
        restaurant: postDetail.restaurant != null ? Number(postDetail.restaurant) : undefined,
        size: postDetail.size != null ? Number(postDetail.size) : undefined,
      },
    },
  };
}
