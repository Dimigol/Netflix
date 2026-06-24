import mongoose from 'mongoose';

const ContentSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    index: true
  },
  category: {
    type: String,
    required: true,
    index: true
  },
  genres: {
    type: [String],
    default: []
  },
  image: String,
  youtubeUrl: String,
  description: String,
  badge: String,
  duration: Number,
  year: Number,
  rating: Number,
  tags: [String],
  createdAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

ContentSchema.index({ title: 'text', description: 'text' });

export default mongoose.model('Content', ContentSchema);
