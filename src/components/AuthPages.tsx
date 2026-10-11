import React, { useState } from 'react';
import { PageType, UserProfile } from '../types';
import { Eye, EyeOff, Check, ArrowRight, ShieldCheck, Sparkles, ClipboardList, Loader2 } from 'lucide-react';
import { signInWithGoogle } from '../firebase';

interface AuthPagesProps {
  page: 'login' | 'signup' | 'admin-login';
  onNavigate: (page: PageType) => void;
  onUserLogin: (user: UserProfile) => void;
  onAdminLogin: () => void;
  adminEmail: string;
  adminPassword: string;
  onShowToast: (msg: string, type?: 'success' | 'error') => void;
}

export const AuthPages: React.FC<AuthPagesProps> = ({
  page,
  onNavigate,
  onUserLogin,
  onAdminLogin,
  adminEmail,
  adminPassword,
  onShowToast,
}) => {
  // Login states
  const [loginEmail, setLoginEmail] = useState<string>('arjun@example.com');
  const [loginPass, setLoginPass] = useState<string>('password123');
  const [showLoginPass, setShowLoginPass] = useState<boolean>(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState<boolean>(false);

  // Signup states
  const [signupStep, setSignupStep] = useState<number>(0);
  const [regName, setRegName] = useState<string>('');
  const [regEmail, setRegEmail] = useState<string>('');
  const [regPass, setRegPass] = useState<string>('');
  const [regPass2, setRegPass2] = useState<string>('');
  const [regPhone, setRegPhone] = useState<string>('');
  const [showRegPass, setShowRegPass] = useState<boolean>(false);
  const [passStrength, setPassStrength] = useState<number>(0);

  // Admin login states
  const [adEmail, setAdEmail] = useState<string>(adminEmail);
  const [adPass, setAdPass] = useState<string>('');
  const [showAdPass, setShowAdPass] = useState<boolean>(false);

  const calculateStrength = (val: string) => {
    let score = 0;
    if (val.length >= 8) score++;
    if (/[A-Z]/.test(val)) score++;
    if (/[0-9]/.test(val)) score++;
    if (/[^A-Za-z0-9]/.test(val)) score++;
    setPassStrength(score);
  };

  const handleUserLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginEmail) {
      onShowToast('Please enter an email or username', 'error');
      return;
    }
    const derivedName =
      loginEmail.split('@')[0].charAt(0).toUpperCase() + loginEmail.split('@')[0].slice(1);
    onUserLogin({
      name: derivedName,
      email: loginEmail,
      phone: '+91 98765 43210',
    });
    onShowToast(`Welcome back, ${derivedName}!`);
  };

  const handleGoogleAuth = async () => {
    setIsGoogleLoading(true);
    try {
      const result = await signInWithGoogle();
      const fbUser = result.user;
      const userProfile: UserProfile = {
        uid: fbUser.uid,
        name: fbUser.displayName || fbUser.email?.split('@')[0] || 'Community Member',
        email: fbUser.email || 'user@example.com',
        phone: fbUser.phoneNumber || '+91 98765 43210',
      };
      onUserLogin(userProfile);
      onShowToast(`Signed in as ${userProfile.name} with Google!`, 'success');
    } catch (err: any) {
      console.error('Google Sign-in error:', err);
      if (err?.code !== 'auth/popup-closed-by-user') {
        onShowToast(err?.message || 'Google sign in failed. Please try again.', 'error');
      }
    } finally {
      setIsGoogleLoading(false);
    }
  };

  const handleAdminGoogleAuth = async () => {
    setIsGoogleLoading(true);
    try {
      const result = await signInWithGoogle();
      const fbUser = result.user;
      if (
        fbUser.email?.trim().toLowerCase() === adminEmail.trim().toLowerCase() ||
        fbUser.email?.trim().toLowerCase() === 'abhirampendela3@gmail.com'
      ) {
        onAdminLogin();
        onShowToast('Google Admin authentication verified! Welcome.');
      } else {
        onShowToast(`Signed in with ${fbUser.email}, but this account is not registered as an administrator.`, 'error');
      }
    } catch (err: any) {
      console.error('Admin Google Sign-in error:', err);
      if (err?.code !== 'auth/popup-closed-by-user') {
        onShowToast(err?.message || 'Admin Google sign-in failed.', 'error');
      }
    } finally {
      setIsGoogleLoading(false);
    }
  };

  const handleAdminSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (adEmail.trim().toLowerCase() === adminEmail.trim().toLowerCase() && adPass === adminPassword) {
      onAdminLogin();
      onShowToast('Admin access granted. Welcome to Admin Portal!');
    } else {
      onShowToast('Invalid admin credentials. Please verify your password.', 'error');
    }
  };

  const strengthColors = ['', 'bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-emerald-600'];
  const strengthWidths = ['w-0', 'w-1/4', 'w-2/4', 'w-3/4', 'w-full'];

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-12 bg-[#efe9d9]">
      {/* Left Feature Column */}
      <div className="lg:col-span-6 bg-gradient-to-br from-[#1c2b1f] via-[#243527] to-[#1c2b1f] text-[#efe9d9] p-8 lg:p-16 flex flex-col justify-between relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_20%_25%,rgba(200,211,189,0.12),transparent_45%),radial-gradient(ellipse_at_80%_75%,rgba(184,148,90,0.14),transparent_40%)] pointer-events-none" />

        {/* Top Brand */}
        <button
          onClick={() => onNavigate('home')}
          className="flex items-center gap-2.5 font-serif text-2xl font-semibold text-[#efe9d9] relative z-10 w-fit cursor-pointer"
        >
          <div className="w-8 h-8 rounded-lg bg-[#b8945a] flex items-center justify-center text-white">
            <ClipboardList className="w-4 h-4 text-white" />
          </div>
          <span>Relief</span>
        </button>

        {/* Middle Content */}
        <div className="py-12 relative z-10 max-w-lg">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/15 text-xs font-mono uppercase tracking-wider text-[#c8d3bd] mb-6">
            <Sparkles className="w-3.5 h-3.5 text-[#b8945a]" />
            Trusted by 40,000+ members
          </div>

          <h2 className="font-serif text-4xl lg:text-5xl font-medium tracking-tight text-[#efe9d9] leading-tight mb-4">
            Helping lost things find their <em className="italic text-[#b8945a]">way home</em>.
          </h2>

          <p className="text-sm text-[#c4cebd] leading-relaxed mb-8">
            Relief connects people who have lost essential belongings with honest neighbors who found them — verified, secure, and built for real-world reunions.
          </p>

          <ul className="space-y-3 text-sm text-[#d0d8cb] mb-8">
            <li className="flex items-center gap-2.5">
              <Check className="w-4 h-4 text-[#b8945a] flex-shrink-0" />
              Direct reporter feedback & post-resolution verification
            </li>
            <li className="flex items-center gap-2.5">
              <Check className="w-4 h-4 text-[#b8945a] flex-shrink-0" />
              Secure, privacy-first item claims
            </li>
            <li className="flex items-center gap-2.5">
              <Check className="w-4 h-4 text-[#b8945a] flex-shrink-0" />
              Instant matching for student & neighborhood boards
            </li>
          </ul>

          <div className="flex gap-3">
            {['🔑', '🪪', '🎧', '☂️'].map((emoji, idx) => (
              <div
                key={idx}
                className="w-12 h-14 bg-[#f7f0da] text-[#1a1a17] rounded-lg shadow-md flex items-center justify-center text-2xl -rotate-3 hover:rotate-0 transition-transform cursor-default"
              >
                {emoji}
              </div>
            ))}
          </div>
        </div>

        {/* Bottom stats */}
        <div className="grid grid-cols-3 gap-6 pt-6 border-t border-white/10 relative z-10 text-xs font-mono">
          <div>
            <div className="font-serif text-2xl text-[#efe9d9] font-medium">18,402</div>
            <span className="text-[#a9bda0] uppercase">Items posted</span>
          </div>
          <div>
            <div className="font-serif text-2xl text-[#efe9d9] font-medium">11,760</div>
            <span className="text-[#a9bda0] uppercase">Reunited</span>
          </div>
          <div>
            <div className="font-serif text-2xl text-[#efe9d9] font-medium">64%</div>
            <span className="text-[#a9bda0] uppercase">In 48 hours</span>
          </div>
        </div>
      </div>

      {/* Right Form Column */}
      <div className="lg:col-span-6 flex items-center justify-center p-6 md:p-12">
        {/* ================= USER LOGIN ================= */}
        {page === 'login' && (
          <div className="w-full max-w-md bg-white rounded-3xl p-8 md:p-10 shadow-xl border border-black/5">
            <div className="w-12 h-12 rounded-2xl bg-[#1c2b1f] text-white flex items-center justify-center mx-auto mb-4 text-xl">
              📋
            </div>
            <h2 className="font-serif text-3xl font-medium text-center text-[#1c2b1f] mb-1">
              Welcome back
            </h2>
            <p className="text-xs text-center text-[#6b6a5f] mb-6">
              Sign in to manage your lost & found reports.
            </p>

            <form onSubmit={handleUserLoginSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-[#1a1a17] block mb-1">
                  Email or Username
                </label>
                <input
                  id="userLoginEmailInput"
                  type="text"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  placeholder="name@example.com"
                  required
                  className="w-full p-3 border border-[#d9c9a3] rounded-xl text-sm bg-[#efe9d9]/30 focus:bg-white outline-none focus:border-[#1c2b1f] transition-all"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-semibold text-[#1a1a17]">Password</label>
                  <button
                    type="button"
                    onClick={() => onShowToast('For demo: standard demo password works.')}
                    className="text-xs text-[#1c2b1f] hover:underline cursor-pointer"
                  >
                    Forgot?
                  </button>
                </div>
                <div className="relative">
                  <input
                    id="userLoginPasswordInput"
                    type={showLoginPass ? 'text' : 'password'}
                    value={loginPass}
                    onChange={(e) => setLoginPass(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="w-full p-3 pr-10 border border-[#d9c9a3] rounded-xl text-sm bg-[#efe9d9]/30 focus:bg-white outline-none focus:border-[#1c2b1f] transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowLoginPass(!showLoginPass)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-black cursor-pointer"
                  >
                    {showLoginPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-2 text-xs text-[#1a1a17]">
                <input type="checkbox" id="rememberMe" defaultChecked className="rounded accent-[#1c2b1f]" />
                <label htmlFor="rememberMe">Remember me on this device</label>
              </div>

              <button
                type="submit"
                id="userLoginSubmitBtn"
                className="w-full bg-[#1c2b1f] hover:bg-[#243527] text-[#efe9d9] font-medium py-3 rounded-xl text-sm shadow-md hover:-translate-y-0.5 transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <span>Login</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            <div className="flex items-center gap-3 my-5">
              <div className="flex-1 h-px bg-black/10" />
              <span className="text-xs text-[#6b6a5f] font-mono uppercase">or</span>
              <div className="flex-1 h-px bg-black/10" />
            </div>

            <button
              onClick={handleGoogleAuth}
              disabled={isGoogleLoading}
              type="button"
              className="w-full py-2.5 px-4 border border-black/15 hover:bg-black/5 rounded-xl text-sm font-medium flex items-center justify-center gap-2.5 transition-all cursor-pointer disabled:opacity-60"
            >
              {isGoogleLoading ? (
                <Loader2 className="w-4 h-4 animate-spin text-[#1c2b1f]" />
              ) : (
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84C6.71 7.31 9.14 5.38 12 5.38z"
                  />
                </svg>
              )}
              <span>{isGoogleLoading ? 'Connecting to Google...' : 'Continue with Google'}</span>
            </button>

            <div className="text-center text-xs text-[#6b6a5f] mt-6 space-y-2">
              <div>
                Don&apos;t have an account?{' '}
                <button
                  onClick={() => onNavigate('signup')}
                  className="text-[#1c2b1f] font-semibold hover:underline cursor-pointer"
                >
                  Join Relief
                </button>
              </div>
              <div>
                <button
                  id="adminLoginLinkBtn"
                  onClick={() => onNavigate('admin-login')}
                  className="text-xs font-mono text-[#6b6a5f] hover:text-[#1c2b1f] cursor-pointer"
                >
                  Admin sign in portal →
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ================= USER SIGNUP ================= */}
        {page === 'signup' && (
          <div className="w-full max-w-md bg-white rounded-3xl p-8 md:p-10 shadow-xl border border-black/5">
            <div className="w-12 h-12 rounded-2xl bg-[#1c2b1f] text-white flex items-center justify-center mx-auto mb-4 text-xl">
              📋
            </div>
            <h2 className="font-serif text-3xl font-medium text-center text-[#1c2b1f] mb-1">
              Create account
            </h2>
            <p className="text-xs text-center text-[#6b6a5f] mb-6">
              Join the Relief community in seconds.
            </p>

            {/* Step Indicators */}
            <div className="flex gap-2 mb-6">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className={`h-1 flex-1 rounded-full transition-colors ${
                    i <= signupStep ? 'bg-[#1c2b1f]' : 'bg-gray-200'
                  }`}
                />
              ))}
            </div>

            {/* Step 0: Name & Email */}
            {signupStep === 0 && (
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-[#1a1a17] block mb-1">Full Name</label>
                  <input
                    type="text"
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    placeholder="Arjun Kumar"
                    required
                    className="w-full p-3 border border-[#d9c9a3] rounded-xl text-sm bg-[#efe9d9]/30 focus:bg-white outline-none focus:border-[#1c2b1f]"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-[#1a1a17] block mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    placeholder="name@example.com"
                    required
                    className="w-full p-3 border border-[#d9c9a3] rounded-xl text-sm bg-[#efe9d9]/30 focus:bg-white outline-none focus:border-[#1c2b1f]"
                  />
                </div>

                <button
                  type="button"
                  onClick={() => {
                    if (!regName || !regEmail) {
                      onShowToast('Please provide your name and email', 'error');
                      return;
                    }
                    setSignupStep(1);
                  }}
                  className="w-full bg-[#1c2b1f] hover:bg-[#243527] text-[#efe9d9] font-medium py-3 rounded-xl text-sm shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <span>Continue</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <div className="flex items-center gap-3 my-2">
                  <div className="flex-1 h-px bg-black/10" />
                  <span className="text-xs text-[#6b6a5f] font-mono uppercase">or instant sign up</span>
                  <div className="flex-1 h-px bg-black/10" />
                </div>

                <button
                  onClick={handleGoogleAuth}
                  disabled={isGoogleLoading}
                  type="button"
                  className="w-full py-2.5 px-4 border border-black/15 hover:bg-black/5 rounded-xl text-sm font-medium flex items-center justify-center gap-2.5 transition-all cursor-pointer disabled:opacity-60"
                >
                  {isGoogleLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin text-[#1c2b1f]" />
                  ) : (
                    <svg className="w-4 h-4" viewBox="0 0 24 24">
                      <path
                        fill="#4285F4"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84C6.71 7.31 9.14 5.38 12 5.38z"
                      />
                    </svg>
                  )}
                  <span>Sign up with Google</span>
                </button>
              </div>
            )}

            {/* Step 1: Password & Phone */}
            {signupStep === 1 && (
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-[#1a1a17] block mb-1">Password</label>
                  <div className="relative">
                    <input
                      type={showRegPass ? 'text' : 'password'}
                      value={regPass}
                      onChange={(e) => {
                        setRegPass(e.target.value);
                        calculateStrength(e.target.value);
                      }}
                      placeholder="Create password"
                      required
                      className="w-full p-3 pr-10 border border-[#d9c9a3] rounded-xl text-sm bg-[#efe9d9]/30 focus:bg-white outline-none focus:border-[#1c2b1f]"
                    />
                    <button
                      type="button"
                      onClick={() => setShowRegPass(!showRegPass)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-black cursor-pointer"
                    >
                      {showRegPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {/* Password Strength bar */}
                  <div className="h-1 bg-gray-200 rounded-full mt-2 overflow-hidden">
                    <div
                      className={`h-full transition-all duration-300 ${strengthWidths[passStrength]} ${strengthColors[passStrength]}`}
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-[#1a1a17] block mb-1">
                    Confirm Password
                  </label>
                  <input
                    type={showRegPass ? 'text' : 'password'}
                    value={regPass2}
                    onChange={(e) => setRegPass2(e.target.value)}
                    placeholder="Repeat password"
                    required
                    className="w-full p-3 border border-[#d9c9a3] rounded-xl text-sm bg-[#efe9d9]/30 focus:bg-white outline-none focus:border-[#1c2b1f]"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-[#1a1a17] block mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={regPhone}
                    onChange={(e) => setRegPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full p-3 border border-[#d9c9a3] rounded-xl text-sm bg-[#efe9d9]/30 focus:bg-white outline-none focus:border-[#1c2b1f]"
                  />
                </div>

                <button
                  type="button"
                  onClick={() => {
                    if (!regPass) {
                      onShowToast('Please create a password', 'error');
                      return;
                    }
                    if (regPass !== regPass2) {
                      onShowToast('Passwords do not match', 'error');
                      return;
                    }
                    setSignupStep(2);
                  }}
                  className="w-full bg-[#1c2b1f] hover:bg-[#243527] text-[#efe9d9] font-medium py-3 rounded-xl text-sm shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <span>Complete Registration</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={() => setSignupStep(0)}
                  className="w-full py-2 text-xs text-[#6b6a5f] hover:underline cursor-pointer"
                >
                  ← Back to details
                </button>
              </div>
            )}

            {/* Step 2: Celebration */}
            {signupStep === 2 && (
              <div className="text-center py-4">
                <div className="text-6xl mb-3">🎉</div>
                <h3 className="font-serif text-2xl font-medium text-[#1c2b1f] mb-2">
                  Account created!
                </h3>
                <p className="text-sm text-[#6b6a5f] mb-6 leading-relaxed">
                  Welcome to Relief. Your community account is ready for reporting and returning items.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    onUserLogin({
                      name: regName || 'Community Member',
                      email: regEmail || 'member@example.com',
                      phone: regPhone || '+91 98765 43210',
                    });
                    onShowToast('Account setup complete!');
                  }}
                  className="w-full bg-[#1c2b1f] hover:bg-[#243527] text-[#efe9d9] font-medium py-3 rounded-xl text-sm shadow-md cursor-pointer"
                >
                  Go to Dashboard →
                </button>
              </div>
            )}

            <div className="text-center text-xs text-[#6b6a5f] mt-6">
              Already have an account?{' '}
              <button
                onClick={() => onNavigate('login')}
                className="text-[#1c2b1f] font-semibold hover:underline cursor-pointer"
              >
                Sign in
              </button>
            </div>
          </div>
        )}

        {/* ================= ADMIN LOGIN ================= */}
        {page === 'admin-login' && (
          <div className="w-full max-w-md bg-white rounded-3xl p-8 md:p-10 shadow-xl border border-black/5">
            <div className="w-12 h-12 rounded-2xl bg-[#0f1a12] text-[#b8945a] flex items-center justify-center mx-auto mb-4 text-xl">
              ⚙️
            </div>
            <h2 className="font-serif text-3xl font-medium text-center text-[#0f1a12] mb-1">
              Admin Portal
            </h2>
            <p className="text-xs text-center text-[#6b6a5f] mb-6">
              Authorized lost & found administration only.
            </p>

            <form onSubmit={handleAdminSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-[#1a1a17] block mb-1">Admin Email</label>
                <input
                  id="adminLoginEmailInput"
                  type="email"
                  value={adEmail}
                  onChange={(e) => setAdEmail(e.target.value)}
                  placeholder="admin@example.com"
                  required
                  className="w-full p-3 border border-[#d9c9a3] rounded-xl text-sm bg-[#efe9d9]/30 focus:bg-white outline-none focus:border-[#0f1a12] transition-all"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-[#1a1a17] block mb-1">Password</label>
                <div className="relative">
                  <input
                    id="adminLoginPasswordInput"
                    type={showAdPass ? 'text' : 'password'}
                    value={adPass}
                    onChange={(e) => setAdPass(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="w-full p-3 pr-10 border border-[#d9c9a3] rounded-xl text-sm bg-[#efe9d9]/30 focus:bg-white outline-none focus:border-[#0f1a12] transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowAdPass(!showAdPass)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-black cursor-pointer"
                  >
                    {showAdPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="p-3 bg-[#f3ecd8] rounded-xl text-xs text-[#6b6a5f]">
                💡 <span className="font-semibold text-[#1c2b1f]">Admin Credentials Hint:</span>{' '}
                <span className="font-mono">{adminEmail}</span> /{' '}
                <span className="font-mono">{adminPassword}</span>
              </div>

              <button
                type="submit"
                id="adminLoginSubmitBtn"
                className="w-full bg-[#0f1a12] hover:bg-black text-[#efe9d9] font-medium py-3 rounded-xl text-sm shadow-md hover:-translate-y-0.5 transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <span>Access Admin Portal</span>
                <ArrowRight className="w-4 h-4 text-[#b8945a]" />
              </button>
            </form>

            <div className="flex items-center gap-3 my-4">
              <div className="flex-1 h-px bg-black/10" />
              <span className="text-xs text-[#6b6a5f] font-mono uppercase">or</span>
              <div className="flex-1 h-px bg-black/10" />
            </div>

            <button
              onClick={handleAdminGoogleAuth}
              disabled={isGoogleLoading}
              type="button"
              className="w-full py-2.5 px-4 border border-black/15 hover:bg-black/5 rounded-xl text-sm font-medium flex items-center justify-center gap-2.5 transition-all cursor-pointer disabled:opacity-60"
            >
              {isGoogleLoading ? (
                <Loader2 className="w-4 h-4 animate-spin text-[#1c2b1f]" />
              ) : (
                <ShieldCheck className="w-4 h-4 text-[#b8945a]" />
              )}
              <span>Verify with Google Account</span>
            </button>

            <div className="text-center text-xs text-[#6b6a5f] mt-6">
              <button
                onClick={() => onNavigate('login')}
                className="text-[#1c2b1f] hover:underline cursor-pointer"
              >
                ← Back to user sign in
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
