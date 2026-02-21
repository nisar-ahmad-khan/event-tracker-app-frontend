import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MagnifyingGlassIcon,
  UserGroupIcon,
  ShieldCheckIcon,
  ChatBubbleLeftRightIcon,
} from "@heroicons/react/24/outline";
import { useFollowerStore } from "../modules/follwers";
import { API_BASE_URL } from "../modules/api";

interface Follower {
  id: number;
  name: string;
  email?: string;
  profile_img?: string;
  image?: string;
  is_following?: boolean;
  created_at?: string;
}

const FollowersPage: React.FC = () => {
  const [search, setSearch] = useState("");
  const [loadingId, setLoadingId] = useState<number | null>(null);

  const SERVER_URL = API_BASE_URL.replace(/\/api$/, "");

  const followers = useFollowerStore((state) => state.followers);
  const fetchFollowers = useFollowerStore((state) => state.fetchFollowers);
  const followUnFollow = useFollowerStore((state) => state.followUnFollow);

  useEffect(() => {
    fetchFollowers();
  }, [fetchFollowers]);

  const handleFollowBack = async (organizerId: number) => {
    setLoadingId(organizerId);
    try {
      await followUnFollow({ organizer_id: organizerId });
      await fetchFollowers();
    } catch (err: any) {
      console.error("Action failed:", err.message);
    } finally {
      setLoadingId(null);
    }
  };

  const uiFollowers = useMemo(() => {
    return (followers || []).map((f: Follower) => {
      const isMutual = f.is_following || false;
      const imgPath = f.profile_img || f.image;
      const avatarUrl = imgPath
        ? imgPath.startsWith("http")
          ? imgPath
          : `${SERVER_URL}/storage/${imgPath}`
        : `https://ui-avatars.com/api/?name=${encodeURIComponent(f.name || "U")}&background=6366f1&color=fff`;

      return {
        ...f,
        joinedDate: f.created_at
          ? new Date(f.created_at).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
            })
          : "Recently",
        isMutual,
        avatarUrl,
        avatarColor: isMutual ? "bg-emerald-500" : "bg-indigo-500",
      };
    });
  }, [followers, SERVER_URL]);

  const filteredFollowers = useMemo(() => {
    return uiFollowers.filter(
      (f) =>
        f.name?.toLowerCase().includes(search.toLowerCase()) ||
        f.email?.toLowerCase().includes(search.toLowerCase())
    );
  }, [search, uiFollowers]);

  return (
    <div className="min-h-screen bg-slate-50 pt-28 pb-12 px-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-indigo-600 rounded-lg shadow-lg">
                <UserGroupIcon className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-3xl font-black text-slate-900">Your Community</h1>
            </div>
            <p className="text-slate-500 font-medium">
              Followers <b className="text-slate-600">{followers.length}</b>
            </p>
          </motion.div>

          {/* Search */}
          <div className="relative group">
            <MagnifyingGlassIcon className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search..."
              className="pl-12 pr-6 py-3 bg-white border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:outline-none w-full md:w-80 transition-all"
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="px-8 py-5 text-xs font-black uppercase text-slate-400">User</th>
                <th className="px-8 py-5 text-xs font-black uppercase text-slate-400">Status</th>
                <th className="px-8 py-5 text-xs font-black uppercase text-slate-400">Joined</th>
                <th className="px-8 py-5 text-xs font-black uppercase text-slate-400 text-right">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-50">
              <AnimatePresence mode="popLayout">
                {filteredFollowers.map((follower) => (
                  <motion.tr
                    key={follower.id}
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="group hover:bg-slate-50/80 transition-colors"
                  >
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-4">
                        <img
                          src={follower.avatarUrl}
                          alt={follower.name}
                          className="w-10 h-10 rounded-full object-cover border border-slate-100 shadow-sm"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${follower.name}&background=6366f1&color=fff`;
                          }}
                        />
                        <div>
                          <p className="font-bold text-slate-900">{follower.name}</p>
                          <p className="text-xs text-slate-500">{follower.email}</p>
                        </div>
                      </div>
                    </td>

                    <td className="px-8 py-5">
                      {follower.isMutual ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-emerald-50 text-emerald-600 text-[10px] font-bold uppercase rounded-full border border-emerald-100">
                          <ShieldCheckIcon className="w-3 h-3" />
                          Mutual
                        </span>
                      ) : (
                        <span className="inline-flex px-2.5 py-0.5 bg-slate-100 text-slate-500 text-[10px] font-bold uppercase rounded-full">
                          Follower
                        </span>
                      )}
                    </td>

                    <td className="px-8 py-5 text-sm text-slate-600">
                      {follower.joinedDate}
                    </td>

                    <td className="px-8 py-5 text-right">
                      <div className="flex justify-end gap-3 items-center min-h-[40px]">
                        <button
                          className="p-2 text-slate-400 hover:text-indigo-600 transition-colors"
                          title="Message"
                        >
                          <ChatBubbleLeftRightIcon className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>

        {/* Empty State */}
        {filteredFollowers.length === 0 && (
          <div className="mt-12 text-center py-20 bg-white rounded-[2.5rem] border border-slate-200">
            <UserGroupIcon className="w-12 h-12 text-slate-200 mx-auto mb-4" />
            <p className="text-slate-400 font-medium">No followers yet!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FollowersPage;