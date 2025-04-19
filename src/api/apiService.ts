import axiosInstance from './axiosInstance';

// All your requests in one file
export const apiService = {
  login: (email: string, password: string) =>
    axiosInstance.post('/auth/guest/login', { email, password }),

  register: (fullname: string, email: string, password: string, phone: string) =>
    axiosInstance.post('/auth/register', { fullname, email, password, phone }),
};
