const scheme = "http";
const address = "localhost:8080";
const version = "v1";

export const API_BASE_URL = `${scheme}://${address}/api/${version}`;

export const API_URLS = {
    auth: {
        googleLogin: `${API_BASE_URL}/users/google/login`,
        login: `${API_BASE_URL}/users/login`,
        register: `${API_BASE_URL}/users/register`,
		requestOtp: `${API_BASE_URL}/users/otp/request`,
		verifyOtp: `${API_BASE_URL}/users/otp/verify`,
    },
    
    profile: {
        get: `${API_BASE_URL}/users/me`,
        update: `${API_BASE_URL}/users/me`,
		registerStore: `${API_BASE_URL}/users/register/store`,
		resetPassword: `${API_BASE_URL}/users/me/reset-password`,
    },



  reservations: {
    listUser: () => `${API_BASE_URL}/reservations`,

    listByApartment: (apartmentId: number) =>
      `${API_BASE_URL}/apartments/${apartmentId}/reservations`,

    getById: (reservationId: number) =>
      `${API_BASE_URL}/reservations/${reservationId}`,

    create: (apartmentId: number) =>
      `${API_BASE_URL}/apartments/${apartmentId}/reservations`,

    update: (reservationId: number) =>
      `${API_BASE_URL}/reservations/${reservationId}`,

    delete: (reservationId: number) =>
      `${API_BASE_URL}/reservations/${reservationId}`,
  },

	notifications: {
		pushToken: `${API_BASE_URL}/notifications/push-token`,
		toggle: `${API_BASE_URL}/notifications/toggle`,
},
apartments: {
    list: `${API_BASE_URL}/apartments`,
    create: `${API_BASE_URL}/apartments`,
    delete: (id: number) => `${API_BASE_URL}/apartments/${id}`,
    update: (id: number) => `${API_BASE_URL}/apartments/${id}`,
  },
    damages: {
        base: (apartmentId: number) => `${API_BASE_URL}/apartments/${apartmentId}/damages`,
        byName: (apartmentId: number, name: string) => 
            `${API_BASE_URL}/apartments/${apartmentId}/damages/${encodeURIComponent(name)}`,
    },

    tasks: {
        base: (apartmentId: number) => 
            `${API_BASE_URL}/apartments/${apartmentId}/tasks`,
        byName: (apartmentId: number, name: string) => 
            `${API_BASE_URL}/apartments/${apartmentId}/tasks/${encodeURIComponent(name)}`,
    },

    expenses: {
        base: (apartmentId: number) => 
            `${API_BASE_URL}/apartments/${apartmentId}/expenses`,
        byName: (apartmentId: number, name: string) => 
            `${API_BASE_URL}/apartments/${apartmentId}/expenses/${encodeURIComponent(name)}`,
    },
}
