import {
  Droplets, Zap, Wind, Hammer, Paintbrush, Sparkles,
  WashingMachine, GlassWater,
} from "lucide-react";

export const services = [
  {
    id: "plumbing",
    title: "Plumbing",
    icon: Droplets,
    description: "Tap replacement, pipe leakage repair, bathroom fittings",
    price: "₹299",
    color: "174 62% 32%",
    image: "https://images.unsplash.com/photo-1581244277943-fe4a9c777189?w=800&auto=format&fit=crop&q=80",
    rating: 4.8
  },
  {
    id: "electrical",
    title: "Electrical",
    icon: Zap,
    description: "Fan installation, switch repair, socket replacement",
    price: "₹349",
    color: "36 95% 55%",
    image: "https://images.unsplash.com/photo-1621905252507-b354bc2d1bb6?w=800&auto=format&fit=crop&q=80",
    rating: 4.9
  },
  {
    id: "ac-repair",
    title: "AC Repair",
    icon: Wind,
    description: "AC servicing, gas refill, installation & repair",
    price: "₹499",
    color: "200 70% 50%",
    image: "https://images.unsplash.com/photo-1594142465967-58688b18a0ca?w=800&auto=format&fit=crop&q=80",
    rating: 4.7
  },
  {
    id: "carpentry",
    title: "Carpentry",
    icon: Hammer,
    description: "Door repair, furniture fixing, hinge replacement",
    price: "₹399",
    color: "25 70% 45%",
    image: "https://images.unsplash.com/photo-1533090161767-e6ffed986c88?w=800&auto=format&fit=crop&q=80",
    rating: 4.6
  },
  {
    id: "painting",
    title: "Painting",
    icon: Paintbrush,
    description: "Full house painting, wall textures & waterproof",
    price: "₹999",
    color: "340 65% 50%",
    image: "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=800&auto=format&fit=crop&q=80",
    rating: 4.9
  },
  {
    id: "cleaning",
    title: "Cleaning",
    icon: Sparkles,
    description: "Deep home cleaning, sofa & kitchen cleaning",
    price: "₹599",
    color: "152 60% 42%",
    image: "https://images.unsplash.com/photo-1581578731522-745a05ad9ad5?w=800&auto=format&fit=crop&q=80",
    rating: 4.8
  },
  {
    id: "appliance-repair",
    title: "Appliances",
    icon: WashingMachine,
    description: "Refrigerator, washing machine, oven repair",
    price: "₹449",
    color: "270 50% 50%",
    image: "https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=800&auto=format&fit=crop&q=80",
    rating: 4.5
  },
  {
    id: "water-purifier",
    title: "Water Purifier",
    icon: GlassWater,
    description: "RO service, filter replacement, installation",
    price: "₹349",
    color: "200 80% 45%",
    image: "https://images.unsplash.com/photo-1585704032915-c339aae199c7?w=800&auto=format&fit=crop&q=80",
    rating: 4.7
  },
];

export const technicians = [
  {
    id: 1, name: "Rajesh Kumar", skill: "Plumbing Expert",
    rating: 4.9, jobs: 1240, city: "Mumbai", verified: true,
  },
  {
    id: 2, name: "Amit Singh", skill: "Electrician",
    rating: 4.8, jobs: 980, city: "Delhi", verified: true,
  },
  {
    id: 3, name: "Suresh Patel", skill: "AC Technician",
    rating: 4.9, jobs: 1560, city: "Bangalore", verified: true,
  },
  {
    id: 4, name: "Vikram Sharma", skill: "Carpenter",
    rating: 4.7, jobs: 870, city: "Pune", verified: true,
  },
];

export const reviews = [
  {
    id: 1, name: "Priya Mehta", city: "Mumbai",
    text: "The plumber arrived on time and fixed the leak perfectly. Very professional service!",
    rating: 5, service: "Plumbing",
  },
  {
    id: 2, name: "Arjun Reddy", city: "Hyderabad",
    text: "Excellent AC repair. Technician explained the issue clearly. Highly recommend FixIt India!",
    rating: 5, service: "AC Repair",
  },
  {
    id: 3, name: "Sneha Gupta", city: "Delhi",
    text: "Best home cleaning service ever! My house looks brand new. Will book again.",
    rating: 5, service: "Cleaning",
  },
];

export const cities = [
  "Mumbai", "Delhi", "Bangalore", "Hyderabad", "Chennai",
  "Kolkata", "Pune", "Ahmedabad", "Jaipur", "Lucknow",
];
