import mongoose, { Document, Schema, Types } from 'mongoose';

interface ILocation {
  lat?: number;
  lng?: number;
}

export interface IStore extends Document {
  name: string;
  email: string;
  userId: Types.ObjectId;
  phone?: string;
  category?: string;
  cnpjCpf: string;
  cep: string;
  state: string;
  city: string;
  neighborhood: string;
  street: string;
  number?: string;
  complement?: string;
  location?: ILocation;
  image: string;
  workingDays?: string;
  isOpen?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

const LocationSchema = new Schema<ILocation>(
  {
    lat: { type: Number, required: false },
    lng: { type: Number, required: false },
  },
  { _id: false }
);

const StoreSchema = new Schema<IStore>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    userId: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
    phone: { type: String, required: false },
    category: { type: String, required: false },
    cnpjCpf: { type: String, required: true },
    cep: { type: String, required: true },
    state: { type: String, required: true },
    city: { type: String, required: true },
    neighborhood: { type: String, required: true },
    street: { type: String, required: true },
    number: { type: String, required: false },
    complement: { type: String, required: false },
    location: { type: LocationSchema, required: false },
    image: { type: String, required: true },
    workingDays: { type: String, required: false },
    isOpen: { type: Boolean, required: false, default: false },
  },
  { timestamps: true }
);

export default mongoose.model<IStore>('Store', StoreSchema);