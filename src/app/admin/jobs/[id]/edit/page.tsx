"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";

export default function EditJobPage({ params }: { params: Promise<{ id: string }> }) {
    const router = useRouter();
    const { id } = use(params);
    const [loading, setLoading] = useState(false);
    const [pageLoading, setPageLoading] = useState(true);
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
        featured: true,
    });

    useEffect(() => {
        // Fetch categories and job details in parallel
        Promise.all([
            fetch("/api/categories").then(res => res.json()),
            fetch(`/api/jobs/${id}`).then(res => res.json())
        ]).then(([catData, jobData]) => {
            if (catData.success) setCategories(catData.data);
            if (jobData.success) {
                setFormData({
                    title: jobData.data.title || "",
                    companyName: jobData.data.companyName || "",
                    location: jobData.data.location || "",
                    jobType: jobData.data.jobType || "Full Time",
                    categories: jobData.data.categories || [],
                    description: jobData.data.description || "",
                    salaryRange: jobData.data.salaryRange || "",
                    logoUrl: jobData.data.logoUrl || "",
                    featured: jobData.data.featured !== undefined ? jobData.data.featured : true,
                });
            }
        }).catch(console.error)
            .finally(() => setPageLoading(false));
    }, [id]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await fetch(`/api/jobs/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });
            const data = await res.json();
            if (data.success) {
                router.push("/admin/jobs");
            } else {
                alert(data.message || "Failed to update job");
            }
        } catch (error) {
            console.error(error);
            alert("Error updating job");
        } finally {
            setLoading(false);
        }
    };

    const handleCategoryToggle = (categoryName: string) => {
        setFormData(prev => {
            const cats = prev.categories.includes(categoryName)
                ? prev.categories.filter(c => c !== categoryName)
                : [...prev.categories, categoryName];
            return { ...prev, categories: cats };
        });
    };

    if (pageLoading) {
        return (
            <div className="flex h-[50vh] items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
            </div>
        );
    }

    return (
        <div className="space-y-6 max-w-4xl">
            <div className="flex items-center gap-4">
                <Link href="/admin/jobs">
                    <Button variant="ghost" size="icon" className="text-slate-400 hover:text-white">
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                </Link>
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-white mb-1 shadow-sm drop-shadow-md">Edit Job Posting</h1>
                    <p className="text-slate-400">Modify the details of this job opportunity.</p>
                </div>
            </div>

            <div className="bg-[#111] border-none shadow-xl shadow-black/50 rounded-xl p-6 md:p-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label className="text-slate-200">Job Title</Label>
                            <Input required name="title" value={formData.title} onChange={handleChange} className="bg-[#222] border-none text-white shadow-inner focus-visible:ring-1 focus-visible:ring-blue-500/50" placeholder="e.g. Senior Frontend Engineer" />
                        </div>

                        <div className="space-y-2">
                            <Label className="text-slate-200">Company Name</Label>
                            <Input required name="companyName" value={formData.companyName} onChange={handleChange} className="bg-[#222] border-none text-white shadow-inner focus-visible:ring-1 focus-visible:ring-blue-500/50" placeholder="e.g. Acme Corp" />
                        </div>

                        <div className="space-y-2">
                            <Label className="text-slate-200">Location</Label>
                            <Input required name="location" value={formData.location} onChange={handleChange} className="bg-[#222] border-none text-white shadow-inner focus-visible:ring-1 focus-visible:ring-blue-500/50" placeholder="e.g. Remote - US" />
                        </div>

                        <div className="space-y-2">
                            <Label className="text-slate-200">Job Type</Label>
                            <select
                                name="jobType"
                                value={formData.jobType}
                                onChange={handleChange}
                                className="w-full h-9 rounded-md bg-[#222] border-none text-white px-3 text-sm outline-none shadow-inner focus-visible:ring-1 focus-visible:ring-blue-500/50 cursor-pointer"
                            >
                                <option value="Full Time">Full Time</option>
                                <option value="Part Time">Part Time</option>
                                <option value="Contract">Contract</option>
                                <option value="Freelance">Freelance</option>
                                <option value="Internship">Internship</option>
                            </select>
                        </div>

                        <div className="space-y-2">
                            <Label className="text-slate-200">Salary Range (Optional)</Label>
                            <Input name="salaryRange" value={formData.salaryRange} onChange={handleChange} className="bg-[#222] border-none text-white shadow-inner focus-visible:ring-1 focus-visible:ring-blue-500/50" placeholder="e.g. $120k - $150k" />
                        </div>

                        <div className="space-y-2">
                            <Label className="text-slate-200">Company Logo URL (Optional)</Label>
                            <Input name="logoUrl" value={formData.logoUrl} onChange={handleChange} className="bg-[#222] border-none text-white shadow-inner focus-visible:ring-1 focus-visible:ring-blue-500/50" placeholder="https://..." />
                        </div>
                    </div>

                    <div className="space-y-3">
                        <Label className="text-slate-200">Categories</Label>
                        <div className="flex flex-wrap gap-2">
                            {categories.map((cat) => {
                                const isSelected = formData.categories.includes(cat.name);
                                return (
                                    <button
                                        type="button"
                                        key={cat._id}
                                        onClick={() => handleCategoryToggle(cat.name)}
                                        className={`px-3 py-1.5 text-sm rounded-full cursor-pointer transition-all shadow-sm ${isSelected
                                            ? "bg-blue-600 text-white shadow-blue-900/20 shadow-md"
                                            : "bg-[#222] text-slate-400 hover:text-slate-200 hover:bg-[#333]"
                                            }`}
                                    >
                                        {cat.name}
                                    </button>
                                )
                            })}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label className="text-slate-200">Job Description</Label>
                        <Textarea
                            required
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            className="bg-[#222] border-none text-white min-h-[200px] shadow-inner focus-visible:ring-1 focus-visible:ring-blue-500/50 p-4"
                            placeholder="Detail the responsibilities, requirements, and benefits..."
                        />
                    </div>

                    <div className="flex justify-end pt-4 border-t border-white/[0.05]">
                        <Button type="submit" disabled={loading} className="bg-emerald-600 hover:bg-emerald-500 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-emerald-900/20 transition-all text-white px-8 font-semibold">
                            {loading ? "Saving Changes..." : "Save Changes"}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
