"use client";

import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button"; // kept for Browse Jobs button

export default function DashboardPage() {
    const { data: session, status } = useSession();
    const router = useRouter();

    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/login");
        }
    }, [status, router]);

    if (status === "loading") {
        return (
            <div className="container mx-auto max-w-7xl flex h-[calc(100vh-4rem)] items-center justify-center">
                <p>Loading your dashboard...</p>
            </div>
        );
    }

    if (!session) {
        return null;
    }

    return (
        <div className="container mx-auto max-w-7xl py-12 px-4 md:px-6 min-h-[calc(100vh-4rem)]">
            <div className="mb-8">
                <h1 className="text-3xl font-bold tracking-tight text-slate-900">
                    User <span className="text-blue-600">Dashboard</span>
                </h1>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="col-span-1 border shadow-sm">
                    <CardHeader>
                        <CardTitle>Profile Details</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex flex-col items-center p-4 border rounded-xl bg-slate-50">
                            <div className="h-24 w-24 bg-blue-100 rounded-full mb-4 flex items-center justify-center text-blue-600 text-3xl font-bold border-4 border-white shadow-sm">
                                {session?.user?.name?.charAt(0) || "U"}
                            </div>
                            <h3 className="text-xl font-bold">{session?.user?.name}</h3>
                            <p className="text-sm text-slate-500">{session?.user?.email}</p>
                        </div>

                        <div className="space-y-2 pt-4">
                            <div className="flex justify-between text-sm py-2 border-b">
                                <span className="text-slate-500">Role</span>
                                <span className="font-medium">Applicant</span>
                            </div>
                            <div className="flex justify-between text-sm py-2 border-b">
                                <span className="text-slate-500">Member Since</span>
                                <span className="font-medium">Today</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="col-span-1 md:col-span-2 border shadow-sm">
                    <CardHeader>
                        <CardTitle>Recent Activity</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-col items-center justify-center py-12 text-center">
                            <div className="h-16 w-16 bg-slate-100 rounded-full flex items-center justify-center mb-4 border">
                                <span className="text-2xl text-slate-300">📁</span>
                            </div>
                            <h3 className="text-lg font-medium text-slate-900 mb-1">No applications yet</h3>
                            <p className="text-slate-500 max-w-sm mb-6">
                                You haven't applied to any jobs yet. Start browsing thousands of opportunities on our platform.
                            </p>
                            <Button className="bg-blue-600 hover:bg-blue-700" onClick={() => router.push("/jobs")}>
                                Browse Jobs
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
