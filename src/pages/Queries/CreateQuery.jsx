import React from 'react';
import { useForm } from 'react-hook-form';
import { ArrowLeft, Save, Loader2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { createQuery } from '../../services/queryService';
import { getUsers } from '../../services/userService';

export default function CreateQuery() {
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      queryType: 'Client',
      services: [],
      adults: 2,
      children: 0,
      infants: 0,
      priority: 'Medium',
      leadSource: 'Website'
    }
  });
  
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Fetch users for assignment
  const { data: users, isLoading: usersLoading } = useQuery({
    queryKey: ['users'],
    queryFn: () => getUsers(),
  });

  const mutation = useMutation({
    mutationFn: (data) => createQuery(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['queries'] });
      navigate('/queries');
    },
  });

  const onSubmit = (data) => {
    mutation.mutate(data);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      <div className="flex items-center space-x-4">
        <Link to="/queries" className="p-2 text-gray-400 hover:text-gray-500 rounded-full hover:bg-gray-100">
          <ArrowLeft className="h-6 w-6" />
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">Add New Query</h1>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        
        {/* Basic Info */}
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

        {/* Customer Information */}
        <div className="bg-white shadow-sm rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-6 border-b pb-2">Customer Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="col-span-1">
              <label className="block text-sm font-medium text-gray-700">Title</label>
              <select {...register('title')} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm">
                <option value="Mr">Mr.</option>
                <option value="Mrs">Mrs.</option>
                <option value="Ms">Ms.</option>
                <option value="Dr">Dr.</option>
              </select>
            </div>
            <div className="col-span-3 md:col-span-1">
              <label className="block text-sm font-medium text-gray-700">Customer Name <span className="text-red-500">*</span></label>
              <input type="text" {...register('customerName', { required: true })} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm" />
            </div>
            <div className="col-span-1 md:col-span-1">
              <label className="block text-sm font-medium text-gray-700">Mobile Number <span className="text-red-500">*</span></label>
              <input type="tel" {...register('mobileNumber', { required: true })} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm" />
            </div>
            <div className="col-span-1 md:col-span-1">
              <label className="block text-sm font-medium text-gray-700">Email Address</label>
              <input type="email" {...register('email')} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm" />
            </div>
          </div>
        </div>

        {/* Travel Information */}
        <div className="bg-white shadow-sm rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-6 border-b pb-2">Travel Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">Destination <span className="text-red-500">*</span></label>
              <input type="text" {...register('destination', { required: true })} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm" placeholder="e.g. Maldives, Dubai" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Travel Month</label>
              <input type="month" {...register('travelMonth')} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm" />
            </div>
            <div></div>
            <div>
              <label className="block text-sm font-medium text-gray-700">From Date</label>
              <input type="date" {...register('fromDate')} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">To Date</label>
              <input type="date" {...register('toDate')} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm" />
            </div>
            <div></div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Adults (12+ yrs)</label>
              <input type="number" min="1" {...register('adults')} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Children (2-12 yrs)</label>
              <input type="number" min="0" {...register('children')} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Infants (0-2 yrs)</label>
              <input type="number" min="0" {...register('infants')} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm" />
            </div>
          </div>
        </div>

        {/* Services */}
        <div className="bg-white shadow-sm rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-6 border-b pb-2">Services Required</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {['Full Package', 'Hotel Only', 'Transport Only', 'Activity Only', 'Custom Requirement'].map((service) => (
              <label key={service} className="relative flex items-start">
                <div className="flex h-5 items-center">
                  <input
                    type="checkbox"
                    value={service}
                    {...register('services')}
                    className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                </div>
                <div className="ml-3 text-sm">
                  <span className="font-medium text-gray-700">{service}</span>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Lead Info */}
        <div className="bg-white shadow-sm rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-6 border-b pb-2">Lead Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">Lead Source</label>
              <select {...register('leadSource')} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm">
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
              <select {...register('priority')} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm">
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Assign To</label>
              <select {...register('assignedTo')} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm">
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
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                placeholder="Any special requirements..."
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-3">
          <Link to="/queries" className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
            Cancel
          </Link>
          <button 
            type="submit" 
            disabled={mutation.isPending}
            className="inline-flex justify-center items-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
          >
            {mutation.isPending ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Save Query
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}