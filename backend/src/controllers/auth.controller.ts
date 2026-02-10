import { Request, Response } from "express";
import { AuthService } from "../services/auth.service";

const service = new AuthService();

export const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body as {
            email?: string;
            password?: string;
        };
        const result = await service.login(email ?? "", password ?? "");
        res.json(result);
    } catch (error) {
        res.status(401).json({ message: (error as Error).message });
    }
};
