import React, { useEffect, useState, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  UserCircleIcon,
  MapPinIcon,
  CalendarIcon,
  CameraIcon,
  BriefcaseIcon,
  PlusCircleIcon,
  ShieldCheckIcon,
  XMarkIcon,
  SparklesIcon,
  ClockIcon,
  GlobeAltIcon,
  DocumentTextIcon,
  UsersIcon,
  PhotoIcon, // Added for image upload
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
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [activeTab, setActiveTab] = useState('General');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [description, setDescription] = useState('');
  const [website, setWebsite] = useState('');

  const [guestInput, setGuestInput] = useState('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  
  const [eventData, setEventData] = useState({
    title: '',
    location: '',
    date: '',
    endDate: '',
    description: '',
    websiteUrl: '',
    chiefGuests: [] as string[],
    isFree: true,
    ticketPrice: '',
    category: 'Networking Meetup',
    eventImage: null as File | null, // ✅ Added for the file field
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

  // Handle Image Selection
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast.error("Image is too large. Max 5MB.");
        return;
      }
      setEventData({ ...eventData, eventImage: file });
      setImagePreview(URL.createObjectURL(file));
    }
  };

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
    if (!eventData.location || !eventData.date || !eventData.endDate) {
      toast.error('Location and both Dates are required');
      return;
    }

    if (new Date(eventData.endDate) <= new Date(eventData.date)) {
      toast.error('Event must end after it starts!');
      return;
    }

    try {
      toast.success('Event published successfully!');
      // Reset form
      setEventData({
        title: '',
        location: '',
        date: '',
        endDate: '',
        description: '',
        websiteUrl: '',
        chiefGuests: [],
        isFree: true,
        ticketPrice: '',
        category: 'Networking Meetup',
        eventImage: null,
      });
      setImagePreview(null);
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

              {activeTab === 'Organize an Event' && isActuallyOrganizer && (
                <motion.div key="organize" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-8">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-indigo-100 rounded-2xl text-indigo-600"><SparklesIcon className="w-6 h-6" /></div>
                    <div>
                      <h2 className="text-2xl font-black">Event Creation</h2>
                      <p className="text-slate-500 font-medium">Launch your next big thing.</p>
                    </div>
                  </div>

                  <div className="space-y-6">
                    {/* ✅ New File Upload Field */}
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700 ml-1">Event Cover Image</label>
                      <div 
                        onClick={() => fileInputRef.current?.click()}
                        className="relative w-full h-48 bg-slate-50 rounded-[2rem] border-2 border-dashed border-slate-200 hover:border-indigo-400 transition-all cursor-pointer overflow-hidden flex flex-col items-center justify-center group"
                      >
                        {imagePreview ? (
                          <>
                            <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                              <CameraIcon className="w-8 h-8 text-white" />
                            </div>
                          </>
                        ) : (
                          <div className="text-center">
                            <PhotoIcon className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">upload cover image</p>
                          </div>
                        )}
                      </div>
                      <input 
                        type="file" 
                        ref={fileInputRef} 
                        onChange={handleImageChange} 
                        accept="image/*" 
                        className="hidden" 
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700 ml-1">Location</label>
                        <div className="flex items-center bg-slate-50 rounded-2xl px-4 border focus-within:border-indigo-500 transition-all">
                          <MapPinIcon className="w-5 h-5 text-slate-400" />
                          <input className="w-full p-4 bg-transparent outline-none" placeholder="Venue or Link" value={eventData.location} onChange={e => setEventData({...eventData, location: e.target.value})} />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700 ml-1">Category</label>
                        <select className="w-full p-4 rounded-2xl bg-slate-50 outline-none border focus:border-indigo-500" value={eventData.category} onChange={e => setEventData({...eventData, category: e.target.value})}>
                          {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                        </select>
                      </div>
                    </div>

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
                      <label className="text-sm font-bold text-slate-700 ml-1">Event Description (Optional)</label>
                      <div className="flex items-start bg-slate-50 rounded-2xl px-4 border focus-within:border-indigo-500 transition-all">
                        <DocumentTextIcon className="w-5 h-5 text-slate-400 mt-4" />
                        <textarea className="w-full p-4 bg-transparent outline-none min-h-[100px] resize-none" placeholder="Tell people what the event is about..." value={eventData.description} onChange={e => setEventData({...eventData, description: e.target.value})} />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700 ml-1">Website (Optional)</label>
                        <div className="flex items-center bg-slate-50 rounded-2xl px-4 border focus-within:border-indigo-500 transition-all">
                          <GlobeAltIcon className="w-5 h-5 text-slate-400" />
                          <input className="w-full p-4 bg-transparent outline-none" placeholder="https://..." value={eventData.websiteUrl} onChange={e => setEventData({...eventData, websiteUrl: e.target.value})} />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700 ml-1">Chief Guests (Optional)</label>
                        <div className="flex items-center bg-slate-50 rounded-2xl px-4 border focus-within:border-indigo-500 transition-all">
                          <UsersIcon className="w-5 h-5 text-slate-400" />
                          <input value={guestInput} onKeyDown={addGuest} onChange={(e) => setGuestInput(e.target.value)} placeholder="Press Enter to add" className="w-full p-4 bg-transparent outline-none" />
                        </div>
                      </div>
                    </div>

                    {/* Guest Tags Display */}
                    {eventData.chiefGuests.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {eventData.chiefGuests.map((guest, index) => (
                          <span key={index} className="flex items-center gap-1 px-3 py-1 bg-indigo-600 text-white rounded-full text-sm font-bold">
                            {guest}
                            <button onClick={() => removeGuest(index)}><XMarkIcon className="w-4 h-4" /></button>
                          </span>
                        ))}
                      </div>
                    )}

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