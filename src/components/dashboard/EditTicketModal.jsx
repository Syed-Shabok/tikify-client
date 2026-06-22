"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Button, Form } from "@heroui/react";
import { useRouter } from "next/navigation";
import { updateTickets } from "@/lib/actions/tickets";
import { uploadImage } from "@/utils/uploadImage";
import toast from "react-hot-toast";
import { FaImage } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

const TRANSPORT_TYPES = ["Bus", "Train", "Flight", "Launch"];
const AVAILABLE_PERKS = [
  "AC",
  "Breakfast",
  "Wifi",
  "Sleeper Berths",
  "Extra Legroom",
];

const EditTicketModal = ({
  isOpen,
  onOpenChange,
  editingTicket,
  onSuccess,
}) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [selectedPerks, setSelectedPerks] = useState([]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    if (editingTicket) {
      setSelectedPerks(editingTicket.perks || []);
    }
  }, [editingTicket]);

  const handlePerkChange = (perk, isChecked) => {
    setSelectedPerks((prev) =>
      isChecked ? [...prev, perk] : prev.filter((p) => p !== perk),
    );
  };

  const onSubmit = async (data) => {
    try {
      setLoading(true);

      const payload = {
        ...data,
        price: Number(data.price),
        quantity: Number(data.quantity),
        perks: selectedPerks,
      };

      // Handle image upload if a new file was selected
      delete payload.image;
      if (data.image && data.image[0]) {
        const imageUrl = await uploadImage(data.image[0]);
        if (imageUrl) payload.image = imageUrl;
      }

      const result = await updateTickets(payload, editingTicket?._id);

      if (result?.modifiedCount > 0) {
        toast.success("Ticket updated successfully!");
        if (onSuccess) onSuccess(editingTicket._id, payload);
        onOpenChange(false);
        router.refresh();
      } else {
        toast.error("No changes detected.");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to update ticket.");
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full h-10 px-3 rounded-xl bg-zinc-100/80 dark:bg-[#0b1d30]/80 border border-zinc-200/60 dark:border-[#1a3d61] text-sm font-semibold text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-[#67C090] hover:border-[#67C090] transition-colors";

  const labelClass =
    "text-xs font-bold text-zinc-600 dark:text-zinc-400 mb-1.5 block";

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center">
          {/* Backdrop Animates Fade In/Out */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => onOpenChange(false)}
          />

          {/* Modal Panel Animates Scale Up & Fade In / Scale Down & Fade Out */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ type: "spring", duration: 0.35, bounce: 0.15 }}
            className="relative z-10 w-full max-w-2xl mx-4 rounded-2xl border border-zinc-200/60 dark:border-[#1a3d61] bg-white dark:bg-[#0a141d] p-6 mt-18 lg:mt-0 shadow-2xl max-h-[90vh] overflow-y-auto"
          >
            {/* Header */}
            <div className="mb-6">
              <h2 className="text-xl font-bold text-zinc-900 dark:text-white">
                Edit Ticket
              </h2>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                Update ticket information below. All fields are editable.
              </p>
            </div>

            <Form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {/* Title + Image */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Ticket Title</label>
                  <input
                    defaultValue={editingTicket?.title}
                    placeholder="e.g. Dhaka to Cox's Bazar Express"
                    className={inputClass}
                    {...register("title", { required: "Title is required" })}
                  />
                  {errors.title && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.title.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className={labelClass}>Update Image</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none">
                      <FaImage className="text-sm" />
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      className={`${inputClass} pt-2 pl-8 cursor-pointer file:hidden`}
                      {...register("image")}
                    />
                  </div>
                  {editingTicket?.image && (
                    <p className="text-zinc-400 text-xs mt-1 truncate">
                      Current:{" "}
                      <a
                        href={editingTicket.image}
                        target="_blank"
                        rel="noreferrer"
                        className="underline hover:text-[#67C090]"
                      >
                        {editingTicket.image}
                      </a>
                    </p>
                  )}
                </div>
              </div>

              {/* From / To */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>From</label>
                  <input
                    defaultValue={editingTicket?.from}
                    placeholder="e.g. Dhaka"
                    className={inputClass}
                    {...register("from", { required: "Origin is required" })}
                  />
                  {errors.from && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.from.message}
                    </p>
                  )}
                </div>
                <div>
                  <label className={labelClass}>To</label>
                  <input
                    defaultValue={editingTicket?.to}
                    placeholder="e.g. Cox's Bazar"
                    className={inputClass}
                    {...register("to", { required: "Destination is required" })}
                  />
                  {errors.to && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.to.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Transport Type / Departure */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Transport Type</label>
                  <select
                    defaultValue={editingTicket?.transportType}
                    className={`${inputClass} cursor-pointer appearance-none bg-white dark:bg-[#0b1d30]/80 text-zinc-900 dark:text-zinc-100`}
                    {...register("transportType", {
                      required: "Transport type required",
                    })}
                  >
                    <option value="" disabled className="text-zinc-400">
                      Select Type
                    </option>
                    {TRANSPORT_TYPES.map((type) => (
                      <option
                        key={type}
                        value={type}
                        className="dark:bg-[#0B1A2D] dark:text-white"
                      >
                        {type}
                      </option>
                    ))}
                  </select>
                  {errors.transportType && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.transportType.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className={labelClass}>Departure Date & Time</label>
                  <input
                    type="datetime-local"
                    defaultValue={editingTicket?.departureDateTime}
                    className={inputClass}
                    {...register("departureDateTime", {
                      required: "Departure time required",
                    })}
                  />
                  {errors.departureDateTime && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.departureDateTime.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Price / Quantity */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Price (per unit)</label>
                  <input
                    type="number"
                    defaultValue={editingTicket?.price}
                    placeholder="0.00"
                    className={inputClass}
                    {...register("price", {
                      required: "Price required",
                      min: { value: 1, message: "Must be positive" },
                    })}
                  />
                  {errors.price && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.price.message}
                    </p>
                  )}
                </div>
                <div>
                  <label className={labelClass}>Ticket Quantity</label>
                  <input
                    type="number"
                    defaultValue={editingTicket?.quantity}
                    placeholder="e.g. 40"
                    className={inputClass}
                    {...register("quantity", {
                      required: "Quantity required",
                      min: { value: 1, message: "At least 1" },
                    })}
                  />
                  {errors.quantity && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.quantity.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Perks */}
              <div className="border-t border-zinc-200/60 dark:border-[#1a3d61] pt-4">
                <label className={labelClass}>Included Amenities & Perks</label>
                <div className="flex flex-wrap gap-2">
                  {AVAILABLE_PERKS.map((perk) => {
                    const isChecked = selectedPerks.includes(perk);
                    return (
                      <label
                        key={perk}
                        className={`flex items-center gap-2 px-3 py-2 rounded-full border cursor-pointer transition-all text-xs font-black uppercase tracking-widest select-none
                          ${
                            isChecked
                              ? "border-[#67C090] bg-[#67C090]/10 text-[#124170] dark:text-[#AAFFC7]"
                              : "border-zinc-200/60 dark:border-[#1a3d61] bg-zinc-50 dark:bg-[#0b1d30]/50 text-zinc-500 dark:text-zinc-400"
                          }`}
                      >
                        <input
                          type="checkbox"
                          className="hidden"
                          checked={isChecked}
                          onChange={(e) =>
                            handlePerkChange(perk, e.target.checked)
                          }
                        />
                        <span
                          className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center shrink-0 transition-all
                            ${
                              isChecked
                                ? "border-[#67C090] bg-[#67C090]"
                                : "border-zinc-300 dark:border-[#1a3d61] bg-white dark:bg-[#0b1d30]"
                            }`}
                        >
                          {isChecked && (
                            <svg
                              viewBox="0 0 10 8"
                              className="w-2 h-2 fill-none stroke-white dark:stroke-[#124170]"
                              strokeWidth="2.5"
                              strokeLinecap="round"
                            >
                              <path d="M1 4l2.5 2.5L9 1" />
                            </svg>
                          )}
                        </span>
                        {perk}
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-3 pt-4 border-t border-zinc-200/60 dark:border-[#1a3d61]">
                <Button
                  type="button"
                  onPress={() => onOpenChange(false)}
                  className="px-5 h-10 text-xs font-bold uppercase tracking-wider rounded-full border border-zinc-200 dark:border-[#1a3d61] text-zinc-600 dark:text-zinc-400 bg-transparent hover:bg-zinc-100 dark:hover:bg-[#0b1d30] transition-all"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={loading}
                  className="px-5 h-10 text-xs font-bold uppercase tracking-wider rounded-full bg-[#124170] dark:bg-[#67C090] text-white dark:text-[#124170] hover:opacity-90 transition-all"
                >
                  {loading ? "Uploading & Saving..." : "Save Changes"}
                </Button>
              </div>
            </Form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default EditTicketModal;
