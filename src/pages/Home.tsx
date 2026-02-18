import { useEffect, useState, useMemo, useCallback } from 'react';
import { 
  MagnifyingGlassIcon, CalendarIcon, MapPinIcon, ClockIcon, FunnelIcon,
  Squares2X2Icon, ListBulletIcon, FireIcon, HeartIcon, ArrowRightIcon,
  ChatBubbleLeftRightIcon, PaperAirplaneIcon, UserCircleIcon, 
  InformationCircleIcon, XMarkIcon, GlobeAltIcon
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid';
import { useEventStore } from '../modules/events';
import { API_BASE_URL } from '../modules/api';
import { toast } from 'react-toastify';
import { useProfileStore } from '../stores/store';

const BrowseEvents = () => {
  // --- STATE ---
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [favorites, setFavorites] = useState<Set<number>>(new Set());
  const [selectedEvent, setSelectedEvent] = useState<any | null>(null);
  const [activeTab, setActiveTab] = useState<'details' | 'comments'>('details');
  const [commentText, setCommentText] = useState('');

  const categories = [
    'All', 'Networking Meetup', 'Technology', 'Music', 'Art', 'Business', 
    'Food & Drink', 'Sports & Fitness', "Workshop", "Conference", "Webinar"
  ];

  // --- STORE HOOKS ---
  const { callEvents, fetchedEvents, messagesWithUser, msgWithUser, add_comment } = useEventStore();
  const user = useProfileStore((state) => state.user);

  useEffect(() => {
    callEvents();
  }, [callEvents]);

  // --- LOGIC: MEMOIZED FILTERING ---
  const filteredEvents = useMemo(() => {
    const sorted = [...fetchedEvents].sort((a, b) => b.id - a.id);
    return sorted.filter(event => {
      const matchesCategory = selectedCategory === 'All' || event.category === selectedCategory;
      const matchesSearch = (event.title?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
                            (event.location?.toLowerCase() || '').includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [fetchedEvents, selectedCategory, searchQuery]);

  // --- CALLBACKS ---
  const toggleFavorite = useCallback((eventId: number) => {
    setFavorites(prev => {
      const newSet = new Set(prev);
      if (newSet.has(eventId)) newSet.delete(eventId);
      else newSet.add(eventId);
      return newSet;
    });
  }, []);

  const handleOpenEvent = async (event: any, tab: 'details' | 'comments') => {
    setSelectedEvent(event);
    setActiveTab(tab);
    if (tab === 'comments') {
      await messagesWithUser(event.id);
    }
  };

  const handleAddComment = async (eventId: number) => {
    if (!commentText.trim()) return;
    try {
      await add_comment({ comment: commentText, event_id: eventId });
      toast.success("Comment Added");
      setCommentText('');
      await messagesWithUser(eventId);
    } catch (err: any) {
      toast.error(err.message || "Failed to add comment");
    }
  };

  // --- SMART DATE & TIME FORMATTING ---
  const formatEventTimeRange = (startStr: string, endStr: string) => {
    if (!startStr) return { dateDisplay: 'TBA', timeDisplay: 'TBA', endingDisplay: 'TBA' };
    const start = new Date(startStr);
    const end = new Date(endStr);
    const dateOptions: Intl.DateTimeFormatOptions = { weekday: 'short', month: 'short', day: 'numeric' };
    const timeOptions: Intl.DateTimeFormatOptions = { hour: '2-digit', minute: '2-digit' };

    const startDate = start.toLocaleDateString('en-US', dateOptions);
    const endDate = end.toLocaleDateString('en-US', dateOptions);

    return { 
      dateDisplay: startDate === endDate ? startDate : `${startDate} - ${endDate}`,
      timeDisplay: `${start.toLocaleTimeString('en-US', timeOptions)} - ${end.toLocaleTimeString('en-US', timeOptions)}`,
      endingDisplay: `${endDate} at ${end.toLocaleTimeString('en-US', timeOptions)}`
    };
  };

  return (
    <div className="min-h-screen bg-[#FDFDFD] text-slate-900 selection:bg-emerald-100 selection:text-emerald-900">
      {/* BACKGROUND ELEMENTS */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-5%] left-[-10%] w-[60%] md:w-[40%] h-[40%] bg-emerald-50 rounded-full blur-[80px] md:blur-[120px] opacity-60" />
        <div className="absolute bottom-[-5%] right-[-5%] w-[50%] md:w-[30%] h-[30%] bg-blue-50 rounded-full blur-[80px] md:blur-[100px] opacity-60" />
      </div>

      <div className="relative z-10">
        {/* HEADER */}
        <header className="pt-12 pb-8 md:pt-32 md:pb-24">
          <div className="container mx-auto px-4 md:px-6 text-center md:text-left">
            <div className="max-w-4xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-700 text-[10px] md:text-xs font-bold uppercase tracking-widest mb-6">
                <FireIcon className="w-4 h-4" />
                <span>Live Events {new Date().getFullYear()}</span>
              </div>
              <h1 className="text-4xl sm:text-5xl md:text-7xl font-black mb-6 md:mb-8 tracking-tight leading-[1.1]">
                Find your next <br className="hidden md:block" />
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 to-teal-500">epic adventure.</span>
              </h1>

              <div className="relative group max-w-3xl mx-auto md:mx-0">
                <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-[1.5rem] md:rounded-[2rem] blur opacity-10 group-hover:opacity-25 transition duration-1000"></div>
                <div className="relative flex items-center bg-white border border-slate-100 rounded-[1.2rem] md:rounded-[1.5rem] shadow-sm p-1.5 md:p-2">
                  <div className="flex-1 flex items-center px-3 md:px-4">
                    <MagnifyingGlassIcon className="w-5 h-5 md:w-6 md:h-6 text-slate-400 mr-2 md:mr-3" />
                    <input
                      type="text"
                      placeholder="Search title or location..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full py-3 md:py-4 text-base md:text-lg bg-transparent border-none focus:ring-0 placeholder:text-slate-300 font-medium outline-0"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* STICKY NAV */}
        <nav className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-y border-slate-100/50 shadow-sm">
          <div className="container mx-auto px-4 md:px-6 py-3 flex items-center justify-between gap-4">
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar flex-1 py-1">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 md:px-6 py-2 md:py-2.5 rounded-xl text-xs md:text-sm font-bold whitespace-nowrap transition-all duration-300 ${selectedCategory === category ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-500 hover:bg-slate-100'}`}
                >
                  {category}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200 shrink-0">
              <button onClick={() => setViewMode('grid')} className={`p-1.5 md:p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-400'}`}>
                <Squares2X2Icon className="w-4 h-4 md:w-5 md:h-5" />
              </button>
              <button onClick={() => setViewMode('list')} className={`p-1.5 md:p-2 rounded-lg transition-all ${viewMode === 'list' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-400'}`}>
                <ListBulletIcon className="w-4 h-4 md:w-5 md:h-5" />
              </button>
            </div>
          </div>
        </nav>

        {/* FEED CONTENT */}
        <main className="container mx-auto px-4 md:px-6 py-8 md:py-12">
          <div className={viewMode === 'grid' ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-10" : "flex flex-col gap-6"}>
            {filteredEvents.map((event) => {
              const { dateDisplay, timeDisplay } = formatEventTimeRange(event.starting_date_and_time, event.ending_date_and_time);
              const commentCount = event.comments?.length || 0;

              return (
                <div key={event.id} className={`group bg-white border border-slate-100 rounded-[1.5rem] md:rounded-[2rem] overflow-hidden transition-all duration-500 hover:shadow-2xl ${viewMode === 'list' ? 'flex flex-col md:flex-row md:h-72' : 'flex flex-col'}`}>
                  
                  {/* Thumbnail Area */}
                  <div className={`relative overflow-hidden bg-slate-100 shrink-0 ${viewMode === 'list' ? 'w-full md:w-1/3 h-48 md:h-full' : 'h-56 md:h-64 m-2 md:m-3 rounded-[1rem] md:rounded-[1.5rem]'}`}>
                    <img 
                      src={event.image ? `${API_BASE_URL}/${event.image}` : `https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=500`} 
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                      alt={event.title} 
                    />
                    <div className="absolute top-3 left-3 right-3 flex justify-between items-start">
                      <div className="px-2 md:px-3 py-1 rounded-full bg-white/90 backdrop-blur-md text-[9px] md:text-[10px] font-black uppercase tracking-tight shadow-sm">
                        {event.category}
                      </div>
                      <button onClick={(e) => { e.stopPropagation(); toggleFavorite(event.id); }} className="p-2 md:p-2.5 bg-white/90 backdrop-blur-md rounded-full hover:bg-white transition-all shadow-lg">
                        {favorites.has(event.id) ? <HeartIconSolid className="w-4 h-4 md:w-5 md:h-5 text-rose-500" /> : <HeartIcon className="w-4 h-4 md:w-5 md:h-5 text-slate-400" />}
                      </button>
                    </div>
                    <button onClick={() => handleOpenEvent(event, 'comments')} className="absolute bottom-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-900/80 backdrop-blur-md text-white text-[9px] md:text-[10px] font-bold hover:bg-emerald-600 transition-all">
                      <ChatBubbleLeftRightIcon className="w-4 h-4" /> <span>{commentCount}</span>
                    </button>
                  </div>

                  {/* Info Area */}
                  <div className="p-5 md:p-6 flex flex-col justify-between flex-1 min-w-0">
                    <div>
                      <div className="flex items-center gap-2 text-emerald-600 text-xs md:text-sm font-bold mb-2">
                        <CalendarIcon className="w-3.5 h-3.5 md:w-4 md:h-4" />
                        <span>{dateDisplay}</span>
                      </div>
                      <h3 className="text-lg md:text-xl font-black text-slate-900 leading-tight mb-3 group-hover:text-emerald-700 transition-colors line-clamp-2">
                        {event.title}
                      </h3>
                      <div className="space-y-1.5 text-slate-500 text-xs md:text-sm">
                        <div className="flex items-center gap-2 font-medium truncate">
                          <ClockIcon className="w-4 h-4 shrink-0" /> {timeDisplay}
                        </div>
                        <div className="flex items-center gap-2 font-medium truncate">
                          <MapPinIcon className="w-4 h-4 shrink-0" /> {event.location}
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-between items-center mt-5 pt-4 border-t border-slate-50">
                      <div>
                        <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">Ticket Price</p>
                        <span className="text-lg md:text-xl font-black text-slate-900">
                          {event.is_free === '1' || event.ticket_price === 0 ? 'Free' : `$${event.ticket_price}`}
                        </span>
                      </div>
                      <button onClick={() => handleOpenEvent(event, 'details')} className="p-2.5 md:p-3 rounded-xl md:rounded-2xl bg-slate-900 text-white hover:bg-emerald-600 transition-all shadow-lg active:scale-95">
                        <ArrowRightIcon className="w-4 h-4 md:w-5 md:h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </main>

        {/* DETAILS & COMMENTS MODAL */}
        {selectedEvent && (
          <div className="fixed inset-0 z-[100] flex items-end md:items-center justify-center p-0 md:p-6">
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm md:backdrop-blur-md" onClick={() => setSelectedEvent(null)}></div>
            <div className="relative bg-white w-full max-w-5xl h-[92vh] md:h-full md:max-h-[85vh] overflow-hidden rounded-t-[2rem] md:rounded-[2.5rem] shadow-2xl flex flex-col animate-in slide-in-from-bottom md:zoom-in duration-300">
              
              {/* Modal Tabs */}
              <div className="flex items-center justify-between px-6 md:px-8 pt-6 border-b border-slate-100 shrink-0">
                <div className="flex gap-6 md:gap-8">
                  {['details', 'comments'].map((tab) => (
                    <button 
                      key={tab}
                      onClick={() => { setActiveTab(tab as any); if(tab === 'comments') messagesWithUser(selectedEvent.id); }}
                      className={`pb-4 text-[10px] md:text-xs font-black uppercase tracking-widest transition-all ${activeTab === tab ? 'text-slate-900 border-b-2 border-slate-900' : 'text-slate-400 hover:text-slate-600'}`}
                    >
                      {tab} {tab === 'comments' ? `(${msgWithUser?.comments?.length || 0})` : ''}
                    </button>
                  ))}
                </div>
                <button onClick={() => setSelectedEvent(null)} className="p-2 -mt-4 bg-slate-100 rounded-full hover:bg-slate-200">
                  <XMarkIcon className="w-5 h-5 text-slate-500" />
                </button>
              </div>

              {/* Modal Content */}
              <div className="flex-1 overflow-y-auto p-6 md:p-8 custom-scrollbar">
                {activeTab === 'details' ? (
                  <div className="animate-in fade-in duration-500">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10">
                      <div className="md:col-span-2 space-y-6 md:space-y-8">
                        <div>
                          <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-[10px] font-black uppercase tracking-widest mb-4 inline-block">{selectedEvent.category}</span>
                          <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-6 leading-tight">{selectedEvent.title}</h2>
                          <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100 w-fit pr-8">
                            
                            <img src="/src/assets/icons8-gmail-logo-50.png" />
                            <div>
                              <p className="text-[9px] text-slate-400 font-bold uppercase">Organizer</p>
                              <p className="font-bold text-slate-900 text-sm"> {selectedEvent.organizer.email}</p>
                            </div>
                          </div>
                        </div>
                        <div>
                          <h4 className="text-[10px] md:text-xs font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2"><InformationCircleIcon className="w-5 h-5" /> About This Event</h4>
                          <p className="text-slate-600 leading-relaxed text-base md:text-lg whitespace-pre-line">{selectedEvent.description || "Details for this event will be shared soon."}</p>
                        </div>
                      </div>

                      {/* Right Sidebar */}
                      <div className="md:sticky md:top-0">
                        <div className="p-6 md:p-8 rounded-[1.5rem] md:rounded-[2rem] bg-slate-900 text-white shadow-xl">
                          <div className="space-y-6">
                            <div className="flex items-start gap-4">
                              <CalendarIcon className="w-5 h-5 md:w-6 md:h-6 text-emerald-400 shrink-0" />
                              <div>
                                <p className="text-[9px] text-slate-400 font-bold uppercase mb-1">When</p>
                                <p className="font-bold leading-tight text-sm md:text-base">{formatEventTimeRange(selectedEvent.starting_date_and_time, selectedEvent.ending_date_and_time).dateDisplay}</p>
                              </div>
                            </div>
                            <div className="flex items-start gap-4">
                              <ClockIcon className="w-5 h-5 md:w-6 md:h-6 text-emerald-400 shrink-0" />
                              <div>
                                <p className="text-[9px] text-slate-400 font-bold uppercase mb-1">Time Range</p>
                                <p className="font-bold leading-tight text-sm md:text-base">{formatEventTimeRange(selectedEvent.starting_date_and_time, selectedEvent.ending_date_and_time).timeDisplay}</p>
                              </div>
                            </div>
                            <div className="flex items-start gap-4">
                              <MapPinIcon className="w-5 h-5 md:w-6 md:h-6 text-emerald-400 shrink-0" />
                              <div className="flex-1 min-w-0">
                                <p className="text-[9px] text-slate-400 font-bold uppercase mb-1">Where</p>
                                {selectedEvent.location?.startsWith('http') ? (
                                  <div className="pt-1">
                                    
                                    <a href={selectedEvent.location} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-900 rounded-xl text-xs font-black transition-all shadow-lg shadow-emerald-500/20">Explore Venue</a>
                                  </div>
                                ) : (
                                  <div>
                                    <p className="font-bold leading-tight text-sm md:text-base break-words mb-2">{selectedEvent.location || "TBA"}</p>
                                    {selectedEvent.location && (
                                      <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(selectedEvent.location)}`} target="_blank" rel="noopener noreferrer" className="text-[9px] text-emerald-400 font-black uppercase tracking-tighter hover:text-emerald-300 transition-colors underline underline-offset-4 decoration-emerald-500/30">View on Maps</a>
                                    )}
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="mt-8 pt-8 border-t border-slate-800">
                             <p className="text-[9px] text-slate-400 font-bold uppercase mb-1">Price</p>
                             <p className="text-2xl md:text-3xl font-black mb-6">{selectedEvent.is_free === '1' ? 'Free' : `$${selectedEvent.ticket_price}`}</p>
                             <button className="w-full py-4 bg-emerald-500 hover:bg-emerald-400 text-slate-900 rounded-xl md:rounded-2xl font-black transition-all shadow-lg active:scale-95">Get Access</button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  /* --- COMMENTS SECTION --- */
                  <div className="animate-in fade-in duration-500 flex flex-col h-full min-h-[400px]">
                    <div className="space-y-4 md:space-y-6 flex-1">
                      {msgWithUser?.comments?.length > 0 ? (
                        [...msgWithUser.comments].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()).map((c: any) => (
                          <div key={c.id} className="flex gap-3 md:gap-4 group">
                            <div className="w-8 h-8 md:w-10 md:h-10 rounded-xl bg-slate-100 flex items-center justify-center shrink-0 border border-white shadow-sm"><UserCircleIcon className="w-5 h-5 md:w-6 md:h-6 text-slate-400" /></div>
                            <div className="flex-1 bg-slate-50 border border-slate-100 p-3 md:p-4 rounded-2xl md:rounded-3xl rounded-tl-none group-hover:bg-white transition-all">
                              <div className="flex justify-between mb-1 gap-4">
                                <span className="font-black text-xs md:text-sm text-slate-900 truncate">{c.user?.name || "User"}</span>
                                <span className="text-[9px] text-slate-400 font-bold uppercase shrink-0">{new Date(c.created_at).toLocaleDateString()}</span>
                              </div>
                              <p className="text-xs md:text-sm text-slate-600">{c.comment}</p>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="flex flex-col items-center justify-center py-20 opacity-30 text-center">
                          <ChatBubbleLeftRightIcon className="w-12 h-12 mb-4 text-slate-300" />
                          <p className="font-black text-slate-400 text-xs uppercase tracking-widest">No conversations yet</p>
                        </div>
                      )}
                    </div>
                    {user && (
                      <div className="sticky bottom-0 bg-white pt-6 mt-6 border-t border-slate-50">
                        <div className="flex items-center gap-2 relative">
                          <input type="text" value={commentText} onChange={(e) => setCommentText(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && handleAddComment(selectedEvent.id)} placeholder="Say something nice..." className="w-full bg-slate-50 border border-slate-100 rounded-xl md:rounded-2xl px-4 md:px-6 py-4 md:py-5 pr-14 text-xs md:text-sm focus:bg-white transition-all outline-none" />
                          <button onClick={() => handleAddComment(selectedEvent.id)} disabled={!commentText.trim()} className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 md:w-11 md:h-11 bg-slate-900 text-white rounded-lg md:rounded-xl flex items-center justify-center hover:bg-emerald-600 shadow-lg disabled:opacity-30 active:scale-95 transition-all"><PaperAirplaneIcon className="w-5 h-5 -rotate-45" /></button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BrowseEvents;