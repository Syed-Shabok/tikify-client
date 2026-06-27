"use client";

import { useEffect, useState } from "react";
import DashboardHeading from "@/components/dashboard/DashboardHeading";
import { Button } from "@heroui/react";
import { updateBookingStatus } from "@/lib/actions/bookings";
import toast from "react-hot-toast";
import { useSession } from "@/lib/auth-client";
import { getVendorBookings } from "@/lib/api/bookings";
import { motion } from "framer-motion";

export default function RequestedBookingsPage() {
  const [requests, setRequests] = useState([]);
  const { data: session } = useSession();
  const user = session?.user;
  const vendorEmail = user?.email;

  useEffect(() => {
    if (vendorEmail) {
      getVendorBookings(vendorEmail)
        .then((data) => {
          if (Array.isArray(data)) {
            setRequests(data);
          } else {
            console.error("Backend returned non-array data:", data);
            setRequests([]);
          }
        })
        .catch((error) => {
          console.error("Error fetching bookings:", error);
          setRequests([]);
        });
    }
  }, [vendorEmail]);

  const handleStatusChange = async (id, newStatus) => {
    try {
      const res = await updateBookingStatus(id, newStatus);
      if (res.modifiedCount > 0 || res.matchedCount > 0) {
        toast.success(`Booking ${newStatus} successfully!`);
        setRequests((prev) =>
          prev.map((req) =>
            req._id === id ? { ...req, status: newStatus } : req,
          ),
        );
      } else {
        toast.error("Failed to update booking status.");
      }
    } catch (error) {
      toast.error("Network error occurred.");
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
    <div className="min-h-screen w-full bg-slate-50 dark:bg-[#091624] px-6 py-12 relative overflow-hidden transition-colors duration-300">
      <DashboardHeading
        title="Requested Bookings"
        description="Manage incoming ticket reservations from users."
      />

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 mx-auto w-full lg:px-10"
      >
        {requests.length === 0 ? (
          <motion.div
            variants={itemVariants}
            className="mt-12 flex flex-col items-center justify-center p-16 border border-dashed border-zinc-200 dark:border-[#1a3d61] rounded-3xl bg-white/40 dark:bg-[#124170]/5 backdrop-blur-md shadow-sm"
          >
            <p className="text-zinc-500 dark:text-zinc-400 font-bold uppercase tracking-widest text-sm text-center">
              No booking requests yet
            </p>
          </motion.div>
        ) : (
          <motion.div
            variants={itemVariants}
            className="mt-8 overflow-hidden rounded-3xl border border-zinc-200/60 dark:border-[#1a3d61] bg-white/70 dark:bg-[#124170]/20 backdrop-blur-xl shadow-2xl"
          >
            {/* Table layout forced on md+ screens, transformed to block elements on mobile */}
            <table className="w-full text-left text-sm text-zinc-600 dark:text-zinc-400 block md:table">
              <thead className="hidden md:table-header-group bg-zinc-100/80 dark:bg-[#0b1d30]/80 text-xs uppercase font-black text-[#124170] dark:text-[#00ADB5] tracking-wider border-b border-zinc-200/60 dark:border-[#1a3d61]">
                <tr>
                  <th className="px-6 py-4">User</th>
                  <th className="px-6 py-4">Ticket Details</th>
                  <th className="px-6 py-4">Qty & Price</th>
                  <th className="px-6 py-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="block md:table-row-group divide-y divide-zinc-200/60 dark:divide-[#1a3d61]/50">
                {requests.map((req) => (
                  <tr
                    key={req._id}
                    className="block md:table-row p-4 md:p-0 hover:bg-zinc-50/50 dark:hover:bg-white/5 transition-colors"
                  >
                    {/* User Column */}
                    <td className="block md:table-cell px-2 md:px-6 py-2 md:py-4">
                      <div className="flex flex-col md:block">
                        <span className="md:hidden text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1">
                          User
                        </span>
                        <span className="font-semibold text-zinc-900 dark:text-white">
                          {req.passengerEmail}
                        </span>
                      </div>
                    </td>

                    {/* Ticket Details Column */}
                    <td className="block md:table-cell px-2 md:px-6 py-2 md:py-4">
                      <div className="flex flex-col md:block">
                        <span className="md:hidden text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1">
                          Ticket Details
                        </span>
                        <p className="font-bold text-zinc-900 dark:text-white mb-0.5">
                          {req.ticketTitle}
                        </p>
                        <p className="text-xs text-zinc-500 dark:text-zinc-400 font-medium">
                          {req.from} → {req.to}
                        </p>
                      </div>
                    </td>

                    {/* Quantity & Price Column */}
                    <td className="block md:table-cell px-2 md:px-6 py-2 md:py-4">
                      <div className="flex items-center justify-between md:block">
                        <span className="md:hidden text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                          Qty & Price
                        </span>
                        <div className="text-right md:text-left">
                          <p className="text-zinc-900 dark:text-white font-bold">
                            {req.bookingQuantity} Seats
                          </p>
                          <p className="text-[#124170] dark:text-[#AAFFC7] font-black mt-0.5">
                            ৳{req.totalPrice}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Actions Column */}
                    <td className="block md:table-cell px-2 md:px-6 pt-4 pb-2 md:py-4 text-center border-t border-dashed md:border-none border-zinc-200/60 dark:border-[#1a3d61]/50 mt-3 md:mt-0">
                      {req.status === "pending" ? (
                        <div className="flex items-center md:justify-center justify-start gap-2">
                          <Button
                            size="sm"
                            onPress={() =>
                              handleStatusChange(req._id, "accepted")
                            }
                            className="bg-zinc-100 dark:bg-[#00ADB5]/20 text-[#124170] dark:text-[#00ADB5] border border-zinc-200 dark:border-[#00ADB5]/50 hover:bg-zinc-200 dark:hover:bg-[#00ADB5] dark:hover:text-white hover:text-[#091624] font-bold tracking-wider rounded-xl transition-all w-full md:w-auto"
                          >
                            Accept
                          </Button>
                          <Button
                            size="sm"
                            onPress={() =>
                              handleStatusChange(req._id, "rejected")
                            }
                            className="bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-500 border border-red-200 dark:border-red-500/30 hover:bg-red-100 dark:hover:bg-red-500 dark:hover:text-white font-bold tracking-wider rounded-xl transition-all w-full md:w-auto"
                          >
                            Reject
                          </Button>
                        </div>
                      ) : (
                        <div className="flex justify-start md:justify-center w-full">
                          <span
                            className={`text-[11px] font-black uppercase tracking-widest px-3 py-1.5 rounded-lg border ${
                              req.status === "accepted" || req.status === "paid"
                                ? "bg-[#67C090]/10 text-[#124170] border-[#67C090]/30 dark:text-[#AAFFC7]"
                                : "bg-red-500/10 text-red-600 border-red-500/30 dark:text-red-400"
                            }`}
                          >
                            {req.status}
                          </span>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </motion.div>
        )}
      </motion.div>

      <div className="absolute -top-40 -left-40 w-96 h-96 bg-[#00ADB5]/10 dark:bg-[#124170]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-[#67C090]/10 dark:bg-[#AAFFC7]/5 rounded-full blur-3xl pointer-events-none" />
    </div>
  );
}
