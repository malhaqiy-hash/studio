"use client";

import * as React from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Bell, 
  MessageSquare, 
  Briefcase, 
  Handshake, 
  CheckCircle2, 
  Clock, 
  ChevronRight,
  MoreVertical,
  Zap,
  ShieldCheck
} from "lucide-react";
import { useLanguage } from "@/context/language-context";

const MOCK_NOTIFICATIONS = [
  {
    id: "n1",
    type: "match",
    title: "New Strategic Match Found",
    description: "Our AI identified 'EcoPack Global' as a 94% match for your packaging requirements.",
    time: "10m ago",
    unread: true,
    icon: Handshake,
    color: "bg-teal-50 text-accent"
  },
  {
    id: "n2",
    type: "message",
    title: "New Message from GreenEco",
    description: "Hi! We've reviewed your request for the bulk order. Let's discuss terms.",
    time: "1h ago",
    unread: true,
    icon: MessageSquare,
    color: "bg-emerald-50 text-emerald-600"
  },
  {
    id: "n3",
    type: "opportunity",
    title: "High Value Lead Update",
    description: "The 'Cloud Infrastructure Support' opportunity has moved to 'Proposal' status.",
    time: "4h ago",
    unread: false,
    icon: Briefcase,
    color: "bg-orange-50 text-orange-600"
  },
  {
    id: "n4",
    type: "system",
    title: "Profile Verified",
    description: "Your business identity has been verified by our network intelligence engine.",
    time: "Yesterday",
    unread: false,
    icon: ShieldCheck,
    color: "bg-slate-50 text-slate-600"
  }
];

export default function NotificationsPage() {
  const { t } = useLanguage();

  return (
    <DashboardLayout>
      <div className="space-y-8 pb-10">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-accent font-bold text-xs uppercase tracking-widest">
              <Bell className="size-3" />
              {t('notifications')}
            </div>
            <h1 className="text-3xl font-headline font-black text-slate-900 tracking-tight">{t('activity_center')}</h1>
            <p className="text-slate-500 font-medium">{t('activity_desc')}</p>
          </div>
          <div className="flex gap-2">
            <Button variant="ghost" className="text-xs font-bold text-slate-400 hover:text-slate-600">
              {t('mark_read')}
            </Button>
          </div>
        </header>

        <div className="space-y-4">
          {MOCK_NOTIFICATIONS.map((notification) => (
            <Card 
              key={notification.id} 
              className={`group overflow-hidden border-slate-200 shadow-sm hover:shadow-md transition-all rounded-3xl cursor-pointer ${notification.unread ? 'bg-white border-l-4 border-l-accent' : 'bg-slate-50/50'}`}
            >
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className={`size-12 rounded-2xl flex items-center justify-center shrink-0 shadow-inner group-hover:scale-110 transition-transform ${notification.color}`}>
                    <notification.icon className="size-6" />
                  </div>
                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <h3 className={`font-black tracking-tight ${notification.unread ? 'text-slate-900' : 'text-slate-600'}`}>
                          {notification.title}
                        </h3>
                        {notification.unread && (
                          <span className="size-2 bg-accent rounded-full animate-pulse" />
                        )}
                      </div>
                      <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest flex items-center gap-1">
                        <Clock className="size-3" />
                        {notification.time}
                      </span>
                    </div>
                    <p className="text-sm text-slate-500 font-medium leading-relaxed line-clamp-2">
                      {notification.description}
                    </p>
                    <div className="pt-2 flex items-center gap-4">
                       <Button variant="ghost" size="sm" className="h-7 px-3 text-[10px] font-black uppercase tracking-widest text-accent hover:bg-teal-50 rounded-lg">
                         {t('take_action')}
                         <ChevronRight className="size-3 ml-1" />
                       </Button>
                       <Button variant="ghost" size="icon" className="h-7 w-7 text-slate-400 rounded-full">
                         <MoreVertical className="size-4" />
                       </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Intelligence Insight Widget */}
        <Card className="rounded-[2.5rem] bg-slate-900 text-white overflow-hidden relative shadow-2xl">
          <CardContent className="p-8 space-y-4 relative z-10">
            <div className="size-10 rounded-xl bg-accent flex items-center justify-center rotate-3 shadow-lg mb-2">
              <Zap className="size-6 text-white fill-white" />
            </div>
            <div className="space-y-1">
              <h3 className="text-xl font-black">{t('notif_intel')}</h3>
              <p className="text-slate-400 text-sm font-medium">
                Our engine provides personalized suggestions based on your network interactions.
              </p>
            </div>
            <Button className="w-full bg-white text-slate-900 hover:bg-slate-100 font-black rounded-xl h-12 shadow-lg transition-all active:scale-95">
              {t('view_insights')}
            </Button>
          </CardContent>
          <div className="absolute top-0 right-0 w-64 h-64 bg-accent/20 rounded-full blur-3xl -mr-32 -mt-32" />
        </Card>
      </div>
    </DashboardLayout>
  );
}
