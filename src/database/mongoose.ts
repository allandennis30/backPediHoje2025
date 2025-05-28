import mongoose from 'mongoose';
import { config } from './config';

export async function connectToDatabase() {
  try {
    await mongoose.connect(config.url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    } as mongoose.ConnectOptions);

    console.log('✅ Conectado ao banco de dados com sucesso!');
  } catch (error) {
    console.error('❌ Erro ao conectar ao MongoDB:', error);
    process.exit(1);
  }
}