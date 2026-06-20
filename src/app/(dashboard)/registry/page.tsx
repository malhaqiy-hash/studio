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
      <div className="max-w-5xl mx-auto space-y-10 py-6">
        <header className="space-y-4">
           <div className="flex items-center gap-2 bg-indigo-50 text-accent px-4 py-1.5 rounded-full text-[10px] font-black uppercase"><Globe className="size-3" />Public Business Registry</div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">{t('registry')}</h1>
          <p className="text-slate-500 font-medium text-lg max-w-2xl">{t('registry_desc')}</p>
          <div className="relative max-w-2xl">
             <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-slate-400" />
             <Input placeholder={t('search_placeholder')} className="h-14 pl-12 rounded-2xl border-slate-200 shadow-xl" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
          </div>
        </header>

        <div className="grid gap-6">
           {MOCK_REGISTRY.filter(b => b.name.toLowerCase().includes(searchTerm.toLowerCase())).map((biz) => (
             <Card key={biz.id} className="rounded-[2.5rem] border-slate-100 shadow-sm hover:shadow-xl transition-all group overflow-hidden bg-white">
                <CardContent className="p-8 flex flex-col md:flex-row items-center justify-between gap-6">
                   <div className="flex items-center gap-5">
                      <div className="size-16 rounded-3xl bg-slate-50 flex items-center justify-center group-hover:bg-indigo-50 group-hover:text-accent transition-colors"><Building2 className="size-8 text-slate-300" /></div>
                      <div className="space-y-1">
                         <div className="flex items-center gap-2"><h3 className="text-xl font-black text-slate-900">{biz.name}</h3>{biz.verification === 'Verified' && <ShieldCheck className="size-4 text-emerald-500 fill-emerald-50" />}</div>
                         <div className="flex items-center gap-4 text-xs font-bold text-slate-400 uppercase"><div className="flex items-center gap-1.5"><MapPin className="size-3" /> {biz.location}</div><div className="size-1 bg-slate-200 rounded-full" /><div>{biz.industry}</div></div>
                      </div>
                   </div>
                   <div className="flex items-center gap-3 w-full md:w-auto">
                      {biz.isClaimed ? <Badge className="rounded-xl px-4 py-2 font-black text-[10px] uppercase bg-emerald-100 text-emerald-600">Claimed</Badge> : <Button onClick={() => handleClaimRequest(biz)} className="w-full md:w-auto rounded-xl bg-accent text-white font-black px-8 h-12 flex gap-2"><UserCheck className="size-4" />{t('claim_profile')}</Button>}
                      <Button variant="ghost" size="icon" className="rounded-xl border border-slate-100 h-12 w-12"><ExternalLink className="size-5" /></Button>
                   </div>
                </CardContent>
             </Card>
           ))}
        </div>
      </div>

      <Dialog open={isClaimModalOpen} onOpenChange={setIsClaimModalOpen}>
        <DialogContent className="max-w-xl rounded-[2.5rem] p-8">
          <DialogHeader><DialogTitle className="text-2xl font-black">Ownership Verification</DialogTitle><DialogDescription>Claiming <strong>"{selectedBiz?.name}"</strong>. AI will verify within 24h.</DialogDescription></DialogHeader>
          <div className="space-y-6 py-4">
             <div className="p-10 border-2 border-dashed rounded-3xl flex flex-col items-center justify-center text-center space-y-3"><Upload className="size-8 text-slate-300" /><p className="text-sm font-bold">Upload Business License (NIB/SSM/UEN)</p></div>
             <div className="flex items-start gap-3 p-4 rounded-2xl bg-indigo-50/50"><Info className="size-4 text-accent" /><p className="text-xs font-medium">By claiming, you agree to OnTapp Enterprise Terms.</p></div>
          </div>
          <DialogFooter className="flex gap-3"><Button variant="ghost" onClick={() => setIsClaimModalOpen(false)}>Cancel</Button><Button onClick={submitClaim} disabled={isSubmitting} className="flex-1 bg-slate-900 text-white font-black h-12">{isSubmitting ? <RefreshCw className="size-4 animate-spin" /> : "Authorize Claim"}</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
