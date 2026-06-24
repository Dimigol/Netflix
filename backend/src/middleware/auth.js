import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const authMiddleware = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const requestedProfileId = req.headers['x-profile-id'];

    req.userId = decoded.userId;
    req.profileId = requestedProfileId || decoded.profileId;

    if (requestedProfileId) {
      const user = await User.findById(decoded.userId).select('profiles');
      const profileExists = user?.profiles?.some(profile => profile._id.toString() === requestedProfileId);

      if (!profileExists) {
        return res.status(403).json({ error: 'Invalid profile selected' });
      }
    }

    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid token' });
  }
};
