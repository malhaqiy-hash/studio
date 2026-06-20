"use client";

import * as React from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BookOpen, TrendingUp, Map, Ship, Briefcase, Search, Clock, Bookmark, ChevronRight, Zap, Lightbulb, Star } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useLanguage } from "@/context/language-context";

const ARTICLES = [
  { id: "a1", title: "EU Packaging Regulations 2025", description: "Sustainability standards for B2B distributors.", category: "Logistics", time: "12 min read", image: "https://picsum.photos/seed/eu/800/400" },
  { id: "a2", title: "Market Analysis: Jakarta Boom", description: "Why SaaS providers are pivoting to industrial corridors.", category: "Strategy", time: "8 min read", image: "https://picsum.photos/seed/jk/800/400" }
];

export default function KnowledgePage() {
  const { t } = useLanguage();
  const [searchTerm, setSearchTerm] = React.useState("");

  return (
    <DashboardLayout>
      <div className="space-y-10 py-6 max-w-7xl mx-auto">
        <header className="space-y-6 text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-indigo-50 text-accent px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest border border-indigo-100">
             <BookOpen className="size-4" /> Academy of Commerce
          </div>
          <h1 className="text-5xl font-black text-slate-900 tracking-tight leading-none">{t('knowledge')} Hub.</h1>
          <p className="text-lg text-slate-500 font-medium">{t('knowledge_desc')}</p>
          <div className="relative max-w-xl mx-auto">
             <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-slate-400" />
             <Input placeholder={t('search_placeholder')} className="h-14 pl-12 rounded-2xl border-slate-200 shadow-xl" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
           {[
             { label: "Export Guides", icon: Ship, color: "text-blue-600", bg: "bg-blue-50" },
             { label: "Market Maps", icon: Map, color: "text-emerald-600", bg: "bg-emerald-50" },
             { label: "Trade Trends", icon: TrendingUp, color: "text-rose-600", bg: "bg-rose-50" },
             { label: "Biz Strategy", icon: Briefcase, color: "text-amber-600", bg: "bg-amber-50" }
           ].map((item, i) => (
             <Card key={i} className="p-6 rounded-[2rem] border-slate-100 hover:border-accent group cursor-pointer transition-all text-center space-y-4">
                <div className={`size-14 rounded-2xl flex items-center justify-center mx-auto ${item.bg} ${item.color}`}><item.icon className="size-7" /></div>
                <span className="text-sm font-black uppercase tracking-widest text-slate-900">{item.label}</span>
             </Card>
           ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
           <div className="lg:col-span-8 space-y-8">
              <h3 className="text-xl font-black text-slate-900">Recent Intelligence</h3>
              <div className="grid gap-8">
                 {ARTICLES.map((article) => (
                   <Card key={article.id} className="overflow-hidden border-slate-100 rounded-[2.5rem] bg-white group hover:shadow-2xl transition-all flex flex-col md:flex-row">
                      <div className="md:w-72 shrink-0 relative overflow-hidden"><img src={article.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={article.title} /></div>
                      <CardContent className="p-8 space-y-4">
                         <div className="flex items-center justify-between"><span className="text-[10px] font-black uppercase text-accent">{article.category}</span><div className="flex items-center gap-1 text-[10px] font-bold text-slate-400"><Clock className="size-3" />{article.time}</div></div>
                         <h4 className="text-2xl font-black text-slate-900 leading-tight group-hover:text-accent transition-colors">{article.title}</h4>
                         <p className="text-slate-500 font-medium line-clamp-2">{article.description}</p>
                         <div className="pt-4 flex items-center justify-between border-t"><div className="flex items-center gap-2"><div className="size-6 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-black">O</div><span className="text-[10px] font-black text-slate-400 uppercase">OnTapp Intel</span></div><div className="flex gap-2"><Button variant="ghost" size="icon" className="rounded-full"><Bookmark className="size-5" /></Button><Button variant="ghost" size="icon" className="rounded-full"><ChevronRight className="size-5" /></Button></div></div>
                      </CardContent>
                   </Card>
                 ))}
              </div>
           </div>
           <div className="lg:col-span-4 space-y-8">
              <Card className="rounded-[2.5rem] bg-slate-900 text-white p-10 relative overflow-hidden shadow-2xl">
                 <div className="relative z-10 space-y-8"><div className="size-14 rounded-2xl bg-accent flex items-center justify-center shadow-lg"><Lightbulb className="size-8 text-white fill-white" /></div><div className="space-y-2"><h3 className="text-2xl font-black tracking-tight">Personalized Syllabus</h3><p className="text-slate-400 text-sm font-medium">Based on your activity, we recommend custom trade modules.</p></div><Button className="w-full bg-white text-slate-900 font-black rounded-2xl h-14">View My Academy</Button></div>
                 <div className="absolute top-0 right-0 w-64 h-64 bg-accent/20 rounded-full blur-3xl -mr-32 -mt-32" />
              </Card>
           </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
