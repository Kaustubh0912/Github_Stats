"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Github, ArrowLeft, Info } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { signIn, useSession } from "next-auth/react";
import { AuthError } from "@/components/auth-error";

export default function SignIn() {
  const { data: session, status } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const router = useRouter();

  // Check for error parameters in the URL
  useEffect(() => {
    if (typeof window !== "undefined") {
      const url = new URL(window.location.href);
      const error = url.searchParams.get("error");
      if (error) {
        let errorMessage = "An error occurred during authentication";

        // Map error codes to user-friendly messages
        if (error === "AccessDenied") {
          errorMessage =
            "Access was denied. Please make sure you grant the necessary permissions.";
        } else if (error === "Configuration") {
          errorMessage =
            "There is a problem with the GitHub OAuth configuration. Please check your environment variables.";
        } else if (error === "OAuthSignin") {
          errorMessage =
            "Error during GitHub OAuth sign-in process. Please try again.";
        } else if (error === "OAuthCallback") {
          errorMessage =
            "Error during GitHub OAuth callback. Please try again.";
        } else if (error === "OAuthCreateAccount") {
          errorMessage = "Error creating GitHub account. Please try again.";
        } else if (error === "Callback") {
          errorMessage =
            "Error during authentication callback. Please try again.";
        } else if (error === "OAuthAccountNotLinked") {
          errorMessage =
            "This email is already associated with another account.";
        } else {
          errorMessage = `Authentication error: ${error}. Please try again.`;
        }

        setAuthError(errorMessage);
      }
    }
  }, []);

  useEffect(() => {
    if (session?.user) {
      router.push("/dashboard");
    }
  }, [session, router]);

  const handleSignIn = async () => {
    setIsLoading(true);
    setAuthError(null);
    try {
      await signIn("github", { callbackUrl: "/dashboard" });
    } catch (error) {
      console.error("Sign in error:", error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to sign in with GitHub. Please try again.";

      setAuthError(errorMessage);
      setIsLoading(false);
    }
  };

  if (session?.user) {
    return null;
  }

  if (authError) {
    return <AuthError error={authError} onRetry={handleSignIn} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800 flex items-center justify-center p-4 sm:p-6">
      {/* Background Texture */}
      <div className="fixed inset-0 opacity-20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(0,0,0,0.15)_1px,transparent_0)] bg-[length:24px_24px]" />
        <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_35%,rgba(255,255,255,0.1)_50%,transparent_65%)] bg-[length:24px_24px]" />
      </div>

      <div className="w-full max-w-md space-y-4 sm:space-y-6">
        <Alert className="bg-blue-50 dark:bg-blue-950/50 border-blue-200 dark:border-blue-900">
          <Info className="h-4 w-4 text-blue-600 dark:text-blue-400" />
          <AlertTitle className="text-blue-600 dark:text-blue-400">
            GitHub OAuth Setup Required
          </AlertTitle>
          <AlertDescription className="text-blue-700 dark:text-blue-300">
            To enable GitHub authentication, you need to:
            <ol className="list-decimal pl-5 mt-2 space-y-1 text-sm">
              <li>
                Create a GitHub OAuth App at{" "}
                <a
                  href="https://github.com/settings/developers"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline"
                >
                  GitHub Developer Settings
                </a>
              </li>
              <li>
                Set the Authorization callback URL to:{" "}
                <code className="bg-blue-100 dark:bg-blue-900/50 px-2 py-0.5 rounded text-xs break-all">
                  {process.env.NEXT_PUBLIC_NEXTAUTH_URL}
                  /api/auth/callback/github
                </code>
              </li>
              <li>
                Copy the Client ID and Client Secret to your{" "}
                <code className="bg-blue-100 dark:bg-blue-900/50 px-2 py-0.5 rounded">
                  .env
                </code>{" "}
                file
              </li>
            </ol>
          </AlertDescription>
        </Alert>

        <Card className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50 rounded-3xl shadow-2xl">
          <CardHeader className="text-center pb-6 sm:pb-8">
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-4">
              <Github className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
            </div>
            <CardTitle className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
              Welcome to GitFrame
            </CardTitle>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 mt-2">
              Sign in to access your personalized dashboard
            </p>
          </CardHeader>
          <CardContent className="space-y-4 sm:space-y-6 p-4 sm:p-6">
            <Button
              onClick={handleSignIn}
              disabled={isLoading || status === "loading"}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white py-3 text-base sm:text-lg disabled:opacity-50"
              size="lg"
            >
              {isLoading || status === "loading" ? (
                <div className="w-4 h-4 sm:w-5 sm:h-5 mr-3 animate-spin rounded-full border-2 border-white border-t-transparent" />
              ) : (
                <Github className="w-4 h-4 sm:w-5 sm:h-5 mr-3" />
              )}
              {isLoading || status === "loading"
                ? "Signing in..."
                : "Continue with GitHub"}
            </Button>

            <div className="text-center">
              <Link
                href="/"
                className="inline-flex items-center text-sm text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors"
              >
                <ArrowLeft className="w-4 h-4 mr-1" />
                Back to home
              </Link>
            </div>

            <div className="text-xs text-slate-500 dark:text-slate-400 text-center leading-relaxed">
              By signing in, you agree to our Terms of Service and Privacy
              Policy.
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
