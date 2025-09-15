import axiosInstance from "../axiosInstance";

interface CanteenParams {
    start?: string;
    limit?: string;
    search?: string;
}

export const getAllCanteens = async (params: CanteenParams = {}) => {
    try {
        console.log("Making API call to:", `${axiosInstance.baseURL}/canteen/getAllCanteens`);
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

export { createCanteen };