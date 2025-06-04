import React, { useCallback, useState } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import { extensions } from '../blockSchema';
import EditorMenu from './EditorMenu';
import { Save } from 'lucide-react';

interface EditorProps {
  initialContent?: string;
  onChange?: (content: string) => void;
}

const Editor: React.FC<EditorProps> = ({ initialContent, onChange }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [menuQuery, setMenuQuery] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const editor = useEditor({
    extensions,
    content: initialContent,
    onUpdate: ({ editor }) => {
      const json = editor.getJSON();
      onChange?.(JSON.stringify(json));
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
      const content = editor.getJSON();
      localStorage.setItem('tiptap-content', JSON.stringify(content));
      setTimeout(() => {
        setIsSaving(false);
      }, 1000);
    }
  };

  return (
    <div className="editor-wrapper">
      <div className="sticky top-0 z-10 bg-white border-b border-gray-200 p-4 flex justify-between items-center">
        <h1 className="text-xl font-medium text-gray-800">Notion-like Editor</h1>
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
      <div className="editor-container mx-auto max-w-4xl px-4 py-6">
        <div className="relative">
          <EditorContent editor={editor} className="prose max-w-none" />
          <EditorMenu
            editor={editor}
            isOpen={isMenuOpen}
            setIsOpen={setIsMenuOpen}
            query={menuQuery}
          />
        </div>
      </div>
    </div>
  );
};

export default Editor;