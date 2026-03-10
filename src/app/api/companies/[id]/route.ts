import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongoose";
import Company from "@/models/Company";

export async function GET(req: Request, { params }: { params: { id: string } }) {
    try {
        await dbConnect();
        const company = await Company.findById(params.id);
        if (!company) return NextResponse.json({ success: false, error: "Company not found" }, { status: 404 });
        return NextResponse.json({ success: true, data: company });
    } catch (error) {
        return NextResponse.json({ success: false, error: "Invalid ID" }, { status: 400 });
    }
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
    try {
        await dbConnect();
        const body = await req.json();
        const company = await Company.findByIdAndUpdate(params.id, body, { new: true });
        if (!company) return NextResponse.json({ success: false, error: "Company not found" }, { status: 404 });
        return NextResponse.json({ success: true, data: company });
    } catch (error) {
        return NextResponse.json({ success: false, error: "Failed to update company" }, { status: 400 });
    }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
    try {
        await dbConnect();
        const company = await Company.findByIdAndDelete(params.id);
        if (!company) return NextResponse.json({ success: false, error: "Company not found" }, { status: 404 });
        return NextResponse.json({ success: true, data: {} });
    } catch (error) {
        return NextResponse.json({ success: false, error: "Failed to delete company" }, { status: 400 });
    }
}
