"use client";

import * as React from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardFooter 
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  ShieldCheck, 
  Star, 
  Handshake, 
  Truck, 
  Briefcase, 
  ArrowUpRight, 
  MapPin, 
  Search,
  Zap,
  CheckCircle2,
  Info,
  CalendarDays,
  FileText,
  MessageSquare
} from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

const MATCH_DATA = {
  businesses: [
    { 
      name: "Apex Solutions", 
      type: "Distributor ↔ Manufacturer", 
      category: "Tech", 
      location: "Singapore", 
      matchScore: 98, 
      reputation: 4.9, 
      verified: true,
      reasons: ["Compatible production capacity", "Shared export market", "Similar transaction volume"],
      actions: ["Schedule Sync Meeting", "Send Portfolio"]
    },
    { 
      name: "Global Partners LLC", 
      type: "Buyer ↔ Supplier", 
      category: "Retail", 
      location: "London", 
      matchScore: 92, 
      reputation: 4.7, 
      verified: true,
      reasons: ["Verified supply chain", "ISO 9001 certified", "Strategic location"],
      actions: ["Request Quotation", "Review Specs"]
    },
    { 
      name: "Infinite Devs", 
      type: "Company ↔ Freelancer", 
      category: "Service", 
      location: "San Francisco", 
      matchScore: 85, 
      reputation: 4.5, 
      verified: false,
      reasons: ["Specialized skillset", "Recent project success", "Market focus"],
      actions: ["Intro Call", "View Case Studies"]
    },
  ],
  suppliers: [
    { 
      name: "EcoLogistics", 
      type: "Buyer ↔ Supplier", 
      category: "Logistics", 
      location: "Jakarta", 
      matchScore: 95, 
      reputation: 4.8, 
      verified: true,
      reasons: ["Green energy fleet", "Regional leadership", "Cost synergy"],
      actions: ["Schedule Site Visit", "Send PO Template"]
    },
    { 
      name: "Prime Sourcing Co", 
      type: "Distributor ↔ Manufacturer", 
      category: "Manufacturing", 
      location: "Berlin", 
      matchScore: 88, 
      reputation: 4.6, 
      verified: true,
      reasons: ["High production quality", "Automated tracking", "EU market access"],
      actions: ["Request Price List", "Verify Quality Certs"]
    },
  ],
  opportunities: [
    { 
      name: "EU Market Expansion", 
      type: "Startup ↔ Investor", 
      category: "Strategy", 
      location: "Brussels", 
      matchScore: 94, 
      reputation: 5.0, 
      verified: true,
      reasons: ["Matched investment stage", "Specific industry focus", "High growth intent"],
      actions: ["Submit Pitch Deck", "Book Meeting"]
    },
  ]
};

export default function MatchesPage() {
  const [activeTab, setActiveTab] = React.useState("businesses");

  const getActionIcon = (action: string) => {
    const lower = action.toLowerCase();
    if (lower.includes('meeting') || lower.includes('call')) return <CalendarDays className="size-3" />;
    if (lower.includes('proposal') || lower.includes('quotation') || lower.includes('deck')) return <FileText className="size-3" />;
    return <MessageSquare className="size-3" />;
  };

  const renderCard = (item: any, type: string) => (
    <Card key={item.name} className="group overflow-hidden border-slate-100 shadow-xl rounded-[2.5rem] hover:shadow-2xl transition-all bg-white relative">
      <div className="absolute top-6 right-6">
         <div className="text-right">
            <div className="text-3xl font-black text-indigo-600 leading-none">{item.matchScore}%</div>
            <div className="text-[7px] font-black text-slate-400 uppercase tracking-widest mt-1">Accuracy</div>
         </div>
      </div>

      <CardHeader className="p-8 pb-4">
        <div className="flex items-start gap-4">
          <div className="size-14 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center font-black text-slate-300 text-2xl shadow-inner group-hover:bg-indigo-50 group-hover:text-accent transition-colors">
            {item.name[0]}
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h3 className="font-black text-slate-900 text-xl tracking-tight leading-none group-hover:text-accent transition-colors">
                {item.name}
              </h3>
              {item.verified && (
                <ShieldCheck className="size-4 text-emerald-500 fill-emerald-50" />
              )}
            </div>
            <div className="flex items-center gap-2">
              <Badge className="bg-indigo-50 text-accent border-none font-black text-[9px] uppercase tracking-widest px-2 py-0.5">
                {item.type}
              </Badge>
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-8 pt-2 space-y-6">
        <div className="flex items-center gap-4 text-[10px] font-bold text-slate-400">
           <div className="flex items-center gap-1"><MapPin className="size-3" /> {item.location}</div>
           <div className="size-1 rounded-full bg-slate-200" />
           <div className="flex items-center gap-1 uppercase tracking-widest">{item.category}</div>
        </div>

        {/* Dynamic Reasons */}
        <div className="space-y-3">
           <div className="flex items-center gap-2 text-[9px] font-black uppercase tracking-[0.2em] text-slate-400">
              <CheckCircle2 className="size-3 text-emerald-500" />
              Matching Synergy
           </div>
           <div className="grid gap-1.5">
              {item.reasons.map((reason: string, rIdx: number) => (
                <div key={rIdx} className="text-[11px] font-bold text-slate-600 flex items-center gap-2 bg-slate-50 p-2 rounded-xl border border-slate-100/50">
                  <span className="size-1 rounded-full bg-accent" />
                  {reason}
                </div>
              ))}
           </div>
        </div>

        {/* Dynamic Actions */}
        <div className="space-y-3">
           <div className="flex items-center gap-2 text-[9px] font-black uppercase tracking-[0.2em] text-slate-400">
              <Zap className="size-3 text-amber-500" />
              Recommendations
           </div>
           <div className="flex flex-wrap gap-2">
              {item.actions.map((action: string, aIdx: number) => (
                <Badge key={aIdx} variant="outline" className="rounded-lg border-indigo-100 bg-indigo-50/50 text-indigo-700 font-bold px-2.5 py-1 text-[10px] flex gap-1.5 items-center">
                   {getActionIcon(action)}
                   {action}
                </Badge>
              ))}
           </div>
        </div>
      </CardContent>

      <CardFooter className="p-6 bg-slate-50 border-t border-slate-100">
        <Button className="w-full rounded-2xl h-12 bg-slate-900 hover:bg-black font-black text-[10px] uppercase tracking-widest shadow-lg transition-all flex gap-2">
          Connect & Initiate
          <Handshake className="size-4" />
        </Button>
      </CardFooter>
    </Card>
  );

  return (
    <DashboardLayout>
      <div className="space-y-10 py-6 max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 bg-indigo-50 text-accent px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest w-fit border border-indigo-100">
              <Zap className="size-3 animate-pulse fill-accent" />
              Intelligence Hub
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-none">
              Strategic <span className="text-accent underline decoration-indigo-200 underline-offset-8">Pairings</span>.
            </h1>
            <p className="text-slate-500 font-medium text-lg max-w-2xl">
              Continuously scanning the global network to identify high-synergy partners based on your real-time activity and business profile.
            </p>
          </div>
          <div className="flex gap-3">
             <Button variant="outline" className="rounded-[1.5rem] font-black uppercase text-[10px] tracking-widest border-slate-200 h-12 px-6 hover:bg-slate-50 flex gap-2">
               <Info className="size-4 text-slate-400" />
               Logic Info
             </Button>
          </div>
        </div>

        {/* Intelligence Tabs */}
        <Tabs defaultValue="businesses" className="space-y-8" onValueChange={setActiveTab}>
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 border-b border-slate-200 pb-1">
            <TabsList className="bg-transparent h-auto p-0 gap-8 justify-start">
              {['businesses', 'suppliers', 'opportunities'].map((tab) => (
                <TabsTrigger 
                  key={tab}
                  value={tab} 
                  className="bg-transparent border-none p-0 pb-4 h-auto data-[state=active]:bg-transparent data-[state=active]:text-accent text-slate-400 font-black uppercase tracking-[0.2em] text-[10px] relative rounded-none shadow-none group"
                >
                  <div className="flex items-center gap-2 px-1">
                    {tab === 'businesses' && <Handshake className="size-3.5" />}
                    {tab === 'suppliers' && <Truck className="size-3.5" />}
                    {tab === 'opportunities' && <Briefcase className="size-3.5" />}
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-accent scale-x-0 data-[state=active]:scale-x-100 transition-transform origin-left rounded-full" />
                </TabsTrigger>
              ))}
            </TabsList>
            
            <div className="pb-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                <input 
                  placeholder="Quick filter..." 
                  className="bg-slate-50 border border-slate-100 rounded-xl pl-10 pr-4 h-10 text-[10px] font-black uppercase tracking-widest text-slate-600 focus:outline-none focus:ring-2 focus:ring-accent/10 transition-all w-56"
                />
              </div>
            </div>
          </div>

          <TabsContent value="businesses" className="mt-0 outline-none">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {MATCH_DATA.businesses.map(item => renderCard(item, 'businesses'))}
            </div>
          </TabsContent>

          <TabsContent value="suppliers" className="mt-0 outline-none">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {MATCH_DATA.suppliers.map(item => renderCard(item, 'suppliers'))}
            </div>
          </TabsContent>

          <TabsContent value="opportunities" className="mt-0 outline-none">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {MATCH_DATA.opportunities.map(item => renderCard(item, 'opportunities'))}
            </div>
          </TabsContent>
        </Tabs>

        {/* Algorithm Insight Banner */}
        <div className="p-12 rounded-[3.5rem] bg-slate-900 text-white shadow-2xl overflow-hidden relative">
          <div className="relative z-10 flex flex-col md:flex-row items-center gap-10">
            <div className="size-24 rounded-[2rem] bg-accent flex items-center justify-center shrink-0 shadow-2xl rotate-6 group">
              <Zap className="size-12 text-white fill-white group-hover:scale-110 transition-transform" />
            </div>
            <div className="space-y-3 flex-1 text-center md:text-left">
              <div className="flex items-center gap-2 justify-center md:justify-start">
                 <h3 className="text-3xl font-black tracking-tight">Evolving Your Network</h3>
                 <Badge className="bg-white/10 text-accent-foreground border-none">Active Analysis</Badge>
              </div>
              <p className="text-slate-400 font-medium text-lg max-w-xl">
                Our engine is currently weighting <span className="text-indigo-300 font-black">Industrial IoT intent</span> and <span className="text-emerald-300 font-black">EU Distributor lookalikes</span> based on your recent activity.
              </p>
            </div>
            <Button className="rounded-[1.5rem] bg-white text-slate-900 hover:bg-slate-100 font-black text-xs uppercase tracking-[0.15em] h-14 px-10 shrink-0 shadow-xl active:scale-95 transition-all">
              Optimize Profile
            </Button>
          </div>
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-accent/20 rounded-full blur-[120px] -mr-64 -mt-64" />
        </div>
      </div>
    </DashboardLayout>
  );
}
