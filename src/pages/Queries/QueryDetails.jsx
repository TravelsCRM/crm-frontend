import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  getQueryById, 
  updateQueryStatus 
} from '../../services/queryService';
import { 
  ArrowLeft, 
  FilePlus,
  Loader2
} from 'lucide-react';
import ProposalsTab from './components/ProposalsTab';
import FollowupsTab from './components/FollowupsTab';

// Import subcomponents
import QueryInfoCard from './components/QueryInfoCard';
import HistoryTab from './components/HistoryTab';
import CustomerDetailsCard from './components/CustomerDetailsCard';
import AssigneeCard from './components/AssigneeCard';

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
            className={`block w-full pl-3 pr-10 py-2 text-sm border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 rounded-md font-semibold ${statusColors[query.status] || 'bg-gray-100 text-gray-800'}`}
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
          <QueryInfoCard query={query} />

          {/* Tabs Section */}
          <div className="bg-white shadow-sm rounded-lg border border-gray-200 overflow-hidden">
            <div className="border-b border-gray-200">
              <nav className="-mb-px flex">
                {['Proposals', 'Followups', 'Emails', 'History'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => {
                      setActiveTab(tab);
                    }}
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
                <HistoryTab activities={activities} />
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

        {/* Right Column - Sidebar Panels */}
        <div className="space-y-6">
          {/* Customer Details */}
          <CustomerDetailsCard queryType={query.queryType} customer={customer} />

          {/* Assignee Information */}
          <AssigneeCard assignedTo={query.assignedTo} />
        </div>
      </div>
    </div>
  );
}