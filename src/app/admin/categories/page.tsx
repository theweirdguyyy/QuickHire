"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import * as Icons from "lucide-react";
import { Plus, Trash2, Edit2, Save, X, CheckSquare, Square, Tag, GripVertical } from "lucide-react";
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

// Pre-defined set of popular Lucide icons for categories
const CATEGORY_ICONS = [
    "Briefcase", "Code", "PenTool", "Monitor",
    "LineChart", "PieChart", "Database", "Smartphone",
    "Heart", "Building", "Camera", "Music",
    "Video", "Globe", "Cpu", "Server"
];

function SortableRow({
    cat,
    editingId,
    setEditingId,
    editName,
    setEditName,
    editIconName,
    setEditIconName,
    handleUpdate,
    handleEdit,
    handleDelete,
    toggleSelect,
    isSelected
}: any) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging
    } = useSortable({ id: cat._id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        zIndex: isDragging ? 50 : 0,
        position: 'relative' as const,
        opacity: isDragging ? 0.5 : 1,
    };

    // @ts-ignore
    const Icon = Icons[cat.iconName] || Tag;
    // @ts-ignore
    const EditIcon = Icons[editIconName] || Tag;

    return (
        <TableRow
            ref={setNodeRef}
            style={style}
            className={`border-b border-white/[0.06] hover:bg-white/[0.03] transition-colors ${isDragging ? "bg-white/[0.05] shadow-2xl" : ""}`}
        >
            {editingId === cat._id ? (
                <>
                    <TableCell className="w-[40px]">
                        <div className="flex items-center justify-center text-slate-700">
                            <GripVertical className="h-4 w-4" />
                        </div>
                    </TableCell>
                    <TableCell></TableCell>
                    <TableCell>
                        <Input
                            value={editName}
                            onChange={e => setEditName(e.target.value)}
                            className="h-9 w-full sm:w-[200px] bg-[#222] border-none text-white shadow-inner focus-visible:ring-1 focus-visible:ring-blue-500/50"
                        />
                    </TableCell>
                    <TableCell>
                        <div className="flex items-center gap-3">
                            <select
                                value={editIconName}
                                onChange={e => setEditIconName(e.target.value)}
                                className="h-9 w-full sm:w-[180px] rounded-md bg-[#222] border-none text-white px-3 text-sm shadow-inner outline-none focus:ring-1 focus:ring-blue-500/50 cursor-pointer"
                            >
                                {CATEGORY_ICONS.map(icon => (
                                    <option key={icon} value={icon}>{icon}</option>
                                ))}
                            </select>
                            <div className="h-8 w-8 rounded-lg bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20 text-emerald-400">
                                <EditIcon className="h-4 w-4" />
                            </div>
                        </div>
                    </TableCell>
                    <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                            <Button onClick={() => handleUpdate(cat._id)} size="icon" className="h-8 w-8 bg-emerald-600 hover:bg-emerald-500 text-white hover:shadow-lg hover:shadow-emerald-900/20 transition-all">
                                <Save className="h-4 w-4" />
                            </Button>
                            <Button onClick={() => setEditingId(null)} variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-white hover:bg-white/5 transition-colors">
                                <X className="h-4 w-4" />
                            </Button>
                        </div>
                    </TableCell>
                </>
            ) : (
                <>
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
                        <button onClick={() => toggleSelect(cat._id)} className="text-slate-500 hover:text-white transition-colors">
                            {isSelected ? <CheckSquare className="h-4 w-4 text-blue-500" /> : <Square className="h-4 w-4" />}
                        </button>
                    </TableCell>
                    <TableCell className="font-medium text-slate-200">{cat.name}</TableCell>
                    <TableCell>
                        <div className="h-9 w-9 rounded-xl bg-blue-500/5 flex items-center justify-center border border-white/[0.03] shadow-inner">
                            <Icon className="h-5 w-5 text-blue-400/80" />
                        </div>
                    </TableCell>
                    <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                            <Button variant="ghost" size="icon" onClick={() => handleEdit(cat)} className="h-8 w-8 text-blue-400 hover:text-blue-300 hover:bg-blue-500/10 hover:shadow-inner transition-all">
                                <Edit2 className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => handleDelete(cat._id)} className="h-8 w-8 text-red-500 hover:text-red-400 hover:bg-red-500/10 hover:shadow-inner transition-all">
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </div>
                    </TableCell>
                </>
            )}
        </TableRow>
    );
}

export default function ManageCategoriesPage() {
    const [categories, setCategories] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedIds, setSelectedIds] = useState<string[]>([]);

    // Create state
    const [isCreating, setIsCreating] = useState(false);
    const [newName, setNewName] = useState("");
    const [newIconName, setNewIconName] = useState("Briefcase");

    // Edit state
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editName, setEditName] = useState("");
    const [editIconName, setEditIconName] = useState("");

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const res = await fetch("/api/categories");
            const data = await res.json();
            if (data.success) {
                setCategories(data.data);
            }
        } catch (error) {
            console.error("Failed to fetch categories");
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = async () => {
        if (!newName || !newIconName) return alert("Name and Icon Name are required");
        try {
            const res = await fetch("/api/categories", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name: newName, iconName: newIconName, sortOrder: categories.length }),
            });
            const data = await res.json();
            if (data.success) {
                setCategories([...categories, data.data]);
                setIsCreating(false);
                setNewName("");
                setNewIconName("Briefcase");
            } else {
                alert(data.message || "Failed to create category");
            }
        } catch (error) {
            console.error(error);
        }
    };

    const handleEdit = (cat: any) => {
        setEditingId(cat._id);
        setEditName(cat.name);
        setEditIconName(cat.iconName);
    };

    const handleUpdate = async (id: string) => {
        try {
            const res = await fetch(`/api/categories/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name: editName, iconName: editIconName }),
            });
            const data = await res.json();
            if (data.success) {
                setCategories(categories.map(cat => (cat._id === id ? data.data : cat)));
                setEditingId(null);
            } else {
                alert(data.message || "Failed to update category");
            }
        } catch (error) {
            console.error(error);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this category?")) return;
        try {
            const res = await fetch(`/api/categories/${id}`, { method: "DELETE" });
            const data = await res.json();
            if (data.success) {
                setCategories(categories.filter(cat => cat._id !== id));
            } else {
                alert(data.message || "Failed to delete category");
            }
        } catch (error) {
            console.error(error);
        }
    };

    const toggleSelectAll = () => {
        if (selectedIds.length === categories.length) {
            setSelectedIds([]);
        } else {
            setSelectedIds(categories.map(c => c._id));
        }
    };

    const toggleSelect = (id: string) => {
        setSelectedIds(prev =>
            prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
        );
    };

    const deleteSelected = async () => {
        if (!confirm(`Are you sure you want to delete ${selectedIds.length} categories?`)) return;
        try {
            await Promise.all(selectedIds.map(id => fetch(`/api/categories/${id}`, { method: "DELETE" })));
            setCategories(categories.filter(cat => !selectedIds.includes(cat._id)));
            setSelectedIds([]);
        } catch (error) {
            console.error(error);
            alert("Error deleting categories");
        }
    };

    const handleDragEnd = async (event: DragEndEvent) => {
        const { active, over } = event;

        if (over && active.id !== over.id) {
            const oldIndex = categories.findIndex((cat) => cat._id === active.id);
            const newIndex = categories.findIndex((cat) => cat._id === over.id);

            const newCategories = arrayMove(categories, oldIndex, newIndex);
            setCategories(newCategories);

            // Persist the new order
            try {
                const orders = newCategories.map((cat, index) => ({
                    id: cat._id,
                    sortOrder: index
                }));

                await fetch("/api/admin/reorder", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        model: "Category",
                        orders
                    })
                });
            } catch (error) {
                console.error("Failed to save category order:", error);
            }
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-white mb-2 shadow-sm drop-shadow-md uppercase">Job Categories</h1>
                    <p className="text-slate-400 font-medium tracking-wide text-sm">Organize and classify career paths for the frontend.</p>
                </div>
                <div className="flex items-center gap-3">
                    {selectedIds.length > 0 && (
                        <Button onClick={deleteSelected} variant="destructive" className="bg-red-600 hover:bg-red-700 hover:-translate-y-0.5 transition-transform shadow-lg shadow-red-900/20 font-black uppercase tracking-widest text-[10px] px-6">
                            <Trash2 className="h-4 w-4 mr-2" /> Delete ({selectedIds.length})
                        </Button>
                    )}
                    <Button onClick={() => setIsCreating(true)} className="bg-blue-600 hover:bg-blue-500 hover:-translate-y-0.5 transition-all shadow-lg shadow-blue-900/20 text-white font-black uppercase tracking-widest text-[10px] px-6">
                        <Plus className="h-4 w-4 mr-2" /> Add Category
                    </Button>
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
                                        {categories.length > 0 && selectedIds.length === categories.length ? <CheckSquare className="h-4 w-4" /> : <Square className="h-4 w-4" />}
                                    </button>
                                </TableHead>
                                <TableHead className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Category Name</TableHead>
                                <TableHead className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Visual Icon</TableHead>
                                <TableHead className="text-right text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {isCreating && (
                                <TableRow className="border-b border-white/[0.06] bg-white/[0.03]">
                                    <TableCell></TableCell>
                                    <TableCell></TableCell>
                                    <TableCell>
                                        <Input
                                            placeholder="e.g. Design"
                                            value={newName}
                                            onChange={e => setNewName(e.target.value)}
                                            className="h-9 w-full sm:w-[200px] bg-[#222] border-none text-white shadow-inner focus-visible:ring-1 focus-visible:ring-blue-500/50"
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <select
                                                value={newIconName}
                                                onChange={e => setNewIconName(e.target.value)}
                                                className="h-9 w-full sm:w-[180px] rounded-md bg-[#222] border-none text-white px-3 text-sm shadow-inner outline-none focus:ring-1 focus:ring-blue-500/50 cursor-pointer"
                                            >
                                                {CATEGORY_ICONS.map(icon => (
                                                    <option key={icon} value={icon}>{icon}</option>
                                                ))}
                                            </select>
                                            <div className="h-8 w-8 rounded-lg bg-blue-500/10 flex items-center justify-center border border-blue-500/20">
                                                {(() => {
                                                    // @ts-ignore
                                                    const Icon = Icons[newIconName] || Tag;
                                                    return <Icon className="h-4 w-4 text-blue-400" />
                                                })()}
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-2">
                                            <Button onClick={handleCreate} size="sm" className="bg-emerald-600 hover:bg-emerald-500 hover:shadow-lg hover:shadow-emerald-900/20 text-white h-9 px-3 transition-all">
                                                Save
                                            </Button>
                                            <Button onClick={() => setIsCreating(false)} variant="ghost" size="sm" className="text-slate-400 hover:text-white h-9 px-3 transition-colors">
                                                Cancel
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            )}

                            {loading ? (
                                <TableRow className="border-none">
                                    <TableCell colSpan={5} className="h-24 text-center text-slate-600 font-bold uppercase tracking-widest text-xs">Loading categories...</TableCell>
                                </TableRow>
                            ) : categories.length === 0 && !isCreating ? (
                                <TableRow className="border-none">
                                    <TableCell colSpan={5} className="h-24 text-center text-slate-600 font-bold uppercase tracking-widest text-xs">No categories found.</TableCell>
                                </TableRow>
                            ) : (
                                <SortableContext
                                    items={categories.map(c => c._id)}
                                    strategy={verticalListSortingStrategy}
                                >
                                    {categories.map((cat) => (
                                        <SortableRow
                                            key={cat._id}
                                            cat={cat}
                                            editingId={editingId}
                                            setEditingId={setEditingId}
                                            editName={editName}
                                            setEditName={setEditName}
                                            editIconName={editIconName}
                                            setEditIconName={setEditIconName}
                                            handleUpdate={handleUpdate}
                                            handleEdit={handleEdit}
                                            handleDelete={handleDelete}
                                            toggleSelect={toggleSelect}
                                            isSelected={selectedIds.includes(cat._id)}
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
