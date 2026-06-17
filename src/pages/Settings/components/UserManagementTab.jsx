import React from 'react';
import { UserPlus, Loader2 } from 'lucide-react';
import AddUserModal from './AddUserModal';

export default function UserManagementTab({ 
  usersList, 
  isLoadingUsers, 
  rolesList, 
  onCreateUser, 
  isCreating,
  showAddUserModal,
  setShowAddUserModal
}) {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-lg font-bold text-gray-900">User Management</h2>
          <p className="text-xs text-gray-500 mt-0.5">Manage access control and credentials for your organization.</p>
        </div>
        <button
          onClick={() => setShowAddUserModal(true)}
          className="inline-flex items-center px-4 py-2 text-sm font-semibold rounded-lg text-white bg-primary-600 hover:bg-primary-700 shadow-md active:scale-95 transition-all"
        >
          <UserPlus className="h-4 w-4 mr-2" />
          Add User
        </button>
      </div>

      {/* Users Table */}
      <div className="border border-gray-150 rounded-xl overflow-hidden bg-white shadow-xs">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 font-medium">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Email</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Role</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Created</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 bg-white">
              {isLoadingUsers ? (
                <tr>
                  <td colSpan="5" className="px-6 py-10 text-center text-sm text-gray-400">
                    <Loader2 className="h-5 w-5 animate-spin mx-auto text-primary-600 mb-2" />
                    Loading users...
                  </td>
                </tr>
              ) : (
                usersList?.map((u) => (
                  <tr key={u._id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 rounded-full bg-primary-50 flex items-center justify-center text-primary-700 font-bold uppercase text-xs">
                          {u.name.substring(0, 2)}
                        </div>
                        <span>{u.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{u.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-150">
                        {u.role?.name || 'No Role'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${
                        u.status === 'active' 
                          ? 'bg-green-50 text-green-700 border-green-150' 
                          : 'bg-gray-50 text-gray-700 border-gray-150'
                      }`}>
                        {u.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(u.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))
              )}
              {!isLoadingUsers && usersList?.length === 0 && (
                <tr>
                  <td colSpan="5" className="px-6 py-10 text-center text-sm text-gray-500 italic">
                    No users found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Dialog */}
      <AddUserModal
        isOpen={showAddUserModal}
        onClose={() => setShowAddUserModal(false)}
        onCreateUser={onCreateUser}
        isCreating={isCreating}
        rolesList={rolesList}
      />
    </div>
  );
}
