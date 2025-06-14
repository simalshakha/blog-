import React, { ReactNode, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Pen, LogIn, Heart } from 'lucide-react';

interface BlogPost {
  fullName: string;
  _id: string;
  title: string;
  description: string;
  image: string | null;
  tags: string[];
}
const avatarUrl = 'https://images.vexels.com/media/users/3/134485/isolated/preview/bcde859a8ad3a45cb93aed78d8a63686-cool-emoji-emoticon.png?w=360';
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
        console.log('Fetched data:', json);

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
<div className="min-h-screen bg-black text-white">
  <nav className="fixed top-0 left-0 right-0 bg-black border-b border-gray-800 z-50">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between h-16 items-center">
        <div className="flex items-center space-x-2">
          <Pen className="w-6 h-6 text-white" />
          <span className="font-semibold text-xl text-white">.blog</span>
        </div>
        <button
        onClick={() => navigate('/signup')}
        className="inline-flex items-center px-8 py-4 rounded-xl text-lg font-medium text-white bg-blue-600 hover:bg-blue-700 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 backdrop-blur-sm"
      >
        Start Writing
        <Pen className="w-5 h-5 ml-2" />
      </button>

        <button
          onClick={() => {
                return navigate('/login');
              }}
          className="inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium text-white hover:text-black hover:bg-white transition-all"
        >
          <LogIn className="w-4 h-4 mr-2" />
          Sign In
        </button>
      </div>
    </div>
  </nav>

  <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-24">
    <div className="mb-12">
      <h1 className="text-4xl font-bold text-white mb-4">Latest Stories</h1>
      <p className="text-lg text-gray-300">
        Discover thoughtful writing on travel, food, and personal experiences.
      </p>
    </div>

    {loading ? (
      <p className="text-center text-gray-400">Loading posts...</p>
    ) : posts.length > 0 ? (
      <div className="space-y-12">
        {posts.map((post) => (
          <article
            key={post._id}
            className="group cursor-pointer"
            onClick={() => navigate(`/post/${post._id}`)}
          >
            <hr className="border-t border-gray-800 mx-auto" />
            <div className="flex items-start gap-8">
              <div className="flex-1">
                <div className="mb-2">
                  <span className="text-sm text-gray-400 font-medium underline decoration-green-400 underline-offset-4">
                    {post.tags.join(', ')}
                  </span>
                </div>

                <div className="flex items-center gap-2 mb-2">
                  <span
                    className="w-6 h-6 rounded-full bg-cover bg-center"
                    style={{ backgroundImage: `url('${avatarUrl}')` }}
                  />

                  <span className="text-sm text-blue-400">{post.fullName}</span>
                </div>

                <h2 className="text-xl font-semibold text-white mb-2 group-hover:text-blue-400 transition-colors">
                  {post.title}
                </h2>
                <p className="text-gray-300 mb-4 line-clamp-3">{post.description}</p>
              </div>

              <div className="w-48 h-32 overflow-hidden rounded-lg bg-gray-800">
                {post.image ? (
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-500 text-sm">
                    No Image
                  </div>
                )}
              </div>
            </div>
          </article>
        ))}
      </div>
    ) : (
      <p className="text-center text-gray-400">No posts found.</p>
    )}

    <div className="mt-16 text-center">
      
    </div>
  </main>
</div>
  );
}

export default HomePage;