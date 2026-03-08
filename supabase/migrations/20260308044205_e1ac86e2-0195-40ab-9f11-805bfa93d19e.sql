
-- Create app roles enum
CREATE TYPE public.app_role AS ENUM ('customer', 'technician', 'admin');

-- Create profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL DEFAULT '',
  phone TEXT,
  avatar_url TEXT,
  city TEXT,
  area TEXT,
  address TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT TO authenticated USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE TO authenticated USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON public.profiles
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);

-- Create user_roles table
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  UNIQUE (user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Security definer function for role checking
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

CREATE POLICY "Users can view own roles" ON public.user_roles
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

-- Auto-create profile and assign customer role on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, phone)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data ->> 'full_name', ''),
    COALESCE(NEW.phone, NEW.raw_user_meta_data ->> 'phone', '')
  );
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'customer');
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Services table
CREATE TABLE public.services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  category TEXT NOT NULL,
  description TEXT,
  icon TEXT,
  base_price INTEGER NOT NULL DEFAULT 0,
  image_url TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active services" ON public.services
  FOR SELECT USING (is_active = true);

-- Technician profiles
CREATE TABLE public.technician_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  skills TEXT[] DEFAULT '{}',
  experience_years INTEGER DEFAULT 0,
  id_verified BOOLEAN DEFAULT false,
  is_available BOOLEAN DEFAULT true,
  rating NUMERIC(2,1) DEFAULT 0,
  total_jobs INTEGER DEFAULT 0,
  bio TEXT,
  city TEXT,
  area TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.technician_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view verified technicians" ON public.technician_profiles
  FOR SELECT USING (id_verified = true);

CREATE POLICY "Technicians can update own profile" ON public.technician_profiles
  FOR UPDATE TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Technicians can insert own profile" ON public.technician_profiles
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

-- Bookings table
CREATE TABLE public.bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  technician_id UUID REFERENCES public.technician_profiles(id),
  service_id UUID REFERENCES public.services(id) NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  address TEXT NOT NULL,
  city TEXT NOT NULL,
  scheduled_date DATE NOT NULL,
  scheduled_time TEXT NOT NULL,
  payment_method TEXT DEFAULT 'cash',
  total_amount INTEGER DEFAULT 0,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Customers can view own bookings" ON public.bookings
  FOR SELECT TO authenticated USING (auth.uid() = customer_id);

CREATE POLICY "Customers can create bookings" ON public.bookings
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = customer_id);

CREATE POLICY "Customers can update own bookings" ON public.bookings
  FOR UPDATE TO authenticated USING (auth.uid() = customer_id);

-- Reviews table
CREATE TABLE public.reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID REFERENCES public.bookings(id) ON DELETE CASCADE NOT NULL,
  customer_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  technician_id UUID REFERENCES public.technician_profiles(id) NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view reviews" ON public.reviews
  FOR SELECT USING (true);

CREATE POLICY "Customers can create reviews" ON public.reviews
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = customer_id);

-- Seed services data
INSERT INTO public.services (name, slug, category, description, base_price) VALUES
  ('Pipe Leakage Repair', 'pipe-leakage-repair', 'Plumbing', 'Fix leaking pipes and joints', 299),
  ('Tap Replacement', 'tap-replacement', 'Plumbing', 'Replace old or broken taps', 349),
  ('Bathroom Fittings', 'bathroom-fittings', 'Plumbing', 'Install bathroom fixtures and fittings', 499),
  ('Fan Installation', 'fan-installation', 'Electrical', 'Install ceiling or exhaust fans', 249),
  ('Switch Repair', 'switch-repair', 'Electrical', 'Fix or replace electrical switches', 149),
  ('Wiring Repair', 'wiring-repair', 'Electrical', 'Repair faulty wiring and connections', 399),
  ('AC Repair', 'ac-repair', 'Appliance Repair', 'Diagnose and fix AC issues', 499),
  ('Refrigerator Repair', 'refrigerator-repair', 'Appliance Repair', 'Fix refrigerator problems', 449),
  ('Washing Machine Repair', 'washing-machine-repair', 'Appliance Repair', 'Repair washing machine issues', 399),
  ('Water Purifier Repair', 'water-purifier-repair', 'Appliance Repair', 'Service and repair water purifiers', 349),
  ('Door Repair', 'door-repair', 'Carpentry', 'Fix doors hinges and locks', 299),
  ('Furniture Fixing', 'furniture-fixing', 'Carpentry', 'Repair and assemble furniture', 399),
  ('Interior Painting', 'interior-painting', 'Painting', 'Professional interior wall painting', 1499),
  ('Exterior Painting', 'exterior-painting', 'Painting', 'Professional exterior painting', 1999),
  ('Deep Home Cleaning', 'deep-home-cleaning', 'Cleaning', 'Thorough deep cleaning of entire home', 1299),
  ('Sofa Cleaning', 'sofa-cleaning', 'Cleaning', 'Professional sofa and upholstery cleaning', 599),
  ('Kitchen Cleaning', 'kitchen-cleaning', 'Cleaning', 'Deep kitchen cleaning and degreasing', 799);
