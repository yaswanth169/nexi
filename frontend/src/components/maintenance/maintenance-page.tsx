'use client';

import { useEffect, useState } from 'react';
import { Loader2, Server, RefreshCw, AlertCircle } from 'lucide-react';
import { useApiHealth } from '@/hooks/react-query';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { isLocalMode } from '@/lib/config';

export function MaintenancePage() {
  const [lastChecked, setLastChecked] = useState<Date | null>(null);
  
  const { data: healthData, isLoading: isCheckingHealth, refetch } = useApiHealth();

  const checkHealth = async () => {
    try {
      const result = await refetch();
      if (result.data) {
        window.location.reload();
      }
    } catch (error) {
      console.error('API health check failed:', error);
    } finally {
      setLastChecked(new Date());
    }
  };

  useEffect(() => {
    setLastChecked(new Date());
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-background">
      <div className="w-full max-w-md space-y-8 text-center">
        <div className="space-y-4">
          <div className="flex justify-center">
            <div className="relative">
              <Server className="h-16 w-16 text-primary animate-pulse" />
              <div className="absolute inset-0 flex items-center justify-center"></div>
            </div>
          </div>

          <h1 className="text-3xl font-bold tracking-tight">
            System Maintenance
          </h1>

          <p className="text-muted-foreground">
            {isLocalMode() ? (
              "The backend server appears to be offline. Please check that your backend server is running."
            ) : (
              "We're currently performing maintenance on our systems. Our team is working to get everything back up and running as soon as possible."
            )}
          </p>

          <Alert className="mt-6">
            <AlertTitle>Agent Executions Stopped</AlertTitle>
            <AlertDescription>
              {isLocalMode() ? (
                "The backend server needs to be running for agent executions to work. Please start the backend server and try again."
              ) : (
                "Any running agent executions have been stopped during maintenance. You'll need to manually continue these executions once the system is back online."
              )}
            </AlertDescription>
          </Alert>
        </div>

        <div className="space-y-4">
          <Button
            onClick={checkHealth}
            disabled={isCheckingHealth}
            className="w-full"
          >
            <RefreshCw
              className={cn('h-4 w-4', isCheckingHealth && 'animate-spin')}
            />
            {isCheckingHealth ? 'Checking...' : 'Check Again'}
          </Button>

          {lastChecked && (
            <p className="text-sm text-muted-foreground">
              Last checked: {lastChecked.toLocaleTimeString()}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
