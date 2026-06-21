
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
  Plus
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
    contact: "",
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
        <div className="relative size-16 mb-4">
          <div className="absolute inset-0 border-4 border-accent/20 rounded-2xl" />
          <div className="absolute inset-0 border-4 border-accent rounded-2xl border-t-transparent animate-spin" />
        </div>
        <p className="text-muted-foreground font-black uppercase tracking-widest text-[10px] animate-pulse">Authorizing Session...</p>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground font-body relative">
      <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />
      
      <header className="sticky top-0 z-[100] w-full border-b bg-background/80 backdrop-blur-md px-4 h-14 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-2">
          <Link href="/feed" className="flex items-center gap-2">
            <div className="size-8 rounded-lg bg-accent flex items-center justify-center text-white font-black text-xl shadow-lg shadow-accent/20">
              O
            </div>
            <span className="font-headline font-black text-lg tracking-tight text-foreground">OnTapp</span>
          </Link>
          <Badge variant="outline" className="text-[9px] font-black uppercase tracking-tighter px-1.5 py-0 border-accent/30 text-accent bg-accent/5">
            {activeAccount?.type || 'Beta'}
          </Badge>
        </div>
        
        <div className="flex items-center gap-2">
          <Link href="/messages">
            <Button variant="ghost" size="icon" className="p-2 text-foreground/70 hover:bg-accent/10 hover:text-accent rounded-full transition">
              <MessageSquare className="size-5" />
            </Button>
          </Link>

          <Link href="/notifications">
            <Button variant="ghost" size="icon" className="relative p-2 text-foreground/70 hover:bg-accent/10 hover:text-accent rounded-full transition">
              <Bell className="size-5" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-background"></span>
            </Button>
          </Link>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center rounded-full border-2 border-accent/20 hover:border-accent transition p-0.5 outline-none">
                <Avatar className="h-7 w-7 rounded-full shadow-sm">
                  <AvatarImage src={activeAccount.avatar} className="object-cover" />
                  <AvatarFallback className="bg-accent text-white font-bold text-[10px]">{activeAccount.name[0]}</AvatarFallback>
                </Avatar>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-72 rounded-2xl p-2 shadow-2xl border-border bg-card">
              <DropdownMenuLabel className="px-3 py-2 text-[10px] font-black text-muted-foreground uppercase tracking-widest border-b mb-2">
                Menu Akun
              </DropdownMenuLabel>
              
              <DropdownMenuGroup>
                <Link href="/profile">
                  <DropdownMenuItem className="flex items-center gap-3 px-3 py-3 rounded-xl font-bold cursor-pointer transition-colors mb-1 hover:bg-accent/10 hover:text-accent">
                    <div className="size-8 rounded-xl bg-accent/10 flex items-center justify-center text-accent">
                      <User className="size-4" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm leading-none mb-1">{t('view_profile')}</span>
                      <span className="text-[9px] uppercase tracking-widest opacity-60">Manage Portfolio</span>
                    </div>
                  </DropdownMenuItem>
                </Link>

                <DropdownMenuSeparator className="my-2" />
                <DropdownMenuLabel className="px-3 py-1 text-[9px] font-black text-muted-foreground uppercase tracking-widest">
                  Ganti Profil
                </DropdownMenuLabel>

                {availableAccounts.filter(a => !a.isNew).map((acc) => (
                  <DropdownMenuItem 
                    key={acc.id}
                    onSelect={() => handleSwitchAccount(acc.id)}
                    className={cn(
                      "flex items-center justify-between px-3 py-3 rounded-xl font-bold cursor-pointer transition-colors mb-1",
                      activeAccount.id === acc.id 
                        ? "bg-accent/10 text-accent" 
                        : "text-foreground focus:bg-accent/10 focus:text-accent"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <Avatar className="size-8 rounded-xl">
                        <AvatarImage src={acc.avatar} className="object-cover" />
                        <AvatarFallback className="text-[8px] bg-muted">{acc.name[0]}</AvatarFallback>
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
                <DropdownMenuSubTrigger className="gap-3 px-3 py-2.5 rounded-xl font-bold text-foreground focus:bg-accent/10 focus:text-accent cursor-pointer">
                  <UserPlus className="size-4" />
                  Tambahkan Akun
                </DropdownMenuSubTrigger>
                <DropdownMenuPortal>
                  <DropdownMenuSubContent className="rounded-xl border-border shadow-xl p-1 min-w-[160px] bg-card text-foreground">
                    <DropdownMenuItem onSelect={() => handleOpenRegistration('pribadi')} className="font-bold px-4 py-2.5 rounded-lg cursor-pointer flex gap-3"><User className="size-4 text-muted-foreground" /> Pribadi</DropdownMenuItem>
                    <DropdownMenuItem onSelect={() => handleOpenRegistration('professional')} className="font-bold px-4 py-2.5 rounded-lg cursor-pointer flex gap-3"><ShieldCheck className="size-4 text-emerald-400" /> Professional</DropdownMenuItem>
                    <DropdownMenuItem onSelect={() => handleOpenRegistration('bisnis')} className="font-bold px-4 py-2.5 rounded-lg cursor-pointer flex gap-3"><Briefcase className="size-4 text-accent" /> Bisnis</DropdownMenuItem>
                  </DropdownMenuSubContent>
                </DropdownMenuPortal>
              </DropdownMenuSub>

              <DropdownMenuSeparator className="my-2" />
              <DropdownMenuItem onClick={handleLogout} className="text-rose-500 font-bold px-3 py-2.5 rounded-xl focus:bg-rose-500/10 focus:text-rose-500 cursor-pointer flex gap-3">
                <LogOut className="size-4" /> Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      <main className="flex-1 pb-28 pt-4 px-4 w-full overflow-x-hidden relative">
        <div className="max-w-4xl mx-auto">
          {children}
        </div>
      </main>

      <nav className="fixed bottom-0 left-0 right-0 z-[90] border-t bg-background/95 backdrop-blur-md pb-safe shadow-[0_-4px_12px_rgba(0,0,0,0.1)]">
        <div className="grid grid-cols-3 h-16 items-center justify-items-center text-[10px] font-black uppercase tracking-widest text-muted-foreground relative">
          
          <Link href="/feed" className={cn("flex flex-col items-center gap-1 w-full py-2 transition-colors", pathname === "/feed" ? "text-accent" : "hover:text-accent")}>
            <Rss className="size-6" />
            <span>{t('feed')}</span>
          </Link>

          <Link href="/cari" className={cn("flex flex-col items-center gap-1 w-full py-2 transition-colors", pathname === "/cari" ? "text-accent" : "hover:text-accent")}>
            <Search className="size-6" />
            <span>{t('search')}</span>
          </Link>

          <div className="relative w-full h-full flex flex-col items-center justify-center">
            {pathname === '/feed' && (
              <button 
                onClick={() => window.dispatchEvent(new CustomEvent('open-post-modal'))}
                className="absolute bottom-36 w-12 h-12 bg-accent rounded-full flex items-center justify-center text-white shadow-xl hover:bg-accent/80 transition active:scale-95 z-[96] ring-4 ring-background"
              >
                <Plus className="size-6" />
              </button>
            )}

            <button 
              onClick={() => window.dispatchEvent(new CustomEvent('open-ai-assistant'))}
              className="absolute bottom-20 w-12 h-12 bg-accent rounded-full flex items-center justify-center text-white shadow-xl hover:bg-accent/80 transition active:scale-95 z-[95] ring-4 ring-background"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>
            </button>

            <Sheet open={isMoreMenuOpen} onOpenChange={setIsMoreMenuOpen}>
              <SheetTrigger asChild>
                <button className="flex flex-col items-center gap-1 hover:text-accent w-full py-2 outline-none"><Menu className="size-6" /><span>{t('more')}</span></button>
              </SheetTrigger>
              <SheetContent 
                side="bottom" 
                className="rounded-t-[2.5rem] border-none p-0 h-[90vh] bg-card overflow-hidden"
                onTouchStart={handleTouchStart}
                onTouchEnd={handleTouchEnd}
              >
                <div className="w-full flex justify-center pt-4 pb-2">
                  <div className="w-12 h-1.5 bg-muted-foreground/20 rounded-full" />
                </div>

                <SheetHeader className="p-8 pt-2 pb-4 bg-muted border-b border-border">
                  <div className="flex items-center justify-between">
                    <SheetTitle className="text-xl font-black text-foreground tracking-tight flex items-center gap-2"><LayoutGrid className="size-5 text-accent" />OnTapp Hub</SheetTitle>
                    <Badge variant="outline" className="bg-card border-border text-muted-foreground font-bold px-3 uppercase text-[10px]">{activeAccount?.type} Mode</Badge>
                  </div>
                </SheetHeader>
                <div className="overflow-y-auto h-full pb-32 no-scrollbar">
                  <div className="flex flex-col divide-y divide-border">
                    {drawerItems.map((item) => (
                      <Link key={item.href} href={item.href} onClick={() => setIsMoreMenuOpen(false)} className={cn("flex items-center px-8 py-5 transition-colors gap-6 group", pathname === item.href ? "bg-accent/5 text-accent" : "bg-transparent hover:bg-accent/10")}>
                        <div className={cn("size-10 rounded-xl flex items-center justify-center transition-all group-hover:scale-110 shadow-sm", pathname === item.href ? "bg-accent text-white" : "bg-muted text-muted-foreground")}><item.icon className="size-5" /></div>
                        <span className="text-sm font-black uppercase tracking-widest">{item.label}</span>
                        <ChevronRight className="ml-auto size-4 text-muted-foreground/30 group-hover:text-accent transition-colors" />
                      </Link>
                    ))}
                    <div className="px-8 py-6 bg-card">
                      <div className="flex items-center gap-6 mb-4">
                        <div className="size-10 rounded-xl bg-muted text-muted-foreground flex items-center justify-center">
                          <Languages className="size-5" />
                        </div>
                        <span className="text-sm font-black uppercase tracking-widest">Bahasa</span>
                      </div>
                      <LanguagePicker />
                    </div>
                    <button onClick={handleLogout} className="flex items-center px-8 py-6 bg-rose-500/5 hover:bg-rose-500/10 transition-colors gap-6 group text-rose-500 w-full text-left">
                      <div className="size-10 rounded-xl bg-card border border-rose-500/20 flex items-center justify-center shadow-sm">
                        <LogOut className="size-5" />
                      </div>
                      <span className="text-sm font-black uppercase tracking-widest">Logout</span>
                      <ChevronRight className="ml-auto size-4 opacity-50" />
                    </button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </nav>

      <Dialog open={isRegModalOpen} onOpenChange={(open) => { if (activeAccount?.isNew) return; setIsRegModalOpen(open); }}>
        <DialogContent className="max-w-md rounded-[2.5rem] p-0 border-none shadow-2xl overflow-hidden bg-card text-foreground">
          <form onSubmit={handleRegisterSubmit} className="flex flex-col h-full">
            <DialogHeader className="p-8 pb-4 bg-muted border-b border-border text-center sm:text-center">
              <div className="flex flex-col items-center gap-4 mb-2">
                <div className="size-16 rounded-2xl bg-accent text-white flex items-center justify-center font-black text-2xl shadow-xl">O</div>
                <DialogTitle className="text-2xl font-black tracking-tight">Selamat Datang</DialogTitle>
                <DialogDescription className="font-medium text-muted-foreground">Pilih jenis profil untuk mulai terhubung.</DialogDescription>
              </div>
            </DialogHeader>
            <div className="p-8 space-y-6 overflow-y-auto max-h-[60vh] no-scrollbar">
              {!pendingType ? (
                <div className="grid gap-4 animate-in fade-in zoom-in-95 duration-300">
                  {['pribadi', 'professional', 'bisnis'].map((type) => (
                    <button key={type} type="button" onClick={() => setPendingType(type as AccountType)} className="flex items-center gap-6 p-6 rounded-3xl border-2 border-muted hover:border-accent hover:bg-accent/5 transition-all group text-left">
                      <div className="size-12 rounded-2xl bg-accent/10 text-accent flex items-center justify-center group-hover:scale-110 transition-transform">
                        {type === 'pribadi' ? <User className="size-6" /> : type === 'professional' ? <ShieldCheck className="size-6" /> : <Briefcase className="size-6" />}
                      </div>
                      <div>
                        <h4 className="font-black text-foreground capitalize">Profil {type}</h4>
                        <p className="text-xs text-muted-foreground font-medium">{type === 'pribadi' ? 'Berbagi momen harian.' : type === 'professional' ? 'Pamerkan portofolio Anda.' : 'Akses intelijen pasar.'}</p>
                      </div>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
                  <div className="flex items-center gap-2 mb-4">
                    <Button variant="ghost" size="sm" onClick={() => setPendingType(null)} className="h-8 px-2 font-bold text-xs">← Kembali</Button>
                    <Badge className="px-3 py-1 font-black text-[10px] uppercase border-none ml-auto bg-accent/10 text-accent">{pendingType}</Badge>
                  </div>
                  <div className="flex flex-col items-center gap-4">
                    <div onClick={() => setIsMediaPickerOpen(true)} className="size-24 rounded-3xl bg-muted border-2 border-dashed border-border flex items-center justify-center text-muted-foreground group cursor-pointer hover:border-accent hover:bg-accent/5 transition-all overflow-hidden">
                      {regFormData.avatar ? <img src={regFormData.avatar} className="w-full h-full object-cover" alt="Profile" /> : <Camera className="size-8 group-hover:scale-110 transition-transform" />}
                    </div>
                    <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Foto Profil</span>
                  </div>
                  <div className="space-y-4">
                    <div className="space-y-2"><Label className="font-bold">Nama Tampilan</Label><Input required value={regFormData.name} onChange={(e) => setRegFormData({...regFormData, name: e.target.value})} className="rounded-xl h-12 bg-muted/50 border-none" /></div>
                    <div className="space-y-2"><Label className="font-bold">Bio</Label><Textarea required value={regFormData.bio} onChange={(e) => setRegFormData({...regFormData, bio: e.target.value})} className="rounded-xl border-none min-h-[80px] bg-muted/50" /></div>
                    <div className="space-y-2"><Label className="font-bold">WhatsApp</Label><Input required value={regFormData.contact} onChange={(e) => setRegFormData({...regFormData, contact: e.target.value})} placeholder="+62 8..." className="rounded-xl border-none h-12 bg-muted/50" /></div>
                    {pendingType === 'professional' && <div className="space-y-2"><Label className="font-bold">Keahlian (Skills)</Label><Input required value={regFormData.extra} onChange={(e) => setRegFormData({...regFormData, extra: e.target.value})} placeholder="e.g. Designer" className="rounded-xl border-none h-12 bg-muted/50" /></div>}
                    {pendingType === 'bisnis' && <div className="space-y-2"><Label className="font-bold">Kategori Industri</Label><Select value={regFormData.extra} onValueChange={(v) => setRegFormData({...regFormData, extra: v})}><SelectTrigger className="rounded-xl border-none h-12 bg-muted/50"><SelectValue placeholder="Sektor" /></SelectTrigger><SelectContent><SelectItem value="Tech">Tech</SelectItem><SelectItem value="Logistics">Logistics</SelectItem><SelectItem value="Retail">Retail</SelectItem><SelectItem value="F&B">F&B</SelectItem></SelectContent></Select></div>}
                  </div>
                </div>
              )}
            </div>
            {pendingType && <DialogFooter className="p-8 pt-4 bg-muted border-t border-border"><Button type="submit" className="w-full h-14 rounded-2xl bg-accent text-white font-black">Selesaikan</Button></DialogFooter>}
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={isMediaPickerOpen} onOpenChange={setIsMediaPickerOpen}>
        <DialogContent className="max-w-md rounded-[3rem] p-8 border-none shadow-2xl bg-card text-foreground">
          <DialogHeader className="text-center sm:text-center"><DialogTitle className="text-2xl font-black">Impor Gambar</DialogTitle></DialogHeader>
          <div className="grid gap-4 py-8">
            <Button variant="outline" disabled={isCloudLoading} onClick={() => fileInputRef.current?.click()} className="h-20 rounded-2xl border-border bg-muted/50 hover:bg-accent/10 justify-start gap-6 px-6"><Smartphone className="size-6 text-accent" /><div className="text-left font-black text-sm uppercase">Perangkat</div></Button>
            <Button variant="outline" disabled={isCloudLoading} onClick={() => handleCloudSource('drive')} className="h-20 rounded-2xl border-border bg-muted/50 hover:bg-accent/10 justify-start gap-6 px-6"><Cloud className="size-6 text-blue-500" /><div className="text-left font-black text-sm uppercase">Google Drive</div></Button>
            <Button variant="outline" disabled={isCloudLoading} onClick={() => handleCloudSource('photos')} className="h-20 rounded-2xl border-border bg-muted/50 hover:bg-accent/10 justify-start gap-6 px-6"><ImageIcon className="size-6 text-rose-500" /><div className="text-left font-black text-sm uppercase">Google Photos</div></Button>
          </div>
          <DialogFooter><Button variant="ghost" onClick={() => setIsMediaPickerOpen(false)} className="w-full font-bold text-muted-foreground">Batal</Button></DialogFooter>
        </DialogContent>
      </Dialog>

      <AIAssistant />
    </div>
  );
}
