import React from "react";
import Image from "next/image";
import * as motion from "motion/react-client";

const Footer = () => {
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
        {/* Email Subscribe Input */}
        {/* <form className="relative flex items-center bg-white border border-gray-200 rounded-xl overflow-hidden w-full max-w-md mb-10 shadow-sm mx-auto">
          <span className="pl-4 pr-2 text-gray-400">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M16 12H8m8 0a4 4 0 11-8 0 4 4 0 018 0zm0 0v4a4 4 0 01-8 0v-4"
              />
            </svg>
          </span>
          <input
            type="email"
            placeholder="Enter your email..."
            className="flex-1 py-3 bg-transparent outline-none text-gray-700 placeholder-gray-400 text-base pr-32"
          />
          <button
            type="submit"
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-[#23262F] text-white px-5 py-2 font-semibold rounded-xl hover:bg-black transition-all text-sm shadow"
          >
            Subscribe
          </button>
        </form> */}
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
              {/* <a
                href="#"
                className="flex items-center text-2xl md:text-4xl text-gray-700 font-semibold border-b border-gray-400 w-fit hover:text-black transition hover:scale-120"
              >
                Contact us
                <span className="ml-2 text-2xl font-normal">↗</span>
              </a> */}
              <motion.form
                initial={{ y: -20, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: 1 }}
                className="relative flex items-center bg-white border border-gray-200 rounded-xl overflow-hidden w-full max-w-md mb-10 shadow-sm"
              >
                <Image
                  src="/images/email-2.png"
                  alt="email"
                  width={32}
                  height={16}
                  className="h4 w-auto px-4"
                />
                <input
                  type="email"
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
