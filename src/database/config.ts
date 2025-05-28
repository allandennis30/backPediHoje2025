import dotenv from 'dotenv';
dotenv.config();

const dbUser = process.env.DB_USER;
const dbPassword = process.env.DB_PASS;

export const config = {
  url: `mongodb+srv://${dbUser}:${dbPassword}@clusterapirest.bmwru37.mongodb.net/`,
};