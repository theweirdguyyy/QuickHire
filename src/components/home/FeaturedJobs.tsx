import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { JobCard } from "./JobCard";

export function FeaturedJobs() {
    const jobs = [
        {
            title: "Email Marketing",
            company: "MailChimp",
            location: "Remote - US",
            type: "Full Time",
            description: "We are looking for an Email Marketing Specialist to help grow our email lists and run campaigns that drive engagement.",
            tags: ["Marketing", "Design"]
        },
        {
            title: "Brand Designer",
            company: "Dropbox",
            location: "San Francisco, CA",
            type: "Full Time",
            description: "Dropbox is looking for a Brand Designer to create beautiful experiences that inspire our users.",
            tags: ["Design", "Branding"]
        },
        {
            title: "Senior Marketing",
            company: "Slack",
            location: "London, UK",
            type: "Full Time",
            description: "Join Slack's marketing team to define our voice and grow our global presence through innovative campaigns.",
            tags: ["Marketing"]
        },
        {
            title: "Visual Designer",
            company: "Pinterest",
            location: "Remote",
            type: "Full Time",
            description: "Pinterest is searching for a Visual Designer to shape the visual identity of our brand and product.",
            tags: ["Design"]
        },
        {
            title: "Product Designer",
            company: "Spotify",
            location: "New York, NY",
            type: "Full Time",
            description: "Join our team to design experiences that connect millions of users to their favorite music and podcasts.",
            tags: ["UX", "Design"]
        },
        {
            title: "Data Analyst",
            company: "Stripe",
            location: "Remote",
            type: "Part Time",
            description: "Stripe needs a Data Analyst to extract meaningful insights from large datasets to inform our technical strategies.",
            tags: ["Data", "Finance"]
        }
    ];

    return (
        <section className="py-16 md:py-24 bg-white">
            <div className="w-full max-w-[1440px] mx-auto px-3 lg:px-4 xl:px-0">
                <div className="flex flex-col md:flex-row items-baseline justify-between mb-10 gap-4">
                    <h2 className="text-3xl font-bold tracking-tight text-slate-900">
                        Featured <span className="text-blue-600">jobs</span>
                    </h2>
                    <Link href="/jobs" className="text-sm font-medium text-blue-600 hover:text-blue-700 flex items-center gap-1">
                        Show all jobs <ArrowRight className="h-4 w-4" />
                    </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {jobs.map((job, i) => (
                        <JobCard key={i} {...job} />
                    ))}
                </div>
            </div>
        </section>
    );
}
