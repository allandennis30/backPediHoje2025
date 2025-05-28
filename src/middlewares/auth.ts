import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export function authenticate(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization;
    const token = authHeader?.split(' ')[1];

    if (!token) return res.status(401).json({ error: 'Token não fornecido' });

    try {
        const secret = process.env.JWT_SECRET as string;
        const decoded = jwt.verify(token, secret);

        req.user = decoded;

        next();
    } catch (err) {
        return res.status(401).json({ error: 'Token inválido' })
    }
}