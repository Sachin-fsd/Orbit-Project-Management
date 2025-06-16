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
import { useEffect } from "react";

// Add this to your public/index.html for Lottie support:
// <script src="https://unpkg.com/@lottiefiles/lottie-player@latest/dist/lottie-player.js"></script>

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
        login(data);
        toast.success("Successfully logged in");
        const workspaceId = localStorage.getItem("selectedWorkspaceId");
        if (workspaceId) {
          navigate(`/dashboard?workspaceId=${workspaceId}`);
        } else {
          navigate("/dashboard");
        }
      },
      onError: (error: any) => {
        toast.error(error?.response?.data?.message || "Failed to login");
      },
    });
  };

  // Optional: Add fade-in animation on mount
  useEffect(() => {
    document.body.style.background = "linear-gradient(135deg, #e0e7ff 0%, #f0fdfa 100%)";
    return () => {
      document.body.style.background = "";
    };
  }, []);

  return (
    <div className="flex min-h-screen w-screen items-center justify-center bg-gradient-to-br from-blue-50 via-white to-indigo-100 transition-all duration-700">
      {/* Left: Animation & Welcome */}
      <div className="hidden md:flex flex-col items-center justify-center w-1/2 h-full animate-fade-in">
        <lottie-player
          src="https://assets2.lottiefiles.com/packages/lf20_kyu7xb1v.json"
          background="transparent"
          speed="1"
          style={{ width: "340px", height: "340px" }}
          loop
          autoplay
        ></lottie-player>
        <h2 className="text-3xl font-extrabold text-blue-700 mt-8 mb-2 text-center drop-shadow">
          Welcome Back to Orbit!
        </h2>
        <p className="text-lg text-blue-900 text-center max-w-md">
          Your agile project management journey continues here.
        </p>
      </div>
      {/* Right: Sign In Form */}
      <div className="flex flex-1 items-center justify-center py-12 px-4 animate-fade-in">
        <Card className="w-full max-w-md p-6 shadow-2xl border-0 bg-white/90 backdrop-blur-md transition-all duration-500">
          <CardTitle className="text-2xl font-bold text-center text-blue-700 mb-2">Sign In to Orbit</CardTitle>
          <CardDescription className="text-center mb-4 text-gray-500">
            Please enter your credentials to sign in.
          </CardDescription>
          <CardContent>
            <form onSubmit={form.handleSubmit(handleOnSubmit)} className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-1 text-blue-700">Email</label>
                <input
                  id="email"
                  type="email"
                  {...form.register("email")}
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-200 transition"
                  autoComplete="email"
                />
                {form.formState.errors.email && (
                  <p className="text-red-500 text-sm mt-1">{form.formState.errors.email.message}</p>
                )}
              </div>
              <div>
                <label htmlFor="password" className="block text-sm font-medium mb-1 text-blue-700">Password</label>
                <input
                  id="password"
                  type="password"
                  {...form.register("password")}
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-200 transition"
                  autoComplete="current-password"
                />
                <div className="flex justify-end">
                  <Link to="/forgot-password" className="text-sm text-blue-500 hover:underline mt-1">Forgot Password?</Link>
                </div>
                {form.formState.errors.password && (
                  <p className="text-red-500 text-sm mt-1">{form.formState.errors.password.message}</p>
                )}
              </div>
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-2 rounded shadow-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 font-semibold flex items-center justify-center gap-2"
                disabled={isPending}
              >
                {isPending ? <Loader2 className="animate-spin" /> : "Sign In"}
              </button>
            </form>
            <CardFooter>
              <p className="text-sm text-center mt-4">
                Don't have an account?{" "}
                <Link to="/sign-up" className="text-blue-600 hover:underline font-medium">
                  Sign Up
                </Link>
              </p>
            </CardFooter>
          </CardContent>
        </Card>
      </div>
      <style>
        {`
          .animate-fade-in {
            animation: fadeIn 1s ease;
          }
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(30px);}
            to { opacity: 1; transform: translateY(0);}
          }
        `}
      </style>
    </div>
  );
};

export default SignInPage;