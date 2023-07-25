import { NextApiRequest, NextApiResponse } from 'next';
import axios, { AxiosResponse } from 'axios';
import { Readable } from 'stream';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const text = req.body.text as string;
  const apiURL = 'https://api.elevenlabs.io/v1/text-to-speech/21m00Tcm4TlvDq8ikWAM/stream';

  const headers = {
    "Accept": "audio/mpeg",
    "Content-Type": "application/json",
    "xi-api-key": "655568d6c24d8fb6e9d3834712a0504c"
  };

  const data = {
    "text": text,
    "model_id": "eleven_monolingual_v1",
    "voice_settings": {
      "stability": 0.5,
      "similarity_boost": 0.5
    }
  };

  try {
    const apiRes: AxiosResponse<Readable> = await axios.post(apiURL, data, { headers, responseType: 'stream' });
    res.setHeader('Content-Type', 'audio/mpeg');
    apiRes.data.pipe(res);
  } catch (err: any) {
    console.error("Error");
    res.status(err.response?.status || 500).json({ error: 'An error occurred while processing the request.' });
  }
};
