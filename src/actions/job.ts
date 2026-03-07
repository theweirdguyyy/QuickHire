"use server";

import dbConnect from "@/lib/mongoose";
import Job from "@/models/Job";

export async function getJobs(query = {}, limit = 10) {
    try {
        await dbConnect();
        const jobs = await Job.find(query).limit(limit).sort({ postedAt: -1 }).lean();
        return { success: true, data: JSON.parse(JSON.stringify(jobs)) };
    } catch (error) {
        console.error("Failed to fetch jobs:", error);
        return { success: false, error: "Failed to fetch jobs" };
    }
}

export async function createJob(data: any) {
    try {
        await dbConnect();
        const newJob = await Job.create(data);
        return { success: true, data: JSON.parse(JSON.stringify(newJob)) };
    } catch (error) {
        console.error("Failed to create job:", error);
        return { success: false, error: "Failed to create job" };
    }
}
