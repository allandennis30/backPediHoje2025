import { Request, Response } from 'express';
import { database } from '../utils/checkDbAndExecute';
import User from '../models/user';
import jwt from 'jsonwebtoken';
import { isAdmin } from '../middlewares/isAdmin';
const bcrypt = require('bcrypt');

export class LoginController {
    async login(req: Request, res: Response) {
        try {
            const { email, password } = req.body;

            if (!email || !password) {
                res.status(400).json({
                    status: 400,
                    message: 'Email e senha são obrigatórios'
                });

                return undefined;
            }

            await database(async () => {
                const user = await User.findOne({ email });

                if (!user) {
                    res.status(401).json({
                        status: 401,
                        message: 'Usuário não encontrado'
                    });

                    return undefined;
                } else if (!bcrypt.compareSync(password, user.password)) {
                    res.status(401).json({
                        status: 401,
                        message: 'Senha incorreta'
                    });

                    return undefined;
                }

                const token = jwt.sign(
                    { id: user.id },
                    process.env.JWT_SECRET as string
                );

                res.status(200).json({
                    status: 200,
                    message: 'Login realizado com sucesso',
                    token
                });

                await User.updateOne({ _id: user.id }, { $set: { isLogged: true, lastLogin: new Date(), token } });

                return undefined;
            });
        } catch (error) {
            res.status(500).json({
                status: 500,
                message: 'Erro ao criar usuário'
            });
        }
    }

    async logout(req: Request, res: Response) {
        try {
            const { token } = req.body;

            if (!token) {
                res.status(400).json({
                    status: 400,
                    message: 'Token é obrigatório'
                });

                return undefined;
            }

            await database(async () => {
                const user = await User.findOne({ token: token });

                if (!user) {
                    res.status(401).json({
                        status: 401,
                        message: 'Usuário não encontrado'
                    });

                    return undefined;
                }

                await User.updateOne({ _id: user.id }, { $set: { isLogged: false, token: null } });

                res.status(200).json({
                    status: 200,
                    message: 'Logout realizado com sucesso'
                });

                return undefined;
            });
        } catch (error) {
            res.status(500).json({
                status: 500,
                message: 'Erro ao realizar logout'
            });
        }
    }
}