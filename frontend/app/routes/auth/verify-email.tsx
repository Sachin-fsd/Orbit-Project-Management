import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router";
import { ArrowLeft, CheckCircle, Loader, XCircle } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useVerifyEmailMutation } from "@/hooks/use-auth";
import { toast } from "sonner";
import { useTheme } from "@/provider/theme-context";

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const [isSuccess, setIsSuccess] = useState(false);
  const { mutate, isPending: isVerifying } = useVerifyEmailMutation();
  const { theme } = useTheme();

  useEffect(() => {
    const token = searchParams.get("token");
    if (token) {
      mutate(
        { token },
        {
          onSuccess: () => {
            setIsSuccess(true);
          },
          onError: (error: any) => {
            const errorMessage = error.response?.data?.message || "Failed to verify email";
            setIsSuccess(false);
            toast.error(errorMessage);
          },
          onSettled: () => {
            searchParams.delete("token");
          },
        }
      );
    } else {
      setIsSuccess(false);
    }
    // eslint-disable-next-line
  }, [searchParams]);

  return (
    <div
      className={`flex flex-col items-center justify-center min-h-screen transition-colors duration-300 ${
        theme === "dark"
          ? "bg-gradient-to-br from-gray-900 via-gray-800 to-indigo-950"
          : "bg-gradient-to-br from-indigo-50 via-white to-blue-100"
      }`}
    >
      <Card
        className={`w-full max-w-md shadow-xl rounded-xl border-0 ${
          theme === "dark"
            ? "bg-gray-900 text-gray-100"
            : "bg-white/90 text-indigo-900"
        }`}
      >
        <CardHeader className="flex flex-col items-center gap-2">
          <Link
            to="/sign-in"
            className={`flex items-center gap-2 text-sm font-medium transition-colors ${
              theme === "dark"
                ? "text-indigo-300 hover:text-indigo-400"
                : "text-indigo-700 hover:text-indigo-900"
            }`}
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Sign In
          </Link>
        </CardHeader>
        <CardContent className="flex flex-col items-center gap-4 py-8">
          <h1 className="text-2xl font-bold mb-2 tracking-tight font-[Inter]">
            Verify Email
          </h1>
          <p className="mb-4 text-sm text-muted-foreground">
            {isVerifying
              ? "Verifying your email..."
              : "Please verify your email to continue."}
          </p>
          <div className="flex flex-col items-center gap-3 w-full">
            {isVerifying ? (
              <>
                <Loader className="animate-spin text-indigo-500 w-10 h-10 mb-2" />
                <h3 className="font-semibold text-lg">Verifying Email</h3>
                <p className="text-sm text-muted-foreground">Please wait a moment.</p>
              </>
            ) : isSuccess ? (
              <>
                <CheckCircle className="text-green-500 w-12 h-12 mb-2" />
                <h3 className="font-semibold text-lg">Email Verified</h3>
                <p className="text-sm text-muted-foreground">
                  Your email has been verified successfully.
                </p>
                <Link to="/sign-in" className="w-full">
                  <Button className="w-full bg-indigo-600 text-white hover:bg-indigo-700 transition-all">
                    Back to Sign in
                  </Button>
                </Link>
              </>
            ) : (
              <>
                <XCircle className="text-red-500 w-12 h-12 mb-2" />
                <h3 className="font-semibold text-lg">Verification Failed</h3>
                <p className="text-sm text-muted-foreground">
                  Failed to verify your email. Please try again.
                </p>
                <Link to="/sign-in" className="w-full">
                  <Button className="w-full bg-indigo-600 text-white hover:bg-indigo-700 transition-all">
                    Back to Sign in
                  </Button>
                </Link>
              </>
            )}
          </div>
        </CardContent>
      </Card>
      <style>
        {`
          .text-muted-foreground {
            color: ${theme === "dark" ? "#a3a3b3" : "#64748b"};
          }
        `}
      </style>
    </div>
  );
};

export default VerifyEmail;