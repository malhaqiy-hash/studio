
"use client";

import * as React from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { useAccount, Account, ContentItem } from "@/context/account-context";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Instagram, 
  Linkedin, 
  Facebook, 
  ShoppingBag, 
  Link2, 
  Pencil, 
  ShieldCheck, 
  Building2, 
  Briefcase, 
  User as UserIcon,
  Plus,
  Trash2,
  Image as ImageIcon,
  DollarSign,
  PlusCircle,
  FolderOpen,
  Camera
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";

export default function ProfilePage() {
  const { activeAccount, updateActiveAccount } = useAccount();
  const { toast } = useToast();
  const [isEditDialogOpen, setIsEditDialogOpen] = React.useState(false);
  
  // Local state for editing
  const [editForm, setEditForm] = React.useState<Account>(activeAccount);

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

  const handleAddItem = () => {
    const newItem: ContentItem = {
      id: `item-${Date.now()}`,
      image: `https://picsum.photos/seed/${Date.now()}/600/400`,
      title: "",
      description: "",
      price: ""
    };
    setEditForm({
      ...editForm,
      items: [...(editForm.items || []), newItem]
    });
  };

  const handleRemoveItem = (id: string) => {
    setEditForm({
      ...editForm,
      items: (editForm.items || []).filter(item => item.id !== id)
    });
  };

  const handleUpdateItem = (id: string, updates: Partial<ContentItem>) => {
    setEditForm({
      ...editForm,
      items: (editForm.items || []).map(item => item.id === id ? { ...item, ...updates } : item)
    });
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
              data-ai-hint="business cover"
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
          {activeAccount.type === 'pribadi' && (
            <div className="space-y-6">
              <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Social Feed</h3>
              {(!activeAccount.items || activeAccount.items.length === 0) ? (
                <p className="text-slate-400 text-sm italic">Belum ada postingan feed.</p>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {activeAccount.items.map((post) => (
                    <div key={post.id} className="aspect-square rounded-xl overflow-hidden group relative">
                      <img src={post.image} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt="Feed" />
                      {post.description && (
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-4 text-center">
                          <p className="text-white text-[10px] font-bold line-clamp-3">{post.description}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeAccount.type === 'professional' && (
            <div className="space-y-6">
              <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Portfolio Gallery</h3>
              {(!activeAccount.items || activeAccount.items.length === 0) ? (
                <p className="text-slate-400 text-sm italic">Belum ada portfolio yang ditambahkan.</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {activeAccount.items.map((item) => (
                    <div key={item.id} className="group space-y-3">
                      <div className="aspect-[4/3] rounded-3xl overflow-hidden border border-slate-100 bg-slate-50">
                        <img src={item.image} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt={item.title} />
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900">{item.title || "Untitled Project"}</h4>
                        <p className="text-xs text-slate-500 font-medium leading-relaxed">{item.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeAccount.type === 'bisnis' && (
            <div className="space-y-6">
              <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Product Catalog</h3>
              {(!activeAccount.items || activeAccount.items.length === 0) ? (
                <p className="text-slate-400 text-sm italic">Katalog produk masih kosong.</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {activeAccount.items.map((product) => (
                    <Card key={product.id} className="rounded-3xl border-slate-100 shadow-sm overflow-hidden group hover:shadow-md transition-shadow">
                      <div className="aspect-video relative overflow-hidden">
                        <img src={product.image} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt={product.title} />
                        {product.price && (
                          <div className="absolute bottom-3 right-3 bg-white/95 backdrop-blur px-3 py-1 rounded-full text-xs font-black text-indigo-600 shadow-sm">
                            ${product.price}
                          </div>
                        )}
                      </div>
                      <CardContent className="p-4 space-y-1">
                        <h4 className="font-bold text-slate-900">{product.title || "Nama Produk"}</h4>
                        <p className="text-[10px] text-slate-500 font-medium line-clamp-2">{product.description}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          )}
        </section>
      </div>

      {/* Editing Layer (Dialog Overlay) */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-3xl rounded-[2.5rem] p-0 border-none shadow-2xl overflow-hidden bg-white">
          <DialogHeader className="p-8 pb-4 bg-slate-50 border-b border-slate-100">
            <DialogTitle className="text-2xl font-black text-slate-900 tracking-tight">Edit Profil {activeAccount.type.toUpperCase()}</DialogTitle>
          </DialogHeader>
          
          <div className="p-8 space-y-8 overflow-y-auto max-h-[70vh]">
            {/* Basic Info Section */}
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

            {/* Content Management Section */}
            <div className="space-y-6 pt-6 border-t border-slate-100">
              <div className="flex items-center justify-between">
                <h4 className="font-black text-sm uppercase tracking-widest text-slate-900">
                  {activeAccount.type === 'pribadi' ? 'Kelola Postingan Feed' : activeAccount.type === 'professional' ? 'Kelola Portfolio' : 'Kelola Katalog Produk'}
                </h4>
                <Button 
                  size="sm" 
                  onClick={handleAddItem}
                  className="rounded-xl h-9 bg-accent hover:bg-indigo-600 gap-2 font-bold px-4"
                >
                  <PlusCircle className="size-4" />
                  Tambah Baru
                </Button>
              </div>

              <div className="space-y-4">
                {(editForm.items || []).map((item, idx) => (
                  <Card key={item.id} className="p-4 rounded-2xl border-slate-100 bg-slate-50/50">
                    <div className="flex flex-col md:flex-row gap-4">
                      <div className="size-24 rounded-xl bg-white border border-slate-200 flex items-center justify-center relative overflow-hidden shrink-0 group">
                        <img src={item.image} className="w-full h-full object-cover" alt="Preview" />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
                          <Camera className="size-5 text-white" />
                        </div>
                      </div>
                      <div className="flex-1 space-y-3">
                        {activeAccount.type !== 'pribadi' && (
                          <div className="flex gap-2">
                            <Input 
                              placeholder={activeAccount.type === 'bisnis' ? "Nama Produk" : "Judul Proyek"}
                              value={item.title}
                              onChange={(e) => handleUpdateItem(item.id, { title: e.target.value })}
                              className="rounded-lg h-10 bg-white border-slate-200 text-xs font-bold"
                            />
                            {activeAccount.type === 'bisnis' && (
                              <div className="relative w-32 shrink-0">
                                <DollarSign className="absolute left-2 top-1/2 -translate-y-1/2 size-3 text-slate-400" />
                                <Input 
                                  placeholder="Harga"
                                  value={item.price}
                                  onChange={(e) => handleUpdateItem(item.id, { price: e.target.value })}
                                  className="rounded-lg h-10 bg-white border-slate-200 text-xs font-bold pl-7"
                                />
                              </div>
                            )}
                          </div>
                        )}
                        <Textarea 
                          placeholder="Deskripsi..."
                          value={item.description}
                          onChange={(e) => handleUpdateItem(item.id, { description: e.target.value })}
                          className="rounded-lg min-h-[60px] bg-white border-slate-200 text-xs font-medium"
                        />
                      </div>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => handleRemoveItem(item.id)}
                        className="text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-xl"
                      >
                        <Trash2 className="size-4" />
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            </div>

            {/* Links Hub Editor */}
            <div className="space-y-4 pt-6 border-t border-slate-100">
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
                    <div className="flex-1 relative">
                      <Link2 className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                      <Input 
                        placeholder="https://..."
                        value={link}
                        onChange={(e) => {
                          const newLinks = [...(editForm.links || [])];
                          newLinks[i] = e.target.value;
                          setEditForm({...editForm, links: newLinks});
                        }}
                        className="rounded-xl h-11 border-slate-200 pl-10"
                      />
                    </div>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => {
                        const newLinks = (editForm.links || []).filter((_, idx) => idx !== i);
                        setEditForm({...editForm, links: newLinks});
                      }}
                      className="text-slate-300 hover:text-rose-500 rounded-xl"
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
