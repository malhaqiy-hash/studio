"use client";

import * as React from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Users, 
  Search, 
  Plus, 
  MessageSquare, 
  ShieldCheck, 
  TrendingUp, 
  Globe, 
  Zap, 
  MapPin,
  ChevronRight,
  Filter,
  RefreshCw
} from "lucide-react";
import { useLanguage } from "@/context/language-context";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/avatar";

const MOCK_COMMUNITIES = [
  { id: "c1", name: "Global Halal Trade", description: "Jaringan eksportir dan importir produk halal dunia.", members: "12.4k", category: "Trade", verified: true, image: "https://picsum.photos/seed/halal/400/200" },
  { id: "c2", name: "SaaS Builders Indonesia", description: "Komunitas pendiri dan pengembang software as a service.", members: "4.2k", category: "Tech", verified: true, image: "https://picsum.photos/seed/saas/400/200" },
  { id: "c3", name: "Logistics Expert Network", description: "Diskusi seputar efisiensi rantai pasok dan armada.", members: "8.9k", category: "Logistics", verified: false, image: "https://picsum.photos/seed/logi/400/200" },
  { id: "c4", name: "Creative Industry Hub", description: "Wadah kolaborasi desainer, marketer, dan agensi.", members: "15.1k", category: "Creative", verified: true, image: "https://picsum.photos/seed/crea/400/200" },
];

export default function CommunitiesPage() {
  const { t, language } = useLanguage();
  const { toast } = useToast();
  const [search, setSearch] = React.useState("");
  const [joinedGroups, setJoinedGroups] = React.useState<string[]>(["c1"]);
  const [loading, setLoading] = React.useState(false);

  const toggleJoin = (id: string) => {
    setJoinedGroups(prev => 
      prev.includes(id) ? prev.filter(gid => fid !== id) : [...prev, id]
    );
    const isJoining = !joinedGroups.includes(id);
    toast({ 
      title: isJoining ? (language === 'id' ? "Berhasil Bergabung" : "Joined Successfully") : (language === 'id' ? "Keluar Grup" : "Left Group"),
      description: isJoining ? "Selamat datang di komunitas!" : "Anda telah keluar dari grup."
    });
  };

  const filteredCommunities = MOCK_COMMUNITIES.filter(c => 
    c.name.toLowerCase().includes(search.toLowerCase()) || 
    c.description.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto space-y-10 py-6 pb-24">
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 bg-accent/10 text-accent px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest w-fit border border-accent/20">
              <Users className="size-3" />
              {t('communities')}
            </div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight leading-none">
              {language === 'id' ? 'Ruang Kolaborasi' : 'Collaboration Hub'}
            </h1>
            <p className="text-slate-500 font-medium text-lg max-w-2xl">
              {t('communities_desc')}
            </p>
          </div>
          <Button className="rounded-2xl bg-slate-900 text-white font-black h-14 px-8 shadow-xl flex gap-2 active:scale-95 transition-all">
            <Plus className="size-5" />
            {language === 'id' ? 'Buat Grup' : 'Create Group'}
          </Button>
        </header>

        <div className="relative group">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 size-6 text-slate-400 group-focus-within:text-accent transition-colors" />
          <Input 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={language === 'id' ? "Cari komunitas atau topik..." : "Search groups or topics..."}
            className="h-16 pl-16 pr-6 rounded-3xl border-slate-200 bg-white shadow-xl text-lg font-medium focus:ring-accent/10 transition-all"
          />
        </div>

        <Tabs defaultValue="discover" className="space-y-8">
          <TabsList className="bg-slate-100 p-1.5 rounded-2xl h-auto border border-slate-200 inline-flex">
            <TabsTrigger value="discover" className="rounded-xl px-8 py-3 data-[state=active]:bg-white data-[state=active]:text-accent data-[state=active]:shadow-sm font-black uppercase text-[10px] tracking-widest">{language === 'id' ? 'Jelajah' : 'Discover'}</TabsTrigger>
            <TabsTrigger value="my-groups" className="rounded-xl px-8 py-3 data-[state=active]:bg-white data-[state=active]:text-accent data-[state=active]:shadow-sm font-black uppercase text-[10px] tracking-widest">{language === 'id' ? 'Grup Saya' : 'My Groups'}</TabsTrigger>
          </TabsList>

          <TabsContent value="discover" className="grid grid-cols-1 md:grid-cols-2 gap-6 outline-none">
            {filteredCommunities.map((group) => (
              <Card key={group.id} className="group rounded-[2.5rem] border-slate-100 shadow-sm hover:shadow-2xl transition-all overflow-hidden bg-white border-none flex flex-col">
                <div className="h-48 relative overflow-hidden">
                  <img src={group.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={group.name} />
                  <div className="absolute top-4 right-4">
                    <Badge className="bg-white/90 backdrop-blur-md text-slate-900 border-none font-black text-[9px] uppercase px-3 py-1.5 rounded-full shadow-lg">
                      {group.category}
                    </Badge>
                  </div>
                </div>
                <CardContent className="p-8 space-y-6 flex-1 flex flex-col">
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="text-2xl font-black text-slate-900 tracking-tight leading-tight group-hover:text-accent transition-colors">{group.name}</h3>
                      {group.verified && <ShieldCheck className="size-5 text-emerald-500 fill-emerald-50" />}
                    </div>
                    <p className="text-slate-500 font-medium leading-relaxed line-clamp-2">
                      {group.description}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                    <div className="flex items-center gap-3">
                       <div className="flex -space-x-3">
                          {[1,2,3].map(i => <div key={i} className="size-8 rounded-full border-2 border-white bg-slate-100 overflow-hidden"><img src={`https://picsum.photos/seed/u${i+group.id}/100`} /></div>)}
                       </div>
                       <span className="text-[11px] font-black text-slate-400 uppercase tracking-tight">{group.members} Anggota</span>
                    </div>
                    <Button 
                      onClick={() => toggleJoin(group.id)}
                      className={cn(
                        "rounded-xl h-11 px-6 font-black text-[10px] uppercase tracking-widest transition-all active:scale-95",
                        joinedGroups.includes(group.id) 
                          ? "bg-slate-100 text-slate-500 hover:bg-rose-50 hover:text-rose-500" 
                          : "bg-accent text-white hover:bg-accent/90 shadow-lg shadow-accent/20"
                      )}
                    >
                      {joinedGroups.includes(group.id) ? (language === 'id' ? 'Tergabung' : 'Joined') : (language === 'id' ? 'Gabung' : 'Join')}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="my-groups" className="outline-none">
            {joinedGroups.length > 0 ? (
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 {MOCK_COMMUNITIES.filter(c => joinedGroups.includes(c.id)).map((group) => (
                   <Card key={group.id} className="p-6 rounded-[2.5rem] border-slate-100 bg-white hover:shadow-xl transition-all flex items-center gap-6">
                      <div className="size-20 rounded-3xl overflow-hidden shrink-0 shadow-inner">
                        <img src={group.image} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 min-w-0 space-y-1">
                        <h4 className="text-xl font-black text-slate-900 truncate">{group.name}</h4>
                        <div className="flex items-center gap-2 text-[10px] font-black text-accent uppercase tracking-widest">
                          <MessageSquare className="size-3" />
                          12 Pesan Baru
                        </div>
                      </div>
                      <Button variant="ghost" size="icon" className="size-12 rounded-2xl bg-slate-50 text-slate-400 hover:text-accent hover:bg-accent/10">
                         <ChevronRight className="size-6" />
                      </Button>
                   </Card>
                 ))}
               </div>
            ) : (
              <div className="py-24 text-center space-y-6 bg-slate-50/50 rounded-[4rem] border-2 border-dashed border-slate-200">
                <div className="size-24 rounded-full bg-white flex items-center justify-center mx-auto shadow-xl">
                  <Users className="size-10 text-slate-200" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-2xl font-black text-slate-900">{language === 'id' ? 'Belum Ada Grup' : 'No Groups Joined'}</h3>
                  <p className="text-slate-400 max-w-xs mx-auto font-medium">
                    {language === 'id' ? 'Jelajahi komunitas dan mulai berkolaborasi dengan member lainnya.' : 'Explore communities and start collaborating with other members.'}
                  </p>
                </div>
                <Button onClick={() => document.querySelector('[data-value="discover"]')?.click()} className="rounded-2xl bg-accent px-10 h-14 font-black shadow-lg shadow-accent/20">
                  {language === 'id' ? 'Cari Komunitas' : 'Explore Now'}
                </Button>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
