
"use client";

import * as React from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  AreaChart,
  Area
} from "recharts";
import { 
  Users, 
  TrendingUp, 
  MessageSquare, 
  Eye, 
  ArrowUpRight, 
  ArrowDownRight,
  Target,
  Globe,
  Plus
} from "lucide-react";
import { Button } from "@/components/ui/button";

const ENGAGEMENT_DATA = [
  { name: "Mon", posts: 24, interactions: 400 },
  { name: "Tue", posts: 13, interactions: 300 },
  { name: "Wed", posts: 38, interactions: 900 },
  { name: "Thu", posts: 29, interactions: 700 },
  { name: "Fri", posts: 48, interactions: 1200 },
  { name: "Sat", posts: 21, interactions: 500 },
  { name: "Sun", posts: 15, interactions: 200 },
];

const FOLLOWER_DATA = [
  { month: "Jan", count: 800 },
  { month: "Feb", count: 950 },
  { month: "Mar", count: 1100 },
  { month: "Apr", count: 1400 },
  { month: "May", count: 1800 },
  { month: "Jun", count: 2400 },
];

export default function DashboardPage() {
  return (
    <DashboardLayout>
      <div className="space-y-8">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-headline font-black text-slate-900">Analytical Insights</h1>
            <p className="text-slate-500 font-medium">Tracking performance across the OnTapp network.</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="rounded-xl font-bold border-slate-200">Export Report</Button>
            <Button className="rounded-xl bg-accent hover:bg-indigo-400 font-bold text-white shadow-lg flex gap-2">
              <Plus className="size-4" />
              New Campaign
            </Button>
          </div>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="border-slate-200 shadow-sm hover:shadow-md transition-all">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="size-10 rounded-xl bg-indigo-50 text-accent flex items-center justify-center">
                  <Users className="size-5" />
                </div>
                <div className="flex items-center gap-1 text-xs font-bold text-emerald-500 bg-emerald-50 px-2 py-0.5 rounded-full">
                  <ArrowUpRight className="size-3" />
                  12%
                </div>
              </div>
              <div className="mt-4">
                <span className="text-sm text-slate-400 font-bold uppercase tracking-wider">Total Reach</span>
                <h3 className="text-2xl font-black text-slate-900 mt-1">45.2K</h3>
              </div>
            </CardContent>
          </Card>

          <Card className="border-slate-200 shadow-sm hover:shadow-md transition-all">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="size-10 rounded-xl bg-emerald-50 text-emerald-500 flex items-center justify-center">
                  <TrendingUp className="size-5" />
                </div>
                <div className="flex items-center gap-1 text-xs font-bold text-emerald-500 bg-emerald-50 px-2 py-0.5 rounded-full">
                  <ArrowUpRight className="size-3" />
                  8%
                </div>
              </div>
              <div className="mt-4">
                <span className="text-sm text-slate-400 font-bold uppercase tracking-wider">Post Engagement</span>
                <h3 className="text-2xl font-black text-slate-900 mt-1">12.8%</h3>
              </div>
            </CardContent>
          </Card>

          <Card className="border-slate-200 shadow-sm hover:shadow-md transition-all">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="size-10 rounded-xl bg-orange-50 text-orange-500 flex items-center justify-center">
                  <MessageSquare className="size-5" />
                </div>
                <div className="flex items-center gap-1 text-xs font-bold text-rose-500 bg-rose-50 px-2 py-0.5 rounded-full">
                  <ArrowDownRight className="size-3" />
                  3%
                </div>
              </div>
              <div className="mt-4">
                <span className="text-sm text-slate-400 font-bold uppercase tracking-wider">Direct Leads</span>
                <h3 className="text-2xl font-black text-slate-900 mt-1">184</h3>
              </div>
            </CardContent>
          </Card>

          <Card className="border-slate-200 shadow-sm hover:shadow-md transition-all">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="size-10 rounded-xl bg-slate-50 text-slate-500 flex items-center justify-center">
                  <Globe className="size-5" />
                </div>
                <div className="flex items-center gap-1 text-xs font-bold text-emerald-500 bg-emerald-50 px-2 py-0.5 rounded-full">
                  <ArrowUpRight className="size-3" />
                  22%
                </div>
              </div>
              <div className="mt-4">
                <span className="text-sm text-slate-400 font-bold uppercase tracking-wider">Global Rank</span>
                <h3 className="text-2xl font-black text-slate-900 mt-1">#422</h3>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <Card className="lg:col-span-8 border-slate-200 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between p-6">
              <div>
                <CardTitle className="text-lg font-bold">Network Interactions</CardTitle>
                <CardDescription className="text-xs font-medium">Daily social activity across all published posts.</CardDescription>
              </div>
              <Badge variant="secondary" className="bg-slate-50 text-slate-500 border-slate-100">Last 7 Days</Badge>
            </CardHeader>
            <CardContent className="px-2 pb-6">
              <div className="h-[350px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={ENGAGEMENT_DATA}>
                    <defs>
                      <linearGradient id="colorInteractions" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#6366F1" stopOpacity={0.1}/>
                        <stop offset="95%" stopColor="#6366F1" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12, fontWeight: 600, fill: '#94A3B8'}} />
                    <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fontWeight: 600, fill: '#94A3B8'}} />
                    <Tooltip 
                      contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="interactions" 
                      stroke="#6366F1" 
                      strokeWidth={3}
                      fillOpacity={1} 
                      fill="url(#colorInteractions)" 
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card className="lg:col-span-4 border-slate-200 shadow-sm">
            <CardHeader className="p-6">
              <CardTitle className="text-lg font-bold">Follower Growth</CardTitle>
              <CardDescription className="text-xs font-medium">Net new following per month.</CardDescription>
            </CardHeader>
            <CardContent className="px-2 pb-6">
              <div className="h-[350px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={FOLLOWER_DATA}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                    <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fontSize: 12, fontWeight: 600, fill: '#94A3B8'}} />
                    <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fontWeight: 600, fill: '#94A3B8'}} />
                    <Tooltip 
                      cursor={{fill: '#F1F5F9'}}
                      contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                    />
                    <Bar dataKey="count" fill="#6366F1" radius={[6, 6, 0, 0]} barSize={40} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Action Widgets */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="border-slate-200 shadow-sm bg-indigo-900 text-white overflow-hidden relative group cursor-pointer">
            <CardContent className="p-8 space-y-4">
              <div className="size-12 rounded-2xl bg-white/10 flex items-center justify-center backdrop-blur-md">
                <Target className="size-6 text-indigo-300" />
              </div>
              <div>
                <h3 className="text-xl font-bold">Strategy Review</h3>
                <p className="text-indigo-200 font-medium">Get an AI-generated report on how to improve your business profile to attract better partners.</p>
              </div>
              <Button variant="outline" className="bg-white/10 hover:bg-white/20 border-white/20 text-white font-bold rounded-xl border-none">
                Start Analysis
              </Button>
            </CardContent>
            <div className="absolute top-0 right-0 w-32 h-32 bg-accent/20 rounded-full blur-3xl -mr-10 -mt-10 group-hover:scale-110 transition-transform" />
          </Card>

          <Card className="border-slate-200 shadow-sm bg-white overflow-hidden relative group cursor-pointer">
            <CardContent className="p-8 space-y-4">
              <div className="size-12 rounded-2xl bg-slate-50 flex items-center justify-center">
                <Eye className="size-6 text-slate-400" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900">Competitor Insights</h3>
                <p className="text-slate-500 font-medium">See how your engagement ranks against 5 similar businesses in the SaaS infrastructure sector.</p>
              </div>
              <Button variant="outline" className="border-slate-200 text-slate-600 font-bold rounded-xl hover:bg-slate-50">
                View Comparison
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
