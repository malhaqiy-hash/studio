'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type AccountType = 'pribadi' | 'professional' | 'bisnis';

export interface ContentItem {
  id: string;
  image?: string;
  title?: string;
  description?: string;
  price?: string;
  visibility?: 'public' | 'private';
  timestamp?: string;
  locationLink?: string;
}

export interface AccountPreferences {
  publicFollowers?: boolean;
  publicFollowing?: boolean;
  publicLikes?: boolean;
  publicViews?: boolean;
}

export interface Account {
  id: string;
  name: string;
  type: AccountType;
  avatar: string;
  bio?: string;
  contact?: string;
  extra?: string;
  links?: string[];
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
  hasInitialized: boolean;
}

const DEFAULT_PREFERENCES: AccountPreferences = {
  publicFollowers: true,
  publicFollowing: true,
  publicLikes: true,
  publicViews: false,
};

const DEFAULT_PRIBADI: Account = { 
  id: 'acc-temp', 
  name: 'Calon Member', 
  type: 'pribadi', 
  avatar: 'https://picsum.photos/seed/temp/100',
  bio: 'Akun sementara sebelum onboarding.',
  isNew: true,
  preferences: DEFAULT_PREFERENCES
};

const AccountContext = createContext<AccountContextProps | undefined>(undefined);

export const AccountProvider = ({ children }: { children: ReactNode }) => {
  const [activeAccountId, setActiveAccountId] = useState<string>('acc-temp');
  const [accounts, setAccounts] = useState<Account[]>([DEFAULT_PRIBADI]);
  const [hasInitialized, setHasInitialized] = useState(false);

  useEffect(() => {
    const savedActive = localStorage.getItem('ontapp_active_account_id');
    const savedAccounts = localStorage.getItem('ontapp_user_accounts');
    
    if (savedAccounts) {
      try {
        const parsed = JSON.parse(savedAccounts);
        if (parsed.length > 0) {
          const migratedAccounts = parsed.map((acc: Account) => ({
            ...acc,
            preferences: acc.preferences || DEFAULT_PREFERENCES
          }));
          setAccounts(migratedAccounts);
          if (savedActive && migratedAccounts.some((a: any) => a.id === savedActive)) {
            setActiveAccountId(savedActive);
          } else {
            setActiveAccountId(migratedAccounts[0].id);
          }
        }
      } catch (e) {
        console.error("Failed to parse accounts", e);
      }
    }
    setHasInitialized(true);
  }, []);

  const switchAccount = (id: string) => {
    setActiveAccountId(id);
    localStorage.setItem('ontapp_active_account_id', id);
  };

  const registerAccount = (data: Omit<Account, 'id' | 'avatar' | 'items'>) => {
    const newAccount: Account = {
      ...data,
      id: `acc-${Date.now()}`,
      avatar: data.type === 'bisnis' 
        ? `https://picsum.photos/seed/biz${Date.now()}/100` 
        : data.type === 'professional' 
          ? `https://picsum.photos/seed/pro${Date.now()}/100` 
          : `https://picsum.photos/seed/user${Date.now()}/100`,
      links: [],
      items: [],
      isNew: false,
      verificationStatus: data.type === 'pribadi' ? 'Verified' : 'Unverified',
      preferences: DEFAULT_PREFERENCES
    };

    const filteredAccounts = accounts.filter(acc => acc.id !== 'acc-temp');
    const updatedAccounts = [...filteredAccounts, newAccount];
    
    setAccounts(updatedAccounts);
    localStorage.setItem('ontapp_user_accounts', JSON.stringify(updatedAccounts));
    switchAccount(newAccount.id);
  };

  const updateActiveAccount = (data: Partial<Account>) => {
    const updatedAccounts = accounts.map(acc => 
      acc.id === activeAccountId ? { ...acc, ...data, isNew: false } : acc
    );
    setAccounts(updatedAccounts);
    localStorage.setItem('ontapp_user_accounts', JSON.stringify(updatedAccounts));
  };

  const activeAccount = accounts.find(a => a.id === activeAccountId) || accounts[0];

  return (
    <AccountContext.Provider value={{ activeAccount, availableAccounts: accounts, switchAccount, registerAccount, updateActiveAccount, hasInitialized }}>
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
