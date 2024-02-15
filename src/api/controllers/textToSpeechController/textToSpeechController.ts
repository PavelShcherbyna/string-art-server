import { RequestHandler } from 'express';
import axios from 'axios';

interface LangCollection {
  [index: string]: string;
}

export const postTextToSpeech: RequestHandler = async (req, res, next) => {
  try {
    const text: string = req.body.text || '';
    const lang: string = req.body.lang || '';
    const apiKey: string = process.env.GOOGLE_TTS_API_KEY || '';

    const voiceNames: LangCollection = {
      'en-US': 'en-US-Standard-D',
      'ru-RU': 'ru-RU-Standard-D',
      'de-DE': 'de-DE-Standard-D',
      'it-IT': 'it-IT-Standard-C',
      'ro-RO': 'ro-RO-Standard-A'
    };

    const endpoint = `https://texttospeech.googleapis.com/v1beta1/text:synthesize?key=${apiKey}`;
    const payload = {
      audioConfig: {
        audioEncoding: 'MP3',
        pitch: 0,
        speakingRate: 1
      },
      input: {
        text: text
      },
      voice: {
        languageCode: lang,
        name: voiceNames[lang]
      }
    };

    const response = await axios.post(endpoint, payload);

    res.json(response.data);
  } catch (error) {
    next(error);
  }
};
