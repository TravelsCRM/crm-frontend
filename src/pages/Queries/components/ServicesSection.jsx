import React from 'react';

export default function ServicesSection({ register }) {
  return (
    <div className="bg-white shadow-sm rounded-lg border border-gray-200 p-6">
      <h2 className="text-lg font-medium text-gray-900 mb-6 border-b pb-2">Services Required</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {['Full Package', 'Hotel Only', 'Transport Only', 'Activity Only', 'Custom Requirement'].map((service) => (
          <label key={service} className="relative flex items-start cursor-pointer select-none">
            <div className="flex h-5 items-center">
              <input
                type="checkbox"
                value={service}
                {...register('services')}
                className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500 cursor-pointer"
              />
            </div>
            <div className="ml-3 text-sm font-medium">
              <span className="text-gray-700">{service}</span>
            </div>
          </label>
        ))}
      </div>
    </div>
  );
}
