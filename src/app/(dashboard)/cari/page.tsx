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
} from 'lucide-react';
import { cn } from '@/lib/utils';
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
  "Bandung", "Surabaya", "Semarang", "Kendal", "Yogyakarta", 
  "Medan", "Makassar", "Palembang", "Denpasar", "Malang",
  "Banten", "Depok", "Bekasi", "Tangerang", "Bogor"
];

export default function CariPage() {
  const { language, t } = useLanguage();
  const { activeAccount } = useAccount();
  const { toast } = useToast();
  
  const [query, setQuery] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [results, setResults] = React.useState<AIIntentSearchOutput | null>(null);
  
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

  const cleanTitle = (text: string) => text.replace(/^Informasi Terkait:\s*/i, '').trim();

  const handleSearch = async (
    e?: React.FormEvent, 
    overrideQuery?: string, 
    overrideCategory?: string | null,
    overrideLocation?: string
  ) => {
    e?.preventDefault();
    const finalQuery = cleanTitle(overrideQuery !== undefined ? overrideQuery : query);
    const finalCategory = overrideCategory !== undefined ? overrideCategory : activeCategory;
    const finalLocation = overrideLocation !== undefined ? overrideLocation : activeLocation;
    
    if (!finalQuery && !finalCategory) return;
    
    setLoading(true);
    setShowSuggestions(false);
    if (!overrideQuery) setResults(null);

    try {
      const output = await aiIntentSearch({ 
        query: finalQuery || (finalCategory ? `Cari ${finalCategory}` : "Analisis Gambar"), 
        filters: {
          category: finalCategory || undefined,
          location: finalLocation || undefined
        } 
      });

      if (output) {
        output.results = output.results.map(r => ({ ...r, name: cleanTitle(r.name) }));
        setResults(output);
      }
    } catch (err: any) {
      toast({ variant: "destructive", title: "Gagal Mencari", description: "Terjadi gangguan jaringan AI." });
    } finally {
      setLoading(false);
    }
  };

  const openInGoogleMaps = (name: string, location?: string) => {
    const searchQuery = encodeURIComponent(`${name} ${location || ''}`);
    window.open(`https://www.google.com/maps/search/?api=1&query=${searchQuery}`, '_blank');
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

  const handleSelectRegion = (region: string) => {
    setActiveLocation(region);
    setShowSuggestions(false);
    handleSearch(undefined, query, activeCategory, region);
  };

  const handleClearLocation = () => {
    setActiveLocation("");
    setShowSuggestions(false);
    if (query || activeCategory) {
      handleSearch(undefined, query, activeCategory, "");
    }
  };

  const handleVoiceSearch = () => {
    if (!('webkitSpeechRecognition' in window)) return;
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
      <div className="max-w-xl mx-auto space-y-3 py-2 px-1 md:px-0">
        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-[0_15px_30px_-10px_rgba(0,0,0,0.05)] space-y-2.5">
          <form onSubmit={(e) => handleSearch(e)} className="space-y-2.5">
            <div className="relative group w-full">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <Search className="size-3.5 text-slate-400 group-focus-within:text-primary transition-colors" />
              </div>
              <Input 
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={t('search_placeholder')}
                className="h-10 pl-9 pr-20 rounded-xl border-slate-100 bg-slate-50/50 text-[13px] font-medium focus:bg-white focus:ring-4 focus:ring-primary/5 transition-all shadow-inner"
              />
              <div className="absolute inset-y-1 right-1 flex items-center gap-0.5">
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
                    onClick={handleClearLocation}
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
                        onClick={() => handleSelectRegion(region)}
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

        {results && (
          <div className="space-y-2 animate-in fade-in slide-in-from-bottom-2 duration-500">
            <div className="flex items-center justify-between px-2">
              <div className="flex items-center gap-1.5"><h3 className="font-black text-slate-900 text-[10px] uppercase tracking-widest">{t('results')}</h3><Badge className="bg-primary/10 text-primary font-black px-1.5 py-0.5 rounded-full text-[9px] border-none">{results.results.length} Item</Badge></div>
            </div>
            <div className="grid gap-2">
              {results.results.map((result, idx) => (
                <Card key={idx} className="rounded-xl border-none shadow-[0_3px_15px_-5px_rgba(0,0,0,0.05)] bg-white overflow-hidden hover:shadow-[0_10px_20px_-5px_rgba(0,0,0,0.08)] transition-all group">
                  <CardContent className="p-0 flex flex-col">
                    <div className="p-3.5 md:p-4 flex gap-3 items-start">
                      <div className="size-9 rounded-lg bg-slate-50 text-primary flex items-center justify-center shrink-0 shadow-inner group-hover:bg-primary group-hover:text-white transition-all duration-300">{getTypeIcon(result.type)}</div>
                      <div className="flex-1 space-y-0.5">
                        <div className="flex flex-wrap items-center gap-1.5">
                          <h4 className="text-[14px] font-bold text-slate-900 leading-tight group-hover:text-primary transition-colors">{cleanTitle(result.name)}</h4>
                          <Badge className={cn("text-[8px] font-black uppercase tracking-widest rounded-full px-1.5 py-0.5 border-none", result.source === 'external' ? 'bg-slate-100 text-slate-600' : 'bg-primary/10 text-primary')}>
                            {result.source === 'external' ? 'Eksternal' : 'Verified'}
                          </Badge>
                        </div>
                        <p className="text-slate-500 font-medium text-[12px] leading-snug line-clamp-2">{result.description}</p>
                        <div className="flex flex-wrap items-center gap-2.5 text-[9px] font-black text-slate-400 uppercase tracking-widest pt-1">
                          {result.location && (
                            <button 
                              onClick={() => openInGoogleMaps(result.name, result.location)}
                              className="flex items-center gap-1 hover:text-primary transition-all"
                            >
                              <MapPin className="size-2.5" />
                              <span className="underline decoration-primary/20 underline-offset-2">{result.location}</span>
                            </button>
                          )}
                          <div className="flex items-center gap-1 text-primary bg-primary/5 px-1.5 py-0.5 rounded-md"><Target className="size-2.5" />{result.matchScore}% Synergy</div>
                        </div>
                      </div>
                      <div className="shrink-0">
                        <Button variant="outline" className="rounded-lg h-7 border-slate-100 hover:bg-primary hover:text-white text-[8px] font-black uppercase tracking-widest transition-all px-2.5">{t('view_profile')}</Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {!loading && !results && (
          <div className="py-12 text-center space-y-3 bg-white rounded-2xl border-2 border-dashed border-slate-100 shadow-inner">
             <div className="size-10 rounded-lg bg-slate-50 flex items-center justify-center mx-auto"><Search className="size-5 text-slate-200" /></div>
             <div className="space-y-1 px-4">
               <h3 className="text-[12px] font-black text-slate-900 uppercase tracking-widest">{t('start_search')}</h3>
               <p className="text-[10px] text-slate-500 max-w-xs mx-auto font-medium leading-relaxed">{t('daily_limit_msg')}</p>
             </div>
          </div>
        )}
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
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}