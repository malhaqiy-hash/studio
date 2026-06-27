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
  MoreVertical,
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
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

const ConnectIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="12" cy="12" r="1.5" fill="currentColor" />
    <path d="M16 8c1.1 1.1 1.1 2.9 0 4M18 6c2.2 2.2 2.2 5.8 0 8" />
    <path d="M8 16c-1.1-1.1-1.1-2.9 0-4M6 18c-2.2-2.2-2.2-5.8 0-8" />
  </svg>
);

function getSmartIcon(url: string) {
  const lower = url.toLowerCase();
  if (lower.includes('maps.google') || lower.includes('goo.gl/maps') || lower.includes('apple.com/maps')) return <MapPin className="size-3" />;
  if (lower.includes('instagram.com')) return <Instagram className="size-3" />;
  if (lower.includes('linkedin.com')) return <Linkedin className="size-3" />;
  if (lower.includes('facebook.com') || lower.includes('fb.com')) return <Facebook className="size-3" />;
  if (lower.includes('wa.me') || lower.includes('whatsapp.com')) return <Smartphone className="size-3" />;
  return <Globe className="size-3" />;
}

const MOCK_CONNECTIONS = [
  { id: 'conn1', name: 'Andi Wijaya', avatar: 'https://picsum.photos/seed/f1/100', type: 'Professional' },
  { id: 'conn2', name: 'Budi Santoso', avatar: 'https://picsum.photos/seed/f2/100', type: 'Bisnis' },
  { id: 'conn3', name: 'Siti Aminah', avatar: 'https://picsum.photos/seed/f3/100', type: 'Personal' },
  { id: 'conn4', name: 'Rina Kartika', avatar: 'https://picsum.photos/seed/f4/100', type: 'Bisnis' },
];

export default function ProfilePage() {
  const { activeAccount, updateActiveAccount, addPost, removePost } = useAccount();
  const { toast } = useToast();

  const [isBioModalOpen, setIsBioModalOpen] = React.useState(false);
  const [isContentModalOpen, setIsContentModalOpen] = React.useState(false);
  const [isMediaPickerOpen, setIsMediaPickerOpen] = React.useState(false);
  const [isShareSheetOpen, setIsShareSheetOpen] = React.useState(false);
  const [shareUrl, setShareUrl] = React.useState("");

  // Connection management states
  const [isConnectionsModalOpen, setIsConnectionsModalOpen] = React.useState(false);
  const [confirmDisconnectId, setConfirmDisconnectId] = React.useState<string | null>(null);
  const [connections, setConnections] = React.useState(MOCK_CONNECTIONS);

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
    
    const params = new URLSearchParams(window.location.search);
    if (params.get('edit') === 'true') {
      setTempAccount({ 
        name: activeAccount.name, 
        bio: activeAccount.bio, 
        locationLink: activeAccount.locationLink 
      });
      setIsBioModalOpen(true);
      const newUrl = window.location.pathname;
      window.history.replaceState({}, '', newUrl);
    }
  }, [activeAccount.id, resetContentForm, activeAccount.name, activeAccount.bio, activeAccount.locationLink]);

  const profileVisibleItems = React.useMemo(() => {
    const items = (activeAccount.items || []).filter(i => 
      !i.isArchived && (i.displayLocation === 'profile' || i.displayLocation === 'both')
    );
    return [...items].sort((a, b) => {
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;
      return 0;
    });
  }, [activeAccount.items]);

  const groupedItems = React.useMemo(() => {
    if (activeAccount.type === 'personal') return { 'Inspirasi': profileVisibleItems };
    
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
          reader.onloadend = () => {
            setNewItem(prev => ({ ...prev, images: [...(prev.images || []), reader.result as string] }));
          };
          reader.readAsDataURL(file);
        });
        setIsMediaPickerOpen(false);
      } else {
        const reader = new FileReader();
        reader.onloadend = () => {
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
    setShareUrl(`https://koolink.network/profile/${activeAccount.id}`);
    setIsShareSheetOpen(true);
  };

  const handleSharePost = (id: string) => {
    setShareUrl(`https://koolink.network/post/${id}`);
    setIsShareSheetOpen(true);
  };

  const handleDisconnect = () => {
    if (confirmDisconnectId) {
      setConnections(prev => prev.filter(c => c.id !== confirmDisconnectId));
      setConfirmDisconnectId(null);
      toast({ title: "Koneksi diputuskan" });
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-xl mx-auto space-y-3 md:space-y-4 pb-20">
        <input type="file" multiple ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />

        <section className="relative group">
          <div className="aspect-[1640/624] w-full bg-muted border-b border-border relative overflow-hidden rounded-xl">
            <img 
              src={activeAccount.cover || `https://picsum.photos/seed/${activeAccount.id}_cover/1640/624`} 
              alt="Cover" 
              className="w-full h-full object-cover opacity-90" 
            />
            <div className="absolute top-3 right-3 flex gap-1.5">
              <Button 
                onClick={() => openMediaPicker('cover')} 
                variant="outline" 
                size="icon"
                className="size-7 bg-background/80 backdrop-blur text-accent border-none rounded-lg shadow-lg active:scale-90 transition-transform"
              >
                <Camera className="size-3.5" />
              </Button>
              <Button 
                onClick={handleShareProfile} 
                variant="outline" 
                size="icon"
                className="size-7 bg-background/80 backdrop-blur text-accent border-none rounded-lg shadow-lg active:scale-90 transition-transform"
              >
                <Share2 className="size-3.5" />
              </Button>
            </div>
          </div>

          <div className="px-3 md:px-5 -mt-8 md:-mt-10 flex flex-col items-start gap-2">
            <div className="relative group/avatar">
              <Avatar className="size-16 md:size-24 border-[3px] border-background dark:border-card shadow-lg rounded-2xl">
                <AvatarImage src={activeAccount.avatar} className="object-cover" />
                <AvatarFallback className="bg-accent/10 text-accent font-bold text-base">{activeAccount.name[0]}</AvatarFallback>
              </Avatar>
              <button onClick={() => openMediaPicker('avatar')} className="absolute bottom-0 right-0 size-6 bg-accent text-white rounded-lg flex items-center justify-center border-2 border-background shadow-lg hover:scale-105 active:scale-95 transition-all"><Pencil className="size-3" /></button>
            </div>
            <div className="space-y-0 w-full">
              <div className="flex items-center gap-2">
                <h1 className="text-base md:text-lg font-bold text-slate-900 tracking-tight">{activeAccount.name}</h1>
                {activeAccount.verificationStatus === 'Verified' && <ShieldCheck className="size-3 text-emerald-500" />}
                <span className="font-medium text-[9px] text-primary/60 italic lowercase select-none ml-1 leading-none">{activeAccount.type}</span>
              </div>
              <div className="flex flex-col gap-0.5">
                <div className="flex flex-wrap items-center gap-3 text-muted-foreground font-medium text-[11px] md:text-[13px]">
                  <span>{activeAccount.extra || 'Koolink Member'}</span>
                  <div className="flex items-center gap-4 ml-auto">
                     <div className="flex flex-col items-center">
                        <span className="text-xs font-bold text-slate-900">1.2k</span>
                        <span className="text-[7px] font-black uppercase opacity-60 flex items-center gap-1">
                          {activeAccount.type === 'personal' ? <><Users className="size-2" /> Pengikut</> : <><Zap className="size-2" /> Subscribe</>}
                        </span>
                     </div>
                     {activeAccount.type === 'personal' && (
                        <div className="flex flex-col items-center">
                           <span className="text-xs font-bold text-slate-900">854</span>
                           <span className="text-[7px] font-black uppercase opacity-60 flex items-center gap-1">
                             <Users className="size-2" /> Mengikuti
                           </span>
                        </div>
                     )}
                     <div className="flex flex-col items-center text-rose-500">
                        <span className="text-xs font-bold">4.2k</span>
                        <span className="text-[7px] font-black uppercase flex items-center gap-1">
                          <Heart className="size-2 fill-rose-500" /> Suka
                        </span>
                     </div>
                  </div>
                </div>
                {activeAccount.locationLink && (
                  <a href={activeAccount.locationLink} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-accent font-bold text-[9px] uppercase tracking-widest hover:underline mt-0.5">
                    {getSmartIcon(activeAccount.locationLink)}
                    Tautan Profil
                  </a>
                )}
              </div>
            </div>
          </div>
        </section>

        <section className="px-3 md:px-5">
          <div className="flex items-center justify-between border-b border-border/40 pb-2">
            <p className="text-slate-700 leading-relaxed font-normal text-[12px] md:text-[13px]">"{activeAccount.bio || 'Membangun koneksi cerdas di Koolink.'}"</p>
            <Button variant="ghost" size="sm" onClick={() => { setTempAccount({ name: activeAccount.name, bio: activeAccount.bio, locationLink: activeAccount.locationLink }); setIsBioModalOpen(true); }} className="text-[9px] font-bold uppercase text-accent hover:bg-accent/10 px-2 h-6 rounded-lg border border-accent/20 shrink-0 ml-3"><Pencil className="size-2 mr-1" /> Edit</Button>
          </div>
        </section>

        {/* Connections Dashed Banner Section - Repositioned Below Bio/Edit */}
        <section className="px-3 md:px-5">
           <button 
             onClick={() => setIsConnectionsModalOpen(true)}
             className="w-full flex items-center gap-4 p-3 rounded-2xl border-2 border-dashed border-slate-200 hover:border-primary hover:bg-primary/[0.02] transition-all group overflow-hidden"
           >
              <div className="size-10 rounded-full bg-primary flex items-center justify-center text-white shrink-0 shadow-lg shadow-primary/20 group-hover:scale-110 transition-transform">
                 <ConnectIcon className="size-6" />
              </div>
              <div className="flex-1 flex items-center gap-2 overflow-hidden">
                <div className="flex -space-x-2.5 overflow-hidden">
                  {connections.slice(0, 4).map((conn) => (
                    <Avatar key={conn.id} className="size-8 border-2 border-background shadow-sm">
                      <AvatarImage src={conn.avatar} className="object-cover" />
                      <AvatarFallback className="text-[8px] bg-muted">{conn.name[0]}</AvatarFallback>
                    </Avatar>
                  ))}
                  {connections.length > 4 && (
                    <div className="size-8 rounded-full bg-slate-100 border-2 border-background flex items-center justify-center text-[10px] font-black text-slate-500 shadow-sm">
                      +{connections.length - 4}
                    </div>
                  )}
                </div>
                <div className="hidden sm:block text-left ml-2">
                   <p className="text-[10px] font-black text-slate-800 uppercase tracking-tight">Jaringan Koneksi</p>
                   <p className="text-[9px] font-medium text-slate-400 uppercase tracking-widest">{connections.length} Terhubung</p>
                </div>
              </div>
              <MoreVertical className="size-4 text-slate-300 group-hover:text-primary transition-colors" />
           </button>
        </section>

        <section className="px-3 md:px-5 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground">Portofolio & Produk</h3>
            <Button size="sm" onClick={() => setIsContentModalOpen(true)} className="rounded-lg h-7 bg-accent hover:bg-accent/90 gap-1 font-bold text-[10px] uppercase tracking-widest px-2.5 shadow-lg text-white"><PlusCircle className="size-3" /> Item</Button>
          </div>

          <div className="flex flex-col space-y-6">
            {Object.entries(groupedItems).map(([category, items]) => (
              <div key={category} className="space-y-2.5">
                <div className="flex items-center justify-between px-1">
                   <h4 className="text-sm font-black text-slate-900 tracking-tight uppercase border-l-3 border-black pl-2">{category}</h4>
                   <Badge variant="secondary" className="text-[8px] font-black">{items.length} Item</Badge>
                </div>
                
                <div className={cn(
                  activeAccount.type === 'personal' ? "grid grid-cols-2 gap-2.5" : "flex overflow-x-auto no-scrollbar space-x-2.5 px-1 pb-2.5 snap-x"
                )}>
                  {items.map((item) => (
                    <div key={item.id} className={cn(activeAccount.type === 'personal' ? "" : "w-28 md:w-32 flex-shrink-0 snap-start")}>
                      <Card className="rounded-xl border-none shadow-md overflow-hidden bg-card hover:shadow-xl transition-all relative group">
                        {item.images && item.images.length > 0 && (
                          <div className="aspect-square w-full overflow-hidden relative cursor-zoom-in" onClick={() => setZoomedImage(item.images![0])}>
                            <img src={item.images[0]} className="w-full h-full object-cover" alt={item.title} />
                            {item.images.length > 1 && <div className="absolute bottom-1 right-1 bg-black/60 text-white px-1 py-0.5 rounded-md text-[6px] font-black uppercase">{item.images.length} Foto</div>}
                            {item.isPinned && <div className="absolute top-1 right-1 bg-accent text-white p-0.5 rounded-full shadow-lg"><Pin className="size-2 fill-white" /></div>}
                          </div>
                        )}
                        <div className="absolute top-1 left-1 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-all">
                          <button onClick={(e) => { e.stopPropagation(); handleSharePost(item.id); }} className="size-5 bg-black/60 text-white rounded-lg flex items-center justify-center shadow-lg"><Share2 className="size-2.5" /></button>
                          <button onClick={(e) => { e.stopPropagation(); removePost(item.id); }} className="size-5 bg-rose-500 text-white rounded-lg flex items-center justify-center shadow-lg"><Trash2 className="size-2.5" /></button>
                        </div>
                        <CardContent className="p-1.5 space-y-0">
                          <h5 className="font-black text-slate-900 text-[11px] truncate leading-none">{item.title}</h5>
                          <p className="text-slate-400 text-[9px] font-medium line-clamp-2 leading-tight h-5 mt-0.5">{item.description}</p>
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

      {/* Connections List Modal */}
      <Dialog open={isConnectionsModalOpen} onOpenChange={setIsConnectionsModalOpen}>
        <DialogContent className="w-[95%] md:max-w-md rounded-[2rem] p-0 border-none shadow-2xl overflow-hidden bg-card text-foreground outline-none [&>button]:hidden">
          <div className="p-6 space-y-6">
            <div className="flex items-center justify-between">
               <div className="flex items-center gap-3">
                  <div className="size-9 rounded-xl bg-primary/10 flex items-center justify-center text-primary shadow-inner">
                    <ConnectIcon className="size-5" />
                  </div>
                  <DialogTitle className="text-lg font-black uppercase tracking-tight">Koneksi Jaringan</DialogTitle>
               </div>
               <button onClick={() => setIsConnectionsModalOpen(false)} className="p-2 rounded-xl bg-slate-50 text-slate-400 hover:text-slate-900 active:scale-90 transition-all">
                 <X className="size-4" />
               </button>
            </div>

            <div className="space-y-2 max-h-[400px] overflow-y-auto no-scrollbar">
              {connections.length > 0 ? (
                connections.map((conn) => (
                  <div key={conn.id} className="flex items-center justify-between p-3 rounded-2xl border border-border/50 hover:bg-slate-50 transition-all group">
                    <div className="flex items-center gap-3 min-w-0">
                       <Avatar className="size-11 rounded-xl border border-border shadow-sm">
                          <AvatarImage src={conn.avatar} className="object-cover" />
                          <AvatarFallback className="bg-primary/5 text-primary font-black text-xs">{conn.name[0]}</AvatarFallback>
                       </Avatar>
                       <div className="min-w-0">
                          <h4 className="font-bold text-[13px] text-slate-900 truncate uppercase tracking-tight">{conn.name}</h4>
                          <Badge variant="outline" className="text-[7px] h-4 font-black uppercase tracking-widest border-primary/20 bg-primary/5 text-primary/80">
                            {conn.type}
                          </Badge>
                       </div>
                    </div>
                    <button 
                      onClick={() => setConfirmDisconnectId(conn.id)}
                      className="size-9 flex items-center justify-center rounded-xl bg-slate-100 text-slate-400 hover:bg-rose-50 hover:text-rose-500 active:scale-90 transition-all"
                    >
                      <X className="size-4" />
                    </button>
                  </div>
                ))
              ) : (
                <div className="py-12 text-center space-y-3">
                   <div className="size-14 rounded-full bg-slate-50 flex items-center justify-center mx-auto shadow-inner">
                      <ConnectIcon className="size-7 text-slate-200" />
                   </div>
                   <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Belum ada koneksi aktif</p>
                </div>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Disconnect Confirmation Dialog */}
      <Dialog open={!!confirmDisconnectId} onOpenChange={(open) => !open && setConfirmDisconnectId(null)}>
        <DialogContent className="w-[90%] md:max-w-[320px] rounded-[2rem] border-none shadow-2xl p-6 bg-card text-foreground outline-none [&>button]:hidden text-center">
          <div className="space-y-6">
            <div className="size-16 rounded-[1.5rem] bg-rose-50 text-rose-500 flex items-center justify-center mx-auto shadow-inner">
               <X className="size-8" />
            </div>
            <div className="space-y-2">
              <DialogTitle className="text-lg font-black uppercase tracking-tight">Putus Koneksi?</DialogTitle>
              <DialogDescription className="text-[11px] font-medium text-slate-500 leading-relaxed px-4">
                Tindakan ini akan menghapus akses khusus dan sinergi jaringan antara profil Anda.
              </DialogDescription>
            </div>
            <div className="flex flex-col gap-2">
              <Button 
                onClick={handleDisconnect} 
                className="w-full h-11 rounded-xl bg-rose-500 hover:bg-rose-600 text-white font-black text-[10px] uppercase tracking-widest shadow-lg shadow-rose-100"
              >
                Putus Koneksi
              </Button>
              <Button 
                variant="ghost" 
                onClick={() => setConfirmDisconnectId(null)}
                className="w-full h-10 rounded-xl font-black text-[10px] uppercase tracking-widest text-slate-400 hover:bg-slate-50"
              >
                Batal
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={isBioModalOpen} onOpenChange={setIsBioModalOpen}>
        <DialogContent className="w-[90%] md:max-sm rounded-xl p-4 bg-card text-foreground outline-none [&>button]:hidden">
          <DialogHeader><DialogTitle className="text-sm font-bold text-slate-900">Ubah Profil</DialogTitle></DialogHeader>
          <div className="space-y-3 py-2">
            <div className="space-y-1"><Label className="text-[9px] font-bold uppercase text-muted-foreground">Nama Tampilan</Label><Input value={tempAccount.name || ''} onChange={(e) => setTempAccount({ ...tempAccount, name: e.target.value })} className="rounded-lg h-9 bg-muted/20 border-none px-3 text-[12px] font-bold" /></div>
            <div className="space-y-1"><Label className="text-[9px] font-bold uppercase text-muted-foreground">Bio</Label><Textarea value={tempAccount.bio || ''} onChange={(e) => setTempAccount({ ...tempAccount, bio: e.target.value })} className="rounded-lg bg-muted/20 border-none min-h-[60px] px-3 text-[12px] font-medium" /></div>
            <div className="space-y-1">
              <Label className="text-[9px] font-bold uppercase text-muted-foreground">Link Alamat/Web</Label>
              <div className="relative">
                <div className="absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground">{tempAccount.locationLink ? getSmartIcon(tempAccount.locationLink) : <LinkIcon className="size-3" />}</div>
                <Input value={tempAccount.locationLink || ''} onChange={(e) => setTempAccount({ ...tempAccount, locationLink: e.target.value })} placeholder="https://maps.google.com/..." className="rounded-lg h-9 bg-muted/20 border-none pl-8 text-[12px] font-medium shadow-inner" />
              </div>
            </div>
          </div>
          <DialogFooter><Button onClick={handleSaveBio} className="w-full h-10 rounded-lg bg-accent font-bold text-white text-[12px] uppercase tracking-widest shadow-lg active:scale-95 transition-all">Simpan</Button></DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog 
        open={isContentModalOpen} 
        onOpenChange={(open) => {
          setIsContentModalOpen(open);
          if (!open) resetContentForm(); 
        }}
      >
        <DialogContent className="w-[95%] md:max-w-lg rounded-xl p-4 bg-card text-foreground outline-none [&>button]:hidden">
          <DialogHeader className="flex flex-row items-center justify-between">
            <DialogTitle className="text-sm font-bold text-slate-900">Tambah Konten</DialogTitle>
            <div className="w-24">
              <Select value={newItem.visibility} onValueChange={(val: 'public' | 'private') => setNewItem({ ...newItem, visibility: val })}>
                <SelectTrigger className="h-7 rounded-lg bg-muted/50 border-none text-[9px] font-bold px-2 shadow-inner"><SelectValue /></SelectTrigger>
                <SelectContent><SelectItem value="public">🌍 Publik</SelectItem><SelectItem value="private">🔒 Privat</SelectItem></SelectContent>
              </Select>
            </div>
          </DialogHeader>
          <div className="space-y-3 pt-2 overflow-y-auto max-h-[60vh] no-scrollbar">
            <div className="space-y-1.5 p-2.5 bg-muted/20 rounded-xl">
              <Label className="font-black text-[8px] uppercase tracking-widest text-muted-foreground">Lokasi Tampilan Konten</Label>
              <Select value={newItem.displayLocation} onValueChange={(val: any) => setNewItem({ ...newItem, displayLocation: val })}>
                <SelectTrigger className="rounded-lg h-8 bg-card border-none shadow-sm font-bold text-[10px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="both">🌍 Beranda & Profil</SelectItem>
                  <SelectItem value="feed">🏠 Hanya Beranda</SelectItem>
                  <SelectItem value="profile">👤 Hanya Profil</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-4 gap-1.5">
              {(newItem.images || []).map((src, i) => (
                <div key={i} className="relative aspect-square rounded-lg overflow-hidden border border-border">
                  <img src={newItem.images![i]} className="w-full h-full object-cover" />
                  <button onClick={() => setNewItem(prev => ({ ...prev, images: prev.images?.filter((_, idx) => idx !== i) }))} className="absolute top-0.5 right-0.5 size-4 bg-black/60 text-white rounded-full flex items-center justify-center"><X size={8} /></button>
                </div>
              ))}
              <div onClick={() => openMediaPicker('post')} className="aspect-square rounded-lg bg-muted/30 border-2 border-dashed border-border flex items-center justify-center cursor-pointer hover:bg-accent/5 transition-colors">
                <PlusCircle className="size-5 text-muted-foreground" />
              </div>
            </div>

            {(activeAccount.type === 'bisnis' || activeAccount.type === 'professional') && (
              <div className="space-y-1.5 p-2.5 bg-muted/20 rounded-xl">
                 <Label className="font-black text-[8px] uppercase tracking-widest text-muted-foreground">Kategori Postingan *</Label>
                 <Select 
                   value={isNewCategory ? "new" : (newItem.categoryName || '')} 
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
                   <SelectTrigger className="rounded-lg h-8 bg-card border-none shadow-sm font-bold text-[10px]">
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
                     value={newItem.categoryName || ''} 
                     onChange={(e) => setNewItem({...newItem, categoryName: e.target.value})} 
                     className="rounded-lg h-8 bg-white border-black/10 focus:border-black transition-all font-bold px-2 text-[10px]"
                   />
                 )}
              </div>
            )}

            <div className="space-y-1"><Label className="font-bold text-[9px] uppercase text-muted-foreground">Judul Item</Label><Input value={newItem.title || ''} onChange={(e) => setNewItem({ ...newItem, title: e.target.value })} className="rounded-lg h-9 bg-muted/20 border-none px-3 text-[12px] font-bold" /></div>
            <div className="space-y-1"><Label className="font-bold text-[9px] uppercase text-muted-foreground">Deskripsi</Label><Textarea value={newItem.description || ''} onChange={(e) => setNewItem({ ...newItem, description: e.target.value })} className="rounded-lg bg-muted/20 border-none min-h-[60px] px-3 text-[12px] font-medium" /></div>
            <div className="space-y-1">
              <Label className="font-bold text-[9px] uppercase text-muted-foreground">Link Alamat/Web</Label>
              <div className="relative">
                <div className="absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground">{newItem.locationLink ? getSmartIcon(newItem.locationLink) : <LinkIcon className="size-3" />}</div>
                <Input value={newItem.locationLink || ''} onChange={(e) => setNewItem({ ...newItem, locationLink: e.target.value })} placeholder="https://maps.google.com/..." className="rounded-lg h-9 bg-muted/20 border-none pl-8 text-[12px] font-medium shadow-inner" />
              </div>
            </div>
          </div>
          <DialogFooter className="mt-3"><Button onClick={handleAddContent} disabled={!newItem.images?.length || ((activeAccount.type !== 'personal') && !newItem.categoryName)} className="w-full h-10 rounded-lg bg-accent font-bold text-white text-[12px] uppercase shadow-lg active:scale-95 transition-all">Posting</Button></DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isMediaPickerOpen} onOpenChange={setIsMediaPickerOpen}>
        <DialogContent className="w-[85%] md:max-w-xs rounded-xl p-4 border-none shadow-2xl bg-card text-foreground outline-none [&>button]:hidden">
          <DialogHeader className="text-center"><DialogTitle className="text-[12px] font-black uppercase tracking-tight">Pilih Media</DialogTitle></DialogHeader>
          <div className="grid gap-2 py-3">
            <Button variant="outline" disabled={isCloudLoading} onClick={() => fileInputRef.current?.click()} className="h-10 rounded-lg border-border bg-muted/50 hover:bg-black/5 justify-start gap-3 px-4 shadow-inner"><Smartphone className="size-4 text-black" /><p className="font-black text-[9px] uppercase tracking-widest">Galeri HP</p></Button>
            <Button variant="outline" disabled={isCloudLoading} onClick={() => handleCloudSource('drive')} className="h-10 rounded-lg border-border bg-muted/50 hover:bg-black/5 justify-start gap-3 px-4 shadow-inner"><Cloud className="size-4 text-black" /><p className="font-black text-[9px] uppercase tracking-widest">Layanan Cloud</p></Button>
          </div>
          <DialogFooter><Button variant="ghost" onClick={() => setIsMediaPickerOpen(false)} className="w-full font-black text-[9px] uppercase text-muted-foreground hover:bg-transparent">Batal</Button></DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!zoomedImage} onOpenChange={(open) => !open && setZoomedImage(null)}>
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
