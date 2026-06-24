"use client";

import * as React from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Filter, 
  Plus, 
  Search, 
  Trash2, 
  Edit2, 
  Phone, 
  Globe, 
  RefreshCw
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useCollection, useFirestore } from "@/firebase";
import { collection, query, orderBy, addDoc, updateDoc, deleteDoc, doc } from "firebase/firestore";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { translateText } from "@/ai/flows/translate-flow";
import { useLanguage } from "@/context/language-context";
import { cn } from "@/lib/utils";

const CATEGORIES = [
  "Profesional/Pribadi",
  "Toko",
  "Perusahaan",
  "Saluran",
  "Komunitas",
  "Acara",
  "Peluang Bisnis",
  "Peluang Kerja",
  "Produk",
  "Pemasok",
  "Distributor",
  "Layanan/Jasa",
  "Transportasi",
  "Penginapan",
  "Lainnya"
];
const STATUSES = ["Lead", "Proposal", "Negotiation", "Won", "Lost"];

export default function OpportunitiesPage() {
  const { language, t } = useLanguage();
  const db = useFirestore();
  const [searchTerm, setSearchTerm] = React.useState("");
  const [categoryFilter, setCategoryFilter] = React.useState("All");
  
  const [translationsMap, setTranslationsMap] = React.useState<Record<string, { description: string, show: boolean, loading: boolean }>>({});
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [currentOpp, setCurrentOpp] = React.useState<any>(null);
  const [formData, setFormData] = React.useState({
    companyName: "",
    category: "Lainnya",
    value: 0,
    status: "Lead",
    whatsapp: "",
    date: "",
    description: ""
  });

  const opportunitiesQuery = React.useMemo(() => {
    if (!db) return null;
    return query(collection(db, "opportunities"), orderBy("companyName", "asc"));
  }, [db]);

  const { data: opportunities, loading: isLoading } = useCollection(opportunitiesQuery);

  const filteredOpportunities = React.useMemo(() => {
    return (opportunities || []).filter(opp => {
      const matchesSearch = opp.companyName?.toLowerCase().includes(searchTerm.toLowerCase()) || opp.whatsapp?.includes(searchTerm);
      const matchesCategory = categoryFilter === "All" || opp.category === categoryFilter;
      return matchesSearch && matchesCategory;
    });
  }, [opportunities, searchTerm, categoryFilter]);

  const handleTranslateOpp = async (oppId: string, content: string) => {
    if (translationsMap[oppId]?.description) {
      setTranslationsMap(prev => ({ ...prev, [oppId]: { ...prev[oppId], show: !prev[oppId].show } }));
      return;
    }
    setTranslationsMap(prev => ({ ...prev, [oppId]: { description: "", show: false, loading: true } }));
    try {
      const { translatedText } = await translateText({ text: content, targetLanguage: language });
      setTranslationsMap(prev => ({ ...prev, [oppId]: { description: translatedText, show: true, loading: false } }));
    } catch (err) {
      setTranslationsMap(prev => ({ ...prev, [oppId]: { description: "", show: false, loading: false } }));
    }
  };

  const handleOpenAdd = () => {
    setCurrentOpp(null);
    setFormData({ companyName: "", category: "Lainnya", value: 0, status: "Lead", whatsapp: "", date: "", description: "" });
    setIsDialogOpen(true);
  };

  const handleOpenEdit = (opp: any) => {
    setCurrentOpp(opp);
    setFormData({ 
      companyName: opp.companyName || "", 
      category: opp.category || "Lainnya", 
      value: opp.value || 0, 
      status: opp.status || "Lead", 
      whatsapp: opp.whatsapp || "", 
      date: opp.date || "", 
      description: opp.description || "" 
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = () => {
    if (!db) return;
    if (currentOpp) {
      updateDoc(doc(db, "opportunities", currentOpp.id), formData);
    } else {
      addDoc(collection(db, "opportunities"), formData);
    }
    setIsDialogOpen(false);
  };

  const handleDelete = (oppId: string) => {
    if (!db) return;
    deleteDoc(doc(db, "opportunities", oppId));
  };

  return (
    <DashboardLayout>
      <div className="max-w-xl mx-auto space-y-4 py-2 px-1">
        <header className="flex items-center justify-between gap-4">
          <div className="space-y-0.5">
            <h1 className="text-xl font-black text-slate-900 tracking-tight leading-none">{t('opportunities')}</h1>
            <p className="text-slate-500 font-medium text-[11px] leading-snug">{t('opportunities_desc')}</p>
          </div>
          <Button size="sm" onClick={handleOpenAdd} className="rounded-lg bg-accent hover:bg-indigo-600 text-white h-8 px-3 font-black shadow-lg flex gap-1.5 text-[9px] uppercase tracking-widest active:scale-95 transition-all">
            <Plus className="size-3" /> {t('add_opp')}
          </Button>
        </header>

        <div className="grid grid-cols-12 gap-2">
          <div className="col-span-7 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-slate-400" />
            <Input 
              placeholder={t('search_placeholder')} 
              value={searchTerm} 
              onChange={(e) => setSearchTerm(e.target.value)} 
              className="pl-9 h-10 bg-white border-slate-100 rounded-xl text-[13px] font-medium shadow-sm" 
            />
          </div>
          <div className="col-span-5">
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="h-10 bg-white border-slate-100 rounded-xl font-bold text-[11px] shadow-sm px-2.5">
                <div className="flex items-center gap-1.5 min-w-0">
                  <Filter className="size-3 shrink-0 text-primary/60" />
                  <div className="truncate">
                    <SelectValue placeholder="Kategori" />
                  </div>
                </div>
              </SelectTrigger>
              <SelectContent className="rounded-xl shadow-xl max-h-[350px] overflow-y-auto no-scrollbar">
                <SelectItem value="All" className="font-bold text-primary">Semua Kategori</SelectItem>
                {CATEGORIES.map(cat => (
                  <SelectItem key={cat} value={cat} className="font-medium text-[12px]">{cat}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <Table>
            <TableHeader className="bg-slate-50/30">
              <TableRow className="border-slate-100 h-10">
                <TableHead className="py-2 font-black text-slate-400 uppercase tracking-widest text-[8px] px-4">Opportunity</TableHead>
                <TableHead className="py-2 font-black text-slate-400 uppercase tracking-widest text-[8px]">Value</TableHead>
                <TableHead className="text-right py-2 font-black text-slate-400 uppercase tracking-widest text-[8px] px-4">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                [1, 2].map((i) => (
                  <TableRow key={i}>
                    <TableCell className="py-4 px-4"><Skeleton className="h-8 w-32 rounded-lg" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                    <TableCell className="text-right px-4"><Skeleton className="h-8 w-16 ml-auto" /></TableCell>
                  </TableRow>
                ))
              ) : filteredOpportunities.length > 0 ? (
                filteredOpportunities.map((opp) => (
                  <TableRow key={opp.id} className="border-slate-50 group">
                    <TableCell className="py-4 px-4">
                      <div className="flex flex-col min-w-0">
                        <span className="font-black text-slate-900 text-[13px] group-hover:text-accent transition-colors truncate">{opp.companyName}</span>
                        <div className="flex items-center gap-2 mt-0.5">
                          <Badge variant="secondary" className="text-[7px] px-1.5 h-3.5 font-black uppercase bg-slate-50 text-slate-400 border-none">{opp.status}</Badge>
                          {opp.whatsapp && <span className="text-[9px] text-slate-400 flex items-center gap-1"><Phone className="size-2" /> {opp.whatsapp}</span>}
                        </div>
                        {opp.description && (
                          <div className="mt-1.5 flex gap-2 items-start">
                            <button 
                              onClick={() => handleTranslateOpp(opp.id, opp.description)} 
                              className={cn("size-5 rounded-lg bg-slate-50 flex items-center justify-center shrink-0 shadow-inner", translationsMap[opp.id]?.show ? "text-accent" : "text-slate-300 hover:text-accent")}
                            >
                              {translationsMap[opp.id]?.loading ? <RefreshCw className="size-2.5 animate-spin" /> : <Globe className="size-2.5" />}
                            </button>
                            <p className="text-[10px] text-slate-500 font-medium leading-relaxed italic line-clamp-1">
                              {translationsMap[opp.id]?.show ? translationsMap[opp.id].description : opp.description}
                            </p>
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="font-black text-slate-700 text-[11px]">${Number(opp.value || 0).toLocaleString()}</TableCell>
                    <TableCell className="text-right px-4">
                      <div className="flex items-center justify-end gap-1">
                        <Button variant="ghost" size="icon" onClick={() => handleOpenEdit(opp)} className="size-8 rounded-lg text-slate-300 hover:text-accent hover:bg-accent/5"><Edit2 className="size-3" /></Button>
                        <button onClick={() => handleDelete(opp.id)} className="size-8 rounded-lg text-slate-300 hover:text-rose-500 hover:bg-rose-50 flex items-center justify-center transition-all">
                          <Trash2 className="size-3" />
                        </button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={3} className="py-20 text-center">
                    <div className="flex flex-col items-center gap-2 opacity-30">
                       <Search className="size-10" />
                       <p className="text-[10px] font-black uppercase tracking-widest">Tidak ada peluang ditemukan</p>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-[340px] rounded-2xl p-6 bg-card text-foreground outline-none shadow-2xl">
          <DialogHeader>
            <DialogTitle className="text-base font-black uppercase tracking-tight">{currentOpp ? "Edit Peluang" : "Peluang Baru"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label className="text-[9px] font-black uppercase tracking-widest text-slate-400 ml-1">Nama Perusahaan</Label>
              <Input 
                value={formData.companyName} 
                onChange={(e) => setFormData({...formData, companyName: e.target.value})} 
                className="rounded-xl h-9 bg-muted/20 border-none font-bold px-3 text-[12px]" 
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-[9px] font-black uppercase tracking-widest text-slate-400 ml-1">Nilai ($)</Label>
                <Input 
                  type="number" 
                  value={formData.value} 
                  onChange={(e) => setFormData({...formData, value: Number(e.target.value)})} 
                  className="rounded-xl h-9 bg-muted/20 border-none font-bold px-3 text-[12px]" 
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-[9px] font-black uppercase tracking-widest text-slate-400 ml-1">Status</Label>
                <Select value={formData.status} onValueChange={(v) => setFormData({...formData, status: v})}>
                  <SelectTrigger className="rounded-xl h-9 bg-muted/20 border-none font-bold text-[11px] px-3 shadow-inner"><SelectValue /></SelectTrigger>
                  <SelectContent className="rounded-xl shadow-xl">
                    {STATUSES.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-1.5">
              <Label className="text-[9px] font-black uppercase tracking-widest text-slate-400 ml-1">Kategori</Label>
              <Select value={formData.category} onValueChange={(v) => setFormData({...formData, category: v})}>
                <SelectTrigger className="rounded-xl h-9 bg-muted/20 border-none font-bold text-[11px] px-3 shadow-inner"><SelectValue /></SelectTrigger>
                <SelectContent className="rounded-xl shadow-xl max-h-[250px] overflow-y-auto no-scrollbar">
                  {CATEGORIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-[9px] font-black uppercase tracking-widest text-slate-400 ml-1">WhatsApp (Opsional)</Label>
              <Input 
                value={formData.whatsapp} 
                onChange={(e) => setFormData({...formData, whatsapp: e.target.value})} 
                placeholder="+62..."
                className="rounded-xl h-9 bg-muted/20 border-none font-bold px-3 text-[12px]" 
              />
            </div>
          </div>
          <DialogFooter className="mt-4">
            <Button onClick={handleSubmit} className="w-full h-10 bg-accent font-black rounded-xl text-[10px] uppercase tracking-widest shadow-lg shadow-accent/20">
              Simpan Peluang
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
