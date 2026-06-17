import React from 'react';
import { Phone, Mail, MapPin } from 'lucide-react';

export default function ClientInfoCard({ client, bookingsCount, totalSpent, outstandingAmount }) {
  return (
    <div className="space-y-6">
      <div className="bg-white shadow-sm rounded-lg border border-gray-200 overflow-hidden">
        <div className="p-6 space-y-4">
          <div className="flex items-center space-x-3 text-sm">
            <Phone className="h-4 w-4 text-gray-400 flex-shrink-0" />
            <span className="text-gray-950 font-medium">{client.mobile}</span>
          </div>
          {client.alternateMobile && (
            <div className="flex items-center space-x-3 text-sm">
              <Phone className="h-4 w-4 text-gray-400 flex-shrink-0" />
              <span className="text-gray-950 font-medium">{client.alternateMobile} (Alt)</span>
            </div>
          )}
          <div className="flex items-center space-x-3 text-sm">
            <Mail className="h-4 w-4 text-gray-400 flex-shrink-0" />
            <span className="text-gray-950 font-medium">{client.email || 'No email provided'}</span>
          </div>
          <div className="flex items-start space-x-3 text-sm">
            <MapPin className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
            <span className="text-gray-950 font-medium">
              {client.address ? `${client.address}, ${client.city}` : client.city || 'No address provided'}
            </span>
          </div>
        </div>
        <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 grid grid-cols-2 gap-4">
          <div>
            <p className="text-[10px] text-gray-500 uppercase font-bold tracking-wider">Date of Birth</p>
            <p className="text-sm font-semibold text-gray-900 mt-0.5">
              {client.dob ? new Date(client.dob).toLocaleDateString() : 'N/A'}
            </p>
          </div>
          <div>
            <p className="text-[10px] text-gray-500 uppercase font-bold tracking-wider">Anniversary</p>
            <p className="text-sm font-semibold text-gray-900 mt-0.5">
              {client.anniversary ? new Date(client.anniversary).toLocaleDateString() : 'N/A'}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white shadow-sm rounded-lg border border-gray-200 p-6">
        <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4">Financial Summary</h2>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-500">Total Bookings</span>
            <span className="text-sm font-bold text-gray-950">{bookingsCount}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-500">Total Spent</span>
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
  );
}
