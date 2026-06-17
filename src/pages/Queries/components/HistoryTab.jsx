import React, { useState } from 'react';
import { History } from 'lucide-react';

export default function HistoryTab({ activities = [] }) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const totalPages = Math.ceil((activities?.length || 0) / itemsPerPage);
  const indexOfLastActivity = currentPage * itemsPerPage;
  const indexOfFirstActivity = indexOfLastActivity - itemsPerPage;
  const currentActivities = activities?.slice(indexOfFirstActivity, indexOfLastActivity) || [];

  if (activities.length === 0) {
    return <div className="text-center py-8 text-gray-500 italic">No activities logged yet.</div>;
  }

  return (
    <div className="flow-root">
      <ul className="-mb-8">
        {currentActivities.map((activity, idx) => (
          <li key={activity._id}>
            <div className="relative pb-8">
              {idx !== currentActivities.length - 1 && (
                <span className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200" aria-hidden="true" />
              )}
              <div className="relative flex space-x-3">
                <div>
                  <span className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center ring-8 ring-white">
                    <History className="h-5 w-5 text-gray-500" />
                  </span>
                </div>
                <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                  <div>
                    <p className="text-sm text-gray-900 font-medium">{activity.action}</p>
                    <p className="text-xs text-gray-500">{activity.remarks}</p>
                  </div>
                  <div className="text-right text-xs whitespace-nowrap text-gray-500">
                    {new Date(activity.createdAt).toLocaleString()}
                    <p className="font-medium text-gray-700">{activity.performedBy?.name}</p>
                  </div>
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between border-t border-gray-150 pt-4 mt-8">
          <button
            type="button"
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-xs font-semibold rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 transition-colors"
          >
            Previous
          </button>
          <span className="text-xs text-gray-500 font-medium select-none">
            Page {currentPage} of {totalPages}
          </span>
          <button
            type="button"
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-xs font-semibold rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 transition-colors"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
