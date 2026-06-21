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
  Smartphone,
  Cloud,
  MessageSquare,
  Eye,
  Heart,
  Users,
  Lock,
  CheckCircle2,
  Youtube,
  Music,
  ShoppingBag,
  MessageCircleCode,
  Image as ImageIcon
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
import { cn } from '@/lib/utils';
import useEmblaCarousel from 'embla-carousel-react';

export default function ProfilePage() {
  const { activeAccount, updateActiveAccount, addPost, removePost } = useAccount();
  const { toast } = useToast();

  const [isBioModalOpen, setIsBioModalOpen] = React.useState(false);
  const [isContentModalOpen, setIsContentModalOpen] = React.useState(false);
  const [isMediaPickerOpen, setIsMediaPickerOpen] = React.useState(false);

  const [mediaTarget, setMediaTarget] = React.useState<'avatar' | 'cover' | 'post'>('avatar');
  const [isCloudLoading, setIsCloudLoading] = React.useState(false);
  const [tempAccount, setTempAccount] = React.useState<Partial<Account>>({});
  const [newItem, setNewItem] = React.useState<Partial<ContentItem>>({
    visibility: 'public',
    locationLink: '',
    images: []
  });
  
  const [zoomedImage, setZoomedImage] = React.useState<string | null>(null);
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      if (mediaTarget === 'post') {
        const newImages: string[] = [];
        let processed = 0;
        Array.from(files).forEach(file => {
          const reader = new FileReader();
          reader.onloadend = () => {
            newImages.push(reader.result as string);
            processed++;
            if (processed === files.length) {
              setNewItem(prev => ({ ...prev, images: [...(prev.images || []), ...newImages] }));
              toast({ title: `${files.length} Gambar ditambahkan` });
            }
          };
          reader.readAsDataURL(file);
        });
      } else {
        const reader = new FileReader();
        reader.onloadend = () => {
          const result = reader.result as string;
          if (mediaTarget === 'avatar') updateActiveAccount({ avatar: result });
          setIsMediaPickerOpen(false);
        };
        reader.readAsDataURL(files[0]);
      }
      setIsMediaPickerOpen(false);
    }
  };

  const handleCloudSource = (source: 'drive' | 'photos') => {
    setIsCloudLoading(true);
    toast({ title: `Menghubungkan ${source}...` });
    setTimeout(() => {
      const simulatedUrl = `https://picsum.photos/seed/cloud${Date.now()}/800/600`;
      if (mediaTarget === 'avatar') updateActiveAccount({ avatar: simulatedUrl });
      else if (mediaTarget === 'post') setNewItem(prev => ({ ...prev, images: [...(prev.images || []), simulatedUrl] }));
      setIsCloudLoading(false);
      setIsMediaPickerOpen(false);
      toast({ title: "Gambar berhasil diimpor" });
    }, 1500);
  };

  const handleAddContent = () => {
    const postData = {
      images: newItem.images || [],
      title: newItem.title || 'Tanpa Judul',
      description: newItem.description || '',
      visibility: newItem.visibility || 'public',
      locationLink: newItem.locationLink,
      source: 'profile' as const
    };
    addPost(postData);
    setIsContentModalOpen(false);
    setNewItem({ visibility: 'public', locationLink: '', images: [] });
    toast({ title: 'Konten dipublikasikan' });
  };

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto space-y-6 md:space-y-10 pb-24">
        <input type="file" multiple ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />

        <section className="relative group">
          <div className="h-32 md:h-64 w-full bg-muted border-b border-border relative overflow-hidden rounded-[1.5rem] md:rounded-[2.5rem]">
            <img src={`https://picsum.photos/seed/${activeAccount.id}_cover/1200/400`} alt="Cover" className="w-full h-full object-cover opacity-60 dark:opacity-40" />
            <div className="absolute top-3 right-3 md:top-6 md:right-6 flex gap-1.5 md:gap-2">
              <Button onClick={() => openMediaPicker('cover')} variant="outline" className="bg-background/90 backdrop-blur hover:bg-background text-foreground rounded-xl md:rounded-2xl border-none font-black text-[8px] md:text-[10px] uppercase tracking-widest gap-1.5 md:gap-2 shadow-sm h-8 md:h-10 px-3 md:px-5"><Camera className="size-3 md:size-4 text-accent" /> Edit Foto</Button>
            </div>
          </div>

          <div className="px-4 md:px-10 -mt-12 md:-mt-20 flex flex-col items-start gap-3 md:gap-4">
            <div className="relative group/avatar">
              <Avatar className="size-24 md:size-44 border-[4px] md:border-[8px] border-background dark:border-card shadow-xl overflow-hidden rounded-[1.5rem] md:rounded-[2.5rem] cursor-zoom-in hover:opacity-95 transition-opacity" onClick={() => setZoomedImage(activeAccount.avatar)}>
                <AvatarImage src={activeAccount.avatar} className="object-cover" />
                <AvatarFallback className="bg-accent/10 text-accent"><UserIcon className="size-10 md:size-14" /></AvatarFallback>
              </Avatar>
              <button onClick={() => openMediaPicker('avatar')} className="absolute bottom-1 right-1 md:bottom-3 md:right-3 size-8 md:size-11 bg-accent text-white rounded-lg md:rounded-2xl flex items-center justify-center border-2 md:border-4 border-background dark:border-card shadow-xl hover:scale-110 transition-transform active:scale-95"><Pencil className="size-3.5 md:size-5" /></button>
            </div>
            <div className="space-y-0.5 md:space-y-1 w-full">
              <div className="flex items-center gap-2 md:gap-3">
                <h1 className="text-xl md:text-3xl font-black text-foreground tracking-tight">{activeAccount.name}</h1>
                {activeAccount.verificationStatus === 'Verified' && <Badge className="bg-emerald-500/10 text-emerald-500 border-none px-2 py-0.5 md:px-3 md:py-1 text-[8px] md:text-[10px] uppercase font-black tracking-widest flex gap-1 rounded-full"><ShieldCheck className="size-3 md:size-3.5" /> AI</Badge>}
              </div>
              <div className="flex flex-wrap items-center gap-3 md:gap-4">
                <div className="flex items-center gap-1.5 text-muted-foreground font-bold text-sm md:text-base">{activeAccount.extra || 'OnTapp Member'}<Link href="/messages"><Button variant="ghost" size="icon" className="size-7 md:size-8 rounded-lg md:rounded-xl bg-accent/10 text-accent ml-1 hover:bg-accent/20"><MessageSquare className="size-3.5 md:size-4" /></Button></Link></div>
                <div className="flex items-center gap-2 md:gap-3 ml-auto">
                   <button className="flex flex-col items-center px-1 md:px-2 group"><span className="text-xs md:text-sm font-black group-hover:text-accent">1.2k</span><span className="text-[7px] md:text-[8px] font-black text-muted-foreground uppercase tracking-widest">Pengikut</span></button>
                   <button className="flex flex-col items-center px-1 md:px-2 group text-rose-500"><span className="text-xs md:text-sm font-black group-hover:text-rose-600">4.2k</span><span className="text-[7px] md:text-[8px] font-black uppercase tracking-widest flex items-center gap-0.5 md:gap-1"><Heart className="size-2 md:size-2.5 fill-rose-500" /> Suka</span></button>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="px-4 md:px-10 space-y-4 md:space-y-6">
          <div className="flex items-center justify-between border-b border-border pb-3 md:pb-4">
            <p className="text-foreground/80 leading-relaxed font-medium text-sm md:text-lg italic">"{activeAccount.bio || 'Membangun koneksi cerdas di jaringan OnTapp.'}"</p>
            <Button variant="ghost" size="sm" onClick={() => { setTempAccount({ name: activeAccount.name, extra: activeAccount.extra, bio: activeAccount.bio }); setIsBioModalOpen(true); }} className="text-[8px] md:text-[10px] font-black uppercase text-accent hover:bg-accent/10 px-3 md:px-5 h-8 md:h-10 rounded-lg md:rounded-xl border border-accent/20 shrink-0"><Pencil className="size-3 md:size-3.5 mr-1.5 md:mr-2" /> Edit</Button>
          </div>
        </section>

        <section className="px-4 md:px-10 space-y-6 md:space-y-8 pb-20">
          <div className="flex items-center justify-between">
            <h3 className="text-[9px] md:text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground">{activeAccount.type === 'pribadi' ? 'Nadi & Momen' : activeAccount.type === 'professional' ? 'Portofolio' : 'Katalog Produk'}</h3>
            <Button size="sm" onClick={() => setIsContentModalOpen(true)} className="rounded-xl md:rounded-2xl h-9 md:h-11 bg-accent hover:bg-accent/90 gap-1.5 md:gap-2 font-black text-[8px] md:text-[10px] uppercase tracking-widest px-4 md:px-6 shadow-xl text-white"><PlusCircle className="size-3.5 md:size-4" /> Tambah</Button>
          </div>

          <div className={cn(activeAccount.type === 'pribadi' ? "space-y-6 md:space-y-8" : "grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-8")}>
            {(activeAccount.items || []).filter(i => i.source === 'profile').map((item) => (
              <div key={item.id} className="relative group">
                <Card className="rounded-[1.5rem] md:rounded-[2.5rem] border-border shadow-sm overflow-hidden group hover:shadow-2xl transition-all bg-card border-none">
                  {item.images && item.images.length > 0 && (
                    <div className="aspect-video w-full overflow-hidden relative cursor-zoom-in" onClick={() => setZoomedImage(item.images![0])}>
                      <img src={item.images[0]} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={item.title} />
                      {item.images.length > 1 && <div className="absolute bottom-2 right-2 md:bottom-4 md:right-4 bg-black/60 text-white px-2 py-0.5 md:py-1 rounded-lg text-[8px] md:text-[9px] font-black">{item.images.length} Foto</div>}
                    </div>
                  )}
                  <button onClick={() => removePost(item.id)} className="absolute top-2 right-2 md:top-4 md:right-4 z-10 size-8 md:size-10 bg-rose-500 text-white rounded-xl flex items-center justify-center md:opacity-0 group-hover:opacity-100 transition-all shadow-xl hover:scale-110"><Trash2 className="size-4 md:size-5" /></button>
                  <CardContent className="p-4 md:p-6 space-y-2 md:space-y-3">
                    <div className="flex items-center justify-between"><h4 className="font-black text-foreground text-sm md:text-lg line-clamp-1">{item.title}</h4>{item.visibility === 'private' && <Lock className="size-3 text-muted-foreground" />}</div>
                    <p className="text-muted-foreground text-[10px] md:text-xs font-medium line-clamp-2">{item.description}</p>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Edit Bio Modal */}
      <Dialog open={isBioModalOpen} onOpenChange={setIsBioModalOpen}>
        <DialogContent className="w-[90%] md:max-w-md rounded-[1.5rem] md:rounded-[2rem] p-6 md:p-8 bg-card text-foreground">
          <DialogHeader><DialogTitle className="text-lg md:text-xl font-black">Edit Profil</DialogTitle></DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-1.5"><Label className="text-[10px] font-black uppercase">Nama</Label><Input value={tempAccount.name} onChange={(e) => setTempAccount({ ...tempAccount, name: e.target.value })} className="rounded-xl h-12 bg-muted/30 border-none" /></div>
            <div className="space-y-1.5"><Label className="text-[10px] font-black uppercase">Bio</Label><Textarea value={tempAccount.bio} onChange={(e) => setTempAccount({ ...tempAccount, bio: e.target.value })} className="rounded-xl bg-muted/30 border-none min-h-[100px]" /></div>
          </div>
          <DialogFooter><Button onClick={handleSaveBio} className="w-full h-12 rounded-xl bg-accent font-black text-white uppercase tracking-widest shadow-lg">Simpan</Button></DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isContentModalOpen} onOpenChange={setIsContentModalOpen}>
        <DialogContent className="w-[95%] md:max-w-xl rounded-[2rem] md:rounded-[3rem] p-6 md:p-10 bg-card text-foreground">
          <DialogHeader><DialogTitle className="text-xl md:text-2xl font-black text-foreground">Tambah Konten</DialogTitle></DialogHeader>
          <div className="space-y-4 md:space-y-6 pt-4 md:pt-6 overflow-y-auto max-h-[65vh] no-scrollbar">
            <div className="grid grid-cols-2 gap-2 md:gap-3">
              {(newItem.images || []).map((src, i) => (
                <div key={i} className="relative aspect-video rounded-xl md:rounded-2xl overflow-hidden border border-border">
                  <img src={src} className="w-full h-full object-cover" alt="Preview" />
                  <button onClick={() => setNewItem(prev => ({ ...prev, images: prev.images?.filter((_, idx) => idx !== i) }))} className="absolute top-1.5 right-1.5 size-5 md:size-6 bg-black/60 text-white rounded-full flex items-center justify-center"><X className="size-2.5 md:size-3" /></button>
                </div>
              ))}
              <div onClick={() => openMediaPicker('post')} className="aspect-video rounded-xl md:rounded-2xl bg-muted/50 border-2 border-dashed border-border flex items-center justify-center cursor-pointer hover:bg-accent/5">
                <PlusCircle className="size-6 md:size-8 text-muted-foreground" />
              </div>
            </div>
            <div className="space-y-1.5"><Label className="font-black text-[9px] md:text-[10px] uppercase text-muted-foreground">Judul</Label><Input value={newItem.title} onChange={(e) => setNewItem({ ...newItem, title: e.target.value })} className="rounded-xl md:rounded-2xl h-11 md:h-14 bg-muted/50 border-none px-4 md:px-6" /></div>
            <div className="space-y-1.5"><Label className="font-black text-[9px] md:text-[10px] uppercase text-muted-foreground">Visibilitas</Label><Select value={newItem.visibility} onValueChange={(val: 'public' | 'private') => setNewItem({ ...newItem, visibility: val })}><SelectTrigger className="rounded-xl md:rounded-2xl h-11 md:h-14 bg-muted/50 border-none px-4 md:px-6"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="public">🌍 Publik</SelectItem><SelectItem value="private">🔒 Privat</SelectItem></SelectContent></Select></div>
          </div>
          <DialogFooter className="mt-4 md:mt-6"><Button onClick={handleAddContent} disabled={!newItem.images?.length} className="w-full h-11 md:h-14 rounded-xl md:rounded-2xl bg-accent font-black text-white uppercase shadow-xl">Posting</Button></DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isMediaPickerOpen} onOpenChange={setIsMediaPickerOpen}>
        <DialogContent className="w-[85%] md:max-w-md rounded-[1.5rem] md:rounded-[2.5rem] p-5 md:p-6 border-none shadow-2xl bg-card text-foreground outline-none">
          <DialogHeader className="text-center">
            <DialogTitle className="text-lg md:text-xl font-black">Impor Gambar</DialogTitle>
          </DialogHeader>
          <div className="grid gap-2.5 py-4">
            <Button variant="outline" disabled={isCloudLoading} onClick={() => fileInputRef.current?.click()} className="h-14 md:h-16 rounded-xl border-border bg-muted/50 hover:bg-accent/10 justify-start gap-4 px-4">
              <Smartphone className="size-4 md:size-5 text-accent" />
              <div className="text-left">
                <p className="font-black text-[9px] md:text-xs uppercase tracking-widest">Perangkat</p>
                <p className="text-[7px] md:text-[8px] font-bold text-muted-foreground uppercase opacity-60">Galeri Lokal</p>
              </div>
            </Button>
            <Button variant="outline" disabled={isCloudLoading} onClick={() => handleCloudSource('drive')} className="h-14 md:h-16 rounded-xl border-border bg-muted/50 hover:bg-accent/10 justify-start gap-4 px-4">
              <Cloud className="size-4 md:size-5 text-blue-500" />
              <div className="text-left">
                <p className="font-black text-[9px] md:text-xs uppercase tracking-widest">Cloud Storage</p>
                <p className="text-[7px] md:text-[8px] font-bold text-muted-foreground uppercase opacity-60">Drive / Photos</p>
              </div>
            </Button>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setIsMediaPickerOpen(false)} className="w-full font-black text-[9px] md:text-xs uppercase tracking-widest text-muted-foreground">Batal</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!zoomedImage} onOpenChange={() => setZoomedImage(null)}>
        <DialogContent 
          className="max-w-screen-lg p-0 bg-black/98 border-none shadow-none flex items-center justify-center overflow-hidden outline-none [&>button]:hidden"
          onClick={() => setZoomedImage(null)}
        >
          {zoomedImage && <div className="w-full h-full max-h-[90vh] flex items-center justify-center p-4 cursor-pointer" onClick={() => setZoomedImage(null)}><img src={zoomedImage} alt="Zoomed View" onClick={(e) => e.stopPropagation()} className="max-w-full max-h-full object-contain rounded-xl animate-in zoom-in-95 duration-300" /></div>}
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}