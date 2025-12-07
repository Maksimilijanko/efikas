const scheme = "https"
const address = "efikas-team.com";   
const port = "443";
const version = "v1";
export const API_BASE_URL = `${scheme}://${address}:${port}/api/${version}`;

export const API_URLS = {
    auth: {
        googleLogin: `${API_BASE_URL}/users/google/login`,
        login: `${API_BASE_URL}/users/login`,
        register: `${API_BASE_URL}/users/register`,
    },
    
    profile: {
        get: `${API_BASE_URL}/profile`,
        update: `${API_BASE_URL}/profile`,
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
    
}