// HTTP client using fetch API
const baseURL = "https://be-foodiepe-rurh.onrender.com";
// const baseURL = "http://192.168.1.9:8084";


interface RequestOptions extends RequestInit {
    headers?: Record<string, string>;
}

interface ApiResponse<T = any> {
    data: T;
}

class HttpClient {
    public baseURL: string;

    constructor() {
        this.baseURL = baseURL;
    }

    async request<T = any>(endpoint: string, options: RequestOptions = {}): Promise<ApiResponse<T>> {
        const url = `${this.baseURL}${endpoint}`;
        const token = localStorage.getItem('admin_token');

        const defaultHeaders: Record<string, string> = {
            'Content-Type': 'application/json',
        };

        if (token) {
            defaultHeaders['Authorization'] = `Bearer ${token}`;
        }

        const config: RequestInit = {
            ...options,
            headers: {
                ...defaultHeaders,
                ...options.headers,
            },
        };

        try {
            const response = await fetch(url, config);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            return { data };
        } catch (error) {
            throw error;
        }
    }

    async get<T = any>(endpoint: string, options: RequestOptions = {}): Promise<ApiResponse<T>> {
        return this.request<T>(endpoint, { ...options, method: 'GET' });
    }

    async post<T = any>(endpoint: string, data: any, options: RequestOptions = {}): Promise<ApiResponse<T>> {
        return this.request<T>(endpoint, {
            ...options,
            method: 'POST',
            body: JSON.stringify(data),
        });
    }

    async put<T = any>(endpoint: string, data: any, options: RequestOptions = {}): Promise<ApiResponse<T>> {
        return this.request<T>(endpoint, {
            ...options,
            method: 'PUT',
            body: JSON.stringify(data),
        });
    }

    async delete<T = any>(endpoint: string, options: RequestOptions = {}): Promise<ApiResponse<T>> {
        return this.request<T>(endpoint, { ...options, method: 'DELETE' });
    }
}

const axiosInstance = new HttpClient();
export default axiosInstance;
