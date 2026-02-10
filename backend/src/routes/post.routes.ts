import { Router } from "express";
import { getPost, getPosts, togglePostLike, createPost } from "../controllers/post.controller";
import { authMiddleware } from "../middleware/auth.middleware";

const router = Router();

router.get("/", getPosts);
router.post("/", authMiddleware, createPost);
router.get("/:id", getPost);
router.put("/:id/like", togglePostLike);

export default router;
