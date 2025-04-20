import { Request, Response } from 'express';
import prisma from "../config/prisma";
import * as fs from "node:fs";
import {getUserByApiKey} from "../middlewares/auth";
import path from "path";
import multer from "multer";


export const createFile = async (req: Request, res: Response): Promise<void> => {
    try {
        const user = await getUserByApiKey(req);
        if (!user) {
            res.status(401).json({ error: "Vous n'êtes pas connecté" });
            return;
        }

        // Extract username from email (part before @)
        const emailParts = user.email.split('@');
        if (emailParts.length < 2) {
            res.status(400).json({ error: "Format d'email invalide" });
            return;
        }
        const username = emailParts[0];

        // Create user-specific upload directory
        const userUploadDir = path.join(__dirname, '../../public', username);
        if (!fs.existsSync(userUploadDir)) {
            fs.mkdirSync(userUploadDir, { recursive: true });
        }

        // Configure multer storage with user-specific path
        const storage = multer.diskStorage({
            destination: (req, file, cb) => {
                cb(null, userUploadDir);
            },
            filename: (req, file, cb) => {
                // Create unique filename with original extension
                const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
                const fileExt = path.extname(file.originalname);
                cb(null, uniqueSuffix + fileExt);
            }
        });

        // Define file filter for allowed types
        const fileFilter = (req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
            const allowedMimeTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/svg+xml', 'image/gif', 'application/x-7z-compressed'];

            if (allowedMimeTypes.includes(file.mimetype)) {
                cb(null, true);
            } else {
                cb(new Error("Le type de fichier n'est pas autorisé"));
            }
        };

        // Set up multer with configuration
        const upload = multer({
            storage: storage,
            limits: {
                fileSize: 10 * 1024 * 1024 // 10 MB
            },
            fileFilter: fileFilter
        }).single('file'); // 'file' is the field name in the form

        // Process the upload
        upload(req, res, async (err) => {
            if (err instanceof multer.MulterError) {
                // A Multer error occurred when uploading
                if (err.code === 'LIMIT_FILE_SIZE') {
                    res.status(400).json({ error: "La taille du fichier est trop importante" });
                } else {
                    res.status(400).json({ error: err.message });
                }
                return;
            } else if (err) {
                // An unknown error occurred
                res.status(400).json({ error: err.message });
                return;
            }

            // Check if file was uploaded
            if (!req.file) {
                res.status(400).json({ error: "Aucun fichier n'a été trouvé" });
                return;
            }

            try {
                // Create relative path for storage in database
                const relativePath = path.join(username, path.basename(req.file.path));

                // Create file record in database
                const newFile = await prisma.file.create({
                    data: {
                        name: req.file.originalname,
                        path: relativePath,
                        size: req.file.size,
                        mime_type: req.file.mimetype,
                        userId: user.id
                    }
                });

                res.status(201).json({
                    message: "Fichier téléchargé avec succès",
                    file: newFile
                });
            } catch (error) {
                console.error('Database error:', error);
                if (req.file && req.file.path) {
                    fs.unlinkSync(req.file.path);
                }
                res.status(500).json({ error: "Erreur lors de l'enregistrement du fichier" });
            }
        });
    } catch (error) {
        console.error('Server error:', error);
        res.status(500).json({ error: "Erreur interne du serveur" });
    }
};

export const getAllFilesUrl = async (req: Request, res: Response): Promise<void> => {
    try {
        const { userId } = req.params;

        const files = await prisma.file.findMany({
            where: { userId: parseInt(userId)}
        })

        if (!files || files.length === 0) {
            res.status(404).json({ error: "Aucun fichier n'a été trouvé" });
            return;
        }

        res.json({quantity: files.length, files: files});
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
}


export const getFileById = async (req: Request, res: Response): Promise<void> => {
    const { fileId } = req.params;
    const user = await getUserByApiKey(req);

    if (!user) {
        res.status(401).json({ error: "Vous n'êtes pas connecté" });
        return;
    }

    try {
        const file = await prisma.file.findUnique({
            where: { id: parseInt(fileId), userId: user.id }
        });

        if (!file) {
            res.status(404).json({ error: "Le fichier n'a pas été trouvé" });
            return;
        }

        res.json(file);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
}

export const downloadFile = async (req: Request, res: Response): Promise<void> => {
    const { fileId } = req.params;
    const user = await getUserByApiKey(req);

    if (!user) {
        res.status(401).json({ error: "Vous n'êtes pas connecté" });
        return;
    }

    try {
        const file = await prisma.file.findUnique({
            where: { id: parseInt(fileId), userId: user.id }
        });

        if (!file) {
            res.status(404).json({ error: "Le fichier n'a pas été trouvé" });
            return;
        }

        const tmp_path = path.join(__dirname, '../../public', file.path);


        if (!fs.existsSync(tmp_path)) {
            res.status(404).json({ error: "Le fichier physique n'existe pas sur le serveur" });
            return;
        }

        res.download(file.path, file.name, (err) => {
            if (err) {
                if (!res.headersSent) {
                    res.status(500).json({ error: "Erreur lors du téléchargement du fichier" });
                }
            }
        });

    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
}


export const deleteFile = async (req: Request, res: Response): Promise<void> => {
    const { fileId } = req.params;
    const user = await getUserByApiKey(req);

    if (!user) {
        res.status(401).json({ error: "Vous n'êtes pas connecté" });
        return;
    }

    try {
        const file = await prisma.file.findUnique({
            where: { id: parseInt(fileId), userId: user.id }
        });


        if (!file) {
            res.status(404).json({ error: "Le fichier n'a pas été trouvé" });
            return;
        }

        try {
            await fs.unlink(file.path, () => {
                console.log(`Le fichier ${file.name} a été supprimé avec succès`);
            });

            await prisma.file.delete({
                where: { id: parseInt(fileId), userId: user.id },
            });

            res.status(204).send();
        } catch (fileError) {
            console.error(`Erreur lors de la suppression du fichier physique: ${file.path}`, fileError);
            res.status(500).json({ error: "Impossible de supprimer le fichier physique" });
        }
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};