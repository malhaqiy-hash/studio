"use client";

import * as React from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  TrendingUp, 
  Globe, 
  MapPin, 
  Brain,
  Heart, 
  MessageCircle, 
  Share2, 
  Clock, 
  ShieldCheck, 
  RefreshCw,
  ArrowUpRight,
  Bookmark,
  Image as ImageIcon,
  Camera,
  Link2,
  X,
  Plus,
  Lock,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/context/language-context";
import { translateText } from "@/ai/flows/translate-flow";
import { cn } from "@/lib/utils";
import useEmblaCarousel from 'embla-carousel-react';
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useRouter } from "next/navigation";
import { useAccount } from "@/context/account-context";
import Link from "next/link";

const CATEGORIES = [
  { id: 'for-you', label: 'For You', icon: Brain },
  { id: 'lokal', label: 'Lokal', icon: MapPin },
  { id: 'global', label: 'Global', icon: Globe },
  { id: 'trending', label: 'Trending', icon: TrendingUp },
];

const INITIAL_POSTS = [
  {
    id: "p1",
    type: "insight",
    author: "OnTapp Intelligence",
    extra: "Enterprise AI Analyst",
    avatar: "https://picsum.photos/seed/ontapp/200",
    category: "Market Trend",
    content: "Permintaan pasar untuk solusi AI infrastruktur di sektor manufaktur meningkat 40% di wilayah Asia Tenggara. Ini adalah waktu yang tepat untuk memperbarui katalog produk Anda. Pertumbuhan ini didorong oleh digitalisasi masif di koridor industri Vietnam dan Indonesia, menciptakan celah bagi penyedia perangkat keras IoT dan solusi analitik berbasis awan.",
    time: "Baru saja",
    stats: { likes: 1200, comments: 84 },
    verified: true,
    tag: "Trending",
    locationLink: "https://maps.google.com/?q=Southeast+Asia",
    visibility: 'public',
    images: ["https://picsum.photos/seed/tech1/800/500", "https://picsum.photos/seed/tech2/800/600"]
  },
  {
    id: "p2",
    type: "post",
    author: "Global Logistics Co.",
    extra: "Logistics & Supply Chain",
    avatar: "https://picsum.photos/seed/log/100",
    category: "Lokal",
    content: "Kami baru saja membuka rute pengiriman baru antara Jakarta dan Surabaya dengan efisiensi waktu 20% lebih cepat. Hubungi kami untuk penawaran khusus member OnTapp hari ini. Kami berkomitmen memberikan layanan terbaik untuk rantai pasok Anda dengan integrasi armada ramah lingkungan dan sistem pelacakan real-time tercanggih.",
    time: "2 jam yang lalu",
    stats: { likes: 452, comments: 12 },
    verified: true,
    images: ["https://picsum.photos/seed/truck/800/400"],
    locationLink: "https://maps.google.com/?q=Jakarta",
    visibility: 'public'
  },
];

function PostMedia({ images }: { images?: string[] }) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: false });
  const [selectedIndex, setSelectedIndex] = React.useState(0);
  const [zoomedImage, setExpandedImage] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (!emblaApi) return;
    emblaApi.on('select', () => setSelectedIndex(emblaApi.selectedScrollSnap()));
  }, [emblaApi]);

  if (!images || images.length === 0) return null;

  return (
    <div className="relative group/carousel">
      <div className="overflow-hidden rounded-[2rem] border border-border bg-muted/10 shadow-sm" ref={emblaRef}>
        <div className="flex">
          {images.map((src, idx) => (
            <div key={idx} className="flex-[0_0_100%] min-w-0">
              <img 
                src={src} 
                className="w-full h-auto object-contain cursor-zoom-in active:scale-[0.99] transition-transform max-h-[700px]" 
                alt={`Content ${idx + 1}`}
                onClick={() => setExpandedImage(src)}
              />
            </div>
          ))}
        </div>
      </div>

      {images.length > 1 && (
        <>
          <button 
            onClick={() => emblaApi?.scrollPrev()} 
            className="absolute left-4 top-1/2 -translate-y-1/2 size-10 rounded-full bg-background/60 backdrop-blur-md text-foreground flex items-center justify-center opacity-0 group-hover/carousel:opacity-100 transition-opacity z-10 shadow-lg"
          >
            <ChevronLeft className="size-6" />
          </button>
          <button 
            onClick={() => emblaApi?.scrollNext()} 
            className="absolute right-4 top-1/2 -translate-y-1/2 size-10 rounded-full bg-background/60 backdrop-blur-md text-foreground flex items-center justify-center opacity-0 group-hover/carousel:opacity-100 transition-opacity z-10 shadow-lg"
          >
            <ChevronRight className="size-6" />
          </button>
          <div className="absolute top-4 right-4 bg-background/60 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-black z-10 shadow-sm">
            {selectedIndex + 1} / {images.length}
          </div>
        </>
      )}

      <Dialog open={!!zoomedImage} onOpenChange={() => setExpandedImage(null)}>
        <DialogContent className="max-w-screen-lg p-0 bg-black/98 border-none shadow-none flex items-center justify-center overflow-hidden outline-none [&>button]:hidden">
          {zoomedImage && (
            <div 
              className="w-full h-full max-h-[90vh] flex items-center justify-center p-4 cursor-pointer"
              onClick={() => setExpandedImage(null)}
            >
              <img 
                src={zoomedImage} 
                alt="Expanded view" 
                onClick={(e) => e.stopPropagation()}
                className="max-w-full max-h-full object-contain rounded-xl animate-in zoom-in-95 duration-300"
              />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default function FeedPage() {
  const { language, t } = useLanguage();
  const { toast } = useToast();
  const router = useRouter();
  const { activeAccount, addPost } = useAccount();
  
  const [activeCategory, setActiveCategory] = React.useState('for-you');
  const [translations, setTranslations] = React.useState<Record<string, { text: string, show: boolean, loading: boolean }>>({});
  const [savedPosts, setSavedPosts] = React.useState<string[]>([]);
  const [expandedPosts, setExpandedPosts] = React.useState<Set<string>>(new Set());
  const [likes, setLikes] = React.useState<Record<string, { count: number, active: boolean }>>({});

  const [isPostModalOpen, setIsPostModalOpen] = React.useState(false);
  const [postContent, setPostContent] = React.useState("");
  const [postImages, setPostImages] = React.useState<string[]>([]);
  const [postLink, setPostLink] = React.useState("");
  const [postVisibility, setPostVisibility] = React.useState<'public' | 'private'>('public');
  const [isLinkInputOpen, setIsLinkInputOpen] = React.useState(false);
  const [goToProfile, setGoToProfile] = React.useState(false);
  
  const [zoomedAvatar, setExpandedAvatar] = React.useState<string | null>(null);

  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const cameraInputRef = React.useRef<HTMLInputElement>(null);
  const [emblaMainRef, emblaMainApi] = useEmblaCarousel({ loop: false, align: 'start' });

  React.useEffect(() => {
    const handleOpen = () => setIsPostModalOpen(true);
    window.addEventListener('open-post-modal', handleOpen);
    return () => window.removeEventListener('open-post-modal', handleOpen);
  }, []);

  const onMainSelect = React.useCallback(() => {
    if (!emblaMainApi) return;
    const index = emblaMainApi.selectedScrollSnap();
    setActiveCategory(CATEGORIES[index].id);
  }, [emblaMainApi]);

  React.useEffect(() => {
    if (!emblaMainApi) return;
    emblaMainApi.on('select', onMainSelect);
  }, [emblaMainApi, onMainSelect]);

  React.useEffect(() => {
    const saved = localStorage.getItem('ontapp_saved_posts');
    if (saved) setSavedPosts(JSON.parse(saved));
    
    const initialLikes: Record<string, { count: number, active: boolean }> = {};
    [...INITIAL_POSTS].forEach(p => {
      initialLikes[p.id] = { count: p.stats.likes, active: false };
    });
    setLikes(initialLikes);
  }, []);

  const scrollTo = (index: number) => {
    if (emblaMainApi) emblaMainApi.scrollTo(index);
  };

  const toggleExpand = (id: string) => {
    setExpandedPosts(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleLike = (postId: string) => {
    setLikes(prev => {
      const current = prev[postId] || { count: 0, active: false };
      const isActive = !current.active;
      return {
        ...prev,
        [postId]: {
          count: isActive ? current.count + 1 : Math.max(0, current.count - 1),
          active: isActive
        }
      };
    });
  };

  const handleShare = async (post: any) => {
    const shareUrl = `${window.location.origin}/feed`;
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({ title: 'OnTapp', text: `Postingan dari ${post.author}`, url: shareUrl });
      } catch (error: any) {
        if (error.name === 'AbortError') return;
        navigator.clipboard.writeText(shareUrl);
        toast({ title: "Tautan Disalin" });
      }
    } else {
      navigator.clipboard.writeText(shareUrl);
      toast({ title: "Tautan Disalin" });
    }
  };

  const handleSavePost = (post: any) => {
    let newSaved;
    if (savedPosts.includes(post.id)) {
      newSaved = savedPosts.filter(id => id !== post.id);
      toast({ title: "Dihapus dari simpanan" });
      const fullSaved = JSON.parse(localStorage.getItem('ontapp_saved_posts_data') || '[]');
      localStorage.setItem('ontapp_saved_posts_data', JSON.stringify(fullSaved.filter((p: any) => p.id !== post.id)));
    } else {
      newSaved = [...savedPosts, post.id];
      toast({ title: "Berhasil disimpan" });
      const fullSaved = JSON.parse(localStorage.getItem('ontapp_saved_posts_data') || '[]');
      localStorage.setItem('ontapp_saved_posts_data', JSON.stringify([post, ...fullSaved]));
    }
    setSavedPosts(newSaved);
    localStorage.setItem('ontapp_saved_posts', JSON.stringify(newSaved));
  };

  const handleTranslate = async (postId: string, content: string) => {
    if (translations[postId]?.text) {
      setTranslations(prev => ({ ...prev, [postId]: { ...prev[postId], show: !prev[postId].show } }));
      return;
    }
    setTranslations(prev => ({ ...prev, [postId]: { text: "", show: false, loading: true } }));
    try {
      const { translatedText } = await translateText({ text: content, targetLanguage: language });
      setTranslations(prev => ({ ...prev, [postId]: { text: translatedText, show: true, loading: false } }));
    } catch (err) {
      setTranslations(prev => ({ ...prev, [postId]: { text: "", show: false, loading: false } }));
    }
  };

  const handleCreatePost = () => {
    if (!postContent.trim() && postImages.length === 0 && !postLink) return;
    const newPostData = {
      title: postContent.slice(0, 30) + (postContent.length > 30 ? "..." : ""),
      description: postContent,
      images: postImages,
      externalLink: postLink || undefined,
      source: 'feed' as const,
      visibility: postVisibility,
    };
    addPost(newPostData);
    setIsPostModalOpen(false);
    setPostContent("");
    setPostImages([]);
    setPostLink("");
    setPostVisibility('public');
    setIsLinkInputOpen(false);
    toast({ title: "Postingan terbit!" });
    if (goToProfile) router.push("/profile");
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const newImages: string[] = [];
      let processed = 0;
      Array.from(files).forEach(file => {
        const reader = new FileReader();
        reader.onloadend = () => {
          newImages.push(reader.result as string);
          processed++;
          if (processed === files.length) {
            setPostImages(prev => [...prev, ...newImages]);
            toast({ title: `${files.length} Gambar siap` });
          }
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const combinedPosts = React.useMemo(() => {
    const userPosts = (activeAccount.items || [])
      .filter(item => item.source === 'feed')
      .map(item => ({
        id: item.id,
        type: "post",
        author: activeAccount.name,
        extra: activeAccount.extra,
        avatar: activeAccount.avatar,
        category: "Koleksi",
        content: item.description || "",
        images: item.images || (item.image ? [item.image] : []),
        externalLink: item.externalLink,
        time: item.timestamp || "Baru saja",
        stats: { likes: 0, comments: 0 },
        verified: activeAccount.verificationStatus === 'Verified',
        visibility: item.visibility
      }));
    const all = [...userPosts, ...INITIAL_POSTS].filter(p => p.visibility !== 'private' || p.author === activeAccount.name);
    return all.filter((v, i, a) => a.findIndex(t => t.id === v.id) === i);
  }, [activeAccount.items, activeAccount.name, activeAccount.avatar, activeAccount.extra, activeAccount.verificationStatus]);

  return (
    <DashboardLayout>
      <div className="flex flex-col h-[calc(100vh-160px)] max-w-2xl mx-auto relative overflow-hidden">
        <input type="file" multiple ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />
        <input type="file" multiple ref={cameraInputRef} className="hidden" accept="image/*" capture="environment" onChange={handleFileChange} />
        
        <div className="flex items-center justify-center gap-1 mb-6 sticky top-0 z-20 bg-background/80 backdrop-blur-sm py-2">
          {CATEGORIES.map((cat, idx) => (
            <button
              key={cat.id}
              onClick={() => scrollTo(idx)}
              className={cn(
                "px-5 py-2 rounded-full text-xs font-bold transition-all flex items-center gap-2",
                activeCategory === cat.id 
                  ? "bg-accent text-accent-foreground shadow-lg scale-105" 
                  : "bg-card text-muted-foreground hover:bg-muted border border-border"
              )}
            >
              <cat.icon className="size-3" />
              {cat.label}
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-hidden" ref={emblaMainRef}>
          <div className="flex h-full">
            {CATEGORIES.map((cat) => (
              <div 
                key={cat.id} 
                className="flex-[0_0_100%] min-w-0 h-full overflow-y-auto snap-y snap-mandatory no-scrollbar space-y-4 pb-10 px-1"
              >
                {combinedPosts.map((post) => {
                  const trans = translations[post.id];
                  const isSaved = savedPosts.includes(post.id);
                  const postLike = likes[post.id] || { count: 0, active: false };
                  const isExpanded = expandedPosts.has(post.id);
                  
                  return (
                    <div key={`${cat.id}-${post.id}`} className="snap-start snap-always w-full min-h-[400px] flex flex-col mb-4">
                      <Card className="border border-border shadow-sm rounded-[2.5rem] overflow-hidden bg-card flex-1 flex flex-col hover:shadow-md transition-shadow">
                        <div className="p-6 pb-2 flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <Avatar 
                              className="size-11 border border-border shadow-sm cursor-zoom-in hover:opacity-80 transition-opacity"
                              onClick={() => post.avatar && setExpandedAvatar(post.avatar)}
                            >
                              <AvatarImage src={post.avatar} className="object-cover" />
                              <AvatarFallback className="bg-accent/10 text-accent font-black">{post.author[0]}</AvatarFallback>
                            </Avatar>
                            <div className="flex flex-col">
                              <div className="flex items-center gap-2">
                                <Link href="/profile" className="hover:underline decoration-accent/50 underline-offset-2">
                                  <h3 className="font-black text-foreground text-sm">{post.author}</h3>
                                </Link>
                                {post.verified && <ShieldCheck className="size-3.5 text-emerald-500" />}
                                {post.visibility === 'private' && <Lock className="size-3 text-muted-foreground" />}
                              </div>
                              {post.extra && (
                                <div className="text-[10px] font-black text-accent uppercase tracking-tight -mt-0.5 opacity-80">
                                  {post.extra}
                                </div>
                              )}
                              <div className="flex items-center gap-2 text-[10px] text-muted-foreground font-bold uppercase tracking-widest opacity-60">
                                <Clock className="size-2.5" /> {post.time}
                              </div>
                            </div>
                          </div>
                          <button onClick={() => handleSavePost(post)} className={cn("p-2.5 rounded-full transition-all active:scale-90", isSaved ? "text-accent bg-accent/5" : "text-muted-foreground hover:bg-muted")}>
                            <Bookmark className={cn("size-5", isSaved && "fill-accent")} />
                          </button>
                        </div>

                        <CardContent className="px-8 py-4 flex-1 space-y-4">
                          {post.type === 'insight' && (
                            <div className="inline-flex items-center gap-2 bg-accent/10 text-accent px-3 py-1 rounded-full text-[9px] font-black uppercase border border-accent/20">
                              <Brain className="size-2.5 animate-pulse" /> AI Analysis
                            </div>
                          )}
                          <div 
                            onClick={() => toggleExpand(post.id)}
                            className={cn("cursor-pointer transition-all duration-300 relative group/text", !isExpanded && "line-clamp-5 max-h-[300px] overflow-hidden")}
                          >
                            <p className="text-foreground/90 leading-relaxed font-medium transition-colors text-base">
                              {trans?.show ? trans.text : post.content}
                            </p>
                            {!isExpanded && <div className="absolute bottom-0 left-0 right-0 h-10 bg-gradient-to-t from-card to-transparent pointer-events-none opacity-80" />}
                          </div>
                          
                          <PostMedia images={post.images} />
                          
                          {post.externalLink && (
                            <div className="pt-2">
                              <button onClick={() => window.open(post.externalLink, '_blank')} className="flex items-center justify-center size-12 bg-accent/5 hover:bg-accent/10 rounded-2xl border border-accent/10 transition-all shadow-sm active:scale-90">
                                <Link2 className="size-5 text-accent" />
                              </button>
                            </div>
                          )}
                        </CardContent>

                        <div className="p-6 pt-0 mt-auto border-t border-border/50 bg-muted/5 flex items-center justify-between">
                          <div className="flex items-center gap-6 text-muted-foreground">
                            <button onClick={() => handleLike(post.id)} className={cn("flex items-center gap-2 transition-all active:scale-125", postLike.active ? "text-rose-500" : "hover:text-rose-500")}>
                              <Heart className={cn("size-5", postLike.active && "fill-rose-500")} />
                              <span className="text-xs font-black">{postLike.count}</span>
                            </button>
                            <button className="flex items-center gap-2 hover:text-accent transition-colors active:scale-90"><MessageCircle className="size-5" /><span className="text-xs font-black">{post.stats.comments}</span></button>
                            <button onClick={() => handleTranslate(post.id, post.content)} className={cn("flex items-center transition-all active:scale-90", trans?.show ? "text-accent" : "hover:text-accent")}>
                              {trans?.loading ? <RefreshCw className="size-5 animate-spin" /> : <Globe className="size-5" />}
                            </button>
                          </div>
                          <div className="flex gap-2">
                            <button onClick={() => handleShare(post)} className="p-2 text-muted-foreground hover:text-foreground transition-all active:scale-75"><Share2 className="size-5" /></button>
                            <Button variant="ghost" size="sm" className="font-black text-accent hover:bg-accent/5 rounded-xl text-xs gap-1 h-9">Detail <ArrowUpRight className="size-3.5" /></Button>
                          </div>
                        </div>
                      </Card>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>

      <Dialog open={isPostModalOpen} onOpenChange={setIsPostModalOpen}>
        <DialogContent className="max-w-xl rounded-[2.5rem] p-0 border-none shadow-2xl overflow-hidden bg-card text-foreground">
          <div className="p-8 space-y-6">
            <DialogHeader>
              <div className="flex items-center justify-between">
                <DialogTitle className="text-xl font-black">Buat Postingan</DialogTitle>
                <div className="w-32">
                   <Select value={postVisibility} onValueChange={(val: 'public' | 'private') => setPostVisibility(val)}>
                    <SelectTrigger className="h-9 rounded-xl bg-muted/50 border-none text-[10px] font-black uppercase px-3"><SelectValue /></SelectTrigger>
                    <SelectContent><SelectItem value="public">🌍 Publik</SelectItem><SelectItem value="private">🔒 Privat</SelectItem></SelectContent>
                  </Select>
                </div>
              </div>
            </DialogHeader>

            <div className="space-y-4">
              <div className="relative rounded-[2rem] bg-muted/30 border border-border/50 p-2">
                <Textarea placeholder="Apa yang sedang Anda pikirkan?" value={postContent} onChange={(e) => setPostContent(e.target.value)} className="min-h-[160px] rounded-2xl border-none bg-transparent p-4 text-base font-medium focus-visible:ring-0 resize-none" />
                <div className="flex items-center gap-2 px-4 py-2 border-t border-border/30">
                  <button onClick={() => fileInputRef.current?.click()} className="p-2.5 rounded-xl hover:bg-accent/10 text-muted-foreground hover:text-accent transition-all active:scale-90" title="Tambah Galeri"><ImageIcon className="size-5" /></button>
                  <button onClick={() => cameraInputRef.current?.click()} className="p-2.5 rounded-xl hover:bg-accent/10 text-muted-foreground hover:text-accent transition-all active:scale-90" title="Ambil Foto"><Camera className="size-5" /></button>
                  <button onClick={() => setIsLinkInputOpen(!isLinkInputOpen)} className={cn("p-2.5 rounded-xl transition-all active:scale-90", isLinkInputOpen ? "bg-accent text-white" : "hover:bg-accent/10 text-muted-foreground hover:text-accent")} title="Tambah Link"><Link2 className="size-5" /></button>
                </div>
              </div>

              {isLinkInputOpen && (
                <div className="animate-in slide-in-from-top-2 duration-200">
                  <div className="flex items-center gap-2 bg-muted/50 rounded-2xl px-4 h-14 border border-border/50">
                    <Link2 className="size-5 text-accent opacity-50" />
                    <Input placeholder="Tempel tautan..." value={postLink} onChange={(e) => setPostLink(e.target.value)} className="border-none bg-transparent px-0 text-sm font-bold focus-visible:ring-0" />
                  </div>
                </div>
              )}

              {postImages.length > 0 && (
                <div className="grid grid-cols-3 gap-3 max-h-[200px] overflow-y-auto no-scrollbar p-1">
                  {postImages.map((src, i) => (
                    <div key={i} className="relative group rounded-xl overflow-hidden aspect-square border border-border bg-muted">
                      <img src={src} className="w-full h-full object-cover" alt="Preview" />
                      <button onClick={() => setPostImages(prev => prev.filter((_, idx) => idx !== i))} className="absolute top-1 right-1 size-6 bg-black/60 text-white rounded-full flex items-center justify-center hover:bg-rose-500 transition-colors opacity-0 group-hover:opacity-100"><X className="size-3" /></button>
                    </div>
                  ))}
                  <button onClick={() => fileInputRef.current?.click()} className="rounded-xl border-2 border-dashed border-border flex items-center justify-center hover:bg-accent/5 hover:border-accent transition-colors"><Plus className="size-6 text-muted-foreground" /></button>
                </div>
              )}

              <div className="flex items-center space-x-3 p-4 rounded-2xl bg-muted/10 border border-border/20">
                <Checkbox id="go-profile" checked={goToProfile} onCheckedChange={(val) => setGoToProfile(val as boolean)} />
                <Label htmlFor="go-profile" className="text-[10px] font-black cursor-pointer text-muted-foreground uppercase tracking-widest">Kunjungi profil setelah terbit</Label>
              </div>
            </div>

            <DialogFooter className="pt-2">
              <Button onClick={handleCreatePost} disabled={!postContent.trim() && postImages.length === 0 && !postLink} className="w-full h-14 rounded-2xl bg-accent hover:bg-accent/90 text-white font-black text-sm shadow-xl shadow-accent/20 active:scale-[0.98] transition-all">Kirim Postingan</Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={!!zoomedAvatar} onOpenChange={() => setExpandedAvatar(null)}>
        <DialogContent className="max-w-screen-lg p-0 bg-black/98 border-none shadow-none flex items-center justify-center overflow-hidden outline-none [&>button]:hidden">
          {zoomedAvatar && (
            <div className="w-full h-full max-h-[90vh] flex items-center justify-center p-4 cursor-pointer" onClick={() => setExpandedAvatar(null)}>
              <img src={zoomedAvatar} alt="Expanded Avatar" onClick={(e) => e.stopPropagation()} className="max-w-full max-h-full object-contain rounded-xl animate-in zoom-in-95 duration-300" />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
