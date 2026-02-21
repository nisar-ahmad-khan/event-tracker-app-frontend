import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Trash2, 
  Calendar, 
  MapPin, 
  ExternalLink, 
  BookmarkX 
} from 'lucide-react';

// ----------------------
// TYPES
// ----------------------
interface Organizer {
  name: string;
  avatar: string;
  followers: string;
}

interface WishlistItem {
  id: number;
  title: string;
  date: string;
  time: string;
  location: string;
  image: string;
  organizer: Organizer;
}

// ----------------------
// MOCK DATA
// ----------------------
const INITIAL_WISHLIST: WishlistItem[] = [
  {
    id: 1,
    title: "Global Tech Summit 2026",
    date: "Oct 24, 2026",
    time: "10:00 AM",
    location: "San Francisco, CA",
    image: "https://images.unsplash.com/photo-1540575861501-7cf05a4b125a?auto=format&fit=crop&q=80",
    organizer: {
      name: "TechNexus Events",
      avatar: "https://i.pravatar.cc/150?u=tech",
      followers: "12.4k"
    }
  },
  {
    id: 2,
    title: "Art & Soul Festival",
    date: "Nov 12, 2026",
    time: "02:00 PM",
    location: "Austin, TX",
    image: "https://images.unsplash.com/photo-1459749411177-042180ce673c?auto=format&fit=crop&q=80",
    organizer: {
      name: "Creative Collective",
      avatar: "https://i.pravatar.cc/150?u=art",
      followers: "8.1k"
    }
  }
];

// ----------------------
// MAIN COMPONENT
// ----------------------
const WishlistPage: React.FC = () => {
  const [items, setItems] = useState<WishlistItem[]>(INITIAL_WISHLIST);

  // ----------------------
  // REMOVE ITEM
  // ----------------------
  const removeItem = (id: number) => {
    setItems(items.filter(item => item.id !== id));
  };

  // ----------------------
  // RENDER
  // ----------------------
  return (
    <div className="min-h-screen bg-slate-50 pt-28 pb-20 px-6 md:px-12">
      {/* Header Section */}
      <div className="max-w-7xl mx-auto mb-12">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-2">
            My <span className="text-indigo-600">Wishlist</span>
          </h1>
          <p className="text-slate-500 font-medium">
            You have {items.length} {items.length === 1 ? 'event' : 'events'} saved for later.
          </p>
        </motion.div>
      </div>

      <div className="max-w-7xl mx-auto">
        <AnimatePresence mode="popLayout">
          {items.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {items.map((event) => (
                <motion.div
                  key={event.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                  className="group bg-white rounded-3xl overflow-hidden shadow-sm border border-slate-100 hover:shadow-xl hover:shadow-indigo-100/50 transition-all duration-300 flex flex-col md:flex-row"
                >
                  {/* Event Image */}
                  <div className="relative w-full md:w-48 h-48 md:h-auto overflow-hidden">
                    <img 
                      src={event.image} 
                      alt={event.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                  </div>

                  {/* Content Section */}
                  <div className="flex-1 p-6 flex flex-col justify-between">
                    <div>
                      {/* Organizer Info */}
                      <div className="flex items-center gap-2 mb-4">
                        <img 
                          src={event.organizer.avatar} 
                          className="w-6 h-6 rounded-full border border-slate-200" 
                          alt={event.organizer.name} 
                        />
                        <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">
                          {event.organizer.name}
                        </span>
                      </div>

                      <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-indigo-600 transition-colors">
                        {event.title}
                      </h3>

                      {/* Event Details */}
                      <div className="space-y-2 mb-6">
                        <div className="flex items-center gap-2 text-slate-500 text-sm">
                          <Calendar className="w-4 h-4 text-indigo-500" />
                          {event.date}
                        </div>
                        <div className="flex items-center gap-2 text-slate-500 text-sm">
                          <MapPin className="w-4 h-4 text-indigo-500" />
                          {event.location}
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-3 pt-4 border-t border-slate-50">
                      <button className="flex-1 bg-slate-900 text-white py-2.5 rounded-xl font-bold text-sm hover:bg-indigo-600 transition-colors flex items-center justify-center gap-2">
                        View Details
                        <ExternalLink className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => removeItem(event.id)}
                        className="p-2.5 rounded-xl bg-red-50 text-red-500 hover:bg-red-500 hover:text-white transition-all duration-200"
                        title="Remove from wishlist"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            /* Empty State */
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-20 bg-white rounded-[3rem] border-2 border-dashed border-slate-200"
            >
              <div className="bg-slate-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <BookmarkX className="w-10 h-10 text-slate-300" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900 mb-2">Your wishlist is empty</h2>
              <p className="text-slate-500 mb-8">Start exploring amazing events and save your favorites!</p>
              <a 
                href="/events" 
                className="inline-flex items-center gap-2 bg-indigo-600 text-white px-8 py-3 rounded-2xl font-black hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200"
              >
                Browse Events
              </a>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default WishlistPage;