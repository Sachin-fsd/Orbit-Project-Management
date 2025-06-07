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
  const navigate = useNavigate()
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const form = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',

    },
  });
  const passwordValue = form.watch("password");
  const passwordsMatch = confirmPassword === passwordValue;

  const { mutate, isPending } = useSignUpMutation();

  const handleOnSubmit = (values: SignUpFormData) => {
    console.log("Form submitted with values:", values);
    mutate(values, {
      onSuccess: () => {
        toast.success("Email Verification required!",{
          description: "Please check your email for a verificatin link. If you dont see it check your spam folder."
        });
        form.reset();
        setConfirmPassword("");
        navigate("/sign-in")
      },
      onError: (error: any) => {
        toast.error(error?.response?.data?.message || "Failed to create account");
      },
    });
  }

  return (
    <div className="flex flex-col min-h-screen w-screen items-center justify-center bg-muted/40 p-4" >
      <Card className="w-full max-w-md p-6">
        <CardTitle className="text-2xl font-bold">Create an Account</CardTitle>
        <CardDescription>Please enter your details to sign up.</CardDescription>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleOnSubmit)} className="space-y-4">
              <div>
                <Label htmlFor="name" className="block text-sm font-medium mb-1">Full Name</Label>
                <Input
                  id="name"
                  type="text"
                  {...form.register("name")}
                  className="w-full p-2 border rounded"
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
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                />
                {confirmPassword && !passwordsMatch && (
                  <p className="text-red-500 text-sm mt-1">Should match with Password</p>
                )}
              </div>
              <Button disabled={!passwordsMatch || isPending} type="submit" className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600">
                {isPending ? "Signing up..." : "Sign Up"}
              </Button>
            </form>
          </Form>

          <CardFooter>
            <p className="text-sm text-center mt-4">
              Already have an account? <Link to="/sign-in" className="text-blue-500 hover:underline">Sign In</Link>
            </p>
          </CardFooter>
        </CardContent>
      </Card>
    </div>
  );
};

export default SignUp;
