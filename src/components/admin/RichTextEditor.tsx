import React from 'react';
import { Textarea } from '@/components/ui/textarea';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({ 
  value, 
  onChange,
  placeholder = "Tulis konten artikel di sini..."
}) => {
  return (
    <div className="rich-text-editor">
      <Textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="min-h-[300px] resize-y font-mono text-sm"
        rows={15}
      />
      <div className="mt-2 text-xs text-muted-foreground">
        💡 Tip: Anda bisa menggunakan HTML tags untuk formatting (contoh: &lt;h2&gt;, &lt;p&gt;, &lt;strong&gt;, &lt;em&gt;, &lt;ul&gt;, &lt;ol&gt;, &lt;li&gt;)
      </div>
    </div>
  );
};

export default RichTextEditor;