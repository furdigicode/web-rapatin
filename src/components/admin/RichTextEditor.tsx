import React, { useMemo } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

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