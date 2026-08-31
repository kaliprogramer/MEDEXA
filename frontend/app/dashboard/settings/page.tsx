"use client";

import { useState } from "react";
import {
    User,
    Building2,
    Bell,
    Shield,
    Mail,
    Phone,
    MapPin,
    Lock,
    Eye,
    EyeOff,
    Trash2,
    AlertTriangle,
    Check,
} from "lucide-react";
import toast from "react-hot-toast";

type Section = "profile" | "hospital" | "notifications" | "security";

export default function SettingsPage() {
    const [activeSection, setActiveSection] =
        useState<Section>("profile");

    const [showPassword, setShowPassword] = useState(false);

    const [notifications, setNotifications] = useState({
        patientAlerts: true,
        inventoryAlerts: true,
        systemUpdates: true,
        emailNotifications: false,
    });

    const [profile, setProfile] = useState({
        firstName: "Doctor",
        lastName: "User",
        email: "doctor@example.com",
        phone: "+977 98XXXXXXXX",
    });

    const [hospital, setHospital] = useState({
        name: "DoctRisk Hospital",
        address: "Kathmandu, Nepal",
        phone: "+977 98XXXXXXXX",
        email: "hospital@example.com",
    });

    const menuItems = [
        {
            id: "profile" as Section,
            label: "Profile",
            description: "Personal information",
            icon: User,
        },
        {
            id: "hospital" as Section,
            label: "Hospital",
            description: "Hospital information",
            icon: Building2,
        },
        {
            id: "notifications" as Section,
            label: "Notifications",
            description: "Manage alerts",
            icon: Bell,
        },
        {
            id: "security" as Section,
            label: "Security",
            description: "Password & security",
            icon: Shield,
        },
    ];

    const updateProfile = (
        field: keyof typeof profile,
        value: string
    ) => {
        setProfile((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    const updateHospital = (
        field: keyof typeof hospital,
        value: string
    ) => {
        setHospital((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    const handleSave = () => {
        console.log({
            profile,
            hospital,
            notifications,
        });

        toast.success("Settings saved successfully");
    };

    return (
        <main className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-900 dark:text-white mt-18">
            <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">

                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
                        Settings
                    </h1>

                    <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                        Manage your account, hospital information,
                        notifications and security preferences.
                    </p>
                </div>

                <div className="grid gap-6 lg:grid-cols-[240px_1fr]">

                    {/* Sidebar */}
                    <aside className="h-fit rounded-2xl border border-slate-200 bg-white p-2 dark:border-white/[0.07] dark:bg-white/[0.03]">

                        <div className="space-y-1">
                            {menuItems.map((item) => {
                                const Icon = item.icon;

                                const active =
                                    activeSection === item.id;

                                return (
                                    <button
                                        key={item.id}
                                        onClick={() =>
                                            setActiveSection(item.id)
                                        }
                                        className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left transition ${
                                            active
                                                ? "bg-blue-500/10 text-blue-600 dark:text-blue-400"
                                                : "text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-white/[0.05]"
                                        }`}
                                    >
                                        <Icon className="h-5 w-5 shrink-0" />

                                        <div>
                                            <p className="text-sm font-medium">
                                                {item.label}
                                            </p>

                                            <p className="mt-0.5 text-xs text-slate-400">
                                                {item.description}
                                            </p>
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    </aside>

                    {/* Main Content */}
                    <section className="min-w-0">

                        {/* ================= PROFILE ================= */}
                        {activeSection === "profile" && (
                            <SettingsCard
                                icon={<User className="h-5 w-5" />}
                                title="Profile Information"
                                description="Update your personal information."
                            >
                                <div className="grid gap-5 sm:grid-cols-2">

                                    <Input
                                        label="First Name"
                                        value={profile.firstName}
                                        onChange={(value) =>
                                            updateProfile(
                                                "firstName",
                                                value
                                            )
                                        }
                                    />

                                    <Input
                                        label="Last Name"
                                        value={profile.lastName}
                                        onChange={(value) =>
                                            updateProfile(
                                                "lastName",
                                                value
                                            )
                                        }
                                    />

                                    <Input
                                        label="Email"
                                        type="email"
                                        icon={
                                            <Mail className="h-4 w-4" />
                                        }
                                        value={profile.email}
                                        onChange={(value) =>
                                            updateProfile(
                                                "email",
                                                value
                                            )
                                        }
                                    />

                                    <Input
                                        label="Phone"
                                        icon={
                                            <Phone className="h-4 w-4" />
                                        }
                                        value={profile.phone}
                                        onChange={(value) =>
                                            updateProfile(
                                                "phone",
                                                value
                                            )
                                        }
                                    />

                                </div>

                                <SaveButton onClick={handleSave} />
                            </SettingsCard>
                        )}

                        {/* ================= HOSPITAL ================= */}
                        {activeSection === "hospital" && (
                            <SettingsCard
                                icon={
                                    <Building2 className="h-5 w-5" />
                                }
                                title="Hospital Information"
                                description="Manage your hospital's basic information."
                            >
                                <div className="space-y-5">

                                    <Input
                                        label="Hospital Name"
                                        value={hospital.name}
                                        onChange={(value) =>
                                            updateHospital(
                                                "name",
                                                value
                                            )
                                        }
                                    />

                                    <Input
                                        label="Address"
                                        icon={
                                            <MapPin className="h-4 w-4" />
                                        }
                                        value={hospital.address}
                                        onChange={(value) =>
                                            updateHospital(
                                                "address",
                                                value
                                            )
                                        }
                                    />

                                    <div className="grid gap-5 sm:grid-cols-2">

                                        <Input
                                            label="Hospital Phone"
                                            icon={
                                                <Phone className="h-4 w-4" />
                                            }
                                            value={hospital.phone}
                                            onChange={(value) =>
                                                updateHospital(
                                                    "phone",
                                                    value
                                                )
                                            }
                                        />

                                        <Input
                                            label="Hospital Email"
                                            icon={
                                                <Mail className="h-4 w-4" />
                                            }
                                            value={hospital.email}
                                            onChange={(value) =>
                                                updateHospital(
                                                    "email",
                                                    value
                                                )
                                            }
                                        />

                                    </div>
                                </div>

                                <SaveButton onClick={handleSave} />
                            </SettingsCard>
                        )}

                        {/* ================= NOTIFICATIONS ================= */}
                        {activeSection === "notifications" && (
                            <SettingsCard
                                icon={
                                    <Bell className="h-5 w-5" />
                                }
                                title="Notifications"
                                description="Choose which notifications you want to receive."
                            >
                                <div className="divide-y divide-slate-200 dark:divide-white/[0.06]">

                                    <Toggle
                                        title="Patient Alerts"
                                        description="Receive alerts related to patient activity and important events."
                                        enabled={
                                            notifications.patientAlerts
                                        }
                                        onChange={(value) =>
                                            setNotifications({
                                                ...notifications,
                                                patientAlerts: value,
                                            })
                                        }
                                    />

                                    <Toggle
                                        title="Inventory Alerts"
                                        description="Get notified when inventory reaches a low-stock level."
                                        enabled={
                                            notifications.inventoryAlerts
                                        }
                                        onChange={(value) =>
                                            setNotifications({
                                                ...notifications,
                                                inventoryAlerts: value,
                                            })
                                        }
                                    />

                                    <Toggle
                                        title="System Updates"
                                        description="Receive important updates about the DoctRisk platform."
                                        enabled={
                                            notifications.systemUpdates
                                        }
                                        onChange={(value) =>
                                            setNotifications({
                                                ...notifications,
                                                systemUpdates: value,
                                            })
                                        }
                                    />

                                    <Toggle
                                        title="Email Notifications"
                                        description="Receive important notifications through email."
                                        enabled={
                                            notifications.emailNotifications
                                        }
                                        onChange={(value) =>
                                            setNotifications({
                                                ...notifications,
                                                emailNotifications: value,
                                            })
                                        }
                                    />

                                </div>

                                <SaveButton onClick={handleSave} />
                            </SettingsCard>
                        )}

                        {/* ================= SECURITY ================= */}
                        {activeSection === "security" && (
                            <SettingsCard
                                icon={
                                    <Shield className="h-5 w-5" />
                                }
                                title="Security"
                                description="Keep your DoctRisk account secure."
                            >
                                <div className="space-y-6">

                                    {/* Password */}
                                    <div>
                                        <h3 className="text-sm font-semibold">
                                            Change Password
                                        </h3>

                                        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                                            Use a strong password that you
                                            don't use elsewhere.
                                        </p>
                                    </div>

                                    <div className="grid gap-5 sm:grid-cols-2">

                                        <PasswordInput
                                            label="Current Password"
                                            show={showPassword}
                                            onToggle={() =>
                                                setShowPassword(
                                                    !showPassword
                                                )
                                            }
                                        />

                                        <PasswordInput
                                            label="New Password"
                                            show={showPassword}
                                            onToggle={() =>
                                                setShowPassword(
                                                    !showPassword
                                                )
                                            }
                                        />

                                    </div>

                                    <button
                                        onClick={() =>
                                            toast.success(
                                                "Password update requested"
                                            )
                                        }
                                        className="flex h-10 items-center gap-2 rounded-xl bg-blue-600 px-4 text-sm font-semibold text-white transition hover:bg-blue-500"
                                    >
                                        <Lock className="h-4 w-4" />
                                        Update Password
                                    </button>

                                    {/* 2FA */}
                                    <div className="border-t border-slate-200 pt-6 dark:border-white/[0.06]">
                                        <h3 className="text-sm font-semibold">
                                            Two-Factor Authentication
                                        </h3>

                                        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                                            Add another layer of security to
                                            your account.
                                        </p>

                                        <button
                                            onClick={() =>
                                                toast.success(
                                                    "2FA setup started"
                                                )
                                            }
                                            className="mt-4 rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium transition hover:bg-slate-100 dark:border-white/[0.08] dark:hover:bg-white/[0.05]"
                                        >
                                            Enable 2FA
                                        </button>
                                    </div>

                                </div>
                            </SettingsCard>
                        )}

                        {/* ================= DANGER ZONE ================= */}
                        <div className="mt-6 rounded-2xl border border-red-200 bg-white dark:border-red-500/20 dark:bg-white/[0.03]">

                            <div className="border-b border-red-100 p-6 dark:border-red-500/10">
                                <div className="flex items-center gap-3">

                                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-500/10 text-red-500">
                                        <AlertTriangle className="h-5 w-5" />
                                    </div>

                                    <div>
                                        <h2 className="font-semibold text-red-600 dark:text-red-400">
                                            Danger Zone
                                        </h2>

                                        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                                            Actions here can permanently
                                            affect your account.
                                        </p>
                                    </div>

                                </div>
                            </div>

                            <div className="flex flex-col justify-between gap-4 p-6 sm:flex-row sm:items-center">

                                <div>
                                    <h3 className="text-sm font-semibold">
                                        Delete Account
                                    </h3>

                                    <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                                        Permanently delete your account and
                                        associated data.
                                    </p>
                                </div>

                                <button
                                    onClick={() =>
                                        toast.error(
                                            "Account deletion requires confirmation"
                                        )
                                    }
                                    className="flex items-center justify-center gap-2 rounded-xl border border-red-200 px-4 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-50 dark:border-red-500/20 dark:text-red-400 dark:hover:bg-red-500/10"
                                >
                                    <Trash2 className="h-4 w-4" />
                                    Delete Account
                                </button>

                            </div>
                        </div>

                    </section>
                </div>
            </div>
        </main>
    );
}

/* ========================================================= */
/* SETTINGS CARD */
/* ========================================================= */

function SettingsCard({
                          icon,
                          title,
                          description,
                          children,
                      }: {
    icon: React.ReactNode;
    title: string;
    description: string;
    children: React.ReactNode;
}) {
    return (
        <div className="rounded-2xl border border-slate-200 bg-white dark:border-white/[0.07] dark:bg-white/[0.03]">

            <div className="border-b border-slate-200 p-6 dark:border-white/[0.06]">

                <div className="flex items-center gap-3">

                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10 text-blue-500">
                        {icon}
                    </div>

                    <div>
                        <h2 className="font-semibold">
                            {title}
                        </h2>

                        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                            {description}
                        </p>
                    </div>

                </div>
            </div>

            <div className="p-6">
                {children}
            </div>

        </div>
    );
}

/* ========================================================= */
/* INPUT */
/* ========================================================= */

function Input({
                   label,
                   value,
                   onChange,
                   type = "text",
                   icon,
               }: {
    label: string;
    value: string;
    onChange: (value: string) => void;
    type?: string;
    icon?: React.ReactNode;
}) {
    return (
        <div>

            <label className="mb-2 block text-sm font-medium">
                {label}
            </label>

            <div className="relative">

                {icon && (
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                        {icon}
                    </div>
                )}

                <input
                    type={type}
                    value={value}
                    onChange={(e) =>
                        onChange(e.target.value)
                    }
                    className={`h-11 w-full rounded-xl border border-slate-200 bg-slate-50 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 dark:border-white/[0.08] dark:bg-white/[0.04] ${
                        icon
                            ? "pl-10 pr-4"
                            : "px-4"
                    }`}
                />

            </div>
        </div>
    );
}

/* ========================================================= */
/* PASSWORD INPUT */
/* ========================================================= */

function PasswordInput({
                           label,
                           show,
                           onToggle,
                       }: {
    label: string;
    show: boolean;
    onToggle: () => void;
}) {
    return (
        <div>

            <label className="mb-2 block text-sm font-medium">
                {label}
            </label>

            <div className="relative">

                <input
                    type={show ? "text" : "password"}
                    placeholder="••••••••"
                    className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 pr-11 text-sm outline-none focus:border-blue-500 dark:border-white/[0.08] dark:bg-white/[0.04]"
                />

                <button
                    type="button"
                    onClick={onToggle}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                    {show ? (
                        <EyeOff className="h-4 w-4" />
                    ) : (
                        <Eye className="h-4 w-4" />
                    )}
                </button>

            </div>
        </div>
    );
}

/* ========================================================= */
/* TOGGLE */
/* ========================================================= */

function Toggle({
                    title,
                    description,
                    enabled,
                    onChange,
                }: {
    title: string;
    description: string;
    enabled: boolean;
    onChange: (value: boolean) => void;
}) {
    return (
        <div className="flex items-center justify-between gap-5 py-5">

            <div>

                <h3 className="text-sm font-medium">
                    {title}
                </h3>

                <p className="mt-1 max-w-xl text-xs leading-5 text-slate-500 dark:text-slate-400">
                    {description}
                </p>

            </div>

            <button
                type="button"
                onClick={() => onChange(!enabled)}
                className={`relative h-6 w-11 shrink-0 rounded-full transition ${
                    enabled
                        ? "bg-blue-600"
                        : "bg-slate-300 dark:bg-white/[0.15]"
                }`}
            >
                <span
                    className={`absolute top-1 h-4 w-4 rounded-full bg-white shadow-sm transition ${
                        enabled
                            ? "left-6"
                            : "left-1"
                    }`}
                />
            </button>

        </div>
    );
}

/* ========================================================= */
/* SAVE BUTTON */
/* ========================================================= */

function SaveButton({
                        onClick,
                    }: {
    onClick: () => void;
}) {
    return (
        <div className="mt-7 flex justify-end border-t border-slate-200 pt-5 dark:border-white/[0.06]">

            <button
                onClick={onClick}
                className="flex h-10 items-center gap-2 rounded-xl bg-blue-600 px-5 text-sm font-semibold text-white transition hover:bg-blue-500"
            >
                <Check className="h-4 w-4" />
                Save Changes
            </button>

        </div>
    );
}