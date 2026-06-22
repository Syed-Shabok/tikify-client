"use client";

import React from "react";
import { motion } from "framer-motion";
import { Card, Button } from "@heroui/react";
import { FaEdit, FaTrash, FaMapMarkerAlt, FaCalendarAlt } from "react-icons/fa";
import { DeleteAlertButton } from "./DeleteAlertButton";

export const VendorTicketCard = ({ ticket, onEditClick, onDeleteSuccess }) => {
  const isRejected = ticket?.status === "rejected";

  // Configuration map for status pill styling
  const statusStyles = {
    pending: "bg-amber-500/50 text-slate-950 border-amber-600 shadow-md",
    approved: "bg-[#67C090]/50 text-slate-950 border-[#53b27f] shadow-md",
    rejected: "bg-red-500 text-white border-red-700 shadow-md",
  };

  return (
    <motion.div
      whileHover={{ y: -6, transition: { duration: 0.2, ease: "easeOut" } }}
    >
      <Card className="w-full overflow-hidden bg-white/70 dark:bg-[#124170]/20 backdrop-blur-xl rounded-3xl border border-zinc-200/60 dark:border-[#1a3d61] shadow-xl hover:shadow-2xl transition-all duration-300">
        {/* Banner Display Image */}
        <div className="relative h-44 w-full bg-zinc-100 dark:bg-[#0b1d30]/50 overflow-hidden">
          <img
            src={
              ticket?.image ||
              "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?q=80&w=600"
            }
            alt={ticket?.title}
            className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
          />
          {/* Absolute Verification Badge */}
          <span
            className={`absolute top-4 right-4 px-3 py-1 text-[10px] font-black uppercase tracking-widest rounded-full border select-none backdrop-blur-md ${
              statusStyles[ticket?.status] || statusStyles.pending
            }`}
          >
            {ticket?.status}
          </span>
        </div>

        {/* Meta Contents */}
        <div className="p-5 flex flex-col flex-grow justify-between gap-4">
          <div>
            <h4 className="text-base font-bold text-zinc-900 dark:text-zinc-100 line-clamp-1 select-none">
              {ticket?.title}
            </h4>

            {/* Route Vectors */}
            <div className="flex items-center gap-2 mt-2 text-xs font-semibold text-zinc-500 dark:text-zinc-400">
              <FaMapMarkerAlt className="text-zinc-400 shrink-0" />
              <span className="truncate">
                {ticket?.from} → {ticket?.to}
              </span>
            </div>

            {/* Time Vector */}
            <div className="flex items-center gap-2 mt-1.5 text-xs font-semibold text-zinc-500 dark:text-zinc-400">
              <FaCalendarAlt className="text-zinc-400 shrink-0" />
              <span>
                {ticket?.departureDateTime
                  ? new Date(ticket.departureDateTime).toLocaleString([], {
                      dateStyle: "short",
                      timeStyle: "short",
                    })
                  : "Not Specified"}
              </span>
            </div>
          </div>

          {/* Quantities and Pricing Metadata */}
          <div className="flex items-center justify-between pt-3 border-t border-zinc-200/60 dark:border-[#1a3d61]/60">
            <div className="text-left">
              <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                Inventory
              </p>
              <p className="text-xs font-black text-zinc-700 dark:text-zinc-300">
                {ticket?.quantity} Left
              </p>
            </div>
            <div className="text-right">
              <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                Rate
              </p>
              <p className="text-sm font-black text-[#124170] dark:text-[#AAFFC7]">
                ৳{ticket?.price}
              </p>
            </div>
          </div>

          {/* Action Controls Matrix */}
          <div className="grid grid-cols-2 gap-3 pt-1">
            <motion.div whileTap={isRejected ? {} : { scale: 0.97 }}>
              <Button
                size="sm"
                disabled={isRejected}
                onClick={onEditClick}
                className={`w-full font-bold text-xs uppercase tracking-wider rounded-xl transition-all ${
                  isRejected
                    ? "bg-zinc-200 dark:bg-[#0b1d30]/40 text-zinc-400 dark:text-zinc-600 cursor-not-allowed opacity-50"
                    : "bg-zinc-100 dark:bg-[#124170]/40 text-[#124170] dark:text-zinc-200 hover:bg-zinc-200 dark:hover:bg-[#124170]/60"
                }`}
              >
                <FaEdit className="mr-1" /> Update
              </Button>
            </motion.div>

            <motion.div whileTap={isRejected ? {} : { scale: 0.97 }}>
              <DeleteAlertButton
                ticket={ticket}
                isRejected={isRejected}
                onDeleteSuccess={onDeleteSuccess}
              />
            </motion.div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};
