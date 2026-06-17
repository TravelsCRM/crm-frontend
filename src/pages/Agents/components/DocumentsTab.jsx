import React from 'react';
import { FileText } from 'lucide-react';

export default function DocumentsTab() {
  return (
    <div className="text-center py-16 text-gray-400 text-sm">
      <div className="p-3 bg-gray-100 rounded-full inline-block text-gray-400 mb-3">
        <FileText className="h-8 w-8" />
      </div>
      <p className="italic font-medium">No documents uploaded yet.</p>
      <p className="text-xs text-gray-400 mt-1">Files, tickets, and hotel vouchers associated with this agent's bookings will appear here.</p>
    </div>
  );
}
