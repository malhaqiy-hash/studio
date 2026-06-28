
'use client';

import * as React from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
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
  Pin,
  MoreVertical,
  Plus,
  UserPlus,
  Radar,
  ChevronLeft
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
import Link from 'next/link';
import ConnectionIcon from '@/assets/icons/connection.svg';

const ConnectIcon = ({ className }: { className?: string }) => (
  <div 
    className={cn("bg-current", className)}
    style={{
      maskImage: `url(${ConnectionIcon.src})`,
      WebkitMaskImage: `url(${ConnectionIcon.src})`,
      maskSize: 'contain',
      maskRepeat: 'no-repeat',
      maskPosition: 'center',
      display: 'inline-block'
    }}
  />
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

const MOCK_EXTERNAL_ACCOUNTS: Record<string, Partial<Account>> = {
  'conn1': { id: 'conn1', name: 'Andi Wijaya', type: 'professional', avatar: 'https://picsum.photos/seed/f1/100', bio: 'Expert Software Architect specializing in Cloud Infrastructure.', extra: 'Architect at TechCorp', links: ['https://linkedin.com'], verificationStatus: 'Verified' },
  'conn2': { id: 'conn2', name: 'Budi Santoso', type: 'bisnis', avatar: 'https://picsum.photos/seed/f2/100', bio: 'Penyedia solusi logistik regional terpercaya sejak 1998.', extra: 'CEO FastTrack Logistics', links: ['https://google.com/maps'], verificationStatus: 'Verified' },
  'conn3': { id: 'conn3', name: 'Siti Aminah', type: 'personal', avatar: 'https://picsum.photos/seed/f3/100', bio: 'Coffee lover & Business enthusiast.', extra: 'Entitas Kreatif', links: ['https://instagram.com'] },
  'conn4': { id: 'conn4', name: 'Rina Kartika', type: 'bisnis', avatar: 'https://picsum.photos/seed/f4/100', bio: 'Distributor resmi bahan pangan organik.', extra: 'Global Food Solutions', links: ['https://facebook.com'], verificationStatus: 'Verified' },
};

const MOCK_STATS_DATA = {
  followers: [
    { id: 'conn1', name: 'Andi Wijaya', avatar: 'https://picsum.photos/seed/f1/100', extra: 'Software Architect' },
    { id: 'conn3', name: 'Siti Aminah', avatar: 'https://picsum.photos/seed/f3/100', extra: 'Creative Entity' },
  ],
  following: [
    { id: 'conn2', name: 'Budi Santoso', avatar: 'https://picsum.photos/seed/f2/100', extra: 'Logistics CEO' },
    { id: 'conn4', name: 'Rina Kartika', avatar: 'https://picsum.photos/seed/f4/100', extra: 'Food Distributor' },
  ],
  likes: [
    { id: 'conn1', name: 'Andi Wijaya', avatar: 'https://picsum.photos/seed/f1/100', extra: 'Software Architect' },
    { id: 'conn4', name: 'Rina Kartika', avatar: 'https://picsum.photos/seed/f4/100', extra: 'Food Distributor' },
  ]
};

export default function ProfilePage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const externalId = searchParams.get('id');
  const { activeAccount, updateActiveAccount, addPost, removePost, availableAccounts } = useAccount();
  const { toast } = useToast();

  // Modal States
  const [isBioModalOpen, setIsBioModalOpen] = React.useState(false);
  const [isContentModalOpen, setIsContentModalOpen] = React.useState(false);
  const [isMediaPickerOpen, setIsMediaPickerOpen] = React.useState(false);
  const [isShareSheetOpen, setIsShareSheetOpen] = React.useState(false);
  const [isConnectionsModalOpen, setIsConnectionsModalOpen] = React.useState(false);
  const [isStatsModalOpen, setIsStatsModalOpen] = React.useState(false);

  const [shareUrl, setShareUrl] = React.useState("");
  const [statsTab, setStatsTab] = React.useState<'followers' | 'following' | 'likes'>('followers');
  const [mediaTarget, setMediaTarget] = React.useState<'avatar' | 'cover' | 'post'>('avatar');
  const [tempAccount, setTempAccount] = React.useState<Partial<Account>>({});
  const [tempLinks, setTempLinks] = React.useState<string[]>([]);
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

  const viewingAccount = React.useMemo(() => {
    if (!externalId) return activeAccount;
    const myOtherAcc = availableAccounts.find(a => a.id === externalId);
    if (myOtherAcc) return myOtherAcc;
    const external = MOCK_EXTERNAL_ACCOUNTS[externalId];
    if (external) return external as Account;
    return activeAccount;
  }, [externalId, activeAccount, availableAccounts]);

  const isOwnProfile = viewingAccount.id === activeAccount.id || availableAccounts.some(a => a.id === viewingAccount.id);

  // Stepped Navigation Sync (History handling)
  React.useEffect(() => {
    const handlePopState = (event: PopStateEvent) => {
      // Close in reverse order of expected stack
      if (isMediaPickerOpen) { setIsMediaPickerOpen(false); return; }
      if (isStatsModalOpen) { setIsStatsModalOpen(false); return; }
      if (isConnectionsModalOpen) { setIsConnectionsModalOpen(false); return; }
      if (isBioModalOpen) { setIsBioModalOpen(false); return; }
      if (isContentModalOpen) { setIsContentModalOpen(false); return; }
      if (isShareSheetOpen) { setIsShareSheetOpen(false); return; }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [isBioModalOpen, isContentModalOpen, isMediaPickerOpen, isShareSheetOpen, isConnectionsModalOpen, isStatsModalOpen]);

  // Utility to push state and open
  const pushAndSet = (setter: (val: boolean) => void, val: boolean, key: string) => {
    if (val) window.history.pushState({ modal: key }, '');
    setter(val);
  };

  // Utility to close modal and handle history back
  const closeWithHistory = (setter: (val: boolean) => void, key: string) => {
    if (window.history.state?.modal === key) {
      window.history.back();
    } else {
      setter(false);
    }
  };

  const checkStatsPermission = (type: 'followers' | 'following' | 'likes' | 'subscribe') => {
    if (isOwnProfile) return true;
    const prefKey = type === 'followers' ? 'whoCanSeeFollowers' : 
                   type === 'following' ? 'whoCanSeeFollowing' : 
                   type === 'likes' ? 'whoCanSeeLikes' : 'whoCanSeeSubscribe';
    const visibility = viewingAccount.preferences?.[prefKey as keyof typeof viewingAccount.preferences] || 'public';
    return visibility === 'public';
  };

  const handleStatClick = (tab: 'followers' | 'following' | 'likes') => {
    const permType = tab === 'followers' && viewingAccount.type !== 'personal' ? 'subscribe' : tab;
    if (!checkStatsPermission(permType as any)) {
      toast({ variant: "destructive", title: "Akses Dibatasi", description: "Akun ini membatasi siapa yang dapat melihat daftar ini." });
      return;
    }
    setStatsTab(tab);
    pushAndSet(setIsStatsModalOpen, true, 'stats');
  };

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
  }, []);

  React.useEffect(() => {
    resetContentForm();
    if (searchParams.get('edit') === 'true' && isOwnProfile) {
      setTempAccount({ name: activeAccount.name, bio: activeAccount.bio });
      setTempLinks(activeAccount.links || []);
      pushAndSet(setIsBioModalOpen, true, 'edit');
    }
  }, [activeAccount.id, resetContentForm, activeAccount.name, activeAccount.bio, activeAccount.links, isOwnProfile, searchParams]);

  const profileVisibleItems = React.useMemo(() => {
    const items = (viewingAccount.items || []).filter(i => 
      !i.isArchived && (i.displayLocation === 'profile' || i.displayLocation === 'both')
    );
    return [...items].sort((a, b) => (a.isPinned === b.isPinned ? 0 : a.isPinned ? -1 : 1));
  }, [viewingAccount.items]);

  const groupedItems = React.useMemo(() => {
    if (viewingAccount.type === 'personal') return { 'Inspirasi': profileVisibleItems };
    const groups: Record<string, ContentItem[]> = {};
    profileVisibleItems.forEach(item => {
      const cat = item.categoryName || 'Lainnya';
      if (!groups[cat]) groups[cat] = [];
      groups[cat].push(item);
    });
    return groups;
  }, [profileVisibleItems, viewingAccount.type]);

  const handleSaveBio = () => {
    if (!isOwnProfile) return;
    updateActiveAccount({ ...tempAccount, links: tempLinks.filter(l => l.trim() !== '') });
    closeWithHistory(setIsBioModalOpen, 'edit');
    toast({ title: 'Profil diperbarui' });
  };

  const handleAddTempLink = () => setTempLinks([...tempLinks, '']);
  const handleUpdateTempLink = (idx: number, val: string) => {
    const newLinks = [...tempLinks];
    newLinks[idx] = val;
    setTempLinks(newLinks);
  };
  const handleRemoveTempLink = (idx: number) => setTempLinks(tempLinks.filter((_, i) => i !== idx));

  const openMediaPicker = (target: 'avatar' | 'cover' | 'post') => {
    if (!isOwnProfile) return;
    setMediaTarget(target);
    pushAndSet(setIsMediaPickerOpen, true, 'media');
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      if (mediaTarget === 'post') {
        Array.from(files).forEach(file => {
          const reader = new FileReader();
          reader.onloadend = () => setNewItem(prev => ({ ...prev, images: [...(prev.images || []), reader.result as string] }));
          reader.readAsDataURL(file);
        });
      } else {
        const reader = new FileReader();
        reader.onloadend = () => {
          const res = reader.result as string;
          if (mediaTarget === 'avatar') updateActiveAccount({ avatar: res });
          if (mediaTarget === 'cover') updateActiveAccount({ cover: res });
        };
        reader.readAsDataURL(files[0]);
      }
      closeWithHistory(setIsMediaPickerOpen, 'media');
    }
  };

  const handleCloudSource = () => {
    setIsCloudLoading(true);
    setTimeout(() => {
      const simUrl = mediaTarget === 'cover' ? `https://picsum.photos/seed/c${Date.now()}/1640/624` : `https://picsum.photos/seed/i${Date.now()}/500/500`;
      if (mediaTarget === 'avatar') updateActiveAccount({ avatar: simUrl });
      else if (mediaTarget === 'cover') updateActiveAccount({ cover: simUrl });
      else if (mediaTarget === 'post') setNewItem(prev => ({ ...prev, images: [...(prev.images || []), simUrl] }));
      setIsCloudLoading(false);
      closeWithHistory(setIsMediaPickerOpen, 'media');
    }, 1500);
  };

  const handleAddContent = () => {
    if (!isOwnProfile) return;
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
    closeWithHistory(setIsContentModalOpen, 'content');
    resetContentForm();
    toast({ title: 'Konten dipublikasikan' });
  };

  const handleShareProfile = () => {
    setShareUrl(`https://koolink.network/profile/${viewingAccount.id}`);
    pushAndSet(setIsShareSheetOpen, true, 'share');
  };

  const handleFollow = () => toast({ title: `Mengikuti ${viewingAccount.name}` });

  return (
    <DashboardLayout>
      <div className="max-w-xl mx-auto space-y-3 md:space-y-4 pb-20">
        <input type="file" multiple ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />

        {!isOwnProfile && (
           <div className="px-3">
              <button onClick={() => router.back()} className="pl-0 h-6 text-[10px] text-slate-400 hover:text-primary font-black uppercase tracking-widest gap-1.5 active:scale-95 transition-all flex items-center">
                <ChevronLeft className="size-3" /> Kembali
              </button>
           </div>
        )}

        <section className="relative group">
          <div className="aspect-[1640/624] w-full bg-muted border-b border-border relative overflow-hidden rounded-xl">
            <img src={viewingAccount.cover || `https://picsum.photos/seed/${viewingAccount.id}_c/1640/624`} alt="Cover" className="w-full h-full object-cover opacity-90" />
            <div className="absolute top-3 right-3 flex gap-1.5">
              {isOwnProfile && (
                <Button onClick={() => openMediaPicker('cover')} variant="outline" size="icon" className="size-7 bg-background/80 backdrop-blur text-accent border-none rounded-lg shadow-lg active:scale-90 transition-transform">
                  <Camera className="size-3.5" />
                </Button>
              )}
              <Button onClick={handleShareProfile} variant="outline" size="icon" className="size-7 bg-background/80 backdrop-blur text-accent border-none rounded-lg shadow-lg active:scale-90 transition-transform">
                <Share2 className="size-3.5" />
              </Button>
            </div>
          </div>

          <div className="px-3 md:px-5 -mt-8 md:-mt-10 flex flex-col items-start gap-2">
            <div className="relative group/avatar">
              <Avatar className="size-16 md:size-24 border-[3px] border-background dark:border-card shadow-lg rounded-2xl">
                <AvatarImage src={viewingAccount.avatar} className="object-cover" />
                <AvatarFallback className="bg-accent/10 text-accent font-bold text-base">{viewingAccount.name[0]}</AvatarFallback>
              </Avatar>
              {isOwnProfile && (
                <button onClick={() => openMediaPicker('avatar')} className="absolute bottom-0 right-0 size-6 bg-accent text-white rounded-lg flex items-center justify-center border-2 border-background shadow-lg hover:scale-105 active:scale-95 transition-all"><Pencil className="size-3" /></button>
              )}
            </div>
            <div className="space-y-0 w-full">
              <div className="flex items-center gap-2">
                <h1 className="text-base md:text-lg font-bold text-slate-900 tracking-tight">{viewingAccount.name}</h1>
                {viewingAccount.verificationStatus === 'Verified' && <ShieldCheck className="size-3 text-emerald-500" />}
                <span className="font-medium text-[9px] text-primary/60 lowercase italic select-none ml-1 leading-none">{viewingAccount.type}</span>
                {!isOwnProfile && (
                   <Button onClick={handleFollow} size="sm" className="ml-auto h-7 px-3 rounded-lg bg-primary text-white font-black text-[8px] uppercase tracking-widest active:scale-95 transition-all shadow-lg shadow-primary/20">
                      {viewingAccount.type === 'bisnis' ? <><Radar className="size-2.5 mr-1" /> Radar</> : <><UserPlus className="size-2.5 mr-1" /> Tambahkan</>}
                   </Button>
                )}
              </div>
              <div className="flex flex-col gap-0.5">
                <div className="flex flex-wrap items-center gap-3 text-muted-foreground font-medium text-[11px] md:text-[13px]">
                  <span>{viewingAccount.extra || 'Koolink Member'}</span>
                  <div className="flex items-center gap-4 ml-auto">
                     <button onClick={() => handleStatClick('followers')} className="flex flex-col items-center hover:opacity-70 transition-opacity">
                        <span className="text-xs font-bold text-slate-900">1.2k</span>
                        <span className="text-[7px] font-black uppercase opacity-60 flex items-center gap-1">
                          {viewingAccount.type === 'personal' ? <><Users className="size-2" /> Pengikut</> : viewingAccount.type === 'professional' ? <><UserPlus className="size-2" /> Tambahkan</> : <><Radar className="size-2" /> Radar</>}
                        </span>
                     </button>
                     <button onClick={() => handleStatClick('following')} className="flex flex-col items-center hover:opacity-70 transition-opacity">
                        <span className="text-xs font-bold text-slate-900">840</span>
                        <span className="text-[7px] font-black uppercase opacity-60 flex items-center gap-1">Mengikuti</span>
                     </button>
                     <button onClick={() => handleStatClick('likes')} className="flex flex-col items-center text-rose-500 hover:opacity-70 transition-opacity">
                        <span className="text-xs font-bold">4.2k</span>
                        <span className="text-[7px] font-black uppercase flex items-center gap-1"><Heart className="size-2 fill-rose-500" /> Suka</span>
                     </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="px-3 md:px-5">
          <div className="flex flex-col gap-3 border-b border-border/40 pb-4">
            <div className="flex items-start justify-between">
              <div className="text-slate-700 leading-relaxed font-normal text-[12px] md:text-[13px] whitespace-pre-wrap flex-1">
                {viewingAccount.bio ? viewingAccount.bio : 'Membangun koneksi cerdas di Koolink.'}
              </div>
              {isOwnProfile && (
                <Button variant="ghost" size="sm" onClick={() => { setTempAccount({ name: activeAccount.name, bio: activeAccount.bio }); setTempLinks(activeAccount.links || []); pushAndSet(setIsBioModalOpen, true, 'edit'); }} className="text-[9px] font-bold uppercase text-accent hover:bg-accent/10 px-2 h-6 rounded-lg border border-accent/20 shrink-0 ml-3">
                  <Pencil className="size-2 mr-1" /> Edit
                </Button>
              )}
            </div>
            {viewingAccount.links && viewingAccount.links.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-1">
                {viewingAccount.links.map((link, idx) => (
                  <a key={idx} href={link} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-accent font-bold text-[9px] uppercase tracking-widest hover:underline bg-accent/5 px-2 py-1 rounded-md border border-accent/10 transition-all hover:bg-accent/10">
                    {getSmartIcon(link)} {link.replace(/^https?:\/\/(www\.)?/, '').split('/')[0]}
                  </a>
                ))}
              </div>
            )}
          </div>
        </section>

        {isOwnProfile && (
           <section className="px-3 md:px-5">
              <button onClick={() => pushAndSet(setIsConnectionsModalOpen, true, 'connections')} className="w-full flex items-center gap-4 p-3 rounded-2xl border-2 border-dashed border-slate-200 hover:border-primary hover:bg-primary/[0.02] transition-all group overflow-hidden">
                 <div className="size-10 rounded-full bg-primary flex items-center justify-center text-white shrink-0 shadow-lg shadow-primary/20 group-hover:scale-110 transition-transform">
                    <ConnectIcon className="size-6" />
                 </div>
                 <div className="flex-1 flex items-center gap-2 overflow-hidden">
                   <div className="flex -space-x-2.5 overflow-hidden">
                     {[...Array(4)].map((_, i) => (
                       <Avatar key={i} className="size-8 border-2 border-background shadow-sm">
                         <AvatarImage src={`https://picsum.photos/seed/p${i}/100`} />
                         <AvatarFallback className="text-[8px] bg-muted">U</AvatarFallback>
                       </Avatar>
                     ))}
                   </div>
                   <div className="hidden sm:block text-left ml-2">
                      <p className="text-10px font-black text-slate-800 uppercase tracking-tight">Koneksi Jaringan</p>
                      <p className="text-[9px] font-medium text-slate-400 uppercase tracking-widest">Koneksi Aktif</p>
                   </div>
                 </div>
                 <MoreVertical className="size-4 text-slate-300 group-hover:text-primary transition-colors" />
              </button>
           </section>
        )}

        <section className="px-3 md:px-5 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground">Portofolio & Produk</h3>
            {isOwnProfile && (
              <Button size="sm" onClick={() => pushAndSet(setIsContentModalOpen, true, 'content')} className="rounded-lg h-7 bg-accent hover:bg-accent/90 gap-1 font-bold text-[10px] uppercase tracking-widest px-2.5 shadow-lg text-white"><PlusCircle className="size-3" /> Item</Button>
            )}
          </div>

          <div className="flex flex-col space-y-6">
            {Object.entries(groupedItems).map(([category, items]) => (
              <div key={category} className="space-y-2.5">
                <div className="flex items-center justify-between px-1">
                   <h4 className="text-sm font-black text-slate-900 tracking-tight uppercase border-l-3 border-black pl-2">{category}</h4>
                   <Badge variant="secondary" className="text-[8px] font-black">{items.length} Item</Badge>
                </div>
                <div className={cn(viewingAccount.type === 'personal' ? "grid grid-cols-2 gap-2.5" : "flex overflow-x-auto no-scrollbar space-x-2.5 px-1 pb-2.5 snap-x")}>
                  {items.length > 0 ? items.map((item) => (
                    <div key={item.id} className={cn(viewingAccount.type === 'personal' ? "" : "w-28 md:w-32 flex-shrink-0 snap-start")}>
                      <Card className="rounded-xl border-none shadow-md overflow-hidden bg-card hover:shadow-xl transition-all relative group">
                        {item.images && item.images.length > 0 && (
                          <div className="aspect-square w-full overflow-hidden relative cursor-zoom-in" onClick={() => setZoomedImage(item.images![0])}>
                            <img src={item.images[0]} className="w-full h-full object-cover" alt={item.title} />
                            {item.images.length > 1 && <div className="absolute bottom-1 right-1 bg-black/60 text-white px-1 py-0.5 rounded-md text-[6px] font-black uppercase">{item.images.length} Foto</div>}
                            {item.isPinned && <div className="absolute top-1 right-1 bg-accent text-white p-0.5 rounded-full shadow-lg"><Pin className="size-2 fill-white" /></div>}
                          </div>
                        )}
                        {isOwnProfile && (
                           <div className="absolute top-1 left-1 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-all">
                             <button onClick={(e) => { e.stopPropagation(); toast({ title: 'Tautan disalin' }); }} className="size-5 bg-black/60 text-white rounded-lg flex items-center justify-center shadow-lg"><Share2 className="size-2.5" /></button>
                             <button onClick={(e) => { e.stopPropagation(); removePost(item.id); }} className="size-5 bg-rose-500 text-white rounded-lg flex items-center justify-center shadow-lg"><Trash2 className="size-2.5" /></button>
                           </div>
                        )}
                        <CardContent className="p-1.5 space-y-0">
                          <h5 className="font-black text-slate-900 text-[11px] truncate leading-none">{item.title}</h5>
                          <p className="text-slate-400 text-[9px] font-medium line-clamp-2 leading-tight h-5 mt-0.5">{item.description}</p>
                        </CardContent>
                      </Card>
                    </div>
                  )) : (
                     <div className="col-span-2 py-10 text-center opacity-40">
                        <p className="text-[10px] font-black uppercase tracking-widest">Belum ada konten publik.</p>
                     </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      <Dialog open={isStatsModalOpen} onOpenChange={(o) => { if(!o) closeWithHistory(setIsStatsModalOpen, 'stats'); }}>
        <DialogContent className="w-[95%] md:max-w-md rounded-[2rem] p-0 border-none shadow-2xl overflow-hidden bg-card text-foreground outline-none z-[170] [&>button]:hidden">
          <div className="p-6 space-y-6">
            <div className="flex items-center justify-between">
              <DialogTitle className="text-lg font-black uppercase tracking-tight">{statsTab === 'followers' ? 'Pengikut' : statsTab === 'following' ? 'Mengikuti' : 'Penyuka'}</DialogTitle>
              <button onClick={() => closeWithHistory(setIsStatsModalOpen, 'stats')} className="p-2 rounded-xl bg-slate-50 text-slate-400 hover:text-slate-900 active:scale-90 transition-all"><X className="size-4" /></button>
            </div>
            <div className="space-y-2 max-h-[400px] overflow-y-auto no-scrollbar">
              {(MOCK_STATS_DATA[statsTab as keyof typeof MOCK_STATS_DATA] || []).map((acc) => (
                <button 
                  key={acc.id} 
                  onClick={() => { 
                    setIsStatsModalOpen(false); 
                    router.push(`/profile?id=${acc.id}`);
                  }} 
                  className="w-full flex items-center gap-3 p-3 rounded-2xl hover:bg-primary/[0.03] hover:border-primary/20 transition-all text-left border border-transparent active:scale-[0.98] group"
                >
                  <Avatar className="size-10 rounded-xl border border-border shadow-sm group-hover:scale-105 transition-transform">
                    <AvatarImage src={acc.avatar} className="object-cover" />
                    <AvatarFallback className="bg-primary/5 text-primary text-[10px] font-bold">{acc.name[0]}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-black text-slate-900 truncate uppercase tracking-tight">{acc.name}</p>
                    <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest truncate">{acc.extra}</p>
                  </div>
                  <ChevronLeft className="size-3 text-slate-300 rotate-180 group-hover:text-primary transition-colors" />
                </button>
              ))}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={isConnectionsModalOpen} onOpenChange={(o) => { if(!o) closeWithHistory(setIsConnectionsModalOpen, 'connections'); }}>
        <DialogContent className="w-[95%] md:max-w-md rounded-[2rem] p-0 border-none shadow-2xl overflow-hidden bg-card text-foreground outline-none z-[170] [&>button]:hidden">
          <div className="p-6 space-y-6">
            <div className="flex items-center justify-between">
               <div className="flex items-center gap-3">
                  <div className="size-9 rounded-xl bg-primary/10 flex items-center justify-center text-primary shadow-inner"><ConnectIcon className="size-5" /></div>
                  <DialogTitle className="text-lg font-black uppercase tracking-tight">Koneksi Jaringan</DialogTitle>
               </div>
               <button onClick={() => closeWithHistory(setIsConnectionsModalOpen, 'connections')} className="p-2 rounded-xl bg-slate-50 text-slate-400 hover:text-slate-900 active:scale-90 transition-all"><X className="size-4" /></button>
            </div>
            <div className="space-y-2 max-h-[400px] overflow-y-auto no-scrollbar">
               {Object.values(MOCK_EXTERNAL_ACCOUNTS).map((conn) => (
                 <button 
                   key={conn.id} 
                   onClick={() => { 
                     setIsConnectionsModalOpen(false); 
                     router.push(`/profile?id=${conn.id}`); 
                   }} 
                   className="w-full flex items-center gap-3 p-3 rounded-2xl hover:bg-primary/[0.03] hover:border-primary/20 transition-all text-left border border-transparent active:scale-[0.98] group"
                 >
                   <Avatar className="size-10 rounded-xl border border-border shadow-sm group-hover:scale-105 transition-transform">
                     <AvatarImage src={conn.avatar} className="object-cover" />
                     <AvatarFallback className="bg-primary/5 text-primary text-[10px] font-bold">{conn.name![0]}</AvatarFallback>
                   </Avatar>
                   <div className="flex-1 min-w-0">
                     <div className="flex items-center gap-1.5">
                       <p className="text-[13px] font-black text-slate-900 truncate uppercase tracking-tight">{conn.name}</p>
                       {conn.verificationStatus === 'Verified' && <ShieldCheck className="size-3 text-emerald-500" />}
                     </div>
                     <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest truncate">{conn.extra}</p>
                   </div>
                   <ChevronLeft className="size-3 text-slate-300 rotate-180 group-hover:text-primary transition-colors" />
                 </button>
               ))}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={isBioModalOpen} onOpenChange={(o) => { if(!o) closeWithHistory(setIsBioModalOpen, 'edit'); }}>
        <DialogContent className="w-[95%] md:max-w-md rounded-2xl p-0 border-none shadow-2xl bg-card text-foreground outline-none z-[170] [&>button]:hidden overflow-hidden flex flex-col max-h-[90vh]">
          <DialogHeader className="p-6 pb-2"><DialogTitle className="text-base font-black uppercase tracking-tight text-slate-900">Ubah Profil</DialogTitle></DialogHeader>
          <div className="flex-1 overflow-y-auto no-scrollbar p-6 pt-2 space-y-5">
            <div className="space-y-1.5"><Label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground ml-1">Nama Tampilan</Label><Input value={tempAccount.name || ''} onChange={(e) => setTempAccount({ ...tempAccount, name: e.target.value })} className="rounded-xl h-10 bg-muted/20 border-none px-4 text-[13px] font-bold shadow-inner" /></div>
            <div className="space-y-1.5"><Label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground ml-1">Bio</Label><Textarea value={tempAccount.bio || ''} onChange={(e) => setTempAccount({ ...tempAccount, bio: e.target.value })} className="rounded-xl bg-muted/20 border-none min-h-[120px] px-4 py-3 text-[13px] font-medium shadow-inner resize-none" /></div>
            <div className="space-y-3">
              <div className="flex items-center justify-between px-1"><Label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">Tautan Jaringan</Label><button onClick={handleAddTempLink} className="flex items-center gap-1 text-accent text-[9px] font-black uppercase"><Plus className="size-3" /> Tambah Link</button></div>
              <div className="space-y-2">{tempLinks.map((link, idx) => (<div key={idx} className="flex gap-2"><Input value={link} onChange={(e) => handleUpdateTempLink(idx, e.target.value)} placeholder="https://..." className="rounded-xl h-10 bg-muted/20 border-none px-4 text-[12px]" /><button onClick={() => handleRemoveTempLink(idx)} className="size-10 rounded-xl bg-rose-50 text-rose-500 flex items-center justify-center"><Trash2 className="size-4" /></button></div>))}</div>
            </div>
          </div>
          <DialogFooter className="p-6 pt-2 bg-slate-50/50"><Button onClick={handleSaveBio} className="w-full h-12 rounded-xl bg-accent font-black text-white text-[11px] uppercase tracking-widest shadow-xl active:scale-95 transition-all">Simpan Perubahan</Button></DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isContentModalOpen} onOpenChange={(o) => { if(!o) closeWithHistory(setIsContentModalOpen, 'content'); }}>
        <DialogContent className="w-[95%] md:max-w-lg rounded-xl p-4 bg-card text-foreground outline-none z-[170] [&>button]:hidden">
          <DialogHeader className="flex flex-row items-center justify-between"><DialogTitle className="text-sm font-bold text-slate-900">Tambah Konten</DialogTitle></DialogHeader>
          <div className="space-y-3 pt-2 overflow-y-auto max-h-[60vh] no-scrollbar">
             <div className="grid grid-cols-4 gap-1.5">
              {(newItem.images || []).map((src, i) => (<div key={i} className="relative aspect-square rounded-lg overflow-hidden border border-border"><img src={src} className="w-full h-full object-cover" /><button onClick={() => setNewItem(prev => ({ ...prev, images: prev.images?.filter((_, idx) => idx !== i) }))} className="absolute top-0.5 right-0.5 size-4 bg-black/60 text-white rounded-full flex items-center justify-center"><X size={8} /></button></div>))}
              <div onClick={() => openMediaPicker('post')} className="aspect-square rounded-lg bg-muted/30 border-2 border-dashed border-border flex items-center justify-center cursor-pointer"><PlusCircle className="size-5 text-muted-foreground" /></div>
            </div>
            <Input placeholder="Judul" value={newItem.title || ''} onChange={(e) => setNewItem({ ...newItem, title: e.target.value })} className="rounded-lg h-9 bg-muted/20 border-none px-3 text-[12px] font-bold" />
            <Textarea placeholder="Deskripsi" value={newItem.description || ''} onChange={(e) => setNewItem({ ...newItem, description: e.target.value })} className="rounded-lg bg-muted/20 border-none min-h-[60px] px-3 text-[12px]" />
          </div>
          <DialogFooter className="mt-3"><Button onClick={handleAddContent} disabled={!newItem.images?.length} className="w-full h-10 rounded-lg bg-accent font-bold text-white text-[12px] uppercase active:scale-95 transition-all">Posting</Button></DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isMediaPickerOpen} onOpenChange={(o) => { if(!o) closeWithHistory(setIsMediaPickerOpen, 'media'); }}>
        <DialogContent className="w-[85%] md:max-w-xs rounded-xl p-4 border-none shadow-2xl bg-card text-foreground outline-none z-[170] [&>button]:hidden">
          <DialogHeader className="text-center"><DialogTitle className="text-[12px] font-black uppercase tracking-tight">Pilih Media</DialogTitle></DialogHeader>
          <div className="grid gap-2 py-3">
            <Button variant="outline" disabled={isCloudLoading} onClick={() => fileInputRef.current?.click()} className="h-10 rounded-lg border-border bg-muted/50 hover:bg-black/5 justify-start gap-3 px-4"><Smartphone className="size-4 text-black" /><p className="font-black text-[9px] uppercase tracking-widest">Galeri HP</p></Button>
            <Button variant="outline" disabled={isCloudLoading} onClick={handleCloudSource} className="h-10 rounded-lg border-border bg-muted/50 hover:bg-black/5 justify-start gap-3 px-4"><Cloud className="size-4 text-black" /><p className="font-black text-[9px] uppercase tracking-widest">Layanan Cloud</p></Button>
          </div>
          <DialogFooter><Button variant="ghost" onClick={() => closeWithHistory(setIsMediaPickerOpen, 'media')} className="w-full font-black text-[9px] uppercase text-muted-foreground hover:bg-transparent">Batal</Button></DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!zoomedImage} onOpenChange={(o) => setZoomedImage(null)}>
        <DialogContent className="max-w-[100vw] w-screen h-screen p-0 m-0 bg-black/98 border-none shadow-none flex items-center justify-center overflow-hidden outline-none z-[170] [&>button]:hidden cursor-pointer" onClick={() => setZoomedImage(null)}>
          {zoomedImage && <div className="w-full h-full max-h-[90vh] flex items-center justify-center p-4"><img src={zoomedImage} alt="Zoomed View" className="max-w-full max-h-full object-contain rounded-xl animate-in zoom-in-95 duration-300 shadow-none border-none" /></div>}
        </DialogContent>
      </Dialog>

      <ShareSheet isOpen={isShareSheetOpen} onOpenChange={(o) => { if(!o) closeWithHistory(setIsShareSheetOpen, 'share'); }} postUrl={shareUrl} />
    </DashboardLayout>
  );
}
