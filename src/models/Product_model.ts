import mongoose, { Document, Schema, Types } from 'mongoose';

export interface IProduct extends Document {
  name: string;
  description: string;
  price: number;
  image: string;
  storeId: Types.ObjectId | string | number;
  storeName: string;
  category: string;
  active?: boolean;
  quantity: number;
  createdAt?: Date;
  updatedAt?: Date;
}

const ProductSchema = new Schema<IProduct>(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, default: 0, required: true },
    image: { type: String, required: true },
    storeId: {
      type: Schema.Types.Mixed, 
      required: true 
    },
    storeName: { type: String, required: true },
    category: { type: String, required: true },
    active: { type: Boolean, default: false, required: false },
    quantity: { type: Number, required: true },
  },
  { timestamps: true }
);

export default mongoose.model<IProduct>('Product', ProductSchema);