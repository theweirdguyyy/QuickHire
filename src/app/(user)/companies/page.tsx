"use client";

import { useEffect, useState, Suspense } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, MapPin, Building2, Users, Globe, ArrowRight } from "lucide-react";
import Link from "next/link";

interface Company {
    _id: string;
    name: string;
    industry: string;
    location: string;
    description: string;
    logoUrl?: string;
    employeeCount?: string;
    featured: boolean;
}

function CompaniesContent() {
    const [companies, setCompanies] = useState<Company[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");

    useEffect(() => {
        fetch("/api/companies")
            .then(r => r.json())
            .then(data => {
                setCompanies(data.data || []);
                setLoading(false);
            });
    }, []);

    const filtered = companies.filter(c =>
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.industry.toLowerCase().includes(search.toLowerCase()) ||
        c.location.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="min-h-[calc(100vh-4rem)] bg-slate-50">
            {/* Header */}
            <div className="bg-white border-b">
                <div className="container mx-auto max-w-7xl px-4 md:px-6 py-10">
                    <h1 className="text-3xl font-bold text-slate-900 mb-1">
                        Browse <span className="text-blue-600">Companies</span>
                    </h1>
                    <p className="text-slate-500 mb-6">{companies.length} companies registered</p>

                    <div className="relative max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <Input
                            placeholder="Search by name, industry, or location..."
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            className="pl-9 h-11"
                        />
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="container mx-auto max-w-7xl px-4 md:px-6 py-8">
                {loading ? (
                    <div className="flex items-center justify-center py-24">
                        <p className="text-slate-500">Loading companies...</p>
                    </div>
                ) : filtered.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-24 text-center">
                        <div className="h-16 w-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                            <Building2 className="h-7 w-7 text-slate-400" />
                        </div>
                        <h3 className="text-lg font-semibold text-slate-900 mb-1">No companies found</h3>
                        <p className="text-slate-500 max-w-sm">Try adjusting your search terms.</p>
                    </div>
                ) : (
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {filtered.map(company => (
                            <div key={company._id} className="bg-white rounded-2xl border border-slate-200 p-6 hover:shadow-lg transition-all hover:-translate-y-1">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="h-14 w-14 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-center overflow-hidden">
                                        {company.logoUrl ? (
                                            <img src={company.logoUrl} alt={company.name} className="h-full w-full object-contain p-2" />
                                        ) : (
                                            <Building2 className="h-6 w-6 text-slate-400" />
                                        )}
                                    </div>
                                    {company.featured && (
                                        <span className="text-[10px] font-bold uppercase tracking-wider bg-blue-50 text-blue-600 px-2.5 py-1 rounded-full border border-blue-100">
                                            Partner
                                        </span>
                                    )}
                                </div>

                                <h2 className="text-xl font-bold text-slate-900 mb-1">{company.name}</h2>
                                <p className="text-blue-600 font-semibold text-sm mb-4">{company.industry}</p>

                                <p className="text-slate-500 text-sm line-clamp-3 mb-6">
                                    {company.description}
                                </p>

                                <div className="flex flex-col gap-2 mb-6">
                                    <div className="flex items-center gap-2 text-slate-500 text-sm">
                                        <MapPin className="h-4 w-4" />
                                        {company.location}
                                    </div>
                                    {company.employeeCount && (
                                        <div className="flex items-center gap-2 text-slate-500 text-sm">
                                            <Users className="h-4 w-4" />
                                            {company.employeeCount} Employees
                                        </div>
                                    )}
                                </div>

                                <Link href={`/companies/${company._id}`}>
                                    <Button variant="outline" className="w-full border-blue-100 text-blue-600 hover:bg-blue-600 hover:text-white transition-all group">
                                        View Company
                                        <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                                    </Button>
                                </Link>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default function CompaniesPage() {
    return (
        <Suspense fallback={<div className="flex items-center justify-center min-h-[calc(100vh-4rem)]"><p>Loading...</p></div>}>
            <CompaniesContent />
        </Suspense>
    );
}
