import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Editor } from '@tiptap/react';
import { slashCommands } from '../blockSchema';
import { ChevronRight } from 'lucide-react';

interface EditorMenuProps {
  editor: Editor | null;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  query: string;
}

const EditorMenu: React.FC<EditorMenuProps> = ({ editor, isOpen, setIsOpen, query }) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const menuRef = useRef<HTMLDivElement>(null);

  const filteredCommands = slashCommands.filter((command) =>
    command.searchTerms.some((term) => term.includes(query.toLowerCase()))
  );

  const selectItem = useCallback(
    (index: number) => {
      const command = filteredCommands[index];
      if (command && editor) {
        switch (command.title) {
          case 'Text':
            editor.chain().focus().setParagraph().run();
            break;
          case 'Heading 1':
            editor.chain().focus().toggleHeading({ level: 1 }).run();
            break;
          case 'Heading 2':
            editor.chain().focus().toggleHeading({ level: 2 }).run();
            break;
          case 'Heading 3':
            editor.chain().focus().toggleHeading({ level: 3 }).run();
            break;
          case 'Bullet List':
            editor.chain().focus().toggleBulletList().run();
            break;
          case 'Numbered List':
            editor.chain().focus().toggleOrderedList().run();
            break;
          case 'To-do List':
            editor.chain().focus().toggleTaskList().run();
            break;
          case 'Code Block':
            editor.chain().focus().toggleCodeBlock().run();
            break;
          case 'Quote':
            editor.chain().focus().toggleBlockquote().run();
            break;
        }
        setIsOpen(false);
      }
    },
    [editor, filteredCommands, setIsOpen]
  );

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setSelectedIndex((i) => (i + 1) % filteredCommands.length);
          break;
        case 'ArrowUp':
          e.preventDefault();
          setSelectedIndex((i) => (i - 1 + filteredCommands.length) % filteredCommands.length);
          break;
        case 'Enter':
          e.preventDefault();
          selectItem(selectedIndex);
          break;
        case 'Escape':
          e.preventDefault();
          setIsOpen(false);
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, selectedIndex, selectItem, filteredCommands.length, setIsOpen]);

  if (!isOpen) return null;

  return (
    <div
      ref={menuRef}
      className="absolute z-50 w-72 bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden"
    >
      <div className="p-2">
        {filteredCommands.map((command, index) => (
          <button
            key={command.title}
            className={`w-full text-left px-3 py-2 rounded-md flex items-center space-x-2 ${
              index === selectedIndex ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-50'
            }`}
            onClick={() => selectItem(index)}
            onMouseEnter={() => setSelectedIndex(index)}
          >
            <ChevronRight className="w-4 h-4" />
            <div>
              <div className="font-medium">{command.title}</div>
              <div className="text-sm text-gray-500">{command.description}</div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default EditorMenu;