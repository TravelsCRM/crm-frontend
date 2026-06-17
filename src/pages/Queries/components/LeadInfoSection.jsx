import React from 'react';

export default function LeadInfoSection({ register, users }) {
  return (
    <div className="bg-white shadow-sm rounded-lg border border-gray-200 p-6">
      <h2 className="text-lg font-medium text-gray-900 mb-6 border-b pb-2">Lead Information</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">Lead Source</label>
          <select 
            {...register('leadSource')} 
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm py-2 px-3 focus:outline-none"
          >
            <option value="Website">Website</option>
            <option value="Reference">Reference</option>
            <option value="Walk-in">Walk-in</option>
            <option value="Facebook">Facebook</option>
            <option value="Instagram">Instagram</option>
            <option value="JustDial">JustDial</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Priority</label>
          <select 
            {...register('priority')} 
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm py-2 px-3 focus:outline-none"
          >
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Assign To</label>
          <select 
            {...register('assignedTo')} 
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm py-2 px-3 focus:outline-none bg-white"
          >
            <option value="">Select Executive</option>
            {users?.map(user => (
              <option key={user._id} value={user._id}>{user.name} ({user.role?.name})</option>
            ))}
          </select>
        </div>
        <div className="col-span-1 md:col-span-3">
          <label className="block text-sm font-medium text-gray-700">Remarks</label>
          <textarea 
            {...register('remarks')} 
            rows={3} 
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm py-2 px-3 focus:outline-none"
            placeholder="Any special requirements..."
          />
        </div>
      </div>
    </div>
  );
}
