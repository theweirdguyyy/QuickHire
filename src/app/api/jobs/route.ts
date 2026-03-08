import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/mongoose";
import Job from "@/models/Job";
import User from "@/models/User";

// GET /api/jobs - list all jobs
export async function GET() {
    try {
        await dbConnect();
        const jobs = await Job.find({}).sort({ sortOrder: 1, postedAt: -1 }).lean();
        return NextResponse.json({ success: true, data: JSON.parse(JSON.stringify(jobs)) });
    } catch {
        return NextResponse.json({ success: false, error: "Failed to fetch jobs" }, { status: 500 });
    }
}

// POST /api/jobs - create a job (admin only)
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

        const body = await request.json();
        const job = await Job.create(body);
        return NextResponse.json({ success: true, data: JSON.parse(JSON.stringify(job)) }, { status: 201 });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
