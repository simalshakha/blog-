import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Heart, MessageCircle, Twitter } from 'lucide-react';

interface Post {
  _id: string;
  title: string;
  body: string;
  image: string | null;
  user: string;
  likes?: number;
  comments?: number;
  publishedDate?: string;
}

const BlogPost = () => {
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await fetch(`http://localhost:5000/post/${id}`);
        if (!response.ok) throw new Error('Post not found');
        console.log('Fetched post data:', response);

        const data = await response.json();
        setPost(data);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  if (loading) return <div className="text-center mt-12">Loading...</div>;
  if (error || !post) return <div className="text-center mt-12 text-red-500">Error: {error}</div>;

  return (
    <div className="min-h-screen bg-white">
      <article className="max-w-3xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-6">{post.title}</h1>

        {post.image && (
          <img
            src={post.image}
            alt={post.title}
            className="w-full h-[400px] object-cover rounded-lg mb-8"
          />
        )}

        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center text-white font-semibold text-xl">
              {post.user?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div>
              <h3 className="font-medium text-gray-900">User ID: {post.user}</h3>
              <p className="text-gray-500 text-sm">Author</p>
            </div>
          </div>
          <div className="text-gray-500 text-sm">
            {post.publishedDate ? `Published on ${post.publishedDate}` : 'Date not available'}
          </div>
        </div>

        <div className="prose prose-lg max-w-none mb-8">
          <p>{post.body}</p>
        </div>

        <div className="flex items-center justify-between border-t border-gray-200 pt-6">
          <div className="flex items-center space-x-6">
            <button className="flex items-center space-x-2 text-gray-500 hover:text-red-500 transition-colors">
              <Heart className="w-6 h-6" />
              <span>{post.likes ?? 0}</span>
            </button>
            <button className="flex items-center space-x-2 text-gray-500 hover:text-blue-500 transition-colors">
              <MessageCircle className="w-6 h-6" />
              <span>{post.comments ?? 0}</span>
            </button>
          </div>
          <button className="flex items-center space-x-2 text-gray-500 hover:text-blue-400 transition-colors">
            <Twitter className="w-6 h-6" />
            <span>Share</span>
          </button>
        </div>
      </article>
    </div>
  );
};

export default BlogPost;
