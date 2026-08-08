import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import { pickProfileAvatar } from '../utils/profileAvatars.js';

export const register = async (req, res, next) => {
  try {
    const { email, password, username } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already in use' });
    }

    const defaultProfileId = new mongoose.Types.ObjectId();
    const user = new User({
      email,
      password,
      username,
      profiles: [{
        _id: defaultProfileId,
        name: username,
        avatar: pickProfileAvatar(username),
        isDefault: true
      }],
      activeProfileId: defaultProfileId
    });

    await user.save();

    const token = jwt.sign(
      { userId: user._id, profileId: defaultProfileId },
      process.env.JWT_SECRET,
      { expiresIn: '30d' }
    );

    res.status(201).json({
      token,
      user: {
        id: user._id,
        email: user.email,
        username: user.username,
        activeProfileId: defaultProfileId,
        profiles: user.profiles
      }
    });
  } catch (err) {
    next(err);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const isValidPassword = await user.comparePassword(password);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { userId: user._id, profileId: user.activeProfileId },
      process.env.JWT_SECRET,
      { expiresIn: '30d' }
    );

    res.json({
      token,
      user: {
        id: user._id,
        email: user.email,
        username: user.username,
        activeProfileId: user.activeProfileId,
        profiles: user.profiles
      }
    });
  } catch (err) {
    next(err);
  }
};

export const verify = (req, res) => {
  res.json({
    valid: true,
    userId: req.userId,
    profileId: req.profileId
  });
};
