"use client";

import { Container } from '@/components/common/container';
import AdminAccessVerifyKeyForm from '@/components/forms/admin-access-verify-key-form';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { api } from '@/lib/axios-client';
import { useAuth } from '@/providers/auth-provider';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Loader2, Mail, Shield, Clock, CheckCircle2 } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';

function RequestAdminAccess() {
  const { user, refreshUser } = useAuth();
  const [emailSent, setEmailSent] = useState(false);
  const [countdown, setCountdown] = useState(0);

  // Check current admin access status
  const { data: adminStatus, refetch: refetchStatus } = useQuery({
    queryKey: ["admin-status"],
    queryFn: async () => {
      const response = await api.get("/api/v1/auth/admin-status");
      return response.data;
    },
    refetchInterval: 30000, // Refetch every 30 seconds
    enabled: user?.role === 'admin',
  });

  // Request admin access mutation
  const { mutate: requestAdminAccess, isPending: isRequesting } = useMutation({
    mutationKey: ["request-admin-access-key"],
    mutationFn: async () => {
      const response = await api.post("/api/v1/auth/request-admin-access");
      return response.data;
    },
    onSuccess: (data) => {
      toast.success(data.message);
      setEmailSent(true);
      setCountdown(30); // 30 second cooldown
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to request admin access");
    },
  });

  // Countdown effect for request cooldown
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  // Reset email sent status when countdown ends
  useEffect(() => {
    if (countdown === 0) {
      setEmailSent(false);
    }
  }, [countdown]);

  const handleRequestAccess = () => {
    if (countdown === 0) {
      requestAdminAccess();
    }
  };
  

  const hasValidAccess = adminStatus?.data?.hasValidAdminAccess;
  const accessExpiresAt = adminStatus?.data?.adminAccessKeyExpires;

  if (hasValidAccess) {
    return (
      <Container className='flex flex-col gap-6 py-8'>
        <Alert className="border-cyan-200 bg-cyan-50 dark:bg-cyan-950 dark:border-cyan-800">
          <CheckCircle2 className="h-4 w-4" />
          <AlertDescription className="text-cyan-800 dark:text-cyan-200">
            <strong>Admin access is active!</strong>
            {accessExpiresAt && (
              <div className="text-sm mt-1">
                Expires: {new Date(accessExpiresAt).toLocaleString()}
              </div>
            )}
          </AlertDescription>
        </Alert>
        
        <div className="text-center space-y-4">
          <Shield className="w-16 h-16 text-green-500 mx-auto" />
          <h1 className="text-2xl font-bold">Admin Access Granted</h1>
          <p className="text-muted-foreground max-w-md mx-auto">
            Your admin access is currently active. You can access all admin features.
          </p>
          <Button 
            onClick={() => window.location.href = '/admin'}
          >
            Go to Admin Dashboard
          </Button>
        </div>
      </Container>
    );
  }

  return (
    <Container className='flex flex-col gap-6 py-8'>
      {/* Header */}
      <div className="text-center space-y-2">
        <Shield className="w-12 h-12 text-red-600 mx-auto" />
        <h1 className='text-3xl font-bold'>Admin Access Required</h1>
        <p className='text-muted-foreground max-w-2xl mx-auto'>
          To access admin features, you need to verify your identity. This additional security step 
          ensures only authorized administrators can access sensitive operations.
        </p>
      </div>

      {/* Step 1: Request Access Key */}
      <div className="border rounded-lg p-6 space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-red-600 text-white rounded-full flex items-center justify-center font-semibold">
            1
          </div>
          <h2 className='text-xl font-semibold'>Request Admin Access Key</h2>
        </div>
        
        <p className='text-sm text-muted-foreground ml-11'>
          Click the button below to request an admin access key. We'll send a secure code to your registered email address.
        </p>

        {emailSent && (
          <Alert className="ml-11 border-rose-200 bg-green-50 dark:bg-rose-950 dark:border-rose-800">
            <Mail className="h-4 w-4" />
            <AlertDescription className="text-rose-800 dark:text-rose-200">
              <strong>Email sent successfully!</strong> Check your inbox for the admin access key.
            </AlertDescription>
          </Alert>
        )}

        <div className="ml-11">
          <Button 
            disabled={isRequesting || countdown > 0} 
            onClick={handleRequestAccess} 
            variant="outline"
            className="w-full sm:w-auto"
          >
            {isRequesting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {countdown > 0 ? (
              <>
                <Clock className="mr-2 h-4 w-4" />
                Wait {countdown}s
              </>
            ) : (
              <>
                <Mail className="mr-2 h-4 w-4" />
                {emailSent ? 'Resend Access Key' : 'Send Access Key'}
              </>
            )}
          </Button>
        </div>
      </div>

      <Separator />

      {/* Step 2: Verify Access Key */}
      <div className="border rounded-lg p-6 space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-red-600 text-white rounded-full flex items-center justify-center font-semibold">
            2
          </div>
          <h2 className='text-xl font-semibold'>Verify Admin Access Key</h2>
        </div>
        
        <p className='text-sm text-muted-foreground ml-11'>
          Enter the 6-digit code sent to your email to verify your admin access.
        </p>

        <div className="ml-11">
          <AdminAccessVerifyKeyForm onSuccess={() => {
            refreshUser?.();
            refetchStatus();
          }} />
        </div>
      </div>

      <Separator />

      {/* Help Section */}
      <div className="text-center space-y-2">
        <h3 className="font-medium">Need Help?</h3>
        <p className='text-sm text-muted-foreground max-w-md mx-auto'>
          If you're experiencing issues with admin access verification, please contact our support team for assistance.
        </p>
      </div>
    </Container>
  );
}

export default RequestAdminAccess;