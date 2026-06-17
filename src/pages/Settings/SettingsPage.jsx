import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { 
  Building, 
  User, 
  Sliders, 
  Save, 
  Loader2, 
  CheckCircle2, 
  Lock, 
  FileText, 
  Globe, 
  Mail, 
  Phone, 
  MapPin, 
  Percent, 
  DollarSign, 
  Terminal,
  AlertCircle
} from 'lucide-react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getSettings, updateSettings, updateProfile } from '../../services/settingsService';
import { useAuth } from '../../context/AuthContext';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('company');
  const [notification, setNotification] = useState(null);
  
  const { user, updateUser } = useAuth();
  const queryClient = useQueryClient();

  // Fetch company/CRM settings
  const { data: settings, isLoading, error } = useQuery({
    queryKey: ['settings'],
    queryFn: getSettings
  });

  const { register: registerCompany, handleSubmit: handleCompanySubmit, reset: resetCompany } = useForm();
  const { register: registerProfile, handleSubmit: handleProfileSubmit, reset: resetProfile, formState: { errors: profileErrors }, watch } = useForm();
  const { register: registerPrefs, handleSubmit: handlePrefsSubmit, reset: resetPrefs } = useForm();

  // Reset forms when data is loaded
  useEffect(() => {
    if (settings) {
      resetCompany({
        companyName: settings.companyName,
        companyEmail: settings.companyEmail,
        companyPhone: settings.companyPhone,
        companyWebsite: settings.companyWebsite,
        companyAddress: settings.companyAddress,
        companyTaxNumber: settings.companyTaxNumber,
        currency: settings.currency,
        taxRate: settings.taxRate,
      });
      resetPrefs({
        termsAndConditions: settings.termsAndConditions,
      });
    }
  }, [settings, resetCompany, resetPrefs]);

  useEffect(() => {
    if (user) {
      resetProfile({
        name: user.name,
        email: user.email,
      });
    }
  }, [user, resetProfile]);

  // Toast notification helper
  const showToast = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification(null);
    }, 4000);
  };

  // Mutations
  const updateSettingsMutation = useMutation({
    mutationFn: updateSettings,
    onSuccess: (data) => {
      queryClient.setQueryData(['settings'], data);
      showToast('Settings saved successfully!');
    },
    onError: (err) => {
      showToast(err.response?.data?.message || 'Failed to save settings', 'error');
    }
  });

  const updateProfileMutation = useMutation({
    mutationFn: updateProfile,
    onSuccess: (data) => {
      // Update global context
      updateUser(data);
      showToast('Profile updated successfully!');
      resetProfile({
        name: data.name,
        email: data.email,
        password: '',
        confirmPassword: ''
      });
    },
    onError: (err) => {
      showToast(err.response?.data?.message || 'Failed to update profile', 'error');
    }
  });

  const onCompanySubmit = (data) => {
    updateSettingsMutation.mutate(data);
  };

  const onPrefsSubmit = (data) => {
    updateSettingsMutation.mutate(data);
  };

  const onProfileSubmit = (data) => {
    const { name, email, password } = data;
    const payload = { name, email };
    if (password) {
      payload.password = password;
    }
    updateProfileMutation.mutate(payload);
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-4">
        <Loader2 className="h-10 w-10 text-primary-600 animate-spin" />
        <p className="text-gray-500 font-medium animate-pulse">Loading settings...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg flex items-center space-x-3">
        <AlertCircle className="h-5 w-5 flex-shrink-0" />
        <div>
          <p className="font-semibold">Error loading settings</p>
          <p className="text-sm">{error.message}</p>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'company', label: 'Company Settings', icon: Building },
    { id: 'profile', label: 'My Profile', icon: User },
    { id: 'preferences', label: 'Preferences & Defaults', icon: Sliders },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-12 relative">
      {/* Toast Notification */}
      {notification && (
        <div className={`fixed top-4 right-4 z-50 flex items-center space-x-2 px-4 py-3 rounded-lg shadow-lg border text-sm font-medium transition-all transform translate-y-0 animate-bounce ${
          notification.type === 'success' 
            ? 'bg-green-50 text-green-800 border-green-200' 
            : 'bg-red-50 text-red-800 border-red-200'
        }`}>
          {notification.type === 'success' ? (
            <CheckCircle2 className="h-5 w-5 text-green-600" />
          ) : (
            <AlertCircle className="h-5 w-5 text-red-600" />
          )}
          <span>{notification.message}</span>
        </div>
      )}

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-sm text-gray-500 mt-1">Configure company profiles, defaults, preferences, and personal details.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Navigation Sidebar */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden h-fit">
          <nav className="flex flex-col divide-y divide-gray-100">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-3 px-5 py-4 text-sm font-medium transition-all text-left w-full ${
                    isActive 
                      ? 'bg-primary-50 text-primary-700 border-l-4 border-primary-600' 
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <Icon className={`h-5 w-5 ${isActive ? 'text-primary-600' : 'text-gray-400'}`} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Content Pane */}
        <div className="md:col-span-3">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 min-h-[400px]">
            {/* Tab: Company Settings */}
            {activeTab === 'company' && (
              <form onSubmit={handleCompanySubmit(onCompanySubmit)} className="space-y-6">
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
                        {...registerCompany('companyName', { required: true })} 
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
                        {...registerCompany('companyEmail')} 
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
                        {...registerCompany('companyPhone')} 
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
                        {...registerCompany('companyWebsite')} 
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
                        {...registerCompany('companyTaxNumber')} 
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
                        {...registerCompany('companyAddress')} 
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
                        {...registerCompany('currency')} 
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
                        {...registerCompany('taxRate')} 
                        className="block w-full pl-10 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500 transition-shadow" 
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end pt-4 border-t border-gray-100">
                  <button 
                    type="submit" 
                    disabled={updateSettingsMutation.isPending}
                    className="inline-flex items-center px-4 py-2 text-sm font-semibold rounded-lg text-white bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 shadow-md hover:shadow-lg focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 active:scale-95 transition-all disabled:opacity-50"
                  >
                    {updateSettingsMutation.isPending ? (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <Save className="w-4 h-4 mr-2" />
                    )}
                    Save Changes
                  </button>
                </div>
              </form>
            )}

            {/* Tab: My Profile */}
            {activeTab === 'profile' && (
              <form onSubmit={handleProfileSubmit(onProfileSubmit)} className="space-y-6">
                <div>
                  <h2 className="text-lg font-bold text-gray-900">My Profile</h2>
                  <p className="text-xs text-gray-500 mt-0.5">Manage your user information and security settings.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500">Full Name</label>
                    <div className="mt-1.5 relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <User className="h-4 w-4 text-gray-400" />
                      </div>
                      <input 
                        type="text" 
                        {...registerProfile('name', { required: 'Name is required' })} 
                        className="block w-full pl-10 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500 transition-shadow" 
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500">Email Address</label>
                    <div className="mt-1.5 relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Mail className="h-4 w-4 text-gray-400" />
                      </div>
                      <input 
                        type="email" 
                        {...registerProfile('email', { required: 'Email is required' })} 
                        className="block w-full pl-10 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500 transition-shadow" 
                      />
                    </div>
                  </div>

                  <div className="md:col-span-2 border-t border-gray-100 pt-5 mt-2">
                    <h3 className="text-sm font-semibold text-gray-700">Change Password</h3>
                    <p className="text-xs text-gray-500 mt-0.5">Leave blank if you don't want to change your password.</p>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500">New Password</label>
                    <div className="mt-1.5 relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Lock className="h-4 w-4 text-gray-400" />
                      </div>
                      <input 
                        type="password" 
                        {...registerProfile('password', {
                          minLength: { value: 6, message: 'Password must be at least 6 characters' }
                        })} 
                        className="block w-full pl-10 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500 transition-shadow" 
                      />
                    </div>
                    {profileErrors.password && <p className="mt-1 text-xs text-red-500">{profileErrors.password.message}</p>}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500">Confirm New Password</label>
                    <div className="mt-1.5 relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Lock className="h-4 w-4 text-gray-400" />
                      </div>
                      <input 
                        type="password" 
                        {...registerProfile('confirmPassword', {
                          validate: (value) => value === watch('password') || 'Passwords do not match'
                        })} 
                        className="block w-full pl-10 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500 transition-shadow" 
                      />
                    </div>
                    {profileErrors.confirmPassword && <p className="mt-1 text-xs text-red-500">{profileErrors.confirmPassword.message}</p>}
                  </div>
                </div>

                <div className="flex justify-end pt-4 border-t border-gray-100">
                  <button 
                    type="submit" 
                    disabled={updateProfileMutation.isPending}
                    className="inline-flex items-center px-4 py-2 text-sm font-semibold rounded-lg text-white bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 shadow-md hover:shadow-lg focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 active:scale-95 transition-all disabled:opacity-50"
                  >
                    {updateProfileMutation.isPending ? (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <Save className="w-4 h-4 mr-2" />
                    )}
                    Update Profile
                  </button>
                </div>
              </form>
            )}

            {/* Tab: Preferences & Defaults */}
            {activeTab === 'preferences' && (
              <form onSubmit={handlePrefsSubmit(onPrefsSubmit)} className="space-y-6">
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
                        {...registerPrefs('termsAndConditions')} 
                        className="block w-full pl-10 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500 transition-shadow font-mono" 
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end pt-4 border-t border-gray-100">
                  <button 
                    type="submit" 
                    disabled={updateSettingsMutation.isPending}
                    className="inline-flex items-center px-4 py-2 text-sm font-semibold rounded-lg text-white bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 shadow-md hover:shadow-lg focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 active:scale-95 transition-all disabled:opacity-50"
                  >
                    {updateSettingsMutation.isPending ? (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <Save className="w-4 h-4 mr-2" />
                    )}
                    Save Preferences
                  </button>
                </div>
              </form>
            )}

            {/* Tab: System Status removed */}
          </div>
        </div>
      </div>
    </div>
  );
}
