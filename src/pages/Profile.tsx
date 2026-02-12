import React, { useEffect, useState, useMemo, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  UserCircleIcon,
  BriefcaseIcon,
  PlusCircleIcon,
  PhotoIcon,
} from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";
import { useProfileStore } from "../stores/store";
import { useFollowerStore } from "../modules/follwers";
import { useOrganizerStore } from "../modules/organizers";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Profile: React.FC = () => {
  const navigate = useNavigate();

  const authStore = useProfileStore();
  const followerStore = useFollowerStore();
  const organizerStore = useOrganizerStore();

  const authUser = useProfileStore((state) => state.user);
  const meAsAnOrg = useOrganizerStore((state) => state.meAsAnOrg);
  const loading = useOrganizerStore((state) => state.loading);



const isActuallyOrganizer = ()=>{
  if(meAsAnOrg.length){
    return true
  }else{
    return false
  }
}

  const fileInputRef = useRef<HTMLInputElement>(null);

  const [activeTab, setActiveTab] = useState("General");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const [phone, setPhone] = useState("");
  const [description, setDescription] = useState("");
  const [website, setWebsite] = useState("");

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

  // Clean up object URLs to avoid memory leaks
  useEffect(() => {
    return () => {
      if (imagePreview) URL.revokeObjectURL(imagePreview);
    };
  }, [imagePreview]);
  const user = localStorage.getItem('user');
  useEffect(() => {
    if (!authUser && !user) {
      navigate("/");
      return;
    }
    followerStore.fetchFollowers();
    followerStore.fetchFollowing();
    organizerStore.fetchOrganizers();
  }, [authUser]);

  useEffect(() => {
    if (authStore.user) {
      setName(authStore.user.name);
      setEmail(authStore.user.email);
    }
  }, [authStore.user]);

  const tabs = useMemo(() => {
    return [
      { name: "General", icon: UserCircleIcon },
      isActuallyOrganizer()
        ? { name: "Organize an Event", icon: PlusCircleIcon }
        : { name: "Organizer", icon: BriefcaseIcon },
    ];
  }, [isActuallyOrganizer]);

  const handleSaveProfile = async () => {
    try {
      await authStore.updateAccount({ name, email });
      toast.success("Profile updated successfully");
    } catch (err: any) {
      toast.error(err?.message || "Failed to update profile");
    }
  };

  const handleRegisterOrganizer = async () => {
    if (!phone || !description) {
      toast.error("Phone and description are required");
      return;
    }
    try {
      await organizerStore.register({ phone, description, website });
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
    if (!eventData.title || !eventData.location || !eventData.date || !eventData.endDate) {
      toast.error("Title, location, and dates are required");
      return;
    }

    if (new Date(eventData.endDate) <= new Date(eventData.date)) {
      toast.error("End date must be after start date");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("title", eventData.title);
      formData.append("location", eventData.location);
      formData.append("start_date", eventData.date);
      formData.append("end_date", eventData.endDate);
      formData.append("description", eventData.description);
      formData.append("website_url", eventData.websiteUrl);
      formData.append("category", eventData.category);
      formData.append("is_free", eventData.isFree ? "1" : "0");
      formData.append("ticket_price", eventData.isFree ? "0" : eventData.ticketPrice);
      formData.append("chief_guests", JSON.stringify(eventData.chiefGuests));

      if (eventData.eventImage) {
        formData.append("event_image", eventData.eventImage);
      }

      await organizerStore.createEvent(formData);
      toast.success("Event created successfully");

      // Reset Form
      setEventData({
        title: "", location: "", date: "", endDate: "", description: "",
        websiteUrl: "", chiefGuests: [], isFree: true, ticketPrice: "",
        category: "Networking Meetup", eventImage: null,
      });
      setImagePreview(null);
    } catch (err: any) {
      toast.error(err?.message || "Event creation failed");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8 flex justify-center">
      <ToastContainer position="top-right" autoClose={3000} />
      
      <div className="w-full max-w-4xl bg-white shadow-2xl rounded-[2.5rem] overflow-hidden border border-slate-100">
        <div className="flex flex-col md:flex-row h-full">
          {/* Sidebar */}
          <div className="w-full md:w-64 bg-slate-50 p-6 border-r border-slate-100">
            <h2 className="text-xl font-black mb-6 text-slate-800">Settings</h2>
            <div className="space-y-2">
              {tabs.map((tab) => (
                <button
                  key={tab.name}
                  onClick={() => setActiveTab(tab.name)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition ${
                    activeTab === tab.name
                      ? "bg-indigo-600 text-white shadow-lg shadow-indigo-200"
                      : "text-slate-500 hover:bg-slate-200"
                  }`}
                >
                  <tab.icon className="w-5 h-5" />
                  {tab.name}
                </button>
              ))}
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 p-8 md:p-12">
            <AnimatePresence mode="wait">
              {activeTab === "General" && (
                <motion.div key="general" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
                  <h3 className="text-2xl font-black mb-6">Profile Information</h3>
                  <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Full Name" className="w-full p-4 bg-slate-100 rounded-2xl outline-none focus:ring-2 ring-indigo-500 transition" />
                  <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" className="w-full p-4 bg-slate-100 rounded-2xl outline-none focus:ring-2 ring-indigo-500 transition" />
                  <button onClick={handleSaveProfile} className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-black shadow-lg hover:bg-indigo-700 transition">Save Changes</button>
                </motion.div>
              )}

              {activeTab === "Organizer" && !isActuallyOrganizer && (
                <motion.div key="organizer" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
                  <h3 className="text-2xl font-black mb-2">Become an Organizer</h3>
                  <p className="text-slate-500 mb-6 font-medium">Start hosting your own events and reach thousands.</p>
                  <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Phone Number" className="w-full p-4 bg-slate-100 rounded-2xl outline-none" />
                  <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Tell us about your organization..." className="w-full p-4 bg-slate-100 rounded-2xl outline-none min-h-[120px]" />
                  <input value={website} onChange={(e) => setWebsite(e.target.value)} placeholder="Website URL (Optional)" className="w-full p-4 bg-slate-100 rounded-2xl outline-none" />
                  <button onClick={handleRegisterOrganizer} disabled={loading} className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-black shadow-lg hover:bg-indigo-700 transition disabled:opacity-50">
                    {loading ? "Submitting..." : "Apply Now"}
                  </button>
                </motion.div>
              )}

              {activeTab === "Organize an Event" && isActuallyOrganizer() && (
                <motion.div key="event" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-4">
                  <h3 className="text-2xl font-black mb-4">Create New Event</h3>
                  
                  {/* Image Upload Area */}
                  <div 
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full h-40 bg-slate-100 rounded-3xl border-2 border-dashed border-slate-300 flex flex-col items-center justify-center cursor-pointer hover:border-indigo-500 transition overflow-hidden"
                  >
                    {imagePreview ? (
                      <img src={imagePreview} className="w-full h-full object-cover" alt="Preview" />
                    ) : (
                      <>
                        <PhotoIcon className="w-10 h-10 text-slate-400" />
                        <span className="text-sm font-bold text-slate-400 mt-2 uppercase tracking-widest">Upload Cover</span>
                      </>
                    )}
                  </div>
                  <input type="file" ref={fileInputRef} onChange={handleImageChange} className="hidden" accept="image/*" />

                  <input value={eventData.title} onChange={(e) => setEventData({ ...eventData, title: e.target.value })} placeholder="Event Title" className="w-full p-4 bg-slate-100 rounded-2xl outline-none" />
                  
                  <div className="grid grid-cols-2 gap-4">
                    <input type="datetime-local" value={eventData.date} onChange={(e) => setEventData({ ...eventData, date: e.target.value })} className="p-4 bg-slate-100 rounded-2xl outline-none" />
                    <input type="datetime-local" value={eventData.endDate} onChange={(e) => setEventData({ ...eventData, endDate: e.target.value })} className="p-4 bg-slate-100 rounded-2xl outline-none" />
                  </div>

                  <input value={eventData.location} onChange={(e) => setEventData({ ...eventData, location: e.target.value })} placeholder="Venue Location or Meeting Link" className="w-full p-4 bg-slate-100 rounded-2xl outline-none" />

                  <div className="flex gap-2 p-1 bg-slate-100 rounded-2xl">
                    <button onClick={() => setEventData({...eventData, isFree: true})} className={`flex-1 py-2 rounded-xl font-bold transition ${eventData.isFree ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500'}`}>Free</button>
                    <button onClick={() => setEventData({...eventData, isFree: false})} className={`flex-1 py-2 rounded-xl font-bold transition ${!eventData.isFree ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500'}`}>Paid</button>
                  </div>

                  {!eventData.isFree && (
                     <input type="number" value={eventData.ticketPrice} onChange={(e) => setEventData({ ...eventData, ticketPrice: e.target.value })} placeholder="Price in USD" className="w-full p-4 bg-indigo-50 rounded-2xl border border-indigo-100 outline-none" />
                  )}

                  <button onClick={handlePublishEvent} disabled={loading} className="w-full py-5 bg-indigo-600 text-white rounded-[2rem] font-black text-xl shadow-xl hover:bg-indigo-700 transition-all disabled:opacity-50">
                    {loading ? "Publishing..." : "Launch Event"}
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