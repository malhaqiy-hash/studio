"use client";

import * as React from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Building2, Search, ShieldCheck, MapPin, Globe, UserCheck, ExternalLink, RefreshCw, Upload, Info } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/context/language-context";

const MOCK_REGISTRY = [
  { id: "b1", name: "Global Halal Logistics", industry: "Logistics", location: "Surabaya, ID", isClaimed: true, verification: "Verified" },
  { id: "b2", name: "BioSolutions Ltd", industry: "Manufacturing", location: "Singapore, SG", isClaimed: false, verification: "Unverified" }
];

export default function BusinessRegistryPage() {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = React.useState("");
  const [isClaimModalOpen, setIsClaimModalOpen] = React.useState(false);
  const [selectedBiz, setSelectedBiz] = React.useState<any>(null);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const handleClaimRequest = (biz: any) => {
    setSelectedBiz(biz);
    setIsClaimModalOpen(true);
  };

  const submitClaim = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsClaimModalOpen(false);
      toast({ title: "Request Submitted", description: "AI is verifying your documents." });
    }, 1500);
  };

  return (
    <DashboardLayout>
      <div className="max-w-xl mx-auto space-y-4 py-2 px-1">
        <header className="space-y-1.5">
          <div className="flex items-center gap-1.5 text-accent font-black text-[8px] uppercase tracking-widest">
            <Globe className="size-2.5" />
            Public Business Registry
          </div>
          <h1 className="text-xl font-black text-slate-900 tracking-tight leading-none">{t('registry')}</h1>
          <p className="text-slate-500 font-medium text-[11px] leading-snug">{t('registry_desc')}</p>
          <div className="relative pt-2">
             <Search className="absolute left-3 top-[calc(50%+4px)] -translate-y-1/2 size-3.5 text-slate-400" />
             <Input placeholder={t('search_placeholder')} className="h-10 pl-9 pr-4 rounded-xl border-slate-100 bg-white shadow-sm text-[13px] font-medium" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
          </div>
        </header>

        <div className="grid gap-2">
           {MOCK_REGISTRY.filter(b => b.name.toLowerCase().includes(searchTerm.toLowerCase())).map((biz) => (
             <Card key={biz.id} className="rounded-2xl border-slate-100 shadow-sm hover:shadow-md transition-all group overflow-hidden bg-white">
                <CardContent className="p-4 flex items-center justify-between gap-3">
                   <div className="flex items-center gap-3 min-w-0">
                      <div className="size-11 rounded-xl bg-slate-50 flex items-center justify-center shrink-0 shadow-inner group-hover:bg-indigo-50 group-hover:text-accent transition-colors"><Building2 className="size-5 text-slate-300" /></div>
                      <div className="space-y-0 min-w-0">
                         <div className="flex items-center gap-1.5 truncate">
                            <h3 className="text-[13px] font-black text-slate-900 truncate">{biz.name}</h3>
                            {biz.verification === 'Verified' && <ShieldCheck className="size-3.5 text-emerald-500 shrink-0" />}
                         </div>
                         <div className="flex items-center gap-2 text-[9px] font-bold text-slate-400 uppercase">
                            <div className="flex items-center gap-1 truncate"><MapPin className="size-2.5 shrink-0" /> {biz.location}</div>
                            <div className="size-1 bg-slate-200 rounded-full shrink-0" />
                            <div className="truncate">{biz.industry}</div>
                         </div>
                      </div>
                   </div>
                   <div className="flex items-center gap-1.5 shrink-0">
                      {biz.isClaimed ? (
                        <Badge className="rounded-lg px-2 py-0.5 font-black text-[7px] uppercase bg-emerald-100 text-emerald-600 border-none shadow-none">Claimed</Badge>
                      ) : (
                        <Button onClick={() => handleClaimRequest(biz)} size="sm" className="rounded-lg bg-accent text-white font-black h-7 px-2.5 flex gap-1 text-[8px] uppercase tracking-widest active:scale-95 transition-all">
                          <UserCheck className="size-2.5" />
                          {t('claim_profile')}
                        </Button>
                      )}
                      <Button variant="ghost" size="icon" className="rounded-lg border border-slate-50 h-7 w-7 text-slate-300 hover:text-accent">
                        <ExternalLink className="size-3.5" />
                      </Button>
                   </div>
                </CardContent>
             </Card>
           ))}
        </div>
      </div>

      <Dialog open={isClaimModalOpen} onOpenChange={setIsClaimModalOpen}>
        <DialogContent className="max-w-[320px] rounded-2xl p-6 bg-card text-foreground border-none outline-none shadow-2xl">
          <DialogHeader className="space-y-1">
            <DialogTitle className="text-base font-black uppercase tracking-tight">Klaim Profil</DialogTitle>
            <DialogDescription className="text-[10px] font-medium leading-tight">Melakukan verifikasi kepemilikan untuk <strong>"{selectedBiz?.name}"</strong>.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
             <div className="p-6 border-2 border-dashed border-slate-100 rounded-xl flex flex-col items-center justify-center text-center space-y-2 group cursor-pointer hover:border-accent/30 transition-all">
                <Upload className="size-6 text-slate-300 group-hover:text-accent transition-colors" />
                <p className="text-[10px] font-black uppercase text-slate-400">Upload Lisensi Bisnis</p>
             </div>
             <div className="flex items-start gap-2 p-2.5 rounded-xl bg-indigo-50/50">
                <Info className="size-3 text-accent shrink-0 mt-0.5" />
                <p className="text-[9px] font-medium text-indigo-700 leading-snug">Data akan diproses oleh AI dalam waktu 24 jam kerja.</p>
             </div>
          </div>
          <DialogFooter className="flex flex-col gap-2">
            <Button onClick={submitClaim} disabled={isSubmitting} className="w-full bg-slate-900 text-white font-black h-10 rounded-xl text-[10px] uppercase tracking-widest shadow-lg">
              {isSubmitting ? <RefreshCw className="size-3.5 animate-spin" /> : "Ajukan Klaim"}
            </Button>
            <Button variant="ghost" onClick={() => setIsClaimModalOpen(false)} className="w-full text-[9px] font-black uppercase text-slate-400 tracking-widest h-8">Batal</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}