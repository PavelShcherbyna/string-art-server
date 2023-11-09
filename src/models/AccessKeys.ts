import { Schema } from 'mongoose';
import db from '../db/index';

export interface IAccessKey {
  iv: string;
  encryptedData: string;
}

export const AccessKeysSchema = new Schema<IAccessKey>(
  {
    iv: {
      type: String,
      required: true
    },
    encryptedData: {
      type: String,
      required: true
    }
  },
  {
    versionKey: false
  }
);

const AccessKeys = db.model('AccessKeys', AccessKeysSchema, 'AccessKeys');

export default AccessKeys;
