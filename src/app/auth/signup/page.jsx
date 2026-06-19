"use client";

import { authClient } from "@/lib/auth-client";
import { uploadImage } from "@/utils/uploadImage";
import { Button, Input, Card, CardContent as CardBody } from "@heroui/react";
import { redirect } from "next/navigation";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { FaUser, FaEnvelope, FaLock, FaImage, FaUserCog } from "react-icons/fa";
import Link from "next/link";

const SignupPage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const [roleOpen, setRoleOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState("attendee");

  const onSubmit = async (data) => {
    const imageFile = data.image[0];
    const imageUrl = await uploadImage(imageFile);

    const { data: signupData, error: signupError } =
      await authClient.signUp.email({
        name: data.name,
        email: data.email,
        password: data.password,
        image: imageUrl,
      });

    if (signupError) {
      toast.error(signupError.message || "Registration Failed");
    } else {
      toast.success("Registration Successful");
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
              Create An Account
            </motion.h1>
            <motion.p
              variants={itemVariants}
              className="text-xs font-semibold text-gray-500 dark:text-gray-400 mt-1"
            >
              Join Tikify to explore modern ticketing networks across
              Bangladesh.
            </motion.p>
          </div>

          <CardBody className="gap-0 p-0">
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="space-y-4 w-full"
            >
              {/* Full Name Input Field */}
              <motion.div
                variants={itemVariants}
                className="flex flex-col gap-1.5"
              >
                <label
                  htmlFor="name"
                  className="text-xs font-black uppercase tracking-wider text-[#124170] dark:text-[#AAFFC7] flex items-center gap-1.5"
                >
                  <FaUser className="text-[10px]" />
                  Full Name
                </label>
                <Input
                  id="name"
                  {...register("name", {
                    required: "Name is required",
                  })}
                  placeholder="John Doe"
                  className="w-full"
                />
                {errors.name && (
                  <span className="text-[10px] font-bold tracking-wide text-red-500 uppercase mt-0.5 ml-1">
                    {errors.name.message}
                  </span>
                )}
              </motion.div>

              {/* Email Address Input Field */}
              <motion.div
                variants={itemVariants}
                className="flex flex-col gap-1.5"
              >
                <label
                  htmlFor="email"
                  className="text-xs
                   font-black uppercase tracking-wider text-[#124170] dark:text-[#AAFFC7] flex items-center gap-1.5"
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

              {/* Profile Image File Upload Field */}
              <motion.div
                variants={itemVariants}
                className="flex flex-col gap-1.5"
              >
                <label
                  htmlFor="image"
                  className="text-xs font-black uppercase tracking-wider text-[#124170] dark:text-[#AAFFC7] flex items-center gap-1.5"
                >
                  <FaImage className="text-[10px]" />
                  Profile Image
                </label>
                <Input
                  type="file"
                  {...register("image", {
                    required: "Image is required",
                  })}
                  accept="image/*"
                  id="image"
                  className="w-full file:bg-transparent file:border-0 file:text-xs file:font-bold"
                />
                {errors.image && (
                  <span className="text-[10px] font-bold tracking-wide text-red-500 uppercase mt-0.5 ml-1">
                    {errors.image.message}
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
                    minLength: {
                      value: 6,
                      message: "Password must be at least 6 characters",
                    },
                    maxLength: {
                      value: 12,
                      message: "Password cannot exceed 12 characters",
                    },
                    pattern: {
                      value: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,12}$/,
                      message:
                        "Must contain at least one letter and one number",
                    },
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

              {/* Role Selection Custom Dropdown Field */}
              <motion.div
                variants={itemVariants}
                className="flex flex-col gap-1.5"
              >
                <label
                  htmlFor="role"
                  className="text-xs font-black uppercase tracking-wider text-[#124170] dark:text-[#AAFFC7] flex items-center gap-1.5"
                >
                  <FaUserCog className="text-[10px]" />
                  Select Account Role
                </label>

                {/* Hidden input for react-hook-form */}
                <input
                  type="hidden"
                  {...register("role", { required: "Role is required" })}
                  value={selectedRole}
                />

                <div className="relative w-full">
                  {/* Trigger Button */}
                  <button
                    type="button"
                    onClick={() => setRoleOpen((prev) => !prev)}
                    className="w-full h-10 bg-white dark:bg-[#0d2e4d] text-gray-700 dark:text-gray-200 border border-gray-200/40 dark:border-white/5 rounded-xl px-3 pr-8 text-xs font-semibold text-left focus:outline-none focus:ring-1 focus:ring-[#124170]/30 dark:focus:ring-[#67C090]/30 focus:border-[#124170] dark:focus:border-[#67C090] cursor-pointer transition-all duration-200"
                  >
                    {selectedRole === "attendee" ? "Passenger" : "Operator"}
                  </button>
                  <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-gray-400 text-[8px]">
                    {roleOpen ? "▲" : "▼"}
                  </div>

                  {/* Dropdown Options */}
                  {roleOpen && (
                    <div className="absolute z-50 top-[calc(100%+4px)] left-0 w-full bg-white dark:bg-[#0d2e4d] border border-gray-200/40 dark:border-white/5 rounded-xl overflow-hidden shadow-lg">
                      {[
                        { value: "attendee", label: "Passenger" },
                        { value: "organizer", label: "Operator" },
                      ].map((opt) => (
                        <div
                          key={opt.value}
                          onClick={() => {
                            setSelectedRole(opt.value);
                            setRoleOpen(false);
                          }}
                          className={`px-3 py-2.5 text-xs font-semibold cursor-pointer transition-colors duration-150
              ${
                selectedRole === opt.value
                  ? "bg-[#124170]/10 dark:bg-[#67C090]/10 text-[#124170] dark:text-[#67C090]"
                  : "text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-white/5"
              }`}
                        >
                          {opt.label}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {errors.role && (
                  <span className="text-[10px] font-bold tracking-wide text-red-500 uppercase mt-0.5 ml-1">
                    {errors.role.message}
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
                  Create Account
                </Button>
              </motion.div>
            </form>
            {/* Form Navigation Alternative link footer */}
            <motion.p
              variants={itemVariants}
              className="text-center text-sm font-semibold text-gray-500 dark:text-gray-400 pt-4"
            >
              Already have an account?{" "}
              <Link
                href="/auth/signin"
                className="text-[#124170] dark:text-[#67C090] font-bold  hover:opacity-80 transition-opacity"
              >
                LOGIN HERE
              </Link>
            </motion.p>
          </CardBody>
        </Card>
      </motion.div>
    </div>
  );
};

export default SignupPage;
