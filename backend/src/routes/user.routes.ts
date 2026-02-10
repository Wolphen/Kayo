import { Router } from "express";
import {
    getUsers,
    getUser,
    createUser,
    followUser,
    unfollowUser,
    updateUser,
} from "../controllers/user.controller";

const router = Router();

router.get("/", getUsers);
router.get("/:id", getUser);
router.post("/", createUser);
router.patch("/:id", updateUser);
router.post("/:id/follow", followUser);
router.post("/:id/unfollow", unfollowUser);

export default router;
