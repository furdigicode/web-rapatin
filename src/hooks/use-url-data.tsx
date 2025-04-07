
import { useState, useEffect } from 'react';

// Default URL values
const defaultUrls = {
  hero: {
    ctaButton: "https://app.rapatin.id/register",
    pricingButton: "#pricing"
  },
  cta: {
    registerButton: "https://app.rapatin.id/register"
  },
  navbar: {
    loginButton: "https://app.rapatin.id/login",
    registerButton: "https://app.rapatin.id/register"
  },
  pricing: {
    scheduleButton: "https://app.rapatin.id/register"
  },
  dashboard: {
    registerButton: "https://app.rapatin.id/register"
  }
};

export function useUrlData() {
  const [urls, setUrls] = useState(defaultUrls);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // No need to fetch from Supabase, we're using static data
  useEffect(() => {
    setLoading(false);
  }, []);
  
  return { urls, loading, error };
}
