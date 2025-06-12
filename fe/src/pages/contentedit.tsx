import React, { useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import EditorJS from '@editorjs/editorjs';
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

const Editor: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const editorRef = useRef<EditorJS | null>(null);
  const editorElementRef = useRef<HTMLDivElement>(null);
  const debounceTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const editorContentRef = useRef<string>('{}');
  const isEditorInitializedRef = useRef(false);

  const tools: EditorTools = {
    header: {
      class: Header,
      config: {
        levels: [1, 2, 3],
        defaultLevel: 1,
      },
    },
    list: { class: List, inlineToolbar: true },
    checklist: { class: Checklist, inlineToolbar: true },
    quote: { class: Quote, inlineToolbar: true },
    code: { class: Code },
    inlineCode: { class: InlineCode },
    marker: { class: Marker },
    table: { class: Table, inlineToolbar: true },
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
                if (!imageUrl) throw new Error('Invalid server response');
                return { success: 1, file: { url: imageUrl } };
              })
              .catch((err) => {
                console.error('Image upload failed:', err);
                return { success: 0 };
              });
          },
        },
      },
    },
    delimiter: { class: Delimiter },
  };

  useEffect(() => {
    const fetchPost = async () => {
      if (!id) return;
      try {
        const res = await fetch(`http://localhost:5000/post/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        if (!res.ok) throw new Error('Failed to fetch post');
        const json = await res.json();

        const content = typeof json.content === 'string'
          ? JSON.parse(json.content)
          : json.content || {};

        initializeEditor(content);
      } catch (err) {
        console.error(err);
      }
    };

    fetchPost();
  }, [id]);

  const initializeEditor = (data: any) => {
    if (!editorElementRef.current || isEditorInitializedRef.current) return;

    const editor = new EditorJS({
      holder: editorElementRef.current,
      tools,
      data,
      placeholder: "Let's write something awesome!",
      async onChange() {
        if (debounceTimeoutRef.current) clearTimeout(debounceTimeoutRef.current);
        debounceTimeoutRef.current = setTimeout(async () => {
          const saved = await editor.save();
          editorContentRef.current = JSON.stringify(saved);
        }, 500);
      },
    });

    editorRef.current = editor;
    isEditorInitializedRef.current = true;

    // Cleanup
    return () => {
      try {
        editor.destroy();
      } catch (err) {
        console.warn('Editor destroy failed', err);
      }
      editorRef.current = null;
      isEditorInitializedRef.current = false;
    };
  };

  const handlePublish = async () => {
    try {
      const savedData = editorContentRef.current;
      const res = await fetch(`http://localhost:5000/post/${id}/content`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ content: JSON.parse(savedData) }),
      });

      if (!res.ok) throw new Error('Failed to publish post');
      navigate('/dashboard');
    } catch (err) {
      console.error(err);
      alert('Failed to publish post');
    }
  };

  return (
    <div className="editor-wrapper">
      <div className="sticky top-0 z-10 bg-white border-b border-gray-200 p-4 flex justify-between items-center">
        <h1 className="text-xl font-medium text-gray-800">Editor</h1>
        <button
          className="text-sm px-4 py-1 bg-blue-600 text-white rounded"
          onClick={handlePublish}
        >
          Save
        </button>
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
