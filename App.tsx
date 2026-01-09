
import React, { useState } from 'react';
import { HashRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Sprout, 
  PhoneCall, 
  FileText, 
  Users, 
  Settings, 
  Menu, 
  X, 
  TrendingUp, 
  Leaf 
} from 'lucide-react';
import FarmerPortal from './components/FarmerPortal';
import AdminDashboard from './components/AdminDashboard';
import VoiceAssistant from './components/VoiceAssistant';
import SchemePortal from './components/SchemePortal';

const SidebarLink = ({ to, icon: Icon, label, active }: { to: string, icon: any, label: string, active: boolean }) => (
  <Link 
    to={to} 
    className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
      active 
        ? 'bg-emerald-600 text-white shadow-md' 
        : 'text-slate-600 hover:bg-emerald-50 hover:text-emerald-600'
    }`}
  >
    <Icon size={20} />
    <span className="font-medium">{label}</span>
  </Link>
);

const Navbar = ({ toggleSidebar }: { toggleSidebar: () => void }) => (
  <nav className="sticky top-0 z-50 bg-white border-b border-slate-200 px-4 py-3 flex items-center justify-between">
    <div className="flex items-center space-x-3">
      <button onClick={toggleSidebar} className="lg:hidden p-2 text-slate-600">
        <Menu size={24} />
      </button>
      <div className="flex items-center space-x-2">
        <div className="bg-emerald-600 p-2 rounded-lg">
          <Leaf className="text-white" size={24} />
        </div>
        <span className="text-xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
          AgriMitra
        </span>
      </div>
    </div>
    <div className="flex items-center space-x-4">
      <span className="hidden sm:inline text-sm text-slate-500 italic">"Sashakt Kisan, Samriddh Bharat"</span>
      <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold">
        A
      </div>
    </div>
  </nav>
);

const AppContent = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const location = useLocation();

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar toggleSidebar={toggleSidebar} />
      
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside 
          className={`fixed inset-y-0 left-0 transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:relative lg:translate-x-0 transition duration-200 ease-in-out z-40 w-64 bg-white border-r border-slate-200 flex flex-col`}
        >
          <div className="p-4 space-y-2 flex-1">
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4 px-4">
              Farmer Services
            </div>
            <SidebarLink to="/" icon={Sprout} label="Crop Advisor" active={location.pathname === '/'} />
            <SidebarLink to="/schemes" icon={FileText} label="Govt Schemes" active={location.pathname === '/schemes'} />
            <SidebarLink to="/voice" icon={PhoneCall} label="Voice Helper" active={location.pathname === '/voice'} />
            
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mt-8 mb-4 px-4">
              Management
            </div>
            <SidebarLink to="/admin" icon={LayoutDashboard} label="Admin Panel" active={location.pathname === '/admin'} />
            <SidebarLink to="/analytics" icon={TrendingUp} label="Impact Analytics" active={location.pathname === '/analytics'} />
            <SidebarLink to="/farmers" icon={Users} label="Farmer Database" active={location.pathname === '/farmers'} />
          </div>
          
          <div className="p-4 border-t border-slate-100">
            <SidebarLink to="/settings" icon={Settings} label="Settings" active={location.pathname === '/settings'} />
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto bg-slate-50 p-4 lg:p-8">
          <div className="max-w-6xl mx-auto">
            <Routes>
              <Route path="/" element={<FarmerPortal />} />
              <Route path="/schemes" element={<SchemePortal />} />
              <Route path="/voice" element={<VoiceAssistant />} />
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/analytics" element={<AdminDashboard />} />
              <Route path="/farmers" element={<div className="p-8 text-center bg-white rounded-xl shadow-sm">Farmer database module coming in Phase 3.</div>} />
            </Routes>
          </div>
        </main>
      </div>
    </div>
  );
};

const App = () => {
  return (
    <Router>
      <AppContent />
    </Router>
  );
};

export default App;
