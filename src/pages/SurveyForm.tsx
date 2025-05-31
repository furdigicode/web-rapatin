
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import FieldRenderer from '@/components/survey/render/FieldRenderer';
import { CheckCircle } from 'lucide-react';
import type { Survey, SurveyField } from '@/types/SurveyTypes';

const SurveyForm = () => {
  const { formId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [responses, setResponses] = useState<Record<string, any>>({});
  const [respondentInfo, setRespondentInfo] = useState({
    name: '',
    email: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [startTime] = useState(Date.now());

  const { data: survey, isLoading: surveyLoading, error: surveyError } = useQuery({
    queryKey: ['public-survey', formId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('surveys')
        .select('*')
        .eq('id', formId)
        .eq('status', 'published')
        .single();
      if (error) throw error;
      return data as Survey;
    }
  });

  const { data: fields = [], isLoading: fieldsLoading } = useQuery({
    queryKey: ['public-survey-fields', formId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('survey_fields')
        .select('*')
        .eq('survey_id', formId)
        .order('field_order');
      if (error) throw error;
      return data as SurveyField[];
    },
    enabled: !!formId
  });

  const submitResponseMutation = useMutation({
    mutationFn: async () => {
      const completionTimeSeconds = Math.floor((Date.now() - startTime) / 1000);
      
      // Create survey response
      const { data: responseData, error: responseError } = await supabase
        .from('survey_responses')
        .insert({
          survey_id: formId,
          respondent_email: survey?.settings?.collect_email ? respondentInfo.email : null,
          respondent_name: survey?.settings?.collect_name ? respondentInfo.name : null,
          completion_time_seconds: completionTimeSeconds,
          is_complete: true
        })
        .select()
        .single();

      if (responseError) throw responseError;

      // Create field responses
      const fieldResponses = Object.entries(responses)
        .filter(([_, value]) => value !== undefined && value !== '')
        .map(([fieldId, value]) => ({
          response_id: responseData.id,
          field_id: fieldId,
          value: typeof value === 'object' ? JSON.stringify(value) : String(value)
        }));

      if (fieldResponses.length > 0) {
        const { error: fieldError } = await supabase
          .from('survey_field_responses')
          .insert(fieldResponses);

        if (fieldError) throw fieldError;
      }

      return responseData;
    },
    onSuccess: () => {
      setIsSubmitted(true);
      toast({
        title: "Response submitted",
        description: "Thank you for completing the survey!",
      });
    },
    onError: (error) => {
      console.error('Survey submission error:', error);
      toast({
        variant: "destructive",
        title: "Submission failed",
        description: "There was an error submitting your response. Please try again.",
      });
    }
  });

  const handleFieldChange = (fieldId: string, value: any) => {
    setResponses(prev => ({
      ...prev,
      [fieldId]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    const requiredFields = fields.filter(field => field.is_required);
    const missingFields = requiredFields.filter(field => 
      !responses[field.id] || responses[field.id] === ''
    );

    if (missingFields.length > 0) {
      toast({
        variant: "destructive",
        title: "Missing required fields",
        description: "Please fill in all required fields before submitting.",
      });
      return;
    }

    // Validate respondent info if required
    if (survey?.settings?.collect_email && !respondentInfo.email) {
      toast({
        variant: "destructive",
        title: "Email required",
        description: "Please provide your email address.",
      });
      return;
    }

    if (survey?.settings?.collect_name && !respondentInfo.name) {
      toast({
        variant: "destructive",
        title: "Name required",
        description: "Please provide your name.",
      });
      return;
    }

    submitResponseMutation.mutate();
  };

  const getProgress = () => {
    const totalFields = fields.filter(field => field.field_type !== 'section').length;
    const completedFields = Object.keys(responses).length;
    return totalFields > 0 ? (completedFields / totalFields) * 100 : 0;
  };

  if (surveyLoading || fieldsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">Loading survey...</div>
      </div>
    );
  }

  if (surveyError || !survey) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="max-w-md w-full">
          <CardContent className="text-center py-12">
            <h2 className="text-xl font-semibold mb-2">Survey not found</h2>
            <p className="text-muted-foreground mb-4">
              This survey may not exist or has been closed.
            </p>
            <Button onClick={() => navigate('/')}>
              Return to Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="max-w-md w-full">
          <CardContent className="text-center py-12">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Thank you!</h2>
            <p className="text-muted-foreground">
              {survey.settings?.thank_you_message || "Your response has been submitted successfully."}
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">{survey.title}</CardTitle>
            {survey.description && (
              <p className="text-muted-foreground">{survey.description}</p>
            )}
            {survey.settings?.welcome_message && (
              <p className="text-sm bg-blue-50 p-3 rounded-lg border">
                {survey.settings.welcome_message}
              </p>
            )}
          </CardHeader>
          <CardContent>
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-muted-foreground">Progress</span>
                <span className="text-sm text-muted-foreground">
                  {Math.round(getProgress())}%
                </span>
              </div>
              <Progress value={getProgress()} className="h-2" />
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {(survey.settings?.collect_name || survey.settings?.collect_email) && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Contact Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {survey.settings?.collect_name && (
                      <div>
                        <Label htmlFor="respondent-name">
                          Name {!survey.settings?.allow_anonymous && <span className="text-red-500">*</span>}
                        </Label>
                        <Input
                          id="respondent-name"
                          value={respondentInfo.name}
                          onChange={(e) => setRespondentInfo(prev => ({ ...prev, name: e.target.value }))}
                          placeholder="Enter your name"
                          required={!survey.settings?.allow_anonymous}
                        />
                      </div>
                    )}
                    {survey.settings?.collect_email && (
                      <div>
                        <Label htmlFor="respondent-email">
                          Email {!survey.settings?.allow_anonymous && <span className="text-red-500">*</span>}
                        </Label>
                        <Input
                          id="respondent-email"
                          type="email"
                          value={respondentInfo.email}
                          onChange={(e) => setRespondentInfo(prev => ({ ...prev, email: e.target.value }))}
                          placeholder="Enter your email"
                          required={!survey.settings?.allow_anonymous}
                        />
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

              {fields.map((field) => (
                <div key={field.id}>
                  <FieldRenderer
                    field={field}
                    value={responses[field.id]}
                    onChange={(value) => handleFieldChange(field.id, value)}
                  />
                </div>
              ))}

              <Button 
                type="submit" 
                className="w-full" 
                disabled={submitResponseMutation.isPending}
              >
                {submitResponseMutation.isPending ? 'Submitting...' : 'Submit Survey'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SurveyForm;
