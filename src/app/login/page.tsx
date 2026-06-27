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
import { TappLogo } from "@/components/ui/tapp-logo";

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

    let title = "Autentikasi Gagal";
    let message = error.message || "Silakan periksa kredensial Anda.";

    if (error.code === 'auth/unauthorized-domain') {
      title = "Domain Tidak Diizinkan";
      message = "Domain ini belum diotorisasi di konsol Firebase.";
    } else if (error.code === 'auth/invalid-credential') {
      message = "Email atau password salah. Silakan coba lagi.";
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
        title: "Kesalahan Konfigurasi",
        description: "Konfigurasi Firebase belum diatur dengan benar.",
      });
      return;
    }

    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
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
        title: "Email Diperlukan",
        description: "Masukkan email bisnis Anda untuk mengatur ulang password.",
      });
      return;
    }

    try {
      await sendPasswordResetEmail(auth, email);
      toast({
        title: "Tautan Terkirim",
        description: "Tautan pengaturan ulang password telah dikirim ke email Anda.",
      });
    } catch (error: any) {
      handleAuthError(error);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#FDFDFD] p-6 font-body">
      <div className="max-w-md w-full space-y-12">
        <div className="text-center space-y-4">
          <TappLogo className="size-24 rounded-[2rem] shadow-2xl shadow-primary/20 mb-2 mx-auto transform transition-all hover:scale-110" />
          <div className="space-y-1.5">
            <h1 className="text-5xl font-black text-slate-900 tracking-tight leading-none">Koolink</h1>
            <p className="text-slate-500 font-bold text-xl tracking-tight">Business Discovery Network</p>
          </div>
        </div>

        <Card className="border-none shadow-[0_32px_64px_-12px_rgba(0,0,0,0.08)] rounded-[2.5rem] overflow-hidden bg-white">
          <CardHeader className="p-10 pb-4">
            <div className="flex items-center gap-2 text-primary font-black text-[11px] uppercase tracking-widest mb-3">
              <ShieldCheck className="size-4" />
              Secure Business Access
            </div>
            <CardTitle className="text-3xl font-black text-slate-900 tracking-tight">Login</CardTitle>
            <CardDescription className="font-medium text-slate-500 text-lg">
              Kelola ekosistem bisnis Anda dengan aman.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-10 pt-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2.5">
                <Label htmlFor="email" className="font-bold text-slate-700 ml-1 text-sm">Email Bisnis</Label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-slate-400" />
                  <input 
                    id="email" 
                    type="email" 
                    placeholder="nama@perusahaan.com" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required 
                    className="flex h-14 w-full pl-12 rounded-2xl border border-slate-100 bg-slate-50/50 focus:bg-white focus:ring-4 focus:ring-primary/5 focus:border-primary/30 focus:outline-none transition-all font-medium text-[15px] px-3 shadow-inner"
                  />
                </div>
              </div>
              <div className="space-y-2.5">
                <div className="flex justify-between items-center ml-1">
                  <Label htmlFor="password" className="font-bold text-slate-700 text-sm">Password</Label>
                  <button 
                    type="button" 
                    onClick={handleForgotPassword}
                    className="text-xs font-black text-primary hover:opacity-80 transition-all uppercase tracking-wider"
                  >
                    Lupa Kunci?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-slate-400" />
                  <input 
                    id="password" 
                    type={showPassword ? "text" : "password"} 
                    placeholder="••••••••" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required 
                    className="flex h-14 w-full pl-12 pr-12 rounded-2xl border border-slate-100 bg-slate-50/50 focus:bg-white focus:ring-4 focus:ring-primary/5 focus:border-primary/30 focus:outline-none transition-all font-medium text-[15px] px-3 shadow-inner"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-primary transition-colors"
                  >
                    {showPassword ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
                  </button>
                </div>
              </div>
              <div className="space-y-5 pt-4">
                <Button 
                  type="submit" 
                  disabled={loading || !isConfigValid}
                  className="w-full h-15 rounded-2xl bg-primary hover:bg-primary/90 text-primary-foreground font-black text-lg shadow-xl shadow-primary/20 transition-all active:scale-[0.98] group relative overflow-hidden"
                >
                  <span className="relative z-10 flex items-center justify-center gap-3">
                    {loading ? "Memverifikasi..." : "Akses Jaringan"}
                    {!loading && <ArrowRight className="size-6 group-hover:translate-x-1 transition-transform" />}
                  </span>
                </Button>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-slate-100" />
                  </div>
                  <div className="relative flex justify-center text-[10px] uppercase font-black text-slate-400 tracking-widest">
                    <span className="bg-white px-5">Metode Alternatif</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <Button 
                    type="button"
                    variant="outline"
                    className="h-14 rounded-2xl border-slate-100 hover:bg-primary/5 hover:border-primary/30 font-bold flex gap-3 shadow-sm transition-all"
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
                    className="h-14 rounded-2xl border-slate-100 hover:bg-primary/5 hover:border-primary/30 font-bold flex gap-3 shadow-sm transition-all"
                    disabled={loading || !isConfigValid}
                  >
                    <Phone className="size-5 text-primary" />
                    Telepon
                  </Button>
                </div>
              </div>
            </form>
          </CardContent>
          <CardFooter className="bg-slate-50/30 p-8 border-t border-slate-50 flex flex-col gap-4 text-center">
            <p className="text-sm font-bold text-slate-500">
              Belum terdaftar di ekosistem? 
              <button 
                onClick={() => setIsRegistrationAlertOpen(true)}
                className="text-primary font-black hover:opacity-80 transition-all ml-1 uppercase tracking-tight text-xs"
              >
                Minta Akses
              </button>
            </p>
          </CardFooter>
        </Card>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-8 pt-4">
          <div className="flex items-center gap-3 text-[11px] font-black text-slate-400 uppercase tracking-[0.25em]">
            <Globe className="size-4 text-primary/40" />
            Global Reach
          </div>
          <div className="hidden sm:block w-1 h-1 bg-slate-300 rounded-full" />
          <div className="flex items-center gap-3 text-[11px] font-black text-slate-400 uppercase tracking-[0.25em]">
            <ShieldCheck className="size-4 text-primary/40" />
            Enterprise Grade
          </div>
        </div>
      </div>

      <AlertDialog open={isRegistrationAlertOpen} onOpenChange={setIsRegistrationAlertOpen}>
        <AlertDialogContent className="rounded-[2.5rem] border-none shadow-2xl p-8">
          <AlertDialogHeader>
            <div className="size-14 bg-primary/10 text-primary rounded-2xl flex items-center justify-center mb-4">
              <AlertCircle className="size-7" />
            </div>
            <AlertDialogTitle className="text-2xl font-black text-slate-900 tracking-tight">Pendaftaran Ditutup</AlertDialogTitle>
            <AlertDialogDescription className="text-slate-600 font-medium text-lg leading-relaxed">
              Jaringan Koolink saat ini beroperasi dalam basis undangan beta privat. Kami belum menerima permintaan pendaftaran publik baru saat ini.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-6">
            <AlertDialogAction className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-2xl font-black px-10 h-14 shadow-lg shadow-primary/20">
              Dimengerti
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
