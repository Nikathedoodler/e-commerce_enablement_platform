"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useAnimationControls, motion } from "framer-motion";

const Hero = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isPulseUp, setIsPulseUp] = useState(false);

  const controls = useAnimationControls();

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
  });

  useEffect(() => {
    if (!isScrolled) {
      // Reset scale and opacity before entrance animation
      controls.set({ scale: 1, y: 30, opacity: 0.6 });
      // Play entrance animation
      controls
        .start({
          y: 0,
          scale: 0.8,
          opacity: 1,
          transition: { duration: 0.5, delay: 0.1 },
        })
        .then(() => {
          setIsPulseUp(true);
          // Then start pulse effect
          controls.start({
            scale: [0.9, 1.0, 1.1],
            transition: {
              repeat: Infinity,
              duration: 1.5,
              repeatType: "loop",
              ease: "easeInOut",
            },
          });
        });
    }
  }, [isScrolled, controls]);

  return (
    <div
      id="#top"
      className="max-w-7xl mx-auto flex flex-col justify-center items-center space-y-6 py-10 px-12 scroll-mt-10"
    >
      <motion.h1
        initial={{ scale: 0 }}
        whileInView={{ scale: 1 }}
        transition={{ duration: 0.8, type: "string", stiffness: 100 }}
        className="w-full text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight text-center"
      >
        Scale E-Commerce <br />
        With 60% Lower Fulfillment Costs
      </motion.h1>
      <motion.p
        initial={{ y: -20, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="text-md xl:text-xl w-full text-center text-gray-500"
      >
        Powering modern brands with frictionless EU fulfillment—cut costs and
        ship faster with our all-in-one logistics platform.
      </motion.p>
      <div className="flex space-x-4">
        <motion.button
          className={`flex items-center gap-2 px-4 py-3 bg-black text-white text-sm rounded-full font-semibold shadow-black/80 hover:shadow-md cursor-pointer relative md hover:shadow-green-400 transition-all hover:scale-105 group ${
            isPulseUp ? "shadow-md shadow-green-400" : ""
          }`}
          onUpdate={(latest) => {
            setIsPulseUp(Number(latest.scale) > 1);
          }}
          initial={{ y: 30, opacity: 0 }}
          animate={controls}
        >
          <Image
            src="/images/face-2.jpg"
            alt="phone-call"
            className="h-6 w-6 rounded-full"
            width={64}
            height={32}
          />
          Request a Quote
          <span className="transition-transform duration-200 group-hover:translate-x-1">
            →
          </span>
        </motion.button>

        {/* <button className="px-6 py-2 bg-gray-50 border border-gray-300 rounded-2xl font-semibold text-gray-900 text-sm hover:bg-gray-100 transition cursor-pointer">
        Sign Up
        </button> */}
      </div>
      <motion.div
        initial={{ y: 30, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        transition={{ duration: 1, delay: 1 }}
        className="flex flex-row items-center gap-2 -py-0 px-4 mb-2 -mt-2 text-xs text-gray-400 font-semibold rounded-full "
      >
        <span className="inline-block w-4 h-4 rounded-full bg-green-400 shadow-inner mr-1 border-3 border-green-200"></span>
        <p>2 SPOTS AVAILABLE</p>
      </motion.div>
      <motion.div
        initial={{ y: 0, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 1.5 }}
        className="overflow-hidden w-3/4"
      >
        <div className="flex gap-4 lg:gap-14 xl:gap-28 mt-6 mb-10 animate-marquee min-w-max">
          <Image
            src="/images/DataGrail_Logo.svg"
            alt="Window"
            className="h-10 md:h-13 xl:h-14 w-auto grayscale opacity-30"
            width={80}
            height={32}
          />
          <Image
            src="/images/TrustArc_Logo.svg"
            alt="TrustArc Logo"
            className="h-10 md:h-13 xl:h-14 w-auto grayscale opacity-30"
            width={80}
            height={32}
          />
          <Image
            src="/images/mine_Logo.svg"
            alt="TrustArc Logo"
            className="h-10 md:h-13 xl:h-14 w-auto grayscale opacity-30"
            width={80}
            height={32}
          />
          <Image
            src="/images/DataGrail_Logo.svg"
            alt="Window"
            className="h-10 md:h-13 xl:h-14 w-auto grayscale opacity-30"
            width={80}
            height={32}
          />
          <Image
            src="/images/DataGrail_Logo.svg"
            alt="Window"
            className="h-10 md:h-13 xl:h-14 w-auto grayscale opacity-30"
            width={80}
            height={32}
          />
          <Image
            src="/images/TrustArc_Logo.svg"
            alt="TrustArc Logo"
            className="h-10 md:h-13 xl:h-14 w-auto grayscale opacity-30"
            width={80}
            height={32}
          />
          <Image
            src="/images/mine_Logo.svg"
            alt="TrustArc Logo"
            className="h-10 md:h-13 xl:h-14 w-auto grayscale opacity-30"
            width={80}
            height={32}
          />
          <Image
            src="/images/DataGrail_Logo.svg"
            alt="Window"
            className="h-10 md:h-13 xl:h-14 w-auto grayscale opacity-30"
            width={80}
            height={32}
          />
        </div>
      </motion.div>
      <motion.div
        initial={{ y: 30, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        transition={{ duration: 1, delay: 1 }}
        className="relative overflow-hidden h-full lg:h-full xl:h-full w-full md:w-3/4 xl:mb-12"
      >
        <Image
          src="/images/dashboard-4.png"
          alt="dashboard"
          className="w-full h-auto object-cover rounded-xl"
          width={480}
          height={160}
        />
        {/* Bottom blur overlay */}
        <div
          className="pointer-events-none absolute left-0 bottom-0 w-full h-16 md:h-24 rounded-b-xl"
          style={{
            background:
              "linear-gradient(to top, rgba(255,255,255,0.8) 70%, transparent 100%)",
            filter: "blur(4px)",
          }}
        />
      </motion.div>
    </div>
  );
};

export default Hero;
