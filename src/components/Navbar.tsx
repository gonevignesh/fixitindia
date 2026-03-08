import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, Wrench, LogOut } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import {
  LayoutDashboard,
  Users,
  Bell,
  Megaphone,
  Settings,
  Briefcase,
  IndianRupee,
  User,
  House,
  Wrench as WrenchIcon,
  Info,
  PhoneCall
} from "lucide-react";

const Navbar = ({ isHome = false }: { isHome?: boolean }) => {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOut, role } = useAuth();

  const getNavLinks = () => {
    // Links for Admins
    if (role === 'admin') {
      return [
        { label: "Overview", path: "/admin-dashboard", icon: LayoutDashboard },
        { label: "Users", path: "/admin-dashboard?tab=users", icon: Users },
        { label: "Alerts", path: "/admin-dashboard?tab=alerts", icon: Bell },
        { label: "Broadcast", path: "/admin-dashboard?tab=broadcast", icon: Megaphone },
      ];
    }

    // Links for Technicians
    if (role === 'technician') {
      return [
        { label: "Dashboard", path: "/technician-dashboard", icon: LayoutDashboard },
        { label: "My Jobs", path: "/technician-dashboard#agenda", icon: Briefcase },
        { label: "Earnings", path: "/technician-dashboard#earnings", icon: IndianRupee },
        { label: "Profile", path: "/technician-dashboard#profile", icon: User },
      ];
    }

    // Links for Customers / Default
    return [
      { label: "Home", path: "/", icon: House },
      { label: "Services", path: "/services", icon: WrenchIcon },
      { label: "About", path: "/about", icon: Info },
      { label: "Contact", path: "/contact", icon: PhoneCall },
    ];
  };

  const navLinks = getNavLinks();

  const handleSignOut = async () => {
    try {
      console.log("Navbar - handleSignOut - started");
      // Clear storage as a fail-safe
      localStorage.clear();
      sessionStorage.clear();

      await signOut();
      window.location.href = "/";
    } catch (e) {
      console.error("Logout error", e);
      window.location.href = "/";
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass">
      <div className="container flex items-center justify-between h-16">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center">
            <Wrench className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="font-display text-2xl font-bold text-foreground uppercase tracking-tight">
            Fixora
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${location.pathname === link.path
                ? "bg-primary/10 text-primary"
                : "text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
            >
              <link.icon className="w-4 h-4" />
              {link.label}
            </Link>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-3">
          {user ? (
            <>
              {!isHome && (
                <>
                  <Link to={
                    role === 'admin'
                      ? '/admin-dashboard'
                      : role === 'technician'
                        ? '/technician-dashboard'
                        : '/customer-dashboard'
                  }>
                    <Button variant="ghost" size="sm" className="text-primary font-semibold">Dashboard</Button>
                  </Link>
                  <span className="text-sm text-muted-foreground ml-2">
                    {user.user_metadata?.full_name || user.email}
                  </span>
                </>
              )}
              <Button variant="ghost" size="sm" onClick={handleSignOut} className="text-muted-foreground hover:text-red-600 transition-all">
                <LogOut className="w-4 h-4 mr-1" /> Log out
              </Button>
            </>
          ) : (
            <>
              <Link to="/login">
                <Button variant="ghost" size="sm">Log in</Button>
              </Link>
              <Link to="/login">
                <Button size="sm">Book Now</Button>
              </Link>
            </>
          )}
        </div>

        <button className="md:hidden p-2" onClick={() => setOpen(!open)}>
          {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden overflow-hidden border-t border-border"
          >
            <div className="container py-4 flex flex-col gap-2">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setOpen(false)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-3 ${location.pathname === link.path
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground"
                    }`}
                >
                  <link.icon className="w-4 h-4" />
                  {link.label}
                </Link>
              ))}
              {user ? (
                <Button variant="ghost" className="w-full mt-2" size="sm" onClick={() => { handleSignOut(); setOpen(false); }}>
                  <LogOut className="w-4 h-4 mr-1" /> Log out
                </Button>
              ) : (
                <Link to="/login" onClick={() => setOpen(false)}>
                  <Button className="w-full mt-2" size="sm">Book Now</Button>
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
