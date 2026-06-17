import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getAgentById, updateAgent } from '../../services/agentService';
import { getQueries } from '../../services/queryService';
import { getBookings } from '../../services/bookingService';
import { getPayments } from '../../services/paymentService';
import { 
  ArrowLeft, 
  Loader2, 
  Edit, 
  AlertCircle 
} from 'lucide-react';

// Import subcomponents
import AgentInfoCard from './components/AgentInfoCard';
import OverviewTab from './components/OverviewTab';
import QueriesTab from './components/QueriesTab';
import BookingsTab from './components/BookingsTab';
import PaymentsTab from './components/PaymentsTab';
import DocumentsTab from './components/DocumentsTab';
import EditAgentModal from './components/EditAgentModal';

export default function AgentDetails() {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState('Overview');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  
  const queryClient = useQueryClient();

  // Fetch Agent Details
  const { data: agent, isLoading: agentLoading, error: agentError } = useQuery({
    queryKey: ['agent', id],
    queryFn: () => getAgentById(id),
  });

  // Fetch Agent Queries
  const { data: queries, isLoading: queriesLoading } = useQuery({
    queryKey: ['queries', { agent: id }],
    queryFn: () => getQueries({ agent: id }),
  });

  // Fetch Agent Bookings
  const { data: bookings, isLoading: bookingsLoading } = useQuery({
    queryKey: ['bookings', { agent: id }],
    queryFn: () => getBookings({ agent: id }),
  });

  // Fetch Agent Payments (payments mapped to customer which is agent id)
  const { data: payments, isLoading: paymentsLoading } = useQuery({
    queryKey: ['payments', { customer: id }],
    queryFn: () => getPayments({ customer: id }),
  });

  const updateMutation = useMutation({
    mutationFn: (data) => {
      if (data.commissionPercentage) {
        data.commissionPercentage = parseFloat(data.commissionPercentage);
      }
      return updateAgent(id, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['agent', id] });
      queryClient.invalidateQueries({ queryKey: ['agents'] });
      setIsEditModalOpen(false);
    }
  });

  const isLoading = agentLoading || queriesLoading || bookingsLoading || paymentsLoading;

  if (isLoading) {
    return (
      <div className="flex justify-center py-24">
        <Loader2 className="animate-spin h-10 w-10 text-primary-600" />
      </div>
    );
  }

  if (agentError) {
    return (
      <div className="text-red-600 p-8 font-medium text-center bg-red-50 border border-red-200 rounded-lg max-w-xl mx-auto my-12">
        <AlertCircle className="h-10 w-10 mx-auto mb-3 text-red-500" />
        Error: {agentError.message}
      </div>
    );
  }

  // Financial statistics calculations
  const activeQueriesCount = queries?.filter(q => 
    !['Confirmed', 'Cancel', 'Invalid'].includes(q.status)
  ).length || 0;

  const completedBookingsCount = bookings?.filter(b => 
    b.status === 'Completed'
  ).length || 0;

  const totalSpent = payments?.filter(p => 
    p.status === 'Verified'
  ).reduce((sum, p) => sum + p.amount, 0) || 0;

  const totalBookingsAmount = bookings?.filter(b => 
    b.status !== 'Cancelled'
  ).reduce((sum, b) => sum + b.totalAmount, 0) || 0;

  const outstandingAmount = Math.max(0, totalBookingsAmount - totalSpent);

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center space-x-4">
          <Link to="/agents" className="p-2 text-gray-400 hover:text-gray-500 rounded-full hover:bg-gray-100">
            <ArrowLeft className="h-6 w-6" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{agent.companyName}</h1>
            <p className="text-sm text-gray-500 flex items-center mt-1">
              <span className="bg-primary-100 text-primary-700 px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase mr-2">Agent</span>
              Registered on {new Date(agent.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>
        <button 
          onClick={() => setIsEditModalOpen(true)}
          className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition"
        >
          <Edit className="h-4 w-4 mr-2 text-gray-500" />
          Edit Profile
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Side Info Card */}
        <AgentInfoCard 
          agent={agent} 
          bookingsCount={bookings?.length || 0}
          totalSpent={totalSpent}
          outstandingAmount={outstandingAmount}
        />

        {/* Right Section - Tabs and Lists */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white shadow-sm rounded-lg border border-gray-200 overflow-hidden">
            <div className="border-b border-gray-200 bg-gray-50">
              <nav className="-mb-px flex">
                {['Overview', 'Queries', 'Bookings', 'Payments', 'Documents'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`whitespace-nowrap py-4 px-6 border-b-2 font-semibold text-sm transition ${
                      activeTab === tab
                        ? 'border-primary-600 text-primary-600 bg-white'
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
                <OverviewTab 
                  activeQueriesCount={activeQueriesCount}
                  completedBookingsCount={completedBookingsCount}
                />
              )}
              {activeTab === 'Queries' && <QueriesTab queries={queries} />}
              {activeTab === 'Bookings' && <BookingsTab bookings={bookings} />}
              {activeTab === 'Payments' && <PaymentsTab payments={payments} />}
              {activeTab === 'Documents' && <DocumentsTab />}
            </div>
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      <EditAgentModal 
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        agent={agent}
        onEditSubmit={(data) => updateMutation.mutate(data)}
        isPending={updateMutation.isPending}
        isError={updateMutation.isError}
        error={updateMutation.error}
      />
    </div>
  );
}
