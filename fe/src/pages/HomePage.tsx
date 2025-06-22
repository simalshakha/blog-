// HomePage.tsx

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, Clock, User, ArrowRight, Sparkles, Pen, LogIn } from 'lucide-react';
import Navbar from '../components/nav';

interface BlogPost {
  _id: string;
  fullName: string;
  title: string;
  description: string;
  image: string | null;
  tags: string[];
}

const HomePage = () => {
  const navigate = useNavigate();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch('http://localhost:5000/', {
          credentials: 'include',
        });
        const json = await res.json();
        if (Array.isArray(json.data)) {
          setPosts(json.data);
        }
      } catch (error) {
        console.error('Error fetching posts:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
    setIsLoggedIn(!!localStorage.getItem('token'));
  }, []);
  const handleLogout = async () => {
    try {
      const res = await fetch('http://localhost:5000/logout', {
        method: 'POST',
        credentials: 'include', // sends cookies
      });

      if (res.ok) {
        localStorage.removeItem('token');
        setIsLoggedIn(false);
        // navigate('/login');
      } else {
        console.error('Logout failed:', await res.text());
      }
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  const featuredPost = posts[0];
  const regularPosts = posts.slice(1);

  return (
    <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white">
      <Navbar isLoggedIn={isLoggedIn} onLogout={handleLogout} />
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 pt-24 pb-16">
        <div className="max-w-7xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <div className="inline-flex items-center bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-4 py-2 rounded-full text-sm mb-6">
            <Sparkles className="w-4 h-4 mr-2" />
            Welcome to the future of writing
          </div>
          <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900 dark:from-white dark:via-blue-100 dark:to-purple-100 bg-clip-text text-transparent leading-tight mb-6">
            Where Stories<br />Come to Life
          </h1>
          <p className="text-lg md:text-2xl text-gray-600 dark:text-gray-300 mb-10">
            Discover thoughtful writing, share your voice, and connect with a community of passionate storytellers.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button
              onClick={() => navigate(isLoggedIn ? '/editor' : '/signup')}
              className="group px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl font-semibold text-lg shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all flex items-center"
            >
              <span>Start Writing</span>
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </button>
            <button
              onClick={() => navigate(isLoggedIn ? '/dashboard' : '/login')}
              className="px-8 py-4 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-2xl font-semibold text-lg hover:border-blue-500 hover:text-blue-600 dark:hover:text-blue-400 transition-all"
            >
              {isLoggedIn ? 'Explore Stories' : (
                <div className="flex items-center">
                  <LogIn className="w-4 h-4 mr-2" /> Sign In
                </div>
              )}
            </button>
          </div>
        </div>
      </section>

      {/* Featured Story */}
      {featuredPost && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <h2 className="text-3xl font-bold mb-2">Featured Story</h2>
          <p className="text-gray-500 mb-6">Hand-picked by our editorial team</p>
          <div
            className="group cursor-pointer bg-white dark:bg-gray-800 rounded-3xl shadow-lg hover:shadow-2xl transition transform hover:-translate-y-2 overflow-hidden"
            onClick={() => navigate(`/post/${featuredPost._id}`)}
          >
            <div className="md:flex">
              {featuredPost.image && (
                <div className="md:w-1/2 h-64 md:h-auto overflow-hidden">
                  <img src={featuredPost.image} alt={featuredPost.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                </div>
              )}
              <div className="md:w-1/2 p-6 md:p-12">
                <div className="mb-4">
                  <span className="px-3 py-1 text-sm bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full">
                    {featuredPost.tags.join(', ') || 'General'}
                  </span>
                </div>
                <h3 className="text-2xl font-bold group-hover:text-blue-600 dark:group-hover:text-blue-400 mb-4">
                  {featuredPost.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                  {featuredPost.description}
                </p>
                <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                  <User className="w-4 h-4" />
                  <span>{featuredPost.fullName}</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Latest Stories */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-3xl font-bold mb-6">Latest Stories</h2>
        {loading ? (
          <p className="text-gray-400">Loading...</p>
        ) : posts.length > 1 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {regularPosts.map(post => (
              <article
                key={post._id}
                className="group cursor-pointer bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition overflow-hidden"
                onClick={() => navigate(`/post/${post._id}`)}
              >
                {post.image ? (
                  <img src={post.image} alt={post.title} className="h-48 w-full object-cover group-hover:scale-105 transition-transform" />
                ) : (
                  <div className="h-48 flex items-center justify-center text-gray-400">No Image</div>
                )}
                <div className="p-6">
                  <span className="text-sm text-gray-400">{post.tags.join(', ')}</span>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 mt-2 line-clamp-2">{post.title}</h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm mt-2 line-clamp-3">{post.description}</p>
                  <div className="flex items-center mt-4 text-sm text-gray-500 dark:text-gray-400 space-x-2">
                    <User className="w-4 h-4" />
                    <span>{post.fullName}</span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <p className="text-gray-400">No posts available.</p>
        )}
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 py-20">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Share Your Story?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of writers who trust this platform to bring their ideas to life.
          </p>
          <button
            onClick={() => navigate('/editor')}
            className="px-8 py-4 bg-white text-gray-900 rounded-2xl font-semibold text-lg shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all"
          >
            Start Writing Today
          </button>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
