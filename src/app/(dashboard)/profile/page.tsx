
"use client";

import * as React from "react";
import { useEffect, useState, useRef } from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { useAuth, useFirestore, useStorage, useCollection } from "@/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, setDoc, collection, query, where, addDoc, updateDoc, deleteDoc, serverTimestamp } from "firebase/firestore";
import { ref as storageRef, uploadBytes, getDownloadURL } from "firebase/storage";
import { useToast } from "@/hooks/use-toast";
import { 
  User as UserIcon, 
  Camera, 
  Link2, 
  Globe, 
  Save, 
  RefreshCw,
  MessageSquare, 
  Instagram, 
  Facebook, 
  Youtube, 
  ShoppingBag,
  Building2,
  MapPin,
  ShieldCheck,
  Plus,
  Pencil,
  Trash2,
  AlertCircle,
  Sparkles,
  X,
  Check,
  Briefcase,
  Star,
  Users,
  ExternalLink,
  Code,
  TrendingUp,
  Phone
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { useAccount, AccountType } from "@/context/account-context";

interface Product {
  id: string;
  userId: string;
  name: string;
  category: string;
  price: number;
  description: string;
  imageUrl: string;
  createdAt?: any;
}

export default function ProfilePage() {
  const auth = useAuth();
  const db = useFirestore();
  const storage = useStorage();
  const { toast } = useToast();
  const { activeAccount } = useAccount();

  const [isMounted, setIsMounted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [isOffline, setIsOffline] = useState(false);
  
  // Form States (Local only for Onboarding Demo)
  const [name, setName] = useState(activeAccount.name);
  const [bio, setBio] = useState(activeAccount.bio || "");
  const [category, setCategory] = useState(activeAccount.extra || "General Business");
  const [location, setLocation] = useState("Jakarta, Indonesia");
  const [avatarUrl, setAvatarUrl] = useState<string | null>(activeAccount.avatar);
  
  // View/Edit state
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    setLoading(false);
  }, []);

  // Update local state when account switches
  useEffect(() => {
    setName(activeAccount.name);
    setBio(activeAccount.bio || "");
    setCategory(activeAccount.extra || (activeAccount.type === 'bisnis' ? 'Retail' : 'General Business'));
    setAvatarUrl(activeAccount.avatar);
  }, [activeAccount]);

  const handleSave = () => {
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      setIsEditing(false);
      toast({ title: "Profile Updated" });
    }, 800);
  };

  if (!isMounted || loading) {
    return (
      <DashboardLayout>
        <div className="p-8 max-w-6xl mx-auto space-y-8 animate-pulse">
          <Skeleton className="h-64 w-full rounded-[2.5rem]" />
          <div className="flex flex-col md:flex-row gap-6 px-12 -mt-24">
            <Skeleton className="size-48 rounded-full border-[6px] border-white" />
            <div className="mt-24 md:mt-0 space-y-4 flex-1">
              <Skeleton className="h-10 w-64" />
              <Skeleton className="h-6 w-48" />
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  const currentCover = `https://picsum.photos/seed/${activeAccount.id}_cover/1200/400`;

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto space-y-8 pb-20">
        <div className="relative">
          <div className="h-64 md:h-72 w-full rounded-[2.5rem] bg-slate-200 overflow-hidden relative shadow-lg">
            <img src={currentCover} alt="Cover" className="w-full h-full object-cover" />
          </div>

          <div className="flex flex-col md:flex-row items-center md:items-end gap-6 px-6 md:px-12 -mt-20 md:-mt-24 relative z-20">
            <Avatar className="size-40 md:size-48 border-[6px] border-white shadow-2xl">
              <AvatarImage src={avatarUrl || activeAccount.avatar} className="object-cover" />
              <AvatarFallback className="text-4xl font-black bg-indigo-50 text-accent"><UserIcon size={48} /></AvatarFallback>
            </Avatar>
            <div className="pb-2 text-center md:text-left space-y-1 flex-1">
              <div className="flex flex-col md:flex-row items-center gap-3">
                <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">{name}</h1>
                <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200 px-3 py-1 font-black text-[10px] uppercase flex gap-1"><ShieldCheck className="size-3" /> AI Verified</Badge>
              </div>
              <p className="text-lg font-bold text-slate-600 flex items-center justify-center md:justify-start gap-2">
                {activeAccount.type === "bisnis" ? <Building2 className="size-5 text-indigo-500" /> : activeAccount.type === "professional" ? <Briefcase className="size-5 text-emerald-500" /> : <UserIcon className="size-5 text-slate-500" />}
                {category}
              </p>
            </div>
            {!isEditing && (
              <Button onClick={() => setIsEditing(true)} variant="outline" className="rounded-xl h-10 border-slate-200 font-bold gap-2 bg-white/80 backdrop-blur-sm">
                <Pencil className="size-4" /> Edit Profile
              </Button>
            )}
          </div>
        </div>

        {isEditing ? (
          <Card className="rounded-[2.5rem] border-slate-200 shadow-xl p-8 animate-in fade-in slide-in-from-top-4 duration-300">
             <CardHeader className="p-0 pb-6 mb-6 border-b border-slate-100">
               <CardTitle className="text-xl font-black tracking-tight">Edit Business Overview</CardTitle>
             </CardHeader>
             <CardContent className="p-0 space-y-6">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div className="space-y-2">
                   <Label className="font-bold text-slate-700">Display Name</Label>
                   <Input value={name} onChange={(e) => setName(e.target.value)} className="rounded-xl h-12" />
                 </div>
                 <div className="space-y-2">
                   <Label className="font-bold text-slate-700">Industry Sector</Label>
                   <Input value={category} onChange={(e) => setCategory(e.target.value)} className="rounded-xl h-12" />
                 </div>
                 <div className="space-y-2 md:col-span-2">
                   <Label className="font-bold text-slate-700">Bio & About</Label>
                   <Textarea value={bio} onChange={(e) => setBio(e.target.value)} className="rounded-xl min-h-[120px]" />
                 </div>
               </div>
             </CardContent>
             <CardFooter className="p-0 pt-6 flex gap-3 justify-end">
               <Button variant="ghost" onClick={() => setIsEditing(false)} className="rounded-xl h-12 px-6 font-bold">Cancel</Button>
               <Button onClick={handleSave} disabled={saving} className="rounded-xl bg-accent hover:bg-indigo-600 text-white h-12 px-10 font-black shadow-lg">
                 {saving ? "Saving..." : "Save Changes"}
               </Button>
             </CardFooter>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-in fade-in duration-500">
            <div className="lg:col-span-8 space-y-8">
              {/* Profile Bio Section */}
              <Card className="rounded-[2rem] border-slate-200 shadow-sm p-8 bg-white">
                <CardHeader className="p-0 pb-6 border-b border-slate-100 mb-6">
                  <CardTitle className="text-lg font-black flex items-center gap-2">
                    <Sparkles className="size-5 text-accent" />
                    Overview & Insights
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0 space-y-6">
                  <div className="space-y-4">
                    <p className="text-slate-600 font-medium leading-relaxed italic border-l-4 border-indigo-100 pl-6">
                      "{bio || "No description provided."}"
                    </p>
                    <div className="flex flex-wrap gap-4 pt-2">
                       <div className="flex items-center gap-2 text-xs font-black text-slate-400 uppercase tracking-widest">
                         <MapPin className="size-4" /> {location}
                       </div>
                       <div className="flex items-center gap-2 text-xs font-black text-slate-400 uppercase tracking-widest">
                         <Phone className="size-4" /> {activeAccount.contact || "N/A"}
                       </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Conditional Rendering based on Account Type */}
              {activeAccount.type === 'pribadi' && (
                <Card className="rounded-[2rem] border-slate-200 shadow-sm p-8 bg-white">
                  <CardHeader className="p-0 pb-6 border-b border-slate-100 mb-6">
                    <CardTitle className="text-lg font-black flex items-center gap-2"><Link2 className="size-5 text-slate-500" /> Connected Hub</CardTitle>
                  </CardHeader>
                  <CardContent className="p-0 grid grid-cols-1 md:grid-cols-2 gap-4">
                    {["Instagram", "LinkedIn", "YouTube"].map((social) => (
                      <div key={social} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100 group hover:border-accent hover:bg-white transition-all cursor-pointer">
                        <div className="flex items-center gap-3">
                           <div className="size-10 rounded-xl bg-white flex items-center justify-center shadow-sm">
                              {social === "Instagram" ? <Instagram className="size-5 text-pink-500" /> : <ExternalLink className="size-5 text-slate-400" />}
                           </div>
                           <span className="font-bold text-slate-700">{social}</span>
                        </div>
                        <ArrowRight className="size-4 text-slate-300 group-hover:text-accent group-hover:translate-x-1 transition-all" />
                      </div>
                    ))}
                  </CardContent>
                </Card>
              )}

              {activeAccount.type === 'professional' && (
                <div className="space-y-8">
                  <Card className="rounded-[2.5rem] bg-white border-slate-200 shadow-sm p-10">
                    <div className="flex justify-between items-start mb-8">
                      <div className="space-y-1">
                        <h2 className="text-2xl font-black text-slate-900">Portfolio & Skills</h2>
                        <p className="text-slate-500 font-medium">Core Expertise: <span className="text-emerald-600 font-bold">{activeAccount.extra}</span></p>
                      </div>
                      <Button className="bg-emerald-600 hover:bg-emerald-700 text-white font-black rounded-2xl h-14 px-10 shadow-lg flex gap-2">
                        <Phone className="size-5" /> Hire Me
                      </Button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {[1, 2].map(i => (
                        <div key={i} className="group relative aspect-video rounded-3xl overflow-hidden bg-slate-100 border border-slate-200 shadow-sm">
                          <img src={`https://picsum.photos/seed/pro_port${i}/600/400`} alt="Portfolio" className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-6">
                            <h4 className="text-white font-black text-lg">Case Study {i}</h4>
                            <p className="text-slate-300 text-xs font-medium">Enterprise Solution Implementation</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </Card>
                </div>
              )}

              {activeAccount.type === 'bisnis' && (
                <div className="space-y-8">
                  <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div className="space-y-2">
                      <h2 className="text-2xl font-black text-slate-900">Enterprise Catalog</h2>
                      <p className="text-slate-500 font-medium">Explore our specialized offerings in {activeAccount.extra}.</p>
                    </div>
                    <Button className="rounded-2xl bg-indigo-600 text-white h-12 px-8 font-black shadow-lg flex gap-2">
                      <Plus className="size-5" /> Add Product
                    </Button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {[1, 2].map(i => (
                      <Card key={i} className="group overflow-hidden border-slate-200 shadow-sm hover:shadow-2xl transition-all rounded-[2.5rem] bg-white">
                        <div className="aspect-[16/9] w-full relative overflow-hidden">
                          <img src={`https://picsum.photos/seed/biz_prod${i}/400/300`} alt="Product" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                          <div className="absolute top-4 left-4">
                            <Badge className="bg-white/90 backdrop-blur-sm text-slate-900 border-none font-black text-[10px] px-3 py-1 shadow-md uppercase">{activeAccount.extra}</Badge>
                          </div>
                        </div>
                        <CardHeader className="p-6">
                          <CardTitle className="text-xl font-black text-slate-900 truncate">Enterprise Solution {i}</CardTitle>
                          <div className="text-lg font-black text-indigo-600">$1,250.00</div>
                        </CardHeader>
                      </Card>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="lg:col-span-4 space-y-6">
              <Card className="rounded-[2rem] bg-slate-900 text-white p-8 overflow-hidden relative shadow-2xl">
                 <div className="relative z-10 space-y-6">
                   <h3 className="text-xl font-black flex items-center gap-2">
                     <TrendingUp className="size-5 text-accent" />
                     Performance
                   </h3>
                   <div className="space-y-4">
                     <div className="flex justify-between items-center">
                       <span className="text-xs text-slate-400 font-bold uppercase tracking-widest">Reach</span>
                       <span className="text-lg font-black">45.2k</span>
                     </div>
                     <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                       <div className="h-full bg-accent w-[75%] rounded-full" />
                     </div>
                     <div className="flex justify-between items-center">
                       <span className="text-xs text-slate-400 font-bold uppercase tracking-widest">Synergy</span>
                       <span className="text-lg font-black">88%</span>
                     </div>
                     <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                       <div className="h-full bg-emerald-400 w-[88%] rounded-full" />
                     </div>
                   </div>
                   <Button variant="outline" className="w-full h-12 rounded-xl border-white/20 bg-white/5 hover:bg-white/10 text-white font-bold transition-all">
                     Detailed Analytics
                   </Button>
                 </div>
                 <div className="absolute top-0 right-0 w-32 h-32 bg-accent/20 rounded-full blur-3xl -mr-16 -mt-16" />
              </Card>

              <Card className="rounded-[2rem] border-slate-200 shadow-sm p-8 bg-white">
                <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-6">Discovery Hub</h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
                    <Users className="size-5 text-indigo-500" />
                    <div>
                      <p className="text-sm font-bold text-slate-900">12 New Matches</p>
                      <p className="text-[10px] text-slate-400 font-bold uppercase">This Week</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
                    <Briefcase className="size-5 text-emerald-500" />
                    <div>
                      <p className="text-sm font-bold text-slate-900">5 Active Leads</p>
                      <p className="text-[10px] text-slate-400 font-bold uppercase">Ready for Proposal</p>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

// Simple Arrow icon for the social hub
function ArrowRight(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </svg>
  );
}
