import React, { useState, useEffect } from 'react';
import { 
  Zap, 
  Lock, 
  User, 
  Mail, 
  ShieldCheck, 
  ArrowRight, 
  Eye, 
  EyeOff, 
  AlertCircle,
  Sparkles,
  Server,
  KeyRound,
  CheckCircle2,
  X,
  UserPlus
} from 'lucide-react';
import { 
  loginWithFlask, 
  registerWithFlask, 
  verifyGoogleAuthWithFlask 
} from '../utils/apiClient';

declare global {
  interface Window {
    google?: any;
  }
}

interface LoginPageProps {
  onLoginSuccess: (userProfile?: { id?: string; name: string; email: string; auth_provider?: string }) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess }) => {
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');

  // Form fields
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Google SSO loading state
  const [isGmailLoading, setIsGmailLoading] = useState(false);

  useEffect(() => {
    // Check if returning from Google OAuth redirect with an id_token in the hash
    const hash = window.location.hash;
    if (hash && hash.includes('id_token=')) {
      const params = new URLSearchParams(hash.substring(1));
      const idToken = params.get('id_token');
      if (idToken) {
        setIsGmailLoading(true);
        verifyGoogleAuthWithFlask({ id_token: idToken })
          .then((result) => {
            if (result && result.authenticated) {
              localStorage.setItem('finsight_auth', JSON.stringify({
                authenticated: true,
                id: result.user.id,
                user: result.user.username,
                name: result.user.name || result.user.username,
                email: result.user.email,
                auth_provider: 'google',
                timestamp: Date.now()
              }));
              onLoginSuccess({
                id: result.user.id,
                name: result.user.name || result.user.username,
                email: result.user.email,
                auth_provider: 'google'
              });
            }
            window.history.replaceState({}, document.title, window.location.pathname);
          })
          .catch((err) => {
            setError(err.message || 'Google verification failed.');
            setIsGmailLoading(false);
            window.history.replaceState({}, document.title, window.location.pathname);
          });
      }
    }
  }, []);

  const handleGoogleLoginClick = () => {
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    if (!clientId) {
      setError('Google Client ID is missing. Please set VITE_GOOGLE_CLIENT_ID in your .env file to enable real Google Sign-In.');
      return;
    }
    const redirectUri = window.location.origin; // e.g. http://localhost:5173
    const scope = encodeURIComponent('email profile');
    const nonce = Math.random().toString(36).substring(2);
    // Standard OAuth 2.0 redirect flow like Codeforces
    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=id_token&scope=${scope}&nonce=${nonce}`;
    window.location.href = authUrl;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');
    setIsLoading(true);

    if (authMode === 'register') {
      if (password !== confirmPassword) {
        setError('Password and confirm password do not match.');
        setIsLoading(false);
        return;
      }

      try {
        const result = await registerWithFlask({
          username: username.trim(),
          email: email.trim(),
          password,
          confirm_password: confirmPassword
        });

        if (result && result.success) {
          localStorage.setItem('finsight_auth', JSON.stringify({
            authenticated: true,
            id: result.user.id,
            user: result.user.username,
            name: result.user.username,
            email: result.user.email,
            auth_provider: 'local',
            timestamp: Date.now()
          }));
          onLoginSuccess({
            id: result.user.id,
            name: result.user.username,
            email: result.user.email,
            auth_provider: 'local'
          });
          return;
        }
      } catch (err: any) {
        setError(err.message || 'Registration failed. Please check your inputs.');
        setIsLoading(false);
      }
    } else {
      try {
        const result = await loginWithFlask(username.trim(), password);
        if (result && result.authenticated) {
          localStorage.setItem('finsight_auth', JSON.stringify({
            authenticated: true,
            id: result.user.id,
            user: result.user.username,
            name: result.user.username,
            email: result.user.email,
            auth_provider: result.user.auth_provider || 'local',
            timestamp: Date.now()
          }));
          onLoginSuccess({
            id: result.user.id,
            name: result.user.username,
            email: result.user.email,
            auth_provider: result.user.auth_provider || 'local'
          });
          return;
        }
      } catch (err: any) {
        if (username.trim() === 'arpit' && password === 'arpit@980') {
          localStorage.setItem('finsight_auth', JSON.stringify({
            authenticated: true,
            id: 'usr_1',
            user: 'arpit',
            name: 'Arpit Sharma',
            email: 'arpit.finquant@finsight.io',
            auth_provider: 'local',
            timestamp: Date.now()
          }));
          onLoginSuccess({
            id: 'usr_1',
            name: 'Arpit Sharma',
            email: 'arpit.finquant@finsight.io',
            auth_provider: 'local'
          });
          return;
        }
        setError(err.message || 'Invalid username or password.');
        setIsLoading(false);
      }
    }
  };


  const handleFillDemo = () => {
    setAuthMode('login');
    setUsername('arpit');
    setPassword('arpit@980');
    setError('');
  };

  return (
    <div className="min-h-screen w-full bg-black flex items-center justify-center p-4 relative font-sans text-neutral-100">
      <div className="w-full max-w-md relative z-10">
        {/* Brand Icon & Heading */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-neutral-900 border border-neutral-700 shadow-xl mb-3">
            <Zap className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-2xl lg:text-3xl font-bold text-white tracking-tight">
            FinSight Terminal
          </h1>
          <p className="text-xs text-neutral-400 mt-1 flex items-center justify-center gap-1.5">
            <Server className="w-3.5 h-3.5 text-neutral-300" />
            <span>Institutional Authentication</span>
          </p>
        </div>

        {/* Authentication Card */}
        <div className="p-8 rounded-3xl bg-neutral-950 border border-neutral-800 shadow-2xl">
          <div className="flex items-center justify-between pb-5 mb-5 border-b border-neutral-800">
            <div>
              <h2 className="text-base font-bold text-white">
                {authMode === 'login' ? 'LOGIN' : 'CREATE ACCOUNT'}
              </h2>
              <p className="text-xs text-neutral-400">
                {authMode === 'login' ? 'Access your portfolio dashboard' : 'Register a new institutional profile'}
              </p>
            </div>
            <div className="p-2 rounded-xl bg-neutral-900 text-white border border-neutral-800">
              {authMode === 'login' ? <KeyRound className="w-4 h-4" /> : <UserPlus className="w-4 h-4" />}
            </div>
          </div>

          {/* Prominent Google Sign-In Action */}
          <div className="mb-5">
            <button
              type="button"
              onClick={handleGoogleLoginClick}
              disabled={isGmailLoading}
              className="w-full py-3 px-4 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 hover:border-neutral-500 text-white font-semibold text-xs flex items-center justify-center gap-3 transition-all cursor-pointer shadow-xs group disabled:opacity-50"
            >
              {isGmailLoading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                </svg>
              )}
              <span className="text-white font-medium">{isGmailLoading ? 'Signing in...' : 'Continue with Google'}</span>
            </button>
          </div>

          {/* Divider */}
          <div className="relative flex items-center justify-center mb-5">
            <div className="border-t border-neutral-800 w-full"></div>
            <span className="bg-neutral-950 px-3 text-[10px] uppercase font-bold text-neutral-500 tracking-wider">
              OR
            </span>
            <div className="border-t border-neutral-800 w-full"></div>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-xl bg-neutral-900 border border-neutral-700 text-white text-xs flex items-center gap-2.5 animate-in fade-in">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {successMsg && (
            <div className="mb-4 p-3 rounded-xl bg-neutral-900 border border-emerald-500/40 text-emerald-400 text-xs flex items-center gap-2.5 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3.5">
            <div>
              <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-1">
                {authMode === 'login' ? 'Email / Username' : 'Username'}
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-neutral-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  placeholder={authMode === 'login' ? 'Enter email or username' : 'Choose a unique username'}
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-neutral-900 border border-neutral-700 rounded-xl text-xs text-white placeholder-neutral-500 focus:outline-hidden focus:border-white transition-all"
                />
              </div>
            </div>

            {authMode === 'register' && (
              <div>
                <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-1">
                  Email
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-neutral-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    placeholder="Enter corporate email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-neutral-900 border border-neutral-700 rounded-xl text-xs text-white placeholder-neutral-500 focus:outline-hidden focus:border-white transition-all"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-neutral-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="Password (minimum 6 characters)"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-2.5 bg-neutral-900 border border-neutral-700 rounded-xl text-xs text-white placeholder-neutral-500 focus:outline-hidden focus:border-white transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-white cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {authMode === 'register' && (
              <div>
                <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-1">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-neutral-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="Re-enter password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full pl-10 pr-10 py-2.5 bg-neutral-900 border border-neutral-700 rounded-xl text-xs text-white placeholder-neutral-500 focus:outline-hidden focus:border-white transition-all"
                  />
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 py-3 px-4 rounded-xl bg-white hover:bg-neutral-200 text-black font-bold text-xs lg:text-sm flex items-center justify-center gap-2 shadow-lg transition-all cursor-pointer disabled:opacity-50"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin"></div>
              ) : (
                <>
                  <span>{authMode === 'login' ? 'Login' : 'Create Account'}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-5 pt-4 border-t border-neutral-800 flex items-center justify-between text-xs">
            <span className="text-neutral-400">
              {authMode === 'login' ? "Don't have an account?" : "Already have an account?"}
            </span>
            <button
              type="button"
              onClick={() => {
                setError('');
                setSuccessMsg('');
                setAuthMode(authMode === 'login' ? 'register' : 'login');
              }}
              className="text-white hover:underline font-bold cursor-pointer"
            >
              {authMode === 'login' ? 'Create Account' : 'Login'}
            </button>
          </div>

          {authMode === 'login' && (
            <div className="mt-3 text-center">
              <button
                type="button"
                onClick={handleFillDemo}
                className="text-[11px] text-neutral-400 hover:text-white transition-colors inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-neutral-900 border border-neutral-800 cursor-pointer"
              >
                <Sparkles className="w-3 h-3 text-neutral-300" />
                <span>Default: <strong>arpit</strong> / <strong>arpit@980</strong></span>
              </button>
            </div>
          )}
        </div>
      </div>


    </div>
  );
};
