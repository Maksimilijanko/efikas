import { createContext, useContext, useEffect, useState } from "react";
import { asyncStorageService } from "../services/asyncStorageService";
import { ASYNC_STORAGE_KEYS } from "../util/secureStoreKeys";

type Theme = "light" | "dark";

interface ThemeContextType {
    theme: Theme;
    toggleTheme: () => void;
}

export const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
    const [theme, setTheme] = useState<Theme>("light");

    useEffect(() => {
        (async () => {
            const savedTheme = (await asyncStorageService.getItemAsync(ASYNC_STORAGE_KEYS.themeKey)) as | Theme | "light";
            if (savedTheme) {
                setTheme(savedTheme);
                asyncStorageService.setItemAsync(ASYNC_STORAGE_KEYS.themeKey, savedTheme);
            }
        })();
    }, []);

    const toggleTheme = () => {
        const newTheme = theme === "light" ? "dark" : "light";
        setTheme(newTheme);
        asyncStorageService.setItemAsync(ASYNC_STORAGE_KEYS.themeKey, newTheme);
    };

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error("useTheme must be used within a ThemeProvider");
    }

    return context;
};