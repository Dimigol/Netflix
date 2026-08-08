import express from 'express';
import {
  createProfile,
  updateProfile,
  deleteProfile,
  getProfile,
  saveWatchHistory,
  getWatchHistory,
  updateBookmark,
  getMyList
} from '../controllers/userController.js';
import { authMiddleware } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { createProfileSchema, updateProfileSchema } from '../validators/userValidators.js';

const router = express.Router();

router.use(authMiddleware);

router.post('/profile', validate(createProfileSchema), createProfile);
router.get('/profile', getProfile);
router.put('/profile/:profileId', validate(updateProfileSchema), updateProfile);
router.patch('/profile/:profileId', validate(updateProfileSchema), updateProfile);
router.post('/profile/:profileId', validate(updateProfileSchema), updateProfile);
router.delete('/profile/:profileId', deleteProfile);
router.post('/watchhistory', saveWatchHistory);
router.get('/watchhistory', getWatchHistory);
router.put('/watchhistory/:contentId', updateBookmark);
router.get('/mylist', getMyList);

export default router;
