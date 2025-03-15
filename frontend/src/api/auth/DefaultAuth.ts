import { BaseAuth } from "./BaseAuth";
import axios from 'axios';

const BASE_URL = import.meta.env.BASE_URL || '';

export class DefaultAuth extends BaseAuth {
    login(email: string, password: string): Promise<any> {
        return axios.post(`${BASE_URL}/auth/token`, { email, password })
            .then(response => response.data)
            .catch(error => {
                throw new Error(error.response?.data?.message || 'Login failed');
            });
    }

    register(email: string, password: string): Promise<any> {
        return axios.post(`${BASE_URL}/api/register`, { email, password })
            .then(response => response.data)
            .catch(error => {
                throw new Error(error.response?.data?.message || 'Registration failed');
            });
    }
    
    getUser(): Promise<any> {
        return axios.get(`${BASE_URL}/api/user`)
            .then(response => response.data)
            .catch(error => {
                throw new Error(error.response?.data?.message || 'Failed to get user');
            });
    }

    logout(): Promise<void> {
        return axios.post(`${BASE_URL}/api/logout`)
            .then(() => {})
            .catch(error => {
                throw new Error(error.response?.data?.message || 'Logout failed');
            });
    }
}