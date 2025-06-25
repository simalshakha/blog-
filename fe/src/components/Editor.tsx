import React, { useEffect, useRef } from 'react';
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
  const debounceTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const tools: EditorTools = {
    header: {
      class: Header,
      config: {
        levels: [1, 2, 3],
        defaultLevel: 3,
      },
      inlineToolbar: true,
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
        endpoint: 'http://localhost:8008/fetchUrl',
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
                const imageUrl = result.file?.url || result.url;
                if (!imageUrl) throw new Error('Invalid response from server');

                return {
                  success: 1,
                  file: { url: imageUrl },
                };
              })
              .catch((err) => {
                console.error('Image upload failed:', err);
                return { success: 0 };
              });
          },
        },
      },
    },
    delimiter: {
      class: Delimiter,
    },
  };

  useEffect(() => {
    if (editorRef.current || !editorElementRef.current) return;

    const editor = new EditorJS({
      holder: editorElementRef.current,
      tools: tools,
      data: initialContent ? JSON.parse(initialContent) : undefined,
      async onChange() {
        if (debounceTimeoutRef.current) clearTimeout(debounceTimeoutRef.current);
        debounceTimeoutRef.current = setTimeout(async () => {
          const content: OutputData = await editor.save();
          onChange?.(JSON.stringify(content));
        }, 500);
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
  }, []);

  useEffect(() => {
    if (editorRef.current && initialContent) {
      try {
        editorRef.current.render(JSON.parse(initialContent));
      } catch (err) {
        console.error('Failed to render editor content:', err);
      }
    }
  }, []);

  return (
    <div className="editor-wrapper">
      <div className="editor-container mx-auto max-w-4xl px-4 py-6">
        <div
          ref={editorElementRef}
          className="min-h-[300px] border border-gray-200 p-4 rounded"
        />
      </div>

      {/* Custom header styles for Editor.js live view */}
    <style>
  {`
    .ce-header {
      font-weight: bold !important;
      color: #111 !important;
      margin: 0.5em 0 !important;
    }
    

    .ce-header[data-level="1"] {
      font-size: 2.25rem !important;
    }
    .ce-header[data-level="2"] {
      font-size: 1.875rem !important;
    }
    .ce-header[data-level="3"] {
      font-size: 1.5rem !important;
    }

    /* Dark mode support */
    .dark .ce-header {
      color: #fff !important;
    }
  `}
</style>

    </div>
  );
};

export default Editor;
