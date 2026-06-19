
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
  Languages,
  CreditCard,
  UserPlus,
  Sparkles,
  Check
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuPortal,
  DropdownMenuSubContent,
  DropdownMenuGroup
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
import { useAccount, AccountType } from "@/context/account-context";
import { cn } from "@/lib/utils";

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, loading } = useUser();
  const auth = useAuth();
  const { t } = useLanguage();
  const { activeAccount, availableAccounts, switchAccount, activateAccountType } = useAccount();
  const [isMoreMenuOpen, setIsMoreMenuOpen] = React.useState(false);

  const drawerItems = [
    { icon: LayoutDashboard, label: t('dashboard'), href: "/dashboard" },
    { icon: Globe, label: t('discovery'), href: "/discover" },
    { icon: Users, label: t('matchmaker'), href: "/matchmaker" },
    { icon: Target, label: t('matches'), href: "/matches" },
    { icon: Briefcase, label: t('opportunities'), href: "/opportunities" },
    { icon: MessageSquare, label: t('messages'), href: "/messages" },
    { icon: CreditCard, label: t('payment'), href: "/payment" },
    { icon: Sliders, label: t('settings'), href: "/settings" },
  ];

  React.useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const handleSwitchAccount = (id: string) => {
    switchAccount(id);
    router.push("/profile");
  };

  const handleActivate = (type: AccountType) => {
    activateAccountType(type);
    router.push("/profile");
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

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-body relative">
      
      {/* Top Header */}
      <header className="sticky top-0 z-[100] w-full border-b bg-white/80 backdrop-blur-md px-4 h-14 flex items-center justify-between shadow-sm pointer-events-auto">
        <div className="flex items-center gap-2">
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="size-8 rounded-lg bg-accent flex items-center justify-center text-white font-black text-xl shadow-lg shadow-indigo-100">
              O
            </div>
            <span className="font-headline font-black text-lg tracking-tight text-slate-900">OnTapp</span>
          </Link>
          <Badge variant="outline" className="text-[9px] font-black uppercase tracking-tighter px-1.5 py-0 border-accent/20 text-accent bg-accent/5">Beta</Badge>
        </div>
        
        <div className="flex items-center gap-3">
          <Link href="/notifications">
            <Button variant="ghost" size="icon" className="relative p-2 text-slate-600 hover:bg-slate-100 rounded-full transition">
              <Bell className="size-5" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-white"></span>
            </Button>
          </Link>

          {/* Profile Switcher Hub */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center rounded-full border-2 border-indigo-100 hover:border-accent transition p-0.5 outline-none pointer-events-auto">
                <Avatar className="h-7 w-7 rounded-full shadow-sm">
                  <AvatarImage src={activeAccount.avatar} />
                  <AvatarFallback className="bg-accent text-white font-bold text-[10px]">{activeAccount.name[0]}</AvatarFallback>
                </Avatar>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-72 rounded-2xl p-2 shadow-2xl border-slate-100 bg-white pointer-events-auto">
              <DropdownMenuLabel className="px-3 py-2 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b mb-2">
                Ganti Akun
              </DropdownMenuLabel>
              
              <DropdownMenuGroup>
                {availableAccounts.map((acc) => (
                  <DropdownMenuItem 
                    key={acc.id}
                    onSelect={() => handleSwitchAccount(acc.id)}
                    className={cn(
                      "flex items-center justify-between px-3 py-3 rounded-xl font-bold cursor-pointer transition-colors mb-1",
                      activeAccount.id === acc.id 
                        ? "bg-indigo-50 text-accent" 
                        : "text-slate-600 focus:bg-slate-50"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <Avatar className="size-8 rounded-xl">
                        <AvatarImage src={acc.avatar} />
                        <AvatarFallback className="text-[8px] bg-slate-100">{acc.name[0]}</AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <span className="text-sm leading-none mb-1">{acc.name}</span>
                        <span className="text-[9px] uppercase tracking-widest opacity-60">{acc.type}</span>
                      </div>
                    </div>
                    {activeAccount.id === acc.id && <Check className="size-4" />}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuGroup>

              <DropdownMenuSeparator className="my-2" />

              <DropdownMenuSub>
                <DropdownMenuSubTrigger className="gap-3 px-3 py-2.5 rounded-xl font-bold text-slate-600 focus:bg-indigo-50 focus:text-accent cursor-pointer">
                  <UserPlus className="size-4" />
                  Tambahkan Akun
                </DropdownMenuSubTrigger>
                <DropdownMenuPortal>
                  <DropdownMenuSubContent className="rounded-xl border-slate-100 shadow-xl p-1 min-w-[160px] bg-white">
                    <DropdownMenuItem 
                      onSelect={() => handleActivate('pribadi')}
                      className="font-bold px-4 py-2.5 rounded-lg cursor-pointer flex gap-3"
                    >
                      <User className="size-4 text-slate-400" /> Pribadi
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onSelect={() => handleActivate('professional')}
                      className="font-bold px-4 py-2.5 rounded-lg cursor-pointer flex gap-3"
                    >
                      <ShieldCheck className="size-4 text-emerald-400" /> Professional
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onSelect={() => handleActivate('bisnis')}
                      className="font-bold px-4 py-2.5 rounded-lg cursor-pointer flex gap-3"
                    >
                      <Briefcase className="size-4 text-indigo-400" /> Bisnis
                    </DropdownMenuItem>
                  </DropdownMenuSubContent>
                </DropdownMenuPortal>
              </DropdownMenuSub>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      <main className="flex-1 pb-28 pt-4 px-4 w-full overflow-x-hidden relative pointer-events-auto">
        <div className="max-w-4xl mx-auto">
          {children}
        </div>
      </main>

      {/* Fixed Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-[90] border-t bg-white/95 backdrop-blur-md pb-safe shadow-[0_-4px_12px_rgba(0,0,0,0.03)] pointer-events-auto">
        <div className="grid grid-cols-3 h-16 items-center justify-items-center text-[10px] font-black uppercase tracking-widest text-slate-400 relative">
          
          <Link 
            href="/dashboard" 
            className={cn(
              "flex flex-col items-center gap-1 w-full py-2 transition-colors",
              pathname === "/dashboard" ? "text-accent" : "hover:text-slate-600"
            )}
          >
            <Rss className="size-6" />
            <span>Beranda</span>
          </Link>

          <Link 
            href="/discover" 
            className={cn(
              "flex flex-col items-center gap-1 w-full py-2 transition-colors",
              pathname === "/discover" || pathname === "/search" ? "text-accent" : "hover:text-slate-600"
            )}
          >
            <Search className="size-6" />
            <span>Cari</span>
          </Link>

          {/* AI Advisor Trigger & Lainnya Menu */}
          <div className="relative w-full h-full flex flex-col items-center justify-center">
            {/* AI Advisor Button - Floats cleanly above the burger menu */}
            <button 
              onClick={() => window.dispatchEvent(new CustomEvent('open-ai-assistant'))}
              className="absolute bottom-20 w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white shadow-xl hover:bg-blue-700 transition active:scale-95 z-[95] ring-4 ring-white"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
            </button>

            <Sheet open={isMoreMenuOpen} onOpenChange={setIsMoreMenuOpen}>
              <SheetTrigger asChild>
                <button className="flex flex-col items-center gap-1 hover:text-indigo-600 w-full py-2 outline-none">
                  <Menu className="size-6" />
                  <span>Lainnya</span>
                </button>
              </SheetTrigger>
              <SheetContent side="bottom" className="rounded-t-[2.5rem] border-none p-0 overflow-hidden h-[90vh] bg-white pointer-events-auto">
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
                
                <div className="overflow-y-auto max-h-full pb-32">
                  <div className="flex flex-col divide-y divide-slate-100">
                    {drawerItems.map((item) => (
                      <Link 
                        key={item.href}
                        href={item.href}
                        onClick={() => setIsMoreMenuOpen(false)}
                        className={cn(
                          "flex items-center px-8 py-5 transition-colors gap-6 group",
                          pathname === item.href 
                            ? "bg-indigo-50/50 text-accent" 
                            : "bg-white hover:bg-slate-50"
                        )}
                      >
                        <div className={cn(
                          "size-10 rounded-xl flex items-center justify-center transition-all group-hover:scale-110",
                          pathname === item.href ? "bg-accent text-white" : "bg-slate-100 text-slate-400"
                        )}>
                          <item.icon className="size-5" />
                        </div>
                        <span className="text-sm font-black uppercase tracking-widest">{item.label}</span>
                        <ChevronRight className="ml-auto size-4 text-slate-300 group-hover:text-accent transition-colors" />
                      </Link>
                    ))}

                    <div className="px-8 py-6 bg-white">
                      <div className="flex items-center gap-6 mb-4">
                        <div className="size-10 rounded-xl bg-slate-100 text-slate-400 flex items-center justify-center">
                          <Languages className="size-5" />
                        </div>
                        <span className="text-sm font-black uppercase tracking-widest">Setting Bahasa</span>
                      </div>
                      <LanguagePicker />
                    </div>

                    <button 
                      onClick={handleLogout}
                      className="flex items-center px-8 py-6 bg-rose-50 hover:bg-rose-100 transition-colors gap-6 group text-rose-600 w-full text-left"
                    >
                      <div className="size-10 rounded-xl bg-white border border-rose-100 flex items-center justify-center shadow-sm">
                        <LogOut className="size-5" />
                      </div>
                      <span className="text-sm font-black uppercase tracking-widest">Logout Session</span>
                      <ChevronRight className="ml-auto size-4 opacity-50" />
                    </button>
                  </div>
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
