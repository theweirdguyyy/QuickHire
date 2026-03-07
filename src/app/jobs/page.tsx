"use client";
import Link from "next/link";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MapPin, Clock, DollarSign, Search, Briefcase } from "lucide-react";

interface Job {
    _id: string;
    title: string;
    companyName: string;
    location: string;
    jobType: string;
    description: string;
    salaryRange?: string;
    featured: boolean;
    categories: string[];
    postedAt: string;
}

const JOB_TYPES = ["All", "Full Time", "Part Time", "Contract", "Freelance", "Internship"];

function JobsContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const [jobs, setJobs] = useState<Job[]>([]);
    const [filtered, setFiltered] = useState<Job[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState(searchParams.get("q") || "");
    const [locationFilter, setLocationFilter] = useState(searchParams.get("location") || "");
    const [categoryFilter, setCategoryFilter] = useState(searchParams.get("category") || "");
    const [activeType, setActiveType] = useState("All");

    useEffect(() => {
        fetch("/api/jobs")
            .then(r => r.json())
            .then(data => {
                setJobs(data.data || []);
                setLoading(false);
            });
    }, []);

    useEffect(() => {
        let result = jobs;
        if (activeType !== "All") result = result.filter(j => j.jobType === activeType);
        if (categoryFilter.trim()) {
            result = result.filter(j =>
                j.categories?.some(c => c.toLowerCase() === categoryFilter.toLowerCase())
            );
        }
        if (search.trim()) {
            const q = search.toLowerCase();
            result = result.filter(j =>
                j.title.toLowerCase().includes(q) ||
                j.companyName.toLowerCase().includes(q) ||
                j.description?.toLowerCase().includes(q) ||
                j.categories?.some(c => c.toLowerCase().includes(q))
            );
        }
        if (locationFilter.trim()) {
            const loc = locationFilter.toLowerCase();
            result = result.filter(j => j.location.toLowerCase().includes(loc));
        }
        setFiltered(result);
    }, [search, locationFilter, categoryFilter, activeType, jobs]);

    const timeAgo = (dateStr: string) => {
        const days = Math.floor((Date.now() - new Date(dateStr).getTime()) / 86400000);
        if (days === 0) return "Today";
        if (days === 1) return "Yesterday";
        return `${days} days ago`;
    };

    return (
        <div className="min-h-[calc(100vh-4rem)] bg-slate-50">
            {/* Header */}
            <div className="bg-white border-b">
                <div className="container mx-auto max-w-7xl px-4 md:px-6 py-10">
                    <h1 className="text-3xl font-bold text-slate-900 mb-1">
                        Find your <span className="text-blue-600">dream job</span>
                    </h1>
                    <p className="text-slate-500 mb-6">{jobs.length} jobs available</p>

                    {/* Search bars */}
                    <div className="flex flex-col sm:flex-row gap-3 mb-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                            <Input
                                placeholder="Job title, keyword, or company..."
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                                className="pl-9 h-11"
                            />
                        </div>
                        <div className="relative flex-1">
                            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                            <Input
                                placeholder="City, country, or Remote..."
                                value={locationFilter}
                                onChange={e => setLocationFilter(e.target.value)}
                                className="pl-9 h-11"
                            />
                        </div>
                        {(search || locationFilter || categoryFilter) && (
                            <Button variant="outline" className="h-11 shrink-0" onClick={() => { setSearch(""); setLocationFilter(""); setCategoryFilter(""); }}>
                                Clear
                            </Button>
                        )}
                    </div>

                    {/* Filter tabs */}
                    <div className="flex gap-2 flex-wrap">
                        {JOB_TYPES.map(t => (
                            <button
                                key={t}
                                onClick={() => setActiveType(t)}
                                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors cursor-pointer border ${activeType === t
                                    ? "bg-blue-600 text-white border-blue-600"
                                    : "bg-white text-slate-600 border-slate-200 hover:border-blue-300 hover:text-blue-600"
                                    }`}
                            >
                                {t}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Job list */}
            <div className="container mx-auto max-w-7xl px-4 md:px-6 py-8">
                {loading ? (
                    <div className="flex items-center justify-center py-24">
                        <p className="text-slate-500">Loading jobs...</p>
                    </div>
                ) : filtered.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-24 text-center">
                        <div className="h-16 w-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                            <Briefcase className="h-7 w-7 text-slate-400" />
                        </div>
                        <h3 className="text-lg font-semibold text-slate-900 mb-1">No jobs found</h3>
                        <p className="text-slate-500 max-w-sm">Try adjusting your search or filter to find what you're looking for.</p>
                        <Button className="mt-6 bg-blue-600 hover:bg-blue-700" onClick={() => { setSearch(""); setLocationFilter(""); setCategoryFilter(""); setActiveType("All"); }}>
                            Clear filters
                        </Button>
                    </div>
                ) : (
                    <>
                        <p className="text-sm text-slate-500 mb-4">{filtered.length} result{filtered.length !== 1 ? "s" : ""} found</p>
                        <div className="grid gap-4">
                            {filtered.map(job => (
                                <div
                                    key={job._id}
                                    className={`bg-white rounded-xl border p-6 hover:shadow-md transition-shadow ${job.featured ? "border-blue-200 ring-1 ring-blue-100" : "border-slate-200"}`}
                                >
                                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 flex-wrap mb-1">
                                                <Link href={`/jobs/${job._id}`} className="hover:underline hover:text-blue-600 transition-colors">
                                                    <h2 className="text-lg font-semibold text-slate-900">{job.title}</h2>
                                                </Link>
                                                {job.featured && <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200 text-xs">Featured</Badge>}
                                            </div>
                                            <p className="text-blue-600 font-medium text-sm mb-3">{job.companyName}</p>
                                            <div className="flex flex-wrap gap-4 text-sm text-slate-500">
                                                <span className="flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5" />{job.location}</span>
                                                <span className="flex items-center gap-1.5"><Briefcase className="h-3.5 w-3.5" />{job.jobType}</span>
                                                {job.salaryRange && <span className="flex items-center gap-1.5"><DollarSign className="h-3.5 w-3.5" />{job.salaryRange}</span>}
                                                <span className="flex items-center gap-1.5"><Clock className="h-3.5 w-3.5" />{timeAgo(job.postedAt)}</span>
                                            </div>
                                            {job.description && <p className="mt-3 text-sm text-slate-600 line-clamp-2">{job.description}</p>}
                                            {job.categories?.length > 0 && (
                                                <div className="flex gap-1.5 mt-3 flex-wrap">
                                                    {job.categories.map(c => (
                                                        <span key={c} className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full border border-blue-100">{c}</span>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                        <div className="shrink-0">
                                            <Link href={`/jobs/${job._id}/apply`}>
                                                <Button className="bg-blue-600 hover:bg-blue-700 w-full md:w-auto">Apply Now</Button>
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}

export default function JobsPage() {
    return (
        <Suspense fallback={<div className="flex items-center justify-center min-h-[calc(100vh-4rem)]"><p>Loading...</p></div>}>
            <JobsContent />
        </Suspense>
    );
}
