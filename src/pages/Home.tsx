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
  HeartIcon
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
      imageGradient: "from-blue-500 to-purple-600",
      attendees: 234,
      price: "From $99.00",
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
      imageGradient: "from-pink-500 to-rose-600",
      attendees: 1200,
      price: "From $149.00",
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
      imageGradient: "from-amber-500 to-orange-600",
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
      imageGradient: "from-emerald-500 to-teal-600",
      attendees: 450,
      price: "From $199.00",
      organizer: "BizConnect International"
    },
    {
      id: 5,
      title: "Wine & Culinary Experience",
      date: "Sat, Feb 22",
      time: "7:00 PM PST",
      location: "Napa Valley, CA",
      category: "Food & Drink",
      imageGradient: "from-red-500 to-pink-600",
      attendees: 89,
      price: "From $75.00",
      organizer: "Culinary Events"
    },
    {
      id: 6,
      title: "City Marathon 2026",
      date: "Sun, Apr 10",
      time: "6:00 AM EST",
      location: "Boston, MA",
      category: "Sports & Fitness",
      imageGradient: "from-cyan-500 to-blue-600",
      attendees: 3500,
      price: "From $50.00",
      organizer: "City Athletics"
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
    <div className="relative min-h-screen bg-gray-50 font-sans">
      {/* Background Layer: Replaced Three.js with a subtle CSS radial gradient */}
      <div className="fixed inset-0 z-0 bg-[radial-gradient(circle_at_50%_0%,rgba(16,185,129,0.08),transparent_50%)] pointer-events-none" />

      <div className="relative z-10">
        {/* Hero Section */}
        <header className="bg-gradient-to-br from-green-600 to-emerald-800 text-white shadow-inner">
          <div className="container mx-auto px-6 py-16 md:py-24">
            <h1 className="text-4xl md:text-6xl font-extrabold mb-6 tracking-tight">
              Discover your next <span className="text-emerald-300">experience</span>
            </h1>
            <p className="text-lg md:text-xl text-emerald-50 mb-10 max-w-2xl leading-relaxed">
              Find events that match your interests, connect with your community, and create unforgettable memories in 2026.
            </p>

            <div className="max-w-4xl bg-white rounded-2xl shadow-2xl p-2 flex flex-col md:flex-row gap-2">
              <div className="flex-1 relative">
                <MagnifyingGlassIcon className="w-6 h-6 text-gray-400 absolute left-4 top-1/2 transform -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search by title, city, or keyword..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 text-gray-900 placeholder-gray-400 focus:outline-none rounded-xl"
                />
              </div>
              <button className="px-10 py-4 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-all font-bold shadow-lg hover:shadow-emerald-900/20 active:scale-95">
                Find Events
              </button>
            </div>
          </div>
        </header>

        {/* Filter Toolbar */}
        <nav className="bg-white/90 backdrop-blur-md border-b border-gray-200 sticky top-0 z-40">
          <div className="container mx-auto px-6 py-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 no-scrollbar">
              <FunnelIcon className="w-5 h-5 text-gray-400 mr-2" />
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-5 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-all ${
                    selectedCategory === category
                      ? 'bg-emerald-600 text-white shadow-md'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-3 border-l border-gray-200 pl-4">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg transition-colors ${viewMode === 'grid' ? 'bg-emerald-50 text-emerald-600' : 'text-gray-400 hover:bg-gray-100'}`}
              >
                <Squares2X2Icon className="w-6 h-6" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg transition-colors ${viewMode === 'list' ? 'bg-emerald-50 text-emerald-600' : 'text-gray-400 hover:bg-gray-100'}`}
              >
                <ListBulletIcon className="w-6 h-6" />
              </button>
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <main className="container mx-auto px-6 py-10">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">{selectedCategory} Events</h2>
              <p className="text-gray-500 mt-1">Showing {filteredEvents.length} results</p>
            </div>
            <button className="hidden md:flex items-center gap-2 px-5 py-2.5 border border-gray-300 rounded-xl hover:bg-gray-50 font-semibold text-gray-700 transition-all">
              <AdjustmentsHorizontalIcon className="w-5 h-5" />
              <span>Refine Search</span>
            </button>
          </div>

          {viewMode === 'grid' ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredEvents.map((event) => (
                <div key={event.id} className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all border border-gray-100 group">
                  <div className={`bg-gradient-to-br ${event.imageGradient} h-52 relative overflow-hidden`}>
                    <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors" />
                    {event.isPopular && (
                      <div className="absolute top-4 left-4 flex items-center gap-1.5 bg-white/95 px-3 py-1.5 rounded-full shadow-sm">
                        <FireIcon className="w-4 h-4 text-orange-500" />
                        <span className="text-xs font-bold text-gray-900 uppercase tracking-wider">Trending</span>
                      </div>
                    )}
                    <button
                      onClick={(e) => { e.stopPropagation(); toggleFavorite(event.id); }}
                      className="absolute top-4 right-4 p-2.5 bg-white/95 rounded-full hover:scale-110 transition-all shadow-sm"
                    >
                      {favorites.has(event.id) ? (
                        <HeartIconSolid className="w-5 h-5 text-red-500" />
                      ) : (
                        <HeartIcon className="w-5 h-5 text-gray-400" />
                      )}
                    </button>
                  </div>

                  <div className="p-6">
                    <div className="flex items-center gap-2 text-sm text-emerald-600 font-bold mb-3">
                      <CalendarIcon className="w-4 h-4" />
                      {event.date}
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-emerald-600 transition-colors line-clamp-1">
                      {event.title}
                    </h3>
                    <div className="space-y-2.5 mb-6">
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <ClockIcon className="w-4 h-4" />
                        <span>{event.time}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <MapPinIcon className="w-4 h-4" />
                        <span>{event.location}</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between pt-5 border-t border-gray-100">
                      <span className="text-xl font-extrabold text-gray-900">{event.price}</span>
                      <div className="flex items-center gap-1 text-xs font-bold text-gray-400 uppercase">
                        <UsersIcon className="w-4 h-4" />
                        <span>{event.attendees.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-6">
              {filteredEvents.map((event) => (
                <div key={event.id} className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-all border border-gray-200 group">
                  <div className="flex flex-col md:flex-row">
                    <div className={`bg-gradient-to-br ${event.imageGradient} w-full md:w-72 h-48 md:h-auto relative flex-shrink-0`}>
                      {event.isPopular && (
                        <div className="absolute top-4 left-4 flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-full shadow-sm">
                          <FireIcon className="w-4 h-4 text-orange-500" />
                          <span className="text-xs font-bold">Trending</span>
                        </div>
                      )}
                    </div>
                    <div className="flex-1 p-8 flex flex-col justify-between">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <p className="text-emerald-600 font-bold text-sm mb-1">{event.date} • {event.time}</p>
                          <h3 className="text-2xl font-bold text-gray-900 group-hover:text-emerald-600 transition-colors">
                            {event.title}
                          </h3>
                        </div>
                        <button
                          onClick={(e) => { e.stopPropagation(); toggleFavorite(event.id); }}
                          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                        >
                          {favorites.has(event.id) ? (
                            <HeartIconSolid className="w-7 h-7 text-red-500" />
                          ) : (
                            <HeartIcon className="w-7 h-7 text-gray-300" />
                          )}
                        </button>
                      </div>
                      
                      <div className="flex flex-wrap items-center gap-6 text-gray-500 mb-6">
                        <div className="flex items-center gap-2">
                          <MapPinIcon className="w-5 h-5 text-emerald-500" />
                          <span className="text-sm font-medium">{event.location}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <TagIcon className="w-5 h-5 text-emerald-500" />
                          <span className="text-sm font-medium">{event.category}</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-6 border-t border-gray-100">
                        <span className="text-2xl font-black text-gray-900">{event.price}</span>
                        <button className="px-8 py-3 bg-gray-900 text-white rounded-xl hover:bg-emerald-600 transition-all font-bold shadow-lg active:scale-95">
                          View Details
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Empty State */}
          {filteredEvents.length === 0 && (
            <div className="text-center py-32 bg-white rounded-3xl border-2 border-dashed border-gray-200">
              <div className="bg-gray-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <MagnifyingGlassIcon className="w-10 h-10 text-gray-300" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">No events match your search</h3>
              <p className="text-gray-500 max-w-sm mx-auto">Try changing your filters or searching for something broader.</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default BrowseEvents;