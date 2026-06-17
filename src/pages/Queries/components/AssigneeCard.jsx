import React from 'react';

export default function AssigneeCard({ assignedTo }) {
  const initials = assignedTo?.name?.substring(0, 2).toUpperCase() || 'EX';

  return (
    <div className="bg-white shadow-sm rounded-lg border border-gray-200 p-6">
      <h2 className="text-lg font-medium text-gray-900 mb-4">Assigned To</h2>
      <div className="flex items-center">
        <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold">
          {initials}
        </div>
        <div className="ml-3">
          <p className="text-sm font-bold text-gray-900">{assignedTo?.name || 'Unassigned'}</p>
          <p className="text-xs text-gray-500">{assignedTo?.role?.name || 'Sales Executive'}</p>
        </div>
      </div>
      {!assignedTo && (
        <button className="mt-4 w-full inline-flex justify-center items-center px-4 py-2 border border-primary-600 text-sm font-medium rounded-md text-primary-600 bg-white hover:bg-primary-50">
          Assign Now
        </button>
      )}
    </div>
  );
}
