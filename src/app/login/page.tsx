
"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Globe, Lock, Mail, ArrowRight, ShieldCheck, Phone } from "lucide-react";
import { useAuth } from "@/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useToast } from "@/hooks/use-toast";

export default function LoginPage() {
  const router = useRouter();
  const auth = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = React.useState(false);
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push("/dashboard");
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Authentication Failed",
        description: error.message || "Please check your credentials and try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#F8FAFC] p-4 font-body">
      <div className="max-w-md w-full space-y-10">
        {/* Branding Section */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center size-16 rounded-2xl bg-accent text-white font-black text-4xl shadow-2xl shadow-indigo-200 mb-2 transform transition-transform hover:rotate-6">
            O
          </div>
          <div className="space-y-1">
            <h1 className="text-4xl font-black text-slate-900 tracking-tight leading-none">OnTapp</h1>
            <p className="text-slate-500 font-semibold text-lg tracking-tight">Enterprise Discovery Network</p>
          </div>
        </div>

        {/* Login Card */}
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
                  <Input 
                    id="email" 
                    type="email" 
                    placeholder="name@company.com" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required 
                    className="h-14 pl-12 rounded-2xl border-slate-200 bg-slate-50/50 focus:bg-white focus:ring-accent/10 transition-all font-medium"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-center ml-1">
                  <Label htmlFor="password" className="font-bold text-slate-700 text-sm">Password</Label>
                  <button type="button" className="text-xs font-black text-accent hover:text-indigo-700 transition-colors uppercase tracking-wider">
                    Forgot Key?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                  <Input 
                    id="password" 
                    type="password" 
                    placeholder="••••••••" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required 
                    className="h-14 pl-12 rounded-2xl border-slate-200 bg-slate-50/50 focus:bg-white focus:ring-accent/10 transition-all font-medium"
                  />
                </div>
              </div>
              <div className="space-y-4 pt-2">
                <Button 
                  type="submit" 
                  disabled={loading}
                  className="w-full h-14 rounded-2xl bg-accent hover:bg-indigo-600 text-white font-black text-lg shadow-xl shadow-indigo-100 transition-all active:scale-[0.98] group relative overflow-hidden"
                >
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    {loading ? "Verifying..." : "Authorize Login"}
                    {!loading && <ArrowRight className="size-5 group-hover:translate-x-1 transition-transform" />}
                  </span>
                  {loading && (
                    <div className="absolute inset-0 bg-indigo-600/50 animate-pulse" />
                  )}
                </Button>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-slate-100" />
                  </div>
                  <div className="relative flex justify-center text-[10px] uppercase font-black text-slate-400 tracking-widest">
                    <span className="bg-white px-4">Alternative Secure Access</span>
                  </div>
                </div>

                <Button 
                  type="button"
                  variant="outline"
                  className="w-full h-14 rounded-2xl border-slate-200 hover:bg-slate-50 font-bold flex gap-2"
                  onClick={() => {
                    toast({
                      title: "Feature coming soon",
                      description: "Mobile OTP authentication is being provisioned for your region.",
                    });
                  }}
                >
                  <Phone className="size-4" />
                  Sign in with Phone
                </Button>
              </div>
            </form>
          </CardContent>
          <CardFooter className="bg-slate-50/50 p-8 border-t border-slate-100 flex flex-col gap-4">
            <p className="text-sm font-bold text-slate-500 text-center">
              New to the ecosystem? 
              <button className="text-accent font-black hover:text-indigo-700 transition-colors ml-1 uppercase tracking-tight text-xs">
                Request Access
              </button>
            </p>
          </CardFooter>
        </Card>

        {/* Footer Badges */}
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
    </div>
  );
}
