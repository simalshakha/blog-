import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

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
  const navigate = useNavigate(); // Added this line

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
              className="group cursor-pointer p-4 bg-white shadow-md rounded-lg border"
              onClick={() => navigate(`/post/${post._id}`)}
            >
              <h2 className="text-xl font-semibold mb-2">{post.title}</h2>
            </article>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
