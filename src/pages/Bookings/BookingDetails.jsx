import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getBookingById, updateBookingStatus, downloadVoucher } from '../../services/bookingService';
import { getPaymentsByBooking } from '../../services/paymentService';
import { 
  ArrowLeft, 
  Calendar, 
  User, 
  MapPin, 
  CheckCircle, 
  Clock, 
  CreditCard,
  FileText,
  Loader2,
  Printer,
  Mail,
  ShieldCheck,
  Download
} from 'lucide-react';
import PaymentsTab from './components/PaymentsTab';

const statusColors = {
  'Pending': 'bg-yellow-100 text-yellow-800',
  'Confirmed': 'bg-green-100 text-green-800',
  'Completed': 'bg-blue-100 text-blue-800',
  'Cancelled': 'bg-red-100 text-red-800',
};

export default function BookingDetails() {
  const { id } = useParams();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState('Payments');
  const [isDownloading, setIsDownloading] = useState(false);

  const { data: booking, isLoading, error } = useQuery({
    queryKey: ['booking', id],
    queryFn: () => getBookingById(id),
  });

  const { data: payments } = useQuery({
    queryKey: ['payments', id],
    queryFn: () => getPaymentsByBooking(id),
    enabled: !!booking
  });

  const statusMutation = useMutation({
    mutationFn: (status) => updateBookingStatus(id, { status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['booking', id] });
    },
  });

  const handleDownload = async () => {
    try {
      setIsDownloading(true);
      await downloadVoucher(id, booking.bookingNumber);
    } catch (error) {
      alert('Failed to download voucher');
    } finally {
      setIsDownloading(false);
    }
  };

  if (isLoading) return <div className="flex justify-center py-12"><Loader2 className="animate-spin h-8 w-8 text-primary-600" /></div>;
  if (error) return <div className="text-red-600 p-6 font-medium text-center">Error: {error.message}</div>;

  const customer = booking.client || booking.agent || booking.corporate;
  const totalReceived = payments?.filter(p => p.status === 'Verified').reduce((sum, p) => sum + p.amount, 0) || 0;
  const balanceDue = booking.totalAmount - totalReceived;

  return (
    <div className="space-y-6 pb-12">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link to="/bookings" className="p-2 text-gray-400 hover:text-gray-500 rounded-full hover:bg-gray-100">
            <ArrowLeft className="h-6 w-6" />
          </Link>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-2xl font-bold text-gray-900">{booking.bookingNumber}</h1>
              <span className={`px-2 py-0.5 text-xs font-bold rounded-full uppercase ${statusColors[booking.status]}`}>
                {booking.status}
              </span>
            </div>
            <p className="text-sm text-gray-500">Booked on {new Date(booking.createdAt).toLocaleDateString()}</p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <button 
            onClick={handleDownload}
            disabled={isDownloading}
            className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
          >
            {isDownloading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Printer className="h-4 w-4 mr-2" />}
            Print Voucher
          </button>
          {booking.status === 'Pending' && (
            <button 
              onClick={() => statusMutation.mutate('Confirmed')}
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              Confirm Booking
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Details */}
        <div className="lg:col-span-2 space-y-6">
          
          <div className="bg-white shadow-sm rounded-lg border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
              <h2 className="text-lg font-medium text-gray-900">Package Summary</h2>
              <Link to={`/queries/${booking.query?._id}`} className="text-sm text-primary-600 font-medium hover:underline">View Query: {booking.query?.queryId}</Link>
            </div>
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-start">
                <MapPin className="h-5 w-5 text-gray-400 mt-0.5 mr-3" />
                <div>
                  <p className="text-xs text-gray-500 uppercase font-bold tracking-wider">Itinerary</p>
                  <p className="text-sm font-medium text-gray-900">{booking.itinerary?.name}</p>
                </div>
              </div>
              <div className="flex items-start">
                <Calendar className="h-5 w-5 text-gray-400 mt-0.5 mr-3" />
                <div>
                  <p className="text-xs text-gray-500 uppercase font-bold tracking-wider">Travel Dates</p>
                  <p className="text-sm font-medium text-gray-900">
                    {new Date(booking.travelDates.from).toLocaleDateString()} - {new Date(booking.travelDates.to).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div className="flex items-start">
                <User className="h-5 w-5 text-gray-400 mt-0.5 mr-3" />
                <div>
                  <p className="text-xs text-gray-500 uppercase font-bold tracking-wider">Pax Details</p>
                  <p className="text-sm font-medium text-gray-900">
                    {booking.pax.adults} Adults, {booking.pax.children} Children, {booking.pax.infants} Infants
                  </p>
                </div>
              </div>
              <div className="flex items-start">
                <ShieldCheck className="h-5 w-5 text-gray-400 mt-0.5 mr-3" />
                <div>
                  <p className="text-xs text-gray-500 uppercase font-bold tracking-wider">Payment Status</p>
                  <p className={`text-sm font-bold ${
                    booking.paymentStatus === 'Fully Paid' ? 'text-green-600' : 
                    booking.paymentStatus === 'Partially Paid' ? 'text-blue-600' : 'text-red-600'
                  }`}>{booking.paymentStatus}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs Section */}
          <div className="bg-white shadow-sm rounded-lg border border-gray-200 overflow-hidden">
            <div className="border-b border-gray-200">
              <nav className="-mb-px flex">
                {['Payments', 'Vouchers', 'Documents', 'Communication'].map((tab) => (
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
              {activeTab === 'Payments' && (
                <PaymentsTab bookingId={id} totalAmount={booking.totalAmount} />
              )}
              {activeTab !== 'Payments' && (
                <div className="text-center py-12 text-gray-500 text-sm italic">
                  {activeTab} module placeholder
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          <div className="bg-white shadow-sm rounded-lg border border-gray-200 p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Customer Info</h2>
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-bold">
                {customer?.name?.substring(0, 2) || 'C'}
              </div>
              <div className="ml-3">
                <p className="text-sm font-bold text-gray-900">{customer?.name || customer?.agentName || customer?.companyName}</p>
                <p className="text-xs text-gray-500">{customer?.mobile}</p>
              </div>
            </div>
            <button className="w-full inline-flex justify-center items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
              <Mail className="h-4 w-4 mr-2" />
              Send Booking Confirmation
            </button>
          </div>

          <div className="bg-primary-600 shadow-lg rounded-lg p-6 text-white overflow-hidden relative">
            <CreditCard className="absolute -right-4 -bottom-4 h-24 w-24 text-primary-500 opacity-20" />
            <h2 className="text-lg font-medium mb-4 flex items-center border-b border-primary-500 pb-2">
              Billing Summary
            </h2>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span>Total Package Cost</span>
                <span className="font-bold">₹{booking.totalAmount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Amount Received</span>
                <span className="font-bold text-green-300">₹{totalReceived.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-xl font-bold pt-4 border-t border-primary-500">
                <span>Balance Due</span>
                <span className={balanceDue > 0 ? 'text-red-300' : 'text-green-300'}>₹{balanceDue.toLocaleString()}</span>
              </div>
              {balanceDue > 0 && (
                <button 
                  onClick={() => setActiveTab('Payments')}
                  className="mt-6 w-full py-2 bg-white text-primary-600 rounded-md font-bold hover:bg-gray-100 transition-colors"
                >
                  Record Payment
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}