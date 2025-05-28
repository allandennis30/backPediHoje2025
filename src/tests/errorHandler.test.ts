import { errorHandler } from '../middlewares/errorHandler';

describe('errorHandler middleware', () => {
  let req: any;
  let res: any;
  let next: jest.Mock;
  let consoleErrorSpy: jest.SpyInstance;

  beforeEach(() => {
    req = {};
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    consoleErrorSpy.mockRestore();
    delete process.env.NODE_ENV;
  });

  it('deve logar err.stack se existir', () => {
    const err = { stack: 'stacktrace', status: 400, message: 'erro teste' };
    errorHandler(err, req, res, next);
    expect(consoleErrorSpy).toHaveBeenCalledWith('stacktrace');
  });

  it('deve logar err se não existir stack', () => {
    const err = { status: 400, message: 'erro teste' };
    errorHandler(err, req, res, next);
    expect(consoleErrorSpy).toHaveBeenCalledWith(err);
  });

  it('deve usar status do erro se existir', () => {
    const err = { status: 400, message: 'erro teste' };
    errorHandler(err, req, res, next);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  it('deve usar status 500 se err.status não existir', () => {
    const err = { message: 'erro teste' };
    errorHandler(err, req, res, next);
    expect(res.status).toHaveBeenCalledWith(500);
  });

  it('deve enviar mensagem genérica em produção', () => {
    process.env.NODE_ENV = 'production';
    const err = { status: 400, message: 'erro teste' };
    errorHandler(err, req, res, next);
    expect(res.json).toHaveBeenCalledWith({
      status: 'error',
      message: 'Internal Server Error',
    });
  });

  it('deve enviar mensagem do erro fora de produção', () => {
    const err = { status: 400, message: 'erro teste' };
    errorHandler(err, req, res, next);
    expect(res.json).toHaveBeenCalledWith({
      status: 'error',
      message: 'erro teste',
    });
  });

  it('deve enviar mensagem Unknown error se err.message não existir', () => {
    const err = { status: 400 };
    errorHandler(err, req, res, next);
    expect(res.json).toHaveBeenCalledWith({
      status: 'error',
      message: 'Unknown error',
    });
  });
});