import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Star,
  Shield,
  Clock,
  MapPin,
  ArrowLeft,
  CheckCircle,
  Loader2,
  Wrench,
  Zap,
  Monitor,
  Home,
  Palette,
  Trash2,
  Calendar,
  PhoneCall,
  IndianRupee,
  ShieldCheck,
  Mail
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

const iconMap: Record<string, any> = {
  'Plumbing': Wrench,
  'Electrical': Zap,
  'Appliance Repair': Monitor,
  'Carpentry': Home,
  'Painting': Palette,
  'Cleaning': Trash2,
};

const ServiceDetail = () => {
  const { id: slug } = useParams();
  const navigate = useNavigate();
  const { user, role } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [service, setService] = useState<any>(null);
  const [technicians, setTechnicians] = useState<any[]>([]);

  const [form, setForm] = useState({
    date: new Date().toISOString().split('T')[0],
    time: "10:00 AM",
    address: user?.user_metadata?.address || "",
    city: user?.user_metadata?.city || "Delhi"
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const { data: serviceData, error: sbError } = await supabase
        .from('services')
        .select('*')
        .eq('slug', slug)
        .single();

      if (sbError) throw sbError;

      if (serviceData) {
        setService(serviceData);

        const { data: techData } = await supabase
          .from('technician_profiles')
          .select(`id, skills, rating, total_jobs, profiles!inner(full_name)`)
          .eq('id_verified', true)
          .limit(2);

        if (techData) {
          setTechnicians(techData.map(t => ({
            id: t.id,
            name: (t.profiles as any).full_name,
            rating: t.rating,
            jobs: t.total_jobs
          })));
        }
      }
    } catch (e) {
      console.error("Error fetching service detail:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [slug]);

  const handleBooking = async () => {
    if (!user) {
      navigate("/login");
      return;
    }

    if (role !== 'customer') {
      toast({ title: "Operation not allowed", description: "Only customers can book services.", variant: "destructive" });
      return;
    }

    setBookingLoading(true);
    const { error } = await supabase.from('bookings').insert({
      customer_id: user.id,
      service_id: service.id,
      address: form.address,
      city: form.city,
      scheduled_date: form.date,
      scheduled_time: form.time,
      total_amount: service.base_price,
      status: 'pending'
    });

    if (error) {
      toast({ title: "Booking Failed", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Service Booked!", description: "A technician will be assigned shortly." });
      navigate("/customer-dashboard");
    }
    setBookingLoading(false);
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="w-10 h-10 text-primary animate-spin" /></div>;
  if (!service) return <div className="min-h-screen flex flex-col items-center justify-center gap-4 text-slate-500 font-bold"><p>Service not found</p><Link to="/services" className="text-primary underline">Explore all services</Link></div>;

  const Icon = iconMap[service.category] || Wrench;

  return (
    <div className="min-h-screen bg-[#f8fafc] pt-32 pb-20">
      <div className="container">
        <Link to="/services" className="inline-flex items-center gap-2 text-sm font-bold text-slate-400 hover:text-primary mb-10 transition-colors uppercase tracking-widest">
          <ArrowLeft className="w-4 h-4" /> Go Back
        </Link>

        <div className="grid lg:grid-cols-3 gap-12">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="lg:col-span-2 space-y-10">
            <div className="flex flex-col md:flex-row md:items-start gap-8">
              <div className="w-24 h-24 rounded-3xl bg-white border border-slate-100 flex items-center justify-center shrink-0 shadow-lg shadow-slate-200/50">
                <Icon className="w-10 h-10 text-primary" />
              </div>
              <div className="flex-1">
                <Badge variant="outline" className="mb-4 bg-primary/5 text-primary border-primary/20 font-bold uppercase tracking-widest px-3 py-1">
                  {service.category} Specialist
                </Badge>
                <h1 className="text-4xl md:text-5xl font-display font-bold text-slate-900 mb-3">{service.name}</h1>
                <p className="text-xl text-slate-500 font-medium leading-relaxed max-w-2xl">{service.description}</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-8 py-8 border-y border-slate-100">
              {[
                { icon: Star, label: "4.9 Service Rating", detail: "2,400+ reviews" },
                { icon: Clock, label: "60-90 Min arrival", detail: "Professional response" },
                { icon: ShieldCheck, label: "India's Safe Choice", detail: "Fully insured service" },
              ].map((stat, i) => (
                <div key={i} className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400"><stat.icon size={20} /></div>
                  <div>
                    <p className="text-sm font-bold text-slate-900">{stat.label}</p>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">{stat.detail}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
                <Shield className="text-emerald-500" /> Professional Service Standard
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                {[
                  "Verified background check",
                  "Fixnest standard equipment",
                  "Transparent per-hour rate",
                  "30-day quality warranty",
                  "On-call supervisor support",
                  "Post-service cleanup included"
                ].map((feature, i) => (
                  <div key={i} className="flex items-center gap-3 p-4 bg-white rounded-2xl border border-slate-100 hover:border-emerald-100 hover:bg-emerald-50/20 transition-all">
                    <CheckCircle className="w-5 h-5 text-emerald-500" />
                    <span className="text-sm font-semibold text-slate-700">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-slate-900">Featured Technicians</h3>
              <div className="grid md:grid-cols-2 gap-6">
                {technicians.map(t => (
                  <div key={t.id} className="p-5 rounded-3xl bg-white border border-slate-100 flex items-center gap-6 group hover:shadow-2xl hover:shadow-primary/5 transition-all">
                    <div className="w-16 h-16 rounded-2xl bg-slate-900 flex items-center justify-center text-white text-xl font-bold uppercase">{t.name.charAt(0)}</div>
                    <div className="flex-1">
                      <p className="font-bold text-slate-900 group-hover:text-primary transition-colors">{t.name}</p>
                      <div className="flex items-center gap-4 mt-1">
                        <span className="flex items-center gap-1 text-[11px] font-bold text-amber-500"><Star fill="currentColor" size={12} /> {t.rating}</span>
                        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-tight">{t.jobs}+ Jobs done</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
            <Card className="sticky top-24 border-none shadow-2xl shadow-primary/10 rounded-[2.5rem] overflow-hidden">
              <div className="bg-slate-900 p-8 pt-10 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10"><IndianRupee size={120} /></div>
                <h3 className="text-2xl font-bold mb-1 relative z-10">Premium {service.name}</h3>
                <p className="text-slate-400 text-sm mb-6 relative z-10 font-bold uppercase tracking-widest">Base fare starting at</p>
                <div className="text-5xl font-bold text-white relative z-10 mb-2">₹{service.base_price}</div>
                <p className="text-xs text-slate-500 relative z-10">Exclusive of local taxes and spare parts.</p>
              </div>
              <CardContent className="p-8 space-y-8 bg-white">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 ml-1">Arrival Date</label>
                    <div className="relative">
                      <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <Input type="date" className="pl-12 h-14 rounded-2xl bg-slate-50 border-none font-bold text-slate-900"
                        value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 ml-1">Arrival Time</label>
                    <div className="relative">
                      <Clock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <select className="flex w-full pl-12 h-14 rounded-2xl bg-slate-50 border-none font-bold text-slate-900 outline-none appearance-none"
                        value={form.time} onChange={e => setForm({ ...form, time: e.target.value })}>
                        <option>09:00 AM</option>
                        <option>10:00 AM</option>
                        <option>11:00 AM</option>
                        <option>12:00 PM</option>
                        <option>02:00 PM</option>
                        <option>04:00 PM</option>
                        <option>06:00 PM</option>
                      </select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 ml-1">Address Details</label>
                    <div className="relative">
                      <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <Input placeholder="Flat, Street name..." className="pl-12 h-14 rounded-2xl bg-slate-50 border-none font-bold text-slate-900"
                        value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} />
                    </div>
                  </div>
                </div>

                <Button
                  className="w-full h-16 rounded-2xl text-lg font-bold shadow-xl shadow-primary/30 transition-all hover:scale-[1.02] active:scale-[0.98]"
                  onClick={handleBooking}
                  disabled={bookingLoading}
                >
                  {bookingLoading ? <Loader2 className="animate-spin w-5 h-5 mr-3" /> : <ShieldCheck className="w-5 h-5 mr-3" />}
                  {bookingLoading ? "Confirming..." : "Book Now - ₹" + service.base_price}
                </Button>

                <div className="text-center">
                  <p className="text-xs text-slate-400 font-bold mb-4 uppercase tracking-[0.2em]">Contact Ops Center</p>
                  <div className="flex justify-center gap-4">
                    <Button variant="outline" className="w-12 h-12 rounded-2xl p-0 border-slate-100"><PhoneCall size={20} className="text-slate-400" /></Button>
                    <Button variant="outline" className="w-12 h-12 rounded-2xl p-0 border-slate-100"><Mail size={20} className="text-slate-400" /></Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ServiceDetail;
