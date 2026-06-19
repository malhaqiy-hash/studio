
'use client';

import * as React from 'react';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Building2, 
  Search, 
  ShieldCheck, 
  MapPin, 
  Globe, 
  UserCheck, 
  ExternalLink,
  Info,
  CheckCircle2,
  X,
  FileText,
  Upload
} from 'lucide-react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

const MOCK_REGISTRY = [
  { id: "b1", name: "Global Halal Logistics", industry: "Logistics", location: "Surabaya, ID", isClaimed: true, verification: "Verified" },
  { id: "b2", name: "BioSolutions Ltd", industry: "Manufacturing", location: "Singapore, SG", isClaimed: false, verification: "Unverified" },
  { id: "b3", name: "EcoPack Japan", industry: "Retail", location: "Osaka, JP", isClaimed: false, verification: "Unverified" },
  { id: "b4", name: "Nusantara Coffee Co", industry: "F&B", location: "Aceh, ID", isClaimed: true, verification: "Pending" },
];

export default function BusinessRegistryPage() {
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
      toast({
        title: "Claim Request Submitted",
        description: "Your ownership request is being reviewed by the OnTapp Compliance AI.",
      });
    }, 1500);
  };

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto space-y-10 py-6">
        <header className="space-y-4">
           <div className="flex items-center gap-2 bg-indigo-50 text-accent px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest w-fit border border-indigo-100">
              <Globe className="size-3" />
              Public Business Registry
            </div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">OnTapp Registry</h1>
          <p className="text-slate-500 font-medium text-lg max-w-2xl">
            Claim your business profile to verify your identity, transfer ownership, and unlock enterprise discovery features.
          </p>
          <div className="relative max-w-2xl">
             <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-slate-400" />
             <Input 
                placeholder="Search by company name, registration ID, or location..." 
                className="h-14 pl-12 rounded-2xl border-slate-200 bg-white shadow-xl focus:ring-accent/10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
             />
          </div>
        </header>

        <div className="grid gap-6">
           {MOCK_REGISTRY.filter(b => b.name.toLowerCase().includes(searchTerm.toLowerCase())).map((biz) => (
             <Card key={biz.id} className="rounded-[2.5rem] border-slate-100 shadow-sm hover:shadow-xl transition-all group overflow-hidden bg-white">
                <CardContent className="p-8">
                   <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                      <div className="flex items-center gap-5">
                         <div className="size-16 rounded-3xl bg-slate-50 flex items-center justify-center group-hover:bg-indigo-50 group-hover:text-accent transition-colors shadow-inner">
                            <Building2 className="size-8 text-slate-300" />
                         </div>
                         <div className="space-y-1">
                            <div className="flex items-center gap-2">
                               <h3 className="text-xl font-black text-slate-900 leading-tight">{biz.name}</h3>
                               {biz.verification === 'Verified' && <ShieldCheck className="size-4 text-emerald-500 fill-emerald-50" />}
                            </div>
                            <div className="flex items-center gap-4 text-xs font-bold text-slate-400 uppercase tracking-widest">
                               <div className="flex items-center gap-1.5"><MapPin className="size-3" /> {biz.location}</div>
                               <div className="size-1 bg-slate-200 rounded-full" />
                               <div>{biz.industry}</div>
                            </div>
                         </div>
                      </div>

                      <div className="flex items-center gap-3 w-full md:w-auto border-t md:border-t-0 pt-4 md:pt-0">
                         {biz.isClaimed ? (
                           <Badge className={cn(
                             "rounded-xl px-4 py-2 font-black text-[10px] uppercase border-none",
                             biz.verification === 'Verified' ? "bg-emerald-100 text-emerald-600" : "bg-slate-100 text-slate-500"
                           )}>
                              {biz.verification === 'Verified' ? "Claimed & Verified" : "Claim Pending"}
                           </Badge>
                         ) : (
                           <Button 
                              onClick={() => handleClaimRequest(biz)}
                              className="w-full md:w-auto rounded-xl bg-accent hover:bg-indigo-600 text-white font-black px-8 shadow-lg shadow-indigo-100 h-12 gap-2"
                            >
                              <UserCheck className="size-4" />
                              Claim Profile
                            </Button>
                         )}
                         <Button variant="ghost" size="icon" className="rounded-xl border border-slate-100 h-12 w-12 text-slate-400 hover:text-slate-600"><ExternalLink className="size-5" /></Button>
                      </div>
                   </div>
                </CardContent>
             </Card>
           ))}
        </div>
      </div>

      {/* Claim Workflow Modal */}
      <Dialog open={isClaimModalOpen} onOpenChange={setIsClaimModalOpen}>
        <DialogContent className="max-w-xl rounded-[2.5rem] border-none shadow-2xl p-0 overflow-hidden bg-white">
          <DialogHeader className="p-8 pb-4 bg-slate-50 border-b">
            <div className="size-12 rounded-2xl bg-indigo-50 text-accent flex items-center justify-center mb-2">
               <ShieldCheck className="size-6" />
            </div>
            <DialogTitle className="text-2xl font-black text-slate-900 tracking-tight">Ownership Verification</DialogTitle>
            <DialogDescription className="font-medium">
               You are requesting to claim <span className="font-black text-indigo-600">"{selectedBiz?.name}"</span>. Our AI will verify your documents within 24 hours.
            </DialogDescription>
          </DialogHeader>
          
          <div className="p-8 space-y-6">
             <div className="space-y-4">
                <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Required Documentation</h4>
                <div className="p-10 border-2 border-dashed border-slate-100 rounded-3xl bg-slate-50/50 flex flex-col items-center justify-center text-center space-y-3 cursor-pointer hover:border-accent hover:bg-indigo-50 transition-all group">
                   <Upload className="size-8 text-slate-300 group-hover:text-accent group-hover:scale-110 transition-transform" />
                   <p className="text-sm font-bold text-slate-500">Click to upload Business License (NIB/SSM/UEN)</p>
                   <p className="text-[10px] text-slate-400">PDF, JPG or PNG (Max 5MB)</p>
                </div>
             </div>

             <div className="space-y-3">
                <div className="flex items-start gap-3 p-4 rounded-2xl bg-indigo-50/50 border border-indigo-100">
                   <Info className="size-4 text-accent mt-0.5" />
                   <p className="text-xs font-medium text-slate-600 leading-relaxed">
                      By claiming this profile, you agree to the OnTapp Enterprise Terms. Fraudulent claims will result in permanent account suspension.
                   </p>
                </div>
             </div>
          </div>

          <DialogFooter className="p-8 pt-4 bg-slate-50 border-t flex gap-3">
             <Button variant="ghost" onClick={() => setIsClaimModalOpen(false)} className="rounded-xl font-bold h-12 px-6">Cancel</Button>
             <Button 
                onClick={submitClaim} 
                disabled={isSubmitting}
                className="flex-1 rounded-xl bg-slate-900 hover:bg-black text-white font-black h-12 shadow-xl"
              >
                {isSubmitting ? <RefreshCw className="size-4 animate-spin" /> : "Authorize Claim Request"}
             </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
