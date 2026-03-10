import mongoose from 'mongoose';

const VerificationCodeSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    code: { type: String, required: true },
    createdAt: { type: Date, default: Date.now, expires: 600 }, // Expire after 10 minutes
});

export default mongoose.models.VerificationCode || mongoose.model('VerificationCode', VerificationCodeSchema);
