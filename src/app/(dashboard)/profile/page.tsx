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

  const handleSaveLinks = () => {
    updateActiveAccount({ links: tempAccount.links });
    setIsLinksModalOpen(false);
    toast({ title: 'Tautan diperbarui' });
  };

  const handleAddContent = () => {
    const item: ContentItem = {
      id: `item-${Date.now()}`,
      image: newItem.image || `https://picsum.photos/seed/${Date.now()}/600/400`,
      title: newItem.title || 'Untitled Content',
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
    navigator.clipboard.writeText(link);
    toast({ title: "Tautan profil disalin!" });
  };

  const handleAIContentGenerator = () => {
    toast({ title: "AI Content Engine", description: "Membangun draf konten berdasarkan tren industri..." });
    // Simulasi generator konten
    setTimeout(() => {
      setNewItem({
        title: activeAccount.type === 'bisnis' ? "Penawaran Kerjasama Kemitraan" : "Portfolio Proyek Terbaru",
        description: `Kami sedang memperluas jangkauan di sektor ${activeAccount.extra}. Mencari mitra yang fokus pada inovasi dan skalabilitas global.`
      });
      setIsContentModalOpen(true);
    }, 1000);
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
        <section className="relative group">
          <div className="h-48 md:h-64 w-full bg-slate-50 border-b border-slate-100 relative overflow-hidden rounded-3xl">
            <img 
              src={`https://picsum.photos/seed/${activeAccount.id}_cover/1200/400`} 
              alt="Cover" 
              className="w-full h-full object-cover opacity-80"
            />
            <div className="absolute top-4 right-4 flex gap-2">
              <Button onClick={() => setIsShareModalOpen(true)} className="bg-white/80 backdrop-blur hover:bg-white text-slate-900 rounded-xl border-none font-black text-xs gap-2 shadow-lg h-9 px-4">
                <Share2 className="size-4" /> Bagi
              </Button>
              <Button onClick={() => { setTempAccount({ avatar: activeAccount.avatar }); setIsPhotoModalOpen(true); }} variant="outline" className="bg-white/80 backdrop-blur hover:bg-white text-slate-600 rounded-xl border-none font-bold text-xs gap-2 shadow-sm h-9 px-4">
                <Camera className="size-4" /> Edit
              </Button>
            </div>
          </div>

          <div className="px-6 md:px-8 -mt-16 md:-mt-20 flex flex-col items-start gap-4">
            <div className="relative group/avatar">
              <Avatar className="size-32 md:size-40 border-[6px] border-white shadow-xl overflow-hidden">
                <AvatarImage src={activeAccount.avatar} className="object-cover" />
                <AvatarFallback className="bg-teal-50 text-accent"><UserIcon size={48} /></AvatarFallback>
              </Avatar>
              <button onClick={() => setIsPhotoModalOpen(true)} className="absolute bottom-2 right-2 size-10 bg-accent text-white rounded-full flex items-center justify-center border-4 border-white shadow-lg hover:scale-110 transition-transform">
                <Pencil className="size-4" />
              </button>
            </div>

            <div className="space-y-1 w-full">
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-black text-slate-900 tracking-tight">{activeAccount.name}</h1>
                {activeAccount.verificationStatus === 'Verified' && (
                  <Badge className="bg-emerald-50 text-emerald-700 border-none px-2 py-0 text-[10px] uppercase font-black tracking-widest flex gap-1">
                    <ShieldCheck className="size-3" /> AI Verified
                  </Badge>
                )}
              </div>
              <div className="flex items-center gap-2 text-slate-500 font-medium text-sm">
                {activeAccount.type === 'bisnis' ? <Building2 size={14} className="text-teal-600" /> : activeAccount.type === 'professional' ? <Briefcase size={14} className="text-teal-600" /> : <UserIcon size={14} className="text-teal-600" />}
                {activeAccount.extra || 'General Member'}
              </div>
            </div>
          </div>
        </section>

        <section className="px-6 md:px-8 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 text-xs font-medium text-slate-500 tracking-tight">
              <span><strong className="text-slate-900">1.2k</strong> Followers</span>
              <span className="size-1 rounded-full bg-slate-200" />
              <span><strong className="text-slate-900">452</strong> Following</span>
            </div>
            <Button variant="ghost" size="sm" onClick={() => { setTempAccount({ name: activeAccount.name, extra: activeAccount.extra, bio: activeAccount.bio }); setIsBioModalOpen(true); }} className="text-[10px] font-black uppercase text-accent hover:bg-teal-50 px-3 rounded-lg">
              <Pencil className="size-3 mr-1.5" /> Edit Bio
            </Button>
          </div>
          <p className="text-slate-600 leading-relaxed font-medium">
            {activeAccount.bio || 'Tidak ada deskripsi profil.'}
          </p>
          
          {activeAccount.type !== 'pribadi' && (
            <div className="flex gap-4 pt-2">
              <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-teal-600 bg-teal-50 px-3 py-1.5 rounded-xl border border-teal-100">
                <Target className="size-3.5" /> 92% Synergy Discovery
              </div>
              {activeAccount.type === 'bisnis' && (
                <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-amber-600 bg-amber-50 px-3 py-1.5 rounded-xl border border-amber-100">
                  <Zap className="size-3.5" /> Verified Business
                </div>
              )}
            </div>
          )}
        </section>

        <section className="px-6 md:px-8 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Links Hub</h3>
            <Button variant="ghost" size="sm" onClick={() => { setTempAccount({ links: [...(activeAccount.links || [])] }); setIsLinksModalOpen(true); }} className="text-[10px] font-black uppercase text-accent hover:bg-teal-50 px-3 rounded-lg">
              <Plus className="size-3 mr-1.5" /> Kelola Link
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {(activeAccount.links || []).map((link, idx) => (
              <a key={idx} href={link} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-slate-100 bg-white text-xs font-bold text-slate-600 hover:border-accent hover:text-accent transition-all">
                {getLinkIcon(link)}
                <span className="max-w-[120px] truncate">{new URL(link).hostname.replace('www.', '')}</span>
              </a>
            ))}
          </div>
        </section>

        <hr className="border-slate-100 mx-6 md:px-8" />

        <section className="px-6 md:px-8 space-y-6 pb-20">
          <div className="flex items-center justify-between">
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
              {activeAccount.type === 'pribadi' ? 'Threads & Moments' : activeAccount.type === 'professional' ? 'Portfolio Gallery' : 'Product Catalog'}
            </h3>
            <div className="flex gap-2">
              {activeAccount.type !== 'pribadi' && (
                <Button onClick={handleAIContentGenerator} variant="outline" size="sm" className="rounded-xl h-9 border-teal-100 text-teal-600 gap-2 font-bold px-4">
                  <Brain className="size-4" /> AI Generate
                </Button>
              )}
              <Button size="sm" onClick={() => setIsContentModalOpen(true)} className="rounded-xl h-9 bg-teal-600 hover:bg-teal-700 gap-2 font-bold px-4 shadow-sm text-white">
                <PlusCircle className="size-4" />
                {activeAccount.type === 'pribadi' ? 'Buat Post' : 'Tambah Baru'}
              </Button>
            </div>
          </div>

          <div className={cn(activeAccount.type === 'pribadi' ? "space-y-6" : "grid grid-cols-1 md:grid-cols-2 gap-6")}>
            {(activeAccount.items || []).map((item) => (
              <div key={item.id} className="relative group">
                {activeAccount.type === 'pribadi' ? (
                  <div className="flex gap-4 p-4 hover:bg-slate-50/50 rounded-2xl transition-colors">
                    <Avatar className="size-10 shrink-0 border border-slate-100">
                      <AvatarImage src={activeAccount.avatar} />
                      <AvatarFallback>{activeAccount.name[0]}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm text-slate-900">{activeAccount.name}</span>
                          <span className="text-[10px] text-slate-400 font-medium tracking-tight">{item.timestamp}</span>
                          {item.visibility === 'private' ? <Lock className="size-2.5 text-slate-300" /> : <Globe className="size-2.5 text-slate-300" />}
                        </div>
                        <button onClick={() => handleRemoveItem(item.id)} className="text-slate-300 hover:text-rose-500 transition-colors"><Trash2 className="size-4" /></button>
                      </div>
                      <p className="text-sm text-slate-600 leading-relaxed font-medium">{item.description}</p>
                      {item.image && <img src={item.image} className="rounded-2xl border border-slate-100 shadow-sm max-w-sm" alt="Post" />}
                    </div>
                  </div>
                ) : (
                  <Card className="rounded-3xl border-slate-100 shadow-sm overflow-hidden group hover:shadow-md relative">
                    <img src={item.image} className="aspect-video w-full object-cover group-hover:scale-105 transition-all" alt={item.title} />
                    <button onClick={() => handleRemoveItem(item.id)} className="absolute top-2 right-2 size-8 bg-rose-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"><Trash2 className="size-4" /></button>
                    <CardContent className="p-4"><h4 className="font-bold text-slate-900 line-clamp-1">{item.title}</h4></CardContent>
                  </Card>
                )}
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Shared Modals */}
      <Dialog open={isShareModalOpen} onOpenChange={setIsShareModalOpen}>
        <DialogContent className="max-w-[340px] rounded-[3rem] p-0 border-none shadow-2xl overflow-hidden bg-white">
          <DialogHeader className="p-8 pb-4 bg-slate-50 border-b">
             <DialogTitle className="text-xl font-black text-slate-900 tracking-tight">Kartu OnTapp Digital</DialogTitle>
             <DialogDescription className="font-medium text-xs">Pindai atau bagikan kartu bisnis digital Anda.</DialogDescription>
          </DialogHeader>
          <div className="p-8 flex flex-col items-center space-y-8">
             <div className="size-48 p-4 bg-white rounded-[2rem] border-4 border-teal-50 shadow-inner flex items-center justify-center relative overflow-hidden">
                <QrCode className="size-full text-slate-900" />
                <div className="absolute inset-0 bg-gradient-to-tr from-accent/5 to-transparent pointer-events-none" />
             </div>
             <div className="w-full space-y-3">
                <Button onClick={handleCopyLink} className="w-full h-12 rounded-2xl bg-slate-900 hover:bg-black text-white font-black text-xs uppercase tracking-widest gap-3 shadow-lg"><Share2 className="size-4" /> Bagikan Profil</Button>
                <div className="grid grid-cols-2 gap-3">
                   <Button variant="outline" onClick={handleCopyLink} className="rounded-2xl h-12 border-slate-200 font-black text-[10px] uppercase tracking-widest gap-2"><Copy className="size-3.5" /> Salin Link</Button>
                   <Button variant="outline" className="rounded-2xl h-12 border-slate-200 font-black text-[10px] uppercase tracking-widest gap-2"><MapPin className="size-3.5" /> Lokasi</Button>
                </div>
             </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={isBioModalOpen} onOpenChange={setIsBioModalOpen}>
        <DialogContent className="max-w-xl rounded-[2.5rem] border-none shadow-2xl p-8 bg-white">
          <DialogHeader><DialogTitle className="text-xl font-black text-slate-900 tracking-tight">Edit Detail Profil</DialogTitle></DialogHeader>
          <div className="space-y-6 pt-4">
            <div className="space-y-2">
              <Label className="font-bold">Nama Lengkap / Bisnis</Label>
              <Input value={tempAccount.name} onChange={(e) => setTempAccount({ ...tempAccount, name: e.target.value })} placeholder="Nama" className="rounded-xl" />
            </div>
            <div className="space-y-2">
              <Label className="font-bold">{activeAccount.type === 'bisnis' ? 'Kategori Industri' : activeAccount.type === 'professional' ? 'Keahlian Utama' : 'Status'}</Label>
              <Input value={tempAccount.extra} onChange={(e) => setTempAccount({ ...tempAccount, extra: e.target.value })} placeholder="e.g. Retail, Tech, Designer" className="rounded-xl" />
            </div>
            <div className="space-y-2">
              <Label className="font-bold">Bio</Label>
              <Textarea value={tempAccount.bio} onChange={(e) => setTempAccount({ ...tempAccount, bio: e.target.value })} placeholder="Ceritakan tentang Anda..." className="rounded-xl min-h-[120px]" />
            </div>
          </div>
          <DialogFooter className="mt-8 flex gap-2">
            <Button variant="ghost" onClick={() => setIsBioModalOpen(false)} className="rounded-xl">Batal</Button>
            <Button onClick={handleSaveBio} className="rounded-xl bg-teal-600 hover:bg-teal-700 font-black px-8 text-white">Simpan</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isContentModalOpen} onOpenChange={setIsContentModalOpen}>
        <DialogContent className="max-w-xl rounded-[2.5rem] border-none shadow-2xl p-8 bg-white">
          <DialogHeader><DialogTitle className="text-xl font-black text-slate-900 tracking-tight">
            {activeAccount.type === 'bisnis' ? 'Tambah Produk/Promo' : activeAccount.type === 'professional' ? 'Tambah Portofolio' : 'Bagikan Momen'}
          </DialogTitle></DialogHeader>
          <div className="space-y-6 pt-4">
            <Input value={newItem.title} onChange={(e) => setNewItem({ ...newItem, title: e.target.value })} placeholder="Judul Konten" className="rounded-xl" />
            <Textarea value={newItem.description} onChange={(e) => setNewItem({ ...newItem, description: e.target.value })} placeholder="Berikan deskripsi detail..." className="rounded-xl min-h-[120px]" />
          </div>
          <DialogFooter className="mt-8 flex gap-2">
            <Button variant="ghost" onClick={() => setIsContentModalOpen(false)} className="rounded-xl">Batal</Button>
            <Button onClick={handleAddContent} className="rounded-xl bg-teal-600 hover:bg-teal-700 font-black px-8 text-white">Konfirmasi</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
