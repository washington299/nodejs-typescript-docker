import { model, Schema } from 'mongoose';

const TokenSchema = new Schema({
  token: String,
});

export default model('Token', TokenSchema);
