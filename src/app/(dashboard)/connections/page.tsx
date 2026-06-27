'use client';

import * as React from 'react';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { useAccount, Account } from '@/context/account-context';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { 
  Search, 
  X, 
  Users, 
  ChevronLeft,
  MoreVertical,
  UserCheck,
  Zap,
  Handshake,
  MessageSquare
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/context/language-context';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import ConnectionIcon from '@/assets/icons/connection.svg';

const ConnectIcon = ({ className }: { className?: string }) => (
  <div 
    className={cn("bg-current", className)}
    style={{
      maskImage: `url(${ConnectionIcon.src})`,
      WebkitMaskImage: `url(${ConnectionIcon.src})`,
      maskSize: 'contain',
      maskRepeat: 'no-repeat',
      maskPosition: 'center',
      display: 'inline-block'
    }}
  />
);

const MOCK_CONNECTIONS = [
  { id: 'conn1', name: 'Andi Wijaya', avatar: 'https://picsum.photos/seed/f1/100', type: 'Professional' },
  { id: 'conn2', name: 'Budi Santoso', avatar: 'https://picsum.photos/seed/f2/100', type: 'Bisnis' },
  { id: 'conn3', name: 'Siti Aminah', avatar: 'https://picsum.photos/seed/f3/100', type: 'Personal' },
  { id: 'conn4', name: 'Rina Kartika', avatar: 'https://picsum.photos/seed/f4/100', type: 'Bisnis' },
];

export default function ConnectionsPage() {
  const { t, language } = useLanguage();
  const { activeAccount } = useAccount();
  const { toast } = useToast();
  
  const [searchTerm, setSearchTerm] = React.useState("");
  const [connections, setConnections] = React.useState(MOCK_CONNECTIONS);
  const [confirmDisconnectId, setConfirmDisconnectId] = React.useState<string | null>(null);

  const filteredConnections = connections.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDisconnect = () => {
    if (confirmDisconnectId) {
      setConnections(prev => prev.filter(c => c.id !== confirmDisconnectId));
      setConfirmDisconnectId(null);
      toast({ title: "Koneksi diputuskan" });
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-xl mx-auto space-y-6 py-2 px-1 pb-24">
        <header className="space-y-4">
          <Link href="/settings">
            <Button variant="ghost" size="sm" className="pl-0 h-6 text-[10px] text-slate-400 hover:text-primary font-black uppercase tracking-widest gap-1.5 active:scale-95 transition-all">
              <ChevronLeft className="size-3" />
              {language === 'id' ? 'Kembali' : 'Back'}
            </Button>
          </Link>
          <div className="space-y-0.5">
            <div className="flex items-center gap-1.5 text-primary font-black text-[8px] uppercase tracking-[0.2em]">
              <ConnectIcon className="size-3" />
              {t('connections')}
            </div>
            <h1 className="text-xl font-black text-slate-900 tracking-tight leading-none uppercase">Jaringan Bisnis</h1>
            <p className="text-slate-500 font-medium text-[11px] leading-snug">Kelola seluruh relasi strategis Anda di ekosistem Koolink.</p>
          </div>
        </header>

        <div className="relative group">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-slate-400 group-focus-within:text-primary transition-colors" />
          <Input 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Cari nama relasi..." 
            className="h-12 pl-11 pr-4 rounded-2xl border-slate-100 bg-white shadow-sm text-[14px] font-medium focus:ring-4 focus:ring-primary/5 transition-all"
          />
        </div>

        <div className="space-y-2">
          {filteredConnections.length > 0 ? (
            filteredConnections.map((conn) => (
              <Card key={conn.id} className="rounded-2xl border-slate-100 shadow-sm hover:shadow-md transition-all group overflow-hidden bg-card">
                <CardContent className="p-3 flex items-center justify-between gap-3">
                  <Link href="/profile" className="flex items-center gap-3 min-w-0 flex-1 hover:opacity-80 transition-opacity">
                    <div className="relative shrink-0">
                      <Avatar className="size-12 rounded-xl border border-border shadow-sm">
                        <AvatarImage src={conn.avatar} className="object-cover" />
                        <AvatarFallback className="bg-primary/5 text-primary font-black text-sm">{conn.name[0]}</AvatarFallback>
                      </Avatar>
                      <div className="absolute -bottom-0.5 -right-0.5 size-3 bg-emerald-500 border-2 border-white rounded-full" />
                    </div>
                    <div className="min-w-0">
                      <h4 className="font-bold text-[14px] text-slate-900 truncate uppercase tracking-tight">{conn.name}</h4>
                      <div className="flex items-center gap-2 mt-0.5">
                        <Badge variant="outline" className="text-[7px] h-4 font-black uppercase tracking-widest border-primary/20 bg-primary/5 text-primary/80 px-1.5">
                          {conn.type}
                        </Badge>
                        <span className="text-[8px] font-black text-slate-300 uppercase tracking-widest">Terhubung</span>
                      </div>
                    </div>
                  </Link>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <Link href="/messages">
                      <Button variant="ghost" size="icon" className="size-9 rounded-xl bg-slate-50 text-slate-400 hover:text-primary active:scale-90 transition-all">
                        <MessageSquare className="size-4" />
                      </Button>
                    </Link>
                    <button 
                      onClick={() => setConfirmDisconnectId(conn.id)}
                      className="size-9 flex items-center justify-center rounded-xl bg-slate-100 text-slate-400 hover:bg-rose-50 hover:text-rose-500 active:scale-90 transition-all"
                    >
                      <X className="size-4" />
                    </button>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="py-24 text-center space-y-4 bg-slate-50/50 rounded-[3rem] border-2 border-dashed border-slate-100">
               <div className="size-16 rounded-full bg-white flex items-center justify-center mx-auto shadow-md">
                  <ConnectIcon className="size-8 text-slate-200" />
               </div>
               <div className="space-y-1">
                  <h3 className="text-sm font-black text-slate-900 uppercase">Tidak Ada Relasi</h3>
                  <p className="text-[10px] text-slate-400 max-w-[200px] mx-auto font-medium">
                    {searchTerm ? "Tidak ada koneksi yang sesuai dengan pencarian Anda." : "Mulai bangun jaringan Anda dengan mencari mitra strategis."}
                  </p>
               </div>
               {!searchTerm && (
                 <Link href="/cari">
                   <Button className="rounded-xl bg-primary h-10 px-6 font-black text-[10px] uppercase tracking-widest shadow-lg">Cari Mitra</Button>
                 </Link>
               )}
            </div>
          )}
        </div>

        <Dialog open={!!confirmDisconnectId} onOpenChange={(open) => !open && setConfirmDisconnectId(null)}>
          <DialogContent className="w-[90%] md:max-w-[320px] rounded-[2rem] border-none shadow-2xl p-6 bg-card text-foreground outline-none z-[200] [&>button]:hidden text-center">
            <div className="space-y-6">
              <div className="size-16 rounded-[1.5rem] bg-rose-50 text-rose-500 flex items-center justify-center mx-auto shadow-inner">
                 <X className="size-8" />
              </div>
              <div className="space-y-2">
                <DialogTitle className="text-lg font-black uppercase tracking-tight">Putus Koneksi?</DialogTitle>
                <DialogDescription className="text-[11px] font-medium text-slate-500 leading-relaxed px-4">
                  Tindakan ini akan menghapus akses khusus dan sinergi jaringan antara profil Anda.
                </DialogDescription>
              </div>
              <div className="flex flex-col gap-2">
                <Button 
                  onClick={handleDisconnect} 
                  className="w-full h-11 rounded-xl bg-rose-500 hover:bg-rose-600 text-white font-black text-[10px] uppercase tracking-widest shadow-lg shadow-rose-100"
                >
                  Putus Koneksi
                </Button>
                <Button 
                  variant="ghost" 
                  onClick={() => setConfirmDisconnectId(null)}
                  className="w-full h-10 rounded-xl font-black text-[10px] uppercase tracking-widest text-slate-400 hover:bg-slate-50"
                >
                  Batal
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}
