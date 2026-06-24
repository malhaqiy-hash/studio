'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';

export type AccountType = 'pribadi' | 'professional' | 'bisnis';

export interface ContentItem {
  id: string;
  image?: string; 
  images?: string[]; 
  title?: string;
  description?: string;
  categoryName?: string; 
  price?: string;
  visibility?: 'public' | 'private';
  displayLocation: 'profile' | 'feed' | 'both';
  isPinned?: boolean;
  isArchived?: boolean;
  timestamp?: string;
  locationLink?: string;
  externalLink?: string;
  source: 'profile' | 'feed';
}

export interface AccountPreferences {
  publicFollowers?: boolean;
  publicFollowing?: boolean;
  publicLikes?: boolean;
  publicViews?: boolean;
  whoCanSeeFollowers?: 'public' | 'friends' | 'private';
  whoCanSeeFollowing?: 'public' | 'friends' | 'private';
  whoCanSeeLikes?: 'public' | 'friends' | 'private';
  whoCanSeeSubscribe?: 'public' | 'friends' | 'private';
}

export interface Account {
  id: string;
  name: string;
  type: AccountType;
  avatar: string;
  cover?: string;
  bio?: string;
  contact?: string;
  extra?: string;
  links?: string[];
  locationLink?: string; 
  items?: ContentItem[];
  isNew?: boolean;
  verificationStatus?: 'Unverified' | 'Pending' | 'Verified';
  preferences?: AccountPreferences;
}

interface AccountContextProps {
  activeAccount: Account;
  availableAccounts: Account[];
  switchAccount: (id: string) => void;
  registerAccount: (data: Omit<Account, 'id' | 'avatar' | 'items'>) => void;
  updateActiveAccount: (data: Partial<Account>) => void;
  addPost: (post: Omit<ContentItem, 'id' | 'timestamp'>) => void;
  removePost: (id: string) => void;
  togglePinPost: (id: string) => void;
  toggleArchivePost: (id: string) => void;
  hasInitialized: boolean;
}

const DEFAULT_PREFERENCES: AccountPreferences = {
  publicFollowers: true,
  publicFollowing: true,
  publicLikes: true,
  publicViews: true,
  whoCanSeeFollowers: 'public',
  whoCanSeeFollowing: 'public',
  whoCanSeeLikes: 'public',
  whoCanSeeSubscribe: 'public',
};

const DEFAULT_PRIBADI: Account = { 
  id: 'acc-temp', 
  name: 'Calon Member', 
  type: 'pribadi', 
  avatar: 'https://picsum.photos/seed/temp/100',
  bio: 'Akun sementara sebelum onboarding.',
  isNew: true,
  preferences: DEFAULT_PREFERENCES,
  items: []
};

const STORAGE_KEY_ACCOUNTS = 'tapp_user_accounts_v1';
const STORAGE_KEY_ACTIVE_ID = 'tapp_active_account_id_v1';

const AccountContext = createContext<AccountContextProps | undefined>(undefined);

export const AccountProvider = ({ children }: { children: ReactNode }) => {
  const [accounts, setAccounts] = useState<Account[]>([DEFAULT_PRIBADI]);
  const [activeAccountId, setActiveAccountId] = useState<string>('acc-temp');
  const [hasInitialized, setHasInitialized] = useState(false);

  useEffect(() => {
    const savedActive = localStorage.getItem(STORAGE_KEY_ACTIVE_ID);
    const savedAccounts = localStorage.getItem(STORAGE_KEY_ACCOUNTS);
    
    if (savedAccounts) {
      try {
        const parsed = JSON.parse(savedAccounts);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const migratedAccounts = parsed.map((acc: Account) => ({
            ...acc,
            preferences: acc.preferences || DEFAULT_PREFERENCES,
            items: (acc.items || []).map(item => ({
              ...item,
              displayLocation: item.displayLocation || 'both',
              isPinned: item.isPinned || false,
              isArchived: item.isArchived || false
            }))
          }));
          
          setAccounts(migratedAccounts);
          
          if (savedActive && migratedAccounts.some((a: any) => a.id === savedActive)) {
            setActiveAccountId(savedActive);
          } else {
            setActiveAccountId(migratedAccounts[0].id);
          }
        }
      } catch (e) {
        console.error("Gagal memuat data akun:", e);
      }
    }
    setHasInitialized(true);
  }, []);

  useEffect(() => {
    if (hasInitialized) {
      try {
        localStorage.setItem(STORAGE_KEY_ACCOUNTS, JSON.stringify(accounts));
        localStorage.setItem(STORAGE_KEY_ACTIVE_ID, activeAccountId);
      } catch (e: any) {
        console.error("Gagal menyimpan ke storage:", e);
      }
    }
  }, [accounts, activeAccountId, hasInitialized]);

  const switchAccount = useCallback((id: string) => {
    setActiveAccountId(id);
  }, []);

  const registerAccount = useCallback((data: Omit<Account, 'id' | 'avatar' | 'items'>) => {
    const newId = `acc-${Date.now()}`;
    const newAccount: Account = {
      ...data,
      id: newId,
      avatar: data.type === 'bisnis' 
        ? `https://picsum.photos/seed/biz${Date.now()}/100` 
        : data.type === 'professional' 
          ? `https://picsum.photos/seed/pro${Date.now()}/100` 
          : `https://picsum.photos/seed/user${Date.now()}/100`,
      links: data.links || [],
      items: [],
      isNew: false,
      verificationStatus: data.type === 'pribadi' ? 'Verified' : 'Unverified',
      preferences: DEFAULT_PREFERENCES
    };

    setAccounts(prev => {
      const filtered = prev.filter(acc => acc.id !== 'acc-temp');
      return [...filtered, newAccount];
    });
    
    setActiveAccountId(newId);
  }, []);

  const updateActiveAccount = useCallback((data: Partial<Account>) => {
    setAccounts(prev => prev.map(acc => 
      acc.id === activeAccountId ? { ...acc, ...data, isNew: false } : acc
    ));
  }, [activeAccountId]);

  const addPost = useCallback((post: Omit<ContentItem, 'id' | 'timestamp'>) => {
    const newItem: ContentItem = {
      ...post,
      id: `post-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' hari ini',
      isPinned: false,
      isArchived: false
    };
    
    setAccounts(prev => prev.map(acc => {
      if (acc.id === activeAccountId) {
        return { ...acc, items: [newItem, ...(acc.items || [])] };
      }
      return acc;
    }));
  }, [activeAccountId]);

  const removePost = useCallback((id: string) => {
    setAccounts(prev => prev.map(acc => {
      if (acc.id === activeAccountId) {
        return { ...acc, items: (acc.items || []).filter(item => item.id !== id) };
      }
      return acc;
    }));
  }, [activeAccountId]);

  const togglePinPost = useCallback((id: string) => {
    setAccounts(prev => prev.map(acc => {
      if (acc.id === activeAccountId) {
        return {
          ...acc,
          items: (acc.items || []).map(item => 
            item.id === id ? { ...item, isPinned: !item.isPinned } : { ...item, isPinned: false } // Only one can be pinned usually
          )
        };
      }
      return acc;
    }));
  }, [activeAccountId]);

  const toggleArchivePost = useCallback((id: string) => {
    setAccounts(prev => prev.map(acc => {
      if (acc.id === activeAccountId) {
        return {
          ...acc,
          items: (acc.items || []).map(item => 
            item.id === id ? { ...item, isArchived: !item.isArchived } : item
          )
        };
      }
      return acc;
    }));
  }, [activeAccountId]);

  const activeAccount = accounts.find(a => a.id === activeAccountId) || accounts[0] || DEFAULT_PRIBADI;

  return (
    <AccountContext.Provider value={{ 
      activeAccount, 
      availableAccounts: accounts, 
      switchAccount, 
      registerAccount, 
      updateActiveAccount, 
      addPost, 
      removePost, 
      togglePinPost,
      toggleArchivePost,
      hasInitialized 
    }}>
      {children}
    </AccountContext.Provider>
  );
};

export const useAccount = () => {
  const context = useContext(AccountContext);
  if (!context) {
    throw new Error('useAccount must be used within an AccountProvider');
  }
  return context;
};
