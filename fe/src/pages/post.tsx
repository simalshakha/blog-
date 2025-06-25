import React, { JSX, useEffect, useState } from 'react';
import {  useParams } from 'react-router-dom';

interface Block {
  type: string;
  data: {
    text?: string;
    level?: number;
    style?: string;
    items?: any[];
    caption?: string;
    file?: { url: string };
    code?: string;
    language?: string;
    [key: string]: any;
  };
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
  user: {
    fullName: string;
  };
  createdAt: string;
}

function renderBlock(block: Block, index?: number): React.ReactNode {
  switch (block.type) {
    case 'paragraph':
      return (
        <p className="my-4 leading-relaxed text-gray-800 dark:text-gray-200" key={index}>
          {block.data.text}
        </p>
      );

    case 'header': {
      const level = block.data.level ?? 2;
      const HeaderTag = `h${level}` as keyof JSX.IntrinsicElements;
      return (
        <HeaderTag
          key={index}
          className="font-semibold my-6 text-gray-900 dark:text-gray-100"
        >
          {block.data.text}
        </HeaderTag>
      );
    }

    case 'list': {
      const ListTag = block.data.style === 'ordered' ? 'ol' : 'ul';
      return (
        <ListTag
          key={index}
          className="ml-6 list-inside list-disc my-4 text-gray-700 dark:text-gray-300"
        >
          {(block.data.items || []).map((item, idx) => (
            <li key={idx}>{typeof item === 'string' ? item : item?.text || ''}</li>
          ))}
        </ListTag>
      );
    }

    case 'image':
      return (
        <div key={index} className="my-8">
          <img
            src={block.data.file?.url}
            alt={block.data.caption || 'Post image'}
            className="w-full rounded-lg shadow-lg mx-auto max-h-[450px] object-contain"
          />
          {block.data.caption && (
            <p className="text-sm text-center text-gray-500 dark:text-gray-400 mt-2 italic">
              {block.data.caption}
            </p>
          )}
        </div>
      );

    case 'quote':
      return (
        <blockquote
          key={index}
          className="border-l-4 border-blue-400 pl-6 italic my-8 text-gray-700 dark:text-gray-300 bg-blue-50 dark:bg-blue-900 rounded"
        >
          <p>{block.data.text}</p>
          {block.data.caption && (
            <footer className="mt-2 text-right font-semibold">— {block.data.caption}</footer>
          )}
        </blockquote>
      );

    case 'code':
      return (
        <pre
          key={index}
          className="bg-gray-100 dark:bg-gray-800 text-sm p-4 rounded-lg overflow-x-auto my-6 font-mono"
        >
          <code className="whitespace-pre-wrap">{block.data.code}</code>
        </pre>
      );

    default:
      return null;
  }
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900">
        <span className="text-lg text-gray-600 dark:text-gray-400">Loading...</span>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900 px-4">
        <p className="text-red-600 text-center text-lg">{error || 'Post not found'}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-300">
      
      <article className="max-w-3xl mx-auto px-4 py-12">
        {/* Post Image */}
        {post.image && (
          <img
            src={post.image}
            alt="Post cover"
            className="w-full max-h-[450px] object-cover rounded-xl shadow-xl mb-10"
          />
        )}

        {/* Header: Title, Description, Author & Date */}
        <header className="mb-10">
          <h1 className="text-5xl font-extrabold leading-tight mb-4">{post.title}</h1>

          {post.description && (
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-6">{post.description}</p>
          )}

          <div className="flex flex-wrap justify-between items-center text-sm text-gray-500 dark:text-gray-400">
            <time dateTime={post.createdAt} className="mr-4">
              {new Date(post.createdAt).toLocaleDateString(undefined, {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </time>

            <span className="font-semibold text-gray-700 dark:text-gray-300">
              By {post.user.fullName}
            </span>
          </div>
        </header>

        {/* Post Content */}
        <section className="prose prose-lg dark:prose-invert max-w-none">
          {post.content.blocks.map((block, index) => (
            <div key={index}>{renderBlock(block, index)}</div>
          ))}
        </section>

        {/* Tags */}
        <footer className="mt-12 flex flex-wrap gap-3">
          {post.tags.map((tag, idx) => (
            <span
              key={idx}
              className="inline-block bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 px-3 py-1 rounded-full text-sm font-medium cursor-pointer select-none hover:bg-blue-200 dark:hover:bg-blue-800 transition"
            >
              #{tag}
            </span>
          ))}
        </footer>
      </article>
    </div>
  );
};

export default BlogPost;
