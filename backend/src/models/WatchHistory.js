import mongoose from 'mongoose';

const WatchHistorySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  profileId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  contentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Content',
    required: true,
    index: true
  },
  progress: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  isBookmarked: {
    type: Boolean,
    default: false
  },
  lastWatchedAt: Date,
  createdAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

WatchHistorySchema.index({ userId: 1, profileId: 1, contentId: 1 }, { unique: true });

export default mongoose.model('WatchHistory', WatchHistorySchema);
