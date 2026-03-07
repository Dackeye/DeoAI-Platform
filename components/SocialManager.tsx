import React, { useState } from 'react';
import { optimizeSocialPost } from '../services/geminiService';
import { Instagram, Linkedin, Twitter, Sparkles, Send, Clock, Image as ImageIcon } from 'lucide-react';

const SocialManager: React.FC = () => {
  const [content, setContent] = useState('');
  const [platform, setPlatform] = useState('instagram');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleOptimize = async () => {
    if (!content) return;
    setIsGenerating(true);
    const optimized = await optimizeSocialPost(content, platform);
    setContent(optimized);
    setIsGenerating(false);
  };

  return (
    <div className="p-6 max-w-5xl mx-auto animate-fade-in">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-white">Social Command Center</h2>
        <p className="text-slate-400">Manage all your channels in one place with AI assistance.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Create Post Section */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Create New Post</h3>
            
            {/* Platform Selector */}
            <div className="flex gap-4 mb-6">
              {[
                { id: 'instagram', icon: Instagram, label: 'Instagram', color: 'hover:text-pink-500' },
                { id: 'twitter', icon: Twitter, label: 'Twitter', color: 'hover:text-sky-500' },
                { id: 'linkedin', icon: Linkedin, label: 'LinkedIn', color: 'hover:text-blue-600' }
              ].map((p) => {
                const Icon = p.icon;
                const isSelected = platform === p.id;
                return (
                  <button
                    key={p.id}
                    onClick={() => setPlatform(p.id)}
                    className={`flex flex-col items-center gap-2 p-3 rounded-lg border transition-all w-24
                      ${isSelected 
                        ? 'bg-indigo-600/20 border-indigo-500 text-indigo-400' 
                        : 'bg-slate-800/50 border-slate-700 text-slate-400 hover:bg-slate-800 ' + p.color
                      }`}
                  >
                    <Icon size={24} />
                    <span className="text-xs font-medium">{p.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Input Area */}
            <div className="relative">
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="What's happening in your business today?"
                className="w-full h-40 bg-slate-950 border border-slate-700 rounded-lg p-4 text-slate-200 focus:ring-2 focus:ring-indigo-500 focus:outline-none resize-none"
              />
              <div className="absolute bottom-3 right-3 flex gap-2">
                <button 
                  onClick={handleOptimize}
                  disabled={isGenerating || !content}
                  className="flex items-center gap-2 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-sm rounded-md transition-colors disabled:opacity-50"
                >
                  <Sparkles size={14} className={isGenerating ? "animate-spin" : ""} />
                  {isGenerating ? "Optimizing..." : "AI Enhance"}
                </button>
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-between items-center mt-4">
              <div className="flex gap-2 text-slate-400">
                <button className="p-2 hover:bg-slate-800 rounded-lg transition-colors">
                  <ImageIcon size={20} />
                </button>
                <button className="p-2 hover:bg-slate-800 rounded-lg transition-colors">
                  <Clock size={20} />
                </button>
              </div>
              <div className="flex gap-3">
                 <button className="px-4 py-2 text-slate-300 font-medium hover:text-white transition-colors">
                  Save Draft
                </button>
                <button className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-medium rounded-lg shadow-lg shadow-indigo-500/20 transition-all">
                  <Send size={16} />
                  Post Now
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Upcoming Schedule / Preview */}
        <div className="space-y-6">
           <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Upcoming</h3>
              <div className="space-y-4">
                {[
                  { time: 'Tomorrow, 10:00 AM', text: 'Excited to announce our new summer collection! ☀️ #SummerVibes', platform: 'instagram' },
                  { time: 'Wed, 2:00 PM', text: 'Looking for a UI/UX designer to join our growing team. DM for info.', platform: 'linkedin' }
                ].map((post, i) => (
                  <div key={i} className="p-3 bg-slate-950 border border-slate-800 rounded-lg relative group cursor-pointer hover:border-slate-700">
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-xs font-mono text-indigo-400">{post.time}</span>
                        {post.platform === 'instagram' ? <Instagram size={14} className="text-pink-500"/> : <Linkedin size={14} className="text-blue-500"/>}
                    </div>
                    <p className="text-sm text-slate-300 line-clamp-2">{post.text}</p>
                  </div>
                ))}
              </div>
           </div>

           <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Growth Tips</h3>
              <div className="text-sm text-slate-400 space-y-3">
                <p>💡 <strong className="text-slate-200">Consistency is key.</strong> Try to post at least 3 times a week on Instagram.</p>
                <p>💡 <strong className="text-slate-200">Engage.</strong> Reply to comments within the first hour to boost visibility.</p>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default SocialManager;