import { LoginController } from '../controllers/login.controller';
import User from '../models/user';
import { database } from '../utils/checkDbAndExecute';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

jest.mock('../models/user');
jest.mock('../utils/checkDbAndExecute');
jest.mock('jsonwebtoken');
jest.mock('bcrypt');

describe('LoginController', () => {
  let req: any;
  let res: any;
  let controller: LoginController;

  beforeEach(() => {
    controller = new LoginController();
    req = { body: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  describe('login', () => {
    it('deve retornar 400 se email ou senha não fornecidos', async () => {
      req.body = {};
      await controller.login(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        status: 400,
        message: 'Email e senha são obrigatórios',
      });
    });

    it('deve retornar 401 se usuário não encontrado', async () => {
      req.body = { email: 'test@example.com', password: '123456' };
      (database as jest.Mock).mockImplementation(async (fn) => {
        const user = null;
        (User.findOne as jest.Mock).mockResolvedValue(user);
        return fn();
      });
      await controller.login(req, res);
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        status: 401,
        message: 'Usuário não encontrado',
      });
    });

    it('deve retornar 401 se senha incorreta', async () => {
      req.body = { email: 'test@example.com', password: '123456' };
      const user = { password: 'hashed_password' };
      (database as jest.Mock).mockImplementation(async (fn) => {
        (User.findOne as jest.Mock).mockResolvedValue(user);
        (bcrypt.compareSync as jest.Mock).mockReturnValue(false);
        return fn();
      });
      await controller.login(req, res);
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        status: 401,
        message: 'Senha incorreta',
      });
    });

    it('deve retornar 200 com token ao logar com sucesso', async () => {
      req.body = { email: 'test@example.com', password: '123456' };
      const user = { id: '123', password: 'hashed_password' };
      (database as jest.Mock).mockImplementation(async (fn) => {
        (User.findOne as jest.Mock).mockResolvedValue(user);
        (bcrypt.compareSync as jest.Mock).mockReturnValue(true);
        (jwt.sign as jest.Mock).mockReturnValue('token123');
        (User.updateOne as jest.Mock).mockResolvedValue({});
        return fn();
      });
      await controller.login(req, res);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        status: 200,
        message: 'Login realizado com sucesso',
        token: 'token123',
      });
    });

    it('deve retornar 500 em erro inesperado', async () => {
      req.body = { email: 'test@example.com', password: '123456' };
      (database as jest.Mock).mockRejectedValue(new Error('Erro DB'));
      await controller.login(req, res);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        status: 500,
        message: 'Erro ao criar usuário',
      });
    });
  });

  describe('logout', () => {
    it('deve retornar 400 se token não fornecido', async () => {
      req.body = {};
      await controller.logout(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        status: 400,
        message: 'Token é obrigatório',
      });
    });

    it('deve retornar 401 se usuário não encontrado pelo token', async () => {
      req.body = { token: 'token123' };
      (database as jest.Mock).mockImplementation(async (fn) => {
        (User.findOne as jest.Mock).mockResolvedValue(null);
        return fn();
      });
      await controller.logout(req, res);
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        status: 401,
        message: 'Usuário não encontrado',
      });
    });

    it('deve retornar 200 ao deslogar com sucesso', async () => {
      req.body = { token: 'token123' };
      const user = { id: '123' };
      (database as jest.Mock).mockImplementation(async (fn) => {
        (User.findOne as jest.Mock).mockResolvedValue(user);
        (User.updateOne as jest.Mock).mockResolvedValue({});
        return fn();
      });
      await controller.logout(req, res);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        status: 200,
        message: 'Logout realizado com sucesso',
      });
    });

    it('deve retornar 500 em erro inesperado', async () => {
      req.body = { token: 'token123' };
      (database as jest.Mock).mockRejectedValue(new Error('Erro DB'));
      await controller.logout(req, res);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        status: 500,
        message: 'Erro ao realizar logout',
      });
    });
  });
});