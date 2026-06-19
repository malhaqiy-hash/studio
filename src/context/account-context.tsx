'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type AccountType = 'pribadi' | 'professional' | 'bisnis';

export interface Account {
  id: string;
  name: string;
  type: AccountType;
  avatar: string;
}

interface AccountContextProps {
  activeAccount: Account;
  availableAccounts: Account[];
  switchAccount: (id: string) => void;
  activateAccountType: (type: AccountType) => void;
}

const DEFAULT_ACCOUNTS: Account[] = [
  { id: 'acc-1', name: 'John Doe', type: 'pribadi', avatar: 'https://picsum.photos/seed/user1/100' },
  { id: 'acc-2', name: 'John Studio', type: 'professional', avatar: 'https://picsum.photos/seed/pro1/100' },
  { id: 'acc-3', name: 'OnTapp Corp', type: 'bisnis', avatar: 'https://picsum.photos/seed/biz1/100' },
];

const AccountContext = createContext<AccountContextProps | undefined>(undefined);

export const AccountProvider = ({ children }: { children: ReactNode }) => {
  const [activeAccountId, setActiveAccountId] = useState<string>('acc-1');
  const [availableAccounts] = useState<Account[]>(DEFAULT_ACCOUNTS);

  useEffect(() => {
    const saved = localStorage.getItem('ontapp_active_account_id');
    if (saved) setActiveAccountId(saved);
  }, []);

  const switchAccount = (id: string) => {
    setActiveAccountId(id);
    localStorage.setItem('ontapp_active_account_id', id);
  };

  const activateAccountType = (type: AccountType) => {
    const found = availableAccounts.find(a => a.type === type);
    if (found) switchAccount(found.id);
  };

  const activeAccount = availableAccounts.find(a => a.id === activeAccountId) || availableAccounts[0];

  return (
    <AccountContext.Provider value={{ activeAccount, availableAccounts, switchAccount, activateAccountType }}>
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
