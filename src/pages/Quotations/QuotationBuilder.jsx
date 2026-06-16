import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { ArrowLeft, Save, Loader2, DollarSign, Calculator } from 'lucide-react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { createQuotation } from '../../services/quotationService';
import { getQueryById } from '../../services/queryService';
import { getItineraryById } from '../../services/itineraryService';

export default function QuotationBuilder() {
  const [searchParams] = useSearchParams();
  const queryId = searchParams.get('queryId');
  const itineraryId = searchParams.get('itineraryId');
  
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm({
    defaultValues: {
      query: queryId,
      itinerary: itineraryId,
      pricingBreakdown: { hotelCost: 0, transferCost: 0, activityCost: 0, otherCost: 0 },
      markup: 0,
      discount: 0,
      gstPercentage: 5,
      currency: 'INR'
    }
  });

  const pricing = watch('pricingBreakdown');
  const markup = watch('markup');
  const discount = watch('discount');
  const gstPercentage = watch('gstPercentage');

  const [totals, setTotals] = useState({ subtotal: 0, amountAfterMarkup: 0, gstAmount: 0, total: 0 });

  useEffect(() => {
    const subtotal = (Number(pricing.hotelCost) || 0) + 
                     (Number(pricing.transferCost) || 0) + 
                     (Number(pricing.activityCost) || 0) + 
                     (Number(pricing.otherCost) || 0);
    
    const amountAfterMarkup = subtotal + (Number(markup) || 0) - (Number(discount) || 0);
    const gstAmount = (amountAfterMarkup * (Number(gstPercentage) || 0)) / 100;
    const total = amountAfterMarkup + gstAmount;

    setTotals({ subtotal, amountAfterMarkup, gstAmount, total });
  }, [pricing, markup, discount, gstPercentage]);

  const { data: queryData, isLoading: queryLoading } = useQuery({
    queryKey: ['query', queryId],
    queryFn: () => getQueryById(queryId),
    enabled: !!queryId,
  });

  const { data: itineraryData, isLoading: itineraryLoading } = useQuery({
    queryKey: ['itinerary', itineraryId],
    queryFn: () => getItineraryById(itineraryId),
    enabled: !!itineraryId,
  });

  const mutation = useMutation({
    mutationFn: (data) => createQuotation(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['quotations', queryId] });
      navigate(`/queries/${queryId}`);
    },
  });

  const onSubmit = (data) => {
    mutation.mutate(data);
  };

  if (queryLoading || itineraryLoading) return <div className="flex justify-center py-12"><Loader2 className="animate-spin h-8 w-8 text-primary-600" /></div>;

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link to={`/queries/${queryId}`} className="p-2 text-gray-400 hover:text-gray-500 rounded-full hover:bg-gray-100">
            <ArrowLeft className="h-6 w-6" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Generate Quotation</h1>
            <p className="text-sm text-gray-500">For {queryData?.query?.queryId} • {itineraryData?.itinerary?.name}</p>
          </div>
        </div>
        <button 
          onClick={handleSubmit(onSubmit)}
          disabled={mutation.isPending}
          className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
        >
          {mutation.isPending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
          Save Quotation
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Pricing Form */}
          <div className="bg-white shadow-sm rounded-lg border border-gray-200 p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-6 border-b pb-2 flex items-center">
              <DollarSign className="h-5 w-5 mr-2 text-primary-600" />
              Cost Breakdown
            </h2>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Hotel Cost</label>
                  <input type="number" {...register('pricingBreakdown.hotelCost')} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Transfer Cost</label>
                  <input type="number" {...register('pricingBreakdown.transferCost')} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Activity Cost</label>
                  <input type="number" {...register('pricingBreakdown.activityCost')} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Other Costs</label>
                  <input type="number" {...register('pricingBreakdown.otherCost')} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm" />
                </div>
              </div>

              <div className="pt-4 border-t border-gray-100 grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 text-primary-700 font-bold">Markup (+)</label>
                  <input type="number" {...register('markup')} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm font-bold" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 text-red-600 font-bold">Discount (-)</label>
                  <input type="number" {...register('discount')} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm font-bold" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">GST %</label>
                  <input type="number" {...register('gstPercentage')} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Currency</label>
                  <select {...register('currency')} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm">
                    <option value="INR">INR (₹)</option>
                    <option value="USD">USD ($)</option>
                    <option value="AED">AED (د.إ)</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {/* Summary Card */}
          <div className="bg-primary-600 shadow-lg rounded-lg p-6 text-white overflow-hidden relative">
            <Calculator className="absolute -right-4 -bottom-4 h-24 w-24 text-primary-500 opacity-20" />
            <h2 className="text-lg font-medium mb-6 flex items-center border-b border-primary-500 pb-2">
              Quotation Summary
            </h2>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span>Subtotal</span>
                <span>{totals.subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Markup / Discount</span>
                <span className={Number(markup) - Number(discount) >= 0 ? 'text-green-300' : 'text-red-300'}>
                  {(Number(markup) - Number(discount) >= 0 ? '+' : '')}{(Number(markup) - Number(discount)).toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between font-medium pt-2 border-t border-primary-500">
                <span>Taxable Amount</span>
                <span>{totals.amountAfterMarkup.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>GST ({gstPercentage}%)</span>
                <span>{totals.gstAmount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-2xl font-bold pt-4 border-t border-primary-500">
                <span>Total</span>
                <span>{totals.total.toLocaleString()}</span>
              </div>
              <div className="text-right text-[10px] uppercase tracking-widest opacity-75 pt-1">
                Currency: {watch('currency')}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}