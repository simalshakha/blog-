import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, Share, Download, Sun, Moon, Eye, Upload, Tag, Send } from 'lucide-react';
import Editor from '../components/Editor';

const UpdatePostPage = () => {

  const navigate = useNavigate();
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [image, setimage] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [currentTag, setCurrentTag] = useState('');
  const [content, setContent] = useState<any>(null); /


  // Fetch post details by ID on component mount
  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await fetch(`http://localhost:5000/post/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });

        if (!res.ok) throw new Error('Failed to fetch post');

        const json = await res.json();
        setTitle(json.title);
        setContent(json.content);
      } catch (err) {
        console.error(err);
        setError('Could not load post');
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  // Basic text formatting function
  const formatText = (command: string) => {
    if (!textareaRef.current) return;

    const textarea = textareaRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;

    let selectedText = content.substring(start, end);
    let before = content.substring(0, start);
    let after = content.substring(end);

    if (command === 'bold') {
      selectedText = `**${selectedText}**`;
    } else if (command === 'italic') {
      selectedText = `*${selectedText}*`;
    } else if (command === 'underline') {
      selectedText = `__${selectedText}__`;
    }

    const newContent = before + selectedText + after;
    setContent(newContent);

    // Set cursor after inserted formatting
    setTimeout(() => {
      textarea.selectionStart = textarea.selectionEnd = start + selectedText.length;
      textarea.focus();
    }, 0);
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await fetch(`http://localhost:5000/edit-post/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ title, content }),
      });

      if (!res.ok) throw new Error('Failed to update post');

      navigate('/dashboard');
    } catch (err) {
      console.error(err);
      setError('Failed to update post');
    }
  };

  if (loading) return <p>Loading post...</p>;
  if (error) return <p className="text-red-600">{error}</p>;

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-3xl font-bold mb-6 text-center">Update Post</h1>
      <form onSubmit={handleUpdate} className="space-y-6">
        <div>
          <label className="block mb-2 font-semibold text-gray-700">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-md text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label className="block mb-2 font-semibold text-gray-700">Content</label>

          {/* Toolbar */}
          <div className="mb-2 space-x-2">
            <button
              type="button"
              onClick={() => formatText('bold')}
              className="px-3 py-1 font-bold border border-gray-400 rounded hover:bg-gray-100"
              title="Bold"
            >
              <b>B</b>
            </button>
            <button
              type="button"
              onClick={() => formatText('italic')}
              className="px-3 py-1 italic border border-gray-400 rounded hover:bg-gray-100"
              title="Italic"
            >
              I
            </button>
            <button
              type="button"
              onClick={() => formatText('underline')}
              className="px-3 py-1 underline border border-gray-400 rounded hover:bg-gray-100"
              title="Underline"
            >
              U
            </button>
          </div>

          <textarea
            ref={textareaRef}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={12}
            className="w-full p-4 border border-gray-300 rounded-md font-serif text-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-vertical"
            placeholder="Write your content here... (Markdown supported)"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full py-3 bg-blue-600 text-white font-semibold rounded hover:bg-blue-700 transition"
        >
          Update Post
        </button>
      </form>
    </div>
  );
};

export default UpdatePostPage;
