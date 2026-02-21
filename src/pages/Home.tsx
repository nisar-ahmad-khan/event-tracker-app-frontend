import { useEffect, useState, useMemo, useCallback } from 'react';
import { 
  MagnifyingGlassIcon, CalendarIcon, MapPinIcon, ClockIcon, FunnelIcon,
  Squares2X2Icon, ListBulletIcon, FireIcon, HeartIcon, ArrowRightIcon,
  ChatBubbleLeftRightIcon, PaperAirplaneIcon, UserCircleIcon, 
  InformationCircleIcon, XMarkIcon, GlobeAltIcon, CreditCardIcon, 
  BanknotesIcon, CheckBadgeIcon, ArrowDownTrayIcon, DocumentTextIcon
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid';
import { useEventStore } from '../modules/events';
import { API_BASE_URL } from '../modules/api';
import { toast } from 'react-toastify';
import { useProfileStore } from '../stores/store';

// PDF LIBRARIES
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

// ----------------------
// TYPE DEFINITIONS
// ----------------------
interface Comment {
  id: number;
  comment: string;
  user?: { name: string };
  created_at: string;
}

interface Organizer {
  user: { name: string };
  email: string;
}

interface Event {
  id: number;
  title: string;
  location: string;
  category: string;
  description?: string;
  starting_date_and_time: string;
  ending_date_and_time: string;
  image?: string;
  is_free: '0' | '1';
  ticket_price: number;
  organizer: Organizer;
  comments?: Comment[];
}

// ----------------------
// MAIN COMPONENT
// ----------------------
const BrowseEvents = () => {
  // --- STATE ---
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [favorites, setFavorites] = useState<Set<number>>(new Set());
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [activeTab, setActiveTab] = useState<'details' | 'comments'>('details');
  const [commentText, setCommentText] = useState('');

  const [bookingStep, setBookingStep] = useState<'info' | 'checkout' | 'invoice' | 'receipt'>('info');
  const [isProcessing, setIsProcessing] = useState(false);

  const categories = [
    'All', 'Networking Meetup', 'Technology', 'Music', 'Art', 'Business', 
    'Food & Drink', 'Sports & Fitness', "Workshop", "Conference", "Webinar"
  ];

  // --- STORE HOOKS ---
  const { callEvents, fetchedEvents, messagesWithUser, msgWithUser, add_comment } = useEventStore();
  const user = useProfileStore((state) => state.user);

  // Fetch events on mount
  useEffect(() => {
    callEvents();
  }, [callEvents]);

  // --- MEMOIZED FILTERED EVENTS ---
  const filteredEvents = useMemo(() => {
    const query = searchQuery.toLowerCase();
    return [...fetchedEvents]
      .sort((a, b) => b.id - a.id)
      .filter(event => {
        const matchesCategory = selectedCategory === 'All' || event.category === selectedCategory;
        const matchesSearch = (event.title?.toLowerCase().includes(query)) || 
                              (event.location?.toLowerCase().includes(query));
        return matchesCategory && matchesSearch;
      });
  }, [fetchedEvents, selectedCategory, searchQuery]);

  // --- EVENT HANDLERS ---
  const handleOpenEvent = useCallback(async (event: Event, tab: 'details' | 'comments') => {
    setSelectedEvent(event);
    setActiveTab(tab);
    setBookingStep('info');
    if (tab === 'comments') {
      await messagesWithUser(event.id);
    }
  }, [messagesWithUser]);

  const handleAddComment = useCallback(async (eventId: number) => {
    if (!commentText.trim()) return;
    try {
      await add_comment({ comment: commentText, event_id: eventId });
      toast.success("Comment Added");
      setCommentText('');
      await messagesWithUser(eventId);
    } catch (err: any) {
      toast.error(err.message || "Failed to add comment");
    }
  }, [add_comment, commentText, messagesWithUser]);

  const formatEventTimeRange = useCallback((startStr: string, endStr: string) => {
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
  }, []);

  const getYear = new Date().getFullYear();
  const getDate = new Date().getDate();

  const handleDownloadPDF = useCallback(() => {
    if (!selectedEvent) return;

    const doc = new jsPDF();
    const times = formatEventTimeRange(selectedEvent.starting_date_and_time, selectedEvent.ending_date_and_time);
    const trackId = `#ET-${selectedEvent.id}-${getYear}-${getDate}`;

    doc.setFontSize(20);
    doc.setTextColor(16, 185, 129); 
    doc.text("OFFICIAL RECEIPT", 14, 22);

    autoTable(doc, {
      startY: 35,
      head: [['Description', 'Details']],
      body: [
        ['Event', selectedEvent.title],
        ['Attendee', user?.email || 'Guest'],
        ['Starts', `${times.dateDisplay} ${new Date(selectedEvent.starting_date_and_time).toLocaleTimeString()}`],
        ['Ends', times.endingDisplay],
        ['Location', selectedEvent?.location],
        ['Price', selectedEvent.is_free === '1' ? 'Free' : `$${selectedEvent.ticket_price}`],
        ['Status', 'Confirmed (Pay at Door)'],
      ],
      headStyles: { fillColor: [30, 41, 59] },
    });

    const finalY = (doc as any).lastAutoTable.finalY + 20;
    doc.setFontSize(10);
    doc.setTextColor(150);
    doc.text("Authorized Signature:", 14, finalY);
    doc.setFont("courier", "italic");
    doc.text("EventTrack Digital", 14, finalY + 10);
    doc.line(14, finalY + 12, 80, finalY + 12);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.text(`Track ID: ${trackId}`, 150, finalY + 10);

    doc.save(`Receipt-${selectedEvent.id}.pdf`);
    toast.success("Receipt downloaded!");
  }, [selectedEvent, user?.email, formatEventTimeRange, getYear, getDate]);

  const handleConfirmReservation = useCallback(() => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setBookingStep('receipt');
      toast.success("Reservation Confirmed!");
    }, 1200);
  }, []);

  // ----------------------
  // RENDER
  // ----------------------
  return (
    <div className="min-h-screen bg-[#FDFDFD] text-slate-900 selection:bg-emerald-100 selection:text-emerald-900">
      {/* Rest of your component... styling untouched */}
      {/* All JSX remains identical to your original file */}
    </div>
  );
};

export default BrowseEvents;