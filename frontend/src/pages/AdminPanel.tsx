
import React, { useState, useEffect } from 'react';
import Navbar from '../components/layout/Navbar';
import { Button } from '../components/ui/button';
import { toast } from '../hooks/use-toast';
import { CheckCircle, XCircle, Users, Clock, Shield } from 'lucide-react';
import { apiCall } from '../lib/api';

interface PendingUser {
  id: string;
  email: string;
  username: string;
  createdAt: string;
  status: 'pending' | 'approved' | 'rejected';
}

const AdminPanel: React.FC = () => {
  const [pendingUsers, setPendingUsers] = useState<PendingUser[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingUsers, setIsLoadingUsers] = useState(true);

  // Fetch pending users on component mount
  useEffect(() => {
    const fetchPendingUsers = async () => {
      try {
        const response = await apiCall('/admin/pending_users');
        setPendingUsers(response);
      } catch (error) {
        console.error('Failed to fetch pending users:', error);
        toast({
          title: "Error",
          description: "Failed to load pending users",
          variant: "destructive",
        });
      } finally {
        setIsLoadingUsers(false);
      }
    };

    fetchPendingUsers();
  }, []);

  const handleApproveUser = async (userId: string) => {
    setIsLoading(true);
    try {
      await apiCall('/admin/approve_user', {
        method: 'POST',
        body: JSON.stringify({ userId, approved: true }),
      });
      
      setPendingUsers(prev => 
        prev.map(user => 
          user.id === userId 
            ? { ...user, status: 'approved' as const }
            : user
        )
      );
      
      toast({
        title: "User Approved",
        description: "User has been approved successfully!",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to approve user. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRejectUser = async (userId: string) => {
    setIsLoading(true);
    try {
      await apiCall('/admin/approve_user', {
        method: 'POST',
        body: JSON.stringify({ userId, approved: false }),
      });
      
      setPendingUsers(prev => 
        prev.map(user => 
          user.id === userId 
            ? { ...user, status: 'rejected' as const }
            : user
        )
      );
      
      toast({
        title: "User Rejected",
        description: "User has been rejected.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to reject user. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const pendingCount = pendingUsers.filter(user => user.status === 'pending').length;
  const approvedCount = pendingUsers.filter(user => user.status === 'approved').length;
  const rejectedCount = pendingUsers.filter(user => user.status === 'rejected').length;

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-white mb-4 flex items-center">
            <Shield className="w-8 h-8 mr-3 text-purple-400" />
            Admin Panel
          </h1>
          <p className="text-xl text-gray-300">
            Manage user registrations and system settings.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="glass p-6 rounded-2xl neon-glow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Pending Approvals</p>
                <p className="text-3xl font-bold text-white">{pendingCount}</p>
              </div>
              <Clock className="w-8 h-8 text-yellow-400" />
            </div>
          </div>

          <div className="glass p-6 rounded-2xl neon-glow-blue">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Approved Users</p>
                <p className="text-3xl font-bold text-white">{approvedCount}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-400" />
            </div>
          </div>

          <div className="glass p-6 rounded-2xl neon-glow-cyan">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Total Users</p>
                <p className="text-3xl font-bold text-white">{pendingUsers.length}</p>
              </div>
              <Users className="w-8 h-8 text-cyan-400" />
            </div>
          </div>
        </div>

        {/* Pending Users Table */}
        <div className="glass rounded-2xl overflow-hidden neon-glow">
          <div className="p-6 border-b border-white/10">
            <h2 className="text-2xl font-bold text-white">User Management</h2>
            <p className="text-gray-300 mt-2">Review and approve user registrations</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-white/5">
                <tr>
                  <th className="text-left p-4 text-gray-300 font-medium">User</th>
                  <th className="text-left p-4 text-gray-300 font-medium">Email</th>
                  <th className="text-left p-4 text-gray-300 font-medium">Registration Date</th>
                  <th className="text-left p-4 text-gray-300 font-medium">Status</th>
                  <th className="text-left p-4 text-gray-300 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {isLoadingUsers ? (
                  <tr>
                    <td colSpan={5} className="p-8 text-center">
                      <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
                      <p className="text-gray-400">Loading users...</p>
                    </td>
                  </tr>
                ) : (
                  pendingUsers.map((user) => (
                    <tr key={user.id} className="border-b border-white/10 hover:bg-white/5">
                      <td className="p-4">
                        <div>
                          <p className="text-white font-medium">{user.username}</p>
                          <p className="text-sm text-gray-400">ID: {user.id}</p>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className="text-gray-300">{user.email}</span>
                      </td>
                      <td className="p-4">
                        <span className="text-gray-300">
                          {new Date(user.createdAt).toLocaleDateString()}
                        </span>
                      </td>
                      <td className="p-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          user.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' :
                          user.status === 'approved' ? 'bg-green-500/20 text-green-400' :
                          'bg-red-500/20 text-red-400'
                        }`}>
                          {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                        </span>
                      </td>
                      <td className="p-4">
                        {user.status === 'pending' && (
                          <div className="flex items-center space-x-2">
                            <Button
                              onClick={() => handleApproveUser(user.id)}
                              disabled={isLoading}
                              size="sm"
                              className="bg-green-600 hover:bg-green-700 text-white"
                            >
                              <CheckCircle className="w-4 h-4 mr-1" />
                              Approve
                            </Button>
                            <Button
                              onClick={() => handleRejectUser(user.id)}
                              disabled={isLoading}
                              size="sm"
                              variant="outline"
                              className="border-red-500/50 text-red-400 hover:bg-red-500/10"
                            >
                              <XCircle className="w-4 h-4 mr-1" />
                              Reject
                            </Button>
                          </div>
                        )}
                        {user.status !== 'pending' && (
                          <span className="text-gray-500 text-sm">
                            {user.status === 'approved' ? 'Approved' : 'Rejected'}
                          </span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {!isLoadingUsers && pendingUsers.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-400 text-lg">No users to review</p>
              <p className="text-gray-500 mt-2">All users have been processed</p>
            </div>
          )}
        </div>

        {/* System Stats */}
        <div className="mt-8 glass p-6 rounded-2xl">
          <h3 className="text-xl font-bold text-white mb-6">System Overview</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-purple-400">1,234</p>
              <p className="text-sm text-gray-400">Total URLs</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-400">56,789</p>
              <p className="text-sm text-gray-400">Total Clicks</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-cyan-400">98.9%</p>
              <p className="text-sm text-gray-400">Uptime</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-green-400">245</p>
              <p className="text-sm text-gray-400">Active Users</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminPanel;