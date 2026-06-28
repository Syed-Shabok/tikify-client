"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@heroui/react";
import Link from "next/link";
import {
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaTag,
  FaCheckCircle,
  FaArrowLeft,
  FaUserTie,
  FaEnvelope,
  FaInfoCircle,
} from "react-icons/fa";
import BookingModal from "@/components/BookingModal";

export default function TicketDetailsClient({ ticket }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [timeLeft, setTimeLeft] = useState("");
  const [isExpired, setIsExpired] = useState(false);

  // Original Countdown Logic preserved
  useEffect(() => {
    const calculateTimeLeft = () => {
      const departureTime = new Date(ticket.departureDateTime).getTime();
      const now = new Date().getTime();
      const difference = departureTime - now;

      if (difference <= 0) {
        setIsExpired(true);
        setTimeLeft("Departure Passed");
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
      );
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      setTimeLeft(`${days}d ${hours}h ${minutes}m ${seconds}s`);
    };

    calculateTimeLeft(); // Initial call
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [ticket.departureDateTime]);

  const isSoldOut = ticket.quantity === 0;
  const isButtonDisabled = isExpired || isSoldOut;

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        // FIX: Simplified to w-full since the parent now controls the 7xl max-width
        className="w-full space-y-10"
      >
        {/* Back Button */}
        <Link href="/all-tickets">
          <Button
            variant="light"
            className="text-zinc-500 hover:text-[#124170] dark:text-zinc-400 dark:hover:text-white font-bold tracking-wider uppercase text-xs transition-colors px-0"
            startContent={<FaArrowLeft />}
          >
            Back to Catalog
          </Button>
        </Link>

        {/* Hero Banner Container */}
        <div className="relative h-[300px] md:h-[450px] w-full rounded-[2.5rem] overflow-hidden shadow-2xl border border-zinc-200/60 dark:border-[#1a3d61]">
          <img
            src={ticket.image}
            alt={ticket.title}
            className="w-full h-full object-cover opacity-90 dark:opacity-80"
          />
          {/* Theme-aware gradient to blend image into the background */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-50 via-slate-50/20 dark:from-[#091624] dark:via-[#091624]/40 to-transparent" />

          <span className="absolute top-8 left-8 inline-flex items-center gap-2 px-5 py-2.5 text-xs font-black uppercase tracking-widest bg-[#00ADB5]/90 text-white dark:text-[#091624] rounded-full backdrop-blur-md shadow-lg border border-white/20">
            <FaTag size={12} /> {ticket.transportType}
          </span>
        </div>

        {/* Content Grid (2 columns on desktop) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 lg:gap-16">
          {/* LEFT COLUMN: Main Details */}
          <div className="lg:col-span-2 space-y-12">
            {/* Title & Core Meta */}
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-2">
                {ticket.isAdvertised && (
                  <span className="px-3 py-1 bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 text-[10px] font-black uppercase tracking-widest rounded-lg border border-yellow-500/20">
                    Featured Route
                  </span>
                )}
                <span
                  className={`px-3 py-1 text-[10px] font-black uppercase tracking-widest rounded-lg border ${ticket.status === "approved" ? "bg-[#67C090]/10 text-[#67C090] border-[#67C090]/20" : "bg-zinc-500/10 text-zinc-500 border-zinc-500/20"}`}
                >
                  {ticket.status}
                </span>
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-[#124170] dark:text-white leading-[1.1]">
                {ticket.title}
              </h1>

              <div className="flex flex-wrap gap-8 text-sm text-zinc-600 dark:text-zinc-300 pt-2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white dark:bg-[#102226] border border-zinc-200/60 dark:border-[#1a3d61] flex items-center justify-center text-[#00ADB5] shadow-sm">
                    <FaMapMarkerAlt size={16} />
                  </div>
                  <div>
                    <p className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider">
                      Route Info
                    </p>
                    <p className="font-semibold">
                      {ticket.from} → {ticket.to}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white dark:bg-[#102226] border border-zinc-200/60 dark:border-[#1a3d61] flex items-center justify-center text-[#00ADB5] shadow-sm">
                    <FaCalendarAlt size={16} />
                  </div>
                  <div>
                    <p className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider">
                      Departure
                    </p>
                    <p className="font-semibold">
                      {new Date(ticket.departureDateTime).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* MASSIVE Countdown Section */}
            <div className="bg-white/40 dark:bg-[#124170]/10 border border-zinc-200/60 dark:border-[#1a3d61] rounded-3xl p-8 backdrop-blur-xl shadow-lg relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-[#00ADB5]/5 rounded-full blur-3xl pointer-events-none" />
              <p className="text-xs font-black uppercase tracking-widest text-[#124170] dark:text-[#00ADB5] mb-4 flex items-center gap-2">
                <FaInfoCircle /> Time Until Departure
              </p>
              <div
                className={`text-4xl md:text-5xl lg:text-6xl font-black tabular-nums tracking-tighter ${isExpired ? "text-red-500 dark:text-red-400" : "text-[#124170] dark:text-[#AAFFC7]"}`}
              >
                {timeLeft}
              </div>
            </div>

            {/* Amenities & Perks */}
            {ticket.perks && ticket.perks.length > 0 && (
              <div className="space-y-5">
                <h2 className="text-xl font-bold text-[#124170] dark:text-white uppercase tracking-widest">
                  Included Amenities
                </h2>
                <div className="flex flex-wrap gap-3">
                  {ticket.perks.map((perk, idx) => (
                    <span
                      key={idx}
                      className="flex items-center gap-2 px-4 py-2.5 text-xs font-bold uppercase tracking-widest bg-white dark:bg-[#102226] border border-zinc-200/60 dark:border-[#1a3d61] text-zinc-700 dark:text-zinc-200 rounded-xl shadow-sm"
                    >
                      <FaCheckCircle className="text-[#67C090]" size={14} />{" "}
                      {perk}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Expanded Vendor Information */}
            <div className="space-y-5 pt-8 border-t border-zinc-200/60 dark:border-[#1a3d61]/60">
              <h2 className="text-xl font-bold text-[#124170] dark:text-white uppercase tracking-widest mb-6">
                Provider Information
              </h2>
              <div className="flex flex-col sm:flex-row gap-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-zinc-100 dark:bg-[#0b1d30] border border-zinc-200/60 dark:border-[#1a3d61] flex items-center justify-center text-zinc-400">
                    <FaUserTie size={18} />
                  </div>
                  <div>
                    <p className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider">
                      Vendor Name
                    </p>
                    <p className="font-semibold text-zinc-900 dark:text-white">
                      {ticket.vendorName}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-zinc-100 dark:bg-[#0b1d30] border border-zinc-200/60 dark:border-[#1a3d61] flex items-center justify-center text-zinc-400">
                    <FaEnvelope size={18} />
                  </div>
                  <div>
                    <p className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider">
                      Contact Profile
                    </p>
                    <p className="font-semibold text-zinc-900 dark:text-white">
                      {ticket.vendorEmail}
                    </p>
                  </div>
                </div>
              </div>
              <p className="text-[11px] font-semibold text-zinc-400 mt-4">
                Listing created on:{" "}
                {new Date(ticket.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>

          {/* RIGHT COLUMN: Sticky Booking Card */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 bg-white/70 dark:bg-[#124170]/20 backdrop-blur-2xl border border-zinc-200/60 dark:border-[#1a3d61] rounded-[2rem] p-8 shadow-2xl flex flex-col gap-8">
              {/* Pricing Header */}
              <div>
                <p className="text-xs uppercase font-black text-zinc-400 tracking-widest mb-2">
                  Total Fare per Seat
                </p>
                <div className="flex items-end gap-2">
                  <span className="text-5xl font-black tracking-tighter text-[#124170] dark:text-[#AAFFC7]">
                    ৳{ticket.price}
                  </span>
                </div>
              </div>

              {/* Status Bar */}
              <div className="bg-zinc-100/80 dark:bg-[#091624]/60 rounded-2xl p-4 border border-zinc-200/60 dark:border-[#1a3d61]/40">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-widest">
                    Availability
                  </span>
                  <span
                    className={`text-xs font-black ${isSoldOut ? "text-red-500" : "text-[#67C090]"}`}
                  >
                    {ticket.quantity} Seats Left
                  </span>
                </div>
                {/* Visual Progress Bar - defaults to full green if tickets exist, empty red if 0 */}
                <div className="w-full h-2 bg-zinc-200 dark:bg-[#1a3d61] rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${isSoldOut ? "w-0 bg-red-500" : "w-full bg-[#67C090]"}`}
                    style={{
                      width: isSoldOut
                        ? "0%"
                        : `${Math.min(100, (ticket.quantity / 50) * 100)}%`,
                    }} // Visual approximation
                  />
                </div>
              </div>

              {/* Booking CTA */}
              <Button
                isDisabled={isButtonDisabled}
                onPress={() => setIsModalOpen(true)}
                className={`w-full h-16 rounded-2xl font-black text-sm tracking-widest uppercase transition-all shadow-xl
                  ${
                    isButtonDisabled
                      ? "bg-zinc-200 dark:bg-zinc-800 text-zinc-400 dark:text-zinc-600 cursor-not-allowed shadow-none"
                      : "bg-[#124170] hover:bg-[#0b1d30] text-white dark:bg-[#00ADB5] dark:hover:bg-[#009299] dark:text-[#091624] hover:scale-[1.02]"
                  }`}
              >
                {isSoldOut
                  ? "Sold Out"
                  : isExpired
                    ? "Departure Passed"
                    : "Book Ticket Now"}
              </Button>

              <p className="text-center text-[10px] font-semibold text-zinc-400">
                Secure transaction processed via Stripe.
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Preserve Original Modal */}
      <BookingModal
        isOpen={isModalOpen}
        onOpenChange={setIsModalOpen}
        ticket={ticket}
      />
    </>
  );
}
