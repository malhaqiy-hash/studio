
"use client";

import * as React from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Building2, 
  MapPin, 
  Globe, 
  ShieldCheck, 
  Camera,
  Instagram,
  Facebook,
  Youtube,
  Linkedin,
  Twitter,
  Save,
  Loader2,
  Trash2,
  Plus,
  Pencil,
  ShoppingBag,
  Link as LinkIcon,
  RefreshCw,
  Sparkles
} from "lucide-react";
import { useUser, useFirestore, useStorage, useCollection } from "@/firebase";
import { doc, setDoc, getDoc, collection, query, where, addDoc, updateDoc, deleteDoc, serverTimestamp } from "firebase/firestore";
import { ref as storageRef, uploadBytes, getDownloadURL } from "firebase/storage";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
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
import { Skeleton } from "@/components/ui/skeleton";

// Custom Brand Icons (SVGs)
const TikTokIcon = () => (
  <svg className="size-4" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.06-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.9-.32-1.89-.39-2.82-.2-.79.14-1.53.53-2.08 1.11-.53.54-.86 1.25-.97 2.01-.13.71-.08 1.45.15 2.13.26.78.78 1.48 1.48 1.92.83.5 1.81.65 2.76.43 1.12-.22 2.13-.96 2.66-1.98.31-.58.46-1.23.47-1.89l.01-10.32Z"/>
  </svg>
);

const WhatsAppIcon = () => (
  <svg className="size-4" viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.72.937 3.659 1.435 5.623 1.436h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
  </svg>
);

const ShopeeIcon = () => (
  <svg className="size-4" viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.43 5.42l-.57-.57c-.12-.12-.31-.12-.43 0l-.57.57c-.12.12-.12.31 0 .43l.57.57c.12.12.31.12.43 0l.57-.57c.12-.12.12-.31 0-.43zm-3.07-2.64l-.57-.57c-.12-.12-.31-.12-.43 0l-.57.57c-.12.12-.12.31 0 .43l.57.57c.12.12.31.12.43 0l.57-.57c.12-.12.12-.31 0-.43zM12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.41 12.37c-.33 1.14-1.04 2.1-1.99 2.72-.94.62-2.07.94-3.23.94-1.16 0-2.29-.32-3.23-.94-.95-.62-1.66-1.58-1.99-2.72-.34-1.14-.34-2.35 0-3.49.33-1.14 1.04-2.1 1.99-2.72.94-.62 2.07-.94 3.23-.94 1.16 0 2.29.32 3.23.94.95.62 1.66 1.58 1.99 2.72.34 1.14.34 2.35 0 3.49z"/>
  </svg>
);

const TokopediaIcon = () => (
  <svg className="size-4" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-11h2v2h-2zm0 4h2v5h-2z"/>
  </svg>
);

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
  const { user } = useUser();
  const db = useFirestore();
  const storage = useStorage();
  const { toast } = useToast();

  const [initialLoading, setInitialLoading] = React.useState(true);
  const [saving, setSaving] = React.useState(false);
  
  const [avatarFile, setAvatarFile] = React.useState<File | null>(null);
  const [coverFile, setCoverFile] = React.useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = React.useState<string | null>(null);
  const [coverPreview, setCoverPreview] = React.useState<string | null>(null);

  const avatarInputRef = React.useRef<HTMLInputElement>(null);
  const coverInputRef = React.useRef<HTMLInputElement>(null);

  const [profile, setProfile] = React.useState({
    companyName: "Alpha Tech Solutions",
    category: "SaaS & AI Infrastructure",
    description: "A leading provider of enterprise AI solutions and cloud infrastructure for the manufacturing sector.",
    location: "Jakarta, Indonesia",
    website: "https://alphatech.example.com",
    email: "",
    avatarUrl: "",
    coverUrl: "",
  });

  const [socialLinks, setSocialLinks] = React.useState({
    whatsapp: "",
    instagram: "",
    facebook: "",
    tiktok: "",
    youtube: "",
    shopee: "",
    tokopedia: "",
    linkedin: "",
  });

  // Real-time products fetching
  const productsQuery = React.useMemo(() => {
    if (!db || !user) return null;
    return query(collection(db, "products"), where("userId", "==", user.uid));
  }, [db, user]);

  const { data: products, loading: productsLoading } = useCollection<Product>(productsQuery);

  const [isProductModalOpen, setIsProductModalOpen] = React.useState(false);
  const [editingProduct, setEditingProduct] = React.useState<Product | null>(null);
  const [newProduct, setNewProduct] = React.useState<Omit<Product, "id" | "userId">>({
    name: "",
    category: "Software",
    price: 0,
    description: "",
    imageUrl: ""
  });

  // Fetch data on mount
  React.useEffect(() => {
    if (!user || !db) return;

    async function loadProfile() {
      try {
        const userRef = doc(db, "users", user.uid);
        const snap = await getDoc(userRef);
        if (snap.exists()) {
          const data = snap.data();
          if (data.profile) setProfile(prev => ({ ...prev, ...data.profile }));
          if (data.socialLinks) setSocialLinks(prev => ({ ...prev, ...data.socialLinks }));
        }
      } catch (err) {
        console.error("Error loading profile:", err);
      } finally {
        setInitialLoading(false);
      }
    }

    loadProfile();
  }, [user, db]);

  // Handle Hydration mismatches for dynamic values
  React.useEffect(() => {
    setProfile(prev => ({
      ...prev,
      email: user?.email || "",
      avatarUrl: prev.avatarUrl || `https://picsum.photos/seed/${user?.uid || '123'}/400`,
      coverUrl: prev.coverUrl || "https://picsum.photos/seed/cover88/1600/800"
    }));
    setNewProduct(prev => ({
      ...prev,
      imageUrl: prev.imageUrl || `https://picsum.photos/seed/${Math.random()}/400/300`
    }));
  }, [user]);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      const url = URL.createObjectURL(file);
      setAvatarPreview(url);
    }
  };

  const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCoverFile(file);
      const url = URL.createObjectURL(file);
      setCoverPreview(url);
    }
  };

  const uploadFile = async (file: File, path: string) => {
    const fileRef = storageRef(storage, path);
    await uploadBytes(fileRef, file);
    return getDownloadURL(fileRef);
  };

  const handleSaveProfile = async () => {
    if (!user || !db || !storage) return;
    setSaving(true);
    try {
      let finalAvatarUrl = profile.avatarUrl;
      let finalCoverUrl = profile.coverUrl;
      
      if (avatarFile) finalAvatarUrl = await uploadFile(avatarFile, `profiles/${user.uid}/avatar`);
      if (coverFile) finalCoverUrl = await uploadFile(coverFile, `profiles/${user.uid}/cover`);
      
      const userRef = doc(db, "users", user.uid);
      await setDoc(userRef, { 
        profile: { ...profile, avatarUrl: finalAvatarUrl, coverUrl: finalCoverUrl }, 
        socialLinks, 
        updatedAt: new Date().toISOString() 
      }, { merge: true });
      
      setAvatarFile(null);
      setCoverFile(null);
      setAvatarPreview(null);
      setCoverPreview(null);
      
      setProfile(prev => ({ ...prev, avatarUrl: finalAvatarUrl, coverUrl: finalCoverUrl }));
      toast({ title: "Profile Synchronized", description: "Your business ecosystem profile has been successfully secured." });
    } catch (err: any) {
      console.error(err);
      toast({ variant: "destructive", title: "Synchronization Failed", description: err.message || "An error occurred." });
    } finally {
      setSaving(false);
    }
  };

  const handleAddOrEditProduct = async () => {
    if (!user || !db) return;
    
    try {
      if (editingProduct) {
        const productRef = doc(db, "products", editingProduct.id);
        updateDoc(productRef, {
          ...newProduct,
          updatedAt: serverTimestamp()
        }).catch(e => console.error("Update product error", e));
        toast({ title: "Product Updated", description: `${newProduct.name} has been updated.` });
      } else {
        addDoc(collection(db, "products"), {
          ...newProduct,
          userId: user.uid,
          createdAt: serverTimestamp()
        }).catch(e => console.error("Add product error", e));
        toast({ title: "Product Added", description: `${newProduct.name} is now live.` });
      }
      setIsProductModalOpen(false);
      setEditingProduct(null);
      setNewProduct({ name: "", category: "Software", price: 0, description: "", imageUrl: `https://picsum.photos/seed/${Math.random()}/400/300` });
    } catch (err: any) {
      console.error(err);
      toast({ variant: "destructive", title: "Action Failed", description: "Could not save product." });
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (!db) return;
    try {
      deleteDoc(doc(db, "products", id)).catch(e => console.error("Delete product error", e));
      toast({ title: "Product Removed", description: "Item has been removed from your catalog." });
    } catch (err: any) {
      console.error(err);
      toast({ variant: "destructive", title: "Delete Failed", description: "Could not remove item." });
    }
  };

  const openEditModal = (product: Product) => {
    setEditingProduct(product);
    setNewProduct({ name: product.name, category: product.category, price: product.price, description: product.description, imageUrl: product.imageUrl });
    setIsProductModalOpen(true);
  };

  const socialPlatforms = [
    { key: "whatsapp", label: "WhatsApp", icon: WhatsAppIcon, color: "text-emerald-500", prefix: "https://wa.me/" },
    { key: "instagram", label: "Instagram", icon: Instagram, color: "text-pink-500", prefix: "https://instagram.com/" },
    { key: "facebook", label: "Facebook", icon: Facebook, color: "text-blue-600", prefix: "https://facebook.com/" },
    { key: "tiktok", label: "TikTok", icon: TikTokIcon, color: "text-slate-900", prefix: "https://tiktok.com/@" },
    { key: "youtube", label: "YouTube", icon: Youtube, color: "text-red-600", prefix: "https://youtube.com/@" },
    { key: "shopee", label: "Shopee", icon: ShopeeIcon, color: "text-orange-500", prefix: "https://shopee.co.id/" },
    { key: "tokopedia", label: "Tokopedia", icon: TokopediaIcon, color: "text-emerald-600", prefix: "https://tokopedia.com/" },
    { key: "linkedin", label: "LinkedIn", icon: Linkedin, color: "text-indigo-700", prefix: "https://linkedin.com/in/" },
  ] as const;

  if (initialLoading) {
    return (
      <DashboardLayout>
        <div className="max-w-6xl mx-auto space-y-10">
          <Skeleton className="h-64 md:h-80 w-full rounded-[2.5rem]" />
          <div className="flex flex-col md:flex-row gap-6 px-12 -mt-24">
            <Skeleton className="size-40 md:size-48 rounded-full border-[6px] border-white" />
            <div className="mt-24 md:mt-0 space-y-4 flex-1">
              <Skeleton className="h-10 w-64" />
              <Skeleton className="h-6 w-48" />
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto space-y-8 pb-20">
        
        <input type="file" ref={avatarInputRef} className="hidden" accept="image/*" onChange={handleAvatarChange} />
        <input type="file" ref={coverInputRef} className="hidden" accept="image/*" onChange={handleCoverChange} />

        {/* Profile Header */}
        <div className="relative">
          <div className="h-64 md:h-80 w-full rounded-[2.5rem] bg-slate-200 overflow-hidden relative shadow-lg">
            <img 
              src={coverPreview || profile.coverUrl} 
              alt="Cover" 
              className={cn("w-full h-full object-cover transition-opacity duration-300", (saving && coverFile) ? "opacity-50" : "opacity-100")}
            />
            <Button 
              onClick={() => coverInputRef.current?.click()}
              disabled={saving}
              variant="secondary" 
              className="absolute top-4 right-4 z-10 rounded-xl bg-white/30 hover:bg-white/50 text-white border-white/20 backdrop-blur-md h-10 px-4 font-bold"
            >
              <Camera className="size-4 mr-2" /> Edit Sampul
            </Button>
          </div>

          <div className="flex flex-col md:flex-row items-center md:items-end gap-6 px-6 md:px-12 -mt-20 md:-mt-24 relative z-20">
            <div className="relative group/avatar">
              <Avatar className="size-40 md:size-48 border-[6px] border-white shadow-2xl">
                <AvatarImage src={avatarPreview || profile.avatarUrl} className={cn("object-cover", (saving && avatarFile) && "opacity-50")} />
                <AvatarFallback className="text-4xl font-black bg-indigo-50 text-accent">AT</AvatarFallback>
              </Avatar>
              <div className="absolute inset-0 rounded-full bg-black/40 opacity-0 group-hover/avatar:opacity-100 transition-opacity flex items-center justify-center">
                <Button onClick={() => avatarInputRef.current?.click()} disabled={saving} variant="ghost" size="icon" className="size-12 rounded-full bg-white text-slate-900 shadow-lg"><Camera className="size-6" /></Button>
              </div>
            </div>
            <div className="pb-2 text-center md:text-left space-y-2 bg-white/80 md:bg-transparent backdrop-blur-sm p-4 rounded-3xl md:p-0">
              <div className="flex flex-col md:flex-row items-center gap-3">
                <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">{profile.companyName}</h1>
                <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200 px-3 py-1 font-black text-[10px] uppercase flex gap-1"><ShieldCheck className="size-3" /> Verified Account</Badge>
              </div>
              <p className="text-lg font-bold text-slate-600 flex items-center justify-center md:justify-start gap-2"><Building2 className="size-5 text-indigo-500" /> {profile.category}</p>
            </div>
          </div>
        </div>

        <div className="pt-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-7 space-y-8">
            <Card className="border-slate-200 shadow-sm rounded-[2rem]">
              <CardHeader className="p-8 pb-4 border-b border-slate-50">
                <CardTitle className="text-xl font-black flex items-center gap-2"><Globe className="size-5 text-accent" /> Identitas Bisnis Global</CardTitle>
              </CardHeader>
              <CardContent className="p-8 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2"><Label className="font-bold text-slate-700">Nama Organisasi</Label><Input value={profile.companyName} onChange={(e) => setProfile({...profile, companyName: e.target.value})} className="rounded-xl" /></div>
                  <div className="space-y-2"><Label className="font-bold text-slate-700">Industri Utama</Label><Input value={profile.category} onChange={(e) => setProfile({...profile, category: e.target.value})} className="rounded-xl" /></div>
                  <div className="space-y-2"><Label className="font-bold text-slate-700">Kantor Pusat</Label><div className="relative"><MapPin className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" /><Input value={profile.location} onChange={(e) => setProfile({...profile, location: e.target.value})} className="pl-10 rounded-xl" /></div></div>
                  <div className="space-y-2"><Label className="font-bold text-slate-700">Situs Web Resmi</Label><div className="relative"><Globe className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" /><Input value={profile.website} onChange={(e) => setProfile({...profile, website: e.target.value})} className="pl-10 rounded-xl" /></div></div>
                </div>
                <div className="space-y-2"><Label className="font-bold text-slate-700">Gambaran Bisnis</Label><Textarea value={profile.description} onChange={(e) => setProfile({...profile, description: e.target.value})} className="rounded-xl min-h-[120px]" /></div>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-5 space-y-8">
            <Card className="border-slate-200 shadow-sm rounded-[2rem]">
              <CardHeader className="p-8 pb-4">
                <CardTitle className="text-xl font-black flex items-center gap-2"><LinkIcon className="size-5 text-accent" /> On Link Here</CardTitle>
              </CardHeader>
              <CardContent className="p-8 pt-0 space-y-6">
                <div className="space-y-4">
                  {socialPlatforms.map((p) => (
                    <div key={p.key} className="space-y-1.5">
                      <Label className="text-[10px] font-black uppercase text-slate-400">{p.label}</Label>
                      <div className="relative">
                        <div className={cn("absolute left-4 top-1/2 -translate-y-1/2", p.color)}><p.icon /></div>
                        <Input value={socialLinks[p.key as keyof typeof socialLinks]} onChange={(e) => setSocialLinks({...socialLinks, [p.key]: e.target.value})} placeholder={`Username/ID`} className="pl-12 rounded-xl" />
                      </div>
                    </div>
                  ))}
                </div>
                <div className="pt-6 border-t border-slate-100 flex flex-wrap gap-3">
                  {socialPlatforms.map((p) => {
                    const val = socialLinks[p.key as keyof typeof socialLinks];
                    if (!val) return null;
                    return (
                      <a key={p.key} href={`${p.prefix}${val}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 p-2 pr-3 rounded-xl bg-slate-50 border border-slate-100 hover:shadow-lg transition-all">
                        <div className={cn("size-8 rounded-lg bg-white shadow-sm flex items-center justify-center", p.color)}><p.icon /></div>
                        <span className="text-xs font-bold text-slate-600">{val}</span>
                      </a>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
            <Button onClick={handleSaveProfile} disabled={saving} className="w-full h-16 rounded-[1.5rem] bg-accent text-white font-black text-xl shadow-xl flex gap-3">
              {saving ? <><Loader2 className="size-6 animate-spin" /> Menyinkronkan...</> : <><Save className="size-6" /> Simpan Profil</>}
            </Button>
          </div>
        </div>

        {/* Business Catalog Section */}
        <div className="pt-10 space-y-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2 bg-indigo-50 text-accent px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest w-fit"><ShoppingBag className="size-3" /> Marketplace Jaringan</div>
              <h2 className="text-3xl font-black text-slate-900 tracking-tight">Katalog Bisnis</h2>
              <p className="text-slate-500 font-medium">Kelola produk dan layanan yang terlihat di jaringan global.</p>
            </div>
            
            <Dialog open={isProductModalOpen} onOpenChange={setIsProductModalOpen}>
              <DialogTrigger asChild>
                <Button className="rounded-2xl bg-slate-900 text-white h-14 px-8 font-black shadow-xl flex gap-2"><Plus className="size-5" /> Tambah Produk</Button>
              </DialogTrigger>
              <DialogContent className="max-w-xl rounded-[2.5rem] p-0 overflow-hidden border-none shadow-2xl">
                <DialogHeader className="p-8 pb-4 bg-slate-50">
                  <DialogTitle className="text-2xl font-black text-slate-900 tracking-tight">{editingProduct ? "Edit Produk" : "Entri Katalog Baru"}</DialogTitle>
                </DialogHeader>
                <div className="p-8 space-y-6">
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2"><
