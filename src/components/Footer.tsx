"use client";

import React from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import * as motion from "motion/react-client";
import { EmailLogo } from "../../public/svg/EmailLogo";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";

const emailSchema = z.string().email({ message: "invalid email format" });

const Footer = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<{ email: string }>({
    resolver: zodResolver(
      z.object({
        email: emailSchema,
      })
    ),
  });

  const onSubmit: SubmitHandler<{ email: string }> = async (data) => {
    const toastId = toast.loading("Registering");
    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      const result = await response.json();
      toast.dismiss(toastId);

      if (result.success) {
        toast.success(result.message);
      } else {
        toast.error(result.error);
      }
    } catch (error) {
      toast.dismiss(toastId);
      toast.error("Something went wrong");
    }
    console.log("data", data);
  };
  return (
    <footer
      id="contact"
      className="w-full min-h-[100vh] bg-[#2d2d2d] flex items-center justify-center p-6"
    >
      <div className="w-full xl:max-w-7xl bg-white rounded-4xl md:rounded-[2.5rem] min-h-[40vh] xl:min-h-[60vh] flex flex-col items-center justify-evenly md:items-stretch md:justify-between relative px-8  md:p-16">
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
              alt="Cuckoo Logo"
              className="h-8 w-auto"
              width={32}
              height={16}
            />
          </div> */}
          <span className="font-semibold text-sm md:text-xl text-gray-800">
            3PL Fulfillment Made Simple & Profitable
          </span>
        </motion.div>
        {/* Main Content */}
        <div>
          <div className="flex flex-col md:flex-row w-full flex-1">
            {/* Left Side */}
            <div className="flex-1 flex flex-col justify-center items-center md:items-start md:justify-start gap-4">
              <motion.span
                initial={{ y: -20, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: 1 }}
                className="font-semibold text-xl text-gray-800 mb-2"
              >
                Want To Try Demo?
              </motion.span>
              <motion.h1
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                transition={{ duration: 0.8, type: "string", stiffness: 100 }}
                className="text-5xl md:text-6xl xl:text-8xl font-extrabold text-gray-800 leading-none mb-6"
              >
                LET’S WORK
                <br />
                TOGETHER
              </motion.h1>
              <motion.form
                initial={{ y: -20, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: 1 }}
                onSubmit={handleSubmit(onSubmit)}
                className="relative flex items-center bg-white border border-gray-200 rounded-xl overflow-hidden w-full max-w-md mb-10 shadow-sm"
              >
                <EmailLogo />
                <input
                  type="email"
                  {...register("email")}
                  placeholder="Enter your email..."
                  className="flex-1 py-3 bg-transparent outline-none text-gray-700 placeholder-gray-400 text-base pr-32"
                />
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-[#23262F] text-white px-3 py-1.5 font-semibold rounded-xl shadow-xs shadow-black/80 hover:shadow-md hover:shadow-green-400 cursor-pointer transition-all duration-200 hover:scale-105"
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
            className="flex md:hidden flex-row justify-center gap-6 mt-10"
          >
            <a
              href="#"
              className="text-base text-gray-800 hover:text-black transition hover:scale-120"
            >
              X
            </a>
            <a
              href="#"
              className="text-base text-gray-800 hover:text-black transition hover:scale-120"
            >
              Instagram
            </a>
            <a
              href="#"
              className="text-base text-gray-800 hover:text-black transition hover:scale-120"
            >
              Behance
            </a>
            <a
              href="#"
              className="text-base text-gray-800 hover:text-black transition hover:scale-120"
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
