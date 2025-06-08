import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Pen, LogIn, Heart } from 'lucide-react';

interface BlogPost {
  _id: string;
  title: string;
  body: string;
  image: string | null;
  user: string;
}

const HomePage = () => {
  const navigate = useNavigate();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch('http://localhost:5000/', {
          credentials: 'include',
        });
        const json = await res.json();
        if (Array.isArray(json.data)) {
          setPosts(json.data);
        } else {
          console.error('Unexpected data format:', json);
        }
      } catch (error) {
        console.error('Error fetching posts:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-white">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 bg-white/70 backdrop-blur-md border-b border-gray-200 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center space-x-2">
              <Pen className="w-6 h-6 text-blue-600" />
              <span className="font-bold text-2xl tracking-tight text-gray-800">Markflow</span>
            </div>
            <button
              onClick={() => navigate('/login')}
              className="inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-100 transition"
            >
              <LogIn className="w-4 h-4 mr-2" />
              Sign In
            </button>
          </div>
        </div>
      </nav>

      {/* Main */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-20">
        {/* Header */}
        <header className="mb-12 text-center">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-2">Latest Stories</h1>
          <p className="text-lg text-gray-600">
            Thoughtful writing on travel, food, tech, and life.
          </p>
        </header>

        {/* Posts */}
        {loading ? (
          <p className="text-center text-gray-500 text-sm">Loading posts...</p>
        ) : posts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => (
              <div
                key={post._id}
                onClick={() => navigate(`/post/${post._id}`)}
                className="bg-white rounded-xl shadow-md hover:shadow-xl transition cursor-pointer group overflow-hidden"
              >
                <div className="h-44 w-full overflow-hidden bg-gray-100">
                  {post.image ? (
                    <img
                      src={post.image}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full text-sm text-gray-400">
                      No Image Available
                    </div>
                  )}
                </div>
                <div className="p-5">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-7 h-7 bg-gray-300 rounded-full" />
                    <span className="text-sm text-gray-500 font-medium">
                      {post.user || 'Unknown Author'}
                    </span>
                  </div>
                  <h2 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors mb-1">
                    {post.title}
                  </h2>
                  <p className="text-sm text-gray-600 line-clamp-3">{post.body}</p>
                  <div className="mt-4 flex items-center text-gray-400 text-xs gap-1">
                    <Heart className="w-4 h-4" />
                    <span>0</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500">No posts found.</p>
        )}

        {/* CTA */}
        <div className="mt-24 text-center">
          <button
            onClick={() => navigate('/signup')}
            className="inline-flex items-center px-10 py-4 rounded-xl text-lg font-semibold text-white bg-blue-600 hover:bg-blue-700 transition shadow-lg hover:shadow-xl transform hover:-translate-y-1"
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
