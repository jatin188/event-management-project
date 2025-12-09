import React from 'react';
import { Link } from 'react-router-dom';

export const Layout: React.FC<{ children: React.ReactNode; hero?: React.ReactNode; pageBgClass?: string }> = ({ children, hero, pageBgClass }) => {
  return (
    <div className={`min-h-screen flex flex-col ${pageBgClass || ''}`}>
      <header className="w-full py-4">
        <div className="page-container flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-blue-600 to-indigo-600 text-white rounded-full w-10 h-10 flex items-center justify-center font-bold">EH</div>
            <div>
              <div className="text-lg font-semibold">EventHorizon</div>
              <div className="text-xs text-gray-400 -mt-0.5">Discover · Register · Experience</div>
            </div>
          </Link>

          <nav className="flex items-center gap-4">
            <Link to="/" className="text-sm text-gray-700 hover:text-blue-600">Home</Link>
            <Link to="/admin" className="text-sm text-gray-700 hover:text-blue-600">Admin</Link>
            <Link to="/dashboard" className="text-sm text-gray-700 hover:text-blue-600">My Tickets</Link>
            <Link to="/login" className="text-sm text-gray-700 hover:text-blue-600">Login</Link>
          </nav>
        </div>
      </header>

      {hero ? <div className="w-full">{hero}</div> : null}

      <main className="flex-1 pt-8 pb-12">
        <div className="page-container">{children}</div>
      </main>

      <footer className="py-6 bg-gradient-to-t from-white via-white/60 to-transparent">
        <div className="page-container text-sm text-gray-500">© {new Date().getFullYear()} EventHorizon • Demo</div>
      </footer>
    </div>
  );
};

export default Layout;
