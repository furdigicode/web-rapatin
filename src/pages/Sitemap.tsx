
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Sitemap: React.FC = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    // Redirect to the static sitemap.xml file
    window.location.href = '/sitemap.xml';
  }, []);
  
  return (
    <div className="container mx-auto px-4 py-16">
      <h1 className="text-2xl font-bold mb-4">Redirecting to Sitemap...</h1>
      <p>If you are not redirected, <a href="/sitemap.xml" className="text-primary hover:underline">click here</a>.</p>
    </div>
  );
};

export default Sitemap;
