import React from 'react';

export default function BasicInfoSection({ register }) {
  return (
    <div className="bg-white shadow-sm rounded-lg border border-gray-200 p-6">
      <h2 className="text-lg font-medium text-gray-900 mb-6 border-b pb-2">Basic Information</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">Query Type <span className="text-red-500">*</span></label>
          <select 
            {...register('queryType', { required: 'Type is required' })}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
          >
            <option value="Client">Direct Client</option>
            <option value="Agent">B2B Agent</option>
            <option value="Corporate">Corporate</option>
          </select>
        </div>
      </div>
    </div>
  );
}
