import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router";
import { ArrowLeft, CheckCircle, Loader, XCircle } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useVerifyEmailMutation } from "@/hooks/use-auth";
import { toast } from "sonner";

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const [isSuccess, setIsSuccess] = useState(false);
  const {mutate, isPending: isVerifying} = useVerifyEmailMutation();

  useEffect(() => {
    const token = searchParams.get("token");
    if (token) {
      mutate({token}, {
        onSuccess: () => {
          setIsSuccess(true);
        },
        onError: (error:any) => {
          const errorMessage = error.response?.data?.message || "Failed to verify email";
          console.log(error)
          setIsSuccess(false);
          toast.error(errorMessage)
        },
        onSettled: () => {
          // Reset the token to avoid re-verification
          searchParams.delete("token");
        },
      })
    }
    else {
      setIsSuccess(false);
    }
  }, [searchParams]);
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1>Verify Email</h1>
      <p>Verifying your Email</p>
      <Card>
        <CardHeader>
          <Link to="/sign-in">
            <ArrowLeft />
            Back to Sign In
          </Link>
        </CardHeader>
        <CardContent>
          <div>
            {isVerifying ?
              <>
                <Loader />
                <h3>Verifying Email</h3>
                <p>Please wait a moment.</p>
              </> : isSuccess ? (
                <>
                  <CheckCircle />
                  <h3>Email Verified</h3>
                  <p>Your email has been verified successfully.</p>
                  <Link to="/sign-in">
                    <Button>Back to Sign in</Button>
                  </Link>
                </>
              ) : (
                <>
                  <XCircle />
                  <h3>Verification Failed</h3>
                  <p>Failed to verify your email. Please try again.</p>
                  <Link to="/sign-in">
                    <Button>Back to Sign in</Button>
                  </Link>
                </>
              )}
            {isVerifying && <p>Please wait...</p>}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default VerifyEmail;
// This file is part of Orbit, a web application for managing personal projects.