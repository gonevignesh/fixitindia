import { motion } from "framer-motion";
import { Shield, Users, Award, Heart } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const stats = [
  { label: "Happy Customers", value: "50K+", icon: Heart },
  { label: "Verified Technicians", value: "10K+", icon: Shield },
  { label: "Cities Served", value: "25+", icon: Users },
  { label: "Services Completed", value: "200K+", icon: Award },
];

const About = () => (
  <div className="min-h-screen bg-background">
    <Navbar />
    <section className="pt-24 pb-20">
      <div className="container max-w-4xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-14">
          <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">About FixNest India</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            We're on a mission to make home services reliable, transparent, and accessible to every Indian household.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
          {stats.map(({ label, value, icon: Icon }, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="p-6 rounded-2xl bg-card border border-border text-center"
            >
              <Icon className="w-6 h-6 text-primary mx-auto mb-3" />
              <div className="font-display text-2xl font-bold text-foreground">{value}</div>
              <div className="text-xs text-muted-foreground mt-1">{label}</div>
            </motion.div>
          ))}
        </div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          className="prose prose-lg max-w-none text-muted-foreground space-y-4"
        >
          <p>
            FixNest India was born from a simple frustration — finding a trustworthy technician for home repairs shouldn't be this hard. We built a platform that connects homeowners with verified, skilled professionals who deliver quality work at fair prices.
          </p>
          <p>
            Every technician on our platform goes through a rigorous verification process including identity checks, skill assessments, and background verification. We believe in transparency — you'll always know the price before booking, with no hidden charges.
          </p>
          <p>
            From Mumbai to Delhi, Bangalore to Kolkata, we're rapidly expanding across India to ensure that reliable home services are just a tap away for every household.
          </p>
        </motion.div>
      </div>
    </section>
    <Footer />
  </div>
);

export default About;
