import React, { useState, useEffect } from 'react';
import Editor from './Editor';

const EditorContainer: React.FC = () => {
  const [savedContent, setSavedContent] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const content = localStorage.getItem('tiptap-content');
    if (content) {
      try {
        setSavedContent(content);
      } catch (e) {
        console.error('Error parsing saved content', e);
        setSavedContent(null);
      }
    }
    setIsLoading(false);
  }, []);

  const handleEditorChange = (content: string) => {
    console.log('Editor content updated');
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-pulse">Loading editor...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Editor initialContent={savedContent} onChange={handleEditorChange} />
    </div>
  );
};

export default EditorContainer;