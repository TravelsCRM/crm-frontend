import React from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { ArrowLeft, Save, Loader2, Plus, Trash2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { createHotel } from '../../services/hotelService';
import { getSuppliers } from '../../services/supplierService';
import { getDestinations } from '../../services/destinationService';

export default function CreateHotel() {
  const { register, control, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      rating: '3 Star',
      roomTypes: [{ name: 'Standard Room', basePrice: 0 }],
      mealPlans: ['CP']
    }
  });
  
  const { fields, append, remove } = useFieldArray({
    control,
    name: "roomTypes"
  });

  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: suppliers } = useQuery({
    queryKey: ['suppliers', 'Hotel'],
    queryFn: () => getSuppliers({ category: 'Hotel' }),
  });

  const { data: destinations } = useQuery({
    queryKey: ['destinations'],
    queryFn: () => getDestinations(),
  });

  const mutation = useMutation({
    mutationFn: (data) => createHotel(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['hotels'] });
      navigate('/masters/hotels');
    },
  });

  const onSubmit = (data) => {
    mutation.mutate(data);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      <div className="flex items-center space-x-4">
        <Link to="/masters/hotels" className="p-2 text-gray-400 hover:text-gray-500 rounded-full hover:bg-gray-100">
          <ArrowLeft className="h-6 w-6" />
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">Add New Hotel</h1>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        <div className="bg-white shadow-sm rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-6 border-b pb-2">Basic Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700">Hotel Name <span className="text-red-500">*</span></label>
              <input type="text" {...register('name', { required: true })} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Supplier / Vendor <span className="text-red-500">*</span></label>
              <select {...register('supplier', { required: true })} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm">
                <option value="">Select Supplier</option>
                {suppliers?.map(s => <option key={s._id} value={s._id}>{s.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Destination <span className="text-red-500">*</span></label>
              <select {...register('destination', { required: true })} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm">
                <option value="">Select Destination</option>
                {destinations?.map(d => <option key={d._id} value={d._id}>{d.name}, {d.state}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Rating</label>
              <select {...register('rating')} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm">
                <option value="5 Star">5 Star</option>
                <option value="4 Star">4 Star</option>
                <option value="3 Star">3 Star</option>
                <option value="2 Star">2 Star</option>
                <option value="1 Star">1 Star</option>
                <option value="Unrated">Unrated</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700">Address</label>
              <textarea {...register('address')} rows={2} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm" />
            </div>
          </div>
        </div>

        <div className="bg-white shadow-sm rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6 border-b pb-2">
            <h2 className="text-lg font-medium text-gray-900">Room Types & Pricing</h2>
            <button type="button" onClick={() => append({ name: '', basePrice: 0 })} className="text-sm text-primary-600 hover:text-primary-700 font-medium flex items-center">
              <Plus className="h-4 w-4 mr-1" /> Add Room Type
            </button>
          </div>
          <div className="space-y-4">
            {fields.map((field, index) => (
              <div key={field.id} className="flex items-center space-x-4">
                <div className="flex-1">
                  <input {...register(`roomTypes.${index}.name`)} placeholder="Room Name (e.g. Deluxe)" className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm" />
                </div>
                <div className="w-32">
                  <input type="number" {...register(`roomTypes.${index}.basePrice`)} placeholder="Price" className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm" />
                </div>
                <button type="button" onClick={() => remove(index)} className="text-gray-400 hover:text-red-600">
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white shadow-sm rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Meal Plans Supported</h2>
          <div className="flex space-x-6">
            {['EP', 'CP', 'MAP', 'AP'].map(plan => (
              <label key={plan} className="inline-flex items-center">
                <input type="checkbox" value={plan} {...register('mealPlans')} className="h-4 w-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500" />
                <span className="ml-2 text-sm text-gray-700 font-medium">{plan}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="flex justify-end space-x-3">
          <Link to="/masters/hotels" className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
            Cancel
          </Link>
          <button type="submit" disabled={mutation.isPending} className="inline-flex justify-center items-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 disabled:opacity-50">
            {mutation.isPending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
            Save Hotel
          </button>
        </div>
      </form>
    </div>
  );
}