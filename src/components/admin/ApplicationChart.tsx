"use client";

import { useEffect, useState } from "react";
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid,
    Tooltip, ResponsiveContainer, Cell, TooltipProps,
} from "recharts";

type ViewMode = "days" | "months" | "years";

const VIEW_RANGES: Record<ViewMode, { label: string; value: number }[]> = {
    days: [{ label: "7D", value: 7 }, { label: "14D", value: 14 }, { label: "30D", value: 30 }],
    months: [{ label: "1M", value: 1 }, { label: "3M", value: 3 }, { label: "6M", value: 6 }, { label: "9M", value: 9 }, { label: "12M", value: 12 }],
    years: [{ label: "3Y", value: 3 }, { label: "5Y", value: 5 }, { label: "10Y", value: 10 }],
};

const DEFAULT_RANGE: Record<ViewMode, number> = { days: 7, months: 3, years: 3 };

const BAR_COLORS = [
    "#3b82f6", "#10b981", "#14b8a6", "#f59e0b",
    "#ef4444", "#8b5cf6", "#ec4899", "#06b6d4",
    "#84cc16", "#f97316", "#a855f7", "#e11d48",
];

function CustomTooltip({ active, payload, label }: TooltipProps<number, string>) {
    if (!active || !payload?.length) return null;
    const value = payload[0].value ?? 0;
    const color = payload[0].fill ?? "#3b82f6";
    return (
        <div style={{
            background: "#0a0a0a",
            border: `1.5px solid ${color}`,
            borderRadius: "12px",
            padding: "10px 16px",
            minWidth: 110,
            boxShadow: `0 8px 32px rgba(0,0,0,0.7), 0 0 0 1px ${color}20`,
        }}>
            <p style={{ color, fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 2 }}>
                {label}
            </p>
            <p style={{ color: "#fff", fontSize: 28, fontWeight: 900, lineHeight: 1 }}>
                {value}
            </p>
            <p style={{ color: "#64748b", fontSize: 10, marginTop: 4 }}>applications</p>
        </div>
    );
}

export function ApplicationChart() {
    const [view, setView] = useState<ViewMode>("months");
    const [range, setRange] = useState(3);
    const [data, setData] = useState<{ name: string; applications: number }[]>([]);
    const [loading, setLoading] = useState(true);

    // When switching view mode, reset range to default
    const handleViewChange = (v: ViewMode) => {
        setView(v);
        setRange(DEFAULT_RANGE[v]);
    };

    useEffect(() => {
        setLoading(true);
        fetch(`/api/admin/chart?view=${view}&range=${range}`)
            .then(r => r.json())
            .then(res => { if (res.success) setData(res.data); })
            .catch(console.error)
            .finally(() => setLoading(false));
    }, [view, range]);

    return (
        <div className="flex flex-col h-full w-full gap-3">

            {/* ── Top controls row ── */}
            <div className="flex flex-wrap items-center justify-between gap-2">

                {/* View mode tabs */}
                <div className="flex bg-[#1a1a1a] rounded-lg p-0.5 gap-0.5">
                    {(["days", "months", "years"] as ViewMode[]).map(v => (
                        <button
                            key={v}
                            onClick={() => handleViewChange(v)}
                            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all cursor-pointer capitalize ${view === v
                                    ? "bg-blue-600 text-white shadow-sm"
                                    : "text-slate-400 hover:text-slate-200"
                                }`}
                        >
                            {v}
                        </button>
                    ))}
                </div>

                {/* Range pills */}
                <div className="flex items-center gap-1.5 flex-wrap">
                    {VIEW_RANGES[view].map(({ label, value }) => (
                        <button
                            key={value}
                            onClick={() => setRange(value)}
                            className={`px-2.5 py-1 text-xs rounded-full font-semibold transition-all cursor-pointer ${range === value
                                    ? "bg-blue-600/20 text-blue-400 ring-1 ring-blue-500/50"
                                    : "bg-[#1a1a1a] text-slate-500 hover:text-slate-300 hover:bg-[#222]"
                                }`}
                        >
                            {label}
                        </button>
                    ))}
                </div>
            </div>

            {/* ── Chart ── */}
            <div className="flex-1 min-h-0">
                {loading ? (
                    <div className="h-full flex items-center justify-center">
                        <div className="text-slate-500 text-sm animate-pulse">Loading chart…</div>
                    </div>
                ) : (
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={data} margin={{ top: 8, right: 10, left: -20, bottom: 0 }} barCategoryGap="35%">
                            <CartesianGrid
                                strokeDasharray="4 4"
                                stroke="rgba(255,255,255,0.07)"
                                vertical={false}
                            />
                            <XAxis
                                dataKey="name"
                                stroke="#334155"
                                fontSize={11}
                                tickLine={false}
                                axisLine={false}
                                tick={{ fill: "#94a3b8" }}
                            />
                            <YAxis
                                stroke="#334155"
                                fontSize={11}
                                tickLine={false}
                                axisLine={false}
                                tick={{ fill: "#64748b" }}
                                allowDecimals={false}
                            />
                            <Tooltip
                                content={<CustomTooltip />}
                                cursor={{ fill: "rgba(255,255,255,0.04)", rx: 6 }}
                            />
                            <Bar dataKey="applications" radius={[6, 6, 0, 0]} maxBarSize={40}>
                                {data.map((_, i) => (
                                    <Cell
                                        key={`cell-${i}`}
                                        fill={BAR_COLORS[i % BAR_COLORS.length]}
                                        opacity={0.9}
                                    />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                )}
            </div>
        </div>
    );
}
