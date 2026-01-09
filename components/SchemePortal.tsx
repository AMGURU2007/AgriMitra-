
import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  Search, 
  CheckCircle2, 
  HelpCircle, 
  ArrowRight,
  ShieldCheck,
  CreditCard,
  GraduationCap,
  Banknote
} from 'lucide-react';
import { checkSchemeEligibility } from '../services/gemini';
import { GovtScheme } from '../types';

const SchemePortal: React.FC = () => {
  const [schemes, setSchemes] = useState<GovtScheme[]>([]);
  const [filter, setFilter] = useState('All');

  useEffect(() => {
    const load = async () => {
      const data = await checkSchemeEligibility({
        location: 'UP',
        landSize: 2,
        soilType: 'Alluvial',
        waterSource: 'Borewell'
      });
      setSchemes(data);
    };
    load();
  }, []);

  const getIcon = (category: string) => {
    switch (category) {
      case 'Subsidy': return <Banknote className="text-emerald-600" />;
      case 'Insurance': return <ShieldCheck className="text-blue-600" />;
      case 'Credit': return <CreditCard className="text-amber-600" />;
      case 'Education': return <GraduationCap className="text-purple-600" />;
      default: return <FileText className="text-slate-600" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Government Schemes</h1>
          <p className="text-slate-500">Find the financial aid and support you're eligible for.</p>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            placeholder="Search schemes..." 
            className="pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 w-full md:w-64"
          />
        </div>
      </div>

      <div className="flex space-x-2 overflow-x-auto pb-2">
        {['All', 'Credit', 'Insurance', 'Subsidy', 'Education'].map((cat) => (
          <button 
            key={cat}
            onClick={() => setFilter(cat)}
            className={`px-4 py-1.5 rounded-full text-sm font-semibold whitespace-nowrap transition-colors ${
              filter === cat 
                ? 'bg-emerald-600 text-white' 
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {schemes
          .filter(s => filter === 'All' || s.category === filter)
          .map((scheme) => (
            <div key={scheme.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="p-3 bg-slate-50 rounded-xl">
                    {getIcon(scheme.category)}
                  </div>
                  <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase bg-slate-100 text-slate-600`}>
                    {scheme.category}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-slate-800 mb-2">{scheme.name}</h3>
                <p className="text-sm text-slate-600 line-clamp-2 mb-6">
                  {scheme.description}
                </p>
                
                <div className="space-y-4">
                  <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-100">
                    <p className="text-xs font-bold text-emerald-800 uppercase mb-2 flex items-center">
                      <CheckCircle2 size={14} className="mr-1" />
                      Key Benefit
                    </p>
                    <p className="text-sm font-semibold text-emerald-700">{scheme.benefit}</p>
                  </div>
                  
                  <div className="space-y-2">
                    <p className="text-xs font-bold text-slate-400 uppercase flex items-center">
                      <HelpCircle size={14} className="mr-1" />
                      Eligibility
                    </p>
                    <ul className="grid grid-cols-1 gap-1">
                      {scheme.eligibility.map((item, idx) => (
                        <li key={idx} className="text-xs text-slate-600 flex items-center">
                          <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full mr-2"></span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
              <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500">Apply via AgriMitra</span>
                <button className="flex items-center text-emerald-600 font-bold text-sm hover:underline">
                  Details <ArrowRight size={16} className="ml-1" />
                </button>
              </div>
            </div>
          ))}
      </div>
      
      {/* Alert Block */}
      <div className="bg-amber-50 border border-amber-200 p-6 rounded-2xl flex items-center space-x-6">
        <div className="hidden sm:block w-32 h-20 bg-amber-100 rounded-xl flex items-center justify-center text-amber-500">
           <FileText size={40} />
        </div>
        <div className="flex-1">
          <h4 className="font-bold text-amber-900">Verify Your Documents</h4>
          <p className="text-sm text-amber-800 mt-1">
            To auto-apply for these schemes, please ensure your Aadhar card and land records (Patta) are uploaded to your AgriMitra locker.
          </p>
        </div>
        <button className="px-4 py-2 bg-amber-600 text-white rounded-lg font-bold hover:bg-amber-700 shadow-sm transition-colors whitespace-nowrap">
          Open Locker
        </button>
      </div>
    </div>
  );
};

export default SchemePortal;
