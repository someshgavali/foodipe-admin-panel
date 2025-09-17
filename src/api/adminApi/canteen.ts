import axiosInstance from "../axiosInstance";

interface CanteenParams {
    start?: string;
    limit?: string;
    search?: string;
}

export const getAllCanteens = async (params: CanteenParams = {}) => {
    try {
        console.log("With params:", params);

        const response = await axiosInstance.get('/canteen/getAllCanteens');

        console.log("API Response:", response);
        return response.data;
    } catch (error) {
        console.error("getAllCanteens API Error:", error);
        throw error;
    }
};

// Alternative endpoints to try if the main one doesn't work
export const getAllCanteensAlternative = async (_params: CanteenParams = {}) => {
    try {
        // Try GET request instead of POST
        console.log("Trying GET request to:", `${axiosInstance.baseURL}/canteens`);
        const response = await axiosInstance.get('/canteens');
        console.log("GET API Response:", response);
        return response.data;
    } catch (error) {
        console.error("getAllCanteens GET Error:", error);
        throw error;
    }
};

export const getAllCanteensWithQuery = async (params: CanteenParams = {}) => {
    const { start = "0", limit = "10", search = "" } = params;

    try {
        // Try with query parameters
        const queryParams = new URLSearchParams({
            start,
            limit,
            search
        });

        console.log("Trying GET with query params:", `${axiosInstance.baseURL}/canteens?${queryParams}`);
        const response = await axiosInstance.get(`/canteens?${queryParams}`);
        console.log("GET with query API Response:", response);
        return response.data;
    } catch (error) {
        console.error("getAllCanteens with query Error:", error);
        throw error;
    }
};


const createCanteen = async (canteenData: any) => {
    const response = await axiosInstance.post('/canteen/createCanteen', canteenData);
    return response.data;
}

const getCategoryByCanteen = async (canteenId: any) => {
    const response = await axiosInstance.get(`/category/getCategoryByCanteen/${canteenId}`);
    return response.data;
}


// Subcategories by user
export const getCategoriesByCanteenId = async (canteenId: string) => {
    const response = await axiosInstance.get(`canteenCategories/getCategoriesByCanteen/${canteenId}`);
    return response.data;
}


export const getSubcategoriesByUserId = async (userId: string) => {
    const response = await axiosInstance.get(`/canteenSubCategories/getSubCategoriesByCanteen/${userId}`);
    return response.data;
}

export const createcategory = async (payload: any) => {
    const response = await axiosInstance.post("/canteenCategories/createCategoriesItem", payload);
    return response.data;
}

// export const updateCategoryById = async (categoryId, payload) => {
//     const response = await axiosInstance.post(
//         `/canteenCategories/createCategoriesItem/${categoryId}`,
//         payload
//     );
//     return response.data;
// };

export interface Canteen {
    id: number;
    name: string;
    location?: string;
    // add more fields from your backend response
}

export const getCanteensByCompanyId = async (companyId: number): Promise<Canteen[]> => {
    try {
        const storedAdmin = localStorage.getItem("admin_user");
        const token = storedAdmin ? JSON.parse(storedAdmin).token : null;

        const response = await axiosInstance.get(
            `/canteen/getCanteenByCompanyId/${companyId}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        return response.data;
    } catch (error) {
        console.error("Error fetching canteens by company ID:", error);
        throw error;
    }
};



interface UpdateCanteenPayload {
    canteen_name?: string;
    email?: string;
    password?: string;
    address?: string;
    slug?: string;
    // For any extra optional fields
}

export const updateCanteen = async (
    id: string,
    payload: UpdateCanteenPayload
) => {
    try {
        const response = await axiosInstance.put(
            `/canteen/updateCanteen/${id}`,
            payload
        );
        return response.data;
    } catch (error: any) {
        console.error('Error updating canteen:', error.response || error.message);
        throw error;
    }
};

export { createCanteen, getCategoryByCanteen };