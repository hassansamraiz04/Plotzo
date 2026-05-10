import prisma from "../prisma/prisma.js";

export const requirePostOwner = async (req, res, next) => {
  const postId = req.params.id;

  try {
    const post = await prisma.post.findUnique({
      where: { id: postId },
      select: { id: true, userId: true },
    });

    if (!post) {
      return res.status(404).json({
        message: "Listing not found",
        code: "LISTING_NOT_FOUND",
      });
    }

    if (post.userId !== req.userId) {
      return res.status(403).json({
        message: "Only the listing owner can modify this listing",
        code: "FORBIDDEN_OWNER",
      });
    }

    req.post = post;
    next();
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Failed to verify listing ownership",
      code: "OWNERSHIP_CHECK_FAILED",
    });
  }
};
