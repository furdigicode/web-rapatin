import React, { useMemo, useEffect, useState } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

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
  const [ReactQuill, setReactQuill] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  
  const modules = useMemo(() => ({
    toolbar: {
      container: [
        [{ 'header': [1, 2, 3, false] }],
        ['bold', 'italic', 'underline', 'strike'],
        [{ 'list': 'ordered'}, { 'list': 'bullet' }],
        [{ 'script': 'sub'}, { 'script': 'super' }],
        [{ 'indent': '-1'}, { 'indent': '+1' }],
        ['blockquote', 'code-block'],
        [{ 'align': [] }],
        ['link', 'image'],
        [{ 'color': [] }, { 'background': [] }],
        ['clean']
      ],
    },
    clipboard: {
      matchVisual: false,
    }
  }), []);

  const formats = [
    'header',
    'bold', 'italic', 'underline', 'strike',
    'list', 'bullet', 'indent',
    'script',
    'blockquote', 'code-block',
    'align',
    'link', 'image',
    'color', 'background',
    'clean'
  ];

  useEffect(() => {
    const loadReactQuill = async () => {
      try {
        setIsLoading(true);
        const { default: QuillComponent } = await import('react-quill');
        await import('react-quill/dist/quill.snow.css');
        setReactQuill(() => QuillComponent);
        setIsLoading(false);
      } catch (error) {
        console.error('Failed to load ReactQuill:', error);
        setHasError(true);
        setIsLoading(false);
      }
    };

    loadReactQuill();
  }, []);

  if (isLoading) {
    return (
      <div className="rich-text-editor">
        <Skeleton className="h-[300px] w-full" />
      </div>
    );
  }

  if (hasError || !ReactQuill) {
    return (
      <div className="rich-text-editor">
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full min-h-[300px] p-3 border border-input rounded-md bg-background text-foreground resize-none focus:outline-none focus:ring-2 focus:ring-ring"
        />
      </div>
    );
  }

  return (
    <div className="rich-text-editor">
      <ReactQuill
        theme="snow"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        modules={modules}
        formats={formats}
        style={{
          minHeight: '300px',
        }}
      />
    </div>
  );
};

export default RichTextEditor;