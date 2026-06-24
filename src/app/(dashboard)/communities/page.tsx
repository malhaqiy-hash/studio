"use client";

import * as React from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Users, 
  Search, 
  Plus, 
  MessageSquare, 
  ShieldCheck, 
  ChevronRight
} from "lucide-react";
import { useLanguage } from "@/context/language-context";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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

  const toggleJoin = (id: string) => {
    setJoinedGroups(prev => 
      prev.includes(id) ? prev.filter(gid => gid !== id) : [...prev, id]
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
      <div className="max-w-xl mx-auto space-y-4 py-2 px-1">
        <header className="flex items-end justify-between gap-4">
          <div className="space-y-0.5">
            <div className="flex items-center gap-1.5 text-accent font-black text-[8px] uppercase tracking-widest">
              <Users className="size-2.5" />
              {t('communities')}
            </div>
            <h1 className="text-xl font-black text-slate-900 tracking-tight leading-none">
              {language === 'id' ? 'Ruang Kolaborasi' : 'Collaboration Hub'}
            </h1>
            <p className="text-slate-500 font-medium text-[11px]">
              {t('communities_desc')}
            </p>
          </div>
          <Button size="sm" className="rounded-xl bg-slate-900 text-white font-black h-8 px-3 shadow-lg flex gap-1.5 active:scale-95 transition-all text-[9px] uppercase tracking-widest">
            <Plus className="size-3" />
            {language === 'id' ? 'Buat' : 'Create'}
          </Button>
        </header>

        <div className="relative group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-slate-400 group-focus-within:text-accent transition-colors" />
          <Input 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={language === 'id' ? "Cari komunitas..." : "Search groups..."}
            className="h-10 pl-9 pr-4 rounded-xl border-slate-100 bg-white shadow-sm text-[13px] font-medium focus:ring-accent/10 transition-all"
          />
        </div>

        <Tabs defaultValue="discover" className="space-y-4">
          <TabsList className="bg-slate-100 p-1 rounded-xl h-auto border border-slate-200 inline-flex">
            <TabsTrigger value="discover" className="rounded-lg px-4 py-1.5 data-[state=active]:bg-white data-[state=active]:text-accent data-[state=active]:shadow-sm font-black uppercase text-[9px] tracking-widest">{language === 'id' ? 'Jelajah' : 'Discover'}</TabsTrigger>
            <TabsTrigger value="my-groups" className="rounded-lg px-4 py-1.5 data-[state=active]:bg-white data-[state=active]:text-accent data-[state=active]:shadow-sm font-black uppercase text-[9px] tracking-widest">{language === 'id' ? 'Grup Saya' : 'My Groups'}</TabsTrigger>
          </TabsList>

          <TabsContent value="discover" className="space-y-3 outline-none">
            {filteredCommunities.map((group) => (
              <Card key={group.id} className="group rounded-2xl border-slate-100 shadow-sm hover:shadow-md transition-all overflow-hidden bg-white border-none flex flex-col">
                <div className="h-28 relative overflow-hidden">
                  <img src={group.image} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt={group.name} />
                  <div className="absolute top-2 right-2">
                    <Badge className="bg-white/90 backdrop-blur-md text-slate-900 border-none font-black text-[7px] uppercase px-2 py-0.5 rounded-full shadow-lg">
                      {group.category}
                    </Badge>
                  </div>
                </div>
                <CardContent className="p-4 space-y-3 flex-1 flex flex-col">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-1.5">
                      <h3 className="text-sm font-black text-slate-900 tracking-tight group-hover:text-accent transition-colors">{group.name}</h3>
                      {group.verified && <ShieldCheck className="size-3.5 text-emerald-500 fill-emerald-50" />}
                    </div>
                    <p className="text-slate-500 font-medium text-[11px] leading-snug line-clamp-2">
                      {group.description}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-50">
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-tight">{group.members} Anggota</span>
                    <Button 
                      onClick={() => toggleJoin(group.id)}
                      className={cn(
                        "rounded-lg h-7 px-3 font-black text-[8px] uppercase tracking-widest transition-all active:scale-95",
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
               <div className="space-y-2">
                 {MOCK_COMMUNITIES.filter(c => joinedGroups.includes(c.id)).map((group) => (
                   <Card key={group.id} className="p-3 rounded-2xl border-slate-100 bg-white hover:shadow-md transition-all flex items-center gap-3">
                      <div className="size-12 rounded-xl overflow-hidden shrink-0 shadow-inner">
                        <img src={group.image} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 min-w-0 space-y-0.5">
                        <h4 className="text-[13px] font-black text-slate-900 truncate">{group.name}</h4>
                        <div className="flex items-center gap-1.5 text-[8px] font-black text-accent uppercase tracking-widest">
                          <MessageSquare className="size-2.5" />
                          Aktif
                        </div>
                      </div>
                      <Button variant="ghost" size="icon" className="size-8 rounded-lg bg-slate-50 text-slate-400 hover:text-accent">
                         <ChevronRight className="size-4" />
                      </Button>
                   </Card>
                 ))}
               </div>
            ) : (
              <div className="py-12 text-center space-y-4 bg-slate-50/50 rounded-3xl border-2 border-dashed border-slate-100">
                <Users className="size-8 text-slate-200 mx-auto" />
                <div className="space-y-0.5">
                  <h3 className="text-sm font-black text-slate-900">{language === 'id' ? 'Belum Ada Grup' : 'No Groups'}</h3>
                  <p className="text-[10px] text-slate-400 max-w-[200px] mx-auto font-medium">
                    Jelajahi komunitas dan mulai berkolaborasi.
                  </p>
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}