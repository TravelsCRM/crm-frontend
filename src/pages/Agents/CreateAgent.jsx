import React from 'react';
import { useForm } from 'react-hook-form';
import { ArrowLeft, Save, Loader2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createAgent } from '../../services/agentService';

export default function CreateAgent() {
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      commissionPercentage: 0
    }
  });
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (data) => createAgent(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['agents'] });
      navigate('/agents');
    },
  });

  const onSubmit = (data) => {
    // Convert commissionPercentage to a number
    if (data.commissionPercentage) {
      data.commissionPercentage = parseFloat(data.commissionPercentage);
    }
    mutation.mutate(data);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      <div className="flex items-center space-x-4">
        <Link to="/agents" className="p-2 text-gray-400 hover:text-gray-500 rounded-full hover:bg-gray-100">
          <ArrowLeft className="h-6 w-6" />
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">Add New Agent</h1>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="bg-white shadow-sm rounded-lg border border-gray-200 p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">Agency / Company Name <span className="text-red-500">*</span></label>
              <input 
                type="text" 
                {...register('companyName', { required: 'Company name is required' })} 
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm" 
              />
              {errors.companyName && <p className="mt-1 text-xs text-red-500">{errors.companyName.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Agent Name (Contact Person) <span className="text-red-500">*</span></label>
              <input 
                type="text" 
                {...register('agentName', { required: 'Agent name is required' })} 
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm" 
              />
              {errors.agentName && <p className="mt-1 text-xs text-red-500">{errors.agentName.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Mobile Number <span className="text-red-500">*</span></label>
              <input 
                type="tel" 
                {...register('mobile', { required: 'Mobile is required' })} 
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm" 
              />
              {errors.mobile && <p className="mt-1 text-xs text-red-500">{errors.mobile.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Email Address</label>
              <input type="email" {...register('email')} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">GST Number</label>
              <input type="text" {...register('gstNumber')} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Commission Percentage (%)</label>
              <input type="number" step="0.01" min="0" max="100" {...register('commissionPercentage')} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">City</label>
              <input type="text" {...register('city')} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm" />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700">Address</label>
              <textarea {...register('address')} rows={2} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm" />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700">Internal Notes</label>
              <textarea {...register('notes')} rows={2} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm" />
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-3">
          <Link to="/agents" className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
            Cancel
          </Link>
          <button 
            type="submit" 
            disabled={mutation.isPending}
            className="inline-flex justify-center items-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 disabled:opacity-50"
          >
            {mutation.isPending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
            Save Agent
          </button>
        </div>
      </form>
    </div>
  );
}
