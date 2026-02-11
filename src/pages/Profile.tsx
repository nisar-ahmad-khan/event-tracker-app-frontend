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
  XMarkIcon,
  SparklesIcon,
  ClockIcon, // Added for the end date field
} from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';
import { useProfileStore } from '../stores/store';
import { useFollowerStore } from '../modules/follwers';
import { useOrganizerStore } from '../modules/organizers';

// Toastify
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Profile: React.FC = () => {
  const authStore = useProfileStore();
  const followerStore = useFollowerStore();
  const organizerStore = useOrganizerStore();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('General');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [description, setDescription] = useState('');
  const [website, setWebsite] = useState('');

  const [guestInput, setGuestInput] = useState('');
  const [eventData, setEventData] = useState({
    title: '',
    location: '',
    date: '',      // This is the start date
    endDate: '',   // ✅ Added closing/ending date
    chiefGuests: [] as string[],
    isFree: true,
    ticketPrice: '',
    category: 'Networking Meetup',
  });

  const user = localStorage.getItem('user');
  const authUser = useProfileStore((state) => state.user);
  const meAsAnOrg = useOrganizerStore((state) => state.meAsAnOrg);

  const isActuallyOrganizer = !!meAsAnOrg;

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

  const addGuest = (e: React.KeyboardEvent) => {
    if ((e.key === 'Enter' || e.key === ',') && guestInput.trim()) {
      e.preventDefault();
      const newGuest = guestInput.trim().replace(/,/g, '');
      if (!eventData.chiefGuests.includes(newGuest)) {
        setEventData(prev => ({
          ...prev,
          chiefGuests: [...prev.chiefGuests, newGuest],
        }));
      }
      setGuestInput('');
    }
  };

  const removeGuest = (indexToRemove: number) => {
    setEventData(prev => ({
      ...prev,
      chiefGuests: prev.chiefGuests.filter((_, i) => i !== indexToRemove),
    }));
  };

  const tabs = useMemo(() => {
    const list = [{ name: 'General', icon: UserCircleIcon }];
    if (isActuallyOrganizer) {
      list.push({ name: 'Organize an Event', icon: PlusCircleIcon });
    } else {
      list.push({ name: 'Organizer', icon: BriefcaseIcon });
    }
    return list;
  }, [isActuallyOrganizer]);

  const stats = [
    { label: 'Events Organized', value: '12' },
    { label: 'Tickets Sold', value: '1,420' },
    { label: 'Followers', value: followerStore.count },
    { label: 'Following', value: followerStore.following },
  ];

  const categories = [
    "Technical Workshop", "Networking Meetup", "Charity Gala", "Webinar / Online",
    "Music Concert", "Art Exhibition", "Business Summit", "Product Launch",
    "Hackathon", "Sports Tournament", "Community Festival", "Educational Seminar"
  ];

  const handleSaveProfile = async () => {
    try {
      await authStore.updateAccount({ name, email });
      toast.success('Profile updated successfully!');
    } catch (err: any) {
      toast.error(err?.message || 'Failed to update profile');
    }
  };

  const handleRegisterOrganizer = async () => {
    if (!phone || !description) {
      toast.error('Please fill all required fields');
      return;
    }
    try {
      await organizerStore.register({ phone, description, website });
      toast.success('Organizer registration submitted!');
      setActiveTab('General');
    } catch (err: any) {
      toast.error(err?.message || 'Failed to submit application');
    }
  };

  const handlePublishEvent = async () => {
    if (!eventData.location || !eventData.date || !eventData.endDate || eventData.chiefGuests.length === 0) {
      toast.error('All fields including Start and End dates are required');
      return;
    }

    // Logic to check if end date is before start date
    if (new Date(eventData.endDate) <= new Date(eventData.date)) {
      toast.error('Event must end after it starts!');
      return;
    }

    try {
      toast.success('Event published successfully!');
      setEventData({
        title: '',
        location: '',
        date: '',
        endDate: '',
        chiefGuests: [],
        isFree: true,
        ticketPrice: '',
        category: 'Networking Meetup',
      });
      setGuestInput('');
    } catch (err: any) {
      toast.error(err?.message || 'Failed to publish event');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/50 flex flex-col items-center py-12 px-4 text-slate-900">
      <ToastContainer position="top-right" autoClose={3000} />

      <div className="w-full max-w-5xl">
        {/* Profile Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-[2.5rem] p-8 shadow-xl flex flex-col md:flex-row gap-8 mb-8 border border-slate-100">
          <div className="relative">
            <div className="w-32 h-32 rounded-[2rem] overflow-hidden ring-4 ring-indigo-50">
              <img src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e" alt="Profile" className="w-full h-full object-cover" />
            </div>
            <button className="absolute -bottom-2 -right-2 p-2 bg-indigo-600 text-white rounded-xl shadow-lg hover:scale-110 transition-transform">
              <CameraIcon className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1">
            <h1 className="text-3xl font-black">{authStore.user?.name}</h1>
            <div className="flex gap-4 text-slate-500 mt-2">
              <span className="flex items-center gap-1 text-sm"><MapPinIcon className="w-4 h-4" /> {authStore.user?.location || 'N/A'}</span>
              <span className="flex items-center gap-1 text-sm font-bold text-indigo-600">
                <ShieldCheckIcon className="w-4 h-4" /> {isActuallyOrganizer ? 'Verified Organizer' : 'Member'}
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
                  activeTab === tab.name ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' : 'bg-white text-slate-500 hover:bg-slate-100'
                }`}
              >
                <tab.icon className="w-5 h-5" /> {tab.name}
              </button>
            ))}
          </div>

          {/* Content Area */}
          <div className="lg:col-span-3 bg-white rounded-[2.5rem] p-10 shadow-xl border border-slate-100">
            <AnimatePresence mode="wait">
              {activeTab === 'General' && (
                <motion.div key="general" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6">
                  <h2 className="text-2xl font-black">General Settings</h2>
                  <div className="grid gap-4">
                    <input value={name} onChange={e => setName(e.target.value)} className="w-full p-4 rounded-2xl bg-slate-50 border border-transparent focus:border-indigo-500 focus:bg-white outline-none transition-all" placeholder="Full name" />
                    <input value={email} onChange={e => setEmail(e.target.value)} className="w-full p-4 rounded-2xl bg-slate-50 border border-transparent focus:border-indigo-500 focus:bg-white outline-none transition-all" placeholder="Email address" />
                  </div>
                  <button onClick={handleSaveProfile} className="px-10 py-4 bg-indigo-600 text-white rounded-2xl font-black shadow-lg hover:shadow-indigo-300 transition-all">Save Changes</button>
                </motion.div>
              )}

              {activeTab === 'Organizer' && !isActuallyOrganizer && (
                <motion.div key="reg" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6">
                  <h2 className="text-2xl font-black">Become an Organizer</h2>
                  <input value={phone} onChange={e => setPhone(e.target.value)} className="w-full p-4 rounded-2xl bg-slate-50 outline-none" placeholder="Phone number" />
                  <textarea value={description} onChange={e => setDescription(e.target.value)} className="w-full p-4 rounded-2xl bg-slate-50 outline-none min-h-[120px]" placeholder="About your organization..." />
                  <input value={website} onChange={e => setWebsite(e.target.value)} className="w-full p-4 rounded-2xl bg-slate-50 outline-none" placeholder="Website (optional)" />
                  <button onClick={handleRegisterOrganizer} className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-black shadow-lg">Submit Application</button>
                </motion.div>
              )}

              {activeTab === 'Organize an Event' && isActuallyOrganizer && (
                <motion.div key="organize" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-8">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-indigo-100 rounded-2xl text-indigo-600"><SparklesIcon className="w-6 h-6" /></div>
                    <div>
                      <h2 className="text-2xl font-black">Event Creation</h2>
                      <p className="text-slate-500 font-medium">Fill in the details to launch your event.</p>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700 ml-1">Location</label>
                        <div className="flex items-center bg-slate-50 rounded-2xl px-4 border focus-within:border-indigo-500 transition-all">
                          <MapPinIcon className="w-5 h-5 text-slate-400" />
                          <input className="w-full p-4 bg-transparent outline-none" placeholder="Venue or Link" value={eventData.location} onChange={e => setEventData({...eventData, location: e.target.value})} />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700 ml-1">Event Category</label>
                        <select className="w-full p-4 rounded-2xl bg-slate-50 outline-none border focus:border-indigo-500" value={eventData.category} onChange={e => setEventData({...eventData, category: e.target.value})}>
                          {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                        </select>
                      </div>
                    </div>

                    {/* ✅ New Grid for Start and End Dates */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700 ml-1">Start Date & Time</label>
                        <div className="flex items-center bg-slate-50 rounded-2xl px-4 border focus-within:border-indigo-500 transition-all">
                          <CalendarIcon className="w-5 h-5 text-slate-400" />
                          <input type="datetime-local" className="w-full p-4 bg-transparent outline-none" value={eventData.date} onChange={e => setEventData({...eventData, date: e.target.value})} />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700 ml-1 text-indigo-600 italic">Closing Date & Time</label>
                        <div className="flex items-center bg-indigo-50/50 rounded-2xl px-4 border border-indigo-100 focus-within:border-indigo-500 transition-all">
                          <ClockIcon className="w-5 h-5 text-indigo-400" />
                          <input type="datetime-local" className="w-full p-4 bg-transparent outline-none" value={eventData.endDate} onChange={e => setEventData({...eventData, endDate: e.target.value})} />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700 ml-1">Chief Guests (Press Enter)</label>
                      <div className="bg-slate-50 rounded-[1.5rem] p-3 border focus-within:border-indigo-500 transition-all">
                        <div className="flex flex-wrap gap-2 mb-2">
                          {eventData.chiefGuests.map((guest, index) => (
                            <span key={index} className="flex items-center gap-1 px-3 py-1 bg-indigo-600 text-white rounded-full text-sm font-bold">
                              {guest}
                              <button onClick={() => removeGuest(index)}><XMarkIcon className="w-4 h-4" /></button>
                            </span>
                          ))}
                        </div>
                        <input value={guestInput} onKeyDown={addGuest} onChange={(e) => setGuestInput(e.target.value)} placeholder="Add guest..." className="w-full p-2 bg-transparent outline-none" />
                      </div>
                    </div>

                    <div className="p-1 bg-slate-100 rounded-3xl flex gap-1">
                      <button onClick={() => setEventData({ ...eventData, isFree: true })} className={`flex-1 py-4 rounded-[1.2rem] font-black transition-all ${eventData.isFree ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500'}`}>Free</button>
                      <button onClick={() => setEventData({ ...eventData, isFree: false })} className={`flex-1 py-4 rounded-[1.2rem] font-black transition-all ${!eventData.isFree ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500'}`}>Paid</button>
                    </div>

                    {!eventData.isFree && (
                      <input type="number" className="w-full p-4 rounded-2xl bg-indigo-50/50 border-2 border-indigo-100 outline-none" placeholder="Price ($)" value={eventData.ticketPrice} onChange={e => setEventData({...eventData, ticketPrice: e.target.value})} />
                    )}

                    <button onClick={handlePublishEvent} className="w-full py-5 bg-indigo-600 text-white rounded-[2rem] font-black text-xl shadow-xl hover:bg-indigo-700 transition-all">Launch Event</button>
                  </div>
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