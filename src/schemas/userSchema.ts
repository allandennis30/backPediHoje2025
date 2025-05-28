import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';

const userSchema = z.object({
    name: z.string().min(1, 'Nome é obrigatório'),
    email: z.string().email('Email inválido'),
    password: z.string().min(6, 'Senha deve ter no mínimo 6 caracteres')
});

export function validateUser(req: Request, res: Response, next: NextFunction): void {
    try {
        userSchema.parse(req.body);
        next();
    } catch (error) {
        if (error instanceof z.ZodError) {
            res.status(400).json({
                error: 'Erro de validação',
                issues: error.errors
            });
        } else {
            res.status(500).json({ error: 'Erro interno de validação' });
        }
    }
}