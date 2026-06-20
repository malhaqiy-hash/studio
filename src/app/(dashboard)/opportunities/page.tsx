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
  RefreshCw, 
  Sparkles 
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useCollection, useFirestore } from "@/firebase";
import { collection, query, orderBy, addDoc, updateDoc, deleteDoc, doc } from "firebase/firestore";
import {
  Dialog,
  DialogContent,
  DialogDescription,
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
import { Textarea } from "@/components/ui/textarea";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { translateText } from "@/ai/flows/translate-flow";
import { useLanguage } from "@/context/language-context";

const CATEGORIES = ["Retail", "Service", "Tech", "F&B", "Others"];
const STATUSES = ["Lead", "Proposal", "Negotiation", "Won", "Lost"];

export default function OpportunitiesPage() {
  const { language, t } = useLanguage();
  const db = useFirestore();
  const [searchTerm, setSearchTerm] = React.useState("");
  const [categoryFilter, setCategoryFilter] = React.useState("All");
  
  const [translationsMap, setTranslationsMap] = React.useState<Record<string, { description: string, show: boolean, loading: boolean }>>({});
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false);
  const [currentOpp, setCurrentOpp] = React.useState<any>(null);
  const [formData, setFormData] = React.useState({
    companyName: "",
    category: "Retail",
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
    setFormData({ companyName: "", category: "Retail", value: 0, status: "Lead", whatsapp: "", date: "", description: "" });
    setIsDialogOpen(true);
  };

  const handleOpenEdit = (opp: any) => {
    setCurrentOpp(opp);
    setFormData({ companyName: opp.companyName || "", category: opp.category || "Retail", value: opp.value || 0, status: opp.status || "Lead", whatsapp: opp.whatsapp || "", date: opp.date || "", description: opp.description || "" });
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

  const handleDelete = () => {
    if (!db || !currentOpp) return;
    deleteDoc(doc(db, "opportunities", currentOpp.id));
    setIsDeleteDialogOpen(false);
  };

  return (
    <DashboardLayout>
      <div className="space-y-8 pb-10">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1">
            <h1 className="text-3xl font-headline font-black text-slate-900 tracking-tight">{t('opportunities')}</h1>
            <p className="text-slate-500 font-medium">{t('opportunities_desc')}</p>
          </div>
          <Button onClick={handleOpenAdd} className="rounded-xl bg-accent hover:bg-indigo-600 text-white h-12 px-8 font-black shadow-lg flex gap-2">
            <Plus className="size-5" /> {t('add_opp')}
          </Button>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          <div className="md:col-span-8 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-slate-400" />
            <Input placeholder={t('search_placeholder')} value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-12 h-14 bg-white border-slate-200 rounded-2xl" />
          </div>
          <div className="md:col-span-4">
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="h-14 bg-white border-slate-200 rounded-2xl font-bold">
                <div className="flex items-center gap-2"><Filter className="size-4" /><SelectValue /></div>
              </SelectTrigger>
              <SelectContent><SelectItem value="All">All Categories</SelectItem>{CATEGORIES.map(cat => <SelectItem key={cat} value={cat}>{cat}</SelectItem>)}</SelectContent>
            </Select>
          </div>
        </div>

        <div className="bg-white rounded-[2rem] border border-slate-100 shadow-xl overflow-hidden">
          <Table>
            <TableHeader className="bg-slate-50/50">
              <TableRow className="border-slate-100"><TableHead className="py-6 font-black text-slate-400 uppercase tracking-widest text-[10px] px-8">Opportunity</TableHead><TableHead className="py-6 font-black text-slate-400 uppercase tracking-widest text-[10px]">Value</TableHead><TableHead className="py-6 font-black text-slate-400 uppercase tracking-widest text-[10px]">Status</TableHead><TableHead className="text-right py-6 font-black text-slate-400 uppercase tracking-widest text-[10px] px-8">Actions</TableHead></TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? [1, 2, 3].map((i) => <TableRow key={i}><TableCell className="py-5 px-8"><Skeleton className="h-10 w-48 rounded-lg" /></TableCell><TableCell><Skeleton className="h-6 w-24" /></TableCell><TableCell><Skeleton className="h-6 w-20" /></TableCell><TableCell className="text-right px-8"><Skeleton className="h-10 w-20 ml-auto" /></TableCell></TableRow>) : filteredOpportunities.map((opp) => (
                <TableRow key={opp.id} className="border-slate-50 group">
                  <TableCell className="py-6 px-8">
                    <div className="flex flex-col">
                      <span className="font-black text-slate-900 text-lg group-hover:text-accent">{opp.companyName}</span>
                      <div className="flex items-center gap-3 mt-1"><Badge variant="outline" className="text-[10px]">{opp.category}</Badge>{opp.whatsapp && <span className="text-xs text-slate-400 flex items-center gap-1"><Phone className="size-3" /> {opp.whatsapp}</span>}</div>
                      {opp.description && (
                        <div className="mt-2">
                          <button onClick={() => handleTranslateOpp(opp.id, opp.description)} className="text-[9px] font-black uppercase text-accent flex items-center gap-1">
                            {translationsMap[opp.id]?.loading ? <RefreshCw className="size-2.5 animate-spin" /> : <Globe className="size-2.5" />}
                            {translationsMap[opp.id]?.show ? t('ai_original') : t('ai_translating')}
                          </button>
                          <p className="text-xs text-slate-500 mt-1 italic">{translationsMap[opp.id]?.show ? translationsMap[opp.id].description : opp.description}</p>
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="font-black text-slate-700">${Number(opp.value || 0).toLocaleString()}</TableCell>
                  <TableCell><Badge className="rounded-lg px-3 py-1 font-bold text-[10px] uppercase">{opp.status}</Badge></TableCell>
                  <TableCell className="text-right px-8"><div className="flex items-center justify-end gap-2"><Button variant="ghost" size="icon" onClick={() => handleOpenEdit(opp)} className="rounded-xl h-10 w-10 text-indigo-400 hover:text-accent"><Edit2 className="size-4" /></Button><Button variant="ghost" size="icon" onClick={() => { setCurrentOpp(opp); setIsDeleteDialogOpen(true); }} className="rounded-xl h-10 w-10 text-rose-400 hover:text-rose-600"><Trash2 className="size-4" /></Button></div></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl rounded-[2.5rem] p-8">
          <DialogHeader><DialogTitle className="text-2xl font-black">{currentOpp ? "Edit Opportunity" : "New Opportunity"}</DialogTitle></DialogHeader>
          <div className="grid grid-cols-2 gap-6 py-4">
            <div className="space-y-2"><Label className="font-bold">Business Name</Label><Input value={formData.companyName} onChange={(e) => setFormData({...formData, companyName: e.target.value})} className="rounded-xl" /></div>
            <div className="space-y-2"><Label className="font-bold">Category</Label><Select value={formData.category} onValueChange={(v) => setFormData({...formData, category: v})}><SelectTrigger className="rounded-xl"><SelectValue /></SelectTrigger><SelectContent>{CATEGORIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent></Select></div>
            <div className="space-y-2"><Label className="font-bold">Deal Value ($)</Label><Input type="number" value={formData.value} onChange={(e) => setFormData({...formData, value: Number(e.target.value)})} className="rounded-xl" /></div>
            <div className="space-y-2"><Label className="font-bold">Status</Label><Select value={formData.status} onValueChange={(v) => setFormData({...formData, status: v})}><SelectTrigger className="rounded-xl"><SelectValue /></SelectTrigger><SelectContent>{STATUSES.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent></Select></div>
          </div>
          <DialogFooter><Button onClick={handleSubmit} className="w-full h-12 bg-accent font-black rounded-xl">Save</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
