import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
const API = import.meta.env.VITE_API_URL || 'http://localhost:4000';
const EventContext = createContext<any>(null);

export const EventProvider: React.FC<{children:any}> = ({children}) => {
  const [events, setEvents] = useState<any[]>([]);
  const [registrations, setRegistrations] = useState<any[]>([]);

  const load = async (page=1, limit=20, q='') => {
    const res = await axios.get(`${API}/api/events`, { params: { page, limit, q }});
    setEvents(res.data.events || res.data);
  };

  useEffect(() => { load(); }, []);

  const addEvent = async (payload:any) => {
    const res = await axios.post(`${API}/api/events`, payload);
    setEvents(prev => [res.data, ...prev]);
  };

  const deleteEvent = async (id:string) => {
    await axios.delete(`${API}/api/events/${id}`).catch(()=>{});
    setEvents(prev => prev.filter(e => e._id !== id && e.id !== id));
  };

  const registerForEvent = async (eventId:string) => {
    const res = await axios.post(`${API}/api/events/${eventId}/register`);
    return res.data;
  };

  const getEventById = (id:string) => events.find(e => e._id === id || e.id === id);

  const getUserRegistrations = (userId:string) => registrations.filter(r => r.userId === userId && r.status === 'confirmed');

  return <EventContext.Provider value={{ events, registrations, load, addEvent, deleteEvent, registerForEvent, getEventById, getUserRegistrations }}>{children}</EventContext.Provider>;
};

export const useEvents = () => useContext(EventContext);
