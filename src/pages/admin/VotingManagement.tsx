import React, { useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import SEO from '@/components/SEO';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import VotingBuilder from '@/components/admin/VotingBuilder';
import VotingList from '@/components/admin/VotingList';

const VotingManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('list');
  const [editingVotingId, setEditingVotingId] = useState<string | null>(null);

  const handleCreateNew = () => {
    setEditingVotingId(null);
    setActiveTab('create');
  };

  const handleEdit = (votingId: string) => {
    setEditingVotingId(votingId);
    setActiveTab('create');
  };

  const handleSaveSuccess = () => {
    setActiveTab('list');
    setEditingVotingId(null);
  };

  return (
    <AdminLayout title="Kelola Voting">
      <SEO 
        title="Kelola Voting - Admin" 
        description="Kelola voting dan polling" 
      />
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList>
          <TabsTrigger value="list">Semua Voting</TabsTrigger>
          <TabsTrigger value="create">
            {editingVotingId ? 'Edit Voting' : 'Buat Voting Baru'}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="list" className="mt-6">
          <VotingList onEdit={handleEdit} onCreateNew={handleCreateNew} />
        </TabsContent>

        <TabsContent value="create" className="mt-6">
          <VotingBuilder 
            votingId={editingVotingId} 
            onSaveSuccess={handleSaveSuccess}
          />
        </TabsContent>
      </Tabs>
    </AdminLayout>
  );
};

export default VotingManagement;
