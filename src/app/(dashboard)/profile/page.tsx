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
import { 
  Pencil, 
  ShieldCheck, 
  PlusCircle,
  Trash2,
  Camera,
  X,
  Heart,
  Lock,
  Smartphone,
  Cloud,
  MapPin,
  Globe,
  Instagram,
  Linkedin,
  Facebook,
  Link as LinkIcon,
  Share2,
  Users,
  Zap,
  Pin,
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from '@/hooks/use-toast';
import { ShareSheet } from '@/components/share-sheet';
import { cn } from '@/lib/utils';

function getSmartIcon(url: string) {
  const lower = url.toLowerCase();
  if (lower.includes('maps.google') || lower.includes('goo.gl/maps') || lower.includes('apple.com/maps')) return <MapPin className="size-3.5" />;
  if (lower.includes('instagram.com')) return <Instagram className="size-3.5" />;
  if (lower.includes('linkedin.com')) return <Linkedin className="size-3.5" />;
  if (lower.includes('facebook.com') || lower.includes('fb.com')) return <Facebook className="size-3.5" />;
  if (lower.includes('wa.me') || lower.includes('whatsapp.com')) return <Smartphone className="size-3.5" />;
  return <Globe className="size-3.5" />;
}

export default function ProfilePage() {
  const { activeAccount, updateActiveAccount, addPost, removePost } = useAccount();
  const { toast } = useToast();

  const [isBioModalOpen, setIsBioModalOpen] = React.useState(false);
  const [isContentModalOpen, setIsContentModalOpen] = React.useState(false);
  const [isMediaPickerOpen, setIsMediaPickerOpen] = React.useState(false);
  const [isShareSheetOpen, setIsShareSheetOpen] = React.useState(false);
  const [shareUrl, setShareUrl] = React.useState("");

  const [mediaTarget, setMediaTarget] = React.useState<'avatar' | 'cover' | 'post'>('avatar');
  const [tempAccount, setTempAccount] = React.useState<Partial<Account>>({});
  
  const [isNewCategory, setIsNewCategory] = React.useState(false);
  const [isCloudLoading, setIsCloudLoading] = React.useState(false);
  
  const [newItem, setNewItem] = React.useState<Partial<ContentItem>>({
    visibility: 'public',
    displayLocation: 'both',
    images: [],
    locationLink: '',
    categoryName: ''
  });
  
  const [zoomedImage, setZoomedImage] = React.useState<string | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const resetContentForm = React.useCallback(() => {
    setNewItem({
      visibility: 'public',
      displayLocation: 'both',
      images: [],
      locationLink: '',
      categoryName: '',
      title: '',
      description: ''
    });
    setIsNewCategory(false);
  }, []);

  React.useEffect(() => {
    resetContentForm();
    setIsContentModalOpen(false);
    setIsBioModalOpen(false);
  }, [activeAccount.id, resetContentForm]);

  const profileVisibleItems = React.useMemo(() => {
    const items = (activeAccount.items || []).filter(i => 
      !i.isArchived && (i.displayLocation === 'profile' || i.displayLocation === 'both')
    );
    // Sort so pinned items are first
    return [...items].sort((a, b) => {
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;
      return 0;
    });
  }, [activeAccount.items]);

  const groupedItems = React.useMemo(() => {
    if (activeAccount.type === 'pribadi') return { 'Inspirasi': profileVisibleItems };
    
    const groups: Record<string, ContentItem[]> = {};
    profileVisibleItems.forEach(item => {
      const cat = item.categoryName || 'Lainnya';
      if (!groups[cat]) groups[cat] = [];
      groups[cat].push(item);
    });
    return groups;
  }, [profileVisibleItems, activeAccount.type]);

  const existingCategories = React.useMemo(() => {
    return Array.from(new Set((activeAccount.items || []).map(i => i.categoryName).filter(Boolean)));
  }, [activeAccount.items]);

  const handleSaveBio = () => {
    updateActiveAccount(tempAccount);
    setIsBioModalOpen(false);
    toast({ title: 'Profil diperbarui' });
  };

  const openMediaPicker = (target: 'avatar' | 'cover' | 'post') => {
    setMediaTarget(target);
    setIsMediaPickerOpen(true);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      if (mediaTarget === 'post') {
        Array.from(files).forEach(file => {
          const reader = new FileReader();
          reader.onload = () => {
            setNewItem(prev => ({ ...prev, images: [...(prev.images || []), reader.result as string] }));
          };
          reader.readAsDataURL(file);
        });
        setIsMediaPickerOpen(false);
      } else {
        const reader = new FileReader();
        reader.onload = () => {
          const result = reader.result as string;
          if (mediaTarget === 'avatar') updateActiveAccount({ avatar: result });
          if (mediaTarget === 'cover') updateActiveAccount({ cover: result });
          setIsMediaPickerOpen(false);
        };
        reader.readAsDataURL(files[0]);
      }
      e.target.value = '';
    }
  };

  const handleCloudSource = (source: 'drive' | 'photos') => {
    setIsCloudLoading(true);
    toast({ title: `Menghubungkan ke ${source === 'drive' ? 'Drive' : 'Photos'}...` });
    
    setTimeout(() => {
      const simulatedUrl = mediaTarget === 'cover' 
        ? `https://picsum.photos/seed/cover${Date.now()}/1640/624`
        : `https://picsum.photos/seed/img${Date.now()}/500/500`;
      
      if (mediaTarget === 'avatar') {
        updateActiveAccount({ avatar: simulatedUrl });
      } else if (mediaTarget === 'cover') {
        updateActiveAccount({ cover: simulatedUrl });
      } else if (mediaTarget === 'post') {
        setNewItem(prev => ({ ...prev, images: [...(prev.images || []), simulatedUrl] }));
      }
      
      setIsCloudLoading(false);
      setIsMediaPickerOpen(false);
      toast({ title: "Media berhasil disinkronkan" });
    }, 1500);
  };

  const handleAddContent = () => {
    if ((activeAccount.type === 'bisnis' || activeAccount.type === 'professional') && !newItem.categoryName) {
      toast({ variant: "destructive", title: "Kategori wajib diisi." });
      return;
    }
    
    addPost({
      images: newItem.images || [],
      title: newItem.title || 'Katalog Baru',
      description: newItem.description || '',
      visibility: newItem.visibility || 'public',
      displayLocation: newItem.displayLocation || 'both',
      locationLink: newItem.locationLink,
      categoryName: newItem.categoryName,
      source: 'profile'
    });
    setIsContentModalOpen(false);
    resetContentForm();
    toast({ title: 'Konten dipublikasikan' });
  };

  const handleShareProfile = () => {
    setShareUrl(`https://tapp.network/profile/${activeAccount.id}`);
    setIsShareSheetOpen(true);
  };

  const handleSharePost = (id: string) => {
    setShareUrl(`https://tapp.network/post/${id}`);
    setIsShareSheetOpen(true);
  };

  return (
    <DashboardLayout>
      <div className="max-w-xl mx-auto space-y-4 md:space-y-6 pb-20">
        <input type="file" multiple ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />

        <section className="relative group">
          <div className="aspect-[1640/624] w-full bg-muted border-b border-border relative overflow-hidden rounded-xl md:rounded-2xl">
            <img 
              src={activeAccount.cover || `https://picsum.photos/seed/${activeAccount.id}_cover/1640/624`} 
              alt="Cover" 
              className="w-full h-full object-cover opacity-90" 
            />
            <div className="absolute top-4 right-4 flex gap-2">
              <Button 
                onClick={() => openMediaPicker('cover')} 
                variant="outline" 
                size="icon"
                className="bg-background/80 backdrop-blur text-accent border-none rounded-xl shadow-lg active:scale-90 transition-transform"
              >
                <Camera className="size-5" />
              </Button>
              <Button 
                onClick={handleShareProfile} 
                variant="outline" 
                size="icon"
                className="bg-background/80 backdrop-blur text-accent border-none rounded-xl shadow-lg active:scale-90 transition-transform"
              >
                <Share2 className="size-5" />
              </Button>
            </div>
          </div>

          <div className="px-4 md:px-6 -mt-12 md:-mt-14 flex flex-col items-start gap-3">
            <div className="relative group/avatar">
              <Avatar className="size-24 md:size-32 border-[4px] border-background dark:border-card shadow-lg rounded-2xl">
                <AvatarImage src={activeAccount.avatar} className="object-cover" />
                <AvatarFallback className="bg-accent/10 text-accent font-bold text-xl">{activeAccount.name[0]}</AvatarFallback>
              </Avatar>
              <button onClick={() => openMediaPicker('avatar')} className="absolute bottom-0 right-0 size-8 bg-accent text-white rounded-lg flex items-center justify-center border-2 border-background shadow-lg hover:scale-105 active:scale-95 transition-all"><Pencil className="size-4" /></button>
            </div>
            <div className="space-y-1 w-full">
              <div className="flex items-center gap-2">
                <h1 className="text-xl md:text-2xl font-bold text-slate-900 tracking-tight">{activeAccount.name}</h1>
                {activeAccount.verificationStatus === 'Verified' && <Badge className="bg-emerald-500/10 text-emerald-500 border-none px-2 py-0.5 text-[10px] uppercase font-bold rounded-full"><ShieldCheck className="size-3" /> AI</Badge>}
              </div>
              <div className="flex flex-col gap-1">
                <div className="flex flex-wrap items-center gap-4 text-muted-foreground font-medium text-[13px] md:text-[15px]">
                  <span>{activeAccount.extra || 'Tapp Member'}</span>
                  <div className="flex items-center gap-4 ml-auto">
                     <div className="flex flex-col items-center">
                        <span className="text-sm font-bold text-slate-900">1.2k</span>
                        <span className="text-[9px] font-black uppercase opacity-60 flex items-center gap-1">
                          {activeAccount.type === 'pribadi' ? <><Users className="size-2.5" /> Pengikut</> : <><Zap className="size-2.5" /> Subscribe</>}
                        </span>
                     </div>
                     <div className="flex flex-col items-center text-rose-500">
                        <span className="text-sm font-bold">4.2k</span>
                        <span className="text-[9px] font-black uppercase flex items-center gap-1">
                          <Heart className="size-2.5 fill-rose-500" /> Suka
                        </span>
                     </div>
                  </div>
                </div>
                {activeAccount.locationLink && (
                  <a href={activeAccount.locationLink} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-accent font-bold text-[11px] uppercase tracking-widest hover:underline mt-1">
                    {getSmartIcon(activeAccount.locationLink)}
                    Tautan Profil
                  </a>
                )}
              </div>
            </div>
          </div>
        </section>

        <section className="px-4 md:px-6">
          <div className="flex items-center justify-between border-b border-border/40 pb-4">
            <p className="text-slate-700 leading-relaxed font-normal text-[14px] md:text-[15px]">"{activeAccount.bio || 'Membangun koneksi cerdas di Tapp.'}"</p>
            <Button variant="ghost" size="sm" onClick={() => { setTempAccount({ name: activeAccount.name, bio: activeAccount.bio, locationLink: activeAccount.locationLink }); setIsBioModalOpen(true); }} className="text-[11px] font-bold uppercase text-accent hover:bg-accent/10 px-3 h-8 rounded-lg border border-accent/20 shrink-0 ml-4"><Pencil className="size-3 mr-1" /> Edit</Button>
          </div>
        </section>

        <section className="px-4 md:px-6 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">Portofolio & Produk</h3>
            <Button size="sm" onClick={() => setIsContentModalOpen(true)} className="rounded-xl h-9 bg-accent hover:bg-accent/90 gap-1.5 font-bold text-xs uppercase tracking-widest px-4 shadow-lg text-white"><PlusCircle className="size-4" /> Tambah Item</Button>
          </div>

          <div className="flex flex-col space-y-10">
            {Object.entries(groupedItems).map(([category, items]) => (
              <div key={category} className="space-y-4">
                <div className="flex items-center justify-between px-1">
                   <h4 className="text-lg font-black text-slate-900 tracking-tight uppercase border-l-4 border-black pl-3">{category}</h4>
                   <Badge variant="secondary" className="text-[10px] font-black">{items.length} Item</Badge>
                </div>
                
                <div className={cn(
                  activeAccount.type === 'pribadi' ? "grid grid-cols-2 gap-4" : "flex overflow-x-auto no-scrollbar space-x-4 px-1 pb-4 snap-x"
                )}>
                  {items.map((item) => (
                    <div key={item.id} className={cn(activeAccount.type === 'pribadi' ? "" : "w-36 md:w-40 flex-shrink-0 snap-start")}>
                      <Card className="rounded-2xl border-none shadow-md overflow-hidden bg-card hover:shadow-xl transition-all relative group">
                        {item.images && item.images.length > 0 && (
                          <div className="aspect-square w-full overflow-hidden relative cursor-zoom-in" onClick={() => setZoomedImage(item.images![0])}>
                            <img src={item.images[0]} className="w-full h-full object-cover" alt={item.title} />
                            {item.images.length > 1 && <div className="absolute bottom-1 right-1 bg-black/60 text-white px-1.5 py-0.5 rounded-md text-[8px] font-black uppercase">{item.images.length} Foto</div>}
                            {item.isPinned && <div className="absolute top-2 right-2 bg-accent text-white p-1.5 rounded-full shadow-lg"><Pin className="size-3 fill-white" /></div>}
                          </div>
                        )}
                        <div className="absolute top-1 left-1 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-all">
                          <button onClick={(e) => { e.stopPropagation(); handleSharePost(item.id); }} className="size-7 bg-black/60 text-white rounded-lg flex items-center justify-center shadow-lg"><Share2 className="size-3.5" /></button>
                          <button onClick={(e) => { e.stopPropagation(); removePost(item.id); }} className="size-7 bg-rose-500 text-white rounded-lg flex items-center justify-center shadow-lg"><Trash2 className="size-3.5" /></button>
                        </div>
                        <CardContent className="p-3 space-y-0.5">
                          <h5 className="font-black text-slate-900 text-[13px] truncate leading-none">{item.title}</h5>
                          <p className="text-slate-400 text-[11px] font-medium line-clamp-2 leading-tight h-7">{item.description}</p>
                        </CardContent>
                      </Card>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      <Dialog open={isBioModalOpen} onOpenChange={setIsBioModalOpen}>
        <DialogContent className="w-[90%] md:max-sm rounded-2xl p-6 bg-card text-foreground outline-none [&>button]:hidden">
          <DialogHeader><DialogTitle className="text-lg font-bold text-slate-900">Ubah Profil</DialogTitle></DialogHeader>
          <div className="space-y-5 py-4">
            <div className="space-y-2"><Label className="text-xs font-bold uppercase text-muted-foreground">Nama Tampilan</Label><Input value={tempAccount.name} onChange={(e) => setTempAccount({ ...tempAccount, name: e.target.value })} className="rounded-xl h-12 bg-muted/20 border-none px-4 text-sm font-bold" /></div>
            <div className="space-y-2"><Label className="text-xs font-bold uppercase text-muted-foreground">Bio</Label><Textarea value={tempAccount.bio} onChange={(e) => setTempAccount({ ...tempAccount, bio: e.target.value })} className="rounded-xl bg-muted/20 border-none min-h-[100px] px-4 text-sm font-medium" /></div>
            <div className="space-y-2">
              <Label className="text-xs font-bold uppercase text-muted-foreground">Link Alamat/Web</Label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">{tempAccount.locationLink ? getSmartIcon(tempAccount.locationLink) : <LinkIcon className="size-4" />}</div>
                <Input value={tempAccount.locationLink} onChange={(e) => setTempAccount({ ...tempAccount, locationLink: e.target.value })} placeholder="https://maps.google.com/..." className="rounded-xl h-11 bg-muted/20 border-none pl-10 text-sm font-medium shadow-inner" />
              </div>
            </div>
          </div>
          <DialogFooter><Button onClick={handleSaveBio} className="w-full h-12 rounded-xl bg-accent font-bold text-white text-sm uppercase tracking-widest shadow-lg active:scale-95 transition-all">Simpan</Button></DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog 
        open={isContentModalOpen} 
        onOpenChange={(open) => {
          setIsContentModalOpen(open);
          if (!open) resetContentForm(); 
        }}
      >
        <DialogContent className="w-[95%] md:max-w-lg rounded-2xl p-6 bg-card text-foreground outline-none [&>button]:hidden">
          <DialogHeader className="flex flex-row items-center justify-between">
            <DialogTitle className="text-lg font-bold text-slate-900">Tambah Konten</DialogTitle>
            <div className="w-32">
              <Select value={newItem.visibility} onValueChange={(val: 'public' | 'private') => setNewItem({ ...newItem, visibility: val })}>
                <SelectTrigger className="h-9 rounded-lg bg-muted/50 border-none text-xs font-bold px-3 shadow-inner"><SelectValue /></SelectTrigger>
                <SelectContent><SelectItem value="public">🌍 Publik</SelectItem><SelectItem value="private">🔒 Privat</SelectItem></SelectContent>
              </Select>
            </div>
          </DialogHeader>
          <div className="space-y-5 pt-4 overflow-y-auto max-h-[65vh] no-scrollbar">
            <div className="space-y-3 p-4 bg-muted/20 rounded-2xl">
              <Label className="font-black text-[10px] uppercase tracking-widest text-muted-foreground">Lokasi Tampilan Konten</Label>
              <Select value={newItem.displayLocation} onValueChange={(val: any) => setNewItem({ ...newItem, displayLocation: val })}>
                <SelectTrigger className="rounded-xl h-11 bg-card border-none shadow-sm font-bold text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="both">🌍 Beranda & Profil</SelectItem>
                  <SelectItem value="feed">🏠 Hanya Beranda</SelectItem>
                  <SelectItem value="profile">👤 Hanya Profil</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-3 gap-3">
              {(newItem.images || []).map((src, i) => (
                <div key={i} className="relative aspect-square rounded-xl overflow-hidden border border-border">
                  <img src={src} className="w-full h-full object-cover" />
                  <button onClick={() => setNewItem(prev => ({ ...prev, images: prev.images?.filter((_, idx) => idx !== i) }))} className="absolute top-1 right-1 size-6 bg-black/60 text-white rounded-full flex items-center justify-center"><X size={12} /></button>
                </div>
              ))}
              <div onClick={() => openMediaPicker('post')} className="aspect-square rounded-xl bg-muted/30 border-2 border-dashed border-border flex items-center justify-center cursor-pointer hover:bg-accent/5 transition-colors">
                <PlusCircle className="size-8 text-muted-foreground" />
              </div>
            </div>

            {(activeAccount.type === 'bisnis' || activeAccount.type === 'professional') && (
              <div className="space-y-3 p-4 bg-muted/20 rounded-2xl">
                 <Label className="font-black text-[10px] uppercase tracking-widest text-muted-foreground">Kategori Postingan *</Label>
                 <Select 
                   value={isNewCategory ? "new" : newItem.categoryName} 
                   onValueChange={(val) => {
                     if (val === 'new') {
                       setIsNewCategory(true);
                       setNewItem({...newItem, categoryName: ''});
                     } else {
                       setIsNewCategory(false);
                       setNewItem({...newItem, categoryName: val});
                     }
                   }}
                 >
                   <SelectTrigger className="rounded-xl h-11 bg-card border-none shadow-sm font-bold text-sm">
                     <SelectValue placeholder="Pilih Kategori" />
                   </SelectTrigger>
                   <SelectContent>
                      <SelectItem value="new" className="font-black text-accent">+ Buat Kategori Baru</SelectItem>
                      {existingCategories.map(cat => (
                        <SelectItem key={cat} value={cat!}>{cat}</SelectItem>
                      ))}
                   </SelectContent>
                 </Select>

                 {isNewCategory && (
                   <Input 
                     autoFocus
                     placeholder="Nama Kategori Baru" 
                     value={newItem.categoryName} 
                     onChange={(e) => setNewItem({...newItem, categoryName: e.target.value})} 
                     className="rounded-xl h-11 bg-white border-black/10 focus:border-black transition-all font-bold px-4"
                   />
                 )}
              </div>
            )}

            <div className="space-y-2"><Label className="font-bold text-xs uppercase text-muted-foreground">Judul Item</Label><Input value={newItem.title} onChange={(e) => setNewItem({ ...newItem, title: e.target.value })} className="rounded-xl h-12 bg-muted/20 border-none px-4 text-sm font-bold" /></div>
            <div className="space-y-2"><Label className="font-bold text-xs uppercase text-muted-foreground">Deskripsi</Label><Textarea value={newItem.description} onChange={(e) => setNewItem({ ...newItem, description: e.target.value })} className="rounded-xl bg-muted/20 border-none min-h-[100px] px-4 text-sm font-medium" /></div>
            <div className="space-y-2">
              <Label className="font-bold text-xs uppercase text-muted-foreground">Link Alamat/Web</Label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">{newItem.locationLink ? getSmartIcon(newItem.locationLink) : <LinkIcon className="size-4" />}</div>
                <Input value={newItem.locationLink} onChange={(e) => setNewItem({ ...newItem, locationLink: e.target.value })} placeholder="https://maps.google.com/..." className="rounded-xl h-11 bg-muted/20 border-none pl-10 text-sm font-medium shadow-inner" />
              </div>
            </div>
          </div>
          <DialogFooter className="mt-6"><Button onClick={handleAddContent} disabled={!newItem.images?.length || ((activeAccount.type !== 'pribadi') && !newItem.categoryName)} className="w-full h-12 rounded-xl bg-accent font-bold text-white text-sm uppercase shadow-lg active:scale-95 transition-all">Posting</Button></DialogFooter>
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

      <Dialog open={!!zoomedImage} onOpenChange={() => setZoomedImage(null)}>
        <DialogContent 
          className="max-w-[100vw] w-screen h-screen p-0 m-0 bg-black/98 border-none shadow-none flex items-center justify-center overflow-hidden outline-none [&>button]:hidden cursor-pointer"
          onClick={() => setZoomedImage(null)}
        >
          {zoomedImage && <div className="w-full h-full max-h-[90vh] flex items-center justify-center p-4"><img src={zoomedImage} alt="Zoomed View" className="max-w-full max-h-full object-contain rounded-xl animate-in zoom-in-95 duration-300 shadow-none border-none" /></div>}
        </DialogContent>
      </Dialog>

      <ShareSheet isOpen={isShareSheetOpen} onOpenChange={setIsShareSheetOpen} postUrl={shareUrl} />
    </DashboardLayout>
  );
}
