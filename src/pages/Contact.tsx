import { motion } from "framer-motion";
import { Phone, Mail, MapPin, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const Contact = () => (
  <div className="min-h-screen bg-background">
    <Navbar />
    <section className="pt-24 pb-20">
      <div className="container max-w-4xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-14">
          <h1 className="font-display text-4xl font-bold text-foreground mb-4">Contact Us</h1>
          <p className="text-muted-foreground">We'd love to hear from you. Get in touch with our support team.</p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {[
            { icon: Phone, label: "Phone", value: "+91 98765 43210" },
            { icon: Mail, label: "Email", value: "support@fixnest.in" },
            { icon: MapPin, label: "Office", value: "Mumbai, Maharashtra" },
          ].map(({ icon: Icon, label, value }) => (
            <div key={label} className="p-6 rounded-2xl bg-card border border-border text-center">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-3">
                <Icon className="w-5 h-5 text-primary" />
              </div>
              <p className="font-medium text-foreground text-sm">{label}</p>
              <p className="text-sm text-muted-foreground">{value}</p>
            </div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="p-8 rounded-2xl bg-card border border-border"
        >
          <h3 className="font-display text-xl font-semibold text-foreground mb-6">Send us a message</h3>
          <div className="grid sm:grid-cols-2 gap-4 mb-4">
            <div>
              <Label htmlFor="name">Name</Label>
              <Input id="name" placeholder="Your name" className="mt-1.5" />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="your@email.com" className="mt-1.5" />
            </div>
          </div>
          <div className="mb-4">
            <Label htmlFor="message">Message</Label>
            <Textarea id="message" placeholder="How can we help?" className="mt-1.5" rows={5} />
          </div>
          <Button size="lg">
            Send Message <Send className="w-4 h-4 ml-2" />
          </Button>
        </motion.div>
      </div>
    </section>
    <Footer />
  </div>
);

export default Contact;
