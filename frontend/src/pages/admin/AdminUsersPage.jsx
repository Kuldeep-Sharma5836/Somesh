import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import axiosClient from '../../api/axiosClient';
import { useAuth } from '../../context/AuthContext';

const AdminUsersPage = () => {
  const [users, setUsers] = useState([]);
  const { user: currentUser } = useAuth();

  const fetchUsers = async () => {
    const { data } = await axiosClient.get('/users');
    setUsers(data);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete = async (user) => {
    if (!window.confirm(`Delete ${user.name}?`)) return;
    try {
      await axiosClient.delete(`/users/${user._id}`);
      toast.success('User deleted');
      fetchUsers();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Could not delete user');
    }
  };

  return (
    <div>
      <h1 className="font-display text-3xl font-semibold text-maroon">Manage Users</h1>
      <div className="mt-5 overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-gold/30 text-maroon/70">
              <th className="py-2">Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Created</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id} className="border-b border-gold/10">
                <td className="py-3">{user.name}</td>
                <td>{user.email}</td>
                <td className="capitalize">{user.role}</td>
                <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                <td>
                  {user.role !== 'admin' && user._id !== currentUser?._id ? (
                    <button
                      type="button"
                      className="text-sm font-semibold text-maroon"
                      onClick={() => handleDelete(user)}
                    >
                      Delete
                    </button>
                  ) : (
                    <span className="text-xs text-maroon/60">Protected</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminUsersPage;
