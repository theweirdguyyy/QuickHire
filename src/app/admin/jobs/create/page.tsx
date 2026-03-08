"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function CreateJobPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [categories, setCategories] = useState<any[]>([]);

    const [formData, setFormData] = useState({
        title: "",
        companyName: "",
        location: "",
        jobType: "Full Time",
        categories: [] as string[],
        description: "",
        salaryRange: "",
        logoUrl: "",
    });

    useEffect(() => {
        fetch("/api/categories")
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    setCategories(data.data);
                }
            });
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await fetch("/api/jobs", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ...formData, featured: true }),
            });
            const data = await res.json();
            if (data.success) {
                router.push("/admin/jobs");
            } else {
                alert(data.message || "Failed to create job");
            }
        } catch (error) {
            console.error(error);
            alert("Error creating job");
        } finally {
            setLoading(false);
        }
    };

    // Simple logic for categories selection
    const handleCategoryToggle = (categoryName: string) => {
        setFormData(prev => {
            const cats = prev.categories.includes(categoryName)
                ? prev.categories.filter(c => c !== categoryName)
                : [...prev.categories, categoryName];
            return { ...prev, categories: cats };
        });
    };

    return (
        <div className="max-w-[1400px] mx-auto space-y-8">
            {/* Header */}
            <div className="flex items-center gap-5">
                <Link href="/admin/jobs">
                    <Button variant="ghost" size="icon" className="text-slate-400 hover:text-white hover:bg-white/5 transition-all rounded-xl">
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                </Link>
                <div>
                    <h1 className="text-3xl font-black tracking-tight text-white mb-1 uppercase">Create New Job</h1>
                    <p className="text-slate-500 text-sm font-medium tracking-wide">Configure a new career opportunity for the platform.</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* ── Left: Main Form (8/12) ── */}
                <div className="lg:col-span-8 space-y-6">
                    <div className="bg-[#111] rounded-2xl p-6 md:p-8 shadow-2xl shadow-black/60 border border-white/[0.02]">
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-6">Primary Details</p>

                        <div className="space-y-6">
                            <div className="space-y-2">
                                <Label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Job Title</Label>
                                <Input
                                    required
                                    name="title"
                                    value={formData.title}
                                    onChange={handleChange}
                                    className="bg-[#1a1a1a] border-none text-white h-12 focus-visible:ring-1 focus-visible:ring-blue-500/50 rounded-xl px-4"
                                    placeholder="e.g. Senior Software Architect"
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Company Name</Label>
                                    <Input required name="companyName" value={formData.companyName} onChange={handleChange} className="bg-[#1a1a1a] border-none text-white h-11 focus-visible:ring-1 focus-visible:ring-blue-500/50 rounded-xl px-4" placeholder="Acme Corp" />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Location</Label>
                                    <Input required name="location" value={formData.location} onChange={handleChange} className="bg-[#1a1a1a] border-none text-white h-11 focus-visible:ring-1 focus-visible:ring-blue-500/50 rounded-xl px-4" placeholder="London, UK or Remote" />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Job Description</Label>
                                <Textarea
                                    required
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    className="bg-[#1a1a1a] border-none text-white min-h-[400px] focus-visible:ring-1 focus-visible:ring-blue-500/50 rounded-xl p-4 resize-none leading-relaxed custom-scrollbar"
                                    placeholder="Outline the role, responsibilities, and requirements..."
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* ── Right: Sidebar Specs (4/12) ── */}
                <div className="lg:col-span-4 space-y-6">
                    <div className="bg-[#111] rounded-2xl p-6 shadow-2xl shadow-black/60 border border-white/[0.02] sticky top-8">
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-6">Job Specifications</p>

                        <div className="space-y-6">
                            <div className="space-y-2">
                                <Label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Employment Type</Label>
                                <div className="relative">
                                    <select
                                        name="jobType"
                                        value={formData.jobType}
                                        onChange={handleChange}
                                        className="w-full h-11 rounded-xl bg-[#1a1a1a] border-none text-white px-4 text-sm font-medium outline-none focus:ring-1 focus:ring-blue-500/50 transition-all cursor-pointer appearance-none"
                                    >
                                        <option value="Full Time">Full Time</option>
                                        <option value="Remote">Remote</option>
                                        <option value="Hybrid">Hybrid</option>
                                        <option value="Contract">Contract</option>
                                        <option value="Freelance">Freelance</option>
                                        <option value="Internship">Internship</option>
                                    </select>
                                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6" /></svg>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Salary Range</Label>
                                <Input name="salaryRange" value={formData.salaryRange} onChange={handleChange} className="bg-[#1a1a1a] border-none text-white h-11 rounded-xl px-4" placeholder="100k - 140k" />
                            </div>

                            <div className="space-y-4">
                                <Label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Categories</Label>
                                <div className="flex flex-wrap gap-2">
                                    {categories.map((cat) => {
                                        const isSelected = formData.categories.includes(cat.name);
                                        return (
                                            <button
                                                type="button"
                                                key={cat._id}
                                                onClick={() => handleCategoryToggle(cat.name)}
                                                className={`px-3 py-2 text-[10px] font-black uppercase tracking-widest rounded-lg border transition-all ${isSelected
                                                    ? "bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-900/40 scale-[1.05]"
                                                    : "bg-[#0a0a0a] border-white/[0.05] text-slate-500 hover:text-slate-200 hover:bg-[#1a1a1a]"
                                                    }`}
                                            >
                                                {cat.name}
                                            </button>
                                        )
                                    })}
                                </div>
                            </div>

                            <div className="pt-6 border-t border-white/[0.05]">
                                <Button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full bg-blue-600 hover:bg-blue-500 text-white font-black uppercase tracking-widest h-12 rounded-xl shadow-xl shadow-blue-900/20 active:scale-[0.98] transition-all"
                                >
                                    {loading ? "Processing..." : "Publish Posting"}
                                </Button>
                                <Link href="/admin/jobs" className="block mt-3 text-center">
                                    <span className="text-[10px] font-black text-slate-600 hover:text-slate-400 transition-colors uppercase tracking-widest cursor-pointer">
                                        Cancel & Exit
                                    </span>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
}
