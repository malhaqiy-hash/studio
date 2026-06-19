'use client';

import * as React from 'react';
import { getToken, onMessage, Messaging } from 'firebase/messaging';
import { doc, setDoc, arrayUnion, Firestore } from 'firebase/firestore';
import { useAuth, useFirestore, useMessaging } from '@/firebase';
import { useToast } from './use-toast';

export function useNotifications() {
  const { toast } = useToast();
  const auth = useAuth();
  const db = useFirestore();
  const messaging = useMessaging();
  const [loading, setLoading] = React.useState(false);

  const requestPermission = async () => {
    if (!messaging) return;
    
    setLoading(true);
    try {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        const token = await getToken(messaging, {
          vapidKey: 'BIsW9_Y3_6X...YOUR_VAPID_KEY_FROM_CONSOLE...', // Ganti dengan VAPID key asli di console
        });

        if (token && auth.currentUser) {
          // Simpan token ke Firestore untuk user saat ini
          const userRef = doc(db, 'users', auth.currentUser.uid);
          await setDoc(userRef, {
            fcmTokens: arrayUnion(token),
            notificationsEnabled: true,
          }, { merge: true });

          toast({
            title: "Notifikasi Diaktifkan",
            description: "Anda akan menerima pembaruan jaringan secara real-time.",
          });
        }
      } else {
        toast({
          variant: "destructive",
          title: "Izin Ditolak",
          description: "Silakan aktifkan izin notifikasi di pengaturan browser Anda.",
        });
      }
    } catch (err) {
      console.error("FCM Error", err);
      toast({
        variant: "destructive",
        title: "Gagal Mengaktifkan Notifikasi",
        description: "Terjadi kesalahan saat menghubungkan ke layanan pesan.",
      });
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    if (messaging) {
      const unsubscribe = onMessage(messaging, (payload) => {
        toast({
          title: payload.notification?.title || "Notifikasi Baru",
          description: payload.notification?.body,
        });
      });
      return () => unsubscribe();
    }
  }, [messaging, toast]);

  return { requestPermission, loading };
}
