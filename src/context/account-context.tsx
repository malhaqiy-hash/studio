
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

const ALL_POSSIBLE_ACCOUNTS: Account[] = [
  { id: 'acc-1', name: 'John Doe', type: 'pribadi', avatar: 'https://picsum.photos/seed/user1/100' },
  { id: 'acc-2', name: 'John Studio', type: 'professional', avatar: 'https://picsum.photos/seed/pro1/100' },
  { id: 'acc-3', name: 'OnTapp Corp', type: 'bisnis', avatar: 'https://picsum.photos/seed/biz1/100' },
];

const AccountContext = createContext<AccountContextProps | undefined>(undefined);

export const AccountProvider = ({ children }: { children: ReactNode }) => {
  const [activeAccountId, setActiveAccountId] = useState<string>('acc-1');
  const [activatedIds, setActivatedIds] = useState<string[]>(['acc-1']);

  useEffect(() => {
    const savedActive = localStorage.getItem('ontapp_active_account_id');
    const savedActivated = localStorage.getItem('ontapp_activated_account_ids');
    
    if (savedActive) setActiveAccountId(savedActive);
    if (savedActivated) {
      try {
        setActivatedIds(JSON.parse(savedActivated));
      } catch (e) {
        setActivatedIds(['acc-1']);
      }
    }
  }, []);

  const switchAccount = (id: string) => {
    setActiveAccountId(id);
    localStorage.setItem('ontapp_active_account_id', id);
  };

  const activateAccountType = (type: AccountType) => {
    const accountToActivate = ALL_POSSIBLE_ACCOUNTS.find(a => a.type === type);
    if (accountToActivate) {
      const newActivatedIds = Array.from(new Set([...activatedIds, accountToActivate.id]));
      setActivatedIds(newActivatedIds);
      localStorage.setItem('ontapp_activated_account_ids', JSON.stringify(newActivatedIds));
      switchAccount(accountToActivate.id);
    }
  };

  const availableAccounts = ALL_POSSIBLE_ACCOUNTS.filter(a => activatedIds.includes(a.id));
  const activeAccount = ALL_POSSIBLE_ACCOUNTS.find(a => a.id === activeAccountId) || ALL_POSSIBLE_ACCOUNTS[0];

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
