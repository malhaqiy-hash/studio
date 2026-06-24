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
  DialogFooter,
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
    
    if (distance > 70) {
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
    avatar: "",
    visibility: 'public' as 'public' | 'private'
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
      
      { icon: Radar, label: t('scout'), href: "/scout", roles: ['bisnis', 'professional'] },
      { icon: Handshake, label: t('matchmaker'), href: "/matchmaker", roles: ['bisnis', 'professional'] },
      { icon: TrendingUp, label: t('market_radar'), href: "/market-radar", roles: ['bisnis'] },
      { icon: Magnet, label: t('reverse_discovery'), href: "/reverse-discovery", roles: ['bisnis'] },
      { icon: MapIcon, label: t('opportunity_map'), href: "/opportunity-map", roles: ['bisnis'] },
      { icon: Building2, label: t('registry'), href: "/registry", roles: ['bisnis', 'professional'] },
      { icon: BookOpen, label: t('knowledge'), href: "/knowledge", roles: ['pribadi', 'professional', 'bisnis'] },

      { icon: Briefcase, label: t('opportunities'), href: "/opportunities", roles: ['bisnis', 'professional'] },
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
      
      <header className="sticky top-0 z-[100] w-full border-b bg-background/80 backdrop-blur-md px-4 h-14 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-2">
          <Link href="/feed" className="flex items-center gap-2 active:scale-95 transition-transform">
            <div className="size-8 rounded-xl bg-primary text-primary-foreground flex items-center justify-center font-black text-xl shadow-lg shadow-primary/20">T</div>
            <span className="font-black text-lg tracking-tight text-foreground uppercase">Tapp</span>
          </Link>
          <Badge variant="secondary" className="text-[10px] font-black uppercase px-2 py-0.5 border-none bg-primary/10 text-primary">{activeAccount?.type}</Badge>
        </div>
        
        <div className="flex items-center gap-2">
          <Link href="/messages"><Button variant="ghost" size="icon" className="size-9 text-foreground/70 hover:bg-primary/5 hover:text-primary rounded-full transition"><MessageSquare className="size-5" /></Button></Link>
          <Link href="/notifications"><Button variant="ghost" size="icon" className="relative size-9 text-foreground/70 hover:bg-primary/5 hover:text-primary rounded-full transition"><Bell className="size-5" /><span className="absolute top-2 right-2 size-2.5 bg-primary rounded-full ring-2 ring-background"></span></Button></Link>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center rounded-full border-2 border-primary/10 hover:border-primary transition p-0.5 outline-none">
                <Avatar className="h-8 w-8 rounded-full shadow-sm"><AvatarImage src={activeAccount.avatar} className="object-cover" /><AvatarFallback className="bg-primary text-primary-foreground font-bold text-xs">{activeAccount.name[0]}</AvatarFallback></Avatar>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-64 rounded-2xl p-2 shadow-2xl border-border bg-card outline-none">
              <DropdownMenuLabel className="px-3 py-2 text-[10px] font-bold text-muted-foreground uppercase tracking-widest border-b mb-1">Profil</DropdownMenuLabel>
              <DropdownMenuGroup>
                <Link href="/profile"><DropdownMenuItem className="flex items-center gap-3 px-3 py-3 rounded-xl font-bold cursor-pointer hover:bg-primary/5"><div className="size-9 rounded-xl bg-primary/5 flex items-center justify-center text-primary"><User className="size-5" /></div><span className="text-[14px]">{t('view_profile')}</span></DropdownMenuItem></Link>
                <DropdownMenuSeparator className="my-1" />
                {availableAccounts.filter(a => !a.isNew).map((acc) => (
                  <DropdownMenuItem key={acc.id} onSelect={() => { switchAccount(acc.id); router.push("/profile"); }} className={cn("flex items-center justify-between px-3 py-3 rounded-xl font-bold cursor-pointer mb-0.5", activeAccount.id === acc.id ? "bg-primary/5 text-primary" : "focus:bg-primary/5")}>
                    <div className="flex items-center gap-3"><Avatar className="size-9 rounded-xl shadow-sm"><AvatarImage src={acc.avatar} className="object-cover" /><AvatarFallback className="text-xs bg-muted font-black">{acc.name[0]}</AvatarFallback></Avatar><div className="flex flex-col"><span className="text-[14px] leading-none mb-1">{acc.name}</span><span className="text-[10px] uppercase font-black opacity-60 tracking-tight">{acc.type}</span></div></div>
                    {activeAccount.id === acc.id && <Check className="size-4" />}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuGroup>
              <DropdownMenuSeparator className="my-1" />
              <DropdownMenuSub>
                <DropdownMenuSubTrigger className="gap-3 px-3 py-3 rounded-xl font-bold text-[14px]"><UserPlus className="size-5" /> Tambah Profil</DropdownMenuSubTrigger>
                <DropdownMenuPortal>
                  <DropdownMenuSubContent className="rounded-xl border-border shadow-xl p-1 min-w-[150px] bg-card">
                    <DropdownMenuItem onSelect={() => { setPendingType('pribadi'); setIsRegModalOpen(true); }} className="font-bold text-[14px] px-3 py-2.5 rounded-lg cursor-pointer hover:bg-primary/5">Pribadi</DropdownMenuItem>
                    <DropdownMenuItem onSelect={() => { setPendingType('professional'); setIsRegModalOpen(true); }} className="font-bold text-[14px] px-3 py-2.5 rounded-lg cursor-pointer hover:bg-primary/5">Professional</DropdownMenuItem>
                    <DropdownMenuItem onSelect={() => { setPendingType('bisnis'); setIsRegModalOpen(true); }} className="font-bold text-[14px] px-3 py-2.5 rounded-lg cursor-pointer hover:bg-primary/5">Bisnis</DropdownMenuItem>
                  </DropdownMenuSubContent>
                </DropdownMenuPortal>
              </DropdownMenuSub>
              <DropdownMenuSeparator className="my-1" />
              <DropdownMenuItem onClick={handleLogout} className="text-destructive font-bold text-[14px] px-3 py-3 rounded-xl focus:bg-destructive/5 cursor-pointer flex gap-3"><LogOut className="size-5" /> Keluar</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      <main className="flex-1 pb-24 pt-4 px-4 w-full overflow-x-hidden relative max-w-2xl mx-auto">
        {children}
      </main>

      <nav className="fixed bottom-0 left-0 right-0 z-[90] border-t bg-background/95 backdrop-blur-md pb-safe shadow-xl">
        <div className="grid grid-cols-3 h-16 md:h-20 items-center justify-items-center text-[11px] md:text-[12px] font-bold uppercase tracking-widest text-muted-foreground relative">
          <Link href="/feed" className={cn("flex flex-col items-center gap-1.5 w-full py-2 transition-all", pathname === "/feed" ? "text-primary scale-110" : "hover:text-primary")}>
            <Rss className="size-6 md:size-7" /><span>{t('feed')}</span>
          </Link>
          <Link href="/cari" className={cn("flex flex-col items-center gap-1.5 w-full py-2 transition-all", pathname === "/cari" ? "text-primary scale-110" : "hover:text-primary")}>
            <Search className="size-6 md:size-7" /><span>{t('search')}</span>
          </Link>
          <div className="relative w-full h-full flex flex-col items-center justify-center">
            <Sheet open={isMoreMenuOpen} onOpenChange={setIsMoreMenuOpen}>
              <SheetTrigger asChild><button className="flex flex-col items-center gap-1.5 hover:text-primary w-full py-2 outline-none transition-all"><Menu className="size-6 md:size-7" /><span>{t('more')}</span></button></SheetTrigger>
              <SheetContent side="bottom" className="rounded-t-[2.5rem] border-none p-0 h-[85vh] bg-card overflow-hidden [&>button]:hidden outline-none shadow-2xl" onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
                <div className="w-full flex flex-col items-center justify-center pt-4 pb-2 cursor-grab active:cursor-grabbing"><div className="sheet-handle w-12 h-1.5 bg-muted rounded-full" /></div>
                <SheetHeader className="p-6 pt-2 pb-5 bg-primary/5 border-b border-border/50">
                  <div className="flex items-center justify-between"><SheetTitle className="text-lg font-black flex items-center gap-2 uppercase tracking-tight text-primary"><LayoutGrid className="size-5" />Tapp Hub</SheetTitle><Badge variant="secondary" className="bg-white border-border text-primary font-black px-4 py-1 uppercase text-[10px] shadow-sm">{activeAccount?.type}</Badge></div>
                </SheetHeader>
                <div className="overflow-y-auto h-full pb-32 no-scrollbar">
                  <div className="flex flex-col divide-y divide-border/40">
                    {drawerItems.map((item) => (
                      <Link key={item.href} href={item.href} onClick={() => setIsMoreMenuOpen(false)} className={cn("flex items-center px-8 py-5 transition-all gap-6 group", pathname === item.href ? "bg-primary/5 text-primary" : "bg-transparent hover:bg-primary/5")}>
                        <div className={cn("size-10 rounded-2xl flex items-center justify-center transition-all group-hover:scale-110 shadow-sm", pathname === item.href ? "bg-primary text-primary-foreground shadow-primary/20" : "bg-muted text-muted-foreground")}><item.icon className="size-5" /></div>
                        <span className="text-[14px] font-black uppercase tracking-widest">{item.label}</span>
                        <ChevronRight className="ml-auto size-4 text-muted-foreground/30 group-hover:text-primary transition-colors" />
                      </Link>
                    ))}
                    <div className="px-8 py-8 bg-muted/10"><div className="flex items-center gap-6 mb-5"><div className="size-10 rounded-2xl bg-muted text-muted-foreground flex items-center justify-center shadow-sm"><Languages className="size-6" /></div><span className="text-[14px] font-black uppercase tracking-widest">Bahasa</span></div><LanguagePicker /></div>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </nav>

      {/* Onboarding Dialog */}
      <Dialog open={isRegModalOpen} onOpenChange={(open) => { if (activeAccount?.isNew) return; setIsRegModalOpen(open); }}>
        <DialogContent className="w-[95%] md:max-w-md p-0 border-none shadow-2xl overflow-hidden bg-card text-foreground rounded-[2rem] outline-none [&>button]:hidden">
          <div className="flex flex-col max-h-[90vh] overflow-y-auto no-scrollbar">
            <div className="flex flex-col items-center justify-center text-center space-y-4 pt-10 pb-6 px-8">
              <div className="size-16 rounded-2xl bg-primary text-primary-foreground flex items-center justify-center font-black text-3xl shadow-xl shadow-primary/20">T</div>
              <div className="space-y-1.5">
                <DialogTitle className="text-2xl font-black tracking-tight text-slate-900 uppercase">Selamat Datang</DialogTitle>
                <DialogDescription className="font-medium text-slate-500 text-[14px] px-2">Pilih jenis profil untuk mulai membangun jaringan bisnis Anda yang cerdas.</DialogDescription>
              </div>
            </div>

            <div className="flex-1 px-6 pb-10 space-y-6">
              {!pendingType ? (
                <div className="grid gap-4">
                  {['pribadi', 'professional', 'bisnis'].map((type) => (
                    <button key={type} type="button" onClick={() => setPendingType(type as AccountType)} className="flex items-center gap-5 p-5 rounded-2xl border-2 border-muted hover:border-primary hover:bg-primary/[0.02] transition-all group text-left shadow-sm">
                      <div className="size-12 rounded-2xl bg-primary/5 text-primary flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                        {type === 'pribadi' ? <User className="size-6" /> : type === 'professional' ? <ShieldCheck className="size-6" /> : <Briefcase className="size-6" />}
                      </div>
                      <div>
                        <h4 className="font-bold text-[16px] text-slate-900 capitalize">Profil {type}</h4>
                        <p className="text-[13px] text-slate-500 font-medium leading-tight mt-1">{type === 'pribadi' ? 'Berbagi inspirasi dan relasi bisnis.' : type === 'professional' ? 'Tampilkan keahlian dan portofolio.' : 'Akses data pasar dan mitra eksklusif.'}</p>
                      </div>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
                  <div className="flex items-center justify-between">
                    <button type="button" onClick={() => setPendingType(null)} className="h-9 px-4 font-bold text-[12px] uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors">← Kembali</button>
                    <Badge className="px-5 py-1.5 font-black text-[11px] uppercase border-none bg-primary text-primary-foreground rounded-full shadow-md shadow-primary/10">{pendingType}</Badge>
                  </div>
                  
                  <div className="flex flex-col items-center gap-4">
                    <div onClick={() => setIsMediaPickerOpen(true)} className="size-24 rounded-[2rem] bg-muted border-2 border-dashed border-border flex items-center justify-center text-muted-foreground group cursor-pointer hover:border-primary hover:bg-primary/5 transition-all overflow-hidden shadow-inner">
                      {regFormData.avatar ? <img src={regFormData.avatar} className="w-full h-full object-cover" alt="Profile" /> : <Camera className="size-8 group-hover:text-primary transition-colors" />}
                    </div>
                    <span className="text-[11px] font-black text-muted-foreground uppercase tracking-widest">Foto Profil Anda</span>
                  </div>

                  <div className="space-y-5">
                    <div className="space-y-2"><Label className="font-black text-[11px] uppercase tracking-widest text-slate-500 ml-1">Nama Tampilan *</Label><Input required placeholder="Nama Lengkap atau Nama Brand" value={regFormData.name} onChange={(e) => setRegFormData({...regFormData, name: e.target.value})} className="rounded-xl h-12 bg-muted/20 border-none focus:bg-white focus:ring-2 focus:ring-primary/10 transition-all font-bold px-5 text-[15px] shadow-inner" /></div>
                    <div className="space-y-2"><Label className="font-black text-[11px] uppercase tracking-widest text-slate-500 ml-1">Bio Singkat</Label><Textarea placeholder="Visi atau deskripsi singkat bisnis Anda..." value={regFormData.bio} onChange={(e) => setRegFormData({...regFormData, bio: e.target.value})} className="rounded-[1.25rem] border-none min-h-[100px] bg-muted/20 focus:bg-white focus:ring-2 focus:ring-primary/10 transition-all font-medium px-5 py-4 text-[15px] shadow-inner" /></div>
                    <div className="space-y-2">
                      <Label className="font-black text-[11px] uppercase tracking-widest text-slate-500 ml-1">Visibilitas Jaringan</Label>
                      <Select value={regFormData.visibility} onValueChange={(val: 'public' | 'private') => setRegFormData({...regFormData, visibility: val})}>
                        <SelectTrigger className="h-12 rounded-xl bg-muted/20 border-none px-5 text-[14px] font-bold shadow-inner focus:ring-2 focus:ring-primary/10"><SelectValue /></SelectTrigger>
                        <SelectContent className="rounded-xl shadow-xl"><SelectItem value="public">🌍 Publik (Terlihat Semua)</SelectItem><SelectItem value="private">🔒 Privat (Hanya Relasi)</SelectItem></SelectContent>
                      </Select>
                    </div>
                  </div>

                  <Button onClick={handleRegisterSubmit} disabled={!regFormData.name.trim()} className="w-full h-14 rounded-2xl bg-primary hover:bg-primary/90 text-primary-foreground font-black text-[15px] uppercase tracking-widest shadow-xl shadow-primary/20 active:scale-[0.98] transition-all">Mulai Membangun Jaringan</Button>
                </div>
              )}
            </div>
            
            {activeAccount?.isNew && (
              <div className="px-8 pb-8 mt-auto">
                <Button variant="ghost" onClick={handleLogout} className="w-full font-black text-[11px] uppercase tracking-widest text-muted-foreground hover:text-destructive hover:bg-destructive/5 transition-all">Batal & Keluar</Button>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={isMediaPickerOpen} onOpenChange={setIsMediaPickerOpen}>
        <DialogContent className="w-[90%] md:max-w-xs rounded-[2rem] p-8 border-none shadow-2xl bg-card text-foreground outline-none [&>button]:hidden">
          <DialogHeader className="text-center"><DialogTitle className="text-lg font-black uppercase tracking-tight text-primary">Pilih Media</DialogTitle></DialogHeader>
          <div className="grid gap-4 py-6">
            <Button variant="outline" disabled={isCloudLoading} onClick={() => fileInputRef.current?.click()} className="h-14 rounded-2xl border-border bg-muted/30 hover:bg-primary/5 hover:border-primary/30 justify-start gap-5 px-6 shadow-sm transition-all"><Smartphone className="size-6 text-primary" /><p className="font-black text-[12px] uppercase tracking-widest">Galeri Perangkat</p></Button>
            <Button variant="outline" disabled={isCloudLoading} onClick={() => handleCloudSource('drive')} className="h-14 rounded-2xl border-border bg-muted/30 hover:bg-primary/5 hover:border-primary/30 justify-start gap-5 px-6 shadow-sm transition-all"><Cloud className="size-6 text-primary" /><p className="font-black text-[12px] uppercase tracking-widest">Layanan Cloud</p></Button>
          </div>
          <Button variant="ghost" onClick={() => setIsMediaPickerOpen(false)} className="w-full font-black text-[12px] uppercase text-muted-foreground hover:bg-transparent">Batal</Button>
        </DialogContent>
      </Dialog>

      <AIAssistant />
    </div>
  );
}