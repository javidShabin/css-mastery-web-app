import type { VercelRequest, VercelResponse } from '@vercel/node';
import { storage } from '../../storage';
import { insertUserProgressSchema } from '@shared/schema';
import { z } from 'zod';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const validatedData = insertUserProgressSchema.parse(req.body);
    const progress = await storage.createOrUpdateProgress(validatedData);
    res.json(progress);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ 
        message: 'Invalid request data', 
        errors: error.errors 
      });
    }
    console.error('Error updating progress:', error);
    res.status(500).json({ message: 'Failed to update progress' });
  }
}
