
"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { 
  LayoutDashboard, 
  Search, 
  Users, 
  Rss, 
  MessageSquare, 
  Briefcase, 
  Bell, 
  LogOut,
  Globe,
  Settings,
  User,
  Sliders,
  Target,
  Menu,
  ChevronRight,
  ShieldCheck,
  LayoutGrid,
  Languages
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useUser, useAuth } from "@/firebase";
import { signOut } from "firebase/auth";
import { AIAssistant } from "@/components/chat/ai-assistant";
import { LanguagePicker } from "@/components/language-picker";
import { useLanguage } from "@/context/language-context";
import { cn } from "@/lib/utils";

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, loading } = useUser();
  const auth = useAuth();
  const { t } = useLanguage();
  const [isMoreMenuOpen, setIsMoreMenuOpen] = React.useState(false);

  const extendedNavItems = [
    { icon: LayoutDashboard, label: t('dashboard'), href: "/dashboard" },
    { icon: Globe, label: t('discovery'), href: "/discover" },
    { icon: Target, label: t('matches'), href: "/matches" },
    { icon: Users, label: t('matchmaker'), href: "/matchmaker" },
    { icon: Briefcase, label: t('opportunities'), href: "/opportunities" },
    { icon: MessageSquare, label: t('messages'), href: "/messages" },
    { icon: Bell, label: t('notifications'), href: "/notifications" },
    { icon: Sliders, label: t('settings'), href: "/settings" },
    { icon: User, label: t('profile'), href: "/profile" },
  ];

  // Route Protection
  React.useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  // Apply theme from localStorage
  React.useEffect(() => {
    const applyStoredTheme = () => {
      const saved = localStorage.getItem("ontapp_system_settings_v2");
      if (saved) {
        try {
          const { theme } = JSON.parse(saved);
          if (theme === 'dark') {
            document.documentElement.classList.add('dark');
          } else if (theme === 'light') {
            document.documentElement.classList.remove('dark');
          } else if (theme === 'system') {
            const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            document.documentElement.classList.toggle('dark', isDark);
          }
        } catch (e) {
          console.error("Theme application failed", e);
        }
      }
    };
    applyStoredTheme();
  }, [pathname]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#F8FAFC]">
        <div className="relative size-16 mb-4">
          <div className="absolute inset-0 border-4 border-indigo-100 rounded-2xl" />
          <div className="absolute inset-0 border-4 border-accent rounded-2xl border-t-transparent animate-spin" />
        </div>
        <p className="text-slate-500 font-black uppercase tracking-widest text-[10px] animate-pulse">Authorizing Session...</p>
      </div>
    );
  }

  if (!user) return null;

  const userInitial = user.email ? user.email[0].toUpperCase() : "U";

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-body">
      
      {/* ==================== 1. TOP HEADER ==================== */}
      <header className="sticky top-0 z-40 w-full border-b bg-white/80 backdrop-blur-md px-4 h-14 flex items-center justify-between shadow-sm">
        <Link href="/dashboard" className="flex items-center gap-2">
          <div className="size-8 rounded-lg bg-accent flex items-center justify-center text-white font-black text-xl shadow-lg shadow-indigo-100">
            O
          </div>
          <span className="font-headline font-black text-lg tracking-tight text-slate-900">OnTapp</span>
        </Link>
        
        <div className="flex items-center gap-3">
          {/* Notifications in Header (Relocated from Lainnya) */}
          <Link href="/notifications">
            <Button variant="ghost" size="icon" className="relative p-2 text-slate-600 hover:bg-slate-100 rounded-full transition">
              <Bell className="size-5" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-white"></span>
            </Button>
          </Link>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center rounded-full border-2 border-indigo-100 hover:border-accent transition p-0.5 outline-none">
                <Avatar className="h-7 w-7 rounded-full shadow-sm">
                  <AvatarImage src={`https://picsum.photos/seed/${user.uid}/100`} />
                  <AvatarFallback className="bg-accent text-white font-bold text-[10px]">{userInitial}</AvatarFallback>
                </Avatar>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 rounded-2xl p-2 shadow-2xl border-slate-100">
              <DropdownMenuLabel className="p-0 font-normal">
                <div className="flex items-center gap-3 px-2 py-3">
                  <Avatar className="h-9 w-9 rounded-xl">
                    <AvatarImage src={`https://picsum.photos/seed/${user.uid}/100`} />
                    <AvatarFallback className="rounded-xl bg-indigo-50 text-accent font-bold">{userInitial}</AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-black text-slate-900 leading-none mb-1">Business Account</span>
                    <span className="truncate text-[10px] font-medium text-slate-400">{user.email}</span>
                  </div>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-slate-50" />
              <DropdownMenuItem className="gap-3 px-3 py-2.5 rounded-xl font-bold text-slate-600 focus:bg-indigo-50 focus:text-accent cursor-pointer" asChild>
                <Link href="/profile">
                  <User className="size-4" />
                  {t('profile')}
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-slate-50" />
              <DropdownMenuItem 
                onClick={handleLogout}
                className="gap-3 px-3 py-2.5 rounded-xl font-bold text-rose-600 focus:bg-rose-50 focus:text-rose-700 cursor-pointer"
              >
                <LogOut className="size-4" />
                {t('logout')}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      {/* ==================== 2. MAIN CONTENT AREA ==================== */}
      <main className="flex-1 pb-28 pt-4 px-4 w-full overflow-x-hidden">
        <div className="max-w-4xl mx-auto">
          {children}
        </div>
      </main>

      {/* ==================== 3. MOBILE BOTTOM NAVIGATION ==================== */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 border-t bg-white/95 backdrop-blur-md pb-safe shadow-[0_-4px_12px_rgba(0,0,0,0.03)]">
        <div className="grid grid-cols-3 h-16 items-center justify-items-center text-[10px] font-black uppercase tracking-widest text-slate-400 relative">
          
          {/* TAB 1: Beranda */}
          <Link 
            href="/feed" 
            className={cn(
              "flex flex-col items-center gap-1 w-full py-2 transition-colors",
              pathname === "/feed" ? "text-accent" : "hover:text-slate-600"
            )}
          >
            <Rss className="size-6" />
            <span>Beranda</span>
          </Link>

          {/* TAB 2: Cari */}
          <Link 
            href="/search" 
            className={cn(
              "flex flex-col items-center gap-1 w-full py-2 transition-colors",
              pathname === "/search" ? "text-accent" : "hover:text-slate-600"
            )}
          >
            <Search className="size-6" />
            <span>Cari</span>
          </Link>

          {/* TAB 3: Menu Utama / Lainnya (≡) */}
          <div className="relative w-full h-full flex flex-col items-center justify-center">
            {/* 🤖 AI ADVISOR BUTTON (Floating above the menu) */}
            <button 
              onClick={() => window.dispatchEvent(new CustomEvent('open-ai-assistant'))}
              className="absolute bottom-20 w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white shadow-xl hover:bg-blue-700 transition active:scale-95 z-50"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
            </button>

            <Sheet open={isMoreMenuOpen} onOpenChange={setIsMoreMenuOpen}>
              <SheetTrigger asChild>
                <button className="flex flex-col items-center gap-1 hover:text-indigo-600 w-full py-2 outline-none">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                  <span>Lainnya</span>
                </button>
              </SheetTrigger>
              <SheetContent side="bottom" className="rounded-t-[2.5rem] border-none p-0 overflow-hidden h-[85vh]">
                <SheetHeader className="p-8 pb-4 bg-slate-50 border-b border-slate-100">
                  <div className="flex items-center justify-between">
                    <SheetTitle className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                      <LayoutGrid className="size-5 text-accent" />
                      Network Hub
                    </SheetTitle>
                    <Badge variant="outline" className="bg-white border-slate-200 text-slate-500 font-bold px-3">
                      Enterprise Mode
                    </Badge>
                  </div>
                </SheetHeader>
                <div className="p-4 grid grid-cols-2 gap-4 overflow-y-auto max-h-full pb-20">
                  {extendedNavItems.map((item) => (
                    <Link 
                      key={item.href}
                      href={item.href}
                      onClick={() => setIsMoreMenuOpen(false)}
                      className={cn(
                        "flex flex-col items-center justify-center p-6 rounded-3xl border transition-all duration-300 gap-3 group",
                        pathname === item.href 
                          ? "bg-indigo-50 border-accent/20 text-accent" 
                          : "bg-white border-slate-100 hover:border-accent/20 hover:bg-slate-50"
                      )}
                    >
                      <div className={cn(
                        "size-12 rounded-2xl flex items-center justify-center transition-all group-hover:scale-110",
                        pathname === item.href ? "bg-accent text-white" : "bg-slate-50 text-slate-400"
                      )}>
                        <item.icon className="size-6" />
                      </div>
                      <span className="text-[10px] font-black uppercase tracking-widest text-center">{item.label}</span>
                    </Link>
                  ))}
                  
                  {/* Language Settings (Relocated from Top Header) */}
                  <div className="col-span-2 p-6 rounded-3xl border border-slate-100 bg-white space-y-3">
                    <div className="flex items-center gap-3 text-slate-900">
                      <Languages className="size-5 text-accent" />
                      <span className="text-[10px] font-black uppercase tracking-widest">Setelan Bahasa</span>
                    </div>
                    <LanguagePicker />
                  </div>

                  <button 
                    onClick={handleLogout}
                    className="col-span-2 flex items-center justify-between p-6 rounded-3xl bg-rose-50 border border-rose-100 text-rose-600 font-black uppercase tracking-widest text-[11px]"
                  >
                    <div className="flex items-center gap-3">
                      <LogOut className="size-5" />
                      Logout Session
                    </div>
                    <ChevronRight className="size-4" />
                  </button>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </nav>

      <AIAssistant />
    </div>
  );
}
