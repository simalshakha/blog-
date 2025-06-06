import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

interface Block {
  type: string;
  data: {
    text?: string;
    level?: number;
    style?: string;
    items?: string[];
    caption?: string;
    file?: { url: string };
  };
}

interface Post {
  _id: string;
  title: string;
  description?: string;
  banner: string | null;
  tags: string[];
  content: {
    blocks: Block[];
  };
  createdAt: string;
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

        {post.banner && (
          <img
            src={post.banner}
            alt="Post banner"
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

function renderBlock(block: Block) {
  switch (block.type) {
    case 'header':
      const headerLevel = block.data.level && block.data.level >= 1 && block.data.level <= 6 ? block.data.level : 2;
      const HeaderTag = `h${headerLevel}`;
      return React.createElement(
        HeaderTag,
        { className: "font-bold my-4" },
        block.data.text
      );

    case 'paragraph':
      return <p className="text-gray-800 mb-4">{block.data.text}</p>;

    case 'image':
      return (
        <figure className="my-6">
          <img
            src={block.data.file?.url}
            alt={block.data.caption || 'Image'}
            className="w-full rounded-lg"
          />
          {block.data.caption && (
            <figcaption className="text-center text-sm text-gray-500 mt-2">
              {block.data.caption}
            </figcaption>
          )}
        </figure>
      );

    case 'list':
      const ListTag = block.data.style === 'ordered' ? 'ol' : 'ul';
      return (
        <ListTag className={`pl-6 mb-4 ${block.data.style === 'ordered' ? 'list-decimal' : 'list-disc'}`}>
          {block.data.items?.map((item, idx) => (
            <li key={idx}>{item}</li>
          ))}
        </ListTag>
      );

    case 'quote':
      return (
        <blockquote className="border-l-4 border-gray-300 pl-4 italic text-gray-600 my-6">
          {block.data.text}
        </blockquote>
      );

    case 'code':
      return (
        <pre className="bg-gray-100 p-4 rounded-lg overflow-x-auto my-6">
          <code>{block.data.text}</code>
        </pre>
      );

    case 'delimiter':
      return <hr className="my-8 border-gray-300" />;

    default:
      return null;
  }
}

export default BlogPost;
