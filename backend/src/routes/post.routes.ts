import { Router } from "express";
import { getPost, getPosts, togglePostLike } from "../controllers/post.controller";

const router = Router();

router.get("/", getPosts);
router.get("/:id", getPost);
router.put("/:id/like", togglePostLike);

export default router;
