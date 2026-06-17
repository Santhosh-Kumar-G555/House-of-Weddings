
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { signIn, getSession } from 'next-auth/react';
import { registerUser } from '@/server/actions/auth';

// react-doctor-disable-next-line prefer-useReducer, react-doctor/prefer-useReducer
export default function AuthPage() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);

  // Form State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [role, setRole] = useState<'USER' | 'VENDOR'>('USER');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setFieldErrors({});
    setLoading(true);

    try {
      if (isLogin) {
        const res = await signIn('credentials', { redirect: false, email, password });
        if (res?.error) {
          setError('Invalid email or password.');
        } else {
          setSuccessMsg('Login successful! Redirecting...');
          
          const session = await getSession();
          
          setTimeout(() => {
            const role = (session?.user as any)?.role;
            if (role === 'ADMIN' || role === 'SUPER_ADMIN') {
              router.push('/admin/dashboard');
            } else {
              router.push('/');
            }
            router.refresh();
          }, 1500);
        }
      } else {
        const formData = new FormData();
        formData.append('email', email);
        formData.append('password', password);
        formData.append('fullName', fullName);
        formData.append('role', role);

        const result = await registerUser(formData);
        if (result.error) {
          setError(result.error);
          if (result.fieldErrors) setFieldErrors(result.fieldErrors);
        } else {
          setSuccessMsg('Registration complete! Logging you in...');
          const loginRes = await signIn('credentials', { redirect: false, email, password });
          if (!loginRes?.error) {
            setTimeout(() => {
              router.push('/');
              router.refresh();
            }, 1500);
          } else {
            setError('Account created, but failed to log in.');
          }
        }
      }
    } catch {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] w-full flex flex-col justify-center bg-background p-4 relative">
      


      {/* The Enforced Card Wrapper */}
      <div className="w-full max-w-[450px] min-w-[320px] sm:min-w-[400px] mx-auto bg-surface-container-lowest border border-outline-variant rounded-2xl p-8 shadow-sm">
        
        {/* Headers */}
        <div className="w-full mb-6">
          <h1 className="font-headline-md font-bold text-on-surface mb-2">
            {isLogin ? 'Welcome Back' : 'Create an Account'}
          </h1>
          <p className="text-sm text-on-surface-variant">
            {isLogin 
              ? 'Sign in to manage your favorites, shortlists, and inquiries.' 
              : 'Register to start building your premium event dream team.'}
          </p>
        </div>

        {/* Enforced Form Container */}
        <form className="w-full flex flex-col gap-4" onSubmit={handleSubmit}>
          
          {/* Error Banner */}
          {error && (
            <div className="w-full bg-red-50 border border-red-200 text-red-700 p-3 rounded font-label-sm">
              {error}
            </div>
          )}
          {/* Success Banner */}
          {successMsg && (
            <div className="w-full bg-primary-container text-on-primary-container p-3 rounded font-label-sm border border-primary/20">
              {successMsg}
            </div>
          )}

          {/* Premium 'Raised Pill' Role Toggle */}
          {!isLogin && (
            <div className="w-full grid grid-cols-2 gap-1 p-1 bg-surface-variant/80 border border-outline-variant/30 rounded-lg mb-4">
              <button 
                type="button" 
                onClick={() => setRole('USER')}
                className={`w-full py-2 text-sm font-bold rounded-md transition-all duration-200 ${
                  role === 'USER' 
                    ? 'bg-surface-container-lowest text-on-surface shadow-sm border border-outline-variant/20' 
                    : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-variant'
                }`}
              >
                Planning a Wedding
              </button>
              <button 
                type="button" 
                onClick={() => setRole('VENDOR')}
                className={`w-full py-2 text-sm font-bold rounded-md transition-all duration-200 ${
                  role === 'VENDOR' 
                    ? 'bg-surface-container-lowest text-on-surface shadow-sm border border-outline-variant/20' 
                    : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-variant'
                }`}
              >
                I am a Vendor
              </button>
            </div>
          )}

          {/* Enforced Inputs */}
          {!isLogin && (
            <div className="w-full flex flex-col gap-1.5">
              <label htmlFor="login-fullname" className="text-xs font-bold text-on-surface-variant tracking-wider uppercase">Full Name</label>
              <input 
                id="login-fullname"
                type="text" 
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required={!isLogin}
                maxLength={30}
                className="w-full px-4 py-2 bg-transparent border border-outline-variant rounded-md focus:border-primary outline-none" 
              />
              <p className="text-xs text-on-surface-variant mt-1">Maximum 30 characters.</p>
              {fieldErrors?.fullName && <p className="text-xs text-error mt-1 font-bold">{fieldErrors.fullName[0]}</p>}
            </div>
          )}

          <div className="w-full flex flex-col gap-1.5">
            <label htmlFor="login-email" className="text-xs font-bold text-on-surface-variant tracking-wider uppercase">Email Address</label>
            <input 
              id="login-email"
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2 bg-transparent border border-outline-variant rounded-md focus:border-primary outline-none" 
            />
          </div>

          <div className="w-full flex flex-col gap-1.5">
            <div className="w-full flex justify-between items-center">
              <label htmlFor="login-password" className="text-xs font-bold text-on-surface-variant tracking-wider uppercase">Password</label>
              {isLogin && (
                <Link 
                  href="/forgot-password" 
                  className="text-xs text-on-surface-variant hover:text-primary transition-colors hover:underline"
                >
                  Forgot?
                </Link>
              )}
            </div>
            <input 
              id="login-password"
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              maxLength={16}
              className="w-full px-4 py-2 bg-transparent border border-outline-variant rounded-md focus:border-primary outline-none" 
            />
            {!isLogin && (
              <p className="text-xs text-on-surface-variant mt-1">
                8-16 characters. Must contain 1 uppercase letter, 1 number, and 1 special character.
              </p>
            )}
            {fieldErrors?.password && <p className="text-xs text-error mt-1 font-bold">{fieldErrors.password[0]}</p>}
          </div>

          {/* Submit Button */}
          <button 
            type="submit" 
            disabled={loading}
            className="w-full py-3 mt-4 bg-on-surface text-surface-container-lowest font-bold rounded-md hover:bg-on-surface/90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Processing...' : (isLogin ? 'Sign In' : 'Create Account')}
          </button>
        </form>

        {/* Footer Link */}
        <div className="w-full text-center mt-6">
          <p className="text-sm text-on-surface-variant">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button 
              onClick={() => { setIsLogin(!isLogin); setError(''); setFieldErrors({}); setSuccessMsg(''); }}
              className="font-bold text-on-surface hover:text-primary transition-colors" type="button"
            >
              {isLogin ? 'Create one now' : 'Sign in'}
            </button>
          </p>
        </div>

      </div>
    </div>
  );
}
