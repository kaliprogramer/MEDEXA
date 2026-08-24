"use client";

import {
    Package,
    Plus,
    Search,
    Filter,
    Eye,
    Pencil,
    Trash2,
    X,
    Boxes,
    AlertTriangle,
    TrendingDown,
    TrendingUp,
    CalendarDays,
    Truck,
    ArrowDownToLine,
    ArrowUpFromLine,
    RefreshCw,
    MapPin,
    Tag,
    DollarSign,
    Activity,
} from "lucide-react";

import {
    useCallback,
    useEffect,
    useMemo,
    useState,
} from "react";

import toast from "react-hot-toast";

import {
    get_inventory,
    post_inventory,
    put_inventory,
    delete_inventory,
} from "@/app/lib/api/inventory_API";


// ============================================================
// CONSTANTS
// ============================================================

const ITEM_TYPES = {
    MEDICINE: "Medicine",
    MEDICAL_SUPPLY: "Medical Supply",
    EQUIPMENT: "Equipment",
    OTHER: "Other",
};

const UNITS = {
    PIECE: "Piece",
    BOX: "Box",
    PACK: "Pack",
    BOTTLE: "Bottle",
    STRIP: "Strip",
    VIAL: "Vial",
    TABLET: "Tablet",
    LITER: "Liter",
    KG: "Kilogram",
};


// ============================================================
// HELPERS
// ============================================================

function normalizeItem(item) {
    if (!item || typeof item !== "object") {
        return null;
    }

    return {
        ...item,

        id: item.id ?? null,

        name:
            item.name == null
                ? ""
                : String(item.name),

        item_code:
            item.item_code == null
                ? ""
                : String(item.item_code),

        item_type:
            item.item_type || "OTHER",

        supplier:
            item.supplier == null
                ? ""
                : String(item.supplier),

        description:
            item.description == null
                ? ""
                : String(item.description),

        unit:
            item.unit || "PIECE",

        quantity:
            Number(item.quantity) || 0,

        minimum_stock:
            Number(item.minimum_stock) || 0,

        unit_price:
            Number(item.unit_price) || 0,

        batch_number:
            item.batch_number == null
                ? ""
                : String(item.batch_number),

        expiry_date:
            item.expiry_date || "",

        storage_location:
            item.storage_location == null
                ? ""
                : String(item.storage_location),
    };
}


function getInventoryArray(data) {
    if (Array.isArray(data)) {
        return data
            .map(normalizeItem)
            .filter(Boolean);
    }

    if (Array.isArray(data?.results)) {
        return data.results
            .map(normalizeItem)
            .filter(Boolean);
    }

    return [];
}


function getStockStatus(item) {
    const quantity =
        Number(item?.quantity) || 0;

    const minimum =
        Number(item?.minimum_stock) || 0;

    if (quantity === 0) {
        return {
            label: "Out of Stock",
            className:
                "bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400",
        };
    }

    if (quantity <= minimum) {
        return {
            label: "Low Stock",
            className:
                "bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400",
        };
    }

    return {
        label: "In Stock",
        className:
            "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400",
    };
}


function formatCurrency(value) {
    const number =
        Number(value) || 0;

    return `Rs. ${number.toLocaleString(
        "en-NP",
        {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        }
    )}`;
}


function formatDate(value) {
    if (!value) {
        return "N/A";
    }

    const date =
        new Date(`${value}T00:00:00`);

    if (Number.isNaN(date.getTime())) {
        return "N/A";
    }

    return date.toLocaleDateString(
        "en-US",
        {
            year: "numeric",
            month: "short",
            day: "numeric",
        }
    );
}


function isExpired(value) {
    if (!value) {
        return false;
    }

    const expiry =
        new Date(`${value}T00:00:00`);

    if (Number.isNaN(expiry.getTime())) {
        return false;
    }

    const today =
        new Date();

    today.setHours(
        0,
        0,
        0,
        0
    );

    return expiry < today;
}


function isExpiringSoon(
    value,
    days = 90
) {
    if (!value) {
        return false;
    }

    const expiry =
        new Date(`${value}T00:00:00`);

    if (Number.isNaN(expiry.getTime())) {
        return false;
    }

    const today =
        new Date();

    today.setHours(
        0,
        0,
        0,
        0
    );

    const difference =
        (expiry.getTime() -
            today.getTime()) /
        (1000 * 60 * 60 * 24);

    return (
        difference >= 0 &&
        difference <= days
    );
}


function safeString(value) {
    if (
        value === null ||
        value === undefined
    ) {
        return "";
    }

    return String(value);
}


// ============================================================
// MAIN PAGE
// ============================================================

export default function InventoryPage() {
    const [items, setItems] =
        useState([]);

    const [loading, setLoading] =
        useState(true);

    const [refreshing, setRefreshing] =
        useState(false);

    const [search, setSearch] =
        useState("");

    const [typeFilter, setTypeFilter] =
        useState("ALL");

    const [stockFilter, setStockFilter] =
        useState("ALL");

    const [showItemModal, setShowItemModal] =
        useState(false);

    const [showViewModal, setShowViewModal] =
        useState(false);

    const [showTransactionModal, setShowTransactionModal] =
        useState(false);

    const [selectedItem, setSelectedItem] =
        useState(null);

    const [editingItem, setEditingItem] =
        useState(null);

    const [transactionType, setTransactionType] =
        useState("STOCK_IN");


    // ========================================================
    // LOAD INVENTORY
    // ========================================================

    const fetchItems = useCallback(
        async (showRefresh = false) => {
            try {
                if (showRefresh) {
                    setRefreshing(true);
                } else {
                    setLoading(true);
                }

                const data =
                    await get_inventory();

                const inventory =
                    getInventoryArray(data);

                setItems(inventory);
            } catch (error) {
                console.error(
                    "Failed to fetch inventory:",
                    error
                );

                toast.error(
                    error?.message ||
                    "Failed to load inventory"
                );

                setItems([]);
            } finally {
                setLoading(false);
                setRefreshing(false);
            }
        },
        []
    );


    useEffect(() => {
        fetchItems();
    }, [fetchItems]);


    // ========================================================
    // CLIENT FILTER
    // ========================================================

    const filteredItems = useMemo(() => {
        const query =
            search
                .trim()
                .toLowerCase();

        return items.filter(
            (item) => {
                const name =
                    safeString(
                        item?.name
                    ).toLowerCase();

                const code =
                    safeString(
                        item?.item_code
                    ).toLowerCase();

                const supplier =
                    safeString(
                        item?.supplier
                    ).toLowerCase();

                const matchesSearch =
                    !query ||
                    name.includes(query) ||
                    code.includes(query) ||
                    supplier.includes(query);

                const matchesType =
                    typeFilter === "ALL" ||
                    item?.item_type ===
                    typeFilter;

                const quantity =
                    Number(
                        item?.quantity
                    ) || 0;

                const minimum =
                    Number(
                        item?.minimum_stock
                    ) || 0;

                let matchesStock = true;

                if (
                    stockFilter === "AVAILABLE"
                ) {
                    matchesStock =
                        quantity > minimum;
                }

                if (
                    stockFilter === "LOW"
                ) {
                    matchesStock =
                        quantity > 0 &&
                        quantity <= minimum;
                }

                if (
                    stockFilter === "OUT"
                ) {
                    matchesStock =
                        quantity === 0;
                }

                return (
                    matchesSearch &&
                    matchesType &&
                    matchesStock
                );
            }
        );
    }, [
        items,
        search,
        typeFilter,
        stockFilter,
    ]);


    // ========================================================
    // STATISTICS
    // ========================================================

    const totalItems =
        items.length;

    const lowStock =
        items.filter(
            (item) => {
                const quantity =
                    Number(
                        item?.quantity
                    ) || 0;

                const minimum =
                    Number(
                        item?.minimum_stock
                    ) || 0;

                return (
                    quantity > 0 &&
                    quantity <= minimum
                );
            }
        ).length;

    const outOfStock =
        items.filter(
            (item) =>
                Number(
                    item?.quantity
                ) === 0
        ).length;

    const totalValue =
        items.reduce(
            (sum, item) => {
                const quantity =
                    Number(
                        item?.quantity
                    ) || 0;

                const price =
                    Number(
                        item?.unit_price
                    ) || 0;

                return (
                    sum +
                    quantity * price
                );
            },
            0
        );


    // ========================================================
    // RESET FILTERS
    // ========================================================

    const resetFilters = () => {
        setSearch("");
        setTypeFilter("ALL");
        setStockFilter("ALL");
    };


    // ========================================================
    // DELETE
    // ========================================================

    const deleteItem = async (id) => {
        if (!id) {
            toast.error(
                "Invalid inventory item."
            );

            return;
        }

        const item =
            items.find(
                (entry) =>
                    entry.id === id
            );

        const confirmed =
            window.confirm(
                `Are you sure you want to delete "${item?.name || "this item"}"?`
            );

        if (!confirmed) {
            return;
        }

        try {
            await delete_inventory(id);

            setItems((previous) =>
                previous.filter(
                    (entry) =>
                        entry.id !== id
                )
            );

            if (
                selectedItem?.id === id
            ) {
                setSelectedItem(null);
                setShowViewModal(false);
                setShowTransactionModal(false);
            }

            toast.success(
                "Inventory item deleted"
            );
        } catch (error) {
            console.error(
                "Delete inventory error:",
                error
            );

            toast.error(
                error?.message ||
                "Failed to delete inventory item"
            );
        }
    };


    // ========================================================
    // OPEN EDIT
    // ========================================================

    const openEdit = (item) => {
        setEditingItem(
            normalizeItem(item)
        );

        setShowItemModal(true);
    };


    // ========================================================
    // OPEN VIEW
    // ========================================================

    const openView = (item) => {
        setSelectedItem(
            normalizeItem(item)
        );

        setShowViewModal(true);
    };


    // ========================================================
    // OPEN TRANSACTION
    // ========================================================

    const openTransaction = (
        item,
        type
    ) => {
        setSelectedItem(
            normalizeItem(item)
        );

        setTransactionType(type);

        setShowTransactionModal(true);
    };


    // ========================================================
    // SAVE ITEM
    // ========================================================

    const saveItem = async (form) => {
        try {
            const payload = {
                name: form.name.trim(),

                item_type:
                form.item_type,

                supplier:
                    form.supplier.trim(),

                description:
                    form.description.trim(),

                unit:
                form.unit,

                quantity:
                    Number(form.quantity),

                minimum_stock:
                    Number(
                        form.minimum_stock
                    ),

                unit_price:
                    Number(
                        form.unit_price
                    ),

                batch_number:
                    form.batch_number.trim(),

                expiry_date:
                    form.expiry_date ||
                    null,

                storage_location:
                    form.storage_location.trim(),
            };

            // Only send item_code when
            // editing an existing item.
            if (
                editingItem &&
                form.item_code.trim()
            ) {
                payload.item_code =
                    form.item_code.trim();
            }

            if (editingItem) {
                const response =
                    await put_inventory(
                        editingItem.id,
                        payload
                    );

                const updated =
                    normalizeItem(
                        response
                    );

                setItems((previous) =>
                    previous.map(
                        (item) =>
                            item.id ===
                            editingItem.id
                                ? updated
                                : item
                    )
                );

                toast.success(
                    "Inventory item updated"
                );
            } else {
                const response =
                    await post_inventory(
                        payload
                    );

                const created =
                    normalizeItem(
                        response
                    );

                if (!created) {
                    throw new Error(
                        "Server returned an invalid inventory item."
                    );
                }

                setItems((previous) => [
                    created,
                    ...previous,
                ]);

                toast.success(
                    "Inventory item added"
                );
            }

            setShowItemModal(false);
            setEditingItem(null);
        } catch (error) {
            console.error(
                "Save inventory error:",
                error
            );

            toast.error(
                error?.message ||
                "Failed to save inventory item"
            );
        }
    };


    // ========================================================
    // STOCK TRANSACTION
    // ========================================================

    const saveTransaction = async (
        quantity
    ) => {
        if (!selectedItem?.id) {
            toast.error(
                "No inventory item selected."
            );

            return;
        }

        const qty =
            Number(quantity);

        if (
            !Number.isInteger(qty) ||
            qty <= 0
        ) {
            toast.error(
                "Enter a valid whole quantity."
            );

            return;
        }

        const currentQuantity =
            Number(
                selectedItem.quantity
            ) || 0;

        let newQuantity;

        if (
            transactionType ===
            "STOCK_IN"
        ) {
            newQuantity =
                currentQuantity + qty;
        } else {
            if (
                qty > currentQuantity
            ) {
                toast.error(
                    "Stock out quantity cannot exceed current stock."
                );

                return;
            }

            newQuantity =
                currentQuantity - qty;
        }

        try {
            const payload = {
                name:
                selectedItem.name,

                item_code:
                selectedItem.item_code,

                item_type:
                selectedItem.item_type,

                supplier:
                selectedItem.supplier,

                description:
                selectedItem.description,

                unit:
                selectedItem.unit,

                quantity:
                newQuantity,

                minimum_stock:
                selectedItem.minimum_stock,

                unit_price:
                selectedItem.unit_price,

                batch_number:
                selectedItem.batch_number,

                expiry_date:
                    selectedItem.expiry_date ||
                    null,

                storage_location:
                selectedItem.storage_location,
            };

            const response =
                await put_inventory(
                    selectedItem.id,
                    payload
                );

            const updated =
                normalizeItem(
                    response
                );

            setItems((previous) =>
                previous.map(
                    (item) =>
                        item.id ===
                        selectedItem.id
                            ? updated
                            : item
                )
            );

            setSelectedItem(updated);

            toast.success(
                transactionType ===
                "STOCK_IN"
                    ? "Stock added successfully"
                    : "Stock removed successfully"
            );

            setShowTransactionModal(
                false
            );
        } catch (error) {
            console.error(
                "Stock transaction error:",
                error
            );

            toast.error(
                error?.message ||
                "Failed to update stock"
            );
        }
    };


    // ========================================================
    // RENDER
    // ========================================================

    return (
        <div className="min-h-screen bg-slate-50 px-4 py-6 text-slate-900 dark:bg-slate-950 dark:text-white sm:px-6 lg:px-8 mt-14">

            {/* HEADER */}

            <div className="mb-7 flex flex-col justify-between gap-4 lg:flex-row lg:items-center">

                <div className="flex items-center gap-3">

                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600 text-white shadow-lg shadow-blue-500/20">
                        <Package size={22} />
                    </div>

                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">
                            Inventory
                        </h1>

                        <p className="text-sm text-slate-500 dark:text-slate-400">
                            Manage medicines, medical supplies and equipment
                        </p>
                    </div>

                </div>

                <div className="flex gap-2">

                    <button
                        type="button"
                        onClick={() =>
                            fetchItems(true)
                        }
                        disabled={refreshing}
                        className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
                    >
                        <RefreshCw
                            size={17}
                            className={
                                refreshing
                                    ? "animate-spin"
                                    : ""
                            }
                        />

                        Refresh
                    </button>

                    <button
                        type="button"
                        onClick={() => {
                            setEditingItem(
                                null
                            );

                            setShowItemModal(
                                true
                            );
                        }}
                        className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700"
                    >
                        <Plus size={18} />

                        Add Inventory Item
                    </button>

                </div>

            </div>


            {/* STATISTICS */}

            <div className="mb-7 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">

                <StatCard
                    title="Total Items"
                    value={totalItems}
                    icon={
                        <Boxes size={21} />
                    }
                    description="Inventory products"
                />

                <StatCard
                    title="Inventory Value"
                    value={formatCurrency(
                        totalValue
                    )}
                    icon={
                        <DollarSign
                            size={21}
                        />
                    }
                    description="Current stock value"
                />

                <StatCard
                    title="Low Stock"
                    value={lowStock}
                    icon={
                        <AlertTriangle
                            size={21}
                        />
                    }
                    description="Needs restocking"
                    danger
                />

                <StatCard
                    title="Out of Stock"
                    value={outOfStock}
                    icon={
                        <TrendingDown
                            size={21}
                        />
                    }
                    description="Currently unavailable"
                    danger
                />

            </div>


            {/* FILTERS */}

            <div className="mb-5 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">

                <div className="flex flex-col gap-3 xl:flex-row">

                    <div className="relative flex-1">

                        <Search
                            size={18}
                            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                        />

                        <input
                            type="text"
                            value={search}
                            onChange={(event) =>
                                setSearch(
                                    event.target.value
                                )
                            }
                            placeholder="Search item name, code or supplier..."
                            className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-11 pr-4 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 dark:border-slate-700 dark:bg-slate-800"
                        />

                    </div>


                    <select
                        value={typeFilter}
                        onChange={(event) =>
                            setTypeFilter(
                                event.target.value
                            )
                        }
                        className="h-11 rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm outline-none focus:border-blue-500 dark:border-slate-700 dark:bg-slate-800"
                    >
                        <option value="ALL">
                            All Types
                        </option>

                        {Object.entries(
                            ITEM_TYPES
                        ).map(
                            ([
                                 value,
                                 label,
                             ]) => (
                                <option
                                    key={
                                        value
                                    }
                                    value={
                                        value
                                    }
                                >
                                    {label}
                                </option>
                            )
                        )}
                    </select>


                    <select
                        value={stockFilter}
                        onChange={(event) =>
                            setStockFilter(
                                event.target.value
                            )
                        }
                        className="h-11 rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm outline-none focus:border-blue-500 dark:border-slate-700 dark:bg-slate-800"
                    >
                        <option value="ALL">
                            All Stock
                        </option>

                        <option value="AVAILABLE">
                            In Stock
                        </option>

                        <option value="LOW">
                            Low Stock
                        </option>

                        <option value="OUT">
                            Out of Stock
                        </option>
                    </select>


                    <button
                        type="button"
                        onClick={
                            resetFilters
                        }
                        className="flex h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 text-sm font-medium text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
                    >
                        <RefreshCw
                            size={16}
                        />

                        Reset
                    </button>

                </div>

            </div>


            {/* TABLE */}

            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">

                <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4 dark:border-slate-800">

                    <div>
                        <h2 className="font-semibold">
                            Inventory Items
                        </h2>

                        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                            Showing{" "}
                            {
                                filteredItems.length
                            }{" "}
                            of{" "}
                            {items.length}{" "}
                            items
                        </p>
                    </div>

                    <div className="flex items-center gap-2 text-xs text-slate-500">
                        <Filter
                            size={15}
                        />

                        Filtered results
                    </div>

                </div>


                <div className="overflow-x-auto">

                    <table className="w-full min-w-[1100px] text-left">

                        <thead>

                        <tr className="border-b border-slate-200 bg-slate-50 text-xs uppercase tracking-wide text-slate-500 dark:border-slate-800 dark:bg-slate-800/50 dark:text-slate-400">

                            <th className="px-5 py-4">
                                Item
                            </th>

                            <th className="px-5 py-4">
                                Type
                            </th>

                            <th className="px-5 py-4">
                                Supplier
                            </th>

                            <th className="px-5 py-4">
                                Stock
                            </th>

                            <th className="px-5 py-4">
                                Unit Price
                            </th>

                            <th className="px-5 py-4">
                                Expiry
                            </th>

                            <th className="px-5 py-4 text-right">
                                Actions
                            </th>

                        </tr>

                        </thead>


                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">

                        {loading ? (

                            <LoadingRow />

                        ) : (

                            filteredItems.map(
                                (item) => {

                                    const stock =
                                        getStockStatus(
                                            item
                                        );

                                    const expired =
                                        isExpired(
                                            item.expiry_date
                                        );

                                    const expiring =
                                        isExpiringSoon(
                                            item.expiry_date
                                        );

                                    return (
                                        <tr
                                            key={
                                                item.id
                                            }
                                            className="transition hover:bg-slate-50 dark:hover:bg-slate-800/40"
                                        >

                                            {/* ITEM */}

                                            <td className="px-5 py-4">

                                                <div className="flex items-center gap-3">

                                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400">
                                                        <Package
                                                            size={
                                                                19
                                                            }
                                                        />
                                                    </div>

                                                    <div className="min-w-0">

                                                        <p className="truncate font-semibold">
                                                            {
                                                                item.name ||
                                                                "Unnamed Item"
                                                            }
                                                        </p>

                                                        <p className="mt-0.5 text-xs text-slate-500">
                                                            {item.item_code ||
                                                                "Code generated by server"}
                                                        </p>

                                                    </div>

                                                </div>

                                            </td>


                                            {/* TYPE */}

                                            <td className="px-5 py-4">

                                                    <span className="rounded-lg bg-slate-100 px-2.5 py-1.5 text-xs font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                                                        {
                                                            ITEM_TYPES[
                                                                item.item_type
                                                                ] ||
                                                            item.item_type ||
                                                            "Unknown"
                                                        }
                                                    </span>

                                            </td>


                                            {/* SUPPLIER */}

                                            <td className="px-5 py-4">

                                                <div className="flex items-center gap-2 text-sm">

                                                    <Truck
                                                        size={
                                                            15
                                                        }
                                                        className="text-slate-400"
                                                    />

                                                    <span>
                                                            {
                                                                item.supplier ||
                                                                "No supplier"
                                                            }
                                                        </span>

                                                </div>

                                            </td>


                                            {/* STOCK */}

                                            <td className="px-5 py-4">

                                                <div className="flex flex-col gap-1.5">

                                                    <div className="flex items-center gap-2">

                                                            <span className="font-semibold">
                                                                {Number(
                                                                    item.quantity
                                                                ).toLocaleString()}
                                                            </span>

                                                        <span className="text-xs text-slate-400">
                                                                {
                                                                    UNITS[
                                                                        item.unit
                                                                        ] ||
                                                                    item.unit
                                                                }
                                                            </span>

                                                    </div>

                                                    <span
                                                        className={`w-fit rounded-md px-2 py-1 text-[11px] font-semibold ${stock.className}`}
                                                    >
                                                            {
                                                                stock.label
                                                            }
                                                        </span>

                                                </div>

                                            </td>


                                            {/* PRICE */}

                                            <td className="px-5 py-4">

                                                    <span className="text-sm font-medium">
                                                        {formatCurrency(
                                                            item.unit_price
                                                        )}
                                                    </span>

                                            </td>


                                            {/* EXPIRY */}

                                            <td className="px-5 py-4">

                                                <div
                                                    className={`flex items-center gap-2 text-sm ${
                                                        expired
                                                            ? "font-semibold text-red-600 dark:text-red-400"
                                                            : expiring
                                                                ? "font-semibold text-amber-600 dark:text-amber-400"
                                                                : "text-slate-600 dark:text-slate-300"
                                                    }`}
                                                >

                                                    <CalendarDays
                                                        size={
                                                            15
                                                        }
                                                    />

                                                    {formatDate(
                                                        item.expiry_date
                                                    )}

                                                </div>

                                                {expired && (
                                                    <p className="mt-1 text-[11px] text-red-600">
                                                        Expired
                                                    </p>
                                                )}

                                                {!expired &&
                                                    expiring && (
                                                        <p className="mt-1 text-[11px] text-amber-600">
                                                            Expiring soon
                                                        </p>
                                                    )}

                                            </td>


                                            {/* ACTIONS */}

                                            <td className="px-5 py-4">

                                                <div className="flex justify-end gap-1.5">

                                                    <ActionButton
                                                        title="View"
                                                        onClick={() =>
                                                            openView(
                                                                item
                                                            )
                                                        }
                                                    >
                                                        <Eye
                                                            size={
                                                                16
                                                            }
                                                        />
                                                    </ActionButton>


                                                    <ActionButton
                                                        title="Stock In"
                                                        onClick={() =>
                                                            openTransaction(
                                                                item,
                                                                "STOCK_IN"
                                                            )
                                                        }
                                                    >
                                                        <ArrowDownToLine
                                                            size={
                                                                16
                                                            }
                                                        />
                                                    </ActionButton>


                                                    <ActionButton
                                                        title="Stock Out"
                                                        onClick={() =>
                                                            openTransaction(
                                                                item,
                                                                "STOCK_OUT"
                                                            )
                                                        }
                                                    >
                                                        <ArrowUpFromLine
                                                            size={
                                                                16
                                                            }
                                                        />
                                                    </ActionButton>


                                                    <ActionButton
                                                        title="Edit"
                                                        onClick={() =>
                                                            openEdit(
                                                                item
                                                            )
                                                        }
                                                    >
                                                        <Pencil
                                                            size={
                                                                16
                                                            }
                                                        />
                                                    </ActionButton>


                                                    <ActionButton
                                                        danger
                                                        title="Delete"
                                                        onClick={() =>
                                                            deleteItem(
                                                                item.id
                                                            )
                                                        }
                                                    >
                                                        <Trash2
                                                            size={
                                                                16
                                                            }
                                                        />
                                                    </ActionButton>

                                                </div>

                                            </td>

                                        </tr>
                                    );
                                }
                            )

                        )}


                        {!loading &&
                            filteredItems.length ===
                            0 && (
                                <EmptyRow />
                            )}

                        </tbody>

                    </table>

                </div>

            </div>


            {/* ADD / EDIT MODAL */}

            {showItemModal && (
                <ItemModal
                    item={
                        editingItem
                    }
                    onClose={() => {
                        setShowItemModal(
                            false
                        );

                        setEditingItem(
                            null
                        );
                    }}
                    onSave={
                        saveItem
                    }
                />
            )}


            {/* VIEW MODAL */}

            {showViewModal &&
                selectedItem && (
                    <ViewItemModal
                        item={
                            selectedItem
                        }
                        onClose={() => {
                            setShowViewModal(
                                false
                            );

                            setSelectedItem(
                                null
                            );
                        }}
                    />
                )}


            {/* TRANSACTION MODAL */}

            {showTransactionModal &&
                selectedItem && (
                    <TransactionModal
                        item={
                            selectedItem
                        }
                        type={
                            transactionType
                        }
                        onClose={() => {
                            setShowTransactionModal(
                                false
                            );

                            setSelectedItem(
                                null
                            );
                        }}
                        onSave={
                            saveTransaction
                        }
                    />
                )}

        </div>
    );
}


// ============================================================
// LOADING ROW
// ============================================================

function LoadingRow() {
    return (
        <tr>
            <td
                colSpan={7}
                className="px-5 py-16 text-center"
            >
                <div className="flex flex-col items-center gap-3">

                    <RefreshCw
                        size={25}
                        className="animate-spin text-blue-600"
                    />

                    <p className="text-sm text-slate-500">
                        Loading inventory...
                    </p>

                </div>
            </td>
        </tr>
    );
}


// ============================================================
// EMPTY ROW
// ============================================================

function EmptyRow() {
    return (
        <tr>
            <td
                colSpan={7}
                className="px-5 py-16 text-center"
            >
                <div className="mx-auto flex max-w-sm flex-col items-center">

                    <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400 dark:bg-slate-800">
                        <Package
                            size={25}
                        />
                    </div>

                    <h3 className="font-semibold">
                        No inventory items found
                    </h3>

                    <p className="mt-1 text-sm text-slate-500">
                        Try changing your search or filters.
                    </p>

                </div>
            </td>
        </tr>
    );
}


// ============================================================
// STAT CARD
// ============================================================

function StatCard({
                      title,
                      value,
                      icon,
                      description,
                      danger = false,
                  }) {
    return (
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">

            <div className="flex items-start justify-between">

                <div>

                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                        {title}
                    </p>

                    <p
                        className={`mt-2 text-2xl font-bold ${
                            danger
                                ? "text-amber-600 dark:text-amber-400"
                                : ""
                        }`}
                    >
                        {value}
                    </p>

                    <p className="mt-1 text-xs text-slate-400">
                        {description}
                    </p>

                </div>

                <div
                    className={`flex h-10 w-10 items-center justify-center rounded-xl ${
                        danger
                            ? "bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400"
                            : "bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400"
                    }`}
                >
                    {icon}
                </div>

            </div>

        </div>
    );
}


// ============================================================
// ACTION BUTTON
// ============================================================

function ActionButton({
                          children,
                          onClick,
                          title,
                          danger = false,
                      }) {
    return (
        <button
            type="button"
            title={title}
            aria-label={title}
            onClick={onClick}
            className={`flex h-8 w-8 items-center justify-center rounded-lg transition ${
                danger
                    ? "text-slate-400 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-500/10"
                    : "text-slate-400 hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-blue-500/10"
            }`}
        >
            {children}
        </button>
    );
}


// ============================================================
// ITEM MODAL
// ============================================================

function ItemModal({
                       item,
                       onClose,
                       onSave,
                   }) {
    const [form, setForm] =
        useState({
            item_code:
                item?.item_code || "",

            name:
                item?.name || "",

            item_type:
                item?.item_type ||
                "MEDICINE",

            supplier:
                item?.supplier || "",

            description:
                item?.description || "",

            unit:
                item?.unit ||
                "PIECE",

            quantity:
                Number(
                    item?.quantity
                ) || 0,

            minimum_stock:
                Number(
                    item?.minimum_stock
                ) || 10,

            unit_price:
                Number(
                    item?.unit_price
                ) || 0,

            batch_number:
                item?.batch_number ||
                "",

            expiry_date:
                item?.expiry_date ||
                "",

            storage_location:
                item?.storage_location ||
                "",
        });

    const [saving, setSaving] =
        useState(false);


    useEffect(() => {
        const handleKeyDown =
            (event) => {
                if (
                    event.key ===
                    "Escape"
                ) {
                    onClose();
                }
            };

        window.addEventListener(
            "keydown",
            handleKeyDown
        );

        return () =>
            window.removeEventListener(
                "keydown",
                handleKeyDown
            );
    }, [onClose]);


    const update = (
        field,
        value
    ) => {
        setForm(
            (previous) => ({
                ...previous,
                [field]: value,
            })
        );
    };


    const submit = async (
        event
    ) => {
        event.preventDefault();

        const name =
            form.name.trim();

        if (!name) {
            toast.error(
                "Item name is required."
            );

            return;
        }

        const quantity =
            Number(
                form.quantity
            );

        const minimumStock =
            Number(
                form.minimum_stock
            );

        const unitPrice =
            Number(
                form.unit_price
            );

        if (
            !Number.isInteger(
                quantity
            ) ||
            quantity < 0
        ) {
            toast.error(
                "Quantity must be a valid whole number."
            );

            return;
        }

        if (
            !Number.isInteger(
                minimumStock
            ) ||
            minimumStock < 0
        ) {
            toast.error(
                "Minimum stock must be a valid whole number."
            );

            return;
        }

        if (
            Number.isNaN(
                unitPrice
            ) ||
            unitPrice < 0
        ) {
            toast.error(
                "Unit price cannot be negative."
            );

            return;
        }

        try {
            setSaving(true);

            await onSave({
                ...form,

                name,

                item_code:
                    form.item_code.trim(),

                supplier:
                    form.supplier.trim(),

                description:
                    form.description.trim(),

                batch_number:
                    form.batch_number.trim(),

                storage_location:
                    form.storage_location.trim(),

                quantity,

                minimum_stock:
                minimumStock,

                unit_price:
                unitPrice,

                expiry_date:
                    form.expiry_date ||
                    null,
            });
        } finally {
            setSaving(false);
        }
    };


    return (
        <Modal
            title={
                item
                    ? "Edit Inventory Item"
                    : "Add Inventory Item"
            }
            onClose={onClose}
            wide
        >

            <form
                onSubmit={submit}
                className="space-y-6"
            >

                {/* BASIC INFORMATION */}

                <FormSection title="Basic Information">

                    <div className="grid gap-4 md:grid-cols-2">

                        <Input
                            label="Item Name"
                            value={
                                form.name
                            }
                            onChange={(
                                event
                            ) =>
                                update(
                                    "name",
                                    event
                                        .target
                                        .value
                                )
                            }
                            required
                            autoFocus
                        />


                        <Input
                            label="Item Code"
                            value={
                                form.item_code
                            }
                            onChange={(
                                event
                            ) =>
                                update(
                                    "item_code",
                                    event
                                        .target
                                        .value
                                )
                            }
                            placeholder={
                                item
                                    ? "Existing item code"
                                    : "Leave empty to auto-generate"
                            }
                        />


                        <Select
                            label="Item Type"
                            value={
                                form.item_type
                            }
                            onChange={(
                                event
                            ) =>
                                update(
                                    "item_type",
                                    event
                                        .target
                                        .value
                                )
                            }
                        >
                            {Object.entries(
                                ITEM_TYPES
                            ).map(
                                ([
                                     value,
                                     label,
                                 ]) => (
                                    <option
                                        key={
                                            value
                                        }
                                        value={
                                            value
                                        }
                                    >
                                        {
                                            label
                                        }
                                    </option>
                                )
                            )}
                        </Select>


                        <Input
                            label="Supplier"
                            value={
                                form.supplier
                            }
                            onChange={(
                                event
                            ) =>
                                update(
                                    "supplier",
                                    event
                                        .target
                                        .value
                                )
                            }
                            placeholder="Supplier or company name"
                        />

                    </div>

                </FormSection>


                {/* STORAGE */}

                <FormSection title="Storage & Batch">

                    <div className="grid gap-4 md:grid-cols-3">

                        <Input
                            label="Storage Location"
                            value={
                                form.storage_location
                            }
                            onChange={(
                                event
                            ) =>
                                update(
                                    "storage_location",
                                    event
                                        .target
                                        .value
                                )
                            }
                            placeholder="e.g. Pharmacy A"
                        />


                        <Input
                            label="Batch Number"
                            value={
                                form.batch_number
                            }
                            onChange={(
                                event
                            ) =>
                                update(
                                    "batch_number",
                                    event
                                        .target
                                        .value
                                )
                            }
                        />


                        <Input
                            label="Expiry Date"
                            type="date"
                            value={
                                form.expiry_date
                            }
                            onChange={(
                                event
                            ) =>
                                update(
                                    "expiry_date",
                                    event
                                        .target
                                        .value
                                )
                            }
                        />

                    </div>

                </FormSection>


                {/* STOCK */}

                <FormSection title="Stock Information">

                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

                        <Select
                            label="Unit"
                            value={
                                form.unit
                            }
                            onChange={(
                                event
                            ) =>
                                update(
                                    "unit",
                                    event
                                        .target
                                        .value
                                )
                            }
                        >
                            {Object.entries(
                                UNITS
                            ).map(
                                ([
                                     value,
                                     label,
                                 ]) => (
                                    <option
                                        key={
                                            value
                                        }
                                        value={
                                            value
                                        }
                                    >
                                        {
                                            label
                                        }
                                    </option>
                                )
                            )}
                        </Select>


                        <Input
                            label="Quantity"
                            type="number"
                            min="0"
                            step="1"
                            value={
                                form.quantity
                            }
                            onChange={(
                                event
                            ) =>
                                update(
                                    "quantity",
                                    event
                                        .target
                                        .value
                                )
                            }
                        />


                        <Input
                            label="Minimum Stock"
                            type="number"
                            min="0"
                            step="1"
                            value={
                                form.minimum_stock
                            }
                            onChange={(
                                event
                            ) =>
                                update(
                                    "minimum_stock",
                                    event
                                        .target
                                        .value
                                )
                            }
                        />


                        <Input
                            label="Unit Price"
                            type="number"
                            min="0"
                            step="0.01"
                            value={
                                form.unit_price
                            }
                            onChange={(
                                event
                            ) =>
                                update(
                                    "unit_price",
                                    event
                                        .target
                                        .value
                                )
                            }
                        />

                    </div>

                </FormSection>


                {/* DESCRIPTION */}

                <FormSection title="Description">

                    <textarea
                        rows={4}
                        value={
                            form.description
                        }
                        onChange={(
                            event
                        ) =>
                            update(
                                "description",
                                event
                                    .target
                                    .value
                            )
                        }
                        placeholder="Enter item description..."
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 dark:border-slate-700 dark:bg-slate-800"
                    />

                </FormSection>


                {/* ACTIONS */}

                <div className="flex justify-end gap-3 border-t border-slate-200 pt-5 dark:border-slate-800">

                    <button
                        type="button"
                        onClick={
                            onClose
                        }
                        disabled={
                            saving
                        }
                        className="rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-medium transition hover:bg-slate-50 disabled:opacity-50 dark:border-slate-700 dark:hover:bg-slate-800"
                    >
                        Cancel
                    </button>


                    <button
                        type="submit"
                        disabled={
                            saving
                        }
                        className="rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        {saving
                            ? "Saving..."
                            : item
                                ? "Update Item"
                                : "Add Item"}
                    </button>

                </div>

            </form>

        </Modal>
    );
}


// ============================================================
// VIEW MODAL
// ============================================================

function ViewItemModal({
                           item,
                           onClose,
                       }) {
    const stock =
        getStockStatus(item);

    const expired =
        isExpired(
            item.expiry_date
        );

    const expiring =
        isExpiringSoon(
            item.expiry_date
        );

    const totalValue =
        (Number(
            item.quantity
        ) || 0) *
        (Number(
            item.unit_price
        ) || 0);


    return (
        <Modal
            title="Inventory Item"
            onClose={onClose}
        >

            <div className="space-y-5">

                {/* HEADER */}

                <div className="flex items-center gap-4 rounded-2xl bg-slate-50 p-4 dark:bg-slate-800/60">

                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-blue-600 text-white">
                        <Package
                            size={27}
                        />
                    </div>

                    <div className="min-w-0 flex-1">

                        <h3 className="truncate font-bold">
                            {item.name ||
                                "Unnamed Item"}
                        </h3>

                        <p className="text-sm text-slate-500">
                            {item.item_code ||
                                "No item code"}
                        </p>

                    </div>

                    <span
                        className={`shrink-0 rounded-lg px-3 py-1.5 text-xs font-semibold ${stock.className}`}
                    >
                        {
                            stock.label
                        }
                    </span>

                </div>


                {/* INFORMATION */}

                <div className="grid gap-3 sm:grid-cols-2">

                    <Info
                        icon={
                            <Tag
                                size={16}
                            />
                        }
                        label="Item Type"
                        value={
                            ITEM_TYPES[
                                item.item_type
                                ] ||
                            item.item_type ||
                            "N/A"
                        }
                    />


                    <Info
                        icon={
                            <Truck
                                size={16}
                            />
                        }
                        label="Supplier"
                        value={
                            item.supplier ||
                            "No supplier"
                        }
                    />


                    <Info
                        icon={
                            <MapPin
                                size={16}
                            />
                        }
                        label="Storage"
                        value={
                            item.storage_location ||
                            "N/A"
                        }
                    />


                    <Info
                        icon={
                            <Package
                                size={16}
                            />
                        }
                        label="Quantity"
                        value={`${Number(
                            item.quantity
                        ) || 0} ${
                            UNITS[
                                item.unit
                                ] ||
                            item.unit ||
                            ""
                        }`}
                    />


                    <Info
                        icon={
                            <DollarSign
                                size={16}
                            />
                        }
                        label="Unit Price"
                        value={formatCurrency(
                            item.unit_price
                        )}
                    />


                    <Info
                        icon={
                            <Activity
                                size={16}
                            />
                        }
                        label="Minimum Stock"
                        value={`${Number(
                            item.minimum_stock
                        ) || 0} ${
                            UNITS[
                                item.unit
                                ] ||
                            item.unit ||
                            ""
                        }`}
                    />


                    <Info
                        icon={
                            <CalendarDays
                                size={16}
                            />
                        }
                        label="Expiry Date"
                        value={
                            formatDate(
                                item.expiry_date
                            )
                        }
                    />


                    <Info
                        icon={
                            <Tag
                                size={16}
                            />
                        }
                        label="Batch Number"
                        value={
                            item.batch_number ||
                            "N/A"
                        }
                    />

                </div>


                {/* EXPIRY STATUS */}

                {expired && (
                    <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-700 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-400">
                        This inventory item has expired.
                    </div>
                )}

                {!expired &&
                    expiring && (
                        <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm font-medium text-amber-700 dark:border-amber-500/20 dark:bg-amber-500/10 dark:text-amber-400">
                            This item is expiring soon.
                        </div>
                    )}


                {/* DESCRIPTION */}

                {item.description && (
                    <div>

                        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
                            Description
                        </p>

                        <p className="rounded-xl bg-slate-50 p-4 text-sm leading-6 text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                            {
                                item.description
                            }
                        </p>

                    </div>
                )}


                {/* TOTAL VALUE */}

                <div className="rounded-xl border border-blue-100 bg-blue-50 p-4 dark:border-blue-500/20 dark:bg-blue-500/10">

                    <div className="flex items-center justify-between">

                        <span className="text-sm font-medium">
                            Total Stock Value
                        </span>

                        <span className="text-lg font-bold text-blue-600 dark:text-blue-400">
                            {formatCurrency(
                                totalValue
                            )}
                        </span>

                    </div>

                </div>

            </div>

        </Modal>
    );
}


// ============================================================
// TRANSACTION MODAL
// ============================================================

function TransactionModal({
                              item,
                              type,
                              onClose,
                              onSave,
                          }) {
    const [quantity, setQuantity] =
        useState("");

    const [saving, setSaving] =
        useState(false);

    const isStockIn =
        type === "STOCK_IN";


    useEffect(() => {
        const handleKeyDown =
            (event) => {
                if (
                    event.key ===
                    "Escape"
                ) {
                    onClose();
                }
            };

        window.addEventListener(
            "keydown",
            handleKeyDown
        );

        return () =>
            window.removeEventListener(
                "keydown",
                handleKeyDown
            );
    }, [onClose]);


    const submit = async (
        event
    ) => {
        event.preventDefault();

        const qty =
            Number(quantity);

        if (
            !Number.isInteger(
                qty
            ) ||
            qty <= 0
        ) {
            toast.error(
                "Enter a valid whole quantity."
            );

            return;
        }

        if (
            !isStockIn &&
            qty >
            (Number(
                item.quantity
            ) || 0)
        ) {
            toast.error(
                "Stock out quantity cannot exceed current stock."
            );

            return;
        }

        try {
            setSaving(true);

            await onSave(
                qty
            );
        } finally {
            setSaving(false);
        }
    };


    const currentStock =
        Number(
            item.quantity
        ) || 0;

    const requestedQuantity =
        Number(quantity) || 0;

    const resultingStock =
        isStockIn
            ? currentStock +
            requestedQuantity
            : Math.max(
                0,
                currentStock -
                requestedQuantity
            );


    return (
        <Modal
            title={
                isStockIn
                    ? "Stock In"
                    : "Stock Out"
            }
            onClose={onClose}
        >

            <form
                onSubmit={submit}
                className="space-y-5"
            >

                {/* ITEM */}

                <div className="rounded-xl bg-slate-50 p-4 dark:bg-slate-800">

                    <p className="text-xs text-slate-500">
                        Item
                    </p>

                    <p className="mt-1 font-semibold">
                        {
                            item.name
                        }
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                        Current stock:{" "}
                        {
                            currentStock
                        }{" "}
                        {
                            UNITS[
                                item.unit
                                ] ||
                            item.unit
                        }
                    </p>

                </div>


                {/* TRANSACTION TYPE */}

                <div
                    className={`flex items-center gap-3 rounded-xl p-4 ${
                        isStockIn
                            ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400"
                            : "bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-400"
                    }`}
                >

                    {isStockIn ? (
                        <ArrowDownToLine />
                    ) : (
                        <ArrowUpFromLine />
                    )}

                    <div>

                        <p className="font-semibold">
                            {isStockIn
                                ? "Add Stock"
                                : "Remove Stock"}
                        </p>

                        <p className="text-xs opacity-80">
                            Update the current inventory quantity
                        </p>

                    </div>

                </div>


                {/* QUANTITY */}

                <Input
                    label={`Quantity (${
                        UNITS[
                            item.unit
                            ] ||
                        item.unit
                    })`}
                    type="number"
                    min="1"
                    step="1"
                    value={
                        quantity
                    }
                    onChange={(
                        event
                    ) =>
                        setQuantity(
                            event
                                .target
                                .value
                        )
                    }
                    required
                    autoFocus
                />


                {/* PREVIEW */}

                <div className="rounded-xl border border-slate-200 p-4 dark:border-slate-800">

                    <div className="flex items-center justify-between text-sm">

                        <span className="text-slate-500">
                            Current stock
                        </span>

                        <span className="font-semibold">
                            {
                                currentStock
                            }
                        </span>

                    </div>

                    <div className="my-2 h-px bg-slate-200 dark:bg-slate-800" />

                    <div className="flex items-center justify-between text-sm">

                        <span className="text-slate-500">
                            {isStockIn
                                ? "Adding"
                                : "Removing"}
                        </span>

                        <span className="font-semibold">
                            {requestedQuantity}
                        </span>

                    </div>

                    <div className="my-2 h-px bg-slate-200 dark:bg-slate-800" />

                    <div className="flex items-center justify-between">

                        <span className="font-medium">
                            New stock
                        </span>

                        <span className="text-lg font-bold text-blue-600 dark:text-blue-400">
                            {
                                resultingStock
                            }
                        </span>

                    </div>

                </div>


                {/* ACTIONS */}

                <div className="flex justify-end gap-3 border-t border-slate-200 pt-5 dark:border-slate-800">

                    <button
                        type="button"
                        onClick={
                            onClose
                        }
                        disabled={
                            saving
                        }
                        className="rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-medium dark:border-slate-700"
                    >
                        Cancel
                    </button>

                    <button
                        type="submit"
                        disabled={
                            saving
                        }
                        className={`rounded-xl px-5 py-2.5 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50 ${
                            isStockIn
                                ? "bg-emerald-600 hover:bg-emerald-700"
                                : "bg-red-600 hover:bg-red-700"
                        }`}
                    >
                        {saving
                            ? "Saving..."
                            : isStockIn
                                ? "Add Stock"
                                : "Remove Stock"}
                    </button>

                </div>

            </form>

        </Modal>
    );
}


// ============================================================
// MODAL
// ============================================================

function Modal({
                   title,
                   children,
                   onClose,
                   wide = false,
               }) {
    useEffect(() => {
        const original =
            document.body.style
                .overflow;

        document.body.style.overflow =
            "hidden";

        return () => {
            document.body.style.overflow =
                original;
        };
    }, []);


    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm"
            onMouseDown={(
                event
            ) => {
                if (
                    event.target ===
                    event.currentTarget
                ) {
                    onClose();
                }
            }}
        >

            <div
                role="dialog"
                aria-modal="true"
                className={`max-h-[92vh] w-full overflow-y-auto rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-900 ${
                    wide
                        ? "max-w-4xl"
                        : "max-w-2xl"
                }`}
            >

                <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-200 bg-white px-6 py-4 dark:border-slate-800 dark:bg-slate-900">

                    <h2 className="font-bold">
                        {title}
                    </h2>

                    <button
                        type="button"
                        onClick={
                            onClose
                        }
                        className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-white"
                    >
                        <X
                            size={19}
                        />
                    </button>

                </div>

                <div className="p-6">
                    {children}
                </div>

            </div>

        </div>
    );
}


// ============================================================
// FORM SECTION
// ============================================================

function FormSection({
                         title,
                         children,
                     }) {
    return (
        <div>

            <h3 className="mb-3 text-sm font-semibold">
                {title}
            </h3>

            {children}

        </div>
    );
}


// ============================================================
// INPUT
// ============================================================

function Input({
                   label,
                   ...props
               }) {
    return (
        <div>

            <label className="mb-1.5 block text-sm font-medium">
                {label}
            </label>

            <input
                {...props}
                className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 dark:border-slate-700 dark:bg-slate-800"
            />

        </div>
    );
}


// ============================================================
// SELECT
// ============================================================

function Select({
                    label,
                    children,
                    ...props
                }) {
    return (
        <div>

            <label className="mb-1.5 block text-sm font-medium">
                {label}
            </label>

            <select
                {...props}
                className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm outline-none transition focus:border-blue-500 dark:border-slate-700 dark:bg-slate-800"
            >
                {children}
            </select>

        </div>
    );
}


// ============================================================
// INFO
// ============================================================

function Info({
                  icon,
                  label,
                  value,
              }) {
    return (
        <div className="rounded-xl border border-slate-200 p-4 dark:border-slate-800">

            <div className="flex items-center gap-2 text-xs text-slate-400">

                {icon}

                <span>
                    {label}
                </span>

            </div>

            <p className="mt-2 break-words text-sm font-semibold">
                {value || "N/A"}
            </p>

        </div>
    );
}