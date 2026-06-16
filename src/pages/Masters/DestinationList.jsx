import React from 'react';
import { Plus, MapPin, Loader2, Trash2 } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getDestinations, deleteDestination } from '../../services/destinationService';
import { Link } from 'react-router-dom';

export default function DestinationList() {
  const queryClient = useQueryClient();
  const { data: destinations, isLoading } = useQuery({
    queryKey: ['destinations'],
    queryFn: getDestinations,
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => deleteDestination(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['destinations'] });
    },
  });

  if (isLoading) return <div className="flex justify-center py-12"><Loader2 className="animate-spin h-8 w-8 text-primary-600" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Destinations</h1>
        <Link 
          to="/masters/destinations/new" 
          className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
        >
          <Plus className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
          Add Destination
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {destinations?.map((dest) => (
          <div key={dest._id} className="bg-white shadow-sm rounded-lg border border-gray-200 p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="p-2 bg-primary-50 rounded-lg text-primary-600">
                  <MapPin className="h-6 w-6" />
                </div>
                <button 
                  onClick={() => { if(window.confirm('Delete destination?')) deleteMutation.mutate(dest._id); }}
                  className="text-gray-400 hover:text-red-600"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
              <h2 className="text-lg font-bold text-gray-900">{dest.name}</h2>
              <p className="text-sm text-gray-500 mb-4">{dest.state}, {dest.country}</p>
              <p className="text-sm text-gray-600 line-clamp-2">{dest.description || 'No description provided.'}</p>
            </div>
          </div>
        ))}
        {destinations?.length === 0 && (
          <div className="col-span-full py-12 bg-white rounded-lg border-2 border-dashed border-gray-300 text-center">
            <MapPin className="mx-auto h-12 w-12 text-gray-400" />
            <p className="mt-2 text-sm font-medium text-gray-900">No destinations found</p>
            <Link to="/masters/destinations/new" className="mt-4 inline-flex items-center text-primary-600 hover:text-primary-700">Add your first destination</Link>
          </div>
        )}
      </div>
    </div>
  );
}