import React, { useState } from 'react';
import { UserProfile } from '../types';
import { User, Mail, Briefcase, MapPin, Phone, Save, Edit2, Camera } from 'lucide-react';

interface ProfileProps {
  user: UserProfile;
  onUpdateUser: (user: UserProfile) => void;
}

const Profile: React.FC<ProfileProps> = ({ user, onUpdateUser }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<UserProfile>(user);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    onUpdateUser(formData);
    setIsEditing(false);
  };

  return (
    <div className="p-6 md:p-10 animate-fade-in max-w-4xl mx-auto mb-20 md:mb-0">
      <div className="flex justify-between items-center mb-8">
        <div>
            <h2 className="text-3xl font-bold text-white">My Profile</h2>
            <p className="text-slate-400">Manage your personal and business identity.</p>
        </div>
        <button 
            onClick={() => isEditing ? handleSave() : setIsEditing(true)}
            className={`flex items-center gap-2 px-6 py-2 rounded-lg font-medium transition-all ${
                isEditing 
                ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-500/20' 
                : 'bg-slate-800 hover:bg-slate-700 text-white border border-slate-700'
            }`}
        >
            {isEditing ? <Save size={18} /> : <Edit2 size={18} />}
            {isEditing ? 'Save Changes' : 'Edit Profile'}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left Column: Avatar & Quick Info */}
        <div className="md:col-span-1 space-y-6">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col items-center text-center relative overflow-hidden">
                <div className="relative group">
                    <div className="w-32 h-32 rounded-full bg-slate-800 border-4 border-slate-950 flex items-center justify-center overflow-hidden mb-4 shadow-xl">
                        {formData.avatarUrl ? (
                            <img src={formData.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                        ) : (
                            <User size={64} className="text-slate-500" />
                        )}
                    </div>
                    {isEditing && (
                        <button className="absolute bottom-4 right-0 p-2 bg-indigo-600 rounded-full text-white shadow-lg hover:bg-indigo-500 transition-colors">
                            <Camera size={16} />
                        </button>
                    )}
                </div>
                
                <h3 className="text-xl font-bold text-white">{formData.name}</h3>
                <p className="text-indigo-400 text-sm font-medium">{formData.role}</p>
                <div className="mt-4 flex flex-wrap justify-center gap-2">
                    <span className="px-3 py-1 bg-slate-950 rounded-full text-xs text-slate-400 border border-slate-800">
                        Pro Member
                    </span>
                    <span className="px-3 py-1 bg-slate-950 rounded-full text-xs text-slate-400 border border-slate-800">
                        Verified
                    </span>
                </div>
            </div>
        </div>

        {/* Right Column: Form Fields */}
        <div className="md:col-span-2 space-y-6">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
                <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
                    <User size={20} className="text-indigo-400" />
                    Personal Details
                </h3>
                <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-sm text-slate-400">Full Name</label>
                            <input 
                                type="text" 
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                disabled={!isEditing}
                                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-60 disabled:cursor-not-allowed"
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-sm text-slate-400">Role / Title</label>
                            <input 
                                type="text" 
                                name="role"
                                value={formData.role}
                                onChange={handleChange}
                                disabled={!isEditing}
                                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-60 disabled:cursor-not-allowed"
                            />
                        </div>
                    </div>
                    <div className="space-y-1">
                        <label className="text-sm text-slate-400">Bio</label>
                        <textarea 
                            name="bio"
                            value={formData.bio || ''}
                            onChange={handleChange}
                            disabled={!isEditing}
                            rows={3}
                            className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-60 disabled:cursor-not-allowed resize-none"
                            placeholder="Tell us a bit about yourself..."
                        />
                    </div>
                </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
                <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
                    <Briefcase size={20} className="text-emerald-400" />
                    Business Information
                </h3>
                <div className="space-y-4">
                    <div className="space-y-1">
                        <label className="text-sm text-slate-400">Business Name</label>
                        <input 
                            type="text" 
                            name="businessName"
                            value={formData.businessName}
                            onChange={handleChange}
                            disabled={!isEditing}
                            className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-60 disabled:cursor-not-allowed"
                        />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-sm text-slate-400 flex items-center gap-1"><Mail size={12}/> Email Address</label>
                            <input 
                                type="email" 
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                disabled={!isEditing}
                                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-60 disabled:cursor-not-allowed"
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-sm text-slate-400 flex items-center gap-1"><Phone size={12}/> Phone Number</label>
                            <input 
                                type="tel" 
                                name="phone"
                                value={formData.phone || ''}
                                onChange={handleChange}
                                disabled={!isEditing}
                                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-60 disabled:cursor-not-allowed"
                            />
                        </div>
                    </div>
                    <div className="space-y-1">
                        <label className="text-sm text-slate-400 flex items-center gap-1"><MapPin size={12}/> Location</label>
                         <input 
                            type="text" 
                            name="location"
                            value={formData.location || ''}
                            onChange={handleChange}
                            disabled={!isEditing}
                            className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-60 disabled:cursor-not-allowed"
                        />
                    </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;