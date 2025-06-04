import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Pen, LogIn } from 'lucide-react';

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white">
      <nav className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center space-x-2">
              <Pen className="w-6 h-6 text-blue-600" />
              <span className="font-semibold text-xl">Markflow</span>
            </div>
            <button
              onClick={() => navigate('/dashboard')}
              className="inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 transition-all"
            >
              <LogIn className="w-4 h-4 mr-2" />
              Sign In
            </button>
          </div>
        </div>
      </nav>

      <main className="pt-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6 leading-tight">
            Fast, minimal markdown writing
          </h1>
          <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto">
            Focus on your content with our distraction-free editor. Write, format, and organize your thoughts effortlessly.
          </p>
          <button
            onClick={() => navigate('/editor')}
            className="inline-flex items-center px-8 py-4 rounded-xl text-lg font-medium text-white bg-blue-600 hover:bg-blue-700 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 backdrop-blur-sm"
          >
            Start Writing
            <Pen className="w-5 h-5 ml-2" />
          </button>
        </div>
      </main>
    </div>
  );
};

export default HomePage;