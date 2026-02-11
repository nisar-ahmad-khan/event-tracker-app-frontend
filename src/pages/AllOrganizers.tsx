import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  MagnifyingGlassIcon,
  ArrowUpRightIcon,
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

  const {
    followUnFollow,
    fetchFollowing,
    followed_users,
  } = useFollowerStore();

  useEffect(() => {
    fetchOrganizers();
    fetchFollowing();
  }, [fetchOrganizers, fetchFollowing]);

  /** Sync followed organizers from backend */
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

      {/* HERO */}
      <div className="bg-slate-900 pt-28 pb-24 px-6">
        <div className="max-w-7xl mx-auto text-center md:text-left">
          <h1 className="text-5xl font-black text-white">
            Discover <span className="text-indigo-400">Organizers</span>
          </h1>
          <p className="text-slate-400 max-w-xl mt-3">
            Connect with top-tier event planners and community leaders.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 -mt-16 space-y-10">

        {/* STATS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { label: "Total Organizers", value: organizers.length, icon: UsersIcon },
            { label: "Featured", value: 12, icon: StarIcon },
            { label: "Upcoming Events", value: 48, icon: CalendarDaysIcon },
          ].map((stat) => (
            <div key={stat.label} className="bg-white p-6 rounded-2xl border flex gap-4">
              <stat.icon className="w-6 h-6 text-indigo-600" />
              <div>
                <p className="text-xs uppercase text-slate-400 font-bold">{stat.label}</p>
                <p className="text-2xl font-black">{stat.value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* DIRECTORY */}
        <div className="bg-white rounded-3xl border overflow-hidden">
          <div className="p-8 flex justify-between items-center">
            <h2 className="font-black text-xl">Directory</h2>
            <div className="relative w-80">
              <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                className="w-full pl-12 pr-4 py-3 bg-slate-50 rounded-xl"
                placeholder="Search by name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <table className="w-full hidden lg:table">
            <tbody>
              {filteredOrganizers.map((org) => (
                <tr key={org.id} className="border-t hover:bg-slate-50">
                  <td className="p-8 flex gap-6 items-center">
                    <img
                      src={`https://ui-avatars.com/api/?name=${org.user?.name}`}
                      className="w-14 h-14 rounded-xl"
                    />
                    <div>
                      <p className="font-black">{org.user?.name}</p>
                      <p className="text-sm text-slate-400">{org.user?.email}</p>
                    </div>
                  </td>

                  <td className="p-8 text-right">
                    <button
                      onClick={() => handleFollow(org.id)}
                      className={`px-6 py-3 rounded-xl font-black ${
                        followedIds.has(org.id)
                          ? "bg-indigo-600 text-white"
                          : "border"
                      }`}
                    >
                      {followedIds.has(org.id) ? "Following" : "Follow"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredOrganizers.length === 0 && (
            <div className="p-20 text-center text-slate-400 font-bold">
              {message || "No organizers found"}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AllOrganizers;
