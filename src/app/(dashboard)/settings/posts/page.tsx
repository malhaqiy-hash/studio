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
      case 'feed': return { label: 'Beranda', icon: Home };
      case 'profile': return { label: 'Profil', icon: User };
      default: return { label: 'Semua', icon: Globe };
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-xl mx-auto space-y-4 py-2 px-1">
        <header className="space-y-3">
          <Link href="/settings">
            <Button variant="ghost" size="sm" className="pl-0 h-6 text-[10px] text-slate-400 hover:text-primary font-black uppercase tracking-widest gap-1.5 active:scale-95 transition-all">
              <ChevronLeft className="size-3" />
              Kembali
            </Button>
          </Link>
          <div className="space-y-0.5">
            <div className="flex items-center gap-1.5 text-primary font-black text-[8px] uppercase tracking-[0.2em]">
              <LayoutGrid className="size-2.5" />
              Post Activity
            </div>
            <h1 className="text-xl font-black text-slate-900 tracking-tight leading-none uppercase">Kelola Postingan</h1>
            <p className="text-slate-500 font-medium text-[11px] leading-snug">Kelola seluruh aktivitas konten dan visibilitas Anda.</p>
          </div>
        </header>

        {allPosts.length > 0 ? (
          <div className="space-y-2">
            {allPosts.map((post) => {
              const locInfo = getDisplayLocationLabel(post.displayLocation);
              return (
                <Card key={post.id} className={cn(
                  "rounded-2xl border border-border shadow-sm overflow-hidden transition-all",
                  post.isArchived && "opacity-60 grayscale bg-muted/30"
                )}>
                  <CardContent className="p-3 flex gap-3">
                    <div className="size-16 rounded-xl bg-slate-50 overflow-hidden shrink-0 border border-slate-50 shadow-inner flex items-center justify-center text-slate-200 font-black text-xs">
                      {post.images?.[0] ? (
                        <img src={post.images[0]} className="w-full h-full object-cover" />
                      ) : "T"}
                    </div>
                    
                    <div className="flex-1 min-w-0 space-y-1">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5 min-w-0">
                          <h3 className="font-bold text-[13px] text-slate-900 truncate">{post.title || "Postingan Baru"}</h3>
                          {post.isPinned && <Pin className="size-2.5 text-accent fill-accent" />}
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="size-7 rounded-lg hover:bg-slate-50">
                              <MoreVertical className="size-3.5 text-slate-400" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-40 rounded-xl p-1 shadow-2xl">
                            <DropdownMenuItem onClick={() => handleAction('pin', post)} className="flex items-center gap-2 px-2 py-1.5 rounded-lg font-bold cursor-pointer text-[10px]">
                              <Pin className="size-3" /> {post.isPinned ? "Lepas Pin" : "Sematkan"}
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleAction('archive', post)} className="flex items-center gap-2 px-2 py-1.5 rounded-lg font-bold cursor-pointer text-[10px]">
                              {post.isArchived ? <><Eye className="size-3" /> Pulihkan</> : <><EyeOff className="size-3" /> Arsipkan</>}
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleAction('delete', post)} className="flex items-center gap-2 px-2 py-1.5 rounded-lg font-bold cursor-pointer text-rose-500 hover:bg-rose-50 text-[10px]">
                              <Trash2 className="size-3" /> Hapus
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>

                      <p className="text-[10px] text-slate-500 line-clamp-1 font-medium leading-tight">{post.description}</p>
                      
                      <div className="flex flex-wrap items-center gap-2 pt-1">
                        <Badge variant="secondary" className="bg-slate-100 text-[7px] font-black uppercase px-1.5 h-4 border-none flex gap-1 items-center shadow-none">
                          <locInfo.icon className="size-2" /> {locInfo.label}
                        </Badge>
                        {post.visibility === 'private' && (
                          <Badge className="bg-amber-50 text-amber-600 border-none text-[7px] font-black uppercase px-1.5 h-4 flex gap-1 items-center shadow-none">
                            <Lock className="size-2" /> Privat
                          </Badge>
                        )}
                        <span className="text-[8px] font-black uppercase text-slate-400 tracking-widest">{post.timestamp}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        ) : (
          <div className="py-12 text-center space-y-4 bg-card rounded-[2rem] border-2 border-dashed border-border/50">
            <Archive className="size-8 text-muted-foreground/30 mx-auto" />
            <div className="space-y-0.5">
               <h3 className="text-sm font-black text-slate-900 uppercase">Tidak Ada Konten</h3>
               <p className="text-slate-400 text-[10px] font-medium">Aktivitas postingan akan muncul di sini.</p>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}