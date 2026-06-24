"use client";

import * as React from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { useAccount, ContentItem } from "@/context/account-context";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Trash2, 
  Archive, 
  Pin, 
  ChevronLeft, 
  MoreVertical, 
  LayoutGrid, 
  Home, 
  User, 
  Globe,
  Lock,
  Eye,
  EyeOff
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function ManagePostsPage() {
  const { activeAccount, removePost, togglePinPost, toggleArchivePost } = useAccount();
  const { toast } = useToast();

  const allPosts = activeAccount.items || [];

  const handleAction = (action: string, post: ContentItem) => {
    switch (action) {
      case 'pin':
        togglePinPost(post.id);
        toast({ title: post.isPinned ? "Sematkan dihapus" : "Postingan disematkan" });
        break;
      case 'archive':
        toggleArchivePost(post.id);
        toast({ title: post.isArchived ? "Postingan dipulihkan" : "Postingan diarsipkan" });
        break;
      case 'delete':
        removePost(post.id);
        toast({ title: "Postingan dihapus" });
        break;
    }
  };

  const getDisplayLocationLabel = (loc: string) => {
    switch (loc) {
      case 'feed': return { label: 'Hanya Beranda', icon: Home };
      case 'profile': return { label: 'Hanya Profil', icon: User };
      default: return { label: 'Beranda & Profil', icon: Globe };
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto space-y-8 py-6 pb-24 px-1">
        <header className="space-y-4">
          <Link href="/settings">
            <Button variant="ghost" size="sm" className="pl-0 text-slate-500 hover:text-primary font-bold gap-2">
              <ChevronLeft className="size-4" />
              Kembali ke Pengaturan
            </Button>
          </Link>
          <div className="space-y-1">
            <div className="flex items-center gap-2 bg-primary/10 text-primary px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest w-fit border border-primary/20">
              <LayoutGrid className="size-3" />
              Aktivitas Postingan
            </div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight uppercase">Kelola Postingan</h1>
            <p className="text-slate-500 font-medium text-sm">Lihat, arsipkan, atau sematkan seluruh aktivitas konten Anda.</p>
          </div>
        </header>

        {allPosts.length > 0 ? (
          <div className="space-y-4">
            {allPosts.map((post) => {
              const locInfo = getDisplayLocationLabel(post.displayLocation);
              return (
                <Card key={post.id} className={cn(
                  "rounded-2xl border border-border shadow-sm overflow-hidden transition-all",
                  post.isArchived && "opacity-60 grayscale bg-muted/30"
                )}>
                  <CardContent className="p-4 flex gap-4">
                    <div className="size-20 rounded-xl bg-slate-50 overflow-hidden shrink-0 border border-border shadow-inner">
                      {post.images?.[0] ? (
                        <img src={post.images[0]} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-300 font-black text-xl">T</div>
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0 space-y-1.5">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-slate-900 truncate max-w-[150px]">{post.title || "Postingan Baru"}</h3>
                          {post.isPinned && <Pin className="size-3 text-accent fill-accent" />}
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="size-8 rounded-lg hover:bg-slate-50">
                              <MoreVertical className="size-4 text-slate-400" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-48 rounded-xl p-1.5 shadow-2xl">
                            <DropdownMenuItem onClick={() => handleAction('pin', post)} className="flex items-center gap-3 px-3 py-2 rounded-lg font-bold cursor-pointer">
                              <Pin className="size-4" /> {post.isPinned ? "Lepas Sematan" : "Sematkan di Profil"}
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleAction('archive', post)} className="flex items-center gap-3 px-3 py-2 rounded-lg font-bold cursor-pointer">
                              {post.isArchived ? <><Eye className="size-4" /> Pulihkan</> : <><EyeOff className="size-4" /> Arsipkan</>}
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleAction('delete', post)} className="flex items-center gap-3 px-3 py-2 rounded-lg font-bold cursor-pointer text-rose-500 hover:bg-rose-50 hover:text-rose-600">
                              <Trash2 className="size-4" /> Hapus Permanen
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>

                      <p className="text-xs text-slate-500 line-clamp-1 font-medium">{post.description}</p>
                      
                      <div className="flex flex-wrap items-center gap-3 pt-1">
                        <Badge variant="secondary" className="bg-slate-100 text-[9px] font-black uppercase px-2 py-0.5 border-none flex gap-1.5 items-center">
                          <locInfo.icon className="size-2.5" /> {locInfo.label}
                        </Badge>
                        {post.visibility === 'private' && (
                          <Badge className="bg-amber-50 text-amber-600 border-none text-[9px] font-black uppercase px-2 py-0.5 flex gap-1.5 items-center">
                            <Lock className="size-2.5" /> Privat
                          </Badge>
                        )}
                        <span className="text-[9px] font-black uppercase text-slate-400 tracking-widest">{post.timestamp}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        ) : (
          <div className="py-24 text-center space-y-6 bg-card rounded-[3rem] border-2 border-dashed border-border/50">
            <div className="size-24 rounded-full bg-muted/20 flex items-center justify-center mx-auto shadow-inner">
               <Archive className="size-10 text-muted-foreground/30" />
            </div>
            <div className="space-y-2">
               <h3 className="text-xl font-black text-slate-900 uppercase">Tidak Ada Postingan</h3>
               <p className="text-slate-400 max-w-xs mx-auto font-medium text-sm">
                 Anda belum memiliki aktivitas postingan untuk dikelola saat ini.
               </p>
            </div>
            <Button onClick={() => window.location.href = '/feed'} className="rounded-2xl bg-primary text-white px-10 h-14 font-black shadow-xl uppercase tracking-widest text-[11px] active:scale-95 transition-all">
               Buat Postingan Pertama
            </Button>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
