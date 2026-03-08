import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Briefcase, FileText, CheckCircle, Users, ArrowRight } from "lucide-react";
import connectDB from "@/lib/mongoose";
import Job from "@/models/Job";
import Application from "@/models/Application";
import { ApplicationChart } from "@/components/admin/ApplicationChart";
import Link from "next/link";

export default async function AdminOverview() {
    await connectDB();

    // 1. Fetch Key Metrics from actual DB
    const totalJobs = await Job.countDocuments();
    const activeApplications = await Application.countDocuments({ status: "Pending" });
    const hiredCandidates = await Application.countDocuments({ status: "Accepted" });

    // Platform Visits isn't tracked in DB, using a static placeholder
    const platformVisits = "1,204";


    // 3. Fetch Recent Applications
    const recentApps = await Application.find()
        .sort({ appliedAt: -1 })
        .limit(5)
        .populate("jobId", "title")
        .lean();

    return (
        <div className="space-y-6 lg:space-y-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Dashboard Overview</h1>
                <p className="text-slate-400">Track analytics, manage jobs, and review applications.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 lg:gap-6">
                <MetricCard title="Total Jobs Posted" value={totalJobs} icon={Briefcase} trend="Active postings" color="text-blue-500" />
                <MetricCard title="Active Applications" value={activeApplications} icon={FileText} trend="Needs review" color="text-emerald-500" />
                <MetricCard title="Hired Candidates" value={hiredCandidates} icon={CheckCircle} trend="Total accepted" color="text-purple-500" />
                <MetricCard title="Platform Visits" value={platformVisits} icon={Users} trend="+18% this month" color="text-amber-500" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="col-span-1 lg:col-span-2 border-none bg-[#111] shadow-lg shadow-black/50 hover:shadow-xl transition-shadow duration-300">
                    <CardHeader>
                        <CardTitle className="text-slate-200">Applications Pattern</CardTitle>
                    </CardHeader>
                    <CardContent className="h-[380px] pt-3 pb-4">
                        <ApplicationChart />
                    </CardContent>
                </Card>

                <Card className="col-span-1 border-none bg-[#111] shadow-lg shadow-black/50 hover:shadow-xl transition-shadow duration-300">
                    <CardHeader>
                        <CardTitle className="text-slate-200">Recent Applications</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-4 px-2 sm:px-6">
                        <div className="space-y-4">
                            {recentApps.length === 0 ? (
                                <p className="text-sm text-slate-500 text-center py-4">No applications yet.</p>
                            ) : (
                                recentApps.map((app: any) => (
                                    <Link
                                        key={app._id.toString()}
                                        href={`/admin/applications/${app._id.toString()}`}
                                        className="group flex items-center justify-between py-3 px-2 sm:px-3 rounded-lg hover:bg-white/[0.05] transition-all cursor-pointer"
                                    >
                                        <div className="flex items-center gap-3 min-w-0 flex-1">
                                            {/* Avatar */}
                                            <div className="shrink-0 h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold text-white shadow-sm"
                                                style={{ backgroundColor: ["#3b82f6", "#10b981", "#8b5cf6", "#f59e0b", "#ef4444"][app.candidateName.charCodeAt(0) % 5] }}>
                                                {app.candidateName.charAt(0).toUpperCase()}
                                            </div>
                                            <div className="min-w-0">
                                                <p className="font-semibold text-slate-200 text-sm truncate group-hover:text-white transition-colors">{app.candidateName}</p>
                                                <p className="text-xs text-slate-500 truncate">{app.jobId?.title || "Unknown Job"}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2 shrink-0 ml-2">
                                            <span className={`text-[10px] sm:text-xs px-2 py-1 rounded-full font-medium ${app.status === 'Pending' ? 'bg-blue-500/10 text-blue-400' :
                                                app.status === 'Accepted' ? 'bg-emerald-500/10 text-emerald-400' :
                                                    app.status === 'Rejected' ? 'bg-red-500/10 text-red-400' :
                                                        'bg-amber-500/10 text-amber-400'}`}>
                                                {app.status}
                                            </span>
                                            <ArrowRight className="h-3.5 w-3.5 text-slate-600 group-hover:text-slate-300 group-hover:translate-x-0.5 transition-all" />
                                        </div>
                                    </Link>
                                ))
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

function MetricCard({ title, value, icon: Icon, trend, color }: any) {
    return (
        <Card className="border-none bg-[#111] shadow-md shadow-black/40 transition-all duration-300 hover:shadow-lg hover:shadow-black/60 hover:-translate-y-1">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-slate-400">{title}</CardTitle>
                <div className={`p-2 rounded-lg bg-[#1a1a1a] shadow-inner ${color}`}>
                    <Icon className="h-4 w-4" />
                </div>
            </CardHeader>
            <CardContent>
                <div className="text-3xl font-bold text-slate-100">{value}</div>
                <p className="text-xs text-slate-500 mt-2">{trend}</p>
            </CardContent>
        </Card>
    );
}
