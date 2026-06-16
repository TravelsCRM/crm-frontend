import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { getPaymentsByBooking, createPayment, updatePaymentStatus } from '../../../services/paymentService';
import { CreditCard, Plus, Check, X, Loader2, Calendar, User, DollarSign } from 'lucide-react';

export default function PaymentsTab({ bookingId, totalAmount, onPaymentRecorded }) {
  const queryClient = useQueryClient();
  const [showAddForm, setShowAddForm] = useState(false);

  const { data: payments, isLoading } = useQuery({
    queryKey: ['payments', bookingId],
    queryFn: () => getPaymentsByBooking(bookingId),
  });

  const { register, handleSubmit, reset } = useForm({
    defaultValues: {
      amount: '',
      paymentMode: 'Bank Transfer',
      paymentDate: new Date().toISOString().split('T')[0],
      referenceNumber: '',
      remarks: ''
    }
  });

  const createMutation = useMutation({
    mutationFn: (data) => createPayment({ ...data, booking: bookingId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payments', bookingId] });
      queryClient.invalidateQueries({ queryKey: ['booking', bookingId] });
      setShowAddForm(false);
      reset();
      if (onPaymentRecorded) onPaymentRecorded();
    },
  });

  const statusMutation = useMutation({
    mutationFn: ({ id, status }) => updatePaymentStatus(id, { status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payments', bookingId] });
      queryClient.invalidateQueries({ queryKey: ['booking', bookingId] });
    },
  });

  if (isLoading) return <div className="flex justify-center py-8"><Loader2 className="animate-spin h-6 w-6 text-primary-600" /></div>;

  const totalReceived = payments?.filter(p => p.status === 'Verified').reduce((sum, p) => sum + p.amount, 0) || 0;
  const balance = totalAmount - totalReceived;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-medium text-gray-900">Payment History</h3>
          <p className="text-sm text-gray-500">Total Received: <span className="font-bold text-green-600">₹{totalReceived.toLocaleString()}</span> • Balance: <span className="font-bold text-red-600">₹{balance.toLocaleString()}</span></p>
        </div>
        <button 
          onClick={() => setShowAddForm(!showAddForm)}
          className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
        >
          <Plus className="h-4 w-4 mr-1.5" />
          Record Payment
        </button>
      </div>

      {showAddForm && (
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
          <form onSubmit={handleSubmit((data) => createMutation.mutate(data))} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Amount</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-500 sm:text-sm">₹</span>
                  </div>
                  <input type="number" {...register('amount', { required: true })} className="block w-full pl-7 pr-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500 sm:text-sm" placeholder="0.00" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Mode</label>
                <select {...register('paymentMode')} className="block w-full border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500 sm:text-sm">
                  <option value="Bank Transfer">Bank Transfer</option>
                  <option value="UPI">UPI / GPay / PhonePe</option>
                  <option value="Cash">Cash</option>
                  <option value="Credit Card">Credit Card</option>
                  <option value="Cheque">Cheque</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Date</label>
                <input type="date" {...register('paymentDate')} className="block w-full border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500 sm:text-sm" />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Reference Number</label>
                <input type="text" {...register('referenceNumber')} className="block w-full border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500 sm:text-sm" placeholder="Transaction ID, Cheque No etc." />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Remarks</label>
                <input type="text" {...register('remarks')} className="block w-full border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500 sm:text-sm" placeholder="Note (e.g. 50% Advance)" />
              </div>
            </div>
            <div className="flex justify-end space-x-2">
              <button type="button" onClick={() => setShowAddForm(false)} className="text-sm text-gray-500 px-3 py-1.5 font-medium">Cancel</button>
              <button type="submit" disabled={createMutation.isPending} className="bg-primary-600 text-white text-sm px-4 py-1.5 rounded-md hover:bg-primary-700 font-medium">
                {createMutation.isPending ? 'Saving...' : 'Save Payment'}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="overflow-hidden bg-white border border-gray-200 rounded-md shadow-sm">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mode / Ref</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="relative px-6 py-3"></th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {payments?.map((payment) => (
              <tr key={payment._id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {new Date(payment.paymentDate).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
                  ₹{payment.amount.toLocaleString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <div className="font-medium text-gray-900">{payment.paymentMode}</div>
                  <div className="text-xs">{payment.referenceNumber}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-[10px] leading-5 font-bold rounded-full uppercase ${
                    payment.status === 'Verified' ? 'bg-green-100 text-green-800' : 
                    payment.status === 'Cancelled' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {payment.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-xs font-medium">
                  {payment.status === 'Verified' && (
                    <button 
                      onClick={() => { if(window.confirm('Cancel this payment?')) statusMutation.mutate({ id: payment._id, status: 'Cancelled' }); }}
                      className="text-red-600 hover:text-red-900"
                    >
                      Cancel
                    </button>
                  )}
                </td>
              </tr>
            ))}
            {payments?.length === 0 && (
              <tr>
                <td colSpan="5" className="px-6 py-10 text-center text-sm text-gray-500 italic">No payment records found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}