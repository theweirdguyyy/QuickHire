import { NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import dbConnect from "@/lib/mongoose";
import Application from "@/models/Application";
import Job from "@/models/Job";

export async function POST(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id: jobId } = await params;
        const formData = await request.formData();

        const candidateName = formData.get("candidateName") as string;
        const candidateEmail = formData.get("candidateEmail") as string;
        const phone = formData.get("phone") as string;
        const desiredPay = formData.get("desiredPay") as string;
        const website = formData.get("website") as string;
        const linkedIn = formData.get("linkedIn") as string;
        const university = formData.get("university") as string;
        const coverLetter = formData.get("coverLetter") as string;
        const resumeFile = formData.get("resume") as File | null;

        if (!candidateName || !candidateEmail || !phone || !desiredPay || !university || !resumeFile) {
            return NextResponse.json({ success: false, error: "Missing required fields or resume file" }, { status: 400 });
        }

        // Handle PDF Upload
        const bytes = await resumeFile.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Create unique filename and ensure directory exists
        const uniqueFileName = `${Date.now()}-${resumeFile.name.replace(/\s+/g, "_")}`;
        const uploadDir = path.join(process.cwd(), "public/uploads/resumes");

        try {
            await mkdir(uploadDir, { recursive: true });
        } catch (e) {
            // Ignore error if directory already exists
        }

        const filePath = path.join(uploadDir, uniqueFileName);
        await writeFile(filePath, buffer);

        const resumeLink = `/uploads/resumes/${uniqueFileName}`;

        await dbConnect();

        // Verify job exists
        const job = await Job.findById(jobId);
        if (!job) {
            return NextResponse.json({ success: false, error: "Job not found" }, { status: 404 });
        }

        const application = await Application.create({
            jobId,
            candidateName,
            candidateEmail,
            resumeLink,
            phone,
            desiredPay,
            website,
            linkedIn,
            university,
            coverLetter
        });

        return NextResponse.json({ success: true, data: JSON.parse(JSON.stringify(application)) }, { status: 201 });
    } catch (error: any) {
        console.error("Application error:", error);
        return NextResponse.json({ success: false, error: error.message || "Failed to submit application" }, { status: 500 });
    }
}
