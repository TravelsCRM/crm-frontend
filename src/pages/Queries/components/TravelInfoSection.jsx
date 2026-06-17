import React from 'react';

export default function TravelInfoSection({ register }) {
  return (
    <div className="bg-white shadow-sm rounded-lg border border-gray-200 p-6">
      <h2 className="text-lg font-medium text-gray-900 mb-6 border-b pb-2">Travel Information</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">Destination <span className="text-red-500">*</span></label>
          <input 
            type="text" 
            {...register('destination', { required: true })} 
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm py-2 px-3 focus:outline-none" 
            placeholder="e.g. Maldives, Dubai" 
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Travel Month</label>
          <input 
            type="month" 
            {...register('travelMonth')} 
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm py-2 px-3 focus:outline-none" 
          />
        </div>
        <div></div>
        <div>
          <label className="block text-sm font-medium text-gray-700">From Date</label>
          <input 
            type="date" 
            {...register('fromDate')} 
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm py-2 px-3 focus:outline-none" 
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">To Date</label>
          <input 
            type="date" 
            {...register('toDate')} 
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm py-2 px-3 focus:outline-none" 
          />
        </div>
        <div></div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Adults (12+ yrs)</label>
          <input 
            type="number" 
            min="1" 
            {...register('adults')} 
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm py-2 px-3 focus:outline-none" 
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Children (2-12 yrs)</label>
          <input 
            type="number" 
            min="0" 
            {...register('children')} 
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm py-2 px-3 focus:outline-none" 
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Infants (0-2 yrs)</label>
          <input 
            type="number" 
            min="0" 
            {...register('infants')} 
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm py-2 px-3 focus:outline-none" 
          />
        </div>
      </div>
    </div>
  );
}
