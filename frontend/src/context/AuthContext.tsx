import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

type AuthUser = {
  id: string;
  email: string;
  username: string;
  isAdmin?: boolean;
  photoUrl?: string;
  bio?: string;
  isPublic?: boolean;
};

type AuthState = {
  token: string | null;
  user: AuthUser | null;
  login: (token: string, user: AuthUser) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthState | null>(null);

const readStoredAuth = () => {
  const token = localStorage.getItem("authToken");
  const rawUser = localStorage.getItem("currentUser");
  const user = rawUser ? (JSON.parse(rawUser) as AuthUser) : null;
  return { token, user };
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(() => readStoredAuth().token);
  const [user, setUser] = useState<AuthUser | null>(() => readStoredAuth().user);

  const login = (nextToken: string, nextUser: AuthUser) => {
    setToken(nextToken);
    setUser(nextUser);
    localStorage.setItem("authToken", nextToken);
    localStorage.setItem("currentUser", JSON.stringify(nextUser));
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("authToken");
    localStorage.removeItem("currentUser");
  };

  useEffect(() => {
    const syncFromStorage = () => {
      const next = readStoredAuth();
      setToken(next.token);
      setUser(next.user);
    };

    const onStorage = (event: StorageEvent) => {
      if (event.key === "authToken" || event.key === "currentUser") {
        syncFromStorage();
      }
    };

    const onAuthLogout = () => {
      setToken(null);
      setUser(null);
    };

    window.addEventListener("storage", onStorage);
    window.addEventListener("auth:logout", onAuthLogout as EventListener);

    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("auth:logout", onAuthLogout as EventListener);
    };
  }, []);

  const value = useMemo(() => ({ token, user, login, logout }), [token, user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return ctx;
}
