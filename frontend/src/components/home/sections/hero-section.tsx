'use client';

import { useEffect, useState, FormEvent } from 'react';
import { ArrowUp, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import GoogleSignIn from '@/components/GoogleSignIn';
import { useAuth } from '@/components/AuthProvider';
import { useInitiateAgentMutation } from '@/hooks/react-query/dashboard/use-initiate-agent';
import { useThreadQuery } from '@/hooks/react-query/threads/use-threads';
import { siteConfig } from '@/lib/home';
import { SubmitButton } from '@/components/ui/submit-button';
import { Input } from '@/components/ui/input';
import { signIn } from '@/app/auth/actions';
import InputWithGlow from '../ui/input-glow';

const PENDING_PROMPT_KEY = 'pendingAgentPrompt';

export function HeroSection() {
  const { hero } = siteConfig;
  const { user, isLoading } = useAuth();
  const [inputValue, setInputValue] = useState('');
  const [authDialogOpen, setAuthDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [initiatedThreadId, setInitiatedThreadId] = useState<string | null>(null);
  const [authError, setAuthError] = useState<string | null>(null);

  const router = useRouter();
  const initiateAgentMutation = useInitiateAgentMutation();
  const threadQuery = useThreadQuery(initiatedThreadId || '');

  useEffect(() => {
    if (authDialogOpen && user && !isLoading) {
      setAuthDialogOpen(false);
      router.push('/dashboard');
    }
  }, [user, isLoading, authDialogOpen, router]);

  useEffect(() => {
    if (threadQuery.data && initiatedThreadId) {
      const thread = threadQuery.data;
      if (thread.project_id) {
        router.push(`/projects/${thread.project_id}/thread/${initiatedThreadId}`);
      } else {
        router.push(`/thread/${initiatedThreadId}`);
      }
      setInitiatedThreadId(null);
    }
  }, [threadQuery.data, initiatedThreadId, router]);

  const createAgentWithPrompt = async () => {
    if (!inputValue.trim() || isSubmitting) return;
    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('prompt', inputValue.trim());
      formData.append('model_name', 'gpt-4o');
      formData.append('enable_thinking', 'false');
      formData.append('reasoning_effort', 'low');
      formData.append('stream', 'true');
      formData.append('enable_context_manager', 'false');

      const result = await initiateAgentMutation.mutateAsync(formData);
      setInitiatedThreadId(result.thread_id);
      setInputValue('');
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = async (e?: FormEvent) => {
    e?.preventDefault();
    if (!inputValue.trim() || isSubmitting) return;

    if (!user && !isLoading) {
      localStorage.setItem(PENDING_PROMPT_KEY, inputValue.trim());
      setAuthDialogOpen(true);
      return;
    }

    createAgentWithPrompt();
  };

  const handleSignIn = async (_prevState: any, formData: FormData) => {
    setAuthError(null);
    try {
      formData.append('returnUrl', '/dashboard');
      const result = await signIn(undefined, formData);

      if ('message' in result) {
        setAuthError(result.message);
        return { message: result.message };
      } else {
        router.push('/dashboard');
      }
    } catch (error) {
      console.error('Sign in error:', error);
      setAuthError('An error occurred during sign in');
      return { message: 'An error occurred during sign in' };
    }
  };

  return (
    <section
      id="hero"
      className="relative flex flex-col justify-center items-center min-h-screen px-4 text-white overflow-hidden"
    >
      {/* NexI Animated Text */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <h1
          className="text-[40vw] font-extrabold text-transparent select-none leading-none stroke-text opacity-0 translate-y-6 animate-[fadeUp_0.8s_ease-out_forwards] bg-gradient-to-r from-white/10 via-white/20 to-white/5 bg-clip-text"
          style={{
            WebkitMaskImage: 'linear-gradient(to top, transparent 0%, rgba(0,0,0,0.3) 20%, black 60%)',
            maskImage: 'linear-gradient(to top, transparent 0%, rgba(0,0,0,0.3) 20%, black 60%)',
            WebkitMaskSize: '100% 100%',
            WebkitMaskRepeat: 'no-repeat',
          }}
        >
          NexI
        </h1>
      </div>

      <InputWithGlow inputValue={inputValue} setInputValue={setInputValue} isSubmitting={isSubmitting} handleSubmit={handleSubmit} />

      {/* CTA Buttons */}
      <div className="flex gap-4 mt-6 z-10">
        <Link
          href="/dashboard"
          className="px-6 py-2 rounded-full bg-white text-black text-sm font-medium hover:bg-white/90"
        >
          Try NexI ↗
        </Link>
        <Link
          href="/api"
          className="px-6 py-2 rounded-full border border-white text-white text-sm font-medium hover:bg-white/10"
        >
          Build with API ↗
        </Link>
      </div>

      {/* Sign-in Dialog */}
      <Dialog open={authDialogOpen} onOpenChange={setAuthDialogOpen}>
        <DialogContent className="sm:max-w-md rounded-2xl shadow-2xl border border-border bg-background/90 backdrop-blur-md">
          <DialogHeader className="space-y-1.5 pb-2">
            <DialogTitle className="text-xl font-semibold tracking-tight">Sign in to continue</DialogTitle>
            <DialogDescription className="text-sm text-muted-foreground">
              Sign in or create an account to chat with NexI
            </DialogDescription>
          </DialogHeader>

          {authError && (
            <div className="flex items-center gap-2 p-3 bg-destructive/10 border border-destructive/30 text-destructive text-sm rounded-lg">
              <AlertCircle className="w-4 h-4" />
              {authError}
            </div>
          )}

          <GoogleSignIn returnUrl="/dashboard" />

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-sm text-muted-foreground">
              <span className="bg-background px-2">or continue with email</span>
            </div>
          </div>

          <form className="space-y-4">
            <Input
              name="email"
              type="email"
              placeholder="Email address"
              className="h-11 rounded-xl bg-muted/30 border-border focus:ring-2 focus:ring-primary/30"
              required
            />
            <Input
              name="password"
              type="password"
              placeholder="Password"
              className="h-11 rounded-xl bg-muted/30 border-border focus:ring-2 focus:ring-primary/30"
              required
            />
            <div className="space-y-3 pt-2">
              <SubmitButton
                formAction={handleSignIn}
                className="w-full h-11 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 transition-all shadow-md"
                pendingText="Signing in..."
              >
                Sign in
              </SubmitButton>

              <Link
                href="/auth?mode=signup&returnUrl=/dashboard"
                onClick={() => setAuthDialogOpen(false)}
                className="flex items-center justify-center w-full h-11 rounded-xl border border-border bg-muted/20 hover:bg-muted/30 transition-all text-sm font-medium"
              >
                Create new account
              </Link>
            </div>

            <div className="text-center pt-3">
              <Link
                href="/auth?returnUrl=/dashboard"
                onClick={() => setAuthDialogOpen(false)}
                className="text-sm text-primary hover:underline"
              >
                More sign-in options
              </Link>
            </div>
          </form>

          <div className="mt-6 text-center text-xs text-muted-foreground">
            By continuing, you agree to our{' '}
            <Link href="/terms" className="text-primary hover:underline">Terms of Service</Link> and{' '}
            <Link href="/privacy" className="text-primary hover:underline">Privacy Policy</Link>.
          </div>
        </DialogContent>
      </Dialog>

      {/* Keyframes & Styling */}
      <style jsx>{`
        .stroke-text {
          -webkit-text-stroke: 2px rgba(255, 255, 255, 0.2);
          color: transparent;
        }

        @keyframes fadeUp {
          0% {
            opacity: 0;
            transform: translateY(24px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </section>
  );
}
