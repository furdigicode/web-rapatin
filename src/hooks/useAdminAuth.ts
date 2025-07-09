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
      console.log('Attempting admin login for:', email);
      
      // First authenticate with admin-auth function
      const { data, error } = await supabase.functions.invoke('admin-auth', {
        body: { action: 'login', email, password }
      });

      console.log('Admin auth response:', { data, error });

      if (error) {
        console.error('Supabase function error:', error);
        setIsLoading(false);
        return { success: false, error: 'Connection error' };
      }

      if (!data?.success) {
        console.error('Admin login failed:', data?.error);
        setIsLoading(false);
        return { success: false, error: data?.error || 'Login failed' };
      }

      // Create a Supabase auth session using the admin credentials
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: email,
        password: password // Use the actual admin password
      });

      // If admin user doesn't exist in Supabase auth, create them
      if (authError?.message?.includes('Invalid login credentials')) {
        console.log('Creating Supabase auth user for admin...');
        const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
          email: email,
          password: password,
          options: {
            emailRedirectTo: `${window.location.origin}/admin/dashboard`
          }
        });
        
        if (signUpError) {
          console.error('Failed to create admin auth user:', signUpError);
          setIsLoading(false);
          return { success: false, error: 'Failed to create auth session' };
        }
        
        // If signup successful, try to sign in
        if (signUpData.user) {
          const { error: retryAuthError } = await supabase.auth.signInWithPassword({
            email: email,
            password: password
          });
          
          if (retryAuthError) {
            console.error('Failed to sign in after signup:', retryAuthError);
          }
        }
      } else if (authError) {
        console.error('Auth session creation failed:', authError);
        setIsLoading(false);
        return { success: false, error: 'Failed to create auth session' };
      }

      // Verify we have a valid session
      const { data: sessionData } = await supabase.auth.getSession();
      console.log('Supabase session created:', { 
        hasSession: !!sessionData.session, 
        hasUser: !!sessionData.session?.user 
      });

      setStoredToken(data.token);
      setAdmin(data.admin);
      setIsLoading(false);
      console.log('Admin login successful for:', data.admin.email);
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
    
    // Also sign out from Supabase auth
    await supabase.auth.signOut();
    
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