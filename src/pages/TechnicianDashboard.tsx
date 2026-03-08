import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
    Calendar,
    Clock,
    MapPin,
    Star,
    TrendingUp,
    DollarSign,
    CheckCircle2,
    Briefcase,
    Shield,
    Loader2,
    IndianRupee,
    Search,
    Navigation,
    ArrowRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
};

const TechnicianDashboard = () => {
    const { user } = useAuth();
    const { toast } = useToast();
    const [isAvailable, setIsAvailable] = useState(true);
    const [loading, setLoading] = useState(true);
    const [jobs, setJobs] = useState<any[]>([]);
    const [availableJobs, setAvailableJobs] = useState<any[]>([]);
    const [profile, setProfile] = useState<any>(null);
    const [stats, setStats] = useState({
        todayJobs: 0,
        completionRate: "100%",
        totalEarnings: "₹0",
        rating: "0.0"
    });

    const fetchData = async () => {
        if (!user) return;
        try {
            const { data: prof } = await supabase.from('technician_profiles').select('id, is_available, total_jobs, rating').eq('user_id', user.id).single();
            if (!prof) return;
            setProfile(prof);
            setIsAvailable(prof.is_available);

            // My Jobs
            const { data: myBookings } = await supabase.from('bookings').select(`id, status, scheduled_date, scheduled_time, total_amount, address, services(name), profiles!bookings_customer_id_fkey(full_name)`).eq('technician_id', prof.id).order('scheduled_date', { ascending: true });
            if (myBookings) {
                setJobs(myBookings.map(b => ({
                    id: b.id.slice(0, 8),
                    fullId: b.id,
                    customer: (b.profiles as any)?.full_name || "Customer",
                    service: (b.services as any)?.name || "Service",
                    time: `${b.scheduled_date} • ${b.scheduled_time}`,
                    status: b.status.charAt(0).toUpperCase() + b.status.slice(1),
                    location: b.address,
                    price: b.total_amount
                })));
                const earnings = myBookings.filter(b => b.status === 'completed').reduce((acc, curr) => acc + (curr.total_amount || 0), 0);
                setStats(prev => ({ ...prev, totalEarnings: `₹${earnings.toLocaleString('en-IN')}`, rating: prof.rating || "0.0", todayJobs: myBookings.filter(b => b.scheduled_date === new Date().toISOString().split('T')[0]).length }));
            }

            // Available Market Jobs
            const { data: marketplace } = await supabase.from('bookings').select(`id, scheduled_date, scheduled_time, total_amount, address, city, services(name)`).is('technician_id', null).eq('status', 'pending').limit(10);
            if (marketplace) {
                setAvailableJobs(marketplace.map(b => ({
                    id: b.id.slice(0, 8),
                    fullId: b.id,
                    service: (b.services as any)?.name || "Service",
                    time: `${b.scheduled_date} • ${b.scheduled_time}`,
                    location: `${b.address}, ${b.city}`,
                    price: b.total_amount
                })));
            }

        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
        const channel = supabase.channel('tech_realtime_all').on('postgres_changes' as any, { event: '*', table: 'bookings' }, fetchData).subscribe();
        return () => { supabase.removeChannel(channel); };
    }, [user]);

    const toggleAvailability = async (checked: boolean) => {
        setIsAvailable(checked);
        const { error } = await supabase.from('technician_profiles').update({ is_available: checked }).eq('user_id', user?.id);
        if (error) { toast({ title: "Failed", description: error.message, variant: "destructive" }); setIsAvailable(!checked); }
        else toast({ title: "Status Updated", description: checked ? "You are ONLINE" : "You are OFFLINE" });
    };

    const updateJobStatus = async (jobId: string, currentStatus: string) => {
        let next = "completed";
        const s = currentStatus.toLowerCase();
        if (s === 'pending') next = 'accepted';
        else if (s === 'accepted') next = 'ongoing';
        else if (s === 'ongoing') next = 'completed';
        else return;

        const { error } = await supabase.from('bookings').update({ status: next }).eq('id', jobId);
        if (error) toast({ title: "Update Failed", description: error.message, variant: "destructive" });
        else fetchData();
    };

    const claimJob = async (jobId: string) => {
        if (!profile) return;
        const { error } = await supabase.from('bookings').update({ technician_id: profile.id, status: 'accepted' }).eq('id', jobId);
        if (error) toast({ title: "Claim Failed", description: error.message, variant: "destructive" });
        else toast({ title: "Job Claimed!", description: "It's now in your Service Agenda." });
    };

    if (loading) return <div className="min-h-screen flex items-center justify-center bg-slate-50"><Loader2 className="w-10 h-10 text-primary animate-spin" /></div>;

    return (
        <div className="min-h-screen bg-[#f8fafc] pb-20">
            <header className="pt-24 pb-12 bg-white border-b border-slate-100">
                <div className="container">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
                        <div className="flex items-center gap-6">
                            <div className="w-16 h-16 rounded-3xl bg-slate-900 flex items-center justify-center text-white text-2xl font-bold shadow-xl shadow-slate-900/20">
                                {user?.user_metadata?.full_name?.charAt(0) || "P"}
                            </div>
                            <div>
                                <h1 className="text-3xl font-display font-bold text-slate-900">Partner Dashboard</h1>
                                <p className="text-slate-500 font-medium flex items-center gap-2 mt-1">
                                    <Star className="w-4 h-4 text-amber-500 fill-amber-500" /> {stats.rating} Rating • Verified Professional
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4 bg-slate-50 p-2 rounded-[1.5rem] border border-slate-100">
                            <div className="px-4">
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Visibility</p>
                                <p className="text-sm font-bold text-slate-900">{isAvailable ? "Online" : "Away"}</p>
                            </div>
                            <Switch checked={isAvailable} onCheckedChange={toggleAvailability} className="data-[state=checked]:bg-emerald-500" />
                        </div>
                    </div>
                </div>
            </header>

            <main className="container pt-12 space-y-12">
                <motion.div variants={container} initial="hidden" animate="show" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[
                        { label: "Today's Agenda", value: stats.todayJobs, icon: Calendar, color: "bg-blue-500", text: "text-blue-500" },
                        { label: "Completion", value: stats.completionRate, icon: CheckCircle2, color: "bg-emerald-500", text: "text-emerald-500" },
                        { label: "Total Earnings", value: stats.totalEarnings, icon: IndianRupee, color: "bg-amber-500", text: "text-amber-500" },
                        { label: "Client Trust", value: "99%", icon: Shield, color: "bg-purple-500", text: "text-purple-500" },
                    ].map((stat, i) => (
                        <motion.div key={i} variants={item}>
                            <Card className="border-none shadow-sm hover:translate-y-[-4px] transition-all">
                                <CardContent className="p-6 flex items-center justify-between">
                                    <div>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{stat.label}</p>
                                        <h4 className="text-2xl font-bold text-slate-900">{stat.value}</h4>
                                    </div>
                                    <div className={`${stat.color}/10 p-3 rounded-2xl`}>
                                        <stat.icon className={`w-6 h-6 ${stat.text}`} />
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </motion.div>

                <Tabs defaultValue="agenda" className="space-y-8">
                    <TabsList className="bg-white p-1 rounded-2xl border border-slate-100 h-auto gap-1">
                        <TabsTrigger value="agenda" className="rounded-xl px-8 py-3 font-bold data-[state=active]:bg-primary data-[state=active]:text-white">Service Agenda</TabsTrigger>
                        <TabsTrigger value="marketplace" className="rounded-xl px-8 py-3 font-bold data-[state=active]:bg-primary data-[state=active]:text-white">Job Market</TabsTrigger>
                        <TabsTrigger value="wallet" className="rounded-xl px-8 py-3 font-bold data-[state=active]:bg-primary data-[state=active]:text-white">Wallet</TabsTrigger>
                    </TabsList>

                    <TabsContent value="agenda">
                        <div className="grid lg:grid-cols-1 gap-6">
                            {jobs.length > 0 ? jobs.map(job => (
                                <Card key={job.fullId} className="border-none shadow-sm overflow-hidden hover:shadow-xl hover:shadow-primary/5 transition-all">
                                    <CardContent className="p-0">
                                        <div className="flex flex-col md:flex-row md:items-center">
                                            <div className="p-8 md:w-1/4 bg-slate-50 flex flex-col items-center justify-center text-center border-r border-slate-100">
                                                <div className="w-16 h-16 rounded-2xl bg-white shadow-sm flex items-center justify-center text-primary mb-4">
                                                    <Clock size={32} className={job.status === "Ongoing" ? "animate-spin" : ""} />
                                                </div>
                                                <p className="text-sm font-bold text-slate-900">{job.time.split(' • ')[1]}</p>
                                                <p className="text-[10px] font-bold text-slate-400 uppercase mt-1">{job.time.split(' • ')[0]}</p>
                                            </div>
                                            <div className="p-8 flex-1">
                                                <div className="flex items-center justify-between mb-4">
                                                    <Badge className={`${job.status === "Completed" ? "bg-emerald-50 text-emerald-600" : "bg-primary/10 text-primary"} border-none px-4 py-1.5 rounded-full font-bold uppercase text-[10px]`}>
                                                        {job.status}
                                                    </Badge>
                                                    <p className="text-xl font-bold text-slate-900">₹{job.price}</p>
                                                </div>
                                                <h3 className="text-2xl font-bold mb-2">{job.service}</h3>
                                                <p className="text-slate-500 font-medium flex items-center gap-2 mb-6">
                                                    <Navigation className="w-4 h-4 text-primary" /> {job.location}
                                                </p>
                                                <div className="flex gap-3">
                                                    {job.status !== "Completed" && (
                                                        <Button className="font-bold rounded-xl px-8 h-12" onClick={() => updateJobStatus(job.fullId, job.status)}>
                                                            {job.status === "Accepted" ? "Start Service" : "Complete Job"}
                                                        </Button>
                                                    )}
                                                    <Button variant="outline" className="font-bold rounded-xl px-8 h-12 border-slate-200">Customer Details</Button>
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            )) : (
                                <div className="text-center py-20 bg-white rounded-[2.5rem] border border-slate-100 shadow-sm">
                                    <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                                        <Briefcase className="w-10 h-10 text-slate-200" />
                                    </div>
                                    <h3 className="text-xl font-bold text-slate-900">Your agenda is clear</h3>
                                    <p className="text-slate-400 mt-2 font-medium">Head over to the Job Market to find new opportunities.</p>
                                </div>
                            )}
                        </div>
                    </TabsContent>

                    <TabsContent value="marketplace">
                        <div className="grid md:grid-cols-2 gap-8">
                            {availableJobs.map(job => (
                                <Card key={job.fullId} className="border-none shadow-sm group hover:shadow-2xl hover:shadow-primary/5 transition-all overflow-hidden rounded-[2rem]">
                                    <CardHeader className="p-8 bg-slate-900 text-white relative">
                                        <div className="absolute top-0 right-0 p-8 opacity-20"><MapPin size={100} /></div>
                                        <Badge className="bg-primary hover:bg-primary border-none mb-4 font-bold">New Opportunitiy</Badge>
                                        <CardTitle className="text-2xl font-bold mb-2">{job.service}</CardTitle>
                                        <CardDescription className="text-slate-400 font-medium">{job.location}</CardDescription>
                                    </CardHeader>
                                    <CardContent className="p-8 space-y-8 bg-white">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400"><Clock size={24} /></div>
                                                <div>
                                                    <p className="text-[10px] font-bold text-slate-400 uppercase">Preferred Time</p>
                                                    <p className="text-sm font-bold text-slate-900">{job.time}</p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-[10px] font-bold text-slate-400 uppercase">Estimation</p>
                                                <p className="text-2xl font-bold text-primary">₹{job.price}</p>
                                            </div>
                                        </div>
                                        <Button className="w-full h-14 rounded-2xl font-bold text-lg group-hover:scale-105 transition-all" onClick={() => claimJob(job.fullId)}>
                                            Accept Job <ArrowRight className="ml-2 w-5 h-5" />
                                        </Button>
                                    </CardContent>
                                </Card>
                            ))}
                            {availableJobs.length === 0 && (
                                <div className="col-span-2 text-center py-20 border-2 border-dashed border-slate-100 rounded-[2.5rem]">
                                    <Search className="w-12 h-12 text-slate-200 mx-auto mb-4" />
                                    <p className="text-slate-500 font-bold">No unassigned jobs in your area right now.</p>
                                </div>
                            )}
                        </div>
                    </TabsContent>

                    <TabsContent value="wallet">
                        <Card className="max-w-md mx-auto border-none shadow-2xl shadow-slate-200/50 rounded-[2.5rem] overflow-hidden">
                            <div className="bg-slate-900 p-10 text-white text-center">
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">Total Settled Earnings</p>
                                <h3 className="text-5xl font-bold mb-8">{stats.totalEarnings}</h3>
                                <div className="grid grid-cols-2 gap-4 border-t border-white/5 pt-8">
                                    <div>
                                        <p className="text-xs text-slate-400 font-bold mb-1">THIS WEEK</p>
                                        <p className="text-lg font-bold">₹2,450</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-slate-400 font-bold mb-1">JOBS DONE</p>
                                        <p className="text-lg font-bold">{stats.todayJobs}</p>
                                    </div>
                                </div>
                            </div>
                            <CardContent className="p-10 space-y-4">
                                <Button className="w-full h-14 rounded-2xl font-bold text-lg">Instant Payout</Button>
                                <Button variant="outline" className="w-full h-14 rounded-2xl font-bold border-slate-100">Transaction History</Button>
                                <p className="text-[10px] text-center text-slate-400 font-bold uppercase mt-8 tracking-widest">Powered by Stripe Connect</p>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </main>
        </div>
    );
};

export default TechnicianDashboard;
