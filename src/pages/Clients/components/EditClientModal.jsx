import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { X, Loader2 } from 'lucide-react';

export default function EditClientModal({ isOpen, onClose, client, onEditSubmit, isPending, isError, error }) {
  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  useEffect(() => {
    if (client && isOpen) {
      reset({
        name: client.name || '',
        mobile: client.mobile || '',
        alternateMobile: client.alternateMobile || '',
        email: client.email || '',
        city: client.city || '',
        address: client.address || '',
        dob: client.dob ? new Date(client.dob).toISOString().split('T')[0] : '',
        anniversary: client.anniversary ? new Date(client.anniversary).toISOString().split('T')[0] : '',
        notes: client.notes || ''
      });
    }
  }, [client, reset, isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-xl shadow-2xl border border-gray-200 w-full max-w-2xl overflow-hidden max-h-[90vh] flex flex-col animate-in fade-in zoom-in-95 duration-150">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between bg-gray-50">
          <h2 className="text-lg font-bold text-gray-900">Edit Client Profile</h2>
          <button 
            type="button"
            onClick={onClose} 
            className="text-gray-400 hover:text-gray-600 p-1.5 rounded-full hover:bg-gray-200 transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Modal Form Body */}
        <form onSubmit={handleSubmit(onEditSubmit)} className="flex-1 overflow-y-auto p-6 space-y-4">
          {isError && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-md font-medium">
              {error?.response?.data?.message || 'Failed to update client details.'}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700">Full Name <span className="text-red-500">*</span></label>
              <input 
                type="text" 
                {...register('name', { required: 'Name is required' })} 
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm py-2 px-3 focus:outline-none" 
              />
              {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Mobile Number <span className="text-red-500">*</span></label>
              <input 
                type="tel" 
                {...register('mobile', { required: 'Mobile is required' })} 
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm py-2 px-3 focus:outline-none" 
              />
              {errors.mobile && <p className="mt-1 text-xs text-red-500">{errors.mobile.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Alternate Mobile</label>
              <input 
                type="tel" 
                {...register('alternateMobile')} 
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm py-2 px-3 focus:outline-none" 
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Email Address</label>
              <input 
                type="email" 
                {...register('email')} 
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm py-2 px-3 focus:outline-none" 
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">City</label>
              <input 
                type="text" 
                {...register('city')} 
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm py-2 px-3 focus:outline-none" 
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700">Address</label>
              <textarea 
                {...register('address')} 
                rows={2} 
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm py-2 px-3 focus:outline-none" 
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Date of Birth</label>
              <input 
                type="date" 
                {...register('dob')} 
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm py-2 px-3 focus:outline-none" 
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Anniversary</label>
              <input 
                type="date" 
                {...register('anniversary')} 
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm py-2 px-3 focus:outline-none" 
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700">Internal Notes</label>
              <textarea 
                {...register('notes')} 
                rows={2} 
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm py-2 px-3 focus:outline-none" 
              />
            </div>
          </div>

          {/* Modal Footer */}
          <div className="pt-4 border-t border-gray-200 flex justify-end space-x-3 bg-white">
            <button 
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={isPending}
              className="inline-flex justify-center items-center px-4 py-2 border border-transparent shadow-sm text-sm font-semibold rounded-lg text-white bg-primary-600 hover:bg-primary-700 transition disabled:opacity-50"
            >
              {isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                'Save Changes'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
