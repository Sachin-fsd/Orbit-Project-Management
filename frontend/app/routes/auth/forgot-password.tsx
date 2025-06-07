import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForgotPasswordMutation } from "@/hooks/use-auth";
import { forgotPasswordSchema } from "@/lib/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, CheckCircle, Loader2 } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router";
import { toast } from "sonner";
import type { z } from "zod";


type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

const ForgotPasswordPage = () => {
  const [isSuccess, setIsSuccess] = useState(false);
  const { mutate: forgotPassword, isPending } = useForgotPasswordMutation();
  const form = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: '',
    },
  });

  const onSubmit = (data: ForgotPasswordFormData) => {
    forgotPassword(data, {
      onSuccess: () => {
        toast.success("Password reset link sent to your email");
        console.log("Password reset link sent to your email");
        setIsSuccess(true);
      },
      onError: (error: any) => {
        console.log(error);
        toast.error(error?.response?.data?.message || "Failed to reset password");
      },
    });
  }
  return (
    <div className="flex flex-col min-h-screen w-screen items-center justify-center bg-muted/40 p-4">
      <div className="w-full max-w-md space-y-6">

        <div className="flex flex-col items-center justify-center space-y-2">
          <h1 className="text-3xl font-bold">Forgot Password</h1>
          <p className="text-sm text-muted-foreground">Please enter email to reset your password</p>
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
                  <CheckCircle className="text-green-500"/>
                  <h1 className="text-3xl font-bold">Password Reset Email Sent</h1>
                  <p className="text-sm text-muted-foreground">Check your email to reset your password</p>
                </div>
              ) : (
                <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="after:content-['*'] after:text-red-500" >Email</FormLabel>
                        <FormControl>
                          <Input placeholder="Email" {...field} />
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

export default ForgotPasswordPage;
