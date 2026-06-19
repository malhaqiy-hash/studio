
'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type AccountType = 'pribadi' | 'professional' | 'bisnis';

export interface ContentItem {
  id: string;
  image: string;
  title?: string;
  description?: string;
  price?: string;
}

export interface Account {
  id: string;
  name: string;
  type: AccountType;
  avatar: string;
  bio?: string;
  contact?: string;
  extra?: string; // Keahlian for Professional, Kategori for Bisnis
  links?: string[];
  items?: ContentItem[];
}

interface AccountContextProps {
  activeAccount: Account;
  availableAccounts: Account[];
  switchAccount: (id: string) => void;
  registerAccount: (data: Omit<Account, 'id' | 'avatar' | 'items'>) => void;
  updateActiveAccount: (data: Partial<Account>) => void;
}

const DEFAULT_PRIBADI: Account = { 
  id: 'acc-1', 
  name: 'John Doe', 
  type: 'pribadi', 
  avatar: 'https://picsum.photos/seed/user1/100',
  bio: 'Networking enthusiast and business connector.',
  contact: '+62 812 3456 7890',
  links: ['https://instagram.com/johndoe', 'https://linkedin.com/in/johndoe'],
  items: [
    { id: 'item-1', image: 'https://picsum.photos/seed/post1/600/600', description: 'Checking out the new office today!' },
    { id: 'item-2', image: 'https://picsum.photos/seed/post2/600/600', description: 'Great meeting with the OnTapp team.' }
  ]
};

const AccountContext = createContext<AccountContextProps | undefined>(undefined);

export const AccountProvider = ({ children }: { children: ReactNode }) => {
  const [activeAccountId, setActiveAccountId] = useState<string>('acc-1');
  const [accounts, setAccounts] = useState<Account[]>([DEFAULT_PRIBADI]);

  useEffect(() => {
    const savedActive = localStorage.getItem('ontapp_active_account_id');
    const savedAccounts = localStorage.getItem('ontapp_user_accounts');
    
    if (savedAccounts) {
      try {
        setAccounts(JSON.parse(savedAccounts));
      } catch (e) {
        setAccounts([DEFAULT_PRIBADI]);
      }
    }
    if (savedActive) setActiveAccountId(savedActive);
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
      items: []
    };

    const updatedAccounts = [...accounts, newAccount];
    setAccounts(updatedAccounts);
    localStorage.setItem('ontapp_user_accounts', JSON.stringify(updatedAccounts));
    switchAccount(newAccount.id);
  };

  const updateActiveAccount = (data: Partial<Account>) => {
    const updatedAccounts = accounts.map(acc => 
      acc.id === activeAccountId ? { ...acc, ...data } : acc
    );
    setAccounts(updatedAccounts);
    localStorage.setItem('ontapp_user_accounts', JSON.stringify(updatedAccounts));
  };

  const activeAccount = accounts.find(a => a.id === activeAccountId) || accounts[0];

  return (
    <AccountContext.Provider value={{ activeAccount, availableAccounts: accounts, switchAccount, registerAccount, updateActiveAccount }}>
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
