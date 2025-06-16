import React, { useEffect, useState } from 'react';
import axios from 'axios';

type User = {
  id: string;
  fullName: string;
  email: string;
  role: string;
};

const AdminUsersPage = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem('token'); // or from context
        const res = await axios.get('http://localhost:5000/users', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUsers(res.data.users);
      } catch (err) {
        setError(err.response?.data?.message || 'Error fetching users');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  return (
    <div className="max-w-4xl mx-auto py-10 px-4">
      <h1 className="text-2xl font-bold mb-6 text-white">Admin - User List</h1>

      {loading ? (
        <p className="text-gray-400">Loading...</p>
      ) : error ? (
        <p className="text-red-400">{error}</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-gray-900 text-white border border-gray-700 rounded">
            <thead>
              <tr>
                <th className="py-2 px-4 border-b border-gray-700 text-left">Name</th>
                <th className="py-2 px-4 border-b border-gray-700 text-left">Email</th>
                <th className="py-2 px-4 border-b border-gray-700 text-left">Role</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-800 transition">
                  <td className="py-2 px-4 border-b border-gray-700">{user.fullName}</td>
                  <td className="py-2 px-4 border-b border-gray-700">{user.email}</td>
                  <td className="py-2 px-4 border-b border-gray-700 text-green-400">{user.role}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminUsersPage;
