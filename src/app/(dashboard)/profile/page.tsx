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
  Check
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
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

export default function ProfilePage() {
  const { activeAccount, updateActiveAccount } = useAccount();
  const { toast } = useToast();

  // Modal States
  const [isPhotoModalOpen, setIsPhotoModalOpen] = React.useState(false);
  const [isBioModalOpen, setIsBioModalOpen] = React.useState(false);
  const [isLinksModalOpen, setIsLinksModalOpen] = React.useState(false);
  const [isContentModalOpen, setIsContentModalOpen] = React.useState(false);
  const [isSourcePickerOpen, setIsSourcePickerOpen] = React.useState(false);
  const [isGooglePhotosOpen, setIsGooglePhotosOpen] = React.useState(false);

  // Form States
  const [tempAccount, setTempAccount] = React.useState<Partial<Account>>({});
  const [newItem, setNewItem] = React.useState<Partial<ContentItem>>({
    visibility: 'public'
  });

  const fileInputRef = React.useRef<HTMLInputElement>(null);

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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewItem({ ...newItem, image: reader.result as string });
        setIsSourcePickerOpen(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const selectGooglePhoto = (url: string) => {
    setNewItem({ ...newItem, image: url });
    setIsGooglePhotosOpen(false);
    setIsSourcePickerOpen(false);
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
            <Button 
              size="sm"
              variant="outline"
              onClick={() => {
                setTempAccount({ avatar: activeAccount.avatar });
                setIsPhotoModalOpen(true);
              }}
              className="absolute top-4 right-4 bg-white/80 backdrop-blur hover:bg-white rounded-xl border-none font-bold text-xs gap-2 shadow-sm"
            >
              <Camera className="size-4" /> Ubah Cover
            </Button>
          </div>

          <div className="px-6 md:px-8 -mt-16 md:-mt-20 flex flex-col items-start gap-4">
            <div className="relative group/avatar">
              <Avatar className="size-32 md:size-40 border-[6px] border-white shadow-sm overflow-hidden">
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

            <div className="space-y-1 w-full flex justify-between items-start">
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

      {/* Independent Media Content Modal */}
      <Dialog open={isContentModalOpen} onOpenChange={setIsContentModalOpen}>
        <DialogContent className={cn(
          "max-w-lg rounded-[2.5rem] border-none shadow-2xl p-0 bg-white overflow-hidden",
          activeAccount.type === 'pribadi' && "max-w-md"
        )}>
          {activeAccount.type === 'pribadi' ? (
            <div className="flex flex-col">
              <DialogHeader className="p-6 pb-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <DialogTitle className="text-lg font-black tracking-tight">Buat Post Baru</DialogTitle>
                  </div>
                  <Select 
                    value={newItem.visibility} 
                    onValueChange={(v: any) => setNewItem({ ...newItem, visibility: v })}
                  >
                    <SelectTrigger className="w-[110px] h-8 rounded-full border-slate-100 text-[10px] font-black uppercase tracking-wider">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl">
                      <SelectItem value="public">
                        <div className="flex items-center gap-2">
                          <Globe className="size-3" /> Publik
                        </div>
                      </SelectItem>
                      <SelectItem value="private">
                        <div className="flex items-center gap-2">
                          <Lock className="size-3" /> Pribadi
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </DialogHeader>
              <div className="px-6 py-4 space-y-4">
                <div className="flex gap-4">
                  <Avatar className="size-10 shrink-0 border border-slate-100">
                    <AvatarImage src={activeAccount.avatar} />
                    <AvatarFallback>{activeAccount.name[0]}</AvatarFallback>
                  </Avatar>
                  <Textarea 
                    value={newItem.description}
                    onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                    placeholder="Apa yang Anda pikirkan?"
                    className="flex-1 border-none focus-visible:ring-0 text-sm font-medium placeholder:text-slate-400 bg-transparent resize-none min-h-[120px] p-0 pt-2"
                  />
                </div>

                {newItem.image && (
                  <div className="relative group/thumb w-fit mx-auto">
                    <img src={newItem.image} className="h-48 w-auto rounded-2xl object-cover border shadow-sm" alt="Preview" />
                    <button 
                      onClick={() => setNewItem({ ...newItem, image: undefined })}
                      className="absolute -top-2 -right-2 bg-slate-900 text-white rounded-full p-1 shadow-lg group-hover/thumb:scale-110 transition-transform"
                    >
                      <X className="size-3" />
                    </button>
                  </div>
                )}
              </div>
              <DialogFooter className="p-4 border-t bg-slate-50/50 flex items-center justify-between">
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => setIsSourcePickerOpen(true)}
                  className="text-slate-500 hover:text-accent font-bold gap-2 rounded-full"
                >
                  <ImageIcon className="size-4" />
                  Lampirkan Foto
                </Button>
                <Button 
                  onClick={handleAddContent}
                  disabled={isPostEmpty}
                  className="rounded-full bg-accent hover:bg-indigo-600 font-black px-8 shadow-lg shadow-indigo-100 disabled:opacity-50"
                >
                  Post
                </Button>
              </DialogFooter>
            </div>
          ) : (
            <>
              <DialogHeader className="p-8 pb-4 bg-slate-50 border-b">
                <DialogTitle className="text-xl font-black text-slate-900 tracking-tight">
                  {activeAccount.type === 'professional' ? 'Tambah Portfolio Baru' : 'Tambah Produk Baru'}
                </DialogTitle>
              </DialogHeader>
              <div className="p-8 space-y-6">
                <div className="aspect-video rounded-[2rem] bg-slate-50 border-2 border-dashed border-slate-100 overflow-hidden flex items-center justify-center relative group">
                  <img src={newItem.image || `https://picsum.photos/seed/${Date.now()}/800/600`} className="w-full h-full object-cover" alt="Preview" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white p-4">
                    <Camera className="size-8 mb-2" />
                    <span className="text-[10px] font-black uppercase tracking-widest">Ganti Media</span>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-1 space-y-2">
                    <Label className="font-bold text-slate-700">{activeAccount.type === 'bisnis' ? 'Nama Produk' : 'Judul Proyek'}</Label>
                    <Input 
                      value={newItem.title}
                      onChange={(e) => setNewItem({ ...newItem, title: e.target.value })}
                      className="rounded-xl border-slate-200"
                      placeholder="Masukkan judul..."
                    />
                  </div>
                  {activeAccount.type === 'bisnis' && (
                    <div className="w-32 space-y-2">
                      <Label className="font-bold text-slate-700">Harga</Label>
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 size-3 text-slate-400" />
                        <Input 
                          value={newItem.price}
                          onChange={(e) => setNewItem({ ...newItem, price: e.target.value })}
                          className="rounded-xl border-slate-200 pl-8"
                          placeholder="0.00"
                        />
                      </div>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label className="font-bold text-slate-700">Deskripsi Detail</Label>
                  <Textarea 
                    value={newItem.description}
                    onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                    className="rounded-xl border-slate-200 min-h-[100px]"
                    placeholder="Tulis detail di sini..."
                  />
                </div>
              </div>
              <DialogFooter className="p-8 pt-0 flex gap-2">
                <Button variant="ghost" onClick={() => setIsContentModalOpen(false)} className="rounded-xl font-bold">Batal</Button>
                <Button onClick={handleAddContent} className="rounded-xl bg-accent hover:bg-indigo-600 font-black px-10">Publikasikan</Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Media Source Picker Modal */}
      <Dialog open={isSourcePickerOpen} onOpenChange={setIsSourcePickerOpen}>
        <DialogContent className="max-w-sm rounded-[2.5rem] border-none shadow-2xl p-0 overflow-hidden bg-white">
          <DialogHeader className="p-6 pb-2 border-b bg-slate-50">
            <DialogTitle className="text-lg font-black tracking-tight text-center">Pilih Sumber Media</DialogTitle>
          </DialogHeader>
          <div className="p-4 space-y-2">
            <Button 
              variant="ghost" 
              className="w-full h-14 rounded-2xl justify-start gap-4 px-6 hover:bg-slate-50 hover:text-accent font-bold group"
              onClick={() => fileInputRef.current?.click()}
            >
              <ImageIcon className="size-5 text-indigo-500 group-hover:scale-110 transition-transform" />
              Galeri Foto
            </Button>
            <Button 
              variant="ghost" 
              className="w-full h-14 rounded-2xl justify-start gap-4 px-6 hover:bg-slate-50 hover:text-accent font-bold group"
              onClick={() => setIsGooglePhotosOpen(true)}
            >
              <Cloud className="size-5 text-blue-500 group-hover:scale-110 transition-transform" />
              Google Photos
            </Button>
            <Button 
              variant="ghost" 
              className="w-full h-14 rounded-2xl justify-start gap-4 px-6 hover:bg-slate-50 hover:text-accent font-bold group"
              onClick={() => fileInputRef.current?.click()}
            >
              <FolderOpen className="size-5 text-emerald-500 group-hover:scale-110 transition-transform" />
              File Browser
            </Button>
          </div>
          <input 
            type="file" 
            ref={fileInputRef} 
            className="hidden" 
            accept="image/*"
            onChange={handleFileChange}
          />
        </DialogContent>
      </Dialog>

      {/* Google Photos Mock Modal */}
      <Dialog open={isGooglePhotosOpen} onOpenChange={setIsGooglePhotosOpen}>
        <DialogContent className="max-w-md rounded-[2.5rem] border-none shadow-2xl p-0 overflow-hidden bg-white">
          <DialogHeader className="p-6 pb-4 border-b bg-slate-50">
            <div className="flex items-center gap-3">
              <Cloud className="size-6 text-blue-500" />
              <DialogTitle className="text-lg font-black tracking-tight">Cloud Library</DialogTitle>
            </div>
          </DialogHeader>
          <ScrollArea className="h-[400px] p-4">
            <div className="grid grid-cols-3 gap-2">
              {[...Array(12)].map((_, i) => (
                <button 
                  key={i}
                  onClick={() => selectGooglePhoto(`https://picsum.photos/seed/gp${i}/600/600`)}
                  className="aspect-square rounded-xl overflow-hidden border border-slate-100 hover:ring-4 hover:ring-accent/20 transition-all relative group"
                >
                  <img src={`https://picsum.photos/seed/gp${i}/200/200`} className="w-full h-full object-cover" alt="Mock Cloud" />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all">
                    <Check className="size-6 text-white" />
                  </div>
                </button>
              ))}
            </div>
          </ScrollArea>
          <DialogFooter className="p-4 border-t bg-slate-50 flex justify-center">
            <Button variant="ghost" onClick={() => setIsGooglePhotosOpen(false)} className="rounded-xl font-bold">Tutup</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </DashboardLayout>
  );
}
