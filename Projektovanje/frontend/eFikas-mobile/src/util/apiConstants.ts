const address = "localhost"; //backendAddressDocker ? backendAddressDocker : "localhost";
const port = 9000;
const version = "v1";
export const API_BASE_URL = `http://${address}:${port}/api/${version}`;

export const API_AUTH_GOOGLE_LOGIN_URL = `${API_BASE_URL}/auth/google/login`;
export const API_AUTH_LOGIN_URL = `${API_BASE_URL}/auth/login`;