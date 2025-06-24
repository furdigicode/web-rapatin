
import { useMemo } from 'react';
import { useLocation } from 'react-router-dom';

interface URLParams {
  referralCode: string;
  amount: number;
}

export const useURLParams = (): URLParams => {
  const location = useLocation();

  return useMemo(() => {
    const searchParams = new URLSearchParams(location.search);
    
    // Get ref parameter with default RAPATIN50
    const refParam = searchParams.get('ref');
    const referralCode = refParam && refParam.trim() !== '' ? refParam.trim() : 'RAPATIN50';
    
    // Get amount parameter with default 50000
    const amountParam = searchParams.get('amount');
    const parsedAmount = amountParam ? parseInt(amountParam, 10) : null;
    const amount = parsedAmount && !isNaN(parsedAmount) && parsedAmount > 0 ? parsedAmount : 50000;
    
    return {
      referralCode,
      amount
    };
  }, [location.search]);
};
