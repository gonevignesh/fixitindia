import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { services } from "@/lib/data";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.08, duration: 0.5 },
  }),
};

const Services = () => (
  <div className="min-h-screen bg-background">
    <Navbar />
    <section className="pt-24 pb-20">
      <div className="container">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-14">
          <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">Our Services</h1>
          <p className="text-muted-foreground max-w-lg mx-auto">
            Browse our range of trusted home services. Transparent pricing, verified technicians, doorstep delivery.
          </p>
        </motion.div>

        <motion.div initial="hidden" animate="visible" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {services.map((service, i) => (
            <motion.div key={service.id} variants={fadeUp} custom={i}>
              <Link
                to={`/services/${service.id}`}
                className="group block p-6 rounded-2xl bg-card border border-border hover:border-primary/30 hover:shadow-xl transition-all duration-300 h-full"
              >
                <div
                  className="w-14 h-14 rounded-xl flex items-center justify-center mb-5 transition-transform group-hover:scale-110"
                  style={{ backgroundColor: `hsl(${service.color} / 0.1)` }}
                >
                  <service.icon className="w-7 h-7" style={{ color: `hsl(${service.color})` }} />
                </div>
                <h3 className="font-display text-lg font-semibold text-foreground mb-2">{service.title}</h3>
                <p className="text-sm text-muted-foreground mb-4">{service.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold text-primary">From {service.price}</span>
                  <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
    <Footer />
  </div>
);

export default Services;
