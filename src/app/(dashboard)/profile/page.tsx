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
  Mail, 
  MapPin, 
  Globe, 
  Calendar, 
  ShieldCheck, 
  Camera,
  Instagram,
  Facebook,
  Youtube,
  Linkedin,
  Twitter,
  ExternalLink,
  Save,
  Loader2,
  CheckCircle2,
  Trash2,
  Plus,
  Package,
  Pencil,
  Tag,
  ShoppingBag,
  Briefcase
} from "lucide-react";
import { useUser, useFirestore } from "@/firebase";
import { doc, setDoc } from "firebase/firestore";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogDescription,
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

// Custom Brand Icons (SVGs) for missing Lucide icons
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
  name: string;
  category: string;
  price: number;
  description: string;
  imageUrl: string;
}

export default function ProfilePage() {
  const { user } = useUser();
  const db = useFirestore();
  const { toast } = useToast();

  const [saving, setSaving] = React.useState(false);
  const [updatingCover, setUpdatingCover] = React.useState(false);
  const [updatingAvatar, setUpdatingAvatar] = React.useState(false);

  // Form State
  const [profile, setProfile] = React.useState({
    companyName: "Alpha Tech Solutions",
    category: "SaaS & AI Infrastructure",
    description: "A leading provider of enterprise AI solutions and cloud infrastructure for the manufacturing sector. Focused on industrial efficiency and global networking.",
    location: "Jakarta, Indonesia",
    website: "https://alphatech.example.com",
    email: user?.email || "",
  });

  const [socialLinks, setSocialLinks] = React.useState({
    whatsapp: "+628123456789",
    instagram: "alphatech_official",
    facebook: "AlphaTechEnterprise",
    tiktok: "alphatech.biz",
    youtube: "AlphaTechMedia",
    shopee: "alphatech_store",
    tokopedia: "alphatech-solutions",
    linkedin: "alpha-tech-solutions",
  });

  // Business Catalog State
  const [products, setProducts] = React.useState<Product[]>([
    {
      id: "1",
      name: "Enterprise AI Dashboard",
      category: "Software",
      price: 15000000,
      description: "Full-scale analytics and predictive maintenance dashboard for industrial facilities.",
      imageUrl: "https://picsum.photos/seed/p1/400/300"
    },
    {
      id: "2",
      name: "Cloud Node Cluster",
      category: "Hardware",
      price: 45000000,
      description: "High-performance edge computing cluster for real-time manufacturing data processing.",
      imageUrl: "https://picsum.photos/seed/p2/400/300"
    }
  ]);

  const [isProductModalOpen, setIsProductModalOpen] = React.useState(false);
  const [editingProduct, setEditingProduct] = React.useState<Product | null>(null);
  const [newProduct, setNewProduct] = React.useState<Omit<Product, "id">>({
    name: "",
    category: "Software",
    price: 0,
    description: "",
    imageUrl: `https://picsum.photos/seed/${Math.random()}/400/300`
  });

  const handleSaveProfile = async () => {
    if (!user || !db) return;
    setSaving(true);
    
    // Simulate API delay
    await new Promise(r => setTimeout(r, 1500));
    
    try {
      const userRef = doc(db, "users", user.uid);
      await setDoc(userRef, { 
        profile, 
        socialLinks, 
        products,
        updatedAt: new Date().toISOString() 
      }, { merge: true });
      
      toast({
        title: "Profile Synchronized",
        description: "Your business ecosystem profile has been successfully updated in Firestore.",
      });
    } catch (err) {
      console.error(err);
      toast({
        variant: "destructive",
        title: "Synchronization Failed",
        description: "An error occurred while saving your profile.",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleUpdateCover = () => {
    setUpdatingCover(true);
    setTimeout(() => {
      setUpdatingCover(false);
      toast({ title: "Cover Photo Updated", description: "New branding assets applied to your profile header." });
    }, 1200);
  };

  const handleUpdateAvatar = () => {
    setUpdatingAvatar(true);
    setTimeout(() => {
      setUpdatingAvatar(false);
      toast({ title: "Avatar Updated", description: "Your profile identification photo has been refreshed." });
    }, 1000);
  };

  const handleAddOrEditProduct = () => {
    if (editingProduct) {
      setProducts(prev => prev.map(p => p.id === editingProduct.id ? { ...newProduct, id: p.id } : p));
      toast({ title: "Product Updated", description: `${newProduct.name} has been updated in your catalog.` });
    } else {
      const productToAdd: Product = {
        ...newProduct,
        id: Math.random().toString(36).substr(2, 9)
      };
      setProducts(prev => [...prev, productToAdd]);
      toast({ title: "Product Added", description: `${newProduct.name} is now live in your catalog.` });
    }
    setIsProductModalOpen(false);
    setEditingProduct(null);
    setNewProduct({
      name: "",
      category: "Software",
      price: 0,
      description: "",
      imageUrl: `https://picsum.photos/seed/${Math.random()}/400/300`
    });
  };

  const handleDeleteProduct = (id: string) => {
    setProducts(prev => prev.filter(p => p.id !== id));
    toast({ title: "Product Removed", description: "Item has been removed from your catalog." });
  };

  const openEditModal = (product: Product) => {
    setEditingProduct(product);
    setNewProduct({
      name: product.name,
      category: product.category,
      price: product.price,
      description: product.description,
      imageUrl: product.imageUrl
    });
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

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto space-y-10 pb-20">
        
        {/* Header Section */}
        <div className="relative group">
          <div className="h-64 md:h-80 w-full rounded-[2.5rem] bg-gradient-to-br from-indigo-600 via-accent to-indigo-900 overflow-hidden relative shadow-2xl">
            <img 
              src="https://picsum.photos/seed/cover88/1600/800" 
              alt="Cover" 
              className="w-full h-full object-cover opacity-60 mix-blend-overlay"
            />
            <div className="absolute inset-0 bg-black/10 transition-colors group-hover:bg-black/20" />
            <Button 
              onClick={handleUpdateCover}
              disabled={updatingCover}
              variant="secondary" 
              className="absolute top-6 right-6 rounded-2xl bg-white/10 hover:bg-white/20 text-white border-white/20 backdrop-blur-md h-11 px-6 font-bold shadow-xl"
            >
              {updatingCover ? <Loader2 className="size-4 mr-2 animate-spin" /> : <Camera className="size-4 mr-2" />}
              Edit Cover Photo
            </Button>
          </div>

          <div className="absolute -bottom-16 left-10 md:left-20 flex flex-col md:flex-row items-end gap-6">
            <div className="relative group/avatar">
              <Avatar className="size-40 md:size-48 border-8 border-white shadow-2xl ring-4 ring-slate-100/50">
                <AvatarImage src={`https://picsum.photos/seed/${user?.uid || '123'}/400`} className="object-cover" />
                <AvatarFallback className="text-4xl font-black bg-indigo-50 text-accent">AT</AvatarFallback>
              </Avatar>
              <div className="absolute inset-0 rounded-full bg-black/40 opacity-0 group-hover/avatar:opacity-100 transition-opacity flex items-center justify-center">
                <Button 
                  onClick={handleUpdateAvatar}
                  disabled={updatingAvatar}
                  variant="ghost" 
                  size="icon" 
                  className="size-12 rounded-full bg-white text-slate-900 hover:bg-slate-50 shadow-lg"
                >
                  {updatingAvatar ? <Loader2 className="size-5 animate-spin" /> : <Camera className="size-6" />}
                </Button>
              </div>
            </div>
            <div className="pb-4 space-y-1 text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start gap-3">
                <h1 className="text-4xl font-black text-slate-900 tracking-tight">{profile.companyName}</h1>
                <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200 px-3 py-1 font-black text-[10px] uppercase flex gap-1">
                  <ShieldCheck className="size-3" /> Verified Account
                </Badge>
              </div>
              <p className="text-lg font-bold text-slate-500 flex items-center justify-center md:justify-start gap-2">
                <Building2 className="size-5 text-indigo-400" />
                {profile.category}
              </p>
            </div>
          </div>
        </div>

        <div className="pt-20 grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Main Info Column */}
          <div className="lg:col-span-7 space-y-8">
            <Card className="border-slate-200 shadow-sm rounded-[2rem] overflow-hidden">
              <CardHeader className="p-8 pb-4">
                <CardTitle className="text-xl font-black flex items-center gap-2">
                  <Globe className="size-5 text-accent" />
                  General Business Identity
                </CardTitle>
                <CardDescription className="font-medium">Update your core business information for the global directory.</CardDescription>
              </CardHeader>
              <CardContent className="p-8 pt-0 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="font-bold text-slate-700">Organization Name</Label>
                    <Input 
                      value={profile.companyName} 
                      onChange={(e) => setProfile({...profile, companyName: e.target.value})}
                      className="rounded-xl border-slate-200 h-12 bg-slate-50/50"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="font-bold text-slate-700">Primary Industry</Label>
                    <Input 
                      value={profile.category} 
                      onChange={(e) => setProfile({...profile, category: e.target.value})}
                      className="rounded-xl border-slate-200 h-12 bg-slate-50/50"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="font-bold text-slate-700">Global Headquarters</Label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                      <Input 
                        value={profile.location} 
                        onChange={(e) => setProfile({...profile, location: e.target.value})}
                        className="pl-10 rounded-xl border-slate-200 h-12 bg-slate-50/50"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="font-bold text-slate-700">Official Website</Label>
                    <div className="relative">
                      <Globe className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                      <Input 
                        value={profile.website} 
                        onChange={(e) => setProfile({...profile, website: e.target.value})}
                        className="pl-10 rounded-xl border-slate-200 h-12 bg-slate-50/50"
                      />
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="font-bold text-slate-700">Business Overview</Label>
                  <Textarea 
                    value={profile.description}
                    onChange={(e) => setProfile({...profile, description: e.target.value})}
                    className="rounded-xl border-slate-200 min-h-[120px] bg-slate-50/50 font-medium leading-relaxed"
                  />
                </div>
              </CardContent>
            </Card>

            <div className="bg-slate-900 rounded-[2.5rem] p-10 text-white relative overflow-hidden shadow-2xl">
              <div className="relative z-10 space-y-6">
                <div className="size-16 rounded-2xl bg-accent flex items-center justify-center shadow-lg rotate-3">
                  <ShieldCheck className="size-8 text-white" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-2xl font-black tracking-tight">Security & Verification</h3>
                  <p className="text-slate-400 font-medium leading-relaxed">
                    Your enterprise verification is valid until <span className="text-white">December 2025</span>. Maintain complete profile details to ensure a high match score in the global search engine.
                  </p>
                </div>
                <Button variant="outline" className="rounded-xl border-white/20 text-white hover:bg-white/10 h-12 px-8 font-bold">
                  View Certificates
                </Button>
              </div>
              <div className="absolute top-0 right-0 w-64 h-64 bg-accent/20 rounded-full blur-[80px] -mr-32 -mt-32" />
            </div>
          </div>

          {/* Social Links Sidebar */}
          <div className="lg:col-span-5 space-y-8">
            <Card className="border-slate-200 shadow-sm rounded-[2rem] overflow-hidden">
              <CardHeader className="p-8 pb-4">
                <CardTitle className="text-xl font-black flex items-center gap-2">
                  <Plus className="size-5 text-accent" />
                  E-Commerce & Social Hub
                </CardTitle>
                <CardDescription className="font-medium">Connect your sales channels and social footprints.</CardDescription>
              </CardHeader>
              <CardContent className="p-8 pt-0 space-y-6">
                <div className="space-y-4">
                  {socialPlatforms.map((platform) => (
                    <div key={platform.key} className="space-y-1.5 group">
                      <div className="flex justify-between items-center px-1">
                        <Label className="text-xs font-black uppercase tracking-widest text-slate-400 group-focus-within:text-accent transition-colors">
                          {platform.label} Handle/UID
                        </Label>
                      </div>
                      <div className="relative">
                        <div className={cn("absolute left-4 top-1/2 -translate-y-1/2 transition-transform group-focus-within:scale-110", platform.color)}>
                          <platform.icon />
                        </div>
                        <Input 
                          value={socialLinks[platform.key as keyof typeof socialLinks]}
                          onChange={(e) => setSocialLinks({...socialLinks, [platform.key]: e.target.value})}
                          placeholder={`Enter your ${platform.label} link...`}
                          className="pl-12 rounded-xl border-slate-200 h-11 bg-slate-50/30 font-medium focus:bg-white"
                        />
                      </div>
                    </div>
                  ))}
                </div>

                <div className="pt-6 border-t border-slate-100">
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4">Live Discovery Preview</h4>
                  <div className="flex flex-wrap gap-3">
                    {socialPlatforms.map((platform) => {
                      const val = socialLinks[platform.key as keyof typeof socialLinks];
                      if (!val) return null;
                      return (
                        <a 
                          key={platform.key}
                          href={`${platform.prefix}${val}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 p-2 pr-4 rounded-xl bg-slate-50 border border-slate-100 hover:border-accent hover:bg-white hover:shadow-lg transition-all active:scale-95 group"
                        >
                          <div className={cn("size-8 rounded-lg bg-white shadow-sm flex items-center justify-center", platform.color)}>
                            <platform.icon />
                          </div>
                          <span className="text-xs font-bold text-slate-600 group-hover:text-accent truncate max-w-[100px]">{val}</span>
                          <ExternalLink className="size-3 text-slate-300 group-hover:text-accent" />
                        </a>
                      );
                    })}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Button 
              onClick={handleSaveProfile}
              disabled={saving}
              className="w-full h-16 rounded-[1.5rem] bg-accent hover:bg-indigo-600 text-white font-black text-xl shadow-2xl shadow-indigo-100 transition-all active:scale-[0.98] flex gap-3"
            >
              {saving ? (
                <>
                  <Loader2 className="size-6 animate-spin" />
                  Saving to Firestore...
                </>
              ) : (
                <>
                  <Save className="size-6" />
                  Synchronize Profile
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Business Catalog / Product Management Section */}
        <div className="pt-10 space-y-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2 bg-indigo-50 text-accent px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest w-fit border border-indigo-100">
                <ShoppingBag className="size-3" />
                Network Marketplace
              </div>
              <h2 className="text-3xl font-black text-slate-900 tracking-tight">Business Catalog</h2>
              <p className="text-slate-500 font-medium">Manage your products and services visible to the global network.</p>
            </div>
            
            <Dialog open={isProductModalOpen} onOpenChange={setIsProductModalOpen}>
              <DialogTrigger asChild>
                <Button className="rounded-2xl bg-slate-900 hover:bg-black text-white h-14 px-8 font-black shadow-xl flex gap-2">
                  <Plus className="size-5" />
                  Add Product/Service
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-xl rounded-[2.5rem] p-0 border-none shadow-2xl overflow-hidden">
                <DialogHeader className="p-8 pb-4 bg-slate-50">
                  <DialogTitle className="text-2xl font-black text-slate-900 tracking-tight">
                    {editingProduct ? "Edit Product" : "New Catalog Entry"}
                  </DialogTitle>
                  <DialogDescription className="font-medium">
                    Showcase your value proposition to potential strategic partners.
                  </DialogDescription>
                </DialogHeader>
                <div className="p-8 space-y-6">
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label className="font-bold text-slate-700">Product Name</Label>
                      <Input 
                        value={newProduct.name}
                        onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                        placeholder="e.g. AI Controller v2"
                        className="rounded-xl border-slate-200 h-12"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="font-bold text-slate-700">Category</Label>
                      <Select 
                        value={newProduct.category}
                        onValueChange={(val) => setNewProduct({ ...newProduct, category: val })}
                      >
                        <SelectTrigger className="rounded-xl border-slate-200 h-12">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Software">Software</SelectItem>
                          <SelectItem value="Hardware">Hardware</SelectItem>
                          <SelectItem value="Service">Professional Service</SelectItem>
                          <SelectItem value="Logistics">Logistics</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2 col-span-2">
                      <Label className="font-bold text-slate-700">Price (IDR)</Label>
                      <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-slate-400">Rp</span>
                        <Input 
                          type="number"
                          value={newProduct.price}
                          onChange={(e) => setNewProduct({ ...newProduct, price: Number(e.target.value) })}
                          className="pl-12 rounded-xl border-slate-200 h-12"
                        />
                      </div>
                    </div>
                    <div className="space-y-2 col-span-2">
                      <Label className="font-bold text-slate-700">Description</Label>
                      <Textarea 
                        value={newProduct.description}
                        onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                        placeholder="Describe key features and B2B benefits..."
                        className="rounded-xl border-slate-200 min-h-[100px]"
                      />
                    </div>
                  </div>
                </div>
                <DialogFooter className="p-8 pt-0 flex gap-3">
                  <Button variant="ghost" onClick={() => { setIsProductModalOpen(false); setEditingProduct(null); }} className="rounded-xl h-12 px-6 font-bold">Cancel</Button>
                  <Button onClick={handleAddOrEditProduct} className="rounded-xl bg-accent hover:bg-indigo-600 text-white h-12 px-10 font-black shadow-lg">
                    {editingProduct ? "Update Item" : "Publish to Catalog"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product) => (
              <Card key={product.id} className="group overflow-hidden border-slate-200 shadow-sm hover:shadow-2xl transition-all duration-300 rounded-[2rem] bg-white">
                <div className="aspect-[4/3] w-full relative overflow-hidden">
                  <img 
                    src={product.imageUrl} 
                    alt={product.name} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-4 left-4">
                    <Badge className="bg-white/90 backdrop-blur-md text-slate-900 border-none font-black text-[10px] uppercase px-3 py-1 shadow-md">
                      {product.category}
                    </Badge>
                  </div>
                </div>
                <CardHeader className="p-6">
                  <CardTitle className="text-xl font-black text-slate-900 tracking-tight leading-none truncate">
                    {product.name}
                  </CardTitle>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-lg font-black text-indigo-600">
                      Rp {product.price.toLocaleString("id-ID")}
                    </span>
                  </div>
                </CardHeader>
                <CardContent className="px-6 pb-6">
                  <p className="text-sm text-slate-500 font-medium line-clamp-2 leading-relaxed h-10">
                    {product.description}
                  </p>
                </CardContent>
                <CardFooter className="px-4 py-4 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => openEditModal(product)}
                    className="rounded-lg h-9 font-bold text-slate-500 hover:text-accent hover:bg-indigo-50 gap-2"
                  >
                    <Pencil className="size-3.5" />
                    Edit
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => handleDeleteProduct(product.id)}
                    className="rounded-lg h-9 font-bold text-rose-500 hover:text-rose-600 hover:bg-rose-50 gap-2"
                  >
                    <Trash2 className="size-3.5" />
                    Remove
                  </Button>
                </CardFooter>
              </Card>
            ))}
            
            {products.length === 0 && (
              <div className="col-span-full py-20 border-2 border-dashed border-slate-100 rounded-[3rem] flex flex-col items-center justify-center text-center space-y-6">
                <div className="size-20 bg-slate-50 text-slate-300 rounded-[2rem] flex items-center justify-center">
                  <Package className="size-10" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-xl font-black text-slate-900">Your Catalog is Empty</h4>
                  <p className="text-slate-400 font-medium max-w-xs mx-auto">Add your products or services to increase your visibility in the OnTapp global marketplace.</p>
                </div>
                <Button 
                  onClick={() => setIsProductModalOpen(true)}
                  variant="outline" 
                  className="rounded-xl border-slate-200 font-bold hover:bg-slate-50"
                >
                  Create First Entry
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
