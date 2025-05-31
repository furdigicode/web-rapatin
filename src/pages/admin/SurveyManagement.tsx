import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import AdminLayout from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useToast } from '@/hooks/use-toast';
import { Plus, MoreHorizontal, Eye, Edit, Copy, Trash2, BarChart3, Users, FileText, TrendingUp, Clock } from 'lucide-react';
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

  const StatCard = ({ title, value, icon: Icon, trend }: { title: string; value: string; icon: any; trend?: string }) => (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <div className="flex items-center gap-2">
              <h3 className="text-2xl font-bold">{value}</h3>
              {trend && (
                <Badge variant="secondary" className="text-xs">
                  {trend}
                </Badge>
              )}
            </div>
          </div>
          <Icon className="h-8 w-8 text-muted-foreground" />
        </div>
      </CardContent>
    </Card>
  );

  const PlaceholderSurveyCard = ({ title, description, status, responses, date }: {
    title: string;
    description: string;
    status: 'draft' | 'published' | 'closed';
    responses: number;
    date: string;
  }) => (
    <Card className="opacity-60">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg flex items-center gap-2">
              {title}
              <Badge variant="outline" className="text-xs">Sample</Badge>
            </CardTitle>
            <CardDescription>{description}</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            {status === 'published' && <Badge className="bg-green-100 text-green-800">Published</Badge>}
            {status === 'closed' && <Badge className="bg-red-100 text-red-800">Closed</Badge>}
            {status === 'draft' && <Badge className="bg-gray-100 text-gray-800">Draft</Badge>}
            <Button variant="ghost" size="sm" disabled>
              <MoreHorizontal className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-center text-sm text-muted-foreground">
          <span>{responses} responses</span>
          <span>{date}</span>
        </div>
      </CardContent>
    </Card>
  );

  const SurveySkeletonCard = () => (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div className="space-y-2 flex-1">
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-4 w-full" />
          </div>
          <div className="flex items-center gap-2">
            <Skeleton className="h-6 w-16" />
            <Skeleton className="h-8 w-8" />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-center">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-32" />
        </div>
      </CardContent>
    </Card>
  );

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold">Survey Management</h1>
              <p className="text-muted-foreground">Create and manage your surveys</p>
            </div>
            <Button disabled>
              <Plus className="w-4 h-4 mr-2" />
              Create Survey
            </Button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="space-y-3">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-8 w-16" />
            </div>
            <div className="space-y-3">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-8 w-20" />
            </div>
            <div className="space-y-3">
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-8 w-24" />
            </div>
            <div className="space-y-3">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-8 w-16" />
            </div>
          </div>

          {/* Survey Cards */}
          <div className="grid gap-4">
            {Array.from({ length: 3 }).map((_, index) => (
              <SurveySkeletonCard key={index} />
            ))}
          </div>
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

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <StatCard
            title="Total Surveys"
            value={surveys?.length.toString() || "0"}
            icon={FileText}
            trend="+2 this week"
          />
          <StatCard
            title="Active Surveys"
            value={surveys?.filter(s => s.status === 'published').length.toString() || "0"}
            icon={BarChart3}
            trend="3 published"
          />
          <StatCard
            title="Total Responses"
            value="247"
            icon={Users}
            trend="+18 today"
          />
          <StatCard
            title="Response Rate"
            value="68%"
            icon={TrendingUp}
            trend="+5% this month"
          />
        </div>

        <div className="grid gap-4">
          {surveys?.length === 0 ? (
            <>
              {/* Empty State with Placeholder Cards */}
              <Card className="border-dashed">
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <BarChart3 className="w-12 h-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No surveys yet</h3>
                  <p className="text-muted-foreground text-center mb-4">
                    Get started by creating your first survey. Here's what your surveys will look like:
                  </p>
                  <Button onClick={() => navigate('/admin/survey/builder/new')}>
                    <Plus className="w-4 h-4 mr-2" />
                    Create Your First Survey
                  </Button>
                </CardContent>
              </Card>

              {/* Sample Survey Cards */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-muted-foreground">Survey Examples</h3>
                
                <PlaceholderSurveyCard
                  title="Customer Satisfaction Survey"
                  description="Gather feedback from your customers about their experience with your product or service."
                  status="published"
                  responses={156}
                  date="Last updated 3 days ago"
                />

                <PlaceholderSurveyCard
                  title="Employee Feedback Form"
                  description="Collect valuable insights from your team members about workplace satisfaction and improvements."
                  status="draft"
                  responses={0}
                  date="Created 1 week ago"
                />

                <PlaceholderSurveyCard
                  title="Product Research Survey"
                  description="Research customer needs and preferences for your upcoming product launches."
                  status="closed"
                  responses={89}
                  date="Completed 2 weeks ago"
                />
              </div>

              {/* Quick Start Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                <Card className="border-dashed hover:border-solid transition-colors cursor-pointer" onClick={() => navigate('/admin/survey/builder/new')}>
                  <CardContent className="p-6 text-center">
                    <Plus className="w-8 h-8 text-muted-foreground mx-auto mb-3" />
                    <h4 className="font-semibold mb-2">Quick Start</h4>
                    <p className="text-sm text-muted-foreground">Create a survey from scratch with our drag-and-drop builder</p>
                  </CardContent>
                </Card>

                <Card className="border-dashed">
                  <CardContent className="p-6 text-center">
                    <FileText className="w-8 h-8 text-muted-foreground mx-auto mb-3" />
                    <h4 className="font-semibold mb-2">Templates</h4>
                    <p className="text-sm text-muted-foreground">Choose from pre-built survey templates</p>
                    <Badge variant="secondary" className="mt-2">Coming Soon</Badge>
                  </CardContent>
                </Card>

                <Card className="border-dashed">
                  <CardContent className="p-6 text-center">
                    <BarChart3 className="w-8 h-8 text-muted-foreground mx-auto mb-3" />
                    <h4 className="font-semibold mb-2">Analytics</h4>
                    <p className="text-sm text-muted-foreground">View detailed response analytics and insights</p>
                    <Badge variant="secondary" className="mt-2">Available Soon</Badge>
                  </CardContent>
                </Card>
              </div>
            </>
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
