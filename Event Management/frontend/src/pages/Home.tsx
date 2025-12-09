import React, { useMemo, useState } from 'react';
import Layout from '../components/Layout';
import { useEvents } from '../contexts/EventContext';
import { EventCard } from '../components/UI';
import { Search, Filter, Sparkles } from 'lucide-react';

const HOME_BG = "url('https://images.unsplash.com/photo-1503424886300-0c6e41f5b1d1?w=1600&q=80&auto=format&fit=crop')";

export const Home: React.FC = () => {
  const { events } = useEvents();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = ['All', ...Array.from(new Set(events.map(e => e.category).filter(Boolean)))];

  const filteredEvents = useMemo(() => {
    return events.filter(e => {
      const matchesSearch = e.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            (e.description || '').toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || e.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [events, searchTerm, selectedCategory]);

  const hero = (
    <div className="bg-hero hero-height" style={{ backgroundImage: HOME_BG }}>
      <div className="bg-overlay" />
      <div className="hero-content flex items-center justify-center h-full">
        <div className="page-container text-center text-white">
          <h1 className="text-4xl md:text-6xl font-extrabold mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
            Discover Events That <span className="text-blue-200">Inspire</span>
          </h1>
          <p className="text-lg md:text-xl max-w-3xl mx-auto mb-6">Join a community of learners, creators and innovators. Find your next experience today.</p>
          <div>
            <a href="#events" className="btn-accent inline-block">Browse Events</a>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <Layout hero={hero}>
      <div className="mt-6">
        <div className="bg-white rounded-lg shadow-lg p-4 mb-8 flex flex-wrap gap-2 items-center justify-center">
          <Filter size={18} className="text-gray-400 mr-2" />
          {categories.map(cat => (
            <button key={cat} onClick={() => setSelectedCategory(cat)} className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${selectedCategory === cat ? 'bg-blue-100 text-blue-700 border border-blue-200' : 'bg-gray-50 text-gray-600 hover:bg-gray-100 border border-transparent'}`}>
              {cat}
            </button>
          ))}
        </div>

        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            Upcoming Events <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded-full">{filteredEvents.length}</span>
          </h2>
          <div className="flex items-center gap-1 text-sm text-gray-500">
            <Sparkles size={14} className="text-yellow-500" />
            <span>Powered by Gemini AI Recommendations</span>
          </div>
        </div>

        {filteredEvents.length > 0 ? (
          <div id="events" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredEvents.map(event => <EventCard key={event._id || event.id} event={event} />)}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="bg-gray-100 rounded-full h-20 w-20 flex items-center justify-center mx-auto mb-4">
              <Search size={32} className="text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900">No events found</h3>
            <p className="text-gray-500">Try adjusting your search or filters.</p>
            <button onClick={() => { setSearchTerm(''); setSelectedCategory('All'); }} className="mt-4 text-blue-600 hover:text-blue-800 font-medium">Clear all filters</button>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Home;
