
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
