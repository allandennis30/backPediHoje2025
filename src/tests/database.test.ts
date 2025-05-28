import mongoose from 'mongoose';
import { connectToDatabase } from '../database/mongoose';

describe('Teste da conexão com MongoDB', () => {
  it('deve conectar ao MongoDB sem lançar erro', async () => {
    await expect(connectToDatabase()).resolves.not.toThrow();
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });
});