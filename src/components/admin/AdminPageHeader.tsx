import React from 'react';
import { Button } from "@/components/ui/button";

interface AdminPageHeaderProps {
  title: string;
  description: string;
  children?: React.ReactNode;
}

const AdminPageHeader: React.FC<AdminPageHeaderProps> = ({ 
  title, 
  description, 
  children 
}) => {
  return (
    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 mb-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold">{title}</h1>
        <p className="text-muted-foreground">{description}</p>
      </div>
      {children && (
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
          {children}
        </div>
      )}
    </div>
  );
};

export default AdminPageHeader;