"use client";

import * as React from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Bookmark, 
  Trash2, 
  Clock, 
  ShieldCheck, 
  Heart, 
  MessageCircle, 
  ArrowUpRight,
  Sparkles
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/context/language-context";

export default function SavedPostsPage() {
  const { toast } = useToast();
  const { language, t } = useLanguage();
  const [savedPosts, setSavedPosts] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const saved = localStorage.getItem('ontapp_saved_posts_data');
    if (saved) {
      setSavedPosts(JSON.parse(saved));
    }
    setLoading(false);
  }, []);

  const handleRemove = (postId: string) => {
    const updated = savedPosts.filter(p => p.id !== postId);
    setSavedPosts(updated);
    localStorage.setItem('ontapp_saved_posts_data', JSON.stringify(updated));
    
    const ids = JSON.parse(localStorage.getItem('ontapp_saved_posts') || '[]');
    localStorage.setItem('ontapp_saved_posts', JSON.stringify(ids.filter((id: string) => id !== postId)));
    
    toast({ title: language === 'id' ? "Berhasil dihapus" : "Removed successfully" });
  };

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto space-y-8 py-6">
        <header className="space-y-4">
          <div className="flex items-center gap-2 bg-amber-50 text-amber-600 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest w-fit border border-amber-100">
             <Bookmark className="size-3 fill-amber-600" />
             {t('saved')}
          </div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">{language === 'id' ? 'Koleksi Anda' : 'Your Collection'}</h1>
          <p className="text-slate-500 font-medium text-lg max-w-2xl">
            {t('saved_desc')}
          </p>
        </header>

        {loading ? (
          <div className="space-y-4">
            {[1, 2].map(i => <div key={i} className="h-64 w-full bg-slate-100 animate-pulse rounded-[2.5rem]" />)}
          </div>
        ) : savedPosts.length > 0 ? (
          <div className="grid gap-6">
            {savedPosts.map((post) => (
              <Card key={post.id} className="group rounded-[2.5rem] border-slate-100 shadow-sm hover:shadow-xl transition-all overflow-hidden bg-white">
                <CardContent className="p-0">
                  <div className="p-8 space-y-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <Avatar className="size-12 border border-slate-100">
                          <AvatarImage src={post.avatar} />
                          <AvatarFallback className="bg-indigo-50 text-accent font-black">
                            {post.author[0]}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="flex items-center gap-2">
                             <h4 className="font-black text-slate-900">{post.author}</h4>
                             {post.verified && <ShieldCheck className="size-4 text-emerald-500 fill-emerald-50" />}
                          </div>
                          <div className="flex items-center gap-2 text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                             <Clock className="size-3" />
                             {post.time}
                          </div>
                        </div>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => handleRemove(post.id)}
                        className="size-10 rounded-xl text-slate-300 hover:text-rose-500 hover:bg-rose-50 transition-colors"
                      >
                        <Trash2 className="size-5" />
                      </Button>
                    </div>

                    <div className="space-y-4">
                      {post.type === 'insight' && (
                        <div className="inline-flex items-center gap-2 bg-indigo-50 text-accent px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border border-indigo-100">
                          <Sparkles className="size-2.5" />
                          AI Analysis
                        </div>
                      )}
                      <p className={cn(
                        "text-slate-700 leading-relaxed font-medium",
                        post.type === 'insight' ? "text-lg italic" : "text-base"
                      )}>
                        {post.content}
                      </p>
                      {post.image && (
                        <div className="rounded-3xl overflow-hidden border border-slate-100">
                          <img src={post.image} className="w-full h-auto object-cover max-h-[300px]" alt="Post Content" />
                        </div>
                      )}
                    </div>

                    <div className="pt-6 border-t border-slate-50 flex items-center justify-between">
                       <div className="flex items-center gap-6">
                          <div className="flex items-center gap-2 text-slate-400">
                             <Heart className="size-4" />
                             <span className="text-xs font-black">{post.stats?.likes}</span>
                          </div>
                          <div className="flex items-center gap-2 text-slate-400">
                             <MessageCircle className="size-4" />
                             <span className="text-xs font-black">{post.stats?.comments}</span>
                          </div>
                       </div>
                       <Button variant="ghost" className="rounded-xl h-10 px-6 font-black text-accent hover:bg-indigo-50 text-xs gap-2">
                          {language === 'id' ? 'Lihat Postingan Asli' : 'View Original Post'}
                          <ArrowUpRight className="size-4" />
                       </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="py-24 text-center space-y-6 bg-slate-50/50 rounded-[4rem] border-2 border-dashed border-slate-200">
             <div className="size-24 rounded-full bg-white flex items-center justify-center mx-auto shadow-xl">
                <Bookmark className="size-10 text-slate-200" />
             </div>
             <div className="space-y-2">
                <h3 className="text-2xl font-black text-slate-900">{language === 'id' ? 'Belum Ada Koleksi' : 'Empty Collection'}</h3>
                <p className="text-slate-400 max-w-xs mx-auto font-medium">
                  {language === 'id' ? 'Simpan postingan atau wawasan menarik dari beranda untuk melihatnya di sini.' : 'Save interesting posts or insights from the feed to see them here.'}
                </p>
             </div>
             <Button 
               onClick={() => window.location.href = '/feed'}
               className="rounded-2xl bg-slate-900 hover:bg-black px-10 h-14 font-black shadow-lg"
             >
                {language === 'id' ? 'Jelajahi Beranda' : 'Explore Feed'}
             </Button>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
