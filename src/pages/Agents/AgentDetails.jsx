import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { getAgentById, updateAgent } from '../../services/agentService';
import { getQueries } from '../../services/queryService';
import { getBookings } from '../../services/bookingService';
import { getPayments } from '../../services/paymentService';
import { 
  ArrowLeft, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  FileText, 
  Clock, 
  CreditCard,
  Briefcase,
  User,
  Loader2,
  Edit,
  Eye,
  Plus,
  Percent,
  TrendingUp,
  AlertCircle,
  X
} from 'lucide-react';

const queryStatusColors = {
  'New': 'bg-blue-100 text-blue-800',
  'Proposal Sent': 'bg-yellow-100 text-yellow-800',
  'No Connect': 'bg-gray-100 text-gray-800',
  'Hot Lead': 'bg-orange-100 text-orange-800',
  'Proposal Confirmed': 'bg-indigo-100 text-indigo-800',
  'Cancel': 'bg-red-100 text-red-800',
  'Follow Up': 'bg-purple-100 text-purple-800',
  'Confirmed': 'bg-green-100 text-green-800',
  'Postponed': 'bg-pink-100 text-pink-800',
  'Invalid': 'bg-red-100 text-red-800',
};

const bookingStatusColors = {
  'Pending': 'bg-yellow-100 text-yellow-800',
  'Confirmed': 'bg-green-100 text-green-800',
  'Completed': 'bg-blue-100 text-blue-800',
  'Cancelled': 'bg-red-100 text-red-800',
};

const paymentStatusColors = {
  'Pending': 'bg-yellow-100 text-yellow-800',
  'Verified': 'bg-green-100 text-green-800',
  'Cancelled': 'bg-red-100 text-red-800',
};

export default function AgentDetails() {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState('Overview');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  
  const queryClient = useQueryClient();
  const { register, handleSubmit, reset, formState: { errors } } = useForm();

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

  // Populate/Reset form fields on agent load or modal open
  useEffect(() => {
    if (agent) {
      reset({
        companyName: agent.companyName || '',
        agentName: agent.agentName || '',
        mobile: agent.mobile || '',
        email: agent.email || '',
        city: agent.city || '',
        address: agent.address || '',
        commissionPercentage: agent.commissionPercentage || 0,
        gstNumber: agent.gstNumber || '',
        notes: agent.notes || ''
      });
    }
  }, [agent, reset, isEditModalOpen]);

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

  const onEditSubmit = (data) => {
    updateMutation.mutate(data);
  };

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

  // Stats calculation
  const activeQueries = queries?.filter(q => 
    !['Confirmed', 'Cancel', 'Invalid'].includes(q.status)
  ) || [];

  const completedBookings = bookings?.filter(b => 
    b.status === 'Completed'
  ) || [];

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
        {/* Left Card - Contact Info & Financial Summary */}
        <div className="space-y-6">
          <div className="bg-white shadow-sm rounded-lg border border-gray-200 overflow-hidden">
            <div className="p-6 space-y-4">
              <div className="text-xs font-bold text-gray-400 uppercase tracking-wider">Contact Person</div>
              <div className="text-base font-semibold text-gray-950 flex items-center">
                <User className="h-4 w-4 text-gray-400 mr-2 flex-shrink-0" />
                {agent.agentName}
              </div>
              <div className="flex items-center space-x-3 text-sm border-t pt-3 border-gray-100">
                <Phone className="h-4 w-4 text-gray-400 flex-shrink-0" />
                <span className="text-gray-950 font-medium">{agent.mobile}</span>
              </div>
              <div className="flex items-center space-x-3 text-sm">
                <Mail className="h-4 w-4 text-gray-400 flex-shrink-0" />
                <span className="text-gray-950 font-medium">{agent.email || 'No email provided'}</span>
              </div>
              <div className="flex items-start space-x-3 text-sm">
                <MapPin className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
                <span className="text-gray-950 font-medium">
                  {agent.address ? `${agent.address}, ${agent.city}` : agent.city || 'No address provided'}
                </span>
              </div>
            </div>
            <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 grid grid-cols-2 gap-4">
              <div>
                <p className="text-[10px] text-gray-500 uppercase font-bold tracking-wider">Commission Rate</p>
                <p className="text-sm font-semibold text-gray-900 mt-0.5 flex items-center">
                  <Percent className="h-3 w-3 mr-0.5 text-gray-500" />
                  {agent.commissionPercentage || 0}%
                </p>
              </div>
              <div>
                <p className="text-[10px] text-gray-500 uppercase font-bold tracking-wider">GST Number</p>
                <p className="text-sm font-semibold text-gray-900 mt-0.5 uppercase font-mono">
                  {agent.gstNumber || 'N/A'}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white shadow-sm rounded-lg border border-gray-200 p-6">
            <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4">Financial Summary</h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">Total Bookings</span>
                <span className="text-sm font-bold text-gray-950">{bookings?.length || 0}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">Total Paid</span>
                <span className="text-sm font-bold text-gray-950">₹{totalSpent.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">Outstanding</span>
                <span className={`text-sm font-bold ${outstandingAmount > 0 ? 'text-red-600' : 'text-green-600'}`}>
                  ₹{outstandingAmount.toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        </div>

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
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-5 bg-indigo-50 rounded-xl border border-indigo-100 flex items-center">
                      <div className="p-3 bg-indigo-100 rounded-full mr-4 text-indigo-600">
                        <FileText className="h-6 w-6" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-indigo-950">{activeQueries.length}</p>
                        <p className="text-xs text-indigo-700 font-semibold uppercase tracking-wider">Active Queries</p>
                      </div>
                    </div>
                    <div className="p-5 bg-green-50 rounded-xl border border-green-100 flex items-center">
                      <div className="p-3 bg-green-100 rounded-full mr-4 text-green-600">
                        <CreditCard className="h-6 w-6" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-green-950">{completedBookings.length}</p>
                        <p className="text-xs text-green-700 font-semibold uppercase tracking-wider">Completed Trips</p>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4 border-b pb-2">Recent Activities</h3>
                    <div className="text-center py-10 text-gray-400 text-sm italic">
                      No recent activities recorded for this agent.
                    </div>
                  </div>
                </div>
              )}

              {/* Queries Tab */}
              {activeTab === 'Queries' && (
                <div className="overflow-x-auto -mx-6">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Query ID</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Destination</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Travel Date</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Assigned To</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3"><span className="sr-only">Actions</span></th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {queries && queries.length > 0 ? (
                        queries.map((q) => (
                          <tr key={q._id} className="hover:bg-gray-50 transition">
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-primary-600">
                              <Link to={`/queries/${q._id}`}>{q.queryId}</Link>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-950 font-medium">
                              {q.destination}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {q.fromDate ? new Date(q.fromDate).toLocaleDateString() : 'TBD'}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {q.assignedTo?.name || 'Unassigned'}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-2 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full ${queryStatusColors[q.status] || 'bg-gray-100 text-gray-800'}`}>
                                {q.status}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                              <Link to={`/queries/${q._id}`} className="text-gray-400 hover:text-gray-600">
                                <Eye className="h-4 w-4" />
                              </Link>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="6" className="px-6 py-12 text-center text-sm text-gray-400 italic">
                            No queries found for this agent.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Bookings Tab */}
              {activeTab === 'Bookings' && (
                <div className="overflow-x-auto -mx-6">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Booking No</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Query ID</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Travel Dates</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Amount</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3"><span className="sr-only">Actions</span></th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {bookings && bookings.length > 0 ? (
                        bookings.map((b) => (
                          <tr key={b._id} className="hover:bg-gray-50 transition">
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-primary-600">
                              <Link to={`/bookings/${b._id}`}>{b.bookingNumber}</Link>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {b.query?.queryId || 'N/A'}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {b.travelDates?.from ? new Date(b.travelDates.from).toLocaleDateString() : 'TBD'} - {b.travelDates?.to ? new Date(b.travelDates.to).toLocaleDateString() : 'TBD'}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-950 font-semibold">
                              {b.currency || '₹'} {b.totalAmount?.toLocaleString()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-2 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                b.paymentStatus === 'Fully Paid' ? 'bg-green-100 text-green-800' :
                                b.paymentStatus === 'Partially Paid' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'
                              }`}>
                                {b.paymentStatus || 'Unpaid'}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-2 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full ${bookingStatusColors[b.status] || 'bg-gray-100 text-gray-800'}`}>
                                {b.status}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                              <Link to={`/bookings/${b._id}`} className="text-gray-400 hover:text-gray-600">
                                <Eye className="h-4 w-4" />
                              </Link>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="7" className="px-6 py-12 text-center text-sm text-gray-400 italic">
                            No bookings found for this agent.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Payments Tab */}
              {activeTab === 'Payments' && (
                <div className="overflow-x-auto -mx-6">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ref No / Date</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Booking</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mode</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {payments && payments.length > 0 ? (
                        payments.map((p) => (
                          <tr key={p._id} className="hover:bg-gray-50 transition">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-semibold text-gray-950">{p.referenceNumber || 'N/A'}</div>
                              <div className="text-xs text-gray-500">{new Date(p.paymentDate).toLocaleDateString()}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {p.booking?.bookingNumber ? (
                                <Link to={`/bookings/${p.booking._id}`} className="text-primary-600 hover:text-primary-800 font-medium">
                                  {p.booking.bookingNumber}
                                </Link>
                              ) : 'N/A'}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-950 font-semibold">
                              ₹{p.amount?.toLocaleString()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {p.paymentMode}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-2 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full ${paymentStatusColors[p.status] || 'bg-gray-100 text-gray-800'}`}>
                                {p.status}
                              </span>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="5" className="px-6 py-12 text-center text-sm text-gray-400 italic">
                            No payments recorded for this agent.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Documents Tab */}
              {activeTab === 'Documents' && (
                <div className="text-center py-16 text-gray-400 text-sm">
                  <div className="p-3 bg-gray-100 rounded-full inline-block text-gray-400 mb-3">
                    <FileText className="h-8 w-8" />
                  </div>
                  <p className="italic font-medium">No documents uploaded yet.</p>
                  <p className="text-xs text-gray-400 mt-1">Files, tickets, and hotel vouchers associated with this agent's bookings will appear here.</p>
                </div>
              )}

            </div>
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-xl shadow-2xl border border-gray-200 w-full max-w-2xl overflow-hidden max-h-[90vh] flex flex-col animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between bg-gray-50">
              <h2 className="text-lg font-bold text-gray-900">Edit Agent Profile</h2>
              <button 
                onClick={() => setIsEditModalOpen(false)} 
                className="text-gray-400 hover:text-gray-600 p-1.5 rounded-full hover:bg-gray-200 transition"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Form Body */}
            <form onSubmit={handleSubmit(onEditSubmit)} className="flex-1 overflow-y-auto p-6 space-y-4">
              {updateMutation.isError && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-md font-medium">
                  {updateMutation.error?.response?.data?.message || 'Failed to update agent details.'}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Agency / Company Name <span className="text-red-500">*</span></label>
                  <input 
                    type="text" 
                    {...register('companyName', { required: 'Company name is required' })} 
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm" 
                  />
                  {errors.companyName && <p className="mt-1 text-xs text-red-500">{errors.companyName.message}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Agent Name (Contact Person) <span className="text-red-500">*</span></label>
                  <input 
                    type="text" 
                    {...register('agentName', { required: 'Agent name is required' })} 
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm" 
                  />
                  {errors.agentName && <p className="mt-1 text-xs text-red-500">{errors.agentName.message}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Mobile Number <span className="text-red-500">*</span></label>
                  <input 
                    type="tel" 
                    {...register('mobile', { required: 'Mobile is required' })} 
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm" 
                  />
                  {errors.mobile && <p className="mt-1 text-xs text-red-500">{errors.mobile.message}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Email Address</label>
                  <input 
                    type="email" 
                    {...register('email')} 
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm" 
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">GST Number</label>
                  <input 
                    type="text" 
                    {...register('gstNumber')} 
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm" 
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Commission Percentage (%)</label>
                  <input 
                    type="number" 
                    step="0.01" 
                    min="0" 
                    max="100" 
                    {...register('commissionPercentage')} 
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm" 
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">City</label>
                  <input 
                    type="text" 
                    {...register('city')} 
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm" 
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700">Address</label>
                  <textarea 
                    {...register('address')} 
                    rows={2} 
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm" 
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700">Internal Notes</label>
                  <textarea 
                    {...register('notes')} 
                    rows={2} 
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm" 
                  />
                </div>
              </div>

              {/* Modal Footer */}
              <div className="pt-4 border-t border-gray-200 flex justify-end space-x-3 bg-white">
                <button 
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={updateMutation.isPending}
                  className="inline-flex justify-center items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 transition disabled:opacity-50"
                >
                  {updateMutation.isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    'Save Changes'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
