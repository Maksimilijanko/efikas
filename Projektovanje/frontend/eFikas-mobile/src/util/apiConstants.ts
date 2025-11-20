const scheme = "http"
const address = "localhost";
const port = 8080;
const version = "v1";
export const API_BASE_URL = `${scheme}://${address}:${port}/api/${version}`;

export const API_URLS = {
    auth: {
        googleLogin: `${API_BASE_URL}/users/google/login`,
        login: `${API_BASE_URL}/users/login`,
        register: `${API_BASE_URL}/users/register`,
    },
    
    
}