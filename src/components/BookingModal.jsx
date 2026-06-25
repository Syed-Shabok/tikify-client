"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@heroui/react";
import { useRouter } from "next/navigation";
import { addBooking } from "@/lib/actions/bookings";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import { FaTicketAlt, FaMinus, FaPlus } from "react-icons/fa";
import { useSession } from "@/lib/auth-client";

export default function BookingModal({ isOpen, onOpenChange, ticket }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [totalPrice, setTotalPrice] = useState(ticket.price);

  const { data: session } = useSession();
  const user = session?.user;

  // 1. Extract setValue and getValues to control the input programmatically
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    getValues,
  } = useForm({
    defaultValues: { quantity: 1 },
  });

  const quantityRegister = register("quantity", {
    required: "Quantity is required",
    min: { value: 1, message: "Minimum 1 ticket" },
    max: {
      value: ticket.quantity,
      message: `Maximum ${ticket.quantity} tickets allowed`,
    },
  });

  // 2. Custom handlers for the + and - buttons
  const updateQuantity = (newQty) => {
    if (newQty >= 1 && newQty <= ticket.quantity) {
      // Update react-hook-form value and trigger validation
      setValue("quantity", newQty, { shouldValidate: true });
      // Update local UI state
      setTotalPrice(newQty * ticket.price);
    }
  };

  const handleIncrement = () => {
    const currentQty = parseInt(getValues("quantity"), 10) || 1;
    updateQuantity(currentQty + 1);
  };

  const handleDecrement = () => {
    const currentQty = parseInt(getValues("quantity"), 10) || 1;
    updateQuantity(currentQty - 1);
  };

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      const qtyToBook = parseInt(data.quantity, 10);

      if (qtyToBook > ticket.quantity) {
        toast.error(`Only ${ticket.quantity} seats available.`);
        return;
      }

      const payload = {
        ticketId: ticket._id,
        ticketTitle: ticket.title,
        unitPrice: ticket.price,
        bookingQuantity: qtyToBook,
        totalPrice: qtyToBook * ticket.price,
        from: ticket.from,
        to: ticket.to,
        departureDateTime: ticket.departureDateTime,
        image: ticket.image,
        vendorName: ticket.vendorName,
        vendorEmail: ticket.vendorEmail,
        passengerName: user?.name,
        passengerEmail: user?.email,
        status: "pending",
        paymentStatus: "due",
      };

      const result = await addBooking(payload);

      if (result?.acknowledged) {
        toast.success("Booking requested successfully!");
        onOpenChange(false);
        router.push("/dashboard/passenger/my-booked-tickets");
      } else {
        toast.error("Failed to place booking.");
      }
    } catch (error) {
      console.error(error);
      toast.error("An error occurred during booking.");
    } finally {
      setLoading(false);
    }
  };

  // Centered the text in the input for a cleaner look with the buttons
  const inputClass =
    "w-full h-12 rounded-xl bg-zinc-100/80 dark:bg-[#0b1d30]/80 border border-zinc-200/80 dark:border-[#1a3d61] text-base font-bold text-zinc-900 dark:text-[#AAFFC7] focus:outline-none focus:border-[#00ADB5] focus:ring-1 focus:ring-[#00ADB5] transition-all text-center";

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => onOpenChange(false)}
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ type: "spring", duration: 0.35, bounce: 0.15 }}
            className="relative z-10 w-full max-w-sm rounded-3xl border border-[#1a3d61] bg-[#102226] p-7 shadow-2xl"
          >
            <div className="mb-6 pb-5 border-b border-white/5">
              <h2 className="text-2xl font-black text-white tracking-tight">
                Confirm Booking
              </h2>
              <p className="text-xs font-medium text-zinc-400 mt-1.5 leading-relaxed">
                {ticket.title} <br /> {ticket.from} to {ticket.to}
              </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-2 block">
                  Select Quantity
                </label>

                {/* 3. New Flex Container for Buttons and Input */}
                <div className="flex items-center gap-3">
                  <Button
                    isIconOnly
                    type="button"
                    onPress={handleDecrement}
                    className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-[#00ADB5] text-zinc-400 hover:text-white shrink-0 transition-all"
                  >
                    <FaMinus size={14} />
                  </Button>

                  <div className="relative flex-1">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none">
                      <FaTicketAlt size={16} />
                    </span>
                    <input
                      type="number"
                      min="1"
                      max={ticket.quantity}
                      className={`${inputClass} pl-8 pr-3`} // Adjusted padding to accommodate the icon
                      {...quantityRegister}
                      onChange={(e) => {
                        quantityRegister.onChange(e);
                        const qty = parseInt(e.target.value, 10);
                        if (!isNaN(qty) && qty > 0) {
                          setTotalPrice(qty * ticket.price);
                        } else {
                          setTotalPrice(ticket.price);
                        }
                      }}
                    />
                  </div>

                  <Button
                    isIconOnly
                    type="button"
                    onPress={handleIncrement}
                    className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-[#00ADB5] text-zinc-400 hover:text-white shrink-0 transition-all"
                  >
                    <FaPlus size={14} />
                  </Button>
                </div>

                {errors.quantity && (
                  <p className="text-red-400 text-xs mt-2 font-semibold text-center">
                    {errors.quantity.message}
                  </p>
                )}
                <p className="text-[10px] uppercase font-bold text-zinc-500 mt-3 text-center tracking-widest">
                  Available: {ticket.quantity} Seats
                </p>
              </div>

              <div className="bg-[#0b1d30]/50 rounded-2xl p-4 border border-white/5">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs font-bold text-zinc-400 uppercase tracking-widest">
                    Total Price
                  </span>
                  <span className="text-xl font-black text-[#00ADB5]">
                    ৳{totalPrice}
                  </span>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <Button
                  type="button"
                  onPress={() => onOpenChange(false)}
                  className="flex-1 bg-white/5 hover:bg-white/10 text-zinc-300 font-bold h-12 rounded-xl uppercase tracking-wider text-xs"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  isLoading={loading}
                  className="flex-1 bg-[#00ADB5] hover:bg-[#009299] text-[#091624] font-black h-12 rounded-xl uppercase tracking-wider text-xs"
                >
                  Confirm
                </Button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
