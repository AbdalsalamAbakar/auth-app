import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { Trash2, User as UserIcon, Search } from 'lucide-react';

export default function Dashboard() {
  const { user, token, logout } = useAuth();
  const [allUsers, setAllUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState(""); // 🔍 New Search State

  const fetchUsers = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/users', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAllUsers(res.data);
    } catch (err) {
      console.error("Error fetching users", err);
    }
  };

  useEffect(() => {
    if (user?.role === 'admin') fetchUsers();
  }, [user, token]);

  const handleDelete = async (userId) => {
    if (window.confirm("Are you sure?")) {
      try {
        await axios.delete(`http://localhost:5000/api/users/${userId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setAllUsers(allUsers.filter(u => u._id !== userId));
      } catch (err) {
        alert("Failed to delete");
      }
    }
  };

  // 🧪 Logic: Filter users based on search input
  const filteredUsers = allUsers.filter(u => 
    u.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    u.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="mx-auto max-w-5xl">
        {/* Profile Header */}
        <div className="flex flex-col md:flex-row justify-between items-center bg-white p-6 rounded-xl shadow-sm mb-6">
          <div className="flex items-center gap-4">
            <div className="bg-blue-600 p-3 rounded-full text-white">
              <UserIcon size={24} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">{user?.name}</h1>
              <p className="text-gray-500 text-sm capitalize">{user?.role} Account</p>
            </div>
          </div>
          <button onClick={logout} className="mt-4 md:mt-0 bg-gray-100 text-gray-700 px-6 py-2 rounded-lg font-medium hover:bg-red-50 hover:text-red-600 transition">
            Logout
          </button>
        </div>

        {user?.role === 'admin' && (
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            {/* Search Bar Section */}
            <div className="p-6 border-b border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <h2 className="text-xl font-bold text-gray-800">User Management</h2>
              <div className="relative">
                <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
                <input 
                  type="text" 
                  placeholder="Search by name or email..." 
                  className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg w-full md:w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-50 text-gray-400 text-xs uppercase">
                  <tr>
                    <th className="p-4">User</th>
                    <th className="p-4">Email</th>
                    <th className="p-4">Role</th>
                    <th className="p-4 text-center">Delete</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredUsers.map(u => (
                    <tr key={u._id} className="hover:bg-blue-50/30 transition">
                      <td className="p-4 font-medium text-gray-700">{u.name}</td>
                      <td className="p-4 text-gray-600">{u.email}</td>
                      <td className="p-4">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${u.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-green-100 text-green-700'}`}>
                          {u.role}
                        </span>
                      </td>
                      <td className="p-4 text-center">
                        {u.email !== user.email && (
                          <button onClick={() => handleDelete(u._id)} className="text-gray-300 hover:text-red-500 transition">
                            <Trash2 size={18} />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filteredUsers.length === 0 && (
                <div className="p-10 text-center text-gray-400">No users found matching "{searchQuery}"</div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}