"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Trash2, ExternalLink, Edit2, CheckSquare, Square, GripVertical } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
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

function SortableJobRow({ job, toggleSelect, isSelected, deleteJob }: any) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging
    } = useSortable({ id: job._id });

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
                <button onClick={() => toggleSelect(job._id)} className="text-slate-500 hover:text-white transition-colors">
                    {isSelected ? <CheckSquare className="h-4 w-4 text-blue-500" /> : <Square className="h-4 w-4" />}
                </button>
            </TableCell>
            <TableCell className="font-medium text-slate-200">{job.title}</TableCell>
            <TableCell className="text-slate-300">{job.companyName}</TableCell>
            <TableCell>
                <Badge variant="outline" className="border-none bg-[#222] text-slate-300 shadow-sm">
                    {job.jobType}
                </Badge>
            </TableCell>
            <TableCell className="text-slate-400">{job.location}</TableCell>
            <TableCell className="text-right">
                <div className="flex justify-end gap-1">
                    <Link href={`/jobs/${job._id}`} target="_blank">
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-blue-400 hover:text-blue-300 hover:bg-blue-500/10 hover:shadow-inner transition-all">
                            <ExternalLink className="h-4 w-4" />
                        </Button>
                    </Link>
                    <Link href={`/admin/jobs/${job._id}/edit`}>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-emerald-500 hover:text-emerald-400 hover:bg-emerald-500/10 hover:shadow-inner transition-all">
                            <Edit2 className="h-4 w-4" />
                        </Button>
                    </Link>
                    <Button variant="ghost" size="icon" onClick={() => deleteJob(job._id)} className="h-8 w-8 text-red-500 hover:text-red-400 hover:bg-red-500/10 hover:shadow-inner transition-all">
                        <Trash2 className="h-4 w-4" />
                    </Button>
                </div>
            </TableCell>
        </TableRow>
    );
}

export default function ManageJobsPage() {
    const [jobs, setJobs] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedIds, setSelectedIds] = useState<string[]>([]);

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    useEffect(() => {
        fetchJobs();
    }, []);

    const fetchJobs = async () => {
        try {
            const res = await fetch("/api/jobs");
            const data = await res.json();
            if (data.success) {
                setJobs(data.data);
            }
        } catch (error) {
            console.error("Failed to fetch jobs");
        } finally {
            setLoading(false);
        }
    };

    const deleteJob = async (id: string) => {
        if (!confirm("Are you sure you want to delete this job?")) return;
        try {
            const res = await fetch(`/api/jobs/${id}`, { method: "DELETE" });
            const data = await res.json();
            if (data.success) {
                setJobs(jobs.filter(job => job._id !== id));
            } else {
                alert(data.message || "Failed to delete job");
            }
        } catch (error) {
            console.error(error);
            alert("Error deleting job");
        }
    };

    const toggleSelectAll = () => {
        if (selectedIds.length === jobs.length) {
            setSelectedIds([]);
        } else {
            setSelectedIds(jobs.map(j => j._id));
        }
    };

    const toggleSelect = (id: string) => {
        setSelectedIds(prev =>
            prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
        );
    };

    const deleteSelected = async () => {
        if (!confirm(`Are you sure you want to delete ${selectedIds.length} jobs?`)) return;
        try {
            await Promise.all(selectedIds.map(id => fetch(`/api/jobs/${id}`, { method: "DELETE" })));
            setJobs(jobs.filter(job => !selectedIds.includes(job._id)));
            setSelectedIds([]);
        } catch (error) {
            console.error(error);
            alert("Error deleting jobs");
        }
    };

    const handleDragEnd = async (event: DragEndEvent) => {
        const { active, over } = event;

        if (over && active.id !== over.id) {
            const oldIndex = jobs.findIndex((job) => job._id === active.id);
            const newIndex = jobs.findIndex((job) => job._id === over.id);

            const newJobs = arrayMove(jobs, oldIndex, newIndex);
            setJobs(newJobs);

            // Persist the new order
            try {
                const orders = newJobs.map((job, index) => ({
                    id: job._id,
                    sortOrder: index
                }));

                await fetch("/api/admin/reorder", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        model: "Job",
                        orders
                    })
                });
            } catch (error) {
                console.error("Failed to save job order:", error);
            }
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-white mb-2 shadow-sm drop-shadow-md uppercase">Manage Jobs</h1>
                    <p className="text-slate-400 font-medium tracking-wide text-sm">View, edit, and reorganize job postings on the platform.</p>
                </div>
                <div className="flex items-center gap-3">
                    {selectedIds.length > 0 && (
                        <Button onClick={deleteSelected} variant="destructive" className="bg-red-600 hover:bg-red-700 hover:-translate-y-0.5 transition-transform shadow-lg shadow-red-900/20 font-black uppercase tracking-widest text-[10px] px-6">
                            <Trash2 className="h-4 w-4 mr-2" /> Delete ({selectedIds.length})
                        </Button>
                    )}
                    <Link href="/admin/jobs/create">
                        <Button className="bg-blue-600 hover:bg-blue-500 hover:-translate-y-0.5 transition-all shadow-lg shadow-blue-900/20 text-white font-black uppercase tracking-widest text-[10px] px-6">
                            <Plus className="h-4 w-4 mr-2" /> Add New Job
                        </Button>
                    </Link>
                </div>
            </div>

            <div className="bg-[#111] border border-white/[0.02] shadow-2xl shadow-black/80 rounded-2xl overflow-hidden">
                <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragEnd={handleDragEnd}
                >
                    <Table>
                        <TableHeader className="bg-[#1a1a1a]">
                            <TableRow className="border-none hover:bg-[#1a1a1a]">
                                <TableHead className="w-[40px]"></TableHead>
                                <TableHead className="w-[50px]">
                                    <button onClick={toggleSelectAll} className="text-slate-400 hover:text-white transition-colors">
                                        {jobs.length > 0 && selectedIds.length === jobs.length ? <CheckSquare className="h-4 w-4" /> : <Square className="h-4 w-4" />}
                                    </button>
                                </TableHead>
                                <TableHead className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Job Title</TableHead>
                                <TableHead className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Company</TableHead>
                                <TableHead className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Type</TableHead>
                                <TableHead className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Location</TableHead>
                                <TableHead className="text-right text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loading ? (
                                <TableRow className="border-none">
                                    <TableCell colSpan={7} className="h-24 text-center text-slate-600 font-bold uppercase tracking-widest text-xs">Loading jobs...</TableCell>
                                </TableRow>
                            ) : jobs.length === 0 ? (
                                <TableRow className="border-none">
                                    <TableCell colSpan={7} className="h-24 text-center text-slate-600 font-bold uppercase tracking-widest text-xs">No jobs found. Create one to get started.</TableCell>
                                </TableRow>
                            ) : (
                                <SortableContext
                                    items={jobs.map(j => j._id)}
                                    strategy={verticalListSortingStrategy}
                                >
                                    {jobs.map((job) => (
                                        <SortableJobRow
                                            key={job._id}
                                            job={job}
                                            toggleSelect={toggleSelect}
                                            isSelected={selectedIds.includes(job._id)}
                                            deleteJob={deleteJob}
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
