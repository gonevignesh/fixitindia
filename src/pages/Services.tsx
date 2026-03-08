import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ChevronRight, Wrench, Zap, Monitor, Home, Palette, Trash2, Search, Loader2, RefreshCw, Star } from "lucide-react";
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
  const [selectedCategory, setSelectedCategory] = useState("All");

  const categories = ["All", ...Array.from(new Set(services.map(s => s.category)))];

  const fetchServices = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error: sbError } = await supabase
        .from('services')
        .select('*')
        .eq('is_active', true)
        .order('category', { ascending: true });

      if (sbError) throw sbError;
      if (data) setServices(data);
    } catch (e: any) {
      console.error("Error fetching services:", e);
      setError(e.message || "Failed to load services.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const filtered = services.filter(s => {
    const matchesSearch = s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "All" || s.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-white">
      {/* Header & Search */}
      <section className="pt-32 pb-16 bg-[#F2F4F6] relative overflow-hidden">
        <div className="container relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center max-w-2xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-display font-bold text-slate-900 mb-6 tracking-tight">Expert Home Services</h1>
            <p className="text-slate-500 font-medium mb-10 text-lg">Verified professionals for all your home repair needs.</p>

            <div className="relative max-w-xl mx-auto group">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-primary transition-colors" />
              <Input
                placeholder="Search for repair, cleaning, painting..."
                className="pl-14 h-16 rounded-[1.25rem] shadow-2xl shadow-slate-200/50 border-none bg-white text-lg focus-visible:ring-2 focus-visible:ring-primary/20 transition-all font-medium"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Category Pills */}
      <div className="sticky top-16 z-30 bg-white/80 backdrop-blur border-b border-slate-100 py-4 shadow-sm">
        <div className="container overflow-x-auto whitespace-nowrap scrollbar-hide flex gap-3">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-6 py-2.5 rounded-2xl text-sm font-bold transition-all ${selectedCategory === cat
                  ? "bg-slate-900 text-white shadow-lg shadow-slate-200"
                  : "bg-slate-50 text-slate-500 hover:bg-slate-100 border border-slate-100"
                }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <section className="py-16 md:py-24">
        <div className="container">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-32 gap-6">
              <Loader2 className="w-12 h-12 text-primary animate-spin" />
              <p className="text-slate-400 font-bold text-lg animate-pulse">Setting up your experience...</p>
            </div>
          ) : error ? (
            <div className="text-center py-20 bg-slate-50 rounded-[3rem] border border-slate-100 max-w-md mx-auto">
              <RefreshCw className="w-12 h-12 text-rose-500 mx-auto mb-6" />
              <h3 className="text-xl font-bold text-slate-900 mb-2">Something went wrong</h3>
              <p className="text-slate-500 mb-8">{error}</p>
              <Button onClick={() => fetchServices()} className="rounded-2xl px-10 h-12 font-bold">Retry</Button>
            </div>
          ) : (
            <>
              <motion.div initial="hidden" animate="visible" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {filtered.map((service, i) => {
                  const Icon = iconMap[service.category] || Wrench;
                  return (
                    <motion.div key={service.id} variants={fadeUp} custom={i}>
                      <Link
                        to={`/services/${service.slug}`}
                        className="group block rounded-[2.5rem] bg-white border border-slate-100 hover:shadow-2xl hover:shadow-slate-200/50 transition-all duration-500 overflow-hidden h-full flex flex-col"
                      >
                        <div className="relative aspect-[4/3] overflow-hidden">
                          <img
                            src={service.image_url || `https://images.unsplash.com/photo-1581578731522-745a05ad9ad5?w=500`}
                            alt={service.name}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                          />
                          <div className="absolute top-4 left-4">
                            <div className="bg-white/95 backdrop-blur px-3 py-1 rounded-full flex items-center gap-1.5 shadow-sm">
                              <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                              <span className="text-sm font-bold text-slate-900">{service.rating || "4.8"}</span>
                            </div>
                          </div>
                        </div>
                        <div className="p-8 flex-1 flex flex-col">
                          <div className="text-xs font-bold text-primary uppercase tracking-widest mb-3 flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                            {service.category}
                          </div>
                          <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-primary transition-colors">{service.name}</h3>
                          <p className="text-sm text-slate-500 mb-8 font-medium leading-relaxed line-clamp-2">{service.description}</p>

                          <div className="mt-auto pt-6 border-t border-slate-50 flex items-center justify-between">
                            <div className="flex flex-col">
                              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">Starting From</span>
                              <span className="text-2xl font-bold text-slate-900">₹{service.base_price}</span>
                            </div>
                            <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all">
                              <ChevronRight className="w-6 h-6 text-slate-300 group-hover:text-white transition-colors" />
                            </div>
                          </div>
                        </div>
                      </Link>
                    </motion.div>
                  );
                })}
              </motion.div>

              {filtered.length === 0 && (
                <div className="text-center py-32 bg-slate-50 rounded-[3rem] border border-dashed border-slate-200">
                  <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center mx-auto mb-6">
                    <Search className="w-8 h-8 text-slate-300" />
                  </div>
                  <p className="text-2xl font-bold text-slate-900">No results found</p>
                  <p className="text-slate-500 mt-2 font-medium">Try searching for something else or reset filters.</p>
                  <Button variant="link" onClick={() => { setSearchTerm(""); setSelectedCategory("All"); }} className="mt-4 text-primary font-bold">Reset all filters</Button>
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </div>
  );
};

export default Services;
