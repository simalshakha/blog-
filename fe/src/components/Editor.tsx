import React, { useEffect, useRef, useState } from 'react';
import EditorJS, { OutputData } from '@editorjs/editorjs';
import Header from '@editorjs/header';
import List from '@editorjs/list';
import Checklist from '@editorjs/checklist';
import Quote from '@editorjs/quote';
import Code from '@editorjs/code';
import InlineCode from '@editorjs/inline-code';
import Marker from '@editorjs/marker';
import Table from '@editorjs/table';
import LinkTool from '@editorjs/link';
import ImageTool from '@editorjs/image';
import Delimiter from '@editorjs/delimiter';

type EditorTools = {
  [toolName: string]: {
    class: any;
    inlineToolbar?: boolean;
    config?: any;
  };
};

interface EditorProps {
  initialContent?: string;
  onChange?: (content: string) => void;
}

const Editor: React.FC<EditorProps> = ({ initialContent, onChange }) => {
  const editorRef = useRef<EditorJS | null>(null);
  const editorElementRef = useRef<HTMLDivElement>(null);
  const [isSaving, setIsSaving] = useState(false);
  const debounceTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (editorRef.current || !editorElementRef.current) return;

    const tools: EditorTools = {
      header: {
        class: Header,
        config: {
          levels: [1, 2, 3],
          defaultLevel: 1,
        },
      },
      list: {
        class: List,
        inlineToolbar: true,
      },
      checklist: {
        class: Checklist,
        inlineToolbar: true,
      },
      quote: {
        class: Quote,
        inlineToolbar: true,
      },
      code: {
        class: Code,
      },
      inlineCode: {
        class: InlineCode,
      },
      marker: {
        class: Marker,
      },
      table: {
        class: Table,
        inlineToolbar: true,
      },
      linkTool: {
        class: LinkTool,
        config: {
          endpoint: 'http://localhost:8008/fetchUrl', // Adjust this for your backend
        },
      },
      image: {
        class: ImageTool,
        config: {
          uploader: {
            uploadByFile(file: File) {
              const formData = new FormData();
              formData.append('image', file);

              return fetch('http://localhost:5000/upload-image', {
                method: 'POST',
                body: formData,
              })
                .then(async (res) => {
                  if (!res.ok) throw new Error('Upload failed');
                  const result = await res.json();

                  const imageUrl = result.file?.url || result.url; // fallback
                  if (!imageUrl) throw new Error('Invalid response from server');

                  return {
                    success: 1,
                    file: {
                      url: imageUrl,
                    },
                  };
                })
                .catch((err) => {
                  console.error('Image upload failed:', err); // ✅ Use console, not con
                  return {
                    success: 0,
                  };
                });
            }
          },
        },
      },
      
      delimiter: {
        class: Delimiter,
      },
    };

    const editor = new EditorJS({
      holder: editorElementRef.current,
      tools: tools,
      data: initialContent ? JSON.parse(initialContent) : undefined,
      async onChange() {
        if (debounceTimeoutRef.current) clearTimeout(debounceTimeoutRef.current);

        debounceTimeoutRef.current = setTimeout(async () => {
          const content: OutputData = await editor.save();
          onChange?.(JSON.stringify(content));
        }, 500); // Debounce interval
      },
      placeholder: "Let's write something awesome!",
    });

    editorRef.current = editor;

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
  }, []); // Empty dependency: only initialize once



  return (
    <div className="editor-wrapper">
      <div className="sticky top-0 z-10 bg-white border-b border-gray-200 p-4 flex justify-between items-center">
        <h1 className="text-xl font-medium text-gray-800">Editor</h1>
      </div>
      <div className="editor-container mx-auto max-w-4xl px-4 py-6">
        <div
          ref={editorElementRef}
          className="prose max-w-none min-h-[300px] border border-gray-200 p-4 rounded"
        />
      </div>
    </div>
  );
};

export default Editor;
