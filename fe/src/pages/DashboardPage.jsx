import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Plus, MoreVertical, Pen } from 'lucide-react';

function DashboardPage() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [notes] = useState([
    { id: '1', title: 'Welcome Note', updatedAt: '2024-03-10T10:00:00Z' },
    { id: '2', title: 'Project Ideas', updatedAt: '2024-03-09T15:30:00Z' },
    { id: '3', title: 'Meeting Notes', updatedAt: '2024-03-08T09:15:00Z' },
  ]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const filteredNotes = notes.filter(note =>
    note.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="fixed top-0 left-0 right-0 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center space-x-2">
              <Pen className="w-6 h-6 text-blue-600" />
              <span className="font-semibold text-xl">My Notes</span>
            </div>
            <button
              onClick={() => navigate('/editor')}
              className="inline-flex items-center px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-all"
            >
              <Plus className="w-4 h-4 mr-2" />
              New Note
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24">
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search notes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow">
          {filteredNotes.map((note) => (
            <div
              key={note.id}
              className="flex items-center justify-between p-4 border-b last:border-b-0 hover:bg-gray-50 transition-colors group"
            >
              <div className="flex-1">
                <h3 className="text-lg font-medium text-gray-900">{note.title}</h3>
                <p className="text-sm text-gray-500">
                  Last edited on {formatDate(note.updatedAt)}
                </p>
              </div>
              <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                  <MoreVertical className="w-5 h-5 text-gray-500" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

export default DashboardPage;