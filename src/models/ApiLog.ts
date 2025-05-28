import mongoose from 'mongoose';

const RouteLogSchema = new mongoose.Schema({
  path: { type: String, required: true, unique: true },
  count: { type: Number, default: 0 },
});

export default mongoose.model('RouteLog', RouteLogSchema);