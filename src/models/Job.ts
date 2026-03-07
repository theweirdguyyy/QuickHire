import mongoose from 'mongoose';

export interface IJob extends mongoose.Document {
    title: string;
    companyName: string;
    location: string;
    jobType: 'Full Time' | 'Part Time' | 'Contract' | 'Freelance' | 'Internship';
    categories: string[];
    description: string;
    salaryRange?: string;
    logoUrl?: string;
    featured: boolean;
    postedAt: Date;
}

const JobSchema = new mongoose.Schema({
    title: { type: String, required: true },
    companyName: { type: String, required: true },
    location: { type: String, required: true }, // e.g. "Remote - US" or "San Francisco, CA"
    jobType: {
        type: String,
        required: true,
        enum: ['Full Time', 'Part Time', 'Contract', 'Freelance', 'Internship'],
        default: 'Full Time'
    },
    categories: [{ type: String }],
    description: { type: String, required: true },
    salaryRange: { type: String },
    logoUrl: { type: String },
    featured: { type: Boolean, default: false },
    postedAt: { type: Date, default: Date.now },
});

export default mongoose.models.Job || mongoose.model<IJob>('Job', JobSchema);
