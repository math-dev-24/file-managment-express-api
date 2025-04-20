import {NextFunction, Request, Response} from "express";
import prisma from "../config/prisma";
import {User} from "@prisma/client";


export const verifyApiKey = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const apiKey = getApiKey(req);

        if (!apiKey) {
            res.status(401).json({ error: "Aucun API key n'a été fourni" });
            return;
        }

        const validApiKey = await prisma.apiKey.findFirst({
            where: {
                apiKey: apiKey,
                expiresAt: {
                    gt: new Date()
                }
            }
        });

        if (!validApiKey) {
            res.status(401).json({ error: "Aucun API key valide n'a été trouvé" });
            return;
        }

        next();

    } catch (error: any) {
        res.status(500).json({ error: "Erreur lors de la vérification de l'API key" });
    }
}

export const getApiKey = (req: Request): string | null => {
    const apiKey = req.headers['x-api-key'];


    if (!apiKey) {
        return null;
    }

    return apiKey as string;

}

export const getUserByApiKey = async (req: Request): Promise<User | null> => {
    const apiKey = getApiKey(req);

    if (!apiKey) {
        return null;
    }

    const apiKeyRecord = await prisma.apiKey.findUnique({
        where: {
            apiKey: apiKey
        },
        include: {
            User: true
        }
    });

    if (!apiKeyRecord) {
        return null;
    }

    return apiKeyRecord.User;
}