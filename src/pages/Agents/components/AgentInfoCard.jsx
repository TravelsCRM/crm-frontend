import React from 'react';
import { User, Phone, Mail, MapPin, Percent } from 'lucide-react';

export default function AgentInfoCard({ agent, bookingsCount, totalSpent, outstandingAmount }) {
  return (
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
            <span className="text-sm font-bold text-gray-950">{bookingsCount}</span>
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
  );
}
