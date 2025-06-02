import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { MainContext } from '../context/MainContext';

const PrivateRoute = ({ children }) => {
  const { isLoggedIn, isLoading } = useContext(MainContext);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50 dark:bg-slate-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default PrivateRoute; 