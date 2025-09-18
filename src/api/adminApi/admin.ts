import axiosInstance from "../axiosInstance";

interface LoginCredentials {
    email: string;
    password: string;
}

interface LoginResponse {
    message: string;
    user: {
        id: number;
        company_name: string;
        token: string;
        email: string;
        roleid: number;
        company_code: string;
        password: string;
        no_of_employee: string;
        no_of_restraunt: number;
        address: string;
        canteenid: number;
        createddate: string;
        updateddate: string;
        role: {
            id: number;
            name: string;
            permissions: Array<{
                id: number;
                serviceName: string;
                api_permissions: Array<{
                    id: number;
                    api: string;
                    methods: string[];
                    allowed: boolean;
                }>;
            }>;
        };
    };
}

// Admin API methods
export const adminLogin = async (email: string, password: string): Promise<LoginResponse> => {
    const response = await axiosInstance.post<LoginResponse>('adminUser/login', { email, password });
    return response.data;
};

interface UserParams {
    start?: string;
    limit?: string;
    search?: string;
    // Add other possible parameters as needed
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
    status?: string;
}

interface User {
    id: number;
    username: string;
    email: string;
    first_name: string;
    last_name: string;
    role_id: number;
    company_id: number;
    status: string;
    created_date: string;
    updated_date: string;
    // Add other user properties as needed
}

interface UserResponse {
    data: User[];
    total?: number;
    message?: string;
    success?: boolean;
}

export const getAllUsers = async (params: UserParams = {}): Promise<UserResponse> => {
    try {
        console.log("Making API call to getAllUsers with params:", params);

        const response = await axiosInstance.get('user/getAllUsers', {
            params: params
        });

        console.log("Users API Response:", response);
        return response.data;
    } catch (error) {
        console.error("getAllUsers API Error:", error);
        throw error;
    }
};