import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useState,
} from "react";

import {
    clearSession,
    getMe,
    getStoredToken,
    login as loginRequest,
    setUnauthorizedHandler,
    storeSession,
} from "../services/api.js";

const AuthContext = createContext(null);

export const getDashboardPath = (role) =>
    role === "ADMIN" ? "/admin" : "/student";

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [initializing, setInitializing] = useState(() =>
        Boolean(getStoredToken())
    );

    useEffect(() => {
        setUnauthorizedHandler(() => setUser(null));
        return () => setUnauthorizedHandler(null);
    }, []);

    useEffect(() => {
        if (!getStoredToken()) {
            return undefined;
        }

        let cancelled = false;

        getMe()
            .then((response) => {
                if (!cancelled) {
                    setUser(response.data);
                }
            })
            .catch(() => {
                // Not signed in (or the server is unreachable): continue as a visitor.
            })
            .finally(() => {
                if (!cancelled) {
                    setInitializing(false);
                }
            });

        return () => {
            cancelled = true;
        };
    }, []);

    const login = useCallback(async (username, password) => {
        const response = await loginRequest(username, password);
        storeSession(response.data.token, response.data.expiresInSeconds);
        setUser(response.data.user);
        return response.data.user;
    }, []);

    const logout = useCallback(() => {
        clearSession();
        setUser(null);
    }, []);

    const refreshUser = useCallback(async () => {
        const response = await getMe();
        setUser(response.data);
        return response.data;
    }, []);

    const value = useMemo(
        () => ({ user, initializing, login, logout, refreshUser }),
        [user, initializing, login, logout, refreshUser]
    );

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used inside AuthProvider");
    }
    return context;
}