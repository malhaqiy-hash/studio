
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
  Sparkles, 
  Heart, 
  MessageCircle, 
  Share2, 
  Clock, 
  ShieldCheck,
  RefreshCw,
  ArrowUpRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/context/language-context";
import { translateText } from "@/ai/flows/translate-flow";
import { cn } from "@/lib/utils";
import useEmblaCarousel from 'embla-carousel-react';

const CATEGORIES = [
  { id: 'for-you', label: 'For You', icon: Sparkles },
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
    tag: "Trending"
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
    image: "https://picsum.photos/seed/truck/800/400"
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
    urgent: true
  }
];

export default function DashboardPage() {
  const { language } = useLanguage();
  const [activeCategory, setActiveCategory] = React.useState('for-you');
  const [translations, setTranslations] = React.useState<Record<string, { text: string, show: boolean, loading: boolean }>>({});
  
  // Carousel State
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

  const scrollTo = (index: number) => {
    if (emblaApi) emblaApi.scrollTo(index);
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
      console.error(err);
      setTranslations(prev => ({
        ...prev,
        [postId]: { text: "", show: false, loading: false }
      }));
    }
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col h-[calc(100vh-140px)] max-w-2xl mx-auto relative overflow-hidden">
        
        {/* Category Navigation (Horizontal) */}
        <div className="flex items-center justify-center gap-1 mb-6 sticky top-0 z-20 bg-slate-50/80 backdrop-blur-sm py-2">
          {CATEGORIES.map((cat, idx) => (
            <button
              key={cat.id}
              onClick={() => scrollTo(idx)}
              className={cn(
                "px-5 py-2 rounded-full text-xs font-bold transition-all flex items-center gap-2",
                activeCategory === cat.id 
                  ? "bg-slate-900 text-white shadow-lg scale-105" 
                  : "bg-white text-slate-400 hover:bg-slate-100"
              )}
            >
              <cat.icon className="size-3" />
              {cat.label}
            </button>
          ))}
        </div>

        {/* Swipeable Columns Container */}
        <div className="flex-1 overflow-hidden" ref={emblaRef}>
          <div className="flex h-full">
            {CATEGORIES.map((cat) => (
              <div 
                key={cat.id} 
                className="flex-[0_0_100%] min-w-0 h-full overflow-y-auto snap-y snap-mandatory no-scrollbar space-y-4 pb-10 px-1"
              >
                {/* Specific Post for each category (simulated by shuffling or filtering) */}
                {MOCK_POSTS.map((post) => {
                  const trans = translations[post.id];
                  return (
                    <div 
                      key={`${cat.id}-${post.id}`} 
                      className="snap-start snap-always w-full min-h-[400px] flex flex-col mb-4"
                    >
                      <Card className="border-none shadow-sm rounded-[2.5rem] overflow-hidden bg-white flex-1 flex flex-col hover:shadow-md transition-shadow">
                        {/* Post Header */}
                        <div className="p-6 pb-2 flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <Avatar className="size-10 border border-slate-100">
                              <AvatarImage src={post.avatar} />
                              <AvatarFallback className="bg-indigo-50 text-accent font-bold">
                                {post.author[0]}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex flex-col">
                              <div className="flex items-center gap-2">
                                <h3 className="font-black text-slate-900 text-sm">{post.author}</h3>
                                {post.verified && <ShieldCheck className="size-3.5 text-emerald-500 fill-emerald-50" />}
                              </div>
                              <div className="flex items-center gap-2 text-[10px] text-slate-400 font-bold uppercase tracking-tight">
                                <Clock className="size-2.5" />
                                {post.time}
                              </div>
                            </div>
                          </div>
                          <Badge variant="outline" className="text-[9px] font-black uppercase border-slate-100 text-slate-400">
                            {cat.label}
                          </Badge>
                        </div>

                        {/* Post Content */}
                        <CardContent className="px-8 py-4 flex-1 space-y-4">
                          {post.type === 'insight' && (
                            <div className="inline-flex items-center gap-2 bg-indigo-50 text-accent px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border border-indigo-100">
                              <Sparkles className="size-2.5 animate-pulse" />
                              AI Analysis
                            </div>
                          )}
                          
                          {post.urgent && (
                            <Badge className="bg-rose-50 text-rose-600 border-none font-black text-[9px] uppercase mb-2">
                              Peluang Mendesak
                            </Badge>
                          )}

                          <div className="relative">
                            <p className={cn(
                              "text-slate-700 leading-relaxed font-medium",
                              post.type === 'insight' ? "text-lg italic" : "text-base"
                            )}>
                              {trans?.show ? trans.text : post.content}
                            </p>
                            
                            {trans?.show && (
                              <div className="mt-3 flex items-center gap-2 text-[9px] font-black text-accent uppercase tracking-widest bg-indigo-50/50 w-fit px-2 py-1 rounded-md">
                                <RefreshCw className="size-2.5" />
                                Diterjemahkan oleh AI
                              </div>
                            )}
                          </div>

                          {post.image && (
                            <div className="rounded-3xl overflow-hidden border border-slate-50 mt-4">
                              <img src={post.image} alt="Content" className="w-full h-auto object-cover max-h-[300px]" />
                            </div>
                          )}
                        </CardContent>

                        {/* Post Footer / Actions */}
                        <div className="p-6 pt-0 mt-auto border-t border-slate-50 bg-slate-50/30 flex items-center justify-between">
                          <div className="flex items-center gap-6">
                            <button className="flex items-center gap-2 text-slate-400 hover:text-rose-500 transition-colors group">
                              <Heart className="size-5 group-hover:fill-rose-500" />
                              <span className="text-xs font-black">{post.stats.likes}</span>
                            </button>
                            <button className="flex items-center gap-2 text-slate-400 hover:text-accent transition-colors">
                              <MessageCircle className="size-5" />
                              <span className="text-xs font-black">{post.stats.comments}</span>
                            </button>
                            <button 
                              onClick={() => handleTranslate(post.id, post.content)}
                              disabled={trans?.loading}
                              className={cn(
                                "flex items-center gap-2 text-slate-400 hover:text-indigo-600 transition-colors",
                                trans?.loading && "animate-pulse"
                              )}
                            >
                              {trans?.loading ? <RefreshCw className="size-4 animate-spin" /> : <Globe className="size-4" />}
                              <span className="text-[10px] font-black uppercase tracking-tighter">
                                {trans?.show ? "Original" : "Translate"}
                              </span>
                            </button>
                          </div>
                          <div className="flex gap-2">
                            <button className="p-2 text-slate-300 hover:text-slate-500 transition-colors">
                              <Share2 className="size-5" />
                            </button>
                            <Button variant="ghost" size="sm" className="font-black text-accent hover:bg-indigo-50 rounded-xl text-xs gap-1">
                              Detail
                              <ArrowUpRight className="size-3.5" />
                            </Button>
                          </div>
                        </div>
                      </Card>
                    </div>
                  );
                })}

                {/* Loading State Footer for each column */}
                <div className="py-20 text-center space-y-4 opacity-50">
                   <div className="size-8 border-2 border-slate-200 border-t-accent rounded-full animate-spin mx-auto" />
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Memuat lebih banyak...</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Global Action Floating Button */}
        <button 
          className="absolute bottom-6 right-6 size-14 bg-slate-900 text-white rounded-2xl shadow-2xl flex items-center justify-center hover:bg-black hover:scale-110 transition-all z-30 active:scale-95"
        >
          <Zap className="size-6 fill-white" />
        </button>
      </div>

      <style jsx global>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </DashboardLayout>
  );
}
