import React, { useEffect, useState, useMemo, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  UserCircleIcon,
  BriefcaseIcon,
  PlusCircleIcon,
  PhotoIcon,
  MapPinIcon,
  GlobeAltIcon,
  PhoneIcon,
  DocumentTextIcon,
  CheckBadgeIcon,
  ArrowRightCircleIcon,
} from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";
import { useProfileStore } from "../stores/store";
import { useFollowerStore } from "../modules/follwers";
import { useOrganizerStore } from "../modules/organizers";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Reusable Input Component for consistency
const FormField = ({ label, icon: Icon, children }: any) => (
  <div className="group w-full">
    <label className="block text-sm font-bold text-slate-700 mb-2 ml-1">{label}</label>
    <div className="relative">
      {Icon && <Icon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />}
      {children}
    </div>
  </div>
);

const Profile: React.FC = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Zustand selectors
  const authUser = useProfileStore((state) => state.user);
  const updateAccount = useProfileStore((state) => state.updateAccount);
  const fetchFollowers = useFollowerStore((state) => state.fetchFollowers);
  const fetchFollowing = useFollowerStore((state) => state.fetchFollowing);

  const {
    meAsAnOrg,
    loading,
    register,
    fetchOrganizers,
    fetchMyOrgAcc,
    createEvent,
  } = useOrganizerStore();

  const isActuallyOrganizer = !!meAsAnOrg;

  // State Management
  const [activeTab, setActiveTab] = useState("General");
  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
    phone: "",
    description: "",
    website: "",
  });
  
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [eventData, setEventData] = useState({
    title: "",
    location: "",
    date: "",
    endDate: "",
    description: "",
    websiteUrl: "",
    chiefGuests: [] as string[],
    isFree: true,
    ticketPrice: "",
    category: "Networking Meetup",
    eventImage: null as File | null,
  });

  // Lifecycle
  useEffect(() => {
    if (authUser === undefined) return;
    if (!authUser) {
      navigate("/");
      return;
    }
    fetchFollowers();
    fetchFollowing();
    fetchOrganizers();
    fetchMyOrgAcc();
  }, [authUser, navigate, fetchFollowers, fetchFollowing, fetchOrganizers, fetchMyOrgAcc]);

  useEffect(() => {
    if (authUser) {
      setProfileData(prev => ({ ...prev, name: authUser.name, email: authUser.email }));
    }
  }, [authUser]);

  // Clean up image preview URL to prevent memory leaks
  useEffect(() => {
    return () => {
      if (imagePreview) URL.revokeObjectURL(imagePreview);
    };
  }, [imagePreview]);

  const tabs = useMemo(() => [
    { name: "General", icon: UserCircleIcon },
    isActuallyOrganizer
      ? { name: "Organize an Event", icon: PlusCircleIcon }
      : { name: "Become an Organizer", icon: BriefcaseIcon },
  ], [isActuallyOrganizer]);

  // Handlers
  const handleSaveProfile = async () => {
    try {
      await updateAccount({ name: profileData.name, email: profileData.email });
      toast.success("Profile updated successfully");
    } catch (err: any) {
      toast.error(err?.message || "Failed to update profile");
    }
  };

  const handleRegisterOrganizer = async () => {
    if (!profileData.phone || !profileData.description) {
      toast.error("Phone and description are required");
      return;
    }
    try {
      await register({ 
        phone: profileData.phone, 
        description: profileData.description, 
        website: profileData.website 
      });
      await fetchMyOrgAcc();
      toast.success("Registered successfully");
      setActiveTab("Organize an Event");
    } catch (err: any) {
      toast.error(err?.message || "Registration failed");
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be under 5MB");
      return;
    }
    setEventData((prev) => ({ ...prev, eventImage: file }));
    if (imagePreview) URL.revokeObjectURL(imagePreview);
    setImagePreview(URL.createObjectURL(file));
  };

  const handlePublishEvent = async () => {
    const { title, location, date, endDate } = eventData;
    if (!title || !location || !date || !endDate) {
      toast.error("Title, location, and dates are required");
      return;
    }
    try {
      const formData = new FormData();
      Object.entries({
        title: eventData.title,
        location: eventData.location,
        starting_date_and_time: eventData.date,
        ending_date_and_time: eventData.endDate,
        description: eventData.description,
        url: eventData.websiteUrl,
        category: eventData.category,
        is_free: eventData.isFree ? "1" : "0",
        ticket_price: eventData.isFree ? "0" : eventData.ticketPrice,
      }).forEach(([key, value]) => formData.append(key, value));

      if (eventData.eventImage) formData.append("image", eventData.eventImage);

      await createEvent(formData);
      toast.success("Event created successfully");
      setEventData({ title: "", location: "", date: "", endDate: "", description: "", websiteUrl: "", chiefGuests: [], isFree: true, ticketPrice: "", category: "Networking Meetup", eventImage: null });
      setImagePreview(null);
    } catch (err: any) {
      toast.error(err?.message || "Event creation failed");
    }
  };

  const inputStyles = "w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-50 focus:border-indigo-500 focus:bg-white transition-all shadow-sm";

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-12 flex justify-center font-sans antialiased text-slate-900">
      <ToastContainer position="bottom-right" theme="colored" />

      <div className="w-full max-w-6xl bg-white shadow-[0_32px_64px_-12px_rgba(0,0,0,0.08)] rounded-[3rem] overflow-hidden border border-slate-100 flex flex-col md:flex-row min-h-[800px]">
        
        {/* SIDEBAR */}
        <aside className="w-full md:w-72 bg-slate-50/50 p-8 border-r border-slate-100 flex flex-col">
          <div className="mb-10 pl-2">
            <h2 className="text-2xl font-black tracking-tight text-indigo-600">Account</h2>
            <p className="text-sm text-slate-500 font-medium">Manage your presence</p>
          </div>
          
          <nav className="space-y-2 flex-1">
            {tabs.map((tab) => (
              <button
                key={tab.name}
                onClick={() => setActiveTab(tab.name)}
                className={`w-full flex items-center gap-3 px-5 py-4 rounded-2xl font-bold transition-all duration-200 group ${
                  activeTab === tab.name
                    ? "bg-white text-indigo-600 shadow-sm ring-1 ring-slate-200"
                    : "text-slate-500 hover:bg-slate-200/50 hover:text-slate-700"
                }`}
              >
                <tab.icon className={`w-5 h-5 transition-transform group-hover:scale-110 ${activeTab === tab.name ? "text-indigo-600" : "text-slate-400"}`} />
                {tab.name}
              </button>
            ))}
            
            {isActuallyOrganizer && (
              <button 
                className="w-full flex items-center justify-between gap-3 px-5 py-4 rounded-2xl font-bold text-slate-500 hover:bg-slate-200/50 hover:text-slate-700 transition-all duration-200 group" 
                onClick={() => navigate('/my-events')}
              >
                <span className="flex items-center gap-3">
                    <BriefcaseIcon className="w-5 h-5 text-slate-400 group-hover:text-slate-700" />
                    My Events
                </span>
                <ArrowRightCircleIcon className="w-5 h-5 text-slate-300 group-hover:text-indigo-500 group-hover:translate-x-1 transition-all" />
              </button>
            )}
          </nav>

          {isActuallyOrganizer && (
            <div className="mt-auto p-4 bg-indigo-50 rounded-2xl border border-indigo-100">
              <div className="flex items-center gap-2 mb-1">
                <CheckBadgeIcon className="w-4 h-4 text-indigo-600" />
                <span className="text-xs font-bold text-indigo-700 uppercase tracking-wider">Verified Organizer</span>
              </div>
              <p className="text-[10px] text-indigo-500 leading-tight">You can now host and manage professional events.</p>
            </div>
          )}
        </aside>

        {/* MAIN CONTENT AREA */}
        <main className="flex-1 p-8 md:p-16 overflow-y-auto">
          <AnimatePresence mode="wait">
            
            {activeTab === "General" && (
              <motion.div key="general" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="max-w-2xl space-y-8">
                <div>
                  <h3 className="text-3xl font-black text-slate-900">Profile Settings</h3>
                  <p className="text-slate-500 mt-2">Update your personal information and contact details.</p>
                </div>

                <div className="space-y-6">
                  <FormField label="Full Name">
                    <input
                      value={profileData.name}
                      onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                      className={inputStyles}
                      placeholder="John Doe"
                    />
                  </FormField>
                  <FormField label="Email Address">
                    <input
                      value={profileData.email}
                      onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                      className={inputStyles}
                      placeholder="john@example.com"
                    />
                  </FormField>
                  <button
                    onClick={handleSaveProfile}
                    className="w-full md:w-auto px-10 py-4 bg-slate-900 hover:bg-black text-white rounded-2xl font-bold shadow-lg transition-all active:scale-95"
                  >
                    Update Profile
                  </button>
                </div>
              </motion.div>
            )}

            {activeTab === "Become an Organizer" && !isActuallyOrganizer && (
              <motion.div key="reg-org" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="max-w-2xl space-y-8">
                <div>
                  <h3 className="text-3xl font-black text-slate-900">Become an Organizer</h3>
                  <p className="text-slate-500 mt-2">Host events, manage ticketing, and build your community.</p>
                </div>

                <div className="space-y-6">
                  <FormField label="Phone Number" icon={PhoneIcon}>
                    <input
                      value={profileData.phone}
                      onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                      className={`${inputStyles} pl-12`}
                      placeholder="+1 (555) 000-0000"
                    />
                  </FormField>

                  <FormField label="Organization Description" icon={DocumentTextIcon}>
                    <textarea
                      rows={4}
                      value={profileData.description}
                      onChange={(e) => setProfileData({...profileData, description: e.target.value})}
                      className={`${inputStyles} pl-12 resize-none`}
                      placeholder="Tell us about your organization..."
                    />
                  </FormField>

                  <FormField label="Website (Optional)" icon={GlobeAltIcon}>
                    <input
                      value={profileData.website}
                      onChange={(e) => setProfileData({...profileData, website: e.target.value})}
                      className={`${inputStyles} pl-12`}
                      placeholder="https://yourwebsite.com"
                    />
                  </FormField>

                  <button
                    onClick={handleRegisterOrganizer}
                    className="w-full py-5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-[1.5rem] font-bold shadow-xl shadow-indigo-100 transition-all active:scale-[0.98]"
                  >
                    Submit Application
                  </button>
                </div>
              </motion.div>
            )}

            {activeTab === "Organize an Event" && isActuallyOrganizer && (
              <motion.div key="event" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="max-w-3xl space-y-8">
                <header className="border-b border-slate-100 pb-6">
                  <h3 className="text-4xl font-black text-slate-900 tracking-tight">Launch Event</h3>
                  <p className="text-slate-500 mt-2 text-lg">Broadcast your vision to the world.</p>
                </header>

                <div className="space-y-10">
                  <div className="space-y-4">
                    <FormField label="Event Title">
                      <input
                        value={eventData.title}
                        onChange={(e) => setEventData({ ...eventData, title: e.target.value })}
                        placeholder="e.g. Design Systems Workshop 2026"
                        className={`${inputStyles} text-lg font-medium border-2 border-slate-100 focus:border-indigo-500`}
                      />
                    </FormField>
                    <FormField label="Description">
                      <textarea
                        rows={5}
                        value={eventData.description}
                        onChange={(e) => setEventData({ ...eventData, description: e.target.value })}
                        className={`${inputStyles} border-2 border-slate-100 resize-none`}
                        placeholder="Share the agenda, speakers, and goals..."
                      />
                    </FormField>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2">
                      <FormField label="Location" icon={MapPinIcon}>
                        <input
                          value={eventData.location}
                          onChange={(e) => setEventData({ ...eventData, location: e.target.value })}
                          placeholder="Venue name or Video Link"
                          className={`${inputStyles} pl-12`}
                        />
                      </FormField>
                    </div>
                    <FormField label="Start Date & Time">
                      <input
                        type="datetime-local"
                        value={eventData.date}
                        onChange={(e) => setEventData({ ...eventData, date: e.target.value })}
                        className={inputStyles}
                      />
                    </FormField>
                    <FormField label="End Date & Time">
                      <input
                        type="datetime-local"
                        value={eventData.endDate}
                        onChange={(e) => setEventData({ ...eventData, endDate: e.target.value })}
                        className={inputStyles}
                      />
                    </FormField>
                  </div>

                  <div className="bg-indigo-600/5 p-8 rounded-[2.5rem] space-y-6 border border-indigo-100">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField label="Category">
                        <select
                          value={eventData.category}
                          onChange={(e) => setEventData({ ...eventData, category: e.target.value })}
                          className="w-full p-4 bg-white border border-indigo-100 rounded-2xl outline-none cursor-pointer font-bold text-indigo-600 shadow-sm focus:ring-4 focus:ring-indigo-100 transition-all"
                        >
                          {["Networking Meetup", "Technology", "Music", "Art", "Business", "Food & Drink", "Sports & Fitness", "Workshop", "Conference", "Webinar"].map(cat => (
                            <option key={cat} value={cat}>{cat}</option>
                          ))}
                        </select>
                      </FormField>
                      <FormField label="Event URL">
                        <input
                          value={eventData.websiteUrl}
                          onChange={(e) => setEventData({ ...eventData, websiteUrl: e.target.value })}
                          className="w-full p-4 bg-white border border-indigo-100 rounded-2xl outline-none shadow-sm focus:ring-4 focus:ring-indigo-100 transition-all"
                          placeholder="https://event.com"
                        />
                      </FormField>
                    </div>

                    <div className="flex items-center justify-between bg-white/60 p-4 rounded-2xl border border-white">
                      <label className="flex items-center gap-3 cursor-pointer group">
                        <input
                          type="checkbox"
                          checked={eventData.isFree}
                          onChange={(e) => setEventData({ ...eventData, isFree: e.target.checked })}
                          className="w-6 h-6 rounded-lg text-indigo-600 border-indigo-200 focus:ring-indigo-500 transition-all cursor-pointer"
                        />
                        <span className="font-bold text-indigo-900 group-hover:text-indigo-700 transition-colors">This event is free to attend</span>
                      </label>
                      {!eventData.isFree && (
                        <div className="relative w-32 animate-in fade-in zoom-in duration-200">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 font-bold text-indigo-400">$</span>
                          <input
                            type="number"
                            value={eventData.ticketPrice}
                            onChange={(e) => setEventData({ ...eventData, ticketPrice: e.target.value })}
                            className="w-full pl-7 p-3 bg-white border border-indigo-200 rounded-xl outline-none font-bold text-indigo-600 shadow-inner"
                            placeholder="0.00"
                          />
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-3 ml-1">Cover Artwork</label>
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      className="group relative h-64 w-full border-2 border-dashed border-slate-200 rounded-[2.5rem] flex flex-col items-center justify-center cursor-pointer hover:border-indigo-400 hover:bg-indigo-50/20 transition-all overflow-hidden"
                    >
                      {imagePreview ? (
                        <>
                          <img src={imagePreview} className="absolute inset-0 w-full h-full object-cover" alt="Preview" />
                          <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                            <span className="bg-white px-6 py-2 rounded-full font-bold text-sm shadow-xl">Change Image</span>
                          </div>
                        </>
                      ) : (
                        <div className="text-center group-hover:scale-105 transition-transform">
                          <div className="bg-slate-100 p-4 rounded-2xl inline-block mb-3 group-hover:bg-indigo-100 transition-colors">
                            <PhotoIcon className="w-8 h-8 text-slate-400 group-hover:text-indigo-600" />
                          </div>
                          <p className="font-bold text-slate-600">Upload Banner</p>
                          <p className="text-xs text-slate-400 mt-1">16:9 ratio recommended (Max 5MB)</p>
                        </div>
                      )}
                    </div>
                    <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageChange} />
                  </div>

                  <button
                    onClick={handlePublishEvent}
                    disabled={loading}
                    className="w-full py-6 bg-indigo-600 hover:bg-indigo-700 text-white rounded-[2rem] font-black text-xl shadow-2xl shadow-indigo-200 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <span className="flex items-center justify-center gap-3">
                        <div className="w-6 h-6 border-3 border-white/20 border-t-white rounded-full animate-spin" />
                        Finalizing...
                      </span>
                    ) : (
                      "Launch Event"
                    )}
                  </button>
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </main>
      </div>
    </div>
  );
};

export default Profile;