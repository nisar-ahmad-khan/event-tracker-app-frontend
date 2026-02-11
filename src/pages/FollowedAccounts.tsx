import React, { useEffect, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  UserMinusIcon,
  CheckBadgeIcon,
  Squares2X2Icon,
  MagnifyingGlassIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import { useProfileStore } from '../stores/store';
import { useNavigate } from 'react-router-dom';
import { useFollowerStore } from '../modules/follwers';

interface OrganizerAccount {
  id: number;
  user: {
    id: number;
    name: string;
    email: string;
  };
}

const FollowedAccounts: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [localUser, setLocalUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const followUnFollow = useFollowerStore((state) => state.followUnFollow);
  const fetchFollowing = useFollowerStore((state) => state.fetchFollowing);
  const fetchFollowers = useFollowerStore((state) => state.fetchFollowers);

  const accounts = useFollowerStore(
    (state) => (state.followed_users as OrganizerAccount[]) || []
  );

  const authStore = useProfileStore();
  const navigate = useNavigate();

  const handleUnfollow = async (organizerId: number) => {
    await followUnFollow({ organizer_id: organizerId });
    await fetchFollowing(); // refresh list after unfollow
  };

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user') || 'null');
    const user = authStore.user || storedUser;

    if (!user) {
      navigate('/');
      return;
    }

    setLocalUser(user);

    const loadData = async () => {
      try {
        await Promise.all([fetchFollowers(), fetchFollowing()]);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [authStore.user, navigate, fetchFollowing, fetchFollowers]);

  const filteredAccounts = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return accounts;

    return accounts.filter(
      (acc) =>
        acc.user.name.toLowerCase().includes(query) ||
        acc.user.email.toLowerCase().includes(query)
    );
  }, [accounts, searchQuery]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.05 } }
  };

  const cardVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: 'spring', stiffness: 260, damping: 20 }
    },
    exit: {
      scale: 0.9,
      opacity: 0,
      transition: { duration: 0.2 }
    }
  };

  if (loading || !localUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-500 text-lg font-medium">Loading organizers...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-12 font-sans">
      <div className="max-w-6xl mx-auto">

        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
        >
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{localUser.name}</h2>
            <p className="text-gray-500 font-medium">{localUser.email}</p>
          </div>
          <div className="px-4 py-2 bg-emerald-50 text-emerald-700 rounded-full text-sm font-bold">
            Active Profile
          </div>
        </motion.div>

        {/* Search Header */}
        <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }}>
            <h1 className="text-4xl font-black text-gray-900 tracking-tight">
              Following
            </h1>
            <p className="text-gray-500 mt-2 font-medium">
              {searchQuery
                ? `Showing ${filteredAccounts.length} results`
                : `You are following ${accounts.length} organizers`}
            </p>
          </motion.div>

          <motion.div
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="relative w-full md:w-80"
          >
            <MagnifyingGlassIcon className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-11 py-3 bg-white border border-gray-200 rounded-2xl shadow-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 focus:outline-none transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <XMarkIcon className="w-5 h-5" />
              </button>
            )}
          </motion.div>
        </header>

        {/* Accounts Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          <AnimatePresence mode="popLayout">
            {filteredAccounts.map((account) => (
              <motion.div
                key={account.id}
                layout
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-sm hover:shadow-xl transition-all group"
              >
                <div className="flex flex-col items-center text-center">

                  <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-gray-100 to-gray-200 mb-6 shadow-inner flex items-center justify-center text-gray-400 font-bold text-2xl">
                    {account.user.name.charAt(0)}
                  </div>

                  <div className="flex items-center gap-1.5 mb-1">
                    <h3 className="text-xl font-bold text-gray-900 group-hover:text-emerald-600 transition-colors">
                      {account.user.name}
                    </h3>
                    <CheckBadgeIcon className="w-5 h-5 text-blue-500 flex-shrink-0" />
                  </div>

                  <p className="text-gray-400 text-sm mb-8">{account.user.email}</p>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleUnfollow(account.user.id)}
                    className="w-full py-3.5 bg-gray-50 hover:bg-red-50 text-gray-600 hover:text-red-600 rounded-2xl font-bold flex items-center justify-center gap-2 border border-transparent hover:border-red-100 transition-all"
                  >
                    <UserMinusIcon className="w-5 h-5" />
                    Unfollow
                  </motion.button>

                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Empty State */}
        {filteredAccounts.length === 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-32 bg-white rounded-[3rem] border border-dashed border-gray-200 mt-6"
          >
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-300">
              <Squares2X2Icon className="w-10 h-10" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {searchQuery ? 'No matches found' : 'Not following anyone'}
            </h2>
            <p className="text-gray-500 max-w-xs mx-auto mb-8">
              {searchQuery
                ? `We couldn't find any organizers matching "${searchQuery}".`
                : "Browse organizers to stay updated with their latest events."}
            </p>
          </motion.div>
        )}

      </div>
    </div>
  );
};

export default FollowedAccounts;
