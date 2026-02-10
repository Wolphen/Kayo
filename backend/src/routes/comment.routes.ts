import {Router} from "express";
import {createComment, deleteComment, getCommentsByPostId, getLastCommentByPostId} from "../controllers/comment.controller";

const router = Router()

router.get("/:postId/last", getLastCommentByPostId);
router.get("/:postId", getCommentsByPostId);
router.post("/", createComment);
router.delete("/:commentId", deleteComment);

export default router;