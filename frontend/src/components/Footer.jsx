import React from "react";
import { Link } from "react-router-dom";
import {
  Facebook,
  Twitter,
  Instagram,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";

const Footer = () => {
  return (
    <div className="bg-slate-100 dark:bg-slate-900 dark:text-slate-300 text-slate-700 text-sm px-6 py-10">
      <footer className="max-w-7xl mx-auto grid md:grid-cols-4 sm:grid-cols-2 gap-6 text-left">
        {/* About */}
        <div>
          <h2 className="text-base font-semibold mb-2">About</h2>
          <p>
            Smart Waste Management Platform aims to create a cleaner and smarter
            environment using tech-driven solutions.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h2 className="text-base font-semibold mb-2">Quick Links</h2>
          <ul className="space-y-1">
            <li>
             <Link 
             to="/reportdump"
             className="hover:text-green-600">Report Dump</Link>
            </li>
            <li>
              <a href="/dashboard" className="hover:text-green-600">
                Admin Dashboard
              </a>
            </li>
            <li>
              <Link to="/about" className="hover:text-green-600">
                About Us
              </Link>
            </li>
            <li>
              <Link to="/contact" className="hover:text-green-600">Contact Us</Link>
            </li>
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h2 className="text-base font-semibold mb-2">Contact</h2>
          <ul className="space-y-2">
            <li className="flex items-center gap-2">
              <Mail size={16} /> support@smartwaste.com
            </li>
            <li className="flex items-center gap-2">
              <Phone size={16} /> +91 9876543210
            </li>
            <li className="flex items-center gap-2">
              <MapPin size={16} /> Delhi, India
            </li>
          </ul>
        </div>

        {/* Socials */}
        <div>
          <h2 className="text-base font-semibold mb-2">Follow Us</h2>
          <div className="flex gap-4 mt-2">
            <a href="#" className="hover:text-blue-600">
              <Facebook />
            </a>
            <a href="#" className="hover:text-blue-400">
              <Twitter />
            </a>
            <a href="#" className="hover:text-pink-500">
              <Instagram />
            </a>
          </div>
        </div>
      </footer>

      {/* Copyright */}
      <div className="mt-8 text-center border-t border-slate-300 dark:border-slate-700 pt-4">
        © 2025 Smart Waste Management Platform. Built by Shivam Raj and Abhinav
        Patra.
      </div>
    </div>
  );
};

export default Footer;
