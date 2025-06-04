import React, { useState, useEffect } from 'react';
import Editor from './Editor';

const EditorContainer: React.FC = () => {
  const [savedContent, setSavedContent] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const content = localStorage.getItem('blog-content');
    if (content) {
      setSavedContent(content);
    }
    setIsLoading(false);
  }, []);

  const handleEditorChange = (content: string) => {
    // Here you can implement auto-save or handle content updates
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