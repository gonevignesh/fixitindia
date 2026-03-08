import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Calendar,
  Clock,
  MapPin,
  Star,
  Wallet,
  Settings,
  Bell,
  Search,
  ChevronRight,
  TrendingUp,
  ShieldCheck,
  Zap,
  Loader2,
  Phone
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/contexts/AuthContext";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
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

const CustomerDashboard = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const userName = user?.user_metadata?.full_name || "Valued Customer";
  const [loading, setLoading] = useState(true);
  const [bookings, setBookings] = useState<any[]>([]);
  const [stats, setStats] = useState({
    activeCount: 0,
    rewardPoints: "1,250",
    walletBalance: "₹0",
    walletBalance: "₹0",
    savedListings: "8"
  });

  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<any>(null);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);

  const fetchCustomerData = async () => {
    if (!user) return;
    try {
      const { data: bookingsData, error } = await supabase
        .from('bookings')
        .select(`
          id,
          status,
          scheduled_date,
          scheduled_time,
          total_amount,
          technician_id,
          services(name, category, icon),
          technician_profiles(
            profiles(full_name)
          ),
          reviews(id)
        `)
        .eq('customer_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      if (bookingsData) {
        const formatted = bookingsData.map(b => ({
          id: b.id.slice(0, 8),
          service: (b.services as any)?.name || "Service",
          category: (b.services as any)?.category || "Home Care",
          date: `${b.scheduled_date} at ${b.scheduled_time}`,
          status: b.status.charAt(0).toUpperCase() + b.status.slice(1),
          technician: (b.technician_profiles as any)?.profiles?.full_name || "Assigning...",
          technicianId: b.technician_id,
          fullId: b.id,
          hasReview: Array.isArray(b.reviews) ? b.reviews.length > 0 : !!b.reviews,
          price: `₹${b.total_amount?.toLocaleString('en-IN')}`
        }));
        setBookings(formatted);

        const active = bookingsData.filter(b => ['pending', 'accepted', 'ongoing'].includes(b.status)).length;
        setStats(prev => ({ ...prev, activeCount: active }));
      }
    } catch (e) {
      console.error("Error fetching customer data:", e);
    } finally {
      setLoading(false);
    }
  };

  const submitReview = async () => {
    if (!selectedBooking || rating === 0) return;
    setSubmittingReview(true);
    try {
      const { error } = await supabase.from('reviews').insert({
        booking_id: selectedBooking.fullId,
        customer_id: user?.id,
        technician_id: selectedBooking.technicianId,
        rating,
        comment
      });
      if (error) throw error;
      toast({ title: "Review Submitted", description: "Thank you for your feedback! The technician's rating has been updated." });
      setReviewModalOpen(false);
      fetchCustomerData();
    } catch (e: any) {
      toast({ title: "Submission Failed", description: e.message, variant: "destructive" });
    } finally {
      setSubmittingReview(false);
    }
  };

  useEffect(() => {
    fetchCustomerData();

    const channel = supabase.channel('customer_realtime')
      .on('postgres_changes' as any, {
        event: '*',
        table: 'bookings',
        filter: `customer_id=eq.${user?.id}`
      }, fetchCustomerData)
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [user]);

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      <main className="pt-24 pb-20 container">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <Badge variant="outline" className="mb-3 bg-primary/5 text-primary border-primary/20 px-3 py-1 font-bold">
              Customer Portal
            </Badge>
            <h1 className="text-3xl md:text-4xl font-display font-bold text-slate-900">
              Welcome back, <span className="text-primary">{userName.split(' ')[0]}</span>!
            </h1>
            <p className="text-slate-500 mt-2 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              Your account is verified and secure.
            </p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" size="lg" className="rounded-xl border-slate-200 hover:bg-white hover:shadow-md transition-all font-semibold">
              <Settings className="w-4 h-4 mr-2" /> Settings
            </Button>
            <Link to="/services">
              <Button size="lg" className="rounded-xl shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all font-bold">
                <Search className="w-4 h-4 mr-2" /> Book New Service
              </Button>
            </Link>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-[40vh]">
            <Loader2 className="w-10 h-10 text-primary animate-spin" />
          </div>
        ) : (
          <>
            <motion.div
              variants={container}
              initial="hidden"
              animate="show"
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10"
            >
              {[
                { label: "Active Bookings", value: stats.activeCount.toString(), icon: Calendar, color: "bg-blue-500", text: "text-blue-500" },
                { label: "Reward Points", value: stats.rewardPoints, icon: Star, color: "bg-amber-500", text: "text-amber-500" },
                { label: "Wallet Balance", value: stats.walletBalance, icon: Wallet, color: "bg-emerald-500", text: "text-emerald-500" },
                { label: "Saved Listings", value: stats.savedListings, icon: Bell, color: "bg-purple-500", text: "text-purple-500" },
              ].map((stat, i) => (
                <motion.div key={i} variants={item}>
                  <Card className="border-none shadow-sm hover:shadow-md transition-shadow overflow-hidden group">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-slate-500 mb-1">{stat.label}</p>
                          <h4 className="text-2xl font-bold text-slate-900">{stat.value}</h4>
                        </div>
                        <div className={`${stat.color}/10 p-3 rounded-2xl group-hover:scale-110 transition-transform`}>
                          <stat.icon className={`w-6 h-6 ${stat.text}`} />
                        </div>
                      </div>
                    </CardContent>
                    <div className={`h-1 w-full ${stat.color} opacity-20`} />
                  </Card>
                </motion.div>
              ))}
            </motion.div>

            <div className="grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                <Card className="border-none shadow-sm overflow-hidden">
                  <CardHeader className="bg-white border-b border-slate-100 flex flex-row items-center justify-between py-6">
                    <div>
                      <CardTitle className="text-xl font-display font-bold">My Bookings</CardTitle>
                      <CardDescription>Track and manage your service requests</CardDescription>
                    </div>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="overflow-x-auto">
                      {bookings.length > 0 ? (
                        <table className="w-full text-left">
                          <thead>
                            <tr className="bg-slate-50 border-b border-slate-100">
                              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Service</th>
                              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Technician</th>
                              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Amount</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100">
                            {bookings.map((item) => (
                              <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                                <td className="px-6 py-5">
                                  <div className="flex flex-col">
                                    <span className="font-bold text-slate-900">{item.service}</span>
                                    <span className="text-xs text-slate-500 flex items-center gap-1 mt-1">
                                      <Clock className="w-3 h-3" /> {item.date}
                                    </span>
                                  </div>
                                </td>
                                <td className="px-6 py-5">
                                  <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">
                                      {item.technician.charAt(0)}
                                    </div>
                                    <span className="text-sm text-slate-700 font-medium">{item.technician}</span>
                                  </div>
                                </td>
                                <td className="px-6 py-5">
                                  <Badge className={
                                    item.status === "Ongoing" || item.status === "Accepted"
                                      ? "bg-blue-50 text-blue-600 hover:bg-blue-50 border-none font-bold"
                                      : item.status === "Completed"
                                        ? "bg-emerald-50 text-emerald-600 hover:bg-emerald-50 border-none font-bold"
                                        : "bg-amber-50 text-amber-600 hover:bg-amber-50 border-none font-bold"
                                  }>
                                    {item.status}
                                  </Badge>
                                </td>
                                <td className="px-6 py-5 text-right font-bold text-slate-900">
                                  <div className="flex items-center justify-end gap-3">
                                    <span>{item.price}</span>
                                    {item.status === "Completed" && !item.hasReview && (
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        className="rounded-lg h-8 px-3 text-xs font-bold border-primary text-primary hover:bg-primary/5 transition-all"
                                        onClick={() => {
                                          setSelectedBooking(item);
                                          setRating(0);
                                          setComment("");
                                          setReviewModalOpen(true);
                                        }}
                                      >
                                        Rate It
                                      </Button>
                                    )}
                                    {item.status === "Completed" && item.hasReview && (
                                      <Badge className="bg-slate-100 text-slate-500 hover:bg-slate-100 border-none">Rated</Badge>
                                    )}
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      ) : (
                        <div className="text-center py-20 bg-white">
                          <Calendar className="w-16 h-16 text-slate-200 mx-auto mb-4" />
                          <h3 className="text-lg font-bold text-slate-900">No bookings yet</h3>
                          <p className="text-slate-500 mt-1 mb-6">Start by exploring our professional services.</p>
                          <Link to="/services">
                            <Button className="rounded-xl px-8 font-bold">Explore Services</Button>
                          </Link>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                <div className="grid md:grid-cols-2 gap-6">
                  <Card className="border-none shadow-sm bg-slate-900 text-white overflow-hidden relative">
                    <div className="absolute top-0 right-0 p-4 opacity-10">
                      <Zap className="w-24 h-24" />
                    </div>
                    <CardHeader>
                      <CardTitle className="text-white flex items-center gap-2">
                        <TrendingUp className="w-5 h-5" /> Gold Membership
                      </CardTitle>
                      <CardDescription className="text-white/80">Get 15% off on all deep cleaning services!</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm mb-4">Upgrade today to unlock premium benefits and faster technician assignment.</p>
                      <Button variant="secondary" className="w-full bg-white text-slate-900 hover:bg-white/90 font-bold rounded-xl">
                        View Plans
                      </Button>
                    </CardContent>
                  </Card>

                  <Card className="border-none shadow-sm flex flex-col justify-center items-center p-8 text-center bg-white border border-slate-100 hover:shadow-md transition-shadow">
                    <div className="w-16 h-16 rounded-2xl bg-primary/5 flex items-center justify-center mb-4">
                      <MapPin className="w-8 h-8 text-primary" />
                    </div>
                    <h4 className="font-bold text-slate-800">Saved Addresses</h4>
                    <p className="text-xs text-slate-500 mt-1 mb-4">You have 1 saved address in Mumbai.</p>
                    <Button variant="outline" size="sm" className="rounded-lg font-semibold">Manage Locations</Button>
                  </Card>
                </div>
              </div>

              <div className="space-y-6">
                <Card className="border-none shadow-sm">
                  <CardHeader>
                    <CardTitle className="text-lg font-bold">Quick Support</CardTitle>
                    <CardDescription>We're here to help you</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Button variant="outline" className="w-full justify-start border-slate-200 hover:bg-slate-50 rounded-xl font-semibold">
                      <Bell className="w-4 h-4 mr-2 text-primary" /> Track Live Order
                    </Button>
                    <Button variant="outline" className="w-full justify-start border-slate-200 hover:bg-slate-50 rounded-xl font-semibold">
                      <Phone className="w-4 h-4 mr-2 text-primary" /> Call Support
                    </Button>
                  </CardContent>
                </Card>

                <div className="space-y-4">
                  <h3 className="font-display font-bold text-slate-800 flex items-center gap-2 px-2">
                    Popular Services <div className="h-px flex-1 bg-slate-200" />
                  </h3>
                  {[
                    { title: "AC Deep Cleaning", price: "₹499", img: "https://images.unsplash.com/photo-1621905252507-b35222073240?w=400&q=80" },
                    { title: "Wall Painting", price: "₹1,499", img: "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=400&q=80" },
                  ].map((item, i) => (
                    <div key={i} className="group relative rounded-2xl overflow-hidden bg-white shadow-sm hover:shadow-md transition-all border border-slate-100 p-3 flex gap-4">
                      <img src={item.img} alt={item.title} className="w-20 h-20 rounded-xl object-cover" />
                      <div className="flex flex-col justify-center">
                        <h4 className="font-bold text-slate-900 text-sm group-hover:text-primary transition-colors">{item.title}</h4>
                        <p className="text-primary font-bold mt-1">{item.price}</p>
                        <Link to="/services" className="text-xs text-slate-400 font-bold underline mt-2 text-left hover:text-primary">Book Now</Link>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}
      </main>

      {/* Review Dialog */}
      <Dialog open={reviewModalOpen} onOpenChange={setReviewModalOpen}>
        <DialogContent className="sm:max-w-md rounded-[2rem] p-6 border-none shadow-2xl">
          <DialogHeader className="mb-4">
            <DialogTitle className="text-2xl font-display font-bold">Rate the Service</DialogTitle>
            <DialogDescription className="text-sm font-medium">
              How was your experience with <span className="text-slate-900 font-bold">{selectedBooking?.technician}</span>?
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-center gap-2 py-4">
            {[1, 2, 3, 4, 5].map((star) => (
              <button key={star} onClick={() => setRating(star)} className="focus:outline-none transition-transform hover:scale-110">
                <Star className={`w-10 h-10 ${star <= rating ? "text-amber-500 fill-amber-500 drop-shadow-sm" : "text-slate-200 fill-slate-50"}`} />
              </button>
            ))}
          </div>
          <Textarea
            placeholder="Write a quick comment about the service to help others..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="rounded-2xl border-slate-200 resize-none h-28 p-4 font-medium focus-visible:ring-primary/20 bg-slate-50"
          />
          <DialogFooter className="mt-6 gap-3 sm:justify-center">
            <Button variant="outline" className="rounded-xl px-6 font-bold w-full sm:w-auto" onClick={() => setReviewModalOpen(false)}>Cancel</Button>
            <Button className="rounded-xl px-10 font-bold w-full sm:w-auto shadow-lg shadow-primary/20" disabled={rating === 0 || submittingReview} onClick={submitReview}>
              {submittingReview ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
              Submit Review
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CustomerDashboard;
