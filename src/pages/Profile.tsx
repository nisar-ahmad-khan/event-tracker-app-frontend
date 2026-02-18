import React, { useEffect, useState, useMemo, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Cropper from "react-easy-crop";
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
  CameraIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";
import { useProfileStore } from "../stores/store";
import { useFollowerStore } from "../modules/follwers";
import { useOrganizerStore } from "../modules/organizers";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { API_BASE_URL } from "../modules/api";

/**
 * UTILS & HELPERS
 */
const createImage = (url: string): Promise<HTMLImageElement> =>
  new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener("load", () => resolve(image));
    image.addEventListener("error", (error) => reject(error));
    image.setAttribute("crossOrigin", "anonymous");
    image.src = url;
  });

const FormField = ({ label, icon: Icon, children }: any) => (
  <div className="group w-full">
    <label className="block text-sm font-bold text-slate-700 mb-2 ml-1">{label}</label>
    <div className="relative">
      {Icon && (
        <Icon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
      )}
      {children}
    </div>
  </div>
);

const inputStyles =
  "w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-50 focus:border-indigo-500 focus:bg-white transition-all shadow-sm";

/**
 * MAIN COMPONENT
 */
const Profile: React.FC = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const profileInputRef = useRef<HTMLInputElement>(null);

  // Stores
  const authUser = useProfileStore((state) => state.user);
  const updateAccount = useProfileStore((state) => state.updateAccount);
  const fetchFollowers = useFollowerStore((state) => state.fetchFollowers);
  const fetchFollowing = useFollowerStore((state) => state.fetchFollowing);

  const {
    meAsAnOrg,
    loading: orgLoading,
    register,
    fetchOrganizers,
    fetchMyOrgAcc,
    createEvent,
  } = useOrganizerStore();

  const isActuallyOrganizer = !!meAsAnOrg;

  // UI State
  const [activeTab, setActiveTab] = useState("General");
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);

  // Profile Form State
  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
    phone: "",
    description: "",
    website: "",
    profileImage: null as File | null,
  });

  // Event Form State
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

  // Cropping & Preview States
  const [imageToCrop, setImageToCrop] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [profilePreview, setProfilePreview] = useState<string | null>(null);
  const [eventImagePreview, setEventImagePreview] = useState<string | null>(null);

  /**
   * EFFECTS
   */
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
      setProfileData((prev) => ({ ...prev, name: authUser.name, email: authUser.email }));
      if (authUser.profile_img) {
        // Handle both full URLs and relative paths
        const imgUrl = authUser.profile_img.startsWith("http") 
          ? authUser.profile_img 
          : `${API_BASE_URL}/storage/${authUser.profile_img}`;
        setProfilePreview(imgUrl);
      }
    }
  }, [authUser]);

  // Clean up Object URLs to prevent memory leaks
  useEffect(() => {
    return () => {
      if (profilePreview?.startsWith("blob:")) URL.revokeObjectURL(profilePreview);
      if (eventImagePreview?.startsWith("blob:")) URL.revokeObjectURL(eventImagePreview);
    };
  }, [profilePreview, eventImagePreview]);

  const tabs = useMemo(
    () => [
      { name: "General", icon: UserCircleIcon },
      isActuallyOrganizer
        ? { name: "Organize an Event", icon: PlusCircleIcon }
        : { name: "Become an Organizer", icon: BriefcaseIcon },
    ],
    [isActuallyOrganizer]
  );

  /**
   * HANDLERS: PROFILE
   */
  const handleProfileFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const reader = new FileReader();
      reader.onload = () => setImageToCrop(reader.result as string);
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const onCropComplete = useCallback((_: any, croppedAreaPixels: any) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const getCroppedImg = async () => {
    try {
      const image = await createImage(imageToCrop!);
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      if (!ctx || !croppedAreaPixels) return;

      const { width, height, x, y } = croppedAreaPixels as any;
      canvas.width = width;
      canvas.height = height;
      ctx.drawImage(image, x, y, width, height, 0, 0, width, height);

      canvas.toBlob((blob) => {
        if (!blob) return;
        const file = new File([blob], `profile_${Date.now()}.jpg`, { type: "image/jpeg" });
        setProfileData((prev) => ({ ...prev, profileImage: file }));
        
        if (profilePreview?.startsWith("blob:")) URL.revokeObjectURL(profilePreview);
        setProfilePreview(URL.createObjectURL(blob));
        setImageToCrop(null);
      }, "image/jpeg");
    } catch (e) {
      toast.error("Error processing image");
    }
  };

  const handleSaveProfile = async () => {
    setIsUpdatingProfile(true);
    try {
      const payload = new FormData();
      payload.append("name", profileData.name);
      payload.append("email", profileData.email);

      if (profileData.profileImage instanceof File) {
        // Ensure field name matches backend: 'profile_img'
        payload.append("profile_img", profileData.profileImage);
      }

      await updateAccount(payload);
      toast.success("Profile updated successfully");
      setProfileData(prev => ({ ...prev, profileImage: null })); // Reset file state
    } catch (err: any) {
      const msg = err.response?.data?.message || err.message || "Failed to update profile";
      toast.error(msg);
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  /**
   * HANDLERS: ORGANIZER & EVENTS
   */
  const handleRegisterOrganizer = async () => {
    if (!profileData.phone || !profileData.description) {
      return toast.error("Phone and description are required");
    }
    try {
      await register({
        phone: profileData.phone,
        description: profileData.description,
        website: profileData.website,
      });
      await fetchMyOrgAcc();
      toast.success("Registration submitted!");
      setActiveTab("Organize an Event");
    } catch (err: any) {
      toast.error(err?.message || "Registration failed");
    }
  };

  const handleEventImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) return toast.error("Image too large (Max 5MB)");

    setEventData((prev) => ({ ...prev, eventImage: file }));
    if (eventImagePreview) URL.revokeObjectURL(eventImagePreview);
    setEventImagePreview(URL.createObjectURL(file));
  };

  const handlePublishEvent = async () => {
    if (!eventData.title || !eventData.location || !eventData.date) {
      return toast.error("Please fill in required fields");
    }
    try {
      const formData = new FormData();
      formData.append("title", eventData.title);
      formData.append("location", eventData.location);
      formData.append("starting_date_and_time", eventData.date);
      formData.append("ending_date_and_time", eventData.endDate);
      formData.append("description", eventData.description);
      formData.append("url", eventData.websiteUrl);
      formData.append("category", eventData.category);
      formData.append("is_free", eventData.isFree ? "1" : "0");
      formData.append("ticket_price", eventData.isFree ? "0" : eventData.ticketPrice);

      if (eventData.eventImage) formData.append("image", eventData.eventImage);

      await createEvent(formData);
      toast.success("Event is live!");
      
      // Reset Form
      setEventData({ title: "", location: "", date: "", endDate: "", description: "", websiteUrl: "", chiefGuests: [], isFree: true, ticketPrice: "", category: "Networking Meetup", eventImage: null });
      setEventImagePreview(null);
    } catch (err: any) {
      toast.error(err?.message || "Event creation failed");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-12 flex justify-center font-sans antialiased text-slate-900">
      <ToastContainer position="bottom-right" theme="colored" />

      {/* CROP MODAL */}
      <AnimatePresence>
        {imageToCrop && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <div className="bg-white w-full max-w-xl rounded-[2.5rem] overflow-hidden shadow-2xl">
              <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                <h3 className="text-xl font-black">Adjust Photo</h3>
                <button onClick={() => setImageToCrop(null)} className="p-2 hover:bg-slate-100 rounded-full">
                  <XMarkIcon className="w-6 h-6" />
                </button>
              </div>
              <div className="relative h-80 w-full bg-slate-200">
                <Cropper
                  image={imageToCrop}
                  crop={crop}
                  zoom={zoom}
                  aspect={1}
                  onCropChange={setCrop}
                  onCropComplete={onCropComplete}
                  onZoomChange={setZoom}
                  cropShape="round"
                  showGrid={false}
                />
              </div>
              <div className="p-8 space-y-6">
                <div className="flex items-center gap-4">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Zoom</span>
                  <input
                    type="range"
                    value={zoom}
                    min={1}
                    max={3}
                    step={0.1}
                    onChange={(e) => setZoom(Number(e.target.value))}
                    className="flex-1 h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                  />
                </div>
                <div className="flex gap-4">
                  <button onClick={() => setImageToCrop(null)} className="flex-1 py-4 font-bold text-slate-500 hover:bg-slate-50 rounded-2xl">
                    Cancel
                  </button>
                  <button onClick={getCroppedImg} className="flex-1 py-4 bg-indigo-600 text-white font-bold rounded-2xl shadow-lg hover:bg-indigo-700">
                    Save Photo
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

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
                <tab.icon className={`w-5 h-5 ${activeTab === tab.name ? "text-indigo-600" : "text-slate-400 group-hover:scale-110"}`} />
                {tab.name}
              </button>
            ))}

            {isActuallyOrganizer && (
              <button
                className="w-full flex items-center justify-between gap-3 px-5 py-4 rounded-2xl font-bold text-slate-500 hover:bg-slate-200/50 hover:text-slate-700 transition-all group"
                onClick={() => navigate("/my-events")}
              >
                <span className="flex items-center gap-3">
                  <BriefcaseIcon className="w-5 h-5 text-slate-400 group-hover:text-slate-700" />
                  My Events
                </span>
                <ArrowRightCircleIcon className="w-5 h-5 text-slate-300 group-hover:text-indigo-500 group-hover:translate-x-1" />
              </button>
            )}
          </nav>

          {isActuallyOrganizer && (
            <div className="mt-auto p-4 bg-indigo-50 rounded-2xl border border-indigo-100">
              <div className="flex items-center gap-2 mb-1">
                <CheckBadgeIcon className="w-4 h-4 text-indigo-600" />
                <span className="text-xs font-bold text-indigo-700 uppercase tracking-wider">Verified Organizer</span>
              </div>
              <p className="text-[10px] text-indigo-500 leading-tight">You can now host professional events.</p>
            </div>
          )}
        </aside>

        {/* MAIN CONTENT AREA */}
        <main className="flex-1 p-8 md:p-16 overflow-y-auto">
          <AnimatePresence mode="wait">
            {activeTab === "General" && (
              <motion.div key="general" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="max-w-2xl space-y-8">
                <header>
                  <h3 className="text-3xl font-black text-slate-900">Profile Settings</h3>
                  <p className="text-slate-500 mt-2">Update your personal information and contact details.</p>
                </header>

                <div className="flex flex-col sm:flex-row items-center gap-6 p-6 bg-slate-50 rounded-[2.5rem] border border-slate-100">
                  <div className="relative group">
                    <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-xl bg-slate-200">
                      {profilePreview ? (
                        <img src={profilePreview} className="w-full h-full object-cover" alt="Profile" />
                      ) : (
                        <UserCircleIcon className="w-full h-full text-slate-400 p-2" />
                      )}
                    </div>
                    <button
                      onClick={() => profileInputRef.current?.click()}
                      className="absolute bottom-1 right-1 bg-indigo-600 text-white p-2 rounded-full shadow-lg hover:bg-indigo-700 transition-colors"
                    >
                      <CameraIcon className="w-5 h-5" />
                    </button>
                    <input type="file" ref={profileInputRef} className="hidden" accept="image/*" onChange={handleProfileFileChange} />
                  </div>
                  <div className="text-center sm:text-left">
                    <h4 className="font-bold text-slate-800">Profile Picture</h4>
                    <p className="text-sm text-slate-500 mb-3">Upload a professional photo for your profile.</p>
                    <button onClick={() => profileInputRef.current?.click()} className="text-sm font-bold text-indigo-600 hover:text-indigo-700 underline underline-offset-4">
                      Update Avatar
                    </button>
                  </div>
                </div>

                <div className="space-y-6">
                  <FormField label="Full Name">
                    <input value={profileData.name} onChange={(e) => setProfileData({ ...profileData, name: e.target.value })} className={inputStyles} placeholder="John Doe" />
                  </FormField>
                  <FormField label="Email Address">
                    <input value={profileData.email} onChange={(e) => setProfileData({ ...profileData, email: e.target.value })} className={inputStyles} placeholder="john@example.com" />
                  </FormField>
                  <button
                    onClick={handleSaveProfile}
                    disabled={isUpdatingProfile}
                    className="w-full md:w-auto px-10 py-4 bg-slate-900 hover:bg-black text-white rounded-2xl font-bold shadow-lg transition-all active:scale-95 disabled:opacity-50"
                  >
                    {isUpdatingProfile ? "Updating..." : "Update Profile"}
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
                    <input value={profileData.phone} onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })} className={`${inputStyles} pl-12`} placeholder="+1 (555) 000-0000" />
                  </FormField>
                  <FormField label="Organization Description" icon={DocumentTextIcon}>
                    <textarea rows={4} value={profileData.description} onChange={(e) => setProfileData({ ...profileData, description: e.target.value })} className={`${inputStyles} pl-12 resize-none`} placeholder="Tell us about your organization..." />
                  </FormField>
                  <FormField label="Website (Optional)" icon={GlobeAltIcon}>
                    <input value={profileData.website} onChange={(e) => setProfileData({ ...profileData, website: e.target.value })} className={`${inputStyles} pl-12`} placeholder="https://yourwebsite.com" />
                  </FormField>
                  <button onClick={handleRegisterOrganizer} className="w-full py-5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-[1.5rem] font-bold shadow-xl transition-all">
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
                      <input value={eventData.title} onChange={(e) => setEventData({ ...eventData, title: e.target.value })} placeholder="e.g. Workshop 2026" className={`${inputStyles} text-lg font-medium`} />
                    </FormField>
                    <FormField label="Description">
                      <textarea rows={5} value={eventData.description} onChange={(e) => setEventData({ ...eventData, description: e.target.value })} className={`${inputStyles} resize-none`} placeholder="Share the agenda..." />
                    </FormField>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2">
                      <FormField label="Location" icon={MapPinIcon}>
                        <input value={eventData.location} onChange={(e) => setEventData({ ...eventData, location: e.target.value })} placeholder="Venue name" className={`${inputStyles} pl-12`} />
                      </FormField>
                    </div>
                    <FormField label="Start Date & Time">
                      <input type="datetime-local" value={eventData.date} onChange={(e) => setEventData({ ...eventData, date: e.target.value })} className={inputStyles} />
                    </FormField>
                    <FormField label="End Date & Time">
                      <input type="datetime-local" value={eventData.endDate} onChange={(e) => setEventData({ ...eventData, endDate: e.target.value })} className={inputStyles} />
                    </FormField>
                  </div>

                  <div className="bg-indigo-600/5 p-8 rounded-[2.5rem] space-y-6 border border-indigo-100">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField label="Category">
                        <select value={eventData.category} onChange={(e) => setEventData({ ...eventData, category: e.target.value })} className="w-full p-4 bg-white border border-indigo-100 rounded-2xl font-bold text-indigo-600 outline-none">
                          {["Networking Meetup", "Technology", "Music", "Art", "Workshop", "Webinar"].map((cat) => (
                            <option key={cat} value={cat}>{cat}</option>
                          ))}
                        </select>
                      </FormField>
                      <FormField label="Event URL">
                        <input value={eventData.websiteUrl} onChange={(e) => setEventData({ ...eventData, websiteUrl: e.target.value })} className="w-full p-4 bg-white border border-indigo-100 rounded-2xl outline-none" placeholder="https://event.com" />
                      </FormField>
                    </div>

                    <div className="flex items-center justify-between bg-white/60 p-4 rounded-2xl border border-white">
                      <label className="flex items-center gap-3 cursor-pointer group">
                        <input type="checkbox" checked={eventData.isFree} onChange={(e) => setEventData({ ...eventData, isFree: e.target.checked })} className="w-6 h-6 rounded-lg text-indigo-600" />
                        <span className="font-bold text-indigo-900">This event is free</span>
                      </label>
                      {!eventData.isFree && (
                        <div className="relative w-32">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 font-bold text-indigo-400">$</span>
                          <input type="number" value={eventData.ticketPrice} onChange={(e) => setEventData({ ...eventData, ticketPrice: e.target.value })} className="w-full pl-7 p-3 bg-white border border-indigo-200 rounded-xl font-bold text-indigo-600" placeholder="0.00" />
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-3 ml-1">Cover Artwork</label>
                    <div onClick={() => fileInputRef.current?.click()} className="group relative h-64 w-full border-2 border-dashed border-slate-200 rounded-[2.5rem] flex flex-col items-center justify-center cursor-pointer hover:border-indigo-400 hover:bg-indigo-50/20 transition-all overflow-hidden">
                      {eventImagePreview ? (
                        <img src={eventImagePreview} className="absolute inset-0 w-full h-full object-cover" alt="Preview" />
                      ) : (
                        <div className="text-center">
                          <PhotoIcon className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                          <p className="font-bold text-slate-600">Upload Banner</p>
                        </div>
                      )}
                    </div>
                    <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleEventImageChange} />
                  </div>

                  <button onClick={handlePublishEvent} disabled={orgLoading} className="w-full py-6 bg-indigo-600 hover:bg-indigo-700 text-white rounded-[2rem] font-black text-xl shadow-2xl transition-all disabled:opacity-50">
                    {orgLoading ? "Launching..." : "Launch Event"}
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