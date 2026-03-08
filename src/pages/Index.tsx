import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Search, Star, Shield, Clock, MapPin, ChevronRight, ArrowRight, CheckCircle2, Award, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import heroImage from "@/assets/hero-technician.png";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { services, technicians, reviews, cities } from "@/lib/data";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.1, duration: 0.5 },
  }),
};

const Index = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const { user, role } = useAuth();

  return (
    <div className="bg-white">
      {/* Hero Section - Urban Company Style */}
      <section className="relative pt-32 pb-20 md:pt-40 md:pb-32 overflow-hidden bg-[#F2F4F6]">
        <div className="container relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl mx-auto"
          >
            <h1 className="font-display text-4xl md:text-6xl font-bold text-slate-900 leading-[1.1] mb-8">
              Home services, on demand.
            </h1>

            {/* Search Bar Container */}
            <div className="bg-white p-2 md:p-3 rounded-2xl shadow-xl border border-slate-200 flex flex-col md:flex-row gap-2 md:items-center max-w-2xl mx-auto mb-12">
              <div className="flex-shrink-0 md:w-48 border-b md:border-b-0 md:border-r border-slate-100">
                <Select defaultValue="hyderabad">
                  <SelectTrigger className="border-none shadow-none focus:ring-0 h-10 px-4 text-slate-600 font-medium">
                    <MapPin className="w-4 h-4 mr-2 text-primary" />
                    <SelectValue placeholder="Location" />
                  </SelectTrigger>
                  <SelectContent>
                    {cities.map((c) => (
                      <SelectItem key={c} value={c.toLowerCase()}>{c}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <Input
                  placeholder="Search for 'AC Repair'..."
                  className="pl-12 border-none shadow-none focus-visible:ring-0 h-12 text-lg text-slate-900 placeholder:text-slate-400"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Link to="/services">
                <Button className="w-full md:w-auto rounded-xl px-8 h-12 text-base font-bold shadow-lg shadow-primary/20">
                  Search
                </Button>
              </Link>
            </div>

            {/* Quick Stats */}
            <div className="flex flex-wrap items-center justify-center gap-6 md:gap-12 text-slate-500 font-medium text-sm md:text-base">
              <div className="flex items-center gap-2">
                <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
                <span>4.8 Rating</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-primary" />
                <span>12M+ Customers</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-emerald-500" />
                <span>Verified Professionals</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Background Decorative Elements */}
        <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-white/50 to-transparent pointer-none hidden lg:block" />
        <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-white to-transparent pointer-none" />

        {/* Hero Technician Image */}
        <div className="absolute top-1/2 right-[5%] -translate-y-1/2 w-[400px] h-[500px] hidden lg:block">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="relative w-full h-full"
          >
            <div className="absolute -inset-10 bg-primary/10 rounded-full blur-3xl" />
            <img
              src={heroImage}
              alt="Professional Technician"
              className="relative w-full h-full object-contain z-10 drop-shadow-2xl"
            />
          </motion.div>
        </div>
      </section>

      {/* Categories Grid - Urban Company Style */}
      <section className="py-16 md:py-24 -mt-16 relative z-20">
        <div className="container">
          <div className="bg-white rounded-3xl p-8 md:p-12 shadow-2xl shadow-slate-200/50 border border-slate-100">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-8 gap-8">
              {services.map((service, i) => (
                <motion.div
                  key={service.id}
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  custom={i}
                >
                  <Link to={`/services/${service.id}`} className="group flex flex-col items-center text-center gap-3">
                    <div className="w-16 h-16 rounded-2xl bg-white border border-slate-100 shadow-sm flex items-center justify-center transition-all group-hover:shadow-md group-hover:-translate-y-1">
                      <service.icon className="w-8 h-8 transition-transform group-hover:scale-110" style={{ color: `hsl(${service.color})` }} />
                    </div>
                    <span className="text-sm font-bold text-slate-700 group-hover:text-slate-900 transition-colors">{service.title}</span>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Most Booked Services - Horizontal Grid like UC */}
      <section className="py-20 md:py-28 bg-white">
        <div className="container">
          <div className="flex items-end justify-between mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-display font-bold text-slate-900 mb-4">Most Booked Services</h2>
              <p className="text-slate-500 font-medium">Expert solutions for every home repair need.</p>
            </div>
            <Link to="/services" className="hidden md:flex items-center gap-2 text-primary font-bold hover:underline">
              View all <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {services.slice(0, 4).map((service, i) => (
              <motion.div
                key={service.id}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                custom={i}
              >
                <Link
                  to={`/services/${service.id}`}
                  className="group block rounded-3xl overflow-hidden bg-white border border-slate-100 hover:shadow-2xl transition-all duration-500"
                >
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <img
                      src={service.image}
                      alt={service.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute top-4 left-4">
                      <div className="bg-white/95 backdrop-blur px-3 py-1 rounded-full flex items-center gap-1.5 shadow-sm">
                        <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                        <span className="text-sm font-bold text-slate-900">{service.rating}</span>
                      </div>
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-primary transition-colors">{service.title}</h3>
                    <p className="text-sm text-slate-500 mb-4 line-clamp-2">{service.description}</p>
                    <div className="flex items-center justify-between pt-2 border-t border-slate-50">
                      <span className="text-lg font-bold text-slate-900">{service.price}</span>
                      <Button variant="outline" size="sm" className="rounded-xl border-slate-200 hover:bg-primary hover:text-white hover:border-primary transition-all font-bold">
                        Add
                      </Button>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust & Safety - Like UC */}
      <section className="py-24 bg-slate-900 text-white overflow-hidden relative">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-primary/5 -skew-x-12 translate-x-1/4" />
        <div className="container relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <span className="text-primary font-bold tracking-widest uppercase text-sm mb-4 block">Fixora Promise</span>
              <h2 className="text-4xl md:text-5xl font-display font-bold mb-8 leading-tight">
                Premium services, <br />
                <span className="text-primary">guaranteed safety.</span>
              </h2>
              <div className="space-y-8">
                {[
                  { title: "Verified Professionals", desc: "Every technician goes through a 15-point verification check including background, skills and identity.", icon: CheckCircle2 },
                  { title: "Fixed & Transparent Pricing", desc: "No hidden charges. You pay exactly what you see on the app, inclusive of all taxes.", icon: Award },
                  { title: "30-Day Service Guarantee", desc: "Not happy with the service? We will re-fix it for free within 30 days of completion.", icon: Shield },
                ].map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="flex gap-5"
                  >
                    <div className="flex-shrink-0 w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
                      <item.icon className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h4 className="text-xl font-bold mb-2">{item.title}</h4>
                      <p className="text-slate-400 leading-relaxed max-w-sm">{item.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
            <div className="relative hidden lg:block">
              <div className="absolute -inset-10 bg-primary/10 rounded-full blur-3xl" />
              <img
                src="https://images.unsplash.com/photo-1595841696677-6489ff3f8cd1?w=800&auto=format&fit=crop&q=80"
                alt="Professional technician"
                className="relative rounded-[3rem] shadow-2xl border border-white/10"
              />
              <div className="absolute bottom-10 -left-10 bg-white p-6 rounded-3xl shadow-2xl flex items-center gap-4 text-slate-900">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center">
                  <Star className="w-6 h-6 text-emerald-500 fill-emerald-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold">4.8</p>
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Global Rating</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Reviews Section Card-based like UC */}
      <section className="py-24 bg-slate-50">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-display font-bold text-slate-900 mb-6">Real stories from real users</h2>
            <p className="text-slate-500 max-w-2xl mx-auto font-medium">Join 50K+ happy customers getting things fixed every day.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {reviews.map((review, i) => (
              <motion.div
                key={review.id}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                custom={i}
                className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100 hover:shadow-xl transition-all duration-300"
              >
                <div className="flex gap-1 mb-6">
                  {Array.from({ length: review.rating }).map((_, j) => (
                    <Star key={j} className="w-4 h-4 text-amber-500 fill-amber-500" />
                  ))}
                </div>
                <p className="text-slate-700 mb-8 leading-relaxed italic">"{review.text}"</p>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-900 font-bold">
                    {review.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-bold text-slate-900">{review.name}</p>
                    <p className="text-xs font-bold text-primary uppercase tracking-widest">{review.service}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA - UC Style App Banner */}
      <section className="py-24">
        <div className="container">
          <div className="bg-[#EBF5FF] rounded-[3rem] overflow-hidden p-10 md:p-20 relative">
            <div className="absolute top-0 right-0 w-1/3 h-full bg-primary/5 pointer-none hidden lg:block" />
            <div className="relative z-10 max-w-xl">
              <h2 className="text-4xl md:text-5xl font-display font-bold text-slate-900 mb-6 leading-tight">
                Ready to make your home shine?
              </h2>
              <p className="text-slate-600 mb-10 text-lg font-medium">
                Book a verified professional in less than 60 seconds. <br className="hidden md:block" />
                Transparent pricing, guaranteed satisfaction.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/services">
                  <Button size="lg" className="rounded-2xl h-14 px-10 text-lg font-bold">
                    Book Now
                  </Button>
                </Link>
                <Link to="/about">
                  <Button size="lg" variant="outline" className="rounded-2xl h-14 px-10 text-lg font-bold border-slate-200">
                    Learn More
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
