import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { signUpSchema } from "@/lib/schema";
import { Card, CardContent, CardDescription, CardFooter, CardTitle } from "@/components/ui/card";
import { Link, useNavigate } from "react-router";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useSignUpMutation } from "@/hooks/use-auth";
import { toast } from "sonner";

export type SignUpFormData = z.infer<typeof signUpSchema>;

const SignUp = () => {
  const navigate = useNavigate();
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const form = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });
  const passwordValue = form.watch("password");
  const passwordsMatch = confirmPassword === passwordValue;
  const { mutate, isPending } = useSignUpMutation();

  const handleOnSubmit = (values: SignUpFormData) => {
    mutate(values, {
      onSuccess: () => {
        toast.success("Email Verification required!", {
          description: "Please check your email for a verification link. If you don't see it, check your spam folder.",
        });
        form.reset();
        setConfirmPassword("");
        navigate("/sign-in");
      },
      onError: (error: any) => {
        toast.error(error?.response?.data?.message || "Failed to create account");
      },
    });
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gradient-to-br from-blue-50 via-white to-indigo-100">
      {/* Left: Animation & Welcome */}
      <div className="hidden md:flex flex-col justify-center items-center w-1/2 bg-gradient-to-br from-blue-100 to-indigo-200 p-10">
        <lottie-player
          src="https://assets2.lottiefiles.com/packages/lf20_kyu7xb1v.json"
          background="transparent"
          speed="1"
          style={{ width: "340px", height: "340px" }}
          loop
          autoplay
        ></lottie-player>
        <h2 className="text-3xl font-extrabold text-blue-700 mt-8 mb-2 text-center">
          Join Orbit and Supercharge Your Team!
        </h2>
        <p className="text-lg text-blue-900 text-center max-w-md">
          Create your free account and start managing projects, collaborating, and delivering results—smarter and faster.
        </p>
        <div className="mt-8 flex flex-wrap gap-4 justify-center">
          <div className="flex items-center gap-2 bg-white/80 rounded px-4 py-2 shadow">
            <span className="text-2xl">📊</span>
            <span className="font-medium text-blue-700">Agile Boards</span>
          </div>
          <div className="flex items-center gap-2 bg-white/80 rounded px-4 py-2 shadow">
            <span className="text-2xl">🤝</span>
            <span className="font-medium text-blue-700">Team Collaboration</span>
          </div>
          <div className="flex items-center gap-2 bg-white/80 rounded px-4 py-2 shadow">
            <span className="text-2xl">⚡</span>
            <span className="font-medium text-blue-700">Real-Time Updates</span>
          </div>
        </div>
      </div>

      {/* Right: Sign Up Form */}
      <div className="flex flex-1 items-center justify-center py-12 px-4">
        <Card className="w-full max-w-md shadow-2xl border-0 bg-white/90">
          <CardTitle className="text-3xl font-bold text-center mt-6 mb-2 text-blue-700">
            Create your Orbit Account
          </CardTitle>
          <CardDescription className="text-center mb-4 text-gray-500">
            Sign up to get started. It's free!
          </CardDescription>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleOnSubmit)} className="space-y-5">
                <div>
                  <Label htmlFor="name" className="block text-sm font-medium mb-1">Full Name</Label>
                  <Input
                    id="name"
                    type="text"
                    {...form.register("name")}
                    className="w-full p-2 border rounded"
                    placeholder="Enter your full name"
                  />
                  {form.formState.errors.name && (
                    <p className="text-red-500 text-sm mt-1">{form.formState.errors.name.message}</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="email" className="block text-sm font-medium mb-1">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    {...form.register("email")}
                    className="w-full p-2 border rounded"
                    placeholder="you@email.com"
                  />
                  {form.formState.errors.email && (
                    <p className="text-red-500 text-sm mt-1">{form.formState.errors.email.message}</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="password" className="block text-sm font-medium mb-1">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    {...form.register("password")}
                    className="w-full p-2 border rounded"
                    placeholder="Create a password"
                  />
                  {form.formState.errors.password && (
                    <p className="text-red-500 text-sm mt-1">{form.formState.errors.password.message}</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="confirmPassword" className="block text-sm font-medium mb-1">Confirm Password</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    className="w-full p-2 border rounded"
                    placeholder="Re-enter your password"
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                  />
                  {confirmPassword && !passwordsMatch && (
                    <p className="text-red-500 text-sm mt-1">Should match with Password</p>
                  )}
                </div>
                <Button
                  disabled={!passwordsMatch || isPending}
                  type="submit"
                  className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
                >
                  {isPending ? "Signing up..." : "Sign Up"}
                </Button>
              </form>
            </Form>
            <CardFooter>
              <p className="text-sm text-center mt-4">
                Already have an account?{" "}
                <Link to="/sign-in" className="text-blue-600 hover:underline font-medium">
                  Sign In
                </Link>
              </p>
            </CardFooter>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SignUp;