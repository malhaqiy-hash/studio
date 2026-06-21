'use client';

import * as React from 'react';
import { 
  X, 
  Copy, 
  Search, 
  Check,
  Smartphone,
  MessageCircleCode,
  Instagram,
  Facebook,
  Music,
  Youtube,
  ShoppingBag,
  Linkedin,
  Chrome,
  Send,
  Share2,
  Mail,
  Twitter,
  SendHorizontal,
  MoreHorizontal,
  Slack
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';

const MOCK_FRIENDS = [
  { id: 'f1', name: 'Andi Wijaya', avatar: 'https://picsum.photos/seed/f1/100', status: 'online' },
  { id: 'f2', name: 'Fitriani Rois', avatar: 'https://picsum.photos/seed/f2/100', status: 'offline' },
  { id: 'f3', name: 'Ahmad Umar', avatar: 'https://picsum.photos/seed/f3/100', status: 'online' },
  { id: 'f4', name: 'M. Syarif', avatar: 'https://picsum.photos/seed/f4/100', active: '37m' },
  { id: 'f5', name: 'Budi Santoso', avatar: 'https://picsum.photos/seed/f5/100', status: 'online' },
  { id: 'f6', name: 'Siti Rahma', avatar: 'https://picsum.photos/seed/f6/100', status: 'offline' },
  { id: 'f7', name: 'Lina Marlina', avatar: 'https://picsum.photos/seed/f7/100', status: 'online' },
  { id: 'f8', name: 'Dedi Kusuma', avatar: 'https://picsum.photos/seed/f8/100', status: 'offline' },
  { id: 'f9', name: 'Rina Nose', avatar: 'https://picsum.photos/seed/f9/100', status: 'online' },
  { id: 'f10', name: 'Joni Jono', avatar: 'https://picsum.photos/seed/f10/100', status: 'online' },
  { id: 'f11', name: 'Eko Puji', avatar: 'https://picsum.photos/seed/f11/100', status: 'offline' },
  { id: 'f12', name: 'Maya Sari', avatar: 'https://picsum.photos/seed/f12/100', status: 'online' },
];

const EXTERNAL_APPS = [
  { name: 'System', icon: Share2, color: 'bg-blue-600', isNative: true },
  { name: 'WhatsApp', icon: MessageCircleCode, color: 'bg-[#25D366]', url: 'whatsapp://send?text=' },
  { name: 'Instagram', icon: Instagram, color: 'bg-gradient-to-tr from-[#f9ce34] via-[#ee2a7b] to-[#6228d7]', url: 'instagram://' },
  { name: 'Telegram', icon: SendHorizontal, color: 'bg-[#0088cc]', url: 'tg://msg?text=' },
  { name: 'Facebook', icon: Facebook, color: 'bg-[#1877F2]', url: 'fb://' },
  { name: 'Twitter', icon: Twitter, color: 'bg-black', url: 'twitter://' },
  { name: 'Gmail', icon: Mail, color: 'bg-[#EA4335]', url: 'googlegmail://' },
  { name: 'TikTok', icon: Music, color: 'bg-black', url: 'snssdk1128://' },
  { name: 'LinkedIn', icon: Linkedin, color: 'bg-[#0077B5]', url: 'linkedin://' },
  { name: 'YouTube', icon: Youtube, color: 'bg-[#FF0000]', url: 'youtube://' },
  { name: 'Slack', icon: Slack, color: 'bg-[#4A154B]', url: 'slack://' },
  { name: 'Shopee', icon: ShoppingBag, color: 'bg-[#EE4D2D]', url: 'shopeeid://' },
  { name: 'Tokopedia', icon: ShoppingBag, color: 'bg-[#03AC0E]', url: 'tokopedia://' },
  { name: 'Chrome', icon: Chrome, color: 'bg-white text-gray-700', url: 'googlechrome://' },
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
    toast({ 
      title: 'Berhasil Terkirim', 
      description: `Konten telah dibagikan ke ${selectedFriends.length} teman.` 
    });
    setSelectedFriends([]);
    onOpenChange(false);
  };

  const handleExternalShare = async (app: typeof EXTERNAL_APPS[0]) => {
    const shareData = {
      title: 'OnTapp - Discover Network',
      text: 'Lihat postingan menarik ini di OnTapp!',
      url: postUrl,
    };

    if (app.isNative && navigator.share) {
      try {
        await navigator.share(shareData);
        onOpenChange(false);
      } catch (err) {
        console.log('Native share failed');
      }
      return;
    }

    if (app.url) {
      const fullUrl = app.url.includes('whatsapp') || app.url.includes('tg')
        ? `${app.url}${encodeURIComponent(postUrl)}`
        : app.url;
      window.open(fullUrl, '_blank');
      onOpenChange(false);
    } else {
      // Fallback for native share if not available
      if (app.isNative) {
        handleCopyLink();
      }
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md p-0 border-none bg-[#1c1f24] text-white rounded-t-[2.5rem] sm:rounded-[2.5rem] overflow-hidden outline-none shadow-2xl h-[75vh] flex flex-col">
        {/* Header Section - Tightened */}
        <div className="p-4 space-y-3">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-base font-black text-white/90">Bagikan</h3>
            <button onClick={() => onOpenChange(false)} className="p-1.5 hover:bg-white/10 rounded-full transition-colors">
              <X className="size-5" />
            </button>
          </div>
          
          <div className="flex items-center bg-[#2d3239] rounded-xl p-0.5 pl-3 border border-white/5">
            <p className="text-[10px] text-gray-400 truncate flex-1 pr-2 font-medium">{postUrl}</p>
            <Button 
              onClick={handleCopyLink}
              size="icon" 
              variant="ghost" 
              className="size-8 rounded-lg text-gray-300 hover:text-white hover:bg-white/5 transition-all"
            >
              {copied ? <Check className="size-3.5 text-emerald-500" /> : <Copy className="size-3.5" />}
            </Button>
          </div>

          <div className="flex gap-2 items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-gray-500" />
              <Input 
                placeholder="Cari teman..." 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="h-9 pl-9 bg-[#2d3239] border-none rounded-xl text-white placeholder:text-gray-500 focus-visible:ring-1 focus-visible:ring-accent/40 text-xs"
              />
            </div>
            {selectedFriends.length > 0 && (
              <Button 
                onClick={handleSendToFriends}
                className="h-9 bg-accent hover:bg-accent/90 text-white rounded-xl font-black text-[10px] uppercase tracking-widest px-4 animate-in fade-in slide-in-from-right-2"
              >
                Kirim ({selectedFriends.length})
              </Button>
            )}
          </div>
        </div>

        {/* Friends List - Horizontal 3 rows - More Compact */}
        <div className="px-4 pb-2">
          <p className="text-[9px] font-black text-gray-600 uppercase tracking-widest mb-2">Teman OnTapp</p>
          <div className="overflow-x-auto no-scrollbar">
            <div className="grid grid-rows-3 grid-flow-col gap-x-4 gap-y-3 pb-2">
              {filteredFriends.map((friend) => {
                const isSelected = selectedFriends.includes(friend.id);
                return (
                  <button 
                    key={friend.id} 
                    onClick={() => toggleFriendSelection(friend.id)}
                    className="flex items-center gap-2.5 w-40 group relative active:scale-95 transition-all text-left p-1 rounded-xl hover:bg-white/5"
                  >
                    <div className="relative shrink-0">
                      <Avatar className={cn(
                        "size-10 border-2 transition-all duration-300",
                        isSelected ? "border-accent scale-105" : "border-transparent"
                      )}>
                        <AvatarImage src={friend.avatar} className="object-cover" />
                        <AvatarFallback className="bg-[#3e444d] font-bold text-[10px]">{friend.name[0]}</AvatarFallback>
                      </Avatar>
                      {isSelected && (
                        <div className="absolute -top-1 -right-1 size-4 bg-accent rounded-full flex items-center justify-center border-2 border-[#1c1f24] animate-in zoom-in">
                          <Check className="size-2 text-white stroke-[4]" />
                        </div>
                      )}
                    </div>
                    <div className="min-w-0">
                      <span className={cn("text-[11px] font-bold truncate block", isSelected ? "text-accent" : "text-gray-200")}>
                        {friend.name}
                      </span>
                      <span className="text-[8px] text-gray-500 font-bold uppercase tracking-tight">
                        {friend.status === 'online' ? 'Online' : 'Offline'}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* External Apps - Compact Grid - Tightened distance */}
        <div className="mt-auto bg-[#121418] p-4 border-t border-gray-800/50">
          <div className="mb-3 flex items-center gap-2">
             <span className="text-[9px] font-black text-gray-600 uppercase tracking-widest">Aplikasi Lain</span>
             <div className="h-px flex-1 bg-gray-800/20" />
          </div>
          <ScrollArea className="h-48 pr-2">
            <div className="grid grid-cols-4 gap-y-4 gap-x-2">
              {EXTERNAL_APPS.map((app, i) => (
                <button 
                  key={i} 
                  onClick={() => handleExternalShare(app)}
                  className="flex flex-col items-center gap-1.5 group active:scale-90 transition-all"
                >
                  <div className={cn(
                    "size-11 rounded-2xl flex items-center justify-center shadow-lg transition-all group-hover:-translate-y-0.5",
                    app.color
                  )}>
                    <app.icon className="size-5 text-white" />
                  </div>
                  <span className="text-[8px] font-bold text-gray-500 uppercase tracking-tight group-hover:text-gray-300 text-center">
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
