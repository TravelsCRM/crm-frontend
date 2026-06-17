import React, { useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { ArrowLeft, Save, Plus, Trash2, GripVertical, Loader2 } from 'lucide-react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { createItinerary, getItineraryById, updateItinerary } from '../../services/itineraryService';
import { getDestinations } from '../../services/destinationService';
import { getHotels } from '../../services/hotelService';
import { getActivities } from '../../services/activityService';

export default function ItineraryBuilder() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { register, control, handleSubmit, reset, watch, setValue, formState: { errors } } = useForm({
    defaultValues: {
      name: '',
      destination: '',
      status: 'Draft',
      pax: { adults: 2, children: 0, infants: 0 },
      days: [
        { dayNumber: 1, title: 'Arrival', description: '', hotel: '', transfers: '', activities: '', meals: { breakfast: true, lunch: false, dinner: false }, notes: '' }
      ]
    }
  });

  const { fields, append, remove, move } = useFieldArray({
    control,
    name: "days"
  });

  // Fetch Master Data
  const { data: destinations } = useQuery({
    queryKey: ['destinations'],
    queryFn: getDestinations,
  });

  const { data: hotels } = useQuery({
    queryKey: ['hotels'],
    queryFn: () => getHotels(),
  });

  const { data: allActivities } = useQuery({
    queryKey: ['activities'],
    queryFn: () => getActivities(),
  });

  // Fetch data if editing
  const { data, isLoading: dataLoading } = useQuery({
    queryKey: ['itinerary', id],
    queryFn: () => getItineraryById(id),
    enabled: isEdit,
  });

  useEffect(() => {
    if (data) {
      reset({
        ...data.itinerary,
        days: data.days.length > 0 ? data.days.map(d => ({
          ...d,
          hotel: d.hotel?._id || d.hotel || '',
        })) : [
          { dayNumber: 1, title: 'Arrival', description: '', hotel: '', transfers: '', activities: '', meals: { breakfast: true, lunch: false, dinner: false }, notes: '' }
        ]
      });
    }
  }, [data, reset]);

  const mutation = useMutation({
    mutationFn: (formData) => isEdit ? updateItinerary(id, formData) : createItinerary(formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['itineraries'] });
      navigate('/itineraries');
    },
  });

  const onSubmit = (formData) => {
    const submissionData = {
      ...formData,
      days: formData.days.map((day, index) => {
        const cleanedDay = {
          ...day,
          dayNumber: index + 1
        };
        if (!cleanedDay.hotel || cleanedDay.hotel === '') {
          delete cleanedDay.hotel;
        }
        return cleanedDay;
      })
    };
    mutation.mutate(submissionData);
  };

  if (isEdit && dataLoading) return <div className="flex justify-center py-12"><Loader2 className="animate-spin h-8 w-8 text-primary-600" /></div>;

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-20">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link to="/itineraries" className="p-2 text-gray-400 hover:text-gray-500 rounded-full hover:bg-gray-100">
            <ArrowLeft className="h-6 w-6" />
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">{isEdit ? 'Edit Itinerary' : 'Create New Itinerary'}</h1>
        </div>
        <div className="flex space-x-3">
          <button 
            type="button"
            onClick={handleSubmit(onSubmit)}
            disabled={mutation.isPending}
            className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
          >
            {mutation.isPending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
            {isEdit ? 'Update Itinerary' : 'Save Itinerary'}
          </button>
        </div>
      </div>

      <form className="space-y-8">
        {/* General Info */}
        <div className="bg-white shadow-sm rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-6 border-b pb-2">General Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700">Itinerary Name <span className="text-red-500">*</span></label>
              <input type="text" {...register('name', { required: true })} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm" placeholder="e.g. 5 Days Luxury Maldives Escape" />
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
              <select {...register('status')} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm">
                <option value="Draft">Draft</option>
                <option value="Final">Final</option>
                <option value="Template">Template</option>
              </select>
            </div>
            <div className="grid grid-cols-3 gap-4 md:col-span-2">
              <div>
                <label className="block text-sm font-medium text-gray-700">Adults</label>
                <input type="number" {...register('pax.adults')} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Children</label>
                <input type="number" {...register('pax.children')} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Infants</label>
                <input type="number" {...register('pax.infants')} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm" />
              </div>
            </div>
          </div>
        </div>

        {/* Day-wise Builder */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">Day-wise Itinerary</h2>
            <button 
              type="button"
              onClick={() => append({ dayNumber: fields.length + 1, title: '', description: '', hotel: '', transfers: '', activities: '', meals: { breakfast: false, lunch: false, dinner: false }, notes: '' })}
              className="inline-flex items-center px-3 py-1.5 border border-primary-600 text-sm font-medium rounded text-primary-600 bg-white hover:bg-primary-50"
            >
              <Plus className="h-4 w-4 mr-1.5" />
              Add Day
            </button>
          </div>

          <div className="space-y-4">
            {fields.map((field, index) => (
              <div key={field.id} className="bg-white shadow-sm rounded-lg border border-gray-200 overflow-hidden">
                <div className="px-6 py-3 border-b border-gray-200 bg-gray-50 flex items-center justify-between">
                  <div className="flex items-center">
                    <GripVertical className="h-5 w-5 text-gray-400 mr-3 cursor-move" />
                    <span className="text-lg font-bold text-primary-700 mr-4 font-mono">Day {index + 1}</span>
                    <input 
                      type="text" 
                      {...register(`days.${index}.title`, { required: true })} 
                      className="bg-transparent border-none focus:ring-0 text-lg font-medium text-gray-900 p-0 w-full" 
                      placeholder="Title (e.g. Arrival and Beach Dinner)"
                    />
                  </div>
                  <button 
                    type="button" 
                    onClick={() => remove(index)}
                    className="text-gray-400 hover:text-red-600"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
                <div className="p-6 space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea 
                      {...register(`days.${index}.description`)} 
                      rows={3} 
                      className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                      placeholder="What happens on this day?"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1 text-[11px] uppercase font-bold tracking-wider">Accommodation</label>
                      <select 
                        {...register(`days.${index}.hotel`)} 
                        className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                      >
                        <option value="">Select Hotel (or leave for custom)</option>
                        {hotels?.map(h => <option key={h._id} value={h._id}>{h.name} ({h.rating})</option>)}
                      </select>
                      <input 
                        type="text" 
                        {...register(`days.${index}.hotelCustom`)} 
                        className="mt-2 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm italic"
                        placeholder="Or enter custom hotel name..."
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1 text-[11px] uppercase font-bold tracking-wider">Transfers</label>
                      <input 
                        type="text" 
                        {...register(`days.${index}.transfers`)} 
                        className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                        placeholder="Pick up, drop, flights etc"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1 text-[11px] uppercase font-bold tracking-wider">Activities</label>
                      <select 
                        {...register(`days.${index}.activities`)} 
                        className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                      >
                        <option value="">Select Activity</option>
                        {allActivities?.map(a => <option key={a._id} value={a.name}>{a.name} (₹{a.basePrice})</option>)}
                      </select>
                      <input 
                        type="text" 
                        {...register(`days.${index}.activitiesCustom`)} 
                        className="mt-2 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm italic"
                        placeholder="Or enter custom activities..."
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2 text-[11px] uppercase font-bold tracking-wider">Meals Included</label>
                      <div className="flex space-x-4 mt-1">
                        <label className="inline-flex items-center">
                          <input type="checkbox" {...register(`days.${index}.meals.breakfast`)} className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500" />
                          <span className="ml-2 text-sm text-gray-700">Breakfast</span>
                        </label>
                        <label className="inline-flex items-center">
                          <input type="checkbox" {...register(`days.${index}.meals.lunch`)} className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500" />
                          <span className="ml-2 text-sm text-gray-700">Lunch</span>
                        </label>
                        <label className="inline-flex items-center">
                          <input type="checkbox" {...register(`days.${index}.meals.dinner`)} className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500" />
                          <span className="ml-2 text-sm text-gray-700">Dinner</span>
                        </label>
                      </div>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1 text-[11px] uppercase font-bold tracking-wider text-gray-400">Notes for this day</label>
                    <input 
                      type="text" 
                      {...register(`days.${index}.notes`)} 
                      className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm italic"
                      placeholder="Additional notes..."
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <button 
            type="button"
            onClick={() => append({ dayNumber: fields.length + 1, title: '', description: '', hotel: '', transfers: '', activities: '', meals: { breakfast: false, lunch: false, dinner: false }, notes: '' })}
            className="w-full py-4 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:text-primary-600 hover:border-primary-400 flex flex-col items-center justify-center transition-colors"
          >
            <Plus className="h-8 w-8 mb-1" />
            <span className="font-medium">Add Next Day</span>
          </button>
        </div>
      </form>
    </div>
  );
}