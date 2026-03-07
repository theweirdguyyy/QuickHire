import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Facebook, Twitter, Instagram, Linkedin, Github } from "lucide-react";

export function Footer() {
    return (
        <footer className="bg-slate-900 text-slate-300">
            <div className="container mx-auto max-w-7xl px-4 md:px-6 py-12 lg:py-16">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 lg:gap-12">
                    <div className="col-span-1 md:col-span-1">
                        <Link href="/" className="flex items-center space-x-2 mb-4">
                            <span className="text-xl font-bold text-white">QuickHire</span>
                        </Link>
                        <p className="text-sm text-slate-400 mb-6">
                            Great platform for the job seeker that passionate about startups. Find your dream job easier.
                        </p>
                    </div>

                    <div className="col-span-1">
                        <h3 className="text-white font-semibold mb-4">About</h3>
                        <ul className="space-y-3 text-sm">
                            <li><Link href="/companies" className="hover:text-white transition-colors">Companies</Link></li>
                            <li><Link href="/pricing" className="hover:text-white transition-colors">Pricing</Link></li>
                            <li><Link href="/terms" className="hover:text-white transition-colors">Terms</Link></li>
                            <li><Link href="/advice" className="hover:text-white transition-colors">Advice</Link></li>
                            <li><Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
                        </ul>
                    </div>

                    <div className="col-span-1">
                        <h3 className="text-white font-semibold mb-4">Resources</h3>
                        <ul className="space-y-3 text-sm">
                            <li><Link href="/help" className="hover:text-white transition-colors">Help Docs</Link></li>
                            <li><Link href="/guide" className="hover:text-white transition-colors">Guide</Link></li>
                            <li><Link href="/updates" className="hover:text-white transition-colors">Updates</Link></li>
                            <li><Link href="/contact" className="hover:text-white transition-colors">Contact Us</Link></li>
                        </ul>
                    </div>

                    <div className="col-span-1 md:col-span-1 lg:col-span-1">
                        <h3 className="text-white font-semibold mb-4">Get job notifications</h3>
                        <p className="text-sm text-slate-400 mb-4">The latest job news, articles, sent to your inbox weekly.</p>
                        <div className="flex flex-col sm:flex-row gap-2">
                            <Input
                                type="email"
                                placeholder="Email Address"
                                className="bg-slate-800 border-slate-700 text-slate-200 placeholder:text-slate-500 h-10 w-full"
                            />
                            <Button className="bg-blue-600 hover:bg-blue-700 whitespace-nowrap">Subscribe</Button>
                        </div>
                    </div>
                </div>

                <div className="mt-12 pt-8 border-t border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
                    <p className="text-sm text-slate-500">
                        2026 © QuickHire. All rights reserved.
                    </p>
                    <div className="flex items-center gap-4">
                        <Link href="#" className="text-slate-500 hover:text-white transition-colors"><Facebook className="h-5 w-5" /></Link>
                        <Link href="#" className="text-slate-500 hover:text-white transition-colors"><Twitter className="h-5 w-5" /></Link>
                        <Link href="#" className="text-slate-500 hover:text-white transition-colors"><Instagram className="h-5 w-5" /></Link>
                        <Link href="#" className="text-slate-500 hover:text-white transition-colors"><Linkedin className="h-5 w-5" /></Link>
                        <Link href="#" className="text-slate-500 hover:text-white transition-colors"><Github className="h-5 w-5" /></Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
