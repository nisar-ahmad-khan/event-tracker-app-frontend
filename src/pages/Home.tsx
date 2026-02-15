import { useEffect, useState } from 'react';
import { 
  MagnifyingGlassIcon, 
  CalendarIcon, 
  MapPinIcon, 
  UsersIcon,
  ClockIcon,
  TagIcon,
  AdjustmentsHorizontalIcon,
  FunnelIcon,
  Squares2X2Icon,
  ListBulletIcon,
  FireIcon,
  HeartIcon,
  ArrowRightIcon,
  GlobeAltIcon,
  XMarkIcon // Added for the cancel button
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartIconSolid, TicketIcon } from '@heroicons/react/24/solid';
import { useEventStore } from '../modules/events';
import { API_BASE_URL } from '../modules/api';

const BrowseEvents = () => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [favorites, setFavorites] = useState<Set<number>>(new Set());
  
  // NEW: State for the conditional view
  const [selectedEvent, setSelectedEvent] = useState<any | null>(null);

  const categories = ['All', 'Networking Meetup','Technology', 'Music', 'Art', 'Business', 'Food & Drink', 'Sports & Fitness' , "Workshop" , "Conference" , "Webinar"];
  const { callEvents, fetchedEvents } = useEventStore();

  useEffect(() => {
    callEvents();
  }, []);

  fetchedEvents.sort((a,b) => b.id - a.id)

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

  const filteredEvents = fetchedEvents.filter(event => {
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

  return (
    <div className="min-h-screen bg-[#FDFDFD] text-slate-900 selection:bg-emerald-100 selection:text-emerald-900">
      
      {/* BACKGROUND ELEMENTS */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-50 rounded-full blur-[120px] opacity-60" />
        <div className="absolute bottom-[-5%] right-[-5%] w-[30%] h-[30%] bg-blue-50 rounded-full blur-[100px] opacity-60" />
      </div>

      <div className="relative z-10">
        {/* HEADER SECTION */}
        <header className="pt-20 pb-16 md:pt-32 md:pb-24 overflow-hidden">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-700 text-xs font-bold uppercase tracking-widest mb-6">
                <FireIcon className="w-4 h-4" />
                <span>Live Events 2026</span>
              </div>
              <h1 className="text-5xl md:text-7xl font-black mb-8 tracking-tight leading-[1.1]">
                Find your next <br />
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 to-teal-500">
                  epic adventure.
                </span>
              </h1>
              
              <div className="relative group max-w-3xl">
                <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-[2rem] blur opacity-20 group-hover:opacity-30 transition duration-1000"></div>
                <div className="relative flex items-center bg-white border border-slate-100 rounded-[1.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.05)] p-2">
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
                  <button className="hidden md:block px-8 py-4 bg-slate-900 text-white rounded-[1.2rem] font-bold hover:bg-emerald-600 transition-all duration-300 shadow-lg active:scale-95">
                    Search
                  </button>
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
                    selectedCategory === category
                      ? 'bg-slate-900 text-white shadow-xl shadow-slate-200'
                      : 'text-slate-500 hover:bg-slate-100'
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
          <div className="flex items-end justify-between mb-12">
            <div>
              <p className="text-emerald-600 font-bold tracking-widest text-xs uppercase mb-2">Curated for you</p>
              <h2 className="text-4xl font-black tracking-tight">{selectedCategory} Events</h2>
            </div>
          </div>

          {viewMode === 'grid' ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-10">
              {filteredEvents.map((event) => {
                const { dateDisplay, timeDisplay } = formatEventTimeRange(event.starting_date_and_time, event.ending_date_and_time);
                return (
                  <div key={event.id} className="group relative flex flex-col bg-white rounded-[2rem] border border-slate-100 hover:border-emerald-200 transition-all duration-500 hover:-translate-y-2">
                    <div className="relative h-64 m-3 overflow-hidden rounded-[1.5rem] bg-slate-100">
                      {event.image ? (
                        <img 
                            src={`${API_BASE_URL}/${event.image}`} 
                            alt={event.title}
                            className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                        />
                      ) : (
                        <div className="absolute inset-0 bg-gradient-to-br from-slate-200 to-slate-300 flex items-center justify-center">
                            <CalendarIcon className="w-12 h-12 text-slate-400" />
                        </div>
                      )}
                      
                      <div className="absolute top-4 left-4 right-4 flex justify-between items-start">
                        <div className="px-3 py-1.5 rounded-full bg-white/90 backdrop-blur-md shadow-sm text-[10px] font-black uppercase tracking-tighter">
                            {event.category}
                        </div>
                        <button
                          onClick={() => toggleFavorite(event.id)}
                          className="p-2.5 bg-white/90 backdrop-blur-md rounded-full hover:bg-white transition-all shadow-lg active:scale-90"
                        >
                          {favorites.has(event.id) ? (
                            <HeartIconSolid className="w-5 h-5 text-rose-500" />
                          ) : (
                            <HeartIcon className="w-5 h-5 text-slate-400" />
                          )}
                        </button>
                      </div>
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
                        <div className="flex items-center gap-3 text-slate-500">
                          <ClockIcon className="w-4 h-4 text-slate-400" />
                          <span className="text-sm font-semibold text-slate-600">{timeDisplay}</span>
                        </div>
                        <div className="flex items-center gap-3 text-slate-500">
                          <MapPinIcon className="w-4 h-4 text-slate-400" />
                          <span className="text-sm font-medium truncate">{event.location}</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-5 border-t border-slate-50">
                        <div>
                          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1">Entry Fee</p>
                          <span className="text-2xl font-black text-slate-900">
                            {event.is_free === 'true' || event.is_free === '1' ? 'Free' : `$${event.ticket_price}`}
                          </span>
                        </div>
                        {/* TRIGGER MODAL ON CLICK */}
                        <button 
                          onClick={() => setSelectedEvent(event)}
                          className="flex items-center justify-center w-12 h-12 bg-slate-900 text-white rounded-2xl hover:bg-emerald-600 transition-all shadow-xl active:scale-95"
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
                      <div className="w-full md:w-64 h-48 rounded-[1.5rem] bg-slate-100 flex-shrink-0 overflow-hidden">
                          {event.image ? (
                            <img src={`${API_BASE_URL}/${event.image}`} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-slate-200 text-slate-400"><CalendarIcon className="w-10 h-10" /></div>
                          )}
                      </div>
                      <div className="flex-1 py-2 pr-4 flex flex-col justify-between">
                        <div>
                          <div className="flex justify-between items-start mb-2">
                              <span className="text-emerald-600 font-black text-sm uppercase tracking-tighter">{dateDisplay}</span>
                              <button onClick={() => toggleFavorite(event.id)}>
                                  {favorites.has(event.id) ? <HeartIconSolid className="w-6 h-6 text-rose-500" /> : <HeartIcon className="w-6 h-6 text-slate-200" />}
                              </button>
                          </div>
                          <h3 className="text-3xl font-black text-slate-900 mb-4 group-hover:text-emerald-600 transition-colors">
                              {event.title}
                          </h3>
                          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-slate-500 font-medium">
                              <div className="flex items-center gap-2 font-bold text-slate-700">
                                <ClockIcon className="w-5 h-5 text-emerald-500" />
                                {timeDisplay}
                              </div>
                              <div className="flex items-center gap-2">
                                <MapPinIcon className="w-5 h-5 text-slate-300" />
                                {event.location}
                              </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between mt-6">
                          <span className="text-3xl font-black text-slate-900">
                            {event.is_free === 'true' || event.is_free === '1' ? 'Free' : `$${event.ticket_price}`}
                          </span>
                          {/* TRIGGER MODAL ON CLICK */}
                          <button 
                            onClick={() => setSelectedEvent(event)}
                            className="px-8 py-4 bg-slate-900 text-white rounded-2xl font-bold hover:bg-emerald-600 transition-all shadow-xl"
                          >
                              View Details
                          </button>
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

      {/* --- CONDITIONAL RENDERED VIEW (DETAIL MODAL) --- */}
      {selectedEvent && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-md transition-opacity"
            onClick={() => setSelectedEvent(null)}
          ></div>

          {/* Modal Content */}
          <div className="relative bg-white w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-[2.5rem] shadow-2xl flex flex-col md:flex-row animate-in fade-in zoom-in duration-300">
            
            {/* Image Section */}
            <div className="w-full md:w-1/2 h-64 md:h-auto relative">
              {selectedEvent.image ? (
                <img 
                  src={`${API_BASE_URL}/${selectedEvent.image}`} 
                  className="absolute inset-0 w-full h-full object-cover" 
                  alt={selectedEvent.title}
                />
              ) : (
                <div className="absolute inset-0 bg-slate-200 flex items-center justify-center">
                  <CalendarIcon className="w-20 h-20 text-slate-400" />
                </div>
              )}
              <div className="absolute top-6 left-6">
                <span className="px-4 py-2 rounded-full bg-white/90 backdrop-blur-md text-xs font-black uppercase tracking-widest text-emerald-600 shadow-sm">
                  {selectedEvent.category}
                </span>
              </div>
            </div>

            {/* Info Section */}
            <div className="flex-1 p-8 md:p-12 flex flex-col">
              <button 
                onClick={() => setSelectedEvent(null)}
                className="absolute top-6 right-6 p-2 rounded-full hover:bg-slate-100 transition-colors"
              >
                <XMarkIcon className="w-6 h-6 text-slate-400" />
              </button>

              <div className="mb-8">
                <div className="flex items-center gap-2 text-emerald-600 font-bold text-sm mb-4">
                  <CalendarIcon className="w-5 h-5" />
                  <span>{formatEventTimeRange(selectedEvent.starting_date_and_time, selectedEvent.ending_date_and_time).dateDisplay}</span>
                </div>
                <h2 className="text-4xl font-black text-slate-900 leading-tight mb-6">
                  {selectedEvent.title}
                </h2>
                
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-slate-50 rounded-2xl">
                      <ClockIcon className="w-6 h-6 text-slate-400" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Time & Duration</p>
                      <p className="text-slate-700 font-bold">{formatEventTimeRange(selectedEvent.starting_date_and_time, selectedEvent.ending_date_and_time).timeDisplay}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-slate-50 rounded-2xl">
                      <MapPinIcon className="w-6 h-6 text-slate-400" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Location</p>
                      <p className="text-slate-700 font-bold">{selectedEvent.location}</p>
                    </div>
                  </div>

                  {selectedEvent.description && (
                     <div className="pt-4">
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">About This Event</p>
                        <p className="text-slate-600 leading-relaxed line-clamp-4">{selectedEvent.description}</p>
                     </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-auto flex flex-col sm:flex-row items-center gap-4">
                <button className="w-full flex-1 py-5 bg-emerald-600 text-white rounded-[1.5rem] font-black text-lg hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-200 flex items-center justify-center gap-3 active:scale-[0.98]">
                  <TicketIcon className="w-6 h-6" />
                  Purchase Ticket - {selectedEvent.is_free === 'true' || selectedEvent.is_free === '1' ? 'Free' : `$${selectedEvent.ticket_price}`}
                </button>
                <button 
                  onClick={() => setSelectedEvent(null)}
                  className="w-full sm:w-auto px-8 py-5 bg-slate-100 text-slate-600 rounded-[1.5rem] font-bold hover:bg-slate-200 transition-all active:scale-[0.98]"
                >
                  Cancel
                </button>
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};

export default BrowseEvents;