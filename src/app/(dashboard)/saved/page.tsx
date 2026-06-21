"use client";

import * as React from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Bookmark, 
  Trash2, 
  Clock, 
  ShieldCheck, 
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/context/language-context";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import Link from "next/link";
import { Swiper, SwiperSlide } from 'swiper/react';
import type { Swiper as SwiperType } from 'swiper';
import { Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';

function PostMedia({ images }: { images?: string[] }) {
  const [activeIdx, setActiveIdx] = React.useState(0);
  const [isZoomOpen, setIsZoomOpen] = React.useState(false);
  const swiperRef = React.useRef<SwiperType | null>(null);

  if (!images || images.length === 0) return null;

  return (
    <div className="relative group/carousel w-full overflow-hidden rounded-xl md:rounded-3xl border border-slate-100 bg-slate-50">
      <Swiper
        modules={[Navigation]}
        onSwiper={(swiper) => (swiperRef.current = swiper)}
        onSlideChange={(swiper) => setActiveIdx(swiper.activeIndex)}
        className="w-full"
        slidesPerView={1}
      >
        {images.map((src, idx) => (
          <SwiperSlide key={idx}>
            <img 
              src={src} 
              className="w-full h-auto object-contain cursor-pointer max-h-[350px] md:max-h-[600px]" 
              alt={`Saved ${idx + 1}`} 
              onClick={() => setIsZoomOpen(true)} 
            />
          </SwiperSlide>
        ))}
      </Swiper>

      {images.length > 1 && (
        <>
          <button 
            onClick={() => swiperRef.current?.slidePrev()}
            className="absolute left-2 top-1/2 -translate-y-1/2 z-10 size-8 rounded-full bg-black/50 text-white flex items-center justify-center opacity-0 group-hover/carousel:opacity-100 transition-opacity"
          >
            <ChevronLeft className="size-5" />
          </button>
          <button 
            onClick={() => swiperRef.current?.slideNext()}
            className="absolute right-2 top-1/2 -translate-y-1/2 z-10 size-8 rounded-full bg-black/50 text-white flex items-center justify-center opacity-0 group-hover/carousel:opacity-100 transition-opacity"
          >
            <ChevronRight className="size-5" />
          </button>
          <div className="absolute top-2 right-2 md:top-4 md:right-4 bg-black/60 text-white px-2 py-0.5 rounded-full text-[8px] md:text-[10px] font-black z-10 shadow-sm">
            {activeIdx + 1} / {images.length}
          </div>
        </>
      )}

      <Dialog open={isZoomOpen} onOpenChange={setIsZoomOpen}>
        <DialogContent 
          className="max-w-[100vw] w-screen h-screen p-0 m-0 bg-black/98 border-none shadow-none flex items-center justify-center overflow-hidden outline-none [&>button]:hidden"
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

export default function SavedPostsPage() {
  const { toast } = useToast();
  const { language, t } = useLanguage();
  const [savedPosts, setSavedPosts] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [zoomedAvatar, setExpandedAvatar] = React.useState<string | null>(null);

  React.useEffect(() => {
    const saved = localStorage.getItem('ontapp_saved_posts_data');
    if (saved) setSavedPosts(JSON.parse(saved));
    setLoading(false);
  }, []);

  const handleRemove = (postId: string) => {
    const updated = savedPosts.filter(p => p.id !== postId);
    setSavedPosts(updated);
    localStorage.setItem('ontapp_saved_posts_data', JSON.stringify(updated));
    toast({ title: "Dihapus" });
  };

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto space-y-6 md:space-y-8 py-2 md:py-6">
        <header className="space-y-2 md:space-y-4 px-1">
          <div className="flex items-center gap-2 bg-amber-50 text-amber-600 px-3 py-1 rounded-full text-[9px] md:text-[10px] font-black uppercase tracking-widest w-fit border border-amber-100"><Bookmark className="size-3 fill-amber-600" />{t('saved')}</div>
          <h1 className="text-2xl md:text-4xl font-black text-slate-900 tracking-tight">{language === 'id' ? 'Koleksi Anda' : 'Your Collection'}</h1>
          <p className="text-slate-500 font-medium text-sm md:text-lg max-w-2xl">{t('saved_desc')}</p>
        </header>

        {loading ? (
          <div className="space-y-4">{[1, 2].map(i => <div key={i} className="h-48 md:h-64 w-full bg-slate-100 animate-pulse rounded-xl md:rounded-[2.5rem]" />)}</div>
        ) : savedPosts.length > 0 ? (
          <div className="grid gap-4 md:gap-6">
            {savedPosts.map((post) => (
              <Card key={post.id} className="group rounded-xl md:rounded-[2.5rem] border-slate-100 shadow-sm hover:shadow-xl transition-all overflow-hidden bg-white">
                <CardContent className="p-4 md:p-8 space-y-4 md:space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 md:gap-4">
                      <Avatar 
                        className="size-10 md:size-12 border border-slate-100 cursor-pointer"
                        onClick={() => post.avatar && setExpandedAvatar(post.avatar)}
                      >
                        <AvatarImage src={post.avatar} />
                        <AvatarFallback className="bg-indigo-50 text-accent font-black">{post.author[0]}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="flex items-center gap-1.5 md:gap-2">
                          <Link href="/profile" className="hover:underline decoration-accent/50 underline-offset-2"><h4 className="font-black text-slate-900 text-xs md:text-base">{post.author}</h4></Link>
                          {post.verified && <ShieldCheck className="size-3.5 md:size-4 text-emerald-500" />}
                        </div>
                        <div className="text-[8px] md:text-[10px] font-black text-accent uppercase tracking-tight -mt-0.5">{post.extra}</div>
                        <div className="flex items-center gap-1.5 text-[8px] md:text-[10px] text-slate-400 font-bold uppercase tracking-widest"><Clock className="size-2.5" />{post.time}</div>
                      </div>
                    </div>
                    <Button variant="ghost" size="icon" onClick={() => handleRemove(post.id)} className="size-8 md:size-10 rounded-lg md:rounded-xl text-slate-300 hover:text-rose-500 hover:bg-rose-50"><Trash2 className="size-4 md:size-5" /></Button>
                  </div>
                  <div className="space-y-3 md:space-y-4">
                    <p className="text-slate-700 leading-relaxed font-medium text-xs md:text-base">{post.content}</p>
                    <PostMedia images={post.images || (post.image ? [post.image] : [])} />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="py-16 md:py-24 text-center space-y-6 bg-slate-50/50 rounded-[2rem] md:rounded-[4rem] border-2 border-dashed border-slate-200">
             <div className="size-16 md:size-24 rounded-full bg-white flex items-center justify-center mx-auto shadow-xl"><Bookmark className="size-8 md:size-10 text-slate-200" /></div>
             <h3 className="text-xl md:text-2xl font-black text-slate-900">{language === 'id' ? 'Belum Ada Koleksi' : 'Empty Collection'}</h3>
             <Button onClick={() => (window.location.href = '/feed')} className="rounded-xl md:rounded-2xl bg-slate-900 hover:bg-black px-8 md:px-10 h-11 md:h-14 font-black shadow-lg text-white text-xs md:text-sm">Explore Feed</Button>
          </div>
        )}
      </div>

      <Dialog open={!!zoomedAvatar} onOpenChange={() => setExpandedAvatar(null)}>
        <DialogContent 
          className="max-w-screen-lg p-0 bg-black/98 border-none shadow-none flex items-center justify-center overflow-hidden outline-none [&>button]:hidden cursor-pointer"
          onClick={() => setExpandedAvatar(null)}
        >
          {zoomedAvatar && (
            <div className="w-full h-full max-h-[90vh] flex items-center justify-center p-4">
              <img src={zoomedAvatar} alt="Avatar" className="max-w-full max-h-full object-contain rounded-xl animate-in zoom-in-95 duration-300 shadow-none border-none" />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
