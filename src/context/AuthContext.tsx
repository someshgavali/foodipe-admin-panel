import React, { createContext, useContext, useState, useEffect } from 'react';
import { adminLogin } from '../api/adminApi/admin'; // Updated to TypeScript

interface ApiPermission {
  id: number;
  api: string;
  methods: string[];
  allowed: boolean;
}

interface ServicePermission {
  id: number;
  serviceName: string;
  api_permissions: ApiPermission[];
}

interface RoleInfo {
  id: number;
  name: string;
  permissions: ServicePermission[];
}

interface User {
  id: number | string;
  email: string;
  name?: string;
  token?: string;
  role?: RoleInfo;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
  hasPermission: (serviceName: string, api?: string, method?: string) => boolean;
  isSuperAdmin: () => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for stored user on mount
    const storedUser = localStorage.getItem('admin_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      const data = await adminLogin(email, password);
      // Expecting shape: { message, user: { ... , token, role: { name, permissions: [...] } } }
      const apiUser = data?.user || {};
      const userData: User = {
        id: apiUser.id,
        email: apiUser.email,
        name: apiUser.company_name || apiUser.name,
        token: apiUser.token,
        role: apiUser.role
      };
      setUser(userData);
      localStorage.setItem('admin_user', JSON.stringify(userData));
      if (apiUser.token) {
        localStorage.setItem('admin_token', apiUser.token);
      }
      return true;
    } catch (err) {
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string): Promise<boolean> => {
    setIsLoading(true);

    // Mock registration - in real app, this would be an API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    const userData = { id: Date.now().toString(), email, name };
    setUser(userData);
    localStorage.setItem('admin_user', JSON.stringify(userData));
    setIsLoading(false);
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('admin_user');
    localStorage.removeItem('admin_token');
  };

  const isSuperAdmin = () => {
    const roleName = user?.role?.name?.toLowerCase() || '';
    const email = (user?.email || '').toLowerCase();
    return roleName === 'super admin' || roleName === 'superadmin' || email === 'superadmin@gmail.com';
  };

  const hasPermission = (serviceName: string, api?: string, method?: string) => {
    if (!user?.role?.permissions) return false;
    if (isSuperAdmin()) return true;

    const normalize = (value: string | undefined | null) =>
      (value || '').toLowerCase().replace(/\s+/g, '');

    const matchApiPath = (pattern: string, path: string) => {
      // Support colon params in pattern like /resource/:id matching /resource/123
      const patternParts = pattern.split('/').filter(Boolean);
      const pathParts = path.split('/').filter(Boolean);
      if (patternParts.length !== pathParts.length) return false;
      return patternParts.every((part, idx) => part.startsWith(':') || part === pathParts[idx]);
    };

    const normalizedTargetService = normalize(serviceName);
    const service = user.role.permissions.find(
      p => normalize(p.serviceName) === normalizedTargetService
    );
    if (!service) return false;
    if (!api && !method) return true;
    const apiPerms = service.api_permissions || [];
    return apiPerms.some(p => {
      const apiMatch = api ? (p.api === api || matchApiPath(p.api, api)) : true;
      const methodMatch = method ? (p.methods || []).includes(method) : true;
      return p.allowed && apiMatch && methodMatch;
    });
  };

  const value = {
    user,
    login,
    register,
    logout,
    isLoading,
    hasPermission,
    isSuperAdmin
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};