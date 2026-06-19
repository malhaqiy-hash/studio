
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
  Code
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
  
  // View/Edit state for Business Overview
  const [isEditingOverview, setIsEditingOverview] = useState(false);

  // Form States
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [category, setCategory] = useState("General Business");
  const [location, setLocation] = useState("");
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [coverUrl, setCoverUrl] = useState<string | null>(null);
  
  const [originalData, setOriginalData] = useState<any>(null);

  const [links, setLinks] = useState({
    whatsapp: "",
    instagram: "",
    facebook: "",
    tiktok: "",
    youtube: "",
    shopee: "",
    tokopedia: "",
    linkedin: ""
  });

  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);

  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [newProduct, setNewProduct] = useState<Omit<Product, "id" | "userId">>({
    name: "",
    category: "Software",
    price: 0,
    description: "",
    imageUrl: ""
  });

  const productsQuery = React.useMemo(() => {
    if (!db || !userId) return null;
    return query(collection(db, "products"), where("userId", "==", userId));
  }, [db, userId]);

  const { data: products, loading: productsLoading } = useCollection<Product>(productsQuery);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted) return;

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUserId(user.uid);
        try {
          setIsOffline(false);
          const docRef = doc(db, "users", user.uid);
          const docSnap = await getDoc(docRef);

          if (docSnap.exists()) {
            const data = docSnap.data();
            const userData = {
              name: data.name || user.displayName || "",
              bio: data.bio || "",
              category: data.category || "General Business",
              location: data.location || "",
              avatarUrl: data.avatarUrl || null,
              coverUrl: data.coverUrl || null,
              links: {
                whatsapp: data.links?.whatsapp || "",
                instagram: data.links?.instagram || "",
                facebook: data.links?.facebook || "",
                tiktok: data.links?.tiktok || "",
                youtube: data.links?.youtube || "",
                shopee: data.links?.shopee || "",
                tokopedia: data.links?.tokopedia || "",
                linkedin: data.links?.linkedin || ""
              }
            };
            
            setName(userData.name);
            setBio(userData.bio);
            setCategory(userData.category);
            setLocation(userData.location);
            setAvatarUrl(userData.avatarUrl);
            setCoverUrl(userData.coverUrl);
            setLinks(userData.links);
            setOriginalData(userData);
          }
        } catch (error: any) {
          console.error("Firestore Error:", error);
          if (error.code === 'unavailable' || error.message?.includes('offline')) {
            setIsOffline(true);
          }
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [isMounted, auth, db]);

  const handleSaveProfile = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!userId || !db) return;

    setSaving(true);
    try {
      let finalAvatarUrl = avatarUrl;
      let finalCoverUrl = coverUrl;

      if (avatarFile) {
        const fileRef = storageRef(storage, `profiles/${userId}/avatar`);
        await uploadBytes(fileRef, avatarFile);
        finalAvatarUrl = await getDownloadURL(fileRef);
      }
      if (coverFile) {
        const fileRef = storageRef(storage, `profiles/${userId}/cover`);
        await uploadBytes(fileRef, coverFile);
        finalCoverUrl = await getDownloadURL(fileRef);
      }

      const docRef = doc(db, "users", userId);
      await setDoc(docRef, {
        name,
        bio,
        category,
        location,
        avatarUrl: finalAvatarUrl,
        coverUrl: finalCoverUrl,
        links,
        updatedAt: serverTimestamp()
      }, { merge: true });
      
      setAvatarFile(null);
      setCoverFile(null);
      setAvatarPreview(null);
      setCoverPreview(null);
      
      toast({ title: "Profile Synchronized", description: "Your business identity is now live on the network." });
    } catch (error: any) {
      toast({ variant: "destructive", title: "Failed", description: error.message });
    } finally {
      setSaving(false);
    }
  };

  const handleSaveOverview = async () => {
    if (!userId || !db) return;
    setSaving(true);
    try {
      const docRef = doc(db, "users", userId);
      await setDoc(docRef, { name, bio, category, location, updatedAt: serverTimestamp() }, { merge: true });
      setOriginalData({ ...originalData, name, bio, category, location });
      setIsEditingOverview(false);
      toast({ title: "Updated" });
    } catch (error: any) {
      toast({ variant: "destructive", title: "Error", description: error.message });
    } finally {
      setSaving(false);
    }
  };

  if (!isMounted) return null;

  if (loading) {
    return (
      <DashboardLayout>
        <div className="p-8 max-w-6xl mx-auto space-y-8 animate-pulse">
          <Skeleton className="h-80 w-full rounded-[2.5rem]" />
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

  const currentCover = coverPreview || coverUrl || `https://picsum.photos/seed/cover/1200/400`;
  const currentAvatar = avatarPreview || avatarUrl || activeAccount.avatar;

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto space-y-8 pb-20">
        <div className="relative">
          <div className="h-64 md:h-80 w-full rounded-[2.5rem] bg-slate-200 overflow-hidden relative shadow-lg">
            <img src={currentCover} alt="Cover" className="w-full h-full object-cover" />
            <Button 
              type="button"
              onClick={() => coverInputRef.current?.click()}
              variant="secondary" 
              className="absolute top-4 right-4 rounded-xl bg-white/30 backdrop-blur-md h-10 px-4 font-bold border-none"
            >
              <Camera className="size-4 mr-2" /> Edit Cover
            </Button>
            <input type="file" ref={coverInputRef} className="hidden" accept="image/*" onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) { setCoverFile(file); setCoverPreview(URL.createObjectURL(file)); }
            }} />
          </div>

          <div className="flex flex-col md:flex-row items-center md:items-end gap-6 px-6 md:px-12 -mt-20 md:-mt-24 relative z-20">
            <div className="relative group/avatar">
              <Avatar className="size-40 md:size-48 border-[6px] border-white shadow-2xl">
                <AvatarImage src={currentAvatar} className="object-cover" />
                <AvatarFallback className="text-4xl font-black bg-indigo-50 text-accent"><UserIcon size={48} /></AvatarFallback>
              </Avatar>
              <div className="absolute inset-0 rounded-full bg-black/40 opacity-0 group-hover/avatar:opacity-100 transition-opacity flex items-center justify-center cursor-pointer" onClick={() => avatarInputRef.current?.click()}>
                 <Camera className="size-10 text-white" />
              </div>
              <input type="file" ref={avatarInputRef} className="hidden" accept="image/*" onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) { setAvatarFile(file); setAvatarPreview(URL.createObjectURL(file)); }
              }} />
            </div>
            <div className="pb-2 text-center md:text-left space-y-1">
              <div className="flex flex-col md:flex-row items-center gap-3">
                <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">{activeAccount.name}</h1>
                <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200 px-3 py-1 font-black text-[10px] uppercase flex gap-1"><ShieldCheck className="size-3" /> AI Verified</Badge>
              </div>
              <p className="text-lg font-bold text-slate-600 flex items-center justify-center md:justify-start gap-2">
                {activeAccount.type === "bisnis" ? <Building2 className="size-5 text-indigo-500" /> : activeAccount.type === "professional" ? <Briefcase className="size-5 text-emerald-500" /> : <UserIcon className="size-5 text-slate-500" />}
                {category}
              </p>
            </div>
          </div>
        </div>

        {/* PRIBADI MODE: Standard social, bio, and social media hub */}
        {activeAccount.type === 'pribadi' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-in fade-in duration-500">
            <div className="lg:col-span-8 space-y-8">
              <Card className="rounded-[2rem] border-slate-200 shadow-sm p-8">
                <CardHeader className="p-0 pb-6 border-b border-slate-100 mb-6 flex flex-row items-center justify-between">
                  <CardTitle className="text-xl font-black flex items-center gap-2"><UserIcon className="size-5 text-slate-500" /> Bio & About</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <p className="text-slate-600 font-medium leading-relaxed italic">
                    {bio || "Ceritakan tentang dirimu kepada dunia."}
                  </p>
                </CardContent>
              </Card>

              <Card className="rounded-[2rem] border-slate-200 shadow-sm p-8">
                <CardHeader className="p-0 pb-6 border-b border-slate-100 mb-6">
                  <CardTitle className="text-xl font-black flex items-center gap-2"><Link2 className="size-5 text-slate-500" /> Social Media Connect Hub</CardTitle>
                </CardHeader>
                <CardContent className="p-0 grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(links).filter(([_, v]) => v).map(([k, v]) => (
                    <div key={k} className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                      <div className="size-10 rounded-xl bg-white flex items-center justify-center shadow-sm">
                        {k === 'instagram' && <Instagram className="size-5 text-pink-500" />}
                        {k === 'facebook' && <Facebook className="size-5 text-blue-600" />}
                        {k === 'youtube' && <Youtube className="size-5 text-red-600" />}
                        {(!['instagram', 'facebook', 'youtube'].includes(k)) && <Globe className="size-5 text-slate-400" />}
                      </div>
                      <div>
                        <p className="text-[10px] font-black uppercase text-slate-400">{k}</p>
                        <p className="text-sm font-bold text-slate-900">{v}</p>
                      </div>
                    </div>
                  ))}
                  {Object.values(links).every(v => !v) && (
                    <p className="col-span-full text-center text-slate-400 font-medium py-10">Belum ada media sosial yang terhubung.</p>
                  )}
                </CardContent>
              </Card>
            </div>
            <div className="lg:col-span-4 space-y-6">
               <Card className="rounded-[2rem] bg-slate-900 text-white p-8">
                  <h3 className="text-xl font-black mb-2">Network Reach</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-slate-400 font-bold uppercase">Followers</span>
                      <span className="text-lg font-black">1.2k</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-slate-400 font-bold uppercase">Following</span>
                      <span className="text-lg font-black">452</span>
                    </div>
                  </div>
               </Card>
            </div>
          </div>
        )}

        {/* PROFESSIONAL MODE: Portfolio & Skills Showcase */}
        {activeAccount.type === 'professional' && (
          <div className="space-y-10 animate-in slide-in-from-bottom-5 duration-500">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              <div className="lg:col-span-8 space-y-8">
                <Card className="rounded-[2.5rem] bg-white border-slate-200 shadow-sm p-10">
                  <div className="flex justify-between items-start mb-8">
                    <div className="space-y-1">
                      <h2 className="text-3xl font-black text-slate-900">Portfolio & Skills</h2>
                      <p className="text-slate-500 font-medium">Koleksi karya terbaik dan keahlian teknis saya.</p>
                    </div>
                    <Button className="bg-emerald-600 hover:bg-emerald-700 text-white font-black rounded-2xl h-14 px-10 shadow-lg flex gap-2">
                      <ExternalLink className="size-5" /> Hire Me
                    </Button>
                  </div>

                  <div className="space-y-8">
                    <div className="space-y-4">
                      <h3 className="text-xs font-black uppercase tracking-widest text-slate-400">Core Expertise</h3>
                      <div className="flex flex-wrap gap-2">
                        {["Fullstack Development", "UI/UX Design", "Product Strategy", "AI Implementation"].map(skill => (
                          <Badge key={skill} className="bg-emerald-50 text-emerald-700 border-emerald-100 px-4 py-2 rounded-xl font-bold text-sm">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                      {[1, 2].map(i => (
                        <div key={i} className="group relative aspect-video rounded-3xl overflow-hidden bg-slate-100 border border-slate-200">
                          <img src={`https://picsum.photos/seed/port${i}/600/400`} alt="Portfolio" className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-6">
                            <h4 className="text-white font-black text-lg">Project Alpha {i}</h4>
                            <p className="text-slate-300 text-xs font-medium">Enterprise Web Solution</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </Card>
              </div>

              <div className="lg:col-span-4 space-y-6">
                <Card className="rounded-[2rem] border-slate-200 shadow-sm p-8 bg-slate-50/50">
                  <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-6">Technical Stack</h3>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="size-8 rounded-lg bg-white border flex items-center justify-center"><Code className="size-4 text-emerald-500" /></div>
                      <span className="text-sm font-bold text-slate-700">TypeScript / Next.js</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="size-8 rounded-lg bg-white border flex items-center justify-center"><Building2 className="size-4 text-emerald-500" /></div>
                      <span className="text-sm font-bold text-slate-700">Firebase Cloud</span>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        )}

        {/* BISNIS MODE: Product/Service Catalog & Lead Gen */}
        {activeAccount.type === 'bisnis' && (
          <div className="space-y-12 animate-in fade-in duration-500">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <Card className="p-8 rounded-[2.5rem] bg-indigo-600 text-white flex flex-col justify-between h-64">
                <TrendingUp className="size-10 opacity-50" />
                <div>
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-indigo-200">Total Leads</h4>
                  <p className="text-4xl font-black">452</p>
                </div>
              </Card>
              <Card className="p-8 rounded-[2.5rem] bg-white border-slate-200 shadow-sm flex flex-col justify-between h-64">
                <Users className="size-10 text-indigo-600 opacity-50" />
                <div>
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400">Conversion Rate</h4>
                  <p className="text-4xl font-black text-slate-900">12.4%</p>
                </div>
              </Card>
              <Card className="p-8 rounded-[2.5rem] bg-white border-slate-200 shadow-sm flex flex-col justify-between h-64">
                <Star className="size-10 text-amber-500 opacity-50" />
                <div>
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400">Business Rating</h4>
                  <p className="text-4xl font-black text-slate-900">4.9/5.0</p>
                </div>
              </Card>
            </div>

            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div className="space-y-2">
                <div className="flex items-center gap-2 bg-indigo-50 text-indigo-600 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest w-fit"><ShoppingBag className="size-3" /> Catalog</div>
                <h2 className="text-3xl font-black text-slate-900">Products & Services</h2>
                <p className="text-slate-500 font-medium">Our enterprise-grade offerings for your business.</p>
              </div>
              <Button onClick={() => setIsProductModalOpen(true)} className="rounded-2xl bg-indigo-600 text-white h-14 px-8 font-black shadow-xl flex gap-2">
                <Plus className="size-5" /> Add New Entry
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {productsLoading ? [1,2,3].map(i => <Skeleton key={i} className="h-80 rounded-[2.5rem]" />) : (products || []).length === 0 ? (
                <div className="col-span-full p-20 text-center border-2 border-dashed rounded-[3rem] bg-slate-50/50 border-slate-200">
                  <ShoppingBag className="size-16 text-slate-200 mx-auto mb-4" />
                  <p className="font-black text-slate-400 uppercase tracking-widest text-xs">No active catalog entries found.</p>
                </div>
              ) : products.map((p) => (
                <Card key={p.id} className="group overflow-hidden border-slate-200 shadow-sm hover:shadow-2xl transition-all rounded-[2.5rem] bg-white">
                  <div className="aspect-[4/3] w-full relative overflow-hidden">
                    <img src={p.imageUrl} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    <div className="absolute top-4 left-4">
                      <Badge className="bg-white/90 backdrop-blur-sm text-slate-900 border-none font-black text-[10px] px-3 py-1 shadow-md uppercase">{p.category}</Badge>
                    </div>
                  </div>
                  <CardHeader className="p-6">
                    <CardTitle className="text-xl font-black text-slate-900 truncate">{p.name}</CardTitle>
                    <div className="text-lg font-black text-indigo-600">${Number(p.price).toLocaleString()}</div>
                  </CardHeader>
                  <CardFooter className="px-4 py-4 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between">
                    <Button variant="ghost" size="sm" className="font-bold text-slate-500 hover:text-accent gap-2 rounded-lg" onClick={() => { setEditingProduct(p); setNewProduct(p); setIsProductModalOpen(true); }}>
                      <Pencil className="size-3.5" /> Edit
                    </Button>
                    <Button variant="ghost" size="sm" className="font-bold text-rose-400 hover:text-rose-600 gap-2 rounded-lg" onClick={() => { if(confirm("Remove entry?")) deleteDoc(doc(db, "products", p.id)); }}>
                      <Trash2 className="size-3.5" /> Remove
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>

      <Dialog open={isProductModalOpen} onOpenChange={setIsProductModalOpen}>
        <DialogContent className="max-w-xl rounded-[2.5rem] border-none shadow-2xl p-0 overflow-hidden">
          <DialogHeader className="p-8 pb-4 bg-slate-50">
            <DialogTitle className="text-2xl font-black text-slate-900 tracking-tight">
              {editingProduct ? "Update Entry" : "New Catalog Entry"}
            </DialogTitle>
          </DialogHeader>
          <div className="p-8 space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2 col-span-2"><Label className="font-bold">Entry Name</Label><Input value={newProduct.name} onChange={(e) => setNewProduct({...newProduct, name: e.target.value})} className="rounded-xl h-12" /></div>
              <div className="space-y-2">
                <Label className="font-bold">Category</Label>
                <Select value={newProduct.category} onValueChange={(v) => setNewProduct({...newProduct, category: v})}><SelectTrigger className="rounded-xl h-12"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="Software">Software</SelectItem><SelectItem value="Hardware">Hardware</SelectItem><SelectItem value="Service">Professional Service</SelectItem></SelectContent></Select>
              </div>
              <div className="space-y-2"><Label className="font-bold">Price Estimate ($)</Label><Input type="number" value={newProduct.price} onChange={(e) => setNewProduct({...newProduct, price: Number(e.target.value)})} className="rounded-xl h-12" /></div>
              <div className="space-y-2 col-span-2"><Label className="font-bold">Specifications</Label><Textarea value={newProduct.description} onChange={(e) => setNewProduct({...newProduct, description: e.target.value})} className="rounded-xl min-h-[100px]" /></div>
            </div>
          </div>
          <DialogFooter className="p-8 pt-0 flex gap-3">
            <Button variant="ghost" onClick={() => setIsProductModalOpen(false)} className="rounded-xl h-12 px-6 font-bold">Cancel</Button>
            <Button onClick={async () => {
              if(!userId || !db) return;
              if(editingProduct) { await updateDoc(doc(db, "products", editingProduct.id), {...newProduct, updatedAt: serverTimestamp()}); }
              else { await addDoc(collection(db, "products"), {...newProduct, userId, createdAt: serverTimestamp(), imageUrl: `https://picsum.photos/seed/${Math.random()}/400/300`}); }
              setIsProductModalOpen(false); setEditingProduct(null); toast({title: "Catalog Updated"});
            }} className="rounded-xl bg-accent text-white h-12 px-10 font-black shadow-lg">Confirm Entry</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
