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
  Target
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

  const [isPhotoModalOpen, setIsPhotoModalOpen] = React.useState(false);
  const [isBioModalOpen, setIsBioModalOpen] = React.useState(false);
  const [isLinksModalOpen, setIsLinksModalOpen] = React.useState(false);
  const [isContentModalOpen, setIsContentModalOpen] = React.useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = React.useState(false);

  const [tempAccount, setTempAccount] = React.useState<Partial<Account>>({});
  const [newItem, setNewItem] = React.useState<Partial<ContentItem>>({
    visibility: 'public'
  });
  const [newLinkUrl, setNewLinkUrl] = React.useState('');

  const handleSaveBio = () => {
    updateActiveAccount(tempAccount);
    setIsBioModalOpen(false);
    toast({ title: 'Profil diperbarui' });
  };

  const handleSavePhotos = () => {
    updateActiveAccount(tempAccount);
    setIsPhotoModalOpen(false);
    toast({ title: 'Foto diperbarui' });
  };

  const handleAddLink = () => {
    if (!newLinkUrl) return;
    try {
      new URL(newLinkUrl);
      const updatedLinks = [...(tempAccount.links || []), newLinkUrl];
      setTempAccount({ ...tempAccount, links: updatedLinks });
      setNewLinkUrl('');
    } catch (e) {
      toast({ variant: "destructive", title: "URL tidak valid", description: "Pastikan menggunakan format https://" });
    }
  };

  const handleRemoveLink = (index: number) => {
    const updatedLinks = (tempAccount.links || []).filter((_, i) => i !== index);
    setTempAccount({ ...tempAccount, links: updatedLinks });
  };

  const handleSaveLinks = () => {
    updateActiveAccount({ links: tempAccount.links });
    setIsLinksModalOpen(false);
    toast({ title: 'Tautan diperbarui' });
  };

  const handleAddContent = () => {
    const item: ContentItem = {
      id: `item-${Date.now()}`,
      image: newItem.image || `https://picsum.photos/seed/${Date.now()}/600/400`,
      title: newItem.title || 'Tanpa Judul',
      description: newItem.description || '',
      price: newItem.price,
      visibility: newItem.visibility || 'public',
      timestamp: 'Baru saja'
    };
    updateActiveAccount({
      items: [item, ...(activeAccount.items || [])]
    });
    setIsContentModalOpen(false);
    setNewItem({ visibility: 'public' });
    toast({ title: activeAccount.type === 'pribadi' ? 'Berhasil diposting' : 'Konten ditambahkan' });
  };

  const handleRemoveItem = (id: string) => {
    updateActiveAccount({
      items: (activeAccount.items || []).filter(item => item.id !== id)
    });
    toast({ title: 'Konten dihapus' });
  };

  const handleCopyLink = () => {
    const link = `https://ontapp.network/p/${activeAccount.id}`;
    if (typeof navigator !== 'undefined') {
      navigator.clipboard.writeText(link);
      toast({ title: "Tautan profil disalin!" });
    }
  };

  const handleAIContentGenerator = () => {
    toast({ title: "AI Content Engine", description: "Membangun draf konten berdasarkan tren industri..." });
    setTimeout(() => {
      setNewItem({
        title: activeAccount.type === 'bisnis' ? "Penawaran Kerjasama Kemitraan Strategis" : "Portfolio Proyek Inovasi Terbaru",
        description: `Kami sedang aktif mencari kolaborasi baru di sektor ${activeAccount.extra || 'industri'}. Fokus utama kami adalah pada efisiensi operasional dan integrasi teknologi cerdas untuk pertumbuhan berkelanjutan.`,
        visibility: 'public'
      });
      setIsContentModalOpen(true);
    }, 1200);
  };

  const getLinkIcon = (url: string) => {
    const lowerUrl = url.toLowerCase();
    if (lowerUrl.includes('instagram.com')) return <Instagram className="size-4" />;
    if (lowerUrl.includes('linkedin.com')) return <Linkedin className="size-4" />;
    if (lowerUrl.includes('facebook.com')) return <Facebook className="size-4" />;
    if (lowerUrl.includes('shopee') || lowerUrl.includes('tokopedia') || lowerUrl.includes('tiktok.com')) return <ShoppingBag className="size-4" />;
    return <Link2 className="size-4" />;
  };

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto space-y-12 pb-24">
        {/* Cover & Avatar Section */}
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
              <Button onClick={() => { setTempAccount({ avatar: activeAccount.avatar }); setIsPhotoModalOpen(true); }} variant="outline" className="bg-white/90 backdrop-blur hover:bg-white text-slate-600 rounded-2xl border-none font-black text-[10px] uppercase tracking-widest gap-2 shadow-sm h-10 px-5">
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
              <button onClick={() => { setTempAccount({ avatar: activeAccount.avatar }); setIsPhotoModalOpen(true); }} className="absolute bottom-3 right-3 size-11 bg-teal-600 text-white rounded-2xl flex items-center justify-center border-4 border-white shadow-xl hover:scale-110 transition-transform active:scale-95">
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
              <div className="flex items-center gap-2 text-slate-500 font-bold text-base">
                {activeAccount.type === 'bisnis' ? <Building2 size={18} className="text-teal-600" /> : activeAccount.type === 'professional' ? <Briefcase size={18} className="text-teal-600" /> : <UserIcon size={18} className="text-teal-600" />}
                {activeAccount.extra || (activeAccount.type === 'bisnis' ? 'Retail & General' : activeAccount.type === 'professional' ? 'Creative Talent' : 'General Member')}
              </div>
            </div>
          </div>
        </section>

        {/* Bio Section */}
        <section className="px-6 md:px-10 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div className="flex items-center gap-6 text-[11px] font-black text-slate-400 uppercase tracking-widest">
              <span className="flex flex-col"><strong className="text-slate-900 text-lg">1.2k</strong> Followers</span>
              <div className="w-px h-6 bg-slate-100" />
              <span className="flex flex-col"><strong className="text-slate-900 text-lg">452</strong> Following</span>
            </div>
            <Button variant="ghost" size="sm" onClick={() => { setTempAccount({ name: activeAccount.name, extra: activeAccount.extra, bio: activeAccount.bio }); setIsBioModalOpen(true); }} className="text-[10px] font-black uppercase text-teal-600 hover:bg-teal-50 px-5 h-10 rounded-xl border border-teal-100">
              <Pencil className="size-3.5 mr-2" /> Edit Profil
            </Button>
          </div>
          <p className="text-slate-600 leading-relaxed font-medium text-lg italic">
            "{activeAccount.bio || 'Membangun koneksi cerdas di jaringan OnTapp.'}"
          </p>
          
          {activeAccount.type !== 'pribadi' && (
            <div className="flex flex-wrap gap-4 pt-2">
              <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-teal-600 bg-teal-50 px-4 py-2 rounded-2xl border border-teal-100 shadow-sm">
                <Target className="size-4" /> 92% Synergy Match
              </div>
              {activeAccount.type === 'bisnis' && (
                <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-amber-600 bg-amber-50 px-4 py-2 rounded-2xl border border-amber-100 shadow-sm">
                  <Zap className="size-4" /> Verified Business
                </div>
              )}
            </div>
          )}
        </section>

        {/* Links Section */}
        <section className="px-6 md:px-10 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400">Hub Koneksi Eksternal</h3>
            <Button variant="ghost" size="sm" onClick={() => { setTempAccount({ links: [...(activeAccount.links || [])] }); setIsLinksModalOpen(true); }} className="text-[10px] font-black uppercase text-teal-600 hover:bg-teal-50 px-4 rounded-xl">
              <Plus className="size-3.5 mr-2" /> Kelola Link
            </Button>
          </div>
          <div className="flex flex-wrap gap-3">
            {(activeAccount.links || []).length > 0 ? (activeAccount.links || []).map((link, idx) => (
              <a key={idx} href={link} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 px-5 py-2.5 rounded-2xl border border-slate-100 bg-white text-xs font-black text-slate-600 hover:border-teal-500 hover:text-teal-600 transition-all shadow-sm hover:shadow-md">
                {getLinkIcon(link)}
                <span className="max-w-[140px] truncate uppercase tracking-tighter">{new URL(link).hostname.replace('www.', '')}</span>
              </a>
            )) : (
              <div className="w-full p-6 border-2 border-dashed border-slate-100 rounded-3xl text-center">
                <p className="text-xs font-bold text-slate-400">Belum ada tautan eksternal.</p>
              </div>
            )}
          </div>
        </section>

        <hr className="border-slate-100 mx-6 md:mx-10" />

        {/* Content Section */}
        <section className="px-6 md:px-10 space-y-8 pb-20">
          <div className="flex items-center justify-between">
            <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400">
              {activeAccount.type === 'pribadi' ? 'Nadi & Momen' : activeAccount.type === 'professional' ? 'Galeri Portofolio' : 'Katalog Produk & Promosi'}
            </h3>
            <div className="flex gap-3">
              {activeAccount.type !== 'pribadi' && (
                <Button onClick={handleAIContentGenerator} variant="outline" size="sm" className="rounded-2xl h-11 border-teal-100 text-teal-600 gap-2 font-black text-[10px] uppercase tracking-widest px-5 shadow-sm">
                  <Brain className="size-4 animate-pulse" /> AI Generate
                </Button>
              )}
              <Button size="sm" onClick={() => setIsContentModalOpen(true)} className="rounded-2xl h-11 bg-teal-600 hover:bg-teal-700 gap-2 font-black text-[10px] uppercase tracking-widest px-6 shadow-xl shadow-teal-100 text-white active:scale-95 transition-all">
                <PlusCircle className="size-4" />
                {activeAccount.type === 'pribadi' ? 'Buat Post' : 'Tambah Baru'}
              </Button>
            </div>
          </div>

          <div className={cn(activeAccount.type === 'pribadi' ? "space-y-8" : "grid grid-cols-1 md:grid-cols-2 gap-8")}>
            {(activeAccount.items || []).length > 0 ? (activeAccount.items || []).map((item) => (
              <div key={item.id} className="relative group">
                {activeAccount.type === 'pribadi' ? (
                  <div className="flex gap-5 p-6 hover:bg-white rounded-[2.5rem] transition-all border border-transparent hover:border-slate-100 hover:shadow-xl group">
                    <Avatar className="size-12 shrink-0 border-2 border-white shadow-md rounded-2xl">
                      <AvatarImage src={activeAccount.avatar} />
                      <AvatarFallback>{activeAccount.name[0]}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="font-black text-sm text-slate-900">{activeAccount.name}</span>
                          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">{item.timestamp}</span>
                          {item.visibility === 'private' ? <Lock className="size-3 text-slate-300" /> : <Globe className="size-3 text-teal-500" />}
                        </div>
                        <button onClick={() => handleRemoveItem(item.id)} className="size-9 rounded-xl bg-rose-50 text-rose-400 opacity-0 group-hover:opacity-100 hover:text-rose-600 hover:bg-rose-100 transition-all flex items-center justify-center"><Trash2 className="size-4" /></button>
                      </div>
                      <p className="text-base text-slate-700 leading-relaxed font-medium">{item.description}</p>
                      {item.image && (
                        <div className="rounded-[2rem] overflow-hidden border border-slate-100 shadow-inner max-w-sm">
                          <img src={item.image} className="w-full h-auto object-cover" alt="Post" />
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <Card className="rounded-[2.5rem] border-slate-100 shadow-sm overflow-hidden group hover:shadow-2xl transition-all relative border-none bg-white">
                    <div className="aspect-video w-full overflow-hidden relative">
                      <img src={item.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={item.title} />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                    <button onClick={() => handleRemoveItem(item.id)} className="absolute top-4 right-4 size-10 bg-rose-500 text-white rounded-2xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all shadow-xl hover:scale-110 active:scale-90"><Trash2 className="size-5" /></button>
                    <CardContent className="p-6">
                      <h4 className="font-black text-slate-900 text-lg group-hover:text-teal-600 transition-colors line-clamp-1">{item.title}</h4>
                      <p className="text-slate-500 text-xs font-medium mt-1 line-clamp-2">{item.description}</p>
                    </CardContent>
                  </Card>
                )}
              </div>
            )) : (
              <div className="col-span-full py-24 text-center bg-white rounded-[3rem] border border-dashed border-slate-200">
                <div className="size-20 rounded-full bg-slate-50 flex items-center justify-center mx-auto mb-4">
                  <PlusCircle className="size-10 text-slate-200" />
                </div>
                <h4 className="text-xl font-black text-slate-900">Belum Ada Konten</h4>
                <p className="text-slate-400 text-sm max-w-xs mx-auto mt-2 font-medium">Mulai isi profil Anda untuk meningkatkan visibilitas di jaringan OnTapp.</p>
              </div>
            )}
          </div>
        </section>
      </div>

      {/* Modals Implementation */}
      
      {/* Photo Modal */}
      <Dialog open={isPhotoModalOpen} onOpenChange={setIsPhotoModalOpen}>
        <DialogContent className="max-w-md rounded-[3rem] border-none shadow-2xl p-10 bg-white">
          <DialogHeader className="text-center sm:text-center"><DialogTitle className="text-2xl font-black text-slate-900">Ubah Foto Profil</DialogTitle><DialogDescription>Masukkan URL gambar baru untuk memperbarui avatar Anda.</DialogDescription></DialogHeader>
          <div className="space-y-8 py-6 flex flex-col items-center">
            <div className="size-32 rounded-3xl overflow-hidden border-4 border-teal-50 shadow-inner">
               <img src={tempAccount.avatar || activeAccount.avatar} className="w-full h-full object-cover" alt="Preview" />
            </div>
            <div className="w-full space-y-2">
              <Label className="font-bold ml-1">URL Gambar Baru</Label>
              <Input value={tempAccount.avatar} onChange={(e) => setTempAccount({ ...tempAccount, avatar: e.target.value })} placeholder="https://picsum.photos/..." className="rounded-2xl h-12 border-slate-200" />
            </div>
          </div>
          <DialogFooter className="flex gap-3">
            <Button variant="ghost" onClick={() => setIsPhotoModalOpen(false)} className="rounded-2xl flex-1 font-bold">Batal</Button>
            <Button onClick={handleSavePhotos} className="rounded-2xl flex-1 bg-teal-600 hover:bg-teal-700 font-black text-white">Simpan Foto</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Bio Modal */}
      <Dialog open={isBioModalOpen} onOpenChange={setIsBioModalOpen}>
        <DialogContent className="max-w-xl rounded-[3rem] border-none shadow-2xl p-10 bg-white">
          <DialogHeader><DialogTitle className="text-2xl font-black text-slate-900">Edit Detail Profil</DialogTitle></DialogHeader>
          <div className="space-y-6 pt-6">
            <div className="space-y-2">
              <Label className="font-black text-[10px] uppercase tracking-widest text-slate-400 ml-1">Nama Lengkap / Bisnis</Label>
              <Input value={tempAccount.name} onChange={(e) => setTempAccount({ ...tempAccount, name: e.target.value })} className="rounded-2xl h-14 bg-slate-50 border-none font-bold text-lg px-6" />
            </div>
            <div className="space-y-2">
              <Label className="font-black text-[10px] uppercase tracking-widest text-slate-400 ml-1">
                {activeAccount.type === 'bisnis' ? 'Kategori Industri' : activeAccount.type === 'professional' ? 'Keahlian Utama' : 'Status'}
              </Label>
              <Input value={tempAccount.extra} onChange={(e) => setTempAccount({ ...tempAccount, extra: e.target.value })} className="rounded-2xl h-14 bg-slate-50 border-none font-bold px-6" />
            </div>
            <div className="space-y-2">
              <Label className="font-black text-[10px] uppercase tracking-widest text-slate-400 ml-1">Bio Deskripsi</Label>
              <Textarea value={tempAccount.bio} onChange={(e) => setTempAccount({ ...tempAccount, bio: e.target.value })} className="rounded-2xl bg-slate-50 border-none min-h-[140px] px-6 py-4 font-medium" />
            </div>
          </div>
          <DialogFooter className="mt-10 flex gap-3">
            <Button variant="ghost" onClick={() => setIsBioModalOpen(false)} className="rounded-2xl h-14 px-8 font-bold">Batal</Button>
            <Button onClick={handleSaveBio} className="rounded-2xl bg-teal-600 hover:bg-teal-700 h-14 px-12 font-black text-white shadow-xl shadow-teal-100">Simpan Perubahan</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Links Modal */}
      <Dialog open={isLinksModalOpen} onOpenChange={setIsLinksModalOpen}>
        <DialogContent className="max-w-xl rounded-[3rem] border-none shadow-2xl p-10 bg-white">
          <DialogHeader><DialogTitle className="text-2xl font-black text-slate-900">Kelola Tautan Hub</DialogTitle></DialogHeader>
          <div className="space-y-8 pt-6">
            <div className="flex gap-3">
              <Input 
                value={newLinkUrl} 
                onChange={(e) => setNewLinkUrl(e.target.value)} 
                placeholder="https://social-media.com/user" 
                className="rounded-2xl h-14 border-slate-200 flex-1 font-medium px-6" 
              />
              <Button onClick={handleAddLink} className="h-14 w-14 rounded-2xl bg-teal-600 hover:bg-teal-700 text-white shrink-0"><Plus size={24} /></Button>
            </div>
            <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2 no-scrollbar">
              {(tempAccount.links || []).map((link, i) => (
                <div key={i} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl group/link">
                  <div className="flex items-center gap-3 overflow-hidden">
                    {getLinkIcon(link)}
                    <span className="text-sm font-bold text-slate-700 truncate">{link}</span>
                  </div>
                  <button onClick={() => handleRemoveLink(i)} className="text-slate-300 hover:text-rose-500 transition-colors"><X size={18} /></button>
                </div>
              ))}
            </div>
          </div>
          <DialogFooter className="mt-8">
            <Button onClick={handleSaveLinks} className="w-full h-14 rounded-2xl bg-slate-900 hover:bg-black font-black text-white uppercase tracking-widest">Update Links Hub</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Content Modal */}
      <Dialog open={isContentModalOpen} onOpenChange={setIsContentModalOpen}>
        <DialogContent className="max-w-xl rounded-[3rem] border-none shadow-2xl p-10 bg-white">
          <DialogHeader><DialogTitle className="text-2xl font-black text-slate-900">
            {activeAccount.type === 'bisnis' ? 'Tambah Produk/Promo' : activeAccount.type === 'professional' ? 'Tambah Portofolio' : 'Bagikan Momen'}
          </DialogTitle></DialogHeader>
          <div className="space-y-6 pt-6">
            <div className="space-y-2">
              <Label className="font-black text-[10px] uppercase tracking-widest text-slate-400 ml-1">Judul Konten</Label>
              <Input value={newItem.title} onChange={(e) => setNewItem({ ...newItem, title: e.target.value })} className="rounded-2xl h-14 bg-slate-50 border-none font-bold px-6" placeholder="Berikan judul yang menarik..." />
            </div>
            <div className="space-y-2">
              <Label className="font-black text-[10px] uppercase tracking-widest text-slate-400 ml-1">Deskripsi Detail</Label>
              <Textarea value={newItem.description} onChange={(e) => setNewItem({ ...newItem, description: e.target.value })} className="rounded-2xl bg-slate-50 border-none min-h-[140px] px-6 py-4 font-medium" placeholder="Ceritakan detail keunggulan produk atau proyek Anda..." />
            </div>
            <div className="grid grid-cols-2 gap-4">
               <div className="space-y-2">
                 <Label className="font-black text-[10px] uppercase tracking-widest text-slate-400 ml-1">Visibilitas</Label>
                 <Select value={newItem.visibility} onValueChange={(v: any) => setNewItem({...newItem, visibility: v})}>
                    <SelectTrigger className="rounded-2xl h-14 bg-slate-50 border-none px-6 font-bold"><SelectValue /></SelectTrigger>
                    <SelectContent className="rounded-2xl border-none shadow-xl"><SelectItem value="public">Publik</SelectItem><SelectItem value="private">Privat</SelectItem></SelectContent>
                 </Select>
               </div>
               <div className="space-y-2">
                 <Label className="font-black text-[10px] uppercase tracking-widest text-slate-400 ml-1">Gambar URL (Opsional)</Label>
                 <Input value={newItem.image} onChange={(e) => setNewItem({ ...newItem, image: e.target.value })} className="rounded-2xl h-14 bg-slate-50 border-none px-6 font-medium" placeholder="https://..." />
               </div>
            </div>
          </div>
          <DialogFooter className="mt-10">
            <Button onClick={handleAddContent} className="w-full h-14 rounded-2xl bg-teal-600 hover:bg-teal-700 font-black text-white uppercase tracking-widest shadow-xl shadow-teal-100">Konfirmasi Posting</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Share Modal */}
      <Dialog open={isShareModalOpen} onOpenChange={setIsShareModalOpen}>
        <DialogContent className="max-w-[340px] rounded-[3.5rem] p-0 border-none shadow-2xl overflow-hidden bg-white">
          <DialogHeader className="p-10 pb-4 bg-slate-50 border-b">
             <DialogTitle className="text-2xl font-black text-slate-900 tracking-tight text-center">Kartu OnTapp Digital</DialogTitle>
             <DialogDescription className="font-bold text-xs text-center text-slate-400 uppercase tracking-widest">Pindai atau bagikan kartu bisnis digital Anda.</DialogDescription>
          </DialogHeader>
          <div className="p-10 flex flex-col items-center space-y-10">
             <div className="size-56 p-6 bg-white rounded-[3rem] border-[6px] border-teal-50 shadow-inner flex items-center justify-center relative overflow-hidden">
                <QrCode className="size-full text-slate-900" />
                <div className="absolute inset-0 bg-gradient-to-tr from-teal-500/5 to-transparent pointer-events-none" />
             </div>
             <div className="w-full space-y-4">
                <Button onClick={handleCopyLink} className="w-full h-14 rounded-[2rem] bg-slate-900 hover:bg-black text-white font-black text-xs uppercase tracking-[0.2em] gap-3 shadow-xl active:scale-95 transition-all"><Share2 className="size-5" /> Bagikan Profil</Button>
                <div className="grid grid-cols-2 gap-4">
                   <Button variant="outline" onClick={handleCopyLink} className="rounded-[1.5rem] h-14 border-slate-200 font-black text-[10px] uppercase tracking-widest gap-2 hover:bg-teal-50 hover:text-teal-600 transition-all"><Copy className="size-4" /> Salin Link</Button>
                   <Button variant="outline" className="rounded-[1.5rem] h-14 border-slate-200 font-black text-[10px] uppercase tracking-widest gap-2 hover:bg-teal-50 hover:text-teal-600 transition-all"><MapPin className="size-4" /> Lokasi</Button>
                </div>
             </div>
          </div>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
