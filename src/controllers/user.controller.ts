import { Request, Response } from 'express';
import User from '../models/user';
import { database } from '../utils/checkDbAndExecute';

export class UserController {
  async create(req: Request, res: Response) {
    try {
      const user = await database(() => User.create(req.body));
      res.status(201).json({
        status: 201,
        message: 'Usuário criado com sucesso',
        user,
      });
    } catch (error) {
      res.status(500).json({
        status: 500,
        message: 'Erro ao criar usuário',
        error: error instanceof Error ? error.message : 'Erro desconhecido',
      });
    }
  }

  async getAll(req: Request, res: Response) {
    try {
      const users = await database(() => User.find());

      res.json({
        status: 200,
        message: 'ok',
        users,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      res.status(500).json({
        status: 500,
        message: 'Erro ao buscar usuários',
        error: error instanceof Error ? error.message : 'Erro desconhecido',
      });
    }
  }
}