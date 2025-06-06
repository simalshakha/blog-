import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, Share, Download, Sun, Moon, Eye, Upload, Tag, Send } from 'lucide-react';
import Editor from '../components/Editor';

const EditorPage = () => {
  const navigate = useNavigate();
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [image, setimage] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [currentTag, setCurrentTag] = useState('');
  const [content, setContent] = useState<any>(null); // Store as object

  const handleimageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const formData = new FormData();
      formData.append('image', file);

      try {
        const res = await fetch('http://localhost:5000/upload-image', {
          method: 'POST',
          body: formData,
        });

        if (!res.ok) throw new Error('Failed to upload image');

        const data = await res.json();
        setimage(data.imageUrl); // Assuming your backend returns { imageUrl: '...' }
      } catch (err) {
        console.error('Upload error:', err);
      }
    }
  };


  const handleDrop = useCallback(async (event: React.DragEvent) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      const formData = new FormData();
      formData.append('image', file);

      try {
        const res = await fetch('http://localhost:5000/upload-image', {
          method: 'POST',
          body: formData,
        });

        if (!res.ok) throw new Error('Failed to upload image');

        const data = await res.json();
        setimage(data.imageUrl);
      } catch (error) {
        console.error('Upload error:', error);
      }
    }
  }, []);


  const handleDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
  }, []);

  const handleAddTag = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && currentTag.trim() && !tags.includes(currentTag.trim())) {
      setTags([...tags, currentTag.trim()]);
      setCurrentTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handlePublish = async () => {
  const postData = {
    title,
    description,
    image,
    tags,
    content, // This is your editor content object
  };

  try {
    const response = await fetch('http://localhost:5000/add-post', { // Change URL to your backend endpoint
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(postData),
    });

    if (!response.ok) {
      throw new Error('Failed to publish post');
    }

    navigate('/dashboard');
  } catch (error) {
    console.error(error);
    alert('Failed to publish post');
  }
};

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
              <button
                onClick={handlePublish}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                <Send className="w-4 h-4" />
                Publish
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="pt-14">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div 
            className={`mb-8 rounded-lg border-2 border-dashed ${
              isDarkMode ? 'border-gray-700' : 'border-gray-200'
            } p-4 text-center`}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
          >
            {image ? (
              <div className="relative">
                <img 
                  src={image} 
                  alt="image" 
                  className="w-full h-48 object-cover rounded-lg"
                />
                <button
                  onClick={() => setimage(null)}
                  className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                >
                  ×
                </button>
              </div>
            ) : (
              <div className="py-12">
                <Upload className="w-8 h-8 mx-auto mb-4 text-gray-400" />
                <label className="cursor-pointer">
                  <span className="text-blue-600 hover:text-blue-700">Upload a image</span>
                  <span className="text-gray-500"> or drag and drop</span>
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleimageUpload}
                  />
                </label>
              </div>
            )}
          </div>

          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className={`w-full text-3xl font-bold mb-4 bg-transparent border-none outline-none ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            }`}
          />

          <div className="mb-6">
            <textarea
              placeholder="Short description (max 200 characters)"
              value={description}
              onChange={(e) => setDescription(e.target.value.slice(0, 200))}
              className={`w-full p-2 rounded-lg border ${
                isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
              }`}
              rows={3}
            />
            <div className="text-sm text-gray-500 text-right">
              {description.length}/200
            </div>
          </div>

          <div className="mb-6">
            <div className="flex flex-wrap gap-2 mb-2">
              {tags.map(tag => (
                <span
                  key={tag}
                  className={`px-3 py-1 rounded-full text-sm flex items-center gap-2 ${
                    isDarkMode ? 'bg-gray-800' : 'bg-gray-100'
                  }`}
                >
                  {tag}
                  <button
                    onClick={() => removeTag(tag)}
                    className="hover:text-red-500"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
            <div className="flex items-center gap-2">
              <Tag className="w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Add tags..."
                value={currentTag}
                onChange={(e) => setCurrentTag(e.target.value)}
                onKeyDown={handleAddTag}
                className={`flex-1 bg-transparent border-none outline-none ${
                  isDarkMode ? 'text-white' : 'text-gray-900'
                }`}
              />
            </div>
          </div>
        </div>

        <div className="flex">
          <div className={`flex-1 transition-all ${showPreview ? 'w-1/2' : 'w-full'}`}>
            <Editor
              onChange={(data) => {
                try {
                  setContent(JSON.parse(data));
                } catch {
                  setContent(null);
                }
              }}
              initialContent={content ? JSON.stringify(content) : ''}
            />
          </div>
          {showPreview && (
            <div className="w-1/2 border-l p-8 overflow-auto h-[calc(100vh-3.5rem)]">
              <div className="prose dark:prose-invert max-w-none">
                {image && (
                  <img src={image} alt="image" className="w-full h-48 object-cover rounded-lg mb-8" />
                )}
                <h1>{title || 'Untitled'}</h1>
                {description && <p className="text-gray-600 dark:text-gray-400">{description}</p>}
                {/* Render editor content preview */}
                {content?.blocks?.map((block: any) => (
                  <div key={block.id}>
                    {block.type === 'paragraph' && <p>{block.data.text}</p>}
                    {block.type === 'header' && <h2>{block.data.text}</h2>}
                    {block.type === 'list' && (
                      <ul>
                        {block.data.items.map((item: any, idx: number) => (
                          <li key={idx}>{item.content || item}</li>
                        ))}
                      </ul>
                    )}
                    {/* Add more block types as needed */}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EditorPage;