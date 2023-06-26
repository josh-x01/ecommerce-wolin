import mongoose from 'mongoose';

const userImageSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    path: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

const UserImage = mongoose.model('UserImage', userImageSchema);
export default UserImage;
