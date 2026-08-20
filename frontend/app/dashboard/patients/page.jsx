"use client";

import {
    Eye,
    Pencil,
    Trash2,
    MoreHorizontal,
    Plus,
} from "lucide-react";
import {useEffect, useState} from "react";
import {get_patients, post_patients} from "../../lib/api/patients_API";

// [
//     {
//         id: "PAT-001",
//         name: "Ram Sharma",
//         gender: "Male",
//         age: 28,
//         blood: "O+",
//         phone: "9800000000",
//         status: "Active",
//     },
//     {
//         id: "PAT-002",
//         name: "Sita Thapa",
//         gender: "Female",
//         age: 34,
//         blood: "A+",
//         phone: "9811111111",
//         status: "Active",
//     },
//     {
//         id: "PAT-003",
//         name: "Hari KC",
//         gender: "Male",
//         age: 45,
//         blood: "B+",
//         phone: "9822222222",
//         status: "Inactive",
//     },
// ];

export default function PatientTable() {
        const [patient, setPatient] = useState([]);
        const [name, setName] = useState("");

        const [nextPage, setNextPage] = useState(null);
        const [previousPage, setPreviousPage] = useState(null);

        const [currentPage, setCurrentPage] = useState(1);
        const [totalPatients, setTotalPatients] = useState(0);

        const PAGE_SIZE = 10;

        const totalPages = Math.ceil(totalPatients / PAGE_SIZE);

        const fetchPatients = async (page = 1) => {
            try {
                const data = await get_patients(page);

                setPatient(data.results);
                setNextPage(data.next);
                setPreviousPage(data.previous);
                setTotalPatients(data.count);

                // IMPORTANT
                setCurrentPage(page);

            } catch (error) {
                console.error("Failed to fetch patients:", error);
            }
        };

        useEffect(() => {
            fetchPatients(1);
        }, []);
        // const patient_name = `${patient.first_name +" "+ patient.last_name}`
        // setName(patient_name);
        // console.log(patient_name);
    const handleView = (patient) => {
        console.log("View:", patient);
    };
    const [showAddPatient, setShowAddPatient] = useState(false);
    const handleEdit = (patient) => {
        console.log("Edit:", patient);
    };

    const handleDelete = (patient) => {
        console.log("Delete:", patient);
    };

    return (
        <div className="w-full overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900 mt-20">

            {/* Table Header */}
            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5 dark:border-slate-800">

                <div>
                    <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                        Patients
                    </h2>

                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                        Manage and view all registered patients
                    </p>
                </div>

                <div className="flex items-center gap-3">

        <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-600 dark:bg-blue-500/10 dark:text-blue-400">
            {patient.length} Patients
        </span>

                    <button
                        onClick={() => setShowAddPatient(true)}
                        className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900"
                    >
                        <Plus size={17} />
                        Add Patient
                    </button>

                </div>
            </div>
            {/* Responsive Table */}
            <div className="overflow-x-auto">
                <table className="w-full min-w-[900px] text-left">

                    {/* Head */}
                    <thead className="border-b border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-950/50">
                    <tr>
                        <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                            Patient
                        </th>

                        <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                            Gender
                        </th>



                        <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                            Blood Group
                        </th>

                        <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                            Phone
                        </th>

                        <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                            Status
                        </th>

                        <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                            Actions
                        </th>
                    </tr>
                    </thead>

                    {/* Body */}
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">

                    {patient.map((data) => {
                        const name = `${data.first_name} ${data.last_name}`;

                        return (
                            <tr
                                key={data.id}
                                className="transition hover:bg-slate-50 dark:hover:bg-slate-800/40"
                            >
                                {/* Patient */}
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">

                                        {/* Avatar */}
                                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-600 dark:bg-blue-500/10 dark:text-blue-400">
                                            {name
                                                .split(" ")
                                                .map((n) => n[0])
                                                .join("")}
                                        </div>

                                        <div>
                                            <p className="font-semibold text-slate-900 dark:text-white">
                                                {name}
                                            </p>

                                            <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                                                {data.id}
                                            </p>
                                        </div>

                                    </div>
                                </td>

                                {/* Gender */}
                                <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-300">
                                    {data.gender}
                                </td>


                                {/* Blood */}
                                <td className="px-6 py-4">
                <span className="inline-flex rounded-lg bg-red-50 px-2.5 py-1 text-xs font-semibold text-red-600 dark:bg-red-500/10 dark:text-red-400">
                    {data.blood_group}
                </span>
                                </td>

                                {/* Phone */}
                                <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-300">
                                    {data.phone}
                                </td>

                                {/* Status */}
                                <td className="px-6 py-4">
                <span
                    className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${
                        data.status === "Active"
                            ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400"
                            : "bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400"
                    }`}
                >
                    <span className="h-1.5 w-1.5 rounded-full bg-current" />
                    {data.status}
                </span>
                                </td>

                                {/* Actions */}
                                <td className="px-6 py-4">
                                    <div className="flex items-center justify-end gap-1">

                                        {/* View */}
                                        <button
                                            onClick={() => handleView(data)}
                                            title="View patient"
                                            className="rounded-lg p-2 text-slate-500 transition hover:bg-blue-50 hover:text-blue-600 dark:text-slate-400 dark:hover:bg-blue-500/10 dark:hover:text-blue-400"
                                        >
                                            <Eye size={17} />
                                        </button>

                                        {/* Edit */}
                                        <button
                                            onClick={() => handleEdit(data)}
                                            title="Edit patient"
                                            className="rounded-lg p-2 text-slate-500 transition hover:bg-amber-50 hover:text-amber-600 dark:text-slate-400 dark:hover:bg-amber-500/10 dark:hover:text-amber-400"
                                        >
                                            <Pencil size={17} />
                                        </button>

                                        {/* Delete */}
                                        <button
                                            onClick={() => handleDelete(data)}
                                            title="Delete patient"
                                            className="rounded-lg p-2 text-slate-500 transition hover:bg-red-50 hover:text-red-600 dark:text-slate-400 dark:hover:bg-red-500/10 dark:hover:text-red-400"
                                        >
                                            <Trash2 size={17} />
                                        </button>

                                        {/* More */}
                                        <button
                                            title="More"
                                            className="ml-1 rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-white"
                                        >
                                            <MoreHorizontal size={17} />
                                        </button>

                                    </div>
                                </td>
                            </tr>
                        );
                    })}
                    </tbody>
                </table>
            </div>

            {/* Empty State */}
            {patient.length === 0 && (
                <div className="px-6 py-16 text-center">
                    <p className="font-medium text-slate-700 dark:text-slate-300">
                        No patients found
                    </p>

                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                        Patients will appear here after they are added.
                    </p>
                </div>
            )}

            {/* Footer */}
            <div className="flex items-center justify-between border-t border-slate-200 px-6 py-4 dark:border-slate-800">
                <p className="text-sm text-slate-500 dark:text-slate-400">
                    Showing {patient.length} patients
                </p>

                <div className="flex items-center gap-2">
                    {/* Previous */}
                    <button
                        disabled={currentPage === 1}
                        onClick={() => fetchPatients(currentPage - 1)}
                        className="
                rounded-md border border-slate-200
                bg-white px-3 py-2 text-sm font-medium text-slate-700
                hover:bg-slate-50
                disabled:cursor-not-allowed disabled:opacity-40
                dark:border-slate-700
                dark:bg-slate-900
                dark:text-slate-300
                dark:hover:bg-slate-800
            "
                    >
                        Previous
                    </button>

                    {/* Page numbers */}
                    {Array.from({ length: totalPages }, (_, index) => {
                        const page = index + 1;

                        return (
                            <button
                                key={page}
                                onClick={() => fetchPatients(page)}
                                className={
                                    currentPage === page
                                        ? `
                                rounded-md
                                bg-slate-900 px-3 py-2
                                text-sm font-medium text-white
                                dark:bg-white dark:text-slate-900
                            `
                                        : `
                                rounded-md
                                border border-slate-200
                                bg-white px-3 py-2
                                text-sm font-medium text-slate-700
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
                        );
                    })}

                    {/* Next */}
                    <button
                        disabled={currentPage === totalPages}
                        onClick={() => fetchPatients(currentPage + 1)}
                        className="
                rounded-md border border-slate-200
                bg-white px-3 py-2 text-sm font-medium text-slate-700
                hover:bg-slate-50
                disabled:cursor-not-allowed disabled:opacity-40
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
            {/* Add Patient Modal */}
            {showAddPatient && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 py-6">

                    <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-white shadow-xl dark:bg-slate-900">

                        {/* Modal Header */}
                        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-200 bg-white px-6 py-5 dark:border-slate-800 dark:bg-slate-900">

                            <div>
                                <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                                    Add Patient
                                </h2>

                                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                                    Enter the patient's personal and medical information
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={() => setShowAddPatient(false)}
                                className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-white"
                            >
                                ✕
                            </button>

                        </div>


                        {/* Form */}
                        <form
                            onSubmit={async(e) => {
                                e.preventDefault();
                                const formData = new FormData(e.currentTarget);

                                const data = {
                                    first_name: formData.get("first_name"),
                                    last_name: formData.get("last_name"),
                                    date_of_birth: formData.get("date_of_birth"),
                                    email: formData.get("email"),
                                    phone: formData.get("phone"),
                                    gender: formData.get("gender"),
                                    blood_group: formData.get("blood_group"),
                                    address: formData.get("address"),
                                    emergency_contact: formData.get("emergency_contact"),
                                    allergies: formData.get("allergies"),
                                    medical_history: formData.get("medical_history"),
                                    current_medications: formData.get("current_medications"),
                                    note: formData.get("note"),
                                };
                                const result = await post_patients(data);
                                console.log(result);
                                setPatient((prev) => [result,...prev]);

                                setShowAddPatient(false);
                            }}
                            className="space-y-8 p-6"
                        >

                            {/* ================= PERSONAL INFORMATION ================= */}
                            <section>

                                <div className="mb-4">
                                    <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
                                        Personal Information
                                    </h3>

                                    <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                                        Basic information about the patient
                                    </p>
                                </div>

                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

                                    {/* First Name */}
                                    <div>
                                        <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
                                            First Name
                                        </label>

                                        <input
                                            type="text"
                                            name="first_name"
                                            placeholder="Ram"
                                            required
                                            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                                        />
                                    </div>


                                    {/* Last Name */}
                                    <div>
                                        <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
                                            Last Name
                                        </label>

                                        <input
                                            type="text"
                                            name="last_name"
                                            placeholder="Sharma"
                                            required
                                            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                                        />
                                    </div>


                                    {/* Date of Birth */}
                                    <div>
                                        <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
                                            Date of Birth
                                        </label>

                                        <input
                                            type="date"
                                            name="date_of_birth"
                                            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                                        />
                                    </div>


                                    {/* Gender */}
                                    <div>
                                        <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
                                            Gender
                                        </label>

                                        <select
                                            name="gender"
                                            required
                                            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                                        >
                                            <option value="">Select Gender</option>
                                            <option value="MALE">Male</option>
                                            <option value="FEMALE">Female</option>
                                            <option value="OTHER">Other</option>
                                        </select>
                                    </div>


                                    {/* Blood Group */}
                                    <div>
                                        <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
                                            Blood Group
                                        </label>

                                        <select
                                            name="blood_group"
                                            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                                        >
                                            <option value="">Select Blood Group</option>
                                            <option value="A+">A+</option>
                                            <option value="A-">A-</option>
                                            <option value="B+">B+</option>
                                            <option value="B-">B-</option>
                                            <option value="O+">O+</option>
                                            <option value="O-">O-</option>
                                            <option value="AB+">AB+</option>
                                            <option value="AB-">AB-</option>
                                        </select>
                                    </div>

                                </div>

                            </section>


                            {/* ================= CONTACT INFORMATION ================= */}
                            <section>

                                <div className="mb-4">
                                    <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
                                        Contact Information
                                    </h3>

                                    <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                                        Contact details and emergency contact
                                    </p>
                                </div>


                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

                                    {/* Phone */}
                                    <div>
                                        <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
                                            Phone
                                        </label>

                                        <input
                                            type="tel"
                                            name="phone"
                                            placeholder="9800000000"
                                            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                                        />
                                    </div>


                                    {/* Email */}
                                    <div>
                                        <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
                                            Email
                                        </label>

                                        <input
                                            type="email"
                                            name="email"
                                            placeholder="patient@example.com"
                                            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                                        />
                                    </div>


                                    {/* Address */}
                                    <div className="sm:col-span-2">
                                        <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
                                            Address
                                        </label>

                                        <textarea
                                            name="address"
                                            rows={2}
                                            placeholder="Patient's current address"
                                            className="w-full resize-none rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                                        />
                                    </div>


                                    {/* Emergency Contact */}
                                    <div className="sm:col-span-2">
                                        <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
                                            Emergency Contact
                                        </label>

                                        <input
                                            type="text"
                                            name="emergency_contact"
                                            placeholder="Name and phone number"
                                            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                                        />
                                    </div>

                                </div>

                            </section>


                            {/* ================= MEDICAL INFORMATION ================= */}
                            <section>

                                <div className="mb-4">
                                    <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
                                        Medical Information
                                    </h3>

                                    <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                                        Medical history and current health information
                                    </p>
                                </div>


                                <div className="space-y-4">

                                    {/* Allergies */}
                                    <div>
                                        <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
                                            Allergies
                                        </label>

                                        <textarea
                                            name="allergies"
                                            rows={2}
                                            placeholder="e.g. Penicillin, peanuts, dust"
                                            className="w-full resize-none rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                                        />
                                    </div>


                                    {/* Medical History */}
                                    <div>
                                        <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
                                            Medical History
                                        </label>

                                        <textarea
                                            name="medical_history"
                                            rows={3}
                                            placeholder="Previous illnesses, surgeries, conditions, etc."
                                            className="w-full resize-none rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                                        />
                                    </div>


                                    {/* Current Medications */}
                                    <div>
                                        <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
                                            Current Medications
                                        </label>

                                        <textarea
                                            name="current_medications"
                                            rows={3}
                                            placeholder="List current medications and dosage"
                                            className="w-full resize-none rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                                        />
                                    </div>


                                    {/* Notes */}
                                    <div>
                                        <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
                                            Notes
                                        </label>

                                        <textarea
                                            name="notes"
                                            rows={3}
                                            placeholder="Additional notes about the patient"
                                            className="w-full resize-none rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                                        />
                                    </div>

                                </div>

                            </section>


                            {/* ================= BUTTONS ================= */}
                            <div className="flex justify-end gap-3 border-t border-slate-200 pt-5 dark:border-slate-800">

                                <button
                                    type="button"
                                    onClick={() => setShowAddPatient(false)}
                                    className="rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
                                >
                                    Cancel
                                </button>


                                <button
                                    type="submit"
                                    className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900"
                                >
                                    Add Patient
                                </button>

                            </div>

                        </form>

                    </div>
                </div>
            )}
        </div>
    );
}
