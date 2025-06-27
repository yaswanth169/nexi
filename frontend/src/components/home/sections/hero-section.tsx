'use client';

import { useEffect, useState, FormEvent } from 'react';
import { ArrowUp } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import GoogleSignIn from '@/components/GoogleSignIn';
import { useAuth } from '@/components/AuthProvider';
import { useInitiateAgentMutation } from '@/hooks/react-query/dashboard/use-initiate-agent';
import { useThreadQuery } from '@/hooks/react-query/threads/use-threads';
import { siteConfig } from '@/lib/home';

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

  return (
    <section id="hero" className="relative flex flex-col justify-center items-center min-h-screen px-4 text-white overflow-hidden">
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <h1
          className="text-[40vw] font-extrabold text-transparent select-none leading-none stroke-text opacity-0 translate-y-6 animate-[fadeUp_0.8s_ease-out_forwards]"
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

      <form
        onSubmit={handleSubmit}
        className="z-10 w-full max-w-3xl px-4 relative group"
      >
        <div className="flex items-center justify-between bg-black/70 border border-white/10 rounded-3xl px-6 py-8 shadow-xl backdrop-blur-sm transition-all duration-300">
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

      <p className="mt-10 text-white/80 text-sm text-center max-w-md">
        NexI is your truth-seeking AI companion for unfiltered answers with advanced capabilities in reasoning, coding, and processing.
      </p>

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

      <Dialog open={authDialogOpen} onOpenChange={setAuthDialogOpen}>
        <DialogContent className="bg-[#111] text-white border border-white/10 rounded-xl">
          <DialogHeader>
            <DialogTitle className="text-xl">Sign in to continue</DialogTitle>
          </DialogHeader>
          <GoogleSignIn returnUrl="/dashboard" />
          <div className="mt-4 text-sm text-center text-white/60">
            By continuing, you agree to our{' '}
            <Link href="/terms" className="text-white underline">Terms</Link> and{' '}
            <Link href="/privacy" className="text-white underline">Privacy Policy</Link>
          </div>
        </DialogContent>
      </Dialog>

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
