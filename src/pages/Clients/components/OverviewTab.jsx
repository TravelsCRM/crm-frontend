import React from 'react';
import { FileText, CreditCard } from 'lucide-react';

export default function OverviewTab({ activeQueriesCount, completedBookingsCount }) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-5 bg-indigo-50 rounded-xl border border-indigo-100 flex items-center">
          <div className="p-3 bg-indigo-100 rounded-full mr-4 text-indigo-600">
            <FileText className="h-6 w-6" />
          </div>
          <div>
            <p className="text-2xl font-bold text-indigo-950">{activeQueriesCount}</p>
            <p className="text-xs text-indigo-700 font-semibold uppercase tracking-wider">Active Queries</p>
          </div>
        </div>
        <div className="p-5 bg-green-50 rounded-xl border border-green-100 flex items-center">
          <div className="p-3 bg-green-100 rounded-full mr-4 text-green-600">
            <CreditCard className="h-6 w-6" />
          </div>
          <div>
            <p className="text-2xl font-bold text-green-950">{completedBookingsCount}</p>
            <p className="text-xs text-green-700 font-semibold uppercase tracking-wider">Completed Trips</p>
          </div>
        </div>
      </div>
      
      <div>
        <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4 border-b pb-2">Recent Activities</h3>
        <div className="text-center py-10 text-gray-400 text-sm italic">
          No recent activities recorded for this client.
        </div>
      </div>
    </div>
  );
}
