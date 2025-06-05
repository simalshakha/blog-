import React, { useEffect, useRef } from 'react';
import EditorJS from '@editorjs/editorjs';
import Header from '@editorjs/header';
import List from '@editorjs/list';
import Checklist from '@editorjs/checklist';
import Quote from '@editorjs/quote';
import Code from '@editorjs/code';
import InlineCode from '@editorjs/inline-code';
import Marker from '@editorjs/marker';
import Table from '@editorjs/table';
import Link from '@editorjs/link';
import Image from '@editorjs/image';
import Delimiter from '@editorjs/delimiter';
import { Save } from 'lucide-react';

interface EditorProps {
  initialContent?: string;
  onChange?: (content: string) => void;
}

const Editor: React.FC<EditorProps> = ({ initialContent, onChange }) => {
  const editorRef = useRef<EditorJS | null>(null);
  const editorElementRef = useRef<HTMLDivElement>(null);
  const [isSaving, setIsSaving] = React.useState(false);

  useEffect(() => {
    if (!editorRef.current && editorElementRef.current) {
      const editor = new EditorJS({
        holder: editorElementRef.current,
        tools: {
          header: {
            class: Header,
            config: {
              levels: [1, 2, 3],
              defaultLevel: 1
            }
          },
          list: {
            class: List,
            inlineToolbar: true
          },
          checklist: {
            class: Checklist,
            inlineToolbar: true
          },
          quote: {
            class: Quote,
            inlineToolbar: true
          },
          code: Code,
          inlineCode: InlineCode,
          marker: Marker,
          table: {
            class: Table,
            inlineToolbar: true
          },
          link: {
            class: Link,
            config: {
              endpoint: 'http://localhost:8008/fetchUrl'
            }
          },
          image: {
            class: Image,
            config: {
              uploader: {
                uploadByFile(file: File) {
              
                  return Promise.resolve({
                    success: 1,
                    file: {
                      url: URL.createObjectURL(file)
                    }
                  });
                }
              }
            }
          },
          delimiter: Delimiter
        },
        data: initialContent ? JSON.parse(initialContent) : undefined,
        onChange: async () => {
          const content = await editorRef.current?.save();
          onChange?.(JSON.stringify(content));
        },
        placeholder: 'Let\'s write something awesome!'
      });

      editorRef.current = editor;
    }

    return () => {
      if (editorRef.current) {
        try {
          editorRef.current.destroy();
        } catch (err) {
          console.warn('Error destroying editor:', err);
        }
        editorRef.current = null;
      }
    };
  }, [initialContent, onChange]);

  const handleSave = async () => {
    if (editorRef.current) {
      setIsSaving(true);
      const content = await editorRef.current.save();
      localStorage.setItem('editorjs-content', JSON.stringify(content));
      setTimeout(() => {
        setIsSaving(false);
      }, 1000);
    }
  };

  return (
    <div className="editor-wrapper">
      <div className="sticky top-0 z-10 bg-white border-b border-gray-200 p-4 flex justify-between items-center">
        <h1 className="text-xl font-medium text-gray-800">editor</h1>
        {/* Save button removed */}
      </div>
      <div className="editor-container mx-auto max-w-4xl px-4 py-6">
        <div ref={editorElementRef} className="prose max-w-none" />
      </div>
    </div>
  );
};

export default Editor;