
"use client";

import * as React from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area
} from "recharts";
import { 
  Users, 
  TrendingUp, 
  MessageSquare, 
  Briefcase, 
  ArrowUpRight, 
  ArrowDownRight,
  Plus,
  Zap,
  LayoutDashboard
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCollection, useFirestore } from "@/firebase";
import { collection } from "firebase/firestore";

const PERFORMANCE_DATA = [
  { name: "Mon", interaction: 4000, reach: 2400 },
  { name: "Tue", interaction: 3000, reach: 1398 },
  { name: "Wed", interaction: 2000, reach: 9800 },
  { name: "Thu", interaction: 2780, reach: 3908 },
  { name: "Fri", interaction: 1890, reach: 4800 },
  { name: "Sat", interaction: 2390, reach: 3800 },
  { name: "Sun", interaction: 3490, reach: 4300 },
];

const OPPORTUNITY_GROWTH_MOCK = [
  { month: "Jan", count: 12 },
  { month: "Feb", count: 19 },
  { month: "Mar", count: 15 },
  { month: "Apr", count: 22 },
  { month: "May", count: 30 },
  { month: "Jun", count: 28 },
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

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <Card className="lg:col-span-8 border-slate-200 shadow-sm rounded-3xl overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between p-8">
              <div className="space-y-1">
                <CardTitle className="text-xl font-black text-slate-900">Network Engagement</CardTitle>
                <CardDescription className="font-medium">Interaction vs Reach over the last 7 days.</CardDescription>
              </div>
            </CardHeader>
            <CardContent className="px-4 pb-8">
              <div className="h-[350px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={PERFORMANCE_DATA}>
                    <defs>
                      <linearGradient id="colorInter" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#6366F1" stopOpacity={0.1}/>
                        <stop offset="95%" stopColor="#6366F1" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                    <XAxis 
                      dataKey="name" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{fontSize: 11, fontWeight: 700, fill: '#94A3B8'}} 
                      dy={10}
                    />
                    <YAxis 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{fontSize: 11, fontWeight: 700, fill: '#94A3B8'}} 
                      dx={-10}
                    />
                    <Tooltip 
                      contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)' }}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="interaction" 
                      stroke="#6366F1" 
                      strokeWidth={3}
                      fillOpacity={1} 
                      fill="url(#colorInter)" 
                    />
                    <Area 
                      type="monotone" 
                      dataKey="reach" 
                      stroke="#CBD5E1" 
                      strokeWidth={2}
                      fill="transparent"
                      strokeDasharray="5 5"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card className="lg:col-span-4 border-slate-200 shadow-sm rounded-3xl overflow-hidden">
            <CardHeader className="p-8">
              <CardTitle className="text-xl font-black text-slate-900">Opportunity Growth</CardTitle>
              <CardDescription className="font-medium">Monthly lead acquisition rate.</CardDescription>
            </CardHeader>
            <CardContent className="px-4 pb-8">
              <div className="h-[350px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={OPPORTUNITY_GROWTH_MOCK}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                    <XAxis 
                      dataKey="month" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{fontSize: 11, fontWeight: 700, fill: '#94A3B8'}} 
                      dy={10}
                    />
                    <YAxis 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{fontSize: 11, fontWeight: 700, fill: '#94A3B8'}} 
                      dx={-10}
                    />
                    <Tooltip 
                      cursor={{fill: '#F8FAFC'}}
                      contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)' }}
                    />
                    <Bar dataKey="count" fill="#6366F1" radius={[8, 8, 0, 0]} barSize={32} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
