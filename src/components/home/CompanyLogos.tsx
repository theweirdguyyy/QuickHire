"use client";

export function CompanyLogos() {
    const companies = [
        {
            name: "Vodafone",
            logo: (
                <svg viewBox="0 0 120 40" className="h-12 w-auto" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="20" cy="20" r="16" fill="#E60000" />
                    <path d="M20 10 C26 10 30 14.5 30 20 C30 25.5 26 30 20 30 C16 30 12.5 27.5 11 24 C13 25 15.5 25.5 18 24.5 C22 23 24 19.5 24 16 C24 13.5 22.5 11.5 20 10Z" fill="white" />
                    <text x="42" y="25" fontFamily="Arial, sans-serif" fontSize="14" fontWeight="bold" fill="#333">Vodafone</text>
                </svg>
            ),
        },
        {
            name: "Intel",
            logo: (
                <svg viewBox="0 0 80 40" className="h-12 w-auto" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <text x="0" y="28" fontFamily="Arial, sans-serif" fontSize="22" fontWeight="bold" fill="#0071C5" letterSpacing="-1">intel</text>
                    <circle cx="70" cy="8" r="5" fill="#0071C5" />
                </svg>
            ),
        },
        {
            name: "Tesla",
            logo: (
                <svg viewBox="0 0 90 40" className="h-12 w-auto" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M45 5 L45 35" stroke="#CC0000" strokeWidth="2.5" />
                    <path d="M30 5 Q45 2 60 5" stroke="#CC0000" strokeWidth="2.5" fill="none" />
                    <path d="M30 5 Q33 8 45 5 Q57 8 60 5" stroke="#CC0000" strokeWidth="1.5" fill="none" />
                    <text x="2" y="36" fontFamily="Arial, sans-serif" fontSize="13" fontWeight="bold" fill="#333" letterSpacing="2">TESLA</text>
                </svg>
            ),
        },
        {
            name: "AMD",
            logo: (
                <svg viewBox="0 0 70 40" className="h-12 w-auto" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M8 30 L20 10 L32 30" stroke="#ED1C24" strokeWidth="3" fill="none" strokeLinejoin="round" />
                    <path d="M12 24 L28 24" stroke="#ED1C24" strokeWidth="3" />
                    <text x="38" y="28" fontFamily="Arial, sans-serif" fontSize="14" fontWeight="bold" fill="#333">AMD</text>
                </svg>
            ),
        },
        {
            name: "Talkit",
            logo: (
                <svg viewBox="0 0 90 40" className="h-12 w-auto" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="2" y="8" width="28" height="24" rx="6" fill="#4F46E5" />
                    <path d="M8 20 Q16 14 24 20" stroke="white" strokeWidth="2" fill="none" />
                    <circle cx="16" cy="24" r="2" fill="white" />
                    <text x="36" y="26" fontFamily="Arial, sans-serif" fontSize="14" fontWeight="bold" fill="#333">Talkit</text>
                </svg>
            ),
        },
    ];

    return (
        <section className="py-10 md:py-12 bg-white relative z-30">
            <div className="w-full max-w-[1440px] mx-auto px-3 lg:px-4 xl:px-0">
                {/* Mobile: label on top, logos below */}
                <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-10">
                    <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest whitespace-nowrap shrink-0">
                        Companies we<br className="hidden md:block" /> helped grow
                    </p>
                    <div className="hidden md:block w-px h-10 bg-slate-200 shrink-0" />
                    <div className="flex flex-1 flex-wrap items-center justify-between gap-x-6 gap-y-4">
                        {companies.map((company) => (
                            <div
                                key={company.name}
                                className="flex items-center opacity-60 hover:opacity-100 transition-opacity grayscale hover:grayscale-0"
                                title={company.name}
                            >
                                {company.logo}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
