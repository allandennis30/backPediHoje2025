import mongoose, { Document, Schema } from 'mongoose';

export interface ICategory extends Document {
  name: string;
  description?: string;
  active?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

const CategorySchema = new Schema<ICategory>(
  {
    name: { type: String, required: true },
    description: { type: String, required: false },
    active: { type: Boolean, default: false, required: false },
  },
  { timestamps: true }
);

export default mongoose.model<ICategory>('Category', CategorySchema);