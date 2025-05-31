
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Plus, Trash2, Save, X } from 'lucide-react';
import type { SurveyField } from '@/types/SurveyTypes';

interface FieldEditorProps {
  field: SurveyField;
  onSave: (field: Partial<SurveyField>) => void;
  onCancel: () => void;
}

const FieldEditor: React.FC<FieldEditorProps> = ({ field, onSave, onCancel }) => {
  const [editingField, setEditingField] = useState<Partial<SurveyField>>(field);
  const [options, setOptions] = useState<string[]>(field.options || []);

  useEffect(() => {
    setEditingField(field);
    setOptions(field.options || []);
  }, [field]);

  const hasOptions = ['radio', 'checkbox', 'select'].includes(field.field_type);
  const hasValidation = ['text', 'textarea', 'number', 'email'].includes(field.field_type);

  const handleSave = () => {
    onSave({
      ...editingField,
      options: hasOptions ? options : []
    });
  };

  const addOption = () => {
    setOptions([...options, '']);
  };

  const updateOption = (index: number, value: string) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const removeOption = (index: number) => {
    setOptions(options.filter((_, i) => i !== index));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Edit Field</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="label">Field Label</Label>
          <Input
            id="label"
            value={editingField.label || ''}
            onChange={(e) => setEditingField(prev => ({ ...prev, label: e.target.value }))}
            placeholder="Enter field label"
          />
        </div>

        <div>
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={editingField.description || ''}
            onChange={(e) => setEditingField(prev => ({ ...prev, description: e.target.value }))}
            placeholder="Enter field description (optional)"
            rows={2}
          />
        </div>

        <div className="flex items-center space-x-2">
          <Switch
            id="required"
            checked={editingField.is_required || false}
            onCheckedChange={(checked) => setEditingField(prev => ({ ...prev, is_required: checked }))}
          />
          <Label htmlFor="required">Required field</Label>
        </div>

        {hasOptions && (
          <>
            <Separator />
            <div>
              <div className="flex justify-between items-center mb-2">
                <Label>Options</Label>
                <Button size="sm" onClick={addOption}>
                  <Plus className="w-4 h-4 mr-1" />
                  Add Option
                </Button>
              </div>
              <div className="space-y-2">
                {options.map((option, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      value={option}
                      onChange={(e) => updateOption(index, e.target.value)}
                      placeholder={`Option ${index + 1}`}
                    />
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => removeOption(index)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {hasValidation && (
          <>
            <Separator />
            <div className="space-y-3">
              <Label>Validation</Label>
              {(field.field_type === 'text' || field.field_type === 'textarea') && (
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label className="text-xs">Min Length</Label>
                    <Input
                      type="number"
                      value={editingField.validation_rules?.minLength || ''}
                      onChange={(e) => setEditingField(prev => ({
                        ...prev,
                        validation_rules: {
                          ...prev.validation_rules,
                          minLength: parseInt(e.target.value) || undefined
                        }
                      }))}
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <Label className="text-xs">Max Length</Label>
                    <Input
                      type="number"
                      value={editingField.validation_rules?.maxLength || ''}
                      onChange={(e) => setEditingField(prev => ({
                        ...prev,
                        validation_rules: {
                          ...prev.validation_rules,
                          maxLength: parseInt(e.target.value) || undefined
                        }
                      }))}
                      placeholder="1000"
                    />
                  </div>
                </div>
              )}
              {field.field_type === 'number' && (
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label className="text-xs">Min Value</Label>
                    <Input
                      type="number"
                      value={editingField.validation_rules?.min || ''}
                      onChange={(e) => setEditingField(prev => ({
                        ...prev,
                        validation_rules: {
                          ...prev.validation_rules,
                          min: parseInt(e.target.value) || undefined
                        }
                      }))}
                    />
                  </div>
                  <div>
                    <Label className="text-xs">Max Value</Label>
                    <Input
                      type="number"
                      value={editingField.validation_rules?.max || ''}
                      onChange={(e) => setEditingField(prev => ({
                        ...prev,
                        validation_rules: {
                          ...prev.validation_rules,
                          max: parseInt(e.target.value) || undefined
                        }
                      }))}
                    />
                  </div>
                </div>
              )}
            </div>
          </>
        )}

        <Separator />
        <div className="flex gap-2">
          <Button onClick={handleSave} className="flex-1">
            <Save className="w-4 h-4 mr-2" />
            Save
          </Button>
          <Button variant="outline" onClick={onCancel}>
            <X className="w-4 h-4 mr-2" />
            Cancel
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default FieldEditor;
