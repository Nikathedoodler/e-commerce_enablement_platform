"use client";

import React, { useEffect } from "react";
import { useState } from "react";
import Image from "next/image";
import * as motion from "motion/react-client";
import { createClient } from "@/lib/supabase/client";

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  // Smooth scroll handler for anchor links
  const handleSmoothScroll = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith("#")) {
      e.preventDefault();
      const element = document.querySelector(href);
      if (element) {
        const offset = 80; // Account for sticky nav
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - offset;

        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth",
        });
      }
      setIsOpen(false);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 0) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Check authentication status
  useEffect(() => {
    const checkAuth = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      setIsAuthenticated(!!user);
    };
    checkAuth();
  }, []);

  return (
    <motion.nav
      initial={{ y: -30, opacity: 0 }}
      whileInView={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, delay: 0.8 }}
      className={`${
        isScrolled
          ? "bg-white/90 border border-gray-200 shadow-lg backdrop-blur-md"
          : "bg-white/70 border border-transparent shadow-sm"
      } sticky top-6 mt-6 max-w-5xl flex items-center justify-between xl:mx-auto py-2 px-6 mx-6 rounded-full transition-all duration-200 z-50`}
    >
      {/* Left: Logo */}
      <a
        href="#top"
        onClick={(e) => {
          e.preventDefault();
          window.scrollTo({ top: 0, behavior: "smooth" });
        }}
        className="flex items-center space-x-2 hover:opacity-80 transition-opacity"
      >
        <Image
          src="/images/logo.png"
          alt="Platform Logo"
          width={32}
          height={32}
        />
        <span className="font-bold text-lg">Fulfill</span>
      </a>
      {/* Center: Links */}
      <div className="hidden xl:flex items-center space-x-6 text-gray-700 font-medium">
        <a
          href="#features"
          onClick={(e) => handleSmoothScroll(e, "#features")}
          className="hover:text-black transition-all duration-200 hover:scale-105"
        >
          Features
        </a>
        <a
          href="#interactive-demo"
          onClick={(e) => handleSmoothScroll(e, "#interactive-demo")}
          className="hover:text-black transition-all duration-200 hover:scale-105"
        >
          Demo
        </a>
        <a
          href="#pricing"
          onClick={(e) => handleSmoothScroll(e, "#pricing")}
          className="hover:text-black transition-all duration-200 hover:scale-105"
        >
          Pricing
        </a>
        <a
          href="#contact"
          onClick={(e) => handleSmoothScroll(e, "#contact")}
          className="hover:text-black transition-all duration-200 hover:scale-105"
        >
          Contact
        </a>
      </div>
      {/* Right: Language, Login */}
      <div className="flex items-center space-x-2 sm:space-x-4">
        <a
          href={isAuthenticated ? "/dashboard" : "/demo"}
          className="px-3 py-1.5 sm:px-6 sm:py-2 mr-0 bg-black hover:shadow-md hover:shadow-green-400 rounded-full font-semibold text-white text-xs sm:text-sm shadow-md shadow-black/80 transition-all duration-200 hover:scale-105 group cursor-pointer whitespace-nowrap"
        >
          Dashboard
        </a>
        <div className="relative">
          <button
            className="lg:hidden cursor-pointer ml-2 pt-1"
            onClick={toggleMenu}
          >
            <Image
              src="/images/menu-bar-2.png"
              alt="burger-menu"
              width={36}
              height={18}
            />
          </button>
          {isOpen && (
            <div
              className={`lg:hidden absolute top-20 right-1 bg-white shadow-lg rounded-3xl p-4 w-40 z-10 transition-all duration-300 ease-in-out
                ${
                  isOpen
                    ? "opacity-100 scale-100 translate-y-0 pointer-events-auto"
                    : "opacity-0 scale-95 -translate-y-2 pointer-events-none"
                }`}
            >
              <div className="flex items-center hover:bg-gray-100 rounded-lg">
                <Image
                  src="/images/features.png"
                  alt="dashboard"
                  className="h-7 w-auto"
                  width={24}
                  height={8}
                />
                <a
                  href={isAuthenticated ? "/dashboard" : "/demo"}
                  className="block px-4 py-2 text-gray-700"
                  onClick={() => setIsOpen(false)}
                >
                  Dashboard
                </a>
              </div>
              <div className="flex items-center hover:bg-gray-100 rounded-lg">
                <Image
                  src="/images/features.png"
                  alt="features"
                  className="h-7 w-auto"
                  width={24}
                  height={8}
                />
                <a
                  href="#features"
                  className="block px-4 py-2 text-gray-700"
                  onClick={(e) => {
                    handleSmoothScroll(e, "#features");
                    setIsOpen(false);
                  }}
                >
                  Features
                </a>
              </div>
              <div className="flex items-center hover:bg-gray-100 rounded-lg">
                <Image
                  src="/images/features.png"
                  alt="demo"
                  className="h-7 w-auto"
                  width={24}
                  height={8}
                />
                <a
                  href="#interactive-demo"
                  className="block px-4 py-2 text-gray-700"
                  onClick={(e) => {
                    handleSmoothScroll(e, "#interactive-demo");
                    setIsOpen(false);
                  }}
                >
                  Demo
                </a>
              </div>
              <div className="flex items-center hover:bg-gray-100 rounded-lg">
                <Image
                  src="/images/pricing.svg"
                  alt="pricing"
                  className="h-7 w-auto"
                  width={24}
                  height={8}
                />
                <a
                  href="#pricing"
                  className="block px-4 py-2 text-gray-700"
                  onClick={(e) => {
                    handleSmoothScroll(e, "#pricing");
                    setIsOpen(false);
                  }}
                >
                  Pricing
                </a>
              </div>
              <div className="flex items-center hover:bg-gray-100 rounded-lg">
                <Image
                  src="/images/contact.png"
                  alt="contact"
                  className="h-7 w-auto"
                  width={24}
                  height={8}
                />
                <a
                  href="#contact"
                  className="block px-4 py-2 text-gray-700"
                  onClick={(e) => {
                    handleSmoothScroll(e, "#contact");
                    setIsOpen(false);
                  }}
                >
                  Contact
                </a>
              </div>
              <div className="flex items-center hover:bg-gray-100 rounded-lg border-t border-gray-200 mt-2 pt-2">
                <Image
                  src="/images/contact.png"
                  alt="sign in"
                  className="h-7 w-auto"
                  width={24}
                  height={8}
                />
                <a
                  href="/auth/login"
                  className="block px-4 py-2 text-gray-700 font-semibold"
                  onClick={() => setIsOpen(false)}
                >
                  Sign In
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.nav>
  );
};

export default Navigation;
