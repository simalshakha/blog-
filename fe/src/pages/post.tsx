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

function renderBlock(block: Block): React.ReactNode {
  switch (block.type) {
    case 'paragraph':
      return <p>{block.data.text}</p>;
    case 'header':
      const HeaderTag = `h${block.data.level || 2}` as keyof JSX.IntrinsicElements;
      return React.createElement(HeaderTag, null, block.data.text);
    case 'list':
      // Render ordered or unordered list
      const items = block.data.items || [];
      if (block.data.style === 'ordered') {
        return (
          <ol>
            {items.map((item, idx) => (
              <li key={idx}>
                {typeof item === 'string'
                  ? item
                  : item?.content || item?.text || ''}
              </li>
            ))}
          </ol>
        );
      } else {
        return (
          <ul>
            {items.map((item, idx) => (
              <li key={idx}>
                {typeof item === 'string'
                  ? item
                  : item?.content || item?.text || ''}
              </li>
            ))}
          </ul>
        );
      }
    case 'image':
      return (
        <img
          src={block.data.file?.url}
          alt={block.data.caption || ''}
          className="my-4 rounded-lg"
        />
      );
    case 'quote':
      return (
        <blockquote>
          <p>{block.data.text}</p>
          {block.data.caption && <cite>{block.data.caption}</cite>}
        </blockquote>
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

  if (loading) return <div className="text-center mt-12">Loading...</div>;
  if (error || !post) return <div className="text-center mt-12 text-red-500">Error: {error}</div>;

  return (
    <div className="min-h-screen bg-white">
      <article className="max-w-3xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">{post.title}</h1>
        <p className="text-gray-500 mb-6">{new Date(post.createdAt).toLocaleDateString()}</p>

        {post.image && (
          <img
            src={post.image}
            alt="Post image"
            className="w-full h-[400px] object-cover rounded-lg mb-8"
          />
        )}
        <div className="prose prose-lg max-w-none mb-8">
          {post.content.blocks.map((block, index) => (
            <div key={index}>{renderBlock(block)}</div>
          ))}
        </div>

        <div className="flex flex-wrap gap-2">
          {post.tags.map((tag, idx) => (
            <span
              key={idx}
              className="text-sm bg-gray-200 text-gray-700 px-2 py-1 rounded-full"
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