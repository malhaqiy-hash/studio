
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
  LocateFixed,
  Package,
  Headphones,
  Truck,
  Layers,
  Users,
  X,
  Image as ImageIcon,
  Target,
  Briefcase,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { aiIntentSearch, type AIIntentSearchOutput } from "@/ai/flows/ai-intent-search-flow";
import { useLanguage } from "@/context/language-context";
import { useUser } from "@/firebase";
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
  const [results, setResults] = React.useState<AIIntentSearchOutput | null>(null);
  
  const [activeCategory, setActiveCategory] = React.useState<string | null>(null);
  const [activeLocation, setActiveLocation] = React.useState(language === 'id' ? "Pilih Lokasi" : "Choose Location");
  const [isLocationOpen, setIsLocationOpen] = React.useState(false);
  
  const [isSourcePickerOpen, setIsSourcePickerOpen] = React.useState(false);
  
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const cameraInputRef = React.useRef<HTMLInputElement>(null);

  const cleanTitle = (text: string) => text.replace(/^Informasi Terkait:\s*/i, '').trim();

  const categories = React.useMemo(() => {
    if (activeAccount.type === 'bisnis') return [...BASE_CATEGORIES, ...PREMIUM_CATEGORIES];
    if (activeAccount.type === 'professional') return [...BASE_CATEGORIES, PREMIUM_CATEGORIES.find(c => c.id === 'opportunity')!];
    return BASE_CATEGORIES;
  }, [activeAccount.type]);

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
          location: (finalLocation.includes('Lokasi') || finalLocation.includes('Location')) ? undefined : finalLocation
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
      case 'product': return <Package className="size-4 md:size-6" />;
      case 'service': return <Headphones className="size-4 md:size-6" />;
      case 'supplier': return <Truck className="size-4 md:size-6" />;
      case 'professional': return <User className="size-4 md:size-6" />;
      case 'opportunity': return <Briefcase className="size-4 md:size-6" />;
      case 'shop': return <Store className="size-4 md:size-6" />;
      case 'hotel': return <Hotel className="size-4 md:size-6" />;
      default: return <Building2 className="size-4 md:size-6" />;
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto space-y-4 md:space-y-8 py-1 md:py-4">
        <div className="bg-card p-4 md:p-8 rounded-[1.25rem] md:rounded-[2.5rem] border border-border shadow-sm space-y-3 md:space-y-6">
          <form onSubmit={(e) => handleSearch(e)} className="space-y-3 md:space-y-6">
            <div className="relative group w-full">
              <div className="absolute inset-y-0 left-0 pl-4 md:pl-6 flex items-center pointer-events-none">
                <Search className="size-4 md:size-6 text-muted-foreground transition-colors" />
              </div>
              <Input 
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={t('search_placeholder')}
                className="h-11 md:h-16 pl-10 md:pl-16 pr-28 md:pr-48 rounded-xl md:rounded-[1.5rem] border-border bg-muted/20 shadow-inner text-xs md:text-lg font-medium focus:bg-background transition-all focus:border-accent"
              />
              <div className="absolute inset-y-1.5 md:inset-y-3 right-2 md:right-3 flex items-center gap-1 md:gap-2">
                {query && (
                  <button type="button" onClick={() => setQuery("")} className="size-8 md:size-10 flex items-center justify-center rounded-lg md:rounded-xl bg-card text-muted-foreground border border-border shadow-sm transition-all"><X className="size-3.5 md:size-5" /></button>
                )}
                <button type="button" onClick={handleVoiceSearch} className="size-8 md:size-10 flex items-center justify-center rounded-lg md:rounded-xl bg-card text-muted-foreground border border-border shadow-sm transition-all"><Mic className="size-3.5 md:size-5" /></button>
                <button type="button" onClick={() => setIsSourcePickerOpen(true)} className="size-8 md:size-10 flex items-center justify-center rounded-lg md:rounded-xl bg-card text-muted-foreground border border-border shadow-sm transition-all"><Camera className="size-3.5 md:size-5" /></button>
              </div>
            </div>

            <Button type="submit" disabled={loading} className="w-full h-11 md:h-14 rounded-xl md:rounded-2xl bg-accent text-white font-black text-[11px] md:text-sm shadow-lg flex gap-2">
              {loading ? <RefreshCw className="size-4 animate-spin" /> : <><Search className="size-4" /> {t('search_now')}</>}
            </Button>

            <div className="grid grid-cols-2 gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="w-full h-10 md:h-12 justify-between rounded-lg md:rounded-xl border-border bg-card text-foreground font-bold hover:bg-muted/50 px-3 md:px-5 text-[9px] md:text-[11px] uppercase tracking-widest">
                    <div className="flex items-center gap-2"><Filter className="size-3 text-accent" />{activeCategory || "Kategori"}</div>
                    <ChevronDown className="size-3 opacity-30" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-[240px] md:w-[280px] rounded-xl p-1 shadow-2xl bg-card border-border">
                  <DropdownMenuItem onClick={() => setActiveCategory(null)} className="font-black text-muted-foreground p-2 rounded-lg text-[8px] md:text-[10px] uppercase">Semua Kategori</DropdownMenuItem>
                  {categories.map((cat) => (
                    <DropdownMenuItem key={cat.id} onClick={() => setActiveCategory(cat.label)} className="flex items-center gap-3 py-2 rounded-lg font-bold cursor-pointer hover:bg-muted text-xs">
                      <div className="size-7 bg-muted rounded-md flex items-center justify-center text-muted-foreground shrink-0"><cat.icon className="size-3.5" /></div>{cat.label}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              <Popover open={isLocationOpen} onOpenChange={setIsLocationOpen}>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full h-10 md:h-12 justify-between rounded-lg md:rounded-xl border-border bg-card text-foreground font-bold hover:bg-muted/50 px-3 md:px-5 text-[9px] md:text-[11px] uppercase tracking-widest">
                    <div className="flex items-center gap-2"><MapPin className="size-3 text-rose-500" />{activeLocation}</div>
                    <ChevronDown className="size-3 opacity-30" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent align="center" className="w-[240px] md:w-[280px] rounded-xl p-2 shadow-2xl bg-card border-border space-y-2">
                  <Button variant="outline" onClick={() => { setIsLocationOpen(false); setActiveLocation("Lokasi GPS"); handleSearch(undefined, query, activeCategory, "Lokasi GPS"); }} className="w-full h-10 rounded-lg border-accent/20 bg-accent/5 text-accent font-black text-[10px] gap-2">
                    <LocateFixed className="size-4" /> {t('nearby')}
                  </Button>
                  <div className="space-y-1 max-h-[160px] overflow-y-auto no-scrollbar">
                    {POPULAR_LOCATIONS.map((loc) => (
                      <button key={loc} type="button" onClick={() => { setActiveLocation(loc); setIsLocationOpen(false); }} className="w-full text-left px-3 py-2 rounded-lg text-[10px] font-black uppercase hover:bg-muted transition-colors">{loc}</button>
                    ))}
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          </form>
        </div>

        {results && (
          <div className="space-y-3 md:space-y-6">
            <div className="flex items-center justify-between px-1">
              <div className="flex items-center gap-2"><h3 className="font-black text-foreground text-sm md:text-lg tracking-tight">{t('results')}</h3><Badge className="bg-accent/10 text-accent font-black px-2 py-0.5 rounded-lg text-[9px] border-none shadow-sm">{results.results.length}</Badge></div>
            </div>
            <div className="grid gap-3 md:gap-5">
              {results.results.map((result, idx) => (
                <Card key={idx} className="rounded-xl md:rounded-[2rem] border border-border shadow-sm bg-card overflow-hidden hover:shadow-lg transition-all duration-300">
                  <CardContent className="p-0 flex flex-col md:flex-row">
                    <div className={cn("w-full md:w-1.5 h-1 md:h-auto shrink-0 transition-colors", result.source.includes('ontapp') ? 'bg-accent' : 'bg-amber-400')} />
                    <div className="p-4 md:p-8 flex-1 flex flex-col md:flex-row gap-4 md:gap-8 items-start">
                      <div className="size-10 md:size-16 rounded-lg md:rounded-[1.25rem] bg-muted text-foreground flex items-center justify-center shrink-0 shadow-inner">{getTypeIcon(result.type)}</div>
                      <div className="flex-1 space-y-1 md:space-y-3">
                        <div className="flex flex-wrap items-center gap-2">
                          <h4 className="text-sm md:text-xl font-black text-slate-900">{cleanTitle(result.name)}</h4>
                          <Badge className={cn("text-[7px] md:text-[9px] font-black uppercase tracking-widest rounded-full px-1.5 py-0 md:px-3 md:py-1 border-none", result.source === 'external' ? 'bg-amber-500/10 text-amber-500' : 'bg-accent/10 text-accent')}>
                            {result.source === 'external' ? 'Eksternal' : 'Verified'}
                          </Badge>
                        </div>
                        <p className="text-slate-500 font-medium text-[10px] md:text-sm leading-tight md:leading-relaxed line-clamp-2 md:line-clamp-none">{result.description}</p>
                        <div className="flex items-center gap-3 md:gap-6 text-[7px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest">
                          {result.location && <div className="flex items-center gap-1"><MapPin className="size-2.5 md:size-3.5 text-rose-400" />{result.location}</div>}
                          <div className="flex items-center gap-1 text-accent"><Target className="size-2.5 md:size-3.5" />{result.matchScore}% Synergy</div>
                        </div>
                      </div>
                      <div className="w-full md:w-32 shrink-0 flex gap-2 md:flex-col pt-1 md:pt-0">
                        <Button variant="outline" size="sm" onClick={() => window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(result.name + ' ' + (result.location || ''))}`, '_blank')} className="flex-1 md:w-full rounded-lg border-accent/20 text-accent text-[8px] md:text-[10px] font-black uppercase h-8 md:h-10 tracking-widest">Maps</Button>
                        <Button className="flex-1 md:w-full rounded-lg h-8 md:h-11 bg-accent text-white text-[8px] md:text-[10px] font-black uppercase tracking-widest shadow-lg shadow-accent/10">{t('view_profile')}</Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {!loading && !results && (
          <div className="py-12 md:py-24 text-center space-y-4 md:space-y-8 bg-card rounded-2xl md:rounded-[3rem] border-2 border-dashed border-border/50">
             <div className="size-12 md:size-24 rounded-xl md:rounded-[2rem] bg-muted flex items-center justify-center mx-auto shadow-inner"><Search className="size-6 md:size-12 text-muted-foreground/20" /></div>
             <div className="space-y-1 px-4">
               <h3 className="text-sm md:text-2xl font-black text-slate-900 tracking-tight">{t('start_search')}</h3>
               <p className="text-[9px] md:text-sm text-slate-500 max-w-xs mx-auto font-medium">{t('daily_limit_msg')}</p>
             </div>
          </div>
        )}
      </div>

      <Dialog open={isSourcePickerOpen} onOpenChange={setIsSourcePickerOpen}>
        <DialogContent className="max-w-[280px] rounded-[1.5rem] bg-card text-foreground p-6 border-none shadow-2xl overflow-hidden outline-none">
          <div className="space-y-6">
            <div className="space-y-1">
              <h2 className="text-base font-black tracking-tight text-center">Cari Visual</h2>
              <p className="text-[8px] text-center text-muted-foreground font-medium uppercase tracking-widest">Sintesis Objek AI</p>
            </div>
            <div className="space-y-4">
              <button onClick={() => cameraInputRef.current?.click()} className="w-full flex items-center gap-4 group text-left active:scale-95 transition-transform">
                <div className="size-10 rounded-xl bg-muted flex items-center justify-center shadow-inner group-hover:bg-accent/10 group-hover:text-accent transition-colors"><Camera className="size-5" /></div>
                <div className="flex flex-col"><span className="font-black text-sm leading-none">Ambil Foto</span><span className="text-[7px] font-bold text-muted-foreground uppercase tracking-widest mt-1">Kamera</span></div>
              </button>
              <button onClick={() => fileInputRef.current?.click()} className="w-full flex items-center gap-4 group text-left active:scale-95 transition-transform">
                <div className="size-10 rounded-xl bg-muted flex items-center justify-center shadow-inner group-hover:bg-accent/10 group-hover:text-accent transition-colors"><ImageIcon className="size-5" /></div>
                <div className="flex flex-col"><span className="font-black text-sm leading-none">Galeri Media</span><span className="text-[7px] font-bold text-muted-foreground uppercase tracking-widest mt-1">Lokal</span></div>
              </button>
            </div>
            <button onClick={() => setIsSourcePickerOpen(false)} className="w-full text-center text-[9px] font-black uppercase tracking-widest text-muted-foreground hover:text-rose-500 transition-colors">Batal</button>
          </div>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
