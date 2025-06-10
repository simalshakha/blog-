import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Plus, MoreVertical, Pen, Calendar, FileText, Loader2, Trash2, Edit3 } from 'lucide-react';

interface Note {
  id: string;
  title: string;
  content?: string;
  updatedAt: string;
  createdAt: string;
  author?: string;
  tags?: string[];
  status?: 'draft' | 'published';
}

const DashboardPage = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'draft' | 'published'>('all');
  const [showDropdown, setShowDropdown] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    fetchNotes();
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = () => setShowDropdown(null);
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const fetchNotes = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Simulate loading delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Use mock data directly since no backend is configured
      setNotes([
        { 
          id: '1', 
          title: 'Welcome to Your Blog', 
          updatedAt: '2024-03-10T10:00:00Z',
          createdAt: '2024-03-10T09:00:00Z',
          status: 'published',
          tags: ['welcome', 'getting-started']
        },
        { 
          id: '2', 
          title: 'Project Ideas and Inspiration', 
          updatedAt: '2024-03-09T15:30:00Z',
          createdAt: '2024-03-09T14:00:00Z',
          status: 'draft',
          tags: ['ideas', 'projects']
        },
        { 
          id: '3', 
          title: 'Meeting Notes - Q1 Planning', 
          updatedAt: '2024-03-08T09:15:00Z',
          createdAt: '2024-03-08T08:00:00Z',
          status: 'draft',
          tags: ['meetings', 'planning']
        },
        { 
          id: '4', 
          title: 'Travel Photography Tips', 
          updatedAt: '2024-03-07T14:20:00Z',
          createdAt: '2024-03-07T13:00:00Z',
          status: 'published',
          tags: ['photography', 'travel']
        },
        { 
          id: '5', 
          title: 'Recipe Collection - Mediterranean', 
          updatedAt: '2024-03-06T11:45:00Z',
          createdAt: '2024-03-06T10:30:00Z',
          status: 'draft',
          tags: ['recipes', 'cooking', 'mediterranean']
        },
      ]);
    } catch (err) {
      console.error('Error loading notes:', err);
      setError('Failed to load notes. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteNote = async (noteId: string, noteTitle: string) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${noteTitle}"?\n\nThis action cannot be undone.`
    );
    
    if (!confirmed) return;

    try {
      setDeletingId(noteId);
      
      // Simulate delete operation with delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      setNotes(prevNotes => prevNotes.filter(note => note.id !== noteId));
      setShowDropdown(null);
      
      // Show success message (you could use a toast library here)
      console.log(`Note "${noteTitle}" deleted successfully`);
    } catch (err) {
      console.error('Error deleting note:', err);
      alert('Failed to delete note. Please try again.');
    } finally {
      setDeletingId(null);
    }
  };

  const handleEditNote = (noteId: string) => {
    navigate(`/editor?id=${noteId}`);
    setShowDropdown(null);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getRelativeTime = (dateString: string) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d ago`;
    return formatDate(dateString);
  };

  const filteredNotes = notes.filter(note => {
    const matchesSearch = note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         note.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesFilter = filter === 'all' || note.status === filter;
    return matchesSearch && matchesFilter;
  });

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'published':
        return 'bg-green-100 text-green-800';
      case 'draft':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">Loading your notes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-sm border-b border-gray-200 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center space-x-2">
              <Pen className="w-6 h-6 text-blue-600" />
              <span className="font-semibold text-xl">My Notes</span>
              <span className="text-sm text-gray-500 ml-2">
                ({filteredNotes.length} {filteredNotes.length === 1 ? 'note' : 'notes'})
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={fetchNotes}
                className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-all"
                title="Refresh"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </button>
              <button
                onClick={() => navigate('/editor')}
                className="inline-flex items-center px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-all shadow-sm hover:shadow-md"
              >
                <Plus className="w-4 h-4 mr-2" />
                New Note
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12">
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-800">{error}</p>
            <button
              onClick={fetchNotes}
              className="mt-2 text-red-600 hover:text-red-800 underline"
            >
              Try again
            </button>
          </div>
        )}

        <div className="mb-6 space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search notes and tags..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white shadow-sm"
            />
          </div>

          <div className="flex space-x-2">
            {(['all', 'published', 'draft'] as const).map((filterOption) => (
              <button
                key={filterOption}
                onClick={() => setFilter(filterOption)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  filter === filterOption
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
                }`}
              >
                {filterOption.charAt(0).toUpperCase() + filterOption.slice(1)}
                {filterOption !== 'all' && (
                  <span className="ml-1 text-xs opacity-75">
                    ({notes.filter(note => note.status === filterOption).length})
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {filteredNotes.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {searchQuery ? 'No notes found' : 'No notes yet'}
            </h3>
            <p className="text-gray-500 mb-6">
              {searchQuery 
                ? 'Try adjusting your search terms or filters'
                : 'Create your first note to get started'
              }
            </p>
            {!searchQuery && (
              <button
                onClick={() => navigate('/editor')}
                className="inline-flex items-center px-6 py-3 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-all"
              >
                <Plus className="w-5 h-5 mr-2" />
                Create your first note
              </button>
            )}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            {filteredNotes.map((note, index) => (
              <div
                key={note.id}
                className={`flex items-center justify-between p-6 hover:bg-gray-50 transition-colors group ${
                  index !== filteredNotes.length - 1 ? 'border-b border-gray-100' : ''
                } ${deletingId === note.id ? 'opacity-50 pointer-events-none' : ''}`}
              >
                <div 
                  className="flex-1 cursor-pointer"
                  onClick={() => navigate(`/editor?id=${note.id}`)}
                >
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-lg font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                      {note.title}
                    </h3>
                    {note.status && (
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(note.status)}`}>
                        {note.status}
                      </span>
                    )}
                    {deletingId === note.id && (
                      <div className="flex items-center space-x-2 text-red-600">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span className="text-sm">Deleting...</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-4 h-4" />
                      <span>Updated {getRelativeTime(note.updatedAt)}</span>
                    </div>
                    {note.tags && note.tags.length > 0 && (
                      <div className="flex items-center space-x-1">
                        <span>Tags:</span>
                        <div className="flex space-x-1">
                          {note.tags.slice(0, 3).map(tag => (
                            <span key={tag} className="px-2 py-0.5 bg-gray-100 rounded text-xs">
                              {tag}
                            </span>
                          ))}
                          {note.tags.length > 3 && (
                            <span className="text-xs text-gray-400">+{note.tags.length - 3} more</span>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="relative">
                    <button 
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowDropdown(showDropdown === note.id ? null : note.id);
                      }}
                      disabled={deletingId === note.id}
                    >
                      <MoreVertical className="w-5 h-5 text-gray-500" />
                    </button>
                    
                    {showDropdown === note.id && (
                      <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEditNote(note.id);
                          }}
                          className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2"
                        >
                          <Edit3 className="w-4 h-4" />
                          <span>Edit</span>
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteNote(note.id, note.title);
                          }}
                          className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center space-x-2"
                        >
                          <Trash2 className="w-4 h-4" />
                          <span>Delete</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default DashboardPage;