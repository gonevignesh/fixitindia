import {
  Droplets, Zap, Wind, Hammer, Paintbrush, Sparkles,
  WashingMachine, GlassWater,
} from "lucide-react";

export const services = [
  {
    id: "plumbing",
    title: "Plumbing",
    icon: Droplets,
    description: "Pipe leakage repair, tap replacement, bathroom fittings",
    price: "₹299",
    color: "174 62% 32%",
  },
  {
    id: "electrical",
    title: "Electrical",
    icon: Zap,
    description: "Fan installation, switch repair, wiring repair",
    price: "₹349",
    color: "36 95% 55%",
  },
  {
    id: "ac-repair",
    title: "AC Repair",
    icon: Wind,
    description: "AC servicing, gas refill, installation & repair",
    price: "₹499",
    color: "200 70% 50%",
  },
  {
    id: "carpentry",
    title: "Carpentry",
    icon: Hammer,
    description: "Door repair, furniture fixing, custom woodwork",
    price: "₹399",
    color: "25 70% 45%",
  },
  {
    id: "painting",
    title: "Painting",
    icon: Paintbrush,
    description: "Interior & exterior painting, wall textures",
    price: "₹999",
    color: "340 65% 50%",
  },
  {
    id: "cleaning",
    title: "Cleaning",
    icon: Sparkles,
    description: "Deep home cleaning, sofa & kitchen cleaning",
    price: "₹599",
    color: "152 60% 42%",
  },
  {
    id: "appliance-repair",
    title: "Appliance Repair",
    icon: WashingMachine,
    description: "Refrigerator, washing machine, water purifier repair",
    price: "₹449",
    color: "270 50% 50%",
  },
  {
    id: "water-purifier",
    title: "Water Purifier",
    icon: GlassWater,
    description: "RO service, filter replacement, installation",
    price: "₹349",
    color: "200 80% 45%",
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
