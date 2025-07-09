import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface AdminUser {
  id: string;
  email: string;
}

interface UseAdminAuthReturn {
  admin: AdminUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  verifyToken: () => Promise<boolean>;
}

export const useAdminAuth = (): UseAdminAuthReturn => {
  const [admin, setAdmin] = useState<AdminUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [token, setToken] = useState<string | null>(null);

  const getStoredToken = useCallback(() => {
    return localStorage.getItem('adminAuthToken');
  }, []);

  const setStoredToken = useCallback((newToken: string | null) => {
    if (newToken) {
      localStorage.setItem('adminAuthToken', newToken);
      setToken(newToken);
    } else {
      localStorage.removeItem('adminAuthToken');
      setToken(null);
    }
  }, []);

  const verifyToken = useCallback(async (): Promise<boolean> => {
    const storedToken = getStoredToken();
    if (!storedToken) {
      setIsLoading(false);
      return false;
    }

    try {
      const { data, error } = await supabase.functions.invoke('admin-auth', {
        body: { action: 'verify', token: storedToken }
      });

      if (error || !data?.valid) {
        setStoredToken(null);
        setAdmin(null);
        setIsLoading(false);
        return false;
      }

      setAdmin(data.admin);
      setToken(storedToken);
      setIsLoading(false);
      return true;
    } catch (error) {
      console.error('Token verification failed:', error);
      setStoredToken(null);
      setAdmin(null);
      setIsLoading(false);
      return false;
    }
  }, [getStoredToken, setStoredToken]);

  const login = useCallback(async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('admin-auth', {
        body: { action: 'login', email, password }
      });

      if (error || !data?.success) {
        setIsLoading(false);
        return { success: false, error: data?.error || 'Login failed' };
      }

      setStoredToken(data.token);
      setAdmin(data.admin);
      setIsLoading(false);
      return { success: true };
    } catch (error) {
      console.error('Login error:', error);
      setIsLoading(false);
      return { success: false, error: 'Network error' };
    }
  }, [setStoredToken]);

  const logout = useCallback(async () => {
    const storedToken = getStoredToken();
    if (storedToken) {
      try {
        await supabase.functions.invoke('admin-auth', {
          body: { action: 'logout', token: storedToken }
        });
      } catch (error) {
        console.error('Logout error:', error);
      }
    }
    
    setStoredToken(null);
    setAdmin(null);
  }, [getStoredToken, setStoredToken]);

  // Setup admin password on first run
  const setupAdmin = useCallback(async () => {
    try {
      await supabase.functions.invoke('admin-auth', {
        body: { 
          action: 'setup', 
          email: 'rapatinapp@gmail.com', 
          password: 'Andalus123!' 
        }
      });
    } catch (error) {
      console.error('Admin setup error:', error);
    }
  }, []);

  useEffect(() => {
    // Setup admin on first load
    setupAdmin();
    // Verify existing token
    verifyToken();
  }, [setupAdmin, verifyToken]);

  return {
    admin,
    isLoading,
    isAuthenticated: !!admin && !!token,
    login,
    logout,
    verifyToken
  };
};