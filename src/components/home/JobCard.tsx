import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Briefcase, MapPin } from "lucide-react";

interface JobCardProps {
    title: string;
    company: string;
    location: string;
    type: string;
    description: string;
    tags: string[];
    logo?: string;
    isLatest?: boolean;
}

const tagColors: Record<string, string> = {
    "Marketing": "bg-orange-50 text-orange-600 border-orange-100",
    "Design": "bg-purple-50 text-purple-600 border-purple-100",
    "Branding": "bg-blue-50 text-blue-600 border-blue-100",
    "UX": "bg-indigo-50 text-indigo-600 border-indigo-100",
    "Data": "bg-emerald-50 text-emerald-600 border-emerald-100",
    "Finance": "bg-rose-50 text-rose-600 border-rose-100",
    "Technology": "bg-cyan-50 text-cyan-600 border-cyan-100",
    "Engineering": "bg-amber-50 text-amber-600 border-amber-100",
};

const getDefaultTagColor = (tagName: string) => {
    return tagColors[tagName] || "bg-slate-50 text-slate-600 border-slate-100";
};

export function JobCard({ title, company, location, type, description, tags, isLatest = false }: JobCardProps) {
    if (isLatest) {
        return (
            <Card className="hover:shadow-md transition-shadow cursor-pointer border-2 border-slate-100 shadow-sm rounded-2xl overflow-hidden">
                <CardContent className="p-6 flex flex-col md:flex-row items-start md:items-center gap-6">
                    <div className="h-16 w-16 bg-blue-50 rounded-2xl flex items-center justify-center shrink-0 border border-blue-100 shadow-inner">
                        <Briefcase className="h-8 w-8 text-blue-600 opacity-60" />
                    </div>

                    <div className="flex-1 space-y-2">
                        <h3 className="text-xl font-extrabold text-slate-900">{title}</h3>
                        <p className="text-sm font-bold text-slate-500 flex items-center gap-2">
                            <span className="text-blue-600 font-black">{company}</span> • {location}
                        </p>
                    </div>

                    <div className="flex flex-wrap md:flex-nowrap gap-2 items-center justify-start md:justify-end shrink-0">
                        <Badge variant="secondary" className="bg-yellow-400 text-yellow-950 font-black tracking-wider uppercase text-[10px] border-transparent rounded-lg px-3 py-1.5 shadow-sm">
                            {type}
                        </Badge>
                        {tags.map((tag, i) => (
                            <Badge key={i} variant="outline" className={`rounded-lg px-3 py-1.5 border font-bold text-[10px] uppercase tracking-tight ${getDefaultTagColor(tag)}`}>
                                {tag}
                            </Badge>
                        ))}
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="hover:shadow-2xl hover:shadow-blue-500/5 transition-all cursor-pointer border-2 border-slate-100 group h-full flex flex-col rounded-3xl overflow-hidden bg-white">
            <CardContent className="p-7 flex flex-col h-full">
                <div className="flex justify-between items-start mb-6">
                    <div className="h-14 w-14 bg-slate-50 rounded-2xl flex items-center justify-center border-2 border-slate-50 group-hover:border-blue-100 group-hover:bg-blue-50 transition-all shadow-inner">
                        <Briefcase className="h-7 w-7 text-blue-600 opacity-40 group-hover:opacity-80 transition-all" />
                    </div>
                    <Badge variant="outline" className="font-black text-[10px] uppercase tracking-widest text-blue-600 border-blue-200 bg-blue-50 px-3 py-1.5 rounded-xl shadow-sm">
                        {type}
                    </Badge>
                </div>

                <div className="mb-6 flex-grow">
                    <h3 className="text-xl font-extrabold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors line-clamp-1 break-words">{title}</h3>
                    <p className="text-sm font-bold text-slate-400 flex items-center gap-1.5 line-clamp-1 mb-4">
                        <span className="text-slate-800">{company}</span> • {location}
                    </p>
                    <p className="text-sm text-slate-500 font-medium leading-relaxed line-clamp-2">
                        {description}
                    </p>
                </div>

                <div className="flex gap-2 flex-wrap mt-auto pt-6 border-t-2 border-slate-50">
                    {tags.map((tag, i) => (
                        <Badge key={i} variant="outline" className={`font-black text-[10px] uppercase tracking-tight rounded-xl px-3 py-1.5 border shadow-sm transition-transform hover:scale-105 active:scale-95 ${getDefaultTagColor(tag)}`}>
                            {tag}
                        </Badge>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}
