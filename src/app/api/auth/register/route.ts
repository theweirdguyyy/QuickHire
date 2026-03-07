import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/mongoose";
import User from "@/models/User";

export async function POST(request: Request) {
    try {
        const { name, email, password } = await request.json();

        if (!name || !email || !password) {
            return NextResponse.json(
                { message: "Missing required fields" },
                { status: 400 }
            );
        }

        await dbConnect();

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
        });

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
