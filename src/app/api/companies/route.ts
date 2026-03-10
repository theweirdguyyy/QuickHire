import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongoose";
import Company from "@/models/Company";

export async function GET() {
    try {
        await dbConnect();
        const companies = await Company.find({}).sort({ name: 1 });
        return NextResponse.json({ success: true, data: companies });
    } catch (error) {
        return NextResponse.json({ success: false, error: "Failed to fetch companies" }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        await dbConnect();
        const body = await req.json();
        const company = await Company.create(body);
        return NextResponse.json({ success: true, data: company }, { status: 201 });
    } catch (error) {
        return NextResponse.json({ success: false, error: "Failed to create company" }, { status: 400 });
    }
}
