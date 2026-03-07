"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { ArrowLeft, Briefcase, MapPin, Clock, DollarSign, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import * as Icons from "lucide-react";

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

interface Category {
    _id: string;
    name: string;
    iconName: string;
    jobCount: number;
}

function CategoriesContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const selectedCat = searchParams.get("cat") || "";
    const [jobs, setJobs] = useState<Job[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [jobsRes, catsRes] = await Promise.all([
                    fetch("/api/jobs"),
                    fetch("/api/categories")
                ]);
                const jobsData = await jobsRes.json();
                const catsData = await catsRes.json();
                setJobs(jobsData.data || []);
                setCategories(catsData.data || []);
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const getJobsForCat = (catName: string) => {
        return jobs.filter(j => j.categories?.includes(catName));
    };

    const filteredJobs = selectedCat ? getJobsForCat(selectedCat) : [];

    const timeAgo = (dateStr: string) => {
        const days = Math.floor((Date.now() - new Date(dateStr).getTime()) / 86400000);
        if (days === 0) return "Today";
        if (days === 1) return "Yesterday";
        return `${days} days ago`;
    };

    return (
        <div className="min-h-[calc(100vh-4rem)] bg-slate-50">
            <div className="bg-white border-b">
                <div className="container mx-auto max-w-7xl px-4 md:px-6 py-10">
                    <h1 className="text-3xl font-bold text-slate-900 mb-1">
                        Explore by <span className="text-blue-600">category</span>
                    </h1>
                    <p className="text-slate-500">Browse {categories.length} job categories</p>
                </div>
            </div>

            <div className="container mx-auto max-w-7xl px-4 md:px-6 py-8">
                {selectedCat && (
                    <div className="mb-16">
                        <div className="flex items-center gap-3 mb-6">
                            <button
                                onClick={() => router.push("/categories")}
                                className="flex items-center gap-1 text-sm text-slate-500 hover:text-blue-600 transition-colors cursor-pointer"
                            >
                                <ArrowLeft className="h-4 w-4" /> Back to all categories
                            </button>
                            <span className="text-slate-300">|</span>
                            <h2 className="text-lg font-bold text-slate-900">{selectedCat} Jobs</h2>
                            <Badge className="bg-blue-100 text-blue-700 border-transparent font-bold">{filteredJobs.length}</Badge>
                        </div>

                        {filteredJobs.length === 0 ? (
                            <div className="bg-white rounded-xl border border-slate-200 flex flex-col items-center justify-center py-20 text-center">
                                <Briefcase className="h-10 w-10 text-slate-300 mb-3" />
                                <h3 className="font-semibold text-slate-900 mb-1">No jobs in {selectedCat} yet</h3>
                                <p className="text-slate-500 text-sm max-w-xs">Be the first to post a job in this category!</p>
                            </div>
                        ) : (
                            <div className="grid gap-4">
                                {filteredJobs.map(job => (
                                    <div
                                        key={job._id}
                                        className={`bg-white rounded-xl border p-6 hover:shadow-lg transition-all ${job.featured ? "border-blue-200 ring-1 ring-blue-50" : "border-slate-200"}`}
                                    >
                                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2 flex-wrap mb-1">
                                                    <h2 className="text-lg font-bold text-slate-900">{job.title}</h2>
                                                    {job.featured && <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200 text-[10px] font-bold uppercase tracking-wider">Featured</Badge>}
                                                </div>
                                                <p className="text-blue-600 font-semibold text-sm mb-3">{job.companyName}</p>
                                                <div className="flex flex-wrap gap-4 text-xs font-medium text-slate-500">
                                                    <span className="flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5" />{job.location}</span>
                                                    <span className="flex items-center gap-1.5"><Briefcase className="h-3.5 w-3.5" />{job.jobType}</span>
                                                    {job.salaryRange && <span className="flex items-center gap-1.5"><DollarSign className="h-3.5 w-3.5" />{job.salaryRange}</span>}
                                                    <span className="flex items-center gap-1.5"><Clock className="h-3.5 w-3.5" />{timeAgo(job.postedAt)}</span>
                                                </div>
                                            </div>
                                            <div className="shrink-0">
                                                <Button className="bg-blue-600 hover:bg-blue-700 font-bold px-8 transition-transform hover:scale-105">View Details</Button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                <div>
                    {selectedCat && (
                        <h2 className="text-xl font-bold text-slate-900 mb-6">Explore other categories</h2>
                    )}
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 mb-10">
                        {categories.filter(cat => cat.name !== selectedCat).map(cat => {
                            // @ts-ignore
                            const Icon = Icons[cat.iconName] || Tag;
                            const count = getJobsForCat(cat.name).length;
                            return (
                                <button
                                    key={cat._id}
                                    onClick={() => router.push(`/categories?cat=${encodeURIComponent(cat.name)}`)}
                                    className="group flex flex-col items-start rounded-2xl p-5 border text-left transition-all cursor-pointer hover:shadow-md bg-white border-slate-200 text-slate-900 hover:border-blue-200"
                                >
                                    <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-xl transition-colors bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white">
                                        <Icon className="h-5 w-5" />
                                    </div>
                                    <h3 className="font-semibold text-sm leading-tight mb-1 truncate w-full">{cat.name}</h3>
                                    <p className="text-[10px] uppercase font-bold tracking-wider text-slate-400 group-hover:text-blue-500">
                                        {loading ? "..." : `${count} position${count !== 1 ? "s" : ""}`}
                                    </p>
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function CategoriesPage() {
    return (
        <Suspense fallback={<div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">Loading categories...</div>}>
            <CategoriesContent />
        </Suspense>
    );
}
