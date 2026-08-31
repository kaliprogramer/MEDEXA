import toast from "react-hot-toast";
const apiUrl = process.env.NEXT_PUBLIC_DJANGO_API_URL;
export async function get_patients(page=1) {
    const response = await fetch(`${apiUrl}/patients/?page=${page}`, {
        method: 'GET',
        credentials: 'include',
    });
    if (!response.ok) {
        toast.error("Api problem in patient API to get data")
    }
    const data = response.json();
    console.log(data);
    return data;
};


export async function post_patients(patientData) {
    const response = await fetch(`${apiUrl}/patients/`, {
        method: "POST",
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(patientData),
    });

    const data = await response.json();

    if (!response.ok) {
        console.error("Patient API error:", data);

        toast.error("Failed to save patient");

        throw new Error("Failed to save patient");
    }

    toast.success("Patient saved successfully");

    return data;
}

export async function delete_patient(patientId) {
    const response = await fetch(`${apiUrl}/patients/${patientId}/`, {
        method: 'DELETE',
        credentials: 'include',
    })
    if (!response.ok) {
        toast.error("Failed to Delete patient");
        throw new Error("Failed to Delete patient");
    }

}

export  async function put_patient(patientId,patientData) {
    const response = await fetch(`${apiUrl}/patients/${patientId}/`, {
        method: 'PUT',
        credentials: 'include',
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(patientData),
    })
    if (!response.ok) {
        toast.error("Failed to Edit patient");
    }

    return response.json()
}