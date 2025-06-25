import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, User, Eye } from 'lucide-react';

interface Author {
  name: string;
  avatar: string;
  bio?: string;
}

interface PostHeaderProps {
  title: string;
  subtitle?: string;
  author: Author;
  publishedDate: string;
  readTime: string;
  views?: number;
  coverImage?: string;
  tags?: string[];
}

const PostHeader: React.FC<PostHeaderProps> = ({
  title,
  subtitle,
  author,
  publishedDate,
  readTime,
  views,
  coverImage,
  tags = []
}) => {
  return (
    <motion.header
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="relative mb-12"
    >
      {/* Cover Image */}
      {coverImage && (
        <div className="relative h-[50vh] md:h-[60vh] mb-8 rounded-2xl overflow-hidden">
          <img
            src={coverImage}
            alt={title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        </div>
      )}

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4">
        {/* Tags */}
        {tags.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="flex flex-wrap gap-2 mb-6"
          >
            {tags.map((tag, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-sm font-medium hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors cursor-pointer"
              >
                {tag}
              </span>
            ))}
          </motion.div>
        )}

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6 leading-tight"
        >
          {title}
        </motion.h1>

        {/* Subtitle */}
        {subtitle && (
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8 leading-relaxed"
          >
            {subtitle}
          </motion.p>
        )}

        {/* Author & Meta */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700"
        >
          {/* Author Info */}
          <div className="flex items-center space-x-4">
            <img
              src={author.avatar}
              alt={author.name}
              className="w-12 h-12 rounded-full ring-2 ring-blue-100 dark:ring-blue-900/30"
            />
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">
                {author.name}
              </h3>
              {author.bio && (
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {author.bio}
                </p>
              )}
            </div>
          </div>

          {/* Meta Info */}
          <div className="flex items-center space-x-6 text-sm text-gray-600 dark:text-gray-400">
            <div className="flex items-center space-x-2">
              <Calendar className="w-4 h-4" />
              <span>{new Date(publishedDate).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4" />
              <span>{readTime}</span>
            </div>
            {views && (
              <div className="flex items-center space-x-2">
                <Eye className="w-4 h-4" />
                <span>{views.toLocaleString()} views</span>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </motion.header>
  );
};

export default PostHeader;