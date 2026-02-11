import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  MagnifyingGlassIcon,
  UserPlusIcon,
  CheckIcon,
  UsersIcon,
  StarIcon,
  CalendarDaysIcon,
} from "@heroicons/react/24/outline";
import { useOrganizerStore } from "../modules/organizers";
import { useFollowerStore } from "../modules/follwers";

const AllOrganizers: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [followedIds, setFollowedIds] = useState<Set<number>>(new Set());

  const organizers = useOrganizerStore((state) => state.orgs);
  const fetchOrganizers = useOrganizerStore((state) => state.fetchOrganizers);
  const message = useOrganizerStore((state) => state.message);

  const { followUnFollow, fetchFollowing, followed_users } = useFollowerStore();

  useEffect(() => {
    fetchOrganizers();
    fetchFollowing();
  }, [fetchOrganizers, fetchFollowing]);

  useEffect(() => {
    const ids = new Set<number>(
      followed_users.map((u) => u.pivot?.organizer_id!).filter(Boolean)
    );
    setFollowedIds(ids);
  }, [followed_users]);

  const handleFollow = async (organizerId: number) => {
    await followUnFollow({ organizer_id: organizerId });
    setFollowedIds((prev) => {
      const next = new Set(prev);
      next.has(organizerId) ? next.delete(organizerId) : next.add(organizerId);
      return next;
    });
  };

  const filteredOrganizers = organizers.filter((org) =>
    org.user?.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#FDFDFF] font-sans pb-10">
      
      {/* HERO SECTION - Adjusted padding for mobile */}
      <div className="bg-slate-900 pt-20 md:pt-32 pb-20 md:pb-24 px-6">
        <div className="max-w-7xl mx-auto text-center md:text-left">
          <motion.h1 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl lg:text-6xl font-black text-white leading-tight"
          >
            Discover <span className="text-indigo-400">Organizers</span>
          </motion.h1>
          <p className="text-slate-400 max-w-xl mt-4 text-base md:text-lg mx-auto md:ml-0">
            Connect with top-tier event planners and community leaders across the globe.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-6 -mt-12 space-y-10">
        
        {/* STATS SECTION - Grid adapts from 1 to 3 columns */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {[
            { label: "Total Organizers", value: organizers.length, icon: UsersIcon },
            { label: "Featured", value: 12, icon: StarIcon },
            { label: "Upcoming Events", value: 48, icon: CalendarDaysIcon },
          ].map((stat, idx) => (
            <motion.div 
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4"
            >
              <div className="p-3 bg-indigo-50 rounded-xl">
                <stat.icon className="w-6 h-6 text-indigo-600" />
              </div>
              <div>
                <p className="text-[10px] md:text-xs uppercase text-slate-400 font-bold tracking-wider">{stat.label}</p>
                <p className="text-xl md:text-2xl font-black text-slate-900">{stat.value}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* DIRECTORY SECTION */}
        <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden">
          
          {/* Header & Search - Flex-col on mobile, flex-row on desktop */}
          <div className="p-6 md:p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <h2 className="font-black text-xl md:text-2xl text-slate-900">Directory</h2>
            <div className="relative w-full md:w-80">
              <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                className="w-full pl-12 pr-4 py-3 bg-slate-50 rounded-2xl border border-transparent focus:bg-white focus:border-indigo-500 transition-all outline-none text-sm"
                placeholder="Search by name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* DESKTOP TABLE VIEW - Visible on lg screens and up */}
          <div className="hidden lg:block overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50/50 text-[10px] uppercase font-bold text-slate-400 tracking-widest">
                  <th className="px-8 py-4">Organizer</th>
                  <th className="px-8 py-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredOrganizers.map((org) => (
                  <tr key={org.id} className="group hover:bg-slate-50/50 transition-colors">
                    <td className="p-8 flex gap-6 items-center">
                      <img
                        src={`https://ui-avatars.com/api/?name=${org.user?.name}&background=6366f1&color=fff`}
                        className="w-14 h-14 rounded-2xl object-cover shadow-sm"
                        alt={org.user?.name}
                      />
                      <div>
                        <p className="font-black text-slate-900 group-hover:text-indigo-600 transition-colors">{org.user?.name}</p>
                        <p className="text-sm text-slate-400 font-medium">{org.user?.email}</p>
                      </div>
                    </td>
                    <td className="p-8 text-right">
                      <button
                        onClick={() => handleFollow(org.id)}
                        className={`inline-flex items-center gap-2 px-6 py-3 rounded-xl font-black text-sm transition-all ${
                          followedIds.has(org.id)
                            ? "bg-indigo-600 text-white shadow-lg shadow-indigo-100"
                            : "bg-white border border-slate-200 text-slate-600 hover:border-indigo-600 hover:text-indigo-600"
                        }`}
                      >
                        {followedIds.has(org.id) ? (
                          <><CheckIcon className="w-4 h-4" /> Following</>
                        ) : (
                          <><UserPlusIcon className="w-4 h-4" /> Follow</>
                        )}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* MOBILE CARD VIEW - Visible on screens smaller than lg */}
          <div className="lg:hidden divide-y divide-slate-100">
            {filteredOrganizers.map((org) => (
              <div key={org.id} className="p-6 flex flex-col gap-4">
                <div className="flex items-center gap-4">
                  <img
                    src={`https://ui-avatars.com/api/?name=${org.user?.name}&background=6366f1&color=fff`}
                    className="w-12 h-12 rounded-xl object-cover"
                    alt={org.user?.name}
                  />
                  <div className="overflow-hidden">
                    <p className="font-black text-slate-900 truncate">{org.user?.name}</p>
                    <p className="text-xs text-slate-400 truncate">{org.user?.email}</p>
                  </div>
                </div>
                <button
                  onClick={() => handleFollow(org.id)}
                  className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl font-black text-sm transition-all ${
                    followedIds.has(org.id)
                      ? "bg-indigo-600 text-white"
                      : "bg-slate-100 text-slate-600 active:bg-slate-200"
                  }`}
                >
                  {followedIds.has(org.id) ? (
                    <><CheckIcon className="w-4 h-4" /> Following</>
                  ) : (
                    <><UserPlusIcon className="w-4 h-4" /> Follow</>
                  )}
                </button>
              </div>
            ))}
          </div>

          {/* EMPTY STATE */}
          {filteredOrganizers.length === 0 && (
            <div className="py-20 text-center">
              <div className="inline-flex p-4 bg-slate-50 rounded-full mb-4">
                <UsersIcon className="w-8 h-8 text-slate-300" />
              </div>
              <p className="text-slate-400 font-bold">{message || "No organizers found matching your search."}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AllOrganizers;