const scheme = "http"
const address = "localhost";
const port = 9000;
const version = "v1";
export const API_BASE_URL = `${scheme}://${address}:${port}/api/${version}`;

export const API_URLS = {
    auth: {
        googleLogin: `${API_BASE_URL}/auth/google/login`,
        login: `${API_BASE_URL}/auth/login`,
        register: `${API_BASE_URL}/auth/register`,
    },
    
    
}