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
  Chrome
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

// Mock data teman untuk demo
const MOCK_FRIENDS = [
  { id: 'f1', name: 'afd_awesome', avatar: 'https://picsum.photos/seed/f1/100' },
  { id: 'f2', name: 'Fitriani Rois', avatar: 'https://picsum.photos/seed/f2/100' },
  { id: 'f3', name: 'Ahmad Umar Asy\'ari', avatar: 'https://picsum.photos/seed/f3/100' },
  { id: 'f4', name: 'M', avatar: 'https://picsum.photos/seed/f4/100', active: '37 menit' },
  { id: 'f5', name: 'ngawensarifc', avatar: 'https://picsum.photos/seed/f5/100' },
  { id: 'f6', name: 'UmrKw', avatar: 'https://picsum.photos/seed/f6/100' },
  { id: 'f7', name: 'Budi Santoso', avatar: 'https://picsum.photos/seed/f7/100' },
  { id: 'f8', name: 'Siti Rahma', avatar: 'https://picsum.photos/seed/f8/100' },
];

const EXTERNAL_APPS = [
  { name: 'Quick Share', icon: Smartphone, color: 'bg-blue-500' },
  { name: 'WhatsApp', icon: MessageCircleCode, color: 'bg-emerald-500', url: 'https://wa.me/' },
  { name: 'Chrome', icon: Chrome, color: 'bg-slate-100 text-slate-900', url: 'https://google.com' },
  { name: 'Google', icon: Globe, color: 'bg-white text-blue-500', url: 'https://google.com' },
  { name: 'Instagram', icon: Instagram, color: 'bg-pink-500', url: 'https://instagram.com' },
  { name: 'Facebook', icon: Facebook, color: 'bg-blue-600', url: 'https://facebook.com' },
  { name: 'TikTok', icon: Music, color: 'bg-slate-900', url: 'https://tiktok.com' },
  { name: 'YouTube', icon: Youtube, color: 'bg-red-600', url: 'https://youtube.com' },
  { name: 'Shopee', icon: ShoppingBag, color: 'bg-orange-500', url: 'https://shopee.co.id' },
  { name: 'Tokopedia', icon: ShoppingBag, color: 'bg-green-500', url: 'https://tokopedia.com' },
  { name: 'LinkedIn', icon: Linkedin, color: 'bg-blue-700', url: 'https://linkedin.com' },
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

  const filteredFriends = MOCK_FRIENDS.filter(f => 
    f.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleCopyLink = () => {
    navigator.clipboard.writeText(postUrl);
    setCopied(true);
    toast({ title: 'Tautan disalin!' });
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShareToFriend = (name: string) => {
    toast({ title: `Berbagi dengan ${name}`, description: 'Pesan telah dikirim.' });
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
      <DialogContent className="max-w-md p-0 border-none bg-[#1c1f24] text-white rounded-t-[2rem] sm:rounded-[2rem] overflow-hidden outline-none">
        <div className="p-6 space-y-6">
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-gray-200">Berbagi link</h3>
            <div className="relative flex items-center bg-[#2d3239] rounded-xl p-1 pl-4 border border-gray-700/50">
              <p className="text-xs text-gray-400 truncate flex-1 pr-4">{postUrl}</p>
              <Button 
                onClick={handleCopyLink}
                size="icon" 
                variant="ghost" 
                className="size-10 rounded-lg text-gray-300 hover:text-white hover:bg-white/10"
              >
                {copied ? <Check className="size-5 text-emerald-500" /> : <Copy className="size-5" />}
              </Button>
            </div>
          </div>

          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-gray-500" />
              <Input 
                placeholder="Cari" 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="h-12 pl-11 bg-[#2d3239] border-none rounded-xl text-white placeholder:text-gray-500 focus-visible:ring-1 focus-visible:ring-white/20"
              />
              <button className="absolute right-4 top-1/2 -translate-y-1/2 p-1.5 bg-[#3e444d] rounded-lg text-gray-400">
                <Users className="size-4" />
              </button>
            </div>

            <ScrollArea className="h-[280px]">
              <div className="grid grid-cols-3 gap-y-6 gap-x-2 pt-2">
                {filteredFriends.map((friend) => (
                  <button 
                    key={friend.id} 
                    onClick={() => handleShareToFriend(friend.name)}
                    className="flex flex-col items-center gap-2 group active:scale-95 transition-transform"
                  >
                    <div className="relative">
                      <Avatar className="size-16 border-2 border-transparent group-hover:border-accent transition-colors">
                        <AvatarImage src={friend.avatar} className="object-cover" />
                        <AvatarFallback className="bg-[#3e444d]">{friend.name[0]}</AvatarFallback>
                      </Avatar>
                      {friend.active && (
                        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 bg-[#1c1f24] px-1.5 rounded-full border border-gray-800">
                          <span className="text-[8px] font-bold text-emerald-500 whitespace-nowrap">{friend.active}</span>
                        </div>
                      )}
                    </div>
                    <span className="text-[10px] font-medium text-gray-300 group-hover:text-white truncate w-full text-center px-1">
                      {friend.name}
                    </span>
                  </button>
                ))}
              </div>
            </ScrollArea>
          </div>
        </div>

        <div className="bg-[#121418] p-6 pb-8 border-t border-gray-800">
          <ScrollArea orientation="horizontal" className="w-full">
            <div className="flex gap-4 pb-2">
              {EXTERNAL_APPS.map((app, i) => (
                <button 
                  key={i} 
                  onClick={() => handleOpenApp(app)}
                  className="flex flex-col items-center gap-2 min-w-[70px] group active:scale-90 transition-transform"
                >
                  <div className={cn(
                    "size-12 rounded-2xl flex items-center justify-center shadow-lg transition-transform group-hover:-translate-y-1",
                    app.color
                  )}>
                    <app.icon className="size-6" />
                  </div>
                  <span className="text-[9px] font-bold text-gray-400 uppercase tracking-tight group-hover:text-gray-200">
                    {app.name}
                  </span>
                </button>
              ))}
            </div>
          </ScrollArea>
          <div className="mt-6 flex justify-center">
            <div className="w-12 h-1.5 bg-gray-700 rounded-full" />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
