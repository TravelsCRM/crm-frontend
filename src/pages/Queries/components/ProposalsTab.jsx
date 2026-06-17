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
    queryFn: () => getItineraries(),
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
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto"
          onClick={() => setShowShowItineraryModal(false)}
        >
          <div 
            className="bg-white rounded-xl shadow-2xl border border-gray-200 w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between bg-gray-50">
              <h3 className="text-lg font-bold text-gray-900">Select Itinerary for Quotation</h3>
              <button 
                onClick={() => setShowShowItineraryModal(false)} 
                className="text-gray-400 hover:text-gray-600 p-1.5 rounded-full hover:bg-gray-200 transition"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-4">
              <div className="max-h-60 overflow-y-auto space-y-2">
                {itineraries && itineraries.filter(it => it.status !== 'Draft').length > 0 ? (
                  itineraries.filter(it => it.status !== 'Draft').map(it => (
                    <button 
                      key={it._id} 
                      onClick={() => {
                        setShowShowItineraryModal(false);
                        navigate(`/quotations/new?queryId=${queryId}&itineraryId=${it._id}`);
                      }}
                      className="w-full text-left block p-3 border border-gray-200 rounded-md hover:bg-primary-50 hover:border-primary-200 transition-colors"
                    >
                      <div className="flex justify-between items-center">
                        <p className="text-sm font-bold text-gray-900">{it.name}</p>
                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                          it.status === 'Template' ? 'bg-indigo-100 text-indigo-700' : 'bg-green-100 text-green-700'
                        }`}>
                          {it.status}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">{it.destination}</p>
                    </button>
                  ))
                ) : (
                  <p className="text-sm text-gray-500 italic text-center py-4">No active itineraries found. Please create a custom itinerary below.</p>
                )}
                <button 
                  onClick={() => {
                    setShowShowItineraryModal(false);
                    navigate(`/itineraries/new?queryId=${queryId}`);
                  }}
                  className="w-full block p-3 border-2 border-dashed border-gray-300 rounded-md text-center text-primary-600 hover:text-primary-700 hover:border-primary-400 transition-colors font-medium text-sm"
                >
                  + Create New Custom Itinerary
                </button>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end">
              <button 
                type="button" 
                onClick={() => setShowShowItineraryModal(false)}
                className="px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}