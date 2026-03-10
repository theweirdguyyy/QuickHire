const mongoose = require('mongoose');

const MONGODB_URI = "mongodb+srv://quickhire:quickhire@quickhire-cluster.xlgvdn3.mongodb.net/?appName=QuickHire-Cluster";

const CompanySchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    logoUrl: { type: String },
    website: { type: String },
    location: { type: String, required: true },
    description: { type: String, required: true },
    industry: { type: String, required: true },
    employeeCount: { type: String },
    featured: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
});

const Company = mongoose.models.Company || mongoose.model('Company', CompanySchema);

const companies = [
    {
        name: "Google",
        industry: "Technology",
        location: "Mountain View, CA",
        description: "Google's mission is to organize the world's information and make it universally accessible and useful.",
        employeeCount: "100,000+",
        featured: true,
        logoUrl: "https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_92x30dp.png"
    },
    {
        name: "Microsoft",
        industry: "Software",
        location: "Redmond, WA",
        description: "Microsoft enables digital transformation for the era of an intelligent cloud and an intelligent edge.",
        employeeCount: "200,000+",
        featured: true,
        logoUrl: "https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg"
    },
    {
        name: "Apple",
        industry: "Consumer Electronics",
        location: "Cupertino, CA",
        description: "Apple designs, manufactures, and markets smartphones, personal computers, tablets, wearables, and accessories.",
        employeeCount: "150,000+",
        featured: true,
        logoUrl: "https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg"
    },
    {
        name: "Amazon",
        industry: "E-commerce",
        location: "Seattle, WA",
        description: "Amazon is guided by four principles: customer obsession, passion for invention, commitment to operational excellence, and long-term thinking.",
        employeeCount: "1,500,000+",
        featured: true,
        logoUrl: "https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg"
    },
    {
        name: "Meta",
        industry: "Social Media",
        location: "Menlo Park, CA",
        description: "Meta builds technologies that help people connect, find communities and grow businesses.",
        employeeCount: "70,000+",
        featured: false,
        logoUrl: "https://upload.wikimedia.org/wikipedia/commons/7/7b/Meta_Platforms_Inc._logo.svg"
    },
    {
        name: "Netflix",
        industry: "Entertainment",
        location: "Los Gatos, CA",
        description: "Netflix is the world's leading streaming entertainment service with 221 million paid memberships in over 190 countries.",
        employeeCount: "12,000+",
        featured: false,
        logoUrl: "https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg"
    }
];

async function seed() {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log("Connected to MongoDB");

        await Company.deleteMany({});
        console.log("Cleared existing companies");

        await Company.insertMany(companies);
        console.log("Seeded companies successfully");

        process.exit(0);
    } catch (error) {
        console.error("Error seeding companies:", error);
        process.exit(1);
    }
}

seed();
