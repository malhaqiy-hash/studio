
"use client";

import * as React from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Card, CardContent, CardHeader, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { 
  Heart, 
  MessageCircle, 
  Share2, 
  MoreHorizontal, 
  Plus,
  Image as ImageIcon,
  Link as LinkIcon,
  ShoppingBag,
  Target
} from "lucide-react";
import { Input } from "@/components/ui/input";

const MOCK_POSTS = [
  {
    id: 1,
    company: "GreenEco Packaging",
    avatar: "https://picsum.photos/seed/eco/100",
    role: "Supplier",
    type: "Product",
    content: "Excited to launch our new 100% biodegradable shipping envelopes! Perfect for e-commerce businesses looking to reduce their carbon footprint. Bulk orders now open.",
    image: "https://picsum.photos/seed/package/800/500",
    likes: 45,
    comments: 12,
    time: "2h ago"
  },
  {
    id: 2,
    company: "FastTrack Logistics",
    avatar: "https://picsum.photos/seed/log/100",
    role: "Service Provider",
    type: "Service",
    content: "New route established between Singapore and Rotterdam. Guaranteed 15% faster delivery times for tech hardware shipments. Contact us for updated pricing schedules.",
    likes: 28,
    comments: 5,
    time: "5h ago"
  },
  {
    id: 3,
    company: "Skyline Ventures",
    avatar: "https://picsum.photos/seed/invest/100",
    role: "Enterprise",
    type: "Opportunity",
    content: "We are actively seeking early-stage B2B SaaS partners in the Southeast Asian market for our Q3 acceleration program. Focus on Supply Chain and FinTech.",
    likes: 89,
    comments: 24,
    time: "1d ago"
  }
];

export default function FeedPage() {
  return (
    <DashboardLayout>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-6">
          {/* Create Post Card */}
          <Card className="shadow-sm border-slate-200">
            <CardContent className="p-6">
              <div className="flex gap-4">
                <Avatar className="size-10 border shadow-sm">
                  <AvatarImage src="https://picsum.photos/seed/alpha/100" />
                  <AvatarFallback>AT</AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-4">
                  <textarea 
                    placeholder="Share a product, service, or business opportunity..."
                    className="w-full min-h-[100px] bg-slate-50 border-none resize-none focus:ring-0 rounded-xl p-4 text-sm font-medium placeholder:text-slate-400"
                  />
                  <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm" className="text-slate-500 rounded-full h-9 px-4 hover:bg-slate-100">
                        <ImageIcon className="size-4 mr-2 text-indigo-500" />
                        Media
                      </Button>
                      <Button variant="ghost" size="sm" className="text-slate-500 rounded-full h-9 px-4 hover:bg-slate-100">
                        <ShoppingBag className="size-4 mr-2 text-emerald-500" />
                        Product
                      </Button>
                      <Button variant="ghost" size="sm" className="text-slate-500 rounded-full h-9 px-4 hover:bg-slate-100">
                        <Target className="size-4 mr-2 text-orange-500" />
                        Opportunity
                      </Button>
                    </div>
                    <Button className="rounded-full px-6 bg-accent hover:bg-accent/90">Post</Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Social Feed */}
          {MOCK_POSTS.map((post) => (
            <Card key={post.id} className="shadow-sm border-slate-200 group transition-all hover:shadow-md">
              <CardHeader className="p-6 pb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar className="size-11 border shadow-sm ring-2 ring-white">
                      <AvatarImage src={post.avatar} />
                      <AvatarFallback>{post.company[0]}</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-slate-900 hover:text-accent cursor-pointer transition-colors">{post.company}</h3>
                        <Badge variant="secondary" className="text-[10px] font-bold uppercase tracking-tight py-0 px-2 bg-slate-100 text-slate-600">
                          {post.role}
                        </Badge>
                      </div>
                      <span className="text-xs text-muted-foreground">{post.time} • Global</span>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon" className="rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                    <MoreHorizontal className="size-5 text-slate-400" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="px-6 pb-4 space-y-4">
                <Badge className={`
                  ${post.type === 'Product' ? 'bg-indigo-50 text-indigo-600 border-indigo-100' : ''}
                  ${post.type === 'Service' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : ''}
                  ${post.type === 'Opportunity' ? 'bg-orange-50 text-orange-600 border-orange-100' : ''}
                  text-[10px] font-bold uppercase px-2
                `} variant="outline">
                  {post.type}
                </Badge>
                <p className="text-slate-700 leading-relaxed font-medium">
                  {post.content}
                </p>
                {post.image && (
                  <div className="rounded-2xl overflow-hidden border border-slate-100 shadow-sm">
                    <img src={post.image} alt="Post content" className="w-full h-auto object-cover max-h-[400px]" />
                  </div>
                )}
              </CardContent>
              <CardFooter className="px-6 py-4 border-t border-slate-50 flex items-center justify-between">
                <div className="flex items-center gap-6">
                  <button className="flex items-center gap-2 text-slate-500 hover:text-pink-500 transition-colors">
                    <Heart className="size-5" />
                    <span className="text-sm font-bold">{post.likes}</span>
                  </button>
                  <button className="flex items-center gap-2 text-slate-500 hover:text-accent transition-colors">
                    <MessageCircle className="size-5" />
                    <span className="text-sm font-bold">{post.comments}</span>
                  </button>
                </div>
                <button className="flex items-center gap-2 text-slate-400 hover:text-slate-600 transition-colors">
                  <Share2 className="size-5" />
                </button>
              </CardFooter>
            </Card>
          ))}
        </div>

        {/* Sidebar widgets */}
        <div className="lg:col-span-4 space-y-6 hidden lg:block">
          <Card className="shadow-sm border-slate-200 overflow-hidden">
            <div className="h-20 bg-gradient-to-r from-indigo-500 to-indigo-700" />
            <div className="px-6 pb-6 text-center -mt-10">
              <Avatar className="size-20 mx-auto border-4 border-white shadow-md">
                <AvatarImage src="https://picsum.photos/seed/alpha/200" />
                <AvatarFallback>AT</AvatarFallback>
              </Avatar>
              <h3 className="mt-3 font-bold text-lg">Alpha Tech Solutions</h3>
              <p className="text-xs text-muted-foreground font-medium uppercase mt-1">Enterprise Member</p>
              <div className="grid grid-cols-2 gap-4 mt-6 pt-6 border-t border-slate-100">
                <div className="text-center">
                  <span className="block text-lg font-bold">1,240</span>
                  <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Followers</span>
                </div>
                <div className="text-center">
                  <span className="block text-lg font-bold">452</span>
                  <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Posts</span>
                </div>
              </div>
              <Button className="w-full mt-6 rounded-xl bg-slate-900 text-white font-bold h-11" variant="default">
                View My Profile
              </Button>
            </div>
          </Card>

          <Card className="shadow-sm border-slate-200">
            <CardHeader className="p-6 pb-2">
              <h3 className="font-bold text-slate-900">Recommended Partners</h3>
            </CardHeader>
            <CardContent className="p-6 pt-0 space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center justify-between gap-3 group cursor-pointer">
                  <div className="flex items-center gap-3">
                    <Avatar className="size-10 border-slate-100">
                      <AvatarImage src={`https://picsum.photos/seed/rec${i}/100`} />
                      <AvatarFallback>P</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <span className="text-sm font-bold group-hover:text-accent transition-colors">Global Logistics Co.</span>
                      <span className="text-[10px] text-slate-400 font-medium">95% AI Match</span>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="rounded-full h-8 px-4 text-xs font-bold border-slate-200">
                    Follow
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
