"use client";

import {
    X,
    Pencil,
    UserRound,
    CalendarDays,
    Phone,
    Mail,
    MapPin,
    HeartPulse,
    Droplets,
    ShieldAlert,
    Pill,
    FileText,
    UserRoundCheck,
    Activity,
} from "lucide-react";

type Patient = {
    id: number | string;
    first_name?: string;
    last_name?: string;
    date_of_birth?: string;
    email?: string;
    phone?: string;
    gender?: string;
    blood_group?: string;
    address?: string;
    emergency_contact?: string;
    allergies?: string;
    medical_history?: string;
    current_medications?: string;
    notes?: string;
    note?: string;
    status?: string;
};

interface PatientProfileModalProps {
    patient: Patient | null;
    open: boolean;
    onClose: () => void;
    onEdit?: (patient: Patient) => void;
}

export default function PatientProfileModal({
                                                patient,
                                                open,
                                                onClose,
                                                onEdit,
                                            }: PatientProfileModalProps) {
    if (!open || !patient) return null;

    const fullName =
        `${patient.first_name || ""} ${patient.last_name || ""}`.trim() ||
        "Unknown Patient";

    const initials =
        `${patient.first_name?.[0] || ""}${patient.last_name?.[0] || ""}`
            .toUpperCase() || "P";

    const isActive =
        patient.status?.toLowerCase() === "active";

    const formatDate = (date?: string) => {
        if (!date) return "Not provided";

        const parsedDate = new Date(date);

        if (Number.isNaN(parsedDate.getTime())) {
            return date;
        }

        return parsedDate.toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    };

    const calculateAge = (date?: string) => {
        if (!date) return null;

        const birthDate = new Date(date);

        if (Number.isNaN(birthDate.getTime())) {
            return null;
        }

        const today = new Date();

        let age =
            today.getFullYear() -
            birthDate.getFullYear();

        const monthDifference =
            today.getMonth() -
            birthDate.getMonth();

        if (
            monthDifference < 0 ||
            (
                monthDifference === 0 &&
                today.getDate() < birthDate.getDate()
            )
        ) {
            age--;
        }

        return age;
    };

    const age = calculateAge(patient.date_of_birth);

    const displayValue = (value?: string) => {
        return value?.trim() ? value : "Not provided";
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
            role="dialog"
            aria-modal="true"
            aria-label="Patient profile"
        >
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-slate-950/50 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="relative flex max-h-[92vh] w-full max-w-5xl flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-950">

                {/* ================================================= */}
                {/* HEADER */}
                {/* ================================================= */}

                <div className="relative border-b border-slate-200 dark:border-slate-800">

                    {/* Top subtle background */}
                    <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-r from-blue-50 via-white to-slate-50 dark:from-blue-950/30 dark:via-slate-950 dark:to-slate-900" />

                    <div className="relative flex items-start justify-between gap-4 px-6 pb-6 pt-6 sm:px-8">

                        <div className="flex min-w-0 items-center gap-4">

                            {/* Avatar */}
                            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-blue-600 text-xl font-bold text-white shadow-lg shadow-blue-600/20">
                                {initials}
                            </div>

                            {/* Patient name */}
                            <div className="min-w-0">

                                <div className="flex flex-wrap items-center gap-2">

                                    <h2 className="truncate text-xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-2xl">
                                        {fullName}
                                    </h2>

                                    {/* Status */}
                                    <span
                                        className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${
                                            isActive
                                                ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400"
                                                : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400"
                                        }`}
                                    >
                                        <span
                                            className={`h-1.5 w-1.5 rounded-full ${
                                                isActive
                                                    ? "bg-emerald-500"
                                                    : "bg-slate-400"
                                            }`}
                                        />

                                        {patient.status || "Unknown"}
                                    </span>

                                </div>

                                <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-slate-500 dark:text-slate-400">

                                    <span>
                                        Patient ID:{" "}
                                        <span className="font-medium text-slate-700 dark:text-slate-300">
                                            #{patient.id}
                                        </span>
                                    </span>

                                    {patient.gender && (
                                        <span className="capitalize">
                                            {patient.gender.toLowerCase()}
                                        </span>
                                    )}

                                    {age !== null && (
                                        <span>
                                            {age} years old
                                        </span>
                                    )}

                                </div>

                            </div>

                        </div>

                        {/* Close */}
                        <button
                            type="button"
                            onClick={onClose}
                            aria-label="Close patient profile"
                            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white"
                        >
                            <X className="h-5 w-5" />
                        </button>

                    </div>

                    {/* Action bar */}
                    <div className="relative flex items-center justify-between border-t border-slate-200/80 px-6 py-3 dark:border-slate-800 sm:px-8">

                        <p className="text-xs font-medium uppercase tracking-wider text-slate-400 dark:text-slate-500">
                            Patient Overview
                        </p>

                        {onEdit && (
                            <button
                                type="button"
                                onClick={() => onEdit(patient)}
                                className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-sm font-medium text-slate-700 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-blue-900 dark:hover:bg-blue-950/40 dark:hover:text-blue-400"
                            >
                                <Pencil className="h-4 w-4" />
                                Edit Patient
                            </button>
                        )}

                    </div>
                </div>

                {/* ================================================= */}
                {/* CONTENT */}
                {/* ================================================= */}

                <div className="overflow-y-auto">

                    <div className="space-y-6 p-6 sm:p-8">

                        {/* ================================================= */}
                        {/* QUICK INFORMATION */}
                        {/* ================================================= */}

                        <section>

                            <div className="mb-3">
                                <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
                                    Quick Information
                                </h3>

                                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                                    Essential patient details
                                </p>
                            </div>

                            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">

                                {/* Gender */}
                                <InfoCard
                                    icon={
                                        <UserRound className="h-4 w-4" />
                                    }
                                    label="Gender"
                                    value={
                                        patient.gender
                                            ? patient.gender
                                                .toLowerCase()
                                                .replace(
                                                    /^\w/,
                                                    (c) =>
                                                        c.toUpperCase()
                                                )
                                            : "Not provided"
                                    }
                                />

                                {/* Blood */}
                                <InfoCard
                                    icon={
                                        <Droplets className="h-4 w-4" />
                                    }
                                    label="Blood Group"
                                    value={displayValue(
                                        patient.blood_group
                                    )}
                                    iconClassName="text-red-500 bg-red-50 dark:bg-red-500/10"
                                />

                                {/* DOB */}
                                <InfoCard
                                    icon={
                                        <CalendarDays className="h-4 w-4" />
                                    }
                                    label="Date of Birth"
                                    value={formatDate(
                                        patient.date_of_birth
                                    )}
                                />

                                {/* Age */}
                                <InfoCard
                                    icon={
                                        <Activity className="h-4 w-4" />
                                    }
                                    label="Age"
                                    value={
                                        age !== null
                                            ? `${age} years`
                                            : "Not provided"
                                    }
                                />

                            </div>

                        </section>

                        {/* ================================================= */}
                        {/* CONTACT INFORMATION */}
                        {/* ================================================= */}

                        <section className="rounded-xl border border-slate-200 bg-slate-50/50 p-5 dark:border-slate-800 dark:bg-slate-900/40">

                            <SectionHeader
                                icon={
                                    <UserRoundCheck className="h-4 w-4" />
                                }
                                title="Contact Information"
                                description="Patient contact and address details"
                            />

                            <div className="mt-5 grid grid-cols-1 gap-x-8 gap-y-5 md:grid-cols-2">

                                <DetailItem
                                    icon={
                                        <Phone className="h-4 w-4" />
                                    }
                                    label="Phone"
                                    value={displayValue(
                                        patient.phone
                                    )}
                                />

                                <DetailItem
                                    icon={
                                        <Mail className="h-4 w-4" />
                                    }
                                    label="Email"
                                    value={displayValue(
                                        patient.email
                                    )}
                                />

                                <DetailItem
                                    icon={
                                        <MapPin className="h-4 w-4" />
                                    }
                                    label="Address"
                                    value={displayValue(
                                        patient.address
                                    )}
                                    fullWidth
                                />

                                <DetailItem
                                    icon={
                                        <ShieldAlert className="h-4 w-4" />
                                    }
                                    label="Emergency Contact"
                                    value={displayValue(
                                        patient.emergency_contact
                                    )}
                                    fullWidth
                                />

                            </div>

                        </section>

                        {/* ================================================= */}
                        {/* MEDICAL INFORMATION */}
                        {/* ================================================= */}

                        <section>

                            <SectionHeader
                                icon={
                                    <HeartPulse className="h-4 w-4" />
                                }
                                title="Medical Information"
                                description="Health history and current medical information"
                            />

                            <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2">

                                {/* Allergies */}
                                <MedicalCard
                                    icon={
                                        <ShieldAlert className="h-4 w-4" />
                                    }
                                    title="Allergies"
                                    value={displayValue(
                                        patient.allergies
                                    )}
                                    tone="red"
                                />

                                {/* Medications */}
                                <MedicalCard
                                    icon={
                                        <Pill className="h-4 w-4" />
                                    }
                                    title="Current Medications"
                                    value={displayValue(
                                        patient.current_medications
                                    )}
                                    tone="blue"
                                />

                                {/* Medical History */}
                                <MedicalCard
                                    icon={
                                        <HeartPulse className="h-4 w-4" />
                                    }
                                    title="Medical History"
                                    value={displayValue(
                                        patient.medical_history
                                    )}
                                    tone="amber"
                                    fullWidth
                                />

                                {/* Notes */}
                                <MedicalCard
                                    icon={
                                        <FileText className="h-4 w-4" />
                                    }
                                    title="Notes"
                                    value={displayValue(
                                        patient.notes ||
                                        patient.note
                                    )}
                                    tone="slate"
                                    fullWidth
                                />

                            </div>

                        </section>

                    </div>

                </div>

                {/* ================================================= */}
                {/* FOOTER */}
                {/* ================================================= */}

                <div className="flex items-center justify-between border-t border-slate-200 bg-slate-50/80 px-6 py-4 dark:border-slate-800 dark:bg-slate-900/50 sm:px-8">

                    <p className="hidden text-xs text-slate-400 dark:text-slate-500 sm:block">
                        Patient record
                    </p>

                    <button
                        type="button"
                        onClick={onClose}
                        className="ml-auto rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
                    >
                        Close
                    </button>

                </div>

            </div>
        </div>
    );
}


/* ================================================= */
/* INFO CARD */
/* ================================================= */

function InfoCard({
                      icon,
                      label,
                      value,
                      iconClassName = "bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400",
                  }: {
    icon: React.ReactNode;
    label: string;
    value: string;
    iconClassName?: string;
}) {
    return (
        <div className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">

            <div
                className={`mb-3 flex h-8 w-8 items-center justify-center rounded-lg ${iconClassName}`}
            >
                {icon}
            </div>

            <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                {label}
            </p>

            <p className="mt-1 truncate text-sm font-semibold capitalize text-slate-900 dark:text-white">
                {value}
            </p>

        </div>
    );
}


/* ================================================= */
/* SECTION HEADER */
/* ================================================= */

function SectionHeader({
                           icon,
                           title,
                           description,
                       }: {
    icon: React.ReactNode;
    title: string;
    description: string;
}) {
    return (
        <div className="flex items-start gap-3">

            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400">
                {icon}
            </div>

            <div>
                <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
                    {title}
                </h3>

                <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                    {description}
                </p>
            </div>

        </div>
    );
}


/* ================================================= */
/* DETAIL ITEM */
/* ================================================= */

function DetailItem({
                        icon,
                        label,
                        value,
                        fullWidth = false,
                    }: {
    icon: React.ReactNode;
    label: string;
    value: string;
    fullWidth?: boolean;
}) {
    return (
        <div
            className={
                fullWidth
                    ? "md:col-span-2"
                    : ""
            }
        >
            <div className="flex gap-3">

                <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white text-slate-500 shadow-sm ring-1 ring-slate-200 dark:bg-slate-900 dark:text-slate-400 dark:ring-slate-700">
                    {icon}
                </div>

                <div className="min-w-0">

                    <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                        {label}
                    </p>

                    <p className="mt-1 break-words text-sm font-medium text-slate-800 dark:text-slate-200">
                        {value}
                    </p>

                </div>

            </div>
        </div>
    );
}


/* ================================================= */
/* MEDICAL CARD */
/* ================================================= */

function MedicalCard({
                         icon,
                         title,
                         value,
                         tone,
                         fullWidth = false,
                     }: {
    icon: React.ReactNode;
    title: string;
    value: string;
    tone: "red" | "blue" | "amber" | "slate";
    fullWidth?: boolean;
}) {
    const tones = {
        red: "bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400",
        blue: "bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400",
        amber: "bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400",
        slate: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400",
    };

    return (
        <div
            className={`rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900 ${
                fullWidth ? "md:col-span-2" : ""
            }`}
        >

            <div className="flex items-center gap-3">

                <div
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${tones[tone]}`}
                >
                    {icon}
                </div>

                <h4 className="text-sm font-semibold text-slate-900 dark:text-white">
                    {title}
                </h4>

            </div>

            <div className="mt-4">

                <p className="whitespace-pre-wrap break-words text-sm leading-6 text-slate-600 dark:text-slate-400">
                    {value}
                </p>

            </div>

        </div>
    );
}