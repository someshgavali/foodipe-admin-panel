import axiosInstance from "../axiosInstance";

interface CompanyParams {
    start?: string;
    limit?: string;
    search?: string;
}

interface Company {
    id: number;
    company_name: string;
    company_code: string;
    email: string;
    address: string;
    no_of_employee: string;
    no_of_restraunt: number;
    createddate: string;
    updateddate: string;
}

interface CompanyResponse {
    data: Company[];
    message?: string;
}

export const getCompanies = async (params: CompanyParams = {}): Promise<CompanyResponse> => {
    try {
        const response = await axiosInstance.get('/company/getAllCompanies', {
            params: params
        });
        console.log("Companies API Response:", response);
        return response.data;
    } catch (error) {
        console.error("getCompanies API Error:", error);
        throw error;
    }
};

// interface CreateCompanyPayload {
//     company_name: string;
//     address: string;
//     no_of_employee: number;
//     location?: string;
// }

// interface CreateCompanyResponse {
//     message: string;
//     data?: Company;
// }

// export const createCompany = async (payload: CreateCompanyPayload): Promise<CreateCompanyResponse> => {
//     try {
//         const response = await axiosInstance.post('/company/createCompany', payload);
//         return response.data;
//     } catch (error) {
//         throw error;
//     }
// };

interface RoleParams {
    start?: string;
    limit?: string;
    search?: string;
}

interface Role {
    id: number;
    role_name: string;
    // Add other role properties as needed
}

interface RoleResponse {
    data: Role[];
    message?: string;
}

export const getAllRoles = async (params: RoleParams = {}): Promise<RoleResponse> => {
    try {
        const response = await axiosInstance.post('/role/getAllRoles', {
            params: params
        });
        console.log("Roles API Response:", response);
        return response.data;
    } catch (error) {
        console.error("getAllRoles API Error:", error);
        throw error;
    }
};


// Update your api/adminApi/company.ts file

interface CreateCompanyPayload {
    company_name: string;
    email: string;
    password: string;
    company_code: string;
    no_of_employee: string;
    no_of_restraunt: string;
    address: string;
    roleid: string;
}

interface CreateCompanyResponse {
    message: string;
    data?: Company;
}

export const createCompany = async (payload: CreateCompanyPayload): Promise<CreateCompanyResponse> => {
    try {
        const response = await axiosInstance.post('/company/createCompany', payload);
        return response.data;
    } catch (error) {
        throw error;
    }
};

// Update company API
interface UpdateCompanyPayload {
    name?: string;
    email?: string;
    password?: string;
}

interface UpdateCompanyResponse {
    message?: string;
    data?: any;
}

export const updateCompany = async (
    id: string,
    payload: UpdateCompanyPayload
): Promise<UpdateCompanyResponse> => {
    try {
        const response = await axiosInstance.put(`/company/updateCompany/${id}`, payload);
        return response.data;
    } catch (error) {
        throw error;
    }
};