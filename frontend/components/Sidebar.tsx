"use client";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {use, useEffect, useState} from "react";
import {useAuth} from "@/context/AuthContext";
import {useRouter} from "next/navigation";
import {
  LayoutDashboard,
  HeartPulse,
  Droplets,
  Wind,
  Scan,
  History,
  Users,
  FileText,
  Settings,
  HelpCircle,
  Menu,
  X,
  LogOut,
  Brain,
  Droplet,
  BookOpen,
  BarChart3
} from "lucide-react";

const predictionItems = [
  {
    name: "Heart Disease",
    href: "/dashboard/heart-disease",
    icon: HeartPulse,
  },
  {
    name: "Diabetes",
    href: "/dashboard/diabetes",
    icon: Droplet,
  },
  {
    name: "Lung Disease",
    href: "/dashboard/lung-disease",
    icon: Wind,
  },
  {
    name: "Stroke",
    href: "/dashboard/stroke",
    icon: Brain,
  },
  {
    name: "Chronic Kidney",
    href: "/dashboard/Chronic_Kidney",
    icon: Droplets,
  },
];

const otherItems = [
  {
    name: "Patients",
    href: "/dashboard/patients",
    icon: Users,
  },
  {
    name: "Doctors",
    href: "/dashboard/doctors",
    icon: History,
  },
  {
    name: "Inventory",
    href: "/dashboard/inventory",
    icon: FileText,
  },

];

const apiItems = [
  {
    name: "Settings",
    href: "/dashboard/settings",
    icon: Settings,
  },
  {
    name: "Help & Support",
    href: "/dashboard/help",
    icon: HelpCircle,
  },

];

export default function Sidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [pecialization, setPecialization] = useState("");
  const [imagetext,setImagetext] = useState("")
  const router = useRouter()
  const closeSidebar = () => {
    setIsOpen(false);
  };
  function getInitials(name: string): string {
    if (!name) return "";

    return name
        .trim()
        .split(/\s+/)
        .map(word => word[0])
        .join("")
        .slice(0, 2)
        .toUpperCase();
  }
  const {user,logout} = useAuth()
  useEffect(() => {
    setEmail(user?.email)
    setPecialization(user?.Specialization)
    setImagetext(getInitials(user?.username))

  }, []);
  async function logoutfun(){
    await logout();
    router.replace("/auth/Login")

  }
  return (
      <>
        {/* Mobile Header */}
        <header className="fixed left-0 right-0 top-0 z-30 flex h-[70px] items-center border-b border-slate-200 dark:bg-[#030616] dark:border-slate-500 bg-white px-4 lg:hidden">
          <button
              onClick={() => setIsOpen(true)}
              className="rounded-lg p-2 text-slate-700 transition hover:bg-slate-100"
              aria-label="Open sidebar"
          >
            <Menu size={24} />
          </button>

          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center ">
              <Image
                  src="/logo_enhance.png"
                  alt="Clinora logo"
                  width={120}
                  height={120}
              />
            </div>

            <div>
              <h1 className="text-lg font-bold">
                <Image
                    src="/logo.png"
                    alt="Clinora logo"
                    width={120}
                    height={120}
                />
              </h1>

              <p className="text-xs text-shadow-slate-100 font-manolo ">
                Clinical AI Assistant
              </p>
            </div>
          </div>
        </header>

        {/* Mobile Backdrop */}
        {isOpen && (
            <button
                onClick={closeSidebar}
                className="fixed inset-0 z-40 bg-black/50 lg:hidden"
                aria-label="Close sidebar"
            />
        )}

        {/* Sidebar */}
        <aside
            className={`font-rethink
          fixed left-0 top-0 z-50 flex h-screen w-64 flex-col
          border-r border-slate-800 bg-slate-950 text-white
          transition-transform duration-300 ease-in-out
          
          ${isOpen ? "translate-x-0" : "-translate-x-full"}

          lg:translate-x-0
          
        `}
        >
          {/* Logo */}
          <div className="flex h-20 shrink-0 items-center justify-between border-b border-slate-800 px-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center ">
                <Image
                    src="/logo_enhance.png"
                    alt="Clinora logo"
                    width={120}
                    height={120}
                />
              </div>

              <div>
                <h1 className="text-lg font-bold">
                  <Image
                      src="/logo.png"
                      alt="Clinora logo"
                      width={120}
                      height={120}
                  />
                </h1>

                <p className="text-xs text-shadow-slate-100 font-manolo ">
                  Clinical AI Assistant
                </p>
              </div>
            </div>

            {/* Close button - mobile only */}
            <button
                onClick={closeSidebar}
                className="rounded-lg p-2 text-slate-400 hover:bg-slate-800 hover:text-white lg:hidden"
                aria-label="Close sidebar"
            >
              <X size={20} />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden  p-4">
            {/* Dashboard */}
            <Link
                href="/dashboard"
                onClick={closeSidebar}
                className={`
              mb-2 flex items-center gap-3 rounded-lg
              px-4 py-3 text-sm transition
              ${
                    pathname === "/dashboard"
                        ? "bg-blue-600 text-white"
                        : "text-slate-300 hover:bg-slate-800"
                }
            `}
            >
              <LayoutDashboard size={19} />
              Dashboard
            </Link>

            {/* Predictions */}
            <p className="mb-2 mt-6 px-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
              Predictions
            </p>

            {predictionItems.map((item) => {
              const Icon = item.icon;

              const active =
                  pathname === item.href ||
                  pathname.startsWith(`${item.href}/`);

              return (
                  <Link
                      key={item.href}
                      href={item.href}
                      onClick={closeSidebar}
                      className={`
                  mb-1 flex items-center gap-3 rounded-lg
                  px-4 py-3 text-sm transition
                  ${
                          active
                              ? "bg-blue-600 text-white"
                              : "text-slate-300 hover:bg-slate-800"
                      }
                `}
                  >
                    <Icon size={19} />
                    {item.name}
                  </Link>
              );
            })}

            {/* Other */}
            <p className="mb-2 mt-6 px-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
              Management
            </p>

            {otherItems.map((item) => {
              const Icon = item.icon;

              const active =
                  pathname === item.href ||
                  pathname.startsWith(`${item.href}/`);

              return (
                  <Link
                      key={item.href}
                      href={item.href}
                      onClick={closeSidebar}
                      className={`
                  mb-1 flex items-center gap-3 rounded-lg
                  px-4 py-3 text-sm transition
                  ${
                          active
                              ? "bg-blue-600 text-white"
                              : "text-slate-300 hover:bg-slate-800"
                      }
                `}
                  >
                    <Icon size={19} />
                    {item.name}
                  </Link>
              );
            })}
            {/* API */}
            <p className="mb-2 mt-6 px-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
              Setting
            </p>

            {apiItems.map((item) => {
              const Icon = item.icon;

              const active =
                  pathname === item.href ||
                  pathname.startsWith(`${item.href}/`);

              return (
                  <Link
                      key={item.href}
                      href={item.href}
                      onClick={closeSidebar}
                      className={`
                  mb-1 flex items-center gap-3 rounded-lg
                  px-4 py-3 text-sm transition
                  ${
                          active
                              ? "bg-blue-600 text-white"
                              : "text-slate-300 hover:bg-slate-800"
                      }
                `}
                  >
                    <Icon size={19} />
                    {item.name}
                  </Link>
              );
            })}
          </nav>

          {/* Doctor Profile */}
          <div className="shrink-0 border-t border-slate-800 p-4">
            <div className="rounded-xl border border-slate-800 bg-slate-900 p-3">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-600 text-sm font-semibold">
                  {imagetext}
                </div>

                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold font-manolo">
                    {email}
                  </p>

                  <p className="truncate text-xs text-slate-400">
                    {pecialization}
                  </p>
                </div>

                <button
                    className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-800 hover:text-red-400"
                    title="Logout"
                    onClick={logoutfun}
                >
                  <LogOut size={17} />
                </button>
              </div>
            </div>
          </div>
        </aside>
      </>
  );
}