import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Pen, Trash2 } from 'lucide-react';

interface Post {
  _id: string;
  title: string;
  content: string;
  user: {
    username: string;
  };
}

const Dashboard = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await fetch('http://localhost:5000/dashboard', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });

        if (!res.ok) {
          throw new Error('Failed to fetch dashboard');
        }

        const json = await res.json();
        setPosts(json.data);
        setUsername(json.username);
      } catch (err) {
        console.error('Dashboard error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  const handleDelete = async (postId: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent navigation
    try {
      const res = await fetch(`http://localhost:5000/delete-post/${postId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (!res.ok) throw new Error('Failed to delete post');

      setPosts((prevPosts) => prevPosts.filter((post) => post._id !== postId));
    } catch (err) {
      console.error('Delete error:', err);
    }
  };

  const handleEdit = (postId: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent navigation
    navigate(`/edit/${postId}`);
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Welcome, {username} 👋</h1>

      {posts.length === 0 ? (
        <p>No posts yet.</p>
      ) : (
        <div className="space-y-4">
          {posts.map((post) => (
            <article
              key={post._id}
              className="group cursor-pointer p-4 bg-white shadow-md rounded-lg border relative"
              onClick={() => navigate(`/post/${post._id}`)}
            >
              <h2 className="text-xl font-semibold mb-2">{post.title}</h2>
              
              <div className="absolute top-4 right-4 flex space-x-2">
                <button
                  onClick={(e) => handleEdit(post._id, e)}
                  className="text-blue-600 hover:text-blue-800"
                  title="Edit"
                >
                  <Pen size={18} />
                </button>
                <button
                  onClick={(e) => handleDelete(post._id, e)}
                  className="text-red-600 hover:text-red-800"
                  title="Delete"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
