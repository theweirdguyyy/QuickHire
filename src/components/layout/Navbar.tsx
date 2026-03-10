"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { User, ShieldCheck, Menu, X } from "lucide-react";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";

export function Navbar() {
    const pathname = usePathname();
    const isHome = pathname === "/";
    const { data: session } = useSession();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        if (!isHome) return;
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, [isHome]);

    // @ts-ignore - role is stored via JWT callback
    const role = session?.user?.role as string | undefined;

    return (
        <nav
            className={`
                ${isHome ? "fixed" : "sticky"} 
                top-0 w-full z-50 flex justify-center transition-all duration-300
                ${isHome
                    ? (isScrolled ? "bg-white/90 backdrop-blur-md border-b border-slate-100 shadow-sm" : "bg-transparent border-transparent")
                    : "bg-white border-b border-slate-100"
                }
            `}
        >
            <div className="w-full max-w-[1440px] px-3 lg:px-4 xl:px-0 flex h-20 items-center justify-between">
                <div className="flex items-center gap-10">
                    <Link href="/" className="flex items-center cursor-pointer">
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-[#4F46E5] mr-2">
                            <path d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
                            <circle cx="12" cy="12" r="4" fill="currentColor" />
                        </svg>
                        <span className="text-2xl font-extrabold text-[#293241] tracking-tight">
                            QuickHire
                        </span>
                    </Link>
                    <div className="hidden md:flex gap-8">
                        <Link href="/jobs" className="text-[15px] font-bold text-slate-500 hover:text-slate-900 transition-colors cursor-pointer">
                            Find Jobs
                        </Link>
                        <Link href="/companies" className="text-[15px] font-bold text-slate-500 hover:text-slate-900 transition-colors cursor-pointer">
                            Browse Companies
                        </Link>
                        {role === "admin" && (
                            <Link href="/admin" className="text-sm font-medium hover:text-blue-600 transition-colors flex items-center gap-1 cursor-pointer">
                                <ShieldCheck className="h-4 w-4" /> Admin
                            </Link>
                        )}
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <div className="hidden md:flex items-center gap-3">
                        {session?.user ? (
                            <>
                                <Link href="/dashboard" className="flex items-center gap-2 text-[15px] font-bold text-[#4F46E5] hover:text-[#4338CA] transition-colors cursor-pointer px-4">
                                    <User className="h-4 w-4" />
                                    Hi, {session.user.name?.split(" ")[0]}
                                </Link>
                                <Button
                                    className="bg-[#4F46E5] hover:bg-[#4338CA] text-white rounded-none px-6 py-5 text-[15px] font-bold cursor-pointer"
                                    onClick={() => signOut({ callbackUrl: "/" })}
                                >
                                    Sign out
                                </Button>
                            </>
                        ) : (
                            <>
                                <Link href="/login" className="cursor-pointer">
                                    <Button variant="ghost" className="text-[15px] font-bold text-[#4F46E5] hover:bg-transparent hover:text-[#4338CA] cursor-pointer px-6">Login</Button>
                                </Link>
                                <Link href="/signup" className="cursor-pointer">
                                    <Button className="bg-[#4F46E5] hover:bg-[#4338CA] text-white rounded-none px-8 py-6 text-[16px] font-bold cursor-pointer">Sign Up</Button>
                                </Link>
                            </>
                        )}
                    </div>
                    {/* Mobile Menu Button */}
                    <button
                        className={`md:hidden p-2.5 rounded-xl transition-all duration-300 cursor-pointer shadow-sm
                            ${isMenuOpen
                                ? "bg-red-50 text-red-500 hover:bg-red-100"
                                : "bg-blue-50 text-blue-600 hover:bg-blue-100"
                            }`}
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                    >
                        {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu Overlay */}
            {isMenuOpen && (
                <div className="md:hidden border-t bg-background animate-in slide-in-from-top duration-200">
                    <div className="container mx-auto px-4 py-6 flex flex-col gap-4">
                        <Link
                            href="/jobs"
                            className="text-lg font-medium hover:text-blue-600 py-2 border-b border-slate-50 cursor-pointer"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            Find a job
                        </Link>
                        <Link
                            href="/companies"
                            className="text-lg font-medium hover:text-blue-600 py-2 border-b border-slate-50 cursor-pointer"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            Browse Companies
                        </Link>
                        {role === "admin" && (
                            <Link
                                href="/admin"
                                className="text-lg font-medium hover:text-blue-600 py-2 border-b border-slate-50 flex items-center gap-2 cursor-pointer"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                <ShieldCheck className="h-5 w-5" /> Admin Panel
                            </Link>
                        )}
                        <div className="pt-4 flex flex-col gap-3">
                            {session?.user ? (
                                <>
                                    <Link
                                        href="/dashboard"
                                        className="flex items-center gap-2 text-lg font-medium text-slate-700 py-2 cursor-pointer"
                                        onClick={() => setIsMenuOpen(false)}
                                    >
                                        <User className="h-5 w-5" />
                                        Profile: {session.user.name}
                                    </Link>
                                    <Button
                                        variant="outline"
                                        className="w-full border-red-200 text-red-600 py-6 rounded-xl cursor-pointer"
                                        onClick={() => {
                                            setIsMenuOpen(false);
                                            signOut({ callbackUrl: "/" });
                                        }}
                                    >
                                        Sign out
                                    </Button>
                                </>
                            ) : (
                                <>
                                    <Link href="/login" className="w-full cursor-pointer" onClick={() => setIsMenuOpen(false)}>
                                        <Button variant="outline" className="w-full py-6 rounded-xl cursor-pointer">Log in</Button>
                                    </Link>
                                    <Link href="/signup" className="w-full cursor-pointer" onClick={() => setIsMenuOpen(false)}>
                                        <Button className="w-full bg-blue-600 hover:bg-blue-700 py-6 rounded-xl cursor-pointer">Sign Up Free</Button>
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
}
