
"use client";

import * as React from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Users, 
  MessageSquare, 
  Briefcase, 
  ArrowUpRight, 
  Plus,
  Zap,
  LayoutDashboard,
  Sparkles,
  Heart,
  Share2,
  TrendingUp,
  ShieldCheck,
  ChevronDown,
  Clock,
  ExternalLink,
  Target
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCollection, useFirestore } from "@/firebase";
import { collection } from "firebase/firestore";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const MOCK_FEED_ITEMS = [
  {
    id: "f1",
    type: "insight",
    title: "Market Shift: Sustainability in Tech",
    content: "We're seeing a 24% increase in procurement requests for eco-certified hardware components across the EU zone this quarter. Highly recommended to update your sustainability profile.",
    source: "OnTapp Intelligence",
    time: "15m ago",
    interactions: { likes: 124, comments: 12 },
    category: "Market Trend"
  },
  {
    id: "f2",
    type: "post",
    author: "Global Logistics Co.",
    avatar: "https://picsum.photos/seed/log/100",
    verified: true,
    content: "Successfully completed our 500th carbon-neutral delivery route! If you're looking for sustainable shipping partners in Asia, let's connect.",
    time: "2h ago",
    interactions: { likes: 89, comments: 5 },
    category: "Success Story"
  },
  {
    id: "f3",
    type: "opportunity",
    title: "Urgent: Cloud Infrastructure Support",
    content: "Large-scale manufacturing firm seeking local AI infrastructure partners for a Q4 facility upgrade in Jakarta. Budget range: $50k - $150k.",
    time: "4h ago",
    interactions: { likes: 42, comments: 18 },
    category: "Micro-Opportunity",
    urgent: true
  }
];

export default function DashboardPage() {
  const db = useFirestore();
  const { data: opportunities, loading: opportunitiesLoading } = useCollection(
    db ? collection(db, "opportunities") : null
  );

  const stats = [
    { label: "Total Opportunities", value: opportunities?.length || 0, icon: Briefcase, color: "text-indigo-600", trend: "+14%" },
    { label: "Active Leads", value: 452, icon: Zap, color: "text-amber-500", trend: "+12%" },
    { label: "Recent Messages", value: 86, icon: MessageSquare, color: "text-emerald-500", trend: "+2%" },
    { label: "Total Reach", value: "45.2K", icon: Users, color: "text-rose-500", trend: "+8%" },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-8 pb-10">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-accent font-bold text-xs uppercase tracking-widest">
              <LayoutDashboard className="size-3" />
              Intelligence Dashboard
            </div>
            <h1 className="text-3xl font-headline font-black text-slate-900 tracking-tight">Performance Summary</h1>
            <p className="text-slate-500 font-medium">Real-time metrics for your business network activity.</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="rounded-xl font-bold border-slate-200 hover:bg-slate-50">Generate Report</Button>
            <Button className="rounded-xl bg-accent hover:bg-indigo-600 font-bold text-white shadow-lg flex gap-2">
              <Plus className="size-4" />
              New Campaign
            </Button>
          </div>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, i) => (
            <Card key={i} className="border-slate-200 shadow-sm rounded-2xl overflow-hidden">
              <CardContent className="p-6">
                {opportunitiesLoading ? (
                  <div className="space-y-6">
                    <div className="flex justify-between">
                      <Skeleton className="size-12 rounded-2xl" />
                      <Skeleton className="h-6 w-12 rounded-full" />
                    </div>
                    <div className="space-y-2">
                      <Skeleton className="h-3 w-20" />
                      <Skeleton className="h-8 w-24" />
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex items-center justify-between">
                      <div className="size-12 rounded-2xl bg-slate-50 flex items-center justify-center">
                        <stat.icon className={`size-6 ${stat.color}`} />
                      </div>
                      <Badge className="bg-emerald-50 text-emerald-600 border-none font-bold px-2 py-0.5 flex gap-1">
                        <ArrowUpRight className="size-3" />
                        {stat.trend}
                      </Badge>
                    </div>
                    <div className="mt-6">
                      <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest">
                        {stat.label}
                      </span>
                      <h3 className="text-3xl font-black text-slate-900 mt-1">
                        {stat.value}
                      </h3>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Feed Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: AI Feed */}
          <div className="lg:col-span-8 space-y-6">
            {/* AI Personalization Banner */}
            <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white relative overflow-hidden shadow-2xl">
              <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="space-y-2">
                  <div className="inline-flex items-center gap-2 bg-accent/20 text-accent px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border border-accent/30 backdrop-blur-md">
                    <Sparkles className="size-3 animate-pulse" />
                    AI Personalized for You
                  </div>
                  <h2 className="text-2xl font-black tracking-tight">Your Smart Activity Stream</h2>
                  <p className="text-slate-400 text-sm font-medium">Discover insights and updates curated for the <span className="text-indigo-400">Tech & SaaS</span> industry.</p>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="rounded-xl h-11 border-slate-700 bg-slate-800/50 hover:bg-slate-800 text-slate-200 font-bold gap-2">
                      Most Relevant (AI)
                      <ChevronDown className="size-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48 rounded-xl">
                    <DropdownMenuItem className="font-bold">Most Relevant (AI)</DropdownMenuItem>
                    <DropdownMenuItem className="font-bold">Trending</DropdownMenuItem>
                    <DropdownMenuItem className="font-bold">Latest</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <div className="absolute top-0 right-0 w-64 h-64 bg-accent/10 rounded-full blur-3xl -mr-32 -mt-32" />
            </div>

            {/* Activity Stream */}
            <div className="space-y-6">
              {MOCK_FEED_ITEMS.map((item) => (
                <Card key={item.id} className="group overflow-hidden border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 bg-white rounded-3xl">
                  <CardHeader className="p-6 pb-2">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-3">
                        {item.type === 'post' ? (
                          <Avatar className="size-10 border shadow-sm ring-2 ring-white">
                            <AvatarImage src={item.avatar} />
                            <AvatarFallback>{item.author?.[0]}</AvatarFallback>
                          </Avatar>
                        ) : (
                          <div className={`size-10 rounded-xl flex items-center justify-center ${
                            item.type === 'insight' ? 'bg-indigo-50 text-accent' : 'bg-orange-50 text-orange-500'
                          }`}>
                            {item.type === 'insight' ? <TrendingUp className="size-5" /> : <Target className="size-5" />}
                          </div>
                        )}
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-bold text-slate-900">{item.author || item.title}</h3>
                            {item.verified && <ShieldCheck className="size-4 text-emerald-500 fill-emerald-50" />}
                          </div>
                          <div className="flex items-center gap-2 text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                            <Clock className="size-3" />
                            {item.time}
                          </div>
                        </div>
                      </div>
                      <Badge variant="secondary" className="bg-slate-100 text-slate-500 text-[10px] font-black uppercase tracking-tight py-0.5 px-3">
                        {item.category}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="p-6 pt-2 space-y-4">
                    {item.type === 'opportunity' && item.urgent && (
                      <Badge className="bg-rose-50 text-rose-600 border-none font-black text-[10px] uppercase flex gap-1 w-fit">
                        <Zap className="size-3 fill-rose-600" />
                        Urgent Discovery
                      </Badge>
                    )}
                    <p className="text-slate-600 font-medium leading-relaxed">
                      {item.content}
                    </p>
                  </CardContent>
                  <CardFooter className="p-4 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-6">
                      <button className="flex items-center gap-2 text-slate-400 hover:text-pink-500 transition-colors font-bold text-sm">
                        <Heart className="size-4" />
                        {item.interactions.likes}
                      </button>
                      <button className="flex items-center gap-2 text-slate-400 hover:text-accent transition-colors font-bold text-sm">
                        <MessageSquare className="size-4" />
                        {item.interactions.comments}
                      </button>
                    </div>
                    <div className="flex gap-2">
                      <button className="p-2 text-slate-400 hover:text-slate-600 transition-colors">
                        <Share2 className="size-4" />
                      </button>
                      <Button variant="ghost" size="sm" className="font-bold text-accent hover:bg-indigo-50 rounded-lg">
                        {item.type === 'opportunity' ? 'View Details' : 'Learn More'}
                        <ArrowUpRight className="size-3.5 ml-1" />
                      </Button>
                    </div>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>

          {/* Right Column: AI Insights Summary */}
          <div className="lg:col-span-4 space-y-6">
            <Card className="border-slate-200 shadow-sm rounded-3xl overflow-hidden">
              <CardHeader className="bg-slate-50/50 border-b border-slate-100 p-6">
                <CardTitle className="text-lg font-black text-slate-900 flex items-center gap-2">
                  <TrendingUp className="size-5 text-accent" />
                  Network Health
                </CardTitle>
                <CardDescription className="font-medium text-xs">AI-driven analysis of your reach.</CardDescription>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                <div className="space-y-4">
                  <div className="flex justify-between items-end">
                    <div className="space-y-0.5">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Industry Synergy</span>
                      <h4 className="text-2xl font-black text-slate-900">88%</h4>
                    </div>
                    <Badge className="bg-emerald-50 text-emerald-600 border-none font-bold text-[10px] uppercase">Excellent</Badge>
                  </div>
                  <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-indigo-500 w-[88%] rounded-full shadow-[0_0_10px_rgba(99,102,241,0.3)]" />
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 space-y-4">
                  <h5 className="text-xs font-black text-slate-400 uppercase tracking-widest">AI Action Items</h5>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3 p-3 rounded-xl bg-indigo-50/50 border border-indigo-100">
                      <div className="size-6 rounded-lg bg-white flex items-center justify-center shrink-0 border border-indigo-100">
                         <Zap className="size-3.5 text-accent fill-accent" />
                      </div>
                      <p className="text-[11px] font-bold text-indigo-900 leading-tight">
                        3 New matching suppliers found in "Sustainability" sector.
                      </p>
                    </div>
                    <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
                      <div className="size-6 rounded-lg bg-white flex items-center justify-center shrink-0 border border-slate-100">
                         <MessageSquare className="size-3.5 text-slate-400" />
                      </div>
                      <p className="text-[11px] font-bold text-slate-600 leading-tight">
                        Inbound partnership request from "Skyline Ventures".
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="p-4 bg-slate-50/50 border-t border-slate-100">
                <Button variant="ghost" className="w-full font-bold text-accent hover:bg-indigo-50 gap-2 h-10">
                  Full Analytics Hub
                  <ArrowUpRight className="size-4" />
                </Button>
              </CardFooter>
            </Card>

            <Card className="border-slate-200 shadow-sm rounded-3xl overflow-hidden bg-accent text-white relative">
              <CardContent className="p-8 space-y-4 relative z-10">
                <Sparkles className="size-8 text-indigo-200" />
                <div className="space-y-1">
                  <h3 className="text-xl font-black">Strategic Matchmaking</h3>
                  <p className="text-indigo-100 text-sm font-medium">Ready to scale? Let our AI find your next high-value partner.</p>
                </div>
                <Button className="w-full bg-white text-accent hover:bg-indigo-50 font-black rounded-xl h-12 shadow-lg">
                  Run Matchmaker
                </Button>
              </CardContent>
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-16 -mt-16" />
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
