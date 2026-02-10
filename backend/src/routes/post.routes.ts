import { Router } from "express";
import { getPosts, togglePostLike } from "../controllers/post.controller";

const router = Router();

router.get("/", getPosts);
router.put("/:id/like", togglePostLike);

export default router;
