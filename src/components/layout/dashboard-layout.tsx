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
  UserPlus,
  Check,
  Camera,
  X,
  Radar,
  Magnet,
  BookOpen,
  TrendingUp,
  Map as MapIcon,
  Building2,
  History,
  Bookmark,
  Sparkles,
  ExternalLink,
  Smartphone,
  Cloud,
  Image as ImageIcon
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
  DialogFooter,
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
import { AIAssistant } from "@/components/chat/ai-assistant";
import { LanguagePicker } from "@/components/language-picker";
import { useLanguage } from "@/context/language-context";
import { useAccount, AccountType } from "@/context/account-context";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

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
    contact: "",
    extra: "",
    avatar: ""
  });

  const [isMediaPickerOpen, setIsMediaPickerOpen] = React.useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  // Logika Filter Menu Berdasarkan Tipe Akun
  const getDrawerItems = () => {
    const baseItems = [
      { icon: LayoutDashboard, label: t('dashboard'), href: "/dashboard", roles: ['pribadi', 'professional', 'bisnis'] },
      { icon: User, label: t('profile'), href: "/profile", roles: ['pribadi', 'professional', 'bisnis'] },
      { icon: Bookmark, label: t('saved'), href: "/saved", roles: ['pribadi', 'professional', 'bisnis'] },
      { icon: Rss, label: t('feed'), href: "/feed", roles: ['pribadi', 'professional', 'bisnis'] },
      { icon: Search, label: t('search'), href: "/cari", roles: ['pribadi', 'professional', 'bisnis'] },
      
      { icon: Users, label: t('matchmaker'), href: "/matchmaker", roles: ['professional', 'bisnis'] },
      { icon: Target, label: t('matches'), href: "/matches", roles: ['professional', 'bisnis'] },
      { icon: BookOpen, label: t('knowledge'), href: "/knowledge", roles: ['professional', 'bisnis'] },
      
      { icon: TrendingUp, label: t('market_radar'), href: "/market-radar", roles: ['bisnis'] },
      { icon: MapIcon, label: t('opportunity_map'), href: "/opportunity-map", roles: ['bisnis'] },
      { icon: Building2, label: t('registry'), href: "/registry", roles: ['bisnis'] },
      { icon: Radar, label: t('scout'), href: "/scout", roles: ['bisnis'] },
      { icon: Magnet, label: t('reverse_discovery'), href: "/reverse-discovery", roles: ['bisnis'] },
      { icon: Briefcase, label: t('opportunities'), href: "/opportunities", roles: ['bisnis'] },
      
      { icon: Sliders, label: t('settings'), href: "/settings", roles: ['pribadi', 'professional', 'bisnis'] },
    ];

    return baseItems.filter(item => 
      item.roles.includes(activeAccount?.type || 'pribadi') && 
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

  const handleOpenRegistration = (type: AccountType) => {
    setPendingType(type);
    setRegFormData({ name: "", bio: "", contact: "", extra: "", avatar: "" });
    setIsRegModalOpen(true);
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pendingType) return;
    
    registerAccount({
      name: regFormData.name,
      type: pendingType,
      bio: regFormData.bio,
      contact: regFormData.contact,
      extra: regFormData.extra
    });

    setIsRegModalOpen(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setRegFormData(prev => ({ ...prev, avatar: reader.result as string }));
        setIsMediaPickerOpen(false);
        toast({ title: "Foto profil disiapkan dari galeri" });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCloudSource = (source: 'drive' | 'photos') => {
    toast({ title: "Menghubungkan pustaka cloud..." });
    setTimeout(() => {
      const simulatedUrl = `https://picsum.photos/seed/reg${Date.now()}/200/200`;
      setRegFormData(prev => ({ ...prev, avatar: simulatedUrl }));
      setIsMediaPickerOpen(false);
      toast({ title: "Gambar berhasil diimpor" });
    }, 1200);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
        <div className="relative size-16 mb-4">
          <div className="absolute inset-0 border-4 border-teal-100 rounded-2xl" />
          <div className="absolute inset-0 border-4 border-teal-600 rounded-2xl border-t-transparent animate-spin" />
        </div>
        <p className="text-slate-500 font-black uppercase tracking-widest text-[10px] animate-pulse">Authorizing Session...</p>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-body relative">
      <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />
      
      <header className="sticky top-0 z-[100] w-full border-b bg-white/80 backdrop-blur-md px-4 h-14 flex items-center justify-between shadow-sm pointer-events-auto">
        <div className="flex items-center gap-2">
          <Link href="/feed" className="flex items-center gap-2">
            <div className="size-8 rounded-lg bg-teal-600 flex items-center justify-center text-white font-black text-xl shadow-lg shadow-teal-100">
              O
            </div>
            <span className="font-headline font-black text-lg tracking-tight text-slate-900">OnTapp</span>
          </Link>
          <Badge variant="outline" className="text-[9px] font-black uppercase tracking-tighter px-1.5 py-0 border-teal-200 text-teal-600 bg-teal-50">
            {activeAccount?.type || 'Beta'}
          </Badge>
        </div>
        
        <div className="flex items-center gap-2">
          <Link href="/messages">
            <Button variant="ghost" size="icon" className="p-2 text-slate-600 hover:bg-slate-100 rounded-full transition">
              <MessageSquare className="size-5" />
            </Button>
          </Link>

          <Link href="/notifications">
            <Button variant="ghost" size="icon" className="relative p-2 text-slate-600 hover:bg-slate-100 rounded-full transition">
              <Bell className="size-5" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-white"></span>
            </Button>
          </Link>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center rounded-full border-2 border-teal-100 hover:border-teal-600 transition p-0.5 outline-none pointer-events-auto">
                <Avatar className="h-7 w-7 rounded-full shadow-sm">
                  <AvatarImage src={activeAccount.avatar} />
                  <AvatarFallback className="bg-teal-600 text-white font-bold text-[10px]">{activeAccount.name[0]}</AvatarFallback>
                </Avatar>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-72 rounded-2xl p-2 shadow-2xl border-slate-100 bg-white pointer-events-auto">
              <DropdownMenuLabel className="px-3 py-2 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b mb-2">
                Menu Akun
              </DropdownMenuLabel>
              
              <DropdownMenuGroup>
                <Link href="/profile">
                  <DropdownMenuItem className="flex items-center gap-3 px-3 py-3 rounded-xl font-bold cursor-pointer transition-colors mb-1 hover:bg-teal-50 hover:text-teal-600">
                    <div className="size-8 rounded-xl bg-teal-50 flex items-center justify-center text-teal-600">
                      <User className="size-4" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm leading-none mb-1">{t('view_profile')}</span>
                      <span className="text-[9px] uppercase tracking-widest opacity-60">Manage Portfolio</span>
                    </div>
                  </DropdownMenuItem>
                </Link>

                <DropdownMenuSeparator className="my-2" />
                <DropdownMenuLabel className="px-3 py-1 text-[9px] font-black text-slate-300 uppercase tracking-widest">
                  Ganti Profil
                </DropdownMenuLabel>

                {availableAccounts.filter(a => !a.isNew).map((acc) => (
                  <DropdownMenuItem 
                    key={acc.id}
                    onSelect={() => switchAccount(acc.id)}
                    className={cn(
                      "flex items-center justify-between px-3 py-3 rounded-xl font-bold cursor-pointer transition-colors mb-1",
                      activeAccount.id === acc.id 
                        ? "bg-teal-50 text-teal-600" 
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
                <DropdownMenuSubTrigger className="gap-3 px-3 py-2.5 rounded-xl font-bold text-slate-600 focus:bg-teal-50 focus:text-teal-600 cursor-pointer">
                  <UserPlus className="size-4" />
                  Tambahkan Akun
                </DropdownMenuSubTrigger>
                <DropdownMenuPortal>
                  <DropdownMenuSubContent className="rounded-xl border-slate-100 shadow-xl p-1 min-w-[160px] bg-white">
                    <DropdownMenuItem 
                      onSelect={() => handleOpenRegistration('pribadi')}
                      className="font-bold px-4 py-2.5 rounded-lg cursor-pointer flex gap-3"
                    >
                      <User className="size-4 text-slate-400" /> Pribadi
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onSelect={() => handleOpenRegistration('professional')}
                      className="font-bold px-4 py-2.5 rounded-lg cursor-pointer flex gap-3"
                    >
                      <ShieldCheck className="size-4 text-emerald-400" /> Professional
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onSelect={() => handleOpenRegistration('bisnis')}
                      className="font-bold px-4 py-2.5 rounded-lg cursor-pointer flex gap-3"
                    >
                      <Briefcase className="size-4 text-teal-600" /> Bisnis
                    </DropdownMenuItem>
                  </DropdownMenuSubContent>
                </DropdownMenuPortal>
              </DropdownMenuSub>

              <DropdownMenuSeparator className="my-2" />
              <DropdownMenuItem onClick={handleLogout} className="text-rose-500 font-bold px-3 py-2.5 rounded-xl focus:bg-rose-50 focus:text-rose-600 cursor-pointer flex gap-3">
                <LogOut className="size-4" /> Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      <main className="flex-1 pb-28 pt-4 px-4 w-full overflow-x-hidden relative pointer-events-auto">
        <div className="max-w-4xl mx-auto">
          {children}
        </div>
      </main>

      <nav className="fixed bottom-0 left-0 right-0 z-[90] border-t bg-white/95 backdrop-blur-md pb-safe shadow-[0_-4px_12px_rgba(0,0,0,0.03)] pointer-events-auto">
        <div className="grid grid-cols-3 h-16 items-center justify-items-center text-[10px] font-black uppercase tracking-widest text-slate-400 relative">
          
          <Link 
            href="/feed" 
            className={cn(
              "flex flex-col items-center gap-1 w-full py-2 transition-colors",
              pathname === "/feed" ? "text-teal-600" : "hover:text-slate-600"
            )}
          >
            <Rss className="size-6" />
            <span>{t('feed')}</span>
          </Link>

          <Link 
            href="/cari" 
            className={cn(
              "flex flex-col items-center gap-1 w-full py-2 transition-colors",
              pathname === "/cari" ? "text-teal-600" : "hover:text-slate-600"
            )}
          >
            <Search className="size-6" />
            <span>{t('search')}</span>
          </Link>

          <div className="relative w-full h-full flex flex-col items-center justify-center">
            <button 
              onClick={() => window.dispatchEvent(new CustomEvent('open-ai-assistant'))}
              className="absolute bottom-20 w-12 h-12 bg-teal-600 rounded-full flex items-center justify-center text-white shadow-xl hover:bg-teal-700 transition active:scale-95 z-[95] ring-4 ring-white"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
            </button>

            <Sheet open={isMoreMenuOpen} onOpenChange={setIsMoreMenuOpen}>
              <SheetTrigger asChild>
                <button className="flex flex-col items-center gap-1 hover:text-teal-600 w-full py-2 outline-none">
                  <Menu className="size-6" />
                  <span>{t('more')}</span>
                </button>
              </SheetTrigger>
              <SheetContent side="bottom" className="rounded-t-[2.5rem] border-none p-0 overflow-hidden h-[90vh] bg-white pointer-events-auto">
                <SheetHeader className="p-8 pb-4 bg-slate-50 border-b border-slate-100">
                  <div className="flex items-center justify-between">
                    <SheetTitle className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                      <LayoutGrid className="size-5 text-teal-600" />
                      OnTapp Hub
                    </SheetTitle>
                    <Badge variant="outline" className="bg-white border-slate-200 text-slate-500 font-bold px-3 uppercase text-[10px]">
                      {activeAccount?.type} Mode
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
                            ? "bg-teal-50/50 text-teal-600" 
                            : "bg-white hover:bg-slate-50"
                        )}
                      >
                        <div className={cn(
                          "size-10 rounded-xl flex items-center justify-center transition-all group-hover:scale-110",
                          pathname === item.href ? "bg-teal-600 text-white" : "bg-slate-100 text-slate-400"
                        )}>
                          <item.icon className="size-5" />
                        </div>
                        <span className="text-sm font-black uppercase tracking-widest">{item.label}</span>
                        <ChevronRight className="ml-auto size-4 text-slate-300 group-hover:text-teal-600 transition-colors" />
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

      {/* Onboarding / Registration Modal */}
      <Dialog open={isRegModalOpen} onOpenChange={(open) => {
        if (activeAccount?.isNew) return;
        setIsRegModalOpen(open);
      }}>
        <DialogContent className="max-w-md rounded-[2.5rem] p-0 border-none shadow-2xl overflow-hidden bg-white">
          <form onSubmit={handleRegisterSubmit} className="flex flex-col h-full">
            <DialogHeader className="p-8 pb-4 bg-slate-50 border-b border-slate-100 text-center sm:text-center">
              <div className="flex flex-col items-center gap-4 mb-2">
                <div className="size-16 rounded-2xl bg-teal-600 text-white flex items-center justify-center font-black text-2xl shadow-xl">O</div>
                <DialogTitle className="text-2xl font-black text-slate-900 tracking-tight">Selamat Datang di OnTapp</DialogTitle>
                <DialogDescription className="font-medium text-slate-500">
                  Silakan pilih jenis profil Anda untuk mulai terhubung dengan jaringan global.
                </DialogDescription>
              </div>
            </DialogHeader>

            <div className="p-8 space-y-6 overflow-y-auto max-h-[60vh]">
              {!pendingType ? (
                <div className="grid gap-4 animate-in fade-in zoom-in-95 duration-300">
                  <button 
                    type="button"
                    onClick={() => setPendingType('pribadi')}
                    className="flex items-center gap-6 p-6 rounded-3xl border-2 border-slate-50 hover:border-teal-200 hover:bg-teal-50 transition-all group text-left"
                  >
                    <div className="size-12 rounded-2xl bg-teal-100 text-teal-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <User className="size-6" />
                    </div>
                    <div>
                      <h4 className="font-black text-slate-900">Profil Pribadi</h4>
                      <p className="text-xs text-slate-400 font-medium">Cari produk & berbagi momen harian.</p>
                    </div>
                  </button>

                  <button 
                    type="button"
                    onClick={() => setPendingType('professional')}
                    className="flex items-center gap-6 p-6 rounded-3xl border-2 border-slate-50 hover:border-emerald-200 hover:bg-emerald-50 transition-all group text-left"
                  >
                    <div className="size-12 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <ShieldCheck className="size-6" />
                    </div>
                    <div>
                      <h4 className="font-black text-slate-900">Profil Professional</h4>
                      <p className="text-xs text-slate-400 font-medium">Pamerkan keahlian & cari kemitraan strategis.</p>
                    </div>
                  </button>

                  <button 
                    type="button"
                    onClick={() => setPendingType('bisnis')}
                    className="flex items-center gap-6 p-6 rounded-3xl border-2 border-slate-50 hover:border-teal-200 hover:bg-teal-50 transition-all group text-left"
                  >
                    <div className="size-12 rounded-2xl bg-teal-100 text-teal-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Briefcase className="size-6" />
                    </div>
                    <div>
                      <h4 className="font-black text-slate-900">Profil Bisnis</h4>
                      <p className="text-xs text-slate-400 font-medium">Kelola peluang & akses intelijen pasar.</p>
                    </div>
                  </button>
                </div>
              ) : (
                <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
                  <div className="flex items-center gap-2 mb-4">
                    <Button variant="ghost" size="sm" onClick={() => setPendingType(null)} className="h-8 px-2 font-bold text-xs">← Kembali</Button>
                    <Badge className={cn(
                      "px-3 py-1 font-black text-[10px] uppercase border-none ml-auto",
                      pendingType === 'pribadi' ? "bg-teal-100 text-teal-600" :
                      pendingType === 'professional' ? "bg-emerald-100 text-emerald-600" :
                      "bg-teal-100 text-teal-600"
                    )}>
                      {pendingType}
                    </Badge>
                  </div>

                  <div className="flex flex-col items-center gap-4">
                    <div 
                      onClick={() => setIsMediaPickerOpen(true)}
                      className="size-24 rounded-3xl bg-slate-100 border-2 border-dashed border-slate-300 flex items-center justify-center text-slate-400 group cursor-pointer hover:border-teal-600 hover:bg-teal-50 transition-all overflow-hidden"
                    >
                      {regFormData.avatar ? (
                        <img src={regFormData.avatar} className="w-full h-full object-cover" alt="Profile" />
                      ) : (
                        <Camera className="size-8 group-hover:scale-110 transition-transform" />
                      )}
                    </div>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Unggah Foto Profil</span>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label className="font-bold text-slate-700">Nama Tampilan / Bisnis</Label>
                      <Input 
                        required
                        value={regFormData.name}
                        onChange={(e) => setRegFormData({...regFormData, name: e.target.value})}
                        placeholder={pendingType === 'bisnis' ? "e.g. Acme Corp" : "e.g. John Doe"}
                        className="rounded-xl border-slate-200 h-12 bg-slate-50/50 focus:bg-white"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="font-bold text-slate-700">Bio / Deskripsi Singkat</Label>
                      <Textarea 
                        required
                        value={regFormData.bio}
                        onChange={(e) => setRegFormData({...regFormData, bio: e.target.value})}
                        placeholder="Ceritakan tentang diri Anda..."
                        className="rounded-xl border-slate-200 min-h-[80px] bg-slate-50/50 focus:bg-white"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="font-bold text-slate-700">Kontak (WhatsApp)</Label>
                      <Input 
                        required
                        value={regFormData.contact}
                        onChange={(e) => setRegFormData({...regFormData, contact: e.target.value})}
                        placeholder="+62 8..."
                        className="rounded-xl border-slate-200 h-12 bg-slate-50/50 focus:bg-white"
                      />
                    </div>

                    {pendingType === 'professional' && (
                      <div className="space-y-2 animate-in fade-in slide-in-from-top-2">
                        <Label className="font-bold text-slate-700">Keahlian Utama (Skills)</Label>
                        <Input 
                          required
                          value={regFormData.extra}
                          onChange={(e) => setRegFormData({...regFormData, extra: e.target.value})}
                          placeholder="e.g. Designer, Developer, Marketing"
                          className="rounded-xl border-slate-200 h-12 bg-slate-50/50 focus:bg-white"
                        />
                      </div>
                    )}

                    {pendingType === 'bisnis' && (
                      <div className="space-y-2 animate-in fade-in slide-in-from-top-2">
                        <Label className="font-bold text-slate-700">Kategori Industri</Label>
                        <Select value={regFormData.extra} onValueChange={(v) => setRegFormData({...regFormData, extra: v})}>
                          <SelectTrigger className="rounded-xl border-slate-200 h-12 bg-slate-50/50 focus:bg-white">
                            <SelectValue placeholder="Pilih Sektor" />
                          </SelectTrigger>
                          <SelectContent className="rounded-xl">
                            <SelectItem value="Tech & SaaS">Tech & SaaS</SelectItem>
                            <SelectItem value="Logistics">Logistics</SelectItem>
                            <SelectItem value="Retail">Retail</SelectItem>
                            <SelectItem value="Service">Service Provider</SelectItem>
                            <SelectItem value="F&B">Food & Beverage</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {pendingType && (
              <DialogFooter className="p-8 pt-4 bg-slate-50 border-t border-slate-100">
                <Button 
                  type="submit"
                  className="w-full h-14 rounded-2xl bg-teal-600 hover:bg-teal-700 text-white font-black text-lg shadow-xl shadow-teal-100 transition-all active:scale-95"
                >
                  Selesaikan & Masuk Beranda
                </Button>
              </DialogFooter>
            )}
          </form>
        </DialogContent>
      </Dialog>

      {/* Global Media Source Picker Modal */}
      <Dialog open={isMediaPickerOpen} onOpenChange={setIsMediaPickerOpen}>
        <DialogContent className="max-w-md rounded-[3rem] p-8 border-none shadow-2xl bg-white z-[110]">
          <DialogHeader className="text-center sm:text-center">
            <DialogTitle className="text-2xl font-black">Impor Gambar</DialogTitle>
            <DialogDescription>Pilih sumber foto profil Anda.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-8">
            <Button 
              variant="outline" 
              onClick={() => fileInputRef.current?.click()}
              className="h-20 rounded-2xl border-slate-100 bg-slate-50 hover:bg-teal-50 hover:border-teal-200 hover:text-teal-600 group transition-all justify-start gap-6 px-6"
            >
              <div className="size-12 rounded-xl bg-white shadow-sm flex items-center justify-center group-hover:scale-110 transition-transform">
                <Smartphone className="size-6" />
              </div>
              <div className="text-left">
                <p className="font-black text-sm uppercase tracking-widest">Perangkat</p>
                <p className="text-[10px] font-bold opacity-60">Ambil dari memori telepon</p>
              </div>
            </Button>

            <Button 
              variant="outline" 
              onClick={() => handleCloudSource('drive')}
              className="h-20 rounded-2xl border-slate-100 bg-slate-50 hover:bg-teal-50 hover:border-teal-200 hover:text-teal-600 group transition-all justify-start gap-6 px-6"
            >
              <div className="size-12 rounded-xl bg-white shadow-sm flex items-center justify-center group-hover:scale-110 transition-transform">
                <Cloud className="size-6 text-blue-500" />
              </div>
              <div className="text-left">
                <p className="font-black text-sm uppercase tracking-widest">Google Drive</p>
                <p className="text-[10px] font-bold opacity-60">Gunakan file Drive</p>
              </div>
            </Button>

            <Button 
              variant="outline" 
              onClick={() => handleCloudSource('photos')}
              className="h-20 rounded-2xl border-slate-100 bg-slate-50 hover:bg-teal-50 hover:border-teal-200 hover:text-teal-600 group transition-all justify-start gap-6 px-6"
            >
              <div className="size-12 rounded-xl bg-white shadow-sm flex items-center justify-center group-hover:scale-110 transition-transform">
                <ImageIcon className="size-6 text-rose-500" />
              </div>
              <div className="text-left">
                <p className="font-black text-sm uppercase tracking-widest">Google Photos</p>
                <p className="text-[10px] font-bold opacity-60">Pilih momen terbaik Anda</p>
              </div>
            </Button>
          </div>
          <DialogFooter>
             <Button variant="ghost" onClick={() => setIsMediaPickerOpen(false)} className="w-full font-bold">Batal</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AIAssistant />
    </div>
  );
}
