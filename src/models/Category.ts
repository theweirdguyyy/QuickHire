import mongoose from 'mongoose';

export interface ICategory extends mongoose.Document {
    name: string;
    iconName: string;
    jobCount: number;
}

const CategorySchema = new mongoose.Schema({
    name: { type: String, required: true },
    iconName: { type: String, required: true }, // Using lucide-react icon names
    jobCount: { type: Number, default: 0 },
});

export default mongoose.models.Category || mongoose.model<ICategory>('Category', CategorySchema);
