"use client";

import React, { useEffect, useState } from "react";
import { Session } from "next-auth";

import Image from "next/image";
import * as motion from "motion/react-client";
import { useRouter } from "next/navigation";
import SignIn from "./Sign-in";
import { SignOut } from "./signout-button";

type NavigationClientProps = {
  session?: Session | null;
};

const NavigationClient = ({ session }: NavigationClientProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const router = useRouter();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
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

  return (
    <motion.nav
      initial={{ y: -30, opacity: 0 }}
      whileInView={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, delay: 0.8 }}
      className={`$ {
        isScrolled
          ? "opacity-80 left-1/2 -translate-x-1/2 fixed top-6 transition-opacity duration-100"
          : "mx-auto mt-6"
      } w-7/8 lg:w-3/4 xl:w-1/2 flex items-center justify-between py-2 px-6 md:px-6 bg-white/80 backdrop-blur-md border border-gray-200 rounded-full shadow-sm z-50`}
    >
      {session?.user ? <SignOut /> : <SignIn />}
      {/* Center: Links */}
      <div className="hidden md:flex items-center space-x-8 text-gray-700 font-medium">
        <a href="admin" className="hover:text-black transition hover:scale-120">
          Admin
        </a>
        <a
          className="hover:text-black transition hover:scale-120"
          onClick={() => router.push("/login")}
        >
          Dashboard
        </a>
        <a
          href="#features"
          className="hover:text-black transition hover:scale-120"
        >
          Features
        </a>
        <a
          href="#pricing"
          className="hover:text-black transition hover:scale-120"
        >
          Pricing
        </a>
        <a
          href="#contact"
          className="hover:text-black transition hover:scale-120"
        >
          Contact
        </a>
      </div>
      {/* Right: Language, Login */}
      <div className="flex space-x-4">
        <a
          href="#contact"
          className="px-6 py-2 mr-0 bg-black hover:shadow-md hover:shadow-green-400 rounded-full font-semibold text-white shadow-md shadow-black/80 transition-all duration-200 hover:scale-105 group cursor-pointer"
        >
          Book a Demo
        </a>
        <div className="reletaive">
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
                $ {
                  isOpen
                    ? "opacity-100 scale-100 translate-y-0 pointer-events-auto"
                    : "opacity-0 scale-95 -translate-y-2 pointer-events-none"
                }`}
            >
              <div className="flex items-center hover:bg-gray-100">
                <Image
                  src="/images/features.png"
                  alt="pricing"
                  className="h-7 w-auto"
                  width={24}
                  height={8}
                />
                <a
                  href="#dashboard"
                  className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                >
                  Admin
                </a>
              </div>
              <div className="flex items-center hover:bg-gray-100">
                <Image
                  src="/images/features.png"
                  alt="pricing"
                  className="h-7 w-auto"
                  width={24}
                  height={8}
                />
                <a
                  className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                  onClick={() => router.push("/login")}
                >
                  Dashboard
                </a>
              </div>
              <div className="flex items-center hover:bg-gray-100">
                <Image
                  src="/images/features.png"
                  alt="pricing"
                  className="h-7 w-auto"
                  width={24}
                  height={8}
                />
                <a
                  href="#features"
                  className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                >
                  Features
                </a>
              </div>
              <div className="flex items-center hover:bg-gray-100">
                <Image
                  src="/images/pricing.svg"
                  alt="pricing"
                  className="h-7 w-auto"
                  width={24}
                  height={8}
                />
                <a
                  href="#pricing"
                  className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                >
                  Pricing
                </a>
              </div>
              <div className="flex items-center hover:bg-gray-100">
                <Image
                  src="/images/contact.png"
                  alt="pricing"
                  className="h-7 w-auto"
                  width={24}
                  height={8}
                />
                <a
                  href="#contact"
                  className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                >
                  Contact
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.nav>
  );
};

export default NavigationClient;
