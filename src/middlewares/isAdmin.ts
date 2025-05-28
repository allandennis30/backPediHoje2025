import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/user';

export async function isAdmin(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            res.status(401).json({ message: 'Token não fornecido' });
            return;
        }

        const token = authHeader.split(' ')[1];
        if (!token) {
            res.status(401).json({ message: 'Token inválido' });
            return;
        }

        const secret = process.env.JWT_SECRET!;
        const decoded = jwt.verify(token, secret) as { id: string };
        const user = await User.findById(decoded.id);

        if (!user || !user.isAdmin) {
            res.status(403).json({ message: 'Acesso negado: admin apenas' });
            return;
        }

        next();
    } catch (error) {
        res.status(401).json({ message: 'Token inválido ou expirado' });
    }
}