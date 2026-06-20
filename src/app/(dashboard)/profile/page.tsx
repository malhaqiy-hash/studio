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
  DollarSign,
  X,
  Globe,
  Lock,
  Image as ImageIcon,
  MoreHorizontal,
  Cloud,
  FolderOpen,
  Check,
  TrendingUp,
  Monitor,
  Sparkles,
  RefreshCw,
  Share2,
  QrCode,
  Copy,
  MapPin
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
import { useUser } from '@/firebase';

// Mock Cloud Data for Google Photos simulation
const MOCK_GOOGLE_PHOTOS = [
  'https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=400&h=400&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1497215728101-856f4ea42174?q=80&w=400&h=400&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1556761175-b413da4baf72?q=80&w=400&h=400&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=400&h=400&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1454165833767-027ffea9e77b?q=80&w=400&h=400&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=400&h=400&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?q=80&w=400&h=400&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=400&h=400&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=400&h=400&auto=format&fit=crop'
];

export default function ProfilePage() {
  const { activeAccount, updateActiveAccount } = useAccount();
  const { user } = useUser();
  const { toast } = useToast();

  // Modal States
  const [isPhotoModalOpen, setIsPhotoModalOpen] = React.useState(false);
  const [isBioModalOpen, setIsBioModalOpen] = React.useState(false);
  const [isLinksModalOpen, setIsLinksModalOpen] = React.useState(false);
  const [isContentModalOpen, setIsContentModalOpen] = React.useState(false);
  const [isSourcePickerOpen, setIsSourcePickerOpen] = React.useState(false);
  const [isCloudPickerOpen, setIsCloudPickerOpen] = React.useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = React.useState(false);

  // Form States
  const [tempAccount, setTempAccount] = React.useState<Partial<Account>>({});
  const [newItem, setNewItem] = React.useState<Partial<ContentItem>>({
    visibility: 'public'
  });

  // Native File Ref
  const fileBrowserRef = React.useRef<HTMLInputElement>(null);

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
      image: newItem.image,
      title: newItem.title,
      description: newItem.description,
      price: newItem.price,
      visibility: newItem.visibility || 'public',
      timestamp: 'Just now'
    };
    updateActiveAccount({
      items: [item, ...(activeAccount.items || [])]
    });
    setIsContentModalOpen(false);
    setNewItem({ visibility: 'public' });
    toast({ title: activeAccount.type === 'pribadi' ? 'Postingan berhasil dibagikan' : 'Konten ditambahkan' });
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

  const handleShareAddress = () => {
    if (navigator.share) {
      navigator.share({
        title: activeAccount.name,
        text: activeAccount.bio || 'Cek profil OnTapp saya!',
        url: `https://ontapp.network/p/${activeAccount.id}`
      }).catch(console.error);
    } else {
      handleCopyLink();
    }
  };

  // Local File Handler
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewItem(prev => ({ ...prev, image: reader.result as string }));
        setIsSourcePickerOpen(false);
        toast({ title: 'Foto terlampir' });
      };
      reader.readAsDataURL(file);
    }
    if (e.target) e.target.value = '';
  };

  // Cloud Selection Handler
  const handleCloudSelect = (url: string) => {
    setNewItem(prev => ({ ...prev, image: url }));
    setIsCloudPickerOpen(false);
    setIsSourcePickerOpen(false);
    toast({ title: 'Foto terpilih dari Google Foto' });
  };

  const triggerFilePicker = () => {
    fileBrowserRef.current?.click();
  };

  const openCloudPicker = () => {
    setIsSourcePickerOpen(false);
    setIsCloudPickerOpen(true);
  };

  const getLinkIcon = (url: string) => {
    const lowerUrl = url.toLowerCase();
    if (lowerUrl.includes('instagram.com')) return <Instagram className="size-4" />;
    if (lowerUrl.includes('linkedin.com')) return <Linkedin className="size-4" />;
    if (lowerUrl.includes('facebook.com')) return <Facebook className="size-4" />;
    if (lowerUrl.includes('shopee') || lowerUrl.includes('tokopedia') || lowerUrl.includes('tiktok.com')) return <ShoppingBag className="size-4" />;
    return <Link2 className="size-4" />;
  };

  const isPostEmpty = !newItem.description?.trim() && !newItem.image;

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto space-y-12 pb-24">
        
        {/* Header Section */}
        <section className="relative group">
          <div className="h-48 md:h-64 w-full bg-slate-50 border-b border-slate-100 relative overflow-hidden rounded-3xl">
            <img 
              src={`https://picsum.photos/seed/${activeAccount.id}_cover/1200/400`} 
              alt="Cover" 
              className="w-full h-full object-cover opacity-80"
              data-ai-hint="business office"
            />
            <div className="absolute top-4 right-4 flex gap-2">
              <Button 
                size="sm"
                onClick={() => setIsShareModalOpen(true)}
                className="bg-white/80 backdrop-blur hover:bg-white text-slate-900 rounded-xl border-none font-black text-xs gap-2 shadow-lg h-9 px-4"
              >
                <Share2 className="size-4" /> Bagi
              </Button>
              <Button 
                size="sm"
                variant="outline"
                onClick={() => {
                  setTempAccount({ avatar: activeAccount.avatar });
                  setIsPhotoModalOpen(true);
                }}
                className="bg-white/80 backdrop-blur hover:bg-white text-slate-600 rounded-xl border-none font-bold text-xs gap-2 shadow-sm h-9 px-4"
              >
                <Camera className="size-4" /> Edit
              </Button>
            </div>
          </div>

          <div className="px-6 md:px-8 -mt-16 md:-mt-20 flex flex-col items-start gap-4">
            <div className="relative group/avatar">
              <Avatar className="size-32 md:size-40 border-[6px] border-white shadow-xl overflow-hidden">
                <AvatarImage src={activeAccount.avatar} className="object-cover" />
                <AvatarFallback className="bg-indigo-50 text-accent"><UserIcon size={48} /></AvatarFallback>
              </Avatar>
              <button 
                onClick={() => setIsPhotoModalOpen(true)}
                className="absolute bottom-2 right-2 size-10 bg-accent text-white rounded-full flex items-center justify-center border-4 border-white shadow-lg hover:scale-110 transition-transform"
              >
                <Pencil className="size-4" />
              </button>
            </div>

            <div className="space-y-1 w-full flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl font-black text-slate-900 tracking-tight">{activeAccount.name}</h1>
                  <Badge className="bg-emerald-50 text-emerald-700 border-none px-2 py-0 text-[10px] uppercase font-black tracking-widest flex gap-1">
                    <ShieldCheck className="size-3" /> AI Verified
                  </Badge>
                </div>
                <div className="flex items-center gap-2 text-slate-500 font-medium text-sm">
                  {activeAccount.type === 'bisnis' ? <Building2 size={14} /> : activeAccount.type === 'professional' ? <Briefcase size={14} /> : <UserIcon size={14} />}
                  {activeAccount.extra || 'General Member'}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Bio Section */}
        <section className="px-6 md:px-8 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 text-xs font-medium text-slate-500 tracking-tight">
              <span><strong className="text-slate-900">1.2k</strong> Followers</span>
              <span className="size-1 rounded-full bg-slate-200" />
              <span><strong className="text-slate-900">452</strong> Following</span>
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => {
                setTempAccount({ name: activeAccount.name, extra: activeAccount.extra, bio: activeAccount.bio });
                setIsBioModalOpen(true);
              }}
              className="text-[10px] font-black uppercase text-accent hover:bg-indigo-50 px-3 rounded-lg"
            >
              <Pencil className="size-3 mr-1.5" /> Edit Bio
            </Button>
          </div>
          <p className="text-slate-600 leading-relaxed font-medium">
            {activeAccount.bio || 'Tidak ada deskripsi profil.'}
          </p>
        </section>

        {/* Links Hub Section */}
        <section className="px-6 md:px-8 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Links Hub</h3>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => {
                setTempAccount({ links: [...(activeAccount.links || [])] });
                setIsLinksModalOpen(true);
              }}
              className="text-[10px] font-black uppercase text-accent hover:bg-indigo-50 px-3 rounded-lg"
            >
              <Plus className="size-3 mr-1.5" /> Kelola Link
            </Button>
          </div>
          {activeAccount.links && activeAccount.links.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {activeAccount.links.map((link, idx) => (
                <a 
                  key={idx} 
                  href={link} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-slate-100 bg-white text-xs font-bold text-slate-600 hover:border-accent hover:text-accent transition-all"
                >
                  {getLinkIcon(link)}
                  <span className="max-w-[120px] truncate">{new URL(link).hostname.replace('www.', '')}</span>
                </a>
              ))}
            </div>
          ) : (
            <p className="text-[10px] text-slate-400 font-medium italic">Belum ada tautan sosial.</p>
          )}
        </section>

        <hr className="border-slate-100 mx-6 md:px-8" />

        {/* Content Section */}
        <section className="px-6 md:px-8 space-y-6 pb-20">
          <div className="flex items-center justify-between">
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
              {activeAccount.type === 'pribadi' ? 'Threads & Moments' : activeAccount.type === 'professional' ? 'Portfolio Gallery' : 'Product Catalog'}
            </h3>
            <Button 
              size="sm" 
              onClick={() => {
                setNewItem({ visibility: 'public' });
                setIsContentModalOpen(true);
              }}
              className="rounded-xl h-9 bg-accent hover:bg-indigo-600 gap-2 font-bold px-4 shadow-sm"
            >
              <PlusCircle className="size-4" />
              {activeAccount.type === 'pribadi' ? 'Buat Post' : 'Tambah Baru'}
            </Button>
          </div>

          {(!activeAccount.items || activeAccount.items.length === 0) ? (
            <div className="py-20 text-center space-y-4 bg-slate-50/50 rounded-[2.5rem] border-2 border-dashed border-slate-100">
              <div className="size-16 bg-white rounded-3xl flex items-center justify-center mx-auto shadow-sm">
                <Plus className="size-8 text-slate-200" />
              </div>
              <p className="text-slate-400 text-sm font-medium italic">Belum ada konten untuk ditampilkan.</p>
            </div>
          ) : (
            <div className={cn(
              activeAccount.type === 'pribadi' ? "space-y-6" : "grid grid-cols-1 md:grid-cols-2 gap-6"
            )}>
              {activeAccount.items.map((item) => (
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
                            <span className="text-[10px] text-slate-400 font-medium tracking-tight">
                              {item.timestamp || 'Just now'}
                            </span>
                            {item.visibility === 'private' ? (
                              <Lock className="size-2.5 text-slate-300" />
                            ) : (
                              <Globe className="size-2.5 text-slate-300" />
                            )}
                          </div>
                          <button className="text-slate-300 hover:text-slate-600">
                            <MoreHorizontal className="size-4" />
                          </button>
                        </div>
                        <div className="space-y-3">
                          {item.description && (
                            <p className="text-sm text-slate-600 leading-relaxed font-medium">
                              {item.description}
                            </p>
                          )}
                          {item.image && (
                            <div className="rounded-2xl overflow-hidden border border-slate-100 shadow-sm max-w-sm">
                              <img src={item.image} className="w-full h-auto object-cover" alt="Post" />
                            </div>
                          )}
                        </div>
                        <div className="flex items-center gap-4 pt-1">
                          <button onClick={() => handleRemoveItem(item.id)} className="text-xs text-rose-500 font-bold opacity-0 group-hover:opacity-100 transition-opacity">Hapus</button>
                        </div>
                      </div>
                    </div>
                  ) : activeAccount.type === 'professional' ? (
                    <div className="space-y-3">
                      <div className="aspect-[4/3] rounded-3xl overflow-hidden border border-slate-100 bg-slate-50 shadow-sm relative">
                        <img src={item.image} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt={item.title} />
                        <button 
                          onClick={() => handleRemoveItem(item.id)}
                          className="absolute top-2 right-2 size-8 bg-rose-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                        >
                          <Trash2 className="size-4" />
                        </button>
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900">{item.title}</h4>
                        <p className="text-xs text-slate-500 font-medium leading-relaxed">{item.description}</p>
                      </div>
                    </div>
                  ) : (
                    <Card className="rounded-3xl border-slate-100 shadow-sm overflow-hidden group hover:shadow-md transition-shadow relative">
                      <div className="aspect-video relative overflow-hidden">
                        <img src={item.image} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt={item.title} />
                        {item.price && (
                          <div className="absolute bottom-3 right-3 bg-white/95 backdrop-blur px-3 py-1 rounded-full text-xs font-black text-indigo-600 shadow-sm">
                            ${item.price}
                          </div>
                        )}
                        <button 
                          onClick={() => handleRemoveItem(item.id)}
                          className="absolute top-2 right-2 size-8 bg-rose-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                        >
                          <Trash2 className="size-4" />
                        </button>
                      </div>
                      <CardContent className="p-4 space-y-1">
                        <h4 className="font-bold text-slate-900">{item.title}</h4>
                        <p className="text-[10px] text-slate-500 font-medium line-clamp-2">{item.description}</p>
                      </CardContent>
                    </Card>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>
      </div>

      {/* Share & Business Card QR Modal */}
      <Dialog open={isShareModalOpen} onOpenChange={setIsShareModalOpen}>
        <DialogContent className="max-w-[340px] rounded-[3rem] p-0 border-none shadow-2xl overflow-hidden bg-white">
          <DialogHeader className="p-8 pb-4 bg-slate-50 border-b">
             <DialogTitle className="text-xl font-black text-slate-900 tracking-tight">AI Business Card</DialogTitle>
             <DialogDescription className="font-medium text-xs">Pindai atau bagikan kartu bisnis digital Anda.</DialogDescription>
          </DialogHeader>
          <div className="p-8 flex flex-col items-center space-y-8">
             {/* Simulai QR Code */}
             <div className="size-48 p-4 bg-white rounded-[2rem] border-4 border-indigo-50 shadow-inner flex items-center justify-center relative overflow-hidden">
                <QrCode className="size-full text-slate-900" />
                <div className="absolute inset-0 bg-gradient-to-tr from-accent/5 to-transparent pointer-events-none" />
             </div>

             <div className="w-full space-y-3">
                <Button 
                  onClick={handleShareAddress}
                  className="w-full h-12 rounded-2xl bg-slate-900 hover:bg-black text-white font-black text-xs uppercase tracking-widest gap-3 shadow-lg"
                >
                  <Share2 className="size-4" /> Bagikan Alamat
                </Button>
                <div className="grid grid-cols-2 gap-3">
                   <Button 
                     variant="outline"
                     onClick={handleCopyLink}
                     className="rounded-2xl h-12 border-slate-200 font-black text-[10px] uppercase tracking-widest gap-2"
                   >
                     <Copy className="size-3.5" /> Salin Link
                   </Button>
                   <Button 
                     variant="outline"
                     onClick={() => toast({ title: "Membuka Maps..." })}
                     className="rounded-2xl h-12 border-slate-200 font-black text-[10px] uppercase tracking-widest gap-2"
                   >
                     <MapPin className="size-3.5" /> Alamat Toko
                   </Button>
                </div>
             </div>
          </div>
          <DialogFooter className="p-4 bg-slate-50 text-center border-t">
             <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center justify-center gap-2">
                <Sparkles className="size-3 text-amber-500" /> Profil Terverifikasi AI
             </p>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Independent Photo Modal */}
      <Dialog open={isPhotoModalOpen} onOpenChange={setIsPhotoModalOpen}>
        <DialogContent className="max-w-md rounded-[2.5rem] border-none shadow-2xl p-8 bg-white">
          <DialogHeader>
            <DialogTitle className="text-xl font-black text-slate-900 tracking-tight">Pembaruan Visual</DialogTitle>
          </DialogHeader>
          <div className="space-y-6 pt-4">
            <div className="space-y-2">
              <Label className="font-bold text-slate-700">URL Foto Profil</Label>
              <Input 
                value={tempAccount.avatar}
                onChange={(e) => setTempAccount({ ...tempAccount, avatar: e.target.value })}
                className="rounded-xl border-slate-200"
                placeholder="https://..."
              />
            </div>
            <div className="p-10 border-2 border-dashed border-slate-100 rounded-[2rem] text-center space-y-3 bg-slate-50/50">
               <Camera className="size-8 text-slate-300 mx-auto" />
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Unggah Berkas Baru</p>
            </div>
          </div>
          <DialogFooter className="mt-8 flex gap-2">
            <Button variant="ghost" onClick={() => setIsPhotoModalOpen(false)} className="rounded-xl font-bold">Batal</Button>
            <Button onClick={handleSavePhotos} className="rounded-xl bg-accent hover:bg-indigo-600 font-black px-8">Simpan Foto</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Independent Bio Modal */}
      <Dialog open={isBioModalOpen} onOpenChange={setIsBioModalOpen}>
        <DialogContent className="max-w-xl rounded-[2.5rem] border-none shadow-2xl p-8 bg-white">
          <DialogHeader>
            <DialogTitle className="text-xl font-black text-slate-900 tracking-tight">Edit Informasi Dasar</DialogTitle>
          </DialogHeader>
          <div className="space-y-6 pt-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="font-bold text-slate-700">Nama Tampilan</Label>
                <Input 
                  value={tempAccount.name}
                  onChange={(e) => setTempAccount({ ...tempAccount, name: e.target.value })}
                  className="rounded-xl border-slate-200"
                />
              </div>
              <div className="space-y-2">
                <Label className="font-bold text-slate-700">
                  {activeAccount.type === 'professional' ? 'Keahlian' : activeAccount.type === 'bisnis' ? 'Kategori' : 'Tagline'}
                </Label>
                <Input 
                  value={tempAccount.extra}
                  onChange={(e) => setTempAccount({ ...tempAccount, extra: e.target.value })}
                  className="rounded-xl border-slate-200"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label className="font-bold text-slate-700">Bio Singkat</Label>
              <Textarea 
                value={tempAccount.bio}
                onChange={(e) => setTempAccount({ ...tempAccount, bio: e.target.value })}
                className="rounded-xl border-slate-200 min-h-[120px]"
              />
            </div>
          </div>
          <DialogFooter className="mt-8 flex gap-2">
            <Button variant="ghost" onClick={() => setIsBioModalOpen(false)} className="rounded-xl font-bold">Batal</Button>
            <Button onClick={handleSaveBio} className="rounded-xl bg-accent hover:bg-indigo-600 font-black px-8">Simpan Bio</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Independent Links Modal */}
      <Dialog open={isLinksModalOpen} onOpenChange={setIsLinksModalOpen}>
        <DialogContent className="max-w-md rounded-[2.5rem] border-none shadow-2xl p-8 bg-white">
          <DialogHeader>
            <DialogTitle className="text-xl font-black text-slate-900 tracking-tight">Kelola Tautan Hub</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            {(tempAccount.links || []).map((link, i) => (
              <div key={i} className="flex gap-2">
                <div className="flex-1 relative">
                  <Link2 className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                  <Input 
                    value={link}
                    onChange={(e) => {
                      const newLinks = [...(tempAccount.links || [])];
                      newLinks[i] = e.target.value;
                      setTempAccount({ ...tempAccount, links: newLinks });
                    }}
                    className="rounded-xl border-slate-200 pl-10"
                    placeholder="https://..."
                  />
                </div>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => {
                    setTempAccount({ ...tempAccount, links: (tempAccount.links || []).filter((_, idx) => idx !== i) });
                  }}
                  className="text-slate-300 hover:text-rose-500 rounded-xl"
                >
                  <Trash2 className="size-4" />
                </Button>
              </div>
            ))}
            <Button 
              variant="outline" 
              className="w-full rounded-xl border-dashed border-slate-200 font-bold text-xs"
              onClick={() => setTempAccount({ ...tempAccount, links: [...(tempAccount.links || []), ""] })}
            >
              <Plus className="size-3 mr-2" /> Tambah Tautan Baru
            </Button>
          </div>
          <DialogFooter className="mt-8 flex gap-2">
            <Button variant="ghost" onClick={() => setIsLinksModalOpen(false)} className="rounded-xl font-bold">Batal</Button>
            <Button onClick={handleSaveLinks} className="rounded-xl bg-accent hover:bg-indigo-600 font-black px-8">Selesai</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
