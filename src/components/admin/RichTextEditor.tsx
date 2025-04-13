
import React, { useState } from 'react';
import { 
  Bold, 
  Italic, 
  Link as LinkIcon, 
  List, 
  ListOrdered, 
  Image as ImageIcon,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Heading1,
  Heading2,
  Heading3,
  Quote,
  Code,
  Table
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { 
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { TooltipProvider } from '@radix-ui/react-tooltip';

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
  const [preview, setPreview] = useState(false);
  
  const insertTag = (tag: string, closeTag: string = tag) => {
    const textarea = document.getElementById('rich-editor') as HTMLTextAreaElement;
    if (!textarea) return;
    
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.substring(start, end);
    
    const textBefore = value.substring(0, start);
    const textAfter = value.substring(end);
    
    const newValue = `${textBefore}<${tag}>${selectedText}</${closeTag}>${textAfter}`;
    onChange(newValue);
    
    // Set cursor position after insertion
    setTimeout(() => {
      textarea.focus();
      const newCursorPos = start + tag.length + 2 + selectedText.length;
      textarea.setSelectionRange(newCursorPos, newCursorPos);
    }, 0);
  };
  
  const insertImage = () => {
    const imageUrl = prompt('Enter image URL:');
    if (imageUrl) {
      const textarea = document.getElementById('rich-editor') as HTMLTextAreaElement;
      if (!textarea) return;
      
      const start = textarea.selectionStart;
      const textBefore = value.substring(0, start);
      const textAfter = value.substring(start);
      
      const imgTag = `<img src="${imageUrl}" alt="Image" class="my-4 max-w-full h-auto rounded" />`;
      const newValue = `${textBefore}${imgTag}${textAfter}`;
      
      onChange(newValue);
    }
  };
  
  const insertLink = () => {
    const url = prompt('Enter URL:');
    const text = prompt('Enter link text:');
    if (url && text) {
      const textarea = document.getElementById('rich-editor') as HTMLTextAreaElement;
      if (!textarea) return;
      
      const start = textarea.selectionStart;
      const textBefore = value.substring(0, start);
      const textAfter = value.substring(start);
      
      const linkTag = `<a href="${url}" target="_blank" rel="noopener noreferrer">${text}</a>`;
      const newValue = `${textBefore}${linkTag}${textAfter}`;
      
      onChange(newValue);
    }
  };
  
  const insertTable = () => {
    const rows = parseInt(prompt('Number of rows:', '3') || '3');
    const cols = parseInt(prompt('Number of columns:', '3') || '3');
    
    if (rows > 0 && cols > 0) {
      let tableHtml = '<table class="min-w-full border-collapse border border-gray-300 my-4">\n';
      
      // Table header
      tableHtml += '  <thead>\n    <tr>\n';
      for (let i = 0; i < cols; i++) {
        tableHtml += `      <th class="border border-gray-300 px-4 py-2 bg-gray-100">Header ${i+1}</th>\n`;
      }
      tableHtml += '    </tr>\n  </thead>\n';
      
      // Table body
      tableHtml += '  <tbody>\n';
      for (let i = 0; i < rows-1; i++) {
        tableHtml += '    <tr>\n';
        for (let j = 0; j < cols; j++) {
          tableHtml += `      <td class="border border-gray-300 px-4 py-2">Cell ${i+1}-${j+1}</td>\n`;
        }
        tableHtml += '    </tr>\n';
      }
      tableHtml += '  </tbody>\n';
      tableHtml += '</table>';
      
      const textarea = document.getElementById('rich-editor') as HTMLTextAreaElement;
      if (!textarea) return;
      
      const start = textarea.selectionStart;
      const textBefore = value.substring(0, start);
      const textAfter = value.substring(start);
      
      const newValue = `${textBefore}${tableHtml}${textAfter}`;
      onChange(newValue);
    }
  };
  
  return (
    <div className="border rounded-md">
      {/* Toolbar */}
      <div className="flex items-center flex-wrap gap-0.5 p-2 bg-muted/30 border-b">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-8 w-8 p-0" 
                onClick={() => insertTag('h1')}
              >
                <Heading1 size={16} />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Heading 1</TooltipContent>
          </Tooltip>
        </TooltipProvider>
        
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-8 w-8 p-0" 
                onClick={() => insertTag('h2')}
              >
                <Heading2 size={16} />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Heading 2</TooltipContent>
          </Tooltip>
        </TooltipProvider>
        
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-8 w-8 p-0" 
                onClick={() => insertTag('h3')}
              >
                <Heading3 size={16} />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Heading 3</TooltipContent>
          </Tooltip>
        </TooltipProvider>
        
        <div className="h-4 w-px mx-1 bg-gray-300" />
        
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-8 w-8 p-0" 
                onClick={() => insertTag('strong')}
              >
                <Bold size={16} />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Bold</TooltipContent>
          </Tooltip>
        </TooltipProvider>
        
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-8 w-8 p-0" 
                onClick={() => insertTag('em')}
              >
                <Italic size={16} />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Italic</TooltipContent>
          </Tooltip>
        </TooltipProvider>
        
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-8 w-8 p-0" 
                onClick={insertLink}
              >
                <LinkIcon size={16} />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Insert Link</TooltipContent>
          </Tooltip>
        </TooltipProvider>
        
        <div className="h-4 w-px mx-1 bg-gray-300" />
        
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-8 w-8 p-0" 
                onClick={() => insertTag('ul')}
              >
                <List size={16} />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Bullet List</TooltipContent>
          </Tooltip>
        </TooltipProvider>
        
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-8 w-8 p-0" 
                onClick={() => insertTag('ol')}
              >
                <ListOrdered size={16} />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Numbered List</TooltipContent>
          </Tooltip>
        </TooltipProvider>
        
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-8 w-8 p-0" 
                onClick={() => insertTag('blockquote')}
              >
                <Quote size={16} />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Blockquote</TooltipContent>
          </Tooltip>
        </TooltipProvider>
        
        <div className="h-4 w-px mx-1 bg-gray-300" />
        
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-8 w-8 p-0" 
                onClick={insertImage}
              >
                <ImageIcon size={16} />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Insert Image</TooltipContent>
          </Tooltip>
        </TooltipProvider>
        
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-8 w-8 p-0" 
                onClick={insertTable}
              >
                <Table size={16} />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Insert Table</TooltipContent>
          </Tooltip>
        </TooltipProvider>
        
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-8 w-8 p-0" 
                onClick={() => insertTag('code')}
              >
                <Code size={16} />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Code</TooltipContent>
          </Tooltip>
        </TooltipProvider>
        
        <div className="h-4 w-px mx-1 bg-gray-300" />
        
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-8 px-2 text-xs"
                onClick={() => setPreview(!preview)}
              >
                {preview ? 'Edit' : 'Preview'}
              </Button>
            </TooltipTrigger>
            <TooltipContent>{preview ? 'Back to Edit' : 'Preview'}</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      
      {/* Editor */}
      {preview ? (
        <div 
          className="p-4 min-h-[300px] prose max-w-none"
          dangerouslySetInnerHTML={{ __html: value }}
        />
      ) : (
        <Textarea
          id="rich-editor"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="min-h-[300px] rounded-t-none focus:ring-0 focus:border-gray-300"
        />
      )}
    </div>
  );
};

export default RichTextEditor;
