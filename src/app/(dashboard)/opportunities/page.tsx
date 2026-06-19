
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
  MoreHorizontal, 
  Plus, 
  Search, 
  Trash2, 
  Edit2, 
  Phone, 
  Calendar as CalendarIcon,
  Tag,
  DollarSign,
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
  const { language } = useLanguage();
  const db = useFirestore();
  const [searchTerm, setSearchTerm] = React.useState("");
  const [categoryFilter, setCategoryFilter] = React.useState("All");
  
  // Translation state
  const [translations, setTranslations] = React.useState<Record<string, { description: string, show: boolean, loading: boolean, detected: string }>>({});

  // Form State
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
      const matchesSearch = 
        opp.companyName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        opp.whatsapp?.includes(searchTerm);
      const matchesCategory = categoryFilter === "All" || opp.category === categoryFilter;
      return matchesSearch && matchesCategory;
    });
  }, [opportunities, searchTerm, categoryFilter]);

  const handleTranslateOpp = async (oppId: string, content: string) => {
    const existing = translations[oppId];
    if (existing?.description) {
      setTranslations(prev => ({
        ...prev,
        [oppId]: { ...existing, show: !existing.show }
      }));
      return;
    }

    setTranslations(prev => ({
      ...prev,
      [oppId]: { description: "", show: false, loading: true, detected: "" }
    }));

    try {
      const { translatedText, detectedLanguage } = await translateText({
        text: content,
        targetLanguage: language
      });
      setTranslations(prev => ({
        ...prev,
        [oppId]: { description: translatedText, show: true, loading: false, detected: detectedLanguage }
      }));
    } catch (err) {
      console.error("Opportunity translation failed", err);
      setTranslations(prev => ({
        ...prev,
        [oppId]: { description: "", show: false, loading: false, detected: "" }
      }));
    }
  };

  const handleOpenAdd = () => {
    setCurrentOpp(null);
    setFormData({
      companyName: "",
      category: "Retail",
      value: 0,
      status: "Lead",
      whatsapp: "",
      date: "",
      description: ""
    });
    setIsDialogOpen(true);
  };

  const handleOpenEdit = (opp: any) => {
    setCurrentOpp(opp);
    setFormData({
      companyName: opp.companyName || "",
      category: opp.category || "Retail",
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
    const oppsRef = collection(db, "opportunities");
    
    if (currentOpp) {
      const docRef = doc(db, "opportunities", currentOpp.id);
      updateDoc(docRef, formData).catch(e => console.error("Update error", e));
    } else {
      addDoc(oppsRef, formData).catch(e => console.error("Add error", e));
    }
    setIsDialogOpen(false);
  };

  const handleDelete = () => {
    if (!db || !currentOpp) return;
    const docRef = doc(db, "opportunities", currentOpp.id);
    deleteDoc(docRef).catch(e => console.error("Delete error", e));
    setIsDeleteDialogOpen(false);
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'Won': return 'bg-emerald-50 text-emerald-700';
      case 'Lost': return 'bg-rose-50 text-rose-700';
      case 'Negotiation': return 'bg-orange-50 text-orange-700';
      case 'Proposal': return 'bg-indigo-50 text-indigo-700';
      default: return 'bg-slate-50 text-slate-700';
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-8 pb-10">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1">
            <h1 className="text-3xl font-headline font-black text-slate-900 tracking-tight leading-none">Pipeline Management</h1>
            <p className="text-slate-500 font-medium">Track and manage your B2B sales funnel with real-time intelligence.</p>
          </div>
          <Button 
            onClick={handleOpenAdd}
            className="rounded-xl bg-accent hover:bg-indigo-600 text-white h-12 px-8 font-black shadow-lg flex gap-2 transition-all active:scale-95"
          >
            <Plus className="size-5" />
            Add New Opportunity
          </Button>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          <div className="md:col-span-8 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-slate-400" />
            <Input 
              placeholder="Search business name or WhatsApp..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 h-14 bg-white border-slate-200 rounded-2xl focus:ring-accent/10 text-base font-medium"
            />
          </div>
          <div className="md:col-span-4">
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="h-14 bg-white border-slate-200 rounded-2xl font-bold text-slate-600">
                <div className="flex items-center gap-2">
                  <Filter className="size-4" />
                  <SelectValue placeholder="Category" />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Categories</SelectItem>
                {CATEGORIES.map(cat => (
                  <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="bg-white rounded-[2rem] border border-slate-100 shadow-xl overflow-hidden">
          <Table>
            <TableHeader className="bg-slate-50/50">
              <TableRow className="border-slate-100 hover:bg-transparent">
                <TableHead className="py-6 font-black text-slate-400 uppercase tracking-widest text-[10px] px-8">Opportunity</TableHead>
                <TableHead className="py-6 font-black text-slate-400 uppercase tracking-widest text-[10px]">Value</TableHead>
                <TableHead className="py-6 font-black text-slate-400 uppercase tracking-widest text-[10px]">Status</TableHead>
                <TableHead className="py-6 font-black text-slate-400 uppercase tracking-widest text-[10px]">Deadline</TableHead>
                <TableHead className="text-right py-6 font-black text-slate-400 uppercase tracking-widest text-[10px] px-8">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                [1, 2, 3].map((i) => (
                  <TableRow key={i} className="border-slate-50">
                    <TableCell className="py-5 px-8"><Skeleton className="h-10 w-48 rounded-lg" /></TableCell>
                    <TableCell><Skeleton className="h-6 w-24" /></TableCell>
                    <TableCell><Skeleton className="h-6 w-20 rounded-full" /></TableCell>
                    <TableCell><Skeleton className="h-6 w-24" /></TableCell>
                    <TableCell className="text-right px-8"><Skeleton className="h-10 w-20 ml-auto" /></TableCell>
                  </TableRow>
                ))
              ) : filteredOpportunities.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-64 text-center">
                    <div className="flex flex-col items-center justify-center space-y-3 opacity-50">
                      <Search className="size-12 text-slate-300" />
                      <p className="font-bold text-slate-400">No opportunities matching your criteria.</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                filteredOpportunities.map((opp) => {
                  const trans = translations[opp.id];
                  return (
                    <TableRow key={opp.id} className="border-slate-50 hover:bg-slate-50/50 transition-colors group">
                      <TableCell className="py-6 px-8">
                        <div className="flex flex-col max-w-md">
                          <span className="font-black text-slate-900 text-lg leading-none group-hover:text-accent transition-colors">{opp.companyName}</span>
                          <div className="flex items-center gap-3 mt-2">
                             <Badge variant="outline" className="text-[10px] font-bold text-slate-400 border-slate-100 bg-slate-50">
                               {opp.category}
                             </Badge>
                             {opp.whatsapp && (
                               <span className="text-xs text-slate-400 font-medium flex items-center gap-1">
                                 <Phone className="size-3" /> {opp.whatsapp}
                               </span>
                             )}
                          </div>
                          {opp.description && (
                            <div className="mt-3 space-y-2">
                              <div className="flex items-center gap-2">
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  onClick={() => handleTranslateOpp(opp.id, opp.description)}
                                  className="h-6 px-2 text-[9px] font-black uppercase tracking-widest text-slate-400 hover:text-accent"
                                  disabled={trans?.loading}
                                >
                                  {trans?.loading ? (
                                    <RefreshCw className="size-2.5 mr-1 animate-spin" />
                                  ) : (
                                    <Globe className="size-2.5 mr-1" />
                                  )}
                                  {trans?.show ? "Original" : "Translate Description"}
                                </Button>
                              </div>
                              <div className="relative">
                                <p className="text-xs text-slate-500 font-medium line-clamp-2 leading-relaxed italic border-l border-slate-200 pl-3">
                                  {trans?.show ? trans.description : opp.description}
                                </p>
                                {trans?.show && (
                                  <div className="mt-1.5 text-[8px] font-black text-accent uppercase tracking-widest flex items-center gap-1">
                                    <Sparkles className="size-2" />
                                    Translated from {trans.detected?.toUpperCase() || "INTL"}
                                  </div>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="font-black text-slate-700">
                        ${Number(opp.value || 0).toLocaleString()}
                      </TableCell>
                      <TableCell>
                        <Badge className={`rounded-lg px-3 py-1 font-bold text-[10px] uppercase border-none ${getStatusColor(opp.status)}`}>
                          {opp.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-bold text-slate-400 text-sm">
                        {opp.date ? new Date(opp.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '---'}
                      </TableCell>
                      <TableCell className="text-right px-8">
                        <div className="flex items-center justify-end gap-2">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => handleOpenEdit(opp)}
                            className="rounded-xl h-10 w-10 text-indigo-400 hover:text-accent hover:bg-indigo-50"
                          >
                            <Edit2 className="size-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => { setCurrentOpp(opp); setIsDeleteDialogOpen(true); }}
                            className="rounded-xl h-10 w-10 text-rose-400 hover:text-rose-600 hover:bg-rose-50"
                          >
                            <Trash2 className="size-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Add/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl rounded-[2.5rem] border-none shadow-2xl p-0 overflow-hidden">
          <DialogHeader className="p-8 pb-4 bg-slate-50">
            <DialogTitle className="text-2xl font-black text-slate-900 tracking-tight">
              {currentOpp ? "Edit Opportunity" : "New Opportunity"}
            </DialogTitle>
            <DialogDescription className="font-medium">
              Provide the details below to sync this lead with the global discovery engine.
            </DialogDescription>
          </DialogHeader>
          <div className="p-8 space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className="font-bold text-slate-700">Business Name</Label>
                <Input 
                  value={formData.companyName}
                  onChange={(e) => setFormData({...formData, companyName: e.target.value})}
                  placeholder="e.g. Acme Corp" 
                  className="rounded-xl border-slate-200 h-12"
                />
              </div>
              <div className="space-y-2">
                <Label className="font-bold text-slate-700">Category</Label>
                <Select value={formData.category} onValueChange={(v) => setFormData({...formData, category: v})}>
                  <SelectTrigger className="rounded-xl border-slate-200 h-12">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map(cat => <SelectItem key={cat} value={cat}>{cat}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="font-bold text-slate-700">Deal Value ($)</Label>
                <Input 
                  type="number"
                  value={formData.value}
                  onChange={(e) => setFormData({...formData, value: Number(e.target.value)})}
                  placeholder="0.00" 
                  className="rounded-xl border-slate-200 h-12"
                />
              </div>
              <div className="space-y-2">
                <Label className="font-bold text-slate-700">Current Status</Label>
                <Select value={formData.status} onValueChange={(v) => setFormData({...formData, status: v})}>
                  <SelectTrigger className="rounded-xl border-slate-200 h-12">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {STATUSES.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="font-bold text-slate-700">WhatsApp Number</Label>
                <Input 
                  value={formData.whatsapp}
                  onChange={(e) => setFormData({...formData, whatsapp: e.target.value})}
                  placeholder="+62..." 
                  className="rounded-xl border-slate-200 h-12"
                />
              </div>
              <div className="space-y-2">
                <Label className="font-bold text-slate-700">Target Date</Label>
                <Input 
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({...formData, date: e.target.value})}
                  className="rounded-xl border-slate-200 h-12"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label className="font-bold text-slate-700">Brief Description</Label>
              <Textarea 
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                placeholder="Key highlights about this lead..."
                className="rounded-xl border-slate-200 min-h-[100px]"
              />
            </div>
          </div>
          <DialogFooter className="p-8 pt-0 flex gap-3">
            <Button variant="ghost" onClick={() => setIsDialogOpen(false)} className="rounded-xl h-12 px-6 font-bold">Cancel</Button>
            <Button onClick={handleSubmit} className="rounded-xl bg-accent hover:bg-indigo-600 text-white h-12 px-10 font-black shadow-lg">
              {currentOpp ? "Update Entry" : "Save Opportunity"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent className="rounded-[2.5rem] border-none shadow-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-2xl font-black text-slate-900 tracking-tight">Delete Opportunity?</AlertDialogTitle>
            <AlertDialogDescription className="font-medium text-slate-500">
              This action cannot be undone. This lead will be permanently removed from your pipeline.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="pt-4">
            <AlertDialogCancel className="rounded-xl h-11 px-6 font-bold">Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="rounded-xl bg-rose-500 hover:bg-rose-600 h-11 px-8 font-black">
              Confirm Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </DashboardLayout>
  );
}
