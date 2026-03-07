"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
    Plus, Pencil, Trash2, X, Check, Search, Tag, Settings, LayoutDashboard,
    Brain, Code, Smartphone, Database, BarChart, Shield, Cloud, Cpu,
    Gamepad2, Laptop, Network, Microscope, Layers, Wallet, Landmark,
    PieChart, Coins, Briefcase, FileText, Globe, Zap, Megaphone, Share2,
    TrendingUp, SearchCode, PenTool, Palette, Monitor, Box, Play,
    Camera, Image as ImageIcon, Shirt, Home, User
} from "lucide-react";
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
}

interface Category {
    _id: string;
    name: string;
    iconName: string;
}

const emptyJobForm = {
    title: "",
    companyName: "",
    location: "",
    jobType: "Full Time",
    description: "",
    salaryRange: "",
    featured: false,
    categories: [] as string[],
};

const emptyCategoryForm = {
    name: "",
    iconName: "Tag",
};

const SELECTABLE_ICONS = [
    "Tag", "Brain", "Code", "Smartphone", "Database", "BarChart", "Shield", "Cloud", "Cpu",
    "Gamepad2", "Laptop", "Network", "Microscope", "Layers", "Wallet", "Landmark",
    "PieChart", "Coins", "Briefcase", "FileText", "Globe", "Zap", "Megaphone", "Share2",
    "TrendingUp", "SearchCode", "PenTool", "Palette", "Monitor", "Box", "Play",
    "Camera", "ImageIcon", "Shirt", "Home", "User"
];

export default function AdminPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [jobs, setJobs] = useState<Job[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [loadingJobs, setLoadingJobs] = useState(true);
    const [loadingCats, setLoadingCats] = useState(true);
    const [jobForm, setJobForm] = useState(emptyJobForm);
    const [catForm, setCatForm] = useState(emptyCategoryForm);
    const [editingJobId, setEditingJobId] = useState<string | null>(null);
    const [editingCatId, setEditingCatId] = useState<string | null>(null);
    const [showJobForm, setShowJobForm] = useState(false);
    const [showCatForm, setShowCatForm] = useState(false);
    const [savingJob, setSavingJob] = useState(false);
    const [savingCat, setSavingCat] = useState(false);
    const [jobError, setJobError] = useState("");
    const [catError, setCatError] = useState("");
    const [view, setView] = useState<"jobs" | "categories">("jobs");

    useEffect(() => {
        if (status === "unauthenticated") router.push("/login");
    }, [status, router]);

    const fetchJobs = async () => {
        setLoadingJobs(true);
        try {
            const res = await fetch("/api/jobs");
            const data = await res.json();
            setJobs(data.data || []);
        } catch (err) {
            console.error(err);
        } finally {
            setLoadingJobs(false);
        }
    };

    const fetchCategories = async () => {
        setLoadingCats(true);
        try {
            const res = await fetch("/api/categories");
            const data = await res.json();
            setCategories(data.data || []);
        } catch (err) {
            console.error(err);
        } finally {
            setLoadingCats(false);
        }
    };

    useEffect(() => {
        if (status === "authenticated") {
            fetchJobs();
            fetchCategories();
        }
    }, [status]);

    const toggleJobCategory = (catName: string) => {
        setJobForm(prev => ({
            ...prev,
            categories: prev.categories.includes(catName)
                ? prev.categories.filter(c => c !== catName)
                : [...prev.categories, catName],
        }));
    };

    const handleJobSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSavingJob(true);
        setJobError("");
        try {
            const url = editingJobId ? `/api/jobs/${editingJobId}` : "/api/jobs";
            const method = editingJobId ? "PUT" : "POST";
            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(jobForm),
            });
            const data = await res.json();
            if (!res.ok) {
                setJobError(data.message || "Failed to save job.");
            } else {
                setJobForm(emptyJobForm);
                setEditingJobId(null);
                setShowJobForm(false);
                await fetchJobs();
            }
        } catch {
            setJobError("Something went wrong.");
        } finally {
            setSavingJob(false);
        }
    };

    const handleCatSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSavingCat(true);
        setCatError("");
        try {
            const url = editingCatId ? `/api/categories/${editingCatId}` : "/api/categories";
            const method = editingCatId ? "PUT" : "POST";
            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(catForm),
            });
            const data = await res.json();
            if (!res.ok) {
                setCatError(data.message || "Failed to save category.");
            } else {
                setCatForm(emptyCategoryForm);
                setEditingCatId(null);
                setShowCatForm(false);
                await fetchCategories();
            }
        } catch {
            setCatError("Something went wrong.");
        } finally {
            setSavingCat(false);
        }
    };

    const handleJobEdit = (job: Job) => {
        setJobForm({
            title: job.title,
            companyName: job.companyName,
            location: job.location,
            jobType: job.jobType,
            description: job.description,
            salaryRange: job.salaryRange || "",
            featured: job.featured,
            categories: job.categories || [],
        });
        setEditingJobId(job._id);
        setShowJobForm(true);
        setView("jobs");
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const handleJobDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this job?")) return;
        try {
            const res = await fetch(`/api/jobs/${id}`, { method: "DELETE" });
            if (res.ok) {
                // Optimistic UI update
                setJobs(prev => prev.filter(job => job._id !== id));
            } else {
                const data = await res.json();
                alert(data.message || "Failed to delete job.");
            }
        } catch (err) {
            alert("An error occurred while deleting.");
        }
    };

    const handleCatEdit = (cat: Category) => {
        setCatForm({
            name: cat.name,
            iconName: cat.iconName,
        });
        setEditingCatId(cat._id);
        setShowCatForm(true);
        setView("categories");
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const handleCatDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this category?")) return;
        try {
            const res = await fetch(`/api/categories/${id}`, { method: "DELETE" });
            if (res.ok) {
                // Optimistic UI update
                setCategories(prev => prev.filter(cat => cat._id !== id));
            } else {
                const data = await res.json();
                alert(data.message || "Failed to delete category.");
            }
        } catch (err) {
            alert("An error occurred while deleting.");
        }
    };

    if (status === "loading") {
        return (
            <div className="container mx-auto max-w-7xl flex h-[calc(100vh-4rem)] items-center justify-center">
                <p>Loading...</p>
            </div>
        );
    }

    return (
        <div className="container mx-auto max-w-7xl py-12 px-4 md:px-6 min-h-[calc(100vh-4rem)] bg-slate-50/30">
            <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900">
                        Admin <span className="text-blue-600 font-extrabold italic">Dashboard</span>
                    </h1>
                    <div className="flex bg-white p-1 rounded-xl border mt-4 shadow-sm w-fit">
                        <button
                            onClick={() => setView("jobs")}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${view === "jobs" ? "bg-blue-600 text-white shadow-md shadow-blue-200" : "text-slate-500 hover:text-slate-900"}`}
                        >
                            <LayoutDashboard className="h-4 w-4" /> Manage Jobs
                        </button>
                        <button
                            onClick={() => setView("categories")}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${view === "categories" ? "bg-blue-600 text-white shadow-md shadow-blue-200" : "text-slate-500 hover:text-slate-900"}`}
                        >
                            <Settings className="h-4 w-4" /> Manage Categories
                        </button>
                    </div>
                </div>
                <div className="flex gap-3">
                    {view === "jobs" && !showJobForm && (
                        <Button className="bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-100 font-bold px-6" onClick={() => setShowJobForm(true)}>
                            <Plus className="h-5 w-5 mr-2" /> Add New Job
                        </Button>
                    )}
                    {view === "categories" && !showCatForm && (
                        <Button className="bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-100 font-bold px-6" onClick={() => setShowCatForm(true)}>
                            <Plus className="h-5 w-5 mr-2" /> Define Category
                        </Button>
                    )}
                </div>
            </div>

            {/* Forms Section */}
            <div className="mb-8">
                {showJobForm && view === "jobs" && (
                    <Card className="border-2 border-blue-100 shadow-xl rounded-2xl overflow-hidden animate-in fade-in slide-in-from-top-4 duration-300">
                        <CardHeader className="bg-slate-50 border-b flex flex-row items-center justify-between py-4">
                            <CardTitle className="text-xl font-bold text-slate-800">{editingJobId ? "Edit Job Listing" : "Post New Job"}</CardTitle>
                            <Button variant="ghost" size="icon" className="hover:bg-blue-100 text-slate-500" onClick={() => { setShowJobForm(false); setEditingJobId(null); setJobForm(emptyJobForm); }}>
                                <X className="h-5 w-5" />
                            </Button>
                        </CardHeader>
                        <CardContent className="pt-6">
                            <form onSubmit={handleJobSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {jobError && (
                                    <div className="col-span-full p-4 bg-red-50 border border-red-200 rounded-xl text-sm font-medium text-red-600 flex items-center gap-2">
                                        <span className="h-2 w-2 rounded-full bg-red-600" /> {jobError}
                                    </div>
                                )}
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-700">Job Title</label>
                                    <Input placeholder="e.g. Senior UX Designer" className="rounded-xl border-slate-200 h-11" value={jobForm.title} onChange={e => setJobForm({ ...jobForm, title: e.target.value })} required />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-700">Company Name</label>
                                    <Input placeholder="e.g. Figma Inc." className="rounded-xl border-slate-200 h-11" value={jobForm.companyName} onChange={e => setJobForm({ ...jobForm, companyName: e.target.value })} required />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-700">Location</label>
                                    <Input placeholder="e.g. Remote, San Francisco CA" className="rounded-xl border-slate-200 h-11" value={jobForm.location} onChange={e => setJobForm({ ...jobForm, location: e.target.value })} required />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-700">Job Type</label>
                                    <select
                                        value={jobForm.jobType}
                                        onChange={e => setJobForm({ ...jobForm, jobType: e.target.value })}
                                        className="flex h-11 w-full rounded-xl border border-slate-200 bg-background px-3 py-2 text-sm outline-none focus:border-blue-500 transition-colors font-medium"
                                        required
                                    >
                                        {["Full Time", "Part Time", "Contract", "Freelance", "Internship"].map(t => (
                                            <option key={t} value={t}>{t}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-700">Salary Range</label>
                                    <Input placeholder="e.g. $80k - $120k" className="rounded-xl border-slate-200 h-11" value={jobForm.salaryRange} onChange={e => setJobForm({ ...jobForm, salaryRange: e.target.value })} />
                                </div>
                                <div className="flex items-center gap-3 md:mt-10">
                                    <input
                                        type="checkbox"
                                        id="featured"
                                        checked={jobForm.featured}
                                        onChange={e => setJobForm({ ...jobForm, featured: e.target.checked })}
                                        className="h-5 w-5 accent-blue-600 cursor-pointer rounded-lg"
                                    />
                                    <label htmlFor="featured" className="text-sm font-bold text-slate-700 cursor-pointer">Mark as Featured Job</label>
                                </div>

                                <div className="col-span-full space-y-3">
                                    <label className="text-sm font-bold text-slate-700">Target Categories</label>
                                    <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto p-4 border border-slate-200 rounded-2xl bg-white shadow-inner">
                                        {categories.map(cat => (
                                            <button
                                                key={cat._id}
                                                type="button"
                                                onClick={() => toggleJobCategory(cat.name)}
                                                className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${jobForm.categories.includes(cat.name)
                                                    ? "bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-100"
                                                    : "bg-slate-50 text-slate-600 border-slate-200 hover:border-blue-400 hover:text-blue-600 hover:bg-white"
                                                    }`}
                                            >
                                                {cat.name}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="col-span-full space-y-2">
                                    <label className="text-sm font-bold text-slate-700">Job Description</label>
                                    <textarea
                                        placeholder="Describe the role, responsibilities, and requirements..."
                                        value={jobForm.description}
                                        onChange={e => setJobForm({ ...jobForm, description: e.target.value })}
                                        className="flex min-h-[160px] w-full rounded-2xl border border-slate-200 bg-background px-4 py-3 text-sm outline-none focus:border-blue-500 transition-colors resize-none font-medium leading-relaxed shadow-sm"
                                        required
                                    />
                                </div>
                                <div className="col-span-full flex gap-3 pt-4 border-t border-slate-100">
                                    <Button type="submit" className="bg-blue-600 hover:bg-blue-700 font-bold px-8 py-6 rounded-xl" disabled={savingJob}>
                                        <Check className="h-5 w-5 mr-2" />{savingJob ? "Processing..." : editingJobId ? "Update Listing" : "Publish Job"}
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                )}

                {showCatForm && view === "categories" && (
                    <Card className="border-2 border-blue-100 shadow-xl rounded-2xl max-w-xl mx-auto overflow-hidden animate-in fade-in slide-in-from-top-4 duration-300">
                        <CardHeader className="bg-slate-50 border-b flex flex-row items-center justify-between py-4">
                            <CardTitle className="text-xl font-bold text-slate-800">{editingCatId ? "Edit Category" : "Define New Category"}</CardTitle>
                            <Button variant="ghost" size="icon" className="hover:bg-blue-100 text-slate-500" onClick={() => { setShowCatForm(false); setEditingCatId(null); setCatForm(emptyCategoryForm); }}>
                                <X className="h-5 w-5" />
                            </Button>
                        </CardHeader>
                        <CardContent className="pt-6">
                            <form onSubmit={handleCatSubmit} className="space-y-6">
                                {catError && (
                                    <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-sm font-medium text-red-600">
                                        {catError}
                                    </div>
                                )}
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-700">Category Name</label>
                                    <Input placeholder="e.g. Data Science" className="rounded-xl border-slate-200 h-12" value={catForm.name} onChange={e => setCatForm({ ...catForm, name: e.target.value })} required />
                                </div>
                                <div className="space-y-3">
                                    <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                                        Choose Category Icon <span className="text-slate-400 font-normal">(Visual Picker)</span>
                                    </label>
                                    <div className="grid grid-cols-6 gap-2 p-3 border rounded-2xl bg-slate-50 max-h-48 overflow-y-auto">
                                        {SELECTABLE_ICONS.map(iconName => {
                                            // @ts-ignore
                                            const IconComponent = Icons[iconName] || Tag;
                                            const isSelected = catForm.iconName === iconName;
                                            return (
                                                <button
                                                    key={iconName}
                                                    type="button"
                                                    onClick={() => setCatForm({ ...catForm, iconName })}
                                                    className={`aspect-square flex items-center justify-center rounded-xl transition-all ${isSelected
                                                        ? "bg-blue-600 text-white shadow-md shadow-blue-200 scale-110"
                                                        : "bg-white text-slate-500 border hover:border-blue-300 hover:text-blue-600"
                                                        }`}
                                                    title={iconName}
                                                >
                                                    <IconComponent className="h-5 w-5" />
                                                </button>
                                            );
                                        })}
                                    </div>
                                    <div className="flex items-center gap-4 p-4 bg-white border rounded-2xl">
                                        <p className="text-xs font-bold text-slate-400 uppercase">Preview:</p>
                                        <div className="h-10 w-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100">
                                            {(() => {
                                                // @ts-ignore
                                                const PreviewIcon = Icons[catForm.iconName] || Tag;
                                                return <PreviewIcon className="h-5 w-5" />;
                                            })()}
                                        </div>
                                        <span className="text-sm font-bold text-slate-700">{catForm.iconName}</span>
                                    </div>
                                </div>
                                <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 font-bold py-6 rounded-xl shadow-lg shadow-blue-100 transition-transform active:scale-95" disabled={savingCat}>
                                    <Check className="h-5 w-5 mr-2" />{savingCat ? "Saving..." : editingCatId ? "Update Category" : "Register Category"}
                                </Button>
                            </form>
                        </CardContent>
                    </Card>
                )}
            </div>

            {/* Lists Section */}
            <Card className="border shadow-lg rounded-2xl overflow-hidden bg-white">
                <CardHeader className="border-b py-5">
                    <CardTitle className="text-xl font-bold text-slate-800 flex items-center gap-3">
                        {view === "jobs" ? (
                            <><LayoutDashboard className="h-5 w-5 text-blue-600" /> All Job Listings ({jobs.length})</>
                        ) : (
                            <><Settings className="h-5 w-5 text-blue-600" /> Active Job Categories ({categories.length})</>
                        )}
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    {view === "jobs" ? (
                        loadingJobs ? (
                            <div className="p-20 text-center"><p className="text-slate-400 font-medium animate-pulse">Syncing job database...</p></div>
                        ) : jobs.length === 0 ? (
                            <div className="p-20 text-center text-slate-400 font-medium">No job postings found.</div>
                        ) : (
                            <div className="divide-y border-t-0">
                                {jobs.map(job => (
                                    <div key={job._id} className="flex flex-col md:flex-row md:items-center justify-between gap-6 px-8 py-6 hover:bg-blue-50/40 transition-all group">
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-3 flex-wrap mb-1">
                                                <span className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors">{job.title}</span>
                                                {job.featured && <Badge className="bg-yellow-400 text-yellow-900 border-transparent text-[10px] font-black tracking-widest uppercase rounded-md px-2 ring-2 ring-yellow-400/20">Featured</Badge>}
                                            </div>
                                            <div className="flex items-center gap-2 text-sm text-slate-500 font-medium mb-3">
                                                <span className="text-blue-600 font-bold">{job.companyName}</span>
                                                <span className="text-slate-300">•</span>
                                                <span>{job.location}</span>
                                                <span className="text-slate-300">•</span>
                                                <span className="bg-slate-100 text-slate-700 px-2 rounded-md font-bold text-[10px] uppercase">{job.jobType}</span>
                                            </div>
                                            <div className="flex gap-1.5 mt-2 flex-wrap">
                                                {job.categories?.map(c => (
                                                    <span key={c} className="text-[10px] bg-white text-blue-700 px-3 py-1 rounded-full border border-blue-100 shadow-sm font-bold uppercase tracking-tight">{c}</span>
                                                ))}
                                            </div>
                                        </div>
                                        <div className="flex gap-3 shrink-0">
                                            <Button size="sm" variant="outline" className="rounded-xl border-slate-200 hover:border-blue-300 hover:bg-blue-50 font-bold" onClick={() => handleJobEdit(job)}>
                                                <Pencil className="h-4 w-4 mr-2" />Edit
                                            </Button>
                                            <Button size="sm" variant="outline" onClick={() => handleJobDelete(job._id)} className="rounded-xl text-red-500 hover:text-white hover:bg-red-500 border-red-100 hover:border-red-500 font-bold transition-all shadow-sm">
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )
                    ) : (
                        loadingCats ? (
                            <div className="p-20 text-center"><p className="text-slate-400 font-medium animate-pulse">Syncing category database...</p></div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-8">
                                {categories.map(cat => {
                                    // @ts-ignore
                                    const Icon = Icons[cat.iconName] || Tag;
                                    return (
                                        <div key={cat._id} className="flex flex-col gap-4 p-5 border-2 border-slate-100 rounded-3xl hover:border-blue-200 hover:shadow-xl hover:shadow-blue-50 transition-all group bg-white relative cursor-pointer">
                                            <div className="flex items-center justify-between">
                                                <div className="h-12 w-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-all shadow-inner">
                                                    <Icon className="h-6 w-6" />
                                                </div>
                                                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <button onClick={(e) => { e.stopPropagation(); handleCatEdit(cat); }} className="h-8 w-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center hover:bg-blue-600 hover:text-white transition-colors">
                                                        <Pencil className="h-3.5 w-3.5" />
                                                    </button>
                                                    <button onClick={(e) => { e.stopPropagation(); handleCatDelete(cat._id); }} className="h-8 w-8 rounded-full bg-red-50 text-red-500 flex items-center justify-center hover:bg-red-500 hover:text-white transition-colors">
                                                        <Trash2 className="h-3.5 w-3.5" />
                                                    </button>
                                                </div>
                                            </div>
                                            <div>
                                                <span className="text-base font-extrabold text-slate-800 line-clamp-1">{cat.name}</span>
                                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Industrial Category</p>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
