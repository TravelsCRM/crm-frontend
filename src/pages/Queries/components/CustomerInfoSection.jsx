import React, { useState, useEffect } from 'react';

export default function CustomerInfoSection({ register, queryType, setValue, clients, agents, corporates }) {
  const [isNewCustomer, setIsNewCustomer] = useState(true);
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  // Reset selected customer when queryType changes
  useEffect(() => {
    setSelectedCustomer(null);
    setValue('customerName', '');
    setValue('mobileNumber', '');
    setValue('email', '');
  }, [queryType, setValue]);

  return (
    <div className="bg-white shadow-sm rounded-lg border border-gray-200 p-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6 border-b pb-4">
        <h2 className="text-lg font-medium text-gray-900">Customer Information</h2>
        <div className="flex items-center space-x-6 font-medium">
          <label className="inline-flex items-center cursor-pointer">
            <input
              type="radio"
              className="form-radio text-primary-600 focus:ring-primary-500 h-4 w-4"
              name="customerSelectionType"
              checked={!isNewCustomer}
              onChange={() => {
                setIsNewCustomer(false);
                setSelectedCustomer(null);
                setValue('customerName', '');
                setValue('mobileNumber', '');
                setValue('email', '');
              }}
            />
            <span className="ml-2 text-sm text-gray-700">Select Existing</span>
          </label>
          <label className="inline-flex items-center cursor-pointer">
            <input
              type="radio"
              className="form-radio text-primary-600 focus:ring-primary-500 h-4 w-4"
              name="customerSelectionType"
              checked={isNewCustomer}
              onChange={() => {
                setIsNewCustomer(true);
                setSelectedCustomer(null);
                setValue('customerName', '');
                setValue('mobileNumber', '');
                setValue('email', '');
              }}
            />
            <span className="ml-2 text-sm text-gray-700">Create New</span>
          </label>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {!isNewCustomer && (
          <div className="col-span-1 md:col-span-4 bg-gray-50 p-4 rounded-md border border-gray-200 mb-2">
            <label className="block text-sm font-medium text-gray-700">
              Select Existing {queryType === 'Client' ? 'Client' : queryType === 'Agent' ? 'B2B Agent' : 'Corporate'} <span className="text-red-500">*</span>
            </label>
            <select
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md bg-white shadow-sm focus:outline-none"
              onChange={(e) => {
                const id = e.target.value;
                let customer = null;
                if (queryType === 'Client') {
                  customer = clients?.find(c => c._id === id);
                  if (customer) {
                    setValue('customerName', customer.name);
                    setValue('mobileNumber', customer.mobile);
                    setValue('email', customer.email || '');
                  }
                } else if (queryType === 'Agent') {
                  customer = agents?.find(a => a._id === id);
                  if (customer) {
                    setValue('customerName', customer.agentName);
                    setValue('mobileNumber', customer.mobile);
                    setValue('email', customer.email || '');
                  }
                } else if (queryType === 'Corporate') {
                  customer = corporates?.find(c => c._id === id);
                  if (customer) {
                    setValue('customerName', customer.companyName);
                    setValue('mobileNumber', customer.mobile);
                    setValue('email', customer.email || '');
                  }
                }
                setSelectedCustomer(customer);
              }}
              value={selectedCustomer?._id || ''}
              required={!isNewCustomer}
            >
              <option value="">-- Select {queryType === 'Client' ? 'Client' : queryType === 'Agent' ? 'Agent' : 'Corporate'} --</option>
              {queryType === 'Client' && clients?.map(c => (
                <option key={c._id} value={c._id}>{c.name} ({c.mobile})</option>
              ))}
              {queryType === 'Agent' && agents?.map(a => (
                <option key={a._id} value={a._id}>{a.agentName} - {a.companyName} ({a.mobile})</option>
              ))}
              {queryType === 'Corporate' && corporates?.map(c => (
                <option key={c._id} value={c._id}>{c.companyName} (Contact: {c.contactPerson}) ({c.mobile})</option>
              ))}
            </select>
          </div>
        )}

        <div className="col-span-1">
          <label className="block text-sm font-medium text-gray-700">Title</label>
          <select 
            {...register('title')} 
            disabled={!isNewCustomer}
            className={`mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm py-2 px-3 focus:outline-none ${
              !isNewCustomer ? 'bg-gray-50 text-gray-500 cursor-not-allowed' : ''
            }`}
          >
            <option value="Mr">Mr.</option>
            <option value="Mrs">Mrs.</option>
            <option value="Ms">Ms.</option>
            <option value="Dr">Dr.</option>
          </select>
        </div>
        <div className="col-span-3 md:col-span-1">
          <label className="block text-sm font-medium text-gray-700">Customer Name <span className="text-red-500">*</span></label>
          <input 
            type="text" 
            {...register('customerName', { required: true })} 
            readOnly={!isNewCustomer}
            className={`mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm py-2 px-3 focus:outline-none ${
              !isNewCustomer ? 'bg-gray-50 text-gray-500 cursor-not-allowed focus:ring-0 focus:border-gray-300' : ''
            }`} 
          />
        </div>
        <div className="col-span-1 md:col-span-1">
          <label className="block text-sm font-medium text-gray-700">Mobile Number <span className="text-red-500">*</span></label>
          <input 
            type="tel" 
            {...register('mobileNumber', { required: true })} 
            readOnly={!isNewCustomer}
            className={`mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm py-2 px-3 focus:outline-none ${
              !isNewCustomer ? 'bg-gray-50 text-gray-500 cursor-not-allowed focus:ring-0 focus:border-gray-300' : ''
            }`} 
          />
        </div>
        <div className="col-span-1 md:col-span-1">
          <label className="block text-sm font-medium text-gray-700">Email Address</label>
          <input 
            type="email" 
            {...register('email')} 
            readOnly={!isNewCustomer}
            className={`mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm py-2 px-3 focus:outline-none ${
              !isNewCustomer ? 'bg-gray-50 text-gray-500 cursor-not-allowed focus:ring-0 focus:border-gray-300' : ''
            }`} 
          />
        </div>
      </div>
    </div>
  );
}
