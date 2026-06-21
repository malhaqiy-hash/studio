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
  PlusCircle,
  Trash2,
  Camera,
  X,
  Heart,
  Lock,
  Smartphone,
  Cloud,
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
        Array.from(files).forEach(file => {
          const reader = new FileReader();
          reader.onloadend = () => {
            setNewItem(prev => ({ ...prev, images: [...(prev.images || []), reader.result as string] }));
          };
          reader.readAsDataURL(file);
        });
      } else {
        const reader = new FileReader();
        reader.onloadend = () => {
          const result = reader.result as string;
          if (mediaTarget === 'avatar') updateActiveAccount({ avatar: result });
          if (mediaTarget === 'cover') updateActiveAccount({ id: activeAccount.id }); // Simulated
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
    addPost({
      images: newItem.images || [],
      title: newItem.title || 'Katalog Baru',
      description: newItem.description || '',
      visibility: newItem.visibility || 'public',
      source: 'profile'
    });
    setIsContentModalOpen(false);
    setNewItem({ visibility: 'public', images: [] });
    toast({ title: 'Konten dipublikasikan' });
  };

  return (
    <DashboardLayout>
      <div className="max-w-xl mx-auto space-y-4 md:space-y-6 pb-20">
        <input type="file" multiple ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />

        <section className="relative group">
          <div className="h-32 md:h-48 w-full bg-muted border-b border-border relative overflow-hidden rounded-xl md:rounded-2xl">
            <img src={`https://picsum.photos/seed/${activeAccount.id}_cover/1200/400`} alt="Cover" className="w-full h-full object-cover opacity-60" />
            <div className="absolute top-2 right-2">
              <Button onClick={() => openMediaPicker('cover')} variant="outline" className="bg-background/80 backdrop-blur text-foreground rounded-lg border-none font-bold text-xs uppercase tracking-widest gap-1.5 shadow-sm h-8 px-3"><Camera className="size-3.5 text-accent" /> Edit Sampul</Button>
            </div>
          </div>

          <div className="px-4 md:px-6 -mt-12 md:-mt-14 flex flex-col items-start gap-3">
            <div className="relative group/avatar">
              <Avatar className="size-24 md:size-32 border-[4px] border-background dark:border-card shadow-lg rounded-2xl cursor-zoom-in" onClick={() => setZoomedImage(activeAccount.avatar)}>
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
              <div className="flex flex-wrap items-center gap-4 text-muted-foreground font-medium text-[13px] md:text-[15px]">
                <span>{activeAccount.extra || 'OnTapp Member'}</span>
                <div className="flex items-center gap-3 ml-auto">
                   <div className="flex flex-col items-center"><span className="text-sm font-bold text-slate-900">1.2k</span><span className="text-[10px] font-bold uppercase opacity-60">Pengikut</span></div>
                   <div className="flex flex-col items-center text-rose-500"><span className="text-sm font-bold">4.2k</span><span className="text-[10px] font-bold uppercase flex items-center gap-0.5"><Heart className="size-2.5 fill-rose-500" /> Suka</span></div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="px-4 md:px-6">
          <div className="flex items-center justify-between border-b border-border/40 pb-4">
            <p className="text-slate-700 leading-relaxed font-normal text-[14px] md:text-[15px]">"{activeAccount.bio || 'Membangun koneksi cerdas di OnTapp.'}"</p>
            <Button variant="ghost" size="sm" onClick={() => { setTempAccount({ name: activeAccount.name, bio: activeAccount.bio }); setIsBioModalOpen(true); }} className="text-[11px] font-bold uppercase text-accent hover:bg-accent/10 px-3 h-8 rounded-lg border border-accent/20 shrink-0 ml-4"><Pencil className="size-3 mr-1" /> Edit</Button>
          </div>
        </section>

        <section className="px-4 md:px-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">Portofolio & Produk</h3>
            <Button size="sm" onClick={() => setIsContentModalOpen(true)} className="rounded-xl h-9 bg-accent hover:bg-accent/90 gap-1.5 font-bold text-xs uppercase tracking-widest px-4 shadow-lg text-white"><PlusCircle className="size-4" /> Tambah Item</Button>
          </div>

          <div className="grid grid-cols-2 gap-4 md:gap-6">
            {(activeAccount.items || []).filter(i => i.source === 'profile').map((item) => (
              <div key={item.id} className="relative group">
                <Card className="rounded-xl border-none shadow-sm overflow-hidden bg-card hover:shadow-lg transition-all group">
                  {item.images && item.images.length > 0 && (
                    <div className="aspect-square w-full overflow-hidden relative cursor-zoom-in" onClick={() => setZoomedImage(item.images![0])}>
                      <img src={item.images[0]} className="w-full h-full object-cover" alt={item.title} />
                      {item.images.length > 1 && <div className="absolute bottom-1 right-1 bg-black/60 text-white px-2 py-0.5 rounded-md text-[10px] font-bold">{item.images.length} Foto</div>}
                    </div>
                  )}
                  <button onClick={() => removePost(item.id)} className="absolute top-1 right-1 size-8 bg-rose-500 text-white rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all shadow-lg"><Trash2 className="size-4" /></button>
                  <CardContent className="p-3 space-y-1">
                    <div className="flex items-center justify-between"><h4 className="font-bold text-slate-900 text-[14px] line-clamp-1">{item.title}</h4>{item.visibility === 'private' && <Lock className="size-3 text-muted-foreground" />}</div>
                    <p className="text-muted-foreground text-[12px] font-normal line-clamp-2 leading-snug">{item.description}</p>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Modals */}
      <Dialog open={isBioModalOpen} onOpenChange={setIsBioModalOpen}>
        <DialogContent className="w-[90%] md:max-w-sm rounded-2xl p-6 bg-card text-foreground outline-none">
          <DialogHeader><DialogTitle className="text-lg font-bold text-slate-900">Ubah Profil</DialogTitle></DialogHeader>
          <div className="space-y-5 py-4">
            <div className="space-y-2"><Label className="text-xs font-bold uppercase text-muted-foreground">Nama Tampilan</Label><Input value={tempAccount.name} onChange={(e) => setTempAccount({ ...tempAccount, name: e.target.value })} className="rounded-xl h-12 bg-muted/20 border-none px-4 text-sm font-bold" /></div>
            <div className="space-y-2"><Label className="text-xs font-bold uppercase text-muted-foreground">Bio</Label><Textarea value={tempAccount.bio} onChange={(e) => setTempAccount({ ...tempAccount, bio: e.target.value })} className="rounded-xl bg-muted/20 border-none min-h-[100px] px-4 text-sm font-medium" /></div>
          </div>
          <DialogFooter><Button onClick={handleSaveBio} className="w-full h-12 rounded-xl bg-accent font-bold text-white text-sm uppercase tracking-widest shadow-lg active:scale-95 transition-all">Simpan Perubahan</Button></DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isContentModalOpen} onOpenChange={setIsContentModalOpen}>
        <DialogContent className="w-[95%] md:max-w-lg rounded-2xl p-6 bg-card text-foreground outline-none">
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
            <div className="space-y-2"><Label className="font-bold text-xs uppercase text-muted-foreground">Judul Item</Label><Input value={newItem.title} onChange={(e) => setNewItem({ ...newItem, title: e.target.value })} className="rounded-xl h-12 bg-muted/20 border-none px-4 text-sm font-bold" /></div>
            <div className="space-y-2"><Label className="font-bold text-xs uppercase text-muted-foreground">Deskripsi</Label><Textarea value={newItem.description} onChange={(e) => setNewItem({ ...newItem, description: e.target.value })} className="rounded-xl bg-muted/20 border-none min-h-[100px] px-4 text-sm font-medium" /></div>
          </div>
          <DialogFooter className="mt-6"><Button onClick={handleAddContent} disabled={!newItem.images?.length} className="w-full h-12 rounded-xl bg-accent font-bold text-white text-sm uppercase shadow-lg active:scale-95 transition-all">Publikasikan Konten</Button></DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isMediaPickerOpen} onOpenChange={setIsMediaPickerOpen}>
        <DialogContent className="w-[85%] md:max-w-xs rounded-2xl p-6 border-none shadow-2xl bg-card text-foreground outline-none">
          <DialogHeader className="text-center"><DialogTitle className="text-lg font-bold text-slate-900">Impor Gambar</DialogTitle></DialogHeader>
          <div className="grid gap-3 py-5">
            <Button variant="outline" disabled={isCloudLoading} onClick={() => fileInputRef.current?.click()} className="h-14 rounded-xl border-border bg-muted/30 hover:bg-accent/10 justify-start gap-4 px-5 shadow-inner">
              <Smartphone className="size-5 text-accent" />
              <p className="font-bold text-xs uppercase tracking-widest">Pilih di Perangkat</p>
            </Button>
            <Button variant="outline" disabled={isCloudLoading} onClick={() => handleCloudSource('drive')} className="h-14 rounded-xl border-border bg-muted/30 hover:bg-accent/10 justify-start gap-4 px-5 shadow-inner">
              <Cloud className="size-5 text-blue-500" />
              <p className="font-bold text-xs uppercase tracking-widest">Google Drive</p>
            </Button>
          </div>
          <DialogFooter><Button variant="ghost" onClick={() => setIsMediaPickerOpen(false)} className="w-full font-bold text-xs uppercase text-muted-foreground hover:bg-transparent">Batal</Button></DialogFooter>
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
