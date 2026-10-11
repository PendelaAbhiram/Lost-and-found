import React, { useEffect, useState } from 'react';
import { PageType, UserProfile } from '../types';
import { ClipboardList, LogOut, User, LayoutDashboard } from 'lucide-react';

interface NavbarProps {
  onNavigate: (page: PageType) => void;
  onScrollTo: (id: string) => void;
  currentPage: PageType;
  user?: UserProfile | null;
  onLogout?: () => void;
  onGoogleSignIn?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onNavigate,
  onScrollTo,
  currentPage,
  user,
  onLogout,
  onGoogleSignIn,
}) => {
  const [isScrolled, setIsScrolled] = useState<boolean>(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (currentPage !== 'home') return null;

  const isAuthenticated = Boolean(user && user.uid);

  return (
    <header
      id="mainNavbar"
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-[#efe9d9]/90 backdrop-blur-md border-b border-black/5 py-3.5 shadow-xs'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between">
        {/* Brand */}
        <button
          onClick={() => onNavigate('home')}
          className="flex items-center gap-2.5 font-serif text-2xl font-semibold text-[#1c2b1f] hover:opacity-90 transition-opacity cursor-pointer"
        >
          <div className="w-8 h-8 rounded-lg bg-[#b8945a] flex items-center justify-center text-white shadow-xs">
            <ClipboardList className="w-4 h-4 text-white" />
          </div>
          <span>Relief</span>
        </button>

        {/* Links */}
        <nav className="hidden md:flex items-center gap-8">
          <button
            onClick={() => onScrollTo('browse-section')}
            className="text-sm font-medium text-[#1a1a17] hover:text-[#1c2b1f] transition-colors relative py-1 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1.5px] after:bg-[#1c2b1f] hover:after:w-full after:transition-all cursor-pointer"
          >
            Browse items
          </button>
          <button
            onClick={() => onScrollTo('process-section')}
            className="text-sm font-medium text-[#1a1a17] hover:text-[#1c2b1f] transition-colors relative py-1 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1.5px] after:bg-[#1c2b1f] hover:after:w-full after:transition-all cursor-pointer"
          >
            How it works
          </button>
          <button
            onClick={() => onScrollTo('stories-section')}
            className="text-sm font-medium text-[#1a1a17] hover:text-[#1c2b1f] transition-colors relative py-1 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1.5px] after:bg-[#1c2b1f] hover:after:w-full after:transition-all cursor-pointer"
          >
            Stories
          </button>
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-3">
          {isAuthenticated ? (
            <>
              <button
                onClick={() => onNavigate('user-dash')}
                className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl border border-black/15 bg-white/70 hover:bg-white text-xs font-medium text-[#1c2b1f] transition-all cursor-pointer"
              >
                <div className="w-6 h-6 rounded-full bg-[#1c2b1f] text-[#efe9d9] flex items-center justify-center text-[10px] font-bold">
                  {user?.name?.[0] || 'U'}
                </div>
                <span className="hidden sm:inline font-mono">{user?.name}</span>
                <LayoutDashboard className="w-3.5 h-3.5 text-[#b8945a]" />
              </button>
              <button
                onClick={() => onNavigate('user-dash')}
                className="px-3.5 py-2 text-sm font-medium bg-[#1c2b1f] hover:bg-[#243527] text-[#efe9d9] rounded-xl shadow-xs transition-all hover:-translate-y-0.5 cursor-pointer"
              >
                Dashboard
              </button>
              {onLogout && (
                <button
                  onClick={onLogout}
                  title="Sign out"
                  className="p-2 text-[#6b6a5f] hover:text-red-700 hover:bg-red-50 rounded-xl transition-all cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              )}
            </>
          ) : (
            <>
              {onGoogleSignIn && (
                <button
                  onClick={onGoogleSignIn}
                  className="hidden sm:flex items-center gap-2 px-3.5 py-2 text-xs font-medium border border-black/20 hover:bg-black/5 rounded-xl transition-all cursor-pointer bg-white/60"
                >
                  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84C6.71 7.31 9.14 5.38 12 5.38z"
                    />
                  </svg>
                  <span>Google Sign In</span>
                </button>
              )}
              <button
                id="navSignInBtn"
                onClick={() => onNavigate('login')}
                className="px-4 py-2 text-sm font-medium border border-black/20 hover:bg-black/5 rounded-xl transition-all cursor-pointer"
              >
                Sign in
              </button>
              <button
                id="navReportBtn"
                onClick={() => onNavigate('login')}
                className="px-4 py-2 text-sm font-medium bg-[#1c2b1f] hover:bg-[#243527] text-[#efe9d9] rounded-xl shadow-xs transition-all hover:-translate-y-0.5 cursor-pointer"
              >
                Report an item
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

