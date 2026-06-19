
"use client";

import * as React from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  BookOpen, 
  Globe, 
  TrendingUp, 
  ChevronRight, 
  Sparkles, 
  Map, 
  Ship, 
  Briefcase,
  Search,
  Star,
  Zap,
  Bookmark
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const ARTICLES = [
  {
    id: "a1",
    title: "Navigating EU Packaging Regulations 2025",
    description: "Complete guide on new sustainability standards for B2B distributors entering the European market.",
    type: "Guide",
    category: "Logistics",
    time: "12 min read",
    author: "OnTapp Intelligence",
    image: "https://picsum.photos/seed/eu/800/400"
  },
  {
    id: "a2",
    title: "Market Analysis: Jakarta's Tech Boom",
    description: "Deep dive into why SaaS infrastructure providers are pivoting to West Jakarta's industrial corridor.",
    type: "Analysis",
    category: "Strategy",
    time: "8 min read",
    author: "Strategic Partners Lab",
    image: "https://picsum.photos/seed/jk/800/400"
  },
  {
    id: "a3",
    title: "Exporting to Japan: A Cultural Handbook",
    description: "Essential business etiquette and negotiation styles for Southeast Asian entrepreneurs.",
    type: "Insight",
    category: "Culture",
    time: "15 min read",
    author: "Global Trade Desk",
    image: "https://picsum.photos/seed/jp/800/400"
  }
];

export default function KnowledgePage() {
  const [searchTerm, setSearchTerm] = React.useState("");

  return (
    <DashboardLayout>
      <div className="space-y-10 py-6 max-w-7xl mx-auto">
        <header className="space-y-6 text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-indigo-50 text-accent px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest border border-indigo-100">
             <BookOpen className="size-4" />
             Academy of Commerce
          </div>
          <h1 className="text-5xl font-black text-slate-900 tracking-tight leading-none">
            Business <span className="text-accent italic">Intelligence</span> Hub.
          </h1>
          <p className="text-lg text-slate-500 font-medium">
            Personalized insights and global trade knowledge designed to scale your enterprise beyond borders.
          </p>
          <div className="relative max-w-xl mx-auto">
             <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-slate-400" />
             <Input 
                placeholder="Search guides, analysis, or market reports..." 
                className="h-14 pl-12 rounded-2xl border-slate-200 bg-white shadow-xl focus:ring-accent/10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
             />
          </div>
        </header>

        {/* Intelligence Quick Access */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
           {[
             { label: "Export Guides", icon: Ship, color: "text-blue-600", bg: "bg-blue-50" },
             { label: "Market Maps", icon: Map, color: "text-emerald-600", bg: "bg-emerald-50" },
             { label: "Trade Trends", icon: TrendingUp, color: "text-rose-600", bg: "bg-rose-50" },
             { label: "Biz Strategy", icon: Briefcase, color: "text-amber-600", bg: "bg-amber-50" }
           ].map((item, i) => (
             <Card key={i} className="p-6 rounded-[2rem] border-slate-100 hover:border-accent group cursor-pointer transition-all hover:shadow-lg text-center space-y-4">
                <div className={cn("size-14 rounded-2xl flex items-center justify-center mx-auto transition-transform group-hover:rotate-12", item.bg, item.color)}>
                   <item.icon className="size-7" />
                </div>
                <span className="text-sm font-black uppercase tracking-widest text-slate-900">{item.label}</span>
             </Card>
           ))}
        </div>

        {/* Featured Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
           <div className="lg:col-span-8 space-y-8">
              <div className="flex items-center justify-between px-2">
                 <h3 className="text-xl font-black text-slate-900 tracking-tight">Recent Intelligence</h3>
                 <Button variant="ghost" className="text-xs font-black uppercase text-accent tracking-widest">See All Library</Button>
              </div>

              <div className="grid gap-8">
                 {ARTICLES.map((article) => (
                   <Card key={article.id} className="overflow-hidden border-slate-100 rounded-[2.5rem] bg-white group hover:shadow-2xl transition-all">
                      <div className="flex flex-col md:flex-row">
                         <div className="md:w-72 shrink-0 relative overflow-hidden">
                            <img src={article.image} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt={article.title} />
                            <div className="absolute top-4 left-4">
                               <Badge className="bg-white/90 backdrop-blur text-slate-900 font-black text-[10px] uppercase tracking-widest shadow-sm">{article.type}</Badge>
                            </div>
                         </div>
                         <CardContent className="p-8 space-y-4">
                            <div className="flex items-center justify-between">
                               <span className="text-[10px] font-black uppercase tracking-[0.2em] text-accent">{article.category}</span>
                               <div className="flex items-center gap-1 text-[10px] font-bold text-slate-400">
                                  <Clock className="size-3" />
                                  {article.time}
                               </div>
                            </div>
                            <h4 className="text-2xl font-black text-slate-900 leading-tight group-hover:text-accent transition-colors">{article.title}</h4>
                            <p className="text-slate-500 font-medium leading-relaxed line-clamp-2">{article.description}</p>
                            <div className="pt-4 flex items-center justify-between border-t border-slate-50">
                               <div className="flex items-center gap-2">
                                  <div className="size-6 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-black text-slate-400">O</div>
                                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{article.author}</span>
                               </div>
                               <div className="flex gap-2">
                                  <Button variant="ghost" size="icon" className="rounded-full text-slate-300 hover:text-accent"><Bookmark className="size-5" /></Button>
                                  <Button variant="ghost" size="icon" className="rounded-full text-slate-300 hover:text-accent"><ChevronRight className="size-5" /></Button>
                               </div>
                            </div>
                         </CardContent>
                      </div>
                   </Card>
                 ))}
              </div>
           </div>

           {/* Sidebar: AI Personalized Recs */}
           <div className="lg:col-span-4 space-y-8">
              <Card className="rounded-[2.5rem] bg-slate-900 text-white overflow-hidden relative shadow-2xl">
                 <CardContent className="p-10 space-y-8 relative z-10">
                    <div className="size-14 rounded-2xl bg-accent flex items-center justify-center rotate-3 shadow-lg mb-4">
                       <Sparkles className="size-8 text-white fill-white" />
                    </div>
                    <div className="space-y-2">
                       <h3 className="text-2xl font-black tracking-tight">Personalized Academy</h3>
                       <p className="text-slate-400 text-sm font-medium leading-relaxed">
                          Based on your search for <span className="text-indigo-300 font-bold">'Organic Logistics'</span>, we recommend these specific modules:
                       </p>
                    </div>
                    <div className="space-y-4">
                       {[
                         "Cold Chain Tech 101",
                         "Bio-Export Documentation",
                         "Southeast Asia Green Policy"
                       ].map((rec, i) => (
                         <div key={i} className="flex items-center justify-between p-4 rounded-2xl bg-white/5 hover:bg-white/10 transition-colors cursor-pointer group">
                            <span className="text-xs font-bold text-slate-100">{rec}</span>
                            <Zap className="size-3.5 text-accent opacity-0 group-hover:opacity-100 transition-opacity" />
                         </div>
                       ))}
                    </div>
                    <Button className="w-full bg-white text-slate-900 hover:bg-slate-100 font-black rounded-2xl h-14 shadow-lg transition-all active:scale-95">
                       View My Syllabus
                    </Button>
                 </CardContent>
                 <div className="absolute top-0 right-0 w-64 h-64 bg-accent/20 rounded-full blur-3xl -mr-32 -mt-32" />
              </Card>

              <Card className="rounded-[3rem] border-slate-100 p-8 space-y-6 bg-white">
                 <div className="flex items-center gap-2 mb-2">
                    <Star className="size-4 text-amber-500 fill-amber-500" />
                    <h4 className="text-sm font-black uppercase tracking-widest text-slate-900">Featured Contributor</h4>
                 </div>
                 <div className="flex flex-col items-center text-center space-y-4">
                    <div className="size-20 rounded-[2rem] bg-indigo-50 border-4 border-white shadow-xl flex items-center justify-center text-accent font-black text-2xl">G</div>
                    <div className="space-y-1">
                       <h5 className="font-black text-lg">Global Logistics Co.</h5>
                       <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Logistics Thought Leader</p>
                    </div>
                    <p className="text-xs text-slate-500 font-medium italic">"Sharing over 20 years of supply chain excellence with the OnTapp network."</p>
                    <Button variant="outline" className="w-full rounded-xl border-slate-100 text-[10px] font-black uppercase tracking-widest hover:bg-slate-50">Follow Knowledge</Button>
                 </div>
              </Card>
           </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
