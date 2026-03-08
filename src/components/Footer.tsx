import { Link } from "react-router-dom";
import { Wrench, Phone, Mail, MapPin, Instagram, Facebook, Twitter, Linkedin } from "lucide-react";

const Footer = () => (
  <footer className="bg-slate-900 text-slate-400 pt-20 pb-10">
    <div className="container">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
        <div>
          <Link to="/" className="flex items-center gap-2 mb-6">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20">
              <Wrench className="w-6 h-6 text-white" />
            </div>
            <span className="font-display text-3xl font-black text-white hover:text-primary transition-colors tracking-tighter">
              Fixora
            </span>
          </Link>
          <p className="text-sm leading-relaxed mb-6">
            Fixora is the future of on-demand home services. We connect skilled professionals with households across India, delivering quality work with a 30-day guarantee.
          </p>
          <div className="flex gap-4">
            {[Instagram, Facebook, Twitter, Linkedin].map((Icon, i) => (
              <a key={i} href="#" className="w-9 h-9 rounded-full bg-white/5 flex items-center justify-center hover:bg-primary hover:text-white transition-all">
                <Icon className="w-4 h-4" />
              </a>
            ))}
          </div>
        </div>

        <div>
          <h4 className="font-bold text-white mb-6 uppercase tracking-wider text-xs">For Customers</h4>
          <ul className="space-y-4 text-sm font-medium">
            {["UC Reviews", "Categories Near Me", "Blog", "Contact Us"].map((s) => (
              <li key={s}>
                <Link to="#" className="hover:text-primary transition-colors">{s}</Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="font-bold text-white mb-6 uppercase tracking-wider text-xs">For Partners</h4>
          <ul className="space-y-4 text-sm font-medium">
            {["Register as a Professional", "Partner Support", "Training Academy", "Safety Standards"].map((s) => (
              <li key={s}>
                <Link to="/login" className="hover:text-primary transition-colors">{s}</Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="font-bold text-white mb-6 uppercase tracking-wider text-xs">Contact</h4>
          <ul className="space-y-4 text-sm font-medium">
            <li className="flex items-center gap-3"><Phone className="w-4 h-4 text-primary" /> +91 98765 43210</li>
            <li className="flex items-center gap-3"><Mail className="w-4 h-4 text-primary" /> support@fixora.in</li>
            <li className="flex items-center gap-3 leading-relaxed">
              <MapPin className="w-4 h-4 text-primary flex-shrink-0" />
              123, Tech Park, Hitech City, <br /> Hyderabad, India
            </li>
          </ul>
        </div>
      </div>

      <div className="pt-10 border-t border-white/5">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-xs font-bold text-slate-600">
            © 2026 Fixora. All rights reserved. Registered Trademark of Fixora Pvt Ltd.
          </p>
          <div className="flex gap-8 text-xs font-bold text-slate-600 uppercase tracking-widest">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-white transition-colors">Anti-discrimination Policy</a>
          </div>
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;
