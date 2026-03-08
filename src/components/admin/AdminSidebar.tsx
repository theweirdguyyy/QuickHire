"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar";
import { LayoutDashboard, Briefcase, FileText, Tags, Settings } from "lucide-react";

const navItems = [
    { title: "Overview", url: "/admin", icon: LayoutDashboard },
    { title: "Manage Jobs", url: "/admin/jobs", icon: Briefcase },
    { title: "Applications", url: "/admin/applications", icon: FileText },
    { title: "Categories", url: "/admin/categories", icon: Tags },
    { title: "Settings", url: "/admin/settings", icon: Settings },
];

export function AdminSidebar() {
    const pathname = usePathname();

    return (
        <Sidebar className="border-none bg-[#0a0a0a] text-slate-300">
            <SidebarHeader className="h-16 flex items-center px-6 border-none">
                <Link href="/admin" className="flex items-center gap-2 font-bold text-lg text-white">
                    <div className="p-1.5 bg-blue-600 rounded-lg shadow-lg shadow-blue-900/20">
                        <Briefcase className="h-4 w-4 text-white" />
                    </div>
                    QuickHire Admin
                </Link>
            </SidebarHeader>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel className="text-slate-500 text-xs tracking-wider uppercase mb-2 px-6 mt-4">Dashboard</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu className="px-3 gap-1">
                            {navItems.map((item) => {
                                return (
                                    <SidebarMenuItem key={item.title}>
                                        <SidebarMenuButton
                                            isActive={pathname === item.url}
                                            className={`transition-all duration-200 py-6 px-4 ${pathname === item.url ? 'bg-blue-600/10 text-blue-500 font-medium' : 'hover:bg-white/5 hover:text-white'}`}
                                        >
                                            <Link href={item.url} className="flex items-center gap-3 w-full">
                                                <item.icon className="h-5 w-5" />
                                                <span>{item.title}</span>
                                            </Link>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                );
                            })}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
        </Sidebar>
    );
}
