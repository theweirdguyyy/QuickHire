import mongoose from 'mongoose';

export interface IApplication extends mongoose.Document {
    jobId: mongoose.Types.ObjectId;
    candidateName: string;
    candidateEmail: string;
    resumeLink: string;
    phone: string;
    desiredPay: string;
    website?: string;
    linkedIn?: string;
    university: string;
    major: string;
    githubUrl?: string;
    coverLetter?: string;
    appliedAt: Date;
    status: 'Pending' | 'Reviewed' | 'Accepted' | 'Rejected';
    sortOrder: number;
}

const ApplicationSchema = new mongoose.Schema({
    jobId: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true },
    candidateName: { type: String, required: true },
    candidateEmail: { type: String, required: true },
    resumeLink: { type: String, required: true },
    phone: { type: String, required: true },
    desiredPay: { type: String, required: true },
    website: { type: String },
    linkedIn: { type: String },
    university: { type: String, required: true },
    major: { type: String, required: true },
    githubUrl: { type: String },
    coverLetter: { type: String },
    status: {
        type: String,
        enum: ['Pending', 'Reviewed', 'Accepted', 'Rejected'],
        default: 'Pending'
    },
    appliedAt: { type: Date, default: Date.now },
    sortOrder: { type: Number, default: 0 },
}, { timestamps: true }); // Schema Version: 1.1 - Added major and githubUrl

// Force refresh schema in case of hot-reload caching
if (mongoose.models.Application) {
    delete mongoose.models.Application;
}

const ApplicationModel = mongoose.models.Application || mongoose.model<IApplication>('Application', ApplicationSchema);
export default ApplicationModel;
