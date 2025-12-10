import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Anchor, Search, ShoppingCart, PlusCircle, User as UserIcon, LogOut, LogIn } from 'lucide-react';
import { User } from '../types';

interface NavbarProps {
  cartCount: number;
  onSearch: (query: string) => void;
  currentUser: User | null;
  onLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ cartCount, onSearch, currentUser, onLogout }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onSearch(e.target.value);
  };

  const isLoginPage = location.pathname === '/login';

  if (isLoginPage) return null;

  return (
    <nav className="sticky top-0 z-50 bg-slate-900 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="p-1.5 bg-white rounded-full group-hover:rotate-12 transition-transform duration-300">
              <Anchor className="h-6 w-6 text-slate-900" />
            </div>
            <span className="font-bold text-xl tracking-tight">VBay</span>
          </Link>

          {/* Search Bar */}
          <div className="hidden md:flex flex-1 max-w-lg mx-8 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search vehicles, furniture, housing..."
              onChange={handleSearchChange}
              className="block w-full pl-10 pr-3 py-2 border-none rounded-md leading-5 bg-slate-800 text-slate-100 placeholder-slate-400 focus:outline-none focus:bg-white focus:text-gray-900 sm:text-sm transition-colors duration-200"
            />
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-4">
            {/* Sell Item - Always Visible */}
            <Link 
              to="/sell" 
              className={`flex items-center gap-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                location.pathname === '/sell' 
                  ? 'bg-slate-700 text-white' 
                  : 'text-slate-200 hover:bg-slate-700 hover:text-white'
              }`}
            >
              <PlusCircle className="h-4 w-4" />
              <span className="hidden sm:inline">Sell Item</span>
            </Link>

            {currentUser ? (
              <>
                <Link 
                  to="/cart" 
                  className="relative p-2 rounded-full text-slate-200 hover:bg-slate-700 hover:text-white transition-colors"
                >
                  <ShoppingCart className="h-6 w-6" />
                  {cartCount > 0 && (
                    <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/4 -translate-y-1/4 bg-red-500 rounded-full">
                      {cartCount}
                    </span>
                  )}
                </Link>
                
                <div className="flex items-center gap-3 pl-2 border-l border-slate-700 ml-2">
                  <div className="flex flex-col items-end hidden md:flex">
                    <span className="text-sm font-medium leading-none">{currentUser.name}</span>
                    <span className="text-xs text-slate-400">{currentUser.department}</span>
                  </div>
                  <div className="group relative">
                    <button className="h-8 w-8 rounded-full bg-teal-600 flex items-center justify-center text-white border border-teal-500 cursor-default">
                       <UserIcon className="h-5 w-5" />
                    </button>
                    {/* Hover dropdown for Logout */}
                    <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-md shadow-lg py-1 hidden group-hover:block hover:block text-slate-800">
                        <button 
                          onClick={onLogout}
                          className="flex items-center gap-2 px-4 py-2 text-sm w-full text-left hover:bg-slate-100 text-red-600"
                        >
                          <LogOut className="h-4 w-4" /> Sign Out
                        </button>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <Link 
                to="/login"
                className="flex items-center gap-2 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-md text-sm font-medium transition-colors ml-2"
              >
                <LogIn className="h-4 w-4" />
                <span>Login with VIMS ID</span>
              </Link>
            )}
          </div>
        </div>
        
        {/* Mobile Search Bar (only visible on mobile) */}
        <div className="md:hidden pb-3">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search..."
              onChange={handleSearchChange}
              className="block w-full pl-10 pr-3 py-2 rounded-md bg-slate-800 text-slate-100 placeholder-slate-400 focus:outline-none focus:bg-white focus:text-gray-900 text-sm"
            />
          </div>
        </div>
      </div>
    </nav>
  );
};