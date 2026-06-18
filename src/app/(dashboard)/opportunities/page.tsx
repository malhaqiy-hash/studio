
"use client";

import * as React from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Filter, Calendar, DollarSign, MapPin, ExternalLink, Bookmark, Clock, ArrowRight } from "lucide-react";

const OPPORTUNITIES = [
  {
    id: 1,
    title: "Supplier Needed: Recycled PET Resin",
    company: "PlanetBottles Ltd",
    industry: "Manufacturing",
    location: "Stockholm, Sweden",
    value: "$250k - $500k / Year",
    deadline: "Dec 15, 2023",
    tags: ["Raw Materials", "Sustainable", "Ongoing"],
    type: "Sourcing"
  },
  {
    id: 2,
    title: "Exclusive Distributor for EU Region",
    company: "NextGen Solar Components",
    industry: "Energy",
    location: "Global",
    value: "Revenue Share",
    deadline: "Jan 10, 2024",
    tags: ["Solar", "EU Market", "Strategic"],
    type: "Distributor"
  },
  {
    id: 3,
    title: "Seed Series Partnership Opportunity",
    company: "QuantLogics AI",
    industry: "FinTech",
    location: "Silicon Valley, USA",
    value: "$2.5M Investment",
    deadline: "Nov 30, 2023",
    tags: ["Series A", "AI", "Fintech"],
    type: "Investment"
  }
];

export default function OpportunitiesPage() {
  return (
    <DashboardLayout>
      <div className="space-y-8">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1">
            <h1 className="text-3xl font-headline font-black text-slate-900 tracking-tight">Strategic Opportunities</h1>
            <p className="text-slate-500 font-medium">Curated high-value B2B leads across the OnTapp network.</p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" className="rounded-xl border-slate-200 h-11 px-5 flex gap-2 font-bold text-slate-600">
              <Filter className="size-4" />
              Advanced Filters
            </Button>
            <Button className="rounded-xl bg-slate-900 hover:bg-slate-800 text-white h-11 px-6 font-bold shadow-lg">
              Post Opportunity
            </Button>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-1 bg-slate-100 rounded-2xl">
          {["All Leads", "Sourcing", "Investment", "Strategic Partnerships"].map((filter, idx) => (
            <button 
              key={filter} 
              className={`py-3 px-4 text-sm font-black uppercase tracking-widest rounded-xl transition-all ${idx === 0 ? 'bg-white shadow-sm text-slate-900' : 'text-slate-400 hover:text-slate-600'}`}
            >
              {filter}
            </button>
          ))}
        </div>

        <div className="space-y-6">
          {OPPORTUNITIES.map((opp) => (
            <Card key={opp.id} className="overflow-hidden border-slate-200 shadow-sm hover:shadow-lg transition-all border-l-8 border-l-slate-900">
              <CardContent className="p-0">
                <div className="flex flex-col lg:flex-row">
                  <div className="flex-1 p-8 space-y-6">
                    <div className="flex justify-between items-start">
                      <div className="space-y-1">
                        <div className="flex items-center gap-3 mb-2">
                          <Badge className="bg-slate-100 text-slate-600 border-none font-black text-[10px] uppercase tracking-tighter">
                            {opp.type}
                          </Badge>
                          <div className="flex items-center gap-1.5 text-rose-500 font-bold text-[10px] uppercase tracking-widest animate-pulse">
                            <Clock className="size-3" />
                            Closing Soon
                          </div>
                        </div>
                        <h3 className="text-2xl font-black text-slate-900 tracking-tight">{opp.title}</h3>
                      </div>
                      <Button variant="ghost" size="icon" className="rounded-full text-slate-300 hover:text-accent">
                        <Bookmark className="size-6" />
                      </Button>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                      <div className="space-y-1">
                        <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Industry</span>
                        <div className="flex items-center gap-2 text-sm font-bold text-slate-700 uppercase">
                          <ArrowRight className="size-3 text-slate-300" />
                          {opp.industry}
                        </div>
                      </div>
                      <div className="space-y-1">
                        <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Location</span>
                        <div className="flex items-center gap-2 text-sm font-bold text-slate-700 uppercase">
                          <MapPin className="size-3 text-slate-300" />
                          {opp.location}
                        </div>
                      </div>
                      <div className="space-y-1">
                        <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Value Potential</span>
                        <div className="flex items-center gap-2 text-sm font-bold text-emerald-600 uppercase">
                          <DollarSign className="size-3 text-emerald-300" />
                          {opp.value}
                        </div>
                      </div>
                      <div className="space-y-1">
                        <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Decision Deadline</span>
                        <div className="flex items-center gap-2 text-sm font-bold text-slate-700 uppercase">
                          <Calendar className="size-3 text-slate-300" />
                          {opp.deadline}
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {opp.tags.map(tag => (
                        <Badge key={tag} variant="outline" className="bg-slate-50 border-slate-200 text-slate-500 font-bold px-3 py-1">
                          #{tag}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="bg-slate-50 lg:w-80 p-8 flex flex-col justify-between border-l border-slate-100">
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <Avatar className="size-12 border shadow-sm ring-4 ring-white">
                          <AvatarImage src={`https://picsum.photos/seed/${opp.id}/100`} />
                          <AvatarFallback>B</AvatarFallback>
                        </Avatar>
                        <div>
                          <h4 className="font-bold text-slate-900 leading-none">{opp.company}</h4>
                          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Verified Enterprise</span>
                        </div>
                      </div>
                      <p className="text-sm text-slate-500 font-medium leading-relaxed italic">
                        "We are looking for long-term strategic alignment with partners who value quality over cost."
                      </p>
                    </div>
                    <div className="space-y-3 pt-6 lg:pt-0">
                      <Button className="w-full bg-accent hover:bg-indigo-400 text-white font-bold h-12 rounded-xl shadow-lg shadow-indigo-200">
                        Submit Proposal
                      </Button>
                      <Button variant="ghost" className="w-full font-bold text-slate-400 hover:text-slate-600 rounded-xl flex gap-2">
                        <ExternalLink className="size-4" />
                        View Company Profile
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
