"use client";

import toast from "react-hot-toast";
import { AlertTriangle } from "lucide-react";

export default function ConfirmDeleteInventory({
                                                item,
                                                onCancel,
                                                onConfirm,
                                            }) {

    const name = `${item.name}`


    const toastId = toast.custom(
        (t) => (

            <div className="
                w-[360px]
                rounded-xl
                border
                border-slate-200
                bg-white
                p-5
                shadow-xl
                dark:border-slate-700
                dark:bg-slate-900
            ">

                <div className="flex gap-3">

                    <div className="
                        flex
                        h-10
                        w-10
                        shrink-0
                        items-center
                        justify-center
                        rounded-full
                        bg-red-50
                        text-red-600
                        dark:bg-red-500/10
                        dark:text-red-400
                    ">
                        <AlertTriangle size={20} />
                    </div>


                    <div>

                        <h3 className="
                            font-semibold
                            text-slate-900
                            dark:text-white
                        ">
                            Delete Item?
                        </h3>

                        <p className="
                            mt-1
                            text-sm
                            leading-5
                            text-slate-500
                            dark:text-slate-400
                        ">
                            Are you sure you want to delete Item. {name}?
                            This action cannot be undone.
                        </p>

                    </div>

                </div>


                <div className="
                    mt-4
                    flex
                    justify-end
                    gap-2
                ">

                    <button
                        onClick={() => {
                            toast.dismiss(t.id);
                            onCancel();
                        }}
                        className="
                            rounded-lg
                            border
                            border-slate-200
                            px-3
                            py-2
                            text-sm
                            font-medium
                            text-slate-600
                            hover:bg-slate-50
                            dark:border-slate-700
                            dark:text-slate-300
                            dark:hover:bg-slate-800
                        "
                    >
                        Cancel
                    </button>


                    <button
                        onClick={() => onConfirm(t.id)}
                        className="
                            rounded-lg
                            bg-red-600
                            px-3
                            py-2
                            text-sm
                            font-semibold
                            text-white
                            hover:bg-red-700
                        "
                    >
                        Delete
                    </button>

                </div>

            </div>

        ),
        {
            duration: Infinity,
        }
    );

}