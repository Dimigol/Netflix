import express from 'express';
import {
  createProfile,
  updateProfile,
  getProfile,
  saveWatchHistory,
  getWatchHistory,
  updateBookmark,
  getMyList
} from '../controllers/userController.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

router.use(authMiddleware);

router.post('/profile', createProfile);
router.get('/profile', getProfile);
router.put('/profile/:profileId', updateProfile);
router.patch('/profile/:profileId', updateProfile);
router.post('/profile/:profileId', updateProfile);
router.post('/watchhistory', saveWatchHistory);
router.get('/watchhistory', getWatchHistory);
router.put('/watchhistory/:contentId', updateBookmark);
router.get('/mylist', getMyList);

export default router;
