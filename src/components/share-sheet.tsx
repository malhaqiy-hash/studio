'use client';

import * as React from 'react';
import { 
  X, 
  Copy, 
  Search, 
  Check,
  MessageCircleCode,
  Instagram,
  Facebook,
  Music,
  Youtube,
  ShoppingBag,
  Linkedin,
  Chrome,
  Share2,
  Mail,
  Twitter,
  SendHorizontal,
  Slack,
  MessageSquare,
  Globe
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
  { name: 'Sistem', icon: Share2, color: 'bg-indigo-600', isNative: true },
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
      title: 'Terkirim!', 
      description: `Dibagikan ke ${selectedFriends.length} teman.` 
    });
    setSelectedFriends([]);
    onOpenChange(false);
  };

  const handleExternalShare = async (app: typeof EXTERNAL_APPS[0]) => {
    const shareData = {
      title: 'OnTapp - Business Network',
      text: 'Lihat konten menarik ini di OnTapp!',
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
      if (app.isNative) handleCopyLink();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md p-0 border-none bg-[#1c1f24] text-white rounded-t-[2.5rem] sm:rounded-[3rem] overflow-hidden outline-none shadow-2xl h-[85vh] flex flex-col transition-all">
        {/* Header - Single Close Button */}
        <div className="p-4 pb-2 flex items-center justify-between">
          <h3 className="text-lg font-black text-white/90 ml-2">Bagikan Konten</h3>
          {/* Note: ShadCN DialogContent usually provides a Close button. 
              We ensure we don't have a manual one clashing visually. 
              If the default is hidden or styled elsewhere, we manage it here. */}
        </div>
        
        <div className="px-6 space-y-4">
          {/* URL & Search Section */}
          <div className="space-y-3">
            <div className="flex items-center bg-white/5 rounded-2xl p-1.5 pl-4 border border-white/10 group focus-within:border-accent/50 transition-all">
              <p className="text-[11px] text-gray-400 truncate flex-1 font-medium select-all">{postUrl}</p>
              <Button 
                onClick={handleCopyLink}
                size="sm" 
                variant="ghost" 
                className="rounded-xl text-gray-300 hover:text-white hover:bg-white/10"
              >
                {copied ? <Check className="size-4 text-emerald-500" /> : <Copy className="size-4" />}
              </Button>
            </div>

            <div className="flex gap-2 items-center">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-gray-500" />
                <Input 
                  placeholder="Cari teman di OnTapp..." 
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="h-12 pl-12 bg-white/5 border-none rounded-2xl text-white placeholder:text-gray-500 focus-visible:ring-1 focus-visible:ring-accent/40"
                />
              </div>
              {selectedFriends.length > 0 && (
                <Button 
                  onClick={handleSendToFriends}
                  className="h-12 bg-accent hover:bg-accent/90 text-white rounded-2xl font-black text-xs uppercase tracking-widest px-6 animate-in fade-in zoom-in"
                >
                  Kirim ({selectedFriends.length})
                </Button>
              )}
            </div>
          </div>

          {/* Friends List - Horizontal 3 rows */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Koneksi OnTapp</span>
              <span className="text-[9px] font-bold text-accent px-2 py-0.5 bg-accent/10 rounded-full">Sinergi Terdeteksi</span>
            </div>
            <div className="overflow-x-auto no-scrollbar pb-2">
              <div className="grid grid-rows-3 grid-flow-col gap-x-4 gap-y-3">
                {filteredFriends.map((friend) => {
                  const isSelected = selectedFriends.includes(friend.id);
                  return (
                    <button 
                      key={friend.id} 
                      onClick={() => toggleFriendSelection(friend.id)}
                      className="flex items-center gap-3 w-44 group relative active:scale-95 transition-all text-left p-1.5 rounded-2xl hover:bg-white/5"
                    >
                      <div className="relative shrink-0">
                        <Avatar className={cn(
                          "size-11 border-2 transition-all duration-300",
                          isSelected ? "border-accent scale-105 shadow-[0_0_15px_rgba(20,184,166,0.3)]" : "border-transparent"
                        )}>
                          <AvatarImage src={friend.avatar} className="object-cover" />
                          <AvatarFallback className="bg-[#3e444d] font-black text-xs">{friend.name[0]}</AvatarFallback>
                        </Avatar>
                        {isSelected && (
                          <div className="absolute -top-1 -right-1 size-5 bg-accent rounded-full flex items-center justify-center border-2 border-[#1c1f24] animate-in zoom-in">
                            <Check className="size-2.5 text-white stroke-[4]" />
                          </div>
                        )}
                        {friend.status === 'online' && !isSelected && (
                          <div className="absolute bottom-0 right-0 size-3 bg-emerald-500 rounded-full border-2 border-[#1c1f24]" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <span className={cn("text-xs font-bold truncate block", isSelected ? "text-accent" : "text-gray-200")}>
                          {friend.name}
                        </span>
                        <span className="text-[9px] text-gray-500 font-bold uppercase tracking-tight">
                          {friend.status === 'online' ? 'Aktif Sekarang' : 'Baru Saja'}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* External Apps Section - Tightened spacing */}
        <div className="mt-auto bg-[#121418] p-6 pt-5 border-t border-white/5 rounded-t-[2.5rem]">
          <div className="flex items-center gap-3 mb-4">
             <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Berbagi ke Aplikasi Luar</span>
             <div className="h-px flex-1 bg-white/5" />
          </div>
          <ScrollArea className="h-56 pr-3">
            <div className="grid grid-cols-4 gap-y-6 gap-x-4">
              {EXTERNAL_APPS.map((app, i) => (
                <button 
                  key={i} 
                  onClick={() => handleExternalShare(app)}
                  className="flex flex-col items-center gap-2 group active:scale-90 transition-all"
                >
                  <div className={cn(
                    "size-14 rounded-[1.25rem] flex items-center justify-center shadow-2xl transition-all group-hover:-translate-y-1 relative overflow-hidden",
                    app.color
                  )}>
                    <app.icon className={cn("size-7 text-white", app.name === 'Chrome' && "text-gray-700")} />
                    {app.isNative && (
                      <div className="absolute bottom-0 inset-x-0 h-1 bg-white/30" />
                    )}
                  </div>
                  <span className="text-[9px] font-black text-gray-400 uppercase tracking-tighter group-hover:text-white transition-colors text-center">
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
