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
  Heart, 
  MessageCircle, 
  ArrowUpRight,
  Brain,
  Share2,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/context/language-context";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import Link from "next/link";
import useEmblaCarousel from 'embla-carousel-react';

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
      <div className="overflow-hidden rounded-3xl border border-slate-100 bg-slate-50 shadow-sm" ref={emblaRef}>
        <div className="flex">
          {images.map((src, idx) => (
            <div key={idx} className="flex-[0_0_100%] min-w-0">
              <img src={src} className="w-full h-auto object-contain cursor-zoom-in max-h-[600px]" alt={`Saved ${idx + 1}`} onClick={() => setExpandedImage(src)} />
            </div>
          ))}
        </div>
      </div>
      {images.length > 1 && (
        <div className="absolute top-4 right-4 bg-black/60 text-white px-3 py-1 rounded-full text-[10px] font-black z-10 shadow-sm">
          {selectedIndex + 1} / {images.length}
        </div>
      )}
      <Dialog open={!!zoomedImage} onOpenChange={() => setExpandedImage(null)}>
        <DialogContent className="max-w-screen-lg p-0 bg-black/98 border-none shadow-none flex items-center justify-center overflow-hidden outline-none [&>button]:hidden">
          {zoomedImage && <div className="w-full h-full max-h-[90vh] flex items-center justify-center p-4 cursor-pointer" onClick={() => setExpandedImage(null)}><img src={zoomedImage} alt="Expanded" onClick={(e) => e.stopPropagation()} className="max-w-full max-h-full object-contain rounded-xl animate-in zoom-in-95 duration-300" /></div>}
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
  const [expandedPosts, setExpandedPosts] = React.useState<Set<string>>(new Set());
  const [likes, setLikes] = React.useState<Record<string, { count: number, active: boolean }>>({});

  React.useEffect(() => {
    const saved = localStorage.getItem('ontapp_saved_posts_data');
    if (saved) {
      const parsed = JSON.parse(saved);
      setSavedPosts(parsed);
      const initialLikes: Record<string, { count: number, active: boolean }> = {};
      parsed.forEach((p: any) => initialLikes[p.id] = { count: p.stats?.likes || 0, active: false });
      setLikes(initialLikes);
    }
    setLoading(false);
  }, []);

  const handleRemove = (postId: string) => {
    const updated = savedPosts.filter(p => p.id !== postId);
    setSavedPosts(updated);
    localStorage.setItem('ontapp_saved_posts_data', JSON.stringify(updated));
    const ids = JSON.parse(localStorage.getItem('ontapp_saved_posts') || '[]');
    localStorage.setItem('ontapp_saved_posts', JSON.stringify(ids.filter((id: string) => id !== postId)));
    toast({ title: "Dihapus" });
  };

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto space-y-8 py-6">
        <header className="space-y-4">
          <div className="flex items-center gap-2 bg-amber-50 text-amber-600 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest w-fit border border-amber-100"><Bookmark className="size-3 fill-amber-600" />{t('saved')}</div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">{language === 'id' ? 'Koleksi Anda' : 'Your Collection'}</h1>
          <p className="text-slate-500 font-medium text-lg max-w-2xl">{t('saved_desc')}</p>
        </header>

        {loading ? (
          <div className="space-y-4">{[1, 2].map(i => <div key={i} className="h-64 w-full bg-slate-100 animate-pulse rounded-[2.5rem]" />)}</div>
        ) : savedPosts.length > 0 ? (
          <div className="grid gap-6">
            {savedPosts.map((post) => (
              <Card key={post.id} className="group rounded-[2.5rem] border-slate-100 shadow-sm hover:shadow-xl transition-all overflow-hidden bg-white">
                <CardContent className="p-8 space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <Avatar className="size-12 border border-slate-100"><AvatarImage src={post.avatar} /><AvatarFallback className="bg-indigo-50 text-accent font-black">{post.author[0]}</AvatarFallback></Avatar>
                      <div>
                        <div className="flex items-center gap-2"><Link href="/profile" className="hover:underline decoration-accent/50 underline-offset-2"><h4 className="font-black text-slate-900">{post.author}</h4></Link>{post.verified && <ShieldCheck className="size-4 text-emerald-500" />}</div>
                        <div className="text-[10px] font-black text-accent uppercase tracking-tight -mt-0.5">{post.extra}</div>
                        <div className="flex items-center gap-2 text-[10px] text-slate-400 font-bold uppercase tracking-widest"><Clock className="size-3" />{post.time}</div>
                      </div>
                    </div>
                    <Button variant="ghost" size="icon" onClick={() => handleRemove(post.id)} className="size-10 rounded-xl text-slate-300 hover:text-rose-500 hover:bg-rose-50"><Trash2 className="size-5" /></Button>
                  </div>
                  <div className="space-y-4">
                    <p className="text-slate-700 leading-relaxed font-medium">{post.content}</p>
                    <PostMedia images={post.images || (post.image ? [post.image] : [])} />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="py-24 text-center space-y-6 bg-slate-50/50 rounded-[4rem] border-2 border-dashed border-slate-200">
             <div className="size-24 rounded-full bg-white flex items-center justify-center mx-auto shadow-xl"><Bookmark className="size-10 text-slate-200" /></div>
             <h3 className="text-2xl font-black text-slate-900">{language === 'id' ? 'Belum Ada Koleksi' : 'Empty Collection'}</h3>
             <Button onClick={() => window.location.href = '/feed'} className="rounded-2xl bg-slate-900 hover:bg-black px-10 h-14 font-black shadow-lg">Explore Feed</Button>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
