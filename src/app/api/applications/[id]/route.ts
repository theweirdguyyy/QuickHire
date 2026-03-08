import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/mongoose";
import Application from "@/models/Application";
import User from "@/models/User";

async function isAdmin(email: string): Promise<boolean> {
    await dbConnect();
    const user = await User.findOne({ email });
    return user?.role === "admin";
}

// GET /api/applications/[id] - get single application (admin only)
export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const session = await getServerSession(authOptions);
    if (!session?.user?.email || !(await isAdmin(session.user.email))) {
        return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }
    try {
        await dbConnect();
        const application = await Application.findById(id).populate("jobId", "title companyName location jobType").lean();
        if (!application) return NextResponse.json({ message: "Application not found" }, { status: 404 });
        return NextResponse.json({ success: true, data: JSON.parse(JSON.stringify(application)) });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}

// PUT /api/applications/[id] - update application status (admin only)
export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const session = await getServerSession(authOptions);
    if (!session?.user?.email || !(await isAdmin(session.user.email))) {
        return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    try {
        await dbConnect();
        const { status } = await request.json();

        if (!['Pending', 'Reviewed', 'Accepted', 'Rejected'].includes(status)) {
            return NextResponse.json({ message: "Invalid status" }, { status: 400 });
        }

        const application = await Application.findByIdAndUpdate(
            id,
            { status },
            { new: true }
        ).populate("jobId", "title");

        if (!application) return NextResponse.json({ message: "Application not found" }, { status: 404 });

        return NextResponse.json({ success: true, data: JSON.parse(JSON.stringify(application)) });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}

// DELETE /api/applications/[id] - delete application (admin only)
export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const session = await getServerSession(authOptions);
    if (!session?.user?.email || !(await isAdmin(session.user.email))) {
        return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    try {
        await dbConnect();
        const app = await Application.findByIdAndDelete(id);
        if (!app) return NextResponse.json({ message: "Application not found" }, { status: 404 });
        return NextResponse.json({ success: true, message: "Application deleted" });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
