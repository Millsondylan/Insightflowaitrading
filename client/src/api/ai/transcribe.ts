import { NextApiRequest, NextApiResponse } from 'next';
import formidable from 'formidable';
import fs from 'fs';
import path from 'path';
import { createClient } from '@supabase/supabase-js';

export const config = {
  api: {
    bodyParser: false, // Disabling built-in bodyParser to use formidable
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  
  try {
    // Parse form with files
    const form = formidable({
      maxFiles: 1,
      maxFileSize: 10 * 1024 * 1024, // 10MB max
    });

    const [fields, files] = await new Promise<[formidable.Fields, formidable.Files]>((resolve, reject) => {
      form.parse(req, (err, fields, files) => {
        if (err) return reject(err);
        resolve([fields, files]);
      });
    });

    // Check for required fields
    if (!fields.sessionId) {
      return res.status(400).json({ error: 'Missing sessionId' });
    }

    // Get audio file
    const audioFile = files.audio ? files.audio[0] : null;
    if (!audioFile) {
      return res.status(400).json({ error: 'No audio file provided' });
    }

    // Authenticate the user from session
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Create a temporary file for the audio
    const audioPath = audioFile.filepath;
    
    // Read the file into a buffer and convert to Blob
    const audioBuffer = fs.readFileSync(audioPath);
    const audioBlob = new Blob([audioBuffer], { type: 'audio/wav' });
    
    // Send to OpenAI Whisper
    const formData = new FormData();
    formData.append('file', audioBlob, 'audio.wav');
    formData.append('model', 'whisper-1');
    formData.append('language', 'en');
    
    const response = await fetch('https://api.openai.com/v1/audio/transcriptions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: formData,
    });

    // Cleanup temp file
    fs.unlinkSync(audioPath);

    if (!response.ok) {
      const error = await response.json();
      console.error('Whisper API Error:', error);
      return res.status(500).json({ error: 'Transcription failed' });
    }

    const result = await response.json();
    
    res.status(200).json({ text: result.text });
  } catch (error) {
    console.error('Transcription API error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
} 