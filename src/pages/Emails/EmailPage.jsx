import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  Mail, 
  Send, 
  Search, 
  Clock, 
  Plus, 
  User, 
  ChevronRight, 
  CheckCircle, 
  FileText, 
  AlertCircle,
  X,
  Loader2
} from 'lucide-react';
import { getEmails, sendEmail } from '../../services/emailService';
import { getClients } from '../../services/clientService';

const EMAIL_TEMPLATES = [
  {
    id: 'welcome',
    name: 'Welcome & Introduction',
    subject: 'Welcome to our Travel Agency!',
    body: `Dear Client,

Thank you for choosing our travel agency. We are absolutely thrilled to assist you in planning your next dream adventure! 

Whether you are looking for a tropical beach getaway, a cultural city expedition, or a luxury cruise, our team is dedicated to designing the perfect customized itinerary just for you.

Please feel free to reply directly to this email or call us at any time.

Warmest regards,
The Travel CRM Team`
  },
  {
    id: 'itinerary',
    name: 'Itinerary Proposal',
    subject: 'Your Travel Itinerary Proposal is Ready!',
    body: `Dear Client,

We have designed a custom itinerary proposal based on your recent request. 

Please review the details in your travel portal or find the draft schedule details under the Itineraries section. We have hand-selected hotels and activities to give you the most unforgettable experience.

Let us know if you would like to make any adjustments or confirm the bookings.

Best regards,
The Travel CRM Team`
  },
  {
    id: 'payment',
    name: 'Payment Due Reminder',
    subject: 'Urgent: Payment Due Reminder for Booking',
    body: `Dear Client,

This is a friendly reminder that a payment is due for your upcoming travel booking.

To guarantee hotel rates, flights, and activity slots, please submit the balance due as soon as possible. You can make payments via bank transfer, UPI, or credit card inside our portal.

If you have already processed this payment, please disregard this email or send us the transaction reference number.

Thank you,
The Accounts Team`
  }
];

export default function EmailPage() {
  const [selectedEmail, setSelectedEmail] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showComposeModal, setShowComposeModal] = useState(false);
  const [notification, setNotification] = useState(null);

  const queryClient = useQueryClient();

  const { register, handleSubmit, reset, watch, setValue, formState: { errors } } = useForm({
    defaultValues: {
      recipientType: 'client',
      clientSelect: '',
      customEmail: '',
      templateSelect: '',
      subject: '',
      body: ''
    }
  });

  // Fetch sent email logs
  const { data: emails, isLoading: isLoadingEmails } = useQuery({
    queryKey: ['emails'],
    queryFn: getEmails
  });

  // Fetch clients for dropdown list
  const { data: clients } = useQuery({
    queryKey: ['clients'],
    queryFn: () => getClients()
  });

  // Toast helper
  const showToast = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 4000);
  };

  // Watch fields in compose form
  const recipientType = watch('recipientType');
  const templateSelect = watch('templateSelect');
  const clientSelect = watch('clientSelect');

  // Load template data when selected
  useEffect(() => {
    if (templateSelect) {
      const selectedTemplate = EMAIL_TEMPLATES.find(t => t.id === templateSelect);
      if (selectedTemplate) {
        setValue('subject', selectedTemplate.subject);
        setValue('body', selectedTemplate.body);
      }
    }
  }, [templateSelect, setValue]);

  // Set default recipient email when client is picked
  useEffect(() => {
    if (recipientType === 'client' && clientSelect && clients) {
      const selectedClient = clients.find(c => c._id === clientSelect);
      if (selectedClient && selectedClient.email) {
        setValue('customEmail', selectedClient.email);
      }
    }
  }, [clientSelect, recipientType, clients, setValue]);

  // Mutations
  const sendEmailMutation = useMutation({
    mutationFn: sendEmail,
    onSuccess: (data) => {
      queryClient.setQueryData(['emails'], (oldEmails) => {
        return oldEmails ? [data, ...oldEmails] : [data];
      });
      showToast('Email sent successfully!');
      reset();
      setShowComposeModal(false);
    },
    onError: (err) => {
      showToast(err.response?.data?.message || 'Failed to send email', 'error');
    }
  });

  const onComposeSubmit = (data) => {
    const payload = {
      to: data.customEmail,
      subject: data.subject,
      body: data.body
    };

    if (data.recipientType === 'client' && data.clientSelect) {
      payload.clientId = data.clientSelect;
    }

    sendEmailMutation.mutate(payload);
  };

  // Filter emails by search query
  const filteredEmails = emails?.filter(email => {
    const query = searchQuery.toLowerCase();
    return (
      email.to.toLowerCase().includes(query) ||
      email.subject.toLowerCase().includes(query) ||
      email.body.toLowerCase().includes(query) ||
      (email.client?.name && email.client.name.toLowerCase().includes(query))
    );
  }) || [];

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-12 h-[calc(100vh-120px)] flex flex-col relative">
      {/* Toast Notification */}
      {notification && (
        <div className={`fixed top-4 right-4 z-50 flex items-center space-x-2 px-4 py-3 rounded-lg shadow-lg border text-sm font-semibold transition-all transform translate-y-0 animate-bounce ${
          notification.type === 'success' 
            ? 'bg-green-50 text-green-800 border-green-200' 
            : 'bg-red-50 text-red-800 border-red-200'
        }`}>
          {notification.type === 'success' ? (
            <CheckCircle className="h-5 w-5 text-green-600" />
          ) : (
            <AlertCircle className="h-5 w-5 text-red-600" />
          )}
          <span>{notification.message}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex justify-between items-center flex-shrink-0">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Emails</h1>
          <p className="text-sm text-gray-500 mt-1">Review communication logs and send customized emails to clients.</p>
        </div>
        <button
          onClick={() => setShowComposeModal(true)}
          className="inline-flex items-center px-4 py-2 text-sm font-semibold rounded-lg text-white bg-primary-600 hover:bg-primary-700 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 active:scale-95 transition-all"
        >
          <Plus className="h-4 w-4 mr-2" />
          Compose Email
        </button>
      </div>

      {/* Main Split Console Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1 min-h-0 overflow-hidden">
        
        {/* Left Side: Sent Directory */}
        <div className="lg:col-span-5 bg-white rounded-xl shadow-sm border border-gray-200 flex flex-col min-h-0 overflow-hidden">
          {/* Search bar */}
          <div className="p-4 border-b border-gray-100 flex-shrink-0">
            <div className="relative rounded-lg shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search recipient, subject, content..."
                className="block w-full pl-10 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500 outline-none"
              />
            </div>
          </div>

          {/* Directory logs list */}
          <div className="flex-1 overflow-y-auto divide-y divide-gray-100">
            {isLoadingEmails ? (
              <div className="flex flex-col items-center justify-center py-20 space-y-3">
                <Loader2 className="h-8 w-8 text-primary-600 animate-spin" />
                <p className="text-sm text-gray-500 font-medium">Loading sent emails...</p>
              </div>
            ) : filteredEmails.length === 0 ? (
              <div className="text-center py-20 text-gray-400 font-medium italic">
                No emails logged
              </div>
            ) : (
              filteredEmails.map((email) => {
                const isSelected = selectedEmail?._id === email._id;
                return (
                  <button
                    key={email._id}
                    onClick={() => setSelectedEmail(email)}
                    className={`w-full text-left px-5 py-4 flex flex-col space-y-1.5 transition-colors border-l-4 ${
                      isSelected 
                        ? 'bg-primary-50 border-primary-600' 
                        : 'border-transparent hover:bg-gray-50/50'
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-semibold text-gray-900 truncate pr-3">
                        {email.client?.name || email.to}
                      </span>
                      <span className="text-xs text-gray-400 whitespace-nowrap">
                        {new Date(email.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <span className="text-sm font-medium text-gray-700 truncate">
                      {email.subject}
                    </span>
                    <span className="text-xs text-gray-500 line-clamp-2 leading-relaxed">
                      {email.body}
                    </span>
                    <div className="flex items-center space-x-2 pt-1">
                      <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-green-50 text-green-700 border border-green-150 uppercase">
                        {email.status}
                      </span>
                      {email.client?.name && (
                        <span className="text-[10px] font-medium text-gray-400">
                          To: {email.to}
                        </span>
                      )}
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Right Side: Reader */}
        <div className="lg:col-span-7 bg-white rounded-xl shadow-sm border border-gray-200 flex flex-col min-h-0 overflow-hidden">
          {selectedEmail ? (
            <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
              {/* Header */}
              <div className="p-6 border-b border-gray-100 flex-shrink-0 space-y-4">
                <div>
                  <h2 className="text-xl font-extrabold text-gray-900 leading-tight">
                    {selectedEmail.subject}
                  </h2>
                </div>
                
                {/* Details grid */}
                <div className="flex items-center justify-between text-sm bg-gray-50 p-4 rounded-xl border border-gray-150">
                  <div className="flex items-center space-x-3">
                    <div className="w-9 h-9 rounded-full bg-primary-100 text-primary-700 font-bold flex items-center justify-center text-sm uppercase">
                      {selectedEmail.sentBy?.name?.substring(0, 2) || 'SA'}
                    </div>
                    <div>
                      <p className="text-gray-800 font-semibold">{selectedEmail.sentBy?.name || 'Super Admin'}</p>
                      <p className="text-xs text-gray-500">From: {selectedEmail.sentBy?.email || 'admin@travelcrm.com'}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-500 font-medium flex items-center justify-end">
                      <Clock className="h-3 w-3 mr-1" />
                      {new Date(selectedEmail.createdAt).toLocaleString()}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">To: <span className="font-semibold text-gray-700">{selectedEmail.to}</span></p>
                  </div>
                </div>
              </div>

              {/* Message text Body */}
              <div className="flex-1 p-6 overflow-y-auto font-sans leading-relaxed text-gray-800 whitespace-pre-line bg-slate-50/50">
                <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-xs min-h-full">
                  {selectedEmail.body}
                </div>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-slate-50/30">
              <div className="p-4 bg-primary-50 rounded-2xl text-primary-600 mb-4">
                <Mail className="h-8 w-8" />
              </div>
              <h3 className="text-base font-bold text-gray-800">No Email Selected</h3>
              <p className="text-xs text-gray-500 max-w-sm mt-1 leading-relaxed">
                Select an email correspondence record from the left list to review detailed logs or compose a new email.
              </p>
            </div>
          )}
        </div>

      </div>

      {/* Compose Email Modal */}
      {showComposeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/60 backdrop-blur-xs px-4">
          <div className="bg-white rounded-xl shadow-2xl border border-gray-200 w-full max-w-lg overflow-hidden transform transition-all duration-300">
            
            {/* Header */}
            <div className="bg-gray-50 px-6 py-4 border-b border-gray-150 flex justify-between items-center">
              <div className="flex items-center space-x-2 text-gray-800">
                <Send className="h-5 w-5 text-primary-600" />
                <h3 className="text-base font-bold">Compose Email</h3>
              </div>
              <button 
                onClick={() => { setShowComposeModal(false); reset(); }}
                className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-lg hover:bg-gray-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit(onComposeSubmit)} className="p-6 space-y-4">
              
              {/* Toggle recipient type */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1.5">Recipient Mode</label>
                <div className="flex space-x-4">
                  <label className="flex items-center text-sm font-medium text-gray-700 cursor-pointer">
                    <input 
                      type="radio" 
                      value="client" 
                      {...register('recipientType')} 
                      className="h-4 w-4 text-primary-600 border-gray-300 focus:ring-primary-500 mr-2" 
                    />
                    Registered Client
                  </label>
                  <label className="flex items-center text-sm font-medium text-gray-700 cursor-pointer">
                    <input 
                      type="radio" 
                      value="custom" 
                      {...register('recipientType')} 
                      className="h-4 w-4 text-primary-600 border-gray-300 focus:ring-primary-500 mr-2" 
                    />
                    Custom Email Address
                  </label>
                </div>
              </div>

              {/* Client Select dropdown */}
              {recipientType === 'client' && (
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500">Select Client</label>
                  <select 
                    {...register('clientSelect', { required: recipientType === 'client' ? 'Please select a client' : false })} 
                    className="mt-1.5 block w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:ring-primary-500 focus:border-primary-500 outline-none transition-shadow"
                  >
                    <option value="">-- Select Client --</option>
                    {clients?.map((c) => (
                      <option key={c._id} value={c._id}>{c.name} ({c.email || 'No email'})</option>
                    ))}
                  </select>
                  {errors.clientSelect && <p className="mt-1 text-xs text-red-500">{errors.clientSelect.message}</p>}
                </div>
              )}

              {/* Custom / Recipient Email */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Recipient Email
                </label>
                <input 
                  type="email" 
                  {...register('customEmail', { 
                    required: 'Recipient email is required',
                    pattern: { value: /^\S+@\S+\.\S+$/, message: 'Invalid email address' }
                  })} 
                  disabled={recipientType === 'client' && clientSelect}
                  className="mt-1.5 block w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:ring-primary-500 focus:border-primary-500 outline-none transition-shadow disabled:bg-gray-50 disabled:text-gray-500" 
                  placeholder="recipient@example.com"
                />
                {errors.customEmail && <p className="mt-1 text-xs text-red-500">{errors.customEmail.message}</p>}
              </div>

              {/* Template Select */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500">Insert Template (Optional)</label>
                <select 
                  {...register('templateSelect')} 
                  className="mt-1.5 block w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:ring-primary-500 focus:border-primary-500 outline-none transition-shadow"
                >
                  <option value="">-- No Template --</option>
                  {EMAIL_TEMPLATES.map((t) => (
                    <option key={t.id} value={t.id}>{t.name}</option>
                  ))}
                </select>
              </div>

              {/* Subject */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500">Subject</label>
                <input 
                  type="text" 
                  {...register('subject', { required: 'Subject is required' })} 
                  className="mt-1.5 block w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-primary-500 focus:border-primary-500 outline-none transition-shadow" 
                  placeholder="Subject of the email"
                />
                {errors.subject && <p className="mt-1 text-xs text-red-500">{errors.subject.message}</p>}
              </div>

              {/* Message Body */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500">Message Body</label>
                <textarea 
                  rows={6} 
                  {...register('body', { required: 'Message body is required' })} 
                  className="mt-1.5 block w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-primary-500 focus:border-primary-500 outline-none transition-shadow font-sans" 
                  placeholder="Type your message details here..."
                />
                {errors.body && <p className="mt-1 text-xs text-red-500">{errors.body.message}</p>}
              </div>

              {/* Submit Buttons */}
              <div className="flex justify-end space-x-3 pt-4 border-t border-gray-100">
                <button 
                  type="button"
                  onClick={() => { setShowComposeModal(false); reset(); }}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-semibold text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  disabled={sendEmailMutation.isPending}
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg text-sm font-semibold text-white bg-primary-600 hover:bg-primary-700 shadow-sm active:scale-95 transition-all disabled:opacity-50"
                >
                  {sendEmailMutation.isPending ? (
                    <Loader2 className="h-4.5 w-4.5 animate-spin mr-2" />
                  ) : (
                    <Send className="h-4 w-4 mr-2" />
                  )}
                  Send Email
                </button>
              </div>

            </form>
          </div>
        </div>
      )}
    </div>
  );
}
