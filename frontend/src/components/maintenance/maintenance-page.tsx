'use client';

import { useEffect, useState } from 'react';
import {
  Loader2,
  Rocket,
  AlertCircle,
  CloudOff,
  CloudLightning,
  CloudAlert,
  CheckCircle,
  RefreshCw,
  XCircle,
} from 'lucide-react';
import { useApiHealth } from '@/hooks/react-query';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { isLocalMode } from '@/lib/config';

const steps = [
  {
    label: 'Checking server status...',
    icon: <CloudLightning className="w-5 h-5 text-yellow-400" />,
  },
  {
    label: 'Verifying agent connections...',
    icon: <CloudOff className="w-5 h-5 text-red-400" />,
  },
  {
    label: 'Inspecting services health...',
    icon: <Rocket className="w-5 h-5 text-purple-400" />,
  },
  {
    label: 'Finalizing restart protocols...',
    icon: <CloudAlert className="w-5 h-5 text-green-400" />,
  },
];

export function MaintenancePage() {
  const [lastChecked, setLastChecked] = useState<Date | null>(null);
  const [activeStep, setActiveStep] = useState(-1);
  const [finalState, setFinalState] = useState<'success' | 'error' | null>(null);

  const { refetch } = useApiHealth();

  const checkHealth = async () => {
    setFinalState(null);
    setActiveStep(0);

    // Animate all steps with delay
    for (let i = 0; i < steps.length; i++) {
      setActiveStep(i);
      await new Promise((res) => setTimeout(res, 800));
    }

    // Final step done — check actual server
    try {
      const result = await refetch();
      if (result.data) {
        setFinalState('success');
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      } else {
        setFinalState('error');
      }
    } catch (err) {
      console.error('Health check failed:', err);
      setFinalState('error');
    } finally {
      setLastChecked(new Date());
    }
  };

  useEffect(() => {
    setLastChecked(new Date());
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br text-white">
      <div className="w-full max-w-2xl space-y-8 bg-[#0e0e0e] border border-neutral-800 shadow-xl p-8 rounded-3xl  glow-inset-strong">
        {/* Header */}
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <div className="p-4 bg-[#18181b] border border-neutral-700 rounded-full shadow-inner">
              <Rocket className="w-10 h-10 text-purple-500 animate-bounce-slow" />
            </div>
          </div>
          <h1 className="text-3xl font-semibold">System Maintenance</h1>
          <p className="text-neutral-400 mt-2">
            {isLocalMode()
              ? 'Backend server is offline. Please ensure it’s running.'
              : 'We’re performing upgrades. Back online soon.'}
          </p>
        </div>

        {/* Animated Steps */}
        <div className="p-5 space-y-4">
          {steps.map((step, idx) => (
            <div
              key={idx}
              className={cn(
                'flex items-center gap-3 transition-all duration-700 ease-out',
                idx <= activeStep ? 'opacity-100 translate-y-0' : 'opacity-40 translate-y-2'
              )}
            >
              {idx < activeStep ? (
                <CheckCircle className="w-5 h-5 text-green-400" />
              ) : idx === activeStep ? (
                <Loader2 className="w-5 h-5 animate-spin text-white" />
              ) : (
                <div className="w-5 h-5" />
              )}
              <span
                className={cn(
                  'text-sm flex items-center gap-2',
                  idx === activeStep ? 'text-white' : 'text-neutral-400'
                )}
              >
                {step.icon}
                {step.label}
              </span>
            </div>
          ))}

          {finalState === 'success' && (
            <div className="flex items-center gap-2 text-green-400 text-sm mt-4">
              <CheckCircle className="w-5 h-5" />
              System is back online!
            </div>
          )}
          {finalState === 'error' && (
            <div className="flex items-center gap-2 text-red-400 text-sm mt-4">
              <XCircle className="w-5 h-5" />
              Server still offline. Try again later.
            </div>
          )}
        </div>

        {/* Alert Box */}
        <Alert className="bg-yellow-900/20 border border-yellow-800 text-yellow-300">
          <AlertTitle className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4" />
            Agent Executions Stopped
          </AlertTitle>
          <AlertDescription>
            {isLocalMode()
              ? 'Start your backend server to resume executions.'
              : 'Agents were halted during maintenance. Resume once system is back.'}
          </AlertDescription>
        </Alert>

        {/* Retry Button */}
        <div className="space-y-2">
          <Button
            onClick={checkHealth}
            disabled={activeStep !== -1 && finalState === null}
            className="w-full bg-purple-600 hover:bg-purple-700 transition-colors"
          >
            <RefreshCw
              className={cn('h-4 w-4 mr-2', finalState === null && activeStep !== -1 && 'animate-spin')}
            />
            {finalState === null && activeStep !== -1 ? 'Checking...' : 'Check Again'}
          </Button>
          {lastChecked && (
            <p className="text-xs text-neutral-500 text-center">
              Last checked: {lastChecked.toLocaleTimeString()}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
