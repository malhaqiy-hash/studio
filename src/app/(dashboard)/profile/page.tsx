
"use client";

import * as React from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { useAccount } from "@/context/account-context";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Instagram, 
  Linkedin, 
  Facebook, 
  ShoppingBag, 
  Link2, 
  Globe, 
  Pencil, 
  Check, 
  X, 
  ShieldCheck, 
  Building2, 
  Briefcase, 
  User as UserIcon,
  MapPin,
  Sparkles,
  ExternalLink,
  Plus,
  Trash2
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

export default function ProfilePage() {
  const { activeAccount, updateActiveAccount } = useAccount();
  const { toast } = useToast();
  const [isEditDialogOpen, setIsEditDialogOpen] = React.useState(false);
  
  // Local state for editing to avoid premature global updates
  const [editForm, setEditForm] = React.useState(activeAccount);

  React.useEffect(() => {
    setEditForm(activeAccount);
  }, [activeAccount, isEditDialogOpen]);

  const handleSave = () => {
    updateActiveAccount(editForm);
    setIsEditDialogOpen(false);
    toast({ title: "Profil diperbarui" });
  };

  const getLinkIcon = (url: string) => {
    const lowerUrl = url.toLowerCase();
    if (lowerUrl.includes("instagram.com")) return <Instagram className="size-4" />;
    if (lowerUrl.includes("linkedin.com")) return <Linkedin className="size-4" />;
    if (lowerUrl.includes("facebook.com")) return <Facebook className="size-4" />;
    if (lowerUrl.includes("shopee") || lowerUrl.includes("tokopedia") || lowerUrl.includes("tiktok.com")) return <ShoppingBag className="size-4" />;
    return <Link2 className="size-4" />;
  };

  const followerStats = (
    <div className="flex items-center gap-3 text-xs font-medium text-slate-500 mb-2 tracking-tight">
      <span><strong className="text-slate-900">1.2k</strong> Followers</span>
      <span className="size-1 rounded-full bg-slate-200" />
      <span><strong className="text-slate-900">452</strong> Following</span>
    </div>
  );

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto space-y-12 pb-24">
        {/* Profile Header (View Mode) */}
        <section className="relative">
          {/* Cover Photo */}
          <div className="h-48 md:h-64 w-full bg-slate-50 border-b border-slate-100 relative overflow-hidden rounded-3xl">
            <img 
              src={`https://picsum.photos/seed/${activeAccount.id}_cover/1200/400`} 
              alt="Cover" 
              className="w-full h-full object-cover opacity-80"
            />
          </div>

          <div className="px-6 md:px-8 -mt-16 md:-mt-20 flex flex-col items-start gap-4">
            <div className="flex w-full items-end justify-between">
              <Avatar className="size-32 md:size-40 border-[6px] border-white shadow-sm">
                <AvatarImage src={activeAccount.avatar} className="object-cover" />
                <AvatarFallback className="bg-indigo-50 text-accent"><UserIcon size={48} /></AvatarFallback>
              </Avatar>
              <Button 
                onClick={() => setIsEditDialogOpen(true)} 
                variant="outline" 
                className="mb-2 rounded-xl h-10 border-slate-200 font-bold gap-2 text-slate-600 bg-white hover:bg-slate-50"
              >
                <Pencil className="size-4" /> Edit Profil
              </Button>
            </div>

            <div className="space-y-1 w-full">
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-black text-slate-900 tracking-tight">{activeAccount.name}</h1>
                <Badge className="bg-emerald-50 text-emerald-700 border-none px-2 py-0 text-[10px] uppercase font-black tracking-widest flex gap-1">
                  <ShieldCheck className="size-3" /> AI Verified
                </Badge>
              </div>
              
              <div className="flex items-center gap-2 text-slate-500 font-medium text-sm">
                {activeAccount.type === "bisnis" ? <Building2 size={14} /> : activeAccount.type === "professional" ? <Briefcase size={14} /> : <UserIcon size={14} />}
                {activeAccount.extra || "General Member"}
              </div>
            </div>
          </div>
        </section>

        {/* Bio & Stats Section */}
        <section className="px-6 md:px-8 space-y-4">
          {followerStats}
          <div className="space-y-4">
            <p className="text-slate-600 leading-relaxed font-medium">
              {activeAccount.bio || "Tidak ada deskripsi profil."}
            </p>
            
            {/* Links Hub */}
            {activeAccount.links && activeAccount.links.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-2">
                {activeAccount.links.map((link, idx) => (
                  <a 
                    key={idx} 
                    href={link} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-slate-100 bg-white text-xs font-bold text-slate-600 hover:border-accent hover:text-accent transition-all"
                  >
                    {getLinkIcon(link)}
                    <span className="max-w-[120px] truncate">{new URL(link).hostname.replace('www.', '')}</span>
                  </a>
                ))}
              </div>
            )}
          </div>
        </section>

        <hr className="border-slate-100 mx-6 md:px-8" />

        {/* Account Specific Content */}
        <section className="px-6 md:px-8 space-y-8">
          {activeAccount.type === 'bisnis' && (
            <div className="space-y-6">
              <h3 className="text-sm font-black uppercase tracking-[0.2em] text-slate-400">Business Showcase</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[1, 2].map(i => (
                  <div key={i} className="group p-4 rounded-3xl border border-slate-100 hover:border-accent/20 hover:shadow-xl transition-all cursor-pointer">
                    <img src={`https://picsum.photos/seed/biz_prod${i}/400/300`} className="rounded-2xl w-full aspect-video object-cover mb-4" alt="Product" />
                    <h4 className="font-bold text-slate-900 group-hover:text-accent transition-colors">Enterprise Solution {i}</h4>
                    <p className="text-xs text-slate-500 font-medium">High-value B2B service for your industry sector.</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeAccount.type === 'professional' && (
            <div className="space-y-6">
              <h3 className="text-sm font-black uppercase tracking-[0.2em] text-slate-400">Portfolio & Skills</h3>
              <div className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  {activeAccount.extra?.split(',').map((skill, i) => (
                    <Badge key={i} variant="secondary" className="rounded-lg px-3 py-1 bg-emerald-50 text-emerald-700 border-none font-bold uppercase text-[10px]">
                      {skill.trim()}
                    </Badge>
                  ))}
                </div>
                <div className="grid grid-cols-2 gap-4">
                  {[1, 2].map(i => (
                    <div key={i} className="aspect-[4/3] rounded-3xl bg-slate-50 overflow-hidden border border-slate-100 group">
                       <img src={`https://picsum.photos/seed/pro_port${i}/600/400`} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </section>
      </div>

      {/* Editing Layer (Dialog Overlay) */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl rounded-[2.5rem] p-0 border-none shadow-2xl overflow-hidden bg-white">
          <DialogHeader className="p-8 pb-4 bg-slate-50 border-b border-slate-100">
            <DialogTitle className="text-2xl font-black text-slate-900 tracking-tight">Edit Profil {activeAccount.type.toUpperCase()}</DialogTitle>
          </DialogHeader>
          
          <div className="p-8 space-y-6 overflow-y-auto max-h-[70vh]">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className="font-bold text-slate-700">Display Name</Label>
                <Input 
                  value={editForm.name} 
                  onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                  className="rounded-xl border-slate-200 h-12"
                />
              </div>
              <div className="space-y-2">
                <Label className="font-bold text-slate-700">
                  {activeAccount.type === 'bisnis' ? 'Kategori Bisnis' : activeAccount.type === 'professional' ? 'Keahlian (Pisahkan koma)' : 'Tagline'}
                </Label>
                <Input 
                  value={editForm.extra} 
                  onChange={(e) => setEditForm({...editForm, extra: e.target.value})}
                  className="rounded-xl border-slate-200 h-12"
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label className="font-bold text-slate-700">Bio / Deskripsi</Label>
                <Textarea 
                  value={editForm.bio} 
                  onChange={(e) => setEditForm({...editForm, bio: e.target.value})}
                  className="rounded-xl border-slate-200 min-h-[100px]"
                />
              </div>
            </div>

            {/* Links Hub Editor */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="font-bold text-slate-700">Links Hub</Label>
                <Button 
                  size="sm" 
                  variant="ghost" 
                  className="text-[10px] font-black uppercase text-accent"
                  onClick={() => setEditForm({...editForm, links: [...(editForm.links || []), ""]})}
                >
                  <Plus className="size-3 mr-1" /> Tambah Link
                </Button>
              </div>
              <div className="space-y-3">
                {(editForm.links || []).map((link, i) => (
                  <div key={i} className="flex gap-2">
                    <Input 
                      placeholder="https://..."
                      value={link}
                      onChange={(e) => {
                        const newLinks = [...(editForm.links || [])];
                        newLinks[i] = e.target.value;
                        setEditForm({...editForm, links: newLinks});
                      }}
                      className="rounded-xl h-11 border-slate-200"
                    />
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => {
                        const newLinks = (editForm.links || []).filter((_, idx) => idx !== i);
                        setEditForm({...editForm, links: newLinks});
                      }}
                      className="text-slate-300 hover:text-rose-500"
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <DialogFooter className="p-8 pt-4 bg-slate-50 border-t border-slate-100 flex gap-3">
            <Button variant="ghost" onClick={() => setIsEditDialogOpen(false)} className="rounded-xl h-12 px-6 font-bold">Batal</Button>
            <Button onClick={handleSave} className="rounded-xl bg-accent hover:bg-indigo-600 text-white h-12 px-10 font-black shadow-lg">
              Simpan Perubahan
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
