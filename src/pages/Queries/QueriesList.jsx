import React, { useState } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  Loader2, 
  Download, 
  Eye, 
  Mail, 
  Trash2, 
  Edit2, 
  Calendar, 
  ChevronDown,
  Check
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  getQueries, 
  exportQueries, 
  assignQuery, 
  updateQueryStatus, 
  deleteQuery 
} from '../../services/queryService';
import { getUsers } from '../../services/userService';

const statusCards = [
  { key: 'TOTAL', name: 'TOTAL', color: 'bg-[#2f3542] hover:bg-[#3f4552]' },
  { key: 'New', name: 'NEW', color: 'bg-[#4a69bd] hover:bg-[#5a79cd]' },
  { key: 'Proposal Sent', name: 'PROPOSAL SENT', color: 'bg-[#eccc68] hover:bg-[#fcde78]' },
  { key: 'No Connect', name: 'NO CONNECT', color: 'bg-[#3c6382] hover:bg-[#4c7392]' },
  { key: 'Hot Lead', name: 'HOT LEAD', color: 'bg-[#ff6b81] hover:bg-[#ff7b91]' },
  { key: 'Proposal Confirmed', name: 'PROPOSAL CON..', color: 'bg-[#a55eea] hover:bg-[#b56efa]' },
  { key: 'Cancel', name: 'CANCEL', color: 'bg-[#d63031] hover:bg-[#e64041]' },
  { key: 'Follow Up', name: 'FOLLOW UP', color: 'bg-[#ffa502] hover:bg-[#ffb512]' },
  { key: 'Confirmed', name: 'CONFIRMED', color: 'bg-[#2ed573] hover:bg-[#3ee583]' },
  { key: 'Postponed', name: 'POSTPONED', color: 'bg-[#1e272e] hover:bg-[#2e373e]' },
  { key: 'Invalid', name: 'INVALID', color: 'bg-[#78281f] hover:bg-[#88382f]' }
];

const statusColors = {
  'New': 'bg-blue-100 text-blue-800 border border-blue-200',
  'Proposal Sent': 'bg-yellow-100 text-yellow-800 border border-yellow-200',
  'No Connect': 'bg-indigo-100 text-indigo-800 border border-indigo-200',
  'Hot Lead': 'bg-pink-100 text-pink-800 border border-pink-200',
  'Proposal Confirmed': 'bg-purple-100 text-purple-800 border border-purple-200',
  'Cancel': 'bg-red-100 text-red-800 border border-red-200',
  'Follow Up': 'bg-amber-100 text-amber-800 border border-amber-200',
  'Confirmed': 'bg-green-100 text-green-800 border border-green-200',
  'Postponed': 'bg-gray-100 text-gray-800 border border-gray-200',
  'Invalid': 'bg-rose-100 text-rose-800 border border-rose-200'
};

export default function QueriesList() {
  const queryClient = useQueryClient();
  const [selectedStatus, setSelectedStatus] = useState('TOTAL');
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(true);
  const [showOptionsDropdown, setShowOptionsDropdown] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  // Fetch queries
  const { data: queries, isLoading, isFetching, refetch } = useQuery({
    queryKey: ['queries'],
    queryFn: () => getQueries(),
  });

  // Fetch executive users
  const { data: users } = useQuery({
    queryKey: ['users'],
    queryFn: () => getUsers(),
  });

  // Mutations
  const assignMutation = useMutation({
    mutationFn: ({ id, assignedTo }) => assignQuery(id, { assignedTo }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['queries'] });
    },
    onError: () => {
      alert('Failed to update assignee');
    }
  });

  const statusMutation = useMutation({
    mutationFn: ({ id, status }) => updateQueryStatus(id, { status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['queries'] });
    },
    onError: () => {
      alert('Failed to update query status');
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => deleteQuery(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['queries'] });
    },
    onError: () => {
      alert('Failed to delete query');
    }
  });

  const handleExport = async () => {
    try {
      setIsExporting(true);
      setShowOptionsDropdown(false);
      await exportQueries();
    } catch (err) {
      alert('Export failed');
    } finally {
      setIsExporting(false);
    }
  };

  const handleAssignChange = (queryId, userId) => {
    assignMutation.mutate({ id: queryId, assignedTo: userId });
  };

  const handleStatusChange = (queryId, newStatus) => {
    statusMutation.mutate({ id: queryId, status: newStatus });
  };

  const handleDelete = (id, queryId) => {
    if (window.confirm(`Are you sure you want to delete query ${queryId}?`)) {
      deleteMutation.mutate(id);
    }
  };

  // Date formatter
  const formatDate = (dateStr) => {
    if (!dateStr) return 'TBD';
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return 'TBD';
    const day = d.getDate().toString().padStart(2, '0');
    const month = (d.getMonth() + 1).toString().padStart(2, '0');
    const year = d.getFullYear();
    return `${day}-${month}-${year}`;
  };

  // Helper functions for entity extraction
  const getCustomerName = (q) => {
    if (q.client) return q.client.name;
    if (q.agent) return q.agent.agentName || q.agent.companyName;
    if (q.corporate) return q.corporate.companyName || q.corporate.contactPerson;
    return 'Unknown';
  };

  const getCustomerMobile = (q) => {
    if (q.client) return q.client.mobile;
    if (q.agent) return q.agent.mobile;
    if (q.corporate) return q.corporate.mobile;
    return 'N/A';
  };

  const getServiceLabel = (services) => {
    if (!services) return 'Custom Requirement';
    if (services.fullPackage) return 'Full package';
    if (services.hotelOnly) return 'Hotel only';
    if (services.transportOnly) return 'Transport only';
    if (services.activityOnly) return 'Activity only';
    return 'Custom Requirement';
  };

  // Dynamic filter logic
  const filteredQueries = (queries || []).filter(q => {
    // 1. Status Filter
    const matchesStatus = selectedStatus === 'TOTAL' || q.status === selectedStatus;
    
    // 2. Search Filter
    const queryIdMatch = q.queryId?.toLowerCase().includes(searchTerm.toLowerCase());
    const destinationMatch = q.destination?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const clientName = q.client?.name?.toLowerCase() || '';
    const agentName = q.agent?.agentName?.toLowerCase() || q.agent?.companyName?.toLowerCase() || '';
    const corporateName = q.corporate?.companyName?.toLowerCase() || q.corporate?.contactPerson?.toLowerCase() || '';
    const customerMatch = clientName.includes(searchTerm.toLowerCase()) || 
                          agentName.includes(searchTerm.toLowerCase()) || 
                          corporateName.includes(searchTerm.toLowerCase());
                          
    const matchesSearch = queryIdMatch || destinationMatch || customerMatch;

    return matchesStatus && matchesSearch;
  });

  const getPackageBadge = (q) => {
    if (!q.quotations || q.quotations.length === 0) {
      return <span className="text-xs text-gray-400 font-medium">No Package</span>;
    }

    const accepted = q.quotations.find(quote => quote.status === 'Accepted');
    if (accepted) {
      const itName = accepted.itinerary?.name || 'Package';
      return (
        <div className="bg-[#2ed573] text-white text-[11px] font-semibold py-1 px-2.5 rounded shadow-sm flex flex-col items-start gap-0.5">
          <span className="truncate max-w-[180px] flex items-center gap-1">✓ {itName}</span>
          <span>{accepted.totalAmount.toLocaleString()} {accepted.currency || 'INR'}</span>
        </div>
      );
    }

    const latest = q.quotations[0];
    const itName = latest.itinerary?.name || 'Package';
    return (
      <div className="bg-gray-50 text-gray-700 text-[11px] font-medium py-1 px-2.5 rounded border border-gray-200 flex flex-col items-start gap-0.5">
        <span className="truncate max-w-[180px] text-gray-800">{itName}</span>
        <span>{latest.totalAmount.toLocaleString()} {latest.currency || 'INR'} ({latest.status})</span>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Header Row */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold text-gray-900">Queries</h1>
        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          <Link 
            to="/queries/new" 
            className="flex-1 sm:flex-none inline-flex items-center justify-center px-4 py-2 border border-transparent shadow-sm text-sm font-semibold rounded-lg text-white bg-primary-600 hover:bg-primary-700 transition"
          >
            <Plus className="-ml-1 mr-1.5 h-5 w-5" />
            Add New
          </Link>
          
          {/* Options Dropdown */}
          <div className="relative flex-1 sm:flex-none">
            <button 
              onClick={() => setShowOptionsDropdown(!showOptionsDropdown)}
              className="w-full inline-flex items-center justify-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-semibold rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition"
            >
              Options
              <ChevronDown className="ml-1.5 h-4 w-4 text-gray-400" />
            </button>
            {showOptionsDropdown && (
              <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg py-1 z-50">
                <button
                  onClick={handleExport}
                  disabled={isExporting}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center disabled:opacity-50"
                >
                  {isExporting ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Download className="h-4 w-4 mr-2" />}
                  Export Excel
                </button>
              </div>
            )}
          </div>

          <button 
            onClick={() => refetch()}
            className="flex-1 sm:flex-none inline-flex items-center justify-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-semibold rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition"
          >
            {isFetching ? <Loader2 className="h-4 w-4 mr-1.5 animate-spin" /> : null}
            Load Leads
          </button>

          <button 
            onClick={() => setShowFilters(!showFilters)}
            className={`flex-1 sm:flex-none inline-flex items-center justify-center px-4 py-2 border shadow-sm text-sm font-semibold rounded-lg transition ${
              showFilters ? 'bg-primary-50 border-primary-300 text-primary-700' : 'border-gray-300 text-gray-700 bg-white hover:bg-gray-50'
            }`}
          >
            <Filter className="-ml-1 mr-1.5 h-4 w-4" />
            Filter
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="w-full overflow-hidden">
        <div className="flex gap-2.5 overflow-x-auto pb-3 pt-1 scrollbar-thin">
        {statusCards.map((card) => {
          const count = card.key === 'TOTAL' 
            ? (queries || []).length 
            : (queries || []).filter(q => q.status === card.key).length;

          const isActive = selectedStatus === card.key;

          return (
            <button
              key={card.key}
              onClick={() => setSelectedStatus(card.key)}
              className={`flex-shrink-0 w-28 text-white rounded-lg p-2.5 text-center transition-all focus:outline-none flex flex-col justify-between h-20 ${card.color} ${
                isActive 
                  ? 'ring-4 ring-offset-2 ring-primary-500 scale-105 shadow-md font-bold' 
                  : 'opacity-90 hover:opacity-100'
              }`}
            >
              <span className="text-2xl font-extrabold block text-center leading-none mt-1">{count}</span>
              <span className="text-[9px] font-bold tracking-wider uppercase block text-center truncate mb-1">
                {card.name}
              </span>
            </button>
          );
        })}
      </div>
    </div>

      {/* Filter Toolbar */}
      {showFilters && (
        <div className="bg-white shadow-sm rounded-lg border border-gray-200 p-4 flex flex-col sm:flex-row gap-4 items-center">
          <div className="relative flex-1 w-full">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-white placeholder-gray-400 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 sm:text-sm"
              placeholder="Search by ID, Customer Name, Mobile or Destination..."
            />
          </div>
          {searchTerm && (
            <button 
              onClick={() => setSearchTerm('')}
              className="text-sm text-gray-500 hover:text-gray-700 font-medium whitespace-nowrap"
            >
              Clear Search
            </button>
          )}
        </div>
      )}

      {/* Queries Table Card */}
      <div className="bg-white shadow-sm rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 align-middle">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">ID</th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Customer</th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Destination</th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Tour Date</th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Package</th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Assign</th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                <th scope="col" className="px-6 py-4 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredQueries.length > 0 ? (
                filteredQueries.map((query) => (
                  <tr key={query._id} className="hover:bg-gray-50/50 transition duration-150">
                    {/* ID */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col gap-1">
                        <Link 
                          to={`/queries/${query._id}`} 
                          className="text-sm font-semibold text-primary-600 hover:text-primary-700"
                        >
                          {query.queryId}
                        </Link>
                        <span className="text-[11px] text-gray-500 font-medium">
                          {query.pax?.adults || 0} Adult {query.pax?.children || 0} Child {query.pax?.infants || 0} Infant
                        </span>
                        <span className="text-[10px] text-gray-400">
                          {formatDate(query.createdAt)}
                        </span>
                      </div>
                    </td>

                    {/* Customer */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col gap-1">
                        <span className="text-sm font-semibold text-gray-900 block max-w-[180px] truncate">
                          {getCustomerName(query)}
                        </span>
                        <span className="text-xs text-gray-500 block">
                          {getCustomerMobile(query)}
                        </span>
                        <span className="inline-flex items-center w-max px-2 py-0.5 rounded text-[10px] font-semibold bg-gray-100 text-gray-700">
                          {query.queryType}
                        </span>
                      </div>
                    </td>

                    {/* Destination */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col items-start gap-1">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded text-xs font-semibold bg-white border border-[#3498db] text-[#3498db]">
                          {query.destination}
                        </span>
                        <span className="text-[11px] text-gray-500 font-medium">
                          {getServiceLabel(query.services)}
                        </span>
                      </div>
                    </td>

                    {/* Tour Date */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col text-xs text-gray-700 font-medium gap-0.5">
                        <span className="flex items-center gap-1.5">
                          <Calendar className="h-3.5 w-3.5 text-gray-400 flex-shrink-0" />
                          {formatDate(query.fromDate)}
                        </span>
                        {query.toDate && (
                          <span className="text-[10px] text-gray-400 pl-5">
                            Till {formatDate(query.toDate)}
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Package */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getPackageBadge(query)}
                    </td>

                    {/* Assign */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <select
                        value={query.assignedTo?._id || query.assignedTo || ''}
                        onChange={(e) => handleAssignChange(query._id, e.target.value)}
                        className="block w-full max-w-[160px] border border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-xs py-1.5 px-2.5 focus:outline-none bg-white text-gray-700 font-medium"
                      >
                        <option value="">Select Executive</option>
                        {users?.map((u) => (
                          <option key={u._id} value={u._id}>
                            {u.name}
                          </option>
                        ))}
                      </select>
                    </td>

                    {/* Status */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <select
                        value={query.status}
                        onChange={(e) => handleStatusChange(query._id, e.target.value)}
                        className={`text-xs font-semibold py-1 px-2.5 rounded-full outline-none focus:ring-1 focus:ring-primary-500 cursor-pointer ${
                          statusColors[query.status] || 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {statusCards.filter(c => c.key !== 'TOTAL').map(c => (
                          <option key={c.key} value={c.key} className="bg-white text-gray-700 font-medium">
                            {c.key}
                          </option>
                        ))}
                      </select>
                    </td>

                    {/* Action */}
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <div className="inline-flex rounded-md shadow-sm border border-gray-200 bg-white overflow-hidden">
                        <Link
                          to={`/queries/${query._id}`}
                          className="p-1.5 text-gray-500 hover:text-primary-600 hover:bg-gray-50 transition border-r border-gray-200"
                          title="View Details"
                        >
                          <Eye className="h-4 w-4" />
                        </Link>
                        <Link
                          to={`/emails?queryId=${query._id}`}
                          className="p-1.5 text-gray-500 hover:text-primary-600 hover:bg-gray-50 transition border-r border-gray-200"
                          title="Send Email"
                        >
                          <Mail className="h-4 w-4" />
                        </Link>
                        <button
                          onClick={() => handleDelete(query._id, query.queryId)}
                          className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-gray-50 transition border-r border-gray-200"
                          title="Delete Query"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                        <Link
                          to={`/queries/${query._id}`}
                          className="p-1.5 text-gray-500 hover:text-primary-600 hover:bg-gray-50 transition"
                          title="Edit Query"
                        >
                          <Edit2 className="h-4 w-4" />
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="9" className="px-6 py-12 text-center text-sm text-gray-500 font-medium">
                    No queries found matching the selected filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}