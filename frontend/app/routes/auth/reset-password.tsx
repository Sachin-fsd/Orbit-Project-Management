import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useResetPasswordMutation } from "@/hooks/use-auth";
import { resetPasswordSchema } from "@/lib/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, CheckCircle, Eye, Loader2 } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useSearchParams } from "react-router";
import { toast } from "sonner";
import { z } from "zod";

type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

const ResetPassword = () => {

  const [searchParams] = useSearchParams();
  const {mutate: resetPassword, isPending} = useResetPasswordMutation();

  const token = searchParams.get("token");

  if (!token) {
    throw new Error("No token provided");
  }
  const [isSuccess, setIsSuccess] = useState(false);

  const form = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      newPassword: '',
      confirmPassword: '',
    },
  });

  const onSubmit = (values: ResetPasswordFormData) => {
    if(!token){
      toast.error("No token provided");
      throw new Error("No token provided");
    }
    resetPassword({...values, token: token as string}, {
      onSuccess: () => {
        setIsSuccess(true);
      },
      onError: (error: any) => {
        console.log(error);
        toast.error(error?.response?.data?.message || "Failed to reset password");
      },
    });
  };

  return (
    <div className="flex flex-col min-h-screen w-screen items-center justify-center bg-slate-900 p-4">
      <div className="w-full max-w-md space-y-6">

        <div className="flex flex-col items-center justify-center space-y-2">
            <h1 className="text-3xl font-bold">Reset Password</h1>
            <p className="text-sm text-muted-foreground">Please enter your new password</p>
        </div>

        <Card>
          <CardHeader>
            <Link to="/sign-in" className="flex items-center gap-2">
              <ArrowLeft />
              <span>Back to Sign In</span>
            </Link>
          </CardHeader>
          <CardContent>
            {
              isSuccess ? (
                <div className="flex flex-col items-center justify-center space-y-2">
                  <CheckCircle />
                  <h1 className="text-3xl font-bold">Password reset successfully</h1>
                  <p className="text-sm text-muted-foreground">You can now sign in with your new password</p>
                </div>
              ) : (
                <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
                  <FormField
                    control={form.control}
                    name="newPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="after:content-['*'] after:text-red-500" >New Password</FormLabel>
                        <FormControl>
                          <Input type="password" placeholder="Enter New Password" {...field} />
                          {/* <Eye className="absolute right-2 top-2 cursor-pointer" onClick={() => } /> */}
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                  <FormField
                    control={form.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="after:content-['*'] after:text-red-500" >Confirm Password</FormLabel>
                        <FormControl>
                          <Input type="password" placeholder="Confirm Password" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                  <Button type="submit" className="btn btn-primary" disabled={isPending}>
                    {
                      isPending ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        "Reset Password"
                      )
                    }
                  </Button>
                </form>
              </Form>
              )
            }
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ResetPassword;
// This file is part of Orbit, a web application for managing personal projects.