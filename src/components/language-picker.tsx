'use client';

import * as React from 'react';
import { useLanguage, LANGUAGES } from '@/context/language-context';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Globe, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';

export function LanguagePicker() {
  const { language, setLanguage } = useLanguage();

  const currentLang = LANGUAGES.find((l) => l.code === language) || LANGUAGES[0];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="h-9 px-3 rounded-xl border border-slate-200 hover:bg-slate-50 flex gap-2 font-bold text-slate-600 transition-all"
        >
          <span className="text-base leading-none">{currentLang.flag}</span>
          <span className="hidden sm:inline-block text-xs uppercase tracking-widest">{currentLang.code}</span>
          <Globe className="size-3.5 text-slate-400" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56 rounded-2xl p-0 shadow-2xl border-slate-100 overflow-hidden">
        <div className="px-3 py-3 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b bg-muted/10">
          System Language
        </div>
        <ScrollArea className="h-64">
          <div className="p-1">
            {LANGUAGES.map((lang) => (
              <DropdownMenuItem
                key={lang.code}
                onClick={() => {
                  setLanguage(lang.code);
                }}
                className={cn(
                  "flex items-center justify-between px-3 py-2.5 rounded-xl cursor-pointer transition-colors font-bold mb-0.5",
                  language === lang.code ? "bg-black/5 text-black" : "text-slate-600 focus:bg-slate-50"
                )}
              >
                <div className="flex items-center gap-3">
                  <span className="text-lg leading-none">{lang.flag}</span>
                  <span className="text-sm">{lang.label}</span>
                </div>
                {language === lang.code && <Check className="size-4" />}
              </DropdownMenuItem>
            ))}
          </div>
        </ScrollArea>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
