import React, { useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import AdminPageHeader from '@/components/admin/AdminPageHeader';
import SEO from '@/components/SEO';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import VotingBuilder from '@/components/admin/VotingBuilder';
import VotingList from '@/components/admin/VotingList';

const VotingManagement: React.FC = () => {
  const [isCreating, setIsCreating] = useState(false);
  const [editingVotingId, setEditingVotingId] = useState<string | null>(null);

  const handleCreateNew = () => {
    setIsCreating(true);
    setEditingVotingId(null);
  };

  const handleEdit = (votingId: string) => {
    setIsCreating(false);
    setEditingVotingId(votingId);
  };

  const handleBack = () => {
    setIsCreating(false);
    setEditingVotingId(null);
  };

  const showForm = isCreating || editingVotingId !== null;

  return (
    <AdminLayout title="Kelola Voting">
      <SEO 
        title="Kelola Voting - Admin" 
        description="Kelola voting dan polling" 
      />
      
      {showForm ? (
        <VotingBuilder 
          votingId={editingVotingId} 
          onSaveSuccess={handleBack}
          onCancel={handleBack}
        />
      ) : (
        <>
          <AdminPageHeader
            title="Kelola Voting"
            description="Buat dan kelola voting untuk mendapatkan feedback dari pengguna"
          >
            <Button onClick={handleCreateNew}>
              <Plus className="mr-2 h-4 w-4" />
              Buat Baru
            </Button>
          </AdminPageHeader>
          
          <VotingList onEdit={handleEdit} />
        </>
      )}
    </AdminLayout>
  );
};

export default VotingManagement;
