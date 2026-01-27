import { useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";

/**
 * Component to handle backward compatibility for old URL formats:
 * - /quick-order/success?order_id=xxx → /quick-order/xxx
 * - /quick-order/pending?order_id=xxx → /quick-order/xxx
 */
export default function LegacyRedirect() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const orderId = searchParams.get('order_id');
    if (orderId) {
      navigate(`/quick-order/${orderId}`, { replace: true });
    } else {
      // No order_id found, redirect to quick order form
      navigate('/quick-order', { replace: true });
    }
  }, [searchParams, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
        <p className="text-muted-foreground">Mengalihkan...</p>
      </div>
    </div>
  );
}
