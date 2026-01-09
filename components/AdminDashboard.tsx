
import React from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { Users, TrendingUp, Heart, Map, Calendar, Download } from 'lucide-react';

const REGIONAL_DATA = [
  { name: 'North', users: 4500, intervention: 1200 },
  { name: 'South', users: 3200, intervention: 1800 },
  { name: 'East', users: 2100, intervention: 900 },
  { name: 'West', users: 5400, intervention: 2100 },
];

const IMPACT_DATA = [
  { name: 'Income Increase', value: 35 },
  { name: 'Water Saved', value: 25 },
  { name: 'Pesticide Reduction', value: 20 },
  { name: 'Insurance Coverage', value: 20 },
];

const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444'];

const StatCard = ({ title, value, change, icon: Icon, color }: any) => (
  <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
    <div className="flex items-center justify-between mb-4">
      <div className={`p-3 rounded-xl bg-${color}-50 text-${color}-600`}>
        <Icon size={24} />
      </div>
      <span className={`text-sm font-bold text-emerald-600`}>{change}</span>
    </div>
    <h3 className="text-slate-500 text-sm font-medium">{title}</h3>
    <p className="text-2xl font-bold text-slate-800">{value}</p>
  </div>
);

const AdminDashboard: React.FC = () => {
  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Admin Dashboard</h1>
          <p className="text-slate-500">Monitoring rural impact and system health across India.</p>
        </div>
        <div className="flex items-center space-x-3">
          <button className="flex items-center space-x-2 px-4 py-2 border border-slate-200 bg-white rounded-lg text-slate-600 font-medium hover:bg-slate-50">
            <Calendar size={18} />
            <span>Last 30 Days</span>
          </button>
          <button className="flex items-center space-x-2 px-4 py-2 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700 shadow-sm">
            <Download size={18} />
            <span>Export Report</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Active Farmers" value="15,234" change="+12%" icon={Users} color="blue" />
        <StatCard title="Successful Interventions" value="4,892" change="+18%" icon={TrendingUp} color="emerald" />
        <StatCard title="Community Sentiment" value="4.8/5" change="+0.2" icon={Heart} color="rose" />
        <StatCard title="Districts Covered" value="42" change="0%" icon={Map} color="amber" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Adoption Chart */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <h3 className="text-lg font-bold text-slate-800 mb-6">Regional Adoption vs Interventions</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={REGIONAL_DATA}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip />
                <Legend iconType="circle" />
                <Bar dataKey="users" name="Total Farmers" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                <Bar dataKey="intervention" name="AI-Led Actions" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Impact Breakdown */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <h3 className="text-lg font-bold text-slate-800 mb-6">Key Impact Indicators (%)</h3>
          <div className="h-80 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={IMPACT_DATA}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {IMPACT_DATA.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend layout="vertical" align="right" verticalAlign="middle" />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      
      {/* System Alerts */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
        <h3 className="text-lg font-bold text-slate-800 mb-4">Urgent Notifications</h3>
        <div className="space-y-3">
          {[
            { tag: 'Weather', msg: 'Severe heatwave forecast for Western Vidarbha. Triggering "Hydration Alerts" to 1.2k farmers.', type: 'critical' },
            { tag: 'Scheme', msg: 'New PM-Asha guidelines updated. Auto-eligibility bot needs sync.', type: 'info' },
            { tag: 'System', msg: 'Voice Assistant uptime: 99.8%. Regional dialects latency check required for Odisha.', type: 'system' }
          ].map((item, i) => (
            <div key={i} className="flex items-center space-x-4 p-4 rounded-xl bg-slate-50 border border-slate-100">
              <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${
                item.type === 'critical' ? 'bg-rose-100 text-rose-600' : 
                item.type === 'info' ? 'bg-blue-100 text-blue-600' : 'bg-slate-200 text-slate-600'
              }`}>
                {item.tag}
              </span>
              <p className="text-sm text-slate-600 flex-1">{item.msg}</p>
              <button className="text-xs font-bold text-emerald-600 hover:underline">View Action</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
