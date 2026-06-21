
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
import Link from 'next/link';
import { 
  Pencil, 
  ShieldCheck, 
  User as UserIcon,
  PlusCircle,
  Trash2,
  Camera,
  X,
  MapPin,
  MessageSquare,
  Heart,
  Lock,
  Smartphone,
  Cloud,
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
    }, 1200);
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
      <div className="max-w-2xl mx-auto space-y-4 md:space-y-8 pb-20">
        <input type="file" multiple ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />

        <section className="relative group">
          <div className="h-28 md:h-56 w-full bg-muted border-b border-border relative overflow-hidden rounded-[1rem] md:rounded-[2rem]">
            <img src={`https://picsum.photos/seed/${activeAccount.id}_cover/1200/400`} alt="Cover" className="w-full h-full object-cover opacity-60 dark:opacity-40" />
            <div className="absolute top-2 right-2 md:top-4 md:right-4">
              <Button onClick={() => openMediaPicker('cover')} variant="outline" className="bg-background/80 backdrop-blur hover:bg-background text-foreground rounded-lg border-none font-black text-[7px] md:text-[9px] uppercase tracking-widest gap-1.5 shadow-sm h-7 md:h-9 px-3 md:px-4"><Camera className="size-3 text-accent" /> Edit Foto</Button>
            </div>
          </div>

          <div className="px-3 md:px-8 -mt-10 md:-mt-16 flex flex-col items-start gap-2 md:gap-4">
            <div className="relative group/avatar">
              <Avatar className="size-20 md:size-36 border-[3px] md:border-[6px] border-background dark:border-card shadow-lg rounded-[1rem] md:rounded-[2rem] cursor-zoom-in hover:opacity-95 transition-opacity" onClick={() => setZoomedImage(activeAccount.avatar)}>
                <AvatarImage src={activeAccount.avatar} className="object-cover" />
                <AvatarFallback className="bg-accent/10 text-accent"><UserIcon className="size-8 md:size-12" /></AvatarFallback>
              </Avatar>
              <button onClick={() => openMediaPicker('avatar')} className="absolute bottom-0 right-0 md:bottom-2 md:right-2 size-6 md:size-9 bg-accent text-white rounded-lg md:rounded-xl flex items-center justify-center border-2 border-background dark:border-card shadow-lg hover:scale-105 active:scale-95 transition-all"><Pencil className="size-3 md:size-4" /></button>
            </div>
            <div className="space-y-0.5 w-full">
              <div className="flex items-center gap-2">
                <h1 className="text-lg md:text-2xl font-black text-foreground tracking-tight">{activeAccount.name}</h1>
                {activeAccount.verificationStatus === 'Verified' && <Badge className="bg-emerald-500/10 text-emerald-500 border-none px-1.5 py-0.5 text-[7px] md:text-[9px] uppercase font-black tracking-widest flex gap-1 rounded-full"><ShieldCheck className="size-2.5 md:size-3" /> AI</Badge>}
              </div>
              <div className="flex flex-wrap items-center gap-2 md:gap-4">
                <div className="flex items-center gap-1 text-muted-foreground font-bold text-[11px] md:text-sm">{activeAccount.extra || 'OnTapp Member'}<Link href="/messages"><MessageSquare className="size-3 md:size-3.5 text-accent ml-1" /></Link></div>
                <div className="flex items-center gap-2 ml-auto">
                   <button className="flex flex-col items-center px-1"><span className="text-[10px] md:text-sm font-black">1.2k</span><span className="text-[6px] md:text-[8px] font-black text-muted-foreground uppercase tracking-widest">Pengikut</span></button>
                   <button className="flex flex-col items-center px-1 text-rose-500"><span className="text-[10px] md:text-sm font-black">4.2k</span><span className="text-[6px] md:text-[8px] font-black uppercase tracking-widest flex items-center gap-0.5"><Heart className="size-2 md:size-2.5 fill-rose-500" /> Suka</span></button>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="px-3 md:px-8">
          <div className="flex items-center justify-between border-b border-border/50 pb-2 md:pb-4">
            <p className="text-foreground/80 leading-relaxed font-medium text-[11px] md:text-sm italic">"{activeAccount.bio || 'Membangun koneksi cerdas di jaringan OnTapp.'}"</p>
            <Button variant="ghost" size="sm" onClick={() => { setTempAccount({ name: activeAccount.name, extra: activeAccount.extra, bio: activeAccount.bio }); setIsBioModalOpen(true); }} className="text-[7px] md:text-[9px] font-black uppercase text-accent hover:bg-accent/10 px-2 md:px-4 h-7 md:h-9 rounded-lg border border-accent/20 shrink-0"><Pencil className="size-2.5 md:size-3 mr-1" /> Edit</Button>
          </div>
        </section>

        <section className="px-3 md:px-8 space-y-4 md:space-y-6 pb-20">
          <div className="flex items-center justify-between">
            <h3 className="text-[8px] md:text-[10px] font-black uppercase tracking-widest text-muted-foreground">{activeAccount.type === 'pribadi' ? 'Nadi & Momen' : activeAccount.type === 'professional' ? 'Portofolio' : 'Katalog Produk'}</h3>
            <Button size="sm" onClick={() => setIsContentModalOpen(true)} className="rounded-lg md:rounded-xl h-8 md:h-10 bg-accent hover:bg-accent/90 gap-1.5 font-black text-[7px] md:text-[9px] uppercase tracking-widest px-3 md:px-5 shadow-lg text-white"><PlusCircle className="size-3 md:size-4" /> Tambah</Button>
          </div>

          <div className={cn(activeAccount.type === 'pribadi' ? "space-y-4 md:space-y-6" : "grid grid-cols-2 md:grid-cols-2 gap-3 md:gap-6")}>
            {(activeAccount.items || []).filter(i => i.source === 'profile').map((item) => (
              <div key={item.id} className="relative group">
                <Card className="rounded-[1rem] md:rounded-[1.5rem] border-border shadow-sm overflow-hidden bg-card border-none hover:shadow-lg transition-all">
                  {item.images && item.images.length > 0 && (
                    <div className="aspect-video w-full overflow-hidden relative cursor-zoom-in" onClick={() => setZoomedImage(item.images![0])}>
                      <img src={item.images[0]} className="w-full h-full object-cover" alt={item.title} />
                      {item.images.length > 1 && <div className="absolute bottom-1 right-1 bg-black/60 text-white px-1.5 py-0.5 rounded-lg text-[6px] md:text-[8px] font-black">{item.images.length} Foto</div>}
                    </div>
                  )}
                  <button onClick={() => removePost(item.id)} className="absolute top-1 right-1 md:top-2 md:right-2 z-10 size-6 md:size-8 bg-rose-500 text-white rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all shadow-lg"><Trash2 className="size-3 md:size-4" /></button>
                  <CardContent className="p-2 md:p-4 space-y-1">
                    <div className="flex items-center justify-between"><h4 className="font-black text-foreground text-[10px] md:text-sm line-clamp-1">{item.title}</h4>{item.visibility === 'private' && <Lock className="size-2.5 text-muted-foreground" />}</div>
                    <p className="text-muted-foreground text-[8px] md:text-[11px] font-medium line-clamp-2 leading-tight">{item.description}</p>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </section>
      </div>

      <Dialog open={isBioModalOpen} onOpenChange={setIsBioModalOpen}>
        <DialogContent className="w-[90%] md:max-w-sm rounded-[1rem] md:rounded-[1.5rem] p-5 md:p-6 bg-card text-foreground">
          <DialogHeader><DialogTitle className="text-base md:text-lg font-black">Edit Profil</DialogTitle></DialogHeader>
          <div className="space-y-3 py-2">
            <div className="space-y-1"><Label className="text-[8px] font-black uppercase">Nama</Label><Input value={tempAccount.name} onChange={(e) => setTempAccount({ ...tempAccount, name: e.target.value })} className="rounded-lg h-10 bg-muted/20 border-none text-xs" /></div>
            <div className="space-y-1"><Label className="text-[8px] font-black uppercase">Bio</Label><Textarea value={tempAccount.bio} onChange={(e) => setTempAccount({ ...tempAccount, bio: e.target.value })} className="rounded-lg bg-muted/20 border-none min-h-[80px] text-xs" /></div>
          </div>
          <DialogFooter><Button onClick={handleSaveBio} className="w-full h-10 rounded-lg bg-accent font-black text-white text-xs uppercase tracking-widest">Simpan</Button></DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isContentModalOpen} onOpenChange={setIsContentModalOpen}>
        <DialogContent className="w-[95%] md:max-w-lg rounded-[1.25rem] md:rounded-[1.5rem] p-5 md:p-8 bg-card text-foreground">
          <DialogHeader><DialogTitle className="text-base md:text-lg font-black text-foreground">Tambah Konten</DialogTitle></DialogHeader>
          <div className="space-y-4 md:space-y-5 pt-3 md:pt-4 overflow-y-auto max-h-[60vh] no-scrollbar">
            <div className="grid grid-cols-3 gap-2">
              {(newItem.images || []).map((src, i) => (
                <div key={i} className="relative aspect-square rounded-lg overflow-hidden border border-border">
                  <img src={src} className="w-full h-full object-cover" />
                  <button onClick={() => setNewItem(prev => ({ ...prev, images: prev.images?.filter((_, idx) => idx !== i) }))} className="absolute top-0.5 right-0.5 size-4 bg-black/60 text-white rounded-full flex items-center justify-center"><X size={8} /></button>
                </div>
              ))}
              <div onClick={() => openMediaPicker('post')} className="aspect-square rounded-lg bg-muted/30 border-2 border-dashed border-border flex items-center justify-center cursor-pointer hover:bg-accent/5">
                <PlusCircle className="size-5 md:size-6 text-muted-foreground" />
              </div>
            </div>
            <div className="space-y-1"><Label className="font-black text-[8px] uppercase text-muted-foreground">Judul</Label><Input value={newItem.title} onChange={(e) => setNewItem({ ...newItem, title: e.target.value })} className="rounded-lg h-10 bg-muted/20 border-none px-4 text-xs" /></div>
            <div className="space-y-1"><Label className="font-black text-[8px] uppercase text-muted-foreground">Visibilitas</Label><Select value={newItem.visibility} onValueChange={(val: 'public' | 'private') => setNewItem({ ...newItem, visibility: val })}><SelectTrigger className="rounded-lg h-10 bg-muted/20 border-none px-4 text-xs"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="public">🌍 Publik</SelectItem><SelectItem value="private">🔒 Privat</SelectItem></SelectContent></Select></div>
          </div>
          <DialogFooter className="mt-4"><Button onClick={handleAddContent} disabled={!newItem.images?.length} className="w-full h-10 md:h-12 rounded-lg bg-accent font-black text-white text-xs uppercase shadow-lg">Posting</Button></DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isMediaPickerOpen} onOpenChange={setIsMediaPickerOpen}>
        <DialogContent className="w-[85%] md:max-w-xs rounded-[1.25rem] p-5 border-none shadow-2xl bg-card text-foreground outline-none">
          <DialogHeader className="text-center"><DialogTitle className="text-base font-black">Impor Gambar</DialogTitle></DialogHeader>
          <div className="grid gap-2 py-4">
            <Button variant="outline" disabled={isCloudLoading} onClick={() => fileInputRef.current?.click()} className="h-12 rounded-xl border-border bg-muted/30 hover:bg-accent/10 justify-start gap-4 px-4">
              <Smartphone className="size-4 text-accent" />
              <p className="font-black text-[9px] uppercase tracking-widest">Perangkat</p>
            </Button>
            <Button variant="outline" disabled={isCloudLoading} onClick={() => handleCloudSource('drive')} className="h-12 rounded-xl border-border bg-muted/30 hover:bg-accent/10 justify-start gap-4 px-4">
              <Cloud className="size-4 text-blue-500" />
              <p className="font-black text-[9px] uppercase tracking-widest">Cloud Storage</p>
            </Button>
          </div>
          <DialogFooter><Button variant="ghost" onClick={() => setIsMediaPickerOpen(false)} className="w-full font-black text-[9px] uppercase tracking-widest text-muted-foreground">Batal</Button></DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!zoomedImage} onOpenChange={() => setZoomedImage(null)}>
        <DialogContent 
          className="max-w-screen-lg p-0 bg-black/95 border-none shadow-none flex items-center justify-center overflow-hidden outline-none [&>button]:hidden"
          onClick={() => setZoomedImage(null)}
        >
          {zoomedImage && <div className="w-full h-full max-h-[90vh] flex items-center justify-center p-4 cursor-pointer" onClick={() => setZoomedImage(null)}><img src={zoomedImage} alt="Zoomed View" onClick={(e) => e.stopPropagation()} className="max-w-full max-h-full object-contain rounded-xl animate-in zoom-in-95 duration-300" /></div>}
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
