import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongoose";
import Category from "@/models/Category";
import Job from "@/models/Job";
import Application from "@/models/Application";

export async function POST(req: Request) {
    try {
        await dbConnect();
        const { model, orders } = await req.json();

        if (!model || !orders || !Array.isArray(orders)) {
            return NextResponse.json({ success: false, message: "Invalid payload" }, { status: 400 });
        }

        let Model;
        switch (model) {
            case "Category":
                Model = Category;
                break;
            case "Job":
                Model = Job;
                break;
            case "Application":
                Model = Application;
                break;
            default:
                return NextResponse.json({ success: false, message: "Unsupported model" }, { status: 400 });
        }

        // Perform batch updates
        const updatePromises = orders.map(({ id, sortOrder }) =>
            Model.findByIdAndUpdate(id, { sortOrder })
        );

        await Promise.all(updatePromises);

        return NextResponse.json({ success: true, message: "Reordered successfully" });
    } catch (error) {
        console.error("Reorder error:", error);
        return NextResponse.json({ success: false, message: "Server error during reorder" }, { status: 500 });
    }
}
