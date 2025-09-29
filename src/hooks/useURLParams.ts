
import { useMemo, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

interface URLParams {
  referralCode: string;
  amount: number;
}

const STORAGE_KEY = 'rapatin_url_params';

export const useURLParams = (): URLParams => {
  const location = useLocation();

  return useMemo(() => {
    const searchParams = new URLSearchParams(location.search);
    
    // Get ref parameter from URL
    const refParam = searchParams.get('ref');
    const amountParam = searchParams.get('amount');
    
    let referralCode = 'TRIAL25';
    let amount = 25000;
    
    // If URL has parameters, use them and store in localStorage
    if (refParam && refParam.trim() !== '') {
      referralCode = refParam.trim();
    }
    
    if (amountParam) {
      const parsedAmount = parseInt(amountParam, 10);
      if (!isNaN(parsedAmount) && parsedAmount > 0) {
        amount = parsedAmount;
      }
    }
    
    // Store in localStorage if we have URL parameters
    if (refParam || amountParam) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ referralCode, amount }));
    } else {
      // If no URL parameters, try to get from localStorage
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          referralCode = parsed.referralCode || 'TRIAL25';
          amount = parsed.amount || 25000;
        }
      } catch (error) {
        console.log('Error reading stored params:', error);
      }
    }
    
    return {
      referralCode,
      amount
    };
  }, [location.search]);
};

// Utility function to get current params for URL building
export const getCurrentParams = (): URLParams => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      return {
        referralCode: parsed.referralCode || 'TRIAL25',
        amount: parsed.amount || 25000
      };
    }
  } catch (error) {
    console.log('Error reading current params:', error);
  }
  
  return {
    referralCode: 'TRIAL25',
    amount: 25000
  };
};

// Utility function to check if we should show the modal
export const shouldShowModal = (): boolean => {
  try {
    const sp = new URLSearchParams(window.location.search);
    const hasRef = sp.get('ref');
    const hasAmount = sp.get('amount');
    
    // Show modal only if BOTH ref and amount are present in URL
    return !!(hasRef && hasAmount);
  } catch {
    return false;
  }
};

// Utility function to check if we should directly redirect
export const shouldDirectRedirect = (): boolean => {
  return !shouldShowModal();
};

// Utility function to get the correct redirect URL
export const getRedirectUrl = (): string => {
  try {
    const sp = new URLSearchParams(window.location.search);
    const refParam = sp.get('ref');
    
    const baseUrl = 'https://app.rapatin.id/dashboard/register';
    
    // If only ref parameter exists (without amount), include it in URL
    if (refParam && !sp.get('amount')) {
      return `${baseUrl}?ref=${refParam}`;
    }
    
    // For all other cases (amount only, no params, etc.), return base URL
    return baseUrl;
  } catch {
    return 'https://app.rapatin.id/dashboard/register';
  }
};

// Utility function to check if we have custom trial parameters (kept for backward compatibility)
export const hasTrialParams = (): boolean => {
  return shouldShowModal();
};

// Utility function to preserve URL parameters in navigation
export const preserveURLParams = (basePath: string): string => {
  const params = getCurrentParams();
  
  // Don't add default parameters to avoid cluttering URLs
  if (params.referralCode === 'TRIAL25' && params.amount === 25000) {
    return basePath;
  }
  
  const searchParams = new URLSearchParams();
  if (params.referralCode !== 'TRIAL25') {
    searchParams.set('ref', params.referralCode);
  }
  if (params.amount !== 25000) {
    searchParams.set('amount', params.amount.toString());
  }
  
  const queryString = searchParams.toString();
  return queryString ? `${basePath}?${queryString}` : basePath;
};
