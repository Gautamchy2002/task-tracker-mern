import type { Tenant, User } from "@/types";

const ACCESS_TOKEN_KEY = "task_tracker_access_token";
const USER_KEY = "task_tracker_auth_user";
const TENANT_KEY = "task_tracker_tenant";

export const saveAuthData = (
  accessToken: string,
  user: User,
  tenant: Tenant,
) => {
  localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
  localStorage.setItem(TENANT_KEY, JSON.stringify(tenant));
};

export const getAccessToken = () => localStorage.getItem(ACCESS_TOKEN_KEY);

export const getStoredUser = (): User | null => {
  try {
    const value = localStorage.getItem(USER_KEY);
    return value ? JSON.parse(value) : null;
  } catch {
    return null;
  }
};

export const getStoredTenant = (): Tenant | null => {
  try {
    const value = localStorage.getItem(TENANT_KEY);
    return value ? JSON.parse(value) : null;
  } catch {
    return null;
  }
};

export const clearAuthData = () => {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
  localStorage.removeItem(TENANT_KEY);
};
