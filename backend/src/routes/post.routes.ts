import { Router } from "express";
import { createPost, getPosts, togglePostLike } from "../controllers/post.controller";
import { authMiddleware } from "../middleware/auth.middleware";

const router = Router();

router.get("/", getPosts);
router.post("/", authMiddleware, createPost);
router.put("/:id/like", togglePostLike);

export default router;
