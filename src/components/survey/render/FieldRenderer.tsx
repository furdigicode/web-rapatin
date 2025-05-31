
import React from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Star } from 'lucide-react';
import type { SurveyField } from '@/types/SurveyTypes';

interface FieldRendererProps {
  field: SurveyField;
  value?: any;
  onChange?: (value: any) => void;
  disabled?: boolean;
}

const FieldRenderer: React.FC<FieldRendererProps> = ({ field, value, onChange, disabled = false }) => {
  const handleChange = (newValue: any) => {
    if (!disabled && onChange) {
      onChange(newValue);
    }
  };

  const renderField = () => {
    switch (field.field_type) {
      case 'text':
        return (
          <Input
            value={value || ''}
            onChange={(e) => handleChange(e.target.value)}
            placeholder={`Enter ${field.label.toLowerCase()}`}
            disabled={disabled}
            minLength={field.validation_rules?.minLength}
            maxLength={field.validation_rules?.maxLength}
          />
        );

      case 'textarea':
        return (
          <Textarea
            value={value || ''}
            onChange={(e) => handleChange(e.target.value)}
            placeholder={`Enter ${field.label.toLowerCase()}`}
            disabled={disabled}
            minLength={field.validation_rules?.minLength}
            maxLength={field.validation_rules?.maxLength}
            rows={4}
          />
        );

      case 'number':
        return (
          <Input
            type="number"
            value={value || ''}
            onChange={(e) => handleChange(e.target.value)}
            placeholder="Enter number"
            disabled={disabled}
            min={field.validation_rules?.min}
            max={field.validation_rules?.max}
          />
        );

      case 'email':
        return (
          <Input
            type="email"
            value={value || ''}
            onChange={(e) => handleChange(e.target.value)}
            placeholder="Enter email address"
            disabled={disabled}
          />
        );

      case 'phone':
        return (
          <Input
            type="tel"
            value={value || ''}
            onChange={(e) => handleChange(e.target.value)}
            placeholder="Enter phone number"
            disabled={disabled}
          />
        );

      case 'date':
        return (
          <Input
            type="date"
            value={value || ''}
            onChange={(e) => handleChange(e.target.value)}
            disabled={disabled}
          />
        );

      case 'radio':
        return (
          <RadioGroup
            value={value || ''}
            onValueChange={handleChange}
            disabled={disabled}
          >
            {field.options?.map((option, index) => (
              <div key={index} className="flex items-center space-x-2">
                <RadioGroupItem value={option} id={`${field.id}-${index}`} />
                <Label htmlFor={`${field.id}-${index}`}>{option}</Label>
              </div>
            ))}
          </RadioGroup>
        );

      case 'checkbox':
        return (
          <div className="space-y-2">
            {field.options?.map((option, index) => (
              <div key={index} className="flex items-center space-x-2">
                <Checkbox
                  id={`${field.id}-${index}`}
                  checked={(value || []).includes(option)}
                  onCheckedChange={(checked) => {
                    const currentValues = value || [];
                    if (checked) {
                      handleChange([...currentValues, option]);
                    } else {
                      handleChange(currentValues.filter((v: string) => v !== option));
                    }
                  }}
                  disabled={disabled}
                />
                <Label htmlFor={`${field.id}-${index}`}>{option}</Label>
              </div>
            ))}
          </div>
        );

      case 'select':
        return (
          <Select value={value || ''} onValueChange={handleChange} disabled={disabled}>
            <SelectTrigger>
              <SelectValue placeholder="Select an option" />
            </SelectTrigger>
            <SelectContent>
              {field.options?.map((option, index) => (
                <SelectItem key={index} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );

      case 'rating':
        const maxRating = 5;
        return (
          <div className="flex space-x-1">
            {[...Array(maxRating)].map((_, index) => (
              <button
                key={index}
                type="button"
                onClick={() => handleChange(index + 1)}
                disabled={disabled}
                className="focus:outline-none"
              >
                <Star
                  className={`w-6 h-6 ${
                    index < (value || 0)
                      ? 'text-yellow-400 fill-current'
                      : 'text-gray-300'
                  }`}
                />
              </button>
            ))}
          </div>
        );

      case 'scale':
        const maxScale = 10;
        return (
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>1 (Strongly Disagree)</span>
              <span>10 (Strongly Agree)</span>
            </div>
            <div className="flex space-x-2">
              {[...Array(maxScale)].map((_, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => handleChange(index + 1)}
                  disabled={disabled}
                  className={`w-8 h-8 rounded-full border-2 text-sm font-medium ${
                    value === index + 1
                      ? 'bg-primary text-primary-foreground border-primary'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  {index + 1}
                </button>
              ))}
            </div>
          </div>
        );

      case 'file':
        return (
          <Input
            type="file"
            onChange={(e) => handleChange(e.target.files?.[0])}
            disabled={disabled}
            accept={field.validation_rules?.fileTypes?.join(',')}
          />
        );

      case 'section':
        return (
          <div className="border-b pb-2">
            <h3 className="text-lg font-semibold">{field.label}</h3>
            {field.description && (
              <p className="text-muted-foreground">{field.description}</p>
            )}
          </div>
        );

      default:
        return <div>Unsupported field type: {field.field_type}</div>;
    }
  };

  if (field.field_type === 'section') {
    return renderField();
  }

  return (
    <div className="space-y-2">
      <Label className="text-base font-medium">
        {field.label}
        {field.is_required && <span className="text-red-500 ml-1">*</span>}
      </Label>
      {field.description && (
        <p className="text-sm text-muted-foreground">{field.description}</p>
      )}
      {renderField()}
    </div>
  );
};

export default FieldRenderer;
