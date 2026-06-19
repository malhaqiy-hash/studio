"use client";

import * as React from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Card, CardContent, CardHeader, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { 
  Heart, 
  MessageCircle, 
  Share2, 
  MoreHorizontal, 
  Plus,
  Image as ImageIcon,
  ShoppingBag,
  Target,
  Globe,
  RefreshCw,
  Sparkles,
  Monitor,
  X,
  Cloud,
  Check
} from "lucide-react";
import { translateText } from "@/ai/flows/translate-flow";
import { useLanguage } from "@/context/language-context";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";

const MOCK_GOOGLE_PHOTOS = [
  'https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=400&h=400&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1497215728101-856f4ea42174?q=80&w=400&h=400&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1556761175-b413da4baf72?q=80&w=400&h=400&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=400&h=400&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1454165833767-027ffea9e77b?q=80&w=400&h=400&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=400&h=400&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?q=80&w=400&h=400&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=400&h=400&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=400&h=400&auto=format&fit=crop'
];

const INITIAL_MOCK_POSTS = [
  {
    id: 1,
    company: "GreenEco Packaging",
    avatar: "https://picsum.photos/seed/eco/100",
    role: "Supplier",
    type: "Product",
    content: "Excited to launch our new 100% biodegradable shipping envelopes! Perfect for e-commerce businesses looking to reduce their carbon footprint. Bulk orders now open.",
    image: "https://picsum.photos/seed/package/800/500",
    likes: 45,
    comments: 12,
    time: "2h ago"
  },
  {
    id: 2,
    company: "FastTrack Logistics",
    avatar: "https://picsum.photos/seed/log/100",
    role: "Service Provider",
    type: "Service",
    content: "New route established between Singapore and Rotterdam. Guaranteed 15% faster delivery times for tech hardware shipments. Contact us for updated pricing schedules.",
    likes: 28,
    comments: 5,
    time: "5h ago"
  },
  {
    id: 3,
    company: "Skyline Ventures",
    avatar: "https://picsum.photos/seed/invest/100",
    role: "Enterprise",
    type: "Opportunity",
    content: "We are actively seeking early-stage B2B SaaS partners in the Southeast Asian market for our Q3 acceleration program. Focus on Supply Chain and FinTech.",
    likes: 89,
    comments: 24,
    time: "1d ago"
  }
];

export default function FeedPage() {
  const { language } = useLanguage();
  const { toast } = useToast();
  
  // Feed State
  const [posts, setPosts] = React.useState(INITIAL_MOCK_POSTS);
  const [newPostContent, setNewPostContent] = React.useState("");
  const [newPostImage, setNewPostImage] = React.useState<string | null>(null);
  const [isPosting, setIsPosting] = React.useState(false);

  // Media Picker State
  const [isSourcePickerOpen, setIsSourcePickerOpen] = React.useState(false);
  const [isCloudPickerOpen, setIsCloudPickerOpen] = React.useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  // Translation State
  const [translations, setTranslations] = React.useState<Record<number | string, { text: string, show: boolean, loading: boolean }>>({});

  const handleTranslatePost = async (postId: number | string, content: string) => {
    const existing = translations[postId];
    if (existing?.text) {
      setTranslations(prev => ({
        ...prev,
        [postId]: { ...existing, show: !existing.show }
      }));
      return;
    }

    setTranslations(prev => ({
      ...prev,
      [postId]: { text: "", show: false, loading: true }
    }));

    try {
      const { translatedText } = await translateText({
        text: content,
        targetLanguage: language
      });
      setTranslations(prev => ({
        ...prev,
        [postId]: { text: translatedText, show: true, loading: false }
      }));
    } catch (err) {
      console.error("Post translation failed", err);
      setTranslations(prev => ({
        ...prev,
        [postId]: { text: "", show: false, loading: false }
      }));
    }
  };

  const triggerFilePicker = () => {
    fileInputRef.current?.click();
  };

  const openCloudPicker = () => {
    setIsSourcePickerOpen(false);
    setIsCloudPickerOpen(true);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewPostImage(reader.result as string);
        setIsSourcePickerOpen(false);
        toast({ title: "Media terlampir" });
      };
      reader.readAsDataURL(file);
    }
    if (e.target) e.target.value = '';
  };

  const handleCloudSelect = (url: string) => {
    setNewPostImage(url);
    setIsCloudPickerOpen(false);
    toast({ title: "Media terpilih dari Google Foto" });
  };

  const handlePost = () => {
    if (!newPostContent.trim() && !newPostImage) return;

    setIsPosting(true);
    
    // Simulate API Delay
    setTimeout(() => {
      const newEntry = {
        id: Date.now(),
        company: "Alpha Tech Solutions", // Assuming logged in user
        avatar: "https://picsum.photos/seed/alpha/100",
        role: "Enterprise",
        type: "Opportunity",
        content: newPostContent,
        image: newPostImage || undefined,
        likes: 0,
        comments: 0,
        time: "Just now"
      };

      setPosts([newEntry, ...posts]);
      setNewPostContent("");
      setNewPostImage(null);
      setIsPosting(false);
      toast({ title: "Postingan berhasil dibagikan!" });
    }, 1000);
  };

  return (
    <DashboardLayout>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-6">
          {/* Create Post Card */}
          <Card className="shadow-sm border-slate-200 overflow-hidden">
            <CardContent className="p-6">
              <div className="flex gap-4">
                <Avatar className="size-10 border shadow-sm">
                  <AvatarImage src="https://picsum.photos/seed/alpha/100" />
                  <AvatarFallback>AT</AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-4">
                  <textarea 
                    value={newPostContent}
                    onChange={(e) => setNewPostContent(e.target.value)}
                    placeholder="Share a product, service, or business opportunity..."
                    className="w-full min-h-[100px] bg-slate-50 border-none resize-none focus:ring-0 rounded-xl p-4 text-sm font-medium placeholder:text-slate-400 bg-transparent"
                  />

                  {newPostImage && (
                    <div className="relative group/thumb w-fit">
                      <img 
                        src={newPostImage} 
                        className="h-32 w-auto rounded-2xl object-cover border shadow-sm" 
                        alt="Preview" 
                      />
                      <button 
                        onClick={() => setNewPostImage(null)}
                        className="absolute -top-2 -right-2 bg-slate-900 text-white rounded-full p-1 shadow-lg group-hover/thumb:scale-110 transition-transform"
                      >
                        <X className="size-3" />
                      </button>
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                    <div className="flex gap-2">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => setIsSourcePickerOpen(true)}
                        className="text-slate-500 rounded-full h-9 px-4 hover:bg-slate-100"
                      >
                        <ImageIcon className="size-4 mr-2 text-indigo-500" />
                        Media
                      </Button>
                      <Button variant="ghost" size="sm" className="text-slate-500 rounded-full h-9 px-4 hover:bg-slate-100 hidden sm:flex">
                        <ShoppingBag className="size-4 mr-2 text-emerald-500" />
                        Product
                      </Button>
                      <Button variant="ghost" size="sm" className="text-slate-500 rounded-full h-9 px-4 hover:bg-slate-100 hidden sm:flex">
                        <Target className="size-4 mr-2 text-orange-500" />
                        Opportunity
                      </Button>
                    </div>
                    <Button 
                      onClick={handlePost}
                      disabled={isPosting || (!newPostContent.trim() && !newPostImage)}
                      className="rounded-full px-6 bg-accent hover:bg-indigo-600 font-black shadow-lg shadow-indigo-100 transition-all active:scale-95"
                    >
                      {isPosting ? "Posting..." : "Post"}
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Social Feed */}
          <div className="space-y-6">
            {posts.map((post) => {
              const translation = translations[post.id];
              return (
                <Card key={post.id} className="shadow-sm border-slate-200 group transition-all hover:shadow-md bg-white rounded-[2rem] overflow-hidden">
                  <CardHeader className="p-6 pb-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Avatar className="size-11 border shadow-sm ring-2 ring-white">
                          <AvatarImage src={post.avatar} />
                          <AvatarFallback>{post.company[0]}</AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col">
                          <div className="flex items-center gap-2">
                            <h3 className="font-black text-slate-900 hover:text-accent cursor-pointer transition-colors leading-none">{post.company}</h3>
                            <Badge variant="secondary" className="text-[9px] font-black uppercase tracking-widest py-0 px-2 bg-slate-100 text-slate-500 border-none">
                              {post.role}
                            </Badge>
                          </div>
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter mt-1">{post.time} • Global</span>
                        </div>
                      </div>
                      <Button variant="ghost" size="icon" className="rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                        <MoreHorizontal className="size-5 text-slate-400" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="px-6 pb-4 space-y-4">
                    <div className="flex items-center justify-between">
                      <Badge className={`
                        ${post.type === 'Product' ? 'bg-indigo-50 text-indigo-600' : ''}
                        ${post.type === 'Service' ? 'bg-emerald-50 text-emerald-600' : ''}
                        ${post.type === 'Opportunity' ? 'bg-orange-50 text-orange-600' : ''}
                        text-[9px] font-black uppercase tracking-widest px-2 border-none
                      `} variant="outline">
                        {post.type}
                      </Badge>
                      
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => handleTranslatePost(post.id, post.content)}
                        className="h-7 text-[9px] font-black uppercase tracking-widest text-slate-400 hover:text-accent"
                        disabled={translation?.loading}
                      >
                        {translation?.loading ? (
                          <RefreshCw className="size-3 mr-1.5 animate-spin" />
                        ) : (
                          <Globe className="size-3 mr-1.5" />
                        )}
                        {translation?.show ? "Original" : "Translate"}
                      </Button>
                    </div>
                    
                    <div className="relative">
                      <p className="text-slate-700 leading-relaxed font-medium text-[15px]">
                        {translation?.show ? translation.text : post.content}
                      </p>
                      {translation?.show && (
                        <div className="mt-2 text-[10px] font-black text-accent uppercase tracking-[0.1em] flex items-center gap-1.5 bg-indigo-50/50 w-fit px-2 py-1 rounded-md">
                          <Sparkles className="size-3" />
                          AI Translated
                        </div>
                      )}
                    </div>

                    {post.image && (
                      <div className="rounded-3xl overflow-hidden border border-slate-100 shadow-sm">
                        <img src={post.image} alt="Post content" className="w-full h-auto object-cover max-h-[500px]" />
                      </div>
                    )}
                  </CardContent>
                  <CardFooter className="px-6 py-4 border-t border-slate-50 flex items-center justify-between bg-slate-50/30">
                    <div className="flex items-center gap-6">
                      <button className="flex items-center gap-2 text-slate-400 hover:text-rose-500 transition-colors group/stat">
                        <Heart className="size-5 group-hover/stat:fill-rose-500" />
                        <span className="text-xs font-black">{post.likes}</span>
                      </button>
                      <button className="flex items-center gap-2 text-slate-400 hover:text-accent transition-colors group/stat">
                        <MessageCircle className="size-5 group-hover/stat:fill-accent" />
                        <span className="text-xs font-black">{post.comments}</span>
                      </button>
                    </div>
                    <button className="flex items-center gap-2 text-slate-400 hover:text-slate-600 transition-colors">
                      <Share2 className="size-5" />
                    </button>
                  </CardFooter>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Sidebar widgets */}
        <div className="lg:col-span-4 space-y-6 hidden lg:block">
          <Card className="shadow-sm border-slate-200 overflow-hidden rounded-[2rem] bg-white">
            <div className="h-24 bg-gradient-to-br from-indigo-500 via-indigo-600 to-indigo-800" />
            <div className="px-6 pb-8 text-center -mt-12">
              <Avatar className="size-24 mx-auto border-[6px] border-white shadow-xl">
                <AvatarImage src="https://picsum.photos/seed/alpha/200" />
                <AvatarFallback>AT</AvatarFallback>
              </Avatar>
              <div className="mt-4 space-y-1">
                <h3 className="font-black text-xl tracking-tight text-slate-900">Alpha Tech Solutions</h3>
                <Badge variant="outline" className="text-[10px] font-black uppercase tracking-widest text-indigo-600 bg-indigo-50 border-none px-3">Enterprise Member</Badge>
              </div>
              <div className="grid grid-cols-2 gap-4 mt-8 pt-6 border-t border-slate-100">
                <div className="text-center">
                  <span className="block text-xl font-black text-slate-900 leading-none">1,240</span>
                  <span className="text-[9px] text-slate-400 uppercase font-black tracking-widest mt-1">Followers</span>
                </div>
                <div className="text-center">
                  <span className="block text-xl font-black text-slate-900 leading-none">452</span>
                  <span className="text-[9px] text-slate-400 uppercase font-black tracking-widest mt-1">Posts</span>
                </div>
              </div>
              <Button className="w-full mt-8 rounded-2xl bg-slate-900 text-white hover:bg-black font-black h-12 shadow-lg" variant="default">
                View My Profile
              </Button>
            </div>
          </Card>

          <Card className="shadow-sm border-slate-200 rounded-[2rem] bg-white">
            <CardHeader className="p-8 pb-4">
              <h3 className="font-black text-slate-900 text-sm uppercase tracking-widest">Recommended Partners</h3>
            </CardHeader>
            <CardContent className="p-8 pt-0 space-y-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center justify-between gap-3 group cursor-pointer">
                  <div className="flex items-center gap-3">
                    <Avatar className="size-10 border-slate-100 rounded-xl">
                      <AvatarImage src={`https://picsum.photos/seed/rec${i}/100`} />
                      <AvatarFallback>P</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <span className="text-sm font-black text-slate-900 group-hover:text-accent transition-colors leading-none">Partner {i} Corp.</span>
                      <span className="text-[9px] text-slate-400 font-black uppercase tracking-widest mt-1">95% AI Match</span>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="rounded-full h-8 px-4 text-[10px] font-black uppercase tracking-widest border-slate-200 hover:bg-indigo-50 hover:text-accent">
                    Follow
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Hidden Native File Input */}
      <input 
        type="file" 
        ref={fileInputRef} 
        className="hidden" 
        accept="image/*"
        onChange={handleFileChange}
      />

      {/* Native-Style Media Picker Modal */}
      <Dialog open={isSourcePickerOpen} onOpenChange={setIsSourcePickerOpen}>
        <DialogContent className="max-w-[320px] rounded-[2.5rem] border-none shadow-2xl p-8 bg-[#2d3035] text-white overflow-hidden outline-none animate-in zoom-in-95 duration-200">
          <div className="space-y-8">
            <h2 className="text-xl font-bold text-white/90 tracking-tight">Pilih dari</h2>
            
            <div className="space-y-6">
              {/* Galeri Item */}
              <button 
                onClick={triggerFilePicker}
                className="w-full flex items-center justify-between group text-left active:scale-[0.98] transition-transform"
              >
                <div className="flex items-center gap-5">
                  <div className="size-12 rounded-full bg-white/10 flex items-center justify-center overflow-hidden shadow-inner">
                    <div className="grid grid-cols-2 gap-0.5 scale-75">
                      <div className="size-2.5 bg-blue-400 rounded-sm" />
                      <div className="size-2.5 bg-green-400 rounded-sm" />
                      <div className="size-2.5 bg-orange-400 rounded-sm" />
                      <div className="size-2.5 bg-purple-400 rounded-sm" />
                    </div>
                  </div>
                  <span className="font-bold text-[16px]">Galeri</span>
                </div>
                <div className="size-5 rounded-full border-2 border-gray-500" />
              </button>

              {/* Google Foto Item */}
              <button 
                onClick={openCloudPicker}
                className="w-full flex items-center justify-between group text-left active:scale-[0.98] transition-transform"
              >
                <div className="flex items-center gap-5">
                  <div className="size-12 rounded-full bg-white/10 flex items-center justify-center relative shadow-inner">
                    <div className="absolute top-2 left-2 size-4 bg-red-400 rounded-full blur-[1px] opacity-80" />
                    <div className="absolute top-2 right-2 size-4 bg-blue-400 rounded-full blur-[1px] opacity-80" />
                    <div className="absolute bottom-2 left-2 size-4 bg-yellow-400 rounded-full blur-[1px] opacity-80" />
                    <div className="absolute bottom-2 right-2 size-4 bg-green-400 rounded-full blur-[1px] opacity-80" />
                    <div className="relative size-6 bg-white/20 rounded-sm rotate-45" />
                  </div>
                  <span className="font-bold text-[16px]">Google Foto</span>
                </div>
                <div className="size-5 rounded-full border-2 border-gray-500" />
              </button>

              {/* Browser Item */}
              <button 
                onClick={triggerFilePicker}
                className="w-full flex items-center justify-between group text-left active:scale-[0.98] transition-transform"
              >
                <div className="flex items-center gap-5">
                  <div className="size-12 rounded-full bg-white/10 flex items-center justify-center shadow-inner">
                    <Monitor className="size-6 text-gray-300" />
                  </div>
                  <div className="flex flex-col">
                    <span className="font-bold text-[16px]">Browser</span>
                    <span className="text-[11px] text-gray-400 font-bold uppercase tracking-widest mt-0.5 opacity-60">File Browser</span>
                  </div>
                </div>
                <div className="size-5 rounded-full border-2 border-gray-500" />
              </button>
            </div>

            <div className="flex justify-end pt-4 gap-6">
              <button 
                onClick={() => setIsSourcePickerOpen(false)}
                className="text-blue-400 font-black text-sm uppercase tracking-widest hover:text-blue-300 transition-colors"
              >
                Selalu
              </button>
              <button 
                onClick={() => setIsSourcePickerOpen(false)}
                className="text-blue-400 font-black text-sm uppercase tracking-widest hover:text-blue-300 transition-colors"
              >
                Cuma sekali
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Google Photos Cloud Picker Simulation */}
      <Dialog open={isCloudPickerOpen} onOpenChange={setIsCloudPickerOpen}>
        <DialogContent className="max-w-2xl rounded-[2.5rem] border-none shadow-2xl p-0 bg-white overflow-hidden">
          <DialogHeader className="p-8 pb-4 bg-slate-50 border-b flex flex-row items-center justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-indigo-600 font-black text-[10px] uppercase tracking-widest">
                <Cloud className="size-3" /> Cloud Storage
              </div>
              <DialogTitle className="text-2xl font-black text-slate-900 tracking-tight">Google Photos</DialogTitle>
            </div>
            <div className="flex items-center gap-2">
              <div className="size-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xs">J</div>
            </div>
          </DialogHeader>
          <ScrollArea className="h-[450px] p-6">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {MOCK_GOOGLE_PHOTOS.map((url, idx) => (
                <button
                  key={idx}
                  onClick={() => handleCloudSelect(url)}
                  className="group relative aspect-square rounded-2xl overflow-hidden bg-slate-100 hover:ring-4 hover:ring-accent transition-all active:scale-95"
                >
                  <img src={url} className="w-full h-full object-cover transition-transform group-hover:scale-110" alt="Cloud Photo" />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="size-6 rounded-full bg-accent text-white flex items-center justify-center shadow-lg">
                      <Check className="size-4" />
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </ScrollArea>
          <DialogFooter className="p-6 bg-slate-50 border-t flex items-center justify-center">
             <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <Sparkles className="size-3 text-amber-500" /> Disinkronkan dengan Google Photos
             </p>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
