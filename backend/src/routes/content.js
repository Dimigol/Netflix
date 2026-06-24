import express from 'express';
import {
  getAllContent,
  getContentById,
  searchContent,
  getRecommendations
} from '../controllers/contentController.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

router.get('/', getAllContent);
router.get('/search', searchContent);
router.get('/recommendations', authMiddleware, getRecommendations);
router.get('/:id', getContentById);

export default router;
