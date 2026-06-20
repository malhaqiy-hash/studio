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
  Briefcase
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { aiIntentSearch, type AIIntentSearchOutput } from "@/ai/flows/ai-intent-search-flow";
import { useLanguage } from "@/context/language-context";
import { Skeleton } from "@/components/ui/skeleton";
import { useFirestore, useUser } from "@/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
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
  const db = useFirestore();
  const { user } = useUser();
  
  const [query, setQuery] = React.useState("");
  const [loading, setLoading] = React.useState(false);
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

  // Kategori Berdasarkan Tipe Akun
  const categories = React.useMemo(() => {
    if (activeAccount.type === 'bisnis') return [...BASE_CATEGORIES, ...PREMIUM_CATEGORIES];
    if (activeAccount.type === 'professional') return [...BASE_CATEGORIES, PREMIUM_CATEGORIES.find(c => c.id === 'opportunity')!];
    return BASE_CATEGORIES;
  }, [activeAccount.type]);

  React.useEffect(() => {
    const saved = localStorage.getItem('ontapp_discovery_history');
    if (saved) {
      const parsedHistory = JSON.parse(saved).map((item: any) => ({
        ...item,
        name: cleanTitle(item.name)
      }));
      setHistory(parsedHistory);
    }
  }, []);

  const updateVisualHistory = (newResults: any[]) => {
    if (typeof window === 'undefined') return;

    const currentHistory = JSON.parse(localStorage.getItem('ontapp_discovery_history') || '[]');
    
    const newItems = newResults.map(r => ({
      ...r,
      name: cleanTitle(r.name),
      category: activeCategory, // Simpan kategori aktif saat pencarian
      location: activeLocation, // Simpan lokasi aktif
      id: `h-${Date.now()}-${Math.random()}`,
      date: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
    }));

    // LOGIKA ANTI-DUPLIKASI KETAT (Nama + Lokasi + Kategori)
    const filteredHistory = currentHistory.filter((oldItem: any) => 
      !newItems.some(newItem => 
        newItem.name.toLowerCase().trim() === oldItem.name.toLowerCase().trim() && 
        (newItem.location || '').toLowerCase().trim() === (oldItem.location || '').toLowerCase().trim() &&
        (newItem.category || '').toLowerCase().trim() === (oldItem.category || '').toLowerCase().trim()
      )
    );

    const updatedHistory = [...newItems, ...filteredHistory].slice(0, 50);
    localStorage.setItem('ontapp_discovery_history', JSON.stringify(updatedHistory));
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
    localStorage.removeItem('ontapp_discovery_history');
    setHistory([]);
    toast({ title: language === 'id' ? "Riwayat Dihapus" : "History Cleared" });
  };

  const handleRemoveHistoryItem = (id: string) => {
    const updated = history.filter(item => item.id !== id);
    setHistory(updated);
    localStorage.setItem('ontapp_discovery_history', JSON.stringify(updated));
  };

  const handleHistoryClick = (item: any) => {
    const cleanedQuery = cleanTitle(item.name);
    // Sinkronkan state untuk UI feedback sesuai data kartu
    const targetCategory = item.category || null;
    const targetLocation = item.location || (language === 'id' ? "Pilih Lokasi" : "Choose Location");

    setQuery(cleanedQuery);
    setActiveCategory(targetCategory);
    setActiveLocation(targetLocation);
    
    toast({ title: "Sinkronisasi Riwayat", description: `Mengulang indeks untuk ${cleanedQuery}...` });

    // Jalankan pencarian dengan parameter eksplisit
    handleSearch(undefined, cleanedQuery, targetCategory, targetLocation);
  };

  const openInGoogleMaps = (name: string, location?: string) => {
    const cleanedName = cleanTitle(name);
    const searchQuery = encodeURIComponent(`${cleanedName} ${location || ''}`);
    window.open(`https://www.google.com/maps/search/?api=1&query=${searchQuery}`, '_blank');
  };

  const handleImageInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setIsSourcePickerOpen(false);
        handleSearch(undefined, "Analisis visual");
      };
      reader.readAsDataURL(file);
    }
  };

  const handleNearbySearch = () => {
    if (!("geolocation" in navigator)) {
      toast({ variant: "destructive", title: "GPS Tidak Tersedia", description: "Browser tidak mendukung geolokasi." });
      return;
    }
    setLoading(true);
    setIsLocationOpen(false);
    navigator.geolocation.getCurrentPosition((position) => {
      const gpsLabel = language === 'id' ? "Lokasi GPS Aktif" : "GPS Active";
      setCoords({ lat: position.coords.latitude, lng: position.coords.longitude });
      setActiveLocation(gpsLabel);
      handleSearch(undefined, query, activeCategory, gpsLabel);
    }, () => {
      setLoading(false);
      toast({ variant: "destructive", title: "Gagal GPS", description: "Silakan izinkan akses lokasi." });
    });
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
      <div className="max-w-4xl mx-auto space-y-6 py-2">
        <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm space-y-5">
          <form onSubmit={(e) => handleSearch(e)} className="space-y-4">
            <div className="relative group w-full">
              <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                <Search className="size-5 text-slate-400 group-focus-within:text-teal-600 transition-colors" />
              </div>
              <Input 
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={t('search_placeholder')}
                className="h-16 pl-12 pr-44 rounded-2xl border-slate-100 bg-slate-50/50 shadow-inner text-base font-medium focus:bg-white transition-all focus:border-teal-500"
              />
              <div className="absolute inset-y-3 right-3 flex items-center gap-1.5">
                {query && (
                  <span 
                    role="button" 
                    onClick={() => setQuery("")}
                    className="w-10 h-10 flex items-center justify-center rounded-xl bg-white text-slate-400 hover:text-rose-500 border border-slate-100 shadow-sm transition-all active:scale-90 cursor-pointer"
                  >
                    <X className="size-5" />
                  </span>
                )}
                <button type="button" onClick={() => setIsSourcePickerOpen(true)} className="w-10 h-10 flex items-center justify-center rounded-xl bg-white text-slate-400 hover:text-teal-600 border border-slate-100 shadow-sm transition-all active:scale-90"><Camera className="size-5" /></button>
              </div>
              <input type="file" ref={fileInputRef} onChange={handleImageInput} className="hidden" accept="image/*" />
              <input type="file" ref={cameraInputRef} onChange={handleImageInput} className="hidden" accept="image/*" capture="environment" />
            </div>

            <Button type="submit" disabled={loading} className="w-full h-14 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-black text-sm shadow-md transition-all active:scale-95 flex gap-2">
              {loading ? <RefreshCw className="size-4 animate-spin" /> : <><Search className="size-4" /> {t('search_now')}</>}
            </Button>

            <div className="grid grid-cols-2 gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="w-full h-12 justify-between rounded-xl border-slate-100 bg-white text-slate-600 font-bold hover:bg-slate-50 px-4 text-xs">
                    <div className="flex items-center gap-2">
                      <Filter className="size-3.5 text-teal-600" />
                      {activeCategory ? (
                        <div className="flex items-center gap-1.5">
                          {activeCategory}
                          <span 
                            role="button"
                            onClick={(e) => { e.stopPropagation(); setActiveCategory(null); }}
                            className="p-1 hover:bg-slate-100 rounded-full transition-colors cursor-pointer"
                          >
                            <X className="size-3 text-slate-400 hover:text-rose-500" />
                          </span>
                        </div>
                      ) : (
                        language === 'id' ? "Pilih Kategori" : "Pick Category"
                      )}
                    </div>
                    <ChevronDown className="size-3.5 opacity-30" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-[280px] rounded-2xl p-2 shadow-2xl border-slate-100">
                  <DropdownMenuItem onClick={() => setActiveCategory(null)} className="font-bold text-slate-400 hover:text-teal-600 p-2.5 rounded-lg text-xs">{language === 'id' ? 'Semua Kategori' : 'All Categories'}</DropdownMenuItem>
                  {categories.map((cat) => (
                    <DropdownMenuItem key={cat.id} onClick={() => setActiveCategory(cat.label)} className="flex items-center gap-3 py-2.5 rounded-lg font-bold cursor-pointer hover:bg-slate-50 text-xs">
                      <div className="size-7 bg-slate-100 rounded flex items-center justify-center text-slate-500"><cat.icon className="size-3.5" /></div>{cat.label}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              <Popover open={isLocationOpen} onOpenChange={setIsLocationOpen}>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full h-12 justify-between rounded-xl border-slate-100 bg-white text-slate-600 font-bold hover:bg-slate-50 px-4 text-xs">
                    <div className="flex items-center gap-2">
                      <MapPin className="size-3.5 text-rose-500" />
                      {(!activeLocation.includes('Lokasi') && !activeLocation.includes('Location')) ? (
                        <div className="flex items-center gap-1.5">
                          {activeLocation}
                          <span 
                            role="button"
                            onClick={(e) => { e.stopPropagation(); setActiveLocation(language === 'id' ? "Pilih Lokasi" : "Choose Location"); }}
                            className="p-1 hover:bg-slate-100 rounded-full transition-colors cursor-pointer"
                          >
                            <X className="size-3 text-slate-400 hover:text-rose-500" />
                          </span>
                        </div>
                      ) : (
                        activeLocation
                      )}
                    </div>
                    <ChevronDown className="size-3.5 opacity-30" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent align="center" className="w-[280px] rounded-2xl p-3 shadow-2xl border-slate-100 space-y-3">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={handleNearbySearch} 
                    className="w-full h-11 rounded-xl border-teal-100 bg-teal-50/50 text-teal-700 font-black hover:bg-teal-100 text-xs gap-2"
                  >
                    <LocateFixed className="size-4" />
                    {t('nearby')}
                  </Button>

                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-slate-400" />
                    <Input 
                      placeholder="Search location..." 
                      value={locationSearch} 
                      onChange={(e) => setLocationSearch(e.target.value)} 
                      className="h-9 pl-9 rounded-xl border-slate-100 bg-slate-50 text-[11px] font-bold" 
                    />
                  </div>

                  <div className="space-y-1 max-h-[200px] overflow-y-auto">
                    {locationSearch && (<button type="button" onClick={() => { setActiveLocation(locationSearch); setIsLocationOpen(false); }} className="w-full text-left px-3 py-2 rounded-lg text-xs font-bold text-teal-600 bg-teal-50 hover:bg-teal-100 flex items-center gap-2"><MapPin className="size-3" /> Gunakan "{locationSearch}"</button>)}
                    {POPULAR_LOCATIONS.filter(l => l.toLowerCase().includes(locationSearch.toLowerCase())).map((loc) => (<button key={loc} type="button" onClick={() => { setActiveLocation(loc); setIsLocationOpen(false); }} className="w-full text-left px-3 py-2 rounded-lg text-xs font-bold text-slate-600 hover:bg-slate-50">{loc}</button>))}
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
                <History className="size-3 text-slate-400" />
                <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400">{t('recent_searches')}</h4>
              </div>
              <button 
                onClick={handleClearHistory}
                className="text-[9px] font-black uppercase tracking-widest text-rose-500 hover:text-rose-600 transition-colors"
              >
                {t('clear_all')}
              </button>
            </div>
            <div className="flex gap-3 overflow-x-auto pb-4 no-scrollbar">
              {history.map((item) => (
                <Card 
                  key={item.id} 
                  onClick={() => handleHistoryClick(item)}
                  className="shrink-0 w-64 rounded-2xl border-slate-100 bg-white shadow-sm hover:shadow-md transition-all relative group cursor-pointer active:scale-95"
                >
                  <CardContent className="p-4 space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <div className="size-8 rounded-lg bg-slate-50 flex items-center justify-center shrink-0">
                          {getTypeIcon(item.type)}
                        </div>
                        <h5 className="text-xs font-black text-slate-900 truncate max-w-[140px]">{cleanTitle(item.name)}</h5>
                      </div>
                      <span 
                        role="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveHistoryItem(item.id);
                        }}
                        className="p-1.5 rounded-full bg-slate-50 text-slate-400 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-all cursor-pointer"
                      >
                        <X className="size-3" />
                      </span>
                    </div>
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2 text-[9px] font-bold text-slate-400">
                        <MapPin className="size-2.5" />
                        <span className="truncate">{item.location || 'Global'}</span>
                      </div>
                      {item.category && (
                        <div className="flex items-center gap-2 text-[9px] font-bold text-teal-600">
                          <Filter className="size-2.5" />
                          <span className="truncate">{item.category}</span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        <div className="space-y-4">
          {loading && (
            <div className="grid gap-4">
              {[1, 2].map((i) => (<Card key={i} className="animate-pulse border-slate-100 rounded-[2rem]"><CardContent className="p-6 flex gap-4"><Skeleton className="size-14 rounded-xl" /><div className="flex-1 space-y-2"><Skeleton className="h-6 w-1/3 rounded" /><Skeleton className="h-4 w-2/3 rounded" /></div></CardContent></Card>))}
            </div>
          )}

          {results && (
            <div className="space-y-4">
              <div className="flex items-center justify-between px-2">
                <div className="flex items-center gap-2"><h3 className="font-black text-slate-900 text-base">{t('results')}</h3><Badge className="bg-teal-100 text-teal-700 font-bold">{results.results.length}</Badge></div>
                <div className="flex items-center gap-1.5 text-[9px] font-black uppercase text-teal-600 bg-teal-50 px-3 py-1 rounded-full border border-teal-100"><Zap className="size-3" /> Analisis Sinkronisasi AI</div>
              </div>
              <div className="grid gap-4">
                {results.results.map((result, idx) => (
                  <Card key={idx} className="group rounded-[1.5rem] border shadow-sm bg-white overflow-hidden">
                    <CardContent className="p-0 flex flex-col md:flex-row">
                      <div className={cn("w-1 shrink-0", result.source.includes('ontapp') ? 'bg-teal-500' : 'bg-amber-400')} />
                      <div className="p-6 flex-1 flex flex-col md:flex-row gap-5 items-start">
                        <div className="size-14 rounded-2xl bg-slate-50 text-slate-600 flex items-center justify-center shrink-0">{getTypeIcon(result.type)}</div>
                        <div className="flex-1 space-y-2">
                          <div className="flex flex-wrap items-center gap-2">
                            <h4 className="text-lg font-black text-slate-900">{cleanTitle(result.name)}</h4>
                            <Badge className={cn("text-[10px] font-bold rounded-lg px-2", result.source === 'external' ? 'bg-amber-50 text-amber-600' : 'bg-teal-50 text-teal-600')}>
                              {result.source === 'external' ? 'Jaringan Eksternal' : 'Verified OnTapp'}
                            </Badge>
                          </div>
                          <p className="text-slate-500 font-medium text-xs leading-relaxed">{result.description}</p>
                          <div className="flex items-center gap-4 text-[10px] font-black text-slate-400">
                            {result.location && <button onClick={() => openInGoogleMaps(result.name, result.location)} className="flex items-center gap-1 hover:text-teal-600"><MapPin className="size-3 text-rose-400" />{result.location}</button>}
                            <div className="flex items-center gap-1 text-teal-600"><Target className="size-3 text-teal-500" />{result.matchScore}% Synergy</div>
                          </div>
                        </div>
                        <div className="md:w-32 shrink-0 flex flex-col gap-2">
                          <Button variant="outline" size="sm" onClick={() => openInGoogleMaps(result.name, result.location)} className="w-full rounded-lg border-teal-100 text-teal-700 text-[9px] font-black"><MapIcon className="size-3" /> Maps</Button>
                          <Button className="w-full rounded-lg h-9 bg-teal-600 hover:bg-teal-700 text-white text-[9px] font-black">{t('view_profile')}</Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {!loading && !results && history.length === 0 && (
            <div className="py-20 text-center space-y-6 bg-white rounded-[2rem] border border-dashed border-slate-200">
               <div className="size-20 rounded-full bg-slate-50 flex items-center justify-center mx-auto"><Search className="size-10 text-slate-200" /></div>
               <h3 className="text-xl font-black text-slate-900">{t('start_search')}</h3>
               <p className="text-xs text-slate-400 max-w-sm mx-auto font-medium">{t('daily_limit_msg')}</p>
            </div>
          )}
        </div>
      </div>

      <Dialog open={isSourcePickerOpen} onOpenChange={setIsSourcePickerOpen}>
        <DialogContent className="max-w-[320px] rounded-[2.5rem] bg-[#2d3035] text-white p-8">
          <div className="space-y-8">
            <h2 className="text-xl font-bold">Cari dengan Visual</h2>
            <div className="space-y-6">
              <button onClick={() => cameraInputRef.current?.click()} className="w-full flex items-center justify-between"><div className="flex items-center gap-5"><div className="size-12 rounded-full bg-white/10 flex items-center justify-center"><Camera className="size-6" /></div><span className="font-bold">Ambil Foto</span></div></button>
              <button onClick={() => fileInputRef.current?.click()} className="w-full flex items-center justify-between"><div className="flex items-center gap-5"><div className="size-12 rounded-full bg-white/10 flex items-center justify-center"><ImageIcon className="size-6" /></div><span className="font-bold">Galeri</span></div></button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
