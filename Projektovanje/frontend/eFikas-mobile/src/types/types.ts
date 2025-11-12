import * as LucideIcons from "lucide-react-native";

export type LucideIconName = keyof typeof LucideIcons;

export interface LoginRequest {
    username: string;
    password: string;
}

// TODO: fix when backend gets implemented
export interface AuthenticationResponse {
    test: string;
}