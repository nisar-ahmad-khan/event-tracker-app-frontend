import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CalendarDaysIcon,
  MapPinIcon,
  PencilSquareIcon,
  TrashIcon,
  UsersIcon,
  EllipsisHorizontalIcon,
  ChartBarIcon,
} from "@heroicons/react/24/outline";
import { useOrganizerStore } from "../../modules/organizers";
import { API_BASE_URL } from "../../modules/api";
import { toast } from "react-toastify";

interface OrganizerEvent {
  id: number;
  organizer_id: number;
  title: string;
  location: string;
  image: string;
  url?: string | null;
  description: string;
  category: string;
  starting_date_and_time: string;
  ending_date_and_time: string;
  is_free?: string | number;
  ticket_price: number;
  tickets_sold: number;
  created_at: string;
  updated_at: string;
}

const OrganizerEvents: React.FC = () => {

  const deleteEvent = useOrganizerStore((state) => state.deleteEvent);
  const myEvents = useOrganizerStore((state) => state.myEvents);
  const fetchMyEvents = useOrganizerStore((state) => state.fetchMyEvents);
  
  const [loading, setLoading] = useState(true);

  // 2. Corrected Scope for del function
  const del = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this event?")) return;
    try {
      await deleteEvent(id);
      toast.success("Event has been removed"); // Fixed: toast.success instead of toast.done
    } catch (err: any) {
      toast.error(err.message || "Failed to delete event");
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        await fetchMyEvents();
      } catch (error) {
        console.error("Failed to fetch events:", error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [fetchMyEvents]);

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans selection:bg-indigo-100">
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -right-[10%] w-[50%] h-[50%] bg-gradient-to-br from-indigo-100/40 to-transparent rounded-full blur-[120px]" />
        <div className="absolute top-[20%] -left-[5%] w-[30%] h-[30%] bg-blue-50/50 rounded-full blur-[100px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-12">
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div className="max-w-2xl">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-2 mb-4 text-indigo-600 font-bold text-xs uppercase tracking-[0.2em]"
            >
              <div className="w-8 h-[2px] bg-indigo-600" />
              Organizer Console
            </motion.div>
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-5xl md:text-6xl font-[1000] tracking-tighter text-slate-900 leading-none"
            >
              Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-500">Events.</span>
            </motion.h1>
          </div>
        </header>

        <div className="grid grid-cols-1 gap-6">
          <AnimatePresence mode="wait">
            {loading ? (
              <motion.div key="loader" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-48 w-full bg-white/50 rounded-[2.5rem] animate-pulse border border-slate-100" />
                ))}
              </motion.div>
            ) : myEvents.length > 0 ? (
              myEvents.map((event, idx) => (
                // 3. Pass the delete handler to the card
                <EventManagementCard key={event.id} event={event} index={idx} onDelete={del} />
              ))
            ) : (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20 bg-white rounded-[2.5rem] border border-dashed border-slate-200">
                <p className="text-slate-400 font-medium">No events found. Time to create one!</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
};

// 4. Added onDelete to props interface
const EventManagementCard = ({ event, index, onDelete }: { event: OrganizerEvent; index: number, onDelete: (id: number) => void }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: index * 0.05 }}
    className="group relative bg-white border border-slate-100 p-2 rounded-[2.5rem] flex flex-col md:flex-row items-center gap-6 hover:shadow-[0_32px_64px_-16px_rgba(0,0,0,0.08)] hover:border-indigo-100 transition-all duration-500"
  >
    <div className="w-full md:w-72 h-48 rounded-[2rem] overflow-hidden bg-slate-100 relative shrink-0">
      <img 
        src={event.image ? `${API_BASE_URL}/${event.image}` : `https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=500&q=80`} 
        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
        alt={event.title} 
      />
    </div>

    <div className="flex-1 py-4 pr-6 pl-4 md:pl-0 w-full min-w-0">
      <div className="flex justify-between items-start mb-3">
        <span className="text-indigo-600 font-bold text-xs uppercase tracking-wider">{event.category}</span>
        <div className="flex gap-1">
            <button className="p-2 hover:bg-slate-50 rounded-xl transition-colors" title="Analytics"><ChartBarIcon className="w-5 h-5 text-slate-400" /></button>
            <button className="p-2 hover:bg-slate-50 rounded-xl transition-colors"><EllipsisHorizontalIcon className="w-5 h-5 text-slate-400" /></button>
        </div>
      </div>
      
      <h3 className="text-2xl font-black text-slate-900 mb-4 group-hover:text-indigo-600 transition-colors leading-tight truncate">
        {event.title}
      </h3>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="flex items-center gap-2 text-slate-500">
          <CalendarDaysIcon className="w-5 h-5 text-indigo-400 shrink-0" />
          <span className="text-sm font-medium whitespace-nowrap">{formatDate(event.starting_date_and_time)}</span>
        </div>
        <div className="flex items-center gap-2 text-slate-500">
          <MapPinIcon className="w-5 h-5 text-indigo-400 shrink-0" />
          <span className="text-sm font-medium truncate">{event.location}</span>
        </div>
        <div className="flex items-center gap-2 text-slate-500">
          <UsersIcon className="w-5 h-5 text-indigo-400 shrink-0" />
          <span className="text-sm font-medium">{event.tickets_sold} Joined</span>
        </div>
        <div className="flex items-center">
          <span className="text-sm font-black text-slate-900 bg-slate-100 px-3 py-1 rounded-lg">
            {Number(event.is_free) === 1 ? "FREE" : `$${event.ticket_price}`}
          </span>
        </div>
      </div>
    </div>

    <div className="flex md:flex-col gap-2 p-4 md:p-6 w-full md:w-auto border-t md:border-t-0 md:border-l border-slate-50">
      <button className="flex-1 md:w-32 py-3 bg-indigo-50 text-indigo-600 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-indigo-600 hover:text-white transition-all">
        <PencilSquareIcon className="w-4 h-4" />
        Edit
      </button>
      <button 
        onClick={() => onDelete(event.id)} 
        className="flex-1 md:w-32 py-3 bg-red-50 text-red-500 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-red-500 hover:text-white transition-all"
      >
        <TrashIcon className="w-4 h-4" />
        Delete
      </button>
    </div>
  </motion.div>
);

export default OrganizerEvents;