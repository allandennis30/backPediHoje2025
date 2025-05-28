import { isAdmin } from '../middlewares/isAdmin';
import jwt from 'jsonwebtoken';
import User from '../models/user';

jest.mock('jsonwebtoken');
jest.mock('../models/user');

describe('isAdmin middleware', () => {
  let req: any;
  let res: any;
  let next: jest.Mock;

  beforeEach(() => {
    req = { headers: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();
  });

  it('deve responder 401 se não tiver header de autorização', async () => {
    await isAdmin(req, res, next);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: 'Token não fornecido' });
    expect(next).not.toHaveBeenCalled();
  });

  it('deve responder 401 se o token não estiver presente no header', async () => {
    req.headers.authorization = 'Bearer';
    await isAdmin(req, res, next);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: 'Token inválido' });
    expect(next).not.toHaveBeenCalled();
  });

  it('deve responder 401 se o token for inválido', async () => {
    req.headers.authorization = 'Bearer tokenInvalido';
    (jwt.verify as jest.Mock).mockImplementation(() => { throw new Error('Invalid token') });
    await isAdmin(req, res, next);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: 'Token inválido ou expirado' });
    expect(next).not.toHaveBeenCalled();
  });

  it('deve responder 403 se o usuário não for admin', async () => {
    req.headers.authorization = 'Bearer tokenValido';
    (jwt.verify as jest.Mock).mockReturnValue({ id: '123' });
    (User.findById as jest.Mock).mockResolvedValue({ isAdmin: false });
    await isAdmin(req, res, next);
    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({ message: 'Acesso negado: admin apenas' });
    expect(next).not.toHaveBeenCalled();
  });

  it('deve chamar next() se o usuário for admin', async () => {
    req.headers.authorization = 'Bearer tokenValido';
    (jwt.verify as jest.Mock).mockReturnValue({ id: '123' });
    (User.findById as jest.Mock).mockResolvedValue({ isAdmin: true });
    await isAdmin(req, res, next);
    expect(next).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
  });
});