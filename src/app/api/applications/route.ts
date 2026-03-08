import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/mongoose";
import Application from "@/models/Application";
import User from "@/models/User";

// GET /api/applications - list all applications (admin only)
export async function GET() {
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

        const applications = await Application.find({})
            .sort({ appliedAt: -1 })
            .populate("jobId", "title companyName")
            .lean();

        return NextResponse.json({ success: true, data: JSON.parse(JSON.stringify(applications)) });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: "Failed to fetch applications" }, { status: 500 });
    }
}
