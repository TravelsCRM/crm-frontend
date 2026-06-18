import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  ArrowLeft, 
  Edit, 
  Copy, 
  Calendar, 
  Users, 
  MapPin, 
  Compass, 
  Loader2, 
  FileText, 
  Hotel as HotelIcon, 
  Car 
} from 'lucide-react';
import { getItineraryById, cloneItinerary } from '../../services/itineraryService';

export default function ItineraryDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Fetch single itinerary details
  const { data, isLoading, error } = useQuery({
    queryKey: ['itinerary', id],
    queryFn: () => getItineraryById(id),
  });

  // Clone mutation
  const cloneMutation = useMutation({
    mutationFn: () => cloneItinerary(id),
    onSuccess: (cloned) => {
      queryClient.invalidateQueries({ queryKey: ['itineraries'] });
      navigate(`/itineraries/${cloned._id}`);
    },
    onError: () => {
      alert('Failed to clone itinerary');
    }
  });

  const getBackendUrl = (path) => {
    if (!path) return '';
    if (path.startsWith('http')) return path;
    const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:5002/api';
    const host = apiBase.replace(/\/api$/, '');
    return `${host}${path}`;
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return 'TBD';
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return 'TBD';
    return d.toLocaleDateString();
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center text-red-700">
        Itinerary not found or failed to load.
      </div>
    );
  }

  const { itinerary, days } = data;

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20">
      {/* Top Header Row */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center space-x-3">
          <Link 
            to="/itineraries" 
            className="p-2 text-gray-400 hover:text-gray-500 rounded-full hover:bg-gray-100 transition"
          >
            <ArrowLeft className="h-6 w-6" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{itinerary.name}</h1>
            <span className="text-sm text-gray-500 flex items-center mt-0.5">
              <MapPin className="h-3.5 w-3.5 mr-1" />
              {itinerary.destination}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Link
            to={`/itineraries/${itinerary._id}/edit`}
            className="flex-1 sm:flex-none inline-flex items-center justify-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-semibold rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition"
          >
            <Edit className="h-4 w-4 mr-1.5" />
            Edit Itinerary
          </Link>
          <button
            onClick={() => cloneMutation.mutate()}
            disabled={cloneMutation.isPending}
            className="flex-1 sm:flex-none inline-flex items-center justify-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-semibold rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition disabled:opacity-50"
          >
            {cloneMutation.isPending ? <Loader2 className="h-4 w-4 mr-1.5 animate-spin" /> : <Copy className="h-4 w-4 mr-1.5" />}
            Clone
          </button>
        </div>
      </div>

      {/* General Information Card */}
      <div className="bg-white shadow-sm rounded-lg border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 border-b pb-2 mb-4">Itinerary Information</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-lg bg-primary-50 text-primary-600">
              <Calendar className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs text-gray-400 font-medium">Travel Dates</p>
              <p className="text-sm font-semibold text-gray-800">
                {itinerary.travelDates?.from ? (
                  <>
                    {formatDate(itinerary.travelDates.from)}
                    {itinerary.travelDates.to && ` to ${formatDate(itinerary.travelDates.to)}`}
                  </>
                ) : 'TBD'}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-lg bg-primary-50 text-primary-600">
              <Users className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs text-gray-400 font-medium">Passengers (PAX)</p>
              <p className="text-sm font-semibold text-gray-800">
                {itinerary.pax?.adults || 0} A, {itinerary.pax?.children || 0} C, {itinerary.pax?.infants || 0} I
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-lg bg-primary-50 text-primary-600">
              <FileText className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs text-gray-400 font-medium">Status</p>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold mt-0.5 ${
                itinerary.status === 'Final' ? 'bg-green-100 text-green-700' :
                itinerary.status === 'Template' ? 'bg-indigo-100 text-indigo-700' : 'bg-yellow-100 text-yellow-700'
              }`}>
                {itinerary.status}
              </span>
            </div>
          </div>
        </div>

        {itinerary.notes && (
          <div className="mt-6 pt-4 border-t border-gray-100">
            <p className="text-xs text-gray-400 font-medium mb-1">General Notes</p>
            <p className="text-sm text-gray-600 italic">{itinerary.notes}</p>
          </div>
        )}
      </div>

      {/* Day-by-Day Timeline */}
      <div className="space-y-6">
        <h2 className="text-xl font-bold text-gray-900">Day-wise Plan</h2>
        
        <div className="space-y-6">
          {days && days.length > 0 ? (
            days.map((day, idx) => (
              <div key={day._id} className="bg-white shadow-sm rounded-lg border border-gray-200 overflow-hidden flex flex-col md:flex-row">
                
                {/* Left side: Day Photo */}
                {day.image && (
                  <div className="w-full md:w-64 h-48 md:h-auto flex-shrink-0 relative overflow-hidden bg-gray-50 border-r border-gray-100">
                    <img 
                      src={getBackendUrl(day.image)} 
                      alt={`Day ${day.dayNumber} Photo`} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                {/* Right side: Day Info */}
                <div className="flex-1 p-6 space-y-4">
                  <div className="flex items-center justify-between border-b pb-2">
                    <div className="flex items-baseline space-x-2">
                      <span className="text-lg font-bold text-primary-700 font-mono">Day {day.dayNumber}</span>
                      <h3 className="text-lg font-semibold text-gray-900">{day.title}</h3>
                    </div>
                  </div>

                  <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-wrap">{day.description}</p>

                  {/* Day details */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-gray-50">
                    {/* Accommodation */}
                    {(day.hotel || day.hotelCustom) && (
                      <div className="flex items-start space-x-2">
                        <HotelIcon className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
                        <div className="text-xs">
                          <p className="text-gray-400 font-medium">Accommodation</p>
                          <p className="text-gray-800 font-semibold">
                            {day.hotel ? `${day.hotel.name} (${day.hotel.rating})` : day.hotelCustom}
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Transfers */}
                    {day.transfers && (
                      <div className="flex items-start space-x-2">
                        <Car className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
                        <div className="text-xs">
                          <p className="text-gray-400 font-medium">Transfers / Flights</p>
                          <p className="text-gray-800 font-semibold">{day.transfers}</p>
                        </div>
                      </div>
                    )}

                    {/* Activities */}
                    {(day.activities || day.activitiesCustom) && (
                      <div className="flex items-start space-x-2">
                        <Compass className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
                        <div className="text-xs">
                          <p className="text-gray-400 font-medium">Sightseeing / Activities</p>
                          <p className="text-gray-800 font-semibold">
                            {day.activities || day.activitiesCustom}
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Meals Included */}
                    {(day.meals?.breakfast || day.meals?.lunch || day.meals?.dinner) && (
                      <div className="flex items-start space-x-2">
                        <div className="h-4 w-4 flex items-center justify-center text-gray-400 font-bold mt-0.5 flex-shrink-0 text-sm">🍽️</div>
                        <div className="text-xs">
                          <p className="text-gray-400 font-medium">Meals Included</p>
                          <div className="flex items-center gap-1.5 mt-0.5">
                            {day.meals.breakfast && <span className="px-1.5 py-0.5 bg-green-50 text-green-700 border border-green-200 rounded text-[9px] font-bold">Breakfast</span>}
                            {day.meals.lunch && <span className="px-1.5 py-0.5 bg-green-50 text-green-700 border border-green-200 rounded text-[9px] font-bold">Lunch</span>}
                            {day.meals.dinner && <span className="px-1.5 py-0.5 bg-green-50 text-green-700 border border-green-200 rounded text-[9px] font-bold">Dinner</span>}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {day.notes && (
                    <div className="bg-yellow-50/50 border border-yellow-100 rounded-md p-3 text-xs italic text-gray-600 mt-2">
                      <span className="font-semibold not-italic block text-[10px] text-gray-400 uppercase tracking-wider mb-0.5">Notes</span>
                      {day.notes}
                    </div>
                  )}
                </div>

              </div>
            ))
          ) : (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-center text-gray-500 italic">
              No itinerary days added yet.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
