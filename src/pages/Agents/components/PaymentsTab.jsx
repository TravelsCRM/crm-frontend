import React from 'react';
import { Link } from 'react-router-dom';

const paymentStatusColors = {
  'Pending': 'bg-yellow-100 text-yellow-800',
  'Verified': 'bg-green-100 text-green-800',
  'Cancelled': 'bg-red-100 text-red-800',
};

export default function PaymentsTab({ payments }) {
  return (
    <div className="overflow-x-auto -mx-6">
      <table className="min-w-full divide-y divide-gray-200 font-medium">
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
  );
}
