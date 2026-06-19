
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
  UserCircle,
  LogOut,
  Globe,
  Menu,
  Settings,
  ChevronsUpDown,
  User,
  Sliders,
  Sparkles,
  Target
} from "lucide-react";
import { 
  Sidebar, 
  SidebarContent, 
  SidebarFooter, 
  SidebarGroup, 
  SidebarGroupContent, 
  SidebarGroupLabel, 
  SidebarHeader, 
  SidebarInset, 
  SidebarMenu, 
  SidebarMenuButton, 
  SidebarMenuItem, 
  SidebarProvider,
  SidebarTrigger
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useUser, useAuth } from "@/firebase";
import { signOut } from "firebase/auth";
import { AIAssistant } from "@/components/chat/ai-assistant";

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
  { icon: Rss, label: "Feed", href: "/feed" },
  { icon: Search, label: "AI Discovery", href: "/discover" },
  { icon: Target, label: "Intelligent Matches", href: "/matches" },
  { icon: Users, label: "Matchmaker", href: "/matchmaker" },
  { icon: Briefcase, label: "Opportunities", href: "/opportunities" },
  { icon: MessageSquare, label: "Messages", href: "/messages" },
  { icon: Bell, label: "Notifications", href: "/notifications" },
  { icon: Sliders, label: "Settings", href: "/settings" },
];

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, loading } = useUser();
  const auth = useAuth();

  // Route Protection: Redirect to login if not authenticated
  React.useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  // Apply theme from localStorage on mount
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

  // Loading state
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

  // Prevent flash of protected content
  if (!user) return null;

  const userInitial = user.email ? user.email[0].toUpperCase() : "U";

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-background relative">
        <Sidebar className="border-r border-border">
          <SidebarHeader className="h-16 flex items-center px-6 border-b border-border">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center text-white font-bold text-xl">
                O
              </div>
              <span className="font-headline font-bold text-lg tracking-tight">OnTapp</span>
            </Link>
          </SidebarHeader>
          <SidebarContent className="py-4">
            <SidebarGroup>
              <SidebarGroupLabel className="px-6 mb-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Menu
              </SidebarGroupLabel>
              <SidebarMenu className="px-3 gap-1">
                {navItems.map((item) => (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton 
                      asChild 
                      isActive={pathname === item.href}
                      className="rounded-lg px-3 py-6 h-11"
                    >
                      <Link href={item.href}>
                        <item.icon className="size-5" />
                        <span className="font-medium">{item.label}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroup>
          </SidebarContent>
          <SidebarFooter className="p-4 border-t border-border">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size="lg"
                  className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground rounded-xl border border-slate-100 bg-slate-50/50 cursor-pointer"
                >
                  <Avatar className="h-9 w-9 rounded-lg shadow-sm ring-2 ring-white">
                    <AvatarImage src={`https://picsum.photos/seed/${user.uid}/100`} />
                    <AvatarFallback className="rounded-lg bg-indigo-100 text-accent font-bold">{userInitial}</AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight ml-2">
                    <span className="truncate font-bold text-slate-900">{user.displayName || "Business Member"}</span>
                    <span className="truncate text-[10px] font-black uppercase text-slate-400 tracking-tighter">Enterprise</span>
                  </div>
                  <ChevronsUpDown className="ml-auto size-4 text-slate-400" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-2xl p-2 shadow-2xl border-slate-100"
                side="bottom"
                align="end"
                sideOffset={8}
              >
                <DropdownMenuLabel className="p-0 font-normal">
                  <div className="flex items-center gap-3 px-2 py-3">
                    <Avatar className="h-10 w-10 rounded-xl shadow-sm">
                      <AvatarImage src={`https://picsum.photos/seed/${user.uid}/100`} />
                      <AvatarFallback className="rounded-xl bg-indigo-50 text-accent font-bold">{userInitial}</AvatarFallback>
                    </Avatar>
                    <div className="grid flex-1 text-left text-sm leading-tight">
                      <span className="truncate font-black text-slate-900 leading-none mb-1">{user.displayName || "Welcome"}</span>
                      <span className="truncate text-xs font-medium text-slate-400">{user.email}</span>
                    </div>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="my-2 bg-slate-50" />
                <div className="space-y-1">
                  <DropdownMenuItem className="gap-3 px-3 py-2.5 rounded-xl font-bold text-slate-600 focus:bg-indigo-50 focus:text-accent cursor-pointer transition-colors" asChild>
                    <Link href="/profile">
                      <UserCircle className="size-5" />
                      Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="gap-3 px-3 py-2.5 rounded-xl font-bold text-slate-600 focus:bg-indigo-50 focus:text-accent cursor-pointer transition-colors" asChild>
                    <Link href="/settings">
                      <Settings className="size-5" />
                      Account Settings
                    </Link>
                  </DropdownMenuItem>
                </div>
                <DropdownMenuSeparator className="my-2 bg-slate-50" />
                <DropdownMenuItem 
                  onClick={handleLogout}
                  className="gap-3 px-3 py-2.5 rounded-xl font-bold text-rose-600 focus:bg-rose-50 focus:text-rose-700 cursor-pointer transition-colors"
                >
                  <LogOut className="size-5" />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarFooter>
        </Sidebar>
        <SidebarInset className="flex flex-col">
          <header className="h-16 flex items-center justify-between px-6 border-b border-border sticky top-0 bg-background/80 backdrop-blur-md z-30">
            <div className="flex items-center gap-4">
              <SidebarTrigger className="md:hidden" />
              <div className="flex flex-col">
                 <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">
                    {navItems.find(i => i.href === pathname)?.label || "Explore"}
                 </h2>
                 <div className="text-xs font-medium text-slate-500 flex items-center gap-2">
                    <Sparkles className="size-3 text-accent" />
                    Welcome, <span className="font-bold text-slate-900">{user.email}</span>
                 </div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="outline" size="sm" className="hidden sm:flex rounded-full px-4 gap-2 border-slate-200 font-bold text-slate-600" asChild>
                <Link href="/settings">
                  <Sliders className="size-4" />
                  <span>Config</span>
                </Link>
              </Button>
            </div>
          </header>
          <main className="flex-1 overflow-y-auto p-4 md:p-8 bg-[#F8FAFC]">
            <div className="max-w-7xl mx-auto space-y-8">
              {children}
            </div>
          </main>
        </SidebarInset>

        {/* Global AI Assistant FAB */}
        <AIAssistant />
      </div>
    </SidebarProvider>
  );
}
