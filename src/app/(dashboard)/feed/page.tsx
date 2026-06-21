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
  Bookmark,
  Image as ImageIcon,
  X,
  Plus,
  Lock,
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
    content: "Permintaan pasar untuk solusi AI infrastruktur di sektor manufaktur meningkat 40% di wilayah Asia Tenggara. Ini adalah waktu yang tepat untuk memperbarui katalog produk Anda.",
    time: "Baru saja",
    stats: { likes: 1200, comments: 84 },
    verified: true,
    tag: "Trending",
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
    content: "Kami baru saja membuka rute pengiriman baru antara Jakarta dan Surabaya dengan efisiensi waktu 20% lebih cepat. Hubungi kami untuk penawaran khusus member OnTapp hari ini.",
    time: "2 jam yang lalu",
    stats: { likes: 452, comments: 12 },
    verified: true,
    images: ["https://picsum.photos/seed/truck/800/400"],
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
      <div className="overflow-hidden rounded-xl border border-border bg-muted/5" ref={emblaRef}>
        <div className="flex">
          {images.map((src, idx) => (
            <div key={idx} className="flex-[0_0_100%] min-w-0">
              <img 
                src={src} 
                className="w-full h-auto object-contain cursor-zoom-in active:scale-[0.99] transition-transform max-h-[400px] md:max-h-[600px]" 
                alt={`Content ${idx + 1}`}
                onClick={() => setExpandedImage(src)}
              />
            </div>
          ))}
        </div>
      </div>

      {images.length > 1 && (
        <div className="absolute top-2 right-2 bg-black/40 backdrop-blur-md px-2 py-0.5 rounded-full text-[7px] md:text-[8px] font-black z-10 text-white shadow-sm">
          {selectedIndex + 1} / {images.length}
        </div>
      )}

      <Dialog open={!!zoomedImage} onOpenChange={() => setExpandedImage(null)}>
        <DialogContent 
          className="max-w-screen-lg p-0 bg-black/95 border-none shadow-none flex items-center justify-center overflow-hidden outline-none [&>button]:hidden"
          onClick={() => setExpandedImage(null)}
        >
          {zoomedImage && (
            <div className="w-full h-full max-h-[95vh] flex items-center justify-center p-4 cursor-pointer">
              <img 
                src={zoomedImage} 
                alt="Expanded" 
                onClick={(e) => e.stopPropagation()}
                className="max-w-full max-h-full object-contain rounded-lg animate-in zoom-in-95 duration-200"
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
  const { activeAccount, addPost } = useAccount();
  
  const [activeCategory, setActiveCategory] = React.useState('for-you');
  const [translations, setTranslations] = React.useState<Record<string, { text: string, show: boolean, loading: boolean }>>({});
  const [savedPosts, setSavedPosts] = React.useState<string[]>([]);
  const [expandedPosts, setExpandedPosts] = React.useState<Set<string>>(new Set());
  const [likes, setLikes] = React.useState<Record<string, { count: number, active: boolean }>>({});

  const [isPostModalOpen, setIsPostModalOpen] = React.useState(false);
  const [postContent, setPostContent] = React.useState("");
  const [postImages, setPostImages] = React.useState<string[]>([]);
  const [postVisibility, setPostVisibility] = React.useState<'public' | 'private'>('public');
  
  const [zoomedAvatar, setExpandedAvatar] = React.useState<string | null>(null);

  const fileInputRef = React.useRef<HTMLInputElement>(null);
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
    const initialLikes: Record<string, { count: number, active: boolean }> = {};
    INITIAL_POSTS.forEach(p => {
      initialLikes[p.id] = { count: p.stats.likes, active: false };
    });
    setLikes(initialLikes);
  }, []);

  const scrollTo = (index: number) => {
    if (emblaMainApi) emblaMainApi.scrollTo(index);
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
    if (!postContent.trim() && postImages.length === 0) return;
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
      .map(item => ({
        id: item.id,
        type: "post",
        author: activeAccount.name,
        extra: activeAccount.extra,
        avatar: activeAccount.avatar,
        category: "Profil Saya",
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
        
        <div className="flex items-center justify-center gap-1.5 mb-2 md:mb-4 sticky top-0 z-20 bg-background/80 backdrop-blur-sm py-2">
          {CATEGORIES.map((cat, idx) => (
            <button
              key={cat.id}
              onClick={() => scrollTo(idx)}
              className={cn(
                "px-2.5 py-1 rounded-full text-[9px] md:text-xs font-bold transition-all border",
                activeCategory === cat.id 
                  ? "bg-accent text-accent-foreground border-accent shadow-sm" 
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
                  const postLike = likes[post.id] || { count: 0, active: false };
                  
                  return (
                    <div key={`${cat.id}-${post.id}`} className="snap-start snap-always w-full flex flex-col mb-1.5 md:mb-3">
                      <Card className="border border-border shadow-sm rounded-xl md:rounded-[2rem] overflow-hidden bg-card flex-1 flex flex-col">
                        <div className="p-3 md:p-5 pb-1 flex items-center justify-between">
                          <div className="flex items-center gap-2.5 md:gap-3">
                            <Avatar 
                              className="size-8 md:size-10 border border-border cursor-zoom-in"
                              onClick={() => post.avatar && setExpandedAvatar(post.avatar)}
                            >
                              <AvatarImage src={post.avatar} className="object-cover" />
                              <AvatarFallback className="bg-accent/10 text-accent font-black text-[8px]">{post.author[0]}</AvatarFallback>
                            </Avatar>
                            <div className="flex flex-col">
                              <div className="flex items-center gap-1">
                                <Link href="/profile" className="hover:underline"><h3 className="font-black text-foreground text-[11px] md:text-sm">{post.author}</h3></Link>
                                {post.verified && <ShieldCheck className="size-3 md:size-3.5 text-emerald-500" />}
                              </div>
                              <div className="flex items-center gap-1 text-[7px] md:text-[9px] text-muted-foreground font-bold uppercase tracking-widest opacity-60">
                                <Clock className="size-2.5" /> {post.time}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                             {post.visibility === 'private' && <Lock className="size-3 text-muted-foreground" />}
                             <button className="p-1.5 md:p-2 rounded-full text-muted-foreground hover:bg-muted"><Bookmark className="size-3.5 md:size-5" /></button>
                          </div>
                        </div>

                        <CardContent className="px-3 md:px-5 py-2 flex-1 space-y-2">
                          <p className="text-foreground/90 leading-relaxed font-medium text-[11px] md:text-sm">
                            {trans?.show ? trans.text : post.content}
                          </p>
                          <PostMedia images={post.images} />
                        </CardContent>

                        <div className="p-2.5 md:p-4 pt-0 mt-auto border-t border-border/40 bg-muted/5 flex items-center justify-between">
                          <div className="flex items-center gap-4 md:gap-6 text-muted-foreground">
                            <button onClick={() => handleLike(post.id)} className={cn("flex items-center gap-1 transition-all", postLike.active ? "text-rose-500" : "hover:text-rose-500")}>
                              <Heart className={cn("size-4 md:size-5", postLike.active && "fill-rose-500")} />
                              <span className="text-[8px] md:text-xs font-black">{postLike.count}</span>
                            </button>
                            <button className="flex items-center gap-1 hover:text-accent"><MessageCircle className="size-4 md:size-5" /><span className="text-[8px] md:text-xs font-black">{post.stats.comments}</span></button>
                            <button onClick={() => handleTranslate(post.id, post.content)} className={cn("flex items-center", trans?.show ? "text-accent" : "hover:text-accent")}>
                              {trans?.loading ? <RefreshCw className="size-4 md:size-5 animate-spin" /> : <Globe className="size-4 md:size-5" />}
                            </button>
                          </div>
                          <button className="p-1.5 text-muted-foreground hover:text-foreground"><Share2 className="size-4 md:size-5" /></button>
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
        <DialogContent className="w-[95%] md:max-w-lg rounded-[1.5rem] p-0 border-none shadow-2xl overflow-hidden bg-card text-foreground outline-none">
          <div className="p-5 md:p-6 space-y-4">
            <DialogHeader>
              <div className="flex items-center justify-between">
                <DialogTitle className="text-sm md:text-lg font-black">Buat Postingan</DialogTitle>
                <div className="w-24 md:w-32">
                   <Select value={postVisibility} onValueChange={(val: 'public' | 'private') => setPostVisibility(val)}>
                    <SelectTrigger className="h-8 md:h-10 rounded-lg bg-muted/50 border-none text-[10px] font-black uppercase px-3 shadow-inner"><SelectValue /></SelectTrigger>
                    <SelectContent><SelectItem value="public">🌍 Publik</SelectItem><SelectItem value="private">🔒 Privat</SelectItem></SelectContent>
                  </Select>
                </div>
              </div>
            </DialogHeader>
            <div className="space-y-3">
              <Textarea placeholder="Apa yang Anda pikirkan?" value={postContent} onChange={(e) => setPostContent(e.target.value)} className="min-h-[100px] md:min-h-[140px] rounded-xl border-none bg-muted/30 p-3 text-xs md:text-base focus-visible:ring-0 resize-none shadow-inner" />
              <div className="flex flex-wrap gap-2">
                {postImages.map((src, i) => (
                  <div key={i} className="relative size-12 md:size-16 rounded-lg overflow-hidden border">
                    <img src={src} className="w-full h-full object-cover" />
                    <button onClick={() => setPostImages(postImages.filter((_, idx) => idx !== i))} className="absolute top-0.5 right-0.5 bg-black/60 text-white rounded-full p-0.5"><X size={10} /></button>
                  </div>
                ))}
                <button onClick={() => fileInputRef.current?.click()} className="size-12 md:size-16 rounded-lg bg-muted/50 border-2 border-dashed border-border flex items-center justify-center text-muted-foreground hover:border-accent hover:text-accent transition-colors"><Plus size={20} /></button>
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleCreatePost} disabled={!postContent.trim() && postImages.length === 0} className="w-full h-10 md:h-12 rounded-xl bg-accent font-black text-white shadow-lg active:scale-95 transition-all">Posting</Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={!!zoomedAvatar} onOpenChange={() => setExpandedAvatar(null)}>
        <DialogContent 
          className="max-w-screen-lg p-0 bg-black/95 border-none shadow-none flex items-center justify-center overflow-hidden outline-none [&>button]:hidden"
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
