
"use client";

import * as React from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Filter, MoreHorizontal, Download, Plus, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useCollection, useFirestore } from "@/firebase";
import { collection, query, orderBy } from "firebase/firestore";

export default function OpportunitiesPage() {
  const db = useFirestore();
  
  const opportunitiesQuery = React.useMemo(() => {
    if (!db) return null;
    return query(collection(db, "opportunities"), orderBy("date", "desc"));
  }, [db]);

  const { data: opportunities, loading: isLoading } = useCollection(opportunitiesQuery);

  return (
    <DashboardLayout>
      <div className="space-y-8 pb-10">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1">
            <h1 className="text-3xl font-headline font-black text-slate-900 tracking-tight leading-none">Global Opportunities</h1>
            <p className="text-slate-500 font-medium">Manage and track your strategic B2B leads across the network.</p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" className="rounded-xl border-slate-200 h-11 px-5 flex gap-2 font-bold text-slate-600">
              <Download className="size-4" />
              Export CSV
            </Button>
            <Button className="rounded-xl bg-accent hover:bg-indigo-600 text-white h-11 px-6 font-bold shadow-lg flex gap-2">
              <Plus className="size-4" />
              New Listing
            </Button>
          </div>
        </header>

        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
            <Input 
              placeholder="Search companies or types..." 
              className="pl-10 h-12 bg-white border-slate-200 rounded-2xl focus:ring-accent/10"
            />
          </div>
          <Button variant="outline" className="rounded-2xl border-slate-200 h-12 px-6 flex gap-2 font-bold text-slate-600 w-full md:w-auto">
            <Filter className="size-4" />
            Filter Results
          </Button>
        </div>

        <div className="bg-white rounded-[2rem] border border-slate-100 shadow-xl overflow-hidden">
          <Table>
            <TableHeader className="bg-slate-50/50">
              <TableRow className="border-slate-100 hover:bg-transparent">
                <TableHead className="w-[300px] py-6 font-black text-slate-400 uppercase tracking-widest text-[10px] px-8">Company Name</TableHead>
                <TableHead className="py-6 font-black text-slate-400 uppercase tracking-widest text-[10px]">Status</TableHead>
                <TableHead className="py-6 font-black text-slate-400 uppercase tracking-widest text-[10px]">Deadline Date</TableHead>
                <TableHead className="text-right py-6 font-black text-slate-400 uppercase tracking-widest text-[10px] px-8">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                [1, 2, 3, 4, 5].map((i) => (
                  <TableRow key={i} className="border-slate-50">
                    <TableCell className="py-5 px-8">
                      <div className="flex items-center gap-3">
                        <Skeleton className="size-10 rounded-xl" />
                        <div className="space-y-2">
                          <Skeleton className="h-4 w-32" />
                          <Skeleton className="h-3 w-16" />
                        </div>
                      </div>
                    </TableCell>
                    <TableCell><Skeleton className="h-6 w-20 rounded-lg" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                    <TableCell className="text-right px-8"><Skeleton className="h-9 w-24 ml-auto rounded-xl" /></TableCell>
                  </TableRow>
                ))
              ) : opportunities.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="h-32 text-center text-slate-400 font-medium">
                    No opportunities found in the network.
                  </TableCell>
                </TableRow>
              ) : (
                opportunities.map((opp: any) => (
                  <TableRow key={opp.id} className="border-slate-50 hover:bg-slate-50/50 transition-colors group">
                    <TableCell className="py-5 px-8">
                      <div className="flex items-center gap-3">
                        <Avatar className="size-10 rounded-xl border-2 border-white shadow-sm shrink-0">
                          <AvatarImage src={opp.logo} />
                          <AvatarFallback className="font-bold bg-slate-100 text-slate-400">{opp.companyName?.[0] || '?'}</AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col">
                          <span className="font-bold text-slate-900 leading-tight group-hover:text-accent transition-colors">{opp.companyName}</span>
                          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-0.5">{opp.type}</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={`
                        rounded-lg px-3 py-1 font-bold text-[10px] uppercase border-none
                        ${opp.status === 'Verified' ? 'bg-emerald-50 text-emerald-600' : ''}
                        ${opp.status === 'Closing Soon' ? 'bg-rose-50 text-rose-600 animate-pulse' : ''}
                        ${opp.status === 'Pending' ? 'bg-orange-50 text-orange-600' : ''}
                        ${opp.status === 'Active' ? 'bg-indigo-50 text-indigo-600' : ''}
                      `}>
                        {opp.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-medium text-slate-500 text-sm">
                      {opp.date}
                    </TableCell>
                    <TableCell className="text-right px-8">
                      <div className="flex items-center justify-end gap-2">
                        <Button variant="ghost" size="sm" className="rounded-xl font-bold text-accent hover:bg-indigo-50 h-9 px-4">
                          Manage
                        </Button>
                        <Button variant="ghost" size="icon" className="rounded-xl h-9 w-9 text-slate-400 hover:text-slate-600">
                          <MoreHorizontal className="size-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </DashboardLayout>
  );
}
