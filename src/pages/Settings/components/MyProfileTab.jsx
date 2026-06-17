import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { User, Mail, Lock, Save, Loader2 } from 'lucide-react';

export default function MyProfileTab({ user, onSave, isSaving }) {
  const { register, handleSubmit, reset, watch, formState: { errors } } = useForm();

  useEffect(() => {
    if (user) {
      reset({
        name: user.name || '',
        email: user.email || '',
        password: '',
        confirmPassword: ''
      });
    }
  }, [user, reset]);

  const onSubmit = (data) => {
    const { name, email, password } = data;
    const payload = { name, email };
    if (password) {
      payload.password = password;
    }
    onSave(payload);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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
              {...register('name', { required: 'Name is required' })} 
              className="block w-full pl-10 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500 transition-shadow" 
            />
          </div>
          {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name.message}</p>}
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500">Email Address</label>
          <div className="mt-1.5 relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Mail className="h-4 w-4 text-gray-400" />
            </div>
            <input 
              type="email" 
              {...register('email', { required: 'Email is required' })} 
              className="block w-full pl-10 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500 transition-shadow" 
            />
          </div>
          {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>}
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
              {...register('password', {
                minLength: { value: 6, message: 'Password must be at least 6 characters' }
              })} 
              className="block w-full pl-10 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500 transition-shadow" 
            />
          </div>
          {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password.message}</p>}
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500">Confirm New Password</label>
          <div className="mt-1.5 relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Lock className="h-4 w-4 text-gray-400" />
            </div>
            <input 
              type="password" 
              {...register('confirmPassword', {
                validate: (value) => value === watch('password') || 'Passwords do not match'
              })} 
              className="block w-full pl-10 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500 transition-shadow" 
            />
          </div>
          {errors.confirmPassword && <p className="mt-1 text-xs text-red-500">{errors.confirmPassword.message}</p>}
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
          Update Profile
        </button>
      </div>
    </form>
  );
}
