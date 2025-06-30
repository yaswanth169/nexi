'use client';

import { useEffect, useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import {
  ArrowRight,
  Loader2,
  Sparkles,
  AlertCircle,
  CheckCircle,
  Search,
  Settings2,
  Rocket,
  LayoutDashboard,
} from 'lucide-react';

import { Input } from '@/components/ui/input';
import { SubmitButton } from '@/components/ui/submit-button';
import GoogleSignIn from '@/components/GoogleSignIn';
import { useAuth } from '@/components/AuthProvider';
import { signIn, signUp } from './actions';

const steps = [
  {
    label: 'Spinning up quantum handshake...',
    icon: <Sparkles className="w-5 h-5 text-purple-400" />,
  },
  {
    label: 'Probing encrypted memory vaults...',
    icon: <Search className="w-5 h-5 text-yellow-400" />,
  },
  {
    label: 'Wiring biometric trust signals...',
    icon: <Settings2 className="w-5 h-5 text-blue-400" />,
  },
  {
    label: 'Routing through secure hyperspace...',
    icon: <Rocket className="w-5 h-5 text-green-400" />,
  },
  {
    label: 'Booting up your mission dashboard...',
    icon: <LayoutDashboard className="w-5 h-5 text-white" />,
  },
];

export default function Login() {
  return (
    <Suspense fallback={<LoaderFallback />}>
      <LoginContent />
    </Suspense>
  );
}

function LoaderFallback() {
  return (
    <main className="flex items-center justify-center min-h-screen bg-black">
      <Loader2 className="h-10 w-10 animate-spin text-purple-500" />
    </main>
  );
}

function LoginContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const mode = searchParams.get('mode');
  const returnUrl = searchParams.get('returnUrl') || '/dashboard';
  const message = searchParams.get('message');
  const isSignUp = mode === 'signup';

  const { user, isLoading } = useAuth();
  const [showForm, setShowForm] = useState(false);
  const [activeStep, setActiveStep] = useState(-1);

  useEffect(() => {
    if (!isLoading && user) {
      router.push(returnUrl);
    }
    const timeout = setTimeout(() => setShowForm(true), 200);
    return () => clearTimeout(timeout);
  }, [user, isLoading, returnUrl, router]);

  useEffect(() => {
    if (showForm) {
      let i = 0;
      const interval = setInterval(() => {
        setActiveStep(i);
        i++;
        if (i === steps.length) clearInterval(interval);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [showForm]);

  const handleSignIn = async (prevState: any, formData: FormData) => {
    formData.append('returnUrl', returnUrl);
    const result = await signIn(prevState, formData);

    if (result?.success && result.redirectTo) {
      window.location.href = result.redirectTo;
      return null;
    }

    return result;
  };

  const handleSignUp = async (prevState: any, formData: FormData) => {
    formData.append('returnUrl', returnUrl);
    formData.append('origin', window.location.origin);
    const result = await signUp(prevState, formData);

    if (result?.success && result.redirectTo) {
      window.location.href = result.redirectTo;
      return null;
    }

    return result;
  };

  if (isLoading || !showForm) return <LoaderFallback />;

  return (
    <main className="min-h-screen w-full bg-gradient-to-br from-[#0b0c12] via-[#11121b] to-[#1a1625] text-white flex items-center justify-center px-4">
      <div className="relative max-w-5xl w-full bg-[#0e0e0e] border border-neutral-800 shadow-xl rounded-2xl overflow-hidden grid md:grid-cols-2">
        {/* Left Panel */}
        <div className="relative p-8 bg-[#10101a] flex flex-col justify-center">
          <div className="mb-6 text-center">
            <h2 className="text-3xl font-bold mb-2">Welcome to NexI</h2>
            <p className="text-neutral-400 text-sm leading-relaxed">
              Your intelligent assistant awaits. Sign in to experience AI-powered tools for research, planning, and productivity.
            </p>
          </div>

          <div className="flex justify-center mb-8">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-sm text-neutral-400 hover:text-white hover:translate-x-1 transition-all duration-300"
            >
              <ArrowRight className="w-4 h-4 rotate-180" />
              Back to Home
            </Link>
          </div>

          <div className="relative bg-[#0c0c12] rounded-2xl border p-5 shadow-xl overflow-hidden glow-inset-strong shine-effect-strong">
            <div className="space-y-3">
              {steps.map((step, idx) => (
                <div
                  key={idx}
                  className={`flex items-center gap-3 transition-all duration-700 ease-out ${idx <= activeStep ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'
                    }`}
                >
                  {idx < activeStep ? (
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  ) : idx === activeStep ? (
                    <Loader2 className="w-5 h-5 animate-spin text-white" />
                  ) : (
                    <div className="w-5 h-5" />
                  )}
                  <span className={`text-sm ${idx === activeStep ? 'text-white' : 'text-neutral-400'} flex items-center gap-2`}>
                    {step.icon}
                    {step.label}
                  </span>
                </div>
              ))}
            </div>
            <div className="absolute inset-0 rounded-2xl pointer-events-none animate-border-glow" />
          </div>
        </div>

        {/* Right Panel: Form */}
        <div className="p-8 space-y-6 animate-fade-in bg-[#0e0e0e]">
          <div className="space-y-2">
            <h3 className="text-xl font-semibold">
              {isSignUp ? 'Create your account' : 'Sign in to your account'}
            </h3>
            <p className="text-sm text-neutral-400">
              {isSignUp ? 'Start exploring the future with NexI' : 'Welcome back, agent'}
            </p>
          </div>

          {message && (
            <div className="flex items-center gap-2 text-sm text-yellow-400 bg-yellow-900/20 p-3 rounded-lg">
              <AlertCircle className="w-4 h-4" />
              {message}
            </div>
          )}

          <GoogleSignIn returnUrl={returnUrl} />

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-neutral-700" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-[#0e0e0e] px-2 text-neutral-500">or</span>
            </div>
          </div>

          <form className="space-y-4">
            <Input
              name="email"
              type="email"
              placeholder="Email"
              className="h-12 bg-[#11121b] border border-neutral-700 rounded-full px-4"
              required
            />
            <Input
              name="password"
              type="password"
              placeholder="Password"
              className="h-12 bg-[#11121b] border border-neutral-700 rounded-full px-4"
              required
            />
            {isSignUp && (
              <Input
                name="confirmPassword"
                type="password"
                placeholder="Confirm Password"
                className="h-12 bg-[#11121b] border border-neutral-700 rounded-full px-4"
                required
              />
            )}
            <SubmitButton
              formAction={isSignUp ? handleSignUp : handleSignIn}
              className="w-full h-12 bg-purple-600 hover:bg-purple-700 transition rounded-full text-white font-medium"
              pendingText={isSignUp ? 'Creating account...' : 'Signing in...'}
            >
              {isSignUp ? 'Sign Up' : 'Sign In'}
            </SubmitButton>
          </form>

          <div className="flex justify-between text-sm text-neutral-500">
            <Link href={isSignUp ? '/auth?mode=signin' : '/auth?mode=signup'} className="hover:underline">
              {isSignUp ? 'Already have an account?' : 'Create a new account'}
            </Link>
            {!isSignUp && (
              <button type="button" className="hover:underline">
                Forgot password?
              </button>
            )}
          </div>

          <p className="text-xs text-neutral-600 text-center pt-4">
            By continuing, you agree to our{' '}
            <Link href="/terms" className="underline hover:text-white">
              Terms
            </Link>{' '}
            and{' '}
            <Link href="/privacy" className="underline hover:text-white">
              Privacy Policy
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
