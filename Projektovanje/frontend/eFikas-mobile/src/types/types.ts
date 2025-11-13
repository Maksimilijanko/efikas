import * as LucideIcons from "lucide-react-native";

export type LucideIconName = keyof typeof LucideIcons;

export interface LoginRequest {
    username: string;
    password: string;
}

export interface RegisterRequest {
    name: string;
    surname: string;
    email: string;
    password: string;
    confirmPassword: string;
}

// TODO: fix when backend gets implemented
export interface AuthenticationResponse {
    test: string;
}