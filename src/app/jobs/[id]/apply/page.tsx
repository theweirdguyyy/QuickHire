"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Briefcase, ArrowLeft, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";

export default function ApplyPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const router = useRouter();
    const [job, setJob] = useState<any>(null);
    const [loadingJob, setLoadingJob] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [success, setSuccess] = useState(false);

    // Form state
    const [formData, setFormData] = useState({
        candidateName: "",
        candidateEmail: "",
        phone: "",
        desiredPay: "",
        website: "",
        linkedIn: "",
        university: "",
        coverLetter: "",
    });
    const [resumeFile, setResumeFile] = useState<File | null>(null);

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

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!resumeFile) {
            alert("Please upload your resume.");
            return;
        }

        setSubmitting(true);
        try {
            const formDataToSend = new FormData();
            Object.entries(formData).forEach(([key, value]) => {
                formDataToSend.append(key, value);
            });
            formDataToSend.append("resume", resumeFile);

            const res = await fetch(`/api/jobs/${id}/apply`, {
                method: "POST",
                body: formDataToSend,
            });
            const data = await res.json();
            if (data.success) {
                setSuccess(true);
            } else {
                alert(data.error || "Failed to submit application.");
            }
        } catch (error) {
            console.error(error);
            alert("An error occurred. Please try again.");
        } finally {
            setSubmitting(false);
        }
    };

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

    if (success) {
        return (
            <div className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center bg-slate-50 py-12 px-4">
                <div className="bg-white p-8 md:p-12 rounded-2xl shadow-sm border max-w-lg w-full text-center">
                    <CheckCircle2 className="h-20 w-20 text-green-500 mx-auto mb-6" />
                    <h2 className="text-3xl font-extrabold text-slate-900 mb-4">Application Submitted!</h2>
                    <p className="text-slate-600 text-lg mb-8">
                        Your application is listed. The HR team will reach you soon.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Button className="font-bold bg-blue-600 hover:bg-blue-700 h-12 px-8" onClick={() => router.push('/jobs')}>
                            Browse More Jobs
                        </Button>
                        <Button variant="outline" className="font-bold h-12 px-8" onClick={() => router.push('/')}>
                            Back to Home
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-[calc(100vh-4rem)] bg-slate-50 py-12 px-4 md:px-6">
            <div className="container max-w-[1400px] mx-auto flex flex-col-reverse lg:flex-row gap-8 items-start">

                {/* Left Side: Job Details */}
                <div className="w-full lg:w-1/2">
                    <div className="bg-white p-6 md:p-8 rounded-2xl border shadow-sm sticky top-24 h-fit">
                        <Link href={`/jobs/${job._id}`} className="hidden lg:inline-flex items-center gap-1.5 text-sm font-semibold text-slate-500 hover:text-slate-900 transition-colors mb-6">
                            <ArrowLeft className="h-4 w-4" /> Back to job description
                        </Link>
                        <div className="h-16 w-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-6 border border-blue-100">
                            <Briefcase className="h-8 w-8 opacity-60" />
                        </div>
                        <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 mb-2 leading-tight">{job.title}</h1>
                        <p className="text-blue-600 font-semibold text-lg mb-6">{job.companyName}</p>

                        <div className="space-y-4">
                            <div className="flex flex-col gap-1">
                                <span className="text-xs uppercase tracking-wider font-bold text-slate-400">Location</span>
                                <span className="font-medium text-slate-700">{job.location}</span>
                            </div>
                            <div className="flex flex-col gap-1">
                                <span className="text-xs uppercase tracking-wider font-bold text-slate-400">Job Type</span>
                                <span className="font-medium text-slate-700">{job.jobType}</span>
                            </div>
                            {job.salaryRange && (
                                <div className="flex flex-col gap-1">
                                    <span className="text-xs uppercase tracking-wider font-bold text-slate-400">Salary</span>
                                    <span className="font-medium text-slate-700">{job.salaryRange}</span>
                                </div>
                            )}
                        </div>

                        {job.description && (
                            <div className="mt-8 pt-8 border-t">
                                <span className="text-xs uppercase tracking-wider font-bold text-slate-400 mb-4 block">About Role</span>
                                <div className="text-sm text-slate-600 leading-relaxed whitespace-pre-wrap break-words">
                                    {job.description}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Side: Application Form */}
                <div className="w-full lg:w-1/2 bg-white rounded-2xl border shadow-sm p-6 md:p-8 shrink-0 h-fit">
                    <Link href={`/jobs/${job._id}`} className="inline-flex lg:hidden items-center gap-1.5 text-sm font-semibold text-slate-500 hover:text-slate-900 transition-colors mb-6">
                        <ArrowLeft className="h-4 w-4" /> Back to job description
                    </Link>
                    <h2 className="text-2xl font-bold text-slate-900 mb-8 border-b pb-4">Submit your application</h2>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label htmlFor="candidateName" className="text-sm font-semibold text-slate-700">Full Name <span className="text-red-500">*</span></label>
                                <Input
                                    id="candidateName"
                                    name="candidateName"
                                    required
                                    placeholder="John Doe"
                                    value={formData.candidateName}
                                    onChange={handleChange}
                                    className="h-11 bg-slate-50"
                                />
                            </div>
                            <div className="space-y-2">
                                <label htmlFor="candidateEmail" className="text-sm font-semibold text-slate-700">Email Address <span className="text-red-500">*</span></label>
                                <Input
                                    id="candidateEmail"
                                    name="candidateEmail"
                                    type="email"
                                    required
                                    placeholder="john@example.com"
                                    value={formData.candidateEmail}
                                    onChange={handleChange}
                                    className="h-11 bg-slate-50"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label htmlFor="phone" className="text-sm font-semibold text-slate-700">Phone Number <span className="text-red-500">*</span></label>
                                <PhoneInput
                                    international
                                    defaultCountry="US"
                                    value={formData.phone}
                                    onChange={(value) => setFormData({ ...formData, phone: value || "" })}
                                    className="flex h-11 w-full rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm ring-offset-white focus-within:outline-none focus-within:ring-2 focus-within:ring-slate-950 focus-within:ring-offset-2 [&_.PhoneInputInput]:bg-transparent [&_.PhoneInputInput]:border-none [&_.PhoneInputInput]:outline-none [&_.PhoneInputInput]:w-full [&_.PhoneInputInput]:ml-2 [&_.PhoneInputCountryIcon]:w-6 [&_.PhoneInputCountryIcon]:h-4 [&_.PhoneInputCountryIcon]:shadow-sm"
                                />
                            </div>
                            <div className="space-y-2">
                                <label htmlFor="desiredPay" className="text-sm font-semibold text-slate-700">Desired Pay <span className="text-red-500">*</span></label>
                                <Input
                                    id="desiredPay"
                                    name="desiredPay"
                                    required
                                    placeholder="$80,000 / year"
                                    value={formData.desiredPay}
                                    onChange={handleChange}
                                    className="h-11 bg-slate-50"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label htmlFor="website" className="text-sm font-semibold text-slate-700">Website / Portfolio</label>
                                <Input
                                    id="website"
                                    name="website"
                                    type="url"
                                    placeholder="https://yourportfolio.com"
                                    value={formData.website}
                                    onChange={handleChange}
                                    className="h-11 bg-slate-50"
                                />
                            </div>
                            <div className="space-y-2">
                                <label htmlFor="linkedIn" className="text-sm font-semibold text-slate-700">LinkedIn URL</label>
                                <Input
                                    id="linkedIn"
                                    name="linkedIn"
                                    type="url"
                                    placeholder="https://linkedin.com/in/username"
                                    value={formData.linkedIn}
                                    onChange={handleChange}
                                    className="h-11 bg-slate-50"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="university" className="text-sm font-semibold text-slate-700">College / University <span className="text-red-500">*</span></label>
                            <Input
                                id="university"
                                name="university"
                                required
                                placeholder="University of Technology"
                                value={formData.university}
                                onChange={handleChange}
                                className="h-11 bg-slate-50"
                            />
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="resume" className="text-sm font-semibold text-slate-700">Resume / CV (PDF) <span className="text-red-500">*</span></label>
                            <Input
                                id="resume"
                                name="resume"
                                type="file"
                                accept="application/pdf"
                                required
                                onChange={(e) => setResumeFile(e.target.files?.[0] || null)}
                                className="h-11 bg-slate-50 cursor-pointer text-slate-600 file:mr-4 file:py-1 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 p-1.5"
                            />
                            <p className="text-xs text-slate-500">Only PDF files are accepted.</p>
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="coverLetter" className="text-sm font-semibold text-slate-700">Cover Letter (Optional)</label>
                            <textarea
                                id="coverLetter"
                                name="coverLetter"
                                placeholder="Tell us why you're a great fit for this role..."
                                rows={5}
                                value={formData.coverLetter}
                                onChange={handleChange}
                                className="flex w-full rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm ring-offset-white placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none"
                            />
                        </div>

                        <Button
                            type="submit"
                            className="w-full h-12 text-lg font-bold bg-blue-600 hover:bg-blue-700 disabled:opacity-70"
                            disabled={submitting}
                        >
                            {submitting ? "Submitting..." : "Submit Application"}
                        </Button>
                    </form>
                </div>

            </div>
        </div>
    );
}
