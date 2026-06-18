"use client";

import * as React from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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

const PERFORMANCE_DATA = [
  { name: "Mon", interaction: 4000, reach: 2400 },
  { name: "Tue", interaction: 3000, reach: 1398 },
  { name: "Wed", interaction: 2000, reach: 9800 },
  { name: "Thu", interaction: 2780, reach: 3908 },
  { name: "Fri", interaction: 1890, reach: 4800 },
  { name: "Sat", interaction: 2390, reach: 3800 },
  { name: "Sun", interaction: 3490, reach: 4300 },
];

const OPPORTUNITY_DATA = [
  { month: "Jan", count: 12 },
  { month: "Feb", count: 19 },
  { month: "Mar", count: 15 },
  { month: "Apr", count: 22 },
  { month: "May", count: 30 },
  { month: "Jun", count: 28 },
];

export default function DashboardPage() {
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
          <Card className="border-slate-200 shadow-sm hover:shadow-md transition-all rounded-2xl group overflow-hidden">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="size-12 rounded-2xl bg-indigo-50 text-accent flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Briefcase className="size-6" />
                </div>
                <Badge className="bg-emerald-50 text-emerald-600 border-none font-bold px-2 py-0.5 flex gap-1">
                  <ArrowUpRight className="size-3" />
                  12%
                </Badge>
              </div>
              <div className="mt-6">
                <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Total Opportunities</span>
                <h3 className="text-3xl font-black text-slate-900 mt-1">1,284</h3>
                <p className="text-xs text-slate-400 font-medium mt-1">+14 this week</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-slate-200 shadow-sm hover:shadow-md transition-all rounded-2xl group overflow-hidden">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="size-12 rounded-2xl bg-emerald-50 text-emerald-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Zap className="size-6" />
                </div>
                <Badge className="bg-emerald-50 text-emerald-600 border-none font-bold px-2 py-0.5 flex gap-1">
                  <ArrowUpRight className="size-3" />
                  8.4%
                </Badge>
              </div>
              <div className="mt-6">
                <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Active Leads</span>
                <h3 className="text-3xl font-black text-slate-900 mt-1">452</h3>
                <p className="text-xs text-slate-400 font-medium mt-1">Across 12 industries</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-slate-200 shadow-sm hover:shadow-md transition-all rounded-2xl group overflow-hidden">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="size-12 rounded-2xl bg-orange-50 text-orange-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <MessageSquare className="size-6" />
                </div>
                <Badge className="bg-rose-50 text-rose-600 border-none font-bold px-2 py-0.5 flex gap-1">
                  <ArrowDownRight className="size-3" />
                  2%
                </Badge>
              </div>
              <div className="mt-6">
                <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Recent Messages</span>
                <h3 className="text-3xl font-black text-slate-900 mt-1">86</h3>
                <p className="text-xs text-slate-400 font-medium mt-1">Average response: 2h</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-slate-200 shadow-sm hover:shadow-md transition-all rounded-2xl group overflow-hidden">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="size-12 rounded-2xl bg-slate-50 text-slate-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Users className="size-6" />
                </div>
                <Badge className="bg-emerald-50 text-emerald-600 border-none font-bold px-2 py-0.5 flex gap-1">
                  <ArrowUpRight className="size-3" />
                  24%
                </Badge>
              </div>
              <div className="mt-6">
                <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Total Reach</span>
                <h3 className="text-3xl font-black text-slate-900 mt-1">45.2K</h3>
                <p className="text-xs text-slate-400 font-medium mt-1">Global impressions</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <Card className="lg:col-span-8 border-slate-200 shadow-sm rounded-3xl overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between p-8">
              <div className="space-y-1">
                <CardTitle className="text-xl font-black text-slate-900">Network Engagement</CardTitle>
                <CardDescription className="font-medium">Interaction vs Reach over the last 7 days.</CardDescription>
              </div>
              <div className="flex gap-2">
                <div className="flex items-center gap-2">
                  <div className="size-2 rounded-full bg-accent" />
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Interaction</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="size-2 rounded-full bg-slate-200" />
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Reach</span>
                </div>
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
                      cursor={{ stroke: '#6366F1', strokeWidth: 1, strokeDasharray: '4 4' }}
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
                  <BarChart data={OPPORTUNITY_DATA}>
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

        {/* Feature Teasers */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="border-none shadow-xl bg-slate-900 text-white rounded-[2rem] overflow-hidden relative group cursor-pointer p-8">
            <div className="relative z-10 flex flex-col justify-between h-full space-y-6">
              <div className="size-14 rounded-2xl bg-white/10 flex items-center justify-center backdrop-blur-md">
                <TrendingUp className="size-7 text-indigo-300" />
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-black tracking-tight leading-none">AI Market Forecast</h3>
                <p className="text-indigo-200/80 font-medium text-sm">Predict trends in your sector based on real-time network data streams.</p>
              </div>
              <Button variant="ghost" className="w-fit bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl border-none gap-2">
                Explore Analytics
                <ArrowUpRight className="size-4" />
              </Button>
            </div>
            <div className="absolute top-0 right-0 w-48 h-48 bg-accent/20 rounded-full blur-[80px] -mr-16 -mt-16 group-hover:scale-125 transition-transform duration-500" />
          </Card>

          <Card className="border-slate-200 shadow-sm bg-white rounded-[2rem] overflow-hidden group cursor-pointer p-8 flex flex-col justify-between space-y-6">
             <div className="size-14 rounded-2xl bg-indigo-50 flex items-center justify-center group-hover:rotate-6 transition-transform">
                <Users className="size-7 text-accent" />
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-black text-slate-900 tracking-tight leading-none">Partner Synergy</h3>
                <p className="text-slate-500 font-medium text-sm">See which businesses in the network share your current strategic goals.</p>
              </div>
              <Button variant="outline" className="w-fit border-slate-200 text-slate-600 font-bold rounded-xl hover:bg-slate-50 gap-2">
                View Matches
                <ArrowUpRight className="size-4" />
              </Button>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
