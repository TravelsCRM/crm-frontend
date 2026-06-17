import React from 'react';
import { Link } from 'react-router-dom';
import { Eye } from 'lucide-react';

const queryStatusColors = {
  'New': 'bg-blue-100 text-blue-800',
  'Proposal Sent': 'bg-yellow-100 text-yellow-800',
  'No Connect': 'bg-gray-100 text-gray-800',
  'Hot Lead': 'bg-orange-100 text-orange-800',
  'Proposal Confirmed': 'bg-indigo-100 text-indigo-800',
  'Cancel': 'bg-red-100 text-red-800',
  'Follow Up': 'bg-purple-100 text-purple-800',
  'Confirmed': 'bg-green-100 text-green-800',
  'Postponed': 'bg-pink-100 text-pink-800',
  'Invalid': 'bg-red-100 text-red-800',
};

export default function QueriesTab({ queries }) {
  return (
    <div className="overflow-x-auto -mx-6">
      <table className="min-w-full divide-y divide-gray-200 font-medium">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Query ID</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Destination</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Travel Date</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Assigned To</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
            <th className="px-6 py-3"><span className="sr-only">Actions</span></th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {queries && queries.length > 0 ? (
            queries.map((q) => (
              <tr key={q._id} className="hover:bg-gray-50 transition">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-primary-600">
                  <Link to={`/queries/${q._id}`}>{q.queryId}</Link>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-950 font-semibold">
                  {q.destination}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {q.fromDate ? new Date(q.fromDate).toLocaleDateString() : 'TBD'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {q.assignedTo?.name || 'Unassigned'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full ${queryStatusColors[q.status] || 'bg-gray-100 text-gray-800'}`}>
                    {q.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                  <Link to={`/queries/${q._id}`} className="text-gray-400 hover:text-gray-600">
                    <Eye className="h-4 w-4" />
                  </Link>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" className="px-6 py-12 text-center text-sm text-gray-400 italic">
                No queries found for this agent.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
