'use client';

import * as React from 'react';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Search, 
  ShieldCheck, 
  MapPin, 
  Briefcase, 
  Zap, 
  Package,
  Headphones,
  Truck,
  Layers,
  Users,
  RefreshCw,
  Globe,
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
  X,
  Image as ImageIcon,
  Map as MapIcon,
  Sparkles,
  Clock
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { aiIntentSearch, type AIIntentSearchOutput } from "@/ai/flows/ai-intent-search-flow";
import { translateText } from "@/ai/flows/translate-flow";
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

const ENTITY_CATEGORIES = [
  { id: 'toko', label: 'Toko', icon: Store },
  { id: 'produk', label: 'Produk', icon: Package },
  { id: 'service', label: 'Service', icon: Headphones },
  { id: 'hotel', label: 'Hotel', icon: Hotel },
  { id: 'transportasi', label: 'Transportasi', icon: Truck },
  { id: 'supplier', label: 'Supplier', icon: Truck },
  { id: 'distributor', label: 'Distributor', icon: Layers },
  { id: 'freelancer', label: 'Freelancer', icon: User },
  { id: 'communities', label: 'Communities', icon: Users },
  { id: 'others', label: 'Lainnya', icon: MoreHorizontal },
];

const POPULAR_LOCATIONS = [
  "Global", "Jakarta", "Surabaya", "Medan", "Bandung", "Bali", "Singapore", "Malaysia", "Tokyo", "London"
];

export default function CariPage() {
  const { language } = useLanguage();
  const { toast } = useToast();
  const db = useFirestore();
  const { user } = useUser();
  const [query, setQuery] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [results, setResults] = React.useState<AIIntentSearchOutput | null>(null);
  
  const [activeCategory, setActiveCategory] = React.useState<string | null>(null);
  const [activeLocation, setActiveLocation] = React.useState("Pilih Lokasi");
  const [isLocationOpen, setIsLocationOpen] = React.useState(false);
  const [locationSearch, setLocationSearch] = React.useState("");
  const [coords, setCoords] = React.useState<{lat?: number, lng?: number}>({});
  
  const [isListening, setIsListening] = React.useState(false);
  const [previewImage, setPreviewImage] = React.useState<string | null>(null);
  const [isSourcePickerOpen, setIsSourcePickerOpen] = React.useState(false);
  
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const cameraInputRef = React.useRef<HTMLInputElement>(null);
  
  const [translations, setTranslations] = React.useState<Record<string, { text: string, show: boolean, loading: boolean, detected: string }>>({});

  const generateCacheId = (q: string, loc: string, cat: string | null) => {
    return btoa(`${q.toLowerCase()}-${loc.toLowerCase()}-${cat || 'all'}`).replace(/[/+=]/g, '_').substring(0, 50);
  };

  const checkThrottling = async (userId: string) => {
    if (!db) return true;
    const rateRef = doc(db, 'user_rate_limits', userId);
    const snap = await getDoc(rateRef);
    const now = Date.now();
    const today = new Date().toISOString().split('T')[0];
    const oneMinuteAgo = now - 60000;

    let data = snap.exists() ? snap.data() : { requestTimestamps: [], dailyCount: 0, lastResetDate: today };
    
    // Reset daily if date changed
    if (data.lastResetDate !== today) {
      data.dailyCount = 0;
      data.lastResetDate = today;
    }

    // Check Daily Limit (30)
    if (data.dailyCount >= 30) {
      toast({ variant: "destructive", title: "Limit Harian Habis", description: "Batas 30 akses AI per hari tercapai. Silakan coba lagi besok." });
      return false;
    }

    // Check Minute Throttling (5)
    const recent = (data.requestTimestamps || []).map((t: string) => new Date(t).getTime()).filter((t: number) => t > oneMinuteAgo);
    if (recent.length >= 5) {
      toast({ variant: "destructive", title: "Terlalu Cepat", description: "Batas 5 pencarian per menit tercapai. Mohon tunggu sejenak." });
      return false;
    }
    
    await setDoc(rateRef, {
      requestTimestamps: [...recent.map(t => new Date(t).toISOString()), new Date().toISOString()],
      dailyCount: (data.dailyCount || 0) + 1,
      lastResetDate: today
    }, { merge: true });
    
    return true;
  };

  const handleSearch = async (e?: React.FormEvent, overrideQuery?: string) => {
    e?.preventDefault();
    const finalQuery = overrideQuery || query;
    if (!finalQuery && !activeCategory && !previewImage) {
      toast({ title: "Input diperlukan", description: "Silakan masukkan kata kunci atau pilih kategori.", variant: "destructive" });
      return;
    }
    
    setLoading(true);
    setResults(null);
    setTranslations({});

    try {
      // 1. Global Throttling & Daily Limit
      if (user && db) {
        const canProceed = await checkThrottling(user.uid);
        if (!canProceed) {
          setLoading(false);
          return;
        }
      }

      // 2. Search Caching (24h)
      const cacheId = generateCacheId(finalQuery || (activeCategory || ''), activeLocation, activeCategory);
      if (db) {
        const cacheRef = doc(db, 'search_cache', cacheId);
        const cacheSnap = await getDoc(cacheRef);
        if (cacheSnap.exists()) {
          const cacheData = cacheSnap.data();
          const cacheTime = new Date(cacheData.timestamp).getTime();
          const isExpired = Date.now() - cacheTime > 86400000; // 24 hours

          if (!isExpired) {
            const parsedResults = JSON.parse(cacheData.results);
            setResults(parsedResults);
            setLoading(false);
            toast({ title: "Optimasi Biaya", description: "Mengambil data dari cache pintar (24 jam)." });
            return;
          }
        }
      }

      // 3. AI Execution
      const output = await aiIntentSearch({ 
        query: finalQuery || (activeCategory ? `Cari ${activeCategory}` : "Analisis Gambar Bisnis"), 
        filters: {
          category: activeCategory || undefined,
          location: activeLocation !== "Pilih Lokasi" ? activeLocation : undefined,
          lat: coords?.lat,
          lng: coords?.lng
        } 
      });

      // 4. Save to Cache
      if (db) {
        const cacheRef = doc(db, 'search_cache', cacheId);
        await setDoc(cacheRef, {
          results: JSON.stringify(output),
          timestamp: new Date().toISOString()
        });
      }

      setResults(output);
      
      // 5. Local Backup History
      if (typeof window !== 'undefined') {
        const history = JSON.parse(localStorage.getItem('ontapp_discovery_history') || '[]');
        const newItems = output.results.map(r => ({
          ...r,
          id: `h-${Date.now()}-${Math.random()}`,
          date: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
        }));
        localStorage.setItem('ontapp_discovery_history', JSON.stringify([...newItems, ...history].slice(0, 50)));
      }
      
    } catch (err: any) {
      toast({ variant: "destructive", title: "Pencarian Terganggu", description: err.message || "Terjadi gangguan sistem." });
    } finally {
      setLoading(false);
    }
  };

  const openInGoogleMaps = (name: string, location?: string) => {
    const searchQuery = encodeURIComponent(`${name} ${location || ''}`);
    window.open(`https://www.google.com/maps/search/?api=1&query=${searchQuery}`, '_blank');
  };

  const handleImageInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
        setIsSourcePickerOpen(false);
        handleSearch(undefined, "Analisis gambar pencarian visual");
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
    navigator.geolocation.getCurrentPosition((position) => {
      setCoords({ lat: position.coords.latitude, lng: position.coords.longitude });
      setActiveLocation("Lokasi GPS Aktif");
      handleSearch();
    }, () => {
      setLoading(false);
      toast({ variant: "destructive", title: "Gagal GPS", description: "Izinkan akses lokasi." });
    });
  };

  const getTypeIcon = (type: string) => {
    switch(type) {
      case 'product': return <Package className="size-5" />;
      case 'service': return <Headphones className="size-5" />;
      case 'supplier': return <Truck className="size-5" />;
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
                placeholder="Cari apa saja di OnTapp..."
                className="h-16 pl-12 pr-32 rounded-2xl border-slate-100 bg-slate-50/50 shadow-inner text-base font-medium focus:bg-white transition-all focus:border-teal-500"
              />
              <div className="absolute inset-y-3 right-3 flex items-center gap-1.5">
                <button type="button" onClick={() => setIsSourcePickerOpen(true)} className="w-10 h-10 flex items-center justify-center rounded-xl bg-white text-slate-400 hover:text-teal-600 border border-slate-100 shadow-sm transition-all active:scale-90"><Camera className="size-5" /></button>
                <button type="button" className={cn("w-10 h-10 flex items-center justify-center rounded-xl transition-all active:scale-90 bg-white text-slate-400 hover:text-teal-600 shadow-sm border border-slate-100", isListening && "bg-rose-500 text-white animate-pulse")}><Mic className="size-5" /></button>
              </div>
              <input type="file" ref={fileInputRef} onChange={handleImageInput} className="hidden" accept="image/*" />
              <input type="file" ref={cameraInputRef} onChange={handleImageInput} className="hidden" accept="image/*" capture="environment" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="w-full h-12 justify-between rounded-xl border-slate-100 bg-white text-slate-600 font-bold hover:bg-slate-50 px-4 text-xs">
                    <div className="flex items-center gap-2"><Filter className="size-3.5 text-teal-600" />{activeCategory ? activeCategory : "Pilih Kategori"}</div>
                    <ChevronDown className="size-3.5 opacity-30" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-[280px] rounded-2xl p-2 shadow-2xl border-slate-100">
                  <DropdownMenuItem onClick={() => setActiveCategory(null)} className="font-bold text-slate-400 hover:text-teal-600 p-2.5 rounded-lg text-xs">Semua Kategori</DropdownMenuItem>
                  {ENTITY_CATEGORIES.map((cat) => (
                    <DropdownMenuItem key={cat.id} onClick={() => setActiveCategory(cat.label)} className="flex items-center gap-3 py-2.5 rounded-lg font-bold cursor-pointer hover:bg-slate-50 text-xs">
                      <div className="size-7 bg-slate-100 rounded flex items-center justify-center text-slate-500"><cat.icon className="size-3.5" /></div>{cat.label}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              <Popover open={isLocationOpen} onOpenChange={setIsLocationOpen}>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full h-12 justify-between rounded-xl border-slate-100 bg-white text-slate-600 font-bold hover:bg-slate-50 px-4 text-xs">
                    <div className="flex items-center gap-2"><MapPin className="size-3.5 text-rose-500" />{activeLocation}</div>
                    <ChevronDown className="size-3.5 opacity-30" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent align="center" className="w-[280px] rounded-2xl p-3 shadow-2xl border-slate-100 space-y-3">
                  <div className="relative"><Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-slate-400" /><Input placeholder="Cari lokasi..." value={locationSearch} onChange={(e) => setLocationSearch(e.target.value)} className="h-9 pl-9 rounded-xl border-slate-100 bg-slate-50 text-[11px] font-bold" /></div>
                  <div className="space-y-1 max-h-[200px] overflow-y-auto">
                    {locationSearch && (<button type="button" onClick={() => { setActiveLocation(locationSearch); setIsLocationOpen(false); }} className="w-full text-left px-3 py-2 rounded-lg text-xs font-bold text-teal-600 bg-teal-50 hover:bg-teal-100 flex items-center gap-2"><MapPin className="size-3" /> Gunakan "{locationSearch}"</button>)}
                    {POPULAR_LOCATIONS.filter(l => l.toLowerCase().includes(locationSearch.toLowerCase())).map((loc) => (<button key={loc} type="button" onClick={() => { setActiveLocation(loc); setIsLocationOpen(false); }} className="w-full text-left px-3 py-2 rounded-lg text-xs font-bold text-slate-600 hover:bg-slate-50">{loc}</button>))}
                  </div>
                </PopoverContent>
              </Popover>

              <Button type="button" variant="outline" onClick={handleNearbySearch} className="w-full h-12 rounded-xl border-teal-100 bg-teal-50/30 text-teal-700 font-bold hover:bg-teal-50 text-xs gap-2"><LocateFixed className="size-4" />Cari Sekitar (GPS)</Button>
            </div>

            <Button type="submit" disabled={loading} className="w-full h-14 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-black text-sm shadow-md transition-all active:scale-95 flex gap-2">
              {loading ? <RefreshCw className="size-4 animate-spin" /> : <><Search className="size-4" /> Cari Sekarang</>}
            </Button>
          </form>
        </div>

        <div className="space-y-4">
          {loading && (
            <div className="grid gap-4">
              {[1, 2].map((i) => (<Card key={i} className="animate-pulse border-slate-100 rounded-[2rem]"><CardContent className="p-6 flex gap-4"><Skeleton className="size-14 rounded-xl" /><div className="flex-1 space-y-2"><Skeleton className="h-6 w-1/3 rounded" /><Skeleton className="h-4 w-2/3 rounded" /></div></CardContent></Card>))}
            </div>
          )}

          {results && (
            <div className="space-y-4">
              <div className="flex items-center justify-between px-2">
                <div className="flex items-center gap-2"><h3 className="font-black text-slate-900 text-base">Hasil Discovery</h3><Badge className="bg-teal-100 text-teal-700 font-bold">{results.results.length}</Badge></div>
                <div className="flex items-center gap-1.5 text-[9px] font-black uppercase text-teal-600 bg-teal-50 px-3 py-1 rounded-full border border-teal-100"><Sparkles className="size-3" /> Cost-Optimized Search</div>
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
                            <h4 className="text-lg font-black text-slate-900">{result.name}</h4>
                            <Badge className={cn("text-[10px] font-bold rounded-lg px-2", result.source === 'external' ? 'bg-amber-50 text-amber-600' : 'bg-teal-50 text-teal-600')}>
                              {result.source === 'external' ? 'Media Eksternal' : 'Verified OnTapp'}
                            </Badge>
                          </div>
                          <p className="text-slate-500 font-medium text-xs leading-relaxed">{result.description}</p>
                          <div className="flex items-center gap-4 text-[10px] font-black text-slate-400">
                            {result.location && <button onClick={() => openInGoogleMaps(result.name, result.location)} className="flex items-center gap-1 hover:text-teal-600"><MapPin className="size-3 text-rose-400" />{result.location}</button>}
                            <div className="flex items-center gap-1 text-teal-600"><Zap className="size-3 text-amber-500 fill-amber-500" />{result.matchScore}% Synergy</div>
                          </div>
                        </div>
                        <div className="md:w-32 shrink-0 flex flex-col gap-2">
                          <Button variant="outline" size="sm" onClick={() => openInGoogleMaps(result.name, result.location)} className="w-full rounded-lg border-teal-100 text-teal-700 text-[9px] font-black"><MapIcon className="size-3" /> Maps</Button>
                          <Button className="w-full rounded-lg h-9 bg-teal-600 hover:bg-teal-700 text-white text-[9px] font-black">Lihat Profil</Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {!loading && !results && (
            <div className="py-20 text-center space-y-6 bg-white rounded-[2rem] border border-dashed border-slate-200">
               <div className="size-20 rounded-full bg-slate-50 flex items-center justify-center mx-auto"><Search className="size-10 text-slate-200" /></div>
               <h3 className="text-xl font-black text-slate-900">Mulai Pencarian Pintar</h3>
               <p className="text-xs text-slate-400 max-w-sm mx-auto font-medium">Batas 30 akses harian untuk menjaga kualitas jaringan OnTapp.</p>
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
