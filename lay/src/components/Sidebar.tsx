import React from "react";
import { popularTags, trendingPosts } from "@/utils/data";
import { Link } from "react-router-dom";

export function Sidebar() {
  return (
    <aside className="w-80 space-y-8">
      <section>
        <h3 className="font-semibold mb-4">Popular Topics</h3>
        <div className="flex flex-wrap gap-2">
          {popularTags.map((tag) => (
            <span
              key={tag}
              className="bg-gray-100 px-3 py-1 rounded-full text-sm text-gray-600 hover:bg-gray-200 cursor-pointer"
            >
              {tag}
            </span>
          ))}
        </div>
      </section>
      
      <section>
        <h3 className="font-semibold mb-4">Trending Posts</h3>
        <div className="space-y-4">
          {trendingPosts.map((post) => (
            <Link
              key={post.id}
              to={`/blog/${post.slug}`}
              className="block hover:bg-gray-50 rounded-lg p-2 -mx-2"
            >
              <h4 className="font-medium text-gray-900 line-clamp-2">{post.title}</h4>
              <p className="text-sm text-gray-500 mt-1">{post.author.name}</p>
            </Link>
          ))}
        </div>
      </section>
    </aside>
  );
}