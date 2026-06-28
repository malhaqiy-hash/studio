
"use client";

import * as React from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
  AlertCircle,
  X,
  UserCheck,
  UserPlus
} from "lucide-react";
import { useLanguage } from "@/context/language-context";
import { useAccount } from "@/context/account-context";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const ICON_MAP = {
  match: Handshake,
  message: MessageSquare,
  zap: Zap,
  bell: Bell,
  alert: AlertCircle
};

const INITIAL_NOTIFICATIONS = [
  { id: "n1", type: "match", title: "New Strategic Match Found", description: "Our AI identified 'EcoPack Global' as a 94% match for your requirements.", time: "10m ago", unread: true, iconKey: "match", color: "bg-teal-500/10 text-teal-500" },
  { id: "n2", type: "message", title: "New Message from GreenEco", description: "Hi! We've reviewed your request for the bulk order. Let's discuss terms.", time: "1h ago", unread: true, iconKey: "message", color: "bg-black/5 text-black" }
];

const INITIAL_REQUESTS = [
  { id: "req1", type: "connection", user: { name: "Budi Santoso", avatar: "https://picsum.photos/seed/budi/100", extra: "CEO at TechCorp" }, time: "30m ago" }
];

export default function NotificationsPage() {
  const { t } = useLanguage();
  const { activeAccount } = useAccount();
  const { toast } = useToast();
  const [notifications, setNotifications] = React.useState<any[]>([]);
  const [requests, setRequests] = React.useState<any[]>(INITIAL_REQUESTS);
  const [selectedNotification, setSelectedNotification] = React.useState<any>(null);
  const [isLoaded, setIsLoaded] = React.useState(false);

  const getStorageKey = React.useCallback(() => `ontapp_notifications_v3_${activeAccount.id}`, [activeAccount.id]);

  React.useEffect(() => {
    const handlePopState = () => { if (selectedNotification) setSelectedNotification(null); };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [selectedNotification]);

  React.useEffect(() => {
    const saved = localStorage.getItem(getStorageKey());
    setNotifications(saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS);
    setIsLoaded(true);
  }, [activeAccount.id, getStorageKey]);

  React.useEffect(() => {
    if (isLoaded) localStorage.setItem(getStorageKey(), JSON.stringify(notifications));
  }, [notifications, isLoaded, getStorageKey]);

  const handleOpenDetail = (notification: any) => {
    setSelectedNotification(notification);
    window.history.pushState({ notifOpen: notification.id }, '');
    if (notification.unread) {
      setNotifications(prev => prev.map(n => n.id === notification.id ? { ...n, unread: false } : n));
    }
  };

  const closeDetail = () => {
    if (window.history.state?.notifOpen) {
      window.history.back();
    } else {
      setSelectedNotification(null);
    }
  };

  if (!isLoaded) return null;

  return (
    <DashboardLayout>
      <div className="space-y-4 pb-24 relative max-w-xl mx-auto px-1 md:px-0">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="space-y-0.5">
            <div className="flex items-center gap-1.5 text-black font-black text-[8px] uppercase tracking-[0.2em]"><Bell className="size-2.5" /> {t('notifications')}</div>
            <h1 className="text-base font-black tracking-tight uppercase">{t('activity_center')}</h1>
          </div>
        </header>

        <Tabs defaultValue="activity" className="w-full">
          <TabsList className="w-full grid grid-cols-2 bg-slate-100 p-1 rounded-xl mb-4">
            <TabsTrigger value="activity" className="font-black text-[10px] uppercase">Aktivitas</TabsTrigger>
            <TabsTrigger value="requests" className="font-black text-[10px] uppercase">Permintaan</TabsTrigger>
          </TabsList>

          <TabsContent value="activity" className="space-y-1.5 outline-none min-h-[300px]">
            {notifications.map((n) => {
              const IconComp = ICON_MAP[n.iconKey as keyof typeof ICON_MAP] || Bell;
              return (
                <div key={n.id} onClick={() => handleOpenDetail(n)} className={cn("relative rounded-xl border border-border shadow-sm p-3 cursor-pointer transition-colors hover:bg-slate-50", n.unread ? 'border-l-[3px] border-l-black' : 'opacity-70')}>
                  <div className="flex items-start gap-2.5">
                    <div className={cn("size-9 rounded-xl flex items-center justify-center shrink-0 shadow-inner", n.color)}><IconComp className="size-4" /></div>
                    <div className="flex-1 min-w-0 space-y-0.5">
                      <div className="flex items-center justify-between"><h3 className="font-black uppercase text-[10px] truncate">{n.title}</h3><span className="text-[7px] font-black uppercase text-muted-foreground">{n.time}</span></div>
                      <p className="text-[10px] font-medium leading-snug line-clamp-2 text-muted-foreground">{n.description}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </TabsContent>

          <TabsContent value="requests" className="space-y-2 min-h-[300px]">
            {requests.map((req) => (
              <div key={req.id} className="p-3 bg-card border border-border rounded-xl flex items-center justify-between gap-3">
                <div className="flex items-center gap-3"><Avatar className="size-10 border"><AvatarImage src={req.user.avatar} /><AvatarFallback className="text-xs">{req.user.name[0]}</AvatarFallback></Avatar><div><p className="text-xs font-black">{req.user.name}</p><p className="text-[8px] font-bold uppercase opacity-50">{req.user.extra}</p></div></div>
                <div className="flex gap-1.5"><Button size="sm" className="h-7 px-3 rounded-lg bg-black text-white text-[8px] font-black uppercase">{t('approve')}</Button></div>
              </div>
            ))}
          </TabsContent>
        </Tabs>

        <Dialog open={!!selectedNotification} onOpenChange={(o) => !o && closeDetail()}>
          <DialogContent className="w-[90%] md:max-w-md rounded-[2rem] border-none shadow-2xl p-6 bg-card text-foreground outline-none [&>button]:hidden animate-in zoom-in-95 duration-200">
             {selectedNotification && (
               <div className="space-y-6">
                  <div className="flex items-center justify-between"><div className={cn("size-10 rounded-xl flex items-center justify-center shadow-inner", selectedNotification.color)}>{React.createElement(ICON_MAP[selectedNotification.iconKey as keyof typeof ICON_MAP] || Bell, { className: "size-5" })}</div><button onClick={closeDetail} className="p-2 rounded-lg bg-muted/30 text-muted-foreground"><X className="size-4" /></button></div>
                  <div className="space-y-2"><DialogTitle className="text-xl font-black uppercase tracking-tight">{selectedNotification.title}</DialogTitle><div className="flex items-center gap-1.5 text-[9px] font-black text-muted-foreground uppercase"><Clock className="size-2.5" /> {selectedNotification.time} • AI Hub</div></div>
                  <p className="text-sm font-medium text-slate-600 bg-slate-50 p-4 rounded-2xl border">{selectedNotification.description}</p>
                  <Button onClick={closeDetail} className="w-full h-11 rounded-xl bg-primary text-white font-black text-[10px] uppercase shadow-lg">{t('take_action')}</Button>
               </div>
             )}
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}
