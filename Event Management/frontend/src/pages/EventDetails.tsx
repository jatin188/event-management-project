import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { useEvents } from '../contexts/EventContext';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/UI';
import { Calendar, Clock, MapPin, Share2, AlertCircle, CheckCircle, Info } from 'lucide-react';
import { UserRole } from '../types';

export const EventDetails: React.FC = () => {
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();
  const { getEventById, registerForEvent, getUserRegistrations } = useEvents();
  const { user } = useAuth();
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const event = getEventById(id || '');

  if (!event) {
    return <Layout><div className="p-20 text-center text-gray-500">Event not found.</div></Layout>;
  }

  const isRegistered = user ? getUserRegistrations(user.id).some((r:any) => r.eventId === (event._id || event.id)) : false;
  const isFull = event.registeredCount >= (event.capacity || 0);

  const handleRegister = async () => {
    if (!user) { navigate('/login'); return; }
    if (user.role === UserRole.ADMIN) { setErrorMsg("Admins cannot register for events."); return; }
    try {
      const success = await registerForEvent(event._id || event.id);
      if (success && success.ok) {
        setSuccessMsg("Registration successful! You can view your ticket in the dashboard.");
        setErrorMsg('');
      } else {
        setErrorMsg(success?.message || "Registration failed. You might already be registered or the event is full.");
      }
    } catch (e:any) {
      setErrorMsg(e?.response?.data?.message || 'Registration failed');
    }
  };

  const heroStyle = { backgroundImage: `url(${event.imageUrl || 'https://images.unsplash.com/photo-1515165562835-c1b68be5d3a6?w=1600&q=80&auto=format&fit=crop'})` };

  return (
    <Layout hero={<div className="bg-hero" style={{ ...heroStyle, height: '44vh' }}><div className="bg-overlay" /><div className="hero-content p-8"><div className="page-container text-white"><h1 className="text-4xl font-bold">{event.title}</h1></div></div></div>}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-8">
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">About the Event</h2>
            <p className="text-gray-600 text-lg leading-relaxed whitespace-pre-wrap">{event.description}</p>
          </section>

          {event.schedule && event.schedule.length > 0 && (
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Agenda</h2>
              <div className="space-y-4">
                {event.schedule.map((item:any, idx:number) => (
                  <div key={idx} className="flex gap-4 p-4 bg-gray-50 rounded-lg border border-gray-100 hover:border-blue-200 transition-colors">
                    <div className="w-24 flex-shrink-0 font-bold text-blue-600">{item.time}</div>
                    <div className="text-gray-700">{item.activity}</div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 sticky top-24">
            <div className="flex justify-between items-center mb-6">
              <span className="text-gray-500">Price per ticket</span>
              <span className="text-3xl font-bold text-gray-900">{event.price === 0 ? 'Free' : `$${event.price}`}</span>
            </div>

            <div className="space-y-4 mb-6">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Capacity</span>
                <span className="font-medium text-gray-900">{event.capacity} seats</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Remaining</span>
                <span className={`font-medium ${isFull ? 'text-red-600' : 'text-green-600'}`}>
                  {Math.max(0, (event.capacity || 0) - (event.registeredCount || 0))} spots left
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-blue-600 h-2 rounded-full transition-all duration-500" style={{ width: `${Math.min(100, ((event.registeredCount || 0) / (event.capacity || 1)) * 100)}%` }} />
              </div>
            </div>

            {successMsg && <div className="mb-4 p-3 bg-green-50 text-green-700 text-sm rounded-lg flex items-start gap-2"><CheckCircle size={16} className="mt-0.5" />{successMsg}</div>}
            {errorMsg && <div className="mb-4 p-3 bg-red-50 text-red-700 text-sm rounded-lg flex items-start gap-2"><AlertCircle size={16} className="mt-0.5" />{errorMsg}</div>}

            {isRegistered ? (
              <Button disabled className="w-full bg-green-600 hover:bg-green-700 text-white cursor-default">You are registered</Button>
            ) : (
              <Button onClick={handleRegister} disabled={isFull} className={`w-full py-4 text-lg ${isFull ? 'bg-gray-300' : ''}`}>{isFull ? 'Event Full' : 'Register Now'}</Button>
            )}

            <p className="text-xs text-gray-400 text-center mt-4 flex items-center justify-center gap-1"><Info size={12} /> Secure transaction processed via MockPay</p>

            <div className="mt-6 pt-6 border-t border-gray-100 flex justify-center">
              <button className="text-blue-600 flex items-center gap-2 text-sm font-medium hover:underline">
                <Share2 size={16} /> Share Event
              </button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default EventDetails;
