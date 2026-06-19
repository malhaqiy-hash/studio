
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
  Info
} from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

const MATCH_DATA = {
  businesses: [
    { name: "Apex Solutions", category: "Tech", location: "Singapore", matchScore: 98, reputation: 4.9, verified: true },
    { name: "Global Partners LLC", category: "Retail", location: "London", matchScore: 92, reputation: 4.7, verified: true },
    { name: "Infinite Devs", category: "Service", location: "San Francisco", matchScore: 85, reputation: 4.5, verified: false },
  ],
  suppliers: [
    { name: "EcoLogistics", category: "Logistics", location: "Jakarta", matchScore: 95, reputation: 4.8, verified: true },
    { name: "Prime Sourcing Co", category: "Manufacturing", location: "Berlin", matchScore: 88, reputation: 4.6, verified: true },
    { name: "NextGen Parts", category: "Hardware", location: "Shenzhen", matchScore: 82, reputation: 4.2, verified: false },
  ],
  opportunities: [
    { name: "EU Market Expansion", category: "Strategy", location: "Brussels", matchScore: 94, reputation: 5.0, verified: true },
    { name: "Series B Funding Lead", category: "Finance", location: "New York", matchScore: 91, reputation: 4.8, verified: true },
    { name: "Hardware Integration", category: "Tech", location: "Tokyo", matchScore: 78, reputation: 4.4, verified: false },
  ]
};

export default function MatchesPage() {
  const [activeTab, setActiveTab] = React.useState("businesses");

  const renderCard = (item: any, type: string) => (
    <Card key={item.name} className="group overflow-hidden border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-white">
      <CardHeader className="p-6 pb-2">
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h3 className="font-black text-slate-900 text-xl tracking-tight leading-none group-hover:text-accent transition-colors">
                {item.name}
              </h3>
              {item.verified && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <ShieldCheck className="size-5 text-emerald-500 fill-emerald-50" />
                    </TooltipTrigger>
                    <TooltipContent className="bg-slate-900 text-white border-none rounded-xl">
                      <p className="text-[10px] font-bold uppercase tracking-widest">AI Verified Entity</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="bg-slate-100 text-slate-500 font-bold text-[10px] uppercase px-2 py-0 border-none">
                {item.category}
              </Badge>
              <span className="text-[10px] text-slate-400 font-medium flex items-center gap-1">
                <MapPin className="size-3" /> {item.location}
              </span>
            </div>
          </div>
          <div className="size-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0 shadow-inner group-hover:bg-indigo-50 transition-colors">
            {type === 'businesses' && <Handshake className="size-5 text-slate-400 group-hover:text-accent transition-colors" />}
            {type === 'suppliers' && <Truck className="size-5 text-slate-400 group-hover:text-accent transition-colors" />}
            {type === 'opportunities' && <Briefcase className="size-5 text-slate-400 group-hover:text-accent transition-colors" />}
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-6 space-y-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex-1 space-y-1.5">
            <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-slate-400">
              <span>Match Accuracy</span>
              <span className="text-accent">{item.matchScore}%</span>
            </div>
            <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
              <div 
                className="h-full bg-accent rounded-full shadow-[0_0_10px_rgba(99,102,241,0.5)] transition-all duration-1000" 
                style={{ width: `${item.matchScore}%` }} 
              />
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-100">
          <div className="flex items-center gap-2">
            <Star className="size-4 text-amber-500 fill-amber-500" />
            <span className="text-lg font-black text-slate-900 leading-none">{item.reputation}</span>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">/ 5.0</span>
          </div>
          <Badge className={cn(
            "border-none font-black text-[10px] uppercase px-3 py-1 shadow-sm",
            item.matchScore >= 90 ? "bg-gradient-to-r from-indigo-500 to-accent text-white" : "bg-slate-200 text-slate-600"
          )}>
            {item.matchScore >= 90 ? "Strong Synergy" : "Medium Match"}
          </Badge>
        </div>
      </CardContent>

      <CardFooter className="p-4 bg-slate-50/50 border-t border-slate-100">
        <Button className="w-full rounded-xl h-11 bg-white hover:bg-slate-900 border border-slate-200 hover:text-white text-slate-900 font-black shadow-sm transition-all flex gap-2">
          Connect Now
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
              Intelligence Match Hub
            </div>
            <h1 className="text-4xl md:text-5xl font-headline font-black text-slate-900 tracking-tight leading-none">
              Strategic <span className="text-accent underline decoration-indigo-200 underline-offset-8">Pairings</span>.
            </h1>
            <p className="text-slate-500 font-medium text-lg max-w-2xl">
              Our AI engine continuously scans the global network to identify high-synergy partners tailored to your industry profile.
            </p>
          </div>
          <div className="flex gap-3">
             <Button variant="outline" className="rounded-xl font-bold border-slate-200 h-12 px-6 hover:bg-slate-50 flex gap-2">
               <Info className="size-4 text-slate-400" />
               How it works
             </Button>
             <Button className="rounded-xl bg-slate-900 hover:bg-black text-white h-12 px-8 font-black shadow-lg flex gap-2">
               <Handshake className="size-5" />
               New Request
             </Button>
          </div>
        </div>

        {/* Intelligence Tabs */}
        <Tabs defaultValue="businesses" className="space-y-8" onValueChange={setActiveTab}>
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 border-b border-slate-200 pb-1">
            <TabsList className="bg-transparent h-auto p-0 gap-8 justify-start">
              <TabsTrigger 
                value="businesses" 
                className="bg-transparent border-none p-0 pb-4 h-auto data-[state=active]:bg-transparent data-[state=active]:text-accent text-slate-400 font-black uppercase tracking-widest text-xs relative rounded-none shadow-none group"
              >
                <div className="flex items-center gap-2 px-1">
                  <Handshake className="size-4" />
                  Business Matches
                </div>
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-accent scale-x-0 data-[state=active]:scale-x-100 transition-transform origin-left rounded-full" />
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-accent opacity-0 group-data-[state=active]:opacity-100 transition-opacity rounded-full shadow-[0_0_10px_rgba(99,102,241,0.5)]" />
              </TabsTrigger>
              <TabsTrigger 
                value="suppliers" 
                className="bg-transparent border-none p-0 pb-4 h-auto data-[state=active]:bg-transparent data-[state=active]:text-accent text-slate-400 font-black uppercase tracking-widest text-xs relative rounded-none shadow-none group"
              >
                <div className="flex items-center gap-2 px-1">
                  <Truck className="size-4" />
                  Smart Suppliers
                </div>
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-accent scale-x-0 data-[state=active]:scale-x-100 transition-transform origin-left rounded-full" />
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-accent opacity-0 group-data-[state=active]:opacity-100 transition-opacity rounded-full shadow-[0_0_10px_rgba(99,102,241,0.5)]" />
              </TabsTrigger>
              <TabsTrigger 
                value="opportunities" 
                className="bg-transparent border-none p-0 pb-4 h-auto data-[state=active]:bg-transparent data-[state=active]:text-accent text-slate-400 font-black uppercase tracking-widest text-xs relative rounded-none shadow-none group"
              >
                <div className="flex items-center gap-2 px-1">
                  <Briefcase className="size-4" />
                  Top Opportunities
                </div>
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-accent scale-x-0 data-[state=active]:scale-x-100 transition-transform origin-left rounded-full" />
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-accent opacity-0 group-data-[state=active]:opacity-100 transition-opacity rounded-full shadow-[0_0_10px_rgba(99,102,241,0.5)]" />
              </TabsTrigger>
            </TabsList>
            
            <div className="pb-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                <input 
                  placeholder="Quick filter..." 
                  className="bg-slate-50 border border-slate-100 rounded-xl pl-10 pr-4 h-9 text-xs font-bold text-slate-600 focus:outline-none focus:ring-2 focus:ring-accent/10 transition-all w-48"
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

        {/* Empty State / Algorithm Info */}
        <div className="p-10 rounded-[2.5rem] bg-slate-900 text-white shadow-2xl overflow-hidden relative">
          <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
            <div className="size-20 rounded-3xl bg-accent flex items-center justify-center shrink-0 shadow-2xl rotate-3">
              <Zap className="size-10 text-white fill-white" />
            </div>
            <div className="space-y-2 flex-1 text-center md:text-left">
              <h3 className="text-2xl font-black tracking-tight">Personalizing Your Network</h3>
              <p className="text-slate-400 font-medium">
                Our algorithm is currently prioritizing entities in the <span className="text-indigo-300 font-black">SaaS & AI Infrastructure</span> sector based on your profile details.
              </p>
            </div>
            <Button className="rounded-xl bg-white text-slate-900 hover:bg-slate-100 font-black h-12 px-8 shrink-0">
              Refresh Algorithm
            </Button>
          </div>
          <div className="absolute top-0 right-0 w-96 h-96 bg-accent/20 rounded-full blur-[100px] -mr-48 -mt-48" />
        </div>
      </div>
    </DashboardLayout>
  );
}
