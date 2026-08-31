"use client";

import { useState } from "react";
import {
    Mail,
    Phone,
    MapPin,
    Send,
    Bug,
    MessageSquare,
    Clock,
} from "lucide-react";
import toast from "react-hot-toast";
import {post_report} from "@/app/lib/api/report";
export default function HelpSupportPage() {
    const [formData, setFormData] = useState({
        subject: "",
        type: "Bug Report",
        discription: "",
    });

    const handleChange = (
        e: React.ChangeEvent<
            HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
        >
    ) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.subject || !formData.discription) {
            toast.error("Please fill in all required fields");
            return;
        }

        try {
            const post = await post_report(formData);

            console.log(post);

            toast.success("Support request submitted successfully");

            setFormData({
                subject: "",
                type: "",
                discription: "",
            });

        } catch (error) {
            console.error(error);
            toast.error("Failed to submit support request");
        }
    };

    return (
        <main className="min-h-screen bg-slate-50 px-4 py-20 text-slate-900 dark:bg-slate-900 dark:text-white sm:px-6 lg:px-8">
            <div className="mx-auto max-w-6xl">

                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
                        Help & Support
                    </h1>

                    <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                        Need help or found a problem? Contact us or send us a
                        report and we'll get back to you.
                    </p>
                </div>

                <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">

                    {/* Contact Information */}
                    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-white/[0.07] dark:bg-white/[0.03]">

                        <div className="mb-7">
                            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-500/10 text-blue-500">
                                <MessageSquare className="h-5 w-5" />
                            </div>

                            <h2 className="mt-4 text-lg font-semibold">
                                Contact DoctRisk
                            </h2>

                            <p className="mt-1 text-sm leading-6 text-slate-500 dark:text-slate-400">
                                Our team is here to help with technical issues,
                                bugs, account problems, or general questions.
                            </p>
                        </div>

                        <div className="space-y-4">

                            {/* Email */}
                            <div className="flex gap-4 rounded-xl border border-slate-200 p-4 dark:border-white/[0.06]">
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-500/10 text-blue-500">
                                    <Mail className="h-5 w-5" />
                                </div>

                                <div>
                                    <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                                        Email
                                    </p>

                                    <p className="mt-1 text-sm font-semibold">
                                        support@yourdomain.com
                                    </p>

                                    <p className="mt-1 text-xs text-slate-500">
                                        Usually replies within 24 hours
                                    </p>
                                </div>
                            </div>

                            {/* Phone */}
                            <div className="flex gap-4 rounded-xl border border-slate-200 p-4 dark:border-white/[0.06]">
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-500">
                                    <Phone className="h-5 w-5" />
                                </div>

                                <div>
                                    <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                                        Phone
                                    </p>

                                    <p className="mt-1 text-sm font-semibold">
                                        +977 98XXXXXXXX
                                    </p>

                                    <p className="mt-1 text-xs text-slate-500">
                                        Mon - Fri, 9:00 AM - 5:00 PM
                                    </p>
                                </div>
                            </div>

                            {/* Location */}
                            <div className="flex gap-4 rounded-xl border border-slate-200 p-4 dark:border-white/[0.06]">
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-purple-500/10 text-purple-500">
                                    <MapPin className="h-5 w-5" />
                                </div>

                                <div>
                                    <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                                        Office
                                    </p>

                                    <p className="mt-1 text-sm font-semibold">
                                        Kathmandu, Nepal
                                    </p>

                                    <p className="mt-1 text-xs text-slate-500">
                                        DoctRisk Headquarters
                                    </p>
                                </div>
                            </div>

                            {/* Support hours */}
                            <div className="flex gap-4 rounded-xl border border-slate-200 p-4 dark:border-white/[0.06]">
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-orange-500/10 text-orange-500">
                                    <Clock className="h-5 w-5" />
                                </div>

                                <div>
                                    <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                                        Support Hours
                                    </p>

                                    <p className="mt-1 text-sm font-semibold">
                                        Monday - Friday
                                    </p>

                                    <p className="mt-1 text-xs text-slate-500">
                                        9:00 AM - 5:00 PM
                                    </p>
                                </div>
                            </div>

                        </div>
                    </section>

                    {/* Problem Form */}
                    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-white/[0.07] dark:bg-white/[0.03]">

                        <div className="mb-7 flex items-start gap-4">
                            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-red-500/10 text-red-500">
                                <Bug className="h-5 w-5" />
                            </div>

                            <div>
                                <h2 className="text-lg font-semibold">
                                    Report a Problem
                                </h2>

                                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                                    Found a bug or experiencing an issue?
                                    Tell us what happened.
                                </p>
                            </div>
                        </div>

                        <form
                            onSubmit={handleSubmit}
                            className="space-y-5"
                        >

                            {/* Subject */}
                            <div>
                                <label className="mb-2 block text-sm font-medium">
                                    Subject
                                </label>

                                <input
                                    type="text"
                                    name="subject"
                                    value={formData.subject}
                                    onChange={handleChange}
                                    placeholder="Example: Unable to add a patient"
                                    className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 dark:border-white/[0.08] dark:bg-white/[0.04]"
                                />
                            </div>

                            {/* Problem Type */}
                            <div>
                                <label className="mb-2 block text-sm font-medium">
                                    Problem Type
                                </label>

                                <select
                                    name="type"
                                    value={formData.type}
                                    onChange={handleChange}
                                    className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm outline-none transition focus:border-blue-500 dark:border-white/[0.08] dark:bg-white/[0.04]"
                                >
                                    <option>Bug Report</option>
                                    <option>Technical Problem</option>
                                    <option>Account Problem</option>
                                    <option>API Problem</option>
                                    <option>Other</option>
                                </select>
                            </div>

                            {/* Message */}
                            <div>
                                <label className="mb-2 block text-sm font-medium">
                                    Describe the Problem
                                </label>

                                <textarea
                                    name="discription"
                                    value={formData.discription}
                                    onChange={handleChange}
                                    rows={7}
                                    placeholder="Tell us what happened, what you expected, and what happened instead..."
                                    className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm leading-6 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 dark:border-white/[0.08] dark:bg-white/[0.04]"
                                />
                            </div>

                            {/* Submit */}
                            <button
                                type="submit"
                                className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 text-sm font-semibold text-white transition hover:bg-blue-500 active:scale-[0.99]"
                            >
                                <Send className="h-4 w-4" />
                                Send Report
                            </button>

                        </form>
                    </section>
                </div>

                {/* Bottom note */}
                <div className="mt-6 rounded-xl border border-blue-200 bg-blue-50 px-5 py-4 dark:border-blue-500/20 dark:bg-blue-500/[0.05]">
                    <p className="text-sm text-blue-700 dark:text-blue-300">
                        <span className="font-semibold">Tip:</span>{" "}
                        When reporting a bug, include the page where it
                        happened and what you were doing when the problem
                        occurred. This helps us resolve it faster.
                    </p>
                </div>

            </div>
        </main>
    );
}