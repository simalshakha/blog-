import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Heart, Bookmark, Eye } from 'lucide-react';
import PostHeader from '../components/blog/PostHeader';
import PostContent from '../components/blog/PostContent';
import AuthorCard from '../components/blog/AuthorCard';
import CommentSection from '../components/blog/CommentSection';

interface Block {
  type: string;
  data: any;
}

interface Post {
  _id: string;
  title: string;
  description?: string;
  image: string | null;
  tags: string[];
  content: {
    blocks: Block[];
  };
  createdAt: string;
  author: any;
  readTime: string;
  views: number;
  likes: number;
  isLiked: boolean;
  isBookmarked: boolean;
}

const PostPage = () => {
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await fetch(`http://localhost:5000/post/${id}`);
        const data = await res.json();
        setPost({
          ...data,
          readTime: '7 min read',
          views: 1200,
          likes: 50,
          isLiked: false,
          isBookmarked: false,
        });
      } catch (e) {
        console.error('Error loading post:', e);
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [id]);

  const handleLike = () => {
    if (post) {
      setPost({
        ...post,
        isLiked: !post.isLiked,
        likes: post.isLiked ? post.likes - 1 : post.likes + 1,
      });
    }
  };

  const handleBookmark = () => {
    if (post) {
      setPost({
        ...post,
        isBookmarked: !post.isBookmarked,
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  if (!post) {
    return <div className="text-center text-red-500">Post not found</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="sticky top-16 z-40 bg-white dark:bg-gray-900/80 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <motion.button
            className="flex items-center space-x-2 text-gray-600 dark:text-gray-400"
            whileHover={{ x: -2 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => window.history.back()}
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back</span>
          </motion.button>
        </div>
      </div>

      <PostHeader
        title={post.title}
        subtitle={post.description || ''}
        author={post.author}
        publishedDate={new Date(post.createdAt).toLocaleDateString()}
        readTime={post.readTime}
        views={post.views}
        coverImage={post.image || ''}
        tags={post.tags}
      />

      <div className="max-w-7xl mx-auto px-4 py-8 grid lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3">
          

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-sm border border-gray-200 dark:border-gray-700 mb-8"
          >
            <PostContent blocks={post.content.blocks} />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 mb-8"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <motion.button
                  onClick={handleLike}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-full transition-all duration-200 ${
                    post.isLiked ? 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400' :
                    'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Heart className={`w-5 h-5 ${post.isLiked ? 'fill-current' : ''}`} />
                  <span>{post.likes}</span>
                </motion.button>

                <motion.button
                  onClick={handleBookmark}
                  className={`p-2 rounded-full transition-all duration-200 ${
                    post.isBookmarked ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400' :
                    'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Bookmark className={`w-5 h-5 ${post.isBookmarked ? 'fill-current' : ''}`} />
                </motion.button>

                <div className="flex items-center space-x-2 text-gray-500 dark:text-gray-400">
                  <Eye className="w-5 h-5" />
                  <span>{post.views.toLocaleString()} views</span>
                </div>
              </div>
              
            </div>
          </motion.div>

          <AuthorCard author={post.author} />
         
        </div>

        <div className="lg:col-span-1">
          <div className="sticky top-32 space-y-6">
        
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostPage;