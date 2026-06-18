"use client";

import * as React from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Building2, 
  Mail, 
  MapPin, 
  Globe, 
  Calendar, 
  ShieldCheck, 
  Edit3,
  Link as LinkIcon,
  Twitter,
  Linkedin,
  User
} from "lucide-react";

export default function ProfilePage() {
  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-8 pb-20">
        {/* Profile Header Card */}
        <Card className="border-slate-200 shadow-sm overflow-hidden rounded-[2rem]">
          <div className="h-48 bg-gradient-to-r from-indigo-500 via-accent to-indigo-700 relative">
            <div className="absolute top-6 right-6 flex gap-2">
              <Button variant="secondary" className="bg-white/10 hover:bg-white/20 text-white border-white/20 backdrop-blur-md font-bold rounded-xl h-10 px-6">
                <Edit3 className="size-4 mr-2" />
                Edit Profile
              </Button>
            </div>
          </div>
          <CardContent className="px-8 pb-8">
            <div className="relative flex flex-col md:flex-row items-end gap-6 -mt-12 md:-mt-16">
              <Avatar className="size-32 md:size-40 border-4 border-white shadow-xl ring-2 ring-slate-100">
                <AvatarImage src="https://picsum.photos/seed/user/400" />
                <AvatarFallback className="text-3xl font-black bg-indigo-50 text-accent">AT</AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-2 pb-2">
                <div className="flex flex-wrap items-center gap-3">
                  <h1 className="text-3xl font-black text-slate-900 tracking-tight">Alpha Tech Solutions</h1>
                  <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200 flex gap-1 items-center px-3 py-1 font-bold">
                    <ShieldCheck className="size-3" /> Verified Enterprise
                  </Badge>
                </div>
                <div className="flex flex-wrap items-center gap-4 text-slate-500 font-medium text-sm">
                  <span className="flex items-center gap-1.5"><Building2 className="size-4" /> SaaS & AI Infrastructure</span>
                  <span className="flex items-center gap-1.5"><MapPin className="size-4" /> San Francisco, CA</span>
                  <span className="flex items-center gap-1.5"><Calendar className="size-4" /> Joined Oct 2023</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Contact & Links */}
          <div className="space-y-6">
            <Card className="border-slate-200 shadow-sm rounded-[1.5rem]">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg font-bold">Account Info</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-1">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Admin Name</span>
                  <div className="flex items-center gap-2 text-sm font-bold text-slate-700">
                    <User className="size-4 text-slate-300" />
                    Jane Cooper
                  </div>
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Email Address</span>
                  <div className="flex items-center gap-2 text-sm font-bold text-slate-700">
                    <Mail className="size-4 text-slate-300" />
                    admin@alphatech.solutions
                  </div>
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Account Type</span>
                  <div className="flex items-center gap-2 text-sm font-bold text-accent">
                    <ShieldCheck className="size-4" />
                    Enterprise Member
                  </div>
                </div>
                <div className="pt-4 flex gap-3">
                  <Button variant="outline" size="icon" className="rounded-xl border-slate-200 hover:bg-slate-50">
                    <Linkedin className="size-4 text-slate-600" />
                  </Button>
                  <Button variant="outline" size="icon" className="rounded-xl border-slate-200 hover:bg-slate-50">
                    <Twitter className="size-4 text-slate-600" />
                  </Button>
                  <Button variant="outline" size="icon" className="rounded-xl border-slate-200 hover:bg-slate-50">
                    <LinkIcon className="size-4 text-slate-600" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="border-slate-200 shadow-sm bg-slate-900 text-white rounded-[1.5rem]">
              <CardContent className="p-6 space-y-4">
                <h3 className="font-bold text-lg">Network Influence</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                    <span className="block text-2xl font-black">1.2K</span>
                    <span className="text-[10px] text-indigo-300 font-bold uppercase tracking-widest">Followers</span>
                  </div>
                  <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                    <span className="block text-2xl font-black">452</span>
                    <span className="text-[10px] text-indigo-300 font-bold uppercase tracking-widest">Posts</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* About & Details */}
          <div className="md:col-span-2 space-y-6">
            <Card className="border-slate-200 shadow-sm rounded-[1.5rem]">
              <CardHeader>
                <CardTitle className="text-lg font-bold">Business Overview</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <p className="text-slate-600 leading-relaxed font-medium">
                  We are a leading provider of enterprise AI solutions and cloud infrastructure, specializing in the manufacturing and industrial sectors. Our mission is to accelerate global industrial efficiency through predictive maintenance and real-time data analytics.
                </p>
                <div className="space-y-3">
                  <h4 className="text-sm font-black text-slate-900 uppercase tracking-tight">Core Expertise</h4>
                  <div className="flex flex-wrap gap-2">
                    {["Predictive AI", "Cloud Infrastructure", "Industrial IoT", "B2B Analytics", "Scalable Systems"].map(tag => (
                      <Badge key={tag} variant="secondary" className="bg-slate-100 text-slate-600 border-none px-3 py-1 font-bold">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-slate-200 shadow-sm rounded-[1.5rem]">
              <CardHeader>
                <CardTitle className="text-lg font-bold">Active Engagements</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y divide-slate-100">
                  <div className="p-6 flex items-center justify-between hover:bg-slate-50 transition-colors cursor-pointer">
                    <div className="space-y-1">
                      <h4 className="font-bold text-slate-900">EU Hardware Partnership</h4>
                      <p className="text-sm text-slate-500 font-medium">Seeking IoT sensor manufacturers for Q4 expansion.</p>
                    </div>
                    <Badge className="bg-indigo-50 text-accent font-bold">Strategic</Badge>
                  </div>
                  <div className="p-6 flex items-center justify-between hover:bg-slate-50 transition-colors cursor-pointer">
                    <div className="space-y-1">
                      <h4 className="font-bold text-slate-900">API Documentation Support</h4>
                      <p className="text-sm text-slate-500 font-medium">Open tender for technical writing services.</p>
                    </div>
                    <Badge className="bg-emerald-50 text-emerald-600 font-bold">Sourcing</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
