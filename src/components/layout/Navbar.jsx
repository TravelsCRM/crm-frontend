import { Bell, Search, Menu } from 'lucide-react';

export default function Navbar({ onMenuClick, sidebarOpen }) {
  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6">
      <div className="flex items-center flex-1">
        <button 
          onClick={onMenuClick}
          className={`text-gray-500 hover:text-gray-700 mr-4 focus:outline-none ${
            sidebarOpen ? 'lg:hidden' : 'block'
          }`}
        >
          <Menu className="h-6 w-6" />
        </button>

        <div className="max-w-md w-full relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-gray-50 placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:border-primary-500 focus:ring-1 focus:ring-primary-500 sm:text-sm"
            placeholder="Global search..."
          />
        </div>
      </div>
      <div className="flex items-center space-x-4">
        <button className="relative p-2 text-gray-400 hover:text-gray-500 focus:outline-none">
          <span className="absolute top-1.5 right-1.5 block h-2 w-2 rounded-full bg-red-400 ring-2 ring-white" />
          <Bell className="h-6 w-6" />
        </button>
      </div>
    </header>
  );
}