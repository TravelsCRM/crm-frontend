import React, { useState } from 'react';
import { 
  Building, 
  User, 
  Sliders, 
  Loader2, 
  CheckCircle2, 
  AlertCircle,
  Users
} from 'lucide-react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { 
  getSettings, 
  updateSettings, 
  updateProfile, 
  getRoles, 
  createUser, 
  getUsers 
} from '../../services/settingsService';
import { useAuth } from '../../context/AuthContext';

// Import subcomponents
import CompanySettingsTab from './components/CompanySettingsTab';
import MyProfileTab from './components/MyProfileTab';
import PreferencesTab from './components/PreferencesTab';
import UserManagementTab from './components/UserManagementTab';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('company');
  const [notification, setNotification] = useState(null);
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  
  const { user, updateUser } = useAuth();
  const queryClient = useQueryClient();

  const isSuperAdmin = user?.role?.name === 'Super Admin';
  const hasUserManagePermission = isSuperAdmin || user?.role?.permissions?.includes('manage_users');

  // Fetch company/CRM settings
  const { data: settings, isLoading, error } = useQuery({
    queryKey: ['settings'],
    queryFn: getSettings
  });

  // Fetch users list
  const { data: usersList, isLoading: isLoadingUsers } = useQuery({
    queryKey: ['users-list'],
    queryFn: getUsers,
    enabled: !!hasUserManagePermission,
  });

  // Fetch roles list
  const { data: rolesList } = useQuery({
    queryKey: ['roles-list'],
    queryFn: getRoles,
    enabled: !!hasUserManagePermission,
  });

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
    },
    onError: (err) => {
      showToast(err.response?.data?.message || 'Failed to update profile', 'error');
    }
  });

  const createUserMutation = useMutation({
    mutationFn: createUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users-list'] });
      showToast('User created successfully!');
      setShowAddUserModal(false);
    },
    onError: (err) => {
      showToast(err.response?.data?.message || 'Failed to create user', 'error');
    }
  });

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

  if (hasUserManagePermission) {
    tabs.push({ id: 'users', label: 'User Management', icon: Users });
  }

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
            {activeTab === 'company' && (
              <CompanySettingsTab 
                settings={settings} 
                onSave={updateSettingsMutation.mutate} 
                isSaving={updateSettingsMutation.isPending} 
              />
            )}

            {activeTab === 'profile' && (
              <MyProfileTab 
                user={user} 
                onSave={updateProfileMutation.mutate} 
                isSaving={updateProfileMutation.isPending} 
              />
            )}

            {activeTab === 'preferences' && (
              <PreferencesTab 
                settings={settings} 
                onSave={updateSettingsMutation.mutate} 
                isSaving={updateSettingsMutation.isPending} 
              />
            )}

            {activeTab === 'users' && hasUserManagePermission && (
              <UserManagementTab 
                usersList={usersList} 
                isLoadingUsers={isLoadingUsers} 
                rolesList={rolesList} 
                onCreateUser={createUserMutation.mutate} 
                isCreating={createUserMutation.isPending} 
                showAddUserModal={showAddUserModal}
                setShowAddUserModal={setShowAddUserModal}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
