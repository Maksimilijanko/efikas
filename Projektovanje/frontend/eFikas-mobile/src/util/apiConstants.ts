const scheme = "http"
const address = "192.168.10.5";    // TODO: Naći način da se gađa jedinstveni backend. Expo ne dozvoljava localhost izvršavanje jer to gađa sam uređaj - mora LAN za sad!
const port = "8080";
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
    
}