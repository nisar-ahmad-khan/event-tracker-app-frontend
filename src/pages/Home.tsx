import { useState } from 'react';
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
  ArrowRightIcon
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid';

interface Event {
  id: number;
  title: string;
  date: string;
  time: string;
  location: string;
  category: string;
  imageGradient: string;
  attendees: number;
  price: string;
  organizer: string;
  isPopular?: boolean;
}

const BrowseEvents = () => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [favorites, setFavorites] = useState<Set<number>>(new Set());

  const events: Event[] = [
    {
      id: 1,
      title: "Tech Innovation Summit 2026",
      date: "Fri, Feb 15",
      time: "9:00 AM PST",
      location: "San Francisco, CA",
      category: "Technology",
      imageGradient: "from-indigo-500 via-purple-500 to-pink-500",
      attendees: 234,
      price: "$99.00",
      organizer: "TechHub Global",
      isPopular: true
    },
    {
      id: 2,
      title: "Summer Music Festival",
      date: "Sat, Mar 20",
      time: "6:00 PM CST",
      location: "Austin, TX",
      category: "Music",
      imageGradient: "from-orange-400 via-rose-500 to-amber-500",
      attendees: 1200,
      price: "$149.00",
      organizer: "Live Events Co",
      isPopular: true
    },
    {
      id: 3,
      title: "Modern Art Exhibition",
      date: "Sun, Feb 28",
      time: "10:00 AM EST",
      location: "New York, NY",
      category: "Art",
      imageGradient: "from-emerald-400 to-cyan-500",
      attendees: 156,
      price: "Free",
      organizer: "Modern Gallery"
    },
    {
      id: 4,
      title: "Global Business Summit",
      date: "Thu, Mar 5",
      time: "8:00 AM CST",
      location: "Chicago, IL",
      category: "Business",
      imageGradient: "from-slate-700 to-slate-900",
      attendees: 450,
      price: "$199.00",
      organizer: "BizConnect International"
    }
  ];

  const categories = ['All', 'Technology', 'Music', 'Art', 'Business', 'Food & Drink', 'Sports & Fitness'];

  const filteredEvents = events.filter(event => {
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
      
      {/* Dynamic Background */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-50 rounded-full blur-[120px] opacity-60" />
        <div className="absolute bottom-[-5%] right-[-5%] w-[30%] h-[30%] bg-blue-50 rounded-full blur-[100px] opacity-60" />
      </div>

      <div className="relative z-10">
        {/* HERO SECTION */}
        <header className="pt-20 pb-16 md:pt-32 md:pb-24 overflow-hidden">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-700 text-xs font-bold uppercase tracking-widest mb-6 animate-fade-in">
                <FireIcon className="w-4 h-4" />
                <span>What's happening in 2026</span>
              </div>
              <h1 className="text-5xl md:text-7xl font-black mb-8 tracking-tight leading-[1.1]">
                Find your next <br />
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 to-teal-500">
                  epic adventure.
                </span>
              </h1>
              
              {/* Search Bar Refined */}
              <div className="relative group max-w-3xl">
                <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-[2rem] blur opacity-20 group-hover:opacity-30 transition duration-1000 group-hover:duration-200"></div>
                <div className="relative flex items-center bg-white border border-slate-100 rounded-[1.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.05)] p-2">
                  <div className="flex-1 flex items-center px-4">
                    <MagnifyingGlassIcon className="w-6 h-6 text-slate-400 mr-3" />
                    <input
                      type="text"
                      placeholder="Search events, cities, or organizers..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full py-4 text-lg bg-transparent border-none focus:ring-0 placeholder:text-slate-300 font-medium"
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

        {/* STICKY NAV / FILTERS */}
        <nav className="sticky top-0 z-50 bg-white/70 backdrop-blur-xl border-y border-slate-100/50">
          <div className="container mx-auto px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar scroll-smooth">
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
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-400 hover:text-slate-600'}`}
              >
                <Squares2X2Icon className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg transition-all ${viewMode === 'list' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-400 hover:text-slate-600'}`}
              >
                <ListBulletIcon className="w-5 h-5" />
              </button>
            </div>
          </div>
        </nav>

        {/* MAIN FEED */}
        <main className="container mx-auto px-6 py-12">
          <div className="flex items-end justify-between mb-12">
            <div>
              <p className="text-emerald-600 font-bold tracking-widest text-xs uppercase mb-2">Curated for you</p>
              <h2 className="text-4xl font-black tracking-tight">{selectedCategory} Events</h2>
            </div>
            <div className="flex items-center gap-4">
                <span className="text-slate-400 font-medium text-sm">{filteredEvents.length} events found</span>
                <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-all font-bold text-sm">
                    <AdjustmentsHorizontalIcon className="w-5 h-5" />
                    Filters
                </button>
            </div>
          </div>

          {viewMode === 'grid' ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-10">
              {filteredEvents.map((event) => (
                <div key={event.id} className="group relative flex flex-col bg-white rounded-[2rem] border border-slate-100 hover:border-emerald-200 transition-all duration-500 hover:-translate-y-2">
                  {/* Image Area */}
                  <div className="relative h-64 m-3 overflow-hidden rounded-[1.5rem]">
                    <div className={`absolute inset-0 bg-gradient-to-br ${event.imageGradient} group-hover:scale-110 transition-transform duration-700`} />
                    <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors" />
                    
                    <div className="absolute top-4 left-4 right-4 flex justify-between items-start">
                        {event.isPopular && (
                            <div className="px-3 py-1.5 rounded-full bg-white/90 backdrop-blur-md shadow-sm flex items-center gap-1.5">
                                <FireIcon className="w-4 h-4 text-orange-500" />
                                <span className="text-[10px] font-black uppercase tracking-tighter">Popular</span>
                            </div>
                        )}
                        <button
                          onClick={(e) => { e.stopPropagation(); toggleFavorite(event.id); }}
                          className="p-2.5 bg-white/90 backdrop-blur-md rounded-full hover:bg-white transition-all shadow-lg active:scale-90"
                        >
                          {favorites.has(event.id) ? (
                            <HeartIconSolid className="w-5 h-5 text-rose-500" />
                          ) : (
                            <HeartIcon className="w-5 h-5 text-slate-400" />
                          )}
                        </button>
                    </div>

                    <div className="absolute bottom-4 left-4">
                        <div className="px-3 py-1 rounded-lg bg-black/20 backdrop-blur-md text-white text-xs font-bold">
                            {event.category}
                        </div>
                    </div>
                  </div>

                  {/* Content Area */}
                  <div className="p-6 pt-2">
                    <div className="flex items-center gap-2 text-emerald-600 text-sm font-bold mb-3">
                      <CalendarIcon className="w-4 h-4" />
                      <span>{event.date} • {event.time}</span>
                    </div>
                    <h3 className="text-2xl font-black text-slate-900 leading-tight mb-4 group-hover:text-emerald-700 transition-colors">
                      {event.title}
                    </h3>
                    
                    <div className="space-y-3 mb-8">
                        <div className="flex items-center gap-3 text-slate-500 group/loc">
                            <div className="p-1.5 bg-slate-50 rounded-md group-hover/loc:bg-emerald-50 group-hover/loc:text-emerald-600 transition-colors">
                                <MapPinIcon className="w-4 h-4" />
                            </div>
                            <span className="text-sm font-medium">{event.location}</span>
                        </div>
                    </div>

                    <div className="flex items-center justify-between pt-5 border-t border-slate-50">
                      <div>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1">Tickets from</p>
                        <span className="text-2xl font-black text-slate-900">{event.price}</span>
                      </div>
                      <button className="flex items-center justify-center w-12 h-12 bg-slate-900 text-white rounded-2xl hover:bg-emerald-600 transition-all shadow-xl hover:shadow-emerald-200">
                        <ArrowRightIcon className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* List View Refined */
            <div className="space-y-6">
              {filteredEvents.map((event) => (
                <div key={event.id} className="group relative bg-white rounded-[2rem] border border-slate-100 p-4 hover:shadow-2xl hover:shadow-slate-200/50 transition-all duration-500">
                  <div className="flex flex-col md:flex-row gap-8">
                    <div className={`w-full md:w-64 h-48 rounded-[1.5rem] bg-gradient-to-br ${event.imageGradient} flex-shrink-0 overflow-hidden`}>
                         <div className="w-full h-full group-hover:scale-110 transition-transform duration-700 opacity-80" />
                    </div>
                    <div className="flex-1 py-2 pr-4 flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start mb-2">
                            <span className="text-emerald-600 font-black text-sm uppercase tracking-tighter">{event.date}</span>
                            <button onClick={() => toggleFavorite(event.id)}>
                                {favorites.has(event.id) ? <HeartIconSolid className="w-6 h-6 text-rose-500" /> : <HeartIcon className="w-6 h-6 text-slate-200" />}
                            </button>
                        </div>
                        <h3 className="text-3xl font-black text-slate-900 mb-4 group-hover:text-emerald-600 transition-colors leading-none">
                            {event.title}
                        </h3>
                        <div className="flex flex-wrap gap-6 items-center">
                            <div className="flex items-center gap-2 text-slate-500 font-medium">
                                <MapPinIcon className="w-5 h-5 text-slate-300" />
                                <span>{event.location}</span>
                            </div>
                            <div className="flex items-center gap-2 text-slate-500 font-medium">
                                <UsersIcon className="w-5 h-5 text-slate-300" />
                                <span>{event.attendees.toLocaleString()} attending</span>
                            </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between mt-6">
                        <span className="text-3xl font-black text-slate-900">{event.price}</span>
                        <button className="px-8 py-4 bg-slate-900 text-white rounded-2xl font-bold hover:bg-emerald-600 transition-all shadow-xl shadow-slate-200">
                            Book Tickets
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* EMPTY STATE */}
          {filteredEvents.length === 0 && (
            <div className="flex flex-col items-center justify-center py-32 bg-slate-50 rounded-[3rem] border-2 border-dashed border-slate-200 text-center">
              <div className="w-24 h-24 bg-white rounded-3xl shadow-xl flex items-center justify-center mb-8 rotate-12">
                <MagnifyingGlassIcon className="w-12 h-12 text-slate-200" />
              </div>
              <h3 className="text-3xl font-black text-slate-900 mb-2">Ghost town here...</h3>
              <p className="text-slate-500 max-w-xs font-medium">We couldn't find anything matching your filters. Try widening your search.</p>
              <button 
                onClick={() => {setSelectedCategory('All'); setSearchQuery('');}}
                className="mt-8 px-6 py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-emerald-600 transition-colors"
              >
                Clear all filters
              </button>
            </div>
          )}
        </main>

        {/* FOOTER SNIPPET */}
        <footer className="container mx-auto px-6 py-20 border-t border-slate-100 mt-20">
            <div className="flex flex-col md:flex-row justify-between items-center gap-8">
                <div className="text-2xl font-black italic tracking-tighter">
                    EVENT<span className="text-emerald-600">TRACK</span>
                </div>
                <div className="flex gap-8 text-slate-400 font-bold text-sm uppercase tracking-widest">
                    <a href="#" className="hover:text-emerald-600 transition-colors">Privacy</a>
                    <a href="#" className="hover:text-emerald-600 transition-colors">Terms</a>
                    <a href="#" className="hover:text-emerald-600 transition-colors">Contact</a>
                </div>
                <p className="text-slate-400 text-sm font-medium">© 2026 EventTrack Inc.</p>
            </div>
        </footer>
      </div>
    </div>
  );
};

export default BrowseEvents;