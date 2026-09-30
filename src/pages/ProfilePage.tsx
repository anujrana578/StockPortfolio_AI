import React, { useState } from 'react';
import { 
  User, 
  Mail, 
  ShieldCheck, 
  Calendar, 
  Key, 
  Copy, 
  Check, 
  Save,
  Clock,
  Lock
} from 'lucide-react';
import { formatCurrency } from '../utils/formatters';

interface ProfilePageProps {
  totalPortfolioValue: number;
  userProfile?: { name: string; email: string };
  onLogout: () => void;
}

export const ProfilePage: React.FC<ProfilePageProps> = ({
  totalPortfolioValue,
  userProfile,
  onLogout
}) => {
  const [copiedKey, setCopiedKey] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const initialName = userProfile?.name || 'Arpit Sharma';
  const initialEmail = userProfile?.email || 'arpit.finquant@gmail.com';

  const [profileData, setProfileData] = useState({
    fullName: initialName,
    username: initialName.split(' ')[0].toLowerCase(),
    email: initialEmail,
    phone: '+1 (555) 438-9201',
    role: 'Lead Quantitative Portfolio Manager',
    institution: 'FinSight Capital Alpha Fund',
    country: 'United States (EST)',
    tier: 'Tier 1 Enterprise',
    memberSince: 'March 2024',
    riskProfile: 'Aggressive Alpha Growth'
  });

  const [formData, setFormData] = useState({ ...profileData });

  const handleCopyApiKey = () => {
    navigator.clipboard.writeText('fs_live_9942a8b9f1092ce818c3017e');
    setCopiedKey(true);
    setTimeout(() => setCopiedKey(false), 2000);
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setProfileData({ ...formData });
    setIsEditing(false);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const activityLog = [
    { id: 'act-1', event: `Authenticated via Google Single Sign-On (${profileData.email})`, time: 'Just now', type: 'AUTH' },
    { id: 'act-2', event: 'Simulated Monte Carlo forecast on AAPL (30D target $236.50)', time: '10 mins ago', type: 'AI' },
    { id: 'act-3', event: 'Imported 2020-2025 Market Index Dataset into SQL Database', time: 'Today, 02:45 PM', type: 'SQL' },
    { id: 'act-4', event: 'Purchased 1 share of NFLX @ $960.29', time: 'Yesterday, 04:12 PM', type: 'TRADE' }
  ];

  const getInitials = (name: string) => {
    const parts = name.trim().split(' ');
    if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    return name.slice(0, 2).toUpperCase();
  };

  return (
    <div className="space-y-6 pb-12 max-w-5xl text-neutral-100">
      {/* Hero Card */}
      <div className="rounded-3xl bg-neutral-950 border border-neutral-800 p-6 lg:p-8 shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
          <div className="w-20 h-20 rounded-2xl bg-white text-black flex items-center justify-center font-extrabold text-2xl shadow-lg">
            {getInitials(profileData.fullName)}
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-bold text-white tracking-tight">
                {profileData.fullName}
              </h2>
              <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-neutral-800 text-white border border-neutral-700">
                {profileData.tier}
              </span>
              <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30 flex items-center gap-1">
                <Mail className="w-3 h-3" /> Gmail Verified
              </span>
            </div>
            <p className="text-xs text-neutral-400">
              {profileData.role} • <strong className="text-white">{profileData.institution}</strong>
            </p>
            <div className="flex items-center gap-4 text-xs text-neutral-500 pt-1">
              <span className="flex items-center gap-1.5 font-mono">
                <Mail className="w-3.5 h-3.5" />
                {profileData.email}
              </span>
              <span className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" />
                Member since {profileData.memberSince}
              </span>
            </div>
          </div>
        </div>

        <button
          onClick={() => {
            setFormData({ ...profileData });
            setIsEditing(!isEditing);
          }}
          className="px-4 py-2 rounded-xl text-xs font-bold bg-white hover:bg-neutral-200 text-black transition-all cursor-pointer"
        >
          {isEditing ? 'Cancel' : 'Edit Profile'}
        </button>
      </div>

      {savedSuccess && (
        <div className="p-3.5 rounded-xl bg-neutral-900 border border-neutral-700 text-white text-xs font-semibold flex items-center gap-2">
          <Check className="w-4 h-4" />
          <span>Profile saved successfully.</span>
        </div>
      )}

      {/* Mini-Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="p-5 rounded-2xl bg-neutral-950 border border-neutral-800">
          <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">AI Queries</span>
          <div className="text-xl font-bold text-white mt-1">1,482 Queries</div>
        </div>
        <div className="p-5 rounded-2xl bg-neutral-950 border border-neutral-800">
          <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">Strategy</span>
          <div className="text-xl font-bold text-white mt-1">Aggressive Alpha</div>
        </div>
      </div>

      {/* Main Details & Security */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 p-6 rounded-3xl bg-neutral-950 border border-neutral-800">
          <h3 className="text-base font-bold text-white mb-4">Investor Information</h3>

          <form onSubmit={handleSaveProfile} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-neutral-400 uppercase tracking-wider mb-1">
                  Full Legal Name
                </label>
                <input
                  type="text"
                  disabled={!isEditing}
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-neutral-900 border border-neutral-800 rounded-xl text-neutral-200 focus:outline-hidden focus:border-white disabled:opacity-60"
                />
              </div>

              <div>
                <label className="block font-semibold text-neutral-400 uppercase tracking-wider mb-1">
                  Username
                </label>
                <input
                  type="text"
                  disabled
                  value={formData.username}
                  className="w-full px-3.5 py-2.5 bg-neutral-900/40 border border-neutral-800 rounded-xl text-neutral-500 cursor-not-allowed"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-neutral-400 uppercase tracking-wider mb-1">
                  Gmail Address
                </label>
                <input
                  type="email"
                  disabled={!isEditing}
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-neutral-900 border border-neutral-800 rounded-xl text-neutral-200 focus:outline-hidden focus:border-white disabled:opacity-60 font-mono"
                />
              </div>

              <div>
                <label className="block font-semibold text-neutral-400 uppercase tracking-wider mb-1">
                  Phone Number
                </label>
                <input
                  type="text"
                  disabled={!isEditing}
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-neutral-900 border border-neutral-800 rounded-xl text-neutral-200 focus:outline-hidden focus:border-white disabled:opacity-60"
                />
              </div>
            </div>

            {isEditing && (
              <div className="pt-3 flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 rounded-xl text-neutral-400 hover:text-white font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-white hover:bg-neutral-200 text-black font-bold flex items-center gap-1.5 cursor-pointer"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Save</span>
                </button>
              </div>
            )}
          </form>
        </div>

        {/* Security / API Key */}
        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-neutral-950 border border-neutral-800 space-y-4">
            <div className="flex items-center gap-2.5 text-white font-bold text-sm">
              <Key className="w-4 h-4 text-white" />
              <span>Quant API Access</span>
            </div>
            <div className="p-3 rounded-xl bg-neutral-900 border border-neutral-800 flex items-center justify-between">
              <span className="font-mono text-xs text-neutral-300">fs_live_9942a8b9...</span>
              <button
                onClick={handleCopyApiKey}
                className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors cursor-pointer"
              >
                {copiedKey ? <Check className="w-4 h-4 text-white" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-neutral-950 border border-neutral-800">
            <h4 className="text-sm font-bold text-white mb-2 flex items-center gap-2">
              <Lock className="w-4 h-4 text-neutral-400" />
              Session
            </h4>
            <button
              onClick={onLogout}
              className="w-full py-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white border border-neutral-700 text-xs font-semibold cursor-pointer"
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
