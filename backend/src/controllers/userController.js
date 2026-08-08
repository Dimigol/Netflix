import WatchHistory from '../models/WatchHistory.js';
import User from '../models/User.js';
import mongoose from 'mongoose';
import { isAllowedProfileAvatar, pickProfileAvatar } from '../utils/profileAvatars.js';

export const createProfile = async (req, res, next) => {
  try {
    const { name, avatar } = req.body;
    const user = await User.findById(req.userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (!name?.trim()) {
      return res.status(400).json({ error: 'Profile name is required' });
    }

    const newProfile = {
      _id: new mongoose.Types.ObjectId(),
      name: name.trim(),
      avatar: isAllowedProfileAvatar(avatar) ? avatar : pickProfileAvatar(name),
      isDefault: false
    };

    user.profiles.push(newProfile);
    await user.save();

    res.status(201).json(newProfile);
  } catch (err) {
    next(err);
  }
};

export const updateProfile = async (req, res, next) => {
  try {
    const { profileId } = req.params;
    const { name, avatar } = req.body;
    const user = await User.findById(req.userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const profile = user.profiles.find(p => p._id.toString() === profileId);

    if (!profile) {
      return res.status(404).json({ error: 'Profile not found' });
    }

    if (name?.trim()) {
      profile.name = name.trim();
    }

    if (avatar) {
      if (!isAllowedProfileAvatar(avatar)) {
        return res.status(400).json({ error: 'Invalid profile avatar' });
      }

      profile.avatar = avatar;
    }

    await user.save();
    res.json(profile);
  } catch (err) {
    next(err);
  }
};

export const getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const activeProfile = user.profiles.find(p => p._id.toString() === req.profileId);
    if (!activeProfile) {
      return res.status(404).json({ error: 'Profile not found' });
    }

    res.json({ ...activeProfile.toObject(), userId: req.userId });
  } catch (err) {
    next(err);
  }
};

export const saveWatchHistory = async (req, res, next) => {
  try {
    const { contentId, progress } = req.body;

    let watchHistory = await WatchHistory.findOne({
      userId: req.userId,
      profileId: req.profileId,
      contentId
    });

    if (watchHistory) {
      watchHistory.progress = progress;
      watchHistory.lastWatchedAt = new Date();
    } else {
      watchHistory = new WatchHistory({
        userId: req.userId,
        profileId: req.profileId,
        contentId,
        progress,
        lastWatchedAt: new Date()
      });
    }

    await watchHistory.save();
    res.json(watchHistory);
  } catch (err) {
    next(err);
  }
};

export const getWatchHistory = async (req, res, next) => {
  try {
    const watchHistory = await WatchHistory.find({
      userId: req.userId,
      profileId: req.profileId
    })
      .populate('contentId')
      .sort({ lastWatchedAt: -1 });

    res.json(watchHistory);
  } catch (err) {
    next(err);
  }
};

export const updateBookmark = async (req, res, next) => {
  try {
    const { contentId } = req.params;
    const { isBookmarked } = req.body;

    let watchHistory = await WatchHistory.findOne({
      userId: req.userId,
      profileId: req.profileId,
      contentId
    });

    if (!watchHistory) {
      watchHistory = new WatchHistory({
        userId: req.userId,
        profileId: req.profileId,
        contentId,
        isBookmarked
      });
    } else {
      watchHistory.isBookmarked = isBookmarked;
    }

    await watchHistory.save();
    res.json(watchHistory);
  } catch (err) {
    next(err);
  }
};

export const getMyList = async (req, res, next) => {
  try {
    const myList = await WatchHistory.find({
      userId: req.userId,
      profileId: req.profileId,
      isBookmarked: true
    }).populate('contentId');

    res.json(myList);
  } catch (err) {
    next(err);
  }
};
