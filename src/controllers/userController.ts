import { Request, Response } from 'express';
import prisma from '../config/prisma';
import bcrypt from "bcrypt";
import {getUserByApiKey} from "../middlewares/auth";

export const createUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, name, password } = req.body;

        const existingUser = await prisma.user.findUnique({
            where: { email: email }
        });

        if (existingUser) {
            res.status(400).json({ error: "Erreur lors de la création de l'utilisateur." });
            return;
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await prisma.user.create({
            data: {
                email,
                name,
                password: hashedPassword,
            },
        });

        const userResponse = {
            id: newUser.id,
            email: newUser.email,
            name: newUser.name,
            createdAt: newUser.createdAt,
            updatedAt: newUser.updatedAt
        };

        res.status(201).json(userResponse);
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
};

export const getUsers = async (_req: Request, res: Response): Promise<void> => {
    try {
        const users = await prisma.user.findMany({
            select: {
                id: true,
                email: true,
                name: true,
                createdAt: true,
                updatedAt: true,
                _count: {
                    select: {
                        ApiKeys: {
                            where: {
                                expiresAt: {
                                    gt: new Date()
                                }
                            }
                        },
                        files: true
                    }
                }
            },
        });

        res.json({
            users, numberOfUsers: users.length
        });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};


export const getUserByAPIKey = async (req: Request, res: Response): Promise<void> => {
    try {

        const user = await getUserByApiKey(req)

        if (!user) {
            res.status(404).json({ error: 'Utilisateur non trouvé' });
            return;
        }

        const aipKey = await prisma.apiKey.findMany({
            where: { userId: user.id },
            select: {
                apiKey: true,
                expiresAt: true,
            },
            orderBy: {
                expiresAt: 'asc'
            }
        });

        const files = await prisma.file.findMany({
            where: { userId: user.id },
            orderBy: {
                createdAt: 'asc'
            }
        });

        res.json({
            user: user,
            apiKey: aipKey,
            files: files
        });

    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};


export const updateUserByAPIKey = async (req: Request, res: Response): Promise<void> => {
    try {
        const user = await getUserByApiKey(req);

        if (!user) {
            res.status(401).json({ error: "Vous n'êtes pas connecté" });
            return;
        }

        const { name } = req.body;

        const updatedUser = await prisma.user.update({
            where: { id: user.id },
            data: {
                name,
            },
            select: {
                id: true,
                email: true,
                name: true,
                createdAt: true,
                updatedAt: true,
            },
        });

        res.json(updatedUser);
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
};