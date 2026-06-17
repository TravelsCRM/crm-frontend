import React from 'react';
import { MapPin, Calendar, User, Clock } from 'lucide-react';

export default function QueryInfoCard({ query }) {
  return (
    <div className="bg-white shadow-sm rounded-lg border border-gray-200 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
        <h2 className="text-lg font-medium text-gray-900">Query Information</h2>
      </div>
      <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="flex items-start">
          <MapPin className="h-5 w-5 text-gray-400 mt-0.5 mr-3" />
          <div>
            <p className="text-xs text-gray-500 uppercase font-bold tracking-wider">Destination</p>
            <p className="text-sm font-medium text-gray-900">{query.destination}</p>
          </div>
        </div>
        <div className="flex items-start">
          <Calendar className="h-5 w-5 text-gray-400 mt-0.5 mr-3" />
          <div>
            <p className="text-xs text-gray-500 uppercase font-bold tracking-wider">Travel Dates</p>
            <p className="text-sm font-medium text-gray-900">
              {query.fromDate ? `${new Date(query.fromDate).toLocaleDateString()} - ${new Date(query.toDate).toLocaleDateString()}` : query.travelMonth || 'Flexible'}
            </p>
          </div>
        </div>
        <div className="flex items-start">
          <User className="h-5 w-5 text-gray-400 mt-0.5 mr-3" />
          <div>
            <p className="text-xs text-gray-500 uppercase font-bold tracking-wider">Pax Details</p>
            <p className="text-sm font-medium text-gray-900">
              {query.pax?.adults || 0} Adults, {query.pax?.children || 0} Children, {query.pax?.infants || 0} Infants
            </p>
          </div>
        </div>
        <div className="flex items-start">
          <Clock className="h-5 w-5 text-gray-400 mt-0.5 mr-3" />
          <div>
            <p className="text-xs text-gray-500 uppercase font-bold tracking-wider">Lead Source / Priority</p>
            <p className="text-sm font-medium text-gray-900">{query.leadSource} / {query.priority}</p>
          </div>
        </div>
      </div>
      <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
        <p className="text-xs text-gray-500 uppercase font-bold tracking-wider mb-2">Remarks</p>
        <p className="text-sm text-gray-700">{query.remarks || 'No remarks provided'}</p>
      </div>
    </div>
  );
}
