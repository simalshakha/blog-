import React from "react";
import { mockPosts } from "@/utils/data";
import { BlogCard } from "@/components/BlogCard";
import { Sidebar } from "@/components/Sidebar";

export function Home() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex gap-8">
        <main className="flex-1">
          <h1 className="text-3xl font-bold mb-8">Latest Posts</h1>
          <div className="divide-y divide-gray-200">
            {mockPosts.map((post) => (
              <BlogCard key={post.id} post={post} />
            ))}
          </div>
        </main>
        <Sidebar />
      </div>
    </div>
  );
}