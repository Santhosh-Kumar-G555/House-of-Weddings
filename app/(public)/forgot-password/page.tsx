'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { requestOtpAction, resetPasswordAction } from '@/lib/actions/auth';
import Link from 'next/link';

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [step, setStep] = useState<1 | 2>(1);
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const res = await requestOtpAction(email);
    if (res.success) {
      setStep(2); // Move to the verification step
    } else {
      setError(res.error || 'Something went wrong.');
    }
    setLoading(false);
  };

  const handleResetPassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    formData.append('email', email); // Attach the email from state

    const res = await resetPasswordAction(formData);
    if (res.success) {
      // Redirect to login upon success
      router.push('/login?reset=success');
    } else {
      setError(res.error || 'Something went wrong.');
    }
    setLoading(false);
  };

  return (
    // THE FIX 1: Changed 'flex-col' to 'items-center' to properly center the child without stretching/squishing it
    <div className="min-h-[80vh] w-full flex items-center justify-center bg-surface px-4 relative">

      {/* THE FIX 2: Added 'shrink-0' and 'min-w-[320px]' to physically block the browser from crushing the container */}
      <div className="w-full max-w-md min-w-[320px] sm:min-w-[400px] shrink-0 mx-auto p-6 bg-surface-lowest border border-outline-variant rounded-2xl shadow-sm">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold text-on-surface mb-2">Reset Password</h1>
          <p className="text-sm text-on-surface-variant">
            {step === 1 ? 'Enter your email to receive a verification code.' : 'Enter your 6-digit code and new password.'}
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-error/10 border border-error/20 text-error text-sm font-bold rounded-lg text-center">
            {error}
          </div>
        )}

        {step === 1 ? (
          <form key="step-1-form" onSubmit={handleRequestOtp} className="space-y-4">
            <div>
              <label htmlFor="fp-email" className="block text-sm font-bold text-on-surface mb-1">Email Address</label>
              <input
                id="fp-email"
                aria-label="Email Address"
                type="email"
                required
                value={email || ''}
                onChange={(e) => setEmail(e.target.value || '')}
                className="w-full p-3 border border-outline-variant rounded-md focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                placeholder="name@example.com"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-on-surface text-white font-bold rounded-md hover:bg-on-surface/90 transition-colors disabled:opacity-70"
            >
              {loading ? 'Sending...' : 'Send Verification Code'}
            </button>
          </form>
        ) : (
          <form key="step-2-form" onSubmit={handleResetPassword} className="space-y-4">
            <div>
              <label htmlFor="fp-otp" className="block text-sm font-bold text-on-surface mb-1">6-Digit Code</label>
              <input
                id="fp-otp"
                aria-label="6-Digit Verification Code"
                name="otp"
                type="text"
                required
                maxLength={6}
                className="w-full p-3 border border-outline-variant rounded-md focus:border-primary focus:ring-1 focus:ring-primary outline-none text-center tracking-[0.5em] text-lg font-bold"
                placeholder="••••••"
              />
            </div>
            <div>
              <label htmlFor="fp-new-password" className="block text-sm font-bold text-on-surface mb-1">New Password</label>
              <input
                id="fp-new-password"
                aria-label="New Password"
                name="newPassword"
                type="password"
                required
                maxLength={16}
                className="w-full p-3 border border-outline-variant rounded-md focus:border-primary focus:ring-1 focus:ring-primary outline-none"
              />
              <p className="text-xs text-on-surface-variant mt-1">
                8-16 chars. 1 uppercase, 1 number, 1 special character.
              </p>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-primary text-on-primary font-bold rounded-md hover:bg-primary/90 transition-colors disabled:opacity-70 mt-2"
            >
              {loading ? 'Resetting...' : 'Reset Password'}
            </button>
          </form>
        )}

        <div className="mt-6 text-center">
          <Link href="/login" className="text-sm font-bold text-primary hover:underline">
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
}
