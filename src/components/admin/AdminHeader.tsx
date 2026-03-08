"use client";

import { SidebarTrigger } from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import Link from "next/link";

export function AdminHeader() {
    return (
        <header className="h-16 flex items-center justify-between px-4 lg:px-6 border-none bg-[#0a0a0a] shadow-md z-10 sticky top-0">
            <div className="flex items-center gap-4">
                <SidebarTrigger className="text-slate-400 hover:text-white transition-colors" />

                <div className="hidden md:flex relative items-center max-w-sm ml-4">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                    <Input
                        placeholder="Search dashboard..."
                        className="pl-9 h-9 w-[300px] bg-[#111] border-none text-slate-200 placeholder:text-slate-500 shadow-inner rounded-full focus-visible:ring-1 focus-visible:ring-blue-500/50"
                    />
                </div>
            </div>

            <div className="flex items-center gap-4">
                <DropdownMenu>
                    <DropdownMenuTrigger className="flex items-center gap-2 outline-none cursor-pointer group hover:scale-105 transition-transform duration-200">
                        <Avatar className="h-8 w-8 ring-2 ring-transparent group-hover:ring-blue-500/50 transition-all shadow-md">
                            <AvatarImage src="https://github.com/shadcn.png" alt="Admin" />
                            <AvatarFallback className="bg-blue-600 text-white text-xs">AD</AvatarFallback>
                        </Avatar>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56 bg-[#111] border-none shadow-xl text-slate-200">
                        <DropdownMenuGroup>
                            <DropdownMenuLabel>My Account</DropdownMenuLabel>
                        </DropdownMenuGroup>
                        <DropdownMenuSeparator className="bg-[#222]" />
                        <DropdownMenuGroup>
                            <DropdownMenuItem className="focus:bg-[#1a1a1a] focus:text-white cursor-pointer transition-colors">Profile</DropdownMenuItem>
                            <DropdownMenuItem className="focus:bg-[#1a1a1a] focus:text-white cursor-pointer transition-colors">Settings</DropdownMenuItem>
                        </DropdownMenuGroup>
                        <DropdownMenuSeparator className="bg-[#222]" />
                        <DropdownMenuGroup>
                            <DropdownMenuItem className="focus:bg-red-500/20 focus:text-red-400 cursor-pointer transition-colors p-0">
                                <Link href="/" className="w-full px-2 py-1.5 rounded-sm">Exit Dashboard</Link>
                            </DropdownMenuItem>
                        </DropdownMenuGroup>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </header>
    );
}
