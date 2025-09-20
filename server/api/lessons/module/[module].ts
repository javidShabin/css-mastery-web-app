import type { VercelRequest, VercelResponse } from '@vercel/node';
import { storage } from '../../../storage';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { module } = req.query;
    
    if (!module || typeof module !== 'string') {
      return res.status(400).json({ message: 'Module name is required' });
    }

    const lessons = await storage.getLessonsByModule(module);
    res.json(lessons);
  } catch (error) {
    console.error('Error fetching lessons for module:', error);
    res.status(500).json({ message: 'Failed to fetch lessons for module' });
  }
}
