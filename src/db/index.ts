import { createConnection, Connection } from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const db: Connection = createConnection(process.env.MONGO_URI || '');

export default db;
