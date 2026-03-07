import mongoose from "mongoose";
import * as dotenv from "dotenv";
import { fileURLToPath } from "url";
import path from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, "../.env.local") });

const CategorySchema = new mongoose.Schema({
    name: { type: String, required: true },
    iconName: { type: String, required: true },
    jobCount: { type: Number, default: 0 },
});
const Category = mongoose.models.Category || mongoose.model("Category", CategorySchema);

const categories = [
    { name: "Software Development", iconName: "Code" },
    { name: "Web Development", iconName: "Globe" },
    { name: "Mobile App Development", iconName: "Smartphone" },
    { name: "Data Science", iconName: "BarChart4" },
    { name: "Data Analysis", iconName: "LineChart" },
    { name: "Artificial Intelligence / Machine Learning", iconName: "Brain" },
    { name: "Cybersecurity", iconName: "Shield" },
    { name: "Cloud Computing", iconName: "Cloud" },
    { name: "DevOps Engineering", iconName: "Settings" },
    { name: "Game Development", iconName: "Gamepad2" },
    { name: "IT Support / System Administration", iconName: "Terminal" },
    { name: "Network Engineering", iconName: "Share2" },
    { name: "QA / Software Testing", iconName: "CheckSquare" },
    { name: "Blockchain Development", iconName: "Database" },
    { name: "Accounting", iconName: "Calculator" },
    { name: "Auditing", iconName: "FileText" },
    { name: "Financial Analysis", iconName: "TrendingUp" },
    { name: "Investment Banking", iconName: "Landmark" },
    { name: "Corporate Finance", iconName: "Wallet" },
    { name: "Tax Consulting", iconName: "Receipt" },
    { name: "Insurance", iconName: "Umbrella" },
    { name: "Risk Management", iconName: "ShieldAlert" },
    { name: "Financial Planning", iconName: "PiggyBank" },
    { name: "Digital Marketing", iconName: "Zap" },
    { name: "Social Media Marketing", iconName: "Share2" },
    { name: "Content Marketing", iconName: "BookOpen" },
    { name: "Search Engine Optimization (SEO)", iconName: "Search" },
    { name: "Advertising", iconName: "Megaphone" },
    { name: "Brand Management", iconName: "Award" },
    { name: "Sales Management", iconName: "Package" },
    { name: "Market Research", iconName: "PieChart" },
    { name: "Public Relations (PR)", iconName: "MessageSquare" },
    { name: "Graphic Design", iconName: "Palette" },
    { name: "UI/UX Design", iconName: "PenTool" },
    { name: "Product Design", iconName: "Package" },
    { name: "Motion Graphics", iconName: "Play" },
    { name: "Animation", iconName: "Video" },
    { name: "Video Editing", iconName: "Film" },
    { name: "Photography", iconName: "Camera" },
    { name: "Illustration", iconName: "Brush" },
    { name: "Fashion Design", iconName: "Shirt" },
    { name: "Interior Design", iconName: "Home" },
];

async function seed() {
    try {
        if (!process.env.MONGODB_URI) {
            throw new Error("MONGODB_URI is not defined in .env.local");
        }

        await mongoose.connect(process.env.MONGODB_URI);
        console.log("Connected to MongoDB.");

        // Clear existing categories
        await Category.deleteMany({});
        console.log("Cleared existing categories.");

        // Insert new categories
        await Category.insertMany(categories);
        console.log(`Inserted ${categories.length} categories.`);

        await mongoose.disconnect();
        console.log("Disconnected from MongoDB.");
    } catch (error) {
        console.error("Seeding failed:", error);
        process.exit(1);
    }
}

seed();
