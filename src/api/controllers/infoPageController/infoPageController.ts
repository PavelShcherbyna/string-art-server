import fs from 'fs';
import { RequestHandler } from 'express';
import path from 'path';
import util from 'util';

const root = path.normalize(__dirname + '/../../../..');
const photoBaseFolderPath = path.join(root, 'public', 'photo', 'infoPageCarousel');

interface PhotoCollection {
  [index: string]: string[];
}

export const getInfoPagePhotoList: RequestHandler = async (req, res, next) => {
  try {
    const imageFolders = ['lvl1', 'lvl2', 'lvl3'];

    const readdir = util.promisify(fs.readdir);

    let photoCollection: PhotoCollection = {};

    for (const folderName of imageFolders) {
      const folderPath = path.join(photoBaseFolderPath, folderName);

      const fileNames = await readdir(folderPath);
      const staticPath = path.join('photo', 'infoPageCarousel', folderName);

      photoCollection[folderName] = fileNames.map(
        (fileName) => `${staticPath}/${fileName}`
      );
    }

    return res.status(200).json({
      status: 'success',
      photos: photoCollection
    });
  } catch (error) {
    next(error);
  }
};
