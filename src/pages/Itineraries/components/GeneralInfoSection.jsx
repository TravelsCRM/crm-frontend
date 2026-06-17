import React from 'react';

export default function GeneralInfoSection({ register, destinations }) {
  return (
    <div className="bg-white shadow-sm rounded-lg border border-gray-200 p-6">
      <h2 className="text-lg font-medium text-gray-900 mb-6 border-b pb-2">General Information</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700">Itinerary Name <span className="text-red-500">*</span></label>
          <input 
            type="text" 
            {...register('name', { required: true })} 
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm" 
            placeholder="e.g. 5 Days Luxury Maldives Escape" 
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Destination <span className="text-red-500">*</span></label>
          <input 
            type="text" 
            list="destinations-list" 
            {...register('destination', { required: true })} 
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm" 
            placeholder="Select or type destination..." 
          />
          <datalist id="destinations-list">
            {destinations?.map(d => <option key={d._id} value={d.name} />)}
          </datalist>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Status</label>
          <select 
            {...register('status')} 
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
          >
            <option value="Draft">Draft</option>
            <option value="Final">Final</option>
            <option value="Template">Template</option>
          </select>
        </div>
        <div className="grid grid-cols-3 gap-4 md:col-span-2">
          <div>
            <label className="block text-sm font-medium text-gray-700">Adults</label>
            <input 
              type="number" 
              {...register('pax.adults')} 
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm" 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Children</label>
            <input 
              type="number" 
              {...register('pax.children')} 
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm" 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Infants</label>
            <input 
              type="number" 
              {...register('pax.infants')} 
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm" 
            />
          </div>
        </div>
      </div>
    </div>
  );
}
