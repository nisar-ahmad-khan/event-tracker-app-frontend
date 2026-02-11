import React, { useEffect, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  UserCircleIcon,
  MapPinIcon,
  CalendarIcon,
  CameraIcon,
  BriefcaseIcon,
  PlusCircleIcon,
  TicketIcon,
  UserPlusIcon,
  TagIcon,
  ShieldCheckIcon, 
} from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';
import { useProfileStore } from '../stores/store';
import { useFollowerStore } from '../modules/follwers';
import { useOrganizerStore } from '../modules/organizers';

const Profile: React.FC = () => {
  const authStore = useProfileStore();
  const followerStore = useFollowerStore();
  const organizerStore = useOrganizerStore();
  const navigate = useNavigate();

  // State
  const [activeTab, setActiveTab] = useState('General');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [description, setDescription] = useState('');
  const [website, setWebsite] = useState('');

  const [eventData, setEventData] = useState({
    title: '',
    location: '',
    date: '',
    chiefGuests: '',
    isFree: true,
    ticketPrice: '',
    category: 'Networking',
  });

  const user = localStorage.getItem('user');
  const authUser = useProfileStore((state) => state.user);
  const meAsAnOrg = useOrganizerStore((state) => state.meAsAnOrg);

  useEffect(() => {
    if (!user && !authUser) {
      navigate('/');
    } else {
      followerStore.fetchFollowers();
      followerStore.fetchFollowing();
    }
  }, [user, authUser, navigate]);

  useEffect(() => {
    if (authStore.user) {
      setName(authStore.user.name);
      setEmail(authStore.user.email);
    }
  }, [authStore.user]);

  const tabs = useMemo(() => {
    const list = [{ name: 'General', icon: UserCircleIcon }];
    if (meAsAnOrg) {
      list.push({ name: 'Organize an Event', icon: PlusCircleIcon });
    } else {
      list.push({ name: 'Organizer', icon: BriefcaseIcon });
    }
    return list;
  }, [meAsAnOrg]);

  const stats = [
    { label: 'Events Organized', value: '12' },
    { label: 'Tickets Sold', value: '1,420' },
    { label: 'Followers', value: followerStore.count },
    { label: 'Following', value: followerStore.following },
  ];

  function timeAgo(dateString?: string): string {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'N/A';
    const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
    const intervals = [
      { label: 'year', seconds: 31536000 },
      { label: 'month', seconds: 2592000 },
      { label: 'day', seconds: 86400 },
      { label: 'hour', seconds: 3600 },
      { label: 'minute', seconds: 60 },
      { label: 'second', seconds: 1 },
    ];
    for (const interval of intervals) {
      const count = Math.floor(seconds / interval.seconds);
      if (count >= 1)
        return `${count} ${interval.label}${count > 1 ? 's' : ''} ago`;
    }
    return 'just now';
  }

  return (
    <div className="min-h-screen bg-slate-50/50 flex flex-col items-center py-12 px-4">
      <div className="w-full max-w-5xl">
        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-[2.5rem] p-8 shadow-xl flex flex-col md:flex-row gap-8 mb-8 border border-slate-100"
        >
          <div className="relative">
            <div className="w-32 h-32 rounded-[2rem] overflow-hidden ring-4 ring-indigo-50">
              <img
                src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e"
                alt="Profile"
                className="w-full h-full object-cover"
              />
            </div>
            <button className="absolute -bottom-2 -right-2 p-2 bg-indigo-600 text-white rounded-xl shadow-lg">
              <CameraIcon className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1">
            <h1 className="text-3xl font-black text-slate-900">{authStore.user?.name}</h1>
            <div className="flex gap-4 text-slate-500 mt-2">
              <span className="flex items-center gap-1 text-sm">
                <MapPinIcon className="w-4 h-4" />
                {authStore.user?.location || 'N/A'}
              </span>
              <span className="flex items-center gap-1 text-sm font-bold text-indigo-600">
                <ShieldCheckIcon className="w-4 h-4" />
                {meAsAnOrg ? 'Verified Organizer' : 'Member'}
              </span>
            </div>
          </div>

          <div className="flex gap-6">
            {stats.map(stat => (
              <div key={stat.label} className="text-center">
                <p className="text-2xl font-black text-indigo-600">{stat.value}</p>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{stat.label}</p>
              </div>
            ))}
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="space-y-2">
            {tabs.map(tab => (
              <button
                key={tab.name}
                onClick={() => setActiveTab(tab.name)}
                className={`w-full flex items-center gap-3 px-6 py-4 rounded-2xl font-bold transition-all ${
                  activeTab === tab.name
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200'
                    : 'bg-white text-slate-500 hover:bg-slate-50'
                }`}
              >
                <tab.icon className="w-5 h-5" />
                {tab.name}
              </button>
            ))}
          </div>

          {/* Content */}
          <div className="lg:col-span-3 bg-white rounded-[2.5rem] p-10 shadow-xl border border-slate-100">
            <AnimatePresence mode="wait">
              {/* General Settings */}
              {activeTab === 'General' && (
                <motion.div key="general" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                  <h2 className="text-2xl font-black">General Settings</h2>
                  <input
                    value={name}
                    onChange={e => setName(e.target.value)}
                    className="w-full p-4 rounded-2xl bg-slate-50 border-none outline-none"
                    placeholder="Full name"
                  />
                  <input
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="w-full p-4 rounded-2xl bg-slate-50 border-none outline-none"
                    placeholder="Email address"
                  />
                  <button
                    onClick={() => authStore.updateAccount({ name, email })}
                    className="px-10 py-4 bg-indigo-600 text-white rounded-2xl font-black shadow-lg"
                  >
                    Save Changes
                  </button>
                </motion.div>
              )}

              {/* Organizer Registration */}
              {activeTab === 'Organizer' && !meAsAnOrg && (
                <motion.div key="reg" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                  <h2 className="text-2xl font-black">Become an Organizer</h2>
                  <input
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    className="w-full p-4 rounded-2xl bg-slate-50"
                    placeholder="Phone number"
                  />
                  <textarea
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                    className="w-full p-4 rounded-2xl bg-slate-50"
                    placeholder="About your org..."
                  />
                  <input
                    value={website}
                    onChange={e => setWebsite(e.target.value)}
                    className="w-full p-4 rounded-2xl bg-slate-50"
                    placeholder="Website (optional)"
                  />
                  <button
                    onClick={() => organizerStore.register({ phone, description, website })}
                    className="px-10 py-4 bg-indigo-600 text-white rounded-2xl font-black"
                  >
                    Submit Application
                  </button>
                </motion.div>
              )}

              {/* Organize Event */}
              {activeTab === 'Organize an Event' && meAsAnOrg && (
                <motion.div key="organize" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
                  <h2 className="text-2xl font-black text-indigo-600">Event Questions</h2>
                  <p className="text-slate-500 font-medium">Provide the following details to launch your event.</p>

                  {/* Venue & Date */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                        <MapPinIcon className="w-4 h-4" /> Where will this be conducted?
                      </label>
                      <input
                        className="w-full p-4 rounded-2xl bg-slate-50"
                        placeholder="Physical Address or Link"
                        onChange={e => setEventData({ ...eventData, location: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                        <CalendarIcon className="w-4 h-4" /> When will this be conducted?
                      </label>
                      <input
                        type="datetime-local"
                        className="w-full p-4 rounded-2xl bg-slate-50"
                        onChange={e => setEventData({ ...eventData, date: e.target.value })}
                      />
                    </div>
                  </div>

                  {/* Chief Guests & Category */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                        <UserPlusIcon className="w-4 h-4" /> Who are the chief guests?
                      </label>
                      <input
                        className="w-full p-4 rounded-2xl bg-slate-50"
                        placeholder="Guest Names"
                        onChange={e => setEventData({ ...eventData, chiefGuests: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                        <TagIcon className="w-4 h-4" /> Event Category
                      </label>
                      <select
                        className="w-full p-4 rounded-2xl bg-slate-50 outline-none"
                        onChange={e => setEventData({ ...eventData, category: e.target.value })}
                      >
                        <option>Technical Workshop</option>
                        <option>Networking Meetup</option>
                        <option>Charity Gala</option>
                        <option>Webinar</option>
                      </select>
                    </div>
                  </div>

                  {/* Ticketing */}
                  <div className="p-6 bg-slate-50 rounded-[2rem] space-y-4">
                    <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                      <TicketIcon className="w-4 h-4" /> Is this event free or paid?
                    </label>
                    <div className="flex gap-4">
                      <button
                        onClick={() => setEventData({ ...eventData, isFree: true })}
                        className={`flex-1 py-3 rounded-xl font-bold ${
                          eventData.isFree ? 'bg-indigo-600 text-white' : 'bg-white text-slate-500 border border-slate-200'
                        }`}
                      >
                        Free Entry
                      </button>
                      <button
                        onClick={() => setEventData({ ...eventData, isFree: false })}
                        className={`flex-1 py-3 rounded-xl font-bold ${
                          !eventData.isFree ? 'bg-indigo-600 text-white' : 'bg-white text-slate-500 border border-slate-200'
                        }`}
                      >
                        Paid Tickets
                      </button>
                    </div>
                    {!eventData.isFree && (
                      <input
                        type="number"
                        placeholder="Ticket Price ($)"
                        className="w-full p-4 rounded-2xl bg-white border border-slate-100 mt-2"
                        onChange={e => setEventData({ ...eventData, ticketPrice: e.target.value })}
                      />
                    )}
                  </div>

                  <button
                    onClick={() => alert('Event Logic Ready to Publish!')}
                    className="w-full py-5 bg-emerald-500 text-white rounded-[1.5rem] font-black text-lg hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-100"
                  >
                    Publish Event
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
