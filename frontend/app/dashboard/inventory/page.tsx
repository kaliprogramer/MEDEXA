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
    TrendingUp,
    TrendingDown,
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

import { useMemo, useState } from "react";
import toast from "react-hot-toast";


// --------------------------------------------------
// DEMO DATA
// Replace this with your Django API data
// --------------------------------------------------

const initialItems = [
    {
        id: 1,
        name: "Paracetamol 500mg",
        item_code: "MED-PCM-500",
        item_type: "MEDICINE",
        category: "Pain Relief",
        supplier: "Nepal Pharma",
        description: "Paracetamol tablets for pain and fever.",
        unit: "TABLET",
        quantity: 850,
        minimum_stock: 200,
        unit_price: 2.5,
        batch_number: "PCM2026A01",
        expiry_date: "2027-06-15",
        storage_location: "Pharmacy Rack A1",
        is_active: true,
    },
    {
        id: 2,
        name: "Surgical Gloves",
        item_code: "SUP-GLV-001",
        item_type: "MEDICAL_SUPPLY",
        category: "Surgical Supplies",
        supplier: "MedSupply Nepal",
        description: "Sterile surgical gloves.",
        unit: "BOX",
        quantity: 12,
        minimum_stock: 20,
        unit_price: 850,
        batch_number: "GLV2026B22",
        expiry_date: "2028-02-20",
        storage_location: "Store Room B",
        is_active: true,
    },
    {
        id: 3,
        name: "Insulin Vial",
        item_code: "MED-INS-001",
        item_type: "MEDICINE",
        category: "Diabetes",
        supplier: "Himalayan Meds",
        description: "Insulin injection vial.",
        unit: "VIAL",
        quantity: 46,
        minimum_stock: 30,
        unit_price: 650,
        batch_number: "INS2026C09",
        expiry_date: "2026-12-10",
        storage_location: "Cold Storage 01",
        is_active: true,
    },
    {
        id: 4,
        name: "Disposable Syringe 5ml",
        item_code: "SUP-SYR-005",
        item_type: "MEDICAL_SUPPLY",
        category: "Injection Supplies",
        supplier: "MedSupply Nepal",
        description: "Disposable 5ml medical syringe.",
        unit: "PIECE",
        quantity: 1200,
        minimum_stock: 500,
        unit_price: 12,
        batch_number: "SYR2026D11",
        expiry_date: "2029-01-12",
        storage_location: "Store Room A",
        is_active: true,
    },
    {
        id: 5,
        name: "Digital Blood Pressure Monitor",
        item_code: "EQP-BPM-001",
        item_type: "EQUIPMENT",
        category: "Diagnostic Equipment",
        supplier: "Medical Tech Nepal",
        description: "Digital blood pressure monitoring device.",
        unit: "PIECE",
        quantity: 8,
        minimum_stock: 5,
        unit_price: 4500,
        batch_number: "",
        expiry_date: null,
        storage_location: "Equipment Room",
        is_active: true,
    },
];


// --------------------------------------------------
// Helpers
// --------------------------------------------------

const itemTypeLabels = {
    MEDICINE: "Medicine",
    MEDICAL_SUPPLY: "Medical Supply",
    EQUIPMENT: "Equipment",
    OTHER: "Other",
};

const unitLabels = {
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


function getStockStatus(item) {
    if (item.quantity === 0) {
        return {
            label: "Out of Stock",
            className:
                "bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400",
        };
    }

    if (item.quantity <= item.minimum_stock) {
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
    return `Rs. ${Number(value).toLocaleString("en-NP", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    })}`;
}


function formatDate(date) {
    if (!date) return "N/A";

    return new Date(date).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
    });
}


function isExpiringSoon(date) {
    if (!date) return false;

    const expiry = new Date(date);
    const today = new Date();

    const diff =
        (expiry.getTime() - today.getTime()) /
        (1000 * 60 * 60 * 24);

    return diff >= 0 && diff <= 90;
}


// --------------------------------------------------
// Main Component
// --------------------------------------------------

export default function InventoryPage() {
    const [items, setItems] = useState(initialItems);

    const [search, setSearch] = useState("");
    const [typeFilter, setTypeFilter] = useState("ALL");
    const [stockFilter, setStockFilter] = useState("ALL");

    const [showItemModal, setShowItemModal] = useState(false);
    const [showViewModal, setShowViewModal] = useState(false);
    const [showTransactionModal, setShowTransactionModal] = useState(false);

    const [selectedItem, setSelectedItem] = useState(null);
    const [editingItem, setEditingItem] = useState(null);

    const [transactionType, setTransactionType] =
        useState("STOCK_IN");


    // --------------------------------------------------
    // Filter
    // --------------------------------------------------

    const filteredItems = useMemo(() => {
        return items.filter((item) => {
            const searchMatch =
                item.name
                    .toLowerCase()
                    .includes(search.toLowerCase()) ||
                item.item_code
                    .toLowerCase()
                    .includes(search.toLowerCase()) ||
                item.supplier
                    ?.toLowerCase()
                    .includes(search.toLowerCase());

            const typeMatch =
                typeFilter === "ALL" ||
                item.item_type === typeFilter;

            let stockMatch = true;

            if (stockFilter === "LOW") {
                stockMatch =
                    item.quantity <= item.minimum_stock &&
                    item.quantity > 0;
            }

            if (stockFilter === "OUT") {
                stockMatch = item.quantity === 0;
            }

            if (stockFilter === "AVAILABLE") {
                stockMatch = item.quantity > item.minimum_stock;
            }

            return searchMatch && typeMatch && stockMatch;
        });
    }, [items, search, typeFilter, stockFilter]);


    // --------------------------------------------------
    // Statistics
    // --------------------------------------------------

    const totalItems = items.length;

    const lowStock = items.filter(
        (item) =>
            item.quantity <= item.minimum_stock &&
            item.quantity > 0
    ).length;

    const outOfStock = items.filter(
        (item) => item.quantity === 0
    ).length;

    const totalValue = items.reduce(
        (sum, item) =>
            sum + item.quantity * Number(item.unit_price),
        0
    );


    // --------------------------------------------------
    // Delete
    // --------------------------------------------------

    const deleteItem = (id) => {
        const confirmed = window.confirm(
            "Are you sure you want to delete this inventory item?"
        );

        if (!confirmed) return;

        setItems((prev) =>
            prev.filter((item) => item.id !== id)
        );

        toast.success("Inventory item deleted");
    };


    // --------------------------------------------------
    // Open edit
    // --------------------------------------------------

    const openEdit = (item) => {
        setEditingItem(item);
        setShowItemModal(true);
    };


    // --------------------------------------------------
    // Open view
    // --------------------------------------------------

    const openView = (item) => {
        setSelectedItem(item);
        setShowViewModal(true);
    };


    // --------------------------------------------------
    // Open transaction
    // --------------------------------------------------

    const openTransaction = (item, type) => {
        setSelectedItem(item);
        setTransactionType(type);
        setShowTransactionModal(true);
    };


    return (
        <div className="min-h-screen bg-slate-50 px-4 py-6 text-slate-900 dark:bg-slate-950 dark:text-white sm:px-6 lg:px-8 mt-14">

            {/* ==========================================
                HEADER
            ========================================== */}

            <div className="mb-7 flex flex-col justify-between gap-4 lg:flex-row lg:items-center">

                <div>
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
                </div>


                <button
                    onClick={() => {
                        setEditingItem(null);
                        setShowItemModal(true);
                    }}
                    className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700"
                >
                    <Plus size={18} />
                    Add Inventory Item
                </button>

            </div>


            {/* ==========================================
                STAT CARDS
            ========================================== */}

            <div className="mb-7 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">

                {/* Total */}

                <StatCard
                    title="Total Items"
                    value={totalItems}
                    icon={<Boxes size={21} />}
                    description="Inventory products"
                />


                {/* Total Value */}

                <StatCard
                    title="Inventory Value"
                    value={formatCurrency(totalValue)}
                    icon={<DollarSign size={21} />}
                    description="Current stock value"
                />


                {/* Low */}

                <StatCard
                    title="Low Stock"
                    value={lowStock}
                    icon={<AlertTriangle size={21} />}
                    description="Needs restocking"
                    danger
                />


                {/* Out */}

                <StatCard
                    title="Out of Stock"
                    value={outOfStock}
                    icon={<TrendingDown size={21} />}
                    description="Currently unavailable"
                    danger
                />

            </div>


            {/* ==========================================
                SEARCH + FILTERS
            ========================================== */}

            <div className="mb-5 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">

                <div className="flex flex-col gap-3 xl:flex-row">

                    {/* Search */}

                    <div className="relative flex-1">

                        <Search
                            size={18}
                            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                        />

                        <input
                            type="text"
                            value={search}
                            onChange={(e) =>
                                setSearch(e.target.value)
                            }
                            placeholder="Search item name, code or supplier..."
                            className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-11 pr-4 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 dark:border-slate-700 dark:bg-slate-800"
                        />

                    </div>


                    {/* Type */}

                    <select
                        value={typeFilter}
                        onChange={(e) =>
                            setTypeFilter(e.target.value)
                        }
                        className="h-11 rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm outline-none focus:border-blue-500 dark:border-slate-700 dark:bg-slate-800"
                    >
                        <option value="ALL">
                            All Types
                        </option>

                        <option value="MEDICINE">
                            Medicine
                        </option>

                        <option value="MEDICAL_SUPPLY">
                            Medical Supply
                        </option>

                        <option value="EQUIPMENT">
                            Equipment
                        </option>

                        <option value="OTHER">
                            Other
                        </option>
                    </select>


                    {/* Stock */}

                    <select
                        value={stockFilter}
                        onChange={(e) =>
                            setStockFilter(e.target.value)
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
                        onClick={() => {
                            setSearch("");
                            setTypeFilter("ALL");
                            setStockFilter("ALL");
                        }}
                        className="flex h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 text-sm font-medium text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
                    >
                        <RefreshCw size={16} />
                        Reset
                    </button>

                </div>

            </div>


            {/* ==========================================
                INVENTORY TABLE
            ========================================== */}

            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">

                <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4 dark:border-slate-800">

                    <div>
                        <h2 className="font-semibold">
                            Inventory Items
                        </h2>

                        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                            Showing {filteredItems.length} of {items.length} items
                        </p>
                    </div>

                    <div className="flex items-center gap-2 text-xs text-slate-500">
                        <Filter size={15} />
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

                        {filteredItems.map((item) => {

                            const stock =
                                getStockStatus(item);

                            return (
                                <tr
                                    key={item.id}
                                    className="transition hover:bg-slate-50 dark:hover:bg-slate-800/40"
                                >

                                    {/* Item */}

                                    <td className="px-5 py-4">

                                        <div className="flex items-center gap-3">

                                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400">
                                                <Package size={19} />
                                            </div>

                                            <div>

                                                <p className="font-semibold">
                                                    {item.name}
                                                </p>

                                                <p className="mt-0.5 text-xs text-slate-500">
                                                    {item.item_code}
                                                </p>

                                            </div>

                                        </div>

                                    </td>


                                    {/* Type */}

                                    <td className="px-5 py-4">

                                            <span className="rounded-lg bg-slate-100 px-2.5 py-1.5 text-xs font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                                                {itemTypeLabels[item.item_type]}
                                            </span>

                                    </td>


                                    {/* Supplier */}

                                    <td className="px-5 py-4">

                                        <div className="flex items-center gap-2 text-sm">

                                            <Truck
                                                size={15}
                                                className="text-slate-400"
                                            />

                                            {item.supplier || "No supplier"}

                                        </div>

                                    </td>


                                    {/* Stock */}

                                    <td className="px-5 py-4">

                                        <div className="flex flex-col gap-1.5">

                                            <div className="flex items-center gap-2">

                                                    <span className="font-semibold">
                                                        {item.quantity.toLocaleString()}
                                                    </span>

                                                <span className="text-xs text-slate-400">
                                                        {unitLabels[item.unit]}
                                                    </span>

                                            </div>

                                            <span
                                                className={`w-fit rounded-md px-2 py-1 text-[11px] font-semibold ${stock.className}`}
                                            >
                                                    {stock.label}
                                                </span>

                                        </div>

                                    </td>


                                    {/* Price */}

                                    <td className="px-5 py-4">

                                            <span className="text-sm font-medium">
                                                {formatCurrency(item.unit_price)}
                                            </span>

                                    </td>


                                    {/* Expiry */}

                                    <td className="px-5 py-4">

                                        <div
                                            className={`flex items-center gap-2 text-sm ${
                                                isExpiringSoon(
                                                    item.expiry_date
                                                )
                                                    ? "font-semibold text-amber-600 dark:text-amber-400"
                                                    : "text-slate-600 dark:text-slate-300"
                                            }`}
                                        >

                                            <CalendarDays
                                                size={15}
                                            />

                                            {formatDate(
                                                item.expiry_date
                                            )}

                                        </div>

                                        {isExpiringSoon(
                                            item.expiry_date
                                        ) && (
                                            <p className="mt-1 text-[11px] text-amber-600">
                                                Expiring soon
                                            </p>
                                        )}

                                    </td>


                                    {/* Actions */}

                                    <td className="px-5 py-4">

                                        <div className="flex justify-end gap-1.5">

                                            <ActionButton
                                                title="View"
                                                onClick={() =>
                                                    openView(item)
                                                }
                                            >
                                                <Eye size={16} />
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
                                                    size={16}
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
                                                    size={16}
                                                />
                                            </ActionButton>


                                            <ActionButton
                                                title="Edit"
                                                onClick={() =>
                                                    openEdit(item)
                                                }
                                            >
                                                <Pencil size={16} />
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
                                                <Trash2 size={16} />
                                            </ActionButton>

                                        </div>

                                    </td>

                                </tr>
                            );
                        })}


                        {filteredItems.length === 0 && (
                            <tr>

                                <td
                                    colSpan="7"
                                    className="px-5 py-16 text-center"
                                >

                                    <div className="mx-auto flex max-w-sm flex-col items-center">

                                        <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400 dark:bg-slate-800">
                                            <Package size={25} />
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
                        )}

                        </tbody>

                    </table>

                </div>

            </div>


            {/* ==========================================
                ADD / EDIT MODAL
            ========================================== */}

            {showItemModal && (
                <ItemModal
                    item={editingItem}
                    onClose={() => {
                        setShowItemModal(false);
                        setEditingItem(null);
                    }}
                    onSave={(data) => {

                        if (editingItem) {

                            setItems((prev) =>
                                prev.map((item) =>
                                    item.id === editingItem.id
                                        ? {
                                            ...editingItem,
                                            ...data,
                                        }
                                        : item
                                )
                            );

                            toast.success(
                                "Inventory item updated"
                            );

                        } else {

                            setItems((prev) => [
                                {
                                    ...data,
                                    id:
                                        Math.max(
                                            0,
                                            ...prev.map(
                                                (i) => i.id
                                            )
                                        ) + 1,
                                    is_active: true,
                                },
                                ...prev,
                            ]);

                            toast.success(
                                "Inventory item added"
                            );
                        }

                        setShowItemModal(false);
                        setEditingItem(null);
                    }}
                />
            )}


            {/* ==========================================
                VIEW MODAL
            ========================================== */}

            {showViewModal && selectedItem && (
                <ViewItemModal
                    item={selectedItem}
                    onClose={() => {
                        setShowViewModal(false);
                        setSelectedItem(null);
                    }}
                />
            )}


            {/* ==========================================
                TRANSACTION MODAL
            ========================================== */}

            {showTransactionModal && selectedItem && (
                <TransactionModal
                    item={selectedItem}
                    type={transactionType}
                    onClose={() => {
                        setShowTransactionModal(false);
                        setSelectedItem(null);
                    }}
                    onSave={(quantity, reference, notes) => {

                        const qty = Number(quantity);

                        if (!qty || qty <= 0) {
                            toast.error(
                                "Enter a valid quantity"
                            );
                            return;
                        }

                        let newQuantity =
                            selectedItem.quantity;

                        if (
                            transactionType ===
                            "STOCK_IN"
                        ) {
                            newQuantity += qty;
                        } else {
                            newQuantity = Math.max(
                                0,
                                newQuantity - qty
                            );
                        }

                        setItems((prev) =>
                            prev.map((item) =>
                                item.id ===
                                selectedItem.id
                                    ? {
                                        ...item,
                                        quantity:
                                        newQuantity,
                                    }
                                    : item
                            )
                        );

                        toast.success(
                            "Stock transaction recorded"
                        );

                        setShowTransactionModal(
                            false
                        );
                        setSelectedItem(null);
                    }}
                />
            )}

        </div>
    );
}


// ==================================================
// STAT CARD
// ==================================================

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


// ==================================================
// ACTION BUTTON
// ==================================================

function ActionButton({
                          children,
                          onClick,
                          title,
                          danger = false,
                      }) {
    return (
        <button
            title={title}
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


// ==================================================
// ITEM MODAL
// ==================================================

function ItemModal({
                       item,
                       onClose,
                       onSave,
                   }) {
    const [form, setForm] = useState({
        name: item?.name || "",
        item_code: item?.item_code || "",
        item_type: item?.item_type || "MEDICINE",
        category: item?.category || "",
        supplier: item?.supplier || "",
        description: item?.description || "",
        unit: item?.unit || "PIECE",
        quantity: item?.quantity || 0,
        minimum_stock: item?.minimum_stock || 10,
        unit_price: item?.unit_price || 0,
        batch_number: item?.batch_number || "",
        expiry_date: item?.expiry_date || "",
        storage_location:
            item?.storage_location || "",
    });


    const update = (field, value) => {
        setForm((prev) => ({
            ...prev,
            [field]: value,
        }));
    };


    const submit = (e) => {
        e.preventDefault();

        if (!form.name || !form.item_code) {
            toast.error(
                "Name and item code are required"
            );
            return;
        }

        onSave(form);
    };


    return (
        <Modal
            title={item ? "Edit Inventory Item" : "Add Inventory Item"}
            onClose={onClose}
            wide
        >

            <form
                onSubmit={submit}
                className="space-y-5"
            >

                {/* Basic Information */}

                <FormSection title="Basic Information">

                    <div className="grid gap-4 md:grid-cols-2">

                        <Input
                            label="Item Name"
                            value={form.name}
                            onChange={(e) =>
                                update(
                                    "name",
                                    e.target.value
                                )
                            }
                            required
                        />

                        <Input
                            label="Item Code"
                            value={form.item_code}
                            onChange={(e) =>
                                update(
                                    "item_code",
                                    e.target.value
                                )
                            }
                            required
                        />

                        <Select
                            label="Item Type"
                            value={form.item_type}
                            onChange={(e) =>
                                update(
                                    "item_type",
                                    e.target.value
                                )
                            }
                        >

                            <option value="MEDICINE">
                                Medicine
                            </option>

                            <option value="MEDICAL_SUPPLY">
                                Medical Supply
                            </option>

                            <option value="EQUIPMENT">
                                Equipment
                            </option>

                            <option value="OTHER">
                                Other
                            </option>

                        </Select>


                        <Input
                            label="Category"
                            value={form.category}
                            onChange={(e) =>
                                update(
                                    "category",
                                    e.target.value
                                )
                            }
                        />

                    </div>

                </FormSection>


                {/* Supplier */}

                <FormSection title="Supplier & Storage">

                    <div className="grid gap-4 md:grid-cols-2">

                        <Input
                            label="Supplier"
                            value={form.supplier}
                            onChange={(e) =>
                                update(
                                    "supplier",
                                    e.target.value
                                )
                            }
                        />

                        <Input
                            label="Storage Location"
                            value={
                                form.storage_location
                            }
                            onChange={(e) =>
                                update(
                                    "storage_location",
                                    e.target.value
                                )
                            }
                        />

                        <Input
                            label="Batch Number"
                            value={
                                form.batch_number
                            }
                            onChange={(e) =>
                                update(
                                    "batch_number",
                                    e.target.value
                                )
                            }
                        />

                        <Input
                            label="Expiry Date"
                            type="date"
                            value={
                                form.expiry_date
                            }
                            onChange={(e) =>
                                update(
                                    "expiry_date",
                                    e.target.value
                                )
                            }
                        />

                    </div>

                </FormSection>


                {/* Stock */}

                <FormSection title="Stock Information">

                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

                        <Select
                            label="Unit"
                            value={form.unit}
                            onChange={(e) =>
                                update(
                                    "unit",
                                    e.target.value
                                )
                            }
                        >

                            <option value="PIECE">
                                Piece
                            </option>

                            <option value="BOX">
                                Box
                            </option>

                            <option value="PACK">
                                Pack
                            </option>

                            <option value="BOTTLE">
                                Bottle
                            </option>

                            <option value="STRIP">
                                Strip
                            </option>

                            <option value="VIAL">
                                Vial
                            </option>

                            <option value="TABLET">
                                Tablet
                            </option>

                            <option value="LITER">
                                Liter
                            </option>

                            <option value="KG">
                                Kilogram
                            </option>

                        </Select>


                        <Input
                            label="Quantity"
                            type="number"
                            min="0"
                            value={form.quantity}
                            onChange={(e) =>
                                update(
                                    "quantity",
                                    Number(
                                        e.target.value
                                    )
                                )
                            }
                        />


                        <Input
                            label="Minimum Stock"
                            type="number"
                            min="0"
                            value={
                                form.minimum_stock
                            }
                            onChange={(e) =>
                                update(
                                    "minimum_stock",
                                    Number(
                                        e.target.value
                                    )
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
                            onChange={(e) =>
                                update(
                                    "unit_price",
                                    Number(
                                        e.target.value
                                    )
                                )
                            }
                        />

                    </div>

                </FormSection>


                {/* Description */}

                <FormSection title="Description">

                    <textarea
                        rows="3"
                        value={form.description}
                        onChange={(e) =>
                            update(
                                "description",
                                e.target.value
                            )
                        }
                        placeholder="Enter item description..."
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-blue-500 dark:border-slate-700 dark:bg-slate-800"
                    />

                </FormSection>


                {/* Buttons */}

                <div className="flex justify-end gap-3 border-t border-slate-200 pt-5 dark:border-slate-800">

                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-medium dark:border-slate-700"
                    >
                        Cancel
                    </button>

                    <button
                        type="submit"
                        className="rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
                    >
                        {item ? "Update Item" : "Add Item"}
                    </button>

                </div>

            </form>

        </Modal>
    );
}


// ==================================================
// VIEW ITEM MODAL
// ==================================================

function ViewItemModal({
                           item,
                           onClose,
                       }) {
    const stock = getStockStatus(item);

    return (
        <Modal
            title="Inventory Item"
            onClose={onClose}
        >

            <div className="space-y-5">

                {/* Header */}

                <div className="flex items-center gap-4 rounded-2xl bg-slate-50 p-4 dark:bg-slate-800/60">

                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-600 text-white">
                        <Package size={27} />
                    </div>

                    <div className="min-w-0 flex-1">

                        <h3 className="font-bold">
                            {item.name}
                        </h3>

                        <p className="text-sm text-slate-500">
                            {item.item_code}
                        </p>

                    </div>

                    <span
                        className={`rounded-lg px-3 py-1.5 text-xs font-semibold ${stock.className}`}
                    >
                        {stock.label}
                    </span>

                </div>


                {/* Information */}

                <div className="grid gap-3 sm:grid-cols-2">

                    <Info
                        icon={<Tag size={16} />}
                        label="Item Type"
                        value={
                            itemTypeLabels[
                                item.item_type
                                ]
                        }
                    />

                    <Info
                        icon={<Boxes size={16} />}
                        label="Category"
                        value={
                            item.category || "N/A"
                        }
                    />

                    <Info
                        icon={<Truck size={16} />}
                        label="Supplier"
                        value={
                            item.supplier || "N/A"
                        }
                    />

                    <Info
                        icon={<MapPin size={16} />}
                        label="Storage"
                        value={
                            item.storage_location ||
                            "N/A"
                        }
                    />

                    <Info
                        icon={<Package size={16} />}
                        label="Quantity"
                        value={`${item.quantity} ${unitLabels[item.unit]}`}
                    />

                    <Info
                        icon={<DollarSign size={16} />}
                        label="Unit Price"
                        value={formatCurrency(
                            item.unit_price
                        )}
                    />

                    <Info
                        icon={<Activity size={16} />}
                        label="Minimum Stock"
                        value={`${item.minimum_stock} ${unitLabels[item.unit]}`}
                    />

                    <Info
                        icon={<CalendarDays size={16} />}
                        label="Expiry Date"
                        value={formatDate(
                            item.expiry_date
                        )}
                    />

                </div>


                {/* Batch */}

                {item.batch_number && (
                    <Info
                        icon={<Tag size={16} />}
                        label="Batch Number"
                        value={item.batch_number}
                    />
                )}


                {/* Description */}

                {item.description && (
                    <div>

                        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
                            Description
                        </p>

                        <p className="rounded-xl bg-slate-50 p-4 text-sm text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                            {item.description}
                        </p>

                    </div>
                )}


                {/* Total */}

                <div className="rounded-xl border border-blue-100 bg-blue-50 p-4 dark:border-blue-500/20 dark:bg-blue-500/10">

                    <div className="flex items-center justify-between">

                        <span className="text-sm font-medium">
                            Total Stock Value
                        </span>

                        <span className="text-lg font-bold text-blue-600 dark:text-blue-400">
                            {formatCurrency(
                                item.quantity *
                                Number(
                                    item.unit_price
                                )
                            )}
                        </span>

                    </div>

                </div>

            </div>

        </Modal>
    );
}


// ==================================================
// TRANSACTION MODAL
// ==================================================

function TransactionModal({
                              item,
                              type,
                              onClose,
                              onSave,
                          }) {
    const [quantity, setQuantity] =
        useState("");

    const [reference, setReference] =
        useState("");

    const [notes, setNotes] =
        useState("");


    const isStockIn =
        type === "STOCK_IN";


    const submit = (e) => {
        e.preventDefault();

        onSave(
            quantity,
            reference,
            notes
        );
    };


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

                <div className="rounded-xl bg-slate-50 p-4 dark:bg-slate-800">

                    <p className="text-xs text-slate-500">
                        Item
                    </p>

                    <p className="mt-1 font-semibold">
                        {item.name}
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                        Current stock:{" "}
                        {item.quantity}{" "}
                        {unitLabels[item.unit]}
                    </p>

                </div>


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
                            Record a new inventory transaction
                        </p>

                    </div>

                </div>


                <Input
                    label={`Quantity (${unitLabels[item.unit]})`}
                    type="number"
                    min="1"
                    value={quantity}
                    onChange={(e) =>
                        setQuantity(
                            e.target.value
                        )
                    }
                    required
                />


                <Input
                    label="Reference"
                    value={reference}
                    onChange={(e) =>
                        setReference(
                            e.target.value
                        )
                    }
                    placeholder="Purchase order, invoice, etc."
                />


                <div>

                    <label className="mb-1.5 block text-sm font-medium">
                        Notes
                    </label>

                    <textarea
                        rows="3"
                        value={notes}
                        onChange={(e) =>
                            setNotes(
                                e.target.value
                            )
                        }
                        placeholder="Optional notes..."
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-blue-500 dark:border-slate-700 dark:bg-slate-800"
                    />

                </div>


                <div className="flex justify-end gap-3 border-t border-slate-200 pt-5 dark:border-slate-800">

                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-medium dark:border-slate-700"
                    >
                        Cancel
                    </button>

                    <button
                        type="submit"
                        className={`rounded-xl px-5 py-2.5 text-sm font-semibold text-white ${
                            isStockIn
                                ? "bg-emerald-600 hover:bg-emerald-700"
                                : "bg-red-600 hover:bg-red-700"
                        }`}
                    >
                        Record Transaction
                    </button>

                </div>

            </form>

        </Modal>
    );
}


// ==================================================
// MODAL WRAPPER
// ==================================================

function Modal({
                   title,
                   children,
                   onClose,
                   wide = false,
               }) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm">

            <div
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
                        onClick={onClose}
                        className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-white"
                    >
                        <X size={19} />
                    </button>

                </div>

                <div className="p-6">
                    {children}
                </div>

            </div>

        </div>
    );
}


// ==================================================
// FORM SECTION
// ==================================================

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


// ==================================================
// INPUT
// ==================================================

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


// ==================================================
// SELECT
// ==================================================

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


// ==================================================
// INFO
// ==================================================

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

            <p className="mt-2 text-sm font-semibold">
                {value}
            </p>

        </div>
    );
}