import React from 'react';
import { Link } from 'react-router-dom';
import { Eye } from 'lucide-react';

const bookingStatusColors = {
  'Pending': 'bg-yellow-100 text-yellow-800',
  'Confirmed': 'bg-green-100 text-green-800',
  'Completed': 'bg-blue-100 text-blue-800',
  'Cancelled': 'bg-red-100 text-red-800',
};

export default function BookingsTab({ bookings }) {
  return (
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
        <tbody className="bg-white divide-y divide-gray-200 font-medium">
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
                No bookings found for this corporate client.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
