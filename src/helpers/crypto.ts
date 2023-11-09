import crypto from 'crypto';
import dotenv from 'dotenv';
import {IAccessKey} from "../models/AccessKeys";

dotenv.config();

const algorithm = 'aes-256-cbc';
const secretKey = process.env.ACCESS_KEY_SECRET || '';

const key = Buffer.from(secretKey, 'utf-8');

export const encrypt = (text: string): IAccessKey => {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(algorithm, Buffer.from(key), iv);
  const encrypted = Buffer.concat([cipher.update(text), cipher.final()]);
  return { iv: iv.toString('hex'), encryptedData: encrypted.toString('hex') };
};

export const decrypt = (obj: IAccessKey): string => {
  const iv = Buffer.from(obj.iv, 'hex');
  const encryptedText = Buffer.from(obj.encryptedData, 'hex');
  const decipher = crypto.createDecipheriv(algorithm, Buffer.from(key), iv);
  const decrypted = Buffer.concat([decipher.update(encryptedText), decipher.final()]);
  return decrypted.toString();
};
