import axiosInstance from "../axiosInstance";

export interface CreateUserPayload {
    name: string;
    email: string;
    password: string;
    phonenumber: string;
    empid: string;
    companyid: string;
    address: string;
}
export interface UpdateUserPayload {
    name?: string;
    phonenumber?: string;
    address?: string;
}


export const getAllUsersByCompanyId = async () => {
    try {
        // Get stored admin_user from localStorage
        const storedUser = localStorage.getItem("admin_user");
        if (!storedUser) {
            throw new Error("No admin_user found in localStorage");
        }

        const adminUser = JSON.parse(storedUser);

        const companyId = adminUser.id;   // your company id
        const token = adminUser.token;    // jwt token

        // API call
        const response = await axiosInstance.get(
            `/user/getAllUserByCompanyId/${companyId}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`, // 🔹 attach token
                },
            }
        );

        return response.data;
    } catch (error: any) {
        console.error("Error fetching users:", error);
        throw error;
    }
};

export const createUser = async (data: CreateUserPayload) => {
    try {
        const storedAdmin = localStorage.getItem("admin_user");
        const token = storedAdmin ? JSON.parse(storedAdmin).token : null;

        const response = await axiosInstance.post(
            `/user/createUser`,
            data,
            {
                headers: {
                    Authorization: `Bearer ${token}`, // if your API requires token
                    "Content-Type": "application/json",
                },
            }
        );

        return response.data;
    } catch (error) {
        console.error("Error creating user:", error);
        throw error;
    }
};

export const updateUserProfile = async (userId: number, data: UpdateUserPayload) => {
    try {
        const storedAdmin = localStorage.getItem("admin_user");
        const token = storedAdmin ? JSON.parse(storedAdmin).token : null;

        const response = await axiosInstance.put(
            `/user/updateUserProfile/${userId}`,
            data,
            {
                headers: {
                    Authorization: `Bearer ${token}`, // attach token
                },
            }
        );

        return response.data;
    } catch (error) {
        console.error("Error updating user profile:", error);
        throw error;
    }
};