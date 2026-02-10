import { Router } from "express";
import {
    getUsers,
    getUser,
    createUser,
    followUser,
    unfollowUser,
    updateUser,
} from "../controllers/user.controller";
import { authMiddleware } from "../middleware/auth.middleware";

const router = Router();

router.get("/", authMiddleware, getUsers);
router.get("/:id", authMiddleware, getUser);
router.post("/", createUser);
router.patch("/:id", updateUser);
router.post("/:id/follow", followUser);
router.post("/:id/unfollow", unfollowUser);

export default router;
