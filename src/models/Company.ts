import mongoose from 'mongoose';

export interface ICompany extends mongoose.Document {
    name: string;
    logoUrl?: string;
    website?: string;
    location: string;
    description: string;
    industry: string;
    employeeCount?: string;
    foundedYear?: number;
    headquarters?: string;
    featured: boolean;
    createdAt: Date;
}

const CompanySchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    logoUrl: { type: String },
    website: { type: String },
    location: { type: String, required: true },
    description: { type: String, required: true },
    industry: { type: String, required: true },
    employeeCount: { type: String },
    foundedYear: { type: Number },
    headquarters: { type: String },
    featured: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Company || mongoose.model<ICompany>('Company', CompanySchema);
