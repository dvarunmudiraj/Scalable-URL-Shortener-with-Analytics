
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user, token, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="glass p-8 rounded-2xl text-center">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-300">Loading...</p>
        </div>
      </div>
    );
  }

  // Check for both user and token
  if (!user || !token) {
    return <Navigate to="/login" replace />;
  }

  if (user && !user.approved) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="glass p-8 rounded-2xl text-center max-w-md mx-auto">
          <div className="w-16 h-16 bg-yellow-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-yellow-400 text-2xl">⏳</span>
          </div>
          <h2 className="text-2xl font-bold mb-4 text-white">Waiting for Approval</h2>
          <p className="text-gray-300 mb-6">
            Your account is pending admin approval. You'll be able to access the dashboard once approved.
          </p>
          <button 
            onClick={() => window.location.href = '/'}
            className="bg-primary hover:bg-primary/80 px-6 py-2 rounded-lg transition-colors"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};