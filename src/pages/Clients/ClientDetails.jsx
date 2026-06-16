import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getClientById } from '../../services/clientService';
import { 
  ArrowLeft, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  FileText, 
  Clock, 
  CreditCard,
  User,
  Loader2,
  Edit
} from 'lucide-react';

export default function ClientDetails() {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState('Overview');

  const { data: client, isLoading, error } = useQuery({
    queryKey: ['client', id],
    queryFn: () => getClientById(id),
  });

  if (isLoading) return <div className="flex justify-center py-12"><Loader2 className="animate-spin h-8 w-8 text-primary-600" /></div>;
  if (error) return <div className="text-red-600 p-6 font-medium text-center">Error: {error.message}</div>;

  return (
    <div className="space-y-6 pb-12">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link to="/clients" className="p-2 text-gray-400 hover:text-gray-500 rounded-full hover:bg-gray-100">
            <ArrowLeft className="h-6 w-6" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{client.name}</h1>
            <p className="text-sm text-gray-500 flex items-center">
              <span className="bg-primary-100 text-primary-700 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase mr-2">Direct Client</span>
              Registered on {new Date(client.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>
        <button className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
          <Edit className="h-4 w-4 mr-2" />
          Edit Profile
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Card - Contact Info */}
        <div className="space-y-6">
          <div className="bg-white shadow-sm rounded-lg border border-gray-200 overflow-hidden">
            <div className="p-6 space-y-4">
              <div className="flex items-center space-x-3 text-sm">
                <Phone className="h-4 w-4 text-gray-400" />
                <span className="text-gray-900">{client.mobile}</span>
              </div>
              {client.alternateMobile && (
                <div className="flex items-center space-x-3 text-sm">
                  <Phone className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-900">{client.alternateMobile} (Alt)</span>
                </div>
              )}
              <div className="flex items-center space-x-3 text-sm">
                <Mail className="h-4 w-4 text-gray-400" />
                <span className="text-gray-900">{client.email || 'No email provided'}</span>
              </div>
              <div className="flex items-start space-x-3 text-sm">
                <MapPin className="h-4 w-4 text-gray-400 mt-0.5" />
                <span className="text-gray-900">{client.address ? `${client.address}, ${client.city}` : client.city || 'No address provided'}</span>
              </div>
            </div>
            <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 grid grid-cols-2 gap-4">
              <div>
                <p className="text-[10px] text-gray-500 uppercase font-bold tracking-wider">Date of Birth</p>
                <p className="text-sm text-gray-900">{client.dob ? new Date(client.dob).toLocaleDateString() : 'N/A'}</p>
              </div>
              <div>
                <p className="text-[10px] text-gray-500 uppercase font-bold tracking-wider">Anniversary</p>
                <p className="text-sm text-gray-900">{client.anniversary ? new Date(client.anniversary).toLocaleDateString() : 'N/A'}</p>
              </div>
            </div>
          </div>

          <div className="bg-white shadow-sm rounded-lg border border-gray-200 p-6">
            <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4">Financial Summary</h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">Total Bookings</span>
                <span className="text-sm font-bold text-gray-900">0</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">Total Spent</span>
                <span className="text-sm font-bold text-gray-900">₹0</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">Outstanding</span>
                <span className="text-sm font-bold text-red-600">₹0</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Section - Tabs and Lists */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white shadow-sm rounded-lg border border-gray-200 overflow-hidden">
            <div className="border-b border-gray-200">
              <nav className="-mb-px flex">
                {['Overview', 'Queries', 'Bookings', 'Payments', 'Documents'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`whitespace-nowrap py-4 px-6 border-b-2 font-medium text-sm ${
                      activeTab === tab
                        ? 'border-primary-500 text-primary-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </nav>
            </div>
            <div className="p-6">
              {activeTab === 'Overview' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 bg-indigo-50 rounded-lg border border-indigo-100 flex items-center">
                      <div className="p-2 bg-indigo-100 rounded-full mr-4 text-indigo-600">
                        <FileText className="h-6 w-6" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-indigo-900">0</p>
                        <p className="text-xs text-indigo-700 font-medium">Active Queries</p>
                      </div>
                    </div>
                    <div className="p-4 bg-green-50 rounded-lg border border-green-100 flex items-center">
                      <div className="p-2 bg-green-100 rounded-full mr-4 text-green-600">
                        <CreditCard className="h-6 w-6" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-green-900">0</p>
                        <p className="text-xs text-green-700 font-medium">Completed Trips</p>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4">Recent Activities</h3>
                    <div className="text-center py-8 text-gray-500 text-sm italic">
                      No recent activities recorded for this client.
                    </div>
                  </div>
                </div>
              )}
              {activeTab !== 'Overview' && (
                <div className="text-center py-12 text-gray-500 text-sm italic">
                  {activeTab} module placeholder
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}