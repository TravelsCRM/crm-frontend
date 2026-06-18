import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

export default function MainLayout() {
  // On screens >= 1024px (desktop), default sidebar to open (true).
  // On screens < 1024px (mobile), default sidebar to collapsed (false).
  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth >= 1024);

  return (
    <div className="flex h-screen overflow-hidden bg-gray-100 relative">
      {/* Backdrop overlay on mobile */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-gray-600/50 backdrop-blur-[2px] lg:hidden transition-opacity duration-300"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      
      <div className={`flex-1 flex flex-col overflow-hidden transition-all duration-300 ease-in-out ${
        sidebarOpen ? 'lg:pl-64' : 'lg:pl-0'
      }`}>
        <Navbar onMenuClick={() => setSidebarOpen(!sidebarOpen)} sidebarOpen={sidebarOpen} />
        <main className="flex-1 overflow-y-auto bg-gray-100 p-4 sm:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}