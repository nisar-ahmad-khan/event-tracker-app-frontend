import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  UserCircleIcon,
  ArrowRightOnRectangleIcon,
  UsersIcon,
  Bars3Icon,
  XMarkIcon,
  HeartIcon,
  UserGroupIcon,
  BookmarkIcon // Added for Wishlist
} from '@heroicons/react/24/outline';
import { useProfileStore } from '../stores/store';

const Navbar = () => {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const authStore = useProfileStore();

  const logoutUser = async () => {
    if (confirm("Are you sure you want to log out?")) {
      try {
        await authStore.logout();
        setIsUserMenuOpen(false);
        window.location.href = "/";
      } catch (err) {
        alert("Logout failed " + err);
        localStorage.clear();
        authStore.user = null;
        authStore.token = null;
        window.location.href = '/';
      }
    }
  };

  const handleProfileNavigation = () => {
    setIsUserMenuOpen(false);
    window.location.href = '/profile';
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const isActive = (path: string) => window.location.pathname === path;

  const getLinkStyles = (path: string) => {
    const active = isActive(path);
    if (scrolled) {
      return active ? 'text-indigo-600' : 'text-slate-900 hover:text-indigo-500';
    }
    return active ? 'text-indigo-600' : 'text-slate-600 hover:text-slate-900';
  };

  return (
    <>
      <nav
        className={`fixed top-0 w-full z-50 px-6 md:px-8 py-4 flex justify-between items-center transition-all duration-300 ${
          scrolled
            ? 'bg-white/80 backdrop-blur-md shadow-sm border-b border-slate-200 py-3'
            : 'bg-transparent'
        }`}
      >
        <div className="flex items-center gap-10">
          <a href="/" className="font-black text-2xl tracking-tighter transition-colors text-slate-900">
            Event<span className="text-indigo-600">Track</span>
          </a>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            <a
              href="/organizers"
              className={`flex items-center gap-2 text-sm font-bold transition-all ${getLinkStyles('/organizers')}`}
            >
              <UsersIcon className="w-4 h-4" />
              Organizers
            </a>
            {authStore.user && (
              <>

                <a
                  href="/following"
                  className={`flex items-center gap-2 text-sm font-bold transition-all ${getLinkStyles('/following')}`}
                >
                  <HeartIcon className="w-4 h-4" />
                  Following
                </a>
                
                <a
                  href="/followers"
                  className={`flex items-center gap-2 text-sm font-bold transition-all ${getLinkStyles('/followers')}`}
                >
                  <UserGroupIcon className="w-4 h-4" />
                  Followers
                </a>
              </>
            )}
          </div>
        </div>

        <div className="flex items-center gap-4">
          {authStore.user ? (
            <div className="relative">
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center gap-2 font-bold transition-all hover:scale-105 active:scale-95 text-slate-900"
              >
                <div className={`p-0.5 rounded-full border-2 transition-colors ${scrolled ? 'border-indigo-100' : 'border-slate-200'}`}>
                    <UserCircleIcon className="w-8 h-8" />
                </div>
                <span className="hidden sm:inline">Account</span>
              </button>

              <AnimatePresence>
                {isUserMenuOpen && (
                  <>
                    <div className="fixed inset-0 z-[-1]" onClick={() => setIsUserMenuOpen(false)} />
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute right-0 mt-3 w-52 bg-white shadow-2xl rounded-2xl p-2 border border-slate-100 overflow-hidden"
                    >
                      <div className="px-4 py-2 mb-1">
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Settings</p>
                      </div>
                      <button
                        onClick={handleProfileNavigation}
                        className="flex items-center gap-3 w-full px-4 py-3 text-slate-700 hover:bg-indigo-50 rounded-xl transition-colors font-semibold text-sm"
                      >
                        <UserCircleIcon className="w-5 h-5 text-indigo-500" />
                        My Profile
                      </button>
                      <div className="my-2 border-t border-slate-50" />
                      <button
                        className="flex items-center gap-3 w-full px-4 py-3 text-red-500 hover:bg-red-50 rounded-xl transition-colors font-bold text-sm"
                        onClick={logoutUser}
                      >
                        <ArrowRightOnRectangleIcon className="w-5 h-5" />
                        Logout
                      </button>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <div className={`hidden md:flex items-center gap-6 font-bold transition-colors ${
                scrolled ? 'text-slate-900' : 'text-slate-600'
            }`}>
              <a href="/login" className="hover:text-slate-900 transition-colors">Login</a>
              <a 
                href="/register" 
                className={`px-6 py-2.5 rounded-xl transition-all font-black text-sm tracking-tight ${
                    scrolled 
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100 hover:bg-indigo-700' 
                    : 'bg-slate-900 text-white shadow-xl hover:bg-slate-800'
                }`}
              >
                Join Free
              </a>
            </div>
          )}

          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className={`md:hidden p-2 rounded-xl transition-colors ${
              scrolled ? 'text-slate-900 bg-slate-100' : 'text-slate-900 bg-slate-100'
            }`}
          >
            {isMobileMenuOpen ? <XMarkIcon className="w-6 h-6" /> : <Bars3Icon className="w-6 h-6" />}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="fixed top-[72px] left-0 w-full z-[40] bg-white border-b border-slate-200 overflow-hidden md:hidden shadow-xl"
          >
            <div className="flex flex-col p-6 gap-2">
              <a 
                href="/organizers" 
                className={`flex items-center gap-3 p-4 rounded-2xl font-bold transition-all ${
                  isActive('/organizers') ? 'bg-indigo-50 text-indigo-600' : 'text-slate-900 hover:bg-slate-50'
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <UsersIcon className="w-6 h-6" />
                Organizers
              </a>
              
              {authStore.user && (
                <>
                  <a 
                    href="/wishlist" 
                    className={`flex items-center gap-3 p-4 rounded-2xl font-bold transition-all ${
                      isActive('/wishlist') ? 'bg-indigo-50 text-indigo-600' : 'text-slate-900 hover:bg-slate-50'
                    }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <BookmarkIcon className="w-6 h-6" />
                    My Wishlist
                  </a>
                  <a 
                    href="/following" 
                    className={`flex items-center gap-3 p-4 rounded-2xl font-bold transition-all ${
                      isActive('/following') ? 'bg-indigo-50 text-indigo-600' : 'text-slate-900 hover:bg-slate-50'
                    }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <HeartIcon className="w-6 h-6" />
                    Following
                  </a>
                  <a 
                    href="/followers" 
                    className={`flex items-center gap-3 p-4 rounded-2xl font-bold transition-all ${
                      isActive('/followers') ? 'bg-indigo-50 text-indigo-600' : 'text-slate-900 hover:bg-slate-50'
                    }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <UserGroupIcon className="w-6 h-6" />
                    Followers
                  </a>
                </>
              )}

              {!authStore.user && (
                <div className="flex flex-col gap-3 pt-4 border-t border-slate-100">
                  <a href="/login" className="p-4 font-bold text-slate-900">Login</a>
                  <a href="/register" className="p-4 bg-indigo-600 text-white rounded-2xl text-center font-bold shadow-lg">Join Free</a>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;