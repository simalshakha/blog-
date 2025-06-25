import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Users, MapPin, Link, Twitter, Instagram, Mail } from 'lucide-react';

interface Author {
  name?: string;
  avatar?: string;
}
interface AuthorCardProps {
  author: Author;
}

const AuthorCard: React.FC<AuthorCardProps> = ({ author }) => {
  const [isFollowing, setIsFollowing] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700"
    >
      <div className="text-center mb-6">
        <img
          src={author.avatar}
          alt={author.name}
          className="w-20 h-20 rounded-full mx-auto mb-4 ring-4 ring-blue-100 dark:ring-blue-900/30"
        />
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          {author.name}
        </h3>
        <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
          {author.bio}
        </p>
      </div>

      {/* Stats */}
      <div className="flex justify-center space-x-8 mb-6">
        {author.followers && (
          <div className="text-center">
            <div className="text-lg font-semibold text-gray-900 dark:text-white">
              {author.followers.toLocaleString()}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">Followers</div>
          </div>
        )}
        <div className="text-center">
          <div className="text-lg font-semibold text-gray-900 dark:text-white">24</div>
          <div className="text-xs text-gray-500 dark:text-gray-400">Articles</div>
        </div>
      </div>

      {/* Contact Info */}
      <div className="space-y-3 mb-6">
        {author.location && (
          <div className="flex items-center space-x-3 text-sm text-gray-600 dark:text-gray-400">
            <MapPin className="w-4 h-4" />
            <span>{author.location}</span>
          </div>
        )}
        {author.website && (
          <div className="flex items-center space-x-3 text-sm">
            <Link className="w-4 h-4 text-gray-400" />
            <a
              href={author.website}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 dark:text-blue-400 hover:underline"
            >
              {author.website.replace(/^https?:\/\//, '')}
            </a>
          </div>
        )}
      </div>

      {/* Social Links */}
      <div className="flex justify-center space-x-4 mb-6">
        {author.twitter && (
          <a
            href={`https://twitter.com/${author.twitter}`}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 text-gray-400 hover:text-blue-500 transition-colors"
          >
            <Twitter className="w-5 h-5" />
          </a>
        )}
        {author.instagram && (
          <a
            href={`https://instagram.com/${author.instagram}`}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 text-gray-400 hover:text-pink-500 transition-colors"
          >
            <Instagram className="w-5 h-5" />
          </a>
        )}
        {author.email && (
          <a
            href={`mailto:${author.email}`}
            className="p-2 text-gray-400 hover:text-green-500 transition-colors"
          >
            <Mail className="w-5 h-5" />
          </a>
        )}
      </div>

      {/* Follow Button */}
      <motion.button
        onClick={() => setIsFollowing(!isFollowing)}
        className={`w-full py-3 px-4 rounded-xl font-medium transition-all duration-200 ${
          isFollowing
            ? 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            : 'bg-blue-600 text-white hover:bg-blue-700'
        }`}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <div className="flex items-center justify-center space-x-2">
          <Users className="w-4 h-4" />
          <span>{isFollowing ? 'Following' : 'Follow'}</span>
        </div>
      </motion.button>
    </motion.div>
  );
};

export default AuthorCard;