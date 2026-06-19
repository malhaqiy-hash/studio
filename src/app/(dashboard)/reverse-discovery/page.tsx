
"use client";

import * as React from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Magnet, 
  Users, 
  MapPin, 
  Search, 
  CheckCircle2, 
  ArrowRight, 
  Clock, 
  Zap, 
  Globe,
  Filter,
  Package,
  Headphones,
  Truck
} from "lucide-react";
import { cn } from "@/lib/utils";

const MOCK_DEMANDS = [
  {
    id: "d1",
    title: "Eco-Friendly Bulk Shipping Boxes",
    description: "Multiple e-commerce distributors in Surabaya are seeking FSC-certified packaging suppliers for Q4 peak season.",
    category: "Packaging",
    location: "Surabaya",
    urgency: "High",
    buyerType: "Distributors",
    volume: "10,000+ units/mo",
    timestamp: "2h ago"
  },
  {
    id: "d2",
    title: "AI Implementation for Logistic Fleets",
    description: "Medium-sized transport companies are looking for route optimization software with real-time tracking integration.",
    category: "Tech & SaaS",
    location: "Global",
    urgency: "Medium",
    buyerType: "Transport SMEs",
    volume: "Enterprise License",
    timestamp: "5h ago"
  },
  {
    id: "d3",
    title: "Halal Certified Raw Coffee Beans",
    description: "Emerging cafe chains in Tokyo are specifically requesting direct trade with Indonesian organic cooperatives.",
    category: "F&B",
    location: "Tokyo, Japan",
    urgency: "High",
    buyerType: "Cafe Chains",
    volume: "500kg/mo",
    timestamp: "1d ago"
  }
];

export default function ReverseDiscoveryPage() {
  const [activeTab, setActiveTab] = React.useState('all');

  return (
    <DashboardLayout>
      <div className="space-y-8 py-6 max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 bg-rose-50 text-rose-600 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest w-fit border border-rose-100">
              <Magnet className="size-3 animate-pulse" />
              Reverse Intelligence
            </div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight">Demand Detection</h1>
            <p className="text-slate-500 font-medium text-lg max-w-2xl">
              Don't search for customers—let our AI show you exactly where the market is screaming for your solutions right now.
            </p>
          </div>
          <div className="flex gap-2">
             <Button variant="outline" className="rounded-2xl font-bold h-12 px-6 flex gap-2">
                <Filter className="size-4" />
                Filter Sectors
             </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
           {/* Sidebar Statistics */}
           <div className="lg:col-span-4 space-y-6">
              <Card className="rounded-[2.5rem] bg-slate-900 text-white p-8 space-y-8 overflow-hidden relative">
                 <div className="relative z-10 space-y-6">
                    <div className="space-y-1">
                       <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400">Global Pulse</h4>
                       <p className="text-3xl font-black">124 New Signals</p>
                    </div>
                    <div className="space-y-4">
                       {[
                         { label: "Packaging Demand", val: "+42%", color: "text-emerald-400" },
                         { label: "SaaS Intent", val: "+18%", color: "text-indigo-400" },
                         { label: "Logistics Queries", val: "+67%", color: "text-amber-400" }
                       ].map((s, i) => (
                         <div key={i} className="flex items-center justify-between border-b border-white/10 pb-2">
                            <span className="text-xs font-bold text-slate-300">{s.label}</span>
                            <span className={cn("text-xs font-black", s.color)}>{s.val}</span>
                         </div>
                       ))}
                    </div>
                    <Button className="w-full bg-white text-slate-900 hover:bg-slate-100 font-black rounded-xl h-12 shadow-xl">
                       Get Custom Lead Alert
                    </Button>
                 </div>
                 <div className="absolute top-0 right-0 w-64 h-64 bg-accent/20 rounded-full blur-3xl -mr-32 -mt-32" />
              </Card>

              <Card className="rounded-[2.5rem] border-slate-100 p-8 space-y-6 bg-white">
                 <h4 className="text-sm font-black uppercase tracking-widest text-slate-400">Top Buyer Clusters</h4>
                 <div className="space-y-4">
                    {[
                      { name: "Tokyo Cafe Co-ops", icon: Globe, count: 12 },
                      { name: "EU Bio-Logistics", icon: Truck, count: 8 },
                      { name: "Jakarta SaaS SMEs", icon: Headphones, count: 24 }
                    ].map((c, i) => (
                      <div key={i} className="flex items-center gap-4 group cursor-pointer">
                         <div className="size-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-indigo-50 group-hover:text-accent transition-colors">
                            <c.icon className="size-5" />
                         </div>
                         <div className="flex-1">
                            <h5 className="text-sm font-bold text-slate-900">{c.name}</h5>
                            <p className="text-[10px] font-black text-slate-400 uppercase">{c.count} Active Demands</p>
                         </div>
                      </div>
                    ))}
                 </div>
              </Card>
           </div>

           {/* Main Demand List */}
           <div className="lg:col-span-8 space-y-6">
              <div className="flex items-center gap-4 border-b border-slate-100 pb-2">
                 {['all', 'urgent', 'local', 'global'].map((t) => (
                    <button 
                      key={t}
                      onClick={() => setActiveTab(t)}
                      className={cn(
                        "text-[10px] font-black uppercase tracking-widest pb-4 px-2 relative transition-colors",
                        activeTab === t ? "text-accent" : "text-slate-400 hover:text-slate-600"
                      )}
                    >
                      {t} Signals
                      {activeTab === t && <div className="absolute bottom-0 left-0 right-0 h-1 bg-accent rounded-full" />}
                    </button>
                 ))}
              </div>

              <div className="grid gap-6">
                 {MOCK_DEMANDS.map((demand) => (
                   <Card key={demand.id} className="overflow-hidden border-slate-100 rounded-[2.5rem] bg-white group hover:shadow-2xl hover:-translate-y-1 transition-all">
                      <CardContent className="p-0">
                         <div className="flex flex-col md:flex-row">
                            <div className={cn(
                               "w-2 shrink-0 transition-colors",
                               demand.urgency === 'High' ? 'bg-rose-500' : 'bg-indigo-500'
                            )} />
                            <div className="p-8 flex-1 space-y-6">
                               <div className="flex flex-wrap items-center justify-between gap-4">
                                  <div className="flex items-center gap-3">
                                     <h3 className="text-2xl font-black text-slate-900 group-hover:text-accent transition-colors tracking-tight">{demand.title}</h3>
                                     <Badge variant="outline" className="text-[10px] font-black uppercase tracking-widest border-slate-200">
                                        {demand.category}
                                     </Badge>
                                  </div>
                                  <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase">
                                     <Clock className="size-3" />
                                     {demand.timestamp}
                                  </div>
                               </div>

                               <p className="text-slate-500 font-medium text-base leading-relaxed">
                                  {demand.description}
                               </p>

                               <div className="flex flex-wrap items-center gap-6 pt-2">
                                  <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                     <MapPin className="size-3.5 text-rose-400" />
                                     {demand.location}
                                  </div>
                                  <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                     <Users className="size-3.5 text-indigo-400" />
                                     {demand.buyerType}
                                  </div>
                                  <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                     <Package className="size-3.5 text-amber-400" />
                                     {demand.volume}
                                  </div>
                               </div>

                               <div className="pt-6 border-t border-slate-50 flex flex-col sm:flex-row items-center gap-4">
                                  <Button className="w-full sm:w-auto rounded-xl bg-slate-900 hover:bg-black font-black h-12 px-8 flex gap-2">
                                     Pitch My Solution
                                     <ArrowRight className="size-4" />
                                  </Button>
                                  <Button variant="ghost" className="w-full sm:w-auto text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-accent">
                                     View Market Analysis
                                  </Button>
                               </div>
                            </div>
                         </div>
                      </CardContent>
                   </Card>
                 ))}
              </div>
           </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
