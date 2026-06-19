"use client";

import { authClient } from "@/lib/auth-client";
import { Button, Input, Card, CardContent as CardBody } from "@heroui/react";
import { redirect } from "next/navigation";
import React from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { FaEnvelope, FaLock } from "react-icons/fa";
import Link from "next/link";

const SigninPage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    const { data: loginData, error: loginError } =
      await authClient.signIn.email({
        email: data.email,
        password: data.password,
      });

    if (loginError) {
      toast.error(loginError.message || "Invalid Email or Password");
    } else {
      toast.success("Login Successful.");
      redirect("/");
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.16, 1, 0.3, 1],
        staggerChildren: 0.05,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] },
    },
  };

  return (
    <div className="min-h-[90vh] w-full bg-white dark:bg-[#124170] flex flex-col items-center justify-center px-6 py-12 relative overflow-hidden transition-colors duration-300">
      {/* Decorative Structural Glow Nodes */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-[#AAFFC7]/10 dark:bg-[#215B63]/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-[#67C090]/10 dark:bg-[#67C090]/10 rounded-full blur-3xl pointer-events-none" />

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="w-full max-w-lg relative z-10"
      >
        <Card className="w-full border border-gray-200/40 dark:border-white/5 bg-gray-50/50 dark:bg-black/10 backdrop-blur-md shadow-xl p-6 sm:p-8">
          <div className="flex flex-col gap-1 items-center pb-6 text-center select-none">
            <motion.h1
              variants={itemVariants}
              className="text-2xl font-black uppercase tracking-wider text-[#124170] dark:text-white"
            >
              Welcome Back
            </motion.h1>
            <motion.p
              variants={itemVariants}
              className="text-xs font-semibold text-gray-500 dark:text-gray-400 mt-1"
            >
              Log in to your Tikify profile to access your tickets.
            </motion.p>
          </div>

          <CardBody className="gap-0 p-0">
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="space-y-4 w-full"
            >
              {/* Email Address Input Field */}
              <motion.div
                variants={itemVariants}
                className="flex flex-col gap-1.5"
              >
                <label
                  htmlFor="email"
                  className="text-xs font-black uppercase tracking-wider text-[#124170] dark:text-[#AAFFC7] flex items-center gap-1.5"
                >
                  <FaEnvelope className="text-[10px]" />
                  Email Address
                </label>
                <Input
                  id="email"
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                      message: "Please enter a valid email address",
                    },
                  })}
                  placeholder="john@example.com"
                  type="email"
                  className="w-full"
                />
                {errors.email && (
                  <span className="text-[10px] font-bold tracking-wide text-red-500 uppercase mt-0.5 ml-1">
                    {errors.email.message}
                  </span>
                )}
              </motion.div>

              {/* Password Input Field */}
              <motion.div
                variants={itemVariants}
                className="flex flex-col gap-1.5"
              >
                <label
                  htmlFor="password"
                  className="text-xs font-black uppercase tracking-wider text-[#124170] dark:text-[#AAFFC7] flex items-center gap-1.5"
                >
                  <FaLock className="text-[10px]" />
                  Password
                </label>
                <Input
                  id="password"
                  {...register("password", {
                    required: "Password is required",
                  })}
                  placeholder="Enter your password"
                  type="password"
                  className="w-full"
                />
                {errors.password && (
                  <span className="text-[10px] font-bold tracking-wide text-red-500 uppercase mt-0.5 ml-1">
                    {errors.password.message}
                  </span>
                )}
              </motion.div>

              {/* Main Form Submit Trigger Button Layout */}
              <motion.div
                variants={itemVariants}
                className="pt-2"
                whileHover={{ scale: 1.015 }}
                whileTap={{ scale: 0.985 }}
              >
                <Button
                  type="submit"
                  className="w-full h-11 text-xs font-bold tracking-wider uppercase bg-[#124170] dark:bg-[#67C090] text-[#AAFFC7] dark:text-[#124170] rounded-full shadow-md dark:shadow-none transition-colors"
                >
                  Sign In
                </Button>
              </motion.div>

              {/* Form Navigation Alternative link footer */}
              <motion.p
                variants={itemVariants}
                className="text-center text-sm font-semibold text-gray-500 dark:text-gray-400 pt-2"
              >
                Don't have an account?{" "}
                <Link
                  href="/auth/signup"
                  className="text-[#124170] dark:text-[#67C090] font-bold hover:opacity-80 transition-opacity"
                >
                  REGISTER HERE
                </Link>
              </motion.p>
            </form>
          </CardBody>
        </Card>
      </motion.div>
    </div>
  );
};

export default SigninPage;
