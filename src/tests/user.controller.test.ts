import { UserController } from '../controllers/user.controller';
import User from '../models/user';
import { database } from '../utils/checkDbAndExecute';

jest.mock('../models/user');
jest.mock('../utils/checkDbAndExecute');

describe('UserController', () => {
  let req: any;
  let res: any;
  let controller: UserController;

  beforeEach(() => {
    controller = new UserController();
    req = { body: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  describe('create', () => {
    it('deve criar usuário com sucesso', async () => {
      const fakeUser = { id: '123', name: 'Teste' };
      (database as jest.Mock).mockImplementation(async (fn) => fn());
      (User.create as jest.Mock).mockResolvedValue(fakeUser);

      await controller.create(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        status: 201,
        message: 'Usuário criado com sucesso',
        user: fakeUser,
      });
    });

    it('deve retornar erro ao criar usuário', async () => {
      const error = new Error('Falha no banco');
      (database as jest.Mock).mockRejectedValue(error);

      await controller.create(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        status: 500,
        message: 'Erro ao criar usuário',
        error: error.message,
      });
    });
  });

  describe('getAll', () => {
    it('deve retornar todos os usuários com sucesso', async () => {
      const users = [{ id: '1' }, { id: '2' }];
      (database as jest.Mock).mockImplementation(async (fn) => fn());
      (User.find as jest.Mock).mockResolvedValue(users);

      await controller.getAll(req, res);

      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          status: 200,
          message: 'ok',
          users,
          timestamp: expect.any(String),
        }),
      );
    });

    it('deve retornar erro ao buscar usuários', async () => {
      const error = new Error('Falha no banco');
      (database as jest.Mock).mockRejectedValue(error);

      await controller.getAll(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        status: 500,
        message: 'Erro ao buscar usuários',
        error: error.message,
      });
    });
  });
});