const scheme = "http"
const address = "192.168.50.44";    // TODO: Naći način da se gađa jedinstveni backend. Expo ne dozvoljava localhost izvršavanje jer to gađa sam uređaj - mora LAN za sad!
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
        get: `${API_BASE_URL}/profile`,
        update: `${API_BASE_URL}/profile`,
    },
    
}