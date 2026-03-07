import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/mongoose";
import Job from "@/models/Job";
import User from "@/models/User";

async function isAdmin(email: string): Promise<boolean> {
    await dbConnect();
    const user = await User.findOne({ email });
    return user?.role === "admin";
}

// GET /api/jobs/[id] - fetch a single job
export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    try {
        await dbConnect();
        const job = await Job.findById(id);
        if (!job) return NextResponse.json({ success: false, message: "Job not found" }, { status: 404 });
        return NextResponse.json({ success: true, data: JSON.parse(JSON.stringify(job)) });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}

// PUT /api/jobs/[id] - update a job (admin only)
export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const session = await getServerSession(authOptions);
    if (!session?.user?.email || !(await isAdmin(session.user.email))) {
        return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    try {
        await dbConnect();
        const body = await request.json();

        // Sanitize body to prevent immutable field errors
        const updateData = { ...body };
        delete updateData._id;
        delete updateData.__v;
        delete updateData.createdAt;
        delete updateData.updatedAt;

        const job = await Job.findByIdAndUpdate(id, updateData, { new: true });
        if (!job) return NextResponse.json({ message: "Job not found" }, { status: 404 });
        return NextResponse.json({ success: true, data: JSON.parse(JSON.stringify(job)) });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}

// DELETE /api/jobs/[id] - delete a job (admin only)
export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const session = await getServerSession(authOptions);
    if (!session?.user?.email || !(await isAdmin(session.user.email))) {
        return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    try {
        await dbConnect();
        const job = await Job.findByIdAndDelete(id);
        if (!job) return NextResponse.json({ message: "Job not found" }, { status: 404 });
        return NextResponse.json({ success: true, message: "Job deleted" });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
