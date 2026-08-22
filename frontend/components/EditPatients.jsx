import {post_patients} from "../app/lib/api/patients_API";

export default function EditPatients(props,showeditpatients) {
    return (
        <>
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

        </>
        )}