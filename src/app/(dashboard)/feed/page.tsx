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
  MapPin,
  ChevronLeft,
  ChevronRight,
  Instagram,
  Linkedin,
  Facebook,
  Link as LinkIcon,
  Smartphone,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/context/language-context";
import { translateText } from "@/ai/flows/translate-flow";
import { cn } from "@/lib/utils";
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
import { Input } from "@/components/ui/input";
import { useAccount } from "@/context/account-context";
import Link from "next/link";
import { Swiper, SwiperSlide } from 'swiper/react';
import type { Swiper as SwiperType } from 'swiper';
import { Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import { ShareSheet } from "@/components/share-sheet";
import { motion, useMotionValue, useTransform } from "framer-motion";

const CATEGORIES = [
  { id: 'saran', label: 'Saran' },
  { id: 'lokal', label: 'Lokal' },
  { id: 'global', label: 'Global' },
  { id: 'trending', label: 'Trending' },
];

const INITIAL_POSTS = [
  {
    id: "p1",
    author: "Tapp Intelligence",
    extra: "Enterprise AI Analyst",
    avatar: "https://picsum.photos/seed/ontapp/200",
    content: "Permintaan pasar untuk solusi AI infrastruktur di sektor manufaktur meningkat 40% di wilayah Asia Tenggara. Ini adalah waktu yang tepat untuk memperbarui katalog produk Anda.",
    time: "Baru saja",
    stats: { likes: 1200, comments: 84 },
    verified: true,
    visibility: 'public',
    images: ["https://picsum.photos/seed/tech1/800/500", "https://picsum.photos/seed/tech2/800/600", "https://picsum.photos/seed/tech3/800/700"],
    locationLink: "https://maps.google.com"
  },
  {
    id: "p2",
    author: "Global Logistics Co.",
    extra: "Logistics & Supply Chain",
    avatar: "https://picsum.photos/seed/log/100",
    content: "Kami baru saja membuka rute pengiriman baru antara Jakarta dan Surabaya dengan efisiensi waktu 20% lebih cepat. Hubungi kami untuk penawaran khusus member Tapp hari ini.",
    time: "2 jam yang lalu",
    stats: { likes: 452, comments: 12 },
    verified: true,
    images: ["https://picsum.photos/seed/truck/800/400"],
    visibility: 'public'
  },
];

function getSmartIcon(url: string) {
  const lower = url.toLowerCase();
  if (lower.includes('maps.google') || lower.includes('goo.gl/maps') || lower.includes('apple.com/maps')) return <MapPin className="size-3.5" />;
  if (lower.includes('instagram.com')) return <Instagram className="size-3.5" />;
  if (lower.includes('linkedin.com')) return <Linkedin className="size-3.5" />;
  if (lower.includes('facebook.com') || lower.includes('fb.com')) return <Facebook className="size-3.5" />;
  if (lower.includes('wa.me') || lower.includes('whatsapp.com')) return <Smartphone className="size-3.5" />;
  return <Globe className="size-3.5" />;
}

function PostMedia({ images }: { images?: string[] }) {
  const [activeIdx, setActiveIdx] = React.useState(0);
  const [isZoomOpen, setIsZoomOpen] = React.useState(false);
  const swiperRef = React.useRef<SwiperType | null>(null);

  if (!images || images.length === 0) return null;

  return (
    <div className="relative group/carousel w-full overflow-hidden rounded-xl border border-border bg-muted/5 touch-pan-x select-none">
      <Swiper
        modules={[Navigation]}
        nested={true}
        onSwiper={(swiper) => (swiperRef.current = swiper)}
        onSlideChange={(swiper) => setActiveIdx(swiper.activeIndex)}
        className="w-full"
        slidesPerView={1}
      >
        {images.map((src, idx) => (
          <SwiperSlide key={idx}>
            <img 
              src={src} 
              className="w-full h-auto object-contain max-h-[500px] cursor-pointer" 
              alt={`Content ${idx + 1}`}
              onClick={() => setIsZoomOpen(true)}
            />
          </SwiperSlide>
        ))}
      </Swiper>

      {images.length > 1 && (
        <>
          <button 
            onClick={(e) => { e.stopPropagation(); swiperRef.current?.slidePrev(); }}
            className="absolute left-2 top-1/2 -translate-y-1/2 z-10 size-8 rounded-full bg-black/50 text-white flex items-center justify-center opacity-0 group-hover/carousel:opacity-100 transition-opacity"
          >
            <ChevronLeft className="size-5" />
          </button>
          <button 
            onClick={(e) => { e.stopPropagation(); swiperRef.current?.slideNext(); }}
            className="absolute right-2 top-1/2 -translate-y-1/2 z-10 size-8 rounded-full bg-black/50 text-white flex items-center justify-center opacity-0 group-hover/carousel:opacity-100 transition-opacity"
          >
            <ChevronRight className="size-5" />
          </button>
          <div className="absolute top-3 right-3 bg-black/40 backdrop-blur-md px-2.5 py-1 rounded-full text-[10px] font-black z-10 text-white shadow-sm pointer-events-none tracking-widest">
            {activeIdx + 1} / {images.length}
          </div>
        </>
      )}

      <Dialog open={isZoomOpen} onOpenChange={setIsZoomOpen}>
        <DialogContent 
          className="max-w-[100vw] w-screen h-screen p-0 m-0 bg-black/98 border-none shadow-none flex items-center justify-center overflow-hidden outline-none [&>button]:hidden cursor-pointer"
          onClick={() => setIsZoomOpen(false)}
        >
          <div className="w-full h-full relative flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
             <div className="absolute inset-0 z-0" onClick={() => setIsZoomOpen(false)} />
             <div className="relative z-10 w-full max-w-4xl px-4 flex items-center justify-center">
                <Swiper
                  initialSlide={activeIdx}
                  className="w-full h-full flex items-center justify-center"
                  slidesPerView={1}
                >
                  {images.map((src, idx) => (
                    <SwiperSlide key={idx} className="flex items-center justify-center">
                      <img 
                        src={src} 
                        alt="Zoomed" 
                        className="max-w-full max-h-[90vh] object-contain rounded-lg animate-in zoom-in-95 duration-200" 
                        onClick={(e) => e.stopPropagation()}
                      />
                    </SwiperSlide>
                  ))}
                </Swiper>
             </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default function FeedPage() {
  const { language, t } = useLanguage();
  const { toast } = useToast();
  const { activeAccount, addPost } = useAccount();
  
  const [activeCategory, setActiveCategory] = React.useState('saran');
  const [translations, setTranslations] = React.useState<Record<string, { text: string, show: boolean, loading: boolean }>>({});
  const [likes, setLikes] = React.useState<Record<string, { count: number, active: boolean }>>({});

  const [isPostModalOpen, setIsPostModalOpen] = React.useState(false);
  const [postContent, setPostContent] = React.useState("");
  const [postImages, setPostImages] = React.useState<string[]>([]);
  const [postLocationLink, setPostLocationLink] = React.useState("");
  const [postVisibility, setPostVisibility] = React.useState<'public' | 'private'>('public');
  
  const [isShareSheetOpen, setIsShareSheetOpen] = React.useState(false);
  const [shareUrl, setShareUrl] = React.useState("");

  const [zoomedAvatar, setExpandedAvatar] = React.useState<string | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  // Swipe logic
  const dragX = useMotionValue(0);
  const swipePlusOpacity = useTransform(dragX, [0, 100], [0, 1]);
  const swipePlusScale = useTransform(dragX, [0, 100], [0.5, 1.2]);

  const handleDragEnd = (event: any, info: any) => {
    if (info.offset.x > 100) {
      setIsPostModalOpen(true);
    }
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

  const handleShare = (postId: string) => {
    setShareUrl(`https://tapp.network/post/${postId}`);
    setIsShareSheetOpen(true);
  };

  const handleCreatePost = () => {
    if (!postContent.trim() && postImages.length === 0) return;
    addPost({
      title: postContent.slice(0, 30),
      description: postContent,
      images: postImages,
      visibility: postVisibility,
      locationLink: postLocationLink,
      source: 'feed'
    });
    setIsPostModalOpen(false);
    setPostContent("");
    setPostImages([]);
    setPostLocationLink("");
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
        visibility: item.visibility,
        locationLink: item.locationLink
      }));
    const all = [...userPosts, ...INITIAL_POSTS].filter(p => p.visibility !== 'private' || p.author === activeAccount.name);
    return all.filter((v, i, a) => a.findIndex(t => t.id === v.id) === i);
  }, [activeAccount.items, activeAccount.name, activeAccount.avatar, activeAccount.extra, activeAccount.verificationStatus]);

  return (
    <DashboardLayout>
      <motion.div 
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.2}
        onDragEnd={handleDragEnd}
        style={{ x: dragX }}
        className="flex flex-col max-w-2xl mx-auto relative px-1 md:px-0 min-h-[calc(100vh-8rem)] touch-pan-y"
      >
        <input type="file" multiple ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />
        
        {/* Swipe Indicator */}
        <motion.div 
          style={{ opacity: swipePlusOpacity, scale: swipePlusScale }}
          className="fixed left-6 top-1/2 -translate-y-1/2 z-50 pointer-events-none text-primary flex flex-col items-center gap-2"
        >
          <div className="size-16 rounded-3xl bg-primary/10 backdrop-blur-sm border-2 border-primary/20 flex items-center justify-center shadow-xl shadow-primary/10">
            <Plus className="size-10" />
          </div>
          <span className="text-[10px] font-black uppercase tracking-widest bg-primary text-white px-3 py-1 rounded-full">Buat Postingan</span>
        </motion.div>

        <div className="flex items-center justify-center gap-1 mb-2 sticky top-0 z-20 bg-background/80 backdrop-blur-sm py-2 overflow-x-auto no-scrollbar">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={cn(
                "px-4 py-1.5 rounded-full text-[11px] font-black uppercase tracking-widest transition-all border shrink-0",
                activeCategory === cat.id 
                  ? "bg-primary text-white border-primary shadow-lg shadow-primary/20" 
                  : "bg-card text-muted-foreground hover:bg-muted border-border"
              )}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-hidden">
          <div className="space-y-3 pb-20">
            {combinedPosts.map((post) => {
              const trans = translations[post.id];
              const postLike = likes[post.id] || { count: 0, active: false };
              
              return (
                <Card key={post.id} className="border-border shadow-sm rounded-xl overflow-hidden bg-card">
                  <div className="p-3 md:p-4 pb-2 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar 
                        className="size-10 border border-border cursor-pointer"
                        onClick={() => post.avatar && setExpandedAvatar(post.avatar)}
                      >
                        <AvatarImage src={post.avatar} className="object-cover" />
                        <AvatarFallback className="bg-primary/5 text-primary font-black text-xs">{post.author[0]}</AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <div className="flex items-center gap-1">
                          <Link href="/profile" className="hover:underline"><h3 className="font-bold text-slate-900 text-[15px]">{post.author}</h3></Link>
                          {post.verified && <ShieldCheck className="size-3.5 text-primary" />}
                          {post.locationLink && (
                            <a href={post.locationLink} target="_blank" rel="noopener noreferrer" className="ml-1 text-muted-foreground hover:text-primary transition-colors">
                              {getSmartIcon(post.locationLink)}
                            </a>
                          )}
                        </div>
                        <div className="flex items-center gap-1 text-[12px] text-muted-foreground font-medium uppercase tracking-tight">
                          {post.time}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                        {post.visibility === 'private' && <Lock className="size-3 text-muted-foreground" />}
                        <button className="p-2 rounded-full text-muted-foreground hover:bg-primary/5 hover:text-primary transition-colors"><Bookmark className="size-5" /></button>
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
                      <button onClick={() => handleLike(post.id)} className={cn("flex items-center gap-1.5 py-1 transition-all", postLike.active ? "text-primary" : "hover:text-primary")}>
                        <Heart className={cn("size-5", postLike.active && "fill-primary")} />
                        <span className="text-xs font-bold">{postLike.count > 0 ? postLike.count : 'Suka'}</span>
                      </button>
                      <button className="flex items-center gap-1.5 py-1 hover:text-primary transition-colors">
                        <MessageCircle className="size-5" />
                        <span className="text-xs font-bold">{post.stats.comments > 0 ? post.stats.comments : 'Komentar'}</span>
                      </button>
                      <button onClick={() => handleTranslate(post.id, post.content)} className={cn("flex items-center py-1", trans?.show ? "text-primary" : "hover:text-primary transition-colors")}>
                        {trans?.loading ? <RefreshCw className="size-5 animate-spin" /> : <Globe className="size-5" />}
                      </button>
                    </div>
                    <button onClick={() => handleShare(post.id)} className="p-2 text-muted-foreground hover:text-primary active:scale-90 transition-all"><Share2 className="size-5" /></button>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      </motion.div>

      <Dialog open={isPostModalOpen} onOpenChange={setIsPostModalOpen}>
        <DialogContent className="w-[95%] md:max-w-lg rounded-2xl p-0 border-none shadow-2xl overflow-hidden bg-card text-foreground outline-none [&>button]:hidden">
          <div className="p-5 md:p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold">Buat Postingan</h2>
              <div className="w-32">
                 <Select value={postVisibility} onValueChange={(val: 'public' | 'private') => setPostVisibility(val)}>
                  <SelectTrigger className="h-9 rounded-lg bg-muted/50 border-none text-[11px] font-black uppercase tracking-widest px-3 shadow-inner focus:ring-2 focus:ring-primary/10 transition-all"><SelectValue /></SelectTrigger>
                  <SelectContent className="rounded-xl shadow-xl"><SelectItem value="public">🌍 Publik</SelectItem><SelectItem value="private">🔒 Privat</SelectItem></SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-3">
              <Textarea placeholder="Apa yang Anda pikirkan?" value={postContent} onChange={(e) => setPostContent(e.target.value)} className="min-h-[120px] rounded-xl border-none bg-muted/30 p-4 text-[15px] focus-visible:ring-2 focus-visible:ring-primary/10 resize-none shadow-inner" />
              
              <div className="relative group">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-primary">{postLocationLink ? getSmartIcon(postLocationLink) : <LinkIcon className="size-4" />}</div>
                <Input 
                  placeholder="Link Alamat/Web (opsional)" 
                  value={postLocationLink} 
                  onChange={(e) => setPostLocationLink(e.target.value)}
                  className="h-11 pl-10 rounded-xl border-none bg-muted/30 text-[14px] font-medium shadow-inner focus-visible:ring-2 focus-visible:ring-primary/10 transition-all" 
                />
              </div>

              <div className="flex flex-wrap gap-2">
                {postImages.map((src, i) => (
                  <div key={i} className="relative size-16 rounded-lg overflow-hidden border border-border">
                    <img src={src} className="w-full h-full object-cover" />
                    <button onClick={() => setPostImages(postImages.filter((_, idx) => idx !== i))} className="absolute top-0.5 right-0.5 bg-black/60 text-white rounded-full p-0.5 hover:bg-rose-500 transition-colors"><Plus className="size-2.5 rotate-45" /></button>
                  </div>
                ))}
                <button onClick={() => fileInputRef.current?.click()} className="size-16 rounded-lg bg-muted/50 border-2 border-dashed border-border flex items-center justify-center text-muted-foreground hover:border-primary hover:text-primary transition-all"><Plus size={20} /></button>
              </div>
            </div>
            <Button onClick={handleCreatePost} disabled={!postContent.trim() && postImages.length === 0} className="w-full h-12 rounded-xl bg-primary hover:bg-primary/90 font-bold text-white shadow-lg shadow-primary/20 active:scale-[0.98] transition-all">Posting</Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={!!zoomedAvatar} onOpenChange={() => setExpandedAvatar(null)}>
        <DialogContent 
          className="max-w-screen-lg p-0 bg-black/95 border-none shadow-none flex items-center justify-center overflow-hidden outline-none [&>button]:hidden cursor-pointer"
          onClick={() => setExpandedAvatar(null)}
        >
          {zoomedAvatar && (
            <div className="w-full h-full max-h-[90vh] flex items-center justify-center p-4">
              <img src={zoomedAvatar} alt="Expanded Avatar" className="max-w-full max-h-full object-contain rounded-xl animate-in zoom-in-95 duration-300 shadow-none border-none" />
            </div>
          )}
        </DialogContent>
      </Dialog>

      <ShareSheet isOpen={isShareSheetOpen} onOpenChange={setIsShareSheetOpen} postUrl={shareUrl} />
      
    </DashboardLayout>
  );
}
