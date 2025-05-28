import mongoose from 'mongoose';

const LocationSchema = new mongoose.Schema({
    latitude: { type: Number },
    longitude: { type: Number }
}, { _id: false });

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    token: { type: String },
    cnpjCpf: { type: String },
    phone: { type: String },
    street: { type: String },
    houseNumber: { type: String },
    neighborhood: { type: String },
    city: { type: String },
    uf: { type: String },
    ddd: { type: String },
    complement: { type: String },
    resetToken: { type: String },
    isAdmin: { type: Boolean, default: false },
    isStore: { type: Boolean, default: false },
    isLogged: { type: Boolean, default: false },
    isActive: { type: Boolean, default: false },
    lastLogin: { type: Date },
    createdAt: { type: Date, default: Date.now },
    cep: { type: String },
    location: { type: LocationSchema }
}, {
    timestamps: true
});

const User = mongoose.model('User', UserSchema);
export default User;