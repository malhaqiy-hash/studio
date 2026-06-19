
'use client';

import * as React from 'react';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Search, 
  Sparkles, 
  ShieldCheck, 
  MapPin, 
  Briefcase, 
  Zap, 
  Check, 
  ArrowUpRight 
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAccount } from '@/context/account-context';

const FILTER_CHIPS = [
  { id: 'semua', label: 'Semua' },
  { id: 'mitra', label: 'Mitra Bisnis' },
  { id: 'freelancer', label: 'Freelancer/Expert' },
  { id: 'investor', label: 'Investor' },
  { id: 'peluang', label: 'Peluang Kerja' },
];

const MOCK_MATCHES = [
  {
    id: 'm1',
    name: 'Andi Pratama',
    avatar: 'https://picsum.photos/seed/p1/200',
    type: 'freelancer',
    matchScore: 98,
    sector: 'UI/UX & AI Product Design',
    location: 'Jakarta, ID',
    verified: true,
  },
  {
    id: 'm2',
    name: 'Global Ventures Co.',
    avatar: 'https://picsum.photos/seed/p2/200',
    type: 'investor',
    matchScore: 92,
    sector: 'Early Stage Tech Funding',
    location: 'Singapore, SG',
    verified: true,
  },
  {
    id: 'm3',
    name: 'Nusantara Logistics',
    avatar: 'https://picsum.photos/seed/p3/200',
    type: 'mitra',
    matchScore: 88,
    sector: 'Cold Chain Supply Solution',
    location: 'Surabaya, ID',
    verified: false,
  },
  {
    id: 'm4',
    name: 'Sarah Chen',
    avatar: 'https://picsum.photos/seed/p4/200',
    type: 'freelancer',
    matchScore: 85,
    sector: 'Fullstack Dev (React/NextJS)',
    location: 'Bali, ID',
    verified: true,
  }
];

export default function CariPage() {
  const { activeAccount } = useAccount();
  const [activeFilter, setActiveFilter] = React.useState('semua');
  const [searchQuery, setSearchQuery] = React.useState('');
  const [connections, setConnections] = React.useState<Record<string, 'none' | 'pending' | 'connected'>>({});

  const handleConnect = (id: string) => {
    setConnections(prev => ({ ...prev, [id]: 'pending' }));
    // Simulate successful connection after a brief delay
    setTimeout(() => {
      setConnections(prev => ({ ...prev, [id]: 'connected' }));
    }, 1500);
  };

  const filteredMatches = MOCK_MATCHES.filter(m => 
    activeFilter === 'semua' || m.type === activeFilter
  );

  return (
    <DashboardLayout>
      <div className="space-y-10 py-6 max-w-5xl mx-auto">
        {/* Search Header */}
        <div className="space-y-6 text-center">
          <div className="inline-flex items-center gap-2 bg-indigo-50 text-accent px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border border-indigo-100">
            <Sparkles className="size-3 animate-pulse fill-accent" />
            AI Discovery Engine
          </div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Cari Mitra & Peluang</h1>
          
          <div className="relative max-w-2xl mx-auto group">
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
              <Search className="size-5 text-slate-400 group-focus-within:text-accent transition-colors" />
            </div>
            <Input 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari mitra, vendor, atau peluang dengan AI... (cth: Supplier kopi di Medan)"
              className="h-16 pl-12 pr-32 rounded-2xl border-slate-200 bg-white shadow-xl text-lg font-medium focus:ring-accent/10 transition-all"
            />
            <Button className="absolute right-2 top-2 bottom-2 rounded-xl px-6 bg-accent hover:bg-indigo-600 font-bold flex gap-2">
              <Sparkles className="size-4" />
              Tanya AI
            </Button>
          </div>

          {/* Filter Chips */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
            {FILTER_CHIPS.map((chip) => (
              <button
                key={chip.id}
                onClick={() => setActiveFilter(chip.id)}
                className={cn(
                  "px-5 py-2 rounded-full text-xs font-bold transition-all border",
                  activeFilter === chip.id 
                    ? "bg-slate-900 text-white border-slate-900 shadow-md" 
                    : "bg-white text-slate-500 border-slate-100 hover:border-slate-300"
                )}
              >
                {chip.label}
              </button>
            ))}
          </div>
        </div>

        {/* AI Recommendations */}
        <div className="space-y-6">
          <div className="flex items-center justify-between px-2">
            <h2 className="text-sm font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
              <Zap className="size-4 text-amber-500 fill-amber-500" />
              Rekomendasi Cerdas AI Untuk Anda
            </h2>
            <Button variant="ghost" size="sm" className="text-[10px] font-black uppercase tracking-widest text-accent">
              Lihat Semua
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMatches.map((match) => (
              <Card key={match.id} className="group overflow-hidden border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 rounded-3xl bg-white">
                <CardHeader className="p-6 pb-2">
                  <div className="flex justify-between items-start">
                    <Avatar className="size-16 rounded-2xl shadow-sm border border-slate-100">
                      <AvatarImage src={match.avatar} />
                      <AvatarFallback className="bg-slate-50 text-slate-400">{match.name[0]}</AvatarFallback>
                    </Avatar>
                    <Badge className="bg-indigo-50 text-accent border-none font-black text-[10px] px-2.5 py-1 uppercase flex gap-1">
                      <Zap className="size-3 fill-accent" />
                      {match.matchScore}% Match
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-slate-900 group-hover:text-accent transition-colors">{match.name}</h3>
                      {match.verified && <ShieldCheck className="size-4 text-emerald-500 fill-emerald-50" />}
                    </div>
                    <p className="text-xs font-medium text-slate-500 leading-tight">
                      {match.sector}
                    </p>
                  </div>
                  <div className="flex items-center gap-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    <div className="flex items-center gap-1">
                      <MapPin className="size-3" />
                      {match.location}
                    </div>
                    <div className="size-1 rounded-full bg-slate-200" />
                    <div className="flex items-center gap-1">
                      <Briefcase className="size-3" />
                      {match.type === 'freelancer' ? 'Professional' : 'Company'}
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="p-4 bg-slate-50/50 border-t border-slate-50">
                  <Button 
                    variant={connections[match.id] ? 'outline' : 'default'}
                    onClick={() => handleConnect(match.id)}
                    disabled={!!connections[match.id]}
                    className={cn(
                      "w-full rounded-xl h-10 font-bold transition-all",
                      !connections[match.id] && "bg-slate-900 text-white hover:bg-black",
                      connections[match.id] === 'pending' && "bg-indigo-50 text-accent border-indigo-100",
                      connections[match.id] === 'connected' && "bg-emerald-50 text-emerald-600 border-emerald-100"
                    )}
                  >
                    {connections[match.id] === 'connected' ? (
                      <span className="flex items-center gap-2"><Check className="size-4" /> Terkoneksi</span>
                    ) : connections[match.id] === 'pending' ? (
                      <span className="flex items-center gap-2 italic">Menunggu Respon...</span>
                    ) : (
                      "Hubungkan"
                    )}
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>

        {/* Algorithm Insight Banner */}
        <div className="p-8 rounded-[2.5rem] bg-slate-900 text-white shadow-2xl overflow-hidden relative">
          <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
            <div className="size-20 rounded-3xl bg-accent flex items-center justify-center shrink-0 shadow-2xl rotate-3">
              <Sparkles className="size-10 text-white" />
            </div>
            <div className="space-y-2 flex-1 text-center md:text-left">
              <h3 className="text-xl font-black tracking-tight">Personalisasi Network Anda</h3>
              <p className="text-slate-400 text-sm font-medium">
                AI kami saat ini memprioritaskan profil di sektor <span className="text-indigo-300 font-black uppercase">{activeAccount.extra || 'Global'}</span> berdasarkan preferensi akun Anda.
              </p>
            </div>
            <Button variant="outline" className="rounded-xl border-slate-700 bg-slate-800 text-white hover:bg-slate-700 font-bold px-6 shrink-0 h-12 flex gap-2">
              Analisis Profil
              <ArrowUpRight className="size-4" />
            </Button>
          </div>
          <div className="absolute top-0 right-0 w-64 h-64 bg-accent/20 rounded-full blur-[80px] -mr-32 -mt-32" />
        </div>
      </div>
    </DashboardLayout>
  );
}
