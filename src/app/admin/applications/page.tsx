"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Download, Trash2, CheckSquare, Square, ExternalLink, GripVertical } from "lucide-react";
import Link from "next/link";
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragEndEvent
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
    useSortable
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

function SortableApplicationRow({ app, toggleSelect, isSelected, deleteApplication, updateStatus, statusColors }: any) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging
    } = useSortable({ id: app._id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        zIndex: isDragging ? 50 : 0,
        position: 'relative' as const,
        opacity: isDragging ? 0.5 : 1,
    };

    return (
        <TableRow
            ref={setNodeRef}
            style={style}
            className={`border-b border-white/[0.06] hover:bg-white/[0.03] transition-colors ${isDragging ? "bg-white/[0.05] shadow-2xl" : ""}`}
        >
            <TableCell className="w-[40px]">
                <div
                    {...attributes}
                    {...listeners}
                    className="flex items-center justify-center text-slate-600 hover:text-slate-300 cursor-grab active:cursor-grabbing transition-colors"
                >
                    <GripVertical className="h-4 w-4" />
                </div>
            </TableCell>
            <TableCell>
                <button onClick={() => toggleSelect(app._id)} className="text-slate-500 hover:text-white transition-colors">
                    {isSelected ? <CheckSquare className="h-4 w-4 text-blue-500" /> : <Square className="h-4 w-4" />}
                </button>
            </TableCell>
            <TableCell>
                <Link href={`/admin/applications/${app._id}`} className="group block">
                    <div className="font-medium text-slate-200 group-hover:text-blue-400 group-hover:underline transition-all">
                        {app.candidateName}
                    </div>
                </Link>
                <div className="text-xs text-slate-400">{app.candidateEmail}</div>
                <div className="text-xs text-slate-500">{app.phone}</div>
            </TableCell>
            <TableCell>
                <div className="text-slate-300 font-medium">{app.jobId?.title || "Unknown Job"}</div>
                <div className="text-xs text-slate-500">{app.jobId?.companyName}</div>
            </TableCell>
            <TableCell className="text-slate-400 text-sm">
                {new Date(app.appliedAt).toLocaleDateString()}
            </TableCell>
            <TableCell>
                <select
                    value={app.status}
                    onChange={(e) => updateStatus(app._id, e.target.value)}
                    className={`text-sm px-2 py-1 rounded-md border border-white/10 bg-transparent outline-none cursor-pointer ${statusColors[app.status]}`}
                >
                    <option value="Pending" className="bg-[#1a1a1a] text-blue-400">Pending</option>
                    <option value="Reviewed" className="bg-[#1a1a1a] text-amber-400">Reviewed</option>
                    <option value="Accepted" className="bg-[#1a1a1a] text-emerald-400">Accepted</option>
                    <option value="Rejected" className="bg-[#1a1a1a] text-red-400">Rejected</option>
                </select>
            </TableCell>
            <TableCell className="text-right">
                <div className="flex justify-end gap-1">
                    <a href={app.resumeLink} target="_blank" rel="noopener noreferrer">
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-blue-400 hover:text-blue-300 hover:bg-blue-500/10 hover:shadow-inner transition-all" title="Download Resume">
                            <Download className="h-4 w-4" />
                        </Button>
                    </a>
                    <Button variant="ghost" size="icon" onClick={() => deleteApplication(app._id)} className="h-8 w-8 text-red-500 hover:text-red-400 hover:bg-red-500/10 hover:shadow-inner transition-all" title="Delete Application">
                        <Trash2 className="h-4 w-4" />
                    </Button>
                </div>
            </TableCell>
        </TableRow>
    );
}

export default function ViewApplicationsPage() {
    const [applications, setApplications] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedIds, setSelectedIds] = useState<string[]>([]);

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    useEffect(() => {
        fetchApplications();
    }, []);

    const fetchApplications = async () => {
        try {
            const res = await fetch("/api/applications");
            const data = await res.json();
            if (data.success) {
                setApplications(data.data);
            }
        } catch (error) {
            console.error("Failed to fetch applications");
        } finally {
            setLoading(false);
        }
    };

    const updateStatus = async (id: string, newStatus: string) => {
        try {
            const res = await fetch(`/api/applications/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status: newStatus }),
            });
            const data = await res.json();
            if (data.success) {
                setApplications(applications.map(app => (app._id === id ? { ...app, status: newStatus } : app)));
            } else {
                alert("Failed to update status");
            }
        } catch (error) {
            console.error(error);
        }
    };

    const deleteApplication = async (id: string) => {
        if (!confirm("Are you sure you want to delete this application?")) return;
        try {
            const res = await fetch(`/api/applications/${id}`, { method: "DELETE" });
            const data = await res.json();
            if (data.success) {
                setApplications(applications.filter(app => app._id !== id));
            } else {
                alert("Failed to delete application");
            }
        } catch (error) {
            console.error(error);
        }
    };

    const statusColors: any = {
        Pending: "text-blue-400 bg-blue-500/10",
        Reviewed: "text-amber-400 bg-amber-500/10",
        Accepted: "text-emerald-400 bg-emerald-500/10",
        Rejected: "text-red-400 bg-red-500/10",
    };

    const toggleSelectAll = () => {
        if (selectedIds.length === applications.length) {
            setSelectedIds([]);
        } else {
            setSelectedIds(applications.map(a => a._id));
        }
    };

    const toggleSelect = (id: string) => {
        setSelectedIds(prev =>
            prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
        );
    };

    const deleteSelected = async () => {
        if (!confirm(`Are you sure you want to delete ${selectedIds.length} applications?`)) return;
        try {
            await Promise.all(selectedIds.map(id => fetch(`/api/applications/${id}`, { method: "DELETE" })));
            setApplications(applications.filter(app => !selectedIds.includes(app._id)));
            setSelectedIds([]);
        } catch (error) {
            console.error(error);
            alert("Error deleting applications");
        }
    };

    const handleDragEnd = async (event: DragEndEvent) => {
        const { active, over } = event;

        if (over && active.id !== over.id) {
            const oldIndex = applications.findIndex((app) => app._id === active.id);
            const newIndex = applications.findIndex((app) => app._id === over.id);

            const newApplications = arrayMove(applications, oldIndex, newIndex);
            setApplications(newApplications);

            // Persist the new order
            try {
                const orders = newApplications.map((app, index) => ({
                    id: app._id,
                    sortOrder: index
                }));

                await fetch("/api/admin/reorder", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        model: "Application",
                        orders
                    })
                });
            } catch (error) {
                console.error("Failed to save application order:", error);
            }
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-white mb-2 shadow-sm drop-shadow-md uppercase">Job Applications</h1>
                    <p className="text-slate-400 font-medium tracking-wide text-sm">Review candidates and reorganize applications to prioritize your pipeline.</p>
                </div>
                <div className="flex items-center gap-3">
                    {selectedIds.length > 0 && (
                        <Button onClick={deleteSelected} variant="destructive" className="bg-red-600 hover:bg-red-700 hover:-translate-y-0.5 transition-transform shadow-lg shadow-red-900/20 font-black uppercase tracking-widest text-[10px] px-6">
                            <Trash2 className="h-4 w-4 mr-2" /> Delete ({selectedIds.length})
                        </Button>
                    )}
                </div>
            </div>

            <div className="bg-[#111] border border-white/[0.02] shadow-2xl shadow-black/80 rounded-2xl overflow-hidden overflow-x-auto w-full">
                <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragEnd={handleDragEnd}
                >
                    <Table className="min-w-[800px]">
                        <TableHeader className="bg-[#1a1a1a]">
                            <TableRow className="border-none hover:bg-[#1a1a1a]">
                                <TableHead className="w-[40px]"></TableHead>
                                <TableHead className="w-[50px]">
                                    <button onClick={toggleSelectAll} className="text-slate-400 hover:text-white transition-colors">
                                        {applications.length > 0 && selectedIds.length === applications.length ? <CheckSquare className="h-4 w-4" /> : <Square className="h-4 w-4" />}
                                    </button>
                                </TableHead>
                                <TableHead className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Candidate</TableHead>
                                <TableHead className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Applied Job</TableHead>
                                <TableHead className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Applied At</TableHead>
                                <TableHead className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Status</TableHead>
                                <TableHead className="text-right text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loading ? (
                                <TableRow className="border-none">
                                    <TableCell colSpan={7} className="h-24 text-center text-slate-600 font-bold uppercase tracking-widest text-xs">Loading applications...</TableCell>
                                </TableRow>
                            ) : applications.length === 0 ? (
                                <TableRow className="border-none">
                                    <TableCell colSpan={7} className="h-24 text-center text-slate-600 font-bold uppercase tracking-widest text-xs">No applications found.</TableCell>
                                </TableRow>
                            ) : (
                                <SortableContext
                                    items={applications.map(a => a._id)}
                                    strategy={verticalListSortingStrategy}
                                >
                                    {applications.map((app) => (
                                        <SortableApplicationRow
                                            key={app._id}
                                            app={app}
                                            toggleSelect={toggleSelect}
                                            isSelected={selectedIds.includes(app._id)}
                                            deleteApplication={deleteApplication}
                                            updateStatus={updateStatus}
                                            statusColors={statusColors}
                                        />
                                    ))}
                                </SortableContext>
                            )}
                        </TableBody>
                    </Table>
                </DndContext>
            </div>
        </div>
    );
}
