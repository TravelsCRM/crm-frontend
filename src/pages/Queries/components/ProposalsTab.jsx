import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getQuotationsByQuery, updateQuotationStatus, deleteQuotation, downloadQuotation } from '../../../services/quotationService';
import { convertQuotationToBooking } from '../../../services/bookingService';
import { getItineraries } from '../../../services/itineraryService';
import { FileText, Plus, Check, X, Trash2, ExternalLink, Loader2, Briefcase, Download } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

export default function ProposalsTab({ queryId }) {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [showItineraryModal, setShowShowItineraryModal] = useState(false);
  const [downloadingId, setDownloadingId] = useState(null);

  const { data: quotations, isLoading } = useQuery({
    queryKey: ['quotations', queryId],
    queryFn: () => getQuotationsByQuery(queryId),
  });

  const { data: itineraries } = useQuery({
    queryKey: ['itineraries'],
    queryFn: () => getItineraries({ status: 'Template' }),
    enabled: showItineraryModal,
  });

  const statusMutation = useMutation({
    mutationFn: ({ id, status }) => updateQuotationStatus(id, { status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['quotations', queryId] });
      queryClient.invalidateQueries({ queryKey: ['query', queryId] });
    },
  });

  const convertMutation = useMutation({
    mutationFn: (id) => convertQuotationToBooking(id),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
      queryClient.invalidateQueries({ queryKey: ['query', queryId] });
      navigate(`/bookings/${data._id}`);
    },
    onError: (error) => {
      alert(error.response?.data?.message || 'Conversion failed');
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => deleteQuotation(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['quotations', queryId] });
    },
  });

  const handleDownload = async (id) => {
    try {
      setDownloadingId(id);
      await downloadQuotation(id);
    } catch (error) {
      alert('Failed to download PDF');
    } finally {
      setDownloadingId(null);
    }
  };

  if (isLoading) return <div className="flex justify-center py-8"><Loader2 className="animate-spin h-6 w-6 text-primary-600" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium text-gray-900">Proposals / Quotations</h3>
        <div className="flex space-x-2">
          <button 
            onClick={() => setShowShowItineraryModal(true)}
            className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
          >
            <Plus className="h-4 w-4 mr-1.5" />
            New Quotation
          </button>
        </div>
      </div>

      <div className="overflow-hidden bg-white border border-gray-200 rounded-md">
        <ul className="divide-y divide-gray-200">
          {quotations?.map((quote) => (
            <li key={quote._id} className="p-4 hover:bg-gray-50">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-md ${
                    quote.status === 'Accepted' ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-blue-600'
                  }`}>
                    <FileText className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-900">Version {quote.versionNumber}</p>
                    <p className="text-xs text-gray-500">{quote.itinerary?.name}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <p className="text-sm font-bold text-gray-900">{quote.totalAmount.toLocaleString()} {quote.currency}</p>
                    <p className={`text-[10px] font-bold uppercase ${
                      quote.status === 'Accepted' ? 'text-green-600' : 
                      quote.status === 'Rejected' ? 'text-red-600' : 'text-yellow-600'
                    }`}>{quote.status}</p>
                  </div>
                  <div className="flex space-x-1">
                    {quote.status === 'Pending' && (
                      <>
                        <button 
                          onClick={() => statusMutation.mutate({ id: quote._id, status: 'Accepted' })}
                          className="p-1 text-green-600 hover:bg-green-50 rounded"
                          title="Accept"
                        >
                          <Check className="h-4 w-4" />
                        </button>
                        <button 
                          onClick={() => statusMutation.mutate({ id: quote._id, status: 'Rejected' })}
                          className="p-1 text-red-600 hover:bg-red-50 rounded"
                          title="Reject"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </>
                    )}
                    {quote.status === 'Accepted' && (
                      <button 
                        onClick={() => convertMutation.mutate(quote._id)}
                        disabled={convertMutation.isPending}
                        className="flex items-center space-x-1 px-2 py-1 bg-primary-600 text-white text-[10px] font-bold rounded hover:bg-primary-700 transition-colors"
                      >
                        {convertMutation.isPending ? <Loader2 className="h-3 w-3 animate-spin" /> : <Briefcase className="h-3 w-3" />}
                        <span>BOOK NOW</span>
                      </button>
                    )}
                    <button 
                      onClick={() => handleDownload(quote._id)}
                      disabled={downloadingId === quote._id}
                      className="p-1 text-gray-400 hover:text-primary-600 rounded"
                      title="Download PDF"
                    >
                      {downloadingId === quote._id ? <Loader2 className="h-4 w-4 animate-spin text-primary-600" /> : <Download className="h-4 w-4" />}
                    </button>
                    <button 
                      onClick={() => {
                        if(window.confirm('Delete this quotation?')) deleteMutation.mutate(quote._id);
                      }}
                      className="p-1 text-gray-400 hover:text-red-600 rounded"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </li>
          ))}
          {quotations?.length === 0 && (
            <li className="p-8 text-center text-sm text-gray-500 italic">
              No quotations generated yet for this query.
            </li>
          )}
        </ul>
      </div>

      {/* Select Itinerary Modal */}
      {showItineraryModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75" onClick={() => setShowShowItineraryModal(false)}></div>
            </div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Select Itinerary for Quotation</h3>
                <div className="max-h-60 overflow-y-auto space-y-2">
                  {itineraries?.map(it => (
                    <Link 
                      key={it._id} 
                      to={`/quotations/new?queryId=${queryId}&itineraryId=${it._id}`}
                      className="block p-3 border border-gray-200 rounded-md hover:bg-primary-50 hover:border-primary-200 transition-colors"
                    >
                      <p className="text-sm font-bold text-gray-900">{it.name}</p>
                      <p className="text-xs text-gray-500">{it.destination}</p>
                    </Link>
                  ))}
                  <Link 
                    to={`/itineraries/new?queryId=${queryId}`}
                    className="block p-3 border-2 border-dashed border-gray-300 rounded-md text-center text-primary-600 hover:text-primary-700 hover:border-primary-400 transition-colors font-medium text-sm"
                  >
                    + Create New Custom Itinerary
                  </Link>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button 
                  type="button" 
                  onClick={() => setShowShowItineraryModal(false)}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}