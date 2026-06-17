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
  Hotel,
  MapPin,
  Compass,
  X
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const navItems = [
  { name: 'Dashboard', path: '/', icon: LayoutDashboard },
  { name: 'Queries', path: '/queries', icon: FileText },
  { name: 'Clients', path: '/clients', icon: Users },
  { name: 'Agents', path: '/agents', icon: Briefcase },
  { name: 'Corporates', path: '/corporates', icon: Briefcase },
  { name: 'Itineraries', path: '/itineraries', icon: Map },
  { name: 'Bookings', path: '/bookings', icon: Calendar },
  { name: 'Payments', path: '/accounts/payments', icon: DollarSign },
  { name: 'Suppliers', path: '/masters/suppliers', icon: Briefcase },
  { name: 'Hotels', path: '/masters/hotels', icon: Hotel },
  { name: 'Destinations', path: '/masters/destinations', icon: MapPin },
  { name: 'Activities', path: '/masters/activities', icon: Compass },
  { name: 'Emails', path: '/emails', icon: Mail },
  { name: 'Settings', path: '/settings', icon: Settings },
];

export default function Sidebar({ sidebarOpen, setSidebarOpen }) {
  const location = useLocation();
  const { user, logout } = useAuth();

  return (
    <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 flex flex-col h-screen transform transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 ${
      sidebarOpen ? 'translate-x-0' : '-translate-x-full'
    }`}>
      <div className="h-16 flex items-center justify-between px-6 border-b border-gray-200">
        <h1 className="text-xl font-bold text-primary-600">Travel CRM</h1>
        <button 
          onClick={() => setSidebarOpen(false)}
          className="lg:hidden p-1.5 rounded-md text-gray-500 hover:bg-gray-100 hover:text-gray-700 focus:outline-none"
        >
          <X className="h-5 w-5" />
        </button>
      </div>
      <nav className="flex-1 overflow-y-auto py-4">
        <ul className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path || (item.path !== '/' && location.pathname.startsWith(item.path));
            
            return (
              <li key={item.name}>
                <Link
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center px-6 py-2.5 text-sm font-medium transition-colors ${
                    isActive 
                      ? 'bg-primary-50 text-primary-700 border-r-4 border-primary-600' 
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <Icon className={`h-5 w-5 mr-3 ${isActive ? 'text-primary-600' : 'text-gray-400'}`} />
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