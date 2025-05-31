
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Type, 
  AlignLeft, 
  CircleDot, 
  CheckSquare, 
  ChevronDown, 
  Hash, 
  Calendar, 
  Mail, 
  Phone, 
  Upload, 
  Star,
  BarChart3,
  Minus
} from 'lucide-react';
import type { FieldType } from '@/types/SurveyTypes';

interface FieldPaletteProps {
  onFieldDrop: (fieldType: FieldType, label: string) => void;
}

const fieldTypes = [
  { type: 'text' as FieldType, label: 'Short Text', icon: Type },
  { type: 'textarea' as FieldType, label: 'Long Text', icon: AlignLeft },
  { type: 'radio' as FieldType, label: 'Multiple Choice', icon: CircleDot },
  { type: 'checkbox' as FieldType, label: 'Checkboxes', icon: CheckSquare },
  { type: 'select' as FieldType, label: 'Dropdown', icon: ChevronDown },
  { type: 'number' as FieldType, label: 'Number', icon: Hash },
  { type: 'date' as FieldType, label: 'Date', icon: Calendar },
  { type: 'email' as FieldType, label: 'Email', icon: Mail },
  { type: 'phone' as FieldType, label: 'Phone', icon: Phone },
  { type: 'file' as FieldType, label: 'File Upload', icon: Upload },
  { type: 'rating' as FieldType, label: 'Rating', icon: Star },
  { type: 'scale' as FieldType, label: 'Linear Scale', icon: BarChart3 },
  { type: 'section' as FieldType, label: 'Section Header', icon: Minus }
];

const FieldPalette: React.FC<FieldPaletteProps> = ({ onFieldDrop }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Field Types</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {fieldTypes.map((fieldType) => {
          const IconComponent = fieldType.icon;
          return (
            <Button
              key={fieldType.type}
              variant="outline"
              className="w-full justify-start h-auto p-3"
              onClick={() => onFieldDrop(fieldType.type, fieldType.label)}
            >
              <IconComponent className="w-4 h-4 mr-3" />
              <span className="text-sm">{fieldType.label}</span>
            </Button>
          );
        })}
      </CardContent>
    </Card>
  );
};

export default FieldPalette;
