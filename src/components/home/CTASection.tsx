import { Button } from "@/components/ui/button";

export function CTASection() {
    return (
        <section className="py-16 bg-white overflow-hidden">
            <div className="w-full max-w-[1440px] mx-auto px-3 lg:px-4 xl:px-0">
                <div className="bg-blue-600 rounded-3xl overflow-hidden relative shadow-xl">
                    <div className="absolute inset-0 bg-[url('/bg-pattern-light.svg')] opacity-10 bg-cover bg-center mix-blend-overlay"></div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 p-8 md:p-16 items-center gap-12 relative z-10">
                        <div className="text-white max-w-lg">
                            <h2 className="text-3xl md:text-5xl font-bold mb-6 leading-tight">
                                Start posting <br className="hidden sm:block" />
                                jobs today
                            </h2>
                            <p className="text-blue-100 text-lg mb-8">
                                Start posting jobs for only $10. Reach thousands of active job seekers instantly.
                            </p>
                            <Button size="lg" className="bg-white text-blue-600 hover:bg-slate-50 border-none font-semibold px-8 py-6 rounded-xl shadow-lg">
                                Sign up for free
                            </Button>
                        </div>

                        <div className="relative h-full min-h-[300px] w-full mt-12 mb-[-80px] lg:my-0 lg:-mr-12 rounded-xl overflow-hidden bg-slate-900 shadow-2xl skew-y-2 transform -rotate-2 border-8 border-slate-800">
                            {/* Dashboard illustration mockup */}
                            <div className="absolute inset-0 bg-slate-50 flex flex-col p-4 opacity-90">
                                <div className="h-6 w-full flex gap-2 border-b pb-2 mb-4">
                                    <div className="h-3 w-3 bg-red-400 rounded-full"></div>
                                    <div className="h-3 w-3 bg-yellow-400 rounded-full"></div>
                                    <div className="h-3 w-3 bg-green-400 rounded-full"></div>
                                </div>
                                <div className="flex gap-4 mb-4">
                                    <div className="h-24 w-1/3 bg-white rounded shadow-sm border p-3 flex flex-col justify-between">
                                        <div className="h-4 w-1/2 bg-slate-200 rounded"></div>
                                        <div className="h-8 w-2/3 bg-slate-300 rounded"></div>
                                    </div>
                                    <div className="h-24 w-1/3 bg-white rounded shadow-sm border p-3 flex flex-col justify-between">
                                        <div className="h-4 w-1/2 bg-slate-200 rounded"></div>
                                        <div className="h-8 w-2/3 bg-slate-300 rounded"></div>
                                    </div>
                                    <div className="h-24 w-1/3 bg-blue-600 rounded shadow-sm border p-3 flex flex-col justify-between">
                                        <div className="h-4 w-1/2 bg-blue-400 rounded"></div>
                                        <div className="h-8 w-full bg-blue-100 rounded"></div>
                                    </div>
                                </div>
                                <div className="flex gap-4 flex-1">
                                    <div className="flex-1 bg-white border rounded shadow-sm"></div>
                                    <div className="w-1/3 bg-white border rounded shadow-sm"></div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </section>
    );
}
