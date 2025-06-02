import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-white dark:bg-slate-900 border-t border-gray-200 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col sm:flex-row justify-between items-center">
          {/* Brand */}
          <div className="flex items-center space-x-4">
            <Link to="/" className="text-xl font-bold text-gray-900 dark:text-white">
              AuthApp
            </Link>
           
          </div>

          {/* Links */}
          <div className="flex space-x-6 mt-4 sm:mt-0">
            <Link to="/documentation" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white text-sm">
              Docs
            </Link>
            <Link to="/privacy" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white text-sm">
              Privacy
            </Link>
          </div>

          {/* Copyright */}
          <div className="mt-4 sm:mt-0 text-sm text-gray-500 dark:text-gray-400">
            © {new Date().getFullYear()} AuthApp
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 