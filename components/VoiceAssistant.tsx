
import React, { useState, useEffect, useRef } from 'react';
import { 
  Mic, 
  MicOff, 
  PhoneOff, 
  PhoneCall, 
  Volume2, 
  MessageCircle,
  Sparkles,
  RefreshCcw,
  Languages
} from 'lucide-react';

const VoiceAssistant: React.FC = () => {
  const [isCalling, setIsCalling] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState<string[]>([]);
  const [currentStatus, setCurrentStatus] = useState("Ready to call");
  const [selectedLang, setSelectedLang] = useState("Hindi");

  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [transcript]);

  const startCall = () => {
    setIsCalling(true);
    setCurrentStatus("Connecting to AgriMitra AI...");
    setTimeout(() => {
      setCurrentStatus("Connected");
      addMessage("AgriMitra", "Namaste! Main AgriMitra AI hoon. Aapki kheti mein aaj main kaise madad kar sakta hoon?");
    }, 1500);
  };

  const endCall = () => {
    setIsCalling(false);
    setIsListening(false);
    setTranscript([]);
    setCurrentStatus("Call Ended");
  };

  const addMessage = (sender: string, text: string) => {
    setTranscript(prev => [...prev, `${sender}: ${text}`]);
  };

  const simulateSpeech = () => {
    if (!isCalling) return;
    setIsListening(true);
    setCurrentStatus("Listening...");
    
    // Simulate speech-to-text result
    setTimeout(() => {
      setIsListening(false);
      const userQuery = "Mera gehun ka fasal peedha pad raha hai, kya karun?";
      addMessage("Farmer", userQuery);
      setCurrentStatus("Processing with AI...");
      
      // Simulate AI response
      setTimeout(() => {
        const aiResponse = "Gehun ka peedha padna Nitrogen ki kami ya 'Yellow Rust' disease ho sakta hai. Kya aap fasal ki photo dikha sakte hain ya mitti ki nami check ki hai?";
        addMessage("AgriMitra", aiResponse);
        setCurrentStatus("Connected");
      }, 1500);
    }, 2000);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-600 to-teal-600 p-8 text-white text-center">
          <div className="inline-flex p-4 rounded-full bg-white/20 mb-4 animate-pulse">
            <PhoneCall size={40} />
          </div>
          <h1 className="text-2xl font-bold">AgriMitra Voice Assistant</h1>
          <p className="text-emerald-50 text-sm mt-2">{currentStatus}</p>
        </div>

        {/* Language Selector */}
        <div className="px-6 py-4 flex items-center justify-between border-b border-slate-100 bg-slate-50">
          <div className="flex items-center space-x-2 text-slate-600">
            <Languages size={18} />
            <span className="text-sm font-medium">Prefered Language:</span>
          </div>
          <select 
            value={selectedLang} 
            onChange={(e) => setSelectedLang(e.target.value)}
            className="bg-white border border-slate-200 rounded-lg px-3 py-1 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <option>Hindi</option>
            <option>Tamil</option>
            <option>Marathi</option>
            <option>English</option>
            <option>Telugu</option>
          </select>
        </div>

        {/* Conversation Area */}
        <div 
          ref={scrollRef}
          className="h-80 overflow-y-auto p-6 space-y-4 bg-slate-50/50"
        >
          {transcript.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
              <MessageCircle className="text-slate-300" size={48} />
              <p className="text-slate-400 max-w-xs">
                Call the AI to start a voice conversation about your crops, soil, or schemes.
              </p>
            </div>
          ) : (
            transcript.map((msg, i) => {
              const [sender, text] = msg.split(': ');
              const isAI = sender === 'AgriMitra';
              return (
                <div key={i} className={`flex ${isAI ? 'justify-start' : 'justify-end'}`}>
                  <div className={`max-w-[80%] p-4 rounded-2xl ${
                    isAI 
                      ? 'bg-white border border-slate-200 text-slate-800 rounded-tl-none' 
                      : 'bg-emerald-600 text-white rounded-tr-none'
                  }`}>
                    <p className="text-[10px] font-bold uppercase opacity-60 mb-1">{sender}</p>
                    <p className="text-sm font-medium">{text}</p>
                  </div>
                </div>
              );
            })
          )}
          {currentStatus === "Processing with AI..." && (
            <div className="flex justify-start">
               <div className="bg-white border border-slate-200 p-4 rounded-2xl flex space-x-1">
                 <div className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce"></div>
                 <div className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                 <div className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce [animation-delay:0.4s]"></div>
               </div>
            </div>
          )}
        </div>

        {/* Controls */}
        <div className="p-8 border-t border-slate-100 bg-white">
          <div className="flex items-center justify-center space-x-8">
            {!isCalling ? (
              <button 
                onClick={startCall}
                className="group flex flex-col items-center space-y-2"
              >
                <div className="w-16 h-16 bg-emerald-600 rounded-full flex items-center justify-center text-white shadow-lg group-hover:bg-emerald-700 transition-all scale-100 group-active:scale-95">
                  <PhoneCall size={32} />
                </div>
                <span className="text-sm font-bold text-slate-600">Start Call</span>
              </button>
            ) : (
              <>
                <button 
                  onClick={simulateSpeech}
                  disabled={isListening}
                  className={`group flex flex-col items-center space-y-2 ${isListening ? 'opacity-50' : ''}`}
                >
                  <div className={`w-16 h-16 rounded-full flex items-center justify-center text-white shadow-lg transition-all ${
                    isListening ? 'bg-amber-500 animate-pulse' : 'bg-blue-600 hover:bg-blue-700'
                  }`}>
                    {isListening ? <Mic size={32} /> : <MicOff size={32} />}
                  </div>
                  <span className="text-sm font-bold text-slate-600">Speak</span>
                </button>

                <button 
                  onClick={endCall}
                  className="group flex flex-col items-center space-y-2"
                >
                  <div className="w-16 h-16 bg-rose-500 rounded-full flex items-center justify-center text-white shadow-lg hover:bg-rose-600 transition-all">
                    <PhoneOff size={32} />
                  </div>
                  <span className="text-sm font-bold text-slate-600">End</span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Info Card */}
      <div className="bg-emerald-50 border border-emerald-100 p-6 rounded-3xl flex items-start space-x-4">
        <div className="bg-emerald-600 p-2 rounded-xl text-white">
          <Sparkles size={20} />
        </div>
        <div>
          <h4 className="font-bold text-emerald-900">Multilingual Gemini-Powered Engine</h4>
          <p className="text-emerald-700 text-sm mt-1">
            Our backend uses Gemini 3 Flash to understand regional dialects and provide expert agricultural advice in real-time, even over standard IVR voice calls.
          </p>
        </div>
      </div>
    </div>
  );
};

export default VoiceAssistant;
