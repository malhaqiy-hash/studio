'use client';

import * as React from 'react';
import dynamic from 'next/dynamic';
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
  History,
  Navigation,
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
import 'leaflet/dist/leaflet.css';

// Dynamic imports for Leaflet
const MapContainer = dynamic(() => import('react-leaflet').then(mod => mod.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import('react-leaflet').then(mod => mod.TileLayer), { ssr: false });
const Marker = dynamic(() => import('react-leaflet').then(mod => mod.Marker), { ssr: false });
const Popup = dynamic(() => import('react-leaflet').then(mod => mod.Popup), { ssr: false });
const useMap = dynamic(() => import('react-leaflet').then(mod => mod.useMap), { ssr: false });

// Component to handle map re-centering
function MapController({ center, zoom }: { center: [number, number], zoom: number }) {
  const map = (useMap as any)();
  React.useEffect(() => {
    map.setView(center, zoom, { animate: true });
  }, [center, zoom, map]);
  return null;
}

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
  const [recentQueries, setRecentQueries] = React.useState<string[]>([]);
  
  const [activeCategory, setActiveCategory] = React.useState<string | null>(null);
  const [activeLocation, setActiveLocation] = React.useState("");
  const [showSuggestions, setShowSuggestions] = React.useState(false);
  const [filteredRegions, setFilteredRegions] = React.useState<string[]>([]);
  const [coords, setCoords] = React.useState<{lat: number, lng: number} | null>(null);
  const [mapCenter, setMapCenter] = React.useState<[number, number]>([-6.2088, 106.8456]);
  
  const [isSourcePickerOpen, setIsSourcePickerOpen] = React.useState(false);
  const [L, setL] = React.useState<any>(null);

  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const cameraInputRef = React.useRef<HTMLInputElement>(null);
  const suggestionRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    import('leaflet').then((leaflet) => {
      setL(leaflet);
    });
  }, []);

  const getRecentQueriesKey = React.useCallback(() => `ontapp_recent_queries_${activeAccount.id}`, [activeAccount.id]);
  const getHistoryKey = React.useCallback(() => `ontapp_discovery_history_${activeAccount.id}`, [activeAccount.id]);

  React.useEffect(() => {
    const saved = localStorage.getItem(getRecentQueriesKey());
    if (saved) {
      try { setRecentQueries(JSON.parse(saved)); } catch (e) { setRecentQueries([]); }
    } else {
      setRecentQueries([]);
    }
  }, [activeAccount.id, getRecentQueriesKey]);

  React.useEffect(() => {
    const detectLocation = async () => {
      try {
        const response = await fetch('https://ipapi.co/json/');
        const data = await response.json();
        if (data.city && data.country_name) {
          setActiveLocation(`${data.city}, ${data.country_name}`);
          setCoords({ lat: data.latitude, lng: data.longitude });
          setMapCenter([data.latitude, data.longitude]);
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
          location: finalLocation || undefined,
          lat: coords?.lat,
          lng: coords?.lng
        } 
      });

      if (output && output.results.length > 0) {
        output.results = output.results.map(r => ({ ...r, name: cleanTitle(r.name) }));
        setResults(output);
        
        // Center map on the first result
        const first = output.results[0];
        if (first.lat && first.lng) {
          setMapCenter([first.lat, first.lng]);
        }

        const historyKey = getHistoryKey();
        const existingHistory = JSON.parse(localStorage.getItem(historyKey) || '[]');
        const newDiscoveryItems = output.results.map(r => ({
          ...r,
          id: `disc-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
          date: new Date().toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })
        }));
        const updatedHistory = [...newDiscoveryItems, ...existingHistory].slice(0, 50);
        localStorage.setItem(historyKey, JSON.stringify(updatedHistory));

        if (finalQuery && finalQuery !== "Analisis Gambar") {
          const qKey = getRecentQueriesKey();
          const updatedQueries = [finalQuery, ...recentQueries.filter(q => q !== finalQuery)].slice(0, 5);
          setRecentQueries(updatedQueries);
          localStorage.setItem(qKey, JSON.stringify(updatedQueries));
        }
      }
    } catch (err: any) {
      toast({ variant: "destructive", title: "Gagal Mencari", description: "Terjadi gangguan jaringan AI." });
    } finally {
      setLoading(false);
    }
  };

  const handleImageSelection = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsSourcePickerOpen(false);
      toast({ title: "Visual AI Aktif", description: "Menganalisis objek dalam gambar..." });
      setQuery("Analisis Gambar...");
      handleSearch(undefined, "Analisis Gambar");
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

  const getIcon = (source: string) => {
    if (!L) return undefined;
    const color = (source === 'ontapp_verified' || source === 'ontapp_member') ? '#0047BB' : '#EF4444';
    
    return new L.DivIcon({
      className: 'custom-marker',
      html: `
        <div style="background-color: ${color}; width: 32px; height: 32px; border-radius: 50% 50% 50% 0; transform: rotate(-45deg); display: flex; items-center; justify-center; border: 2.5px solid white; box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1);">
           <div style="transform: rotate(45deg); width: 100%; height: 100%; display: flex; align-items: center; justify-center; color: white;">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="2"/></svg>
           </div>
        </div>
      `,
      iconSize: [32, 32],
      iconAnchor: [16, 32],
      popupAnchor: [0, -32]
    });
  };

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto space-y-4 py-2 px-1 md:px-0 h-full flex flex-col">
        {/* Search Header */}
        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm space-y-2.5 max-w-xl mx-auto w-full">
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
                    onClick={() => { setQuery(""); setResults(null); }}
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

        {/* Content Area */}
        <div className={cn("grid grid-cols-1 md:grid-cols-12 gap-4 flex-1 min-h-0", !results && "hidden")}>
          {/* Results List */}
          <div className="md:col-span-5 lg:col-span-4 space-y-2 overflow-y-auto no-scrollbar h-full pr-1">
             <div className="flex items-center gap-1.5 px-2 py-1 sticky top-0 bg-background z-10">
               <h3 className="font-black text-slate-900 text-[10px] uppercase tracking-widest">{t('results')}</h3>
               <Badge className="bg-primary/10 text-primary font-black px-1.5 py-0.5 rounded-full text-[9px] border-none">{results?.results.length} Item</Badge>
             </div>
             
             {results?.results.map((result, idx) => (
                <Card key={idx} className="rounded-xl border-none shadow-sm bg-white overflow-hidden hover:shadow-md transition-all group cursor-pointer" onClick={() => setMapCenter([result.lat, result.lng])}>
                  <CardContent className="p-0">
                    <div className="p-3.5 flex gap-3 items-start">
                      <div className="size-9 rounded-lg bg-slate-50 text-primary flex items-center justify-center shrink-0 shadow-inner group-hover:bg-primary group-hover:text-white transition-all duration-300">{getTypeIcon(result.type)}</div>
                      <div className="flex-1 min-w-0 space-y-0.5">
                        <div className="flex flex-wrap items-center gap-1.5">
                          <h4 className="text-[13px] font-bold text-slate-900 leading-tight group-hover:text-primary transition-colors truncate">{cleanTitle(result.name)}</h4>
                          <Badge className={cn("text-[7px] font-black uppercase tracking-widest rounded-full px-1.5 py-0.5 border-none", (result.source === 'ontapp_verified' || result.source === 'ontapp_member') ? 'bg-primary/10 text-primary' : 'bg-slate-100 text-slate-600')}>
                            {(result.source === 'ontapp_verified' || result.source === 'ontapp_member') ? 'Verified' : 'Eksternal'}
                          </Badge>
                        </div>
                        <p className="text-slate-500 font-medium text-[11px] leading-snug line-clamp-2">{result.description}</p>
                        <div className="flex flex-wrap items-center gap-2.5 text-[8px] font-black text-slate-400 uppercase tracking-widest pt-1">
                          {result.location && (
                            <div className="flex items-center gap-1 truncate max-w-[150px]">
                              <MapPin className="size-2.5" />
                              <span className="truncate">{result.location}</span>
                            </div>
                          )}
                          <div className="flex items-center gap-1 text-primary bg-primary/5 px-1.5 py-0.5 rounded-md"><Target className="size-2.5" />{result.matchScore}% Synergy</div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>

          {/* Map Section */}
          <div className="md:col-span-7 lg:col-span-8 rounded-3xl border border-slate-100 shadow-inner bg-slate-50 relative min-h-[350px] md:min-h-0 h-full overflow-hidden">
             {typeof window !== 'undefined' && results && results.results.length > 0 && (
                <MapContainer 
                  center={mapCenter} 
                  zoom={13} 
                  style={{ height: '100%', width: '100%', zIndex: 0 }}
                  scrollWheelZoom={true}
                >
                  <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  />
                  <MapController center={mapCenter} zoom={13} />
                  {results.results.map((result, idx) => result.lat && result.lng ? (
                    <Marker 
                      key={idx} 
                      position={[result.lat, result.lng]} 
                      icon={getIcon(result.source)}
                    >
                      <Popup className="rounded-xl overflow-hidden shadow-2xl border-none p-0">
                         <div className="p-3 space-y-2 min-w-[200px]">
                            <div className="space-y-0.5">
                               <h4 className="font-black text-[13px] text-slate-900 leading-tight">{result.name}</h4>
                               <p className="text-[10px] text-slate-500 font-bold uppercase">{result.location || 'Lokasi Terdeteksi'}</p>
                            </div>
                            <div className="h-px bg-slate-100" />
                            <div className="flex items-center justify-between gap-3">
                               <div className="flex items-center gap-1.5 text-primary">
                                  <Target className="size-3" />
                                  <span className="font-black text-[10px]">{result.matchScore}% Synergy</span>
                               </div>
                               <Button 
                                 size="sm" 
                                 onClick={() => openInGoogleMaps(result.name, result.location, result.lat, result.lng)}
                                 className="h-7 px-2.5 rounded-lg bg-slate-900 text-white font-black text-[8px] uppercase tracking-widest gap-1 active:scale-95"
                               >
                                  <Navigation className="size-2.5" />
                                  Navigasi
                               </Button>
                            </div>
                         </div>
                      </Popup>
                    </Marker>
                  ) : null)}
                </MapContainer>
             )}
          </div>
        </div>

        {/* Empty State */}
        {!loading && !results && (
          <div className="flex-1 flex items-center justify-center">
            <div className="max-w-md w-full py-10 px-6 text-center space-y-4 bg-gradient-to-br from-primary/5 to-accent/5 rounded-[2rem] border border-primary/10 shadow-inner overflow-hidden relative group">
               <div className="size-12 rounded-2xl bg-white shadow-sm flex items-center justify-center mx-auto text-primary animate-bounce">
                  <Target className="size-6" />
               </div>
               <div className="space-y-2 relative z-10">
                 <h3 className="text-[13px] font-black text-slate-900 uppercase tracking-widest">
                   {language === 'id' ? "Jaringan Anda Adalah Kekayaan Anda" : "Your Network is Your Net Worth"}
                 </h3>
                 <p className="text-[10px] text-slate-500 max-w-xs mx-auto font-medium leading-relaxed italic">
                   Temukan mitra bisnis terverifikasi dengan pemetaan geo-spasial yang akurat.
                 </p>
               </div>
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
          <input type="file" ref={cameraInputRef} className="hidden" accept="image/*" capture="environment" onChange={handleImageSelection} />
          <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageSelection} />
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}