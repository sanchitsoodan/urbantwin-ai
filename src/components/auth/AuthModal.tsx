import React, { useState, useEffect } from 'react';
import { 
  X, 
  UserPlus, 
  LogIn, 
  Database, 
  User, 
  Mail, 
  Lock, 
  Briefcase, 
  MapPin, 
  ShieldCheck, 
  Download, 
  Trash2, 
  Search, 
  CheckCircle2, 
  AlertCircle,
  Crown,
  ShieldAlert
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { UserRole, SignUpFormData, LoginFormData } from '../../types/auth';

const AVAILABLE_ROLES: UserRole[] = [
  'City Operations Director',
  'Traffic Systems Engineer',
  'Emergency Dispatch Chief',
  'Smart City Urban Planner',
  'Civic Data Analyst'
];

const AVAILABLE_CITIES = [
  'Chandigarh',
  'New Delhi',
  'Mumbai',
  'Bengaluru',
  'London',
  'New York City'
];

export const AuthModal: React.FC = () => {
  const { 
    isAuthModalOpen, 
    closeAuthModal, 
    authModalMode, 
    signUp, 
    login, 
    currentUser, 
    isAdmin,
    allUsers, 
    toggleUserAdmin,
    removeUser, 
    exportDatabase 
  } = useAuth();

  const [activeTab, setActiveTab] = useState<'login' | 'signup' | 'database'>('signup');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Sign Up Form State
  const [signUpForm, setSignUpForm] = useState<SignUpFormData>({
    fullName: '',
    email: '',
    password: '',
    role: 'City Operations Director',
    cityAffiliation: 'Chandigarh'
  });

  // Login Form State
  const [loginForm, setLoginForm] = useState<LoginFormData>({
    email: '',
    password: ''
  });

  useEffect(() => {
    if (isAuthModalOpen) {
      setActiveTab(authModalMode);
      setErrorMsg('');
      setSuccessMsg('');
    }
  }, [isAuthModalOpen, authModalMode]);

  if (!isAuthModalOpen) return null;

  const handleSignUpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!signUpForm.fullName.trim()) {
      setErrorMsg('Please enter your full name.');
      return;
    }
    if (!signUpForm.email.trim() || !signUpForm.email.includes('@')) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }
    if (!signUpForm.password || signUpForm.password.length < 3) {
      setErrorMsg('Please enter a password with at least 3 characters.');
      return;
    }

    setIsSubmitting(true);
    try {
      const newUser = await signUp(signUpForm);
      setSuccessMsg(`Account created successfully for ${newUser.fullName}! Information saved in database.`);
      setTimeout(() => {
        closeAuthModal();
      }, 1400);
    } catch (err: any) {
      setErrorMsg(err?.message || 'Failed to create account.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!loginForm.email.trim()) {
      setErrorMsg('Please enter your registered email.');
      return;
    }
    if (!loginForm.password) {
      setErrorMsg('Please enter your password.');
      return;
    }

    setIsSubmitting(true);
    try {
      const user = await login(loginForm);
      setSuccessMsg(`Welcome back, ${user.fullName}${user.isAdmin ? ' (Admin)' : ''}!`);
      setTimeout(() => {
        closeAuthModal();
      }, 1000);
    } catch (err: any) {
      setErrorMsg(err?.message || 'Login failed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredUsers = allUsers.filter(u => 
    u.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.cityAffiliation.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center p-3 sm:p-4 bg-slate-900/70 backdrop-blur-md animate-in fade-in duration-150">
      
      <div className="relative w-full max-w-2xl max-h-[92vh] overflow-y-auto card-clean p-6 sm:p-7 rounded-3xl bg-white border-2 border-slate-200 shadow-2xl text-slate-900 z-[10001] flex flex-col">
        
        {/* Close Button */}
        <button
          onClick={closeAuthModal}
          className="absolute top-5 right-5 p-2 rounded-xl bg-slate-100 text-slate-500 hover:text-slate-900 hover:bg-slate-200 transition cursor-pointer"
          title="Close Auth Window"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3">
          <div className={`p-2.5 rounded-2xl border ${
            isAdmin ? 'bg-amber-50 text-amber-700 border-amber-300' : 'bg-blue-50 text-blue-700 border-blue-200'
          }`}>
            {activeTab === 'database' ? (
              <Crown className="w-6 h-6 text-amber-600" />
            ) : (
              <ShieldCheck className="w-6 h-6 text-blue-600" />
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-700">
                UrbanTwin Security & Identity
              </span>
              {isAdmin && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300 flex items-center gap-1">
                  <Crown className="w-3 h-3 text-amber-600" />
                  Admin Authorized
                </span>
              )}
            </div>
            <h2 className="text-lg font-extrabold text-slate-900 mt-0.5">
              {activeTab === 'signup' && 'Create Operations Account'}
              {activeTab === 'login' && 'Sign In to Command Center'}
              {activeTab === 'database' && '👑 Admin User Database Manager'}
            </h2>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="mt-5 flex items-center gap-1.5 p-1 rounded-2xl bg-slate-100 border border-slate-200">
          <button
            onClick={() => { setActiveTab('signup'); setErrorMsg(''); setSuccessMsg(''); }}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
              activeTab === 'signup'
                ? 'bg-white text-blue-700 shadow-sm border border-slate-200/80'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Sign Up</span>
          </button>

          <button
            onClick={() => { setActiveTab('login'); setErrorMsg(''); setSuccessMsg(''); }}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
              activeTab === 'login'
                ? 'bg-white text-blue-700 shadow-sm border border-slate-200/80'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <LogIn className="w-3.5 h-3.5" />
            <span>Log In</span>
          </button>

          {/* Database Tab ONLY visible to logged-in Admins */}
          {isAdmin && (
            <button
              onClick={() => { setActiveTab('database'); setErrorMsg(''); setSuccessMsg(''); }}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                activeTab === 'database'
                  ? 'bg-white text-amber-900 shadow-sm border border-amber-300'
                  : 'text-amber-800 hover:text-amber-950 font-extrabold'
              }`}
            >
              <Crown className="w-3.5 h-3.5 text-amber-600" />
              <span>Admin Database ({allUsers.length})</span>
            </button>
          )}
        </div>

        {/* Alert Feedback */}
        {errorMsg && (
          <div className="mt-4 p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2 animate-in fade-in-50">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div className="mt-4 p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2 animate-in fade-in-50">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* TAB 1: SIGN UP FORM */}
        {activeTab === 'signup' && (
          <form onSubmit={handleSignUpSubmit} className="mt-4 space-y-3.5">
            <div className="p-3 rounded-2xl bg-blue-50/70 border border-blue-200 text-xs text-blue-900">
              💡 <b>Account Registration:</b> Register your municipal operations profile. Your account will be securely saved into the city database.
            </div>

            {/* Full Name */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-blue-600" />
                Full Name
              </label>
              <input
                type="text"
                required
                placeholder="e.g. John Doe"
                value={signUpForm.fullName}
                onChange={(e) => setSignUpForm(prev => ({ ...prev, fullName: e.target.value }))}
                className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 outline-none focus:border-blue-600 focus:bg-white transition"
              />
            </div>

            {/* Email Address */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-blue-600" />
                Email Address
              </label>
              <input
                type="email"
                required
                placeholder="e.g. user@smartcity.gov"
                value={signUpForm.email}
                onChange={(e) => setSignUpForm(prev => ({ ...prev, email: e.target.value }))}
                className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 outline-none focus:border-blue-600 focus:bg-white transition"
              />
            </div>

            {/* Password */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-blue-600" />
                Password
              </label>
              <input
                type="password"
                required
                placeholder="Enter password"
                value={signUpForm.password}
                onChange={(e) => setSignUpForm(prev => ({ ...prev, password: e.target.value }))}
                className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 outline-none focus:border-blue-600 focus:bg-white transition"
              />
            </div>

            {/* Role & City Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              
              {/* Department Role */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <Briefcase className="w-3.5 h-3.5 text-blue-600" />
                  Department Role
                </label>
                <select
                  value={signUpForm.role}
                  onChange={(e) => setSignUpForm(prev => ({ ...prev, role: e.target.value as UserRole }))}
                  className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 outline-none focus:border-blue-600 focus:bg-white transition"
                >
                  {AVAILABLE_ROLES.map(role => (
                    <option key={role} value={role}>{role}</option>
                  ))}
                </select>
              </div>

              {/* City Affiliation */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-blue-600" />
                  City Headquarters
                </label>
                <select
                  value={signUpForm.cityAffiliation}
                  onChange={(e) => setSignUpForm(prev => ({ ...prev, cityAffiliation: e.target.value }))}
                  className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 outline-none focus:border-blue-600 focus:bg-white transition"
                >
                  {AVAILABLE_CITIES.map(city => (
                    <option key={city} value={city}>{city}</option>
                  ))}
                </select>
              </div>

            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs shadow-md transition transform hover:scale-[1.01] cursor-pointer mt-2"
            >
              {isSubmitting ? 'Registering Account...' : '✨ Create Account'}
            </button>
          </form>
        )}

        {/* TAB 2: LOG IN FORM */}
        {activeTab === 'login' && (
          <form onSubmit={handleLoginSubmit} className="mt-4 space-y-3.5">
            {/* Email */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-blue-600" />
                Registered Email Address
              </label>
              <input
                type="email"
                required
                placeholder="e.g. sanchitsoodan2405@gmail.com"
                value={loginForm.email}
                onChange={(e) => setLoginForm(prev => ({ ...prev, email: e.target.value }))}
                className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 outline-none focus:border-blue-600 focus:bg-white transition"
              />
            </div>

            {/* Password */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-blue-600" />
                Password
              </label>
              <input
                type="password"
                required
                placeholder="••••••••••••"
                value={loginForm.password}
                onChange={(e) => setLoginForm(prev => ({ ...prev, password: e.target.value }))}
                className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 outline-none focus:border-blue-600 focus:bg-white transition"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs shadow-md transition transform hover:scale-[1.01] cursor-pointer"
            >
              {isSubmitting ? 'Authenticating...' : '🔑 Sign In'}
            </button>
          </form>
        )}

        {/* TAB 3: ADMIN USER DATABASE INSPECTOR (ONLY FOR ADMINS) */}
        {activeTab === 'database' && (
          <div className="mt-4 space-y-3.5 flex-1 flex flex-col">
            
            {!isAdmin ? (
              <div className="p-6 rounded-3xl bg-rose-50 border border-rose-200 text-center space-y-2 text-rose-800">
                <ShieldAlert className="w-8 h-8 text-rose-600 mx-auto" />
                <h3 className="text-sm font-bold">Access Denied: Admin Authorization Required</h3>
                <p className="text-xs text-rose-700 max-w-sm mx-auto">
                  Only designated System Administrators can inspect registered user database records.
                </p>
              </div>
            ) : (
              <>
                {/* Admin Header Stats */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 p-3 rounded-2xl bg-amber-50 border border-amber-300 text-xs">
                  <div className="flex items-center gap-2">
                    <Crown className="w-4 h-4 text-amber-700" />
                    <span className="font-bold text-amber-950">
                      Total Registered Users: <b>{allUsers.length} Records</b> (Admins: {allUsers.filter(u => u.isAdmin).length})
                    </span>
                  </div>
                  <button
                    onClick={exportDatabase}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-xs transition cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Export Database (.JSON)</span>
                  </button>
                </div>

                {/* Search Filter */}
                <div className="relative">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search registered accounts by name, email, city, or role..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 outline-none focus:border-amber-600 focus:bg-white"
                  />
                </div>

                {/* Database Table Records */}
                <div className="max-h-64 overflow-y-auto rounded-2xl border border-slate-200 divide-y divide-slate-100 bg-white">
                  {filteredUsers.map((user) => (
                    <div key={user.id} className="p-3 flex items-center justify-between gap-3 hover:bg-slate-50 transition">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className={`w-8 h-8 rounded-full ${user.avatarColor || 'bg-blue-600'} text-white font-bold text-xs flex items-center justify-center shrink-0`}>
                          {user.fullName.charAt(0)}
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs font-bold text-slate-900 truncate">
                              {user.fullName}
                            </span>
                            {user.isAdmin && (
                              <span className="text-[9px] font-bold px-1.5 py-0.2 rounded-full bg-amber-100 text-amber-900 border border-amber-300 flex items-center gap-0.5">
                                <Crown className="w-2.5 h-2.5 text-amber-600" />
                                Admin
                              </span>
                            )}
                            <span className="text-[9px] font-bold px-1.5 py-0.2 rounded-full bg-slate-100 text-slate-700">
                              {user.cityAffiliation}
                            </span>
                          </div>
                          <div className="text-[11px] text-slate-500 truncate flex items-center gap-1.5">
                            <span>{user.email}</span>
                            <span>•</span>
                            <span className="text-slate-700 font-medium">{user.role}</span>
                          </div>
                        </div>
                      </div>

                      {/* Admin Actions for this user */}
                      <div className="flex items-center gap-1.5 shrink-0">
                        {/* Toggle Admin Privilege Button */}
                        {!user.isSuperAdmin && user.email !== 'sanchitsoodan2405@gmail.com' && (
                          <button
                            onClick={() => toggleUserAdmin(user.id)}
                            className={`px-2 py-1 rounded-xl text-[10px] font-bold transition border cursor-pointer ${
                              user.isAdmin 
                                ? 'bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100'
                                : 'bg-amber-50 text-amber-800 border-amber-300 hover:bg-amber-100'
                            }`}
                            title={user.isAdmin ? 'Revoke Admin Privileges' : 'Promote this user to Admin'}
                          >
                            {user.isAdmin ? 'Revoke Admin' : '👑 Make Admin'}
                          </button>
                        )}

                        {/* Delete User */}
                        {!user.isSuperAdmin && user.email !== 'sanchitsoodan2405@gmail.com' && (
                          <button
                            onClick={() => removeUser(user.id)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition cursor-pointer"
                            title="Delete user from database"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}

          </div>
        )}

      </div>
    </div>
  );
};
