import React from 'react';
import { Event } from '../types';
import { MapPin, Calendar, Clock, Users } from 'lucide-react';
import { Link } from 'react-router-dom';

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary'|'secondary'|'danger'|'outline'
};

export const Button: React.FC<ButtonProps> = ({ children, variant='primary', className='', ...props }) => {
  const base = "px-4 py-2 rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";
  const variants: Record<string,string> = {
    primary: "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500 shadow-md hover:shadow-lg",
    secondary: "bg-gray-100 text-gray-700 hover:bg-gray-200 focus:ring-gray-500",
    danger: "bg-red-50 text-red-600 hover:bg-red-100 focus:ring-red-500",
    outline: "border border-gray-300 text-gray-700 hover:bg-gray-50 focus:ring-gray-400"
  };
  const cls = `${base} ${(variants as any)[variant] || variants.primary} ${className}`;
  return <button className={cls} {...props}>{children}</button>;
};

export const EventCard: React.FC<{ event: Event }> = ({ event }) => {
  const safeTitle = event.title ?? 'Untitled Event';
  const safeImage = event.imageUrl || `/fallback-event.png`;
  const safeDate = event.date ? new Date(event.date) : null;
  const formattedDate = safeDate ? safeDate.toLocaleDateString(undefined, { weekday:'long', month:'short', day:'numeric' }) : 'TBA';

  return (
    <div className="bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden flex flex-col h-full group">
      <div className="relative h-48 overflow-hidden">
        <img src={safeImage} alt={safeTitle} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" onError={(e)=>{ (e.currentTarget as HTMLImageElement).src='/fallback-event.png'; }} />
        <div className="absolute top-4 left-4">
          <span className="bg-white/90 text-blue-700 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide shadow-sm">
            {event.category ?? 'General'}
          </span>
        </div>
      </div>

      <div className="p-5 flex-1 flex flex-col">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-xl font-bold text-gray-900 leading-tight group-hover:text-blue-600 transition-colors line-clamp-2">{safeTitle}</h3>
        </div>

        <p className="text-gray-500 text-sm mb-4 line-clamp-2 flex-1">{event.description ?? ''}</p>

        <div className="space-y-2 text-sm text-gray-600 mb-4">
          <div className="flex items-center gap-2">
            <Calendar size={16} className="text-blue-500" />
            <span>{formattedDate}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock size={16} className="text-blue-500" />
            <span>{event.time ?? 'TBA'}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin size={16} className="text-blue-500" />
            <span className="truncate">{event.location ?? 'Online / TBA'}</span>
          </div>
        </div>

        <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-1 text-sm text-gray-500">
            <Users size={16} />
            <span>{event.registeredCount ?? 0}/{event.capacity ?? 0}</span>
          </div>
          <span className="font-bold text-lg text-gray-900">{event.price === 0 ? 'Free' : `$${event.price ?? '—'}`}</span>
        </div>

        <Link to={`/event/${event._id || event.id}`} className="mt-4 block w-full text-center bg-gray-50 hover:bg-blue-50 text-blue-600 font-medium py-2 rounded-lg border border-blue-100 transition-colors">
          View Details
        </Link>
      </div>
    </div>
  );
};
