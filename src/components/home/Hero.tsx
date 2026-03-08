"use client";

import { Search, MapPin, ChevronDown } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export function Hero() {
    const router = useRouter();
    const [keyword, setKeyword] = useState("");
    const [location, setLocation] = useState("");

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        const params = new URLSearchParams();
        if (keyword.trim()) params.set("q", keyword.trim());
        if (location.trim()) params.set("location", location.trim());
        router.push(`/jobs?${params.toString()}`);
    };

    return (
        /*
         * Figma Spec:
         * Header frame: 1440 × 794px.
         * BG Color: #FBFBFD.
         */
        <section
            className="relative w-full overflow-hidden bg-[#FBFBFD] min-h-[100vh] lg:min-h-[100%] lg:h-[794px] "
        >

            {/* ── White diagonal cut — Masking the bottom corner ── */}
            <div
                style={{
                    position: "absolute",
                    bottom: 0,
                    right: 0,
                    width: "55%",
                    height: "36%",
                    background: "white",
                    clipPath: "polygon(40% 100%, 100% 0%, 100% 100%)",
                    zIndex: 15,
                    pointerEvents: "none",
                }}
            />

            {/* ── Desktop Background Assets (Hidden on lg- screens to prevent overlap issues) ── */}
            <div className="hidden lg:block absolute inset-0 w-full h-full mx-auto max-w-[1440px] pointer-events-none z-0">
                {/* ── Background Pattern — FIXED: Anchored to right ── */}
                <img
                    src="/Pattern.png"
                    alt=""
                    aria-hidden="true"
                    style={{
                        position: "absolute",
                        bottom: 0,
                        right: "-150px",
                        width: "100%",
                        height: "100%",
                        objectFit: "contain",
                        objectPosition: "right bottom",
                        zIndex: 1,
                        pointerEvents: "none",
                    }}
                />

                {/* ── Hero Character — FIXED: Anchored to right for exact alignment ── */}
                <img
                    src="/hero-image.png"
                    alt="Job seeker"
                    className="absolute bottom-[-10px] right-[-23px] w-[501px] h-[707px] object-contain z-10 pointer-events-none"
                    style={{
                        clipPath: "polygon(0 0, 95% 0, 95% 10%, 100% 10%, 100% 100%, 0 100%)"
                    }}
                    onError={(e) => { e.currentTarget.style.display = "none"; }}
                />


            </div>

            {/* ── Content Group ── */}
            <div className="relative z-30 w-full max-w-[1440px] mx-auto px-3 lg:px-4 xl:px-0 pt-32 md:pt-40 lg:pt-[160px] pb-24 flex flex-col">
                {/* Headline */}
                <h1 className="text-6xl md:text-7xl lg:text-[96px] font-extrabold text-[#293241] leading-[1.1] tracking-tight mb-8 lg:mb-0">
                    Discover <br />
                    more than <br />
                    <span className="text-[#1C9CEA] relative inline-block">
                        5000+ Jobs
                        <svg
                            className="absolute left-0 -bottom-[5px] lg:-bottom-[15px] w-[105%] h-[12px] lg:h-[20px] text-[#1C9CEA]"
                            viewBox="0 0 360 14"
                            fill="none"
                            preserveAspectRatio="none"
                        >
                            <path d="M2 7C58 4.5 148 2 230 2C269 2 304 3 341 4.5C346 4.7 348 2.5 348 0.5C348 -1.8 345 -3 341 -2.5C304 -1 269 -2 230 -2C148 -2 58 0.5 2 3C-1 3.2 -2 5.5 -1 7C-0.3 7.8 1 7.3 2 7Z" fill="currentColor" />
                            <path d="M7 12.5C52 10.2 122 9 190 8.8C223 8.7 252 8.9 273 9.3C277 9.4 279 8 278 6.2C277 4.2 274 3.7 271 3.7C250 3.5 221 3.3 190 3.4C122 3.7 52 5.1 7 7.3C5.2 7.4 4.3 9.3 5.2 10.7C5.8 11.7 6.2 12.6 7 12.5Z" fill="currentColor" />
                        </svg>
                    </span>
                </h1>

                {/* Tagline */}
                <p className="text-[#8492a6] text-lg lg:text-xl leading-relaxed mt-6 lg:mt-10 mb-8 lg:mb-10 max-w-xl">
                    Great platform for the job seeker that searching for<br className="hidden lg:block" />
                    new career heights and passionate about startups.
                </p>

                {/* Search Bar */}
                <form
                    onSubmit={handleSearch}
                    className="flex flex-col lg:flex-row items-stretch lg:items-center bg-transparent lg:bg-white lg:shadow-[0_10px_40px_rgba(80,90,200,0.08)] w-full max-w-[1100px] mb-6 lg:h-[82px] lg:px-2 gap-4 lg:gap-0"
                >
                    <div className="flex bg-white items-center px-4 lg:px-6 flex-1 h-[60px] lg:h-full relative shadow-sm lg:shadow-none border lg:border-none border-slate-200">
                        <Search className="h-5 w-5 lg:h-6 lg:w-6 text-[#293241] shrink-0 mr-4" />
                        <div className="flex-1 relative h-full flex items-center">
                            <input
                                type="text"
                                placeholder="Job title or keyword"
                                value={keyword}
                                onChange={e => setKeyword(e.target.value)}
                                className="w-full text-base lg:text-lg text-[#293241] bg-transparent outline-none pb-1 lg:pb-2"
                            />
                            <div className="hidden lg:block absolute bottom-4 left-0 right-0 h-[1px] bg-[#E2E8F0]" />
                        </div>
                    </div>

                    <div className="flex bg-white items-center px-4 lg:px-6 flex-1 h-[60px] lg:h-full relative shadow-sm lg:shadow-none border lg:border-none border-slate-200">
                        <MapPin className="h-5 w-5 lg:h-6 lg:w-6 text-[#293241] shrink-0 mr-4" />
                        <div className="flex-1 relative h-full flex items-center">
                            <input
                                type="text"
                                placeholder="Florence, Italy"
                                value={location}
                                onChange={e => setLocation(e.target.value)}
                                className="w-full text-base lg:text-lg text-[#293241] bg-transparent outline-none pb-1 lg:pb-2"
                            />
                            {/* <ChevronDown className="absolute right-0 bottom-1/2 translate-y-1/2 lg:translate-y-0 lg:bottom-[18px] h-5 w-5 text-[#94A3B8]" /> */}
                            <div className="hidden lg:block absolute bottom-4 left-0 right-0 h-[1px] bg-[#E2E8F0]" />
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="bg-[#4F46E5] hover:bg-[#4338CA] text-white w-full lg:w-[212px] h-[60px] lg:h-[56px] font-bold text-lg lg:ml-2 transition-colors cursor-pointer"
                    >
                        Search my job
                    </button>
                </form>

                {/* Popular tags */}
                <p className="text-base text-[#9aa5b4]">
                    Popular :{" "}
                    <span className="text-[#475467] font-medium">
                        UI Designer, UX Researcher, Android, Admin
                    </span>
                </p>
            </div>
        </section>
    );
}