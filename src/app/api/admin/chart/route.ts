import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongoose";
import Application from "@/models/Application";

export async function GET(request: Request) {
    try {
        await dbConnect();

        const { searchParams } = new URL(request.url);
        const view = searchParams.get("view") || "months"; // "days" | "months" | "years"
        const range = parseInt(searchParams.get("range") || "3", 10);

        const MONTH_NAMES = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
            "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

        const countMap: Record<string, number> = {};
        let since = new Date();
        let data: { name: string; applications: number }[] = [];

        if (view === "days") {
            // Last N days
            since.setDate(since.getDate() - (range - 1));
            since.setHours(0, 0, 0, 0);

            for (let i = range - 1; i >= 0; i--) {
                const d = new Date();
                d.setDate(d.getDate() - i);
                const key = d.toISOString().split("T")[0]; // "YYYY-MM-DD"
                countMap[key] = 0;
            }

            const apps = await Application.find({ appliedAt: { $gte: since } }, { appliedAt: 1 }).lean();
            apps.forEach((app: any) => {
                const key = new Date(app.appliedAt).toISOString().split("T")[0];
                if (key in countMap) countMap[key]++;
            });

            data = Object.entries(countMap).map(([key, applications]) => {
                const d = new Date(key);
                // For 7 days show weekday names, otherwise show "DD Mon"
                const name = range <= 7
                    ? DAY_NAMES[d.getDay()]
                    : `${d.getDate()} ${MONTH_NAMES[d.getMonth()]}`;
                return { name, applications };
            });

        } else if (view === "months") {
            // Last N months
            for (let i = range - 1; i >= 0; i--) {
                const d = new Date();
                d.setMonth(d.getMonth() - i);
                const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
                countMap[key] = 0;
            }
            since.setMonth(since.getMonth() - range);
            since.setDate(1);
            since.setHours(0, 0, 0, 0);

            const apps = await Application.find({ appliedAt: { $gte: since } }, { appliedAt: 1 }).lean();
            apps.forEach((app: any) => {
                const d = new Date(app.appliedAt);
                const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
                if (key in countMap) countMap[key]++;
            });

            data = Object.entries(countMap).map(([key, applications]) => {
                const month = parseInt(key.split("-")[1], 10) - 1;
                return { name: MONTH_NAMES[month], applications };
            });

        } else if (view === "years") {
            // Last N years
            for (let i = range - 1; i >= 0; i--) {
                const yr = new Date().getFullYear() - i;
                countMap[String(yr)] = 0;
            }
            since = new Date(`${new Date().getFullYear() - (range - 1)}-01-01`);

            const apps = await Application.find({ appliedAt: { $gte: since } }, { appliedAt: 1 }).lean();
            apps.forEach((app: any) => {
                const key = String(new Date(app.appliedAt).getFullYear());
                if (key in countMap) countMap[key]++;
            });

            data = Object.entries(countMap).map(([key, applications]) => ({
                name: key,
                applications,
            }));
        }

        return NextResponse.json({ success: true, data });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
