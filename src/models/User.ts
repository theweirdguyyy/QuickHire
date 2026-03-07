import mongoose from 'mongoose';

export interface IUser extends mongoose.Document {
    name: string;
    email: string;
    password?: string;
    image?: string;
    role: 'applicant' | 'employer' | 'admin';
}

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String },
    image: { type: String },
    role: { type: String, enum: ['applicant', 'employer', 'admin'], default: 'applicant' },
});

export default mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
