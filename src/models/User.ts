import { model, Schema, Document } from 'mongoose';

interface UserInterface extends Document {
  thumbnail: string,
  name: string,
  email: string,
  password: string,
}

const UserSchema = new Schema({
  thumbnail: String,
  name: {
    type: String,
    trim: true,
  },
  email: {
    type: String,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    trim: true,
    select: false,
  },
}, {
  toJSON: {
    virtuals: true,
  },
  timestamps: true,
});

UserSchema.virtual('thumbnail_url').get(function () {
  return `http://localhost:${process.env.PORT}/images/${this.thumbnail}`;
});

export default model<UserInterface>('Users', UserSchema);
