import React, { useEffect, useState } from 'react';
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

        if (!res.ok) throw new Error('Failed to fetch dashboard');

        const json = await res.json();
        setPosts(json.data);
        setUsername(json.username);
      } catch (err) {
        console.error('Dashboard fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  const handleDelete = async (postId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const res = await fetch(`http://localhost:5000/delete-post/${postId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (!res.ok) throw new Error('Failed to delete post');

      setPosts((prev) => prev.filter((post) => post._id !== postId));
    } catch (err) {
      console.error('Delete error:', err);
    }
  };

  const handleEdit = (postId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/update/${postId}`);
  };

  if (loading) return <div className="text-center py-8">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          Welcome, {username} 👋
        </h1>

        {posts.length === 0 ? (
          <p className="text-gray-600">No posts yet.</p>
        ) : (
          <div className="space-y-6">
            {posts.map((post) => (
              <div
                key={post._id}
                onClick={() => navigate(`/post/${post._id}`)}
                className="relative bg-white p-6 rounded-xl shadow hover:shadow-lg transition cursor-pointer border border-gray-200 group"
              >
                <h2 className="text-xl font-semibold text-gray-800 group-hover:text-blue-600">
                  {post.title}
                </h2>

                <div className="absolute top-4 right-4 flex space-x-3">
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
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
