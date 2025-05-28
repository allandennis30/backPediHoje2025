import mongoose from 'mongoose';

export async function database<T>(fn: () => Promise<T>): Promise<T> {
    const state = mongoose.connection.readyState;

    if (state !== 1) {
        throw new Error('Banco de dados não conectado');
    }

    return await fn();
}