import { Request, Response } from "express";
import prisma from "../config/prisma";
import crypto from "crypto";
import bcrypt from "bcrypt";

export const createApiKey = async (req: Request, res: Response): Promise<void> => {
    try {
        const { userId } = req.params;

        const hashedPassword = await bcrypt.hash(req.body.password, 10);

        const user = await prisma.user.findUnique({
            where: { id: Number(userId) }
        });

        if (!user) {
            res.status(404).json({ error: "L'utilisateur n'existe pas" });
            return;
        }

        if (user.password !== hashedPassword) {
            res.status(401).json({ error: "Mot de passe incorrect" });
            return;
        }

        // création de la clé API

        const apiKey = crypto.randomBytes(32).toString('hex');

        const newApiKey = await prisma.apiKey.create({
            data: {
                userId: Number(userId),
                apiKey: apiKey,
                expiresAt: new Date(Date.now() + 3600000 * 24), // 1 jour
            },
        });

        res.json(newApiKey);

    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
}