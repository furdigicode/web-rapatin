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
import { Save, Eye, Settings, Plus, AlertTriangle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import FormBuilder from '@/components/survey/builder/FormBuilder';
import SurveySettings from '@/components/survey/builder/SurveySettings';
import type { Survey, SurveyField } from '@/types/SurveyTypes';
import type { LocalField } from '@/components/survey/builder/FieldEditorTypes';

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

  const [localFields, setLocalFields] = useState<LocalField[]>([]);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  const { data: existingSurvey, isLoading: surveyLoading } = useQuery({
    queryKey: ['survey', surveyId],
    queryFn: async () => {
      if (isNew) return null;
      const { data, error } = await supabase
        .from('surveys')
        .select('*')
        .eq('id', surveyId)
        .single();
      if (error) throw error;
      return data as Survey;
    },
    enabled: !isNew
  });

  const { data: fields = [], isLoading: fieldsLoading } = useQuery({
    queryKey: ['survey-fields', surveyId],
    queryFn: async () => {
      if (isNew) return [];
      const { data, error } = await supabase
        .from('survey_fields')
        .select('*')
        .eq('survey_id', surveyId)
        .order('field_order');
      if (error) throw error;
      return data as SurveyField[];
    },
    enabled: !isNew
  });

  useEffect(() => {
    if (existingSurvey) {
      setSurvey(existingSurvey);
    }
  }, [existingSurvey]);

  // Track unsaved changes
  useEffect(() => {
    setHasUnsavedChanges(localFields.length > 0);
  }, [localFields]);

  const saveSurveyMutation = useMutation({
    mutationFn: async (surveyData: {
      title: string;
      description?: string;
      status?: string;
      settings?: Record<string, any>;
      created_by?: string;
    }) => {
      if (isNew) {
        // Get current user
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('User not authenticated');

        // Create survey first
        const { data: newSurvey, error: surveyError } = await supabase
          .from('surveys')
          .insert({
            ...surveyData,
            created_by: user.id
          })
          .select()
          .single();
        
        if (surveyError) throw surveyError;

        // If there are local fields, create them all
        if (localFields.length > 0) {
          const fieldsToCreate = localFields.map(field => ({
            survey_id: newSurvey.id,
            field_type: field.field_type,
            label: field.label,
            description: field.description,
            options: field.options,
            validation_rules: field.validation_rules,
            field_order: field.field_order,
            is_required: field.is_required
          }));

          const { error: fieldsError } = await supabase
            .from('survey_fields')
            .insert(fieldsToCreate);

          if (fieldsError) throw fieldsError;

          // Clear local fields after successful creation
          setLocalFields([]);
        }

        return newSurvey;
      } else {
        const { data, error } = await supabase
          .from('surveys')
          .update(surveyData)
          .eq('id', surveyId)
          .select()
          .single();
        if (error) throw error;
        return data;
      }
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['surveys'] });
      queryClient.invalidateQueries({ queryKey: ['survey', surveyId] });
      queryClient.invalidateQueries({ queryKey: ['survey-fields', surveyId] });
      toast({
        title: "Survey saved",
        description: localFields.length > 0 
          ? `Survey and ${localFields.length} field${localFields.length !== 1 ? 's' : ''} saved successfully.`
          : "Survey saved successfully.",
      });
      if (isNew) {
        navigate(`/admin/survey/builder/${data.id}`);
      }
    },
    onError: () => {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save survey.",
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

  if (surveyLoading || fieldsLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">Loading survey builder...</div>
        </div>
      </AdminLayout>
    );
  }

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
              disabled={isNew || hasUnsavedChanges}
            >
              <Eye className="w-4 h-4 mr-2" />
              Preview
            </Button>
            <Button 
              onClick={handleSave} 
              disabled={saveSurveyMutation.isPending}
              className={hasUnsavedChanges ? 'bg-orange-600 hover:bg-orange-700' : ''}
            >
              <Save className="w-4 h-4 mr-2" />
              Save{hasUnsavedChanges && ' Changes'}
            </Button>
            {survey.status !== 'published' && !isNew && !hasUnsavedChanges && (
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

        {hasUnsavedChanges && (
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              You have {localFields.length} unsaved field{localFields.length !== 1 ? 's' : ''}. 
              Save your survey to persist these changes.
            </AlertDescription>
          </Alert>
        )}

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
              onLocalFieldsChange={setLocalFields}
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
