import React, { useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { ArrowLeft, Save, Plus, Loader2 } from 'lucide-react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { createItinerary, getItineraryById, updateItinerary } from '../../services/itineraryService';
import { getDestinations } from '../../services/destinationService';
import { getHotels } from '../../services/hotelService';
import { getActivities } from '../../services/activityService';

// Import subcomponents
import GeneralInfoSection from './components/GeneralInfoSection';
import DayItemCard from './components/DayItemCard';

export default function ItineraryBuilder() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { register, control, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm({
    defaultValues: {
      name: '',
      destination: '',
      status: 'Draft',
      pax: { adults: 2, children: 0, infants: 0 },
      days: [
        { dayNumber: 1, title: 'Arrival', description: '', hotel: '', transfers: '', activities: '', meals: { breakfast: true, lunch: false, dinner: false }, notes: '', image: '' }
      ]
    }
  });

  const { fields, append, remove } = useFieldArray({
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
  const { data: itineraryData, isLoading: dataLoading } = useQuery({
    queryKey: ['itinerary', id],
    queryFn: () => getItineraryById(id),
    enabled: isEdit,
  });

  useEffect(() => {
    if (itineraryData) {
      reset({
        ...itineraryData.itinerary,
        days: itineraryData.days.length > 0 ? itineraryData.days.map(d => ({
          ...d,
          hotel: d.hotel?._id || d.hotel || '',
          image: d.image || '',
        })) : [
          { dayNumber: 1, title: 'Arrival', description: '', hotel: '', transfers: '', activities: '', meals: { breakfast: true, lunch: false, dinner: false }, notes: '', image: '' }
        ]
      });
    }
  }, [itineraryData, reset]);

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
      days: formData.days.map((day, index) => ({
        ...day,
        dayNumber: index + 1
      }))
    };
    mutation.mutate(submissionData);
  };

  if (isEdit && dataLoading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="animate-spin h-8 w-8 text-primary-600" />
      </div>
    );
  }

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
            className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-semibold rounded-lg text-white bg-primary-600 hover:bg-primary-700 transition disabled:opacity-50"
          >
            {mutation.isPending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
            {isEdit ? 'Update Itinerary' : 'Save Itinerary'}
          </button>
        </div>
      </div>

      <form className="space-y-8">
        {/* General Info */}
        <GeneralInfoSection 
          register={register}
          destinations={destinations}
        />

        {/* Day-wise Builder */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">Day-wise Itinerary</h2>
            <button 
              type="button"
              onClick={() => append({ dayNumber: fields.length + 1, title: '', description: '', hotel: '', transfers: '', activities: '', meals: { breakfast: false, lunch: false, dinner: false }, notes: '', image: '' })}
              className="inline-flex items-center px-3 py-1.5 border border-primary-600 text-sm font-semibold rounded-lg text-primary-600 bg-white hover:bg-primary-50 transition"
            >
              <Plus className="h-4 w-4 mr-1.5" />
              Add Day
            </button>
          </div>

          <div className="space-y-4">
            {fields.map((field, index) => (
              <DayItemCard 
                key={field.id}
                index={index}
                register={register}
                setValue={setValue}
                watch={watch}
                remove={remove}
                hotels={hotels}
                allActivities={allActivities}
              />
            ))}
          </div>

          <button 
            type="button"
            onClick={() => append({ dayNumber: fields.length + 1, title: '', description: '', hotel: '', transfers: '', activities: '', meals: { breakfast: false, lunch: false, dinner: false }, notes: '', image: '' })}
            className="w-full py-4 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:text-primary-600 hover:border-primary-400 flex flex-col items-center justify-center transition"
          >
            <Plus className="h-8 w-8 mb-1" />
            <span className="font-semibold">Add Next Day</span>
          </button>
        </div>
      </form>
    </div>
  );
}