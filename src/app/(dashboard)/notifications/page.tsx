"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Bell, 
  MessageSquare, 
  Handshake, 
  Clock, 
  ChevronRight, 
  MoreVertical, 
  Zap, 
  Trash2, 
  Inbox,
  Eye,
  EyeOff,
  VolumeX,
  AlertTriangle
} from "lucide-react";
import { useLanguage } from "@/context/language-context";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const INITIAL_NOTIFICATIONS = [
  {
    id: "n1",
    type: "match",
    title: "New Strategic Match Found",
    description: "Our AI identified 'EcoPack Global' as a 94% match for your packaging requirements.",
    time: "10m ago",
    unread: true,
    icon: Handshake,
    color: "bg-teal-500/10 text-teal-500"
  },
  {
    id: "n2",
    type: "message",
    title: "New Message from GreenEco",
    description: "Hi! We've reviewed your request for the bulk order. Let's discuss terms.",
    time: "1h ago",
    unread: true,
    icon: MessageSquare,
    color: "bg-black/5 text-black"
  }
];

export default function NotificationsPage() {
  const router = useRouter();
  const { t } = useLanguage();
  const { toast } = useToast();
  const [notifications, setNotifications] = React.useState(INITIAL_NOTIFICATIONS);
  const [isAllRead, setIsAllRead] = React.useState(false);

  const toggleAllRead = () => {
    const nextStatus = !isAllRead;
    setIsAllRead(nextStatus);
    setNotifications(prev => prev.map(n => ({ ...n, unread: !nextStatus })));
    toast({ title: nextStatus ? "Semua ditandai dibaca" : "Semua ditandai belum dibaca" });
  };

  const handleClearAll = () => {
    setNotifications([]);
    toast({ title: "Kotak masuk dibersihkan" });
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const toggleReadStatus = (id: string) => {
    setNotifications(prev => prev.map(n => 
      n.id === id ? { ...n, unread: !n.unread } : n
    ));
  };

  const handleMute = (title: string) => {
    toast({ title: "Akun Disenyapkan", description: `Notifikasi dari ${title} akan disembunyikan.` });
  };

  const handleReport = () => {
    toast({ variant: "destructive", title: "Laporan Terkirim", description: "Tim moderasi akan meninjau notifikasi ini." });
  };

  return (
    <DashboardLayout>
      <div className="space-y-8 pb-24 relative">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 px-1">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-black font-black text-[10px] uppercase tracking-[0.2em]">
              <Bell className="size-3" />
              {t('notifications')}
            </div>
            <h1 className="text-3xl font-black tracking-tight uppercase">{t('activity_center')}</h1>
            <p className="text-muted-foreground font-medium text-sm">{t('activity_desc')}</p>
          </div>
          
          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              onClick={toggleAllRead}
              className="text-[10px] font-black uppercase tracking-widest text-slate-700 hover:text-black hover:bg-black/5 rounded-xl h-10 px-4 transition-colors"
            >
              {isAllRead ? "Tandai Belum Dibaca" : t('mark_read')}
            </Button>
            
            {notifications.length > 0 && (
              <Button 
                variant="ghost" 
                onClick={handleClearAll}
                className="text-[10px] font-black uppercase tracking-widest text-rose-600 hover:text-rose-700 hover:bg-rose-50 rounded-xl h-10 px-4 transition-colors flex gap-2"
              >
                <Trash2 className="size-3.5" />
                Hapus Semua
              </Button>
            )}
          </div>
        </header>

        <div className="space-y-3 min-h-[300px]">
          <AnimatePresence initial={false}>
            {notifications.map((notification) => (
              <motion.div
                key={notification.id}
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ type: "spring", stiffness: 500, damping: 35 }}
                className="overflow-hidden"
              >
                <div className="relative rounded-[1.5rem] bg-card border border-border shadow-sm overflow-hidden touch-pan-y">
                  
                  {/* Background Action */}
                  <div className="absolute inset-y-0 right-0 w-20 flex items-center justify-center bg-rose-500 rounded-r-[1.5rem]">
                    <button 
                      onClick={() => deleteNotification(notification.id)}
                      className="w-full h-full flex flex-col items-center justify-center text-white active:scale-90 transition-transform"
                    >
                      <Trash2 className="size-5" />
                      <span className="text-[8px] font-black uppercase mt-1">Hapus</span>
                    </button>
                  </div>

                  {/* Foreground Content */}
                  <motion.div 
                    drag="x"
                    dragConstraints={{ left: -80, right: 0 }}
                    dragElastic={0.05}
                    dragDirectionLock
                    onDragStart={() => {}} 
                    style={{ touchAction: 'pan-y' }}
                    className={cn(
                      "relative z-10 bg-card",
                      notification.unread ? 'border-l-4 border-l-black' : 'opacity-90'
                    )}
                  >
                    <CardContent className="p-5 md:p-6">
                      <div className="flex items-start gap-4">
                        <div className={cn("size-12 rounded-2xl flex items-center justify-center shrink-0 shadow-inner", notification.color)}>
                          <notification.icon className="size-6" />
                        </div>
                        <div className="flex-1 min-w-0 space-y-1">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <h3 className={cn("font-black tracking-tight uppercase text-sm", notification.unread ? 'text-foreground' : 'text-muted-foreground')}>
                                {notification.title}
                              </h3>
                              {notification.unread && (
                                <span className="size-2 bg-black rounded-full animate-pulse" />
                              )}
                            </div>
                            <span className="text-[10px] text-muted-foreground font-black uppercase flex items-center gap-1">
                              <Clock className="size-3" />
                              {notification.time}
                            </span>
                          </div>
                          <p className="text-[13px] text-muted-foreground font-medium leading-relaxed line-clamp-2">
                            {notification.description}
                          </p>
                          <div className="pt-2 flex items-center justify-between">
                             <Button variant="ghost" size="sm" className="h-8 px-3 text-[10px] font-black uppercase text-black hover:bg-black/5 rounded-lg transition-colors">
                               {t('take_action')}
                               <ChevronRight className="size-3 ml-1" />
                             </Button>
                             
                             <div className="flex items-center gap-1">
                               <DropdownMenu>
                                 <DropdownMenuTrigger asChild>
                                   <Button variant="ghost" size="icon" className="size-9 rounded-xl text-muted-foreground hover:text-black hover:bg-black/5 transition-all active:scale-90 outline-none">
                                     <MoreVertical className="size-4" />
                                   </Button>
                                 </DropdownMenuTrigger>
                                 <DropdownMenuContent align="end" className="w-56 rounded-2xl p-2 shadow-2xl border-border bg-card animate-in zoom-in-95 duration-200">
                                   <DropdownMenuItem 
                                     onClick={() => toggleReadStatus(notification.id)}
                                     className="flex items-center gap-3 px-3 py-2.5 rounded-xl font-bold cursor-pointer hover:bg-muted"
                                   >
                                     {notification.unread ? (
                                       <><Eye className="size-4" /> Tandai Sudah Dibaca</>
                                     ) : (
                                       <><EyeOff className="size-4" /> Tandai Belum Dibaca</>
                                     )}
                                   </DropdownMenuItem>
                                   <DropdownMenuItem 
                                     onClick={() => handleMute(notification.title)}
                                     className="flex items-center gap-3 px-3 py-2.5 rounded-xl font-bold cursor-pointer hover:bg-muted"
                                   >
                                     <VolumeX className="size-4" /> Senyapkan Akun Ini
                                   </DropdownMenuItem>
                                   <DropdownMenuItem 
                                     onClick={handleReport}
                                     className="flex items-center gap-3 px-3 py-2.5 rounded-xl font-bold cursor-pointer text-rose-500 hover:bg-rose-50 hover:text-rose-600"
                                   >
                                     <AlertTriangle className="size-4" /> Laporkan Notifikasi
                                   </DropdownMenuItem>
                                 </DropdownMenuContent>
                               </DropdownMenu>
                             </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </motion.div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {notifications.length === 0 && (
            <div className="py-24 text-center space-y-6 bg-card rounded-[3rem] border-2 border-dashed border-border/50">
               <div className="size-24 rounded-full bg-muted/20 flex items-center justify-center mx-auto shadow-inner">
                  <Inbox className="size-10 text-muted-foreground/30" />
               </div>
               <div className="space-y-2">
                  <h3 className="text-xl font-black text-slate-900 uppercase">Tidak Ada Aktivitas</h3>
                  <p className="text-slate-400 max-w-xs mx-auto font-medium text-sm">
                    Kotak masuk Anda bersih. Kami akan memberi tahu Anda jika ada interaksi baru di jaringan.
                  </p>
               </div>
               <Button onClick={() => router.push('/feed')} className="rounded-2xl bg-black text-white px-10 h-14 font-black shadow-xl uppercase tracking-widest text-[11px] active:scale-95 transition-all">
                  Jelajahi Beranda
               </Button>
            </div>
          )}
        </div>

        <CardContent className="rounded-[2.5rem] bg-black text-white overflow-hidden relative shadow-2xl mt-12 border-none p-8 space-y-4">
          <div className="size-10 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center shadow-lg mb-2">
            <Zap className="size-6 text-white fill-white" />
          </div>
          <div className="space-y-1">
            <h3 className="text-xl font-black uppercase tracking-tight">{t('notif_intel')}</h3>
            <p className="text-white/60 text-sm font-medium">
              Mesin OnTapp memberikan saran personal berdasarkan interaksi jaringan bisnis Anda secara cerdas.
            </p>
          </div>
          <Button className="w-full bg-white text-black hover:bg-slate-100 font-black rounded-xl h-12 transition-all uppercase tracking-widest text-[11px]">
            {t('view_insights')}
          </Button>
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none" />
        </CardContent>
      </div>
    </DashboardLayout>
  );
}