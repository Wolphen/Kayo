import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

const getJwtSecret = () => {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
        throw new Error("JWT_SECRET is not set");
    }
    return secret;
};

export type AuthRequest = Request & {
    user?: {
        sub: string;
        email: string;
        isAdmin?: boolean;
    };
};

export const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction) => {
    const header = req.headers.authorization;

    if (!header || !header.startsWith("Bearer ")) {
        return res.status(401).json({ message: "Missing token" });
    }

    const token = header.slice("Bearer ".length).trim();

    try {
        const payload = jwt.verify(token, getJwtSecret()) as AuthRequest["user"];
        req.user = payload;
        return next();
    } catch (error) {
        const message =
            (error as Error).message === "JWT_SECRET is not set"
                ? "Auth misconfigured"
                : "Invalid token";
        const status = message === "Auth misconfigured" ? 500 : 401;
        return res.status(status).json({ message });
    }
};
