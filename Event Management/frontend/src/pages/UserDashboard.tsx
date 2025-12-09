import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useEvents } from '../contexts/EventContext';
import { Button } from '../components/UI';
import { MapPin, Calendar, Clock, QrCode, Download } from 'lucide-react';
import Layout from '../components/Layout';

export const UserDashboard: React.FC = () => {
  const { user } = useAuth();
  const { getUserRegistrations, getEventById, cancelRegistration } = useEvents();

  if (!user) return <Layout><div>Access Denied</div></Layout>;

  const myRegistrations = getUserRegistrations(user.id);

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-gray-900">My Tickets</h1>
          <p className="text-gray-500 mt-2">Manage your upcoming events and download tickets</p>
        </div>

        {myRegistrations.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-300">
              <h3 className="text-xl font-medium text-gray-900 mb-2">No tickets yet</h3>
              <p className="text-gray-500 mb-6">You haven't registered for any events.</p>
              <a href="#/" className="text-blue-600 font-medium hover:underline">Browse Events</a>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {myRegistrations.map((reg:any) => {
                  const event = getEventById(reg.eventId);
                  if (!event) return null;

                  return (
                      <div key={reg.id} className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden flex flex-col sm:flex-row h-auto sm:h-64">
                          <div className="flex-1 p-6 flex flex-col justify-between relative">
                              <div>
                                  <span className="inline-block px-2 py-1 bg-blue-50 text-blue-700 text-xs font-bold uppercase rounded mb-3">{event.category}</span>
                                  <h3 className="text-xl font-bold text-gray-900 line-clamp-2 mb-2">{event.title}</h3>
                                  <div className="space-y-1 text-sm text-gray-600">
                                      <div className="flex items-center gap-2"><Calendar size={14} /><span>{new Date(event.date).toLocaleDateString()}</span></div>
                                      <div className="flex items-center gap-2"><Clock size={14} /><span>{event.time}</span></div>
                                      <div className="flex items-center gap-2"><MapPin size={14} /><span className="truncate max-w-[200px]">{event.location}</span></div>
                                  </div>
                              </div>

                              <div className="flex gap-3 mt-4">
                                  <Button variant="secondary" onClick={() => cancelRegistration(reg.id)} className="text-xs py-1 px-3">Cancel</Button>
                                  <a href={`/api/tickets/${reg.id}/pdf`} className="text-xs py-1 px-3 inline-flex items-center gap-1 border border-gray-200 rounded">
                                    <Download size={12} /> PDF
                                  </a>
                              </div>
                          </div>

                          <div className="w-full sm:w-48 bg-gray-50 border-t sm:border-t-0 sm:border-l border-gray-200 p-6 flex flex-col items-center justify-center text-center border-dashed relative">
                              <div className="bg-white p-2 rounded-lg shadow-sm mb-3">
                                  <QrCode size={80} className="text-gray-800" />
                              </div>
                              <p className="text-xs text-gray-400 font-mono break-all">{reg.ticketId}</p>
                              <p className="text-xs font-bold text-green-600 mt-2 uppercase tracking-wide">Confirmed</p>
                          </div>
                      </div>
                  );
              })}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default UserDashboard;
