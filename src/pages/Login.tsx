import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Wrench, Phone, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Login = () => {
  const [phone, setPhone] = useState("");

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <Link to="/" className="flex items-center justify-center gap-2 mb-8">
          <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
            <Wrench className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="font-display text-2xl font-bold text-foreground">
            Fix<span className="text-primary">Nest</span>
          </span>
        </Link>

        <div className="p-8 rounded-2xl bg-card border border-border shadow-lg">
          <Tabs defaultValue="customer">
            <TabsList className="w-full mb-6">
              <TabsTrigger value="customer" className="flex-1">Customer</TabsTrigger>
              <TabsTrigger value="technician" className="flex-1">Technician</TabsTrigger>
            </TabsList>

            <TabsContent value="customer">
              <h2 className="font-display text-xl font-bold text-foreground mb-1">Welcome back</h2>
              <p className="text-sm text-muted-foreground mb-6">Log in to book home services</p>
            </TabsContent>
            <TabsContent value="technician">
              <h2 className="font-display text-xl font-bold text-foreground mb-1">Technician Login</h2>
              <p className="text-sm text-muted-foreground mb-6">Access your dashboard and bookings</p>
            </TabsContent>
          </Tabs>

          <div className="space-y-4">
            <div>
              <Label htmlFor="phone">Mobile Number</Label>
              <div className="relative mt-1.5">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="phone"
                  placeholder="+91 98765 43210"
                  className="pl-10"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
            </div>
            <Button className="w-full" size="lg">
              Send OTP <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>

          <div className="mt-6 text-center text-sm text-muted-foreground">
            By continuing, you agree to our{" "}
            <span className="text-primary cursor-pointer">Terms</span> and{" "}
            <span className="text-primary cursor-pointer">Privacy Policy</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
