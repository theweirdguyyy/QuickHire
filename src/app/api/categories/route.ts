import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/mongoose";
import Category from "@/models/Category";
import User from "@/models/User";

export async function GET() {
    try {
        await dbConnect();
        const categories = await Category.find({}).sort({ sortOrder: 1, name: 1 }).lean();
        return NextResponse.json({ success: true, data: JSON.parse(JSON.stringify(categories)) });
    } catch (error) {
        return NextResponse.json({ success: false, error: "Failed to fetch categories" }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.email) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        await dbConnect();
        const dbUser = await User.findOne({ email: session.user.email });
        if (!dbUser || dbUser.role !== "admin") {
            return NextResponse.json({ message: "Forbidden: Admins only" }, { status: 403 });
        }

        const { name, iconName } = await request.json();
        if (!name || !iconName) {
            return NextResponse.json({ message: "Name and iconName are required" }, { status: 400 });
        }

        const category = await Category.create({ name, iconName });
        return NextResponse.json({ success: true, data: JSON.parse(JSON.stringify(category)) }, { status: 201 });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
