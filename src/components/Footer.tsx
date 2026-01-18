"use client";

import React from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import * as motion from "motion/react-client";
import { EmailLogo } from "../../public/svg/EmailLogo";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { trackFormSubmit } from "@/lib/analytics";

const emailSchema = z.string().email({ message: "invalid email format" });

const Footer = () => {
  const { register, handleSubmit, reset } = useForm<{ email: string }>({
    resolver: zodResolver(
      z.object({
        email: emailSchema,
      })
    ),
  });

  const onSubmit: SubmitHandler<{ email: string }> = async (data) => {
    const toastId = toast.loading("Registering");

    // Track form submission attempt
    trackFormSubmit("email_signup", "footer", {
      email_domain: data.email.split("@")[1], // Track domain (e.g., "gmail.com")
    });

    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...data, source: "footer" }),
      });
      const result = await response.json();
      toast.dismiss(toastId);

      if (result.success) {
        // Track successful submission
        trackFormSubmit("email_signup", "footer", {
          status: "success",
          email_domain: data.email.split("@")[1],
        });
        toast.success(result.message);
        reset();
      } else {
        // Track failed submission
        trackFormSubmit("email_signup", "footer", {
          status: "error",
          error_message: result.error,
          email_domain: data.email.split("@")[1],
        });
        toast.error(result.error);
      }
    } catch {
      // Track network/exception error
      trackFormSubmit("email_signup", "footer", {
        status: "error",
        error_message: "network_error",
        email_domain: data.email.split("@")[1],
      });
      toast.dismiss(toastId);
      toast.error("Something went wrong");
    }
  };
  return (
    <footer
      id="contact"
      className="w-full min-h-[100vh] bg-[#2d2d2d] flex items-center justify-center p-4 sm:p-6"
    >
      <div className="w-full xl:max-w-7xl bg-white rounded-3xl sm:rounded-4xl md:rounded-[2.5rem] min-h-[50vh] sm:min-h-[40vh] xl:min-h-[60vh] flex flex-col items-center justify-evenly md:items-stretch md:justify-between relative px-6 py-8 sm:px-8 sm:py-10 md:p-16">
        {/* Top Row */}
        <motion.div
          initial={{ scale: 0 }}
          whileInView={{ scale: 1 }}
          transition={{ duration: 0.8, type: "string", stiffness: 100 }}
          className="w-full flex justify-center items-center gap-6"
        >
          {/* <div className="flex items-center space-x-2">
            <Image
              src="/images/logo.png"
              alt="Platform Logo"
              className="h-8 w-auto"
              width={32}
              height={16}
            />
          </div> */}
          <span className="font-semibold text-xs sm:text-sm md:text-xl text-gray-800 text-center">
            3PL Fulfillment Made Simple & Profitable
          </span>
        </motion.div>
        {/* Main Content */}
        <div className="w-full">
          <div className="flex flex-col md:flex-row w-full flex-1 gap-6 md:gap-0">
            {/* Left Side */}
            <div className="flex-1 flex flex-col justify-center items-center md:items-start md:justify-start gap-3 sm:gap-4">
              <motion.span
                initial={{ y: -20, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: 1 }}
                className="font-semibold text-base sm:text-lg md:text-xl text-gray-800 mb-1 sm:mb-2 text-center md:text-left"
              >
                Want To Try Demo?
              </motion.span>
              <motion.h1
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                transition={{ duration: 0.8, type: "string", stiffness: 100 }}
                className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl xl:text-8xl font-extrabold text-gray-800 leading-tight sm:leading-tight md:leading-none mb-3 sm:mb-4 md:mb-6 text-center md:text-left"
              >
                LET&apos;S WORK
                <br />
                TOGETHER
              </motion.h1>
              <motion.form
                initial={{ y: -20, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: 1 }}
                onSubmit={handleSubmit(onSubmit)}
                className="relative flex flex-col sm:flex-row items-stretch sm:items-center w-full max-w-md gap-3 sm:gap-0 sm:bg-white sm:border sm:border-gray-200 sm:rounded-xl sm:overflow-hidden sm:shadow-sm"
              >
                <div className="flex items-center flex-1 min-w-0 bg-white border border-gray-200 rounded-lg sm:border-0 sm:rounded-none sm:bg-transparent">
                  <div className="pl-3 sm:pl-4 flex-shrink-0">
                    <EmailLogo />
                  </div>
                  <input
                    type="email"
                    {...register("email")}
                    placeholder="Enter your email..."
                    className="flex-1 py-2.5 sm:py-3 bg-transparent outline-none text-gray-700 placeholder-gray-400 text-sm sm:text-base pr-2 sm:pr-24 md:pr-28 min-w-0"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full sm:w-auto sm:absolute sm:right-3 sm:top-1/2 sm:-translate-y-1/2 bg-[#23262F] text-white px-3 py-2 sm:px-2.5 sm:py-1.5 md:px-3 font-semibold rounded-lg sm:rounded-xl shadow-xs shadow-black/80 hover:shadow-md hover:shadow-green-400 cursor-pointer transition-all duration-200 hover:scale-105 text-xs sm:text-sm md:text-base whitespace-nowrap"
                >
                  REGISTER
                </button>
              </motion.form>
            </div>
            {/* Right Side: Social Links */}
            <motion.div
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              transition={{ duration: 0.8, type: "string", stiffness: 100 }}
              className="hidden md:flex flex-col justify-center items-end gap-8 ml-auto mt-8 md:mt-0"
            >
              <a
                href="#"
                className="text-lg mx-auto text-gray-800 hover:text-black transition hover:scale-120"
              >
                X
              </a>
              <a
                href="#"
                className="text-lg text-gray-800 hover:text-black transition hover:scale-120"
              >
                Instagram
              </a>
              <a
                href="#"
                className="text-lg text-gray-800 hover:text-black transition hover:scale-120"
              >
                Behance
              </a>
              <a
                href="#"
                className="text-lg text-gray-800 hover:text-black transition hover:scale-120"
              >
                Portfolio
              </a>
            </motion.div>
          </div>
          {/* Social Links for mobile */}
          <motion.div
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            transition={{ duration: 0.8, type: "string", stiffness: 100 }}
            className="flex md:hidden flex-row justify-center gap-4 sm:gap-6 mt-6 sm:mt-8 md:mt-10"
          >
            <a
              href="#"
              className="text-sm sm:text-base text-gray-800 hover:text-black transition hover:scale-120"
            >
              X
            </a>
            <a
              href="#"
              className="text-sm sm:text-base text-gray-800 hover:text-black transition hover:scale-120"
            >
              Instagram
            </a>
            <a
              href="#"
              className="text-sm sm:text-base text-gray-800 hover:text-black transition hover:scale-120"
            >
              Behance
            </a>
            <a
              href="#"
              className="text-sm sm:text-base text-gray-800 hover:text-black transition hover:scale-120"
            >
              Portfolio
            </a>
          </motion.div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
