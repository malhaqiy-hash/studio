
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
      
      <header className="sticky top-0 z-[100] w-full border-b bg-background/80 backdrop-blur-md px-4 h-12 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-2">
          <Link href="/feed" className="flex items-center gap-1.5 active:scale-95 transition-transform">
            <div className="size-7 rounded-lg bg-black text-white flex items-center justify-center font-black text-lg shadow-lg">O</div>
            <span className="font-black text-sm tracking-tight text-foreground uppercase">OnTapp</span>
          </Link>
          <Badge variant="outline" className="text-[9px] font-black uppercase px-2 py-0 border-black/10 text-black bg-black/5">{activeAccount?.type}</Badge>
        </div>
        
        <div className="flex items-center gap-2">
          <Link href="/messages"><Button variant="ghost" size="icon" className="size-8 text-foreground/70 hover:bg-black/5 hover:text-black rounded-full transition"><MessageSquare className="size-4.5" /></Button></Link>
          <Link href="/notifications"><Button variant="ghost" size="icon" className="relative size-8 text-foreground/70 hover:bg-black/5 hover:text-black rounded-full transition"><Bell className="size-4.5" /><span className="absolute top-2 right-2 size-2 bg-black rounded-full ring-2 ring-background"></span></Button></Link>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center rounded-full border-2 border-black/10 hover:border-black transition p-0.5 outline-none">
                <Avatar className="h-7 w-7 rounded-full"><AvatarImage src={activeAccount.avatar} className="object-cover" /><AvatarFallback className="bg-black text-white font-bold text-[9px]">{activeAccount.name[0]}</AvatarFallback></Avatar>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-60 rounded-2xl p-2 shadow-2xl border-border bg-card outline-none">
              <DropdownMenuLabel className="px-3 py-1.5 text-[10px] font-bold text-muted-foreground uppercase tracking-widest border-b mb-1">Profil</DropdownMenuLabel>
              <DropdownMenuGroup>
                <Link href="/profile"><DropdownMenuItem className="flex items-center gap-3 px-3 py-2.5 rounded-xl font-bold cursor-pointer hover:bg-black/5"><div className="size-8 rounded-lg bg-black/5 flex items-center justify-center text-black"><User className="size-4" /></div><span className="text-[13px]">{t('view_profile')}</span></DropdownMenuItem></Link>
                <DropdownMenuSeparator className="my-1" />
                {availableAccounts.filter(a => !a.isNew).map((acc) => (
                  <DropdownMenuItem key={acc.id} onSelect={() => { switchAccount(acc.id); router.push("/profile"); }} className={cn("flex items-center justify-between px-3 py-2.5 rounded-xl font-bold cursor-pointer mb-0.5", activeAccount.id === acc.id ? "bg-black/5 text-black" : "focus:bg-black/5")}>
                    <div className="flex items-center gap-3"><Avatar className="size-8 rounded-lg"><AvatarImage src={acc.avatar} className="object-cover" /><AvatarFallback className="text-[10px] bg-muted">{acc.name[0]}</AvatarFallback></Avatar><div className="flex flex-col"><span className="text-[13px] leading-none mb-0.5">{acc.name}</span><span className="text-[9px] uppercase font-black opacity-60">{acc.type}</span></div></div>
                    {activeAccount.id === acc.id && <Check className="size-3.5" />}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuGroup>
              <DropdownMenuSeparator className="my-1" />
              <DropdownMenuSub>
                <DropdownMenuSubTrigger className="gap-3 px-3 py-2.5 rounded-xl font-bold text-[13px]"><UserPlus className="size-4" /> Tambah Profil</DropdownMenuSubTrigger>
                <DropdownMenuPortal>
                  <DropdownMenuSubContent className="rounded-xl border-border shadow-xl p-1 min-w-[140px] bg-card">
                    <DropdownMenuItem onSelect={() => { setPendingType('pribadi'); setIsRegModalOpen(true); }} className="font-bold text-[13px] px-3 py-2 rounded-lg cursor-pointer">Pribadi</DropdownMenuItem>
                    <DropdownMenuItem onSelect={() => { setPendingType('professional'); setIsRegModalOpen(true); }} className="font-bold text-[13px] px-3 py-2 rounded-lg cursor-pointer">Professional</DropdownMenuItem>
                    <DropdownMenuItem onSelect={() => { setPendingType('bisnis'); setIsRegModalOpen(true); }} className="font-bold text-[13px] px-3 py-2 rounded-lg cursor-pointer">Bisnis</DropdownMenuItem>
                  </DropdownMenuSubContent>
                </DropdownMenuPortal>
              </DropdownMenuSub>
              <DropdownMenuSeparator className="my-1" />
              <DropdownMenuItem onClick={handleLogout} className="text-black font-bold text-[13px] px-3 py-2.5 rounded-xl focus:bg-black/5 cursor-pointer flex gap-3"><LogOut className="size-4" /> Keluar</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      <main className="flex-1 pb-20 pt-1 px-3 w-full overflow-x-hidden relative max-w-2xl mx-auto">
        {children}
      </main>

      <nav className="fixed bottom-0 left-0 right-0 z-[90] border-t bg-background/95 backdrop-blur-md pb-safe shadow-lg">
        <div className="grid grid-cols-3 h-14 md:h-16 items-center justify-items-center text-[10px] md:text-[11px] font-bold uppercase tracking-widest text-muted-foreground relative">
          <Link href="/feed" className={cn("flex flex-col items-center gap-1 w-full py-2 transition-colors", pathname === "/feed" ? "text-black" : "hover:text-black")}>
            <Rss className="size-5 md:size-6" /><span>{t('feed')}</span>
          </Link>
          <Link href="/cari" className={cn("flex flex-col items-center gap-1 w-full py-2 transition-colors", pathname === "/cari" ? "text-black" : "hover:text-black")}>
            <Search className="size-5 md:size-6" /><span>{t('search')}</span>
          </Link>
          <div className="relative w-full h-full flex flex-col items-center justify-center">
            <Sheet open={isMoreMenuOpen} onOpenChange={setIsMoreMenuOpen}>
              <SheetTrigger asChild><button className="flex flex-col items-center gap-1 hover:text-black w-full py-2 outline-none"><Menu className="size-5 md:size-6" /><span>{t('more')}</span></button></SheetTrigger>
              <SheetContent side="bottom" className="rounded-t-[2.5rem] border-none p-0 h-[80vh] bg-card overflow-hidden [&>button]:hidden outline-none" onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
                <div className="w-full flex flex-col items-center justify-center pt-3 pb-1 cursor-grab active:cursor-grabbing"><div className="sheet-handle" /></div>
                <SheetHeader className="p-5 pt-1 pb-4 bg-muted/20 border-b border-border">
                  <div className="flex items-center justify-between"><SheetTitle className="text-base font-black flex items-center gap-2 uppercase tracking-tight"><LayoutGrid className="size-4" />OnTapp Hub</SheetTitle><Badge variant="outline" className="bg-card border-border text-muted-foreground font-black px-3 py-0.5 uppercase text-[9px]">{activeAccount?.type}</Badge></div>
                </SheetHeader>
                <div className="overflow-y-auto h-full pb-32 no-scrollbar">
                  <div className="flex flex-col divide-y divide-border/40">
                    {drawerItems.map((item) => (
                      <Link key={item.href} href={item.href} onClick={() => setIsMoreMenuOpen(false)} className={cn("flex items-center px-6 py-4 transition-colors gap-5 group", pathname === item.href ? "bg-black/5 text-black" : "bg-transparent hover:bg-black/5")}>
                        <div className={cn("size-9 rounded-xl flex items-center justify-center transition-all group-hover:scale-110 shadow-sm", pathname === item.href ? "bg-black text-white" : "bg-muted text-muted-foreground")}><item.icon className="size-4.5" /></div>
                        <span className="text-[13px] font-black uppercase tracking-widest">{item.label}</span>
                        <ChevronRight className="ml-auto size-4 text-muted-foreground/30" />
                      </Link>
                    ))}
                    <div className="px-6 py-6 bg-muted/10"><div className="flex items-center gap-5 mb-4"><div className="size-9 rounded-xl bg-muted text-muted-foreground flex items-center justify-center"><Languages className="size-5" /></div><span className="text-[13px] font-black uppercase tracking-widest">Bahasa</span></div><LanguagePicker /></div>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </nav>

      <Dialog open={isRegModalOpen} onOpenChange={(open) => { if (activeAccount?.isNew) return; setIsRegModalOpen(open); }}>
        <DialogContent className="w-[95%] md:max-w-md p-0 border-none shadow-2xl overflow-hidden bg-card text-foreground rounded-2xl outline-none [&>button]:hidden">
          <div className="flex flex-col max-h-[85vh] overflow-y-auto no-scrollbar">
            <div className="flex flex-col items-center justify-center text-center space-y-3 pt-8 pb-4 px-6">
              <div className="size-14 rounded-full bg-black text-white flex items-center justify-center font-black text-2xl shadow-xl">O</div>
              <div className="space-y-1">
                <DialogTitle className="text-xl font-black tracking-tight text-slate-900 uppercase">Selamat Datang</DialogTitle>
                <DialogDescription className="font-medium text-slate-500 text-[13px] px-4">Pilih jenis profil untuk mulai membangun jaringan bisnis Anda.</DialogDescription>
              </div>
            </div>

            <div className="flex-1 px-5 pb-8 space-y-5">
              {!pendingType ? (
                <div className="grid gap-3">
                  {['pribadi', 'professional', 'bisnis'].map((type) => (
                    <button key={type} type="button" onClick={() => setPendingType(type as AccountType)} className="flex items-center gap-4 p-4 rounded-xl border-2 border-muted hover:border-black hover:bg-black/[0.02] transition-all group text-left shadow-sm">
                      <div className="size-10 rounded-xl bg-black/5 text-black flex items-center justify-center shrink-0">
                        {type === 'pribadi' ? <User className="size-5" /> : type === 'professional' ? <ShieldCheck className="size-5" /> : <Briefcase className="size-5" />}
                      </div>
                      <div>
                        <h4 className="font-bold text-[14px] text-slate-900 capitalize">Profil {type}</h4>
                        <p className="text-[12px] text-slate-500 font-medium leading-tight mt-0.5">{type === 'pribadi' ? 'Berbagi inspirasi bisnis.' : type === 'professional' ? 'Tampilkan keahlian.' : 'Akses data pasar eksklusif.'}</p>
                      </div>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="space-y-5 animate-in slide-in-from-right-4 duration-300">
                  <div className="flex items-center justify-between">
                    <button type="button" onClick={() => setPendingType(null)} className="h-8 px-3 font-bold text-[11px] uppercase tracking-widest text-muted-foreground hover:text-black">← Kembali</button>
                    <Badge className="px-4 py-1 font-black text-[10px] uppercase border-none bg-black text-white rounded-full">{pendingType}</Badge>
                  </div>
                  
                  <div className="flex flex-col items-center gap-3">
                    <div onClick={() => setIsMediaPickerOpen(true)} className="size-20 rounded-full bg-muted border-2 border-dashed border-border flex items-center justify-center text-muted-foreground group cursor-pointer hover:border-black transition-all overflow-hidden shadow-inner">
                      {regFormData.avatar ? <img src={regFormData.avatar} className="w-full h-full object-cover" alt="Profile" /> : <Camera className="size-7" />}
                    </div>
                    <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Foto Profil</span>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-1.5"><Label className="font-black text-[10px] uppercase tracking-widest text-slate-500 ml-1">Nama Tampilan *</Label><Input required placeholder="Nama Lengkap atau Brand" value={regFormData.name} onChange={(e) => setRegFormData({...regFormData, name: e.target.value})} className="rounded-xl h-11 bg-muted/20 border-none focus:bg-white transition-all font-bold px-4 text-[14px] shadow-inner" /></div>
                    <div className="space-y-1.5"><Label className="font-black text-[10px] uppercase tracking-widest text-slate-500 ml-1">Bio Singkat</Label><Textarea placeholder="Visi bisnis Anda..." value={regFormData.bio} onChange={(e) => setRegFormData({...regFormData, bio: e.target.value})} className="rounded-xl border-none min-h-[80px] bg-muted/20 focus:bg-white transition-all font-medium px-4 py-3 text-[14px] shadow-inner" /></div>
                    <div className="space-y-1.5">
                      <Label className="font-black text-[10px] uppercase tracking-widest text-slate-500 ml-1">Visibilitas Akun</Label>
                      <Select value={regFormData.visibility} onValueChange={(val: 'public' | 'private') => setRegFormData({...regFormData, visibility: val})}>
                        <SelectTrigger className="h-11 rounded-xl bg-muted/20 border-none px-4 text-[13px] font-bold shadow-inner"><SelectValue /></SelectTrigger>
                        <SelectContent><SelectItem value="public">🌍 Publik</SelectItem><SelectItem value="private">🔒 Privat</SelectItem></SelectContent>
                      </Select>
                    </div>
                  </div>

                  <Button onClick={handleRegisterSubmit} disabled={!regFormData.name.trim()} className="w-full h-12 rounded-xl bg-black hover:bg-black/90 text-white font-black text-[14px] uppercase tracking-widest shadow-xl active:scale-[0.98] transition-all">Selesaikan</Button>
                </div>
              )}
            </div>
            
            {activeAccount?.isNew && (
              <DialogFooter className="px-5 pb-5 mt-auto">
                <Button variant="ghost" onClick={handleLogout} className="w-full font-black text-[10px] uppercase tracking-widest text-muted-foreground hover:text-black">Batal & Keluar</Button>
              </DialogFooter>
            )}
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={isMediaPickerOpen} onOpenChange={setIsMediaPickerOpen}>
        <DialogContent className="w-[85%] md:max-w-xs rounded-2xl p-6 border-none shadow-2xl bg-card text-foreground outline-none [&>button]:hidden">
          <DialogHeader className="text-center"><DialogTitle className="text-base font-black uppercase tracking-tight">Pilih Media</DialogTitle></DialogHeader>
          <div className="grid gap-3 py-5">
            <Button variant="outline" disabled={isCloudLoading} onClick={() => fileInputRef.current?.click()} className="h-12 rounded-xl border-border bg-muted/50 hover:bg-black/5 justify-start gap-5 px-6 shadow-inner"><Smartphone className="size-5 text-black" /><p className="font-black text-[11px] uppercase tracking-widest">Galeri HP</p></Button>
            <Button variant="outline" disabled={isCloudLoading} onClick={() => handleCloudSource('drive')} className="h-12 rounded-xl border-border bg-muted/50 hover:bg-black/5 justify-start gap-5 px-6 shadow-inner"><Cloud className="size-5 text-black" /><p className="font-black text-[11px] uppercase tracking-widest">Layanan Cloud</p></Button>
          </div>
          <DialogFooter><Button variant="ghost" onClick={() => setIsMediaPickerOpen(false)} className="w-full font-black text-[11px] uppercase text-muted-foreground hover:bg-transparent">Batal</Button></DialogFooter>
        </DialogContent>
      </Dialog>

      <AIAssistant />
    </div>
  );
}
