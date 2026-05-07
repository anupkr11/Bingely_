import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

/**
 * Global Layout Component
 * Wraps the main application routes, providing a persistent Sidebar navigation
 * and a main content area where child routes (<Outlet />) are rendered.
 */
const Layout = () => {
  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-dark-blue overflow-x-hidden">
      {/* Persistent Navigation Sidebar */}
      <Sidebar />
      {/* Main Content Area - Renders matched child routes */}
      <main className="flex-1 md:ml-32 mt-20 md:mt-0 p-4 md:p-8 md:pr-12 w-full overflow-hidden">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
