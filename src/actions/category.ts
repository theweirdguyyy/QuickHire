"use server";

import dbConnect from "@/lib/mongoose";
import Category from "@/models/Category";

export async function getCategories() {
    try {
        await dbConnect();
        const categories = await Category.find({}).sort({ jobCount: -1 }).lean();
        return { success: true, data: JSON.parse(JSON.stringify(categories)) };
    } catch (error) {
        console.error("Failed to fetch categories:", error);
        return { success: false, error: "Failed to fetch categories" };
    }
}
