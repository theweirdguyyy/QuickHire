"use client";

import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

interface Job {
    _id: string;
    title: string;
    companyName: string;
    location: string;
    jobType: string;
    categories: string[];
    logoUrl?: string;
}

// Deterministic avatar colour from the company's first letter
const AVATAR_COLORS = [
    "#22c55e", "#06b6d4", "#3b82f6", "#1d4ed8",
    "#7c3aed", "#0891b2", "#ef4444", "#4f46e5",
    "#f59e0b", "#10b981",
];
function avatarColor(name: string) {
    let hash = 0;
    for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
    return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}

const TAG_STYLES: Record<string, string> = {
    "Full Time": "border-emerald-400 text-emerald-600",
    "Part Time": "border-blue-400    text-blue-600",
    "Contract": "border-orange-400  text-orange-500",
    "Freelance": "border-violet-400  text-violet-600",
    "Internship": "border-rose-400    text-rose-600",
    "Marketing": "border-orange-400  text-orange-500",
    "Design": "border-violet-400  text-violet-600",
    "Development": "border-blue-400    text-blue-600",
    "Management": "border-rose-400    text-rose-600",
    "Technology": "border-cyan-400    text-cyan-600",
    "Finance": "border-emerald-400 text-emerald-600",
    "Engineering": "border-amber-400   text-amber-600",
};
const defaultTag = "border-slate-300 text-slate-500";

export function LatestJobs() {
    const [jobs, setJobs] = useState<Job[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch("/api/jobs")
            .then((r) => r.json())
            .then((data) => {
                if (data.success) {
                    // API already sorts by postedAt desc; take top 8
                    setJobs(data.data.slice(0, 8));
                }
            })
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    return (
        <section className="relative py-16 md:py-24 overflow-hidden bg-[#FBFBFD]">
            {/* Pattern — right half only */}
            <div
                className="absolute inset-y-0 right-0 w-1/2 pointer-events-none select-none"
                aria-hidden="true"
            >
                <img
                    src="/Pattern.png"
                    alt=""
                    className="w-full h-full object-cover object-left opacity-70"
                />
            </div>

            <div className="relative z-10 w-full max-w-[1440px] mx-auto px-3 lg:px-4 xl:px-0">

                {/* ── Header ── */}
                <div className="flex flex-wrap items-center justify-between gap-4 mb-10">
                    <h2 className="text-3xl md:text-4xl font-extrabold text-[#293241] tracking-tight">
                        Latest <span className="text-[#1C9CEA]">jobs open</span>
                    </h2>
                    <Link
                        href="/jobs"
                        className="flex items-center gap-1.5 text-sm font-bold text-[#4f46e5] hover:text-[#4338ca] transition-colors whitespace-nowrap"
                    >
                        Show all jobs <ArrowRight className="h-4 w-4" />
                    </Link>
                </div>

                {/* ── Loading skeleton ── */}
                {loading && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {Array.from({ length: 8 }).map((_, i) => (
                            <div key={i} className="flex items-start gap-5 bg-white rounded-2xl px-6 py-5 border border-slate-100 animate-pulse">
                                <div className="shrink-0 h-14 w-14 rounded-2xl bg-slate-200" />
                                <div className="flex-1 space-y-2 py-1">
                                    <div className="h-4 bg-slate-200 rounded w-3/4" />
                                    <div className="h-3 bg-slate-100 rounded w-1/2" />
                                    <div className="flex gap-2 mt-2">
                                        <div className="h-6 w-16 rounded-full bg-slate-100" />
                                        <div className="h-6 w-20 rounded-full bg-slate-100" />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* ── Job cards grid ── */}
                {!loading && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {jobs.map((job) => {
                            const color = avatarColor(job.companyName);
                            const letter = job.companyName.charAt(0).toUpperCase();
                            return (
                                <Link
                                    key={job._id}
                                    href={`/jobs`}
                                    className="group flex items-start gap-4 sm:gap-5 bg-white rounded-2xl px-5 sm:px-6 py-4 sm:py-5 border border-slate-100 hover:border-blue-200 hover:shadow-lg hover:shadow-blue-100/50 transition-all duration-200"
                                >
                                    {/* Company avatar */}
                                    {job.logoUrl ? (
                                        <img
                                            src={job.logoUrl}
                                            alt={job.companyName}
                                            className="shrink-0 h-12 w-12 sm:h-14 sm:w-14 rounded-2xl object-cover border border-slate-100"
                                        />
                                    ) : (
                                        <div
                                            className="shrink-0 h-12 w-12 sm:h-14 sm:w-14 rounded-2xl flex items-center justify-center text-white text-lg sm:text-xl font-extrabold shadow-sm"
                                            style={{ backgroundColor: color }}
                                        >
                                            {letter}
                                        </div>
                                    )}

                                    {/* Content */}
                                    <div className="flex flex-col gap-1 min-w-0 flex-1">
                                        <h3 className="text-sm sm:text-base font-extrabold text-[#293241] group-hover:text-[#1C9CEA] transition-colors line-clamp-1">
                                            {job.title}
                                        </h3>
                                        <p className="text-xs sm:text-sm text-slate-500 font-medium line-clamp-1">
                                            <span className="text-slate-700 font-semibold">{job.companyName}</span>
                                            {" • "}
                                            {job.location}
                                        </p>

                                        {/* Tags */}
                                        <div className="flex flex-wrap gap-1.5 mt-1.5">
                                            {/* Job type pill */}
                                            <span className={`text-[10px] sm:text-[11px] font-bold px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-full border bg-transparent ${TAG_STYLES[job.jobType] ?? defaultTag}`}>
                                                {job.jobType}
                                            </span>
                                            {/* Category pills (max 2) */}
                                            {job.categories.slice(0, 2).map((cat, j) => (
                                                <span
                                                    key={j}
                                                    className={`text-[10px] sm:text-[11px] font-bold px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-full border bg-transparent ${TAG_STYLES[cat] ?? defaultTag}`}
                                                >
                                                    {cat}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </Link>
                            );
                        })}

                        {!loading && jobs.length === 0 && (
                            <p className="col-span-2 text-center text-slate-400 py-12 font-medium">
                                No jobs posted yet.
                            </p>
                        )}
                    </div>
                )}
            </div>
        </section>
    );
}
