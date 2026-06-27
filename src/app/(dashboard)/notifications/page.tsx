"use client";

import * as React from "react";
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
  AlertTriangle,
  AlertCircle,
  X
} from "lucide-react";
import { useLanguage } from "@/context/language-context";
import { useAccount } from "@/context/account-context";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const ICON_MAP = {
  match: Handshake,
  message: MessageSquare,
  zap: Zap,
  bell: Bell,
  alert: AlertCircle
};

const INITIAL_NOTIFICATIONS = [
  {
    id: "n1",
    type: "match",
    title: "New Strategic Match Found",
    description: "Our AI identified 'EcoPack Global' as a 94% match for your packaging requirements.",
    time: "10m ago",
    unread: true,
    iconKey: "match",
    color: "bg-teal-500/10 text-teal-500"
  },
  {
    id: "n2",
    type: "message",
    title: "New Message from GreenEco",
    description: "Hi! We've reviewed your request for the bulk order. Let's discuss terms.",
    time: "1h ago",
    unread: true,
    iconKey: "message",
    color: "bg-black/5 text-black"
  }
];

export default function NotificationsPage() {
  const { t } = useLanguage();
  const { activeAccount } = useAccount();
  const { toast } = useToast();
  const [notifications, setNotifications] = React.useState<any[]>([]);
  const [isAllRead, setIsAllRead] = React.useState(false);
  const [isLoaded, setIsLoaded] = React.useState(false);
  const [selectedNotification, setSelectedNotification] = React.useState<any>(null);

  const getStorageKey = React.useCallback(() => `ontapp_notifications_data_${activeAccount.id}`, [activeAccount.id]);

  React.useEffect(() => {
    const saved = localStorage.getItem(getStorageKey());
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
  }, [activeAccount.id, getStorageKey]);

  React.useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(getStorageKey(), JSON.stringify(notifications));
      const allRead = notifications.length > 0 && notifications.every(n => !n.unread);
      setIsAllRead(allRead);
    }
  }, [notifications, isLoaded, getStorageKey]);

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
    if (selectedNotification?.id === id) setSelectedNotification(null);
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

  const handleOpenDetail = (notification: any) => {
    setSelectedNotification(notification);
    if (notification.unread) {
      toggleReadStatus(notification.id);
    }
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
            <h1 className="text-base font-black tracking-tight uppercase">{t('activity_center')}</h1>
            <p className="text-muted-foreground font-medium text-[9px] uppercase tracking-widest">{t('activity_desc')}</p>
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
                Hapus Semua
              </Button>
            )}
          </div>
        </header>

        <div className="space-y-1.5 min-h-[300px]">
          <AnimatePresence initial={false}>
            {notifications.map((notification) => {
              const IconComp = ICON_MAP[notification.iconKey as keyof typeof ICON_MAP] || Bell;
              
              return (
                <motion.div
                  key={notification.id}
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ type: "spring", stiffness: 500, damping: 35 }}
                  className="overflow-hidden"
                >
                  <div 
                    className="relative rounded-xl bg-card border border-border shadow-sm overflow-hidden touch-pan-y cursor-pointer group/card"
                    onClick={() => handleOpenDetail(notification)}
                  >
                    
                    <div className="absolute inset-y-0 right-0 w-14 flex items-center justify-center bg-rose-500 rounded-r-xl">
                      <button 
                        onClick={(e) => { e.stopPropagation(); deleteNotification(notification.id); }}
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
                      dragMomentum={false}
                      style={{ touchAction: 'pan-y' }}
                      className={cn(
                        "relative z-10 bg-card transition-colors hover:bg-slate-50/50",
                        notification.unread ? 'border-l-[3px] border-l-black' : 'bg-slate-50'
                      )}
                    >
                      <CardContent className="p-3 md:p-3.5">
                        <div className="flex items-start gap-2.5">
                          <div className={cn("size-9 rounded-xl flex items-center justify-center shrink-0 shadow-inner", notification.color, !notification.unread && "opacity-60")}>
                            <IconComp className="size-4" />
                          </div>
                          <div className="flex-1 min-w-0 space-y-0.5">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-1">
                                <h3 className={cn("font-black tracking-tight uppercase text-[10px] truncate", notification.unread ? 'text-foreground' : 'text-muted-foreground')}>
                                  {notification.title}
                                </h3>
                                {notification.unread && (
                                  <span className="size-1.5 bg-black rounded-full animate-pulse shrink-0" />
                                )}
                              </div>
                              <span className="text-[7px] text-muted-foreground font-black uppercase flex items-center gap-0.5 whitespace-nowrap">
                                <Clock className="size-2" />
                                {notification.time}
                              </span>
                            </div>
                            <p className={cn("text-[10px] font-medium leading-snug line-clamp-2", notification.unread ? "text-muted-foreground" : "text-slate-400")}>
                              {notification.description}
                            </p>
                            <div className="pt-1 flex items-center justify-between">
                               <Button variant="ghost" size="sm" className="h-6 px-1.5 text-[7px] font-black uppercase text-black hover:bg-black/5 rounded-lg transition-colors">
                                 {t('take_action')}
                                 <ChevronRight className="size-2 ml-0.5" />
                               </Button>
                               
                               <div className="flex items-center gap-0.5">
                                 <DropdownMenu>
                                   <DropdownMenuTrigger asChild>
                                     <button 
                                       onClick={(e) => e.stopPropagation()}
                                       className="size-7 rounded-lg text-muted-foreground hover:text-black hover:bg-black/5 transition-all active:scale-90 outline-none flex items-center justify-center"
                                     >
                                       <MoreVertical className="size-3" />
                                     </button>
                                   </DropdownMenuTrigger>
                                   <DropdownMenuContent align="end" className="w-48 rounded-xl p-1 shadow-2xl border-border bg-card animate-in zoom-in-95 duration-200" onClick={(e) => e.stopPropagation()}>
                                     <DropdownMenuItem 
                                       onClick={() => toggleReadStatus(notification.id)}
                                       className="flex items-center gap-2 px-2 py-1.5 rounded-lg font-bold cursor-pointer hover:bg-muted text-[10px]"
                                     >
                                       {notification.unread ? (
                                         <><Eye className="size-3" /> Ditandai Dibaca</>
                                       ) : (
                                         <><EyeOff className="size-3" /> Belum Dibaca</>
                                       )}
                                     </DropdownMenuItem>
                                     <DropdownMenuItem 
                                       onClick={() => handleMute(notification.title)}
                                       className="flex items-center gap-2 px-2 py-1.5 rounded-lg font-bold cursor-pointer hover:bg-muted text-[10px]"
                                     >
                                       <VolumeX className="size-3" /> Senyapkan Akun
                                     </DropdownMenuItem>
                                     <DropdownMenuItem 
                                       onClick={handleReport}
                                       className="flex items-center gap-2 px-2 py-1.5 rounded-lg font-bold cursor-pointer text-rose-500 hover:bg-rose-50 text-[10px]"
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
              );
            })}
          </AnimatePresence>

          {notifications.length === 0 && (
            <div className="py-12 text-center space-y-3 bg-card rounded-2xl border-2 border-dashed border-border/50">
               <div className="size-14 rounded-full bg-muted/20 flex items-center justify-center mx-auto shadow-inner">
                  <Inbox className="size-7 text-muted-foreground/30" />
               </div>
               <div className="space-y-1 px-4">
                  <h3 className="text-[11px] font-black text-slate-900 uppercase">Kotak Masuk Bersih</h3>
                  <p className="text-slate-400 max-w-xs mx-auto font-medium text-[8px] uppercase tracking-widest">
                    Kami akan memberi tahu Anda jika ada interaksi baru di jaringan.
                  </p>
               </div>
            </div>
          )}
        </div>

        <Dialog open={!!selectedNotification} onOpenChange={(open) => !open && setSelectedNotification(null)}>
          <DialogContent className="w-[90%] md:max-w-md rounded-[2rem] border-none shadow-2xl p-6 bg-card text-foreground outline-none [&>button]:hidden overflow-hidden animate-in zoom-in-95 duration-200">
             {selectedNotification && (
               <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className={cn("size-10 rounded-xl flex items-center justify-center shadow-inner", selectedNotification.color)}>
                      {React.createElement(ICON_MAP[selectedNotification.iconKey as keyof typeof ICON_MAP] || Bell, { className: "size-5" })}
                    </div>
                    <button onClick={() => setSelectedNotification(null)} className="p-2 rounded-lg bg-muted/30 text-muted-foreground hover:text-foreground active:scale-90 transition-all">
                      <X className="size-4" />
                    </button>
                  </div>
                  
                  <div className="space-y-2">
                     <DialogTitle className="text-xl font-black text-slate-900 leading-tight uppercase tracking-tight">
                        {selectedNotification.title}
                     </DialogTitle>
                     <div className="flex items-center gap-1.5 text-[9px] font-black text-muted-foreground uppercase tracking-widest">
                        <Clock className="size-2.5" />
                        {selectedNotification.time} • AI Activity Hub
                     </div>
                  </div>

                  <p className="text-sm font-medium text-slate-600 leading-relaxed bg-slate-50 p-4 rounded-2xl border border-slate-100">
                    {selectedNotification.description}
                  </p>

                  <div className="grid grid-cols-2 gap-2">
                     <Button onClick={() => setSelectedNotification(null)} className="h-11 rounded-xl bg-primary text-white font-black text-[10px] uppercase tracking-widest shadow-lg shadow-primary/20">
                        {t('take_action')}
                     </Button>
                     <Button variant="outline" onClick={() => deleteNotification(selectedNotification.id)} className="h-11 rounded-xl border-slate-200 text-rose-600 font-black text-[10px] uppercase tracking-widest hover:bg-rose-50">
                        Hapus
                     </Button>
                  </div>
               </div>
             )}
          </DialogContent>
        </Dialog>

        <CardContent className="rounded-2xl bg-black text-white overflow-hidden relative shadow-2xl mt-4 border-none p-5 space-y-2.5">
          <div className="size-7 rounded-lg bg-white/20 backdrop-blur-md flex items-center justify-center shadow-lg">
            <Zap className="size-3.5 text-white fill-white" />
          </div>
          <div className="space-y-0.5">
            <h3 className="text-[12px] font-black uppercase tracking-tight">{t('notif_intel')}</h3>
            <p className="text-white/60 text-[9px] font-medium leading-snug uppercase tracking-widest">
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