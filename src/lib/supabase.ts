
import { createClient } from '@supabase/supabase-js';

// Default to empty strings or placeholders if env vars are not available
// This prevents the app from crashing during initialization
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Create a dummy client if credentials are missing
const isMissingCredentials = !supabaseUrl || !supabaseAnonKey;

if (isMissingCredentials) {
  console.warn(
    'Missing Supabase credentials. Authentication and data operations will not work.\n' +
    'Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env file.\n' +
    'See SUPABASE_SETUP.md for more details.'
  );
}

// Create the Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Create mock functions that return appropriate responses when credentials are missing
const mockAuthResponse = {
  data: { user: null, session: null },
  error: isMissingCredentials ? new Error('Supabase credentials not configured') : null
};

// Auth helper functions with graceful degradation
export const signIn = async (email: string, password: string) => {
  if (isMissingCredentials) {
    console.warn('Sign in attempted but Supabase is not configured');
    return mockAuthResponse;
  }
  
  return await supabase.auth.signInWithPassword({
    email,
    password
  });
};

export const signOut = async () => {
  if (isMissingCredentials) {
    console.warn('Sign out attempted but Supabase is not configured');
    return { error: mockAuthResponse.error };
  }
  
  return await supabase.auth.signOut();
};

export const getCurrentUser = async () => {
  if (isMissingCredentials) {
    console.warn('Get current user attempted but Supabase is not configured');
    return null;
  }
  
  const { data } = await supabase.auth.getUser();
  return data.user;
};

export const isAuthenticated = async () => {
  if (isMissingCredentials) {
    console.warn('Authentication check attempted but Supabase is not configured');
    return false;
  }
  
  const user = await getCurrentUser();
  return !!user;
};
