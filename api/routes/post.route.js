import express from "express";
import { verifyToken } from "../middleware/verifyToken.js";
import { requireSeller } from "../middleware/requireSeller.js";
import { requirePostOwner } from "../middleware/requirePostOwner.js";
import {
  addPost,
  deletePost,
  getPost,
  getPosts,
  updatePost,
} from "../controllers/post.controller.js";

const router = express.Router();

router.get("/", getPosts);
router.get("/:id", getPost);
router.post("/", verifyToken, requireSeller, addPost);
router.put("/:id", verifyToken, requireSeller, requirePostOwner, updatePost);
router.delete("/:id", verifyToken, requireSeller, requirePostOwner, deletePost);

export default router;
