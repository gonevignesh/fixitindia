import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Star, Shield, Clock, MapPin, ArrowLeft, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { services, technicians } from "@/lib/data";

const ServiceDetail = () => {
  const { id } = useParams();
  const service = services.find((s) => s.id === id);

  if (!service) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container pt-32 text-center">
          <h1 className="font-display text-2xl font-bold text-foreground">Service not found</h1>
          <Link to="/services"><Button variant="outline" className="mt-4">Back to Services</Button></Link>
        </div>
        <Footer />
      </div>
    );
  }

  const Icon = service.icon;
  const features = [
    "Verified & background-checked technician",
    "30-day service warranty",
    "Transparent pricing, no hidden charges",
    "On-time arrival guarantee",
    "Rated 4.8+ by customers",
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <section className="pt-24 pb-20">
        <div className="container">
          <Link to="/services" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8">
            <ArrowLeft className="w-4 h-4" /> Back to Services
          </Link>

          <div className="grid lg:grid-cols-3 gap-10">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="lg:col-span-2">
              <div className="flex items-center gap-4 mb-6">
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center"
                  style={{ backgroundColor: `hsl(${service.color} / 0.1)` }}
                >
                  <Icon className="w-8 h-8" style={{ color: `hsl(${service.color})` }} />
                </div>
                <div>
                  <h1 className="font-display text-3xl font-bold text-foreground">{service.title}</h1>
                  <p className="text-muted-foreground">{service.description}</p>
                </div>
              </div>

              <div className="flex items-center gap-6 mb-8 text-sm">
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-accent fill-accent" />
                  <span className="font-medium text-foreground">4.8</span>
                  <span className="text-muted-foreground">(2.4K reviews)</span>
                </div>
                <div className="flex items-center gap-1 text-muted-foreground">
                  <Clock className="w-4 h-4" /> 45-90 min
                </div>
              </div>

              <div className="p-6 rounded-2xl bg-card border border-border mb-8">
                <h3 className="font-display font-semibold text-foreground mb-4">What's Included</h3>
                <ul className="space-y-3">
                  {features.map((f) => (
                    <li key={f} className="flex items-center gap-3 text-sm text-muted-foreground">
                      <CheckCircle className="w-4 h-4 text-success flex-shrink-0" /> {f}
                    </li>
                  ))}
                </ul>
              </div>

              <h3 className="font-display font-semibold text-foreground mb-4">Available Technicians</h3>
              <div className="grid sm:grid-cols-2 gap-4">
                {technicians.slice(0, 2).map((tech) => (
                  <div key={tech.id} className="p-4 rounded-xl bg-card border border-border flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-display font-bold">
                      {tech.name.split(" ").map(n => n[0]).join("")}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-foreground text-sm">{tech.name}</span>
                        <Shield className="w-3 h-3 text-primary" />
                      </div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Star className="w-3 h-3 text-accent fill-accent" /> {tech.rating} • {tech.jobs}+ jobs
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
              <div className="sticky top-24 p-6 rounded-2xl bg-card border border-border shadow-lg">
                <h3 className="font-display text-lg font-semibold text-foreground mb-2">Book {service.title}</h3>
                <div className="text-3xl font-bold text-primary mb-1">From {service.price}</div>
                <p className="text-xs text-muted-foreground mb-6">Starting price • Final quote after inspection</p>

                <div className="space-y-4 mb-6">
                  <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    <MapPin className="w-4 h-4 text-primary" />
                    Available in 10+ cities
                  </div>
                  <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    <Clock className="w-4 h-4 text-primary" />
                    Same-day booking available
                  </div>
                  <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    <Shield className="w-4 h-4 text-primary" />
                    100% verified technicians
                  </div>
                </div>

                <Link to="/login">
                  <Button className="w-full" size="lg">Book Now</Button>
                </Link>
                <p className="text-xs text-center text-muted-foreground mt-3">
                  Pay online (UPI/Card) or cash after service
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default ServiceDetail;
