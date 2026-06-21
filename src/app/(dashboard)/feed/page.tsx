"use client";

import * as React from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
  Plus,
  Image as ImageIcon,
  Camera,
  Link2,
  X,
  Youtube,
  Linkedin,
  Instagram,
  Facebook,
  Music,
  ShoppingBag,
  MessageCircleCode
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
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useRouter } from "next/navigation";
import { useAccount } from "@/context/account-context";

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
    avatar: "",
    category: "Market Trend",
    content: "Permintaan pasar untuk solusi AI infrastruktur di sektor manufaktur meningkat 40% di wilayah Asia Tenggara. Ini adalah waktu yang tepat untuk memperbarui katalog produk Anda.",
    time: "Baru saja",
    stats: { likes: 1200, comments: 84 },
    verified: true,
    tag: "Trending",
    locationLink: "https://maps.google.com/?q=Southeast+Asia"
  },
  {
    id: "p2",
    type: "post",
    author: "Global Logistics Co.",
    avatar: "https://picsum.photos/seed/log/100",
    category: "Lokal",
    content: "Kami baru saja membuka rute pengiriman baru antara Jakarta dan Surabaya dengan efisiensi waktu 20% lebih cepat. Hubungi kami untuk penawaran khusus member.",
    time: "2 jam yang lalu",
    stats: { likes: 452, comments: 12 },
    verified: true,
    image: "https://picsum.photos/seed/truck/800/400",
    locationLink: "https://maps.google.com/?q=Jakarta"
  },
];

export default function FeedPage() {
  const { language, t } = useLanguage();
  const { toast } = useToast();
  const router = useRouter();
  const { activeAccount, addPost } = useAccount();
  
  const [activeCategory, setActiveCategory] = React.useState('for-you');
  const [posts] = React.useState([...INITIAL_POSTS]);
  const [translations, setTranslations] = React.useState<Record<string, { text: string, show: boolean, loading: boolean }>>({});
  const [savedPosts, setSavedPosts] = React.useState<string[]>([]);
  
  // State for likes interaction
  const [likes, setLikes] = React.useState<Record<string, { count: number, active: boolean }>>({});

  const [isPostModalOpen, setIsPostModalOpen] = React.useState(false);
  const [postContent, setPostContent] = React.useState("");
  const [postImage, setPostImage] = React.useState<string | null>(null);
  const [postLink, setPostLink] = React.useState("");
  const [isLinkInputOpen, setIsLinkInputOpen] = React.useState(false);
  const [goToProfile, setGoToProfile] = React.useState(false);

  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const cameraInputRef = React.useRef<HTMLInputElement>(null);
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: false, align: 'start' });

  React.useEffect(() => {
    const handleOpen = () => setIsPostModalOpen(true);
    window.addEventListener('open-post-modal', handleOpen);
    return () => window.removeEventListener('open-post-modal', handleOpen);
  }, []);

  const onSelect = React.useCallback(() => {
    if (!emblaApi) return;
    const index = emblaApi.selectedScrollSnap();
    setActiveCategory(CATEGORIES[index].id);
  }, [emblaApi]);

  React.useEffect(() => {
    if (!emblaApi) return;
    emblaApi.on('select', onSelect);
  }, [emblaApi, onSelect]);

  React.useEffect(() => {
    const saved = localStorage.getItem('ontapp_saved_posts');
    if (saved) setSavedPosts(JSON.parse(saved));
    
    // Initialize likes from initial posts
    const initialLikes: Record<string, { count: number, active: boolean }> = {};
    INITIAL_POSTS.forEach(p => {
      initialLikes[p.id] = { count: p.stats.likes, active: false };
    });
    setLikes(initialLikes);
  }, []);

  const scrollTo = (index: number) => {
    if (emblaApi) emblaApi.scrollTo(index);
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

  const handleComment = () => {
    toast({
      title: "Fitur Diskusi",
      description: "Fitur komentar sedang dioptimalkan oleh AI OnTapp untuk menjamin kualitas interaksi B2B.",
    });
  };

  const handleShare = (post: any) => {
    const shareData = {
      title: `OnTapp: ${post.author}`,
      text: post.content,
      url: window.location.href,
    };

    if (navigator.share) {
      navigator.share(shareData).catch(() => {
        navigator.clipboard.writeText(window.location.href);
        toast({ title: "Link Disalin", description: "Tautan postingan telah disalin ke clipboard." });
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast({ title: "Link Disalin", description: "Tautan postingan telah disalin ke clipboard." });
    }
  };

  const handleDetail = (postId: string) => {
    toast({
      title: "Membuka Detail",
      description: "Menyiapkan analisis mendalam untuk postingan ini...",
    });
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
      setTranslations(prev => ({
        ...prev,
        [postId]: { ...prev[postId], show: !prev[postId].show }
      }));
      return;
    }

    setTranslations(prev => ({
      ...prev,
      [postId]: { text: "", show: false, loading: true }
    }));

    try {
      const { translatedText } = await translateText({
        text: content,
        targetLanguage: language
      });
      setTranslations(prev => ({
        ...prev,
        [postId]: { text: translatedText, show: true, loading: false }
      }));
    } catch (err) {
      setTranslations(prev => ({ ...prev, [postId]: { text: "", show: false, loading: false } }));
    }
  };

  const handleCreatePost = () => {
    if (!postContent.trim() && !postImage && !postLink) return;

    const newPostData = {
      title: postContent.slice(0, 30) + "...",
      description: postContent,
      image: postImage || undefined,
      externalLink: postLink || undefined,
      source: 'feed' as const,
      visibility: 'public' as const,
    };

    addPost(newPostData);

    setIsPostModalOpen(false);
    setPostContent("");
    setPostImage(null);
    setPostLink("");
    setIsLinkInputOpen(false);
    toast({ title: "Postingan terbit!" });

    if (goToProfile) {
      router.push("/profile");
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPostImage(reader.result as string);
        toast({ title: "Gambar siap" });
      };
      reader.readAsDataURL(file);
    }
  };

  const getLinkIcon = (url?: string) => {
    if (!url) return null;
    const l = url.toLowerCase();
    if (l.includes('maps.google') || l.includes('goo.gl/maps')) return <MapPin className="size-5 text-rose-500" />;
    if (l.includes('wa.me') || l.includes('whatsapp')) return <MessageCircleCode className="size-5 text-emerald-500" />;
    if (l.includes('instagram')) return <Instagram className="size-5 text-pink-500" />;
    if (l.includes('facebook') || l.includes('fb.com')) return <Facebook className="size-5 text-blue-600" />;
    if (l.includes('tiktok')) return <Music className="size-5 text-foreground" />;
    if (l.includes('youtube') || l.includes('youtu.be')) return <Youtube className="size-5 text-red-600" />;
    if (l.includes('shopee')) return <ShoppingBag className="size-5 text-orange-500" />;
    if (l.includes('tokopedia')) return <ShoppingBag className="size-5 text-green-500" />;
    if (l.includes('linkedin')) return <Linkedin className="size-5 text-blue-700" />;
    return <Link2 className="size-5 text-accent" />;
  };

  const combinedPosts = React.useMemo(() => {
    const userPosts = (activeAccount.items || [])
      .filter(item => item.source === 'feed')
      .map(item => ({
        id: item.id,
        type: "post",
        author: activeAccount.name,
        avatar: activeAccount.avatar,
        category: "Koleksi",
        content: item.description || "",
        image: item.image,
        externalLink: item.externalLink,
        time: item.timestamp || "Baru saja",
        stats: { likes: 0, comments: 0 },
        verified: activeAccount.verificationStatus === 'Verified'
      }));
    
    const all = [...userPosts, ...posts];
    return all.filter((v, i, a) => a.findIndex(t => t.id === v.id) === i);
  }, [activeAccount.items, activeAccount.name, activeAccount.avatar, activeAccount.verificationStatus, posts]);

  return (
    <DashboardLayout>
      <div className="flex flex-col h-[calc(100vh-160px)] max-w-2xl mx-auto relative overflow-hidden">
        <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />
        <input type="file" ref={cameraInputRef} className="hidden" accept="image/*" capture="environment" onChange={handleFileChange} />
        
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

        <div className="flex-1 overflow-hidden" ref={emblaRef}>
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
                  
                  return (
                    <div key={`${cat.id}-${post.id}`} className="snap-start snap-always w-full min-h-[400px] flex flex-col mb-4">
                      <Card className="border border-border shadow-sm rounded-[2.5rem] overflow-hidden bg-card flex-1 flex flex-col hover:shadow-md transition-shadow">
                        <div className="p-6 pb-2 flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <Avatar className="size-10 border border-border">
                              <AvatarImage src={post.avatar} className="object-cover" />
                              <AvatarFallback className="bg-accent/10 text-accent font-bold">{post.author[0]}</AvatarFallback>
                            </Avatar>
                            <div className="flex flex-col">
                              <div className="flex items-center gap-2">
                                <h3 className="font-black text-foreground text-sm">{post.author}</h3>
                                {post.verified && <ShieldCheck className="size-3.5 text-emerald-500" />}
                              </div>
                              <div className="flex items-center gap-2 text-[10px] text-muted-foreground font-bold uppercase">
                                <Clock className="size-2.5" /> {post.time}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <button onClick={() => handleSavePost(post)} className={cn("p-2 rounded-full transition-all", isSaved ? "text-accent bg-accent/10" : "text-muted-foreground hover:bg-muted")}>
                              <Bookmark className={cn("size-5", isSaved && "fill-accent")} />
                            </button>
                          </div>
                        </div>

                        <CardContent className="px-8 py-4 flex-1 space-y-4">
                          {post.type === 'insight' && (
                            <div className="inline-flex items-center gap-2 bg-accent/10 text-accent px-3 py-1 rounded-full text-[9px] font-black uppercase border border-accent/20">
                              <Brain className="size-2.5 animate-pulse" /> AI Analysis
                            </div>
                          )}
                          <p className={cn("text-foreground/90 leading-relaxed font-medium", post.type === 'insight' ? "text-lg italic" : "text-base")}>
                            {trans?.show ? trans.text : post.content}
                          </p>
                          {post.image && (
                            <div className="rounded-3xl overflow-hidden border border-border mt-4">
                              <img src={post.image} alt="Content" className="w-full h-auto object-cover max-h-[500px]" />
                            </div>
                          )}
                          {post.externalLink && (
                            <div className="pt-2">
                              <button 
                                onClick={() => window.open(post.externalLink, '_blank')} 
                                className="flex items-center justify-center size-12 bg-accent/10 hover:bg-accent/20 rounded-2xl border border-accent/20 transition-all shadow-sm group"
                                title="Buka Tautan"
                              >
                                {getLinkIcon(post.externalLink)}
                              </button>
                            </div>
                          )}
                        </CardContent>

                        <div className="p-6 pt-0 mt-auto border-t border-border bg-muted/20 flex items-center justify-between">
                          <div className="flex items-center gap-6 text-muted-foreground">
                            <button 
                              onClick={() => handleLike(post.id)}
                              className={cn("flex items-center gap-2 transition-all active:scale-125", postLike.active ? "text-rose-500" : "hover:text-rose-500")}
                            >
                              <Heart className={cn("size-5", postLike.active && "fill-rose-500")} />
                              <span className="text-xs font-black">{postLike.count}</span>
                            </button>
                            
                            <button 
                              onClick={handleComment}
                              className="flex items-center gap-2 hover:text-accent transition-colors"
                            >
                              <MessageCircle className="size-5" />
                              <span className="text-xs font-black">{post.stats.comments}</span>
                            </button>
                            
                            <button onClick={() => handleTranslate(post.id, post.content)} disabled={trans?.loading} className="flex items-center gap-2 hover:text-accent transition-colors">
                              {trans?.loading ? <RefreshCw className="size-4 animate-spin" /> : <Globe className="size-4" />}
                              <span className="text-[10px] font-black uppercase">{trans?.show ? "Original" : "Translate"}</span>
                            </button>
                          </div>
                          
                          <div className="flex gap-2">
                            <button 
                              onClick={() => handleShare(post)}
                              className="p-2 text-muted-foreground hover:text-foreground transition-all active:scale-90"
                            >
                              <Share2 className="size-5" />
                            </button>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => handleDetail(post.id)}
                              className="font-black text-accent hover:bg-accent/10 rounded-xl text-xs gap-1"
                            >
                              Detail <ArrowUpRight className="size-3.5" />
                            </Button>
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
              <DialogTitle className="text-xl font-black">Buat Postingan</DialogTitle>
            </DialogHeader>

            <div className="space-y-4">
              <div className="relative rounded-[1.5rem] bg-muted/30 border border-border/50 p-2">
                <Textarea 
                  placeholder="Apa yang sedang Anda pikirkan?"
                  value={postContent}
                  onChange={(e) => setPostContent(e.target.value)}
                  className="min-h-[140px] rounded-2xl border-none bg-transparent p-4 text-base font-medium focus-visible:ring-0 resize-none"
                />

                <div className="flex items-center gap-2 px-4 py-2 border-t border-border/30">
                  <button 
                    onClick={() => fileInputRef.current?.click()}
                    className="p-2.5 rounded-xl hover:bg-accent/10 text-muted-foreground hover:text-accent transition-all"
                    title="Tambah Galeri"
                  >
                    <ImageIcon className="size-5" />
                  </button>
                  <button 
                    onClick={() => cameraInputRef.current?.click()}
                    className="p-2.5 rounded-xl hover:bg-accent/10 text-muted-foreground hover:text-accent transition-all"
                    title="Ambil Foto"
                  >
                    <Camera className="size-5" />
                  </button>
                  <button 
                    onClick={() => setIsLinkInputOpen(!isLinkInputOpen)}
                    className={cn(
                      "p-2.5 rounded-xl transition-all",
                      isLinkInputOpen ? "bg-accent text-white" : "hover:bg-accent/10 text-muted-foreground hover:text-accent"
                    )}
                    title="Tambah Link"
                  >
                    <Link2 className="size-5" />
                  </button>
                </div>
              </div>

              {isLinkInputOpen && (
                <div className="animate-in slide-in-from-top-2 duration-200">
                  <div className="flex items-center gap-2 bg-muted/50 rounded-xl px-4 h-12">
                    {getLinkIcon(postLink) || <Link2 className="size-5 text-accent" />}
                    <Input 
                      placeholder="Tempel tautan (WA, IG, Maps, dll)..."
                      value={postLink}
                      onChange={(e) => setPostLink(e.target.value)}
                      className="border-none bg-transparent px-0 text-sm font-medium focus-visible:ring-0"
                    />
                  </div>
                </div>
              )}

              {postImage && (
                <div className="relative group rounded-2xl overflow-hidden border border-border bg-muted/30 animate-in zoom-in-95">
                  <img src={postImage} className="w-full h-auto max-h-[300px] object-contain mx-auto" alt="Preview" />
                  <button 
                    onClick={() => setPostImage(null)}
                    className="absolute top-2 right-2 size-8 bg-black/50 text-white rounded-full flex items-center justify-center hover:bg-rose-500 transition-colors"
                  >
                    <X className="size-4" />
                  </button>
                </div>
              )}

              <div className="flex items-center space-x-3 p-3 rounded-xl bg-muted/20 border border-border/20">
                <Checkbox id="go-profile" checked={goToProfile} onCheckedChange={(val) => setGoToProfile(val as boolean)} />
                <Label htmlFor="go-profile" className="text-[11px] font-bold cursor-pointer text-muted-foreground uppercase tracking-tight">Lihat profil setelah posting</Label>
              </div>
            </div>

            <DialogFooter>
              <Button 
                onClick={handleCreatePost}
                disabled={!postContent.trim() && !postImage && !postLink}
                className="w-full h-12 rounded-2xl bg-accent hover:bg-accent/90 text-white font-black text-sm shadow-xl shadow-accent/20 active:scale-[0.98] transition-all"
              >
                Kirim Postingan
              </Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
