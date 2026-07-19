import {
  createContext,
  type ReactNode,
  useContext,
  useMemo,
  useState,
} from "react";
import axiosinstance from "@/api/axiosinstance";
import {
  clearAuthData,
  getAccessToken,
  getStoredTenant,
  getStoredUser,
  saveAuthData,
} from "@/lib/storage";
import { getResponseData } from "@/lib/api-error";
import type { LoginResponse, Tenant, User } from "@/types";

interface AuthContextType {
  user: User | null;
  tenant: Tenant | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (payload: {
    tenantSlug: string;
    email: string;
    password: string;
  }) => Promise<void>;
  register: (payload: {
    tenantName: string;
    tenantSlug: string;
    name: string;
    email: string;
    password: string;
  }) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(() => getStoredUser());
  const [tenant, setTenant] = useState<Tenant | null>(() => getStoredTenant());
  const [token, setToken] = useState<string | null>(() => getAccessToken());

  const login: AuthContextType["login"] = async (payload) => {
    const response = await axiosinstance.post("/auth/login", payload);
    const data = getResponseData<LoginResponse>(response.data);

    saveAuthData(data.accessToken, data.user, data.tenant);
    setToken(data.accessToken);
    setUser(data.user);
    setTenant(data.tenant);
  };

  const register: AuthContextType["register"] = async (payload) => {
    await axiosinstance.post("/auth/register", payload);
    await login({
      tenantSlug: payload.tenantSlug,
      email: payload.email,
      password: payload.password,
    });
  };

  const logout = () => {
    clearAuthData();
    setToken(null);
    setUser(null);
    setTenant(null);
  };

  const value = useMemo(
    () => ({
      user,
      tenant,
      token,
      isAuthenticated: Boolean(user && token),
      login,
      register,
      logout,
    }),
    [user, tenant, token],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }

  return context;
};
