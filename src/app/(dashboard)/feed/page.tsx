
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
  Zap, 
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
  Type,
  X,
  Smartphone,
  Cloud,
  CheckCircle2
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
    stats: { likes: "1.2k", comments: "84" },
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
    stats: { likes: "452", comments: "12" },
    verified: true,
    image: "https://picsum.photos/seed/truck/800/400",
    locationLink: "https://maps.google.com/?q=Jakarta"
  },
  {
    id: "p3",
    type: "opportunity",
    author: "Skyline Ventures",
    avatar: "https://picsum.photos/seed/invest/100",
    category: "Global",
    content: "Mencari mitra strategis di bidang EdTech untuk ekspansi ke pasar Eropa Timur. Kami menyediakan dukungan pendanaan dan akses jaringan distribusi.",
    time: "5 jam yang lalu",
    stats: { likes: "890", comments: "45" },
    verified: false,
    urgent: true,
    locationLink: "https://maps.google.com/?q=Brussels"
  }
];

export default function FeedPage() {
  const { language } = useLanguage();
  const { toast } = useToast();
  const router = useRouter();
  const { activeAccount } = useAccount();
  
  const [activeCategory, setActiveCategory] = React.useState('for-you');
  const [posts, setPosts] = React.useState(INITIAL_POSTS);
  const [translations, setTranslations] = React.useState<Record<string, { text: string, show: boolean, loading: boolean }>>({});
  const [savedPosts, setSavedPosts] = React.useState<string[]>([]);
  
  const [isPostModalOpen, setIsPostModalOpen] = React.useState(false);
  const [isMediaPickerOpen, setIsMediaPickerOpen] = React.useState(false);
  const [postType, setPostType] = React.useState<'text' | 'image'>('text');
  const [postContent, setPostContent] = React.useState("");
  const [postImage, setPostImage] = React.useState<string | null>(null);
  const [goToProfile, setGoToProfile] = React.useState(false);
  const [isCloudLoading, setIsCloudLoading] = React.useState(false);

  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: false, align: 'start' });

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
  }, []);

  const scrollTo = (index: number) => {
    if (emblaApi) emblaApi.scrollTo(index);
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
    if (!postContent.trim() && !postImage) return;

    const newPost = {
      id: `p-${Date.now()}`,
      type: "post",
      author: activeAccount.name,
      avatar: activeAccount.avatar,
      category: "Baru",
      content: postContent,
      image: postImage || undefined,
      time: "Baru saja",
      stats: { likes: "0", comments: "0" },
      verified: activeAccount.verificationStatus === 'Verified',
    };

    setPosts([newPost, ...posts]);
    setIsPostModalOpen(false);
    setPostContent("");
    setPostImage(null);
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
        setIsMediaPickerOpen(false);
        setPostType('image');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCloudSource = (source: 'drive' | 'photos') => {
    setIsCloudLoading(true);
    toast({ title: `Menghubungkan ${source}...` });
    setTimeout(() => {
      setPostImage(`https://picsum.photos/seed/post${Date.now()}/800/600`);
      setIsCloudLoading(false);
      setIsMediaPickerOpen(false);
      setPostType('image');
      toast({ title: "Gambar terimpor" });
    }, 1200);
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col h-[calc(100vh-160px)] max-w-2xl mx-auto relative overflow-hidden">
        <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />
        
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
                {posts.map((post) => {
                  const trans = translations[post.id];
                  const isSaved = savedPosts.includes(post.id);
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
                            <Badge variant="outline" className="text-[9px] font-black uppercase text-muted-foreground">{cat.label}</Badge>
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
                          {post.locationLink && (
                            <button onClick={() => window.open(post.locationLink, '_blank')} className="flex items-center gap-2 text-[10px] font-black uppercase text-rose-500 bg-rose-500/10 px-3 py-1.5 rounded-lg">
                              <MapPin className="size-3.5" /> Lihat Lokasi
                            </button>
                          )}
                        </CardContent>

                        <div className="p-6 pt-0 mt-auto border-t border-border bg-muted/20 flex items-center justify-between">
                          <div className="flex items-center gap-6 text-muted-foreground">
                            <button className="flex items-center gap-2 hover:text-rose-500 transition-colors"><Heart className="size-5" /><span className="text-xs font-black">{post.stats.likes}</span></button>
                            <button className="flex items-center gap-2 hover:text-accent transition-colors"><MessageCircle className="size-5" /><span className="text-xs font-black">{post.stats.comments}</span></button>
                            <button onClick={() => handleTranslate(post.id, post.content)} disabled={trans?.loading} className="flex items-center gap-2 hover:text-accent transition-colors">
                              {trans?.loading ? <RefreshCw className="size-4 animate-spin" /> : <Globe className="size-4" />}
                              <span className="text-[10px] font-black uppercase">{trans?.show ? "Original" : "Translate"}</span>
                            </button>
                          </div>
                          <div className="flex gap-2">
                            <button className="p-2 text-muted-foreground hover:text-foreground"><Share2 className="size-5" /></button>
                            <Button variant="ghost" size="sm" className="font-black text-accent hover:bg-accent/10 rounded-xl text-xs gap-1">Detail <ArrowUpRight className="size-3.5" /></Button>
                          </div>
                        </div>
                      </Card>
                    </div>
                  );
                })}
                <div className="py-20 text-center space-y-4 opacity-50">
                   <div className="size-8 border-2 border-muted border-t-accent rounded-full animate-spin mx-auto" />
                   <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Memuat...</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="absolute bottom-6 right-6 flex flex-col gap-4 items-center z-30">
          <button 
            onClick={() => setIsPostModalOpen(true)}
            className="size-14 bg-accent text-accent-foreground rounded-full shadow-2xl flex items-center justify-center hover:scale-110 transition-all active:scale-95 border-4 border-background"
          >
            <Plus className="size-7" />
          </button>
          
          <button 
            onClick={() => window.dispatchEvent(new CustomEvent('open-ai-assistant'))} 
            className="size-14 bg-accent text-accent-foreground rounded-2xl shadow-2xl flex items-center justify-center hover:scale-110 transition-all active:scale-95"
          >
            <Zap className="size-6 fill-current" />
          </button>
        </div>
      </div>

      {/* Post Creation Modal */}
      <Dialog open={isPostModalOpen} onOpenChange={setIsPostModalOpen}>
        <DialogContent className="max-w-xl rounded-[2.5rem] p-0 border-none shadow-2xl overflow-hidden bg-card text-foreground">
          <div className="p-8 space-y-6">
            <DialogHeader>
              <DialogTitle className="text-2xl font-black flex items-center gap-3">
                <div className="size-10 rounded-xl bg-accent/10 text-accent flex items-center justify-center">
                  <Plus className="size-6" />
                </div>
                Buat Postingan Baru
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-6">
              <div className="flex gap-4 p-1 bg-muted rounded-2xl">
                <button 
                  onClick={() => setPostType('text')}
                  className={cn("flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-xs transition-all", postType === 'text' ? "bg-card shadow-sm text-accent" : "text-muted-foreground")}
                >
                  <Type className="size-4" /> Threads
                </button>
                <button 
                  onClick={() => setIsMediaPickerOpen(true)}
                  className={cn("flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-xs transition-all", postType === 'image' ? "bg-card shadow-sm text-accent" : "text-muted-foreground")}
                >
                  <ImageIcon className="size-4" /> Facebook Style
                </button>
              </div>

              <div className="space-y-4">
                <Textarea 
                  placeholder={postType === 'text' ? "Apa yang sedang Anda pikirkan?" : "Tulis keterangan foto..."}
                  value={postContent}
                  onChange={(e) => setPostContent(e.target.value)}
                  className="min-h-[140px] rounded-2xl border-none bg-muted/50 p-6 text-base font-medium focus-visible:ring-accent/10"
                />

                {postImage && (
                  <div className="relative group rounded-2xl overflow-hidden border border-border bg-muted/30">
                    <img src={postImage} className="w-full h-auto max-h-[300px] object-contain mx-auto" alt="Preview" />
                    <button 
                      onClick={() => setPostImage(null)}
                      className="absolute top-2 right-2 size-8 bg-black/50 text-white rounded-full flex items-center justify-center hover:bg-rose-500 transition-colors"
                    >
                      <X className="size-4" />
                    </button>
                  </div>
                )}
              </div>

              <div className="flex items-center space-x-3 p-4 rounded-2xl bg-muted/30 border border-border/50">
                <Checkbox id="go-profile" checked={goToProfile} onCheckedChange={(val) => setGoToProfile(val as boolean)} />
                <Label htmlFor="go-profile" className="text-xs font-bold cursor-pointer text-muted-foreground">Masuk ke halaman profil setelah posting</Label>
              </div>
            </div>

            <DialogFooter className="pt-4">
              <Button 
                onClick={handleCreatePost}
                disabled={!postContent.trim() && !postImage}
                className="w-full h-14 rounded-2xl bg-accent hover:bg-accent/90 text-white font-black text-base shadow-xl shadow-accent/20"
              >
                Publikasikan Sekarang
              </Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>

      {/* Media Picker for Post */}
      <Dialog open={isMediaPickerOpen} onOpenChange={setIsMediaPickerOpen}>
        <DialogContent className="max-w-md rounded-[3rem] p-8 border-none shadow-2xl bg-card text-foreground">
          <DialogHeader className="text-center sm:text-center">
            <DialogTitle className="text-2xl font-black">Pilih Sumber Foto</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-8">
            <Button variant="outline" onClick={() => fileInputRef.current?.click()} className="h-20 rounded-2xl border-border bg-muted/50 hover:bg-accent/10 justify-start gap-6 px-6">
              <Smartphone className="size-6 text-accent" /> <div className="text-left font-black text-sm uppercase">Perangkat</div>
            </Button>
            <Button variant="outline" disabled={isCloudLoading} onClick={() => handleCloudSource('drive')} className="h-20 rounded-2xl border-border bg-muted/50 hover:bg-accent/10 justify-start gap-6 px-6">
              <Cloud className="size-6 text-blue-500" /> <div className="text-left font-black text-sm uppercase">Google Drive {isCloudLoading && "..."}</div>
            </Button>
            <Button variant="outline" disabled={isCloudLoading} onClick={() => handleCloudSource('photos')} className="h-20 rounded-2xl border-border bg-muted/50 hover:bg-accent/10 justify-start gap-6 px-6">
              <ImageIcon className="size-6 text-rose-500" /> <div className="text-left font-black text-sm uppercase">Google Photos {isCloudLoading && "..."}</div>
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
