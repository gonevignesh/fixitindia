import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ChevronRight, Wrench, Zap, Monitor, Home, Palette, Trash2, Search, Loader2, RefreshCw } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const iconMap: Record<string, any> = {
  'Plumbing': Wrench,
  'Electrical': Zap,
  'Appliance Repair': Monitor,
  'Carpentry': Home,
  'Painting': Palette,
  'Cleaning': Trash2,
};

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.05, duration: 0.4 },
  }),
};

const Services = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [services, setServices] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchServices = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error: sbError } = await supabase
        .from('services')
        .select('*')
        .eq('is_active', true)
        .order('category', { ascending: true });

      if (sbError) {
        throw sbError;
      }
      if (data) {
        setServices(data);
      }
    } catch (e: any) {
      console.error("Error fetching services:", e);
      setError(e.message || "Failed to load services. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const filtered = services.filter(s =>
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      <section className="pt-32 pb-20">
        <div className="container">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
            <h1 className="font-display text-4xl md:text-5xl font-bold text-slate-900 mb-4">India's Most Trusted Services</h1>
            <p className="text-slate-500 max-w-lg mx-auto mb-8 font-medium">
              Transparent pricing. Verified professionals. Doorstep delivery within 60 minutes.
            </p>

            <div className="relative max-w-xl mx-auto">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <Input
                placeholder="Search for repair, cleaning, painting..."
                className="pl-12 h-14 rounded-2xl shadow-xl shadow-slate-200/50 border-none bg-white text-lg"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </motion.div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-24 gap-4">
              <Loader2 className="w-12 h-12 text-primary animate-spin" />
              <p className="text-slate-400 font-medium animate-pulse">Fetching latest services...</p>
            </div>
          ) : error ? (
            <div className="text-center py-20 bg-white rounded-[2rem] border border-slate-100 shadow-sm max-w-md mx-auto">
              <div className="w-16 h-16 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <RefreshCw className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Connection Issue</h3>
              <p className="text-slate-500 mb-8">{error}</p>
              <Button onClick={() => fetchServices()} className="rounded-xl px-8 font-bold">
                Try Again
              </Button>
            </div>
          ) : (
            <>
              <motion.div initial="hidden" animate="visible" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filtered.map((service, i) => {
                  const Icon = iconMap[service.category] || Wrench;
                  return (
                    <motion.div key={service.id} variants={fadeUp} custom={i}>
                      <Link
                        to={`/services/${service.slug}`}
                        className="group block p-6 rounded-3xl bg-white border border-slate-100 hover:border-primary/20 hover:shadow-2xl hover:shadow-primary/5 transition-all duration-300 h-full relative"
                      >
                        <div className="w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center mb-6 group-hover:bg-primary/5 transition-colors">
                          <Icon className="w-7 h-7 text-slate-400 group-hover:text-primary transition-colors" />
                        </div>
                        <Badge variant="outline" className="text-[10px] font-bold uppercase tracking-widest text-slate-400 border-slate-100 mb-3 block w-fit">
                          {service.category}
                        </Badge>
                        <h3 className="font-display text-lg font-bold text-slate-900 mb-2 group-hover:text-primary transition-colors">{service.name}</h3>
                        <p className="text-sm text-slate-500 mb-6 line-clamp-2">{service.description}</p>

                        <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-50">
                          <div className="flex flex-col">
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">Starts From</span>
                            <span className="text-lg font-bold text-slate-900">₹{service.base_price}</span>
                          </div>
                          <div className="w-10 h-10 rounded-full border border-slate-100 flex items-center justify-center group-hover:bg-primary group-hover:border-primary transition-all">
                            <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-white transition-colors" />
                          </div>
                        </div>
                      </Link>
                    </motion.div>
                  );
                })}
              </motion.div>

              {filtered.length === 0 && (
                <div className="text-center py-20">
                  <p className="text-slate-400 font-bold text-xl">No services matching "{searchTerm}"</p>
                  <p className="text-slate-400 mt-2">Try searching for something else or browse categories.</p>
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </div>
  );
};

const Badge = ({ children, className, variant }: any) => (
  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${className}`}>
    {children}
  </span>
);

export default Services;
