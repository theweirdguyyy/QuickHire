import { SidebarProvider } from "@/components/ui/sidebar";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { ReactNode } from "react";

export default function AdminLayout({ children }: { children: ReactNode }) {
    return (
        <SidebarProvider>
            <div data-admin="true" className="flex min-h-screen bg-[#050505] text-slate-50 w-full overflow-hidden font-sans">
                <AdminSidebar />
                <div className="flex-1 flex flex-col h-screen overflow-hidden">
                    <AdminHeader />
                    <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
                        {children}
                    </main>
                </div>
            </div>
        </SidebarProvider>
    );
}
