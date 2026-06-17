import React from 'react';
import { Phone, Mail, MessageSquare } from 'lucide-react';

export default function CustomerDetailsCard({ queryType, customer }) {
  const displayName = customer?.name || customer?.agentName || customer?.companyName || 'Customer';
  const initials = displayName.substring(0, 2).toUpperCase();

  return (
    <div className="bg-white shadow-sm rounded-lg border border-gray-200 p-6">
      <h2 className="text-lg font-medium text-gray-900 mb-4">Customer Details</h2>
      <div className="space-y-4">
        <div className="flex items-center">
          <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-bold">
            {initials}
          </div>
          <div className="ml-3">
            <p className="text-sm font-bold text-gray-900">{displayName}</p>
            <p className="text-xs text-gray-500">{queryType}</p>
          </div>
        </div>
        <div className="pt-4 border-t border-gray-100 space-y-3">
          <div className="flex items-center text-sm">
            <Phone className="h-4 w-4 text-gray-400 mr-3" />
            <span className="text-gray-900">{customer?.mobile || 'No contact number'}</span>
          </div>
          <div className="flex items-center text-sm">
            <Mail className="h-4 w-4 text-gray-400 mr-3" />
            <span className="text-gray-900 text-wrap break-all">{customer?.email || 'No email provided'}</span>
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
  );
}
