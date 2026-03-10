import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/mongoose";
import User from "@/models/User";
import VerificationCode from "@/models/VerificationCode";

export async function POST(request: Request) {
    try {
        const { name, email, password, code } = await request.json();

        if (!name || !email || !password || !code) {
            return NextResponse.json(
                { message: "Missing required fields" },
                { status: 400 }
            );
        }

        await dbConnect();

        // Verify code
        const validCode = await VerificationCode.findOne({ email, code });
        if (!validCode) {
            return NextResponse.json(
                { message: "Invalid or expired verification code" },
                { status: 400 }
            );
        }

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return NextResponse.json(
                { message: "Email already exists" },
                { status: 400 }
            );
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await User.create({
            name,
            email,
            password: hashedPassword,
            isVerified: true
        });

        // Delete the verification code after successful registration
        await VerificationCode.deleteOne({ email });

        return NextResponse.json(
            { message: "User registered successfully", user: { id: newUser._id, email: newUser.email, name: newUser.name } },
            { status: 201 }
        );
    } catch (error: any) {
        console.error("Registration Error: ", error);
        return NextResponse.json(
            { message: "Internal Server Error" },
            { status: 500 }
        );
    }
}
