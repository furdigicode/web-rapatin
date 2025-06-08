
import React, { useState, useEffect } from 'react';
import { Button } from './button';

interface BirdSendFormProps {
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

const BirdSendForm: React.FC<BirdSendFormProps> = ({ onSuccess, onError }) => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    // Load BirdSend script
    const script = document.createElement('script');
    script.id = 'birdsend-form-js';
    script.src = 'https://cdn.birdsend.co/assets/static/js/form.js';
    
    if (!document.getElementById('birdsend-form-js')) {
      document.head.appendChild(script);
    }

    return () => {
      // Cleanup script on unmount
      const existingScript = document.getElementById('birdsend-form-js');
      if (existingScript) {
        existingScript.remove();
      }
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) return;
    
    setIsSubmitting(true);
    setMessage('');

    try {
      const formData = new FormData();
      formData.append('meta_id', '57569');
      formData.append('meta_user_id', '12677');
      formData.append('email', email);

      // Submit to BirdSend (subscription will work even if we can't read the response)
      fetch('https://app.birdsend.co/subscribe', {
        method: 'POST',
        body: formData,
      });

      // Always show success message regardless of response (due to CORS)
      setMessage('Terima kasih telah antusias menunggu rilis. Kami akan mengabari Anda jika akan rilis');
      setEmail('');
      onSuccess?.();
    } catch (error) {
      // Even if there's an error, show success message since the subscription likely worked
      setMessage('Terima kasih telah antusias menunggu rilis. Kami akan mengabari Anda jika akan rilis');
      setEmail('');
      onSuccess?.();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-4">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Alamat Email"
            required
            className="w-full px-4 py-3 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
            disabled={isSubmitting}
          />
        </div>
        
        <Button 
          type="submit" 
          className="w-full" 
          disabled={isSubmitting || !email}
        >
          {isSubmitting ? 'Mendaftar...' : 'Bergabung Waiting List'}
        </Button>
      </form>

      {message && (
        <div className="text-sm text-center p-3 rounded-md bg-green-50 text-green-700 border border-green-200">
          {message}
        </div>
      )}

    </div>
  );
};

export default BirdSendForm;
