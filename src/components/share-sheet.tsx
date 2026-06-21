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
  Share2
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
  { name: 'WhatsApp', icon: MessageCircleCode, color: 'bg-[#25D366]', url: 'whatsapp://send?text=' },
  { name: 'Instagram', icon: Instagram, color: 'bg-gradient-to-tr from-[#f9ce34] via-[#ee2a7b] to-[#6228d7]', url: 'instagram://library?AssetPath=' },
  { name: 'TikTok', icon: Music, color: 'bg-black', url: 'snssdk1128://' },
  { name: 'Facebook', icon: Facebook, color: 'bg-[#1877F2]', url: 'fb://facewebmodal/f?href=' },
  { name: 'LinkedIn', icon: Linkedin, color: 'bg-[#0077B5]', url: 'linkedin://' },
  { name: 'YouTube', icon: Youtube, color: 'bg-[#FF0000]', url: 'youtube://' },
  { name: 'Shopee', icon: ShoppingBag, color: 'bg-[#EE4D2D]', url: 'shopeeid://' },
  { name: 'Tokopedia', icon: ShoppingBag, color: 'bg-[#03AC0E]', url: 'tokopedia://' },
  { name: 'Chrome', icon: Chrome, color: 'bg-white text-gray-700', url: 'googlechrome://' },
  { name: 'System Share', icon: Share2, color: 'bg-blue-500', isNative: true },
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
      description: `Konten telah dibagikan ke ${selectedFriends.length} teman di jaringan OnTapp.` 
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
        console.log('Share canceled or failed');
      }
      return;
    }

    if (app.url) {
      const fullUrl = app.url.includes('whatsapp') 
        ? `${app.url}${encodeURIComponent(postUrl)}`
        : app.url;
      window.open(fullUrl, '_blank');
      onOpenChange(false);
    } else {
      toast({ title: app.name, description: 'Membuka laci berbagi...' });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md p-0 border-none bg-[#1c1f24] text-white rounded-t-[2.5rem] sm:rounded-[2.5rem] overflow-hidden outline-none shadow-2xl h-[80vh] flex flex-col">
        <div className="p-5 space-y-4 flex-1 flex flex-col overflow-hidden">
          {/* Header & Copy Link */}
          <div className="space-y-3">
            <div className="flex items-center justify-between px-1">
              <h3 className="text-lg font-black text-white/90">Bagikan</h3>
              <button onClick={() => onOpenChange(false)} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                <X className="size-5" />
              </button>
            </div>
            
            <div className="relative flex items-center bg-[#2d3239] rounded-2xl p-1 pl-4 border border-gray-700/20">
              <p className="text-[10px] text-gray-400 truncate flex-1 pr-4 font-medium">{postUrl}</p>
              <Button 
                onClick={handleCopyLink}
                size="icon" 
                variant="ghost" 
                className="size-9 rounded-xl text-gray-300 hover:text-white hover:bg-white/5 transition-all"
              >
                {copied ? <Check className="size-4 text-emerald-500" /> : <Copy className="size-4" />}
              </Button>
            </div>
          </div>

          {/* Search & Send Button */}
          <div className="flex gap-2 items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-gray-500" />
              <Input 
                placeholder="Cari teman..." 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="h-10 pl-9 bg-[#2d3239] border-none rounded-xl text-white placeholder:text-gray-500 focus-visible:ring-1 focus-visible:ring-accent/40 text-xs font-medium"
              />
            </div>
            {selectedFriends.length > 0 && (
              <Button 
                onClick={handleSendToFriends}
                className="h-10 bg-accent hover:bg-accent/90 text-white rounded-xl font-black text-[10px] uppercase tracking-widest px-6 animate-in fade-in slide-in-from-right-2"
              >
                Kirim ({selectedFriends.length})
              </Button>
            )}
          </div>

          {/* Friends List - 3 Rows Horizontal Scroll */}
          <div className="flex-1 overflow-hidden min-h-[280px]">
            <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-3 px-1">Teman OnTapp</p>
            <div className="h-full overflow-x-auto no-scrollbar">
              <div className="grid grid-rows-3 grid-flow-col gap-x-6 gap-y-4 pb-4">
                {filteredFriends.map((friend) => {
                  const isSelected = selectedFriends.includes(friend.id);
                  return (
                    <button 
                      key={friend.id} 
                      onClick={() => toggleFriendSelection(friend.id)}
                      className="flex items-center gap-3 w-48 group relative active:scale-95 transition-all text-left p-1 rounded-xl hover:bg-white/5"
                    >
                      <div className="relative shrink-0">
                        <Avatar className={cn(
                          "size-12 border-2 transition-all duration-300",
                          isSelected ? "border-accent scale-105 shadow-[0_0_10px_rgba(var(--accent),0.4)]" : "border-transparent"
                        )}>
                          <AvatarImage src={friend.avatar} className="object-cover" />
                          <AvatarFallback className="bg-[#3e444d] font-bold text-xs">{friend.name[0]}</AvatarFallback>
                        </Avatar>
                        {isSelected && (
                          <div className="absolute -top-1 -right-1 size-5 bg-accent rounded-full flex items-center justify-center border-2 border-[#1c1f24] shadow-lg animate-in zoom-in">
                            <Check className="size-2.5 text-white stroke-[4]" />
                          </div>
                        )}
                        {friend.status === 'online' && !isSelected && (
                          <div className="absolute bottom-0 right-0 size-3 bg-emerald-500 rounded-full border-2 border-[#1c1f24]" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <span className={cn(
                          "text-xs font-bold truncate block transition-colors",
                          isSelected ? "text-accent" : "text-gray-200"
                        )}>
                          {friend.name}
                        </span>
                        <span className="text-[9px] text-gray-500 font-bold uppercase tracking-tight">
                          {friend.active ? `Aktif ${friend.active}` : (friend.status === 'online' ? 'Online' : 'Offline')}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* External Apps - Vertical Grid with Swipe Up */}
        <div className="bg-[#121418] p-5 border-t border-gray-800/50">
          <div className="mb-4 flex items-center gap-2">
             <span className="text-[9px] font-black text-gray-600 uppercase tracking-widest">Bagikan ke Aplikasi Lain</span>
             <div className="h-px flex-1 bg-gray-800/50" />
          </div>
          <ScrollArea className="h-44 pr-2">
            <div className="grid grid-cols-4 gap-y-6 gap-x-2">
              {EXTERNAL_APPS.map((app, i) => (
                <button 
                  key={i} 
                  onClick={() => handleExternalShare(app)}
                  className="flex flex-col items-center gap-2 group active:scale-90 transition-all"
                >
                  <div className={cn(
                    "size-12 rounded-2xl flex items-center justify-center shadow-lg transition-all group-hover:-translate-y-1 group-hover:shadow-accent/5",
                    app.color
                  )}>
                    <app.icon className="size-5 text-white" />
                  </div>
                  <span className="text-[9px] font-bold text-gray-500 uppercase tracking-tight group-hover:text-gray-300 text-center">
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
