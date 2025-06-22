// components/Navbar.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Pen, LogIn, LogOut } from 'lucide-react';

interface NavbarProps {
  isLoggedIn: boolean;
  onLogout: () => void; // function passed from parent
}

const Navbar: React.FC<NavbarProps> = ({ isLoggedIn, onLogout }) => {
  const navigate = useNavigate();

  return (
    <nav className="fixed top-0 left-0 right-0 bg-black border-b border-gray-800 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <Pen className="w-6 h-6 text-white" />
            <span className="font-semibold text-xl text-white">.blog</span>
          </div>

          {/* Buttons */}
          <div className="flex items-center space-x-4">
            {/* Start Writing */}
            <button
              onClick={() => navigate(isLoggedIn ? '/editor' : '/signup')}
              className="inline-flex items-center px-6 py-2 rounded-xl text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 backdrop-blur-sm"
            >
              Start Writing
              <Pen className="w-4 h-4 ml-2" />
            </button>

            {/* Auth Buttons */}
            {!isLoggedIn ? (
              <button
                onClick={() => navigate('/login')}
                className="inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium text-white hover:text-black hover:bg-white transition-all"
              >
                <LogIn className="w-4 h-4 mr-2" />
                Sign In
              </button>
            ) : (
              <button
                onClick={onLogout}
                className="inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium text-white hover:text-black hover:bg-white transition-all"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Log Out
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
