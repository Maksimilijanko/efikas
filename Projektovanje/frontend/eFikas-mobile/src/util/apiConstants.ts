const scheme = process.env.EXPO_PUBLIC_API_SCHEME;
const address = process.env.EXPO_PUBLIC_API_ADDRESS;    
const port = process.env.EXPO_PUBLIC_API_PORT;
const version = "v1";
export const API_BASE_URL = `${scheme}://${address}:${port}/api/${version}`;

export const API_URLS = {
    auth: {
        googleLogin: `${API_BASE_URL}/users/google/login`,
        login: `${API_BASE_URL}/users/login`,
        register: `${API_BASE_URL}/users/register`,
    },
    
    profile: {
        get: `${API_BASE_URL}/users/me`,
        update: `${API_BASE_URL}/users/me`,
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

    cashRegisters: {
        list: `${API_BASE_URL}/cash-registers`,
        create: `${API_BASE_URL}/cash-registers`,
        getById: (id: number) => `${API_BASE_URL}/cash-registers/${id}`,
        delete: (id: number) => `${API_BASE_URL}/cash-registers/${id}`,
    },
    
    books: {
        getIncomeBookPdf: `${API_BASE_URL}/books/pdf/INCOME`,
        getDomesticGuestsBookPdf: `${API_BASE_URL}/books/pdf/DOMESTIC_GUESTS`,
        getForeignGuestsBookPdf: `${API_BASE_URL}/books/pdf/FOREIGN_GUESTS`,
    },

	notifications: {
		pushToken: `${API_BASE_URL}/notifications/push-token`,
		toggle: `${API_BASE_URL}/notifications/toggle`,
	}
}