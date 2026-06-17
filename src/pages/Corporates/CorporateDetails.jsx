import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getCorporateById, updateCorporate } from '../../services/corporateService';
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
import CorporateInfoCard from './components/CorporateInfoCard';
import OverviewTab from './components/OverviewTab';
import QueriesTab from './components/QueriesTab';
import BookingsTab from './components/BookingsTab';
import PaymentsTab from './components/PaymentsTab';
import DocumentsTab from './components/DocumentsTab';
import EditCorporateModal from './components/EditCorporateModal';

export default function CorporateDetails() {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState('Overview');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  
  const queryClient = useQueryClient();

  // Fetch Corporate Details
  const { data: corporate, isLoading: corporateLoading, error: corporateError } = useQuery({
    queryKey: ['corporate', id],
    queryFn: () => getCorporateById(id),
  });

  // Fetch Corporate Queries
  const { data: queries, isLoading: queriesLoading } = useQuery({
    queryKey: ['queries', { corporate: id }],
    queryFn: () => getQueries({ corporate: id }),
  });

  // Fetch Corporate Bookings
  const { data: bookings, isLoading: bookingsLoading } = useQuery({
    queryKey: ['bookings', { corporate: id }],
    queryFn: () => getBookings({ corporate: id }),
  });

  // Fetch Corporate Payments
  const { data: payments, isLoading: paymentsLoading } = useQuery({
    queryKey: ['payments', { customer: id }],
    queryFn: () => getPayments({ customer: id }),
  });

  const updateMutation = useMutation({
    mutationFn: (data) => updateCorporate(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['corporate', id] });
      queryClient.invalidateQueries({ queryKey: ['corporates'] });
      setIsEditModalOpen(false);
    }
  });

  const isLoading = corporateLoading || queriesLoading || bookingsLoading || paymentsLoading;

  if (isLoading) {
    return (
      <div className="flex justify-center py-24">
        <Loader2 className="animate-spin h-10 w-10 text-primary-600" />
      </div>
    );
  }

  if (corporateError) {
    return (
      <div className="text-red-600 p-8 font-medium text-center bg-red-50 border border-red-200 rounded-lg max-w-xl mx-auto my-12">
        <AlertCircle className="h-10 w-10 mx-auto mb-3 text-red-500" />
        Error: {corporateError.message}
      </div>
    );
  }

  // Stats calculation
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
          <Link to="/corporates" className="p-2 text-gray-400 hover:text-gray-500 rounded-full hover:bg-gray-100">
            <ArrowLeft className="h-6 w-6" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{corporate.companyName}</h1>
            <p className="text-sm text-gray-500 flex items-center mt-1">
              <span className="bg-green-100 text-green-700 px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase mr-2">Corporate</span>
              Registered on {new Date(corporate.createdAt).toLocaleDateString()}
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
        {/* Left Card - Contact Info & Financial Summary */}
        <CorporateInfoCard 
          corporate={corporate}
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
              
              {/* Overview Tab */}
              {activeTab === 'Overview' && (
                <OverviewTab 
                  activeQueriesCount={activeQueriesCount}
                  completedBookingsCount={completedBookingsCount}
                />
              )}

              {/* Queries Tab */}
              {activeTab === 'Queries' && <QueriesTab queries={queries} />}

              {/* Bookings Tab */}
              {activeTab === 'Bookings' && <BookingsTab bookings={bookings} />}

              {/* Payments Tab */}
              {activeTab === 'Payments' && <PaymentsTab payments={payments} />}

              {/* Documents Tab */}
              {activeTab === 'Documents' && <DocumentsTab />}

            </div>
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      <EditCorporateModal 
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        corporate={corporate}
        onEditSubmit={(data) => updateMutation.mutate(data)}
        isPending={updateMutation.isPending}
        isError={updateMutation.isError}
        error={updateMutation.error}
      />
    </div>
  );
}
