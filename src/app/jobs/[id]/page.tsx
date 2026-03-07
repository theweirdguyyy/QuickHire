"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Briefcase, ArrowLeft, MapPin, DollarSign, Clock } from "lucide-react";
import Link from "next/link";

export default function JobDetailsPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const router = useRouter();
    const [job, setJob] = useState<any>(null);
    const [loadingJob, setLoadingJob] = useState(true);

    useEffect(() => {
        fetch(`/api/jobs/${id}`)
            .then(async (r) => {
                const data = await r.json();
                if (data.success) {
                    setJob(data.data);
                } else {
                    setJob(null);
                }
                setLoadingJob(false);
            })
            .catch(() => {
                setJob(null);
                setLoadingJob(false);
            });
    }, [id]);

    if (loadingJob) {
        return <div className="min-h-[calc(100vh-4rem)] flex justify-center items-center bg-slate-50">Loading job details...</div>;
    }

    if (!job) {
        return (
            <div className="min-h-[calc(100vh-4rem)] flex flex-col justify-center items-center bg-slate-50 gap-4">
                <h2 className="text-2xl font-bold">Job Not Found</h2>
                <Button variant="outline" onClick={() => router.push('/jobs')}>Back to Jobs</Button>
            </div>
        );
    }

    const timeAgo = (dateStr: string) => {
        if (!dateStr) return "";
        const days = Math.floor((Date.now() - new Date(dateStr).getTime()) / 86400000);
        if (days === 0) return "Today";
        if (days === 1) return "Yesterday";
        return `${days} days ago`;
    };

    return (
        <div className="min-h-[calc(100vh-4rem)] bg-slate-50 py-12 px-4 md:px-6">
            <div className="container max-w-[1400px] mx-auto flex flex-col lg:flex-row gap-8 items-start">

                {/* Left Side: Title and Description */}
                <div className="w-full lg:w-2/3 space-y-6">
                    <div className="bg-white p-8 md:p-10 rounded-2xl border shadow-sm">
                        <Link href="/jobs" className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-500 hover:text-slate-900 transition-colors mb-6">
                            <ArrowLeft className="h-4 w-4" /> Back to jobs
                        </Link>
                        <div className="h-16 w-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-6 border border-blue-100">
                            <Briefcase className="h-8 w-8 opacity-60" />
                        </div>
                        <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 mb-2 leading-tight break-words">{job.title}</h1>
                        <p className="text-blue-600 font-semibold text-lg mb-8">{job.companyName}</p>

                        <div className="space-y-6">
                            <h3 className="text-xl font-bold text-slate-900">Job Description</h3>
                            <div className="text-slate-600 leading-relaxed text-base whitespace-pre-wrap break-words">
                                {job.description || "No description provided."}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Side: Meta Info & Apply Button */}
                <div className="w-full lg:w-1/3 space-y-6">
                    <div className="bg-white p-6 md:p-8 rounded-2xl border shadow-sm sticky top-24">
                        <Link href={`/jobs/${job._id}/apply`}>
                            <Button className="w-full font-bold bg-blue-600 hover:bg-blue-700 h-12 text-[15px] mb-8 shadow-sm">
                                Apply for this Position
                            </Button>
                        </Link>

                        <h3 className="text-sm font-bold text-slate-900 mb-4 uppercase tracking-wider border-b pb-2">Job Overview</h3>

                        <div className="space-y-5">
                            <div className="flex items-start gap-4">
                                <div className="h-10 w-10 rounded-full bg-slate-50 flex items-center justify-center shrink-0 text-slate-500">
                                    <MapPin className="h-5 w-5" />
                                </div>
                                <div>
                                    <p className="text-sm text-slate-500 font-medium">Location</p>
                                    <p className="font-semibold text-slate-900">{job.location}</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="h-10 w-10 rounded-full bg-slate-50 flex items-center justify-center shrink-0 text-slate-500">
                                    <Briefcase className="h-5 w-5" />
                                </div>
                                <div>
                                    <p className="text-sm text-slate-500 font-medium">Job Type</p>
                                    <p className="font-semibold text-slate-900">{job.jobType}</p>
                                </div>
                            </div>

                            {job.salaryRange && (
                                <div className="flex items-start gap-4">
                                    <div className="h-10 w-10 rounded-full bg-slate-50 flex items-center justify-center shrink-0 text-slate-500">
                                        <DollarSign className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-slate-500 font-medium">Salary</p>
                                        <p className="font-semibold text-slate-900">{job.salaryRange}</p>
                                    </div>
                                </div>
                            )}

                            <div className="flex items-start gap-4">
                                <div className="h-10 w-10 rounded-full bg-slate-50 flex items-center justify-center shrink-0 text-slate-500">
                                    <Clock className="h-5 w-5" />
                                </div>
                                <div>
                                    <p className="text-sm text-slate-500 font-medium">Posted</p>
                                    <p className="font-semibold text-slate-900">{timeAgo(job.postedAt)}</p>
                                </div>
                            </div>
                        </div>

                        {job.categories && job.categories.length > 0 && (
                            <div className="mt-8 pt-6 border-t">
                                <h3 className="text-sm font-bold text-slate-900 mb-4 uppercase tracking-wider">Categories</h3>
                                <div className="flex gap-2 flex-wrap">
                                    {job.categories.map((c: string) => (
                                        <Badge key={c} variant="secondary" className="bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200 hover:text-slate-900">
                                            {c}
                                        </Badge>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
}
