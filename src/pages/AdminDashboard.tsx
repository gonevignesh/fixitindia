import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
    Users,
    Briefcase,
    ShieldCheck,
    Search,
    MoreVertical,
    TrendingUp,
    UserCheck,
    Plus,
    LayoutDashboard,
    Settings,
    Bell,
    Mail,
    ChevronRight,
    Megaphone,
    AlertTriangle,
    CheckCircle,
    Info,
    Phone
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useSearchParams } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const container = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1
        }
    }
};

const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
};

const AdminDashboard = () => {
    const { user } = useAuth();
    const { toast } = useToast();
    const [searchParams, setSearchParams] = useSearchParams();
    const tabParam = searchParams.get('tab') || 'overview';
    const [activeTab, setActiveTab] = useState(tabParam);
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState([
        { label: "Total Customers", value: "0", icon: Users, color: "bg-blue-500", text: "text-blue-500", trend: "0%" },
        { label: "Total Technicians", value: "0", icon: Briefcase, color: "bg-emerald-500", text: "text-emerald-500", trend: "0%" },
        { label: "Active Bookings", value: "0", icon: UserCheck, color: "bg-amber-500", text: "text-amber-500", trend: "0%" },
        { label: "Revenue (MTD)", value: "₹0", icon: TrendingUp, color: "bg-purple-500", text: "text-purple-500", trend: "0%" },
    ]);
    const [technicians, setTechnicians] = useState<any[]>([]);
    const [customers, setCustomers] = useState<any[]>([]);
    const [pendingApprovals, setPendingApprovals] = useState<any[]>([]);

    useEffect(() => {
        if (tabParam) setActiveTab(tabParam);
    }, [tabParam]);

    const handleTabChange = (val: string) => {
        setActiveTab(val);
        setSearchParams({ tab: val });
    };

    const fetchData = React.useCallback(async () => {
        try {
            // Always fetch stats for the overview
            const { count: customerCount } = await supabase.from('user_roles').select('*', { count: 'exact', head: true }).eq('role', 'customer');
            const { count: technicianCount } = await supabase.from('user_roles').select('*', { count: 'exact', head: true }).eq('role', 'technician');
            const { count: activeBookingCount } = await supabase.from('bookings').select('*', { count: 'exact', head: true }).in('status', ['pending', 'accepted', 'ongoing']);

            const firstDayOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString();
            const { data: revenueData } = await supabase.from('bookings').select('total_amount').eq('status', 'completed').gte('created_at', firstDayOfMonth);
            const mtdRevenue = revenueData?.reduce((acc, curr) => acc + (curr.total_amount || 0), 0) || 0;

            setStats([
                { label: "Total Customers", value: customerCount?.toString() || "0", icon: Users, color: "bg-blue-500", text: "text-blue-500", trend: "+2%" },
                { label: "Total Technicians", value: technicianCount?.toString() || "0", icon: Briefcase, color: "bg-emerald-500", text: "text-emerald-500", trend: "+1%" },
                { label: "Active Bookings", value: activeBookingCount?.toString() || "0", icon: UserCheck, color: "bg-amber-500", text: "text-amber-500", trend: "+5%" },
                { label: "Revenue (MTD)", value: `₹${mtdRevenue.toLocaleString('en-IN')}`, icon: TrendingUp, color: "bg-purple-500", text: "text-purple-500", trend: "+10%" },
            ]);

            // Conditional fetching based on tab to save bandwidth
            if (activeTab === 'users') {
                const { data: techData } = await supabase.from('profiles').select(`id, full_name, phone, user_roles!inner(role), technician_profiles(id_verified, skills, total_jobs, rating)`).eq('user_roles.role', 'technician').limit(50);
                if (techData) {
                    setTechnicians(techData.map(t => ({
                        id: t.id,
                        name: t.full_name,
                        phone: t.phone || 'No Phone',
                        skill: (t.technician_profiles as any)?.[0]?.skills?.[0] || 'General',
                        verified: (t.technician_profiles as any)?.[0]?.id_verified || false,
                        jobs: (t.technician_profiles as any)?.[0]?.total_jobs || 0,
                        rating: (t.technician_profiles as any)?.[0]?.rating || 0
                    })));
                }

                const { data: custData } = await supabase.from('profiles').select(`id, full_name, phone, created_at, user_roles!inner(role)`).eq('user_roles.role', 'customer').limit(50);
                if (custData) {
                    setCustomers(custData.map(c => ({
                        id: c.id,
                        name: c.full_name,
                        phone: c.phone || 'N/A',
                        joined: new Date(c.created_at).toLocaleDateString()
                    })));
                }
            }

            if (activeTab === 'overview') {
                const { data: pendingData } = await supabase.from('technician_profiles').select(`id, skills, city, created_at, profiles!inner(full_name)`).eq('id_verified', false).limit(10);
                if (pendingData) {
                    setPendingApprovals(pendingData.map(p => ({
                        id: p.id,
                        name: (p.profiles as any).full_name,
                        skill: p.skills?.[0] || 'General',
                        city: p.city || 'Unknown',
                        applied: new Date(p.created_at).toLocaleDateString()
                    })));
                }
            }
        } catch (error) {
            console.error("Error fetching admin data:", error);
        } finally {
            setLoading(false);
        }
    }, [activeTab]);

    useEffect(() => {
        fetchData();
        const channel = supabase.channel('admin_realtime')
            .on('postgres_changes' as any, { event: '*', table: 'bookings' }, fetchData)
            .on('postgres_changes' as any, { event: '*', table: 'profiles' }, fetchData)
            .on('postgres_changes' as any, { event: '*', table: 'technician_profiles' }, fetchData)
            .subscribe();
        return () => { supabase.removeChannel(channel); };
    }, []);

    const approveTechnician = async (id: string) => {
        const { error } = await supabase.from('technician_profiles').update({ id_verified: true }).eq('id', id);
        if (error) {
            toast({ title: "Verification Failed", description: error.message, variant: "destructive" });
        } else {
            toast({ title: "Professional Verified", description: "The technician can now accept jobs." });
            fetchData();
        }
    };

    return (
        <div className="min-h-screen bg-[#f8fafc]">
            <main className="pt-24 pb-20 container">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                    <div>
                        <div className="flex items-center gap-3 mb-3">
                            <Badge variant="outline" className="bg-slate-900 text-white border-none px-3 py-1 flex items-center gap-2">
                                <ShieldCheck className="w-3 h-3" /> System Administrator
                            </Badge>
                            <div className="h-4 w-px bg-slate-200" />
                            <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Control Center active</p>
                        </div>
                        <h1 className="text-3xl md:text-4xl font-display font-bold text-slate-900">
                            FixIt <span className="text-primary">Operations</span>
                        </h1>
                    </div>
                    <div className="flex gap-3">
                        <Button variant="outline" size="lg" className="rounded-xl border-slate-200 bg-white font-bold" onClick={fetchData}>
                            <Settings className="w-4 h-4 mr-2 text-slate-400" /> Refresh
                        </Button>
                        <Button size="lg" className="rounded-xl shadow-lg shadow-primary/20 hover:shadow-primary/30 font-bold">
                            <Plus className="w-4 h-4 mr-2" /> Invite Member
                        </Button>
                    </div>
                </div>

                <Tabs value={activeTab} onValueChange={handleTabChange} className="space-y-8">
                    <TabsList className="bg-white p-1 rounded-2xl shadow-sm border border-slate-100 h-auto gap-1">
                        <TabsTrigger value="overview" className="rounded-xl px-6 py-2.5 font-bold data-[state=active]:bg-primary data-[state=active]:text-white">Overview</TabsTrigger>
                        <TabsTrigger value="users" className="rounded-xl px-6 py-2.5 font-bold data-[state=active]:bg-primary data-[state=active]:text-white">Users</TabsTrigger>
                        <TabsTrigger value="alerts" className="rounded-xl px-6 py-2.5 font-bold data-[state=active]:bg-primary data-[state=active]:text-white">Alerts</TabsTrigger>
                        <TabsTrigger value="broadcast" className="rounded-xl px-6 py-2.5 font-bold data-[state=active]:bg-primary data-[state=active]:text-white">Broadcast</TabsTrigger>
                    </TabsList>

                    <TabsContent value="overview" className="space-y-10">
                        <motion.div variants={container} initial="hidden" animate="show" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {stats.map((stat, i) => (
                                <motion.div key={i} variants={item}>
                                    <Card className="border-none shadow-sm hover:shadow-md transition-all relative overflow-hidden group">
                                        <CardContent className="p-6">
                                            <div className="flex items-center justify-between mb-4">
                                                <div className={`${stat.color}/10 p-3 rounded-2xl group-hover:scale-110 transition-transform`}>
                                                    <stat.icon className={`w-6 h-6 ${stat.text}`} />
                                                </div>
                                                <Badge variant="outline" className="bg-emerald-50 text-emerald-600 border-none font-bold">
                                                    {stat.trend}
                                                </Badge>
                                            </div>
                                            <p className="text-sm font-medium text-slate-500 mb-1">{stat.label}</p>
                                            <h4 className="text-2xl font-bold text-slate-900">{stat.value}</h4>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            ))}
                        </motion.div>

                        <div className="grid lg:grid-cols-3 gap-8">
                            <div className="lg:col-span-2">
                                <Card className="border-none shadow-sm h-full">
                                    <CardHeader>
                                        <CardTitle className="font-bold">Pending verifications</CardTitle>
                                        <CardDescription>Professionals waiting for account approval</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-4">
                                            {pendingApprovals.map(app => (
                                                <div key={app.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100 group hover:border-primary/20 transition-all">
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-12 h-12 rounded-xl bg-white border border-slate-200 flex items-center justify-center font-bold text-slate-400">
                                                            {app.name.charAt(0)}
                                                        </div>
                                                        <div>
                                                            <p className="font-bold text-slate-900">{app.name}</p>
                                                            <p className="text-xs text-slate-500">{app.skill} • {app.city}</p>
                                                        </div>
                                                    </div>
                                                    <div className="flex gap-2">
                                                        <Button size="sm" onClick={() => approveTechnician(app.id)} className="font-bold rounded-xl px-4">Approve</Button>
                                                        <Button size="sm" variant="outline" className="font-bold rounded-xl px-4 border-slate-200">Decline</Button>
                                                    </div>
                                                </div>
                                            ))}
                                            {pendingApprovals.length === 0 && (
                                                <div className="text-center py-10">
                                                    <CheckCircle className="w-10 h-10 text-emerald-500 mx-auto mb-2 opacity-20" />
                                                    <p className="text-slate-400 font-medium">All applications processed!</p>
                                                </div>
                                            )}
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                            <div className="space-y-6">
                                <Card className="border-none shadow-sm bg-slate-900 text-white relative overflow-hidden">
                                    <div className="absolute top-0 right-0 p-4 opacity-10"><TrendingUp size={100} /></div>
                                    <CardHeader>
                                        <CardTitle className="font-bold flex items-center gap-2"><Briefcase className="w-5 h-5 text-primary" /> Hiring Status</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="text-slate-400">Active Professionals</span>
                                            <span className="font-bold">{stats[1].value}</span>
                                        </div>
                                        <div className="w-full bg-white/5 rounded-full h-1.5">
                                            <div className="bg-primary h-full rounded-full" style={{ width: '65%' }}></div>
                                        </div>
                                        <Button className="w-full bg-white text-slate-900 hover:bg-slate-100 font-bold rounded-xl">View Recruiting Tube</Button>
                                    </CardContent>
                                </Card>
                                <Card className="border-none shadow-sm">
                                    <CardHeader><CardTitle className="text-sm font-bold">Quick Actions</CardTitle></CardHeader>
                                    <CardContent className="space-y-2">
                                        <Button variant="outline" className="w-full justify-start font-bold rounded-xl border-slate-100"><Megaphone className="w-4 h-4 mr-2 text-primary" /> Run Promo Campaign</Button>
                                        <Button variant="outline" className="w-full justify-start font-bold rounded-xl border-slate-100"><ShieldCheck className="w-4 h-4 mr-2 text-primary" /> Security Audit</Button>
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                    </TabsContent>

                    <TabsContent value="users">
                        <Card className="border-none shadow-sm overflow-hidden min-h-[500px]">
                            <CardHeader className="bg-white border-b border-slate-100 py-6">
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                    <div>
                                        <CardTitle className="text-xl font-display font-bold">User Central</CardTitle>
                                        <CardDescription>Manage your customer and professional base</CardDescription>
                                    </div>
                                    <div className="relative w-full md:w-64">
                                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                        <Input
                                            placeholder="Search by name, phone..."
                                            className="pl-10 rounded-xl bg-slate-50 border-none"
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                        />
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="p-0">
                                <Tabs defaultValue="tech" className="w-full">
                                    <div className="px-6 border-b border-slate-100 bg-slate-50/20">
                                        <TabsList className="bg-transparent h-12 w-full justify-start gap-8">
                                            <TabsTrigger value="tech" className="px-0 h-12 font-bold data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none shadow-none bg-transparent">Technicians</TabsTrigger>
                                            <TabsTrigger value="cust" className="px-0 h-12 font-bold data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none shadow-none bg-transparent">Customers</TabsTrigger>
                                        </TabsList>
                                    </div>
                                    <TabsContent value="tech" className="m-0">
                                        <AdminTable data={technicians.filter(t => t.name.toLowerCase().includes(searchTerm.toLowerCase()))} type="tech" />
                                    </TabsContent>
                                    <TabsContent value="cust" className="m-0">
                                        <AdminTable data={customers.filter(c => c.name.toLowerCase().includes(searchTerm.toLowerCase()))} type="cust" />
                                    </TabsContent>
                                </Tabs>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="broadcast">
                        <Card className="border-none shadow-sm max-w-2xl mx-auto">
                            <CardHeader className="text-center">
                                <div className="w-16 h-16 rounded-3xl bg-primary/5 flex items-center justify-center text-primary mx-auto mb-4">
                                    <Megaphone size={32} />
                                </div>
                                <CardTitle className="text-2xl font-bold">Dispatch Message</CardTitle>
                                <CardDescription>Send real-time alerts to thousands of users instantly</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-700">Message Script</label>
                                    <textarea
                                        className="w-full h-40 p-5 rounded-2xl border-2 border-slate-100 focus:border-primary/30 outline-none transition-all resize-none bg-slate-50/50"
                                        placeholder="Enter notification content..."
                                    ></textarea>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <Button className="font-bold py-6 rounded-2xl shadow-lg shadow-primary/20">All Channels</Button>
                                    <Button variant="outline" className="font-bold py-6 rounded-2xl border-slate-200">Pros Only</Button>
                                </div>
                                <p className="text-[10px] text-slate-400 text-center uppercase tracking-[0.2em] font-bold">Standard SMS & Push protocols apply</p>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="alerts">
                        <div className="max-w-4xl mx-auto space-y-6">
                            <Card className="border-none shadow-sm">
                                <CardHeader>
                                    <CardTitle className="font-bold">System Integrity Logs</CardTitle>
                                </CardHeader>
                                <CardContent className="p-0">
                                    {[
                                        { type: "Security", msg: "Multiple failed login attempts detected in Delhi cluster", time: "5 min ago", icon: AlertTriangle, color: "text-rose-500", bg: "bg-rose-50" },
                                        { type: "Service", msg: "API Gateway latency spiked to 450ms", time: "22 min ago", icon: Info, color: "text-amber-500", bg: "bg-amber-50" },
                                        { type: "Success", msg: "Weekly database backup verified & stored", time: "2 hours ago", icon: CheckCircle, color: "text-emerald-500", bg: "bg-emerald-50" },
                                    ].map((l, i) => (
                                        <div key={i} className="flex items-center gap-6 p-6 border-b border-slate-50 last:border-0 hover:bg-slate-50 transition-colors">
                                            <div className={`${l.bg} ${l.color} p-3 rounded-2xl`}>
                                                <l.icon size={24} />
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex justify-between items-center mb-1">
                                                    <span className="text-xs font-bold uppercase tracking-widest text-slate-400">{l.type}</span>
                                                    <span className="text-xs text-slate-400">{l.time}</span>
                                                </div>
                                                <p className="font-bold text-slate-800">{l.msg}</p>
                                            </div>
                                        </div>
                                    ))}
                                </CardContent>
                            </Card>
                        </div>
                    </TabsContent>
                </Tabs>
            </main>
        </div>
    );
};

const AdminTable = ({ data, type }: { data: any[], type: 'tech' | 'cust' }) => (
    <div className="overflow-x-auto">
        <table className="w-full text-left">
            <thead className="bg-slate-50/50 border-b border-slate-100">
                <tr>
                    <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Identity</th>
                    <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">{type === "tech" ? "Domain" : "Engagement"}</th>
                    <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">{type === "tech" ? "Metrics" : "Support"}</th>
                    <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">Actions</th>
                </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
                {data.map((user) => (
                    <tr key={user.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-6 py-5">
                            <div className="flex items-center gap-4">
                                <div className={`w-10 h-10 rounded-xl ${type === 'tech' ? 'bg-primary/10 text-primary' : 'bg-blue-50 text-blue-600'} flex items-center justify-center font-bold`}>
                                    {user.name.charAt(0)}
                                </div>
                                <div>
                                    <p className="font-bold text-slate-900">{user.name}</p>
                                    <p className="text-xs text-slate-500 font-medium">{user.phone}</p>
                                </div>
                            </div>
                        </td>
                        <td className="px-6 py-5">
                            {type === 'tech' ? (
                                <Badge className="bg-slate-100 text-slate-600 border-none font-bold text-[10px] px-2 py-0.5">{user.skill}</Badge>
                            ) : (
                                <p className="text-xs text-slate-500 font-bold">Joined {user.joined}</p>
                            )}
                        </td>
                        <td className="px-6 py-5">
                            {type === 'tech' ? (
                                <div className="flex items-center gap-3">
                                    <span className="text-xs font-bold text-slate-900 flex items-center gap-1"><CheckCircle className="w-3 h-3 text-emerald-500" /> {user.jobs}</span>
                                    <span className="text-xs font-bold text-slate-900 flex items-center gap-1"><Megaphone className="w-3 h-3 text-amber-500" /> {user.rating}</span>
                                </div>
                            ) : (
                                <Button variant="ghost" size="sm" className="h-8 text-[10px] font-bold uppercase tracking-wider gap-1 hover:bg-blue-50 hover:text-blue-600"><Phone size={12} /> Call User</Button>
                            )}
                        </td>
                        <td className="px-6 py-5 text-right">
                            <Button variant="ghost" size="icon" className="rounded-lg text-slate-300 hover:text-slate-600"><MoreVertical size={16} /></Button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
);

export default AdminDashboard;
