import mongoose from 'mongoose';
import { database } from '../utils/checkDbAndExecute';

describe('database util', () => {
  beforeEach(() => {
    Object.defineProperty(mongoose, 'connection', {
      configurable: true,
      writable: true,
      value: {
        readyState: 0,
      },
    });
  });

  it('deve lançar erro se o banco não estiver conectado', async () => {
    (mongoose.connection as any) = { readyState: 0 };

    await expect(database(async () => 'teste')).rejects.toThrow('Banco de dados não conectado');
  });

  it('deve executar a função passada e retornar resultado se conectado', async () => {
    (mongoose.connection as any) = { readyState: 1 };
    const fn = jest.fn().mockResolvedValue('resultado');

    const result = await database(fn);
    expect(fn).toHaveBeenCalled();
    expect(result).toBe('resultado');
  });
});