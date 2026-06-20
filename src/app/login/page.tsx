
"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Globe, 
  Lock, 
  Mail, 
  ArrowRight, 
  ShieldCheck, 
  Phone, 
  Eye, 
  EyeOff,
  AlertCircle,
  ExternalLink
} from "lucide-react";
import { useAuth } from "@/firebase";
import { 
  signInWithEmailAndPassword, 
  GoogleAuthProvider, 
  signInWithPopup, 
  sendPasswordResetEmail 
} from "firebase/auth";
import { useToast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { isConfigValid } from "@/firebase/config";

export default function LoginPage() {
  const router = useRouter();
  const auth = useAuth();
  const { toast } = useToast();
  
  const [loading, setLoading] = React.useState(false);
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [showPassword, setShowPassword] = React.useState(false);
  const [isRegistrationAlertOpen, setIsRegistrationAlertOpen] = React.useState(false);

  const handleAuthError = (error: any) => {
    if (error.code === 'auth/popup-closed-by-user' || error.code === 'auth/cancelled-popup-request') {
      return;
    }

    let title = "Authentication Failed";
    let message = error.message || "Please check your credentials and try again.";

    if (error.code === 'auth/unauthorized-domain') {
      title = "Unauthorized Domain";
      message = "This domain is not authorized for Firebase Auth. Go to Firebase Console -> Authentication -> Settings -> Authorized Domains and add this domain.";
    } else if (error.code === 'auth/api-keys-are-not-supported-by-this-api' || error.message?.includes('api-keys-are-not-supported')) {
      title = "API Configuration Error";
      message = "Identity Toolkit API is disabled. Enable Email/Password in Firebase Console -> Authentication.";
    } else if (error.code === 'auth/invalid-credential') {
      message = "Invalid email or password. Please try again.";
    }

    toast({
      variant: "destructive",
      title: title,
      description: message,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;

    if (!isConfigValid) {
      toast({
        variant: "destructive",
        title: "Configuration Error",
        description: "Firebase configuration is missing. Please set your environment variables.",
      });
      return;
    }

    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      // Redirect ke Beranda (Feed)
      router.push("/feed");
    } catch (error: any) {
      handleAuthError(error);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    if (!isConfigValid) return;
    const provider = new GoogleAuthProvider();
    setLoading(true);
    try {
      await signInWithPopup(auth, provider);
      // Redirect ke Beranda (Feed)
      router.push("/feed");
    } catch (error: any) {
      handleAuthError(error);
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      toast({
        variant: "destructive",
        title: "Email Required",
        description: "Please enter your business email first to reset your password.",
      });
      return;
    }

    try {
      await sendPasswordResetEmail(auth, email);
      toast({
        title: "Reset Link Sent",
        description: "A password reset link has been dispatched to your email address.",
      });
    } catch (error: any) {
      handleAuthError(error);
    }
  };

  const handlePhoneLoginPlaceholder = () => {
    toast({
      title: "Security Update",
      description: "Mobile OTP authentication is being provisioned for your region.",
    });
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#F8FAFC] p-4 font-body">
      <div className="max-w-md w-full space-y-10">
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center size-16 rounded-2xl bg-accent text-white font-black text-4xl shadow-2xl shadow-indigo-200 mb-2 transform transition-transform hover:rotate-6 select-none">
            O
          </div>
          <div className="space-y-1">
            <h1 className="text-4xl font-black text-slate-900 tracking-tight leading-none">OnTapp</h1>
            <p className="text-slate-500 font-semibold text-lg tracking-tight">Enterprise Discovery Network</p>
          </div>
        </div>

        {!isConfigValid && (
          <div className="bg-amber-50 border border-amber-200 p-6 rounded-2xl flex flex-col gap-3 text-amber-800 text-sm font-medium shadow-sm">
            <div className="flex gap-3 items-center">
              <AlertCircle className="size-5 shrink-0 text-amber-600" />
              <p className="font-bold">Missing Firebase Configuration</p>
            </div>
            <p className="text-xs text-amber-700 leading-relaxed">
              Firebase API Key or Project ID is not set. Please ensure your <code className="bg-amber-100 px-1 rounded">.env</code> file or Project Settings include the necessary Firebase keys.
            </p>
          </div>
        )}

        <Card className="border-none shadow-2xl rounded-[2.5rem] overflow-hidden bg-white">
          <CardHeader className="p-10 pb-4">
            <div className="flex items-center gap-2 text-accent font-black text-[10px] uppercase tracking-widest mb-2">
              <ShieldCheck className="size-3" />
              Secure Gateway
            </div>
            <CardTitle className="text-3xl font-black text-slate-900 tracking-tight">Login</CardTitle>
            <CardDescription className="font-medium text-slate-500 text-base">
              Enter your credentials to manage your business ecosystem.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-10 pt-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email" className="font-bold text-slate-700 ml-1 text-sm">Business Email</Label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                  <input 
                    id="email" 
                    type="email" 
                    placeholder="name@company.com" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required 
                    className="flex h-14 w-full pl-12 rounded-2xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:ring-2 focus:ring-accent/10 focus:outline-none transition-all font-medium text-sm px-3"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-center ml-1">
                  <Label htmlFor="password" className="font-bold text-slate-700 text-sm">Password</Label>
                  <button 
                    type="button" 
                    onClick={handleForgotPassword}
                    className="text-xs font-black text-accent hover:text-indigo-700 transition-colors uppercase tracking-wider"
                  >
                    Forgot Key?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                  <input 
                    id="password" 
                    type={showPassword ? "text" : "password"} 
                    placeholder="••••••••" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required 
                    className="flex h-14 w-full pl-12 pr-12 rounded-2xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:ring-2 focus:ring-accent/10 focus:outline-none transition-all font-medium text-sm px-3"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    {showPassword ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
                  </button>
                </div>
              </div>
              <div className="space-y-4 pt-2">
                <Button 
                  type="submit" 
                  disabled={loading || !isConfigValid}
                  className="w-full h-14 rounded-2xl bg-accent hover:bg-indigo-600 text-white font-black text-lg shadow-xl shadow-indigo-100 transition-all active:scale-[0.98] group relative overflow-hidden"
                >
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    {loading ? "Verifying..." : "Authorize Login"}
                    {!loading && <ArrowRight className="size-5 group-hover:translate-x-1 transition-transform" />}
                  </span>
                </Button>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-slate-100" />
                  </div>
                  <div className="relative flex justify-center text-[10px] uppercase font-black text-slate-400 tracking-widest">
                    <span className="bg-white px-4">Alternative Secure Access</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <Button 
                    type="button"
                    variant="outline"
                    className="h-14 rounded-2xl border-slate-200 hover:bg-slate-50 font-bold flex gap-2"
                    onClick={handleGoogleSignIn}
                    disabled={loading || !isConfigValid}
                  >
                    <svg className="size-5" viewBox="0 0 24 24">
                      <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
                      <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    Google
                  </Button>
                  <Button 
                    type="button"
                    variant="outline"
                    className="h-14 rounded-2xl border-slate-200 hover:bg-slate-50 font-bold flex gap-2"
                    onClick={handlePhoneLoginPlaceholder}
                    disabled={loading || !isConfigValid}
                  >
                    <Phone className="size-4" />
                    Phone
                  </Button>
                </div>
              </div>
            </form>
          </CardContent>
          <CardFooter className="bg-slate-50/50 p-8 border-t border-slate-100 flex flex-col gap-4 text-center">
            <p className="text-sm font-bold text-slate-500">
              New to the ecosystem? 
              <button 
                onClick={() => setIsRegistrationAlertOpen(true)}
                className="text-accent font-black hover:text-indigo-700 transition-colors ml-1 uppercase tracking-tight text-xs"
              >
                Request Access
              </button>
            </p>
            {!isConfigValid && (
              <a 
                href="https://console.firebase.google.com/" 
                target="_blank" 
                rel="noreferrer"
                className="text-[10px] text-slate-400 hover:text-accent font-bold flex items-center justify-center gap-1 uppercase tracking-wider"
              >
                Open Firebase Console <ExternalLink className="size-2.5" />
              </a>
            )}
          </CardFooter>
        </Card>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-2">
          <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
            <Globe className="size-3.5" />
            Global Reach
          </div>
          <div className="hidden sm:block w-1.5 h-1.5 bg-slate-300 rounded-full" />
          <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
            <ShieldCheck className="size-3.5" />
            Enterprise Grade
          </div>
        </div>
      </div>

      <AlertDialog open={isRegistrationAlertOpen} onOpenChange={setIsRegistrationAlertOpen}>
        <AlertDialogContent className="rounded-[2rem] border-none shadow-2xl">
          <AlertDialogHeader>
            <div className="size-12 bg-indigo-50 text-accent rounded-xl flex items-center justify-center mb-2">
              <AlertCircle className="size-6" />
            </div>
            <AlertDialogTitle className="text-2xl font-black text-slate-900 tracking-tight">Registration Closed</AlertDialogTitle>
            <AlertDialogDescription className="text-slate-500 font-medium text-base">
              The OnTapp network is currently operating on a private beta invitation basis. We are not accepting new public registration requests at this time.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction className="bg-accent hover:bg-indigo-600 rounded-xl font-bold px-8">
              Acknowledge
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
