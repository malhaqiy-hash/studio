"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Bell, 
  MessageSquare, 
  Briefcase, 
  Handshake, 
  Clock, 
  ChevronRight,
  MoreVertical,
  Zap,
  ShieldCheck,
  X
} from "lucide-react";
import { useLanguage } from "@/context/language-context";
import { cn } from "@/lib/utils";

const MOCK_NOTIFICATIONS = [
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
    color: "bg-accent/10 text-accent"
  }
];

export default function NotificationsPage() {
  const router = useRouter();
  const { t } = useLanguage();

  return (
    <DashboardLayout>
      <div className="space-y-8 pb-10 relative">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-accent font-bold text-xs uppercase tracking-widest">
              <Bell className="size-3" />
              {t('notifications')}
            </div>
            <h1 className="text-3xl font-black tracking-tight">{t('activity_center')}</h1>
            <p className="text-muted-foreground font-medium">{t('activity_desc')}</p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="ghost" className="text-xs font-bold text-muted-foreground hover:text-foreground">
              {t('mark_read')}
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => router.back()}
              className="size-10 rounded-xl hover:bg-muted text-muted-foreground hover:text-rose-500 transition-all border border-border shadow-sm"
            >
              <X className="size-5" />
            </Button>
          </div>
        </header>

        <div className="space-y-4">
          {MOCK_NOTIFICATIONS.map((notification) => (
            <Card 
              key={notification.id} 
              className={cn(
                "group overflow-hidden border border-border shadow-sm hover:shadow-md transition-all rounded-3xl cursor-pointer",
                notification.unread ? 'bg-card border-l-4 border-l-accent' : 'bg-muted/30'
              )}
            >
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className={cn("size-12 rounded-2xl flex items-center justify-center shrink-0 shadow-inner group-hover:scale-110 transition-transform", notification.color)}>
                    <notification.icon className="size-6" />
                  </div>
                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <h3 className={cn("font-black tracking-tight", notification.unread ? 'text-foreground' : 'text-muted-foreground')}>
                          {notification.title}
                        </h3>
                        {notification.unread && (
                          <span className="size-2 bg-accent rounded-full animate-pulse" />
                        )}
                      </div>
                      <span className="text-[10px] text-muted-foreground font-bold uppercase flex items-center gap-1">
                        <Clock className="size-3" />
                        {notification.time}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground font-medium leading-relaxed line-clamp-2">
                      {notification.description}
                    </p>
                    <div className="pt-2 flex items-center gap-4">
                       <Button variant="ghost" size="sm" className="h-7 px-3 text-[10px] font-black uppercase text-accent hover:bg-accent/10 rounded-lg">
                         {t('take_action')}
                         <ChevronRight className="size-3 ml-1" />
                       </Button>
                       <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground">
                         <MoreVertical className="size-4" />
                       </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="rounded-[2.5rem] bg-slate-900 dark:bg-muted text-white overflow-hidden relative shadow-2xl">
          <CardContent className="p-8 space-y-4 relative z-10">
            <div className="size-10 rounded-xl bg-accent flex items-center justify-center shadow-lg mb-2">
              <Zap className="size-6 text-white fill-white" />
            </div>
            <div className="space-y-1">
              <h3 className="text-xl font-black">{t('notif_intel')}</h3>
              <p className="text-slate-400 text-sm font-medium">
                Our engine provides personalized suggestions based on your network interactions.
              </p>
            </div>
            <Button className="w-full bg-white text-slate-900 hover:bg-slate-100 font-black rounded-xl h-12 transition-all">
              {t('view_insights')}
            </Button>
          </CardContent>
          <div className="absolute top-0 right-0 w-64 h-64 bg-accent/20 rounded-full blur-3xl -mr-32 -mt-32" />
        </Card>
      </div>
    </DashboardLayout>
  );
}
