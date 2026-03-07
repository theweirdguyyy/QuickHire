import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/mongoose";
import Category from "@/models/Category";
import User from "@/models/User";

export async function PUT(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
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
        const updatedCategory = await Category.findByIdAndUpdate(
            id,
            { name, iconName },
            { new: true }
        );

        if (!updatedCategory) {
            return NextResponse.json({ message: "Category not found" }, { status: 404 });
        }

        return NextResponse.json({ success: true, data: JSON.parse(JSON.stringify(updatedCategory)) });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}

export async function DELETE(
    _request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const session = await getServerSession(authOptions);
        if (!session?.user?.email) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        await dbConnect();
        const dbUser = await User.findOne({ email: session.user.email });
        if (!dbUser || dbUser.role !== "admin") {
            return NextResponse.json({ message: "Forbidden: Admins only" }, { status: 403 });
        }

        const deletedCategory = await Category.findByIdAndDelete(id);
        if (!deletedCategory) {
            return NextResponse.json({ message: "Category not found" }, { status: 404 });
        }

        return NextResponse.json({ success: true, message: "Category deleted" });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
