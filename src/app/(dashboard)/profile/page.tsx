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
  Users
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

// Requirement #6: Define account types
type AccountType = "pribadi" | "professional" | "bisnis";

export default function ProfilePage() {
  const auth = useAuth();
  const db = useFirestore();
  const storage = useStorage();
  const { toast } = useToast();

  const [isMounted, setIsMounted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [isOffline, setIsOffline] = useState(false);
  
  // Requirement #6: Multi-Account Context State
  const [accountType, setAccountType] = useState<AccountType>("bisnis");

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
  const currentAvatar = avatarPreview || avatarUrl || null;

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto space-y-8 pb-20">
        {/* Requirement #6: Conditional Context Badge */}
        <div className="flex justify-center">
          <div className="inline-flex items-center gap-1 bg-white border border-slate-200 p-1 rounded-2xl shadow-sm">
             <button 
              onClick={() => setAccountType("pribadi")}
              className={cn("px-4 py-2 rounded-xl text-xs font-black uppercase transition-all", accountType === "pribadi" ? "bg-slate-900 text-white" : "text-slate-400 hover:text-slate-600")}
             >
               Pribadi
             </button>
             <button 
              onClick={() => setAccountType("professional")}
              className={cn("px-4 py-2 rounded-xl text-xs font-black uppercase transition-all", accountType === "professional" ? "bg-emerald-600 text-white" : "text-slate-400 hover:text-slate-600")}
             >
               Professional
             </button>
             <button 
              onClick={() => setAccountType("bisnis")}
              className={cn("px-4 py-2 rounded-xl text-xs font-black uppercase transition-all", accountType === "bisnis" ? "bg-indigo-600 text-white" : "text-slate-400 hover:text-slate-600")}
             >
               Bisnis
             </button>
          </div>
        </div>

        <div className="relative">
          <div className="h-64 md:h-80 w-full rounded-[2.5rem] bg-slate-200 overflow-hidden relative shadow-lg">
            {currentCover && (
              <img src={currentCover} alt="Cover" className="w-full h-full object-cover" />
            )}
            <Button 
              type="button"
              onClick={() => coverInputRef.current?.click()}
              variant="secondary" 
              className="absolute top-4 right-4 rounded-xl bg-white/30 backdrop-blur-md h-10 px-4 font-bold"
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
                {currentAvatar ? (
                  <AvatarImage src={currentAvatar} className="object-cover" />
                ) : (
                  <AvatarFallback className="text-4xl font-black bg-indigo-50 text-accent"><UserIcon size={48} /></AvatarFallback>
                )}
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
                <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">{name || "User Identity"}</h1>
                <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200 px-3 py-1 font-black text-[10px] uppercase flex gap-1"><ShieldCheck className="size-3" /> AI Verified</Badge>
              </div>
              <p className="text-lg font-bold text-slate-600 flex items-center justify-center md:justify-start gap-2">
                {accountType === "bisnis" ? <Building2 className="size-5 text-indigo-500" /> : <UserIcon className="size-5 text-emerald-500" />}
                {category}
              </p>
            </div>
          </div>
        </div>

        {/* Placeholder Conditional Layouts based on Account Type (Requirement #6) */}
        {accountType === "pribadi" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-in fade-in duration-500">
             <Card className="rounded-[2rem] border-slate-100 shadow-sm p-8 space-y-4">
                <div className="size-12 bg-pink-50 text-pink-500 rounded-2xl flex items-center justify-center"><Users className="size-6" /></div>
                <h3 className="text-xl font-black">Social Networking</h3>
                <p className="text-slate-500 font-medium">Connect with other professionals and discover common interests in the network.</p>
             </Card>
             <Card className="rounded-[2rem] border-slate-100 shadow-sm p-8 space-y-4">
                <div className="size-12 bg-indigo-50 text-indigo-500 rounded-2xl flex items-center justify-center"><MessageSquare className="size-6" /></div>
                <h3 className="text-xl font-black">Personal Feed</h3>
                <p className="text-slate-500 font-medium">Your private space to engage with community content and manage your network identity.</p>
             </Card>
          </div>
        )}

        {accountType === "professional" && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 animate-in slide-in-from-bottom-5 duration-500">
             <Card className="col-span-full rounded-[2.5rem] bg-slate-900 text-white p-10 relative overflow-hidden">
                <div className="relative z-10 space-y-4">
                  <Badge className="bg-white/10 text-emerald-400 font-black px-4 py-1 rounded-full uppercase text-[10px] tracking-widest border border-emerald-400/20">Skill Branding Active</Badge>
                  <h2 className="text-3xl font-black tracking-tight">Professional Portfolio</h2>
                  <p className="text-slate-400 max-w-lg font-medium">Showcase your specialized skills, project history, and hireable status to enterprise partners.</p>
                  <div className="flex gap-4 pt-4">
                    <Button className="bg-emerald-500 hover:bg-emerald-600 text-white font-black rounded-xl h-12 px-8">Add Skill Badge</Button>
                    <Button variant="ghost" className="text-white hover:bg-white/10 font-bold">Import Projects</Button>
                  </div>
                </div>
                <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl -mr-32 -mt-32" />
             </Card>
          </div>
        )}

        {accountType === "bisnis" && (
          <div className="space-y-8 animate-in fade-in duration-500">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              <div className="lg:col-span-7 space-y-6">
                <Card className="border-slate-200 shadow-sm rounded-[2rem] overflow-hidden">
                  <CardHeader className="p-8 pb-4 border-b border-slate-100 flex flex-row items-center justify-between">
                    <CardTitle className="text-xl font-black flex items-center gap-2"><Globe className="size-5 text-accent" /> Business Overview</CardTitle>
                    {!isEditingOverview && <Button variant="ghost" size="sm" onClick={() => setIsEditingOverview(true)} className="rounded-lg text-slate-400 hover:text-accent font-bold gap-2"><Pencil className="size-4" /> Edit</Button>}
                  </CardHeader>
                  <CardContent className="p-8">
                    {isEditingOverview ? (
                      <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-2"><Label className="font-bold">Display Name</Label><Input value={name} onChange={(e) => setName(e.target.value)} className="rounded-xl h-12" /></div>
                          <div className="space-y-2"><Label className="font-bold">Industry Sector</Label><Input value={category} onChange={(e) => setCategory(e.target.value)} className="rounded-xl h-12" /></div>
                          <div className="space-y-2"><Label className="font-bold">Geographic Base</Label><Input value={location} onChange={(e) => setLocation(e.target.value)} className="rounded-xl h-12" /></div>
                        </div>
                        <div className="space-y-2"><Label className="font-bold">Mission Statement</Label><Textarea value={bio} onChange={(e) => setBio(e.target.value)} className="rounded-xl min-h-[120px]" /></div>
                        <div className="flex gap-3 justify-end pt-4">
                          <Button variant="ghost" onClick={() => setIsEditingOverview(false)} className="rounded-xl font-bold h-11 px-6">Cancel</Button>
                          <Button onClick={handleSaveOverview} className="rounded-xl bg-accent text-white font-bold h-11 px-8 shadow-md">Save Changes</Button>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-6">
                        <div className="grid grid-cols-2 gap-6">
                          <div className="space-y-1"><span className="text-[10px] font-black uppercase text-slate-400">Sector</span><p className="text-sm font-bold">{category}</p></div>
                          <div className="space-y-1"><span className="text-[10px] font-black uppercase text-slate-400">Base</span><p className="text-sm font-bold">{location}</p></div>
                        </div>
                        <div className="pt-4 border-t border-slate-50"><p className="text-sm font-medium leading-relaxed italic text-slate-600">{bio || "No mission statement displayed."}</p></div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              <div className="lg:col-span-5 space-y-6">
                <Card className="border-slate-200 shadow-sm rounded-[2rem]">
                  <CardHeader className="p-8 pb-4"><CardTitle className="text-xl font-black flex items-center gap-2"><Link2 className="size-5 text-accent" /> Connect Hub</CardTitle></CardHeader>
                  <CardContent className="p-8 pt-0 space-y-4">
                    {Object.entries(links).map(([key, val]) => (
                      <div key={key} className="space-y-1">
                        <Label className="text-[10px] font-black uppercase text-slate-400">{key}</Label>
                        <Input value={val} onChange={(e) => setLinks({...links, [key]: e.target.value})} placeholder={`ID/Username`} className="rounded-xl h-10 text-xs bg-slate-50/50" />
                      </div>
                    ))}
                  </CardContent>
                  <CardFooter className="p-8 pt-0"><Button onClick={handleSaveProfile} disabled={saving} className="w-full h-14 rounded-2xl bg-accent text-white font-black shadow-lg flex gap-2">{saving ? <RefreshCw className="size-4 animate-spin" /> : <Save className="size-4" />} Synchronize Profile</Button></CardFooter>
                </Card>
              </div>
            </div>

            <div className="pt-10 space-y-8">
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 bg-indigo-50 text-accent px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest w-fit"><ShoppingBag className="size-3" /> Business Catalog</div>
                  <h2 className="text-3xl font-black text-slate-900 tracking-tight">Portfolio & Products</h2>
                  <p className="text-slate-500 font-medium">Showcase your high-value offerings to the network.</p>
                </div>
                <Button onClick={() => setIsProductModalOpen(true)} className="rounded-2xl bg-slate-900 text-white h-14 px-8 font-black shadow-xl flex gap-2"><Plus className="size-5" /> Add New Entry</Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {productsLoading ? [1,2,3].map(i => <Skeleton key={i} className="h-80 rounded-[2.5rem]" />) : (products || []).length === 0 ? (
                  <div className="col-span-full p-20 text-center border-2 border-dashed rounded-[3rem] bg-slate-50/50 border-slate-200"><ShoppingBag className="size-16 text-slate-200 mx-auto mb-4" /><p className="font-black text-slate-400 uppercase tracking-widest text-xs">No active catalog entries found.</p></div>
                ) : products.map((p) => (
                  <Card key={p.id} className="group overflow-hidden border-slate-200 shadow-sm hover:shadow-2xl transition-all rounded-[2.5rem] bg-white">
                    <div className="aspect-[4/3] w-full relative overflow-hidden"><img src={p.imageUrl} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" /><div className="absolute top-4 left-4"><Badge className="bg-white/90 backdrop-blur-sm text-slate-900 border-none font-black text-[10px] px-3 py-1 shadow-md uppercase">{p.category}</Badge></div></div>
                    <CardHeader className="p-6"><CardTitle className="text-xl font-black text-slate-900 truncate">{p.name}</CardTitle><div className="text-lg font-black text-indigo-600">${Number(p.price).toLocaleString()}</div></CardHeader>
                    <CardFooter className="px-4 py-4 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between"><Button variant="ghost" size="sm" className="font-bold text-slate-500 hover:text-accent gap-2 rounded-lg" onClick={() => { setEditingProduct(p); setNewProduct(p); setIsProductModalOpen(true); }}><Pencil className="size-3.5" /> Edit</Button><Button variant="ghost" size="sm" className="font-bold text-rose-400 hover:text-rose-600 gap-2 rounded-lg" onClick={() => { if(confirm("Remove entry?")) deleteDoc(doc(db, "products", p.id)); }}><Trash2 className="size-3.5" /> Remove</Button></CardFooter>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Catalog Entry Modal (Requirement #6 Placeholder Hook) */}
      <Dialog open={isProductModalOpen} onOpenChange={setIsProductModalOpen}>
        <DialogContent className="max-w-xl rounded-[2.5rem] border-none shadow-2xl p-0 overflow-hidden">
          <DialogHeader className="p-8 pb-4 bg-slate-50"><DialogTitle className="text-2xl font-black text-slate-900 tracking-tight">{editingProduct ? "Update Entry" : "New Catalog Entry"}</DialogTitle></DialogHeader>
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
          <DialogFooter className="p-8 pt-0 flex gap-3"><Button variant="ghost" onClick={() => setIsProductModalOpen(false)} className="rounded-xl h-12 px-6 font-bold">Cancel</Button><Button onClick={async () => {
            if(!userId || !db) return;
            if(editingProduct) { await updateDoc(doc(db, "products", editingProduct.id), {...newProduct, updatedAt: serverTimestamp()}); }
            else { await addDoc(collection(db, "products"), {...newProduct, userId, createdAt: serverTimestamp(), imageUrl: `https://picsum.photos/seed/${Math.random()}/400/300`}); }
            setIsProductModalOpen(false); setEditingProduct(null); toast({title: "Catalog Updated"});
          }} className="rounded-xl bg-accent text-white h-12 px-10 font-black shadow-lg">Confirm Entry</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
