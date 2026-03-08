"use client";

import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
    ArrowLeft, Mail, Phone, Globe, Linkedin,
    GraduationCap, DollarSign, FileText, Briefcase,
    MapPin, Clock, Loader2, ExternalLink, Download, Github
} from "lucide-react";
import { Button } from "@/components/ui/button";

const STATUS_OPTIONS = ["Pending", "Reviewed", "Accepted", "Rejected"] as const;
type Status = typeof STATUS_OPTIONS[number];

const STATUS_STYLES: Record<Status, string> = {
    Pending: "bg-blue-500/15 text-blue-400 ring-1 ring-blue-500/30",
    Reviewed: "bg-amber-500/15 text-amber-400 ring-1 ring-amber-500/30",
    Accepted: "bg-emerald-500/15 text-emerald-400 ring-1 ring-emerald-500/30",
    Rejected: "bg-red-500/15 text-red-400 ring-1 ring-red-500/30",
};

function InfoRow({ icon: Icon, label, value, href }: { icon: any; label: string; value?: string; href?: string }) {
    if (!value) return null;
    return (
        <div className="flex items-start gap-3 py-3 border-b border-white/[0.06] last:border-0">
            <div className="shrink-0 h-8 w-8 rounded-lg bg-[#1a1a1a] flex items-center justify-center mt-0.5">
                <Icon className="h-4 w-4 text-slate-400" />
            </div>
            <div className="min-w-0 flex-1">
                <p className="text-xs text-slate-500 font-medium uppercase tracking-wide mb-0.5">{label}</p>
                {href ? (
                    <a href={href} target="_blank" rel="noopener noreferrer"
                        className="text-sm text-blue-400 hover:text-blue-300 transition-colors flex items-center gap-1 truncate">
                        {value} <ExternalLink className="h-3 w-3 shrink-0" />
                    </a>
                ) : (
                    <p className="text-sm text-slate-200 break-words">{value}</p>
                )}
            </div>
        </div>
    );
}

export default function ApplicationDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const router = useRouter();
    const [app, setApp] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);
    const [status, setStatus] = useState<Status>("Pending");

    useEffect(() => {
        fetch(`/api/applications/${id}`)
            .then(r => r.json())
            .then(res => {
                if (res.success) {
                    setApp(res.data);
                    setStatus(res.data.status);
                }
            })
            .catch(console.error)
            .finally(() => setLoading(false));
    }, [id]);

    const handleStatusUpdate = async (newStatus: Status) => {
        setUpdating(true);
        try {
            const res = await fetch(`/api/applications/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status: newStatus }),
            });
            const data = await res.json();
            if (data.success) setStatus(newStatus);
        } catch (e) {
            console.error(e);
        } finally {
            setUpdating(false);
        }
    };

    if (loading) return (
        <div className="flex h-[50vh] items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
        </div>
    );

    if (!app) return (
        <div className="flex h-[50vh] flex-col items-center justify-center gap-4">
            <p className="text-slate-400">Application not found.</p>
            <Link href="/admin/applications">
                <Button variant="ghost" className="text-slate-400 hover:text-white">← Back</Button>
            </Link>
        </div>
    );

    const timeAgo = (dateStr: string) => {
        const days = Math.floor((Date.now() - new Date(dateStr).getTime()) / 86400000);
        if (days === 0) return "Today";
        if (days === 1) return "Yesterday";
        return `${days} days ago`;
    };

    // Avatar initials color
    const AVATAR_COLORS = ["#3b82f6", "#10b981", "#8b5cf6", "#f59e0b", "#ef4444", "#06b6d4"];
    const avatarColor = AVATAR_COLORS[app.candidateName.charCodeAt(0) % AVATAR_COLORS.length];

    return (
        <div className="max-w-[1600px] mx-auto space-y-6">
            {/* Back */}
            <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <Link href="/admin/applications">
                        <Button variant="ghost" size="icon" className="text-slate-400 hover:text-white hover:bg-white/5 transition-colors">
                            <ArrowLeft className="h-5 w-5" />
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-white">Applicant Detail</h1>
                        <p className="text-slate-400 text-sm">Review and manage this application</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <a href={app.resumeLink} target="_blank" rel="noopener noreferrer">
                        <Button variant="outline" size="sm" className="bg-[#1a1a1a] border-slate-700 text-slate-300 hover:text-white hover:bg-[#222]">
                            <Download className="h-4 w-4 mr-2" /> Download CV
                        </Button>
                    </a>
                </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">

                {/* ── Left side: Profile & Info (5/12 - ~40%) ── */}
                <div className="xl:col-span-5 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-1 gap-6">
                        {/* Profile card */}
                        <div className="bg-[#111] rounded-2xl p-6 shadow-2xl shadow-black/60 text-center flex flex-col items-center border border-white/[0.02]">
                            <div
                                className="h-28 w-28 rounded-full flex items-center justify-center text-4xl font-black text-white mb-5 shadow-2xl border-4 border-[#1a1a1a]"
                                style={{ backgroundColor: avatarColor }}
                            >
                                {app.candidateName.charAt(0).toUpperCase()}
                            </div>
                            <h2 className="text-2xl font-black text-white mb-1 tracking-tight">{app.candidateName}</h2>
                            <p className="text-sm text-slate-400 font-medium mb-5">{app.candidateEmail}</p>

                            <span className={`text-[10px] px-5 py-2 rounded-full font-black uppercase tracking-[0.2em] ${STATUS_STYLES[status]}`}>
                                {status}
                            </span>

                            <p className="text-xs text-slate-500 mt-6 flex items-center justify-center gap-1.5 font-medium">
                                <Clock className="h-3.5 w-3.5" /> Applied {timeAgo(app.appliedAt)}
                            </p>
                        </div>

                        {/* Status changer */}
                        <div className="bg-[#111] rounded-2xl p-6 shadow-2xl shadow-black/50 border border-white/[0.02]">
                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-4">Management Action</p>
                            <div className="grid grid-cols-2 gap-2.5">
                                {STATUS_OPTIONS.map(s => (
                                    <button
                                        key={s}
                                        onClick={() => handleStatusUpdate(s)}
                                        disabled={updating || status === s}
                                        className={`py-3 px-3 rounded-xl text-xs font-black transition-all cursor-pointer ${status === s
                                            ? STATUS_STYLES[s] + " opacity-100 shadow-xl scale-[1.02]"
                                            : "bg-[#1a1a1a] text-slate-500 hover:bg-[#222] hover:text-slate-200"
                                            } disabled:cursor-not-allowed`}
                                    >
                                        {updating && status !== s ? "..." : s}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Applied Job */}
                    {app.jobId && (
                        <div className="bg-[#111] rounded-2xl p-5 shadow-2xl shadow-black/50 border-l-4 border-blue-500 border-t border-r border-b border-white/[0.02]">
                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-4">Position Requested</p>
                            <div className="flex items-center gap-4">
                                <div className="h-12 w-12 rounded-2xl bg-blue-600/10 flex items-center justify-center shrink-0 shadow-inner">
                                    <Briefcase className="h-6 w-6 text-blue-400" />
                                </div>
                                <div className="min-w-0">
                                    <p className="font-extrabold text-slate-100 text-lg leading-tight truncate">{app.jobId.title}</p>
                                    <p className="text-sm text-slate-500 flex items-center gap-2 mt-1.5 font-medium">
                                        {app.jobId.companyName} <span className="h-1 w-1 rounded-full bg-slate-800" /> {app.jobId.location}
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Contact & Info */}
                    <div className="bg-[#111] rounded-2xl p-6 shadow-2xl shadow-black/50 border border-white/[0.02]">
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-3">Applicant Data</p>
                        <InfoRow icon={Mail} label="Email Address" value={app.candidateEmail} href={`mailto:${app.candidateEmail}`} />
                        <InfoRow icon={Phone} label="Contact Number" value={app.phone} href={`tel:${app.phone}`} />
                        <InfoRow icon={DollarSign} label="Desired Pay" value={app.desiredPay} />
                        <InfoRow icon={GraduationCap} label="University / College" value={app.university} />
                        <InfoRow icon={FileText} label="Major / Department" value={app.major} />
                        <InfoRow icon={Globe} label="Portfolio Website" value={app.website} href={app.website} />
                        <InfoRow icon={Github} label="GitHub Profile" value={app.githubUrl} href={app.githubUrl} />
                        <InfoRow icon={Linkedin} label="LinkedIn Profile" value={app.linkedIn} href={app.linkedIn} />
                    </div>

                    {/* Cover Letter */}
                    {app.coverLetter && (
                        <div className="bg-[#111] rounded-2xl p-6 shadow-2xl shadow-black/50 border border-white/[0.02]">
                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-4">Cover Letter</p>
                            <div className="bg-[#0c0c0c] rounded-xl p-5 border border-white/[0.03]">
                                <p className="text-sm text-slate-400 leading-relaxed whitespace-pre-wrap italic">"{app.coverLetter}"</p>
                            </div>
                        </div>
                    )}
                </div>

                {/* ── Right side: Full-Height CV (7/12 - ~60%) ── */}
                <div className="xl:col-span-7">
                    <div className="bg-[#111] rounded-3xl h-[85vh] sticky top-8 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col border border-white/[0.05]">
                        <div className="bg-[#1a1a1a] px-6 py-4 border-b border-white/[0.06] flex items-center justify-between shrink-0">
                            <div className="flex items-center gap-3">
                                <div className="h-8 w-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
                                    <FileText className="h-4 w-4 text-blue-400" />
                                </div>
                                <span className="text-xs font-black text-slate-200 uppercase tracking-[0.2em]">Live Document Stream</span>
                            </div>
                            <Button
                                variant="ghost"
                                size="sm"
                                className="text-slate-500 hover:text-white hover:bg-white/5 h-8 px-4 rounded-xl text-[10px] font-bold uppercase tracking-wider"
                                onClick={() => window.open(app.resumeLink, '_blank')}
                            >
                                <ExternalLink className="h-3.5 w-3.5 mr-2" /> Open in New Tab
                            </Button>
                        </div>
                        <div className="flex-1 bg-[#050505]">
                            {app.resumeLink ? (
                                <iframe
                                    src={`${app.resumeLink}#view=Fit&navpanes=0&toolbar=0`}
                                    className="w-full h-full border-none opacity-90 hover:opacity-100 transition-opacity"
                                    title="Resume Preview"
                                />
                            ) : (
                                <div className="h-full flex flex-col items-center justify-center text-slate-700 gap-4">
                                    <FileText className="h-16 w-16 opacity-10" />
                                    <p className="text-sm font-bold uppercase tracking-widest opacity-30">No Resume File Available</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
