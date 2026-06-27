"use client";

import * as React from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BookOpen, TrendingUp, Map, Ship, Briefcase, Search, Clock, Bookmark, ChevronRight, Lightbulb } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useLanguage } from "@/context/language-context";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

const ARTICLES = [
  { id: "a1", title: "EU Packaging Regulations 2025", description: "Sustainability standards for B2B distributors.", category: "Logistics", time: "12 min read", image: "https://picsum.photos/seed/eu/800/400" },
  { id: "a2", title: "Market Analysis: Jakarta Boom", description: "Why SaaS providers are pivoting to industrial corridors.", category: "Strategy", time: "8 min read", image: "https://picsum.photos/seed/jk/800/400" }
];

export default function KnowledgePage() {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = React.useState("");
  const [savedArticles, setSavedArticles] = React.useState<Record<string, boolean>>({});

  const handleToggleSave = (id: string) => {
    const isSaved = savedArticles[id];
    setSavedArticles(prev => ({ ...prev, [id]: !isSaved }));
    toast({
      title: !isSaved ? "Artikel Disimpan" : "Simpanan Dihapus",
      description: !isSaved ? "Artikel kini tersedia di koleksi Anda." : "Artikel telah dihapus dari koleksi."
    });
  };

  return (
    <DashboardLayout>
      <div className="max-w-xl mx-auto space-y-6 py-2 px-1">
        <header className="space-y-3 text-center">
          <div className="inline-flex items-center gap-1.5 bg-indigo-50 text-accent px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-[0.2em] border border-indigo-100">
             <BookOpen className="size-3" /> Academy of Commerce
          </div>
          <div className="space-y-0.5">
            <h1 className="text-2xl font-black text-slate-900 tracking-tight leading-none">{t('knowledge')} Hub.</h1>
            <p className="text-[11px] text-slate-500 font-medium px-4 leading-relaxed">{t('knowledge_desc')}</p>
          </div>
          <div className="relative max-w-sm mx-auto pt-2">
             <Search className="absolute left-3 top-[calc(50%+4px)] -translate-y-1/2 size-3.5 text-slate-400" />
             <Input placeholder={t('search_placeholder')} className="h-10 pl-9 rounded-xl border-slate-100 shadow-sm text-[13px] font-medium" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
          </div>
        </header>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
           {[
             { label: "Export", icon: Ship, bg: "bg-blue-50 text-blue-600" },
             { label: "Maps", icon: Map, bg: "bg-emerald-50 text-emerald-600" },
             { label: "Trends", icon: TrendingUp, bg: "bg-rose-50 text-rose-600" },
             { label: "Strategy", icon: Briefcase, bg: "bg-amber-50 text-amber-600" }
           ].map((item, i) => (
             <Card key={i} className="p-3 rounded-xl border-slate-100 hover:border-accent group cursor-pointer transition-all text-center space-y-2">
                <div className={`size-10 rounded-lg flex items-center justify-center mx-auto shadow-inner ${item.bg}`}><item.icon className="size-5" /></div>
                <span className="text-[8px] font-black uppercase tracking-widest text-slate-900">{item.label}</span>
             </Card>
           ))}
        </div>

        <div className="space-y-4">
           <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Recent Intelligence</h3>
           <div className="space-y-3">
              {ARTICLES.map((article) => (
                <Card key={article.id} className="overflow-hidden border-slate-100 rounded-2xl bg-white group hover:shadow-md transition-all flex flex-col">
                   <div className="h-32 relative overflow-hidden"><img src={article.image} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt={article.title} /></div>
                   <CardContent className="p-4 space-y-2">
                      <div className="flex items-center justify-between"><span className="text-[8px] font-black uppercase text-accent">{article.category}</span><div className="flex items-center gap-1 text-[8px] font-bold text-slate-400"><Clock className="size-2.5" />{article.time}</div></div>
                      <h4 className="text-[15px] font-black text-slate-900 leading-tight group-hover:text-accent transition-colors">{article.title}</h4>
                      <p className="text-slate-500 font-medium text-[11px] line-clamp-2 leading-relaxed">{article.description}</p>
                      <div className="pt-3 flex items-center justify-between border-t border-slate-50">
                         <div className="flex items-center gap-1.5"><div className="size-5 rounded-full bg-slate-100 flex items-center justify-center text-[7px] font-black shadow-inner">T</div><span className="text-[8px] font-black text-slate-400 uppercase">Tapp Intel</span></div>
                         <div className="flex gap-1">
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              onClick={() => handleToggleSave(article.id)}
                              className={cn("size-7 rounded-lg transition-colors", savedArticles[article.id] ? "text-primary bg-primary/5" : "text-slate-300")}
                            >
                              <Bookmark className={cn("size-3.5", savedArticles[article.id] && "fill-current")} />
                            </Button>
                            <Button variant="ghost" size="icon" className="size-7 rounded-lg"><ChevronRight className="size-3.5" /></Button>
                         </div>
                      </div>
                   </CardContent>
                </Card>
              ))}
           </div>

           <Card className="rounded-[2rem] bg-slate-900 text-white p-6 relative overflow-hidden shadow-xl mt-6">
              <div className="relative z-10 space-y-4">
                <div className="size-10 rounded-xl bg-accent flex items-center justify-center shadow-lg shadow-accent/20"><Lightbulb className="size-5 text-white fill-white" /></div>
                <div className="space-y-0.5">
                  <h3 className="text-lg font-black tracking-tight leading-none">Personalized Syllabus</h3>
                  <p className="text-slate-400 text-[11px] font-medium leading-relaxed">Based on your activity, we recommend custom trade modules.</p>
                </div>
                <Button className="w-full bg-white text-slate-900 font-black rounded-xl h-10 text-[10px] uppercase tracking-widest shadow-lg">View My Academy</Button>
              </div>
              <div className="absolute top-0 right-0 w-32 h-32 bg-accent/20 rounded-full blur-[60px] -mr-16 -mt-16" />
           </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
