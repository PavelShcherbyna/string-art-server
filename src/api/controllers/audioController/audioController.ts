import fs from 'fs';
import { RequestHandler } from 'express';
import path from 'path';
import { AppError } from '../../../utils/appError';

const root = path.normalize(__dirname + '/../../../..');

function createAudioFilePath(fileName: string): string {
  return path.join(root, 'public', 'audio', fileName);
}

const songs = [
  {
    name: 'Calm long song',
    fileName: 'calm-long-song.mp3'
  },
  {
    name: 'Once in Paris',
    fileName: 'once-in-paris.mp3'
  }
];

export const getSongsList: RequestHandler = async (req, res, next) => {
  try {
    return res.status(200).json({
      status: 'success',
      songsList: songs
    });
  } catch (error) {
    next(error);
  }
};

export const getAudio: RequestHandler = async (req, res, next) => {
  try {
    const { fileName } = req.params;

    const audioFilePath = createAudioFilePath(fileName);

    const stat = fs.statSync(audioFilePath);

    const range = req.headers.range;
    let readStream;

    if (range !== undefined) {
      // remove 'bytes=' and split the string by '-'
      const parts = range.replace(/bytes=/, '').split('-');

      const partial_start = parts[0];
      const partial_end = parts[1];

      if (
        (isNaN(Number(partial_start)) && partial_start.length > 1) ||
        (isNaN(Number(partial_end)) && partial_end.length > 1)
      ) {
        return next(new AppError('Some problem with audio file', 500));
      }
      // convert string to integer (start)
      const start = parseInt(partial_start, 10);
      // convert string to integer (end)
      // if partial_end doesn't exist, end equals whole file size - 1
      const end = partial_end ? parseInt(partial_end, 10) : stat.size - 1;
      // content length
      const content_length = end - start + 1;

      res.status(206).header({
        'Content-Type': 'audio/mpeg',
        'Content-Length': content_length,
        'Content-Range': 'bytes ' + start + '-' + end + '/' + stat.size
      });

      // Read the stream of starting & ending part
      readStream = fs.createReadStream(audioFilePath, { start: start, end: end });
    } else {
      res.header({
        'Content-Type': 'audio/mpeg',
        'Content-Length': stat.size
      });
      readStream = fs.createReadStream(audioFilePath);
    }
    readStream.pipe(res);
  } catch (error) {
    next(error);
  }
};
