import { useEffect, useState } from 'react';
import { 
  MagnifyingGlassIcon, 
  CalendarIcon, 
  MapPinIcon, 
  ClockIcon,
  FunnelIcon,
  Squares2X2Icon,
  ListBulletIcon,
  FireIcon,
  HeartIcon,
  ArrowRightIcon,
  XMarkIcon,
  ChatBubbleLeftRightIcon,
  PaperAirplaneIcon,
  UserCircleIcon,
  InformationCircleIcon
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartIconSolid, TicketIcon } from '@heroicons/react/24/solid';
import { useEventStore } from '../modules/events';
import { API_BASE_URL } from '../modules/api';

const BrowseEvents = () => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [favorites, setFavorites] = useState<Set<number>>(new Set());
  
  // Modal & Tab States
  const [selectedEvent, setSelectedEvent] = useState<any | null>(null);
  const [activeTab, setActiveTab] = useState<'details' | 'comments'>('details');
  const [commentText, setCommentText] = useState('');

  const categories = ['All', 'Networking Meetup','Technology', 'Music', 'Art', 'Business', 'Food & Drink', 'Sports & Fitness' , "Workshop" , "Conference" , "Webinar"];
  const { callEvents, fetchedEvents } = useEventStore();

  useEffect(() => {
    callEvents();
  }, [callEvents]);

  const sortedEvents = [...fetchedEvents].sort((a,b) => b.id - a.id);

  const formatEventTimeRange = (startStr: string, endStr: string) => {
    const start = new Date(startStr);
    const end = new Date(endStr);
    const dateOptions: Intl.DateTimeFormatOptions = { weekday: 'short', month: 'short', day: 'numeric' };
    const timeOptions: Intl.DateTimeFormatOptions = { hour: '2-digit', minute: '2-digit' };
    const startDate = start.toLocaleDateString('en-US', dateOptions);
    const endDate = end.toLocaleDateString('en-US', dateOptions);
    const dateDisplay = startDate === endDate ? startDate : `${startDate} - ${endDate}`;
    const timeDisplay = `${start.toLocaleTimeString('en-US', timeOptions)} - ${end.toLocaleTimeString('en-US', timeOptions)}`;
    
    return { dateDisplay, timeDisplay };
  };

  const filteredEvents = sortedEvents.filter(event => {
    const matchesCategory = selectedCategory === 'All' || event.category === selectedCategory;
    const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         event.location.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const toggleFavorite = (eventId: number) => {
    setFavorites(prev => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(eventId)) newFavorites.delete(eventId);
      else newFavorites.add(eventId);
      return newFavorites;
    });
  };


  const getFullYear = new Date().getFullYear();
  
  return (
    <div className="min-h-screen bg-[#FDFDFD] text-slate-900 selection:bg-emerald-100 selection:text-emerald-900">
      
      {/* BACKGROUND ELEMENTS */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-50 rounded-full blur-[120px] opacity-60" />
        <div className="absolute bottom-[-5%] right-[-5%] w-[30%] h-[30%] bg-blue-50 rounded-full blur-[100px] opacity-60" />
      </div>

      <div className="relative z-10">
        {/* HEADER SECTION */}
        <header className="pt-20 pb-16 md:pt-32 md:pb-24">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-700 text-xs font-bold uppercase tracking-widest mb-6">
                <FireIcon className="w-4 h-4" />
                <span>Events {getFullYear}</span>
              </div>
              <h1 className="text-5xl md:text-7xl font-black mb-8 tracking-tight leading-[1.1]">
                Find your next <br />
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 to-teal-500">
                  epic adventure.
                </span>
              </h1>
              
              <div className="relative group max-w-3xl">
                <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-[2rem] blur opacity-20 group-hover:opacity-30 transition duration-1000"></div>
                <div className="relative flex items-center bg-white border border-slate-100 rounded-[1.5rem] shadow-sm p-2">
                  <div className="flex-1 flex items-center px-4">
                    <MagnifyingGlassIcon className="w-6 h-6 text-slate-400 mr-3" />
                    <input
                      type="text"
                      placeholder="Search by title or location..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full py-4 text-lg bg-transparent border-none focus:ring-0 placeholder:text-slate-300 font-medium outline-0"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* NAVIGATION / FILTERS */}
        <nav className="sticky top-0 z-40 bg-white/70 backdrop-blur-xl border-y border-slate-100/50">
          <div className="container mx-auto px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
              <div className="p-2 bg-slate-100 rounded-lg text-slate-500 mr-2">
                <FunnelIcon className="w-5 h-5" />
              </div>
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-6 py-2.5 rounded-xl text-sm font-bold whitespace-nowrap transition-all duration-300 ${
                    selectedCategory === category ? 'bg-slate-900 text-white shadow-xl' : 'text-slate-500 hover:bg-slate-100'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>

            <div className="hidden lg:flex items-center gap-1 bg-slate-50 p-1.5 rounded-xl border border-slate-200">
              <button onClick={() => setViewMode('grid')} className={`p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-400'}`}>
                <Squares2X2Icon className="w-5 h-5" />
              </button>
              <button onClick={() => setViewMode('list')} className={`p-2 rounded-lg transition-all ${viewMode === 'list' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-400'}`}>
                <ListBulletIcon className="w-5 h-5" />
              </button>
            </div>
          </div>
        </nav>

        {/* MAIN CONTENT */}
        <main className="container mx-auto px-6 py-12">
          {viewMode === 'grid' ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-10">
              {filteredEvents.map((event) => {
                const { dateDisplay, timeDisplay } = formatEventTimeRange(event.starting_date_and_time, event.ending_date_and_time);
                return (
                  <div key={event.id} className="group relative flex flex-col bg-white rounded-[2rem] border border-slate-100 hover:border-emerald-200 transition-all duration-500 hover:-translate-y-2 overflow-hidden">
                    <div className="relative h-64 m-3 overflow-hidden rounded-[1.5rem] bg-slate-100">
                     
                        <img src={event.image? `${API_BASE_URL}/${event.image}` : `https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=500&q=80`} className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={event.title} />
                      
                      
                      <div className="absolute top-4 left-4 right-4 flex justify-between items-start">
                        <div className="px-3 py-1.5 rounded-full bg-white/90 backdrop-blur-md shadow-sm text-[10px] font-black uppercase tracking-tighter">
                            {event.category}
                        </div>
                        <button onClick={(e) => { e.stopPropagation(); toggleFavorite(event.id); }} className="p-2.5 bg-white/90 backdrop-blur-md rounded-full hover:bg-white transition-all shadow-lg">
                          {favorites.has(event.id) ? <HeartIconSolid className="w-5 h-5 text-rose-500" /> : <HeartIcon className="w-5 h-5 text-slate-400" />}
                        </button>
                      </div>

                      <button 
                        onClick={() => { setSelectedEvent(event); setActiveTab('comments'); }}
                        className="absolute bottom-4 left-4 flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/80 backdrop-blur-md text-white text-[10px] font-bold hover:bg-emerald-600 transition-all"
                      >
                        <ChatBubbleLeftRightIcon className="w-4 h-4" />
                        <span>{event.comments?.length || 0} Comments</span>
                      </button>
                    </div>

                    <div className="p-6 pt-2">
                      <div className="flex items-center gap-2 text-emerald-600 text-sm font-bold mb-3">
                        <CalendarIcon className="w-4 h-4" />
                        <span>{dateDisplay}</span>
                      </div>
                      <h3 className="text-2xl font-black text-slate-900 leading-tight mb-4 group-hover:text-emerald-700 transition-colors line-clamp-2 min-h-[3.5rem]">
                        {event.title}
                      </h3>
                      
                      <div className="space-y-3 mb-8">
                        <div className="flex items-center gap-3 text-slate-500"><ClockIcon className="w-4 h-4" /><span className="text-sm font-semibold">{timeDisplay}</span></div>
                        <div className="flex items-center gap-3 text-slate-500"><MapPinIcon className="w-4 h-4" /><span className="text-sm font-medium truncate">{event.location}</span></div>
                      </div>

                      <div className="flex items-center justify-between pt-5 border-t border-slate-50">
                        <div>
                          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1">Entry Fee</p>
                          <span className="text-2xl font-black text-slate-900">
                            {event.is_free === '1' || event.ticket_price === 0 ? 'Free' : `$${event.ticket_price}`}
                          </span>
                        </div>
                        <button 
                          onClick={() => { setSelectedEvent(event); setActiveTab('details'); }}
                          className="flex items-center justify-center w-12 h-12 bg-slate-900 text-white rounded-2xl hover:bg-emerald-600 transition-all shadow-xl"
                        >
                          <ArrowRightIcon className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="space-y-6">
              {filteredEvents.map((event) => {
                 const { dateDisplay, timeDisplay } = formatEventTimeRange(event.starting_date_and_time, event.ending_date_and_time);
                 return (
                  <div key={event.id} className="group relative bg-white rounded-[2rem] border border-slate-100 p-4 hover:shadow-2xl transition-all duration-500">
                    <div className="flex flex-col md:flex-row gap-8">
                      <div className="w-full md:w-64 h-48 rounded-[1.5rem] bg-slate-100 flex-shrink-0 overflow-hidden relative">
                          {event.image ? (
                            <img src={`${API_BASE_URL}/${event.image}`} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={event.title} />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-slate-200 text-slate-400"><CalendarIcon className="w-10 h-10" /></div>
                          )}
                          <button 
                             onClick={() => { setSelectedEvent(event); setActiveTab('comments'); }}
                             className="absolute bottom-3 left-3 flex items-center gap-1.5 px-2.5 py-1.5 bg-white/90 backdrop-blur shadow-sm rounded-xl hover:text-emerald-600 transition-colors text-xs font-bold"
                          >
                             <ChatBubbleLeftRightIcon className="w-4 h-4" />
                             {event.comments?.length || 0}
                          </button>
                      </div>
                      <div className="flex-1 py-2 pr-4 flex flex-col justify-between">
                        <div>
                          <div className="flex justify-between items-start mb-2">
                              <span className="text-emerald-600 font-black text-sm uppercase tracking-tighter">{dateDisplay}</span>
                          </div>
                          <h3 className="text-3xl font-black text-slate-900 mb-4 group-hover:text-emerald-600 transition-colors">{event.title}</h3>
                          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-slate-500 font-medium">
                              <div className="flex items-center gap-2 font-bold text-slate-700"><ClockIcon className="w-5 h-5 text-emerald-500" />{timeDisplay}</div>
                              <div className="flex items-center gap-2"><MapPinIcon className="w-5 h-5 text-slate-300" />{event.location}</div>
                          </div>
                        </div>
                        <div className="flex items-center justify-between mt-6">
                          <span className="text-3xl font-black text-slate-900">{event.is_free === '1' ? 'Free' : `$${event.ticket_price}`}</span>
                          <button onClick={() => { setSelectedEvent(event); setActiveTab('details'); }} className="px-8 py-4 bg-slate-900 text-white rounded-2xl font-bold hover:bg-emerald-600 transition-all shadow-xl">View Details</button>
                        </div>
                      </div>
                    </div>
                  </div>
                 );
              })}
            </div>
          )}
        </main>
      </div>

      {/* --- MODAL (DETAIL & DISCUSSION) --- */}
      {selectedEvent && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6 overflow-hidden">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={() => setSelectedEvent(null)}></div>
          <div className="relative bg-white w-full max-w-5xl h-full max-h-[85vh] md:max-h-[80vh] overflow-hidden rounded-[2.5rem] shadow-2xl flex flex-col md:flex-row animate-in fade-in zoom-in duration-300">
            <div className="w-full md:w-2/5 h-48 md:h-auto relative shrink-0">
              {selectedEvent.image ? (
                <img src={`${API_BASE_URL}/${selectedEvent.image}`} className="absolute inset-0 w-full h-full object-cover" alt={selectedEvent.title} />
              ) : (
                <div className="absolute inset-0 bg-slate-200 flex items-center justify-center"><CalendarIcon className="w-20 h-20 text-slate-400" /></div>
              )}
            </div>

            <div className="flex-1 flex flex-col bg-white overflow-hidden">
              <div className="px-8 pt-8 border-b border-slate-50">
                <div className="flex justify-between items-start mb-6">
                  <h2 className="text-2xl md:text-3xl font-black text-slate-900 leading-tight truncate">{selectedEvent.title}</h2>
                  <button onClick={() => setSelectedEvent(null)} className="absolute top-6 right-6 p-2 rounded-full hover:bg-slate-100 transition-colors z-10 bg-white/80"><XMarkIcon className="w-6 h-6 text-slate-400" /></button>
                </div>
                <div className="flex gap-8">
                  <button onClick={() => setActiveTab('details')} className={`pb-4 text-xs font-black uppercase tracking-widest transition-all relative flex items-center gap-2 ${activeTab === 'details' ? 'text-emerald-600' : 'text-slate-400'}`}>
                    <InformationCircleIcon className="w-4 h-4" />Details
                    {activeTab === 'details' && <div className="absolute bottom-0 left-0 right-0 h-1 bg-emerald-600 rounded-full" />}
                  </button>
                  <button onClick={() => setActiveTab('comments')} className={`pb-4 text-xs font-black uppercase tracking-widest transition-all relative flex items-center gap-2 ${activeTab === 'comments' ? 'text-emerald-600' : 'text-slate-400'}`}>
                    <ChatBubbleLeftRightIcon className="w-4 h-4" />Comments
                    <span className={`px-1.5 py-0.5 rounded-md text-[10px] ${activeTab === 'comments' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
                      {selectedEvent.comments?.length || 0}
                    </span>
                    {activeTab === 'comments' && <div className="absolute bottom-0 left-0 right-0 h-1 bg-emerald-600 rounded-full" />}
                  </button>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-8 custom-scrollbar bg-slate-50/30">
                {activeTab === 'details' ? (
                  <div className="space-y-8 animate-in slide-in-from-bottom-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-center gap-4 p-4 bg-white border border-slate-100 rounded-3xl shadow-sm">
                        <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center"><ClockIcon className="w-6 h-6 text-emerald-500" /></div>
                        <div><p className="text-[10px] font-black text-slate-400 uppercase">Time</p><p className="text-slate-800 font-bold text-sm">{formatEventTimeRange(selectedEvent.starting_date_and_time, selectedEvent.ending_date_and_time).timeDisplay}</p></div>
                      </div>
                      <div className="flex items-center gap-4 p-4 bg-white border border-slate-100 rounded-3xl shadow-sm">
                        <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center"><MapPinIcon className="w-6 h-6 text-emerald-500" /></div>
                        <div className="truncate"><p className="text-[10px] font-black text-slate-400 uppercase">Location</p><p className="text-slate-800 font-bold text-sm truncate">{selectedEvent.location}</p></div>
                      </div>
                    </div>
                    <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                      <h4 className="text-[10px] font-black text-slate-900 uppercase tracking-widest mb-4 flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />About this event</h4>
                      <p className="text-slate-600 leading-relaxed text-sm">{selectedEvent.description || "No specific details provided yet."}</p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6 animate-in slide-in-from-bottom-4">
                    {selectedEvent.comments && selectedEvent.comments.length > 0 ? (
                      selectedEvent.comments.map((c: any) => (
                        <div key={c.id} className="flex gap-4 group">
                          <div className="w-10 h-10 rounded-2xl bg-slate-100 flex items-center justify-center shrink-0 border border-white shadow-sm">
                            <UserCircleIcon className="w-6 h-6 text-slate-400" />
                          </div>
                          <div className="flex-1 bg-white border border-slate-100 p-4 rounded-3xl rounded-tl-none shadow-sm">
                            <div className="flex justify-between mb-1">
                              <span className="font-black text-sm text-slate-900">User #{c.user_id}</span>
                              <span className="text-[10px] text-slate-400 font-bold uppercase">
                                {c.created_at ? new Date(c.created_at).toLocaleDateString() : 'Just now'}
                              </span>
                            </div>
                            <p className="text-sm text-slate-600">{c.comment}</p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-10 opacity-50">
                        <ChatBubbleLeftRightIcon className="w-12 h-12 mx-auto mb-2 text-slate-300" />
                        <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">No comments yet</p>
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="p-6 bg-white border-t border-slate-50">
                {activeTab === 'comments' ? (
                  <div className="flex items-center gap-3">
                    <div className="flex-1 relative">
                      <input 
                        type="text" 
                        value={commentText} 
                        onChange={(e) => setCommentText(e.target.value)} 
                        placeholder="Write a comment..." 
                        className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 pr-14 text-sm focus:bg-white transition-all outline-none" 
                      />
                      <button className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-slate-900 text-white rounded-xl flex items-center justify-center hover:bg-emerald-600 shadow-lg active:scale-90">
                        <PaperAirplaneIcon className="w-5 h-5 -rotate-45" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col sm:flex-row items-center gap-4">
                    <button className="w-full flex-1 py-5 bg-slate-900 text-white rounded-[1.5rem] font-black text-sm hover:bg-emerald-600 transition-all shadow-xl flex items-center justify-center gap-3 active:scale-[0.98]">
                      <TicketIcon className="w-5 h-5" />
                      Book Now — {selectedEvent.is_free === '1' ? 'Free' : `$${selectedEvent.ticket_price}`}
                    </button>
                    <button onClick={() => setSelectedEvent(null)} className="w-full sm:w-auto px-8 py-5 text-slate-500 font-black text-xs uppercase tracking-widest">Dismiss</button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BrowseEvents;