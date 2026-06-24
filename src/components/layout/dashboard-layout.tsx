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
import { motion, useMotionValue, useTransform } from "framer-motion";

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, loading } = useUser();
  const auth = useAuth();
  const { t } = useLanguage();
  const { toast } = useToast();
  const { activeAccount, availableAccounts, switchAccount, registerAccount, hasInitialized } = useAccount();
  const [isMoreMenuOpen, setIsMoreMenuOpen] = React.useState(false);
  
  const sheetY = useMotionValue(0);
  const dragOpacity = useTransform(sheetY, [0, 150], [1, 0]);

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
      
      <header className="sticky top-0 z-[100] w-full border-b bg-background/80 backdrop-blur-md px-4 h-11 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-2">
          <Link href="/feed" className="flex items-center gap-2 active:scale-95 transition-transform">
            <div className="size-6 rounded-lg bg-primary text-primary-foreground flex items-center justify-center font-black text-base shadow-lg shadow-primary/20">T</div>
            <span className="font-black text-sm tracking-tight text-foreground uppercase">Tapp</span>
          </Link>
          <span className="font-latin text-base text-primary/80 lowercase italic select-none ml-1">{activeAccount?.type}</span>
        </div>
        
        <div className="flex items-center gap-1.5">
          <Link href="/messages"><Button variant="ghost" size="icon" className="size-7 text-foreground/70 hover:bg-primary/5 hover:text-primary rounded-full transition"><MessageSquare className="size-4" /></Button></Link>
          <Link href="/notifications"><Button variant="ghost" size="icon" className="relative size-7 text-foreground/70 hover:bg-primary/5 hover:text-primary rounded-full transition"><Bell className="size-4" /><span className="absolute top-1 right-1 size-1.5 bg-primary rounded-full ring-2 ring-background"></span></Button></Link>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center rounded-full border-2 border-primary/10 hover:border-primary transition p-0.5 outline-none">
                <Avatar className="h-6 w-6 rounded-full shadow-sm"><AvatarImage src={activeAccount.avatar} className="object-cover" /><AvatarFallback className="bg-primary text-primary-foreground font-bold text-[8px]">{activeAccount.name[0]}</AvatarFallback></Avatar>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 rounded-xl p-1.5 shadow-2xl border-border bg-card outline-none">
              <DropdownMenuLabel className="px-2.5 py-1.5 text-[8px] font-bold text-muted-foreground uppercase tracking-widest border-b mb-1">Profil</DropdownMenuLabel>
              <DropdownMenuGroup>
                <Link href="/profile"><DropdownMenuItem className="flex items-center gap-2.5 px-2.5 py-2.5 rounded-lg font-bold cursor-pointer hover:bg-primary/5"><div className="size-7 rounded-lg bg-primary/5 flex items-center justify-center text-primary"><User className="size-3.5" /></div><span className="text-[12px]">{t('view_profile')}</span></DropdownMenuItem></Link>
                <DropdownMenuSeparator className="my-1" />
                {availableAccounts.filter(a => !a.isNew).map((acc) => (
                  <DropdownMenuItem key={acc.id} onSelect={() => { switchAccount(acc.id); router.push("/profile"); }} className={cn("flex items-center justify-between px-2.5 py-2 rounded-lg font-bold cursor-pointer mb-0.5", activeAccount.id === acc.id ? "bg-primary/5 text-primary" : "focus:bg-primary/5")}>
                    <div className="flex items-center gap-2.5"><Avatar className="size-7 rounded-lg shadow-sm"><AvatarImage src={acc.avatar} className="object-cover" /><AvatarFallback className="text-[9px] bg-muted font-black">{acc.name[0]}</AvatarFallback></Avatar><div className="flex flex-col"><span className="text-[12px] leading-none mb-0.5">{acc.name}</span><span className="font-latin text-xs text-muted-foreground opacity-70 italic lowercase">{acc.type}</span></div></div>
                    {activeAccount.id === acc.id && <Check className="size-3" />}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuGroup>
              <DropdownMenuSeparator className="my-1" />
              <DropdownMenuSub>
                <DropdownMenuSubTrigger className="gap-2.5 px-2.5 py-2.5 rounded-lg font-bold text-[12px]"><UserPlus className="size-3.5" /> Tambah Profil</DropdownMenuSubTrigger>
                <DropdownMenuPortal>
                  <DropdownMenuSubContent className="rounded-xl border-border shadow-xl p-1 min-w-[140px] bg-card">
                    <DropdownMenuItem onSelect={() => { setPendingType('pribadi'); setIsRegModalOpen(true); }} className="font-bold text-[12px] px-2.5 py-2 rounded-lg cursor-pointer hover:bg-primary/5">Pribadi</DropdownMenuItem>
                    <DropdownMenuItem onSelect={() => { setPendingType('professional'); setIsRegModalOpen(true); }} className="font-bold text-[12px] px-2.5 py-2 rounded-lg cursor-pointer hover:bg-primary/5">Professional</DropdownMenuItem>
                    <DropdownMenuItem onSelect={() => { setPendingType('bisnis'); setIsRegModalOpen(true); }} className="font-bold text-[12px] px-2.5 py-2 rounded-lg cursor-pointer hover:bg-primary/5">Bisnis</DropdownMenuItem>
                  </DropdownMenuSubContent>
                </DropdownMenuPortal>
              </DropdownMenuSub>
              <DropdownMenuSeparator className="my-1" />
              <DropdownMenuItem onClick={handleLogout} className="text-destructive font-bold text-[12px] px-2.5 py-2.5 rounded-lg focus:bg-destructive/5 cursor-pointer flex gap-2.5"><LogOut className="size-3.5" /> Keluar</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      <main className="flex-1 pb-20 pt-2 px-3 w-full overflow-x-hidden relative max-w-2xl mx-auto">
        {children}
      </main>

      <nav className="fixed bottom-0 left-0 right-0 z-[90] border-t bg-background/95 backdrop-blur-md pb-safe shadow-xl">
        <div className="grid grid-cols-3 h-12 items-center justify-items-center text-[8px] md:text-[9px] font-bold uppercase tracking-widest text-muted-foreground relative">
          <Link href="/feed" className={cn("flex flex-col items-center gap-1 w-full py-1 transition-all", pathname === "/feed" ? "text-primary scale-105" : "hover:text-primary")}>
            <Rss className="size-4 md:size-5" /><span>{t('feed')}</span>
          </Link>
          <Link href="/cari" className={cn("flex flex-col items-center gap-1 w-full py-1 transition-all", pathname === "/cari" ? "text-primary scale-105" : "hover:text-primary")}>
            <Search className="size-4 md:size-5" /><span>{t('search')}</span>
          </Link>
          <div className="relative w-full h-full flex flex-col items-center justify-center">
            <Sheet open={isMoreMenuOpen} onOpenChange={setIsMoreMenuOpen}>
              <SheetTrigger asChild><button className="flex flex-col items-center gap-1 hover:text-primary w-full py-1 outline-none transition-all"><Menu className="size-4 md:size-5" /><span>{t('more')}</span></button></SheetTrigger>
              <SheetContent side="bottom" className="p-0 h-[80vh] bg-transparent border-none [&>button]:hidden outline-none shadow-none overflow-visible">
                <motion.div 
                  drag="y"
                  dragConstraints={{ top: 0, bottom: 0 }}
                  dragElastic={{ bottom: 0.8 }}
                  style={{ y: sheetY }}
                  onDragEnd={(_, info) => {
                    if (info.offset.y > 100) {
                      setIsMoreMenuOpen(false);
                      sheetY.set(0);
                    } else {
                      sheetY.set(0);
                    }
                  }}
                  className="w-full h-full flex flex-col"
                >
                  <motion.div 
                    style={{ opacity: dragOpacity }} 
                    className="w-full h-full flex flex-col bg-card rounded-t-[2rem] border-t border-border/50 shadow-2xl overflow-hidden pointer-events-auto"
                  >
                    <div className="w-full flex flex-col items-center justify-center pt-3 pb-1 cursor-grab active:cursor-grabbing">
                      <div className="sheet-handle w-10 h-1 bg-muted rounded-full" />
                    </div>
                    <SheetHeader className="p-4 pt-1 pb-3 bg-primary/5 border-b border-border/50">
                      <div className="flex items-center justify-between">
                        <SheetTitle className="text-sm font-black flex items-center gap-2 uppercase tracking-tight text-primary">
                          <LayoutGrid className="size-4" />
                          Tapp Hub
                        </SheetTitle>
                        <span className="font-latin text-lg text-primary italic lowercase select-none">{activeAccount?.type}</span>
                      </div>
                    </SheetHeader>
                    <div className="overflow-y-auto h-full pb-32 no-scrollbar">
                      <div className="flex flex-col divide-y divide-border/40">
                        {drawerItems.map((item) => (
                          <Link key={item.href} href={item.href} onClick={() => setIsMoreMenuOpen(false)} className={cn("flex items-center px-6 py-3 transition-all gap-5 group", pathname === item.href ? "bg-primary/5 text-primary" : "bg-transparent hover:bg-primary/5")}>
                            <div className={cn("size-7 rounded-xl flex items-center justify-center transition-all group-hover:scale-110 shadow-sm", pathname === item.href ? "bg-primary text-primary-foreground shadow-primary/20" : "bg-muted text-muted-foreground")}><item.icon className="size-3.5" /></div>
                            <span className="text-[11px] font-black uppercase tracking-widest">{item.label}</span>
                            <ChevronRight className="ml-auto size-3 text-muted-foreground/30 group-hover:text-primary transition-colors" />
                          </Link>
                        ))}
                        <div className="px-6 py-5 bg-muted/10">
                          <div className="flex items-center gap-5 mb-3">
                            <div className="size-7 rounded-xl bg-muted text-muted-foreground flex items-center justify-center shadow-sm">
                              <Languages className="size-4" />
                            </div>
                            <span className="text-[11px] font-black uppercase tracking-widest">Bahasa</span>
                          </div>
                          <LanguagePicker />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </nav>

      {/* Onboarding Dialog */}
      <Dialog open={isRegModalOpen} onOpenChange={(open) => { if (activeAccount?.isNew) return; setIsRegModalOpen(open); }}>
        <DialogContent className="w-[95%] md:max-w-md p-0 border-none shadow-2xl overflow-hidden bg-card text-foreground rounded-[2rem] outline-none [&>button]:hidden">
          <div className="flex flex-col max-h-[90vh] overflow-y-auto no-scrollbar">
            <div className="flex flex-col items-center justify-center text-center space-y-3 pt-8 pb-5 px-8">
              <div className="size-14 rounded-2xl bg-primary text-primary-foreground flex items-center justify-center font-black text-2xl shadow-xl shadow-primary/20">T</div>
              <div className="space-y-1">
                <DialogTitle className="text-xl font-black tracking-tight text-slate-900 uppercase">Selamat Datang</DialogTitle>
                <DialogDescription className="font-medium text-slate-500 text-[12px] px-2">Pilih jenis profil untuk mulai membangun jaringan bisnis Anda yang cerdas.</DialogDescription>
              </div>
            </div>

            <div className="flex-1 px-6 pb-8 space-y-5">
              {!pendingType ? (
                <div className="grid gap-3">
                  {['pribadi', 'professional', 'bisnis'].map((type) => (
                    <button key={type} type="button" onClick={() => setPendingType(type as AccountType)} className="flex items-center gap-4 p-4 rounded-2xl border-2 border-muted hover:border-primary hover:bg-primary/[0.02] transition-all group text-left shadow-sm">
                      <div className="size-10 rounded-2xl bg-primary/5 text-primary flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                        {type === 'pribadi' ? <User className="size-5" /> : type === 'professional' ? <ShieldCheck className="size-5" /> : <Briefcase className="size-5" />}
                      </div>
                      <div>
                        <h4 className="font-bold text-[14px] text-slate-900 capitalize flex items-center gap-2">
                          Profil <span className="font-latin text-lg text-primary italic lowercase font-normal">{type}</span>
                        </h4>
                        <p className="text-[11px] text-slate-500 font-medium leading-tight mt-0.5">{type === 'pribadi' ? 'Berbagi inspirasi dan relasi bisnis.' : type === 'professional' ? 'Tampilkan keahlian dan portofolio.' : 'Akses data pasar dan mitra eksklusif.'}</p>
                      </div>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="space-y-5 animate-in slide-in-from-right-4 duration-300">
                  <div className="flex items-center justify-between">
                    <button type="button" onClick={() => setPendingType(null)} className="h-8 px-3 font-bold text-[11px] uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors">← Kembali</button>
                    <span className="font-latin text-2xl text-primary italic lowercase select-none">{pendingType}</span>
                  </div>
                  
                  <div className="flex flex-col items-center gap-3">
                    <div onClick={() => setIsMediaPickerOpen(true)} className="size-20 rounded-[1.75rem] bg-muted border-2 border-dashed border-border flex items-center justify-center text-muted-foreground group cursor-pointer hover:border-primary hover:bg-primary/5 transition-all overflow-hidden shadow-inner">
                      {regFormData.avatar ? <img src={regFormData.avatar} className="w-full h-full object-cover" alt="Profile" /> : <Camera className="size-6 group-hover:text-primary transition-colors" />}
                    </div>
                    <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Foto Profil Anda</span>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-1.5"><Label className="font-black text-[10px] uppercase tracking-widest text-slate-500 ml-1">Nama Tampilan *</Label><Input required placeholder="Nama Lengkap atau Nama Brand" value={regFormData.name} onChange={(e) => setRegFormData({...regFormData, name: e.target.value})} className="rounded-xl h-11 bg-muted/20 border-none focus:bg-white focus:ring-2 focus:ring-primary/10 transition-all font-bold px-4 text-[13px] shadow-inner" /></div>
                    <div className="space-y-1.5"><Label className="font-black text-[10px] uppercase tracking-widest text-slate-500 ml-1">Bio Singkat</Label><Textarea placeholder="Visi atau deskripsi singkat bisnis Anda..." value={regFormData.bio} onChange={(e) => setRegFormData({...regFormData, bio: e.target.value})} className="rounded-[1rem] border-none min-h-[80px] bg-muted/20 focus:bg-white focus:ring-2 focus:ring-primary/10 transition-all font-medium px-4 py-3 text-[13px] shadow-inner" /></div>
                    <div className="space-y-1.5">
                      <Label className="font-black text-[10px] uppercase tracking-widest text-slate-500 ml-1">Visibilitas Jaringan</Label>
                      <Select value={regFormData.visibility} onValueChange={(val: 'public' | 'private') => setRegFormData({...regFormData, visibility: val})}>
                        <SelectTrigger className="h-11 rounded-xl bg-muted/20 border-none px-4 text-[12px] font-bold shadow-inner focus:ring-2 focus:ring-primary/10"><SelectValue /></SelectTrigger>
                        <SelectContent className="rounded-xl shadow-xl"><SelectItem value="public">🌍 Publik (Terlihat Semua)</SelectItem><SelectItem value="private">🔒 Privat (Hanya Relasi)</SelectItem></SelectContent>
                      </Select>
                    </div>
                  </div>

                  <Button onClick={handleRegisterSubmit} disabled={!regFormData.name.trim()} className="w-full h-12 rounded-2xl bg-primary hover:bg-primary/90 text-primary-foreground font-black text-[13px] uppercase tracking-widest shadow-xl shadow-primary/20 active:scale-[0.98] transition-all">Mulai Membangun Jaringan</Button>
                </div>
              )}
            </div>
            
            {activeAccount?.isNew && (
              <div className="px-8 pb-6 mt-auto">
                <Button variant="ghost" onClick={handleLogout} className="w-full font-black text-[10px] uppercase tracking-widest text-muted-foreground hover:text-destructive hover:bg-destructive/5 transition-all">Batal & Keluar</Button>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={isMediaPickerOpen} onOpenChange={setIsMediaPickerOpen}>
        <DialogContent className="w-[90%] md:max-w-xs rounded-[2rem] p-6 border-none shadow-2xl bg-card text-foreground outline-none [&>button]:hidden">
          <DialogHeader className="text-center"><DialogTitle className="text-base font-black uppercase tracking-tight text-primary">Pilih Media</DialogTitle></DialogHeader>
          <div className="grid gap-3 py-5">
            <Button variant="outline" disabled={isCloudLoading} onClick={() => fileInputRef.current?.click()} className="h-12 rounded-2xl border-border bg-muted/30 hover:bg-primary/5 hover:border-primary/30 justify-start gap-4 px-5 shadow-sm transition-all"><Smartphone className="size-5 text-primary" /><p className="font-black text-[11px] uppercase tracking-widest">Galeri Perangkat</p></Button>
            <Button variant="outline" disabled={isCloudLoading} onClick={() => handleCloudSource('drive')} className="h-12 rounded-2xl border-border bg-muted/30 hover:bg-primary/5 hover:border-primary/30 justify-start gap-4 px-5 shadow-sm transition-all"><Cloud className="size-5 text-primary" /><p className="font-black text-[11px] uppercase tracking-widest">Layanan Cloud</p></Button>
          </div>
          <Button variant="ghost" onClick={() => setIsMediaPickerOpen(false)} className="w-full font-black text-[11px] uppercase text-muted-foreground hover:bg-transparent">Batal</Button>
        </DialogContent>
      </Dialog>
    </div>
  );
}
