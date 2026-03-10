import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongoose";
import VerificationCode from "@/models/VerificationCode";
import User from "@/models/User";

export async function POST(req: Request) {
    try {
        await dbConnect();
        const { email } = await req.json();

        if (!email) {
            return NextResponse.json({ success: false, message: "Email is required" }, { status: 400 });
        }

        // Check if user already exists and is verified
        const existingUser = await User.findOne({ email });
        if (existingUser && existingUser.isVerified) {
            return NextResponse.json({ success: false, message: "User already exists and is verified" }, { status: 400 });
        }

        // Generate 6-digit code
        const code = Math.floor(100000 + Math.random() * 900000).toString();

        // Update or create verification code
        await VerificationCode.findOneAndUpdate(
            { email },
            { code, createdAt: new Date() },
            { upsert: true, new: true }
        );

        // MOCK EMAIL SENDING
        console.log("------------------------------------------");
        console.log(`VERIFICATION CODE FOR ${email}: ${code}`);
        console.log("------------------------------------------");

        return NextResponse.json({
            success: true,
            message: "Verification code sent to your email (Check console for mock)"
        });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
    }
}
