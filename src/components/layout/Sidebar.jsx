import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  Briefcase, 
  Map, 
  FileText, 
  Settings,
  Mail,
  Calendar,
  DollarSign,
  LogOut,
  Compass,
  X,
  ChevronDown,
  ChevronRight
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const navItems = [
  { name: 'Dashboard', path: '/', icon: LayoutDashboard },
  { name: 'Queries', path: '/queries', icon: FileText },
  { 
    name: 'Customers', 
    icon: Users,
    children: [
      { name: 'Clients', path: '/clients' },
      { name: 'Agents', path: '/agents' },
      { name: 'Corporates', path: '/corporates' },
    ]
  },
  { name: 'Itineraries', path: '/itineraries', icon: Map },
  { name: 'Bookings', path: '/bookings', icon: Calendar },
  { name: 'Payments', path: '/accounts/payments', icon: DollarSign },
  { 
    name: 'Masters', 
    icon: Compass,
    children: [
      { name: 'Suppliers', path: '/masters/suppliers' },
      { name: 'Hotels', path: '/masters/hotels' },
      { name: 'Destinations', path: '/masters/destinations' },
      { name: 'Activities', path: '/masters/activities' },
    ]
  },
  { name: 'Emails', path: '/emails', icon: Mail },
  { name: 'Settings', path: '/settings', icon: Settings },
];

export default function Sidebar({ sidebarOpen, setSidebarOpen }) {
  const location = useLocation();
  const { user, logout } = useAuth();
  const [openDropdowns, setOpenDropdowns] = useState({});

  // Auto-expand dropdown if any child route is active
  useEffect(() => {
    const activeDropdown = navItems.find(item => 
      item.children && item.children.some(child => 
        location.pathname === child.path || (child.path !== '/' && location.pathname.startsWith(child.path))
      )
    );
    if (activeDropdown) {
      setOpenDropdowns(prev => ({
        ...prev,
        [activeDropdown.name]: true
      }));
    }
  }, [location.pathname]);

  const toggleDropdown = (name) => {
    setOpenDropdowns(prev => ({
      ...prev,
      [name]: !prev[name]
    }));
  };

  return (
    <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 flex flex-col h-screen transform transition-transform duration-300 ease-in-out ${
      sidebarOpen ? 'translate-x-0' : '-translate-x-full'
    }`}>
      <div className="h-16 flex items-center justify-between px-6 border-b border-gray-200">
        <h1 className="text-xl font-bold text-primary-600">Travel CRM</h1>
        <button 
          onClick={() => setSidebarOpen(false)}
          className="p-1.5 rounded-md text-gray-500 hover:bg-gray-100 hover:text-gray-700 focus:outline-none"
        >
          <X className="h-5 w-5" />
        </button>
      </div>
      <nav className="flex-1 overflow-y-auto py-4">
        <ul className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            
            // Check if standard nav item is active
            const isStandardActive = !item.children && (
              location.pathname === item.path || 
              (item.path !== '/' && location.pathname.startsWith(item.path))
            );

            // Check if any child route of this dropdown is active
            const isParentActive = item.children && item.children.some(child => 
              location.pathname === child.path || 
              (child.path !== '/' && location.pathname.startsWith(child.path))
            );

            const isDropdownOpen = !!openDropdowns[item.name];

            if (item.children) {
              return (
                <li key={item.name} className="space-y-1">
                  <button
                    onClick={() => toggleDropdown(item.name)}
                    className={`w-full flex items-center justify-between px-6 py-2.5 text-sm font-medium transition-colors focus:outline-none ${
                      isParentActive 
                        ? 'text-primary-700 font-semibold' 
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    <div className="flex items-center">
                      <Icon className={`h-5 w-5 mr-3 ${isParentActive ? 'text-primary-600' : 'text-gray-400'}`} />
                      <span>{item.name}</span>
                    </div>
                    {isDropdownOpen ? (
                      <ChevronDown className={`h-4 w-4 ${isParentActive ? 'text-primary-600' : 'text-gray-400'}`} />
                    ) : (
                      <ChevronRight className={`h-4 w-4 ${isParentActive ? 'text-primary-600' : 'text-gray-400'}`} />
                    )}
                  </button>
                  {isDropdownOpen && (
                    <ul className="pl-4 border-l border-gray-200 ml-8 space-y-1 py-0.5">
                      {item.children.map((child) => {
                        const isChildActive = location.pathname === child.path || 
                          (child.path !== '/' && location.pathname.startsWith(child.path));
                        return (
                          <li key={child.name}>
                            <Link
                              to={child.path}
                              onClick={() => setSidebarOpen(false)}
                              className={`block py-1.5 px-3 text-sm rounded-md transition-all ${
                                isChildActive
                                  ? 'bg-primary-50 text-primary-700 font-semibold'
                                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                              }`}
                            >
                              {child.name}
                            </Link>
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </li>
              );
            }

            return (
              <li key={item.name}>
                <Link
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center px-6 py-2.5 text-sm font-medium transition-colors ${
                    isStandardActive 
                      ? 'bg-primary-50 text-primary-700 border-r-4 border-primary-600' 
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <Icon className={`h-5 w-5 mr-3 ${isStandardActive ? 'text-primary-600' : 'text-gray-400'}`} />
                  {item.name}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center overflow-hidden">
            <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-bold uppercase flex-shrink-0">
              {user?.name?.substring(0, 2) || 'U'}
            </div>
            <div className="ml-3 overflow-hidden">
              <p className="text-sm font-medium text-gray-700 truncate">{user?.name}</p>
              <p className="text-xs text-gray-500 truncate">{user?.role?.name}</p>
            </div>
          </div>
          <button 
            onClick={logout}
            className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
            title="Logout"
          >
            <LogOut className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
}