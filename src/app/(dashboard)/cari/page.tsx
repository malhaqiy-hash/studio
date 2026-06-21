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
  MoreHorizontal,
  Camera,
  LocateFixed,
  Map as MapIcon,
  Package,
  Headphones,
  Truck,
  Layers,
  Users,
  Zap,
  History,
  X,
  Image as ImageIcon,
  Brain,
  Target,
  Briefcase,
  Smartphone,
  Cloud
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { aiIntentSearch, type AIIntentSearchOutput } from "@/ai/flows/ai-intent-search-flow";
import { useLanguage } from "@/context/language-context";
import { Skeleton } from "@/components/ui/skeleton";
import { useFirestore, useUser } from "@/firebase";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { useAccount } from "@/context/account-context";

const BASE_CATEGORIES = [
  { id: 'toko', label: 'Toko', icon: Store },
  { id: 'produk', label: 'Produk', icon: Package },
  { id: 'service', label: 'Service', icon: Headphones },
  { id: 'hotel', label: 'Hotel', icon: Hotel },
];

const PREMIUM_CATEGORIES = [
  { id: 'supplier', label: 'Supplier', icon: Truck },
  { id: 'distributor', label: 'Distributor', icon: Layers },
  { id: 'professional', label: 'Talent/Freelancer', icon: User },
  { id: 'communities', label: 'Komunitas', icon: Users },
  { id: 'opportunity', label: 'Peluang Kerja', icon: Briefcase },
];

const POPULAR_LOCATIONS = [
  "Global", "Jakarta", "Surabaya", "Medan", "Bandung", "Bali", "Singapore", "Malaysia", "Tokyo", "London"
];

export default function CariPage() {
  const { language, t } = useLanguage();
  const { activeAccount } = useAccount();
  const { toast } = useToast();
  
  const [query, setQuery] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [isCloudLoading, setIsCloudLoading] = React.useState(false);
  const [results, setResults] = React.useState<AIIntentSearchOutput | null>(null);
  const [history, setHistory] = React.useState<any[]>([]);
  
  const [activeCategory, setActiveCategory] = React.useState<string | null>(null);
  const [activeLocation, setActiveLocation] = React.useState(language === 'id' ? "Pilih Lokasi" : "Choose Location");
  const [isLocationOpen, setIsLocationOpen] = React.useState(false);
  const [locationSearch, setLocationSearch] = React.useState("");
  const [coords, setCoords] = React.useState<{lat?: number, lng?: number}>({});
  
  const [isSourcePickerOpen, setIsSourcePickerOpen] = React.useState(false);
  
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const cameraInputRef = React.useRef<HTMLInputElement>(null);

  const cleanTitle = (text: string) => text.replace(/^Informasi Terkait:\s*/i, '').trim();

  const getHistoryKey = React.useCallback(() => `ontapp_discovery_history_${activeAccount.id}`, [activeAccount.id]);

  const categories = React.useMemo(() => {
    if (activeAccount.type === 'bisnis') return [...BASE_CATEGORIES, ...PREMIUM_CATEGORIES];
    if (activeAccount.type === 'professional') return [...BASE_CATEGORIES, PREMIUM_CATEGORIES.find(c => c.id === 'opportunity')!];
    return BASE_CATEGORIES;
  }, [activeAccount.type]);

  React.useEffect(() => {
    const saved = localStorage.getItem(getHistoryKey());
    if (saved) {
      const parsedHistory = JSON.parse(saved).map((item: any) => ({
        ...item,
        name: cleanTitle(item.name)
      }));
      setHistory(parsedHistory);
    } else {
      setHistory([]);
    }
    setResults(null);
    setQuery("");
  }, [activeAccount.id, getHistoryKey]);

  const updateVisualHistory = (newResults: any[]) => {
    if (typeof window === 'undefined') return;
    const storageKey = getHistoryKey();
    const currentHistory = JSON.parse(localStorage.getItem(storageKey) || '[]');
    const newItems = newResults.map(r => ({
      ...r,
      name: cleanTitle(r.name),
      category: activeCategory,
      location: activeLocation,
      id: `h-${Date.now()}-${Math.random()}`,
      date: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
    }));
    const filteredHistory = currentHistory.filter((oldItem: any) => 
      !newItems.some(newItem => 
        newItem.name.toLowerCase().trim() === oldItem.name.toLowerCase().trim() && 
        (newItem.location || '').toLowerCase().trim() === (oldItem.location || '').toLowerCase().trim() &&
        (newItem.category || '').toLowerCase().trim() === (oldItem.category || '').toLowerCase().trim()
      )
    );
    const updatedHistory = [...newItems, ...filteredHistory].slice(0, 50);
    localStorage.setItem(storageKey, JSON.stringify(updatedHistory));
    setHistory(updatedHistory);
  };

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
    
    if (!finalQuery && !finalCategory) {
      toast({ title: "Input Diperlukan", description: "Kata kunci atau kategori harus diisi.", variant: "destructive" });
      return;
    }
    
    setLoading(true);
    if (!overrideQuery) setResults(null);

    try {
      const output = await aiIntentSearch({ 
        query: finalQuery || (finalCategory ? `Cari ${finalCategory}` : "Analisis Gambar"), 
        filters: {
          category: finalCategory || undefined,
          location: (finalLocation.includes('Lokasi') || finalLocation.includes('Location')) ? undefined : finalLocation,
          lat: coords?.lat,
          lng: coords?.lng
        } 
      });

      if (output) {
        output.results = output.results.map(r => ({ ...r, name: cleanTitle(r.name) }));
        setResults(output);
        updateVisualHistory(output.results);
      }
    } catch (err: any) {
      toast({ variant: "destructive", title: "Gagal Mencari", description: "Terjadi gangguan jaringan AI." });
    } finally {
      setLoading(false);
    }
  };

  const handleClearHistory = () => {
    localStorage.removeItem(getHistoryKey());
    setHistory([]);
    toast({ title: language === 'id' ? "Riwayat Dihapus" : "History Cleared" });
  };

  const handleRemoveHistoryItem = (id: string) => {
    const storageKey = getHistoryKey();
    const updated = history.filter(item => item.id !== id);
    setHistory(updated);
    localStorage.setItem(storageKey, JSON.stringify(updated));
  };

  const handleHistoryClick = (item: any) => {
    const cleanedQuery = cleanTitle(item.name);
    setQuery(cleanedQuery);
    setActiveCategory(item.category || null);
    setActiveLocation(item.location || (language === 'id' ? "Pilih Lokasi" : "Choose Location"));
    handleSearch(undefined, cleanedQuery, item.category, item.location);
  };

  const openInGoogleMaps = (name: string, location?: string) => {
    const cleanedName = cleanTitle(name);
    const searchQuery = encodeURIComponent(`${cleanedName} ${location || ''}`);
    window.open(`https://www.google.com/maps/search/?api=1&query=${searchQuery}`, '_blank');
  };

  const handleImageInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsSourcePickerOpen(false);
      toast({ title: "Visual AI Aktif", description: "Menganalisis objek dalam gambar..." });
      handleSearch(undefined, "Analisis Gambar");
    }
  };

  const handleCloudImageInput = (source: 'drive' | 'photos') => {
    setIsCloudLoading(true);
    toast({ title: `Menghubungkan ${source}...` });
    setTimeout(() => {
      setIsCloudLoading(false);
      setIsSourcePickerOpen(false);
      toast({ title: "Media Terpilih", description: "Memulai analisis visual AI..." });
      handleSearch(undefined, "Analisis visual Cloud");
    }, 1500);
  };

  const handleNearbySearch = () => {
    if (!("geolocation" in navigator)) {
      toast({ variant: "destructive", title: "GPS Tidak Tersedia" });
      return;
    }
    setLoading(true);
    setIsLocationOpen(false);
    navigator.geolocation.getCurrentPosition((position) => {
      const gpsLabel = language === 'id' ? "Lokasi GPS" : "GPS Active";
      setCoords({ lat: position.coords.latitude, lng: position.coords.longitude });
      setActiveLocation(gpsLabel);
      handleSearch(undefined, query, activeCategory, gpsLabel);
    }, () => {
      setLoading(false);
      toast({ variant: "destructive", title: "Gagal GPS" });
    });
  };

  const handleVoiceSearch = () => {
    if (!('webkitSpeechRecognition' in window)) {
      toast({ 
        variant: "destructive", 
        title: "Browser Tidak Mendukung", 
        description: "Gunakan Chrome atau Safari untuk fitur Voice Search." 
      });
      return;
    }

    const recognition = new (window as any).webkitSpeechRecognition();
    recognition.lang = language === 'id' ? 'id-ID' : 'en-US';
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => {
      toast({ title: "Mendengarkan...", description: "Silakan mulai berbicara." });
    };

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setQuery(transcript);
      toast({ title: "Suara Terdeteksi", description: `Mencari: "${transcript}"` });
      handleSearch(undefined, transcript);
    };

    recognition.onerror = () => {
      toast({ variant: "destructive", title: "Gagal Mengenali Suara" });
    };

    recognition.start();
  };

  const getTypeIcon = (type: string) => {
    switch(type) {
      case 'product': return <Package className="size-5" />;
      case 'service': return <Headphones className="size-5" />;
      case 'supplier': return <Truck className="size-5" />;
      case 'professional': return <User className="size-5" />;
      case 'opportunity': return <Briefcase className="size-5" />;
      case 'shop': return <Store className="size-5" />;
      case 'hotel': return <Hotel className="size-5" />;
      default: return <Building2 className="size-5" />;
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-8 py-2">
        <div className="bg-card p-8 rounded-[2.5rem] border border-border shadow-sm space-y-6">
          <form onSubmit={(e) => handleSearch(e)} className="space-y-6">
            <div className="relative group w-full">
              <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
                <Search className="size-6 text-muted-foreground group-focus-within:text-accent transition-colors" />
              </div>
              <Input 
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={t('search_placeholder')}
                className="h-20 pl-16 pr-52 rounded-[1.5rem] border-border bg-muted/20 shadow-inner text-lg font-medium focus:bg-background transition-all focus:border-accent text-foreground"
              />
              <div className="absolute inset-y-4 right-4 flex items-center gap-2">
                {query && (
                  <button 
                    type="button"
                    onClick={() => setQuery("")}
                    className="size-12 flex items-center justify-center rounded-2xl bg-card text-muted-foreground hover:text-rose-500 border border-border shadow-sm transition-all active:scale-90"
                  >
                    <X className="size-5" />
                  </button>
                )}
                <button 
                  type="button" 
                  onClick={handleVoiceSearch} 
                  className="size-12 flex items-center justify-center rounded-2xl bg-card text-muted-foreground hover:text-accent border border-border shadow-sm transition-all active:scale-90"
                >
                  <Mic className="size-5" />
                </button>
                <button 
                  type="button" 
                  onClick={() => setIsSourcePickerOpen(true)} 
                  className="size-12 flex items-center justify-center rounded-2xl bg-card text-muted-foreground hover:text-accent border border-border shadow-sm transition-all active:scale-90"
                >
                  <Camera className="size-5" />
                </button>
              </div>
              <input type="file" ref={fileInputRef} onChange={handleImageInput} className="hidden" accept="image/*" />
              <input type="file" ref={cameraInputRef} onChange={handleImageInput} className="hidden" accept="image/*" capture="environment" />
            </div>

            <Button type="submit" disabled={loading} className="w-full h-14 rounded-2xl bg-accent text-accent-foreground font-black text-sm shadow-xl transition-all flex gap-3 hover:bg-accent/90">
              {loading ? <RefreshCw className="size-5 animate-spin" /> : <><Search className="size-5" /> {t('search_now')}</>}
            </Button>

            <div className="grid grid-cols-2 gap-3">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="w-full h-14 justify-between rounded-2xl border-border bg-card text-foreground font-black hover:bg-muted/50 px-6 text-[11px] uppercase tracking-widest">
                    <div className="flex items-center gap-3">
                      <Filter className="size-4 text-accent" />
                      {activeCategory || (language === 'id' ? "Kategori" : "Category")}
                    </div>
                    <ChevronDown className="size-4 opacity-30" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-[300px] rounded-[1.5rem] p-2 shadow-2xl bg-card border-border">
                  <DropdownMenuItem onClick={() => setActiveCategory(null)} className="font-black text-muted-foreground p-3 rounded-xl text-[10px] uppercase tracking-widest">Semua Kategori</DropdownMenuItem>
                  {categories.map((cat) => (
                    <DropdownMenuItem key={cat.id} onClick={() => setActiveCategory(cat.label)} className="flex items-center gap-4 py-3 rounded-xl font-bold cursor-pointer hover:bg-muted text-sm text-foreground">
                      <div className="size-9 bg-muted rounded-xl flex items-center justify-center text-muted-foreground shrink-0"><cat.icon className="size-4" /></div>{cat.label}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              <Popover open={isLocationOpen} onOpenChange={setIsLocationOpen}>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full h-14 justify-between rounded-2xl border-border bg-card text-foreground font-black hover:bg-muted/50 px-6 text-[11px] uppercase tracking-widest">
                    <div className="flex items-center gap-3">
                      <MapPin className="size-4 text-rose-500" />
                      {activeLocation}
                    </div>
                    <ChevronDown className="size-4 opacity-30" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent align="center" className="w-[300px] rounded-[1.5rem] p-4 shadow-2xl bg-card border-border space-y-4">
                  <Button type="button" variant="outline" onClick={handleNearbySearch} className="w-full h-12 rounded-xl border-accent/20 bg-accent/5 text-accent font-black text-xs gap-3 active:scale-95 transition-all">
                    <LocateFixed className="size-5" /> {t('nearby')}
                  </Button>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                    <Input placeholder="Cari lokasi..." value={locationSearch} onChange={(e) => setLocationSearch(e.target.value)} className="h-10 pl-10 rounded-xl bg-muted/50 text-xs border-none text-foreground font-medium" />
                  </div>
                  <div className="space-y-1 max-h-[220px] overflow-y-auto no-scrollbar">
                    {POPULAR_LOCATIONS.filter(l => l.toLowerCase().includes(locationSearch.toLowerCase())).map((loc) => (
                      <button 
                        key={loc} 
                        type="button" 
                        onClick={() => { setActiveLocation(loc); setIsLocationOpen(false); }} 
                        className="w-full text-left px-4 py-3 rounded-xl text-xs font-black uppercase tracking-tight hover:bg-muted text-foreground transition-colors"
                      >
                        {loc}
                      </button>
                    ))}
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          </form>
        </div>

        {history.length > 0 && (
          <div className="space-y-4 px-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <History className="size-4 text-muted-foreground" />
                <h4 className="text-[11px] font-black uppercase tracking-widest text-muted-foreground">{t('recent_searches')}</h4>
              </div>
              <button onClick={handleClearHistory} className="text-[10px] font-black uppercase tracking-widest text-rose-500 hover:text-rose-600 transition-colors">
                {t('clear_all')}
              </button>
            </div>
            <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar">
              {history.map((item) => (
                <Card key={item.id} onClick={() => handleHistoryClick(item)} className="shrink-0 w-72 rounded-[1.5rem] border-border bg-card shadow-sm hover:shadow-lg transition-all relative group cursor-pointer border hover:border-accent/20">
                  <CardContent className="p-5 space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-3">
                        <div className="size-10 rounded-[0.75rem] bg-muted flex items-center justify-center shrink-0 shadow-inner group-hover:bg-accent/10 transition-colors">
                          {getTypeIcon(item.type)}
                        </div>
                        <h5 className="text-[13px] font-black text-foreground truncate max-w-[160px] leading-tight">{cleanTitle(item.name)}</h5>
                      </div>
                      <span role="button" onClick={(e) => { e.stopPropagation(); handleRemoveHistoryItem(item.id); }} className="p-1.5 rounded-lg bg-muted text-muted-foreground hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-all active:scale-75">
                        <X className="size-3.5" />
                      </span>
                    </div>
                    <div className="flex flex-col gap-1.5 text-[10px] font-bold text-muted-foreground uppercase tracking-tight">
                      <div className="flex items-center gap-2.5"><MapPin className="size-3 text-rose-400" /><span>{item.location || 'Global'}</span></div>
                      {item.category && <div className="flex items-center gap-2.5 text-accent"><Filter className="size-3" /><span>{item.category}</span></div>}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        <div className="space-y-6">
          {loading && (
            <div className="grid gap-6">
              {[1, 2].map((i) => (<Card key={i} className="animate-pulse border-border rounded-[2.5rem] bg-card overflow-hidden"><CardContent className="p-8 flex gap-6"><Skeleton className="size-16 rounded-2xl" /><div className="flex-1 space-y-3"><Skeleton className="h-7 w-1/3 rounded-lg" /><Skeleton className="h-5 w-2/3 rounded-lg" /></div></CardContent></Card>))}
            </div>
          )}

          {results && (
            <div className="space-y-4">
              <div className="flex items-center justify-between px-2">
                <div className="flex items-center gap-3"><h3 className="font-black text-foreground text-lg tracking-tight">{t('results')}</h3><Badge className="bg-accent/10 text-accent font-black px-3 py-1 rounded-lg text-xs border-none shadow-sm">{results.results.length}</Badge></div>
              </div>
              <div className="grid gap-5">
                {results.results.map((result, idx) => (
                  <Card key={idx} className="group rounded-[2rem] border border-border shadow-sm bg-card overflow-hidden hover:shadow-xl transition-all duration-300">
                    <CardContent className="p-0 flex flex-col md:flex-row">
                      <div className={cn("w-1.5 shrink-0 transition-colors", result.source.includes('ontapp') ? 'bg-accent' : 'bg-amber-400')} />
                      <div className="p-8 flex-1 flex flex-col md:flex-row gap-8 items-start">
                        <div className="size-16 rounded-[1.25rem] bg-muted text-foreground flex items-center justify-center shrink-0 shadow-inner group-hover:scale-105 transition-transform">{getTypeIcon(result.type)}</div>
                        <div className="flex-1 space-y-3">
                          <div className="flex flex-wrap items-center gap-3">
                            <h4 className="text-xl font-black text-slate-900 group-hover:text-accent transition-colors">{cleanTitle(result.name)}</h4>
                            <Badge className={cn("text-[9px] font-black uppercase tracking-widest rounded-full px-3 py-1 border-none", result.source === 'external' ? 'bg-amber-500/10 text-amber-500' : 'bg-accent/10 text-accent')}>
                              {result.source === 'external' ? 'Eksternal' : 'Verified Member'}
                            </Badge>
                          </div>
                          <p className="text-slate-500 font-medium text-sm leading-relaxed max-w-2xl">{result.description}</p>
                          <div className="flex items-center gap-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                            {result.location && <button onClick={() => openInGoogleMaps(result.name, result.location)} className="flex items-center gap-2 hover:text-rose-500 transition-colors"><MapPin className="size-3.5 text-rose-400" />{result.location}</button>}
                            <div className="flex items-center gap-2 text-accent"><Target className="size-3.5" />{result.matchScore}% Synergy</div>
                          </div>
                        </div>
                        <div className="md:w-36 shrink-0 flex flex-col gap-3">
                          <Button variant="outline" size="sm" onClick={() => openInGoogleMaps(result.name, result.location)} className="w-full rounded-xl border-accent/20 text-accent text-[10px] font-black uppercase h-10 tracking-widest">Maps</Button>
                          <Button className="w-full rounded-xl h-11 bg-accent hover:bg-accent/90 text-accent-foreground text-[10px] font-black uppercase tracking-widest shadow-lg shadow-accent/10">{t('view_profile')}</Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {!loading && !results && history.length === 0 && (
            <div className="py-24 text-center space-y-8 bg-card rounded-[3rem] border-2 border-dashed border-border/50 animate-in fade-in duration-500">
               <div className="size-24 rounded-[2rem] bg-muted flex items-center justify-center mx-auto shadow-inner"><Search className="size-12 text-muted-foreground/20" /></div>
               <div className="space-y-2">
                 <h3 className="text-2xl font-black text-slate-900 tracking-tight">{t('start_search')}</h3>
                 <p className="text-sm text-slate-500 max-w-sm mx-auto font-medium">{t('daily_limit_msg')}</p>
               </div>
            </div>
          )}
        </div>
      </div>

      <Dialog open={isSourcePickerOpen} onOpenChange={setIsSourcePickerOpen}>
        <DialogContent className="max-w-[340px] rounded-[3rem] bg-card text-foreground p-10 border-none shadow-2xl overflow-hidden outline-none animate-in zoom-in-95 duration-200">
          <div className="space-y-10">
            <div className="space-y-2">
              <h2 className="text-2xl font-black tracking-tight text-center">Cari Visual</h2>
              <p className="text-xs text-center text-muted-foreground font-medium uppercase tracking-widest">Sintesis Objek AI</p>
            </div>
            <div className="space-y-6">
              <button disabled={isCloudLoading} onClick={() => cameraInputRef.current?.click()} className="w-full flex items-center gap-6 group text-left active:scale-95 transition-transform">
                <div className="size-14 rounded-2xl bg-muted flex items-center justify-center shadow-inner group-hover:bg-accent/10 group-hover:text-accent transition-colors"><Camera className="size-7" /></div>
                <div className="flex flex-col"><span className="font-black text-[16px] leading-none">Ambil Foto</span><span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-1">Kamera Langsung</span></div>
              </button>
              <button disabled={isCloudLoading} onClick={() => fileInputRef.current?.click()} className="w-full flex items-center gap-6 group text-left active:scale-95 transition-transform">
                <div className="size-14 rounded-2xl bg-muted flex items-center justify-center shadow-inner group-hover:bg-accent/10 group-hover:text-accent transition-colors"><ImageIcon className="size-7" /></div>
                <div className="flex flex-col"><span className="font-black text-[16px] leading-none">Galeri Media</span><span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-1">Pilih dari Penyimpanan</span></div>
              </button>
              <div className="h-px bg-border w-full opacity-50" />
              <button disabled={isCloudLoading} onClick={() => handleCloudImageInput('drive')} className="w-full flex items-center gap-6 group text-left active:scale-95 transition-transform">
                <div className="size-14 rounded-2xl bg-muted flex items-center justify-center shadow-inner group-hover:bg-blue-50 transition-colors">{isCloudLoading ? <RefreshCw className="size-7 animate-spin text-blue-500" /> : <Cloud className="size-7 text-blue-500" />}</div>
                <div className="flex flex-col"><span className="font-black text-[16px] leading-none">Google Drive</span><span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-1">Impor Awan</span></div>
              </button>
              <button disabled={isCloudLoading} onClick={() => handleCloudImageInput('photos')} className="w-full flex items-center gap-6 group text-left active:scale-95 transition-transform">
                <div className="size-14 rounded-2xl bg-muted flex items-center justify-center shadow-inner group-hover:bg-rose-50 transition-colors">{isCloudLoading ? <RefreshCw className="size-7 animate-spin text-rose-500" /> : <ImageIcon className="size-7 text-rose-500" />}</div>
                <div className="flex flex-col"><span className="font-black text-[16px] leading-none">Google Photos</span><span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-1">Arsip Foto</span></div>
              </button>
            </div>
            <button onClick={() => setIsSourcePickerOpen(false)} className="w-full text-center text-xs font-black uppercase tracking-widest text-muted-foreground hover:text-rose-500 transition-colors">Batal</button>
          </div>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
