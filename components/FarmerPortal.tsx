
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Search, 
  MapPin, 
  Maximize, 
  Droplets, 
  Sprout, 
  TrendingUp, 
  AlertCircle,
  ChevronRight,
  Loader2,
  PhoneCall
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { getCropRecommendations, reverseGeocode } from '../services/gemini';
import { CropRecommendation, FarmerProfile } from '../types';

const MOCK_TRENDS = [
  { month: 'Jan', price: 2100 },
  { month: 'Feb', price: 2150 },
  { month: 'Mar', price: 2200 },
  { month: 'Apr', price: 2400 },
  { month: 'May', price: 2350 },
  { month: 'Jun', price: 2280 },
];

const FarmerPortal: React.FC = () => {
  const [profile, setProfile] = useState<FarmerProfile>({
    location: 'Detecting...',
    landSize: 2.5,
    soilType: 'Alluvial',
    waterSource: 'Borewell'
  });
  const [recommendations, setRecommendations] = useState<CropRecommendation[]>([]);
  const [loading, setLoading] = useState(false);
  const [locating, setLocating] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  const fetchRecommendations = async (currentProfile?: FarmerProfile) => {
    setLoading(true);
    const data = await getCropRecommendations(currentProfile || profile);
    setRecommendations(data);
    setLoading(false);
    setIsEditing(false);
  };

  useEffect(() => {
    const detectLocation = () => {
      if (!navigator.geolocation) {
        setProfile(prev => ({ ...prev, location: "Lucknow, Uttar Pradesh" }));
        setLocating(false);
        fetchRecommendations();
        return;
      }

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          const locationName = await reverseGeocode(latitude, longitude);
          const updatedProfile = { ...profile, location: locationName };
          setProfile(updatedProfile);
          setLocating(false);
          // Fetch recommendations using the detected location immediately
          fetchRecommendations(updatedProfile);
        },
        (error) => {
          console.warn("Location access denied", error);
          setProfile(prev => ({ ...prev, location: "Lucknow, Uttar Pradesh" }));
          setLocating(false);
          fetchRecommendations();
        },
        { timeout: 10000 }
      );
    };

    detectLocation();
  }, []);

  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Hi, Farmer Senthil</h1>
            <p className="text-slate-500">Welcome to your personalized farm assistant.</p>
          </div>
          <button 
            onClick={() => setIsEditing(!isEditing)}
            className="px-4 py-2 bg-emerald-50 text-emerald-700 font-semibold rounded-lg hover:bg-emerald-100 transition-colors"
          >
            {isEditing ? 'Cancel Edit' : 'Update Farm Profile'}
          </button>
        </div>

        {isEditing && (
          <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4 bg-emerald-50 p-4 rounded-xl">
            <div className="space-y-1">
              <label className="text-xs font-bold text-emerald-700 uppercase">Location</label>
              <input 
                value={profile.location} 
                onChange={(e) => setProfile({...profile, location: e.target.value})}
                className="w-full px-3 py-2 rounded-lg border-emerald-200 border bg-white focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-emerald-700 uppercase">Land Size (Acres)</label>
              <input 
                type="number"
                value={profile.landSize} 
                onChange={(e) => setProfile({...profile, landSize: parseFloat(e.target.value)})}
                className="w-full px-3 py-2 rounded-lg border-emerald-200 border bg-white focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-emerald-700 uppercase">Soil Type</label>
              <select 
                value={profile.soilType}
                onChange={(e) => setProfile({...profile, soilType: e.target.value})}
                className="w-full px-3 py-2 rounded-lg border-emerald-200 border bg-white focus:ring-2 focus:ring-emerald-500"
              >
                <option>Alluvial</option>
                <option>Black</option>
                <option>Red</option>
                <option>Sandy</option>
              </select>
            </div>
            <div className="flex items-end">
              <button 
                onClick={() => fetchRecommendations()}
                className="w-full py-2 bg-emerald-600 text-white font-bold rounded-lg hover:bg-emerald-700 shadow-sm"
              >
                Save & Update
              </button>
            </div>
          </div>
        )}

        <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="flex items-center space-x-3 p-3 bg-slate-50 rounded-xl relative overflow-hidden">
            {locating && <div className="absolute inset-0 bg-white/50 flex items-center justify-center"><Loader2 size={16} className="animate-spin text-emerald-600" /></div>}
            <MapPin className="text-emerald-600" size={20} />
            <div>
              <p className="text-xs text-slate-500">Location</p>
              <p className="font-semibold text-slate-700 text-sm truncate">{profile.location}</p>
            </div>
          </div>
          <div className="flex items-center space-x-3 p-3 bg-slate-50 rounded-xl">
            <Maximize className="text-emerald-600" size={20} />
            <div>
              <p className="text-xs text-slate-500">Land</p>
              <p className="font-semibold text-slate-700 text-sm">{profile.landSize} Acres</p>
            </div>
          </div>
          <div className="flex items-center space-x-3 p-3 bg-slate-50 rounded-xl">
            <Sprout className="text-emerald-600" size={20} />
            <div>
              <p className="text-xs text-slate-500">Soil</p>
              <p className="font-semibold text-slate-700 text-sm">{profile.soilType}</p>
            </div>
          </div>
          <div className="flex items-center space-x-3 p-3 bg-slate-50 rounded-xl">
            <Droplets className="text-emerald-600" size={20} />
            <div>
              <p className="text-xs text-slate-500">Water</p>
              <p className="font-semibold text-slate-700 text-sm">{profile.waterSource}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Crop Recommendations */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-xl font-bold text-slate-800 flex items-center">
            <Sprout className="mr-2 text-emerald-600" />
            Top AI Recommendations
          </h2>
          
          {loading ? (
            <div className="bg-white p-12 rounded-2xl flex flex-col items-center justify-center space-y-4 border border-slate-200">
              <Loader2 className="animate-spin text-emerald-600" size={40} />
              <p className="text-slate-500 animate-pulse">Our AI is analyzing local soil & market conditions...</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {recommendations.map((crop, idx) => (
                <div key={idx} className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 hover:border-emerald-300 transition-all group">
                  <div className="flex flex-col md:flex-row justify-between md:items-start gap-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-bold text-slate-800">{crop.cropName}</h3>
                        <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 text-xs font-bold rounded-full">
                          {crop.suitability}% Match
                        </span>
                      </div>
                      <p className="text-slate-600 text-sm leading-relaxed mb-4">{crop.reasoning}</p>
                      <div className="flex space-x-6">
                        <div>
                          <p className="text-xs text-slate-400 uppercase font-bold">Est. Yield</p>
                          <p className="font-semibold text-slate-700">{crop.estimatedYield}</p>
                        </div>
                        <div>
                          <p className="text-xs text-slate-400 uppercase font-bold">Mkt Price</p>
                          <p className="font-semibold text-emerald-600">{crop.expectedPrice}</p>
                        </div>
                      </div>
                    </div>
                    <button className="flex items-center justify-center p-3 bg-slate-50 text-slate-400 rounded-xl group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                      <ChevronRight size={24} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Sidebar Widgets */}
        <div className="space-y-6">
          {/* Price Trends */}
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200">
            <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center">
              <TrendingUp className="mr-2 text-blue-600" size={20} />
              Wheat Market Trend
            </h3>
            <div className="h-48 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={MOCK_TRENDS}>
                  <defs>
                    <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#059669" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#059669" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fontSize: 12}} />
                  <YAxis hide />
                  <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                  <Area type="monotone" dataKey="price" stroke="#059669" fillOpacity={1} fill="url(#colorPrice)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 p-3 bg-blue-50 border border-blue-100 rounded-xl">
              <div className="flex items-start space-x-2">
                <AlertCircle className="text-blue-600 flex-shrink-0" size={18} />
                <p className="text-xs text-blue-800">
                  Prices are expected to rise by 8% next month due to low buffer stocks.
                </p>
              </div>
            </div>
          </div>

          {/* Quick Support */}
          <div className="bg-gradient-to-br from-emerald-600 to-teal-700 p-6 rounded-2xl shadow-lg text-white">
            <h3 className="text-lg font-bold mb-2">Need Voice Help?</h3>
            <p className="text-emerald-50 text-sm mb-4">
              Our AI assistant can talk to you in Hindi, Tamil, or your local language.
            </p>
            <Link 
              to="/voice"
              className="w-full py-2 bg-white text-emerald-700 font-bold rounded-lg flex items-center justify-center space-x-2 hover:bg-emerald-50 transition-colors"
            >
              <PhoneCall size={18} />
              <span>Call AgriMitra AI</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FarmerPortal;
