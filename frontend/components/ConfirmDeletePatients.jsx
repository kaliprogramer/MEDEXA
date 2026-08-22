import toast from "react-hot-toast";

export default function ConfirmDeletePatients({
                                                  patient,
                                                  onConfirm,
                                                  onCancel,
                                              }) {
    toast.custom(
        (t) => (
            <div
                className={`${
                    t.visible
                        ? "animate-custom-enter"
                        : "animate-custom-leave"
                } w-full max-w-md rounded-xl bg-white shadow-xl ring-1 ring-black/5 dark:bg-slate-900`}
            >
                <div className="p-5">
                    {/* Header */}
                    <div className="flex gap-4">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-100 dark:bg-red-500/10">
                            <svg
                                className="h-5 w-5 text-red-600 dark:text-red-400"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth={2}
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M12 9v3.75m0 3.75h.008M10.29 3.86l-8.82 15a1.875 1.875 0 001.62 2.815h17.82a1.875 1.875 0 001.62-2.815l-8.82-15a1.875 1.875 0 00-3.24 0z"
                                />
                            </svg>
                        </div>

                        <div className="flex-1">
                            <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                                Delete patient?
                            </h3>

                            <p className="mt-1 text-sm text-gray-500 dark:text-slate-400">
                                Are you sure you want to delete this patient?
                            </p>
                        </div>
                    </div>

                    {/* Patient details */}
                    <div className="mt-4 rounded-lg border border-slate-200 bg-slate-50 p-3 dark:border-slate-700 dark:bg-slate-800">
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-600 dark:bg-blue-500/10 dark:text-blue-400">
                                {patient.first_name?.[0]}
                                {patient.last_name?.[0]}
                            </div>

                            <div className="min-w-0">
                                <p className="truncate text-sm font-semibold text-slate-900 dark:text-white">
                                    {patient.first_name} {patient.last_name}
                                </p>

                                <p className="text-xs text-slate-500 dark:text-slate-400">
                                    Patient ID: #{patient.patient_id}
                                </p>
                            </div>
                        </div>

                        <div className="mt-3 grid grid-cols-2 gap-3">
                            <div className="min-w-0">
                                <p className="text-xs text-slate-400">
                                    Email
                                </p>

                                <p className="truncate text-xs font-medium text-slate-700 dark:text-slate-300">
                                    {patient.email || "No email"}
                                </p>
                            </div>

                            <div>
                                <p className="text-xs text-slate-400">
                                    Phone
                                </p>

                                <p className="text-xs font-medium text-slate-700 dark:text-slate-300">
                                    {patient.phone || "No phone"}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Buttons */}
                    <div className="mt-4 flex justify-end gap-2">
                        <button
                            type="button"
                            onClick={() => {
                                toast.dismiss(t.id);
                                onCancel();
                            }}
                            className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
                        >
                            Cancel
                        </button>

                        <button
                            type="button"
                            onClick={async () => {
                                await onConfirm(t.id);
                            }}
                            className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900"
                        >
                            Delete Patient
                        </button>
                    </div>
                </div>
            </div>
        ),
        {
            duration: Infinity,
            position: "top-right",
        }
    );
}