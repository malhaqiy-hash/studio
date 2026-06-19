
'use client';

import * as React from 'react';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Map as MapIcon, 
  MapPin, 
  Search, 
  Filter, 
  Globe, 
  Building2, 
  Users, 
  DollarSign,
  Maximize2,
  Layers
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

const MOCK_LOCATIONS = [
  { city: "Jakarta", country: "Indonesia", count: 124, value: "$4.2M", lat: 10, lng: 10, intensity: 90 },
  { city: "Singapore", country: "Singapore", count: 86, value: "$12.8M", lat: 20, lng: 20, intensity: 75 },
  { city: "Tokyo", country: "Japan", count: 45, value: "$3.1M", lat: 30, lng: 30, intensity: 60 },
  { city: "Berlin", country: "Germany", count: 32, value: "$8.4M", lat: 40, lng: 40, intensity: 45 },
  { city: "San Francisco", country: "USA", count: 67, value: "$15.0M", lat: 50, lng: 50, intensity: 85 }
];

export default function OpportunityMapPage() {
  const [selectedRegion, setSelectedRegion] = React.useState(MOCK_LOCATIONS[0]);

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto space-y-8 py-6">
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 bg-rose-50 text-rose-600 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest w-fit border border-rose-100">
              <MapIcon className="size-3 animate-pulse" />
              Geo-Intelligence
            </div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight leading-none">Opportunity Map</h1>
            <p className="text-slate-500 font-medium text-lg max-w-2xl">
              Visualize the global density of business leads, market demands, and potential strategic partners.
            </p>
          </div>
          <div className="flex gap-3">
             <Button variant="outline" className="rounded-2xl font-black uppercase text-[10px] tracking-widest h-12 px-6 hover:bg-slate-50 gap-2">
                <Filter className="size-4" />
                Industry Filter
             </Button>
             <Button className="rounded-2xl bg-slate-900 hover:bg-black text-white font-black uppercase text-[10px] tracking-widest h-12 px-8 shadow-xl">
                Switch View
             </Button>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-[600px]">
           {/* Simulated Heatmap View */}
           <Card className="lg:col-span-8 rounded-[3rem] border-slate-100 shadow-2xl bg-slate-50 overflow-hidden relative flex items-center justify-center">
              <div className="absolute inset-0 opacity-10 pointer-events-none">
                 <div className="absolute inset-0 bg-[url('https://picsum.photos/seed/map/1200/800')] bg-cover grayscale" />
              </div>
              
              {/* Heatmap Dots */}
              <div className="relative w-full h-full p-20">
                {MOCK_LOCATIONS.map((loc, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedRegion(loc)}
                    className={cn(
                      "absolute rounded-full transition-all hover:scale-150 active:scale-95 group",
                      selectedRegion.city === loc.city ? "ring-4 ring-white shadow-2xl z-20" : "opacity-60"
                    )}
                    style={{ 
                      top: `${loc.lat}%`, 
                      left: `${loc.lng}%`, 
                      width: `${loc.intensity / 2}px`, 
                      height: `${loc.intensity / 2}px`,
                      backgroundColor: `hsl(239, 84%, ${100 - loc.intensity/2}%)`
                    }}
                  >
                    <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-slate-900 text-white px-3 py-1 rounded-xl text-[9px] font-black uppercase tracking-widest whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity shadow-lg">
                      {loc.city}
                    </div>
                  </button>
                ))}
              </div>

              {/* Map Controls */}
              <div className="absolute bottom-10 left-10 flex flex-col gap-2">
                 <button className="size-10 rounded-xl bg-white border border-slate-100 shadow-lg flex items-center justify-center hover:bg-slate-50"><maximize2 className="size-4 text-slate-400" /></button>
                 <button className="size-10 rounded-xl bg-white border border-slate-100 shadow-lg flex items-center justify-center hover:bg-slate-50"><globe className="size-4 text-slate-400" /></button>
              </div>

              <div className="absolute top-10 right-10 flex gap-3">
                 <div className="bg-white/90 backdrop-blur p-4 rounded-3xl shadow-xl border border-white space-y-1">
                    <p className="text-[8px] font-black text-slate-400 uppercase tracking-[0.2em]">Active Global Signals</p>
                    <p className="text-xl font-black text-slate-900">4,821</p>
                 </div>
              </div>
           </Card>

           {/* Location Intel Sidebar */}
           <div className="lg:col-span-4 space-y-6 overflow-y-auto pr-2 no-scrollbar">
              <Card className="rounded-[2.5rem] border-slate-100 shadow-xl bg-white p-8 space-y-8">
                 <div className="space-y-4">
                    <div className="flex items-center gap-3">
                       <div className="size-12 rounded-2xl bg-rose-50 flex items-center justify-center">
                          <MapPin className="size-6 text-rose-500" />
                       </div>
                       <div>
                          <h3 className="text-2xl font-black text-slate-900">{selectedRegion.city}</h3>
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{selectedRegion.country}</p>
                       </div>
                    </div>
                 </div>

                 <div className="grid grid-cols-2 gap-4">
                    <div className="p-5 rounded-3xl bg-slate-50 space-y-1 border border-slate-100">
                       <Users className="size-4 text-indigo-500 mb-2" />
                       <p className="text-xl font-black text-slate-900">{selectedRegion.count}</p>
                       <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Leads Found</p>
                    </div>
                    <div className="p-5 rounded-3xl bg-slate-50 space-y-1 border border-slate-100">
                       <DollarSign className="size-4 text-emerald-500 mb-2" />
                       <p className="text-xl font-black text-slate-900">{selectedRegion.value}</p>
                       <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Potential Vol.</p>
                    </div>
                 </div>

                 <div className="space-y-4 pt-4 border-t border-slate-50">
                    <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Cluster Industries</h4>
                    <div className="space-y-3">
                       {["Logistics Tech", "E-commerce Supply", "Renewable Energy"].map((ind, i) => (
                         <div key={i} className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 hover:bg-indigo-50 transition-colors cursor-pointer group">
                            <span className="text-xs font-bold text-slate-700">{ind}</span>
                            <ArrowRight className="size-3.5 text-slate-300 group-hover:text-accent group-hover:translate-x-1 transition-all" />
                         </div>
                       ))}
                    </div>
                 </div>

                 <Button className="w-full bg-slate-900 hover:bg-black text-white font-black rounded-2xl h-14 shadow-xl active:scale-95 transition-all">
                    Index This Region
                 </Button>
              </Card>

              <Card className="rounded-[2.5rem] bg-slate-900 text-white p-8 relative overflow-hidden">
                 <div className="relative z-10 space-y-4">
                    <div className="size-10 rounded-xl bg-accent flex items-center justify-center">
                       <Layers className="size-5 text-white" />
                    </div>
                    <h4 className="text-lg font-black leading-tight">Export Heatmap Layer</h4>
                    <p className="text-slate-400 text-xs font-medium leading-relaxed">
                       Overlay global trade tariffs and logistics costs on top of opportunity density.
                    </p>
                    <Button variant="ghost" className="w-full border border-white/20 text-white font-bold text-[10px] uppercase h-10 rounded-xl">
                       Unlock Layer
                    </Button>
                 </div>
                 <div className="absolute top-0 right-0 w-48 h-48 bg-accent/20 rounded-full blur-3xl -mr-24 -mt-24" />
              </Card>
           </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
