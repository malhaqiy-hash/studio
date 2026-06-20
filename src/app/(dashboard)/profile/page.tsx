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
  Instagram, 
  Linkedin, 
  Facebook, 
  ShoppingBag, 
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
  Globe,
  Lock,
  Share2,
  QrCode,
  Copy,
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
  Users
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

export default function ProfilePage() {
  const { activeAccount, updateActiveAccount } = useAccount();
  const { toast } = useToast();

  const [isBioModalOpen, setIsBioModalOpen] = React.useState(false);
  const [isLinksModalOpen, setIsLinksModalOpen] = React.useState(false);
  const [isContentModalOpen, setIsContentModalOpen] = React.useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = React.useState(false);
  const [isMediaPickerOpen, setIsMediaPickerOpen] = React.useState(false);

  const [mediaTarget, setMediaTarget] = React.useState<'avatar' | 'cover' | 'post'>('avatar');
  const [isCloudLoading, setIsCloudLoading] = React.useState(false);
  const [tempAccount, setTempAccount] = React.useState<Partial<Account>>({});
  const [newItem, setNewItem] = React.useState<Partial<ContentItem>>({
    visibility: 'public',
    locationLink: ''
  });
  const [newLinkUrl, setNewLinkUrl] = React.useState('');
  
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
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        if (mediaTarget === 'avatar') {
          updateActiveAccount({ avatar: result });
          toast({ title: "Foto profil diperbarui" });
        } else if (mediaTarget === 'cover') {
          updateActiveAccount({ avatar: activeAccount.avatar }); // Trigger update
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
    toast({ title: "AI Content Engine", description: "Membangun draf konten cerdas..." });
    setTimeout(() => {
      setNewItem({
        title: activeAccount.type === 'bisnis' ? "Penawaran Kerjasama Eksklusif" : "Portfolio Inovasi 2025",
        description: "Dikembangkan dengan presisi untuk memenuhi standar industri global...",
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
          <div className="h-48 md:h-64 w-full bg-slate-50 border-b border-slate-100 relative overflow-hidden rounded-[2.5rem]">
            <img 
              src={`https://picsum.photos/seed/${activeAccount.id}_cover/1200/400`} 
              alt="Cover" 
              className="w-full h-full object-cover opacity-80"
            />
            <div className="absolute top-6 right-6 flex gap-2">
              <Button onClick={() => setIsShareModalOpen(true)} className="bg-white/90 backdrop-blur hover:bg-white text-slate-900 rounded-2xl border-none font-black text-[10px] uppercase tracking-widest gap-2 shadow-lg h-10 px-5">
                <Share2 className="size-4" /> Bagi
              </Button>
              <Button onClick={() => openMediaPicker('cover')} variant="outline" className="bg-white/90 backdrop-blur hover:bg-white text-slate-600 rounded-2xl border-none font-black text-[10px] uppercase tracking-widest gap-2 shadow-sm h-10 px-5">
                <Camera className="size-4" /> Edit Foto
              </Button>
            </div>
          </div>

          <div className="px-6 md:px-10 -mt-16 md:-mt-20 flex flex-col items-start gap-4">
            <div className="relative group/avatar">
              <Avatar className="size-32 md:size-44 border-[8px] border-white shadow-2xl overflow-hidden rounded-[2.5rem]">
                <AvatarImage src={activeAccount.avatar} className="object-cover" />
                <AvatarFallback className="bg-teal-50 text-accent"><UserIcon size={56} /></AvatarFallback>
              </Avatar>
              <button onClick={() => openMediaPicker('avatar')} className="absolute bottom-3 right-3 size-11 bg-teal-600 text-white rounded-2xl flex items-center justify-center border-4 border-white shadow-xl hover:scale-110 transition-transform active:scale-95">
                <Pencil className="size-5" />
              </button>
            </div>

            <div className="space-y-1 w-full">
              <div className="flex items-center gap-3">
                <h1 className="text-3xl font-black text-slate-900 tracking-tight">{activeAccount.name}</h1>
                {activeAccount.verificationStatus === 'Verified' && (
                  <Badge className="bg-emerald-50 text-emerald-700 border-none px-3 py-1 text-[10px] uppercase font-black tracking-widest flex gap-1.5 rounded-full">
                    <ShieldCheck className="size-3.5" /> AI Verified
                  </Badge>
                )}
              </div>
              
              <div className="flex flex-wrap items-center gap-4">
                <div className="flex items-center gap-2 text-slate-500 font-bold text-base">
                  {activeAccount.type === 'bisnis' ? <Building2 size={18} className="text-teal-600" /> : activeAccount.type === 'professional' ? <Briefcase size={18} className="text-teal-600" /> : <UserIcon size={18} className="text-teal-600" />}
                  {activeAccount.extra || 'OnTapp Member'}
                </div>
                
                <div className="flex items-center gap-2">
                  <Link href="/messages">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="size-9 rounded-xl bg-teal-50 text-teal-600 hover:bg-teal-100 transition-all border border-teal-100 shadow-sm active:scale-90"
                    >
                      <MessageSquare className="size-4" />
                    </Button>
                  </Link>

                  {/* Statistik Dinamis di Samping Tombol Pesan */}
                  <div className="flex items-center gap-3 ml-2">
                    {activeAccount.type === 'pribadi' ? (
                      <>
                        <div className="flex flex-col items-center px-2">
                           <span className="text-sm font-black text-slate-900">1.2k</span>
                           <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Pengikut</span>
                        </div>
                        <div className="w-px h-6 bg-slate-100" />
                        <div className="flex flex-col items-center px-2">
                           <span className="text-sm font-black text-slate-900">452</span>
                           <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Mengikuti</span>
                        </div>
                        <div className="w-px h-6 bg-slate-100" />
                        <div className="flex flex-col items-center px-2 text-rose-500">
                           <div className="flex items-center gap-1">
                             <Heart className="size-3 fill-rose-500" />
                             <span className="text-sm font-black">2.4k</span>
                           </div>
                           <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Suka Total</span>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-100">
                           <Eye className="size-3.5 text-slate-400" />
                           <div className="flex flex-col leading-none">
                             <span className="text-xs font-black text-slate-900">8.9k</span>
                             <span className="text-[7px] font-black text-slate-400 uppercase">Tayangan</span>
                           </div>
                        </div>
                        <div className="flex items-center gap-2 bg-rose-50 px-3 py-1.5 rounded-xl border border-rose-100">
                           <Heart className="size-3.5 text-rose-500 fill-rose-500" />
                           <div className="flex flex-col leading-none">
                             <span className="text-xs font-black text-rose-600">4.2k</span>
                             <span className="text-[7px] font-black text-slate-400 uppercase">Suka</span>
                           </div>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="px-6 md:px-10 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <p className="text-slate-600 leading-relaxed font-medium text-lg italic">
              "{activeAccount.bio || 'Membangun koneksi cerdas di jaringan OnTapp.'}"
            </p>
            <Button variant="ghost" size="sm" onClick={() => { setTempAccount({ name: activeAccount.name, extra: activeAccount.extra, bio: activeAccount.bio }); setIsBioModalOpen(true); }} className="text-[10px] font-black uppercase text-teal-600 hover:bg-teal-50 px-5 h-10 rounded-xl border border-teal-100 shrink-0">
              <Pencil className="size-3.5 mr-2" /> Edit Profil
            </Button>
          </div>
          
          {activeAccount.type !== 'pribadi' && (
            <div className="flex flex-wrap gap-4 pt-2">
              <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-teal-600 bg-teal-50 px-4 py-2 rounded-2xl border border-teal-100 shadow-sm">
                <Target className="size-4" /> 92% Synergy Match
              </div>
            </div>
          )}
        </section>

        <section className="px-6 md:px-10 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400">Hub Koneksi Eksternal</h3>
            <Button variant="ghost" size="sm" onClick={() => setIsLinksModalOpen(true)} className="text-[10px] font-black uppercase text-teal-600 hover:bg-teal-50 px-4 rounded-xl">
              <Plus className="size-3.5 mr-2" /> Kelola Link
            </Button>
          </div>
          <div className="flex flex-wrap gap-3">
            {(activeAccount.links || []).map((link, idx) => (
              <a key={idx} href={link} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 px-5 py-2.5 rounded-2xl border border-slate-100 bg-white text-xs font-black text-slate-600 hover:border-teal-500 hover:text-teal-600 transition-all shadow-sm">
                {getLinkIcon(link)}
                <span className="max-w-[140px] truncate uppercase tracking-tighter">{new URL(link).hostname.replace('www.', '')}</span>
              </a>
            ))}
          </div>
        </section>

        <section className="px-6 md:px-10 space-y-8 pb-20">
          <div className="flex items-center justify-between">
            <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400">
              {activeAccount.type === 'pribadi' ? 'Nadi & Momen' : activeAccount.type === 'professional' ? 'Galeri Portofolio' : 'Katalog Produk & Promosi'}
            </h3>
            <div className="flex gap-3">
              {activeAccount.type !== 'pribadi' && (
                <Button onClick={handleAIContentGenerator} variant="outline" size="sm" className="rounded-2xl h-11 border-teal-100 text-teal-600 gap-2 font-black text-[10px] uppercase tracking-widest px-5 shadow-sm">
                  <Brain className="size-4" /> AI Generate
                </Button>
              )}
              <Button size="sm" onClick={() => setIsContentModalOpen(true)} className="rounded-2xl h-11 bg-teal-600 hover:bg-teal-700 gap-2 font-black text-[10px] uppercase tracking-widest px-6 shadow-xl text-white">
                <PlusCircle className="size-4" /> Tambah Baru
              </Button>
            </div>
          </div>

          <div className={cn(activeAccount.type === 'pribadi' ? "space-y-8" : "grid grid-cols-1 md:grid-cols-2 gap-8")}>
            {(activeAccount.items || []).map((item) => (
              <div key={item.id} className="relative group">
                <Card className="rounded-[2.5rem] border-slate-100 shadow-sm overflow-hidden group hover:shadow-2xl transition-all relative bg-white border-none">
                  {item.image && (
                    <div className="aspect-video w-full overflow-hidden relative">
                      <img src={item.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={item.title} />
                    </div>
                  )}
                  <button onClick={() => handleRemoveItem(item.id)} className="absolute top-4 right-4 size-10 bg-rose-500 text-white rounded-2xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all shadow-xl hover:scale-110"><Trash2 className="size-5" /></button>
                  <CardContent className="p-6 space-y-3">
                    <h4 className="font-black text-slate-900 text-lg line-clamp-1">{item.title}</h4>
                    <p className="text-slate-500 text-xs font-medium line-clamp-2">{item.description}</p>
                    {item.locationLink && (
                      <div className="pt-2 border-t border-slate-50">
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

      {/* Modals remain the same but use updated functions */}
      <Dialog open={isMediaPickerOpen} onOpenChange={setIsMediaPickerOpen}>
        <DialogContent className="max-w-md rounded-[3rem] p-8 border-none shadow-2xl bg-white">
          <DialogHeader className="text-center sm:text-center">
            <DialogTitle className="text-2xl font-black">Pilih Sumber Media</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-8">
            <Button variant="outline" onClick={() => fileInputRef.current?.click()} className="h-20 rounded-2xl border-slate-100 bg-slate-50 hover:bg-teal-50 justify-start gap-6 px-6">
              <Smartphone className="size-6" /> <div className="text-left"><p className="font-black text-sm uppercase">Perangkat</p><p className="text-[10px] opacity-60">Galeri lokal</p></div>
            </Button>
            <Button variant="outline" onClick={() => handleCloudSource('drive')} className="h-20 rounded-2xl border-slate-100 bg-slate-50 hover:bg-teal-50 justify-start gap-6 px-6">
              <Cloud className="size-6 text-blue-500" /> <div className="text-left"><p className="font-black text-sm uppercase">Google Drive</p><p className="text-[10px] opacity-60">Pilih file Drive</p></div>
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={isBioModalOpen} onOpenChange={setIsBioModalOpen}>
        <DialogContent className="max-w-xl rounded-[3rem] p-10 bg-white">
          <DialogHeader><DialogTitle className="text-2xl font-black">Edit Profil</DialogTitle></DialogHeader>
          <div className="space-y-6 pt-6">
            <div className="space-y-2"><Label className="font-black text-[10px] uppercase">Nama</Label><Input value={tempAccount.name} onChange={(e) => setTempAccount({ ...tempAccount, name: e.target.value })} className="rounded-2xl h-14 bg-slate-50 border-none px-6" /></div>
            <div className="space-y-2"><Label className="font-black text-[10px] uppercase">Bio</Label><Textarea value={tempAccount.bio} onChange={(e) => setTempAccount({ ...tempAccount, bio: e.target.value })} className="rounded-2xl bg-slate-50 border-none min-h-[140px] px-6 py-4" /></div>
          </div>
          <DialogFooter className="mt-10"><Button onClick={handleSaveBio} className="rounded-2xl bg-teal-600 h-14 px-12 font-black text-white">Simpan</Button></DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Share Modal & Other modals remain for functionality */}
      <Dialog open={isLinksModalOpen} onOpenChange={setIsLinksModalOpen}>
        <DialogContent className="max-w-xl rounded-[3rem] p-10 bg-white">
          <DialogHeader><DialogTitle className="text-2xl font-black">Kelola Tautan</DialogTitle></DialogHeader>
          <div className="space-y-8 pt-6">
            <div className="flex gap-3">
              <Input value={newLinkUrl} onChange={(e) => setNewLinkUrl(e.target.value)} placeholder="https://..." className="rounded-2xl h-14 border-slate-200" />
              <Button onClick={handleAddLink} className="h-14 w-14 rounded-2xl bg-teal-600 text-white shrink-0"><Plus size={24} /></Button>
            </div>
            <div className="space-y-3">
              {(activeAccount.links || []).map((link, i) => (
                <div key={i} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
                  <span className="text-sm font-bold truncate">{link}</span>
                  <button onClick={() => handleRemoveLink(i)} className="text-slate-300 hover:text-rose-500"><X size={18} /></button>
                </div>
              ))}
            </div>
          </div>
          <DialogFooter><Button onClick={() => setIsLinksModalOpen(false)} className="w-full h-14 rounded-2xl bg-slate-900 text-white font-black uppercase">Selesai</Button></DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isContentModalOpen} onOpenChange={setIsContentModalOpen}>
        <DialogContent className="max-w-xl rounded-[3rem] p-10 bg-white">
          <DialogHeader><DialogTitle className="text-2xl font-black">Tambah Konten</DialogTitle></DialogHeader>
          <div className="space-y-6 pt-6">
            <div onClick={() => openMediaPicker('post')} className="w-full aspect-video rounded-3xl bg-slate-50 border-2 border-dashed border-slate-200 flex items-center justify-center cursor-pointer overflow-hidden">
              {newItem.image ? <img src={newItem.image} className="w-full h-full object-cover" alt="Preview" /> : <ImageIcon className="size-10 text-slate-300" />}
            </div>
            <div className="space-y-2"><Label className="font-black text-[10px] uppercase">Judul</Label><Input value={newItem.title} onChange={(e) => setNewItem({ ...newItem, title: e.target.value })} className="rounded-2xl h-14 bg-slate-50 border-none px-6" /></div>
            <div className="space-y-2"><Label className="font-black text-[10px] uppercase">Link Lokasi</Label><Input value={newItem.locationLink} onChange={(e) => setNewItem({ ...newItem, locationLink: e.target.value })} className="rounded-2xl h-12 bg-slate-50 border-none px-6" placeholder="https://maps..." /></div>
          </div>
          <DialogFooter className="mt-10"><Button onClick={handleAddContent} className="w-full h-14 rounded-2xl bg-teal-600 font-black text-white uppercase">Posting</Button></DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isShareModalOpen} onOpenChange={setIsShareModalOpen}>
        <DialogContent className="max-w-[340px] rounded-[3.5rem] p-0 border-none shadow-2xl bg-white overflow-hidden">
          <div className="p-10 flex flex-col items-center space-y-10">
             <QrCode className="size-56 text-slate-900" />
             <Button onClick={() => { navigator.clipboard.writeText(`https://ontapp.network/p/${activeAccount.id}`); toast({ title: "Link disalin" }); }} className="w-full h-14 rounded-[2rem] bg-slate-900 text-white font-black uppercase text-xs tracking-widest">Salin Link Profil</Button>
          </div>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
