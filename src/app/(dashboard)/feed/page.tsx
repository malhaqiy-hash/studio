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
  Bookmark
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/context/language-context";
import { translateText } from "@/ai/flows/translate-flow";
import { cn } from "@/lib/utils";
import useEmblaCarousel from 'embla-carousel-react';
import { useToast } from "@/hooks/use-toast";

const CATEGORIES = [
  { id: 'for-you', label: 'For You', icon: Brain },
  { id: 'lokal', label: 'Lokal', icon: MapPin },
  { id: 'global', label: 'Global', icon: Globe },
  { id: 'trending', label: 'Trending', icon: TrendingUp },
];

const MOCK_POSTS = [
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
  const [activeCategory, setActiveCategory] = React.useState('for-you');
  const [translations, setTranslations] = React.useState<Record<string, { text: string, show: boolean, loading: boolean }>>({});
  const [savedPosts, setSavedPosts] = React.useState<string[]>([]);
  
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

  return (
    <DashboardLayout>
      <div className="flex flex-col h-[calc(100vh-160px)] max-w-2xl mx-auto relative overflow-hidden">
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
                {MOCK_POSTS.map((post) => {
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
                              <img src={post.image} alt="Content" className="w-full h-auto object-cover max-h-[300px]" />
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

        <button onClick={() => window.dispatchEvent(new CustomEvent('open-ai-assistant'))} className="absolute bottom-6 right-6 size-14 bg-accent text-accent-foreground rounded-2xl shadow-2xl flex items-center justify-center hover:scale-110 transition-all z-30 active:scale-95">
          <Zap className="size-6 fill-current" />
        </button>
      </div>
    </DashboardLayout>
  );
}
