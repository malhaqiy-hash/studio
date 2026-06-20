
'use client';

import * as React from 'react';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { useAccount, Account, ContentItem } from '@/context/account-context';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import Link from 'next/link';
import { 
  Instagram, 
  Linkedin, 
  Facebook, 
  Link2, 
  Pencil, 
  ShieldCheck, 
  Building2, 
  Briefcase, 
  User as UserIcon,
  Plus,
  Trash2,
  Camera,
  PlusCircle,
  X,
  Share2,
  QrCode,
  MapPin,
  Brain,
  Zap,
  Target,
  Image as ImageIcon,
  Smartphone,
  Cloud,
  RefreshCw,
  MessageSquare,
  Eye,
  Heart,
  Users,
  Lock
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription
} from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

const MOCK_USERS = [
  { name: "Andi Wijaya", role: "UI Designer", avatar: "https://picsum.photos/seed/a1/100" },
  { name: "Siti Rahma", role: "Marketing Lead", avatar: "https://picsum.photos/seed/a2/100" },
  { name: "Budi Santoso", role: "Software Engineer", avatar: "https://picsum.photos/seed/a3/100" },
  { name: "Digital Solutions Co", role: "Tech Partner", avatar: "https://picsum.photos/seed/a4/100" },
  { name: "Lina Marlina", role: "Freelancer", avatar: "https://picsum.photos/seed/a5/100" },
];

export default function ProfilePage() {
  const { activeAccount, updateActiveAccount } = useAccount();
  const { toast } = useToast();

  const [isBioModalOpen, setIsBioModalOpen] = React.useState(false);
  const [isLinksModalOpen, setIsLinksModalOpen] = React.useState(false);
  const [isContentModalOpen, setIsContentModalOpen] = React.useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = React.useState(false);
  const [isMediaPickerOpen, setIsMediaPickerOpen] = React.useState(false);
  const [isUserListOpen, setIsUserListOpen] = React.useState(false);

  const [mediaTarget, setMediaTarget] = React.useState<'avatar' | 'cover' | 'post'>('avatar');
  const [isCloudLoading, setIsCloudLoading] = React.useState(false);
  const [tempAccount, setTempAccount] = React.useState<Partial<Account>>({});
  const [newItem, setNewItem] = React.useState<Partial<ContentItem>>({
    visibility: 'public',
    locationLink: ''
  });
  const [newLinkUrl, setNewLinkUrl] = React.useState('');
  const [userListTitle, setUserListTitle] = React.useState('');
  
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleSaveBio = () => {
    updateActiveAccount(tempAccount);
    setIsBioModalOpen(false);
    toast({ title: 'Profil diperbarui' });
  };

  const openMediaPicker = (target: 'avatar' | 'cover' | 'post') => {
    setMediaTarget(target);
    setIsMediaPickerOpen(true);
  };

  const openUserList = (title: string, isAllowed?: boolean) => {
    if (!isAllowed) {
      toast({ 
        title: "Akses Dibatasi", 
        description: "Pemilik akun mengatur daftar ini sebagai privat.",
        variant: "destructive"
      });
      return;
    }
    setUserListTitle(title);
    setIsUserListOpen(true);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        if (mediaTarget === 'avatar') {
          updateActiveAccount({ avatar: result });
          toast({ title: "Foto profil diperbarui" });
        } else if (mediaTarget === 'cover') {
          updateActiveAccount({ avatar: activeAccount.avatar }); 
          toast({ title: "Foto sampul diperbarui" });
        } else if (mediaTarget === 'post') {
          setNewItem(prev => ({ ...prev, image: result }));
          toast({ title: "Gambar ditambahkan" });
        }
        setIsMediaPickerOpen(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCloudSource = (source: 'drive' | 'photos') => {
    setIsCloudLoading(true);
    toast({ title: "Menghubungkan layanan Cloud..." });

    setTimeout(() => {
      const simulatedUrl = `https://picsum.photos/seed/cloud${Date.now()}/800/600`;
      if (mediaTarget === 'avatar') updateActiveAccount({ avatar: simulatedUrl });
      setIsCloudLoading(false);
      setIsMediaPickerOpen(false);
      toast({ title: "Gambar berhasil diimpor" });
    }, 1500);
  };

  const handleAddLink = () => {
    if (!newLinkUrl) return;
    const updatedLinks = [...(activeAccount.links || []), newLinkUrl];
    updateActiveAccount({ links: updatedLinks });
    setNewLinkUrl('');
    toast({ title: "Tautan ditambahkan" });
  };

  const handleRemoveLink = (index: number) => {
    const updatedLinks = (activeAccount.links || []).filter((_, i) => i !== index);
    updateActiveAccount({ links: updatedLinks });
  };

  const handleAddContent = () => {
    const item: ContentItem = {
      id: `item-${Date.now()}`,
      image: newItem.image || `https://picsum.photos/seed/${Date.now()}/600/400`,
      title: newItem.title || 'Tanpa Judul',
      description: newItem.description || '',
      visibility: newItem.visibility || 'public',
      timestamp: 'Baru saja',
      locationLink: newItem.locationLink
    };
    updateActiveAccount({
      items: [item, ...(activeAccount.items || [])]
    });
    setIsContentModalOpen(false);
    setNewItem({ visibility: 'public', locationLink: '' });
    toast({ title: 'Konten dipublikasikan' });
  };

  const handleRemoveItem = (id: string) => {
    updateActiveAccount({
      items: (activeAccount.items || []).filter(item => item.id !== id)
    });
    toast({ title: 'Konten dihapus' });
  };

  const handleAIContentGenerator = () => {
    toast({ title: "AI Content Engine", description: "Bekerja membuat draf konten..." });
    setTimeout(() => {
      setNewItem({
        title: activeAccount.type === 'bisnis' ? "Penawaran Kerjasama Eksklusif" : "Portfolio Inovasi 2025",
        description: "Dikembangkan dengan presisi untuk memenuhi standar industri global menggunakan teknologi terbaru.",
        visibility: 'public',
        image: `https://picsum.photos/seed/ai${Date.now()}/800/500`,
      });
      setIsContentModalOpen(true);
    }, 1200);
  };

  const getLinkIcon = (url: string) => {
    const lowerUrl = url.toLowerCase();
    if (lowerUrl.includes('instagram')) return <Instagram className="size-4" />;
    if (lowerUrl.includes('linkedin')) return <Linkedin className="size-4" />;
    if (lowerUrl.includes('facebook')) return <Facebook className="size-4" />;
    return <Link2 className="size-4" />;
  };

  const openInMaps = (url?: string) => {
    if (url) window.open(url, '_blank');
  };

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto space-y-12 pb-24">
        <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />

        <section className="relative group">
          <div className="h-48 md:h-64 w-full bg-muted border-b border-border relative overflow-hidden rounded-[2.5rem]">
            <img 
              src={`https://picsum.photos/seed/${activeAccount.id}_cover/1200/400`} 
              alt="Cover" 
              className="w-full h-full object-cover opacity-60 dark:opacity-40"
            />
            <div className="absolute top-6 right-6 flex gap-2">
              <Button onClick={() => setIsShareModalOpen(true)} className="bg-background/90 dark:bg-card/90 backdrop-blur hover:bg-background text-foreground rounded-2xl border-none font-black text-[10px] uppercase tracking-widest gap-2 shadow-lg h-10 px-5">
                <Share2 className="size-4 text-accent" /> Bagi
              </Button>
              <Button onClick={() => openMediaPicker('cover')} variant="outline" className="bg-background/90 dark:bg-card/90 backdrop-blur hover:bg-background text-foreground rounded-2xl border-none font-black text-[10px] uppercase tracking-widest gap-2 shadow-sm h-10 px-5">
                <Camera className="size-4 text-accent" /> Edit Foto
              </Button>
            </div>
          </div>

          <div className="px-6 md:px-10 -mt-16 md:-mt-20 flex flex-col items-start gap-4">
            <div className="relative group/avatar">
              <Avatar className="size-32 md:size-44 border-[8px] border-background dark:border-card shadow-2xl overflow-hidden rounded-[2.5rem]">
                <AvatarImage src={activeAccount.avatar} className="object-cover" />
                <AvatarFallback className="bg-accent/10 text-accent"><UserIcon size={56} /></AvatarFallback>
              </Avatar>
              <button onClick={() => openMediaPicker('avatar')} className="absolute bottom-3 right-3 size-11 bg-accent text-white rounded-2xl flex items-center justify-center border-4 border-background dark:border-card shadow-xl hover:scale-110 transition-transform active:scale-95">
                <Pencil className="size-5" />
              </button>
            </div>

            <div className="space-y-1 w-full">
              <div className="flex items-center gap-3">
                <h1 className="text-3xl font-black text-foreground tracking-tight">{activeAccount.name}</h1>
                {activeAccount.verificationStatus === 'Verified' && (
                  <Badge className="bg-emerald-500/10 text-emerald-500 border-none px-3 py-1 text-[10px] uppercase font-black tracking-widest flex gap-1.5 rounded-full">
                    <ShieldCheck className="size-3.5" /> AI Verified
                  </Badge>
                )}
              </div>
              
              <div className="flex flex-wrap items-center gap-4">
                <div className="flex items-center gap-2 text-muted-foreground font-bold text-base">
                  {activeAccount.type === 'bisnis' ? <Building2 size={18} className="text-accent" /> : activeAccount.type === 'professional' ? <Briefcase size={18} className="text-accent" /> : <UserIcon size={18} className="text-accent" />}
                  {activeAccount.extra || 'OnTapp Member'}
                </div>
                
                <div className="flex items-center gap-2">
                  <Link href="/messages">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="size-9 rounded-xl bg-accent/10 text-accent hover:bg-accent/20 transition-all border border-accent/20 shadow-sm active:scale-90"
                    >
                      <MessageSquare className="size-4" />
                    </Button>
                  </Link>

                  <div className="flex items-center gap-3 ml-2">
                    {activeAccount.type === 'pribadi' ? (
                      <>
                        <button 
                          onClick={() => openUserList("Pengikut", activeAccount.preferences?.publicFollowers)}
                          className="flex flex-col items-center px-2 group"
                        >
                           <span className={cn("text-sm font-black group-hover:text-accent", !activeAccount.preferences?.publicFollowers && "flex items-center gap-1")}>
                             1.2k {!activeAccount.preferences?.publicFollowers && <Lock className="size-3 text-muted-foreground" />}
                           </span>
                           <span className="text-[8px] font-black text-muted-foreground uppercase tracking-widest">Pengikut</span>
                        </button>
                        <div className="w-px h-6 bg-border" />
                        <button 
                          onClick={() => openUserList("Mengikuti", activeAccount.preferences?.publicFollowing)}
                          className="flex flex-col items-center px-2 group"
                        >
                           <span className={cn("text-sm font-black group-hover:text-accent", !activeAccount.preferences?.publicFollowing && "flex items-center gap-1")}>
                             452 {!activeAccount.preferences?.publicFollowing && <Lock className="size-3 text-muted-foreground" />}
                           </span>
                           <span className="text-[8px] font-black text-muted-foreground uppercase tracking-widest">Mengikuti</span>
                        </button>
                        <div className="w-px h-6 bg-border" />
                        <button 
                          onClick={() => openUserList("Total Suka", activeAccount.preferences?.publicLikes)}
                          className="flex flex-col items-center px-2 text-rose-500 group"
                        >
                           <div className="flex items-center gap-1">
                             <Heart className="size-3 fill-rose-500" />
                             <span className="text-sm font-black">2.4k</span>
                             {!activeAccount.preferences?.publicLikes && <Lock className="size-3 text-muted-foreground" />}
                           </div>
                           <span className="text-[8px] font-black text-muted-foreground uppercase tracking-widest">Suka Total</span>
                        </button>
                      </>
                    ) : (
                      <>
                        <button 
                          onClick={() => openUserList("Tayangan Profil", activeAccount.preferences?.publicViews)}
                          className="flex items-center gap-2 bg-muted/50 px-3 py-1.5 rounded-xl border border-border hover:bg-muted transition-colors group"
                        >
                           <Eye className="size-3.5 text-muted-foreground" />
                           <div className="flex flex-col leading-none text-left">
                             <span className="text-xs font-black text-foreground flex items-center gap-1">
                               8.9k {!activeAccount.preferences?.publicViews && <Lock className="size-2 text-muted-foreground" />}
                             </span>
                             <span className="text-[7px] font-black text-muted-foreground uppercase">Tayangan</span>
                           </div>
                        </button>
                        <button 
                          onClick={() => openUserList("Total Suka", activeAccount.preferences?.publicLikes)}
                          className="flex items-center gap-2 bg-rose-500/10 px-3 py-1.5 rounded-xl border border-rose-500/20 hover:bg-rose-500/20 transition-colors group"
                        >
                           <Heart className="size-3.5 text-rose-500 fill-rose-500" />
                           <div className="flex flex-col leading-none text-left">
                             <span className="text-xs font-black text-rose-500 flex items-center gap-1">
                               4.2k {!activeAccount.preferences?.publicLikes && <Lock className="size-2 text-muted-foreground" />}
                             </span>
                             <span className="text-[7px] font-black text-muted-foreground uppercase">Suka</span>
                           </div>
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="px-6 md:px-10 space-y-6">
          <div className="flex items-center justify-between border-b border-border pb-4">
            <p className="text-foreground/80 leading-relaxed font-medium text-lg italic">
              "{activeAccount.bio || 'Membangun koneksi cerdas di jaringan OnTapp.'}"
            </p>
            <Button variant="ghost" size="sm" onClick={() => { setTempAccount({ name: activeAccount.name, extra: activeAccount.extra, bio: activeAccount.bio }); setIsBioModalOpen(true); }} className="text-[10px] font-black uppercase text-accent hover:bg-accent/10 px-5 h-10 rounded-xl border border-accent/20 shrink-0">
              <Pencil className="size-3.5 mr-2" /> Edit Profil
            </Button>
          </div>
          
          {activeAccount.type !== 'pribadi' && (
            <div className="flex flex-wrap gap-4 pt-2">
              <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-accent bg-accent/5 px-4 py-2 rounded-2xl border border-accent/20 shadow-sm">
                <Target className="size-4" /> 92% Synergy Match
              </div>
            </div>
          )}
        </section>

        <section className="px-6 md:px-10 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground">Hub Koneksi Eksternal</h3>
            <Button variant="ghost" size="sm" onClick={() => setIsLinksModalOpen(true)} className="text-[10px] font-black uppercase text-accent hover:bg-accent/10 px-4 rounded-xl">
              <Plus className="size-3.5 mr-2" /> Kelola Link
            </Button>
          </div>
          <div className="flex flex-wrap gap-3">
            {(activeAccount.links || []).map((link, idx) => (
              <a key={idx} href={link} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 px-5 py-2.5 rounded-2xl border border-border bg-card text-xs font-black text-foreground/70 hover:border-accent hover:text-accent transition-all shadow-sm">
                {getLinkIcon(link)}
                <span className="max-w-[140px] truncate uppercase tracking-tighter">{new URL(link).hostname.replace('www.', '')}</span>
              </a>
            ))}
          </div>
        </section>

        <section className="px-6 md:px-10 space-y-8 pb-20">
          <div className="flex items-center justify-between">
            <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground">
              {activeAccount.type === 'pribadi' ? 'Nadi & Momen' : activeAccount.type === 'professional' ? 'Galeri Portofolio' : 'Katalog Produk & Promosi'}
            </h3>
            <div className="flex gap-3">
              {activeAccount.type !== 'pribadi' && (
                <Button onClick={handleAIContentGenerator} variant="outline" size="sm" className="rounded-2xl h-11 border-accent/30 text-accent gap-2 font-black text-[10px] uppercase tracking-widest px-5 shadow-sm">
                  <Brain className="size-4" /> AI Generate
                </Button>
              )}
              <Button size="sm" onClick={() => setIsContentModalOpen(true)} className="rounded-2xl h-11 bg-accent hover:bg-accent/90 gap-2 font-black text-[10px] uppercase tracking-widest px-6 shadow-xl text-white">
                <PlusCircle className="size-4" /> Tambah Baru
              </Button>
            </div>
          </div>

          <div className={cn(activeAccount.type === 'pribadi' ? "space-y-8" : "grid grid-cols-1 md:grid-cols-2 gap-8")}>
            {(activeAccount.items || []).map((item) => (
              <div key={item.id} className="relative group">
                <Card className="rounded-[2.5rem] border-border shadow-sm overflow-hidden group hover:shadow-2xl transition-all bg-card border-none">
                  {item.image && (
                    <div className="aspect-video w-full overflow-hidden relative">
                      <img src={item.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={item.title} />
                    </div>
                  )}
                  <button onClick={() => handleRemoveItem(item.id)} className="absolute top-4 right-4 size-10 bg-rose-500 text-white rounded-2xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all shadow-xl hover:scale-110"><Trash2 className="size-5" /></button>
                  <CardContent className="p-6 space-y-3">
                    <h4 className="font-black text-foreground text-lg line-clamp-1">{item.title}</h4>
                    <p className="text-muted-foreground text-xs font-medium line-clamp-2">{item.description}</p>
                    {item.locationLink && (
                      <div className="pt-2 border-t border-border">
                        <button onClick={() => openInMaps(item.locationLink)} className="flex items-center gap-2 text-[10px] font-black uppercase text-rose-500 hover:text-rose-600 transition-colors">
                          <MapPin className="size-3" /> Lokasi Bisnis
                        </button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </section>
      </div>

      <Dialog open={isUserListOpen} onOpenChange={setIsUserListOpen}>
        <DialogContent className="max-w-md rounded-[2.5rem] p-0 border-none shadow-2xl bg-card overflow-hidden">
          <DialogHeader className="p-8 pb-4 bg-muted border-b border-border">
            <DialogTitle className="text-xl font-black text-foreground tracking-tight flex items-center gap-2">
              <Users className="size-5 text-accent" />
              {userListTitle}
            </DialogTitle>
          </DialogHeader>
          <ScrollArea className="h-[400px] p-6">
            <div className="space-y-4">
              {MOCK_USERS.map((u, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-2xl hover:bg-muted/50 transition-colors border border-transparent hover:border-border">
                  <div className="flex items-center gap-4">
                    <Avatar className="size-10 border border-background shadow-sm">
                      <AvatarImage src={u.avatar} />
                      <AvatarFallback>{u.name[0]}</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <span className="text-sm font-black text-foreground">{u.name}</span>
                      <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{u.role}</span>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="h-8 rounded-lg text-[9px] font-black uppercase border-accent/30 text-accent">Profil</Button>
                </div>
              ))}
            </div>
          </ScrollArea>
          <DialogFooter className="p-6 pt-0">
             <Button onClick={() => setIsUserListOpen(false)} className="w-full h-12 rounded-xl bg-foreground text-background font-black uppercase tracking-widest">Tutup</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isMediaPickerOpen} onOpenChange={setIsMediaPickerOpen}>
        <DialogContent className="max-w-md rounded-[3rem] p-8 border-none shadow-2xl bg-card">
          <DialogHeader className="text-center sm:text-center">
            <DialogTitle className="text-2xl font-black text-foreground">Pilih Sumber Media</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-8">
            <Button variant="outline" onClick={() => fileInputRef.current?.click()} className="h-20 rounded-2xl border-border bg-muted/50 hover:bg-accent/10 justify-start gap-6 px-6">
              <Smartphone className="size-6 text-accent" /> <div className="text-left"><p className="font-black text-sm uppercase text-foreground">Perangkat</p><p className="text-[10px] opacity-60 text-muted-foreground">Galeri lokal</p></div>
            </Button>
            <Button variant="outline" onClick={() => handleCloudSource('drive')} className="h-20 rounded-2xl border-border bg-muted/50 hover:bg-accent/10 justify-start gap-6 px-6">
              <Cloud className="size-6 text-blue-500" /> <div className="text-left"><p className="font-black text-sm uppercase text-foreground">Google Drive</p><p className="text-[10px] opacity-60 text-muted-foreground">Pilih file Drive</p></div>
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={isBioModalOpen} onOpenChange={setIsBioModalOpen}>
        <DialogContent className="max-w-xl rounded-[3rem] p-10 bg-card">
          <DialogHeader><DialogTitle className="text-2xl font-black text-foreground">Edit Profil</DialogTitle></DialogHeader>
          <div className="space-y-6 pt-6">
            <div className="space-y-2"><Label className="font-black text-[10px] uppercase text-muted-foreground">Nama</Label><Input value={tempAccount.name} onChange={(e) => setTempAccount({ ...tempAccount, name: e.target.value })} className="rounded-2xl h-14 bg-muted/50 border-none px-6 text-foreground" /></div>
            <div className="space-y-2"><Label className="font-black text-[10px] uppercase text-muted-foreground">Bio</Label><Textarea value={tempAccount.bio} onChange={(e) => setTempAccount({ ...tempAccount, bio: e.target.value })} className="rounded-2xl bg-muted/50 border-none min-h-[140px] px-6 py-4 text-foreground" /></div>
          </div>
          <DialogFooter className="mt-10"><Button onClick={handleSaveBio} className="rounded-2xl bg-accent h-14 px-12 font-black text-white w-full sm:w-auto">Simpan</Button></DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isLinksModalOpen} onOpenChange={setIsLinksModalOpen}>
        <DialogContent className="max-w-xl rounded-[3rem] p-10 bg-card">
          <DialogHeader><DialogTitle className="text-2xl font-black text-foreground">Kelola Tautan</DialogTitle></DialogHeader>
          <div className="space-y-8 pt-6">
            <div className="flex gap-3">
              <Input value={newLinkUrl} onChange={(e) => setNewLinkUrl(e.target.value)} placeholder="https://..." className="rounded-2xl h-14 border-border bg-muted/30" />
              <Button onClick={handleAddLink} className="h-14 w-14 rounded-2xl bg-accent text-white shrink-0"><Plus size={24} /></Button>
            </div>
            <div className="space-y-3">
              {(activeAccount.links || []).map((link, i) => (
                <div key={i} className="flex items-center justify-between p-4 bg-muted/50 rounded-2xl">
                  <span className="text-sm font-bold truncate text-foreground">{link}</span>
                  <button onClick={() => handleRemoveLink(i)} className="text-muted-foreground hover:text-rose-500"><X size={18} /></button>
                </div>
              ))}
            </div>
          </div>
          <DialogFooter><Button onClick={() => setIsLinksModalOpen(false)} className="w-full h-14 rounded-2xl bg-foreground text-background font-black uppercase">Selesai</Button></DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isContentModalOpen} onOpenChange={setIsContentModalOpen}>
        <DialogContent className="max-w-xl rounded-[3rem] p-10 bg-card">
          <DialogHeader><DialogTitle className="text-2xl font-black text-foreground">Tambah Konten</DialogTitle></DialogHeader>
          <div className="space-y-6 pt-6">
            <div onClick={() => openMediaPicker('post')} className="w-full aspect-video rounded-3xl bg-muted/50 border-2 border-dashed border-border flex items-center justify-center cursor-pointer overflow-hidden">
              {newItem.image ? <img src={newItem.image} className="w-full h-full object-cover" alt="Preview" /> : <ImageIcon className="size-10 text-muted-foreground" />}
            </div>
            <div className="space-y-2"><Label className="font-black text-[10px] uppercase text-muted-foreground">Judul</Label><Input value={newItem.title} onChange={(e) => setNewItem({ ...newItem, title: e.target.value })} className="rounded-2xl h-14 bg-muted/50 border-none px-6 text-foreground" /></div>
            <div className="space-y-2"><Label className="font-black text-[10px] uppercase text-muted-foreground">Link Lokasi</Label><Input value={newItem.locationLink} onChange={(e) => setNewItem({ ...newItem, locationLink: e.target.value })} className="rounded-2xl h-12 bg-muted/50 border-none px-6 text-foreground" placeholder="https://maps..." /></div>
          </div>
          <DialogFooter className="mt-10"><Button onClick={handleAddContent} className="w-full h-14 rounded-2xl bg-accent font-black text-white uppercase">Posting</Button></DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isShareModalOpen} onOpenChange={setIsShareModalOpen}>
        <DialogContent className="max-w-[340px] rounded-[3.5rem] p-0 border-none shadow-2xl bg-card overflow-hidden">
          <div className="p-10 flex flex-col items-center space-y-10">
             <QrCode className="size-56 text-foreground" />
             <Button onClick={() => { navigator.clipboard.writeText(`https://ontapp.network/p/${activeAccount.id}`); toast({ title: "Link disalin" }); }} className="w-full h-14 rounded-[2rem] bg-foreground text-background font-black uppercase text-xs tracking-widest">Salin Link Profil</Button>
          </div>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
