
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
  AlertCircle
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

  // Form States
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [category, setCategory] = useState("General Business");
  const [location, setLocation] = useState("");
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [coverUrl, setCoverUrl] = useState<string | null>(null);
  
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

  // Photo states
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);

  // Catalog State
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

    // Secure Auth Listener to prevent offline fetch racing
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUserId(user.uid);
        try {
          setIsOffline(false);
          const docRef = doc(db, "users", user.uid);
          const docSnap = await getDoc(docRef);

          if (docSnap.exists()) {
            const data = docSnap.data();
            setName(data.name || user.displayName || "");
            setBio(data.bio || "");
            setCategory(data.category || "General Business");
            setLocation(data.location || "");
            setAvatarUrl(data.avatarUrl || null);
            setCoverUrl(data.coverUrl || null);
            setLinks({
              whatsapp: data.links?.whatsapp || "",
              instagram: data.links?.instagram || "",
              facebook: data.links?.facebook || "",
              tiktok: data.links?.tiktok || "",
              youtube: data.links?.youtube || "",
              shopee: data.links?.shopee || "",
              tokopedia: data.links?.tokopedia || "",
              linkedin: data.links?.linkedin || ""
            });
          }
        } catch (error: any) {
          console.error("Firestore Error:", error);
          if (error.code === 'unavailable') {
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

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCoverFile(file);
      setCoverPreview(URL.createObjectURL(file));
    }
  };

  const uploadFile = async (file: File, path: string) => {
    const fileRef = storageRef(storage, path);
    await uploadBytes(fileRef, file);
    return getDownloadURL(fileRef);
  };

  const handleSaveProfile = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!userId || !db) return;

    setSaving(true);
    try {
      let finalAvatarUrl = avatarUrl;
      let finalCoverUrl = coverUrl;

      if (avatarFile) finalAvatarUrl = await uploadFile(avatarFile, `profiles/${userId}/avatar`);
      if (coverFile) finalCoverUrl = await uploadFile(coverFile, `profiles/${userId}/cover`);

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
      setAvatarUrl(finalAvatarUrl);
      setCoverUrl(finalCoverUrl);
      
      toast({ title: "Profile Synchronized", description: "Your business identity is now live on the network." });
    } catch (error: any) {
      console.error("Save Error:", error);
      toast({ 
        variant: "destructive", 
        title: "Synchronization Failed", 
        description: error.message || "Check your internet connection." 
      });
    } finally {
      setSaving(false);
    }
  };

  const handleAddOrEditProduct = async () => {
    if (!userId || !db) return;
    try {
      if (editingProduct) {
        const productRef = doc(db, "products", editingProduct.id);
        await updateDoc(productRef, { ...newProduct, updatedAt: serverTimestamp() });
      } else {
        await addDoc(collection(db, "products"), {
          ...newProduct,
          userId,
          createdAt: serverTimestamp(),
          imageUrl: newProduct.imageUrl || `https://picsum.photos/seed/${Math.random()}/400/300`
        });
      }
      setIsProductModalOpen(false);
      setEditingProduct(null);
      setNewProduct({ name: "", category: "Software", price: 0, description: "", imageUrl: "" });
      toast({ title: "Catalog Updated" });
    } catch (err: any) {
      console.error(err);
      toast({ variant: "destructive", title: "Operation Failed", description: err.message });
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (!db) return;
    try {
      await deleteDoc(doc(db, "products", id));
      toast({ title: "Product Removed" });
    } catch (err: any) {
      toast({ variant: "destructive", title: "Deletion Failed", description: err.message });
    }
  };

  const openEditModal = (product: Product) => {
    setEditingProduct(product);
    setNewProduct({ name: product.name, category: product.category, price: product.price, description: product.description, imageUrl: product.imageUrl });
    setIsProductModalOpen(true);
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
  const currentAvatar = avatarPreview || avatarUrl || "";

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto space-y-8 pb-20">
        {isOffline && (
          <Alert variant="destructive" className="rounded-2xl border-rose-100 bg-rose-50 text-rose-800">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle className="font-black uppercase text-[10px] tracking-widest">Network Interrupted</AlertTitle>
            <AlertDescription className="font-medium text-sm">
              We're having trouble reaching the network. Any changes will be synchronized once connection is re-established.
            </AlertDescription>
          </Alert>
        )}

        <input type="file" ref={avatarInputRef} className="hidden" accept="image/*" onChange={handleAvatarChange} />
        <input type="file" ref={coverInputRef} className="hidden" accept="image/*" onChange={handleCoverChange} />

        <form onSubmit={handleSaveProfile} className="space-y-8">
          {/* Visual Header */}
          <div className="relative">
            <div className="h-64 md:h-80 w-full rounded-[2.5rem] bg-slate-200 overflow-hidden relative shadow-lg">
              <img 
                src={currentCover} 
                alt="Cover" 
                className={cn("w-full h-full object-cover transition-opacity duration-300", saving && coverFile ? "opacity-50" : "opacity-100")}
              />
              <Button 
                type="button"
                onClick={() => coverInputRef.current?.click()}
                variant="secondary" 
                className="absolute top-4 right-4 z-10 rounded-xl bg-white/30 hover:bg-white/50 text-white border-white/20 backdrop-blur-md h-10 px-4 font-bold"
              >
                <Camera className="size-4 mr-2" /> Edit Cover
              </Button>
            </div>

            <div className="flex flex-col md:flex-row items-center md:items-end gap-6 px-6 md:px-12 -mt-20 md:-mt-24 relative z-20">
              <div className="relative group/avatar">
                <Avatar className="size-40 md:size-48 border-[6px] border-white shadow-2xl">
                  {currentAvatar ? (
                    <AvatarImage src={currentAvatar} className={cn("object-cover", saving && avatarFile && "opacity-50")} />
                  ) : (
                    <AvatarFallback className="text-4xl font-black bg-indigo-50 text-accent">
                      <UserIcon size={48} />
                    </AvatarFallback>
                  )}
                </Avatar>
                <div className="absolute inset-0 rounded-full bg-black/40 opacity-0 group-hover/avatar:opacity-100 transition-opacity flex items-center justify-center cursor-pointer" onClick={() => avatarInputRef.current?.click()}>
                   <Camera className="size-10 text-white" />
                </div>
              </div>
              <div className="pb-2 text-center md:text-left space-y-1">
                <div className="flex flex-col md:flex-row items-center gap-3">
                  <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">{name || "Business Identity"}</h1>
                  <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200 px-3 py-1 font-black text-[10px] uppercase flex gap-1"><ShieldCheck className="size-3" /> AI Verified Account</Badge>
                </div>
                <p className="text-lg font-bold text-slate-600 flex items-center justify-center md:justify-start gap-2">
                  <Building2 className="size-5 text-indigo-500" /> {category}
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-4">
            <div className="lg:col-span-7 space-y-6">
              <Card className="border-slate-200 shadow-sm rounded-[2rem]">
                <CardHeader className="p-8 pb-4 border-b border-slate-100">
                  <CardTitle className="text-xl font-black flex items-center gap-2"><Globe className="size-5 text-accent" /> Business Overview</CardTitle>
                </CardHeader>
                <CardContent className="p-8 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label className="font-bold text-slate-700">Display Name</Label>
                      <Input value={name} onChange={(e) => setName(e.target.value)} className="rounded-xl h-12" required />
                    </div>
                    <div className="space-y-2">
                      <Label className="font-bold text-slate-700">Industry Sector</Label>
                      <Input value={category} onChange={(e) => setCategory(e.target.value)} className="rounded-xl h-12" />
                    </div>
                    <div className="space-y-2">
                      <Label className="font-bold text-slate-700">Geographic Base</Label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                        <Input value={location} onChange={(e) => setLocation(e.target.value)} className="pl-10 rounded-xl h-12" />
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="font-bold text-slate-700">Mission Statement / Bio</Label>
                    <Textarea value={bio} onChange={(e) => setBio(e.target.value)} className="rounded-xl min-h-[120px]" />
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="lg:col-span-5 space-y-6">
              <Card className="border-slate-200 shadow-sm rounded-[2rem]">
                <CardHeader className="p-8 pb-4">
                  <CardTitle className="text-xl font-black flex items-center gap-2"><Link2 className="size-5 text-accent" /> On Link Here</CardTitle>
                </CardHeader>
                <CardContent className="p-8 pt-0 space-y-4">
                  {[
                    { id: "whatsapp", label: "WhatsApp", icon: <MessageSquare size={16} />, color: "text-emerald-500" },
                    { id: "instagram", label: "Instagram", icon: <Instagram size={16} />, color: "text-pink-500" },
                    { id: "facebook", label: "Facebook", icon: <Facebook size={16} />, color: "text-blue-600" },
                    { id: "tiktok", label: "TikTok", icon: <Globe size={16} />, color: "text-black" },
                    { id: "youtube", label: "YouTube", icon: <Youtube size={16} />, color: "text-red-500" },
                    { id: "linkedin", label: "LinkedIn", icon: <ShieldCheck size={16} />, color: "text-blue-700" },
                    { id: "shopee", label: "Shopee", icon: <ShoppingBag size={16} />, color: "text-orange-500" },
                    { id: "tokopedia", label: "Tokopedia", icon: <ShoppingBag size={16} />, color: "text-emerald-600" },
                  ].map((item) => (
                    <div key={item.id} className="space-y-1">
                      <div className="flex items-center gap-2 px-1">
                        <span className={cn("shrink-0", item.color)}>{item.icon}</span>
                        <Label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">{item.label}</Label>
                      </div>
                      <Input 
                        value={(links as any)[item.id]} 
                        onChange={(e) => setLinks({...links, [item.id]: e.target.value})} 
                        placeholder={`Username/ID`} 
                        className="rounded-xl h-10 text-xs bg-slate-50/50 focus:bg-white"
                      />
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Button type="submit" disabled={saving} className="w-full h-16 rounded-[1.5rem] bg-accent text-white font-black text-xl shadow-xl flex gap-3 transition-all active:scale-95">
                {saving ? <><RefreshCw className="size-6 animate-spin" /> Synchronizing...</> : <><Save className="size-6" /> Synchronize Profile</>}
              </Button>
            </div>
          </div>
        </form>

        {/* Catalog Section */}
        <div className="pt-10 space-y-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2 bg-indigo-50 text-accent px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest w-fit"><ShoppingBag className="size-3" /> Business Catalog</div>
              <h2 className="text-3xl font-black text-slate-900 tracking-tight">Portfolio & Products</h2>
              <p className="text-slate-500 font-medium">Showcase your high-value offerings to the network.</p>
            </div>
            
            <Dialog open={isProductModalOpen} onOpenChange={setIsProductModalOpen}>
              <DialogTrigger asChild>
                <Button className="rounded-2xl bg-slate-900 text-white h-14 px-8 font-black shadow-xl flex gap-2 transition-all active:scale-95">
                  <Plus className="size-5" /> Add New Entry
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-xl rounded-[2.5rem] p-0 overflow-hidden border-none shadow-2xl">
                <DialogHeader className="p-8 pb-4 bg-slate-50">
                  <DialogTitle className="text-2xl font-black text-slate-900 tracking-tight">
                    {editingProduct ? "Update Entry" : "New Catalog Entry"}
                  </DialogTitle>
                </DialogHeader>
                <div className="p-8 space-y-6">
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2 col-span-2">
                      <Label className="font-bold">Entry Name</Label>
                      <Input value={newProduct.name} onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })} className="rounded-xl h-12" />
                    </div>
                    <div className="space-y-2">
                      <Label className="font-bold">Category</Label>
                      <Select value={newProduct.category} onValueChange={(val) => setNewProduct({ ...newProduct, category: val })}>
                        <SelectTrigger className="rounded-xl h-12"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Software">Software</SelectItem>
                          <SelectItem value="Hardware">Hardware</SelectItem>
                          <SelectItem value="Service">Professional Service</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label className="font-bold">Price Estimate ($)</Label>
                      <Input type="number" value={newProduct.price} onChange={(e) => setNewProduct({ ...newProduct, price: Number(e.target.value) })} className="rounded-xl h-12" />
                    </div>
                    <div className="space-y-2 col-span-2">
                      <Label className="font-bold">Specifications</Label>
                      <Textarea value={newProduct.description} onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })} className="rounded-xl min-h-[100px]" />
                    </div>
                  </div>
                </div>
                <DialogFooter className="p-8 pt-0 flex gap-3">
                  <Button variant="ghost" onClick={() => setIsProductModalOpen(false)} className="rounded-xl h-12 px-6 font-bold">Cancel</Button>
                  <Button onClick={handleAddOrEditProduct} className="rounded-xl bg-accent text-white h-12 px-10 font-black shadow-lg">Confirm Entry</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {productsLoading ? (
              [1, 2, 3].map(i => <Skeleton key={i} className="h-80 rounded-[2.5rem]" />)
            ) : (products || []).length === 0 ? (
              <div className="col-span-full p-20 text-center border-2 border-dashed rounded-[3rem] bg-slate-50/50 border-slate-200">
                <ShoppingBag className="size-16 text-slate-200 mx-auto mb-4" />
                <p className="font-black text-slate-400 uppercase tracking-widest text-xs">No active catalog entries found.</p>
              </div>
            ) : (
              products.map((p) => (
                <Card key={p.id} className="group overflow-hidden border-slate-200 shadow-sm hover:shadow-2xl transition-all rounded-[2.5rem] bg-white">
                  <div className="aspect-[4/3] w-full relative overflow-hidden">
                    <img src={p.imageUrl} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    <div className="absolute top-4 left-4">
                      <Badge className="bg-white/90 backdrop-blur-sm text-slate-900 border-none font-black text-[10px] px-3 py-1 shadow-md uppercase tracking-tight">
                        {p.category}
                      </Badge>
                    </div>
                  </div>
                  <CardHeader className="p-6">
                    <CardTitle className="text-xl font-black text-slate-900 truncate">{p.name}</CardTitle>
                    <div className="text-lg font-black text-indigo-600">${Number(p.price).toLocaleString()}</div>
                  </CardHeader>
                  <CardContent className="px-6 pb-6">
                    <p className="text-sm text-slate-500 font-medium line-clamp-2 h-10 leading-relaxed">{p.description}</p>
                  </CardContent>
                  <CardFooter className="px-4 py-4 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between">
                    <Button variant="ghost" size="sm" onClick={() => openEditModal(p)} className="font-bold text-slate-500 hover:text-accent gap-2 rounded-lg">
                      <Pencil className="size-3.5" /> Edit
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleDeleteProduct(p.id)} className="font-bold text-rose-400 hover:text-rose-600 gap-2 rounded-lg">
                      <Trash2 className="size-3.5" /> Remove
                    </Button>
                  </CardFooter>
                </Card>
              ))
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
