import mongoose from 'mongoose';
import bcryptjs from 'bcryptjs';

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Invalid email format']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: 6,
    select: false
  },
  username: {
    type: String,
    required: [true, 'Username is required']
  },
  profiles: [{
    _id: mongoose.Schema.Types.ObjectId,
    name: String,
    avatar: String,
    isDefault: Boolean
  }],
  activeProfileId: mongoose.Schema.Types.ObjectId,
  createdAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();

  const salt = await bcryptjs.genSalt(10);
  this.password = await bcryptjs.hash(this.password, salt);
  next();
});

UserSchema.methods.comparePassword = async function(passwordToCheck) {
  return await bcryptjs.compare(passwordToCheck, this.password);
};

export default mongoose.model('User', UserSchema);
