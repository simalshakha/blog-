import React, { useCallback, useState } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import { extensions } from '../blockSchema';
import EditorMenu from './EditorMenu';
import { Save, Image as ImageIcon } from 'lucide-react';
import ImageUpload from './ImageUpload';

interface EditorProps {
  initialContent?: string;
  onChange?: (content: string) => void;
}

const Editor: React.FC<EditorProps> = ({ initialContent, onChange }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [menuQuery, setMenuQuery] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [showImageUpload, setShowImageUpload] = useState(false);

  const editor = useEditor({
    extensions,
    content: initialContent,
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      onChange?.(html);
    },
    onCreate: ({ editor }) => {
      editor.commands.focus('end');
    },
    onSelectionUpdate: ({ editor }) => {
      const text = editor.state.doc.textBetween(
        Math.max(0, editor.state.selection.from - 1),
        editor.state.selection.from,
        '\n'
      );
      
      if (text === '/') {
        setIsMenuOpen(true);
        setMenuQuery('');
      } else if (isMenuOpen && !text.startsWith('/')) {
        setIsMenuOpen(false);
      }
    },
  });

  const handleSave = async () => {
    if (editor) {
      setIsSaving(true);
      const content = editor.getHTML();
      localStorage.setItem('blog-content', content);
      setTimeout(() => {
        setIsSaving(false);
      }, 1000);
    }
  };

  const handleImageUpload = (url: string) => {
    if (editor) {
      editor.chain().focus().setImage({ src: url }).run();
      setShowImageUpload(false);
    }
  };

  return (
    <div className="editor-wrapper">
      <div className="sticky top-0 z-10 bg-white border-b border-gray-200 p-4 flex justify-between items-center">
        <h1 className="text-xl font-medium text-gray-800">Blog Editor</h1>
        <div className="flex items-center gap-2">
          <button
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200"
            onClick={() => setShowImageUpload(true)}
          >
            <ImageIcon size={18} />
            <span>Add Image</span>
          </button>
          <button 
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
              isSaving 
                ? 'bg-green-100 text-green-700' 
                : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
            }`}
            onClick={handleSave}
          >
            <Save size={18} />
            <span>{isSaving ? 'Saved' : 'Save'}</span>
          </button>
        </div>
      </div>
      <div className="editor-container mx-auto max-w-4xl px-4 py-6">
        <div className="relative">
          <EditorContent editor={editor} className="prose max-w-none" />
          <EditorMenu
            editor={editor}
            isOpen={isMenuOpen}
            setIsOpen={setIsMenuOpen}
            query={menuQuery}
          />
          {showImageUpload && (
            <ImageUpload
              onUpload={handleImageUpload}
              onClose={() => setShowImageUpload(false)}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Editor;