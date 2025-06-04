import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, Share, Download, Sun, Moon, Eye } from 'lucide-react';
import Editor from '../components/Editor';

const EditorPage = () => {
  const navigate = useNavigate();
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'}`}>
      <div
        className={`fixed top-0 left-0 right-0 z-10 border-b bg-opacity-80 backdrop-blur-sm transition-colors duration-200 ${
          isDarkMode ? 'bg-gray-800/80 border-gray-700' : 'bg-white/80 border-gray-200'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-14">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/')}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <Home className="w-5 h-5" />
              </button>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setShowPreview(!showPreview)}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <Eye className="w-5 h-5" />
              </button>
              <button className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                <Share className="w-5 h-5" />
              </button>
              <button className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                <Download className="w-5 h-5" />
              </button>
              <button
                onClick={() => setIsDarkMode(!isDarkMode)}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="pt-14 flex">
        <div className={`flex-1 transition-all ${showPreview ? 'w-1/2' : 'w-full'}`}>
          <Editor />
        </div>
        {showPreview && (
          <div className="w-1/2 border-l p-8 overflow-auto h-[calc(100vh-3.5rem)]">
            <div className="prose dark:prose-invert max-w-none">
              {/* Preview content will be rendered here */}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EditorPage;