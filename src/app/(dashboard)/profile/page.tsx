
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
  User,
  RefreshCw,
  Sparkles
} from "lucide-react";
import { useUser } from "@/firebase";
import { translateText } from "@/ai/flows/translate-flow";
import { useLanguage } from "@/context/language-context";

export default function ProfilePage() {
  const { user } = useUser();
  const { language } = useLanguage();
  const userInitial = user?.email ? user.email[0].toUpperCase() : "U";

  const [overviewTrans, setOverviewTrans] = React.useState({
    text: "",
    show: false,
    loading: false,
    detected: ""
  });

  const originalOverview = "We are an active participant in the OnTapp Global Discovery Network. Our focus is on accelerating industrial efficiency through strategic partnerships and real-time data integration.";

  const handleTranslateOverview = async () => {
    if (overviewTrans.text) {
      setOverviewTrans(prev => ({ ...prev, show: !prev.show }));
      return;
    }

    setOverviewTrans(prev => ({ ...prev, loading: true }));

    try {
      const { translatedText, detectedLanguage } = await translateText({
        text: originalOverview,
        targetLanguage: language
      });
      setOverviewTrans({
        text: translatedText,
        show: true,
        loading: false,
        detected: detectedLanguage
      });
    } catch (err) {
      console.error("Overview translation failed", err);
      setOverviewTrans(prev => ({ ...prev, loading: false }));
    }
  };

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
                <AvatarImage src={`https://picsum.photos/seed/${user?.uid}/400`} />
                <AvatarFallback className="text-3xl font-black bg-indigo-50 text-accent">{userInitial}</AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-2 pb-2">
                <div className="flex flex-wrap items-center gap-3">
                  <h1 className="text-3xl font-black text-slate-900 tracking-tight">{user?.displayName || "Member Organization"}</h1>
                  <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200 flex gap-1 items-center px-3 py-1 font-bold">
                    <ShieldCheck className="size-3" /> Verified Account
                  </Badge>
                </div>
                <div className="flex flex-wrap items-center gap-4 text-slate-500 font-medium text-sm">
                  <span className="flex items-center gap-1.5"><Building2 className="size-4" /> SaaS & AI Infrastructure</span>
                  <span className="flex items-center gap-1.5"><MapPin className="size-4" /> Global Headquarters</span>
                  <span className="flex items-center gap-1.5"><Calendar className="size-4" /> Active on OnTapp</span>
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
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Login ID</span>
                  <div className="flex items-center gap-2 text-sm font-bold text-slate-700">
                    <User className="size-4 text-slate-300" />
                    {user?.uid.substring(0, 12)}...
                  </div>
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Business Email</span>
                  <div className="flex items-center gap-2 text-sm font-bold text-slate-700">
                    <Mail className="size-4 text-slate-300" />
                    {user?.email}
                  </div>
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Account Status</span>
                  <div className="flex items-center gap-2 text-sm font-bold text-accent">
                    <ShieldCheck className="size-4" />
                    Active Enterprise
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
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-lg font-bold">Business Overview</CardTitle>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={handleTranslateOverview}
                  className="h-8 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-accent gap-2"
                  disabled={overviewTrans.loading}
                >
                  {overviewTrans.loading ? (
                    <RefreshCw className="size-3 animate-spin" />
                  ) : (
                    <Globe className="size-3" />
                  )}
                  {overviewTrans.show ? "Original" : "Translate"}
                </Button>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="relative">
                  <p className="text-slate-600 leading-relaxed font-medium">
                    {overviewTrans.show ? overviewTrans.text : originalOverview}
                  </p>
                  {overviewTrans.show && (
                    <div className="mt-3 text-[10px] font-black text-accent uppercase tracking-widest flex items-center gap-1.5 bg-indigo-50/50 w-fit px-3 py-1.5 rounded-lg border border-indigo-100/50">
                      <Sparkles className="size-3" />
                      AI Translated to {language.toUpperCase()}
                    </div>
                  )}
                </div>
                <div className="space-y-3 pt-4 border-t border-slate-100">
                  <h4 className="text-sm font-black text-slate-900 uppercase tracking-tight">Core Expertise</h4>
                  <div className="flex flex-wrap gap-2">
                    {["Digital Strategy", "Network Scaling", "B2B Analytics", "Scalable Systems"].map(tag => (
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
                <CardTitle className="text-lg font-bold">Recent Network Activity</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y divide-slate-100">
                  <div className="p-6 flex items-center justify-between hover:bg-slate-50 transition-colors cursor-pointer">
                    <div className="space-y-1">
                      <h4 className="font-bold text-slate-900">Authored New Listing</h4>
                      <p className="text-sm text-slate-500 font-medium">Updated sourcing requirements for tech hardware.</p>
                    </div>
                    <Badge className="bg-indigo-50 text-accent font-bold">Activity</Badge>
                  </div>
                  <div className="p-6 flex items-center justify-between hover:bg-slate-50 transition-colors cursor-pointer">
                    <div className="space-y-1">
                      <h4 className="font-bold text-slate-900">Joined Strategic Matchmaker</h4>
                      <p className="text-sm text-slate-500 font-medium">Now participating in AI-driven partner alignment.</p>
                    </div>
                    <Badge className="bg-emerald-50 text-emerald-600 font-bold">Network</Badge>
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
