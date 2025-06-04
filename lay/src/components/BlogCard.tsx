import React from "react";
import { Link } from "react-router-dom";
import { Heart } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatDate } from "@/lib/utils";
import type { Post } from "@/utils/data";

interface BlogCardProps {
  post: Post;
}

export function BlogCard({ post }: BlogCardProps) {
  return (
    <article className="flex gap-6 border-b border-gray-200 py-6">
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-2">
          <Avatar className="h-8 w-8">
            <AvatarImage src={post.author.avatar} alt={post.author.name} />
            <AvatarFallback>{post.author.name[0]}</AvatarFallback>
          </Avatar>
          <span className="text-sm text-gray-600">{post.author.name}</span>
          <span className="text-sm text-gray-400">•</span>
          <time className="text-sm text-gray-600">{formatDate(post.date)}</time>
        </div>
        <Link to={`/blog/${post.slug}`}>
          <h2 className="text-xl font-semibold mb-1 hover:text-blue-600 transition-colors">
            {post.title}
          </h2>
        </Link>
        <p className="text-gray-600 mb-3">{post.subtitle}</p>
        <div className="flex items-center gap-3">
          <span className="bg-gray-100 px-3 py-1 rounded-full text-sm text-gray-600">
            {post.tags[0]}
          </span>
          <div className="flex items-center gap-1 text-gray-500">
            <Heart size={16} />
            <span className="text-sm">{post.likes}</span>
          </div>
        </div>
      </div>
      <div className="w-48 h-32">
        <img
          src={post.thumbnail}
          alt={post.title}
          className="w-full h-full object-cover rounded-lg"
        />
      </div>
    </article>
  );
}