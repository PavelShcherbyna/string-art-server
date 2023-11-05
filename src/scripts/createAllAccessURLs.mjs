import mongoose, { Schema } from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import fs from 'fs/promises';

dotenv.config();

const DB_CONNECTION = process.env.MONGO_URI;
const baseURL = 'http://localhost:3000/';
const fileName = 'access_links.txt';
const filePath = `./files/${fileName}`;

async function getURLsWithHashedUsersIds() {
  try {
    const db = await mongoose.createConnection(DB_CONNECTION);
    const Users = db.model('Users', new Schema({}), 'Users');

    const usersIds = await Users.find({}, { _id: 1 });

    return await Promise.all(
      usersIds.map(
        async (user) => `${baseURL}?id=${await bcrypt.hash(user._id?.toString(), 8)}`
      )
    );
  } catch (e) {
    console.log(e);
  }
}

async function writeLinksIntoTheFile(linksArr) {
  try {
    await fs.writeFile(filePath, linksArr.join(',\n'));
  } catch (e) {
    console.log(e);
  }
}

const urlsWithHashedIds = await getURLsWithHashedUsersIds();

await writeLinksIntoTheFile(urlsWithHashedIds);

console.log(`Done! You can find your links here: ${filePath}`);
process.exit();
