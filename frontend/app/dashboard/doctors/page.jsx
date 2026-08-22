"use client";

import {
    Eye,
    Pencil,
    Trash2,
    Plus,
    Stethoscope,
    X,
} from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import {
    get_doctors,
    post_doctor,
    put_doctor,
    delete_doctor,
} from "../../lib/api/doctors_API";

import ConfirmDeleteDoctor from "../../../components/ConfirmDeleteDoctor";

const API_BASE_URL =
    process.env.NEXT_PUBLIC_DJANGO_API_URL || "http://localhost:8000";

/* ================================================================
   MAIN COMPONENT
================================================================ */

export default function DoctorTable() {
    const [doctors, setDoctors] = useState([]);

    const [editingDoctor, setEditingDoctor] = useState(null);
    const [selectedDoctor, setSelectedDoctor] = useState(null);

    const [showProfile, setShowProfile] = useState(false);
    const [showAddDoctor, setShowAddDoctor] = useState(false);
    const [showEditDoctor, setShowEditDoctor] = useState(false);

    const [deletingDoctorId, setDeletingDoctorId] = useState(null);

    const [nextPage, setNextPage] = useState(null);
    const [previousPage, setPreviousPage] = useState(null);

    const [currentPage, setCurrentPage] = useState(1);
    const [totalDoctors, setTotalDoctors] = useState(0);

    const [loading, setLoading] = useState(false);

    const PAGE_SIZE = 10;

    const totalPages = Math.ceil(totalDoctors / PAGE_SIZE);

    /* ================================================================
       FETCH DOCTORS
    ================================================================= */

    const fetchDoctors = async (page = 1) => {
        try {
            setLoading(true);

            const data = await get_doctors(page);

            setDoctors(data?.results || []);
            setNextPage(data?.next || null);
            setPreviousPage(data?.previous || null);
            setTotalDoctors(data?.count || 0);
            setCurrentPage(page);
        } catch (error) {
            console.error("Failed to fetch doctors:", error);
            toast.error("Failed to load doctors");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDoctors(1);
    }, []);

    /* ================================================================
       VIEW DOCTOR
    ================================================================= */

    const handleViewDoctor = (doctor) => {
        setSelectedDoctor(doctor);
        setShowProfile(true);
    };

    /* ================================================================
       EDIT DOCTOR
    ================================================================= */

    const handleEditDoctor = (doctor) => {
        setEditingDoctor(doctor);
        setShowEditDoctor(true);
    };

    /* ================================================================
       DELETE DOCTOR
    ================================================================= */

    const handleDeleteDoctor = (doctor) => {
        setDeletingDoctorId(doctor.id);

        ConfirmDeleteDoctor({
            doctor,

            onCancel: () => {
                setDeletingDoctorId(null);
            },

            onConfirm: async (toastId) => {
                try {
                    await delete_doctor(doctor.id);

                    setDoctors((prev) =>
                        prev.filter((item) => item.id !== doctor.id)
                    );

                    setTotalDoctors((prev) => Math.max(0, prev - 1));

                    setDeletingDoctorId(null);

                    if (toastId) {
                        toast.dismiss(toastId);
                    }

                    toast.success("Doctor deleted successfully");
                } catch (error) {
                    console.error("Failed to delete doctor:", error);

                    setDeletingDoctorId(null);

                    if (toastId) {
                        toast.dismiss(toastId);
                    }

                    toast.error("Failed to delete doctor");
                }
            },
        });
    };

    /* ================================================================
       ADD DOCTOR
    ================================================================= */

    const handleAddDoctor = async (e) => {
        e.preventDefault();

        const form = e.currentTarget;
        const formData = new FormData(form);

        /*
          Debug FormData before sending.
          This helps verify that first_name, last_name,
          specialization, department and license_number
          are actually being submitted.
        */

        console.log("========== ADD DOCTOR FORM DATA ==========");

        for (const [key, value] of formData.entries()) {
            console.log(
                key,
                value instanceof File
                    ? `${value.name} (${value.size} bytes)`
                    : value
            );
        }

        console.log("==========================================");

        try {
            const result = await post_doctor(formData);

            setDoctors((prev) => [result, ...prev]);

            setTotalDoctors((prev) => prev + 1);

            toast.success("Doctor added successfully");

            setShowAddDoctor(false);

            form.reset();
        } catch (error) {
            console.error("Failed to add doctor:", error);

            /*
              Display backend validation errors if available.
            */

            if (error?.validationErrors) {
                const errors = error.validationErrors;

                Object.entries(errors).forEach(([field, messages]) => {
                    if (Array.isArray(messages)) {
                        messages.forEach((message) => {
                            toast.error(`${field}: ${message}`);
                        });
                    }
                });
            } else {
                toast.error(error?.message || "Failed to add doctor");
            }
        }
    };

    /* ================================================================
       UPDATE DOCTOR
    ================================================================= */

    const handleUpdateDoctor = async (e) => {
        e.preventDefault();

        if (!editingDoctor) {
            return;
        }

        const form = e.currentTarget;
        const formData = new FormData(form);

        console.log("========== UPDATE DOCTOR FORM DATA ==========");

        for (const [key, value] of formData.entries()) {
            console.log(
                key,
                value instanceof File
                    ? `${value.name} (${value.size} bytes)`
                    : value
            );
        }

        console.log("=============================================");

        try {
            const result = await put_doctor(
                editingDoctor.id,
                formData
            );

            setDoctors((prev) =>
                prev.map((doctor) =>
                    doctor.id === editingDoctor.id
                        ? result
                        : doctor
                )
            );

            if (
                selectedDoctor &&
                selectedDoctor.id === editingDoctor.id
            ) {
                setSelectedDoctor(result);
            }

            toast.success("Doctor updated successfully");

            setShowEditDoctor(false);
            setEditingDoctor(null);
        } catch (error) {
            console.error("Failed to update doctor:", error);

            if (error?.validationErrors) {
                const errors = error.validationErrors;

                Object.entries(errors).forEach(([field, messages]) => {
                    if (Array.isArray(messages)) {
                        messages.forEach((message) => {
                            toast.error(`${field}: ${message}`);
                        });
                    }
                });
            } else {
                toast.error(error?.message || "Failed to update doctor");
            }
        }
    };

    /* ================================================================
       HELPERS
    ================================================================= */

    const getDoctorName = (doctor) => {
        return `${doctor?.first_name || ""} ${
            doctor?.last_name || ""
        }`.trim();
    };

    const getInitials = (doctor) => {
        const name = getDoctorName(doctor);

        if (!name) {
            return "DR";
        }

        return name
            .split(" ")
            .filter(Boolean)
            .map((item) => item[0])
            .join("")
            .slice(0, 2)
            .toUpperCase();
    };

    const getImageUrl = (image) => {
        if (!image) {
            return null;
        }

        if (
            image.startsWith("http://") ||
            image.startsWith("https://")
        ) {
            return image;
        }

        if (image.startsWith("/")) {
            return `${API_BASE_URL}${image}`;
        }

        return `${API_BASE_URL}/${image}`;
    };

    /* ================================================================
       CLASSES
    ================================================================= */

    const inputClass = `
    w-full
    rounded-lg
    border
    border-slate-200
    bg-white
    px-3
    py-2.5
    text-sm
    text-slate-900
    outline-none
    transition
    placeholder:text-slate-400
    focus:border-blue-500
    focus:ring-2
    focus:ring-blue-500/20
    dark:border-slate-700
    dark:bg-slate-800
    dark:text-white
    dark:placeholder:text-slate-500
  `;

    const labelClass = `
    mb-1.5
    block
    text-sm
    font-medium
    text-slate-700
    dark:text-slate-300
  `;

    /* ================================================================
       RENDER
    ================================================================= */

    return (
        <div
            className="
        mt-20
        w-full
        overflow-hidden
        rounded-2xl
        border
        border-slate-200
        bg-white
        shadow-sm
        dark:border-slate-800
        dark:bg-slate-900
      "
        >
            {/* ============================================================
          PROFILE MODAL
      ============================================================ */}

            {showProfile && selectedDoctor && (
                <div
                    className="
            fixed
            inset-0
            z-[60]
            flex
            items-center
            justify-center
            bg-black/50
            px-4
            py-6
          "
                >
                    <div
                        className="
              max-h-[90vh]
              w-full
              max-w-2xl
              overflow-y-auto
              rounded-2xl
              bg-white
              shadow-2xl
              dark:bg-slate-900
            "
                    >
                        {/* HEADER */}

                        <div
                            className="
                sticky
                top-0
                z-10
                flex
                items-center
                justify-between
                border-b
                border-slate-200
                bg-white
                px-6
                py-5
                dark:border-slate-800
                dark:bg-slate-900
              "
                        >
                            <div className="flex items-center gap-4">
                                <DoctorAvatar
                                    doctor={selectedDoctor}
                                    size="lg"
                                    getImageUrl={getImageUrl}
                                    getInitials={getInitials}
                                />

                                <div>
                                    <h2
                                        className="
                      text-xl
                      font-semibold
                      text-slate-900
                      dark:text-white
                    "
                                    >
                                        Dr. {getDoctorName(selectedDoctor)}
                                    </h2>

                                    <p
                                        className="
                      mt-1
                      text-sm
                      text-slate-500
                      dark:text-slate-400
                    "
                                    >
                                        {selectedDoctor.specialization ||
                                            "Medical Doctor"}
                                    </p>

                                    <p
                                        className="
                      mt-1
                      text-xs
                      text-slate-400
                      dark:text-slate-500
                    "
                                    >
                                        License:{" "}
                                        {selectedDoctor.license_number || "N/A"}
                                    </p>
                                </div>
                            </div>

                            <button
                                type="button"
                                onClick={() => {
                                    setShowProfile(false);
                                    setSelectedDoctor(null);
                                }}
                                className="
                  rounded-lg
                  p-2
                  text-slate-400
                  transition
                  hover:bg-slate-100
                  hover:text-slate-700
                  dark:hover:bg-slate-800
                  dark:hover:text-white
                "
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* PROFILE */}

                        <div className="space-y-6 p-6">
                            {/* PROFESSIONAL */}

                            <section>
                                <h3
                                    className="
                    mb-4
                    text-sm
                    font-semibold
                    text-slate-900
                    dark:text-white
                  "
                                >
                                    Professional Information
                                </h3>

                                <div
                                    className="
                    grid
                    grid-cols-1
                    gap-4
                    sm:grid-cols-2
                  "
                                >
                                    <ProfileItem
                                        label="Specialization"
                                        value={selectedDoctor.specialization}
                                    />

                                    <ProfileItem
                                        label="Department"
                                        value={selectedDoctor.department}
                                    />

                                    <ProfileItem
                                        label="Qualification"
                                        value={selectedDoctor.qualification}
                                    />

                                    <ProfileItem
                                        label="License Number"
                                        value={selectedDoctor.license_number}
                                    />

                                    <ProfileItem
                                        label="Experience"
                                        value={
                                            selectedDoctor.experience_years
                                                ? `${selectedDoctor.experience_years} years`
                                                : null
                                        }
                                    />

                                    <ProfileItem
                                        label="Joining Date"
                                        value={selectedDoctor.joining_date}
                                    />
                                </div>
                            </section>

                            {/* CONTACT */}

                            <section>
                                <h3
                                    className="
                    mb-4
                    text-sm
                    font-semibold
                    text-slate-900
                    dark:text-white
                  "
                                >
                                    Contact Information
                                </h3>

                                <div
                                    className="
                    grid
                    grid-cols-1
                    gap-4
                    sm:grid-cols-2
                  "
                                >
                                    <ProfileItem
                                        label="Phone"
                                        value={selectedDoctor.phone}
                                    />

                                    <ProfileItem
                                        label="Email"
                                        value={selectedDoctor.email}
                                    />

                                    <ProfileItem
                                        label="Address"
                                        value={selectedDoctor.address}
                                    />
                                </div>
                            </section>

                            {/* SCHEDULE */}

                            <section>
                                <h3
                                    className="
                    mb-4
                    text-sm
                    font-semibold
                    text-slate-900
                    dark:text-white
                  "
                                >
                                    Schedule
                                </h3>

                                <div
                                    className="
                    grid
                    grid-cols-1
                    gap-4
                    sm:grid-cols-2
                  "
                                >
                                    <ProfileItem
                                        label="Available Days"
                                        value={selectedDoctor.available_days}
                                    />

                                    <ProfileItem
                                        label="Working Hours"
                                        value={
                                            selectedDoctor.available_from &&
                                            selectedDoctor.available_to
                                                ? `${selectedDoctor.available_from} - ${selectedDoctor.available_to}`
                                                : null
                                        }
                                    />

                                    <ProfileItem
                                        label="Consultation Fee"
                                        value={
                                            selectedDoctor.consultation_fee
                                                ? `Rs. ${selectedDoctor.consultation_fee}`
                                                : null
                                        }
                                    />
                                </div>
                            </section>

                            {/* BIO */}

                            {selectedDoctor.bio && (
                                <section>
                                    <h3
                                        className="
                      mb-2
                      text-sm
                      font-semibold
                      text-slate-900
                      dark:text-white
                    "
                                    >
                                        Biography
                                    </h3>

                                    <p
                                        className="
                      rounded-lg
                      bg-slate-50
                      p-4
                      text-sm
                      leading-6
                      text-slate-600
                      dark:bg-slate-800
                      dark:text-slate-300
                    "
                                    >
                                        {selectedDoctor.bio}
                                    </p>
                                </section>
                            )}

                            {/* NOTES */}

                            {selectedDoctor.notes && (
                                <section>
                                    <h3
                                        className="
                      mb-2
                      text-sm
                      font-semibold
                      text-slate-900
                      dark:text-white
                    "
                                    >
                                        Notes
                                    </h3>

                                    <p
                                        className="
                      rounded-lg
                      bg-slate-50
                      p-4
                      text-sm
                      leading-6
                      text-slate-600
                      dark:bg-slate-800
                      dark:text-slate-300
                    "
                                    >
                                        {selectedDoctor.notes}
                                    </p>
                                </section>
                            )}

                            {/* STATUS */}

                            <section>
                <span
                    className={`
                    inline-flex
                    items-center
                    gap-2
                    rounded-full
                    px-3
                    py-1.5
                    text-xs
                    font-semibold
                    ${
                        selectedDoctor.status === "Active"
                            ? `
                          bg-emerald-50
                          text-emerald-600
                          dark:bg-emerald-500/10
                          dark:text-emerald-400
                        `
                            : `
                          bg-slate-100
                          text-slate-500
                          dark:bg-slate-800
                          dark:text-slate-400
                        `
                    }
                  `}
                >
                  <span
                      className="
                      h-1.5
                      w-1.5
                      rounded-full
                      bg-current
                    "
                  />

                    {selectedDoctor.status || "Unknown"}
                </span>
                            </section>
                        </div>
                    </div>
                </div>
            )}

            {/* ============================================================
          HEADER
      ============================================================ */}

            <div
                className="
          flex
          flex-col
          gap-4
          border-b
          border-slate-200
          px-6
          py-5
          sm:flex-row
          sm:items-center
          sm:justify-between
          dark:border-slate-800
        "
            >
                <div>
                    <div className="flex items-center gap-2">
                        <Stethoscope
                            size={21}
                            className="text-blue-600"
                        />

                        <h2
                            className="
                text-lg
                font-semibold
                text-slate-900
                dark:text-white
              "
                        >
                            Doctors
                        </h2>
                    </div>

                    <p
                        className="
              mt-1
              text-sm
              text-slate-500
              dark:text-slate-400
            "
                    >
                        Manage and view all registered doctors
                    </p>
                </div>

                <div className="flex items-center gap-3">
          <span
              className="
              rounded-full
              bg-blue-50
              px-3
              py-1
              text-xs
              font-semibold
              text-blue-600
              dark:bg-blue-500/10
              dark:text-blue-400
            "
          >
            {totalDoctors} Doctors
          </span>

                    <button
                        type="button"
                        onClick={() => setShowAddDoctor(true)}
                        className="
              inline-flex
              items-center
              gap-2
              rounded-lg
              bg-blue-600
              px-4
              py-2
              text-sm
              font-semibold
              text-white
              transition
              hover:bg-blue-700
              focus:outline-none
              focus:ring-2
              focus:ring-blue-500
            "
                    >
                        <Plus size={17} />
                        Add Doctor
                    </button>
                </div>
            </div>

            {/* ============================================================
          TABLE
      ============================================================ */}

            <div className="overflow-x-auto">
                <table className="w-full min-w-[1100px] text-left">
                    <thead
                        className="
              border-b
              border-slate-200
              bg-slate-50
              dark:border-slate-800
              dark:bg-slate-950/50
            "
                    >
                    <tr>
                        <TableHeader>Doctor</TableHeader>
                        <TableHeader>Specialization</TableHeader>
                        <TableHeader>Department</TableHeader>
                        <TableHeader>Experience</TableHeader>
                        <TableHeader>Phone</TableHeader>
                        <TableHeader>Status</TableHeader>
                        <TableHeader right>Actions</TableHeader>
                    </tr>
                    </thead>

                    <tbody
                        className="
              divide-y
              divide-slate-100
              dark:divide-slate-800
            "
                    >
                    {doctors.map((doctor) => {
                        const name = getDoctorName(doctor);

                        return (
                            <tr
                                key={doctor.id}
                                className={`
                    transition-all
                    duration-300
                    ${
                                    deletingDoctorId === doctor.id
                                        ? `
                          bg-red-50/80
                          dark:bg-red-500/10
                        `
                                        : `
                          hover:bg-slate-50
                          dark:hover:bg-slate-800/40
                        `
                                }
                  `}
                            >
                                {/* DOCTOR */}

                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <DoctorAvatar
                                            doctor={doctor}
                                            size="sm"
                                            getImageUrl={getImageUrl}
                                            getInitials={getInitials}
                                        />

                                        <div>
                                            <p
                                                className="
                            font-semibold
                            text-slate-900
                            dark:text-white
                          "
                                            >
                                                Dr. {name || "Unknown Doctor"}
                                            </p>

                                            <p
                                                className="
                            mt-0.5
                            text-xs
                            text-slate-500
                            dark:text-slate-400
                          "
                                            >
                                                ID: {doctor.id}
                                            </p>
                                        </div>
                                    </div>
                                </td>

                                {/* SPECIALIZATION */}

                                <td
                                    className="
                      px-6
                      py-4
                      text-sm
                      text-slate-600
                      dark:text-slate-300
                    "
                                >
                                    {doctor.specialization || "N/A"}
                                </td>

                                {/* DEPARTMENT */}

                                <td className="px-6 py-4">
                    <span
                        className="
                        inline-flex
                        rounded-lg
                        bg-blue-50
                        px-2.5
                        py-1
                        text-xs
                        font-semibold
                        text-blue-600
                        dark:bg-blue-500/10
                        dark:text-blue-400
                      "
                    >
                      {doctor.department || "N/A"}
                    </span>
                                </td>

                                {/* EXPERIENCE */}

                                <td
                                    className="
                      px-6
                      py-4
                      text-sm
                      text-slate-600
                      dark:text-slate-300
                    "
                                >
                                    {doctor.experience_years
                                        ? `${doctor.experience_years} yrs`
                                        : "N/A"}
                                </td>

                                {/* PHONE */}

                                <td
                                    className="
                      px-6
                      py-4
                      text-sm
                      text-slate-600
                      dark:text-slate-300
                    "
                                >
                                    {doctor.phone || "N/A"}
                                </td>

                                {/* STATUS */}

                                <td className="px-6 py-4">
                    <span
                        className={`
                        inline-flex
                        items-center
                        gap-1.5
                        rounded-full
                        px-2.5
                        py-1
                        text-xs
                        font-semibold
                        ${
                            doctor.status === "Active"
                                ? `
                              bg-emerald-50
                              text-emerald-600
                              dark:bg-emerald-500/10
                              dark:text-emerald-400
                            `
                                : `
                              bg-slate-100
                              text-slate-500
                              dark:bg-slate-800
                              dark:text-slate-400
                            `
                        }
                      `}
                    >
                      <span
                          className="
                          h-1.5
                          w-1.5
                          rounded-full
                          bg-current
                        "
                      />

                        {doctor.status || "Unknown"}
                    </span>
                                </td>

                                {/* ACTIONS */}

                                <td className="px-6 py-4">
                                    <div className="flex items-center justify-end gap-1">
                                        {/* VIEW */}

                                        <button
                                            type="button"
                                            onClick={() =>
                                                handleViewDoctor(doctor)
                                            }
                                            title="View doctor"
                                            className="
                          rounded-lg
                          p-2
                          text-slate-500
                          transition
                          hover:bg-blue-50
                          hover:text-blue-600
                          dark:text-slate-400
                          dark:hover:bg-blue-500/10
                          dark:hover:text-blue-400
                        "
                                        >
                                            <Eye size={17} />
                                        </button>

                                        {/* EDIT */}

                                        <button
                                            type="button"
                                            onClick={() =>
                                                handleEditDoctor(doctor)
                                            }
                                            title="Edit doctor"
                                            className="
                          rounded-lg
                          p-2
                          text-slate-500
                          transition
                          hover:bg-amber-50
                          hover:text-amber-600
                          dark:text-slate-400
                          dark:hover:bg-amber-500/10
                          dark:hover:text-amber-400
                        "
                                        >
                                            <Pencil size={17} />
                                        </button>

                                        {/* DELETE */}

                                        <button
                                            type="button"
                                            onClick={() =>
                                                handleDeleteDoctor(doctor)
                                            }
                                            disabled={
                                                deletingDoctorId === doctor.id
                                            }
                                            title="Delete doctor"
                                            className={`
                          rounded-lg
                          p-2
                          transition-all
                          duration-200
                          ${
                                                deletingDoctorId === doctor.id
                                                    ? `
                                bg-red-100
                                text-red-600
                                dark:bg-red-500/20
                                dark:text-red-400
                              `
                                                    : `
                                text-slate-500
                                hover:bg-red-50
                                hover:text-red-600
                                dark:text-slate-400
                                dark:hover:bg-red-500/10
                                dark:hover:text-red-400
                              `
                                            }
                        `}
                                        >
                                            <Trash2
                                                size={17}
                                                className={
                                                    deletingDoctorId === doctor.id
                                                        ? "animate-pulse"
                                                        : ""
                                                }
                                            />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        );
                    })}
                    </tbody>
                </table>
            </div>

            {/* ============================================================
          LOADING
      ============================================================ */}

            {loading && (
                <div className="px-6 py-10 text-center">
                    <div
                        className="
              mx-auto
              h-7
              w-7
              animate-spin
              rounded-full
              border-2
              border-slate-200
              border-t-blue-600
            "
                    />

                    <p
                        className="
              mt-3
              text-sm
              text-slate-500
              dark:text-slate-400
            "
                    >
                        Loading doctors...
                    </p>
                </div>
            )}

            {/* ============================================================
          EMPTY STATE
      ============================================================ */}

            {!loading && doctors.length === 0 && (
                <div className="px-6 py-16 text-center">
                    <Stethoscope
                        size={35}
                        className="
              mx-auto
              text-slate-300
              dark:text-slate-600
            "
                    />

                    <p
                        className="
              mt-3
              font-medium
              text-slate-700
              dark:text-slate-300
            "
                    >
                        No doctors found
                    </p>

                    <p
                        className="
              mt-1
              text-sm
              text-slate-500
              dark:text-slate-400
            "
                    >
                        Doctors will appear here after they are added.
                    </p>
                </div>
            )}

            {/* ============================================================
          PAGINATION
      ============================================================ */}

            <div
                className="
          flex
          flex-col
          gap-4
          border-t
          border-slate-200
          px-6
          py-4
          sm:flex-row
          sm:items-center
          sm:justify-between
          dark:border-slate-800
        "
            >
                <p
                    className="
            text-sm
            text-slate-500
            dark:text-slate-400
          "
                >
                    Showing {doctors.length} doctors
                </p>

                <div className="flex items-center gap-2 overflow-x-auto">
                    {/* PREVIOUS */}

                    <button
                        type="button"
                        disabled={
                            currentPage === 1 || loading
                        }
                        onClick={() =>
                            fetchDoctors(currentPage - 1)
                        }
                        className="
              rounded-md
              border
              border-slate-200
              bg-white
              px-3
              py-2
              text-sm
              font-medium
              text-slate-700
              hover:bg-slate-50
              disabled:cursor-not-allowed
              disabled:opacity-40
              dark:border-slate-700
              dark:bg-slate-900
              dark:text-slate-300
              dark:hover:bg-slate-800
            "
                    >
                        Previous
                    </button>

                    {/* PAGE NUMBERS */}

                    {Array.from(
                        { length: totalPages },
                        (_, index) => index + 1
                    ).map((page) => (
                        <button
                            key={page}
                            type="button"
                            disabled={loading}
                            onClick={() => fetchDoctors(page)}
                            className={
                                currentPage === page
                                    ? `
                    rounded-md
                    bg-slate-900
                    px-3
                    py-2
                    text-sm
                    font-medium
                    text-white
                    dark:bg-white
                    dark:text-slate-900
                  `
                                    : `
                    rounded-md
                    border
                    border-slate-200
                    bg-white
                    px-3
                    py-2
                    text-sm
                    font-medium
                    text-slate-700
                    hover:bg-slate-50
                    dark:border-slate-700
                    dark:bg-slate-900
                    dark:text-slate-300
                    dark:hover:bg-slate-800
                  `
                            }
                        >
                            {page}
                        </button>
                    ))}

                    {/* NEXT */}

                    <button
                        type="button"
                        disabled={
                            currentPage === totalPages ||
                            totalPages === 0 ||
                            loading
                        }
                        onClick={() =>
                            fetchDoctors(currentPage + 1)
                        }
                        className="
              rounded-md
              border
              border-slate-200
              bg-white
              px-3
              py-2
              text-sm
              font-medium
              text-slate-700
              hover:bg-slate-50
              disabled:cursor-not-allowed
              disabled:opacity-40
              dark:border-slate-700
              dark:bg-slate-900
              dark:text-slate-300
              dark:hover:bg-slate-800
            "
                    >
                        Next
                    </button>
                </div>
            </div>

            {/* ============================================================
          ADD DOCTOR MODAL
      ============================================================ */}

            {showAddDoctor && (
                <DoctorFormModal
                    title="Add Doctor"
                    description="Enter the doctor's personal and professional information"
                    inputClass={inputClass}
                    labelClass={labelClass}
                    onClose={() => setShowAddDoctor(false)}
                    onSubmit={handleAddDoctor}
                    submitText="Add Doctor"
                />
            )}

            {/* ============================================================
          EDIT DOCTOR MODAL
      ============================================================ */}

            {showEditDoctor && editingDoctor && (
                <DoctorFormModal
                    title="Edit Doctor"
                    description="Update the doctor's personal and professional information"
                    doctor={editingDoctor}
                    inputClass={inputClass}
                    labelClass={labelClass}
                    getImageUrl={getImageUrl}
                    onClose={() => {
                        setShowEditDoctor(false);
                        setEditingDoctor(null);
                    }}
                    onSubmit={handleUpdateDoctor}
                    submitText="Save Changes"
                />
            )}
        </div>
    );
}

/* ================================================================
   DOCTOR AVATAR
================================================================ */

function DoctorAvatar({
                          doctor,
                          size = "md",
                          getImageUrl,
                          getInitials,
                      }) {
    const [imageError, setImageError] = useState(false);

    const imageUrl = getImageUrl(doctor?.image);

    useEffect(() => {
        setImageError(false);
    }, [doctor?.image]);

    const sizeClass =
        size === "lg"
            ? "h-24 w-24 text-2xl"
            : size === "sm"
                ? "h-10 w-10 text-sm"
                : "h-12 w-12 text-base";

    return (
        <div
            className={`
        ${sizeClass}
        shrink-0
        overflow-hidden
        rounded-full
        bg-blue-100
        font-bold
        text-blue-600
        dark:bg-blue-500/10
        dark:text-blue-400
      `}
        >
            {imageUrl && !imageError ? (
                <img
                    src={imageUrl}
                    alt={`Dr. ${getDoctorNameSafe(doctor)}`}
                    className="h-full w-full object-cover"
                    onError={() => setImageError(true)}
                />
            ) : (
                <div className="flex h-full w-full items-center justify-center">
                    {getInitials(doctor)}
                </div>
            )}
        </div>
    );
}

function getDoctorNameSafe(doctor) {
    return `${doctor?.first_name || ""} ${
        doctor?.last_name || ""
    }`.trim();
}

/* ================================================================
   TABLE HEADER
================================================================ */

function TableHeader({ children, right = false }) {
    return (
        <th
            className={`
        px-6
        py-4
        text-xs
        font-semibold
        uppercase
        tracking-wider
        text-slate-500
        dark:text-slate-400
        ${right ? "text-right" : ""}
      `}
        >
            {children}
        </th>
    );
}

/* ================================================================
   PROFILE ITEM
================================================================ */

function ProfileItem({ label, value }) {
    return (
        <div>
            <p
                className="
          text-xs
          font-medium
          uppercase
          tracking-wide
          text-slate-400
          dark:text-slate-500
        "
            >
                {label}
            </p>

            <p
                className="
          mt-1
          text-sm
          font-medium
          text-slate-700
          dark:text-slate-200
        "
            >
                {value || "Not provided"}
            </p>
        </div>
    );
}

/* ================================================================
   DOCTOR FORM MODAL
================================================================ */

function DoctorFormModal({
                             title,
                             description,
                             doctor,
                             inputClass,
                             labelClass,
                             onClose,
                             onSubmit,
                             submitText,
                             getImageUrl,
                         }) {
    return (
        <div
            className="
        fixed
        inset-0
        z-50
        flex
        items-center
        justify-center
        bg-black/50
        px-4
        py-6
      "
        >
            <div
                className="
          max-h-[92vh]
          w-full
          max-w-4xl
          overflow-y-auto
          rounded-2xl
          bg-white
          shadow-xl
          dark:bg-slate-900
        "
            >
                {/* HEADER */}

                <div
                    className="
            sticky
            top-0
            z-10
            flex
            items-center
            justify-between
            border-b
            border-slate-200
            bg-white
            px-6
            py-5
            dark:border-slate-800
            dark:bg-slate-900
          "
                >
                    <div>
                        <h2
                            className="
                text-lg
                font-semibold
                text-slate-900
                dark:text-white
              "
                        >
                            {title}
                        </h2>

                        <p
                            className="
                mt-1
                text-sm
                text-slate-500
                dark:text-slate-400
              "
                        >
                            {description}
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        className="
              rounded-lg
              p-2
              text-slate-400
              transition
              hover:bg-slate-100
              hover:text-slate-700
              dark:hover:bg-slate-800
              dark:hover:text-white
            "
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* FORM */}

                <form
                    onSubmit={onSubmit}
                    encType="multipart/form-data"
                    className="space-y-8 p-6"
                >
                    {/* ======================================================
              PERSONAL INFORMATION
          ====================================================== */}

                    <section>
                        <SectionTitle
                            title="Personal Information"
                            description="Basic information about the doctor"
                        />

                        <div
                            className="
                grid
                grid-cols-1
                gap-4
                sm:grid-cols-2
              "
                        >
                            <FormInput
                                label="First Name"
                                name="first_name"
                                placeholder="Ram"
                                required
                                defaultValue={doctor?.first_name || ""}
                                inputClass={inputClass}
                                labelClass={labelClass}
                            />

                            <FormInput
                                label="Last Name"
                                name="last_name"
                                placeholder="Sharma"
                                required
                                defaultValue={doctor?.last_name || ""}
                                inputClass={inputClass}
                                labelClass={labelClass}
                            />

                            <FormInput
                                label="Date of Birth"
                                name="date_of_birth"
                                type="date"
                                defaultValue={doctor?.date_of_birth || ""}
                                inputClass={inputClass}
                                labelClass={labelClass}
                            />

                            <div>
                                <label className={labelClass}>
                                    Gender
                                </label>

                                <select
                                    name="gender"
                                    defaultValue={doctor?.gender || ""}
                                    className={inputClass}
                                >
                                    <option value="">
                                        Select Gender
                                    </option>

                                    <option value="MALE">
                                        Male
                                    </option>

                                    <option value="FEMALE">
                                        Female
                                    </option>

                                    <option value="OTHER">
                                        Other
                                    </option>
                                </select>
                            </div>

                            {/* PROFILE IMAGE */}

                            <div className="sm:col-span-2">
                                <label className={labelClass}>
                                    Doctor Profile Image
                                </label>

                                <input
                                    type="file"
                                    name="image"
                                    accept="image/*"
                                    className="
                    w-full
                    rounded-lg
                    border
                    border-slate-200
                    bg-white
                    px-3
                    py-2.5
                    text-sm
                    text-slate-700
                    outline-none
                    transition
                    file:mr-4
                    file:rounded-md
                    file:border-0
                    file:bg-blue-50
                    file:px-3
                    file:py-2
                    file:text-sm
                    file:font-medium
                    file:text-blue-600
                    hover:file:bg-blue-100
                    dark:border-slate-700
                    dark:bg-slate-800
                    dark:text-slate-300
                    dark:file:bg-blue-500/10
                    dark:file:text-blue-400
                  "
                                />

                                {doctor?.image && getImageUrl && (
                                    <div className="mt-4 flex items-center gap-4">
                                        <img
                                            src={getImageUrl(doctor.image) || ""}
                                            alt="Current doctor"
                                            className="
                        h-16
                        w-16
                        rounded-full
                        object-cover
                        ring-2
                        ring-slate-200
                        dark:ring-slate-700
                      "
                                        />

                                        <div>
                                            <p
                                                className="
                          text-sm
                          font-medium
                          text-slate-700
                          dark:text-slate-200
                        "
                                            >
                                                Current profile image
                                            </p>

                                            <p
                                                className="
                          mt-1
                          text-xs
                          text-slate-400
                          dark:text-slate-500
                        "
                                            >
                                                Select a new image to replace it.
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </section>

                    {/* ======================================================
              PROFESSIONAL INFORMATION
          ====================================================== */}

                    <section>
                        <SectionTitle
                            title="Professional Information"
                            description="Medical qualification and professional details"
                        />

                        <div
                            className="
                grid
                grid-cols-1
                gap-4
                sm:grid-cols-2
              "
                        >
                            <div>
                                <label className={labelClass}>
                                    Specialization
                                </label>

                                <select
                                    name="specialization"
                                    defaultValue={doctor?.specialization || ""}
                                    required
                                    className={inputClass}
                                >
                                    <option value="">
                                        Select Specialization
                                    </option>

                                    <option value="GENERAL">
                                        General Physician
                                    </option>

                                    <option value="CARDIOLOGIST">
                                        Cardiologist
                                    </option>

                                    <option value="NEUROLOGIST">
                                        Neurologist
                                    </option>

                                    <option value="DERMATOLOGIST">
                                        Dermatologist
                                    </option>

                                    <option value="ONCOLOGIST">
                                        Oncologist
                                    </option>

                                    <option value="ORTHOPEDIC">
                                        Orthopedic
                                    </option>

                                    <option value="PEDIATRICIAN">
                                        Pediatrician
                                    </option>

                                    <option value="PSYCHIATRIST">
                                        Psychiatrist
                                    </option>

                                    <option value="RADIOLOGIST">
                                        Radiologist
                                    </option>

                                    <option value="PULMONOLOGIST">
                                        Pulmonologist
                                    </option>

                                    <option value="OTHER">
                                        Other
                                    </option>
                                </select>
                            </div>

                            <div>
                                <label className={labelClass}>
                                    Department
                                </label>

                                <select
                                    name="department"
                                    defaultValue={doctor?.department || ""}
                                    required
                                    className={inputClass}
                                >
                                    <option value="">
                                        Select Department
                                    </option>

                                    <option value="GENERAL_MEDICINE">
                                        General Medicine
                                    </option>

                                    <option value="CARDIOLOGY">
                                        Cardiology
                                    </option>

                                    <option value="NEUROLOGY">
                                        Neurology
                                    </option>

                                    <option value="DERMATOLOGY">
                                        Dermatology
                                    </option>

                                    <option value="ONCOLOGY">
                                        Oncology
                                    </option>

                                    <option value="ORTHOPEDICS">
                                        Orthopedics
                                    </option>

                                    <option value="PEDIATRICS">
                                        Pediatrics
                                    </option>

                                    <option value="PSYCHIATRY">
                                        Psychiatry
                                    </option>

                                    <option value="RADIOLOGY">
                                        Radiology
                                    </option>

                                    <option value="PULMONOLOGY">
                                        Pulmonology
                                    </option>

                                    <option value="EMERGENCY">
                                        Emergency
                                    </option>

                                    <option value="OTHER">
                                        Other
                                    </option>
                                </select>
                            </div>

                            <FormInput
                                label="Qualification"
                                name="qualification"
                                placeholder="MBBS, MD"
                                defaultValue={
                                    doctor?.qualification || ""
                                }
                                inputClass={inputClass}
                                labelClass={labelClass}
                            />

                            <FormInput
                                label="License / Registration Number"
                                name="license_number"
                                placeholder="MED-123456"
                                required
                                defaultValue={
                                    doctor?.license_number || ""
                                }
                                inputClass={inputClass}
                                labelClass={labelClass}
                            />

                            <FormInput
                                label="Years of Experience"
                                name="experience_years"
                                type="number"
                                min="0"
                                placeholder="10"
                                defaultValue={
                                    doctor?.experience_years ?? ""
                                }
                                inputClass={inputClass}
                                labelClass={labelClass}
                            />

                            <FormInput
                                label="Joining Date"
                                name="joining_date"
                                type="date"
                                defaultValue={
                                    doctor?.joining_date || ""
                                }
                                inputClass={inputClass}
                                labelClass={labelClass}
                            />
                        </div>
                    </section>

                    {/* ======================================================
              CONTACT INFORMATION
          ====================================================== */}

                    <section>
                        <SectionTitle
                            title="Contact Information"
                            description="Contact details of the doctor"
                        />

                        <div
                            className="
                grid
                grid-cols-1
                gap-4
                sm:grid-cols-2
              "
                        >
                            <FormInput
                                label="Phone"
                                name="phone"
                                type="tel"
                                placeholder="9800000000"
                                defaultValue={doctor?.phone || ""}
                                inputClass={inputClass}
                                labelClass={labelClass}
                            />

                            <FormInput
                                label="Email"
                                name="email"
                                type="email"
                                placeholder="doctor@example.com"
                                defaultValue={doctor?.email || ""}
                                inputClass={inputClass}
                                labelClass={labelClass}
                            />

                            <div className="sm:col-span-2">
                                <label className={labelClass}>
                                    Address
                                </label>

                                <textarea
                                    name="address"
                                    rows={2}
                                    placeholder="Doctor's current address"
                                    defaultValue={doctor?.address || ""}
                                    className={`${inputClass} resize-none`}
                                />
                            </div>
                        </div>
                    </section>

                    {/* ======================================================
              SCHEDULE
          ====================================================== */}

                    <section>
                        <SectionTitle
                            title="Availability & Schedule"
                            description="Doctor's working schedule and consultation details"
                        />

                        <div
                            className="
                grid
                grid-cols-1
                gap-4
                sm:grid-cols-2
              "
                        >
                            <div>
                                <label className={labelClass}>
                                    Available Days
                                </label>

                                <input
                                    type="text"
                                    name="available_days"
                                    placeholder="Sun, Mon, Wed, Fri"
                                    defaultValue={
                                        doctor?.available_days || ""
                                    }
                                    className={inputClass}
                                />
                            </div>

                            <FormInput
                                label="Consultation Fee"
                                name="consultation_fee"
                                type="number"
                                min="0"
                                step="0.01"
                                placeholder="500"
                                defaultValue={
                                    doctor?.consultation_fee ?? ""
                                }
                                inputClass={inputClass}
                                labelClass={labelClass}
                            />

                            <FormInput
                                label="Available From"
                                name="available_from"
                                type="time"
                                defaultValue={
                                    doctor?.available_from || ""
                                }
                                inputClass={inputClass}
                                labelClass={labelClass}
                            />

                            <FormInput
                                label="Available To"
                                name="available_to"
                                type="time"
                                defaultValue={
                                    doctor?.available_to || ""
                                }
                                inputClass={inputClass}
                                labelClass={labelClass}
                            />

                            <div>
                                <label className={labelClass}>
                                    Status
                                </label>

                                <select
                                    name="status"
                                    defaultValue={
                                        doctor?.status || "Active"
                                    }
                                    className={inputClass}
                                >
                                    <option value="Active">
                                        Active
                                    </option>

                                    <option value="Inactive">
                                        Inactive
                                    </option>
                                </select>
                            </div>
                        </div>
                    </section>

                    {/* ======================================================
              ADDITIONAL INFORMATION
          ====================================================== */}

                    <section>
                        <SectionTitle
                            title="Additional Information"
                            description="Additional information about the doctor"
                        />

                        <div className="space-y-4">
                            <div>
                                <label className={labelClass}>
                                    Biography
                                </label>

                                <textarea
                                    name="bio"
                                    rows={4}
                                    placeholder="Write a short professional biography..."
                                    defaultValue={doctor?.bio || ""}
                                    className={`${inputClass} resize-none`}
                                />
                            </div>

                            <div>
                                <label className={labelClass}>
                                    Notes
                                </label>

                                <textarea
                                    name="notes"
                                    rows={3}
                                    placeholder="Additional notes about the doctor..."
                                    defaultValue={doctor?.notes || ""}
                                    className={`${inputClass} resize-none`}
                                />
                            </div>
                        </div>
                    </section>

                    {/* BUTTONS */}

                    <div
                        className="
              flex
              justify-end
              gap-3
              border-t
              border-slate-200
              pt-5
              dark:border-slate-800
            "
                    >
                        <button
                            type="button"
                            onClick={onClose}
                            className="
                rounded-lg
                border
                border-slate-200
                px-4
                py-2.5
                text-sm
                font-medium
                text-slate-600
                transition
                hover:bg-slate-50
                dark:border-slate-700
                dark:text-slate-300
                dark:hover:bg-slate-800
              "
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            className="
                rounded-lg
                bg-blue-600
                px-5
                py-2.5
                text-sm
                font-semibold
                text-white
                transition
                hover:bg-blue-700
                focus:outline-none
                focus:ring-2
                focus:ring-blue-500
              "
                        >
                            {submitText}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

/* ================================================================
   SECTION TITLE
================================================================ */

function SectionTitle({ title, description }) {
    return (
        <div className="mb-4">
            <h3
                className="
          text-sm
          font-semibold
          text-slate-900
          dark:text-white
        "
            >
                {title}
            </h3>

            <p
                className="
          mt-1
          text-xs
          text-slate-500
          dark:text-slate-400
        "
            >
                {description}
            </p>
        </div>
    );
}

/* ================================================================
   FORM INPUT
================================================================ */

function FormInput({
                       label,
                       name,
                       type = "text",
                       placeholder,
                       defaultValue,
                       required = false,
                       min,
                       step,
                       inputClass,
                       labelClass,
                   }) {
    return (
        <div>
            <label
                htmlFor={name}
                className={labelClass}
            >
                {label}
            </label>

            <input
                id={name}
                type={type}
                name={name}
                placeholder={placeholder}
                defaultValue={defaultValue}
                required={required}
                min={min}
                step={step}
                className={inputClass}
            />
        </div>
    );
}