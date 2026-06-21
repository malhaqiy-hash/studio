'use client';

import * as React from 'react';
import { 
  X, 
  Copy, 
  Search, 
  Users, 
  Check,
  Smartphone,
  Globe,
  MessageCircleCode,
  Instagram,
  Facebook,
  Music,
  Youtube,
  ShoppingBag,
  Linkedin,
  Chrome,
  Send
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';

const MOCK_FRIENDS = [
  { id: 'f1', name: 'afd_awesome', avatar: 'https://picsum.photos/seed/f1/100', status: 'online' },
  { id: 'f2', name: 'Fitriani Rois', avatar: 'https://picsum.photos/seed/f2/100', status: 'offline' },
  { id: 'f3', name: 'Ahmad Umar', avatar: 'https://picsum.photos/seed/f3/100', status: 'online' },
  { id: 'f4', name: 'M. Syarif', avatar: 'https://picsum.photos/seed/f4/100', active: '37m' },
  { id: 'f5', name: 'ngawensarifc', avatar: 'https://picsum.photos/seed/f5/100', status: 'online' },
  { id: 'f6', name: 'UmrKw', avatar: 'https://picsum.photos/seed/f6/100', status: 'offline' },
  { id: 'f7', name: 'Budi Santoso', avatar: 'https://picsum.photos/seed/f7/100', status: 'online' },
  { id: 'f8', name: 'Siti Rahma', avatar: 'https://picsum.photos/seed/f8/100', status: 'offline' },
];

const EXTERNAL_APPS = [
  { name: 'WhatsApp', icon: MessageCircleCode, color: 'bg-[#25D366]', url: 'https://wa.me/' },
  { name: 'Instagram', icon: Instagram, color: 'bg-gradient-to-tr from-[#f9ce34] via-[#ee2a7b] to-[#6228d7]', url: 'https://instagram.com' },
  { name: 'TikTok', icon: Music, color: 'bg-black', url: 'https://tiktok.com' },
  { name: 'Facebook', icon: Facebook, color: 'bg-[#1877F2]', url: 'https://facebook.com' },
  { name: 'LinkedIn', icon: Linkedin, color: 'bg-[#0077B5]', url: 'https://linkedin.com' },
  { name: 'YouTube', icon: Youtube, color: 'bg-[#FF0000]', url: 'https://youtube.com' },
  { name: 'Shopee', icon: ShoppingBag, color: 'bg-[#EE4D2D]', url: 'https://shopee.co.id' },
  { name: 'Tokopedia', icon: ShoppingBag, color: 'bg-[#03AC0E]', url: 'https://tokopedia.com' },
  { name: 'Chrome', icon: Chrome, color: 'bg-white text-gray-700', url: 'https://google.com' },
  { name: 'Quick Share', icon: Smartphone, color: 'bg-blue-500' },
];

interface ShareSheetProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  postUrl: string;
}

export function ShareSheet({ isOpen, onOpenChange, postUrl }: ShareSheetProps) {
  const { toast } = useToast();
  const [search, setSearch] = React.useState('');
  const [copied, setCopied] = React.useState(false);
  const [selectedFriends, setSelectedFriends] = React.useState<string[]>([]);

  const filteredFriends = MOCK_FRIENDS.filter(f => 
    f.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleCopyLink = () => {
    navigator.clipboard.writeText(postUrl);
    setCopied(true);
    toast({ title: 'Tautan disalin!' });
    setTimeout(() => setCopied(false), 2000);
  };

  const toggleFriendSelection = (id: string) => {
    setSelectedFriends(prev => 
      prev.includes(id) ? prev.filter(fid => fid !== id) : [...prev, id]
    );
  };

  const handleSendToFriends = () => {
    if (selectedFriends.length === 0) return;
    toast({ title: 'Berhasil!', description: `Konten dikirim ke ${selectedFriends.length} teman.` });
    setSelectedFriends([]);
    onOpenChange(false);
  };

  const handleOpenApp = (app: typeof EXTERNAL_APPS[0]) => {
    if (app.url) {
      window.open(app.url, '_blank');
    } else {
      toast({ title: app.name, description: 'Membuka layanan sistem...' });
    }
    onOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md p-0 border-none bg-[#1c1f24] text-white rounded-t-[2.5rem] sm:rounded-[2.5rem] overflow-hidden outline-none shadow-2xl">
        <div className="p-6 space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-black text-white/90">Bagikan</h3>
              {selectedFriends.length > 0 && (
                <Button 
                  onClick={handleSendToFriends}
                  className="h-8 bg-accent hover:bg-accent/90 text-white rounded-full font-black text-[10px] uppercase tracking-widest px-4 animate-in fade-in zoom-in"
                >
                  Kirim ({selectedFriends.length})
                </Button>
              )}
            </div>
            
            <div className="relative flex items-center bg-[#2d3239] rounded-2xl p-1.5 pl-5 border border-gray-700/30">
              <p className="text-[11px] text-gray-400 truncate flex-1 pr-4 font-medium">{postUrl}</p>
              <Button 
                onClick={handleCopyLink}
                size="icon" 
                variant="ghost" 
                className="size-10 rounded-xl text-gray-300 hover:text-white hover:bg-white/5 transition-all"
              >
                {copied ? <Check className="size-5 text-emerald-500" /> : <Copy className="size-5" />}
              </Button>
            </div>
          </div>

          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-gray-500" />
              <Input 
                placeholder="Cari teman..." 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="h-12 pl-11 bg-[#2d3239] border-none rounded-2xl text-white placeholder:text-gray-500 focus-visible:ring-1 focus-visible:ring-accent/40 text-sm font-medium"
              />
            </div>

            <ScrollArea className="h-[320px] pr-2">
              <div className="grid grid-cols-3 gap-y-6 gap-x-2 pt-2">
                {filteredFriends.map((friend) => {
                  const isSelected = selectedFriends.includes(friend.id);
                  return (
                    <button 
                      key={friend.id} 
                      onClick={() => toggleFriendSelection(friend.id)}
                      className="flex flex-col items-center gap-2 group relative active:scale-95 transition-all"
                    >
                      <div className="relative">
                        <Avatar className={cn(
                          "size-16 border-2 transition-all duration-300",
                          isSelected ? "border-accent scale-105" : "border-transparent"
                        )}>
                          <AvatarImage src={friend.avatar} className="object-cover" />
                          <AvatarFallback className="bg-[#3e444d] font-bold">{friend.name[0]}</AvatarFallback>
                        </Avatar>
                        {friend.status === 'online' && (
                          <div className="absolute bottom-0 right-1 size-3.5 bg-emerald-500 rounded-full border-2 border-[#1c1f24]" />
                        )}
                        {friend.active && (
                          <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 bg-[#1c1f24] px-2 rounded-full border border-gray-800">
                            <span className="text-[7px] font-black text-emerald-500 whitespace-nowrap uppercase">{friend.active}</span>
                          </div>
                        )}
                        {isSelected && (
                          <div className="absolute inset-0 bg-accent/20 rounded-full flex items-center justify-center animate-in fade-in">
                            <div className="size-6 rounded-full bg-accent flex items-center justify-center shadow-lg">
                              <Check className="size-3 text-white stroke-[4]" />
                            </div>
                          </div>
                        )}
                      </div>
                      <span className={cn(
                        "text-[10px] font-bold truncate w-full text-center px-1 transition-colors",
                        isSelected ? "text-accent" : "text-gray-300 group-hover:text-white"
                      )}>
                        {friend.name}
                      </span>
                    </button>
                  );
                })}
              </div>
            </ScrollArea>
          </div>
        </div>

        <div className="bg-[#121418] p-6 pb-10 border-t border-gray-800/50">
          <div className="mb-4 flex items-center gap-2 px-1">
             <div className="h-px flex-1 bg-gray-800" />
             <span className="text-[9px] font-black text-gray-600 uppercase tracking-widest">Bagikan ke Aplikasi</span>
             <div className="h-px flex-1 bg-gray-800" />
          </div>
          <ScrollArea orientation="horizontal" className="w-full">
            <div className="flex gap-4 pb-4 px-1">
              {EXTERNAL_APPS.map((app, i) => (
                <button 
                  key={i} 
                  onClick={() => handleOpenApp(app)}
                  className="flex flex-col items-center gap-2 min-w-[72px] group active:scale-90 transition-all"
                >
                  <div className={cn(
                    "size-14 rounded-[1.25rem] flex items-center justify-center shadow-xl transition-all group-hover:-translate-y-1 group-hover:shadow-accent/10",
                    app.color
                  )}>
                    <app.icon className="size-6 text-white" />
                  </div>
                  <span className="text-[9px] font-black text-gray-500 uppercase tracking-tight group-hover:text-gray-300 transition-colors">
                    {app.name}
                  </span>
                </button>
              ))}
            </div>
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  );
}
