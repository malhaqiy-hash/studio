
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
  Sliders,
  User,
  Menu,
  ChevronRight,
  ShieldCheck,
  LayoutGrid,
  Languages,
  UserPlus,
  Check,
  Camera,
  Radar,
  Handshake,
  Map as MapIcon,
  Building2,
  Bookmark,
  Smartphone,
  Cloud,
  TrendingUp,
  Magnet,
  BookOpen
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useUser, useAuth } from "@/firebase";
import { signOut } from "firebase/auth";
import { LanguagePicker } from "@/components/language-picker";
import { useLanguage } from "@/context/language-context";
import { useAccount, AccountType } from "@/context/account-context";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { TappLogo } from "@/components/ui/tapp-logo";
import { BRAND } from '@/config/appConfig';
import ConnectionIcon from '@/assets/icons/connection.svg';

const ConnectIcon = ({ className }: { className?: string }) => (
  <div 
    className={cn("bg-current", className)}
    style={{
      maskImage: `url(${ConnectionIcon.src})`,
      WebkitMaskImage: `url(${ConnectionIcon.src})`,
      maskSize: 'contain',
      maskRepeat: 'no-repeat',
      maskPosition: 'center',
      display: 'inline-block'
    }}
  />
);

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, loading } = useUser();
  const auth = useAuth();
  const { t } = useLanguage();
  const { toast } = useToast();
  const { activeAccount, availableAccounts, switchAccount, registerAccount, hasInitialized } = useAccount();
  const [isMoreMenuOpen, setIsMoreMenuOpen] = React.useState(false);

  const [isRegModalOpen, setIsRegModalOpen] = React.useState(false);
  const [pendingType, setPendingType] = React.useState<AccountType | null>(null);
  const [regFormData, setRegFormData] = React.useState({
    name: "",
    bio: "",
    extra: "",
    avatar: "",
    visibility: 'public' as 'public' | 'private'
  });

  const [isMediaPickerOpen, setIsMediaPickerOpen] = React.useState(false);
  const [isCloudLoading, setIsCloudLoading] = React.useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const getDrawerItems = () => {
    const baseItems = [
      { icon: User, label: t('profile'), href: "/profile", roles: ['personal', 'professional', 'bisnis'] },
      { icon: LayoutDashboard, label: t('dashboard'), href: "/dashboard", roles: ['personal', 'professional', 'bisnis'] },
      { icon: Bookmark, label: t('saved'), href: "/saved", roles: ['personal', 'professional', 'bisnis'] },
      { icon: ConnectIcon, label: t('connections'), href: "/connections", roles: ['personal', 'professional', 'bisnis'] },
      { icon: Users, label: t('communities'), href: "/communities", roles: ['personal', 'professional', 'bisnis'] },
      
      { icon: Radar, label: t('scout'), href: "/scout", roles: ['bisnis', 'professional'] },
      { icon: Handshake, label: t('matchmaker'), href: "/matchmaker", roles: ['bisnis', 'professional'] },
      { icon: TrendingUp, label: t('market_radar'), href: "/market-radar", roles: ['bisnis'] },
      { icon: Magnet, label: t('reverse_discovery'), href: "/reverse-discovery", roles: ['bisnis'] },
      { icon: MapIcon, label: t('opportunity_map'), href: "/opportunity-map", roles: ['bisnis'] },
      { icon: Building2, label: t('registry'), href: "/registry", roles: ['bisnis', 'professional'] },
      { icon: BookOpen, label: t('knowledge'), href: "/knowledge", roles: ['personal', 'professional', 'bisnis'] },

      { icon: Briefcase, label: t('opportunities'), href: "/opportunities", roles: ['bisnis', 'professional'] },
      { icon: Sliders, label: t('settings'), href: "/settings", roles: ['personal', 'professional', 'bisnis'] },
    ];

    return baseItems.filter(item => 
      item.roles.includes(activeAccount?.type || 'personal') && 
      item.href !== "/feed" && 
      item.href !== "/cari"
    );
  };

  const drawerItems = getDrawerItems();

  React.useEffect(() => {
    if (hasInitialized && activeAccount?.isNew && !isRegModalOpen) {
      setIsRegModalOpen(true);
    }
  }, [hasInitialized, activeAccount, isRegModalOpen]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pendingType) return;
    if (!regFormData.name.trim()) {
      toast({ variant: "destructive", title: "Nama wajib diisi." });
      return;
    }
    
    registerAccount({
      name: regFormData.name,
      type: pendingType,
      bio: regFormData.bio,
      extra: regFormData.extra,
      preferences: { publicFollowers: regFormData.visibility === 'public' }
    });

    setIsRegModalOpen(false);
    router.push("/profile");
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setRegFormData(prev => ({ ...prev, avatar: reader.result as string }));
        setIsMediaPickerOpen(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCloudSource = (source: 'drive' | 'photos') => {
    setIsCloudLoading(true);
    toast({ title: "Menghubungkan Cloud..." });
    setTimeout(() => {
      const simulatedUrl = `https://picsum.photos/seed/reg${Date.now()}/200/200`;
      setRegFormData(prev => ({ ...prev, avatar: simulatedUrl }));
      setIsCloudLoading(false);
      setIsMediaPickerOpen(false);
    }, 1200);
  };

  if (loading) return null;
  if (!user) return null;

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground font-body relative">
      <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />
      
      {/* Header Fixed - Enlarged slightly for fit */}
      <header className="fixed top-0 left-0 right-0 z-[100] w-full border-b bg-background/80 backdrop-blur-md px-4 h-12 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-2.5">
          <Link href="/feed" className="flex items-center gap-2.5 active:scale-95 transition-transform">
            <TappLogo className="size-6 rounded-md shadow-lg shadow-primary/10" />
            <span className="font-black text-sm tracking-tight text-foreground uppercase">{BRAND.name}</span>
          </Link>
          <span className="font-medium text-[9px] text-primary/60 lowercase italic select-none ml-1 leading-none">{activeAccount?.type}</span>
        </div>
        
        <div className="flex items-center gap-1.5">
          <Link href="/messages"><Button variant="ghost" size="icon" className="size-9 text-foreground/70 hover:bg-primary/5 hover:text-primary rounded-full transition"><MessageSquare className="size-5" /></Button></Link>
          <Link href="/notifications"><Button variant="ghost" size="icon" className="relative size-9 text-foreground/70 hover:bg-primary/5 hover:text-primary rounded-full transition"><Bell className="size-5" /><span className="absolute top-2 right-2 size-1.5 bg-primary rounded-full ring-2 ring-background"></span></Button></Link>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center rounded-full border border-primary/10 hover:border-primary transition p-0.5 outline-none ml-1">
                <Avatar className="h-7 w-7 rounded-full shadow-sm"><AvatarImage src={activeAccount.avatar} className="object-cover" /><AvatarFallback className="bg-primary text-primary-foreground font-bold text-[10px]">{activeAccount.name[0]}</AvatarFallback></Avatar>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-52 rounded-xl p-1 shadow-2xl border-border bg-card outline-none z-[180]">
              <DropdownMenuLabel className="px-2 py-1 text-[7px] font-bold text-muted-foreground uppercase tracking-widest border-b mb-1">Profil</DropdownMenuLabel>
              <DropdownMenuGroup>
                <Link href="/profile"><DropdownMenuItem className="flex items-center gap-2 px-2 py-2 rounded-lg font-bold cursor-pointer hover:bg-primary/5"><div className="size-6 rounded-md bg-p[...]
