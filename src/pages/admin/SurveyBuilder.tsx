
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import AdminLayout from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { Save, Eye, Settings, Plus } from 'lucide-react';
import FormBuilder from '@/components/survey/builder/FormBuilder';
import SurveySettings from '@/components/survey/builder/SurveySettings';
import type { Survey, SurveyField } from '@/types/SurveyTypes';

const SurveyBuilder = () => {
  const { surveyId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const isNew = surveyId === 'new';

  const [survey, setSurvey] = useState<Partial<Survey>>({
    title: '',
    description: '',
    status: 'draft',
    settings: {}
  });
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check authentication on component mount
  useEffect(() => {
    const checkAuth = async () => {
      console.log('Checking authentication...');
      const { data: { user }, error } = await supabase.auth.getUser();
      console.log('Auth check result:', { user, error });
      
      if (error || !user) {
        console.log('User not authenticated, redirecting to login');
        toast({
          variant: "destructive",
          title: "Authentication Required",
          description: "Please log in to access the survey builder.",
        });
        navigate('/admin/login');
        return;
      }
      
      setUser(user);
      setIsLoading(false);
    };

    checkAuth();
  }, [navigate, toast]);

  const { data: existingSurvey, isLoading: surveyLoading } = useQuery({
    queryKey: ['survey', surveyId],
    queryFn: async () => {
      if (isNew) return null;
      console.log('Fetching existing survey:', surveyId);
      const { data, error } = await supabase
        .from('surveys')
        .select('*')
        .eq('id', surveyId)
        .single();
      if (error) {
        console.error('Error fetching survey:', error);
        throw error;
      }
      console.log('Fetched survey:', data);
      return data as Survey;
    },
    enabled: !isNew && !!user
  });

  const { data: fields = [], isLoading: fieldsLoading } = useQuery({
    queryKey: ['survey-fields', surveyId],
    queryFn: async () => {
      if (isNew) return [];
      console.log('Fetching survey fields for:', surveyId);
      const { data, error } = await supabase
        .from('survey_fields')
        .select('*')
        .eq('survey_id', surveyId)
        .order('field_order');
      if (error) {
        console.error('Error fetching fields:', error);
        throw error;
      }
      console.log('Fetched fields:', data);
      return data as SurveyField[];
    },
    enabled: !isNew && !!user
  });

  useEffect(() => {
    if (existingSurvey) {
      setSurvey(existingSurvey);
    }
  }, [existingSurvey]);

  const saveSurveyMutation = useMutation({
    mutationFn: async (surveyData: {
      title: string;
      description?: string;
      status?: string;
      settings?: Record<string, any>;
      created_by?: string;
    }) => {
      console.log('Saving survey:', surveyData);
      
      if (!user) {
        throw new Error('User not authenticated');
      }

      if (isNew) {
        // Create survey
        const { data: newSurvey, error: surveyError } = await supabase
          .from('surveys')
          .insert({
            ...surveyData,
            created_by: user.id
          })
          .select()
          .single();
        
        if (surveyError) {
          console.error('Error creating survey:', surveyError);
          throw surveyError;
        }
        console.log('Created new survey:', newSurvey);
        return newSurvey;
      } else {
        const { data, error } = await supabase
          .from('surveys')
          .update(surveyData)
          .eq('id', surveyId)
          .select()
          .single();
        if (error) {
          console.error('Error updating survey:', error);
          throw error;
        }
        console.log('Updated survey:', data);
        return data;
      }
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['surveys'] });
      queryClient.invalidateQueries({ queryKey: ['survey', surveyId] });
      queryClient.invalidateQueries({ queryKey: ['survey-fields', surveyId] });
      toast({
        title: "Survey saved",
        description: "Survey saved successfully.",
      });
      if (isNew) {
        navigate(`/admin/survey/builder/${data.id}`);
      }
    },
    onError: (error) => {
      console.error('Save survey error:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: `Failed to save survey: ${error.message}`,
      });
    }
  });

  const publishSurveyMutation = useMutation({
    mutationFn: async () => {
      const { error } = await supabase
        .from('surveys')
        .update({ status: 'published' })
        .eq('id', surveyId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['survey', surveyId] });
      setSurvey(prev => ({ ...prev, status: 'published' }));
      toast({
        title: "Survey published",
        description: "Your survey is now live and accepting responses.",
      });
    }
  });

  const handleSave = () => {
    if (!user) {
      toast({
        variant: "destructive",
        title: "Authentication Error",
        description: "You must be logged in to save surveys.",
      });
      return;
    }

    if (!survey.title?.trim()) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Survey title is required.",
      });
      return;
    }
    
    saveSurveyMutation.mutate({
      title: survey.title,
      description: survey.description,
      status: survey.status,
      settings: survey.settings || {}
    });
  };

  const handlePublish = () => {
    if (!user) {
      toast({
        variant: "destructive",
        title: "Authentication Error",
        description: "You must be logged in to publish surveys.",
      });
      return;
    }

    if (!survey.title?.trim()) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Survey title is required.",
      });
      return;
    }
    publishSurveyMutation.mutate();
  };

  const handleSurveyCreated = (newSurveyId: string) => {
    console.log('Survey created callback with ID:', newSurveyId);
    navigate(`/admin/survey/builder/${newSurveyId}`);
  };

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">Checking authentication...</div>
        </div>
      </AdminLayout>
    );
  }

  if (!user) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <p className="text-lg font-semibold mb-2">Authentication Required</p>
            <p className="text-muted-foreground mb-4">Please log in to access the survey builder.</p>
            <Button onClick={() => navigate('/admin/login')}>
              Go to Login
            </Button>
          </div>
        </div>
      </AdminLayout>
    );
  }

  if (surveyLoading || fieldsLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">Loading survey builder...</div>
        </div>
      </AdminLayout>
    );
  }

  console.log('SurveyBuilder render - isNew:', isNew, 'surveyId:', surveyId, 'user:', user?.id);

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">
              {isNew ? 'Create New Survey' : 'Edit Survey'}
            </h1>
            <p className="text-muted-foreground">
              Build your survey with drag-and-drop form fields
            </p>
          </div>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              onClick={() => navigate(`/form/${surveyId}`)}
              disabled={isNew}
            >
              <Eye className="w-4 h-4 mr-2" />
              Preview
            </Button>
            <Button 
              onClick={handleSave} 
              disabled={saveSurveyMutation.isPending}
            >
              <Save className="w-4 h-4 mr-2" />
              Save Survey
            </Button>
            {survey.status !== 'published' && !isNew && (
              <Button 
                onClick={handlePublish} 
                disabled={publishSurveyMutation.isPending}
                className="bg-green-600 hover:bg-green-700"
              >
                Publish
              </Button>
            )}
          </div>
        </div>

        <Tabs defaultValue="builder" className="space-y-4">
          <TabsList>
            <TabsTrigger value="builder">
              <Plus className="w-4 h-4 mr-2" />
              Form Builder
            </TabsTrigger>
            <TabsTrigger value="settings">
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </TabsTrigger>
          </TabsList>

          <TabsContent value="builder" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Survey Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Survey Title</label>
                  <Input
                    value={survey.title || ''}
                    onChange={(e) => setSurvey(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Enter survey title"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Description</label>
                  <Textarea
                    value={survey.description || ''}
                    onChange={(e) => setSurvey(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Enter survey description (optional)"
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>

            <FormBuilder 
              surveyId={isNew ? undefined : surveyId} 
              fields={fields} 
              onSurveyCreated={handleSurveyCreated}
            />
          </TabsContent>

          <TabsContent value="settings">
            <SurveySettings 
              settings={survey.settings || {}}
              onSettingsChange={(settings) => setSurvey(prev => ({ ...prev, settings }))}
            />
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
};

export default SurveyBuilder;
