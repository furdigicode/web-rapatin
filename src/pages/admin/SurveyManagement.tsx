
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import AdminLayout from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useToast } from '@/hooks/use-toast';
import { Plus, MoreHorizontal, Eye, Edit, Copy, Trash2, BarChart3 } from 'lucide-react';
import type { Survey } from '@/types/SurveyTypes';

const SurveyManagement = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: surveys, isLoading } = useQuery({
    queryKey: ['surveys'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('surveys')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as Survey[];
    }
  });

  const deleteSurveyMutation = useMutation({
    mutationFn: async (surveyId: string) => {
      const { error } = await supabase
        .from('surveys')
        .delete()
        .eq('id', surveyId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['surveys'] });
      toast({
        title: "Survey deleted",
        description: "Survey has been successfully deleted.",
      });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete survey.",
      });
    }
  });

  const duplicateSurveyMutation = useMutation({
    mutationFn: async (survey: Survey) => {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data: newSurvey, error: surveyError } = await supabase
        .from('surveys')
        .insert({
          title: `${survey.title} (Copy)`,
          description: survey.description,
          status: 'draft',
          settings: survey.settings,
          created_by: user.id
        })
        .select()
        .single();

      if (surveyError) throw surveyError;

      // Copy fields
      const { data: fields, error: fieldsError } = await supabase
        .from('survey_fields')
        .select('*')
        .eq('survey_id', survey.id);

      if (fieldsError) throw fieldsError;

      if (fields && fields.length > 0) {
        const newFields = fields.map(field => ({
          survey_id: newSurvey.id,
          field_type: field.field_type,
          label: field.label,
          description: field.description,
          options: field.options,
          validation_rules: field.validation_rules,
          field_order: field.field_order,
          is_required: field.is_required
        }));

        const { error: insertError } = await supabase
          .from('survey_fields')
          .insert(newFields);

        if (insertError) throw insertError;
      }

      return newSurvey;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['surveys'] });
      toast({
        title: "Survey duplicated",
        description: "Survey has been successfully duplicated.",
      });
    },
    onError: () => {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to duplicate survey.",
      });
    }
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'published':
        return <Badge className="bg-green-100 text-green-800">Published</Badge>;
      case 'closed':
        return <Badge className="bg-red-100 text-red-800">Closed</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800">Draft</Badge>;
    }
  };

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">Loading surveys...</div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">Survey Management</h1>
            <p className="text-muted-foreground">Create and manage your surveys</p>
          </div>
          <Button onClick={() => navigate('/admin/survey/builder/new')}>
            <Plus className="w-4 h-4 mr-2" />
            Create Survey
          </Button>
        </div>

        <div className="grid gap-4">
          {surveys?.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <BarChart3 className="w-12 h-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No surveys yet</h3>
                <p className="text-muted-foreground text-center mb-4">
                  Get started by creating your first survey
                </p>
                <Button onClick={() => navigate('/admin/survey/builder/new')}>
                  <Plus className="w-4 h-4 mr-2" />
                  Create Survey
                </Button>
              </CardContent>
            </Card>
          ) : (
            surveys?.map((survey) => (
              <Card key={survey.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{survey.title}</CardTitle>
                      <CardDescription>{survey.description}</CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                      {getStatusBadge(survey.status)}
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => navigate(`/form/${survey.id}`)}>
                            <Eye className="w-4 h-4 mr-2" />
                            Preview
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => navigate(`/admin/survey/builder/${survey.id}`)}>
                            <Edit className="w-4 h-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => navigate(`/admin/survey/responses/${survey.id}`)}>
                            <BarChart3 className="w-4 h-4 mr-2" />
                            Responses
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => duplicateSurveyMutation.mutate(survey)}>
                            <Copy className="w-4 h-4 mr-2" />
                            Duplicate
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => deleteSurveyMutation.mutate(survey.id)}
                            className="text-red-600"
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center text-sm text-muted-foreground">
                    <span>Created {new Date(survey.created_at).toLocaleDateString()}</span>
                    <span>Last updated {new Date(survey.updated_at).toLocaleDateString()}</span>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default SurveyManagement;
