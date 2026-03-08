import { Link } from "react-router-dom";
import { Wrench, Phone, Mail, MapPin } from "lucide-react";

const Footer = () => (
  <footer className="bg-foreground text-background/80 pt-16 pb-8">
    <div className="container">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
        <div>
          <Link to="/" className="flex items-center gap-2 mb-4">
            <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center">
              <Wrench className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-display text-xl font-bold text-background">
              FixIt <span className="text-primary">India</span>
            </span>
          </Link>
          <p className="text-sm text-background/60 leading-relaxed">
            Trusted home services at your doorstep. Verified technicians for every repair need across India.
          </p>
        </div>
        <div>
          <h4 className="font-display font-semibold text-background mb-4">Services</h4>
          <ul className="space-y-2 text-sm">
            {["Plumbing", "Electrical", "AC Repair", "Carpentry", "Painting", "Cleaning"].map((s) => (
              <li key={s}>
                <Link to="/services" className="hover:text-primary transition-colors">{s}</Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="font-display font-semibold text-background mb-4">Company</h4>
          <ul className="space-y-2 text-sm">
            {["About Us", "Contact", "Careers", "Blog"].map((s) => (
              <li key={s}>
                <Link to="/about" className="hover:text-primary transition-colors">{s}</Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="font-display font-semibold text-background mb-4">Contact</h4>
          <ul className="space-y-3 text-sm">
            <li className="flex items-center gap-2"><Phone className="w-4 h-4 text-primary" /> +91 98765 43210</li>
            <li className="flex items-center gap-2"><Mail className="w-4 h-4 text-primary" /> support@fixitindia.in</li>
            <li className="flex items-center gap-2"><MapPin className="w-4 h-4 text-primary" /> Mumbai, India</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-background/10 pt-6 text-center text-xs text-background/40">
        © 2026 FixIt India. All rights reserved.
      </div>
    </div>
  </footer>
);

export default Footer;
