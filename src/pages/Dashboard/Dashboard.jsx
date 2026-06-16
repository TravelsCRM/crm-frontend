import React from 'react';
import { 
  Users, 
  FileText, 
  CheckCircle, 
  XCircle, 
  Clock, 
  TrendingUp,
  AlertCircle,
  Loader2
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { getDashboardStats } from '../../services/dashboardService';
import { Link } from 'react-router-dom';

const StatCard = ({ title, value, icon: Icon, colorClass }) => (
  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5 flex items-center">
    <div className={`p-3 rounded-full ${colorClass} mr-4`}>
      <Icon className="h-6 w-6" />
    </div>
    <div>
      <p className="text-sm font-medium text-gray-500">{title}</p>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
    </div>
  </div>
);

export default function Dashboard() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: getDashboardStats,
  });

  if (isLoading) return <div className="flex justify-center py-12"><Loader2 className="animate-spin h-8 w-8 text-primary-600" /></div>;
  if (error) return <div className="text-red-600">Error: {error.message}</div>;

  const { stats, recentQueries, upcomingFollowups } = data;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <div className="flex space-x-2">
          <select className="border-gray-300 rounded-md text-sm py-2 pl-3 pr-8 focus:ring-primary-500 focus:border-primary-500">
            <option>Today</option>
            <option>This Week</option>
            <option>This Month</option>
            <option>All Time</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Today's Queries" 
          value={stats.todayQueries} 
          icon={FileText} 
          colorClass="bg-blue-100 text-blue-600" 
        />
        <StatCard 
          title="Total Queries" 
          value={stats.totalQueries} 
          icon={Users} 
          colorClass="bg-indigo-100 text-indigo-600" 
        />
        <StatCard 
          title="Proposal Sent" 
          value={stats.proposalSent} 
          icon={TrendingUp} 
          colorClass="bg-yellow-100 text-yellow-600" 
        />
        <StatCard 
          title="Hot Leads" 
          value={stats.hotLeads} 
          icon={AlertCircle} 
          colorClass="bg-orange-100 text-orange-600" 
        />
        <StatCard 
          title="Confirmed Bookings" 
          value={stats.confirmed} 
          icon={CheckCircle} 
          colorClass="bg-green-100 text-green-600" 
        />
        <StatCard 
          title="Follow Up" 
          value={stats.followups} 
          icon={Clock} 
          colorClass="bg-purple-100 text-purple-600" 
        />
        <StatCard 
          title="Cancelled" 
          value={stats.cancelled} 
          icon={XCircle} 
          colorClass="bg-red-100 text-red-600" 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-200 flex justify-between items-center">
            <h2 className="text-lg font-medium text-gray-900">Recent Queries</h2>
            <Link to="/queries" className="text-sm text-primary-600 hover:text-primary-700 font-medium">View All</Link>
          </div>
          <div className="divide-y divide-gray-200">
            {recentQueries.map((query) => (
              <Link key={query._id} to={`/queries/${query._id}`} className="block px-5 py-3 hover:bg-gray-50 transition-colors">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{query.queryId} - {query.client?.name || query.agent?.agentName || query.corporate?.companyName}</p>
                    <p className="text-xs text-gray-500">{query.destination} • {query.queryType}</p>
                  </div>
                  <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full uppercase ${
                    query.status === 'New' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {query.status}
                  </span>
                </div>
              </Link>
            ))}
            {recentQueries.length === 0 && <div className="px-5 py-8 text-center text-sm text-gray-500 italic">No recent queries</div>}
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Upcoming Followups</h2>
          </div>
          <div className="divide-y divide-gray-200">
            {upcomingFollowups.map((followup) => (
              <div key={followup._id} className="px-5 py-3 hover:bg-gray-50 transition-colors">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{followup.query?.queryId} - {followup.note}</p>
                    <p className="text-xs text-gray-500">
                      {new Date(followup.followupDate).toLocaleDateString()} at {followup.followupTime}
                    </p>
                  </div>
                  <button className="text-xs text-primary-600 hover:text-primary-700 font-medium">Complete</button>
                </div>
              </div>
            ))}
            {upcomingFollowups.length === 0 && <div className="px-5 py-8 text-center text-sm text-gray-500 italic">No upcoming followups</div>}
          </div>
        </div>
      </div>
    </div>
  );
}