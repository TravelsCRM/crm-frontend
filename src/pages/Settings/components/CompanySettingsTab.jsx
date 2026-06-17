import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { 
  Building, 
  Mail, 
  Phone, 
  Globe, 
  Terminal, 
  MapPin, 
  DollarSign, 
  Percent, 
  Save, 
  Loader2 
} from 'lucide-react';

export default function CompanySettingsTab({ settings, onSave, isSaving }) {
  const { register, handleSubmit, reset } = useForm();

  useEffect(() => {
    if (settings) {
      reset({
        companyName: settings.companyName || '',
        companyEmail: settings.companyEmail || '',
        companyPhone: settings.companyPhone || '',
        companyWebsite: settings.companyWebsite || '',
        companyAddress: settings.companyAddress || '',
        companyTaxNumber: settings.companyTaxNumber || '',
        currency: settings.currency || 'INR',
        taxRate: settings.taxRate || 0,
      });
    }
  }, [settings, reset]);

  return (
    <form onSubmit={handleSubmit(onSave)} className="space-y-6">
      <div>
        <h2 className="text-lg font-bold text-gray-900">Company Settings</h2>
        <p className="text-xs text-gray-500 mt-0.5">Global information about your travel agency used for documents and invoices.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
        <div className="md:col-span-2">
          <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500">Company Name</label>
          <div className="mt-1.5 relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Building className="h-4 w-4 text-gray-400" />
            </div>
            <input 
              type="text" 
              {...register('companyName', { required: true })} 
              className="block w-full pl-10 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500 transition-shadow" 
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500">Contact Email</label>
          <div className="mt-1.5 relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Mail className="h-4 w-4 text-gray-400" />
            </div>
            <input 
              type="email" 
              {...register('companyEmail')} 
              className="block w-full pl-10 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500 transition-shadow" 
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500">Phone Number</label>
          <div className="mt-1.5 relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Phone className="h-4 w-4 text-gray-400" />
            </div>
            <input 
              type="text" 
              {...register('companyPhone')} 
              className="block w-full pl-10 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500 transition-shadow" 
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500">Website URL</label>
          <div className="mt-1.5 relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Globe className="h-4 w-4 text-gray-400" />
            </div>
            <input 
              type="text" 
              {...register('companyWebsite')} 
              className="block w-full pl-10 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500 transition-shadow" 
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500">Tax ID / GSTIN</label>
          <div className="mt-1.5 relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Terminal className="h-4 w-4 text-gray-400" />
            </div>
            <input 
              type="text" 
              {...register('companyTaxNumber')} 
              className="block w-full pl-10 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500 transition-shadow" 
            />
          </div>
        </div>

        <div className="md:col-span-2">
          <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500">Office Address</label>
          <div className="mt-1.5 relative rounded-md shadow-sm">
            <div className="absolute top-3 left-0 pl-3 flex items-start pointer-events-none">
              <MapPin className="h-4 w-4 text-gray-400" />
            </div>
            <textarea 
              rows={3} 
              {...register('companyAddress')} 
              className="block w-full pl-10 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500 transition-shadow" 
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500">Default Currency</label>
          <div className="mt-1.5 relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <DollarSign className="h-4 w-4 text-gray-400" />
            </div>
            <select 
              {...register('currency')} 
              className="block w-full pl-10 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500 bg-white"
            >
              <option value="INR">INR (₹)</option>
              <option value="USD">USD ($)</option>
              <option value="EUR">EUR (€)</option>
              <option value="AED">AED (Dh)</option>
              <option value="GBP">GBP (£)</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500">Default Tax Rate (%)</label>
          <div className="mt-1.5 relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Percent className="h-4 w-4 text-gray-400" />
            </div>
            <input 
              type="number" 
              step="0.01" 
              {...register('taxRate')} 
              className="block w-full pl-10 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500 transition-shadow" 
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end pt-4 border-t border-gray-100">
        <button 
          type="submit" 
          disabled={isSaving}
          className="inline-flex items-center px-4 py-2 text-sm font-semibold rounded-lg text-white bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 shadow-md hover:shadow-lg focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 active:scale-95 transition-all disabled:opacity-50"
        >
          {isSaving ? (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <Save className="w-4 h-4 mr-2" />
          )}
          Save Changes
        </button>
      </div>
    </form>
  );
}
