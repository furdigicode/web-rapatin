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
      console.log('Attempting login for:', email);
      const { data, error } = await supabase.functions.invoke('admin-auth', {
        body: { action: 'login', email, password }
      });

      console.log('Login response:', { data, error });

      if (error) {
        console.error('Supabase function error:', error);
        setIsLoading(false);
        return { success: false, error: 'Connection error' };
      }

      if (!data?.success) {
        console.error('Login failed:', data?.error);
        setIsLoading(false);
        return { success: false, error: data?.error || 'Login failed' };
      }

      setStoredToken(data.token);
      setAdmin(data.admin);
      setIsLoading(false);
      console.log('Login successful for:', data.admin.email);
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
      console.log('Setting up admin user...');
      const { data, error } = await supabase.functions.invoke('admin-auth', {
        body: { 
          action: 'setup', 
          email: 'rapatinapp@gmail.com', 
          password: 'Andalus123!' 
        }
      });
      
      if (error) {
        console.error('Admin setup function error:', error);
      } else {
        console.log('Admin setup response:', data);
      }
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