import {Router} from "express";
import {createComment, getCommentsByPostId} from "../controllers/comment.controller";

const router = Router()

router.get("/:postId", getCommentsByPostId);
router.post("/", createComment);

export default router;