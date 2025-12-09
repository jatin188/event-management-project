import React, { useState } from 'react';
import Layout from '../components/Layout';
import { useEvents } from '../contexts/EventContext';
import { generateEventDetails } from '../services/gemini';
import { Button } from '../components/UI';
import { Plus, Trash2, Users, Calendar, Sparkles, X, Loader2 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

const ADMIN_BG = "url('https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=1600&q=80&auto=format&fit=crop')";

export const AdminDashboard: React.FC = () => {
  const { events, deleteEvent, addEvent } = useEvents();
  const [showModal, setShowModal] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const [formData, setFormData] = useState<any>({
    title: '',
    category: 'Technology',
    date: '',
    time: '',
    location: '',
    description: '',
    capacity: 100,
    price: 0,
    imageUrl: 'https://picsum.photos/seed/new/800/400'
  });

  const handleGenerateAI = async () => {
    if (!formData.title) return alert("Please enter a title first");
    setIsGenerating(true);
    try {
      const details = await generateEventDetails(formData.title, formData.category);
      setFormData(prev => ({ ...prev, description: details.description, schedule: details.schedule }));
    } catch (e) { console.error(e); alert("Failed to generate content"); }
    finally { setIsGenerating(false); }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || formData.title.trim().length === 0) return alert('Title is required');
    if (!formData.date) return alert('Select a date');
    const selDate = new Date(formData.date);
    if (selDate.getTime() < new Date().setHours(0,0,0,0)) return alert('Event date cannot be in the past');
    const normalized = { ...formData, capacity: Number(formData.capacity) || 0, price: Number(formData.price) || 0, imageUrl: formData.imageUrl || `https://picsum.photos/seed/${Math.random()}/800/400` };
    try { addEvent(normalized); } catch (err: any) { return alert(err.message || 'Failed to add event'); }
    setShowModal(false);
    setFormData({ title:'', category:'Technology', date:'', time:'', location:'', description:'', capacity:100, price:0, imageUrl:`https://picsum.photos/seed/${Math.random()}/800/400` });
  };

  const chartData = events.map(e => ({ name: (e.title || '').substring(0,10) + '...', registered: e.registeredCount || 0, capacity: e.capacity || 0 }));
  const totalRegistrations = events.reduce((acc, curr) => acc + (curr.registeredCount || 0), 0);

  const hero = (
    <div className="bg-hero" style={{ backgroundImage: ADMIN_BG, height: '24vh' }}>
      <div className="bg-overlay" />
      <div className="hero-content flex items-center h-full">
        <div className="page-container">
          <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
          <p className="text-white/90">Manage events and view performance metrics</p>
        </div>
      </div>
    </div>
  );

  return (
    <Layout hero={hero}>
      {/* content same as earlier AdminDashboard code, using events */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
              <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-gray-500">Manage events and view performance metrics</p>
          </div>
          <Button onClick={() => setShowModal(true)} className="flex items-center gap-2">
              <Plus size={18} /> Create Event
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 card-glass">
              <div className="flex items-center gap-4">
                  <div className="p-3 bg-blue-100 text-blue-600 rounded-lg">
                      <Calendar size={24} />
                  </div>
                  <div>
                      <p className="text-sm text-gray-500">Total Events</p>
                      <p className="text-2xl font-bold">{events.length}</p>
                  </div>
              </div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 card-glass">
              <div className="flex items-center gap-4">
                  <div className="p-3 bg-green-100 text-green-600 rounded-lg">
                      <Users size={24} />
                  </div>
                  <div>
                      <p className="text-sm text-gray-500">Total Registrations</p>
                      <p className="text-2xl font-bold">{totalRegistrations}</p>
                  </div>
              </div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 card-glass">
               <div className="flex items-center gap-4">
                  <div className="p-3 bg-purple-100 text-purple-600 rounded-lg">
                      <Sparkles size={24} />
                  </div>
                  <div>
                      <p className="text-sm text-gray-500">AI Generations</p>
                      <p className="text-2xl font-bold">Active</p>
                  </div>
              </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-6 border-b border-gray-100">
                  <h2 className="text-lg font-bold text-gray-900">Active Events</h2>
              </div>
              <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                      <thead className="bg-gray-50 text-gray-600 uppercase">
                          <tr>
                              <th className="px-6 py-4 font-medium">Event</th>
                              <th className="px-6 py-4 font-medium">Date</th>
                              <th className="px-6 py-4 font-medium">Status</th>
                              <th className="px-6 py-4 font-medium">Actions</th>
                          </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                          {events.map(event => (
                              <tr key={event._id || event.id} className="hover:bg-gray-50 transition-colors">
                                  <td className="px-6 py-4">
                                      <div className="font-medium text-gray-900">{event.title}</div>
                                      <div className="text-xs text-gray-500">{event.location}</div>
                                  </td>
                                  <td className="px-6 py-4 text-gray-600">{event.date ? new Date(event.date).toLocaleDateString() : 'TBA'}</td>
                                  <td className="px-6 py-4">
                                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                          {(event.registeredCount||0)}/{event.capacity || 0} Filled
                                      </span>
                                  </td>
                                  <td className="px-6 py-4">
                                      <button onClick={() => { if(confirm('Delete event?')) deleteEvent(event._id || event.id) }} className="text-red-500 hover:text-red-700 p-2 hover:bg-red-50 rounded-full transition-colors">
                                          <Trash2 size={18} />
                                      </button>
                                  </td>
                              </tr>
                          ))}
                          {events.length === 0 && (<tr><td colSpan={4} className="px-6 py-8 text-center text-gray-500">No events found. Create one to get started.</td></tr>)}
                      </tbody>
                  </table>
              </div>
          </div>

          <div className="lg:col-span-1 bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col">
              <h2 className="text-lg font-bold text-gray-900 mb-6">Registration Overview</h2>
              <div className="flex-1 min-h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={chartData}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                          <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
                          <YAxis fontSize={12} tickLine={false} axisLine={false} />
                          <Tooltip cursor={{fill: '#f9fafb'}} contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                          <Bar dataKey="registered" fill="#3b82f6" radius={[4,4,0,0]} />
                      </BarChart>
                  </ResponsiveContainer>
              </div>
          </div>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50 rounded-t-2xl">
                    <h2 className="text-xl font-bold text-gray-900">Create New Event</h2>
                    <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600"><X size={24} /></button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Event Title</label>
                            <input required type="text" className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} placeholder="e.g. Annual Tech Conference" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                            <select className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}>
                                <option>Technology</option>
                                <option>Music</option>
                                <option>Business</option>
                                <option>Social</option>
                                <option>Education</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                            <input required type="text" className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none" value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} placeholder="Venue or Online" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                            <input required type="date" className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
                            <input required type="time" className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none" value={formData.time} onChange={e => setFormData({...formData, time: e.target.value})} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Capacity</label>
                            <input required type="number" className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none" value={formData.capacity} onChange={e => setFormData({...formData, capacity: parseInt(e.target.value)})} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Price ($)</label>
                            <input required type="number" className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none" value={formData.price} onChange={e => setFormData({...formData, price: parseInt(e.target.value)})} />
                        </div>

                        <div className="col-span-2">
                             <div className="flex justify-between items-center mb-1">
                                <label className="block text-sm font-medium text-gray-700">Description</label>
                                <button type="button" onClick={handleGenerateAI} disabled={isGenerating} className="text-xs flex items-center gap-1 text-purple-600 font-semibold hover:text-purple-700 disabled:opacity-50">
                                    {isGenerating ? <Loader2 className="animate-spin" size={12} /> : <Sparkles size={12} />}
                                    AI Generate
                                </button>
                             </div>
                            <textarea required className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none h-32" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} placeholder="Enter event details or use AI to generate..."></textarea>
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                        <Button type="button" variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
                        <Button type="submit">Create Event</Button>
                    </div>
                </form>
            </div>
        </div>
      )}
    </Layout>
  );
};

export default AdminDashboard;
