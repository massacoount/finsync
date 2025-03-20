import { apiConfig } from "@/config/api";
import { BaseAuth } from "./BaseAuth";
import axios from 'axios';

export class DefaultAuth extends BaseAuth {
    login(email: string, password: string): Promise<any> {
        return axios.post(`${apiConfig.baseUrl}/auth/token`, { email, password })
            .then(response => response.data)
            .catch(error => {
                throw new Error(error.response?.data?.message || 'Login failed');
            });
    }

    register(email: string, password: string): Promise<any> {
        return axios.post(`${apiConfig.baseUrl}/api/register`, { email, password })
            .then(response => response.data)
            .catch(error => {
                throw new Error(error.response?.data?.message || 'Registration failed');
            });
    }
    
    getUser(): Promise<any> {
        return axios.get(`${apiConfig.baseUrl}/api/user`)
            .then(response => response.data)
            .catch(error => {
                throw new Error(error.response?.data?.message || 'Failed to get user');
            });
    }

    logout(): Promise<void> {
        return axios.post(`${apiConfig.baseUrl}/api/logout`)
            .then(() => {})
            .catch(error => {
                throw new Error(error.response?.data?.message || 'Logout failed');
            });
    }
}