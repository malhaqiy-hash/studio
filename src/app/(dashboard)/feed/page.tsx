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
      <div className="overflow-hidden rounded-xl md:rounded-[2rem] border border-border bg-muted/10 shadow-sm" ref={emblaRef}>
        <div className="flex">
          {images.map((src, idx) => (
            <div key={idx} className="flex-[0_0_100%] min-w-0">
              <img 
                src={src} 
                className="w-full h-auto object-contain cursor-zoom-in active:scale-[0.99] transition-transform max-h-[350px] md:max-h-[700px]" 
                alt={`Content ${idx + 1}`}
                onClick={() => setExpandedImage(src)}
              />
            </div>
          ))}
        </div>
      </div>

      {images.length > 1 && (
        <div className="absolute top-2 right-2 md:top-3 md:right-3 bg-black/50 backdrop-blur-md px-2 py-0.5 rounded-full text-[7px] md:text-[9px] font-black z-10 shadow-sm text-white">
          {selectedIndex + 1} / {images.length}
        </div>
      )}

      <Dialog open={!!zoomedImage} onOpenChange={() => setExpandedImage(null)}>
        <DialogContent 
          className="max-w-screen-lg p-0 bg-black/98 border-none shadow-none flex items-center justify-center overflow-hidden outline-none [&>button]:hidden"
          onClick={() => setExpandedImage(null)}
        >
          {zoomedImage && (
            <div className="w-full h-full max-h-[90vh] flex items-center justify-center p-4 cursor-pointer">
              <img 
                src={zoomedImage} 
                alt="Expanded" 
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
    try {
      if (typeof navigator !== 'undefined' && navigator.share) {
        await navigator.share({ title: 'OnTapp', text: `Lihat postingan ${post.author}`, url: shareUrl });
      } else {
        throw new Error('Share not supported');
      }
    } catch (err) {
      navigator.clipboard.writeText(shareUrl);
      toast({ title: "Tautan Disalin" });
    }
  };

  const handleSavePost = (post: any) => {
    let newSaved;
    if (savedPosts.includes(post.id)) {
      newSaved = savedPosts.filter(id => id !== post.id);
      toast({ title: "Dihapus dari simpanan" });
    } else {
      newSaved = [...savedPosts, post.id];
      toast({ title: "Berhasil disimpan" });
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
    addPost({
      title: postContent.slice(0, 30),
      description: postContent,
      images: postImages,
      visibility: postVisibility,
      source: 'feed'
    });
    setIsPostModalOpen(false);
    setPostContent("");
    setPostImages([]);
    toast({ title: "Postingan terbit!" });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      Array.from(files).forEach(file => {
        const reader = new FileReader();
        reader.onloadend = () => setPostImages(prev => [...prev, reader.result as string]);
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
        images: item.images || [],
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
      <div className="flex flex-col h-[calc(100vh-100px)] max-w-2xl mx-auto relative overflow-hidden">
        <input type="file" multiple ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />
        
        <div className="flex items-center justify-center gap-1.5 mb-3 md:mb-6 sticky top-0 z-20 bg-background/80 backdrop-blur-sm py-2">
          {CATEGORIES.map((cat, idx) => (
            <button
              key={cat.id}
              onClick={() => scrollTo(idx)}
              className={cn(
                "px-3 py-1 rounded-full text-[10px] md:text-xs font-bold transition-all border",
                activeCategory === cat.id 
                  ? "bg-accent text-accent-foreground border-accent shadow-md scale-105" 
                  : "bg-card text-muted-foreground hover:bg-muted border-border"
              )}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-hidden" ref={emblaMainRef}>
          <div className="flex h-full">
            {CATEGORIES.map((cat) => (
              <div 
                key={cat.id} 
                className="flex-[0_0_100%] min-w-0 h-full overflow-y-auto snap-y snap-mandatory no-scrollbar space-y-3 pb-20 px-0.5"
              >
                {combinedPosts.map((post) => {
                  const trans = translations[post.id];
                  const isSaved = savedPosts.includes(post.id);
                  const postLike = likes[post.id] || { count: 0, active: false };
                  const isExpanded = expandedPosts.has(post.id);
                  
                  return (
                    <div key={`${cat.id}-${post.id}`} className="snap-start snap-always w-full flex flex-col mb-1 md:mb-2">
                      <Card className="border border-border shadow-sm rounded-xl md:rounded-[2.5rem] overflow-hidden bg-card flex-1 flex flex-col">
                        <div className="p-3 md:p-6 pb-1 flex items-center justify-between">
                          <div className="flex items-center gap-2 md:gap-3">
                            <Avatar 
                              className="size-9 md:size-11 border border-border cursor-zoom-in"
                              onClick={() => post.avatar && setExpandedAvatar(post.avatar)}
                            >
                              <AvatarImage src={post.avatar} className="object-cover" />
                              <AvatarFallback className="bg-accent/10 text-accent font-black text-[9px]">{post.author[0]}</AvatarFallback>
                            </Avatar>
                            <div className="flex flex-col">
                              <div className="flex items-center gap-1">
                                <Link href="/profile" className="hover:underline"><h3 className="font-black text-foreground text-xs md:text-sm">{post.author}</h3></Link>
                                {post.verified && <ShieldCheck className="size-3 md:size-3.5 text-emerald-500" />}
                              </div>
                              <div className="flex items-center gap-1 text-[8px] md:text-[9px] text-muted-foreground font-bold uppercase tracking-widest opacity-70">
                                <Clock className="size-2.5" /> {post.time}
                              </div>
                            </div>
                          </div>
                          <button onClick={() => handleSavePost(post)} className={cn("p-2 rounded-full transition-all", isSaved ? "text-accent" : "text-muted-foreground")}>
                            <Bookmark className={cn("size-4 md:size-5", isSaved && "fill-accent")} />
                          </button>
                        </div>

                        <CardContent className="px-4 md:px-8 py-2 md:py-3 flex-1 space-y-2 md:space-y-3">
                          <div 
                            onClick={() => toggleExpand(post.id)}
                            className={cn("cursor-pointer relative", !isExpanded && "line-clamp-4 max-h-[140px] md:max-h-[200px] overflow-hidden")}
                          >
                            <p className="text-foreground/90 leading-relaxed font-medium text-xs md:text-base">
                              {trans?.show ? trans.text : post.content}
                            </p>
                            {!isExpanded && <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-card to-transparent pointer-events-none" />}
                          </div>
                          
                          <PostMedia images={post.images} />
                        </CardContent>

                        <div className="p-3 md:p-6 pt-0 mt-auto border-t border-border/50 bg-muted/5 flex items-center justify-between">
                          <div className="flex items-center gap-4 md:gap-6 text-muted-foreground">
                            <button onClick={() => handleLike(post.id)} className={cn("flex items-center gap-1 transition-all", postLike.active ? "text-rose-500" : "hover:text-rose-500")}>
                              <Heart className={cn("size-4 md:size-5", postLike.active && "fill-rose-500")} />
                              <span className="text-[9px] md:text-xs font-black">{postLike.count}</span>
                            </button>
                            <button className="flex items-center gap-1 hover:text-accent"><MessageCircle className="size-4 md:size-5" /><span className="text-[9px] md:text-xs font-black">{post.stats.comments}</span></button>
                            <button onClick={() => handleTranslate(post.id, post.content)} className={cn("flex items-center", trans?.show ? "text-accent" : "hover:text-accent")}>
                              {trans?.loading ? <RefreshCw className="size-4 md:size-5 animate-spin" /> : <Globe className="size-4 md:size-5" />}
                            </button>
                          </div>
                          <button onClick={() => handleShare(post)} className="p-2 text-muted-foreground hover:text-foreground"><Share2 className="size-4 md:size-5" /></button>
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

      {/* Visibility Modal Restored */}
      <Dialog open={isPostModalOpen} onOpenChange={setIsPostModalOpen}>
        <DialogContent className="w-[95%] md:max-w-xl rounded-[2rem] p-0 border-none shadow-2xl overflow-hidden bg-card text-foreground">
          <div className="p-6 md:p-8 space-y-4 md:space-y-6">
            <DialogHeader>
              <div className="flex items-center justify-between">
                <DialogTitle className="text-base md:text-xl font-black">Buat Postingan</DialogTitle>
                <div className="w-24 md:w-32">
                   <Select value={postVisibility} onValueChange={(val: 'public' | 'private') => setPostVisibility(val)}>
                    <SelectTrigger className="h-8 md:h-10 rounded-xl bg-muted/50 border-none text-[9px] font-black uppercase px-2"><SelectValue /></SelectTrigger>
                    <SelectContent><SelectItem value="public">🌍 Publik</SelectItem><SelectItem value="private">🔒 Privat</SelectItem></SelectContent>
                  </Select>
                </div>
              </div>
            </DialogHeader>
            <div className="space-y-4">
              <Textarea placeholder="Apa yang Anda pikirkan?" value={postContent} onChange={(e) => setPostContent(e.target.value)} className="min-h-[120px] rounded-xl border-none bg-muted/30 p-4 text-sm md:text-base focus-visible:ring-0 resize-none" />
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => fileInputRef.current?.click()} className="rounded-xl h-10 gap-2 font-bold text-[10px]"><ImageIcon className="size-4" /> Foto</Button>
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleCreatePost} disabled={!postContent.trim() && postImages.length === 0} className="w-full h-12 md:h-14 rounded-xl md:rounded-2xl bg-accent font-black text-white shadow-xl">Posting</Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={!!zoomedAvatar} onOpenChange={() => setExpandedAvatar(null)}>
        <DialogContent 
          className="max-w-screen-lg p-0 bg-black/98 border-none shadow-none flex items-center justify-center overflow-hidden outline-none [&>button]:hidden"
          onClick={() => setExpandedAvatar(null)}
        >
          {zoomedAvatar && (
            <div className="w-full h-full max-h-[90vh] flex items-center justify-center p-4 cursor-pointer">
              <img src={zoomedAvatar} alt="Expanded Avatar" onClick={(e) => e.stopPropagation()} className="max-w-full max-h-full object-contain rounded-xl animate-in zoom-in-95 duration-300" />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}