import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import FieldPalette from './FieldPalette';
import FieldEditor from './FieldEditor';
import FieldRenderer from '../render/FieldRenderer';
import { Trash2, Edit, GripVertical, Clock } from 'lucide-react';
import type { SurveyField, FieldType } from '@/types/SurveyTypes';
import type { LocalField, EditableField } from './FieldEditorTypes';

interface LocalField {
  tempId: string;
  field_type: FieldType;
  label: string;
  description: string;
  options: string[];
  validation_rules: Record<string, any>;
  is_required: boolean;
  field_order: number;
}

// Combined type for rendering fields
interface DisplayField extends Omit<SurveyField, 'id'> {
  id: string;
  isLocal: boolean;
  tempId?: string;
}

interface FormBuilderProps {
  surveyId?: string;
  fields: SurveyField[];
  onLocalFieldsChange?: (fields: LocalField[]) => void;
}

const FormBuilder: React.FC<FormBuilderProps> = ({ surveyId, fields, onLocalFieldsChange }) => {
  const [selectedField, setSelectedField] = useState<EditableField | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [localFields, setLocalFields] = useState<LocalField[]>([]);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Notify parent of local fields changes
  useEffect(() => {
    onLocalFieldsChange?.(localFields);
  }, [localFields, onLocalFieldsChange]);

  // Combine database fields and local fields for display
  const allFields: DisplayField[] = [
    ...fields.map(f => ({ ...f, isLocal: false })),
    ...localFields.map(f => ({ 
      id: f.tempId,
      survey_id: surveyId || '', 
      field_type: f.field_type,
      label: f.label,
      description: f.description,
      options: f.options,
      validation_rules: f.validation_rules,
      field_order: f.field_order,
      is_required: f.is_required,
      created_at: '',
      updated_at: '',
      isLocal: true,
      tempId: f.tempId
    }))
  ].sort((a, b) => a.field_order - b.field_order);

  const addFieldMutation = useMutation({
    mutationFn: async (fieldData: {
      field_type: string;
      label: string;
      description: string;
      options: string[];
      validation_rules: Record<string, any>;
      is_required: boolean;
    }) => {
      const { data, error } = await supabase
        .from('survey_fields')
        .insert({
          survey_id: surveyId!,
          field_type: fieldData.field_type,
          label: fieldData.label,
          description: fieldData.description,
          options: fieldData.options,
          validation_rules: fieldData.validation_rules,
          field_order: fields.length + localFields.length,
          is_required: fieldData.is_required
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
    if (surveyId) {
      // Survey exists, add field directly to database
      const newField = {
        field_type: fieldType,
        label,
        description: '',
        options: [],
        validation_rules: {},
        is_required: false
      };
      addFieldMutation.mutate(newField);
    } else {
      // Survey doesn't exist yet, add to local state
      const newLocalField: LocalField = {
        tempId: `temp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        field_type: fieldType,
        label,
        description: '',
        options: [],
        validation_rules: {},
        is_required: false,
        field_order: allFields.length
      };
      setLocalFields(prev => [...prev, newLocalField]);
      toast({
        title: "Field added",
        description: "Field will be saved when you save the survey.",
      });
    }
  };

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;

    const reorderedFields = Array.from(allFields);
    const [reorderedItem] = reorderedFields.splice(result.source.index, 1);
    reorderedFields.splice(result.destination.index, 0, reorderedItem);

    // Update field orders
    const updatedFields = reorderedFields.map((field, index) => ({
      ...field,
      field_order: index
    }));

    // Separate database fields and local fields
    const dbFields = updatedFields.filter(f => !f.isLocal);
    const localFieldsUpdated = updatedFields.filter(f => f.isLocal).map(f => ({
      tempId: f.tempId!,
      field_type: f.field_type,
      label: f.label,
      description: f.description || '',
      options: f.options || [],
      validation_rules: f.validation_rules || {},
      is_required: f.is_required || false,
      field_order: f.field_order
    }));

    // Update local fields immediately
    setLocalFields(localFieldsUpdated);

    // Update database fields if survey exists
    if (surveyId && dbFields.length > 0) {
      const updates = dbFields.map(field => ({
        id: field.id,
        field_order: field.field_order
      }));
      reorderFieldsMutation.mutate(updates);
    }
  };

  const handleEditField = (field: DisplayField) => {
    if (field.isLocal && field.tempId) {
      // Convert DisplayField to LocalField for editing
      const localField: LocalField = {
        tempId: field.tempId,
        field_type: field.field_type,
        label: field.label,
        description: field.description || '',
        options: field.options || [],
        validation_rules: field.validation_rules || {},
        is_required: field.is_required || false,
        field_order: field.field_order
      };
      setSelectedField(localField);
    } else {
      // Convert DisplayField to SurveyField for editing
      const surveyField: SurveyField = {
        id: field.id,
        survey_id: field.survey_id,
        field_type: field.field_type,
        label: field.label,
        description: field.description,
        options: field.options,
        validation_rules: field.validation_rules,
        field_order: field.field_order,
        is_required: field.is_required,
        created_at: field.created_at,
        updated_at: field.updated_at
      };
      setSelectedField(surveyField);
    }
    setIsEditing(true);
  };

  const handleUpdateField = (updatedField: Partial<EditableField>) => {
    if (selectedField) {
      if ('tempId' in selectedField) {
        // Update local field
        setLocalFields(prev => prev.map(f => 
          f.tempId === selectedField.tempId 
            ? { ...f, ...updatedField }
            : f
        ));
        setIsEditing(false);
        setSelectedField(null);
        toast({
          title: "Field updated",
          description: "Field will be saved when you save the survey.",
        });
      } else {
        // Update database field
        updateFieldMutation.mutate({
          id: selectedField.id,
          ...updatedField
        });
      }
    }
  };

  const handleDeleteField = (field: DisplayField) => {
    if (field.isLocal && field.tempId) {
      setLocalFields(prev => prev.filter(f => f.tempId !== field.tempId));
      toast({
        title: "Field removed",
        description: "Local field has been removed.",
      });
    } else {
      deleteFieldMutation.mutate(field.id);
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
            <div className="flex items-center justify-between">
              <CardTitle>Form Preview</CardTitle>
              {localFields.length > 0 && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {localFields.length} unsaved field{localFields.length !== 1 ? 's' : ''}
                </Badge>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {allFields.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <p>Drag fields from the palette to build your survey</p>
              </div>
            ) : (
              <DragDropContext onDragEnd={handleDragEnd}>
                <Droppable droppableId="form-fields">
                  {(provided) => (
                    <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-4">
                      {allFields.map((field, index) => (
                        <Draggable key={field.id} draggableId={field.id} index={index}>
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              className={`relative group border rounded-lg p-4 bg-white ${
                                snapshot.isDragging ? 'shadow-lg' : ''
                              } ${field.isLocal ? 'border-orange-200 bg-orange-50' : ''}`}
                            >
                              {field.isLocal && (
                                <Badge variant="outline" className="absolute top-1 left-1 text-xs">
                                  Draft
                                </Badge>
                              )}
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
                                  onClick={() => handleDeleteField(field)}
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
