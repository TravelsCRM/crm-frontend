import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import api from '../../../services/api';
import { Clock, Plus, Check, Loader2, Calendar as CalendarIcon, User } from 'lucide-react';

export default function FollowupsTab({ queryId }) {
  const queryClient = useQueryClient();
  const [showAddForm, setShowAddForm] = useState(false);

  const { data: followups, isLoading } = useQuery({
    queryKey: ['followups', queryId],
    queryFn: async () => {
      const { data } = await api.get('/followups', { params: { queryId } });
      return data;
    },
  });

  const { register, handleSubmit, reset } = useForm({
    defaultValues: {
      followupDate: new Date().toISOString().split('T')[0],
      followupTime: '10:00',
      note: ''
    }
  });

  const createMutation = useMutation({
    mutationFn: (data) => api.post('/followups', { ...data, query: queryId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['followups', queryId] });
      queryClient.invalidateQueries({ queryKey: ['query', queryId] });
      setShowAddForm(false);
      reset();
    },
  });

  const statusMutation = useMutation({
    mutationFn: ({ id, status }) => api.patch(`/followups/${id}/status`, { status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['followups', queryId] });
    },
  });

  if (isLoading) return <div className="flex justify-center py-8"><Loader2 className="animate-spin h-6 w-6 text-primary-600" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium text-gray-900">Follow-up History</h3>
        <button 
          onClick={() => setShowAddForm(!showAddForm)}
          className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
        >
          <Plus className="h-4 w-4 mr-1.5" />
          Add Follow-up
        </button>
      </div>

      {showAddForm && (
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
          <form onSubmit={handleSubmit((data) => createMutation.mutate(data))} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Date</label>
                <input type="date" {...register('followupDate')} className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Time</label>
                <input type="time" {...register('followupTime')} className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Note</label>
              <textarea {...register('note')} rows={2} className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm" placeholder="e.g. Client requested a callback tomorrow..." />
            </div>
            <div className="flex justify-end space-x-2">
              <button type="button" onClick={() => setShowAddForm(false)} className="text-sm text-gray-500 px-3 py-1.5">Cancel</button>
              <button type="submit" className="bg-primary-600 text-white text-sm px-4 py-1.5 rounded-md hover:bg-primary-700">Schedule Follow-up</button>
            </div>
          </form>
        </div>
      )}

      <div className="flow-root">
        <ul className="-mb-8">
          {followups?.map((followup, idx) => (
            <li key={followup._id}>
              <div className="relative pb-8">
                {idx !== followups.length - 1 && (
                  <span className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200" aria-hidden="true" />
                )}
                <div className="relative flex space-x-3">
                  <div>
                    <span className={`h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white ${
                      followup.status === 'Completed' ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-600'
                    }`}>
                      {followup.status === 'Completed' ? <Check className="h-5 w-5" /> : <Clock className="h-5 w-5" />}
                    </span>
                  </div>
                  <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                    <div>
                      <p className="text-sm text-gray-900">{followup.note}</p>
                      <div className="mt-1 flex items-center space-x-4 text-xs text-gray-500">
                        <span className="flex items-center"><CalendarIcon className="h-3 w-3 mr-1" /> {new Date(followup.followupDate).toLocaleDateString()} at {followup.followupTime}</span>
                        <span className="flex items-center"><User className="h-3 w-3 mr-1" /> {followup.assignedUser?.name}</span>
                      </div>
                    </div>
                    <div className="text-right whitespace-nowrap">
                      {followup.status === 'Pending' && (
                        <button 
                          onClick={() => statusMutation.mutate({ id: followup._id, status: 'Completed' })}
                          className="text-xs text-primary-600 hover:text-primary-700 font-bold border border-primary-600 px-2 py-1 rounded"
                        >
                          Mark Done
                        </button>
                      )}
                      {followup.status === 'Completed' && <span className="text-xs text-green-600 font-bold">DONE</span>}
                    </div>
                  </div>
                </div>
              </div>
            </li>
          ))}
          {followups?.length === 0 && (
            <li className="text-center py-8 text-sm text-gray-500 italic">No follow-up history.</li>
          )}
        </ul>
      </div>
    </div>
  );
}