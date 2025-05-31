
import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import FieldPalette from './FieldPalette';
import FieldEditor from './FieldEditor';
import FieldRenderer from '../render/FieldRenderer';
import { Trash2, Edit, GripVertical } from 'lucide-react';
import type { SurveyField, FieldType } from '@/types/SurveyTypes';

interface FormBuilderProps {
  surveyId?: string;
  fields: SurveyField[];
}

const FormBuilder: React.FC<FormBuilderProps> = ({ surveyId, fields }) => {
  const [selectedField, setSelectedField] = useState<SurveyField | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const addFieldMutation = useMutation({
    mutationFn: async (fieldData: Partial<SurveyField>) => {
      const { data, error } = await supabase
        .from('survey_fields')
        .insert({
          ...fieldData,
          survey_id: surveyId,
          field_order: fields.length
        })
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
    mutationFn: async ({ id, ...fieldData }: Partial<SurveyField> & { id: string }) => {
      const { data, error } = await supabase
        .from('survey_fields')
        .update(fieldData)
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['survey-fields', surveyId] });
      setIsEditing(false);
      setSelectedField(null);
      toast({
        title: "Field updated",
        description: "Field has been updated successfully.",
      });
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

  const handleFieldDrop = (fieldType: FieldType, label: string) => {
    if (!surveyId) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please save the survey first before adding fields.",
      });
      return;
    }

    const newField: Partial<SurveyField> = {
      field_type: fieldType,
      label,
      description: '',
      options: [],
      validation_rules: {},
      is_required: false
    };

    addFieldMutation.mutate(newField);
  };

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;

    const reorderedFields = Array.from(fields);
    const [reorderedItem] = reorderedFields.splice(result.source.index, 1);
    reorderedFields.splice(result.destination.index, 0, reorderedItem);

    const updates = reorderedFields.map((field, index) => ({
      id: field.id,
      field_order: index
    }));

    reorderFieldsMutation.mutate(updates);
  };

  const handleEditField = (field: SurveyField) => {
    setSelectedField(field);
    setIsEditing(true);
  };

  const handleUpdateField = (updatedField: Partial<SurveyField>) => {
    if (selectedField) {
      updateFieldMutation.mutate({
        id: selectedField.id,
        ...updatedField
      });
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
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
                        <Draggable key={field.id} draggableId={field.id} index={index}>
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              className={`relative group border rounded-lg p-4 bg-white ${
                                snapshot.isDragging ? 'shadow-lg' : ''
                              }`}
                            >
                              <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => handleEditField(field)}
                                >
                                  <Edit className="w-4 h-4" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => deleteFieldMutation.mutate(field.id)}
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

      <div className="lg:col-span-1">
        {isEditing && selectedField && (
          <FieldEditor
            field={selectedField}
            onSave={handleUpdateField}
            onCancel={() => {
              setIsEditing(false);
              setSelectedField(null);
            }}
          />
        )}
      </div>
    </div>
  );
};

export default FormBuilder;
