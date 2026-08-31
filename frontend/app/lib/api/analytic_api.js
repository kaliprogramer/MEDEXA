import toast from "react-hot-toast";

const API_URL = process.env.NEXT_PUBLIC_DJANGO_API_URL;

export async function get_Totalpatients(page = 1) {
    try {
        const response = await fetch(
            `${API_URL}/patients/?page=${page}`,
            {
                method: "GET",
                credentials: "include",
            }
        );

        if (!response.ok) {
            toast.error("API problem while fetching patients");
            throw new Error(`Patient API failed: ${response.status}`);
        }

        const data = await response.json();

        return data.count;
    } catch (error) {
        console.error("get_Totalpatients error:", error);
        throw error;
    }
}




export async function get_Totaldoctors(page = 1) {
    const url = `${API_URL}/doctors/?page=${page}`;

    // First request
    let response = await fetch(url, {
        method: "GET",
        credentials: "include",
        headers: {
            Accept: "application/json",
        },
    });

    if (!response.ok) {
        toast.error("API problem while fetching patients");
        throw new Error(`Patient API failed: ${response.status}`);
    }
    // Request worked
    if (response.ok) {
        const data=await response.json();
        console.log(data.count)
        return data.count
    }
}






export async function get_OutOfStockTotal() {
    try {
        const response = await fetch(`${API_URL}/inventory/`, {
            method: "GET",
            credentials: "include",
        });

        if (!response.ok) {
            toast.error("API problem while fetching inventory");
            throw new Error(`Inventory API failed: ${response.status}`);
        }

        const data = await response.json();

        const outOfStockTotal = data.results.filter(
            (item) => item.quantity === 0
        ).length;

        return outOfStockTotal;
    } catch (error) {
        console.error("get_OutOfStockTotal error:", error);
        throw error;
    }
}


export async function get_StockTotal() {
    try {
        const response = await fetch(`${API_URL}/inventory/`, {
            method: "GET",
            credentials: "include",
        });

        if (!response.ok) {
            toast.error("API problem while fetching inventory");
            throw new Error(`Inventory API failed: ${response.status}`);
        }

        const data = await response.json();

        const StockTotal = data.count

        return StockTotal;
    } catch (error) {
        console.error("get_OutOfStockTotal error:", error);
        throw error;
    }
}

export async function get_patientAnalytics() {
    try {
        const response = await fetch(`${API_URL}/patients/monthlyanalytic/`, {
            method: "GET",
            credentials: "include",
        });

        if (!response.ok) {
            toast.error("API problem while fetching inventory");
            throw new Error(`Inventory API failed: ${response.status}`);
        }

        const monthlyanalytic = await response.json();

        console.log(monthlyanalytic);
        return monthlyanalytic;
    } catch (error) {
        console.error("get_OutOfStockTotal error:", error);
        throw error;
    }
}

export async function get_genderanalytic() {
    try {
        const response = await fetch(`${API_URL}/patients/genderanalytic/`, {
            method: "GET",
            credentials: "include",
        });

        if (!response.ok) {
            toast.error("API problem while fetching inventory");
            throw new Error(`Inventory API failed: ${response.status}`);
        }

        const genderanalytic = await response.json();

        console.log(genderanalytic);
        return genderanalytic;
    } catch (error) {
        console.error("get_genderanalytic error:", error);
        throw error;
    }
}


export async function get_stockanalytic() {
    try {
        const response = await fetch(
            `${API_URL}/inventory/stockanalytic/`,
            {
                method: "GET",
                credentials: "include",
            }
        );

        if (!response.ok) {
            toast.error("API problem while fetching inventory");
            throw new Error(`Inventory API failed: ${response.status}`);
        }

        const stockanalytic = await response.json();

        console.log(stockanalytic);

        return stockanalytic;
    } catch (error) {
        console.error("get_stockanalytic error:", error);
        throw error;
    }
}

export async function get_lowstock() {
    try {
        const response = await fetch(
            `${API_URL}/inventory/lowstock/`,
            {
                method: "GET",
                credentials: "include",
            });

        if (!response.ok) {
            toast.error("API problem while fetching inventory");
            throw new Error(`Inventory API failed: ${response.status}`);
        }

        const lowstock = await response.json();

        console.log(lowstock);

        return lowstock;
    } catch (error) {
        console.error("get_lowstock error:", error);
        throw error;
    }
}

export async function get_recentpatients() {
    try {
        const response = await fetch(
            `${API_URL}/patients/recentpatients/`,
            {
                method: "GET",
                credentials: "include",
            });

        if (!response.ok) {
            toast.error("API problem while fetching inventory");
            throw new Error(`Inventory API failed: ${response.status}`);
        }

        const recentpatients = await response.json();

        console.log(recentpatients);

        return recentpatients;
    } catch (error) {
        console.error("get_recentpatients error:", error);
        throw error;
    }
}


