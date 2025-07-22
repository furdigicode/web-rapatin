
import React from 'react';

interface ProductPageLayoutProps {
  children: React.ReactNode;
  navbar: React.ReactNode;
}

const ProductPageLayout: React.FC<ProductPageLayoutProps> = ({ children, navbar }) => {
  return (
    <div className="min-h-screen">
      {navbar}
      <main className="pt-28">
        {children}
      </main>
    </div>
  );
};

export default ProductPageLayout;
