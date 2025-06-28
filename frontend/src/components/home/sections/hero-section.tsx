'use client';

import { useEffect, useState, FormEvent } from 'react';
import { ArrowUp, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogOverlay } from '@/components/ui/dialog';
import GoogleSignIn from '@/components/GoogleSignIn';
import { useAuth } from '@/components/AuthProvider';
import { useInitiateAgentMutation } from '@/hooks/react-query/dashboard/use-initiate-agent';
import { useThreadQuery } from '@/hooks/react-query/threads/use-threads';
import { siteConfig } from '@/lib/home';
import { SubmitButton } from '@/components/ui/submit-button';
import { Input } from '@/components/ui/input';

// Custom dialog overlay with blur effect
const BlurredDialogOverlay = () => (
  <DialogOverlay className="bg-background/40 backdrop-blur-md" />
);
const PENDING_PROMPT_KEY = 'pendingAgentPrompt';

export function HeroSection() {
  const { hero } = siteConfig;
  const { user, isLoading } = useAuth();
  const [inputValue, setInputValue] = useState('');
  const [authDialogOpen, setAuthDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [initiatedThreadId, setInitiatedThreadId] = useState<string | null>(null);

  const router = useRouter();
  const initiateAgentMutation = useInitiateAgentMutation();
  const threadQuery = useThreadQuery(initiatedThreadId || '');

  const [authError, setAuthError] = useState<string | null>(null);


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
      formData.append('model_name', 'openrouter/deepseek/deepseek-chat');
      formData.append('enable_thinking', 'false');
      formData.append('reasoning_effort', 'low');
      formData.append('stream', 'true');
      formData.append('enable_context_manager', 'false');

      const result = await initiateAgentMutation.mutateAsync(formData);

      setInitiatedThreadId(result.thread_id);
      setInputValue('');
    } catch (error: any) {
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

  // Handle auth form submission
  const handleSignIn = async (prevState: any, formData: FormData) => {
    setAuthError(null);
    try {
      // Implement sign in logic here
      const email = formData.get('email') as string;
      const password = formData.get('password') as string;

      // Add the returnUrl to the form data for proper redirection
      formData.append('returnUrl', '/dashboard');

      // Call your authentication function here

      // Return any error state
      return { message: 'Invalid credentials' };
    } catch (error) {
      console.error('Sign in error:', error);
      setAuthError(
        error instanceof Error ? error.message : 'An error occurred',
      );
      return { message: 'An error occurred during sign in' };
    }
  };

  return (
    <section
      id="hero"
      className="relative flex flex-col justify-center items-center min-h-screen px-4 text-white overflow-hidden"
    >

      {/* NexI Text */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <h1
          className="text-[40vw] font-extrabold text-transparent select-none leading-none stroke-text opacity-0 translate-y-6 animate-[fadeUp_0.8s_ease-out_forwards] bg-gradient-to-r from-white/10 via-white/20 to-white/5 bg-clip-text"
          style={{
            WebkitMaskImage:
              'linear-gradient(to top, transparent 0%, rgba(0,0,0,0.3) 20%, black 60%)',
            maskImage:
              'linear-gradient(to top, transparent 0%, rgba(0,0,0,0.3) 20%, black 60%)',
            WebkitMaskSize: '100% 100%',
            WebkitMaskRepeat: 'no-repeat',
          }}
        >
          NexI
        </h1>
      </div>

      {/* Input + Buttons */}
      <form
        onSubmit={handleSubmit}
        className="z-10 w-full max-w-3xl px-4 relative group"
      >
        <div className="flex items-center justify-between bg-black/30 border border-white/10 rounded-3xl px-6 py-8 shadow-xl backdrop-blur-2xl transition-all duration-300">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="What do you want to know?"
            className="flex-1 bg-transparent text-white placeholder-white/50 text-lg md:text-xl outline-none"
            disabled={isSubmitting}
          />
          <button
            type="submit"
            className="ml-4 p-2 bg-white text-black rounded-full hover:scale-105 transition-transform"
            disabled={!inputValue.trim() || isSubmitting}
            aria-label="Submit"
          >
            <ArrowUp className="h-5 w-5" />
          </button>
        </div>
      </form>

      {/* Buttons */}
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

      {/* Auth Dialog */}
      <Dialog open={authDialogOpen} onOpenChange={setAuthDialogOpen}>
        <BlurredDialogOverlay />
        <DialogContent className="sm:max-w-md rounded-xl bg-[#F3F4F6] dark:bg-[#F9FAFB]/[0.02] border border-border">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <DialogTitle className="text-xl font-medium">
                Sign in to continue
              </DialogTitle>
              {/* <button 
                onClick={() => setAuthDialogOpen(false)}
                className="rounded-full p-1 hover:bg-muted transition-colors"
              >
                <X className="h-4 w-4 text-muted-foreground" />
              </button> */}
            </div>
            <DialogDescription className="text-muted-foreground">
              Sign in or create an account to talk with Suna
            </DialogDescription>
          </DialogHeader>

          {/* Auth error message */}
          {authError && (
            <div className="mb-4 p-3 rounded-lg flex items-center gap-3 bg-secondary/10 border border-secondary/20 text-secondary">
              <AlertCircle className="h-5 w-5 flex-shrink-0 text-secondary" />
              <span className="text-sm font-medium">{authError}</span>
            </div>
          )}

          {/* Google Sign In */}
          <div className="w-full">
            <GoogleSignIn returnUrl="/dashboard" />
          </div>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-[#F3F4F6] dark:bg-[#F9FAFB]/[0.02] text-muted-foreground">
                or continue with email
              </span>
            </div>
          </div>

          {/* Sign in form */}
          <form className="space-y-4">
            <div>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="Email address"
                className="h-12 rounded-full bg-background border-border"
                required
              />
            </div>

            <div>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="Password"
                className="h-12 rounded-full bg-background border-border"
                required
              />
            </div>

            <div className="space-y-4 pt-4">
              <SubmitButton
                formAction={handleSignIn}
                className="w-full h-12 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 transition-all shadow-md"
                pendingText="Signing in..."
              >
                Sign in
              </SubmitButton>

              <Link
                href={`/auth?mode=signup&returnUrl=${encodeURIComponent('/dashboard')}`}
                className="flex h-12 items-center justify-center w-full text-center rounded-full border border-border bg-background hover:bg-accent/20 transition-all"
                onClick={() => setAuthDialogOpen(false)}
              >
                Create new account
              </Link>
            </div>

            <div className="text-center pt-2">
              <Link
                href={`/auth?returnUrl=${encodeURIComponent('/dashboard')}`}
                className="text-sm text-primary hover:underline"
                onClick={() => setAuthDialogOpen(false)}
              >
                More sign in options
              </Link>
            </div>
          </form>

          <div className="mt-4 text-center text-xs text-muted-foreground">
            By continuing, you agree to our{' '}
            <Link href="/terms" className="text-primary hover:underline">
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link href="/privacy" className="text-primary hover:underline">
              Privacy Policy
            </Link>
          </div>
        </DialogContent>
      </Dialog>

      {/* Fade-up Text Animation */}
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