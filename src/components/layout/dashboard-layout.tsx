
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
  Image as ImageIcon,
  RefreshCw,
  Plus,
  Handshake
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
  
  const [touchStart, setTouchStart] = React.useState<number | null>(null);
  
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientY);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStart === null) return;
    const touchEnd = e.changedTouches[0].clientY;
    const distance = touchEnd - touchStart;
    
    const scrollContainer = e.currentTarget.querySelector('.overflow-y-auto');
    const isAtTop = scrollContainer ? scrollContainer.scrollTop <= 0 : true;

    if (distance > 100 && isAtTop) {
      setIsMoreMenuOpen(false);
    }
    setTouchStart(null);
  };

  const [isRegModalOpen, setIsRegModalOpen] = React.useState(false);
  const [pendingType, setPendingType] = React.useState<AccountType | null>(null);
  const [regFormData, setRegFormData] = React.useState({
    name: "",
    bio: "",
    extra: "",
    avatar: ""
  });

  const [isMediaPickerOpen, setIsMediaPickerOpen] = React.useState(false);
  const [isCloudLoading, setIsCloudLoading] = React.useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const getDrawerItems = () => {
    const baseItems = [
      { icon: User, label: t('profile'), href: "/profile", roles: ['pribadi', 'professional', 'bisnis'] },
      { icon: LayoutDashboard, label: t('dashboard'), href: "/dashboard", roles: ['pribadi', 'professional', 'bisnis'] },
      { icon: Bookmark, label: t('saved'), href: "/saved", roles: ['pribadi', 'professional', 'bisnis'] },
      { icon: Users, label: t('communities'), href: "/communities", roles: ['pribadi', 'professional', 'bisnis'] },
      { icon: Rss, label: t('feed'), href: "/feed", roles: ['pribadi', 'professional', 'bisnis'] },
      { icon: Search, label: t('search'), href: "/cari", roles: ['pribadi', 'professional', 'bisnis'] },
      
      { icon: Handshake, label: t('matchmaker'), href: "/matchmaker", roles: ['professional', 'bisnis'] },
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
    ).sort((a, b) => {
      if (a.href === "/profile") return -1;
      if (b.href === "/profile") return 1;
      return 0;
    });
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
    setRegFormData({ name: "", bio: "", extra: "", avatar: "" });
    setIsRegModalOpen(true);
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pendingType) return;

    if (!regFormData.name.trim()) {
      toast({
        variant: "destructive",
        title: "Input Diperlukan",
        description: "Nama Tampilan wajib diisi untuk melanjutkan."
      });
      return;
    }
    
    registerAccount({
      name: regFormData.name,
      type: pendingType,
      bio: regFormData.bio,
      extra: regFormData.extra
    });

    setIsRegModalOpen(false);
    router.push("/profile");
  };

  const handleSwitchAccount = (accountId: string) => {
    switchAccount(accountId);
    router.push("/profile");
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setRegFormData(prev => ({ ...prev, avatar: reader.result as string }));
        setIsMediaPickerOpen(false);
        toast({ title: "Foto profil disiapkan" });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCloudSource = (source: 'drive' | 'photos') => {
    setIsCloudLoading(true);
    toast({ title: "Menghubungkan layanan Cloud..." });

    setTimeout(() => {
      const simulatedUrl = `https://picsum.photos/seed/reg${Date.now()}/200/200`;
      setRegFormData(prev => ({ ...prev, avatar: simulatedUrl }));
      setIsCloudLoading(false);
      setIsMediaPickerOpen(false);
      toast({ title: "Gambar berhasil diimpor" });
    }, 1500);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background">
        <div className="relative size-12 mb-4">
          <div className="absolute inset-0 border-4 border-accent/20 rounded-2xl" />
          <div className="absolute inset-0 border-4 border-accent rounded-2xl border-t-transparent animate-spin" />
        </div>
        <p className="text-muted-foreground font-black uppercase tracking-widest text-[9px] animate-pulse">Authorizing Session...</p>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground font-body relative">
      <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />
      
      <header className="sticky top-0 z-[100] w-full border-b bg-background/80 backdrop-blur-md px-4 h-12 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-2">
          <Link href="/feed" className="flex items-center gap-2">
            <div className="size-7 rounded-lg bg-accent flex items-center justify-center text-white font-black text-lg shadow-lg shadow-accent/20">
              O
            </div>
            <span className="font-headline font-black text-base tracking-tight text-foreground">OnTapp</span>
          </Link>
          <Badge variant="outline" className="text-[8px] font-black uppercase tracking-tighter px-1.5 py-0 border-accent/30 text-accent bg-accent/5">
            {activeAccount?.type || 'Beta'}
          </Badge>
        </div>
        
        <div className="flex items-center gap-2">
          <Link href="/messages">
            <Button variant="ghost" size="icon" className="size-9 text-foreground/70 hover:bg-accent/10 hover:text-accent rounded-full transition">
              <MessageSquare className="size-4" />
            </Button>
          </Link>

          <Link href="/notifications">
            <Button variant="ghost" size="icon" className="relative size-9 text-foreground/70 hover:bg-accent/10 hover:text-accent rounded-full transition">
              <Bell className="size-4" />
              <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-rose-500 rounded-full ring-2 ring-background"></span>
            </Button>
          </Link>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center rounded-full border-2 border-accent/20 hover:border-accent transition p-0.5 outline-none">
                <Avatar className="h-6 w-6 rounded-full shadow-sm">
                  <AvatarImage src={activeAccount.avatar} className="object-cover" />
                  <AvatarFallback className="bg-accent text-white font-bold text-[8px]">{activeAccount.name[0]}</AvatarFallback>
                </Avatar>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-64 rounded-2xl p-2 shadow-2xl border-border bg-card">
              <DropdownMenuLabel className="px-3 py-1.5 text-[9px] font-black text-muted-foreground uppercase tracking-widest border-b mb-1">
                Menu Akun
              </DropdownMenuLabel>
              
              <DropdownMenuGroup>
                <Link href="/profile">
                  <DropdownMenuItem className="flex items-center gap-3 px-3 py-2.5 rounded-xl font-bold cursor-pointer transition-colors mb-0.5 hover:bg-accent/10 hover:text-accent">
                    <div className="size-7 rounded-lg bg-accent/10 flex items-center justify-center text-accent">
                      <User className="size-3.5" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs leading-none mb-0.5">{t('view_profile')}</span>
                      <span className="text-[8px] uppercase tracking-widest opacity-60">Manage Portfolio</span>
                    </div>
                  </DropdownMenuItem>
                </Link>

                <DropdownMenuSeparator className="my-1.5" />
                <DropdownMenuLabel className="px-3 py-1 text-[8px] font-black text-muted-foreground uppercase tracking-widest">
                  Ganti Profil
                </DropdownMenuLabel>

                {availableAccounts.filter(a => !a.isNew).map((acc) => (
                  <DropdownMenuItem 
                    key={acc.id}
                    onSelect={() => handleSwitchAccount(acc.id)}
                    className={cn(
                      "flex items-center justify-between px-3 py-2.5 rounded-xl font-bold cursor-pointer transition-colors mb-0.5",
                      activeAccount.id === acc.id 
                        ? "bg-accent/10 text-accent" 
                        : "text-foreground focus:bg-accent/10 focus:text-accent"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <Avatar className="size-7 rounded-lg">
                        <AvatarImage src={acc.avatar} className="object-cover" />
                        <AvatarFallback className="text-[7px] bg-muted">{acc.name[0]}</AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <span className="text-xs leading-none mb-0.5">{acc.name}</span>
                        <span className="text-[8px] uppercase tracking-widest opacity-60">{acc.type}</span>
                      </div>
                    </div>
                    {activeAccount.id === acc.id && <Check className="size-3.5" />}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuGroup>

              <DropdownMenuSeparator className="my-1.5" />

              <DropdownMenuSub>
                <DropdownMenuSubTrigger className="gap-3 px-3 py-2 rounded-xl font-bold text-xs text-foreground focus:bg-accent/10 focus:text-accent cursor-pointer">
                  <UserPlus className="size-3.5" />
                  Tambahkan Akun
                </DropdownMenuSubTrigger>
                <DropdownMenuPortal>
                  <DropdownMenuSubContent className="rounded-xl border-border shadow-xl p-1 min-w-[140px] bg-card text-foreground">
                    <DropdownMenuItem onSelect={() => handleOpenRegistration('pribadi')} className="font-bold text-xs px-3 py-2 rounded-lg cursor-pointer flex gap-2.5"><User className="size-3.5 text-muted-foreground" /> Pribadi</DropdownMenuItem>
                    <DropdownMenuItem onSelect={() => handleOpenRegistration('professional')} className="font-bold text-xs px-3 py-2 rounded-lg cursor-pointer flex gap-2.5"><ShieldCheck className="size-3.5 text-emerald-400" /> Professional</DropdownMenuItem>
                    <DropdownMenuItem onSelect={() => handleOpenRegistration('bisnis')} className="font-bold text-xs px-3 py-2 rounded-lg cursor-pointer flex gap-2.5"><Briefcase className="size-3.5 text-accent" /> Bisnis</DropdownMenuItem>
                  </DropdownMenuSubContent>
                </DropdownMenuPortal>
              </DropdownMenuSub>

              <DropdownMenuSeparator className="my-1.5" />
              <DropdownMenuItem onClick={handleLogout} className="text-rose-500 font-bold text-xs px-3 py-2 rounded-xl focus:bg-rose-500/10 focus:text-rose-500 cursor-pointer flex gap-2.5">
                <LogOut className="size-3.5" /> Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      <main className="flex-1 pb-24 pt-2 px-3 w-full overflow-x-hidden relative">
        <div className="max-w-4xl mx-auto">
          {children}
        </div>
      </main>

      <nav className="fixed bottom-0 left-0 right-0 z-[90] border-t bg-background/95 backdrop-blur-md pb-safe shadow-[0_-4px_12px_rgba(0,0,0,0.05)]">
        <div className="grid grid-cols-3 h-14 items-center justify-items-center text-[9px] font-black uppercase tracking-widest text-muted-foreground relative">
          
          <Link href="/feed" className={cn("flex flex-col items-center gap-0.5 w-full py-1.5 transition-colors", pathname === "/feed" ? "text-accent" : "hover:text-accent")}>
            <Rss className="size-5" />
            <span>{t('feed')}</span>
          </Link>

          <Link href="/cari" className={cn("flex flex-col items-center gap-0.5 w-full py-1.5 transition-colors", pathname === "/cari" ? "text-accent" : "hover:text-accent")}>
            <Search className="size-5" />
            <span>{t('search')}</span>
          </Link>

          <div className="relative w-full h-full flex flex-col items-center justify-center">
            {pathname === '/feed' && (
              <button 
                onClick={() => window.dispatchEvent(new CustomEvent('open-post-modal'))}
                className="absolute bottom-28 w-10 h-10 bg-accent rounded-full flex items-center justify-center text-white shadow-xl hover:bg-accent/80 transition active:scale-95 z-[96] ring-4 ring-background"
              >
                <Plus className="size-5" />
              </button>
            )}

            <button 
              onClick={() => window.dispatchEvent(new CustomEvent('open-ai-assistant'))}
              className="absolute bottom-16 w-10 h-10 bg-accent rounded-full flex items-center justify-center text-white shadow-xl hover:bg-accent/80 transition active:scale-95 z-[95] ring-4 ring-background"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>
            </button>

            <Sheet open={isMoreMenuOpen} onOpenChange={setIsMoreMenuOpen}>
              <SheetTrigger asChild>
                <button className="flex flex-col items-center gap-0.5 hover:text-accent w-full py-1.5 outline-none"><Menu className="size-5" /><span>{t('more')}</span></button>
              </SheetTrigger>
              <SheetContent 
                side="bottom" 
                className="rounded-t-[2rem] border-none p-0 h-[85vh] bg-card overflow-hidden"
                onTouchStart={handleTouchStart}
                onTouchEnd={handleTouchEnd}
              >
                <div className="w-full flex justify-center pt-3 pb-1">
                  <div className="w-10 h-1 bg-muted-foreground/20 rounded-full" />
                </div>

                <SheetHeader className="p-6 pt-1 pb-3 bg-muted border-b border-border">
                  <div className="flex items-center justify-between">
                    <SheetTitle className="text-lg font-black text-foreground tracking-tight flex items-center gap-2"><LayoutGrid className="size-4 text-accent" />OnTapp Hub</SheetTitle>
                    <Badge variant="outline" className="bg-card border-border text-muted-foreground font-bold px-2 py-0 uppercase text-[8px]">{activeAccount?.type} Mode</Badge>
                  </div>
                </SheetHeader>
                <div className="overflow-y-auto h-full pb-24 no-scrollbar">
                  <div className="flex flex-col divide-y divide-border">
                    {drawerItems.map((item) => (
                      <Link key={item.href} href={item.href} onClick={() => setIsMoreMenuOpen(false)} className={cn("flex items-center px-6 py-4 transition-colors gap-5 group", pathname === item.href ? "bg-accent/5 text-accent" : "bg-transparent hover:bg-accent/10")}>
                        <div className={cn("size-9 rounded-xl flex items-center justify-center transition-all group-hover:scale-110 shadow-sm", pathname === item.href ? "bg-accent text-white" : "bg-muted text-muted-foreground")}><item.icon className="size-4.5" /></div>
                        <span className="text-xs font-black uppercase tracking-widest">{item.label}</span>
                        <ChevronRight className="ml-auto size-3.5 text-muted-foreground/30 group-hover:text-accent transition-colors" />
                      </Link>
                    ))}
                    <div className="px-6 py-5 bg-card">
                      <div className="flex items-center gap-5 mb-3">
                        <div className="size-9 rounded-xl bg-muted text-muted-foreground flex items-center justify-center">
                          <Languages className="size-4.5" />
                        </div>
                        <span className="text-xs font-black uppercase tracking-widest">Bahasa</span>
                      </div>
                      <LanguagePicker />
                    </div>
                    <button onClick={handleLogout} className="flex items-center px-6 py-5 bg-rose-500/5 hover:bg-rose-500/10 transition-colors gap-5 group text-rose-500 w-full text-left">
                      <div className="size-9 rounded-xl bg-card border border-rose-500/20 flex items-center justify-center shadow-sm">
                        <LogOut className="size-4.5" />
                      </div>
                      <span className="text-xs font-black uppercase tracking-widest">Logout</span>
                      <ChevronRight className="ml-auto size-3.5 opacity-50" />
                    </button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </nav>

      <Dialog open={isRegModalOpen} onOpenChange={(open) => { if (activeAccount?.isNew) return; setIsRegModalOpen(open); }}>
        <DialogContent className="w-full md:max-w-md p-0 border-none shadow-none md:shadow-2xl overflow-y-auto max-h-screen h-screen md:h-auto bg-card text-foreground rounded-none md:rounded-[2rem] outline-none no-scrollbar">
          <form onSubmit={handleRegisterSubmit} className="flex flex-col min-h-screen md:min-h-0">
            {/* Header / Welcome Section */}
            <div className="flex flex-col items-center justify-center text-center space-y-2.5 pt-10 pb-5 md:pt-10 md:pb-6 md:bg-muted md:border-b md:border-border px-5">
              <div className="size-14 md:size-16 rounded-full bg-accent text-white flex items-center justify-center font-black text-2xl md:text-3xl shadow-xl shadow-accent/20 animate-in zoom-in-50 duration-700">O</div>
              <div className="space-y-0.5">
                <DialogTitle className="text-xl md:text-2xl font-black tracking-tight">Selamat Datang</DialogTitle>
                <DialogDescription className="font-bold text-muted-foreground text-xs md:text-base">Pilih jenis profil untuk mulai terhubung.</DialogDescription>
              </div>
            </div>

            {/* Form Section */}
            <div className="flex-1 px-5 space-y-5 md:p-8">
              {!pendingType ? (
                <div className="grid gap-2.5 animate-in fade-in zoom-in-95 duration-300">
                  {['pribadi', 'professional', 'bisnis'].map((type) => (
                    <button key={type} type="button" onClick={() => setPendingType(type as AccountType)} className="flex items-center gap-3.5 md:gap-5 p-3.5 md:p-5 rounded-[1.25rem] md:rounded-[1.5rem] border-2 border-muted hover:border-accent hover:bg-accent/5 transition-all group text-left shadow-sm">
                      <div className="size-10 md:size-12 rounded-xl bg-accent/10 text-accent flex items-center justify-center group-hover:scale-110 transition-transform shrink-0">
                        {type === 'pribadi' ? <User className="size-5 md:size-6" /> : type === 'professional' ? <ShieldCheck className="size-5 md:size-6" /> : <Briefcase className="size-5 md:size-6" />}
                      </div>
                      <div>
                        <h4 className="font-black text-sm md:text-base text-foreground capitalize">Profil {type}</h4>
                        <p className="text-[10px] md:text-xs text-muted-foreground font-medium">{type === 'pribadi' ? 'Berbagi momen harian.' : type === 'professional' ? 'Pamerkan portofolio.' : 'Akses intelijen pasar.'}</p>
                      </div>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="space-y-5 animate-in slide-in-from-right-4 duration-500 pb-20">
                  <div className="flex items-center justify-between">
                    <Button variant="ghost" size="sm" onClick={() => setPendingType(null)} className="h-8 px-2 font-black text-[9px] uppercase tracking-widest text-muted-foreground hover:text-accent">← Kembali</Button>
                    <Badge className="px-3 py-1 font-black text-[8px] uppercase border-none bg-accent text-white shadow-lg shadow-accent/20 rounded-full">{pendingType}</Badge>
                  </div>
                  
                  <div className="flex flex-col items-center gap-1.5">
                    <div onClick={() => setIsMediaPickerOpen(true)} className="size-20 md:size-28 rounded-full bg-muted border-4 border-dashed border-border flex items-center justify-center text-muted-foreground group cursor-pointer hover:border-accent hover:bg-accent/5 transition-all overflow-hidden shadow-inner">
                      {regFormData.avatar ? <img src={regFormData.avatar} className="w-full h-full object-cover" alt="Profile" /> : <Camera className="size-6 md:size-8 group-hover:scale-110 transition-transform" />}
                    </div>
                    <span className="text-[8px] font-black text-muted-foreground uppercase tracking-widest">Pilih Foto Profil (Opsional)</span>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-1">
                      <Label className="font-black text-[9px] uppercase tracking-widest text-slate-500 ml-1">Nama Tampilan *</Label>
                      <Input 
                        required 
                        placeholder="Nama Lengkap atau Bisnis"
                        value={regFormData.name} 
                        onChange={(e) => setRegFormData({...regFormData, name: e.target.value})} 
                        className="rounded-xl h-11 md:h-12 bg-muted/30 border-border focus:bg-white focus:ring-2 focus:ring-accent/10 transition-all font-bold px-4 md:px-5 text-sm md:text-base" 
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="font-black text-[9px] uppercase tracking-widest text-slate-500 ml-1">Bio Singkat</Label>
                      <Textarea 
                        placeholder="Ceritakan sedikit tentang Anda..."
                        value={regFormData.bio} 
                        onChange={(e) => setRegFormData({...regFormData, bio: e.target.value})} 
                        className="rounded-xl border-border min-h-[80px] md:min-h-[100px] bg-muted/30 focus:bg-white focus:ring-2 focus:ring-accent/10 transition-all font-medium px-4 md:px-5 py-2.5 md:py-3.5 text-xs md:text-sm" 
                      />
                    </div>
                    {pendingType === 'professional' && (
                      <div className="space-y-1">
                        <Label className="font-black text-[9px] uppercase tracking-widest text-slate-500 ml-1">Keahlian (Skills)</Label>
                        <Input 
                          value={regFormData.extra} 
                          onChange={(e) => setRegFormData({...regFormData, extra: e.target.value})} 
                          placeholder="e.g. UI/UX Designer, Architect" 
                          className="rounded-xl h-11 md:h-12 bg-muted/30 border-border focus:bg-white font-bold px-4 md:px-5 text-xs md:text-sm" 
                        />
                      </div>
                    )}
                    {pendingType === 'bisnis' && (
                      <div className="space-y-1">
                        <Label className="font-black text-[9px] uppercase tracking-widest text-slate-500 ml-1">Sektor Industri</Label>
                        <Select value={regFormData.extra} onValueChange={(v) => setRegFormData({...regFormData, extra: v})}>
                          <SelectTrigger className="rounded-xl h-11 md:h-12 bg-muted/30 border-border focus:bg-white font-bold px-4 md:px-5 text-xs md:text-sm">
                            <SelectValue placeholder="Pilih Sektor" />
                          </SelectTrigger>
                          <SelectContent className="rounded-xl">
                            <SelectItem value="Tech">Teknologi & SaaS</SelectItem>
                            <SelectItem value="Logistics">Logistik & Distribusi</SelectItem>
                            <SelectItem value="Retail">Retail & E-commerce</SelectItem>
                            <SelectItem value="F&B">Food & Beverage</SelectItem>
                            <SelectItem value="Creative">Industri Kreatif</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    )}
                  </div>

                  <div className="pt-1.5">
                    <Button 
                      type="submit" 
                      disabled={!regFormData.name.trim()}
                      className="w-full h-12 md:h-14 rounded-xl bg-accent hover:bg-accent/90 text-white font-black text-base md:text-lg shadow-xl shadow-accent/20 active:scale-[0.98] transition-all"
                    >
                      Selesaikan Pendaftaran
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={isMediaPickerOpen} onOpenChange={setIsMediaPickerOpen}>
        <DialogContent className="w-[85%] md:max-w-md rounded-[2rem] md:rounded-[2.5rem] p-5 md:p-6 border-none shadow-2xl bg-card text-foreground outline-none">
          <DialogHeader className="text-center sm:text-center">
            <DialogTitle className="text-lg md:text-xl font-black tracking-tight">Impor Gambar</DialogTitle>
            <DialogDescription className="font-medium text-xs">Pilih sumber foto profil Anda.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-2.5 md:gap-3.5 py-5 md:py-6">
            <Button variant="outline" disabled={isCloudLoading} onClick={() => fileInputRef.current?.click()} className="h-14 md:h-16 rounded-xl border-border bg-muted/50 hover:bg-accent/10 justify-start gap-4 px-4 md:px-5">
              <Smartphone className="size-4 md:size-5 text-accent" />
              <div className="text-left">
                <p className="font-black text-[10px] md:text-xs uppercase tracking-widest">Perangkat</p>
                <p className="text-[7px] md:text-[9px] font-bold text-muted-foreground uppercase opacity-60">Galeri Lokal</p>
              </div>
            </Button>
            <Button variant="outline" disabled={isCloudLoading} onClick={() => handleCloudSource('drive')} className="h-14 md:h-16 rounded-xl border-border bg-muted/50 hover:bg-accent/10 justify-start gap-4 px-4 md:px-5">
              <Cloud className="size-4 md:size-5 text-blue-500" />
              <div className="text-left">
                <p className="font-black text-[10px] md:text-xs uppercase tracking-widest">Google Drive</p>
                <p className="text-[7px] md:text-[9px] font-bold text-muted-foreground uppercase opacity-60">Impor Cloud</p>
              </div>
            </Button>
            <Button variant="outline" disabled={isCloudLoading} onClick={() => handleCloudSource('photos')} className="h-14 md:h-16 rounded-xl border-border bg-muted/50 hover:bg-accent/10 justify-start gap-4 px-4 md:px-5">
              <ImageIcon className="size-4 md:size-5 text-rose-500" />
              <div className="text-left">
                <p className="font-black text-[10px] md:text-xs uppercase tracking-widest">Google Photos</p>
                <p className="text-[7px] md:text-[9px] font-bold text-muted-foreground uppercase opacity-60">Arsip Foto</p>
              </div>
            </Button>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setIsMediaPickerOpen(false)} className="w-full font-black text-[9px] md:text-xs uppercase tracking-widest text-muted-foreground">Batal</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AIAssistant />
    </div>
  );
}
