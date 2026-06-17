import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { UserPlus, X, Save, Loader2 } from 'lucide-react';

export default function AddUserModal({ isOpen, onClose, onCreateUser, isCreating, rolesList }) {
  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  // Reset form when modal opens/closes
  useEffect(() => {
    if (!isOpen) {
      reset();
    }
  }, [isOpen, reset]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/60 backdrop-blur-xs px-4">
      <div className="bg-white rounded-xl shadow-2xl border border-gray-200 w-full max-w-md overflow-hidden transform transition-all duration-300">
        
        {/* Header */}
        <div className="bg-gray-50 px-6 py-4 border-b border-gray-150 flex justify-between items-center">
          <div className="flex items-center space-x-2 text-gray-800">
            <UserPlus className="h-5 w-5 text-primary-600" />
            <h3 className="text-base font-bold">Add New User</h3>
          </div>
          <button 
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-650 transition-colors p-1 rounded-lg hover:bg-gray-100"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form body */}
        <form onSubmit={handleSubmit(onCreateUser)} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500">Full Name</label>
            <input 
              type="text" 
              {...register('name', { required: 'Name is required' })} 
              className="mt-1.5 block w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-primary-500 focus:border-primary-500 outline-none transition-shadow" 
              placeholder="John Doe"
            />
            {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name.message}</p>}
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500">Email Address</label>
            <input 
              type="email" 
              {...register('email', { 
                required: 'Email is required',
                pattern: { value: /^\S+@\S+\.\S+$/, message: 'Invalid email address' }
              })} 
              className="mt-1.5 block w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-primary-500 focus:border-primary-500 outline-none transition-shadow" 
              placeholder="john@example.com"
            />
            {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>}
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500">Temporary Password</label>
            <input 
              type="password" 
              {...register('password', { 
                required: 'Password is required',
                minLength: { value: 6, message: 'Password must be at least 6 characters' }
              })} 
              className="mt-1.5 block w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-primary-500 focus:border-primary-500 outline-none transition-shadow" 
              placeholder="••••••••"
            />
            {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password.message}</p>}
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500">Select Role</label>
            <select 
              {...register('role', { required: 'Role selection is required' })} 
              className="mt-1.5 block w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm bg-white focus:ring-primary-500 focus:border-primary-500 outline-none transition-shadow"
            >
              <option value="">-- Choose a Role --</option>
              {rolesList?.map((r) => (
                <option key={r._id} value={r._id}>{r.name}</option>
              ))}
            </select>
            {errors.role && <p className="mt-1 text-xs text-red-500">{errors.role.message}</p>}
          </div>

          <div className="flex justify-end space-x-3 pt-5 border-t border-gray-100">
            <button 
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-semibold text-gray-700 bg-white hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button 
              type="submit"
              disabled={isCreating}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg text-sm font-semibold text-white bg-primary-600 hover:bg-primary-700 shadow-sm active:scale-95 transition-all disabled:opacity-50"
            >
              {isCreating ? (
                <Loader2 className="h-4.5 w-4.5 animate-spin mr-2" />
              ) : (
                <Save className="h-4 w-4 mr-2" />
              )}
              Create User
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
