"use client";

import * as React from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  MapPin, 
  Building2, 
  ShieldCheck,
  Package,
  History,
  Trash2,
  Search,
  Map as MapIcon
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/context/language-context";
import { useAccount } from "@/context/account-context";

export default function DiscoveryHistoryPage() {
  const { toast } = useToast();
  const { language, t } = useLanguage();
  const { activeAccount } = useAccount();
  const [history, setHistory] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);

  const getHistoryKey = React.useCallback(() => `ontapp_discovery_history_${activeAccount.id}`, [activeAccount.id]);

  React.useEffect(() => {
    const storageKey = getHistoryKey();
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      setHistory(JSON.parse(saved));
    } else {
      setHistory([]);
    }
    setLoading(false);
  }, [activeAccount.id, getHistoryKey]);

  const handleClearHistory = () => {
    localStorage.removeItem(getHistoryKey());
    setHistory([]);
    toast({ title: language === 'id' ? "Riwayat Dihapus" : "History Cleared" });
  };

  const handleRemoveItem = (id: string) => {
    const storageKey = getHistoryKey();
    const updated = history.filter(item => item.id !== id);
    setHistory(updated);
    localStorage.setItem(storageKey, JSON.stringify(updated));
  };

  const openInGoogleMaps = (name: string, location?: string) => {
    const searchQuery = encodeURIComponent(`${name} ${location || ''}`);
    window.open(`https://www.google.com/maps/search/?api=1&query=${searchQuery}`, '_blank');
  };

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto space-y-10 py-6">
        <header className="space-y-4">
          <div className="flex items-center gap-2 bg-teal-50 text-accent px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest w-fit border border-teal-100">
             <History className="size-3" />
             {t('ai_backup')}
          </div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">{language === 'id' ? 'Penemuan Anda' : 'Your Discoveries'}</h1>
          <p className="text-slate-500 font-medium text-lg max-w-2xl">
            {t('ai_backup_desc')}
          </p>
        </header>

        {history.length > 0 ? (
          <div className="grid gap-6">
            <div className="flex items-center justify-between px-2">
               <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400">Total {history.length} {language === 'id' ? 'Penemuan' : 'Items'}</h3>
               <Button onClick={handleClearHistory} variant="ghost" size="sm" className="text-[10px] font-black uppercase text-rose-500 hover:bg-rose-50">
                 {language === 'id' ? 'Bersihkan Semua' : 'Clear All'}
               </Button>
            </div>

            <div className="grid gap-4">
              {history.map((item) => (
                <Card key={item.id} className="group rounded-[2rem] border-slate-100 shadow-sm hover:shadow-xl transition-all overflow-hidden bg-white">
                  <CardContent className="p-0">
                    <div className="flex flex-col md:flex-row">
                      <div className={cn(
                        "w-1.5 shrink-0 transition-colors",
                        item.source === 'ontapp_verified' ? 'bg-emerald-500' : 
                        item.source === 'ontapp_member' ? 'bg-accent' : 'bg-slate-200'
                      )} />
                      <div className="p-8 flex-1 flex flex-col md:flex-row gap-8 items-center">
                        <div className={cn(
                          "size-14 rounded-2xl flex items-center justify-center shrink-0 shadow-inner group-hover:rotate-6 transition-transform",
                          item.source === 'external' ? "bg-slate-50 text-slate-400" : "bg-teal-50 text-accent"
                        )}>
                          {item.type === 'supplier' ? <Package size={24} /> : <Building2 size={24} />}
                        </div>
                        
                        <div className="flex-1 space-y-2 text-center md:text-left">
                          <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
                            <h4 className="text-xl font-black text-slate-900 leading-none">{item.name}</h4>
                            {item.source === 'ontapp_verified' && <ShieldCheck className="size-4 text-emerald-500 fill-emerald-50" />}
                          </div>
                          <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                            <button 
                              onClick={() => openInGoogleMaps(item.name, item.location)}
                              className="flex items-center gap-1 hover:text-rose-500 transition-colors"
                            >
                              <MapPin className="size-3" /> {item.location || 'Global'}
                            </button>
                            <div className="size-1 bg-slate-200 rounded-full" />
                            <div>{item.industry || item.type}</div>
                          </div>
                        </div>

                        <div className="flex items-center gap-8">
                           <div className="text-center">
                              <div className="text-2xl font-black text-teal-600 leading-none">{item.matchScore}%</div>
                              <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mt-1">Sinergi</p>
                           </div>
                           <div className="hidden sm:block text-right">
                              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{item.date}</p>
                              <p className="text-[8px] font-bold text-slate-300 italic">Auto-Backup</p>
                           </div>
                        </div>

                        <div className="flex gap-2 w-full md:w-auto">
                           <Button 
                             onClick={() => openInGoogleMaps(item.name, item.location)}
                             variant="outline"
                             className="flex-1 md:flex-none rounded-xl border-rose-100 text-rose-600 font-black text-[10px] uppercase h-10 px-4 gap-2"
                           >
                             <MapIcon className="size-3.5" />
                             Maps
                           </Button>
                           <Button onClick={() => window.location.href = '/cari'} className="flex-1 md:flex-none rounded-xl bg-slate-900 text-white font-black text-[10px] uppercase h-10 px-6">
                             {language === 'id' ? 'Cek Lagi' : 'Check Again'}
                           </Button>
                           <Button variant="ghost" size="icon" onClick={() => handleRemoveItem(item.id)} className="size-10 rounded-xl border border-slate-100 text-slate-300 hover:text-rose-500">
                             <Trash2 size={16} />
                           </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ) : (
          <div className="py-24 text-center space-y-6 bg-slate-50/50 rounded-[4rem] border-2 border-dashed border-slate-200">
             <div className="size-24 rounded-full bg-white flex items-center justify-center mx-auto shadow-xl">
                <Search className="size-10 text-slate-200" />
             </div>
             <div className="space-y-2">
                <h3 className="text-2xl font-black text-slate-900">{language === 'id' ? 'Belum Ada Backup' : 'No Backup Found'}</h3>
                <p className="text-slate-400 max-w-xs mx-auto font-medium">
                  {language === 'id' ? 'Mulai mencari mitra di halaman Cari AI untuk melihat riwayat penemuan Anda di sini secara otomatis.' : 'Start searching for partners on the AI Search page to see your history here.'}
                </p>
             </div>
             <Button onClick={() => window.location.href = '/cari'} className="rounded-2xl bg-accent px-10 h-14 font-black shadow-lg shadow-accent/20">
                {t('search_now')}
             </Button>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
