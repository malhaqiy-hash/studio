"use client";

import * as React from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Globe, 
  Heart, 
  MessageCircle, 
  Share2, 
  ShieldCheck, 
  RefreshCw,
  Bookmark,
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
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useAccount } from "@/context/account-context";
import Link from "next/link";
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';

const CATEGORIES = [
  { id: 'for-you', label: 'Saran' },
  { id: 'lokal', label: 'Lokal' },
  { id: 'global', label: 'Global' },
  { id: 'trending', label: 'Trending' },
];

const INITIAL_POSTS = [
  {
    id: "p1",
    author: "OnTapp Intelligence",
    extra: "Enterprise AI Analyst",
    avatar: "https://picsum.photos/seed/ontapp/200",
    content: "Permintaan pasar untuk solusi AI infrastruktur di sektor manufaktur meningkat 40% di wilayah Asia Tenggara. Ini adalah waktu yang tepat untuk memperbarui katalog produk Anda.",
    time: "Baru saja",
    stats: { likes: 1200, comments: 84 },
    verified: true,
    visibility: 'public',
    images: ["https://picsum.photos/seed/tech1/800/500", "https://picsum.photos/seed/tech2/800/600", "https://picsum.photos/seed/tech3/800/700"]
  },
  {
    id: "p2",
    author: "Global Logistics Co.",
    extra: "Logistics & Supply Chain",
    avatar: "https://picsum.photos/seed/log/100",
    content: "Kami baru saja membuka rute pengiriman baru antara Jakarta dan Surabaya dengan efisiensi waktu 20% lebih cepat. Hubungi kami untuk penawaran khusus member OnTapp hari ini.",
    time: "2 jam yang lalu",
    stats: { likes: 452, comments: 12 },
    verified: true,
    images: ["https://picsum.photos/seed/truck/800/400"],
    visibility: 'public'
  },
];

function PostMedia({ images }: { images?: string[] }) {
  const [activeIdx, setActiveIdx] = React.useState(0);
  const [zoomedImage, setExpandedImage] = React.useState<string | null>(null);

  if (!images || images.length === 0) return null;

  const handleIsolate = (e: React.PointerEvent | React.TouchEvent | React.MouseEvent) => {
    if (images.length > 1) {
      e.stopPropagation();
    }
  };

  return (
    <div 
      className="relative group/carousel w-full overflow-hidden rounded-xl border border-border bg-muted/5 touch-pan-x select-none"
      onPointerDown={handleIsolate}
      onTouchStart={handleIsolate}
      onTouchMove={handleIsolate}
    >
      <Swiper
        nested={true}
        touchStartPreventDefault={false}
        className="w-full"
        onSlideChange={(swiper) => setActiveIdx(swiper.activeIndex)}
        slidesPerView={1}
      >
        {images.map((src, idx) => (
          <SwiperSlide key={idx}>
            <img 
              src={src} 
              className="w-full h-auto object-contain cursor-grab active:cursor-grabbing max-h-[500px] md:max-h-[700px]" 
              alt={`Content ${idx + 1}`}
              onClick={() => setExpandedImage(src)}
            />
          </SwiperSlide>
        ))}
      </Swiper>

      {images.length > 1 && (
        <div className="absolute top-3 right-3 bg-black/40 backdrop-blur-md px-2.5 py-1 rounded-full text-[10px] font-black z-10 text-white shadow-sm pointer-events-none tracking-widest">
          {activeIdx + 1} / {images.length}
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
        author: activeAccount.name,
        extra: activeAccount.extra,
        avatar: activeAccount.avatar,
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
      <div className="flex flex-col max-w-2xl mx-auto relative px-1 md:px-0">
        <input type="file" multiple ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />
        
        <div className="flex items-center justify-center gap-1 mb-2 sticky top-0 z-20 bg-background/80 backdrop-blur-sm py-2 overflow-x-auto no-scrollbar">
          {CATEGORIES.map((cat, idx) => (
            <button
              key={cat.id}
              onClick={() => scrollTo(idx)}
              className={cn(
                "px-4 py-1.5 rounded-full text-[11px] font-black uppercase tracking-widest transition-all border shrink-0",
                activeCategory === cat.id 
                  ? "bg-black text-white border-black shadow-sm" 
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
                className="flex-[0_0_100%] min-w-0 space-y-3 pb-20"
              >
                {combinedPosts.map((post) => {
                  const trans = translations[post.id];
                  const postLike = likes[post.id] || { count: 0, active: false };
                  
                  return (
                    <Card key={`${cat.id}-${post.id}`} className="border-border shadow-sm rounded-xl overflow-hidden bg-card">
                      <div className="p-3 md:p-4 pb-2 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Avatar 
                            className="size-10 border border-border cursor-zoom-in"
                            onClick={() => post.avatar && setExpandedAvatar(post.avatar)}
                          >
                            <AvatarImage src={post.avatar} className="object-cover" />
                            <AvatarFallback className="bg-black/5 text-black font-black text-xs">{post.author[0]}</AvatarFallback>
                          </Avatar>
                          <div className="flex flex-col">
                            <div className="flex items-center gap-1">
                              <Link href="/profile" className="hover:underline"><h3 className="font-bold text-slate-900 text-[15px]">{post.author}</h3></Link>
                              {post.verified && <ShieldCheck className="size-3.5 text-black" />}
                            </div>
                            <div className="flex items-center gap-1 text-[12px] text-muted-foreground font-medium uppercase tracking-tight">
                              {post.time}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                           {post.visibility === 'private' && <Lock className="size-3 text-muted-foreground" />}
                           <button className="p-2 rounded-full text-muted-foreground hover:bg-muted"><Bookmark className="size-5" /></button>
                        </div>
                      </div>

                      <CardContent className="px-3 md:px-4 py-2 space-y-3">
                        <p className="text-slate-800 leading-normal font-normal text-[14px] md:text-[15px] whitespace-pre-wrap">
                          {trans?.show ? trans.text : post.content}
                        </p>
                        <PostMedia images={post.images} />
                      </CardContent>

                      <div className="p-2 md:p-3 pt-1 border-t border-border/40 bg-muted/5 flex items-center justify-between">
                        <div className="flex items-center gap-6 text-muted-foreground">
                          <button onClick={() => handleLike(post.id)} className={cn("flex items-center gap-1.5 py-1 transition-all", postLike.active ? "text-black" : "hover:text-black")}>
                            <Heart className={cn("size-5", postLike.active && "fill-black")} />
                            <span className="text-xs font-bold">{postLike.count > 0 ? postLike.count : 'Suka'}</span>
                          </button>
                          <button className="flex items-center gap-1.5 py-1 hover:text-black">
                            <MessageCircle className="size-5" />
                            <span className="text-xs font-bold">{post.stats.comments > 0 ? post.stats.comments : 'Komentar'}</span>
                          </button>
                          <button onClick={() => handleTranslate(post.id, post.content)} className={cn("flex items-center py-1", trans?.show ? "text-black" : "hover:text-black")}>
                            {trans?.loading ? <RefreshCw className="size-5 animate-spin" /> : <Globe className="size-5" />}
                          </button>
                        </div>
                        <button className="p-2 text-muted-foreground hover:text-foreground"><Share2 className="size-5" /></button>
                      </div>
                    </Card>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>

      <Dialog open={isPostModalOpen} onOpenChange={setIsPostModalOpen}>
        <DialogContent className="w-[95%] md:max-w-lg rounded-2xl p-0 border-none shadow-2xl overflow-hidden bg-card text-foreground outline-none [&>button]:hidden">
          <div className="p-5 md:p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold">Buat Postingan</h2>
              <div className="w-32">
                 <Select value={postVisibility} onValueChange={(val: 'public' | 'private') => setPostVisibility(val)}>
                  <SelectTrigger className="h-9 rounded-lg bg-muted/50 border-none text-[11px] font-black uppercase tracking-widest px-3 shadow-inner"><SelectValue /></SelectTrigger>
                  <SelectContent><SelectItem value="public">🌍 Publik</SelectItem><SelectItem value="private">🔒 Privat</SelectItem></SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-3">
              <Textarea placeholder="Apa yang Anda pikirkan?" value={postContent} onChange={(e) => setPostContent(e.target.value)} className="min-h-[120px] rounded-xl border-none bg-muted/30 p-4 text-[15px] focus-visible:ring-0 resize-none shadow-inner" />
              <div className="flex flex-wrap gap-2">
                {postImages.map((src, i) => (
                  <div key={i} className="relative size-16 rounded-lg overflow-hidden border">
                    <img src={src} className="w-full h-full object-cover" />
                    <button onClick={() => setPostImages(postImages.filter((_, idx) => idx !== i))} className="absolute top-0.5 right-0.5 bg-black/60 text-white rounded-full p-0.5"><Plus className="size-2.5 rotate-45" /></button>
                  </div>
                ))}
                <button onClick={() => fileInputRef.current?.click()} className="size-16 rounded-lg bg-muted/50 border-2 border-dashed border-border flex items-center justify-center text-muted-foreground hover:border-black hover:text-black transition-colors"><Plus size={20} /></button>
              </div>
            </div>
            <Button onClick={handleCreatePost} disabled={!postContent.trim() && postImages.length === 0} className="w-full h-12 rounded-xl bg-black font-bold text-white shadow-lg active:scale-[0.98] transition-all">Posting</Button>
            <button onClick={() => setIsPostModalOpen(false)} className="w-full text-center text-[10px] font-black uppercase tracking-widest text-muted-foreground pt-2">Batal</button>
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