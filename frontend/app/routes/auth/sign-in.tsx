import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { signInSchema } from "@/lib/schema";
import { Card, CardContent, CardDescription, CardFooter, CardTitle } from "@/components/ui/card";
import { Link, useNavigate } from "react-router";
import { useLoginMutation } from "@/hooks/use-auth";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/provider/auth-context";

type SigninFormData = z.infer<typeof signInSchema>;

const SignInPage = () => {
  const navigate = useNavigate();
  const form = useForm<SigninFormData>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const { mutate, isPending } = useLoginMutation();
  const { login } = useAuth();

  const handleOnSubmit = (values: SigninFormData) => {
    mutate(values, {
      onSuccess: (data) => {
        form.reset();
        login(data)
        toast.success("Successfully logged in");
        navigate("/dashboard");
      },
      onError: (error: any) => {
        console.log(error);
        toast.error(error?.response?.data?.message || "Failed to login");
      },
    });
  };

  return (
    <div className="flex flex-col min-h-screen w-screen items-center justify-center bg-muted/40 p-4 bg-neutral-800" >
      <Card className="w-full max-w-md p-6">
        <CardTitle className="text-2xl font-bold">Welcome Back</CardTitle>
        <CardDescription>Please enter your credentials to sign in.</CardDescription>
        <CardContent>
          <form onSubmit={form.handleSubmit(handleOnSubmit)} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-1">Email</label>
              <input
                id="email"
                type="email"
                {...form.register("email")}
                className="w-full p-2 border rounded"
              />
              {form.formState.errors.email && (
                <p className="text-red-500 text-sm mt-1">{form.formState.errors.email.message}</p>
              )}
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium mb-1">Password</label>
              <input
                id="password"
                type="password"
                {...form.register("password")}
                className="w-full p-2 border rounded"
              />
              <Link to="/forgot-password" className="text-sm text-blue-500 hover:underline">Forgot Password</Link>
              {form.formState.errors.password && (
                <p className="text-red-500 text-sm mt-1">{form.formState.errors.password.message}</p>
              )}
            </div>
            <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600" disabled={isPending}>
              {isPending ? <Loader2 className="animate-spin" /> : "Sign In"}
            </button>
          </form>
          <CardFooter>
            <p className="text-sm text-center mt-4">
              Don't have an account? <Link to="/sign-up" className="text-blue-500 hover:underline">Sign Up</Link>
            </p>
          </CardFooter>
        </CardContent>
      </Card>
    </div>
  );
};

export default SignInPage;
