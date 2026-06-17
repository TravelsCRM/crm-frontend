import React from 'react';
import { useForm } from 'react-hook-form';
import { ArrowLeft, Save, Loader2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { createQuery } from '../../services/queryService';
import { getUsers } from '../../services/userService';
import { getClients } from '../../services/clientService';
import { getAgents } from '../../services/agentService';
import { getCorporates } from '../../services/corporateService';

// Import subcomponents
import BasicInfoSection from './components/BasicInfoSection';
import CustomerInfoSection from './components/CustomerInfoSection';
import TravelInfoSection from './components/TravelInfoSection';
import ServicesSection from './components/ServicesSection';
import LeadInfoSection from './components/LeadInfoSection';

export default function CreateQuery() {
  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm({
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
  
  const queryType = watch('queryType');

  // Fetch users for assignment
  const { data: users, isLoading: usersLoading } = useQuery({
    queryKey: ['users'],
    queryFn: () => getUsers(),
  });

  // Fetch existing clients, agents, corporates
  const { data: clients } = useQuery({
    queryKey: ['clients'],
    queryFn: () => getClients(),
    enabled: queryType === 'Client',
  });

  const { data: agents } = useQuery({
    queryKey: ['agents'],
    queryFn: () => getAgents(),
    enabled: queryType === 'Agent',
  });

  const { data: corporates } = useQuery({
    queryKey: ['corporates'],
    queryFn: () => getCorporates(),
    enabled: queryType === 'Corporate',
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
        <BasicInfoSection register={register} />

        {/* Customer Information */}
        <CustomerInfoSection 
          register={register}
          queryType={queryType}
          setValue={setValue}
          clients={clients}
          agents={agents}
          corporates={corporates}
        />

        {/* Travel Information */}
        <TravelInfoSection register={register} />

        {/* Services Required */}
        <ServicesSection register={register} />

        {/* Lead Info */}
        <LeadInfoSection 
          register={register}
          users={users}
        />

        <div className="flex justify-end space-x-3">
          <Link to="/queries" className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-semibold rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition">
            Cancel
          </Link>
          <button 
            type="submit" 
            disabled={mutation.isPending}
            className="inline-flex justify-center items-center py-2 px-4 border border-transparent shadow-sm text-sm font-semibold rounded-lg text-white bg-primary-600 hover:bg-primary-700 transition disabled:opacity-50"
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