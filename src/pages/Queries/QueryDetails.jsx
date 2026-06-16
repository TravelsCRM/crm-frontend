import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  getQueryById, 
  updateQueryStatus 
} from '../../services/queryService';
import { 
  ArrowLeft, 
  Calendar, 
  User, 
  MapPin, 
  Clock, 
  Mail, 
  Phone,
  MessageSquare,
  FilePlus,
  History,
  CheckCircle,
  Loader2
} from 'lucide-react';
import ProposalsTab from './components/ProposalsTab';
import FollowupsTab from './components/FollowupsTab';

const statusColors = {
  'New': 'bg-blue-100 text-blue-800',
  'Proposal Sent': 'bg-yellow-100 text-yellow-800',
  'Hot Lead': 'bg-orange-100 text-orange-800',
  'Follow Up': 'bg-purple-100 text-purple-800',
  'Confirmed': 'bg-green-100 text-green-800',
  'Cancel': 'bg-red-100 text-red-800',
};

export default function QueryDetails() {
  const { id } = useParams();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState('History');

  const { data, isLoading, error } = useQuery({
    queryKey: ['query', id],
    queryFn: () => getQueryById(id),
  });

  const statusMutation = useMutation({
    mutationFn: ({ status, remarks }) => updateQueryStatus(id, { status, remarks }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['query', id] });
    },
  });

  if (isLoading) return <div className="flex justify-center py-12"><Loader2 className="animate-spin h-8 w-8 text-primary-600" /></div>;
  if (error) return <div className="text-red-600">Error: {error.message}</div>;

  const { query, activities } = data;
  const customer = query.client || query.agent || query.corporate;

  return (
    <div className="space-y-6 pb-12">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link to="/queries" className="p-2 text-gray-400 hover:text-gray-500 rounded-full hover:bg-gray-100">
            <ArrowLeft className="h-6 w-6" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{query.queryId}</h1>
            <p className="text-sm text-gray-500">Created on {new Date(query.createdAt).toLocaleDateString()}</p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <select 
            value={query.status}
            onChange={(e) => statusMutation.mutate({ status: e.target.value })}
            className={`block w-full pl-3 pr-10 py-2 text-sm border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 rounded-md font-semibold ${statusColors[query.status]}`}
          >
            {[
              'New', 'Proposal Sent', 'No Connect', 'Hot Lead', 
              'Proposal Confirmed', 'Cancel', 'Follow Up', 
              'Confirmed', 'Postponed', 'Invalid'
            ].map(s => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
          <Link to={`/itineraries/new?queryId=${id}`} className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700">
            <FilePlus className="h-4 w-4 mr-2" />
            Create Itinerary
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Details */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Main Info Card */}
          <div className="bg-white shadow-sm rounded-lg border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
              <h2 className="text-lg font-medium text-gray-900">Query Information</h2>
            </div>
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-start">
                <MapPin className="h-5 w-5 text-gray-400 mt-0.5 mr-3" />
                <div>
                  <p className="text-xs text-gray-500 uppercase font-bold tracking-wider">Destination</p>
                  <p className="text-sm font-medium text-gray-900">{query.destination}</p>
                </div>
              </div>
              <div className="flex items-start">
                <Calendar className="h-5 w-5 text-gray-400 mt-0.5 mr-3" />
                <div>
                  <p className="text-xs text-gray-500 uppercase font-bold tracking-wider">Travel Dates</p>
                  <p className="text-sm font-medium text-gray-900">
                    {query.fromDate ? `${new Date(query.fromDate).toLocaleDateString()} - ${new Date(query.toDate).toLocaleDateString()}` : query.travelMonth || 'Flexible'}
                  </p>
                </div>
              </div>
              <div className="flex items-start">
                <User className="h-5 w-5 text-gray-400 mt-0.5 mr-3" />
                <div>
                  <p className="text-xs text-gray-500 uppercase font-bold tracking-wider">Pax Details</p>
                  <p className="text-sm font-medium text-gray-900">
                    {query.pax.adults} Adults, {query.pax.children} Children, {query.pax.infants} Infants
                  </p>
                </div>
              </div>
              <div className="flex items-start">
                <Clock className="h-5 w-5 text-gray-400 mt-0.5 mr-3" />
                <div>
                  <p className="text-xs text-gray-500 uppercase font-bold tracking-wider">Lead Source / Priority</p>
                  <p className="text-sm font-medium text-gray-900">{query.leadSource} / {query.priority}</p>
                </div>
              </div>
            </div>
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
              <p className="text-xs text-gray-500 uppercase font-bold tracking-wider mb-2">Remarks</p>
              <p className="text-sm text-gray-700">{query.remarks || 'No remarks provided'}</p>
            </div>
          </div>

          {/* Tabs Section */}
          <div className="bg-white shadow-sm rounded-lg border border-gray-200 overflow-hidden">
            <div className="border-b border-gray-200">
              <nav className="-mb-px flex">
                {['Proposals', 'Followups', 'Emails', 'History'].map((tab) => (
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
              {activeTab === 'History' && (
                <div className="flow-root">
                  <ul className="-mb-8">
                    {activities?.map((activity, idx) => (
                      <li key={activity._id}>
                        <div className="relative pb-8">
                          {idx !== activities.length - 1 && (
                            <span className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200" aria-hidden="true" />
                          )}
                          <div className="relative flex space-x-3">
                            <div>
                              <span className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center ring-8 ring-white">
                                <History className="h-5 w-5 text-gray-500" />
                              </span>
                            </div>
                            <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                              <div>
                                <p className="text-sm text-gray-900 font-medium">{activity.action}</p>
                                <p className="text-xs text-gray-500">{activity.remarks}</p>
                              </div>
                              <div className="text-right text-xs whitespace-nowrap text-gray-500">
                                {new Date(activity.createdAt).toLocaleString()}
                                <p className="font-medium text-gray-700">{activity.performedBy?.name}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {activeTab === 'Proposals' && (
                <ProposalsTab queryId={id} />
              )}
              {activeTab === 'Followups' && (
                <FollowupsTab queryId={id} />
              )}
              {['Emails'].includes(activeTab) && (
                <div className="text-center py-8 text-gray-500 italic">
                  {activeTab} module placeholder
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column - Customer Info */}
        <div className="space-y-6">
          <div className="bg-white shadow-sm rounded-lg border border-gray-200 p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Customer Details</h2>
            <div className="space-y-4">
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-bold">
                  {customer?.name?.substring(0, 2) || 'C'}
                </div>
                <div className="ml-3">
                  <p className="text-sm font-bold text-gray-900">{customer?.name || customer?.agentName || customer?.companyName}</p>
                  <p className="text-xs text-gray-500">{query.queryType}</p>
                </div>
              </div>
              <div className="pt-4 border-t border-gray-100 space-y-3">
                <div className="flex items-center text-sm">
                  <Phone className="h-4 w-4 text-gray-400 mr-3" />
                  <span className="text-gray-900">{customer?.mobile}</span>
                </div>
                <div className="flex items-center text-sm">
                  <Mail className="h-4 w-4 text-gray-400 mr-3" />
                  <span className="text-gray-900">{customer?.email || 'No email provided'}</span>
                </div>
              </div>
              <div className="pt-4 flex space-x-2">
                <button className="flex-1 inline-flex justify-center items-center px-3 py-2 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50">
                  <MessageSquare className="h-4 w-4 mr-2 text-green-500" />
                  WhatsApp
                </button>
                <button className="flex-1 inline-flex justify-center items-center px-3 py-2 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50">
                  <Mail className="h-4 w-4 mr-2 text-blue-500" />
                  Email
                </button>
              </div>
            </div>
          </div>

          <div className="bg-white shadow-sm rounded-lg border border-gray-200 p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Assigned To</h2>
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold">
                {query.assignedTo?.name?.substring(0, 2) || 'EX'}
              </div>
              <div className="ml-3">
                <p className="text-sm font-bold text-gray-900">{query.assignedTo?.name || 'Unassigned'}</p>
                <p className="text-xs text-gray-500">{query.assignedTo?.role?.name || 'Sales Executive'}</p>
              </div>
            </div>
            {!query.assignedTo && (
              <button className="mt-4 w-full inline-flex justify-center items-center px-4 py-2 border border-primary-600 text-sm font-medium rounded-md text-primary-600 bg-white hover:bg-primary-50">
                Assign Now
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}