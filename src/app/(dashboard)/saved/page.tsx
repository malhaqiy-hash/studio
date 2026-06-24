
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
import { useAccount } from "@/context/account-context";
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
    <div className="relative group/carousel w-full overflow-hidden rounded-xl border border-slate-100 bg-slate-50">
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
              className="w-full h-auto object-contain cursor-pointer max-h-[300px]" 
              alt={`Saved ${idx + 1}`} 
              onClick={() => setIsZoomOpen(true)} 
            />
          </SwiperSlide>
        ))}
      </Swiper>

      {images.length > 1 && (
        <>
          <button 
            type="button"
            onClick={() => swiperRef.current?.slidePrev()}
            className="absolute left-2 top-1/2 -translate-y-1/2 z-10 size-7 rounded-full bg-black/40 text-white flex items-center justify-center opacity-0 group-hover/carousel:opacity-100 transition-opacity"
          >
            <ChevronLeft className="size-4" />
          </button>
          <button 
            type="button"
            onClick={() => swiperRef.current?.slideNext()}
            className="absolute right-2 top-1/2 -translate-y-1/2 z-10 size-7 rounded-full bg-black/40 text-white flex items-center justify-center opacity-0 group-hover/carousel:opacity-100 transition-opacity"
          >
            <ChevronRight className="size-4" />
          </button>
          <div className="absolute top-2 right-2 bg-black/50 text-white px-1.5 py-0.5 rounded-md text-[7px] font-black z-10 shadow-sm uppercase tracking-widest">
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
  const { activeAccount } = useAccount();
  const [savedPosts, setSavedPosts] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [zoomedAvatar, setExpandedAvatar] = React.useState<string | null>(null);

  const getStorageKey = React.useCallback(() => `ontapp_saved_posts_${activeAccount.id}`, [activeAccount.id]);

  React.useEffect(() => {
    const saved = localStorage.getItem(getStorageKey());
    if (saved) {
      try {
        setSavedPosts(JSON.parse(saved));
      } catch (e) {
        setSavedPosts([]);
      }
    } else {
      setSavedPosts([]);
    }
    setLoading(false);
  }, [activeAccount.id, getStorageKey]);

  const handleRemove = (postId: string) => {
    const updated = savedPosts.filter(p => p.id !== postId);
    setSavedPosts(updated);
    localStorage.setItem(getStorageKey(), JSON.stringify(updated));
    toast({ title: "Dihapus dari Koleksi" });
  };

  return (
    <DashboardLayout>
      <div className="max-w-xl mx-auto space-y-4 py-2 px-1">
        <header className="space-y-1 px-1">
          <div className="flex items-center gap-1.5 bg-amber-50 text-amber-600 px-2.5 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest w-fit border border-amber-100"><Bookmark className="size-2.5 fill-amber-600" />{t('saved')}</div>
          <h1 className="text-xl font-black text-slate-900 tracking-tight leading-none">{language === 'id' ? 'Koleksi Anda' : 'Your Collection'}</h1>
          <p className="text-slate-500 font-medium text-[11px] leading-snug">{t('saved_desc')}</p>
        </header>

        {loading ? (
          <div className="space-y-3">{[1, 2].map(i => <div key={i} className="h-40 w-full bg-slate-50 animate-pulse rounded-2xl" />)}</div>
        ) : savedPosts.length > 0 ? (
          <div className="grid gap-3">
            {savedPosts.map((post) => (
              <Card key={post.id} className="group rounded-2xl border-slate-100 shadow-sm hover:shadow-md transition-all overflow-hidden bg-white">
                <CardContent className="p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <Avatar 
                        className="size-9 border border-slate-100 cursor-pointer shadow-sm"
                        onClick={() => post.avatar && setExpandedAvatar(post.avatar)}
                      >
                        <AvatarImage src={post.avatar} />
                        <AvatarFallback className="bg-indigo-50 text-accent font-black text-[9px]">{post.author?.[0] || '?'}</AvatarFallback>
                      </Avatar>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <Link href="/profile" className="hover:underline decoration-accent/50 underline-offset-2"><h4 className="font-black text-slate-900 text-[12px] truncate">{post.author}</h4></Link>
                          {post.verified && <ShieldCheck className="size-3 text-emerald-500 shrink-0" />}
                        </div>
                        <div className="flex items-center gap-1.5 text-[8px] text-slate-400 font-bold uppercase tracking-widest"><Clock className="size-2" />{post.time}</div>
                      </div>
                    </div>
                    <Button variant="ghost" size="icon" onClick={() => handleRemove(post.id)} className="size-7 rounded-lg text-slate-300 hover:text-rose-500 hover:bg-rose-50"><Trash2 className="size-3.5" /></Button>
                  </div>
                  <div className="space-y-3">
                    <p className="text-slate-700 leading-normal font-medium text-[12px] whitespace-pre-wrap">{post.content}</p>
                    <PostMedia images={post.images || (post.image ? [post.image] : [])} />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="py-12 text-center space-y-4 bg-slate-50/50 rounded-3xl border-2 border-dashed border-slate-100">
             <div className="size-14 rounded-full bg-white flex items-center justify-center mx-auto shadow-md"><Bookmark className="size-6 text-slate-200" /></div>
             <h3 className="text-sm font-black text-slate-900">{language === 'id' ? 'Belum Ada Koleksi' : 'Empty Collection'}</h3>
             <Button onClick={() => (window.location.href = '/feed')} className="rounded-xl bg-slate-900 hover:bg-black px-6 h-10 font-black shadow-lg text-white text-[10px] uppercase tracking-widest active:scale-95 transition-all">Explore Feed</Button>
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
