import dotenv from 'dotenv';

const envFile = process.env.NODE_ENV === 'production' ? '.env' : '.env.dev';

dotenv.config({
    path: envFile,
});