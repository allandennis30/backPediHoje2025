import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'

dotenv.config()

const adminId = '67adf702c5f40f9051b26526'

const secret = process.env.JWT_SECRET;

if (!secret) {
    console.error('JWT_SECRET is not defined');
    process.exit(1);
}

const token = jwt.sign({ id: adminId }, secret, {
  expiresIn: '1d',
})

console.log('TOKEN DE TESTE ADMIN:')
console.log(token)