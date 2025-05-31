
import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import FieldPalette from './FieldPalette';
import InlineFieldEditor from './InlineFieldEditor';
import FieldRenderer from '../render/FieldRenderer';
import { Trash2, Edit, GripVertical } from 'lucide-react';
import type { SurveyField, FieldType } from '@/types/SurveyTypes';

interface FormBuilderProps {
  surveyId?: string;
  fields: SurveyField[];
  onSurveyCreated?: (surveyId: string) => void;
}

const FormBuilder: React.FC<FormBuilderProps> = ({ 
  surveyId, 
  fields,
  onSurveyCreated
}) => {
  const [editingFieldId, setEditingFieldId] = useState<string | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const addFieldMutation = useMutation({
    mutationFn: async (fieldData: {
      survey_id: string;
      field_type: string;
      label: string;
      description: string;
      options: string[];
      validation_rules: Record<string, any>;
      is_required: boolean;
      field_order: number;
    }) => {
      const { data, error } = await supabase
        .from('survey_fields')
        .insert(fieldData)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['survey-fields', surveyId] });
      toast({
        title: "Field added",
        description: "New field has been added to your survey.",
      });
    }
  });

  const updateFieldMutation = useMutation({
    mutationFn: async (fieldData: {
      id: string;
      field_type?: string;
      label?: string;
      description?: string;
      options?: string[];
      validation_rules?: Record<string, any>;
      is_required?: boolean;
    }) => {
      const { id, ...updateData } = fieldData;
      const { data, error } = await supabase
        .from('survey_fields')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['survey-fields', surveyId] });
    }
  });

  const deleteFieldMutation = useMutation({
    mutationFn: async (fieldId: string) => {
      const { error } = await supabase
        .from('survey_fields')
        .delete()
        .eq('id', fieldId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['survey-fields', surveyId] });
      toast({
        title: "Field deleted",
        description: "Field has been removed from your survey.",
      });
    }
  });

  const reorderFieldsMutation = useMutation({
    mutationFn: async (reorderedFields: { id: string; field_order: number }[]) => {
      const updates = reorderedFields.map(field => 
        supabase
          .from('survey_fields')
          .update({ field_order: field.field_order })
          .eq('id', field.id)
      );
      
      await Promise.all(updates);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['survey-fields', surveyId] });
    }
  });

  const createSurveyMutation = useMutation({
    mutationFn: async (fieldData: { fieldType: FieldType; label: string }) => {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      // Create survey first
      const { data: newSurvey, error: surveyError } = await supabase
        .from('surveys')
        .insert({
          title: 'Untitled Survey',
          description: '',
          status: 'draft',
          created_by: user.id,
          settings: {}
        })
        .select()
        .single();
      
      if (surveyError) throw surveyError;

      // Then create the field
      const { data: newField, error: fieldError } = await supabase
        .from('survey_fields')
        .insert({
          survey_id: newSurvey.id,
          field_type: fieldData.fieldType,
          label: fieldData.label,
          description: '',
          options: [],
          validation_rules: {},
          field_order: 0,
          is_required: false
        })
        .select()
        .single();

      if (fieldError) throw fieldError;

      return { survey: newSurvey, field: newField };
    },
    onSuccess: (data) => {
      onSurveyCreated?.(data.survey.id);
      toast({
        title: "Survey created",
        description: "New survey created with your first field.",
      });
    }
  });

  const handleFieldDrop = (fieldType: FieldType, label: string) => {
    if (surveyId) {
      // Survey exists, add field directly
      const newField = {
        survey_id: surveyId,
        field_type: fieldType,
        label,
        description: '',
        options: [],
        validation_rules: {},
        is_required: false,
        field_order: fields.length
      };
      addFieldMutation.mutate(newField);
    } else {
      // No survey yet, create survey with first field
      createSurveyMutation.mutate({ fieldType, label });
    }
  };

  const handleDragEnd = (result: any) => {
    if (!result.destination || !surveyId) return;

    const reorderedFields = Array.from(fields);
    const [reorderedItem] = reorderedFields.splice(result.source.index, 1);
    reorderedFields.splice(result.destination.index, 0, reorderedItem);

    // Update field orders
    const updates = reorderedFields.map((field, index) => ({
      id: field.id,
      field_order: index
    }));

    reorderFieldsMutation.mutate(updates);
  };

  const handleEditField = (field: SurveyField) => {
    setEditingFieldId(field.id === editingFieldId ? null : field.id);
  };

  const handleUpdateField = (updatedField: Partial<SurveyField>) => {
    if (editingFieldId) {
      updateFieldMutation.mutate({
        id: editingFieldId,
        ...updatedField
      });
    }
  };

  const handleDeleteField = (field: SurveyField) => {
    deleteFieldMutation.mutate(field.id);
    if (editingFieldId === field.id) {
      setEditingFieldId(null);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-1">
        <FieldPalette onFieldDrop={handleFieldDrop} />
      </div>

      <div className="lg:col-span-2">
        <Card>
          <CardHeader>
            <CardTitle>Form Preview</CardTitle>
          </CardHeader>
          <CardContent>
            {fields.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <p>Drag fields from the palette to build your survey</p>
              </div>
            ) : (
              <DragDropContext onDragEnd={handleDragEnd}>
                <Droppable droppableId="form-fields">
                  {(provided) => (
                    <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-4">
                      {fields.map((field, index) => (
                        <div key={field.id}>
                          <Draggable draggableId={field.id} index={index}>
                            {(provided, snapshot) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                className={`relative group border rounded-lg p-4 bg-white cursor-pointer hover:border-blue-300 transition-colors ${
                                  snapshot.isDragging ? 'shadow-lg' : ''
                                } ${editingFieldId === field.id ? 'border-blue-500 bg-blue-50' : ''}`}
                                onClick={() => handleEditField(field)}
                              >
                                <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleEditField(field);
                                    }}
                                  >
                                    <Edit className="w-4 h-4" />
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleDeleteField(field);
                                    }}
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </Button>
                                  <div {...provided.dragHandleProps}>
                                    <Button size="sm" variant="ghost">
                                      <GripVertical className="w-4 h-4" />
                                    </Button>
                                  </div>
                                </div>
                                <FieldRenderer field={field} disabled />
                              </div>
                            )}
                          </Draggable>
                          
                          {editingFieldId === field.id && (
                            <InlineFieldEditor
                              field={field}
                              onSave={handleUpdateField}
                              onCancel={() => setEditingFieldId(null)}
                            />
                          )}
                        </div>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </DragDropContext>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default FormBuilder;
