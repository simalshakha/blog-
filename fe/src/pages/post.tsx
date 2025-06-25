import React, { JSX, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

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
  createdAt: string;
}

function renderBlock(block: Block, index?: number): React.ReactNode {
  switch (block.type) {
    case 'paragraph':
      return <p className="my-4">{block.data.text}</p>;

    case 'header': {
      const level = block.data.level ?? 2;
      const HeaderTag = `h${level}` as keyof JSX.IntrinsicElements;
      return <HeaderTag key={index} className="font-bold my-4 text-gray-800 dark:text-gray-200">{block.data.text}</HeaderTag>;
    }
    case 'list':
      const ListTag = block.data.style === 'ordered' ? 'ol' : 'ul';
      return (
        <ListTag className="ml-6 list-inside list-disc my-4">
          {(block.data.items || []).map((item, idx) => (
            <li key={idx}>{typeof item === 'string' ? item : item?.text || ''}</li>
          ))}
        </ListTag>
      );

    case 'image':
      return (
        <div className="my-6">
          <img
            src={block.data.file?.url}
            alt={block.data.caption || 'Post image'}
            className="w-full rounded-lg shadow-sm"
          />
          {block.data.caption && (
            <p className="text-sm text-gray-500 text-center mt-2">{block.data.caption}</p>
          )}
        </div>
      );

    case 'quote':
      return (
        <blockquote className="border-l-4 pl-4 italic my-6 text-gray-600 dark:text-gray-400">
          <p>{block.data.text}</p>
          {block.data.caption && <footer className="mt-2 text-right">— {block.data.caption}</footer>}
        </blockquote>
      );

    case 'code':
      return (
        <pre className="bg-gray-100 dark:bg-gray-800 text-sm p-4 rounded-lg overflow-x-auto my-4">
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
      <div className="min-h-screen flex items-center justify-center">
        <span className="text-lg text-gray-600">Loading...</span>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-600 text-center">{error || 'Post not found'}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100">
      <article className="max-w-3xl mx-auto px-4 py-12">
       
        <p className="text-gray-500 text-sm mb-6">
          {new Date(post.createdAt).toLocaleDateString()}
        </p>

        {post.image && (
          <img
            src={post.image}
            alt="Post cover"
            className="w-full h-[400px] object-cover rounded-lg mb-8 shadow-md"
          />
        )}
         <h1 className="text-4xl font-bold mb-2">{post.title}</h1>

        <div className="prose prose-lg dark:prose-invert max-w-none mb-8">
          {post.content.blocks.map((block, index) => (
            <div key={index}>{renderBlock(block, index)}</div>
          ))}
        </div>

        <div className="flex flex-wrap gap-2">
          {post.tags.map((tag, idx) => (
            <span
              key={idx}
              className="text-sm bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 px-2 py-1 rounded-full"
            >
              #{tag}
            </span>
          ))}
        </div>
      </article>
    </div>
  );
};

export default BlogPost;
