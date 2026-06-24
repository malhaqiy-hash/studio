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

const STORAGE_KEY = "ontapp_notifications_data_v1";

export default function NotificationsPage() {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [notifications, setNotifications] = React.useState<any[]>([]);
  const [isAllRead, setIsAllRead] = React.useState(false);
  const [isLoaded, setIsLoaded] = React.useState(false);

  // Load from localStorage
  React.useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setNotifications(JSON.parse(saved));
      } catch (e) {
        setNotifications(INITIAL_NOTIFICATIONS);
      }
    } else {
      setNotifications(INITIAL_NOTIFICATIONS);
    }
    setIsLoaded(true);
  }, []);

  // Save to localStorage
  React.useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(notifications));
      const allRead = notifications.length > 0 && notifications.every(n => !n.unread);
      setIsAllRead(allRead);
    }
  }, [notifications, isLoaded]);

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

  if (!isLoaded) return null;

  return (
    <DashboardLayout>
      <div className="space-y-4 pb-24 relative max-w-xl mx-auto px-1 md:px-0">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="space-y-0.5">
            <div className="flex items-center gap-1.5 text-black font-black text-[8px] uppercase tracking-[0.2em]">
              <Bell className="size-2.5" />
              {t('notifications')}
            </div>
            <h1 className="text-lg font-black tracking-tight uppercase">{t('activity_center')}</h1>
            <p className="text-muted-foreground font-medium text-[10px]">{t('activity_desc')}</p>
          </div>
          
          <div className="flex items-center gap-1">
            <Button 
              variant="ghost" 
              onClick={toggleAllRead}
              className="text-[8px] font-black uppercase tracking-widest text-slate-700 hover:text-black hover:bg-black/5 rounded-lg h-7 px-2.5 transition-colors"
            >
              {isAllRead ? "Belum Dibaca" : t('mark_read')}
            </Button>
            
            {notifications.length > 0 && (
              <Button 
                variant="ghost" 
                onClick={handleClearAll}
                className="text-[8px] font-black uppercase tracking-widest text-rose-600 hover:text-rose-700 hover:bg-rose-50 rounded-lg h-7 px-2.5 transition-colors flex gap-1"
              >
                <Trash2 className="size-2.5" />
                Hapus
              </Button>
            )}
          </div>
        </header>

        <div className="space-y-1.5 min-h-[300px]">
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
                <div className="relative rounded-xl bg-card border border-border shadow-sm overflow-hidden touch-pan-y">
                  
                  <div className="absolute inset-y-0 right-0 w-14 flex items-center justify-center bg-rose-500 rounded-r-xl">
                    <button 
                      onClick={() => deleteNotification(notification.id)}
                      className="w-full h-full flex flex-col items-center justify-center text-white active:scale-90 transition-transform"
                    >
                      <Trash2 className="size-3.5" />
                      <span className="text-[7px] font-black uppercase mt-0.5">Hapus</span>
                    </button>
                  </div>

                  <motion.div 
                    drag="x"
                    dragConstraints={{ left: -56, right: 0 }}
                    dragElastic={0.05}
                    dragDirectionLock
                    onDragStart={() => {}} 
                    style={{ touchAction: 'pan-y' }}
                    className={cn(
                      "relative z-10 bg-card",
                      notification.unread ? 'border-l-[3px] border-l-black' : 'opacity-90'
                    )}
                  >
                    <CardContent className="p-3 md:p-3.5">
                      <div className="flex items-start gap-2.5">
                        <div className={cn("size-9 rounded-xl flex items-center justify-center shrink-0 shadow-inner", notification.color)}>
                          <notification.icon className="size-4" />
                        </div>
                        <div className="flex-1 min-w-0 space-y-0.5">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1">
                              <h3 className={cn("font-black tracking-tight uppercase text-[11px] truncate", notification.unread ? 'text-foreground' : 'text-muted-foreground')}>
                                {notification.title}
                              </h3>
                              {notification.unread && (
                                <span className="size-1.5 bg-black rounded-full animate-pulse shrink-0" />
                              )}
                            </div>
                            <span className="text-[8px] text-muted-foreground font-black uppercase flex items-center gap-0.5 whitespace-nowrap">
                              <Clock className="size-2" />
                              {notification.time}
                            </span>
                          </div>
                          <p className="text-[11px] text-muted-foreground font-medium leading-snug line-clamp-2">
                            {notification.description}
                          </p>
                          <div className="pt-1 flex items-center justify-between">
                             <Button variant="ghost" size="sm" className="h-6 px-1.5 text-[8px] font-black uppercase text-black hover:bg-black/5 rounded-lg transition-colors">
                               {t('take_action')}
                               <ChevronRight className="size-2 ml-0.5" />
                             </Button>
                             
                             <div className="flex items-center gap-0.5">
                               <DropdownMenu>
                                 <DropdownMenuTrigger asChild>
                                   <button className="size-7 rounded-lg text-muted-foreground hover:text-black hover:bg-black/5 transition-all active:scale-90 outline-none flex items-center justify-center">
                                     <MoreVertical className="size-3" />
                                   </button>
                                 </DropdownMenuTrigger>
                                 <DropdownMenuContent align="end" className="w-48 rounded-xl p-1 shadow-2xl border-border bg-card animate-in zoom-in-95 duration-200">
                                   <DropdownMenuItem 
                                     onClick={() => toggleReadStatus(notification.id)}
                                     className="flex items-center gap-2 px-2 py-1.5 rounded-lg font-bold cursor-pointer hover:bg-muted text-[11px]"
                                   >
                                     {notification.unread ? (
                                       <><Eye className="size-3" /> Ditandai Dibaca</>
                                     ) : (
                                       <><EyeOff className="size-3" /> Belum Dibaca</>
                                     )}
                                   </DropdownMenuItem>
                                   <DropdownMenuItem 
                                     onClick={() => handleMute(notification.title)}
                                     className="flex items-center gap-2 px-2 py-1.5 rounded-lg font-bold cursor-pointer hover:bg-muted text-[11px]"
                                   >
                                     <VolumeX className="size-3" /> Senyapkan Akun
                                   </DropdownMenuItem>
                                   <DropdownMenuItem 
                                     onClick={handleReport}
                                     className="flex items-center gap-2 px-2 py-1.5 rounded-lg font-bold cursor-pointer text-rose-500 hover:bg-rose-50 text-[11px]"
                                   >
                                     <AlertTriangle className="size-3" /> Laporkan
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
            <div className="py-12 text-center space-y-3 bg-card rounded-2xl border-2 border-dashed border-border/50">
               <div className="size-14 rounded-full bg-muted/20 flex items-center justify-center mx-auto shadow-inner">
                  <Inbox className="size-7 text-muted-foreground/30" />
               </div>
               <div className="space-y-1 px-4">
                  <h3 className="text-[12px] font-black text-slate-900 uppercase">Kotak Masuk Bersih</h3>
                  <p className="text-slate-400 max-w-xs mx-auto font-medium text-[9px]">
                    Kami akan memberi tahu Anda jika ada interaksi baru di jaringan.
                  </p>
               </div>
            </div>
          )}
        </div>

        <CardContent className="rounded-2xl bg-black text-white overflow-hidden relative shadow-2xl mt-4 border-none p-5 space-y-2.5">
          <div className="size-7 rounded-lg bg-white/20 backdrop-blur-md flex items-center justify-center shadow-lg">
            <Zap className="size-3.5 text-white fill-white" />
          </div>
          <div className="space-y-0.5">
            <h3 className="text-sm font-black uppercase tracking-tight">{t('notif_intel')}</h3>
            <p className="text-white/60 text-[10px] font-medium leading-snug">
              Mesin OnTapp memberikan saran personal berdasarkan interaksi jaringan bisnis Anda secara cerdas.
            </p>
          </div>
          <Button className="w-full bg-white text-black hover:bg-slate-100 font-black rounded-lg h-9 transition-all uppercase tracking-widest text-[9px]">
            {t('view_insights')}
          </Button>
          <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
        </CardContent>
      </div>
    </DashboardLayout>
  );
}
