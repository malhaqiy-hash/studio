'use client';

import * as React from 'react';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Search, 
  MapPin, 
  RefreshCw,
  ChevronDown,
  Building2,
  Filter,
  Mic,
  Store,
  Hotel,
  User,
  Camera,
  Package,
  Headphones,
  Truck,
  Layers,
  Users,
  Image as ImageIcon,
  Target,
  Briefcase,
  Radio,
  Calendar,
  Car,
  X,
  Globe,
  ArrowRight,
  ExternalLink,
  ShieldCheck,
  Navigation
} from 'lucide-react';
import { aiIntentSearch, type AIIntentSearchOutput } from "@/ai/flows/ai-intent-search-flow";
import { useLanguage } from "@/context/language-context";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { useAccount } from "@/context/account-context";
import Link from 'next/link';

const SEARCH_CATEGORIES = [
  { id: 'professional_personal', label: 'Profesional/Pribadi', icon: User },
  { id: 'toko', label: 'Toko', icon: Store },
  { id: 'perusahaan', label: 'Perusahaan', icon: Building2 },
  { id: 'saluran', label: 'Saluran', icon: Radio },
  { id: 'komunitas', label: 'Komunitas', icon: Users },
  { id: 'acara', label: 'Acara', icon: Calendar },
  { id: 'peluang_bisnis', label: 'Peluang Bisnis', icon: Target },
  { id: 'peluang_kerja', label: 'Peluang Kerja', icon: Briefcase },
  { id: 'produk', label: 'Produk', icon: Package },
  { id: 'pemasok', label: 'Pemasok', icon: Truck },
  { id: 'distributor', label: 'Distributor', icon: Layers },
  { id: 'layanan', label: 'Layanan/Jasa', icon: Headphones },
  { id: 'transportasi', label: 'Transportasi', icon: Car },
  { id: 'penginapan', label: 'Penginapan', icon: Hotel },
  { id: 'lainnya', label: 'Lainnya', icon: Filter },
];

const DAFTAR_DAERAH = [
  "Jakarta Pusat", "Jakarta Selatan", "Jakarta Barat", "Jakarta Timur", "Jakarta Utara", 
  "Bandung", "Surabaya", "Semarang", "Yogyakarta", 
  "Medan", "Makassar", "Palembang", "Denpasar", "Malang",
  "Banten", "Depok", "Bekasi", "Tangerang", "Bogor"
];

export default function CariPage() {
  const { language, t } = useLanguage();
  const { availableAccounts } = useAccount();
  const { toast } = useToast();
  
  const [query, setQuery] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [results, setResults] = React.useState<AIIntentSearchOutput | null>(null);
  const [internalResults, setInternalResults] = React.useState<any[]>([]);
  
  const [activeCategory, setActiveCategory] = React.useState<string | null>(null);
  const [activeLocation, setActiveLocation] = React.useState("");
  const [showSuggestions, setShowSuggestions] = React.useState(false);
  const [filteredRegions, setFilteredRegions] = React.useState<string[]>([]);
  const [isSourcePickerOpen, setIsSourcePickerOpen] = React.useState(false);

  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const cameraInputRef = React.useRef<HTMLInputElement>(null);
  const suggestionRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const detectLocation = async () => {
      try {
        const response = await fetch('https://ipapi.co/json/');
        const data = await response.json();
        if (data.city && data.country_name) {
          setActiveLocation(`${data.city}, ${data.country_name}`);
        }
      } catch (err) {
        console.warn("Gagal mendeteksi lokasi otomatis.");
      }
    };
    detectLocation();
  }, []);

  const handleSearch = async (
    e?: React.FormEvent, 
    overrideQuery?: string, 
    overrideCategory?: string | null,
    overrideLocation?: string
  ) => {
    e?.preventDefault();
    const finalQuery = (overrideQuery !== undefined ? overrideQuery : query).trim();
    const finalCategory = overrideCategory !== undefined ? overrideCategory : activeCategory;
    const finalLocation = overrideLocation !== undefined ? overrideLocation : activeLocation;
    
    if (!finalQuery && !finalCategory) return;
    
    setLoading(true);
    setShowSuggestions(false);
    
    const searchTerm = finalQuery.toLowerCase();
    const matchedAccounts = availableAccounts.filter(acc => 
      acc.name.toLowerCase().includes(searchTerm) || 
      acc.bio?.toLowerCase().includes(searchTerm) || 
      acc.extra?.toLowerCase().includes(searchTerm) ||
      acc.type.toLowerCase().includes(searchTerm)
    ).slice(0, 5);

    setInternalResults(matchedAccounts);

    try {
      const output = await aiIntentSearch({ 
        query: finalQuery || (finalCategory ? `Cari ${finalCategory}` : "Bisnis Terdekat"), 
        filters: {
          category: finalCategory || undefined,
          location: finalLocation || undefined,
        } 
      });

      if (output && output.results) {
        setResults(output);
      }
    } catch (err: any) {
      toast({ variant: "destructive", title: "Gagal Mencari", description: "Terjadi gangguan jaringan AI." });
    } finally {
      setLoading(false);
    }
  };

  const openInGoogleMaps = (name: string, location?: string, lat?: number, lng?: number) => {
    let url = "";
    if (lat && lng) {
      url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
    } else {
      const searchQuery = encodeURIComponent(`${name} ${location || ''}`);
      url = `https://www.google.com/maps/search/?api=1&query=${searchQuery}`;
    }
    window.open(url, '_blank');
  };

  const handleLocationChange = (val: string) => {
    setActiveLocation(val);
    if (val.length > 0) {
      const filtered = DAFTAR_DAERAH.filter(d => 
        d.toLowerCase().includes(val.toLowerCase())
      );
      setFilteredRegions(filtered);
      setShowSuggestions(filtered.length > 0);
    } else {
      setShowSuggestions(false);
    }
  };

  const handleVoiceSearch = () => {
    if (typeof window === 'undefined' || !('webkitSpeechRecognition' in window)) return;
    const recognition = new (window as any).webkitSpeechRecognition();
    recognition.lang = language === 'id' ? 'id-ID' : 'en-US';
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setQuery(transcript);
      handleSearch(undefined, transcript);
    };
    recognition.start();
  };

  const getTypeIcon = (type: string) => {
    switch(type) {
      case 'product': return <Package className="size-4" />;
      case 'service': return <Headphones className="size-4" />;
      case 'supplier': return <Truck className="size-4" />;
      case 'professional': 
      case 'freelancer': return <User className="size-4" />;
      case 'opportunity': 
      case 'job_opportunity': return <Briefcase className="size-4" />;
      case 'shop': return <Store className="size-4" />;
      case 'hotel': return <Hotel className="size-4" />;
      case 'channel': return <Radio className="size-4" />;
      case 'event': return <Calendar className="size-4" />;
      case 'community': return <Users className="size-4" />;
      case 'transporter': return <Car className="size-4" />;
      case 'company':
      case 'business': return <Building2 className="size-4" />;
      default: return <Building2 className="size-4" />;
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-xl mx-auto space-y-4 py-2 px-1 md:px-0 flex flex-col min-h-screen pb-24">
        <div className="space-y-2.5 w-full">
          <form onSubmit={(e) => handleSearch(e)} className="space-y-2.5">
            <div className="relative group w-full">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <Search className="size-3.5 text-slate-400 group-focus-within:text-primary transition-colors" />
              </div>
              <Input 
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={t('search_placeholder')}
                className="h-10 pl-9 pr-24 rounded-xl border-slate-100 bg-slate-50/50 text-[13px] font-medium focus:bg-white focus:ring-4 focus:ring-primary/5 transition-all shadow-inner"
              />
              <div className="absolute inset-y-1 right-1 flex items-center gap-0.5">
                {query && (
                  <button 
                    type="button" 
                    onClick={() => { setQuery(""); setResults(null); setInternalResults([]); }}
                    className="size-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-rose-500 transition-colors"
                  >
                    <X className="size-3.5" />
                  </button>
                )}
                <button type="button" onClick={handleVoiceSearch} className="size-8 flex items-center justify-center rounded-lg bg-white text-slate-400 border border-slate-100 shadow-sm hover:text-primary active:scale-90 transition-all"><Mic className="size-3.5" /></button>
                <button type="button" onClick={() => setIsSourcePickerOpen(true)} className="size-8 flex items-center justify-center rounded-lg bg-white text-slate-400 border border-slate-100 shadow-sm hover:text-primary active:scale-90 transition-all"><Camera className="size-3.5" /></button>
              </div>
            </div>

            <Button type="submit" disabled={loading} className="w-full h-10 rounded-xl bg-primary text-primary-foreground font-black text-[10px] uppercase tracking-widest shadow-lg shadow-primary/10 flex gap-1.5 active:scale-[0.98] transition-all">
              {loading ? <RefreshCw className="size-3.5 animate-spin" /> : <>{t('search_now')}</>}
            </Button>

            <div className="grid grid-cols-2 gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="w-full h-8 justify-between rounded-lg border-slate-100 bg-slate-50/50 text-slate-600 font-bold hover:bg-white px-2.5 text-[9px] uppercase tracking-widest transition-all">
                    <div className="flex items-center gap-1.5 max-w-[120px] truncate"><Filter className="size-3 shrink-0 text-primary/60" />{activeCategory || "Kategori"}</div>
                    <ChevronDown className="size-3 opacity-40 shrink-0" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-[260px] rounded-xl p-1.5 shadow-2xl bg-card border-border max-h-[350px] overflow-y-auto no-scrollbar">
                  <DropdownMenuItem onClick={() => setActiveCategory(null)} className="font-black text-primary p-2 rounded-lg text-[9px] uppercase tracking-widest hover:bg-primary/5 cursor-pointer">Semua Kategori</DropdownMenuItem>
                  <div className="grid grid-cols-1 gap-0.5">
                    {SEARCH_CATEGORIES.map((cat) => (
                      <DropdownMenuItem key={cat.id} onClick={() => setActiveCategory(cat.label)} className="flex items-center gap-2.5 py-2 px-2 rounded-lg font-bold cursor-pointer hover:bg-slate-50 text-[12px] text-slate-700">
                        <div className="size-7 bg-primary/5 rounded-lg flex items-center justify-center text-primary shrink-0 transition-transform"><cat.icon className="size-3.5" /></div>{cat.label}
                      </DropdownMenuItem>
                    ))}
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>

              <div className="relative group w-full" ref={suggestionRef}>
                <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none">
                  <MapPin className="size-3 text-primary/60" />
                </div>
                <Input 
                  value={activeLocation}
                  onChange={(e) => handleLocationChange(e.target.value)}
                  onFocus={() => activeLocation.length > 0 && setShowSuggestions(true)}
                  placeholder={language === 'id' ? "Wilayah..." : "Location..."}
                  className="h-8 pl-7 pr-7 rounded-lg border-slate-100 bg-slate-50/50 text-[9px] font-black uppercase tracking-widest focus:bg-white focus:ring-4 focus:ring-primary/5 transition-all shadow-inner"
                />
                {activeLocation !== "" && (
                  <button 
                    type="button" 
                    onClick={() => { setActiveLocation(""); setShowSuggestions(false); }}
                    className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-slate-400 hover:text-destructive transition-colors"
                  >
                    <X className="size-3" />
                  </button>
                )}

                {showSuggestions && (
                  <div className="absolute top-full left-0 right-0 mt-1.5 z-[150] bg-white border border-slate-100 rounded-xl shadow-[0_15px_30px_-10px_rgba(0,0,0,0.1)] max-h-48 overflow-y-auto no-scrollbar p-1 animate-in fade-in slide-in-from-top-2 duration-300">
                    {filteredRegions.map((region, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => {
                          setActiveLocation(region);
                          setShowSuggestions(false);
                          handleSearch(undefined, query, activeCategory, region);
                        }}
                        className="w-full flex items-center gap-2.5 px-2.5 py-2.5 text-left hover:bg-primary/5 rounded-lg transition-all border-b last:border-none border-slate-50 group"
                      >
                        <MapPin className="size-3 text-primary group-hover:scale-110 transition-transform" />
                        <span className="text-[11px] font-bold text-slate-700">{region}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </form>
        </div>

        <div className="flex-1 space-y-4">
           {loading ? (
             <div className="space-y-3 py-4">
                {[1, 2, 3].map(i => <div key={i} className="h-24 w-full bg-slate-50 animate-pulse rounded-2xl" />)}
             </div>
           ) : (
             <>
                {internalResults.length > 0 && (
                  <div className="space-y-3 py-2">
                    <div className="flex items-center gap-2 px-1">
                       <ShieldCheck className="size-4 text-emerald-500" />
                       <h2 className="text-sm font-black uppercase tracking-tight text-slate-900">Jaringan Internal Koolink</h2>
                    </div>
                    <div className="grid gap-2.5">
                      {internalResults.map((acc) => (
                        <Link key={acc.id} href={`/profile`}>
                          <Card className="rounded-2xl border-none shadow-sm bg-white overflow-hidden hover:shadow-md transition-all group">
                            <CardContent className="p-3.5 flex items-center gap-3">
                              <div className="size-12 rounded-xl bg-primary/5 text-primary flex items-center justify-center shrink-0 shadow-inner group-hover:bg-primary group-hover:text-white transition-all duration-300">
                                 {acc.avatar ? <img src={acc.avatar} className="size-full object-cover rounded-xl" /> : <User className="size-6" />}
                              </div>
                              <div className="flex-1 min-w-0 space-y-0.5">
                                <div className="flex items-center gap-1.5">
                                  <h4 className="text-[14px] font-black text-slate-900 leading-tight truncate">{acc.name}</h4>
                                  <ShieldCheck className="size-3 text-emerald-500" />
                                </div>
                                <p className="text-slate-500 font-medium text-[11px] leading-snug line-clamp-1 italic">"{acc.bio || 'Membangun koneksi cerdas di Koolink.'}"</p>
                                <div className="flex items-center gap-2 text-[8px] font-black text-slate-400 uppercase tracking-widest pt-1">
                                  <Badge className="bg-primary/10 text-primary border-none px-1.5 py-0 rounded-md text-[7px] uppercase">{acc.type}</Badge>
                                  <span className="flex items-center gap-1"><MapPin className="size-2" /> Indonesia</span>
                                </div>
                              </div>
                              <ArrowRight className="size-4 text-slate-300 group-hover:text-primary transition-all" />
                            </CardContent>
                          </Card>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                {results && results.results.length > 0 && (
                   <div className="space-y-3 py-2">
                     <div className="flex items-center gap-2 px-1">
                        <Globe className="size-4 text-blue-500" />
                        <h2 className="text-sm font-black uppercase tracking-tight text-slate-900">Hasil Eksternal</h2>
                     </div>
                     <div className="grid gap-3">
                        {results.results.map((result, idx) => (
                           <Card key={idx} className="rounded-2xl border-none shadow-sm bg-white overflow-hidden hover:shadow-md transition-all group">
                              <div className="flex flex-col">
                                 {result.imageUrl && (
                                   <div className="w-full h-32 relative overflow-hidden bg-slate-100">
                                      <img src={result.imageUrl} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt={result.name} />
                                      <div className="absolute top-2 right-2">
                                         <Badge className="bg-white/90 backdrop-blur-md text-blue-600 font-black text-[7px] uppercase px-2 py-0.5 rounded-full shadow-lg border-none">
                                            {result.type}
                                         </Badge>
                                      </div>
                                   </div>
                                 )}
                                 <CardContent className="p-4 flex items-start gap-3">
                                    {!result.imageUrl && (
                                      <div className="size-10 rounded-xl bg-slate-50 text-slate-400 flex items-center justify-center shrink-0 shadow-inner group-hover:bg-blue-50 group-hover:text-blue-500 transition-all">
                                         {getTypeIcon(result.type)}
                                      </div>
                                    )}
                                    <div className="flex-1 min-w-0 space-y-1">
                                       <div className="flex items-center justify-between gap-2">
                                          <h4 className="text-[14px] font-black text-slate-900 leading-tight group-hover:text-primary transition-colors truncate">{result.name}</h4>
                                          <div className="flex items-center gap-1">
                                             <div className="text-[10px] font-black text-blue-500">{result.matchScore}%</div>
                                             {result.lat && result.lng && (
                                               <button 
                                                 onClick={() => openInGoogleMaps(result.name, result.location, result.lat, result.lng)}
                                                 className="size-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center hover:bg-blue-600 hover:text-white transition-all active:scale-90"
                                               >
                                                  <Navigation className="size-3.5" />
                                               </button>
                                             )}
                                          </div>
                                       </div>
                                       <p className="text-slate-500 font-medium text-[11px] leading-relaxed line-clamp-2">{result.description}</p>
                                       <div className="flex items-center justify-between pt-1">
                                          <div className="flex items-center gap-1.5 text-[8px] font-black text-slate-400 uppercase">
                                             <MapPin className="size-2.5" /> {result.location || 'Area Terdekat'}
                                          </div>
                                          <Button 
                                             variant="ghost" 
                                             size="sm" 
                                             onClick={() => openInGoogleMaps(result.name, result.location, result.lat, result.lng)}
                                             className="h-6 px-2 text-[8px] font-black uppercase text-blue-500 hover:bg-blue-50 gap-1 rounded-lg"
                                          >
                                             <ExternalLink className="size-2.5" /> Google Maps
                                          </Button>
                                       </div>
                                    </div>
                                 </CardContent>
                              </div>
                           </Card>
                        ))}
                     </div>
                   </div>
                )}

                {!loading && !results && internalResults.length === 0 && (
                  <div className="py-20 text-center space-y-4 px-6">
                     <div className="size-16 rounded-full bg-slate-50 flex items-center justify-center mx-auto shadow-inner">
                        <Target className="size-8 text-slate-200" />
                     </div>
                     <div className="space-y-2">
                        <h3 className="text-sm font-black text-slate-900 uppercase tracking-tight">{t('start_search')}</h3>
                        <p className="text-[10px] text-slate-500 max-w-xs mx-auto font-medium italic leading-relaxed">"{t('daily_limit_msg')}"</p>
                     </div>
                  </div>
                )}
             </>
           )}
        </div>
      </div>

      <Dialog open={isSourcePickerOpen} onOpenChange={setIsSourcePickerOpen}>
        <DialogContent className="max-w-[300px] rounded-2xl bg-card text-foreground p-6 border-none shadow-2xl overflow-hidden outline-none animate-in zoom-in-95 duration-300 [&>button]:hidden">
          <div className="space-y-6">
            <div className="space-y-1">
              <h2 className="text-lg font-black tracking-tight text-center uppercase text-primary">Cari Visual</h2>
              <p className="text-[9px] text-center text-muted-foreground font-black uppercase tracking-[0.2em]">Analisis Gambar Cerdas</p>
            </div>
            <div className="space-y-3">
              <button onClick={() => cameraInputRef.current?.click()} className="w-full flex items-center gap-4 p-3 rounded-xl bg-slate-50 hover:bg-primary/5 group transition-all active:scale-95 text-left border border-transparent hover:border-primary/20">
                <div className="size-9 rounded-lg bg-white flex items-center justify-center shadow-sm text-primary group-hover:scale-105 transition-transform"><Camera className="size-5" /></div>
                <div className="flex flex-col"><span className="font-black text-[13px] leading-none uppercase text-slate-800">Kamera</span><span className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest mt-1">Ambil Foto Langsung</span></div>
              </button>
              <button onClick={() => fileInputRef.current?.click()} className="w-full flex items-center gap-4 p-3 rounded-xl bg-slate-50 hover:bg-primary/5 group transition-all active:scale-95 text-left border border-transparent hover:border-primary/20">
                <div className="size-9 rounded-lg bg-white flex items-center justify-center shadow-sm text-primary group-hover:scale-105 transition-transform"><ImageIcon className="size-5" /></div>
                <div className="flex flex-col"><span className="font-black text-[13px] leading-none uppercase text-slate-800">Galeri</span><span className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest mt-1">Pilih Media Lokal</span></div>
              </button>
            </div>
            <button onClick={() => setIsSourcePickerOpen(false)} className="w-full text-center text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-destructive">Batalkan</button>
          </div>
          <input type="file" ref={cameraInputRef} className="hidden" accept="image/*" capture="environment" onChange={() => handleSearch(undefined, "Analisis Gambar")} />
          <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={() => handleSearch(undefined, "Analisis Gambar")} />
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}