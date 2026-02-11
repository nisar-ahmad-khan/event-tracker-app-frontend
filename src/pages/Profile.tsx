import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  UserCircleIcon,
  EnvelopeIcon,
  MapPinIcon,
  CalendarIcon,
  BellIcon,
  ShieldCheckIcon,
  CreditCardIcon,
  CameraIcon,
  BriefcaseIcon,
  PhoneIcon,
  GlobeAltIcon,
  DocumentTextIcon,
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

  // Account state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [activeTab, setActiveTab] = useState('General');

  // Organizer registration state
  const [phone, setPhone] = useState('');
  const [description, setDescription] = useState('');
  const [website, setWebsite] = useState('');


  
  const user  =  localStorage.getItem('user');
  const authUser = useProfileStore((state)=>state.user);
   if(!user || !authUser){
    navigate('/');
   }
    
  
  const fetchFollowers = useFollowerStore((state)=>state.fetchFollowers);
  const fetchFollowing = useFollowerStore((state)=>state.fetchFollowing);
  useEffect(() => {
    fetchFollowers();
    fetchFollowing();
    if(!user && !authUser){
      navigate('/')
    }
  }, [fetchFollowers , fetchFollowing ,navigate]);


  useEffect(() => {
    if (authStore.user) {
      setName(authStore.user.name);
      setEmail(authStore.user.email);
    }
  }, [authStore.user]);

  
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

 
  const updateAccount = async () => {
    try {
      await authStore.updateAccount({ name, email });
      alert('Account updated successfully!');
    } catch (err: any) {
      alert(err?.message || 'Failed to update account');
    }
  };

  const registerOrganizer = async () => {
    try {
      await organizerStore.register({
        phone,
        description,
        website,
      });
      
    } catch (err: any) {
      alert(err?.message || 'Failed to submit application');
    }
  };


  const tabs = [
    { name: 'General', icon: UserCircleIcon },
    { name: 'Organizer', icon: BriefcaseIcon },
    
  ];

  const stats = [
    { label: 'Events Organized', value: '12' },
    { label: 'Tickets Sold', value: '1,420' },
    { label: 'Followers', value: followerStore.count },
    { label: 'Following', value: followerStore.following },
  ];
const meAsAnOrg = useOrganizerStore((state)=>state.meAsAnOrg);
  const isOrg = ()=>{
    if(meAsAnOrg){
      return true
    }else{
      return false
    }
  }

  useEffect(()=>{
    isOrg()
  },[isOrg])
  return (
    <div className="min-h-screen bg-slate-50/50 flex flex-col items-center py-12 px-4">
      <div className="w-full max-w-5xl">
        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-[2.5rem] p-8 shadow-xl flex flex-col md:flex-row gap-8 mb-8"
        >
          <div className="relative">
            <div className="w-32 h-32 rounded-[2rem] overflow-hidden ring-4 ring-indigo-50">
              <img
                src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e"
                alt="Profile"
                className="w-full h-full object-cover"
              />
            </div>
            <button className="absolute -bottom-2 -right-2 p-2 bg-indigo-600 text-white rounded-xl">
              <CameraIcon className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1">
            <h1 className="text-3xl font-black">{authStore.user?.name}</h1>
            <div className="flex gap-4 text-slate-500 mt-2">
              <span className="flex items-center gap-1">
                <MapPinIcon className="w-4 h-4" />
                {authStore.user?.location || 'N/A'}
              </span>
              <span className="flex items-center gap-1">
                <CalendarIcon className="w-4 h-4" />
                Joined {timeAgo(authStore.user?.created_at)}
              </span>
            </div>
          </div>

          <div className="flex gap-6">
            {stats.map(stat => (
              <div key={stat.label} className="text-center">
                <p className="text-2xl font-black text-indigo-600">
                  {stat.value}
                </p>
                <p className="text-xs font-bold text-slate-400 uppercase">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          {/* Sidebar */}
<div className="space-y-2">
  {tabs
    .filter(tab => !(tab.name === 'Organizer' && isOrg)) // <-- filter out Organizer if already an organizer
    .map(tab => (
      <button
        key={tab.name}
        onClick={() => setActiveTab(tab.name)}
        className={`w-full flex items-center gap-3 px-6 py-4 rounded-2xl font-bold ${
          activeTab === tab.name
            ? 'bg-indigo-600 text-white'
            : 'bg-white text-slate-500'
        }`}
      >
        <tab.icon className="w-5 h-5" />
        {tab.name}
      </button>
    ))}
</div>

          {/* Content */}
          <div className="lg:col-span-3 bg-white rounded-[2.5rem] p-10 shadow-xl">
            <AnimatePresence mode="wait">
              {activeTab === 'General' && (
                <motion.div
                  key="general"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="space-y-6"
                >
                  <h2 className="text-2xl font-black">General Settings</h2>

                  <input
                    value={name}
                    onChange={e => setName(e.target.value)}
                    className="w-full p-4 rounded-2xl bg-slate-50"
                    placeholder="Full name"
                  />

                  <input
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="w-full p-4 rounded-2xl bg-slate-50"
                    placeholder="Email address"
                  />

                  <button
                    onClick={updateAccount}
                    className="px-10 py-4 bg-indigo-600 text-white rounded-2xl font-black"
                  >
                    Save Changes
                  </button>
                </motion.div>
              )}

              {activeTab === 'Organizer' && !isOrg && (
                <motion.div
                  key="organizer"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="space-y-6"
                >
                  <h2 className="text-2xl font-black">Become an Organizer</h2>

                  <input
                    type="number"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    placeholder="Phone number"
                    className="w-full p-4 rounded-2xl bg-slate-50"
                  />

                  <textarea
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                    placeholder="Organizer description"
                    className="w-full p-4 rounded-2xl bg-slate-50"
                  />

                  <input
                    value={website}
                    onChange={e => setWebsite(e.target.value)}
                    placeholder="Website (optional)"
                    className="w-full p-4 rounded-2xl bg-slate-50"
                  />

                  <button
                    onClick={registerOrganizer}
                    className="px-10 py-4 bg-indigo-600 text-white rounded-2xl font-black"
                  >
                    Complete Registration
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
