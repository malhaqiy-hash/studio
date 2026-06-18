
"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
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
  Menu
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
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
  { icon: Rss, label: "Feed", href: "/feed" },
  { icon: Search, label: "AI Discovery", href: "/discover" },
  { icon: Users, label: "Matchmaker", href: "/matchmaker" },
  { icon: Briefcase, label: "Opportunities", href: "/opportunities" },
  { icon: MessageSquare, label: "Messages", href: "/messages" },
  { icon: Bell, label: "Notifications", href: "/notifications" },
];

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-background">
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
            <div className="flex items-center justify-between gap-2 p-2 rounded-lg bg-slate-50 border border-slate-100">
              <div className="flex items-center gap-3">
                <Avatar className="size-9 ring-2 ring-white shadow-sm">
                  <AvatarImage src="https://picsum.photos/seed/user/100" />
                  <AvatarFallback>JD</AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <span className="text-sm font-semibold truncate max-w-[120px]">Alpha Tech Solutions</span>
                  <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-tighter">Enterprise</span>
                </div>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="size-8">
                    <Globe className="size-4 text-slate-400" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-40">
                  <DropdownMenuItem className="gap-2"><span className="text-xs">🇺🇸 English</span></DropdownMenuItem>
                  <DropdownMenuItem className="gap-2"><span className="text-xs">🇮🇩 Indonesia</span></DropdownMenuItem>
                  <DropdownMenuItem className="gap-2"><span className="text-xs">🇯🇵 日本語</span></DropdownMenuItem>
                  <DropdownMenuItem className="gap-2"><span className="text-xs">🇰🇷 한국어</span></DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </SidebarFooter>
        </Sidebar>
        <SidebarInset className="flex flex-col">
          <header className="h-16 flex items-center justify-between px-6 border-b border-border sticky top-0 bg-background/80 backdrop-blur-md z-30">
            <div className="flex items-center gap-4">
              <SidebarTrigger className="md:hidden" />
              <h2 className="text-lg font-headline font-bold text-slate-900">
                {navItems.find(i => i.href === pathname)?.label || "Explore"}
              </h2>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="outline" size="sm" className="hidden sm:flex rounded-full px-4 gap-2">
                <UserCircle className="size-4" />
                <span>Account</span>
              </Button>
            </div>
          </header>
          <main className="flex-1 overflow-y-auto p-4 md:p-8 bg-[#F8FAFC]">
            <div className="max-w-7xl mx-auto space-y-8">
              {children}
            </div>
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
