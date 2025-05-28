import mongoose from 'mongoose';
import { connectToDatabase } from '../database/mongoose';
import { config } from '../database/config';

jest.mock('mongoose');
jest.mock('../database/config', () => ({
  config: { url: 'mongodb://fakeurl' }
}));

describe('connectToDatabase', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('deve conectar com sucesso e logar mensagem', async () => {
    (mongoose.connect as jest.Mock).mockResolvedValueOnce({});

    const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation(() => {});

    await connectToDatabase();

    expect(mongoose.connect).toHaveBeenCalledWith(
      config.url,
      expect.objectContaining({
        useNewUrlParser: true,
        useUnifiedTopology: true,
      })
    );

    expect(consoleLogSpy).toHaveBeenCalledWith('✅ Conectado ao banco de dados com sucesso!');

    consoleLogSpy.mockRestore();
  });

  it('deve logar erro e sair do processo ao falhar conexão', async () => {
    const fakeError = new Error('Falha na conexão');
    (mongoose.connect as jest.Mock).mockRejectedValueOnce(fakeError);

    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    const processExitSpy = jest.spyOn(process, 'exit').mockImplementation(((code?: number) => {
      throw new Error('process.exit: ' + code);
    }) as any);

    await expect(connectToDatabase()).rejects.toThrow('process.exit: 1');

    expect(consoleErrorSpy).toHaveBeenCalledWith('❌ Erro ao conectar ao MongoDB:', fakeError);
    expect(processExitSpy).toHaveBeenCalledWith(1);

    consoleErrorSpy.mockRestore();
    processExitSpy.mockRestore();
  });
});