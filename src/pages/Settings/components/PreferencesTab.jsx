import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { FileText, Save, Loader2 } from 'lucide-react';

export default function PreferencesTab({ settings, onSave, isSaving }) {
  const { register, handleSubmit, reset } = useForm();

  useEffect(() => {
    if (settings) {
      reset({
        termsAndConditions: settings.termsAndConditions || '',
      });
    }
  }, [settings, reset]);

  return (
    <form onSubmit={handleSubmit(onSave)} className="space-y-6">
      <div>
        <h2 className="text-lg font-bold text-gray-900">Preferences & Defaults</h2>
        <p className="text-xs text-gray-500 mt-0.5">Customize global guidelines, templates, and text templates.</p>
      </div>

      <div className="space-y-4 pt-2">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500">Default Terms & Conditions</label>
          <p className="text-xs text-gray-400 mt-0.5 mb-1.5">This text will be automatically appended to new itineraries and quotations.</p>
          <div className="relative rounded-md shadow-sm">
            <div className="absolute top-3 left-0 pl-3 flex items-start pointer-events-none">
              <FileText className="h-4 w-4 text-gray-400" />
            </div>
            <textarea 
              rows={10} 
              {...register('termsAndConditions')} 
              className="block w-full pl-10 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500 transition-shadow font-mono" 
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
          Save Preferences
        </button>
      </div>
    </form>
  );
}
