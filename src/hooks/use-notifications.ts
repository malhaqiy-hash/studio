'use client';

import * as React from 'react';
import { getToken, onMessage, Messaging } from 'firebase/messaging';
import { doc, setDoc, arrayUnion } from 'firebase/firestore';
import { useAuth, useFirestore, useMessaging } from '@/firebase';
import { useToast } from './use-toast';

export function useNotifications() {
  const { toast } = useToast();
  const auth = useAuth();
  const db = useFirestore();
  const messaging = useMessaging();
  const [loading, setLoading] = React.useState(false);

  const requestPermission = async () => {
    if (!messaging) {
      toast({
        variant: "destructive",
        title: "Layanan Tidak Tersedia",
        description: "Firebase Messaging tidak didukung di browser ini atau belum terinisialisasi.",
      });
      return;
    }
    
    setLoading(true);
    try {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        const vapidKey = process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY;
        
        if (!vapidKey) {
          console.error("Missing NEXT_PUBLIC_FIREBASE_VAPID_KEY in environment variables.");
          toast({
            variant: "destructive",
            title: "Konfigurasi Hilang",
            description: "VAPID Key belum dikonfigurasi di server. Silakan hubungi admin.",
          });
          setLoading(false);
          return;
        }

        const token = await getToken(messaging, { vapidKey });

        if (token && auth.currentUser) {
          // Simpan token ke Firestore untuk user saat ini
          const userRef = doc(db, 'users', auth.currentUser.uid);
          await setDoc(userRef, {
            fcmTokens: arrayUnion(token),
            notificationsEnabled: true,
            updatedAt: new Date().toISOString()
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
        description: "Terjadi kesalahan saat menghubungkan ke layanan pesan. Pastikan VAPID Key valid.",
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
