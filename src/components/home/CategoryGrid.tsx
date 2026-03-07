"use client";

import { ArrowRight, Tag } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import * as Icons from "lucide-react";

interface Category {
    _id: string;
    name: string;
    iconName: string;
    jobCount: number;
}

export function CategoryGrid() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCats = async () => {
            try {
                const res = await fetch("/api/categories");
                const data = await res.json();
                if (data.success) {
                    setCategories(data.data.slice(0, 8));
                }
            } catch (error) {
                console.error("Error fetching categories:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchCats();
    }, []);

    if (loading) return (
        <section className="pt-10 pb-16 md:pt-12 md:pb-24 bg-white">
            <div className="container mx-auto max-w-7xl px-4 md:px-6 text-center">
                <p className="text-slate-500 font-medium animate-pulse">Loading job categories...</p>
            </div>
        </section>
    );

    return (
        <section className="pt-10 pb-16 md:pt-12 md:pb-24 bg-white">
            <div className="w-full max-w-[1440px] mx-auto px-3 lg:px-4 xl:px-0">
                <div className="flex flex-col md:flex-row items-baseline justify-between mb-10 gap-4">
                    <h2 className="text-3xl font-bold tracking-tight text-slate-900">
                        Explore by <span className="text-blue-600 font-extrabold italic">categories</span>
                    </h2>
                    <Link href="/categories" className="text-sm font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 group/link">
                        View all 40+ categories <ArrowRight className="h-4 w-4 group-hover/link:translate-x-1 transition-transform" />
                    </Link>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {categories.map((cat) => {
                        // @ts-ignore
                        const Icon = Icons[cat.iconName] || Tag;
                        return (
                            <Link
                                key={cat._id}
                                href={`/categories?cat=${encodeURIComponent(cat.name)}`}
                                className="group relative flex flex-col items-start rounded-3xl p-6 transition-all duration-200 cursor-pointer bg-white border-2 border-slate-100 hover:bg-blue-600 hover:border-blue-600 hover:shadow-2xl hover:shadow-blue-200/50"
                            >
                                <div className="mb-6 inline-flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 group-hover:bg-white group-hover:text-blue-600 transition-all shadow-inner group-hover:scale-110">
                                    <Icon className="h-7 w-7" />
                                </div>
                                <h3 className="text-lg font-extrabold mb-2 truncate w-full text-slate-800 group-hover:text-white transition-colors">
                                    {cat.name}
                                </h3>
                                <p className="text-xs flex items-center gap-2 w-full justify-between text-slate-500 group-hover:text-blue-100 font-bold uppercase tracking-wider transition-colors">
                                    Explore Careers
                                    <span className="h-8 w-8 flex items-center justify-center rounded-full bg-slate-100 text-slate-600 group-hover:bg-white group-hover:text-blue-600 transition-all">
                                        <ArrowRight className="h-4 w-4" />
                                    </span>
                                </p>
                            </Link>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
