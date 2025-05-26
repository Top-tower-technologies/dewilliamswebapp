import axiosInstance from './axiosInstance';

// All your requests in one file
export const apiService = {
  login: (email: string, password: string) =>
    axiosInstance.post('/staff/auth/login', { email, password }),

  register: (fullname: string, email: string, password: string, phone: string) =>
    axiosInstance.post('/auth/register', { fullname, email, password, phone }),

  verifyReservation: (reservationCode: any,) =>
    axiosInstance.post('/staff/guest/reservations/confirm',
      { reservation_code: reservationCode },
      { headers: { 'Authorization': `Bearer ${localStorage.getItem('AuthKey')}` } }),
};
