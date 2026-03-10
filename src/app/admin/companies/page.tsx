"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Trash2, Edit2, Building2 } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

export default function ManageCompaniesPage() {
    const [companies, setCompanies] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchCompanies();
    }, []);

    const fetchCompanies = async () => {
        try {
            const res = await fetch("/api/companies");
            const data = await res.json();
            if (data.success) {
                setCompanies(data.data);
            }
        } catch (error) {
            console.error("Failed to fetch companies");
        } finally {
            setLoading(false);
        }
    };

    const deleteCompany = async (id: string) => {
        if (!confirm("Are you sure you want to delete this company?")) return;
        try {
            const res = await fetch(`/api/companies/${id}`, { method: "DELETE" });
            const data = await res.json();
            if (data.success) {
                setCompanies(companies.filter(c => c._id !== id));
            } else {
                alert(data.error || "Failed to delete company");
            }
        } catch (error) {
            console.error(error);
            alert("Error deleting company");
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-white mb-2 shadow-sm drop-shadow-md uppercase">Manage Companies</h1>
                    <p className="text-slate-400 font-medium tracking-wide text-sm">View, edit, and add partner companies to the platform.</p>
                </div>
                <div className="flex items-center gap-3">
                    <Link href="/admin/companies/create">
                        <Button className="bg-blue-600 hover:bg-blue-500 hover:-translate-y-0.5 transition-all shadow-lg shadow-blue-900/20 text-white font-black uppercase tracking-widest text-[10px] px-6">
                            <Plus className="h-4 w-4 mr-2" /> Add New Company
                        </Button>
                    </Link>
                </div>
            </div>

            <div className="bg-[#111] border border-white/[0.02] shadow-2xl shadow-black/80 rounded-2xl overflow-hidden">
                <Table>
                    <TableHeader className="bg-[#1a1a1a]">
                        <TableRow className="border-none hover:bg-[#1a1a1a]">
                            <TableHead className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Company Name</TableHead>
                            <TableHead className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Industry</TableHead>
                            <TableHead className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Location</TableHead>
                            <TableHead className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Status</TableHead>
                            <TableHead className="text-right text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            <TableRow className="border-none">
                                <TableCell colSpan={5} className="h-24 text-center text-slate-600 font-bold uppercase tracking-widest text-xs">Loading companies...</TableCell>
                            </TableRow>
                        ) : companies.length === 0 ? (
                            <TableRow className="border-none">
                                <TableCell colSpan={5} className="h-24 text-center text-slate-600 font-bold uppercase tracking-widest text-xs">No companies found. Create one to get started.</TableCell>
                            </TableRow>
                        ) : (
                            companies.map((company) => (
                                <TableRow key={company._id} className="border-b border-white/[0.06] hover:bg-white/[0.03] transition-colors">
                                    <TableCell className="font-medium text-slate-200">
                                        <div className="flex items-center gap-3">
                                            {company.logoUrl ? (
                                                <img src={company.logoUrl} alt={company.name} className="h-8 w-8 rounded object-contain bg-slate-800 p-1" />
                                            ) : (
                                                <div className="h-8 w-8 rounded bg-slate-800 flex items-center justify-center">
                                                    <Building2 className="h-4 w-4 text-slate-500" />
                                                </div>
                                            )}
                                            {company.name}
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-slate-300">{company.industry}</TableCell>
                                    <TableCell className="text-slate-400">{company.location}</TableCell>
                                    <TableCell>
                                        {company.featured && (
                                            <Badge className="bg-blue-500/10 text-blue-500 border-blue-500/20 text-[10px]">Featured</Badge>
                                        )}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-1">
                                            <Link href={`/admin/companies/${company._id}/edit`}>
                                                <Button variant="ghost" size="icon" className="h-8 w-8 text-emerald-500 hover:text-emerald-400 hover:bg-emerald-500/10 transition-all">
                                                    <Edit2 className="h-4 w-4" />
                                                </Button>
                                            </Link>
                                            <Button variant="ghost" size="icon" onClick={() => deleteCompany(company._id)} className="h-8 w-8 text-red-500 hover:text-red-400 hover:bg-red-500/10 transition-all">
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
