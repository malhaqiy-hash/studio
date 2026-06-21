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

  const handleVoiceSearch = () => {
    if (!('webkitSpeechRecognition' in window)) {
      toast({ variant: "destructive", title: "Browser Tidak Mendukung" });
      return;
    }
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
      case 'product': return <Package className="size-4 md:size-5" />;
      case 'service': return <Headphones className="size-4 md:size-5" />;
      case 'supplier': return <Truck className="size-4 md:size-5" />;
      case 'professional': return <User className="size-4 md:size-5" />;
      case 'opportunity': return <Briefcase className="size-4 md:size-5" />;
      case 'shop': return <Store className="size-4 md:size-5" />;
      case 'hotel': return <Hotel className="size-4 md:size-5" />;
      default: return <Building2 className="size-4 md:size-5" />;
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-6 md:space-y-8 py-2">
        <div className="bg-card p-5 md:p-8 rounded-[1.5rem] md:rounded-[2.5rem] border border-border shadow-sm space-y-4 md:space-y-6">
          <form onSubmit={(e) => handleSearch(e)} className="space-y-4 md:space-y-6">
            <div className="relative group w-full">
              <div className="absolute inset-y-0 left-0 pl-4 md:pl-6 flex items-center pointer-events-none">
                <Search className="size-5 md:size-6 text-muted-foreground group-focus-within:text-accent transition-colors" />
              </div>
              <Input 
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={t('search_placeholder')}
                className="h-14 md:h-20 pl-12 md:pl-16 pr-32 md:pr-52 rounded-[1.25rem] md:rounded-[1.5rem] border-border bg-muted/20 shadow-inner text-sm md:text-lg font-medium focus:bg-background transition-all focus:border-accent"
              />
              <div className="absolute inset-y-2 md:inset-y-4 right-2 md:right-4 flex items-center gap-1.5 md:gap-2">
                {query && (
                  <button type="button" onClick={() => setQuery("")} className="size-10 md:size-12 flex items-center justify-center rounded-xl md:rounded-2xl bg-card text-muted-foreground hover:text-rose-500 border border-border shadow-sm transition-all"><X className="size-4 md:size-5" /></button>
                )}
                <button type="button" onClick={handleVoiceSearch} className="size-10 md:size-12 flex items-center justify-center rounded-xl md:rounded-2xl bg-card text-muted-foreground hover:text-accent border border-border shadow-sm transition-all"><Mic className="size-4 md:size-5" /></button>
                <button type="button" onClick={() => setIsSourcePickerOpen(true)} className="size-10 md:size-12 flex items-center justify-center rounded-xl md:rounded-2xl bg-card text-muted-foreground hover:text-accent border border-border shadow-sm transition-all"><Camera className="size-4 md:size-5" /></button>
              </div>
              <input type="file" ref={fileInputRef} onChange={(e) => { if(e.target.files?.[0]) handleSearch(undefined, "Analisis Gambar"); }} className="hidden" accept="image/*" />
            </div>

            <Button type="submit" disabled={loading} className="w-full h-12 md:h-14 rounded-xl md:rounded-2xl bg-accent text-accent-foreground font-black text-xs md:text-sm shadow-xl transition-all flex gap-3">
              {loading ? <RefreshCw className="size-4 md:size-5 animate-spin" /> : <><Search className="size-4 md:size-5" /> {t('search_now')}</>}
            </Button>

            <div className="grid grid-cols-2 gap-2 md:gap-3">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="w-full h-11 md:h-14 justify-between rounded-xl md:rounded-2xl border-border bg-card text-foreground font-black hover:bg-muted/50 px-4 md:px-6 text-[9px] md:text-[11px] uppercase tracking-widest">
                    <div className="flex items-center gap-2 md:gap-3"><Filter className="size-3.5 md:size-4 text-accent" />{activeCategory || "Kategori"}</div>
                    <ChevronDown className="size-3.5 md:size-4 opacity-30" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-[260px] md:w-[300px] rounded-[1.25rem] md:rounded-[1.5rem] p-2 shadow-2xl bg-card border-border">
                  <DropdownMenuItem onClick={() => setActiveCategory(null)} className="font-black text-muted-foreground p-3 rounded-xl text-[9px] md:text-[10px] uppercase">Semua Kategori</DropdownMenuItem>
                  {categories.map((cat) => (
                    <DropdownMenuItem key={cat.id} onClick={() => setActiveCategory(cat.label)} className="flex items-center gap-3 md:gap-4 py-2.5 md:py-3 rounded-xl font-bold cursor-pointer hover:bg-muted text-xs md:text-sm text-foreground">
                      <div className="size-8 md:size-9 bg-muted rounded-lg md:rounded-xl flex items-center justify-center text-muted-foreground shrink-0"><cat.icon className="size-3.5 md:size-4" /></div>{cat.label}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              <Popover open={isLocationOpen} onOpenChange={setIsLocationOpen}>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full h-11 md:h-14 justify-between rounded-xl md:rounded-2xl border-border bg-card text-foreground font-black hover:bg-muted/50 px-4 md:px-6 text-[9px] md:text-[11px] uppercase tracking-widest">
                    <div className="flex items-center gap-2 md:gap-3"><MapPin className="size-3.5 md:size-4 text-rose-500" />{activeLocation}</div>
                    <ChevronDown className="size-3.5 md:size-4 opacity-30" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent align="center" className="w-[260px] md:w-[300px] rounded-[1.25rem] md:rounded-[1.5rem] p-3 md:p-4 shadow-2xl bg-card border-border space-y-3 md:space-y-4">
                  <Button variant="outline" onClick={() => { setIsLocationOpen(false); setActiveLocation("Lokasi GPS"); handleSearch(undefined, query, activeCategory, "Lokasi GPS"); }} className="w-full h-10 md:h-12 rounded-lg md:rounded-xl border-accent/20 bg-accent/5 text-accent font-black text-[10px] md:text-xs gap-3">
                    <LocateFixed className="size-4 md:size-5" /> {t('nearby')}
                  </Button>
                  <div className="space-y-1 max-h-[180px] md:max-h-[220px] overflow-y-auto no-scrollbar">
                    {POPULAR_LOCATIONS.map((loc) => (
                      <button key={loc} type="button" onClick={() => { setActiveLocation(loc); setIsLocationOpen(false); }} className="w-full text-left px-3 md:px-4 py-2 md:py-3 rounded-lg md:rounded-xl text-[10px] md:text-xs font-black uppercase hover:bg-muted transition-colors">{loc}</button>
                    ))}
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          </form>
        </div>

        {results && (
          <div className="space-y-4 md:space-y-6">
            <div className="flex items-center justify-between px-1">
              <div className="flex items-center gap-2 md:gap-3"><h3 className="font-black text-foreground text-base md:text-lg tracking-tight">{t('results')}</h3><Badge className="bg-accent/10 text-accent font-black px-2 py-0.5 md:px-3 md:py-1 rounded-lg text-[10px] md:text-xs border-none shadow-sm">{results.results.length}</Badge></div>
            </div>
            <div className="grid gap-4 md:gap-5">
              {results.results.map((result, idx) => (
                <Card key={idx} className="rounded-[1.5rem] md:rounded-[2rem] border border-border shadow-sm bg-card overflow-hidden hover:shadow-xl transition-all duration-300">
                  <CardContent className="p-0 flex flex-col md:flex-row">
                    <div className={cn("w-full md:w-1.5 h-1 md:h-auto shrink-0 transition-colors", result.source.includes('ontapp') ? 'bg-accent' : 'bg-amber-400')} />
                    <div className="p-5 md:p-8 flex-1 flex flex-col md:flex-row gap-5 md:gap-8 items-start">
                      <div className="size-12 md:size-16 rounded-xl md:rounded-[1.25rem] bg-muted text-foreground flex items-center justify-center shrink-0 shadow-inner">{getTypeIcon(result.type)}</div>
                      <div className="flex-1 space-y-2 md:space-y-3">
                        <div className="flex flex-wrap items-center gap-2 md:gap-3">
                          <h4 className="text-lg md:text-xl font-black text-slate-900">{cleanTitle(result.name)}</h4>
                          <Badge className={cn("text-[8px] md:text-[9px] font-black uppercase tracking-widest rounded-full px-2 py-0.5 md:px-3 md:py-1 border-none", result.source === 'external' ? 'bg-amber-500/10 text-amber-500' : 'bg-accent/10 text-accent')}>
                            {result.source === 'external' ? 'Eksternal' : 'Verified'}
                          </Badge>
                        </div>
                        <p className="text-slate-500 font-medium text-xs md:text-sm leading-relaxed">{result.description}</p>
                        <div className="flex items-center gap-4 md:gap-6 text-[8px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest">
                          {result.location && <div className="flex items-center gap-1.5"><MapPin className="size-3 md:size-3.5 text-rose-400" />{result.location}</div>}
                          <div className="flex items-center gap-1.5 text-accent"><Target className="size-3 md:size-3.5" />{result.matchScore}% Synergy</div>
                        </div>
                      </div>
                      <div className="w-full md:w-36 shrink-0 flex flex-col gap-2 md:gap-3 pt-2 md:pt-0">
                        <Button variant="outline" size="sm" onClick={() => window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(result.name + ' ' + (result.location || ''))}`, '_blank')} className="w-full rounded-lg md:rounded-xl border-accent/20 text-accent text-[9px] md:text-[10px] font-black uppercase h-9 md:h-10 tracking-widest">Maps</Button>
                        <Button className="w-full rounded-lg md:rounded-xl h-10 md:h-11 bg-accent hover:bg-accent/90 text-accent-foreground text-[9px] md:text-[10px] font-black uppercase tracking-widest shadow-lg shadow-accent/10">{t('view_profile')}</Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {!loading && !results && history.length === 0 && (
          <div className="py-16 md:py-24 text-center space-y-6 md:space-y-8 bg-card rounded-[2rem] md:rounded-[3rem] border-2 border-dashed border-border/50">
             <div className="size-16 md:size-24 rounded-[1.5rem] md:rounded-[2rem] bg-muted flex items-center justify-center mx-auto shadow-inner"><Search className="size-8 md:size-12 text-muted-foreground/20" /></div>
             <div className="space-y-1.5 md:space-y-2 px-6">
               <h3 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight">{t('start_search')}</h3>
               <p className="text-xs md:text-sm text-slate-500 max-w-sm mx-auto font-medium">{t('daily_limit_msg')}</p>
             </div>
          </div>
        )}
      </div>

      <Dialog open={isSourcePickerOpen} onOpenChange={setIsSourcePickerOpen}>
        <DialogContent className="max-w-[320px] rounded-[2rem] md:rounded-[3rem] bg-card text-foreground p-8 md:p-10 border-none shadow-2xl overflow-hidden outline-none animate-in zoom-in-95 duration-200">
          <div className="space-y-8 md:space-y-10">
            <div className="space-y-1.5 md:space-y-2">
              <h2 className="text-xl md:text-2xl font-black tracking-tight text-center">Cari Visual</h2>
              <p className="text-[9px] md:text-[10px] text-center text-muted-foreground font-medium uppercase tracking-widest">Sintesis Objek AI</p>
            </div>
            <div className="space-y-5 md:space-y-6">
              <button onClick={() => cameraInputRef.current?.click()} className="w-full flex items-center gap-5 md:gap-6 group text-left active:scale-95 transition-transform">
                <div className="size-11 md:size-14 rounded-xl md:rounded-2xl bg-muted flex items-center justify-center shadow-inner group-hover:bg-accent/10 group-hover:text-accent transition-colors"><Camera className="size-5 md:size-7" /></div>
                <div className="flex flex-col"><span className="font-black text-sm md:text-[16px] leading-none">Ambil Foto</span><span className="text-[8px] md:text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-1">Kamera</span></div>
              </button>
              <button onClick={() => fileInputRef.current?.click()} className="w-full flex items-center gap-5 md:gap-6 group text-left active:scale-95 transition-transform">
                <div className="size-11 md:size-14 rounded-xl md:rounded-2xl bg-muted flex items-center justify-center shadow-inner group-hover:bg-accent/10 group-hover:text-accent transition-colors"><ImageIcon className="size-5 md:size-7" /></div>
                <div className="flex flex-col"><span className="font-black text-sm md:text-[16px] leading-none">Galeri Media</span><span className="text-[8px] md:text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-1">Lokal</span></div>
              </button>
            </div>
            <button onClick={() => setIsSourcePickerOpen(false)} className="w-full text-center text-[10px] md:text-xs font-black uppercase tracking-widest text-muted-foreground hover:text-rose-500 transition-colors">Batal</button>
          </div>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}