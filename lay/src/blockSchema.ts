import { Extension } from '@tiptap/core';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import TaskList from '@tiptap/extension-task-list';
import TaskItem from '@tiptap/extension-task-item';
import Image from '@tiptap/extension-image';

export const extensions = [
  StarterKit.configure({
    heading: {
      levels: [1, 2, 3],
    },
  }),
  TaskList,
  TaskItem.configure({
    nested: true,
  }),
  Image.configure({
    inline: false,
    allowBase64: true,
  }),
  Placeholder.configure({
    placeholder: "Start writing your story...",
  }),
];

export const slashCommands = [
  {
    title: 'Text',
    description: 'Just start writing with plain text',
    searchTerms: ['text', 'plain', 'paragraph'],
    icon: 'text',
  },
  {
    title: 'Heading 1',
    description: 'Big section heading',
    searchTerms: ['heading', 'header', 'h1', 'title'],
    icon: 'heading-1',
  },
  {
    title: 'Heading 2',
    description: 'Medium section heading',
    searchTerms: ['heading', 'header', 'h2'],
    icon: 'heading-2',
  },
  {
    title: 'Heading 3',
    description: 'Small section heading',
    searchTerms: ['heading', 'header', 'h3'],
    icon: 'heading-3',
  },
  {
    title: 'Bullet List',
    description: 'Create a simple bullet list',
    searchTerms: ['bullet', 'list', 'unordered'],
    icon: 'list',
  },
  {
    title: 'Numbered List',
    description: 'Create a numbered list',
    searchTerms: ['numbered', 'list', 'ordered'],
    icon: 'list-ordered',
  },
  {
    title: 'To-do List',
    description: 'Track tasks with a to-do list',
    searchTerms: ['todo', 'task', 'list', 'check', 'checkbox'],
    icon: 'check-square',
  },
  {
    title: 'Code Block',
    description: 'Add code with syntax highlighting',
    searchTerms: ['code', 'block', 'fence'],
    icon: 'code',
  },
  {
    title: 'Quote',
    description: 'Add a quote or citation',
    searchTerms: ['quote', 'blockquote', 'citation'],
    icon: 'quote',
  },
  {
    title: 'Image',
    description: 'Upload or embed an image',
    searchTerms: ['image', 'photo', 'picture'],
    icon: 'image',
  },
  {
    title: 'Caption',
    description: 'Add a caption to your content',
    searchTerms: ['caption', 'description'],
    icon: 'type',
  },
];