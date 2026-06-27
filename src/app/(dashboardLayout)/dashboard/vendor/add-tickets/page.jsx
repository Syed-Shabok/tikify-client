"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useSession } from "@/lib/auth-client";
import { addTickets } from "@/lib/actions/tickets";
import { getUserProfile } from "@/lib/api/users"; // <-- Import the Server Action
import { uploadImage } from "@/utils/uploadImage";
import { motion } from "framer-motion";
import { Button, Card, CardHeader, Input, Form, Label } from "@heroui/react";
import { FaBan, FaTicketAlt } from "react-icons/fa";
import DashboardHeading from "@/components/dashboard/DashboardHeading";

const AddTicketPage = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [transportOpen, setTransportOpen] = useState(false);
  const [selectedTransport, setSelectedTransport] = useState("");

  // New States for Security Check
  const [isVendorBlocked, setIsVendorBlocked] = useState(false);
  const [isLoadingStatus, setIsLoadingStatus] = useState(true);

  const TRANSPORT_TYPES = ["Bus", "Train", "Flight", "Launch"];
  const AVAILABLE_PERKS = [
    "AC",
    "Breakfast",
    "Wifi",
    "Sleeper Berths",
    "Extra Legroom",
  ];

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      perks: [],
    },
  });

  const selectedPerks = watch("perks");

  // Client-Side Security Check on Mount
  useEffect(() => {
    const checkVendorStatus = async () => {
      if (session?.user?.email) {
        try {
          // Use the Server Action instead of raw fetch to avoid Import Bleeds
          const userData = await getUserProfile(session.user.email);

          if (userData?.isBlocked) {
            setIsVendorBlocked(true);
          }
        } catch (error) {
          console.error("Failed to verify vendor status:", error);
        } finally {
          setIsLoadingStatus(false);
        }
      } else if (session === null) {
        setIsLoadingStatus(false); // Done loading session, user is not logged in
      }
    };
    checkVendorStatus();
  }, [session]);

  const handlePerkChange = (perk, isChecked) => {
    if (isChecked) {
      setValue("perks", [...selectedPerks, perk]);
    } else {
      setValue(
        "perks",
        selectedPerks.filter((p) => p !== perk),
      );
    }
  };

  const onSubmit = async (data) => {
    try {
      setIsSubmitting(true);
      const imageFile = data.ticketImage[0];
      if (!imageFile) {
        toast.error("Please choose a ticket display image.");
        return;
      }

      const uploadToast = toast.loading("Uploading image to ImgBB...");
      const imageUrl = await uploadImage(imageFile);
      toast.dismiss(uploadToast);

      if (!imageUrl) {
        toast.error("Image upload failed. Try again.");
        return;
      }

      const ticketPayload = {
        title: data.title,
        from: data.from,
        to: data.to,
        transportType: data.transportType,
        price: Number(data.price),
        quantity: Number(data.quantity),
        departureDateTime: data.departureDateTime,
        perks: data.perks,
        image: imageUrl,
        vendorName: session?.user?.name || "Tikify Vendor",
        vendorEmail: session?.user?.email,
        status: "pending",
      };

      const result = await addTickets(ticketPayload);

      // Catch the backend 403 security rejection
      if (result?.error) {
        toast.error(result.error);
        return;
      }

      if (result && (result.insertedId || result.acknowledged)) {
        toast.success("Ticket posted successfully! Awaiting verification.");
        router.push("/dashboard/vendor/my-added-tickets");
      } else {
        toast.error(result?.message || "Could not create ticket record.");
      }
    } catch (error) {
      console.error("Submission Error: ", error);
      toast.error("An unexpected server interaction issue occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Motion Animation Presets
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

  // Render Loader while checking security status
  if (isLoadingStatus) {
    return (
      <div className="min-h-[85vh] flex items-center justify-center bg-slate-50 dark:bg-[#091624]">
        <div className="w-12 h-12 border-4 border-[#00ADB5] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // Render Restricted UI if Vendor is Fraudulent
  if (isVendorBlocked) {
    return (
      <div className="min-h-[85vh] w-full bg-slate-50 dark:bg-[#091624] px-6 py-12 relative overflow-hidden transition-colors duration-300">
        <DashboardHeading
          title="Add Ticket"
          description="List and distribute custom transport or passage tickets."
        />
        <div className="mt-12 relative z-10 flex flex-col items-center justify-center p-10 md:p-16 border border-red-500/30 rounded-3xl bg-red-500/5 backdrop-blur-xl max-w-2xl mx-auto text-center shadow-[0_0_50px_-12px_rgba(239,68,68,0.15)]">
          <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mb-6 border border-red-500/20">
            <FaBan className="text-red-500 text-4xl" />
          </div>
          <h2 className="text-2xl md:text-3xl font-black text-white uppercase tracking-widest mb-3">
            Account Restricted
          </h2>
          <p className="text-zinc-400 font-medium text-sm md:text-base leading-relaxed">
            Your vendor account has been flagged for fraudulent activity. You
            are permanently restricted from listing new tickets or managing
            inventory on this platform.
          </p>
        </div>
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-red-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-[#091624] rounded-full blur-3xl pointer-events-none" />
      </div>
    );
  }

  // Original Form UI
  return (
    <div className="min-h-[85vh] w-full bg-slate-50 dark:bg-[#091624] px-6 py-12 relative overflow-hidden transition-colors duration-300">
      <DashboardHeading
        title="Add Ticket"
        description="List and distribute custom transport or passage tickets."
      />
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="mt-8 relative z-10 flex flex-col items-start max-w-4xl mx-auto w-full"
      >
        <Card
          className="w-full bg-white/70 dark:bg-[#124170]/20 backdrop-blur-xl rounded-3xl border border-zinc-200/60 dark:border-[#1a3d61] shadow-2xl transition-all duration-300"
          radius="lg"
        >
          <CardHeader className="flex flex-col gap-1 pb-4 border-b border-zinc-200/60 dark:border-[#1a3d61]/60 p-8 select-none">
            <motion.h3
              variants={itemVariants}
              className="text-2xl font-black uppercase tracking-wider text-[#124170] dark:text-zinc-100"
            >
              Issue Fleet Tickets
            </motion.h3>
            <motion.p
              variants={itemVariants}
              className="text-xs font-semibold leading-relaxed text-zinc-500 dark:text-zinc-400 mt-1"
            >
              Provide travel details, pricing tier brackets, and upload
              promotional display assets. All fields are required.
            </motion.p>
          </CardHeader>
          <div className="p-8">
            <Form
              onSubmit={handleSubmit(onSubmit)}
              className="space-y-6 w-full"
            >
              <motion.div variants={itemVariants} className="w-full">
                <Label
                  htmlFor="title"
                  className="text-xs font-bold text-zinc-600 dark:text-zinc-400 mb-1.5 block select-none"
                >
                  Ticket Title
                </Label>
                <Input
                  id="title"
                  placeholder="e.g. Dhaka to Cox's Bazar Premium Express"
                  className="w-full bg-zinc-100/80 dark:bg-[#0b1d30]/80 border border-gray-300 dark:border-[#1B3C61] rounded-xl transition-colors focus-within:!border-[#67C090] text-sm font-semibold text-zinc-900 dark:text-zinc-100"
                  {...register("title", {
                    required: "Ticket title field is required",
                  })}
                />
                {errors.title && (
                  <p className="text-red-500 dark:text-red-400 text-[11px] font-bold tracking-wide uppercase mt-1.5 ml-1 select-none">
                    {errors.title.message}
                  </p>
                )}
              </motion.div>
              <motion.div
                variants={itemVariants}
                className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full"
              >
                <div>
                  <Label
                    htmlFor="from"
                    className="text-xs font-bold text-zinc-600 dark:text-zinc-400 mb-1.5 block select-none"
                  >
                    From (Departure Origin)
                  </Label>
                  <Input
                    id="from"
                    placeholder="e.g. Dhaka"
                    className="w-full bg-zinc-100/80 dark:bg-[#0b1d30]/80 border border-gray-300 dark:border-[#1B3C61] rounded-xl transition-colors focus-within:!border-[#67C090] text-sm font-semibold text-zinc-900 dark:text-zinc-100"
                    {...register("from", {
                      required: "Origin location is required",
                    })}
                  />
                  {errors.from && (
                    <p className="text-red-500 dark:text-red-400 text-[11px] font-bold tracking-wide uppercase mt-1.5 ml-1 select-none">
                      {errors.from.message}
                    </p>
                  )}
                </div>
                <div>
                  <Label
                    htmlFor="to"
                    className="text-xs font-bold text-zinc-600 dark:text-zinc-400 mb-1.5 block select-none"
                  >
                    To (Destination Target)
                  </Label>
                  <Input
                    id="to"
                    placeholder="e.g. Cox's Bazar"
                    className="w-full bg-zinc-100/80 dark:bg-[#0b1d30]/80 border border-gray-300 dark:border-[#1B3C61] rounded-xl transition-colors focus-within:!border-[#67C090] text-sm font-semibold text-zinc-900 dark:text-zinc-100"
                    {...register("to", {
                      required: "Destination target is required",
                    })}
                  />
                  {errors.to && (
                    <p className="text-red-500 dark:text-red-400 text-[11px] font-bold tracking-wide uppercase mt-1.5 ml-1 select-none">
                      {errors.to.message}
                    </p>
                  )}
                </div>
              </motion.div>
              <motion.div
                variants={itemVariants}
                className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full"
              >
                <div>
                  <Label
                    htmlFor="transportType"
                    className="text-xs font-bold text-zinc-600 dark:text-zinc-400 mb-1.5 block select-none"
                  >
                    Transport Type
                  </Label>
                  <div>
                    <input
                      type="hidden"
                      {...register("transportType", {
                        required: "Select your transport vessel archetype",
                      })}
                      value={selectedTransport}
                    />
                    <div className="relative w-full">
                      <button
                        type="button"
                        onClick={() => setTransportOpen((prev) => !prev)}
                        className="w-full h-10 bg-zinc-100/80  dark:bg-[#0b1d30]/80 border border-gray-300 dark:border-[#1B3C61] rounded-xl px-3 pr-8 text-sm font-semibold text-left focus:outline-none focus:border-[#67C090] focus:ring-1 focus:ring-[#67C090] transition-colors cursor-pointer text-zinc-900 dark:text-zinc-100"
                      >
                        {selectedTransport || "Select Type"}
                      </button>
                      <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-zinc-400 text-[8px]">
                        {transportOpen ? "▲" : "▼"}
                      </div>
                      {transportOpen && (
                        <div className="absolute z-50 top-[calc(100%+4px)] left-0 w-full bg-white dark:bg-[#0b1d30] border border-gray-300 dark:border-[#1B3C61] rounded-xl overflow-hidden shadow-lg">
                          {TRANSPORT_TYPES.map((type) => (
                            <div
                              key={type}
                              onClick={() => {
                                setSelectedTransport(type);
                                setValue("transportType", type);
                                setTransportOpen(false);
                              }}
                              className={`px-3 py-2.5 text-sm font-semibold cursor-pointer transition-colors duration-150
              ${
                selectedTransport === type
                  ? "bg-[#67C090]/10 text-[#124170] dark:text-[#67C090]"
                  : "text-zinc-700 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-white/5"
              }`}
                            >
                              {type}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                    {errors.transportType && (
                      <p className="text-red-500 dark:text-red-400 text-[11px] font-bold tracking-wide uppercase mt-1.5 ml-1 select-none">
                        {errors.transportType.message}
                      </p>
                    )}
                  </div>
                </div>
                <div>
                  <Label
                    htmlFor="departureDateTime"
                    className="text-xs font-bold text-zinc-600 dark:text-zinc-400 mb-1.5 block select-none"
                  >
                    Departure Date & Time
                  </Label>
                  <Input
                    id="departureDateTime"
                    type="datetime-local"
                    className="w-full bg-zinc-100/80 dark:bg-[#0b1d30]/80 border border-gray-300 dark:border-[#1B3C61] rounded-xl transition-colors focus-within:!border-[#67C090] text-sm font-semibold text-zinc-900 dark:text-zinc-100"
                    {...register("departureDateTime", {
                      required: "Specify precise departure timeline",
                    })}
                  />
                  {errors.departureDateTime && (
                    <p className="text-red-500 dark:text-red-400 text-[11px] font-bold tracking-wide uppercase mt-1.5 ml-1 select-none">
                      {errors.departureDateTime.message}
                    </p>
                  )}
                </div>
              </motion.div>
              <motion.div
                variants={itemVariants}
                className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full"
              >
                <div>
                  <Label
                    htmlFor="price"
                    className="text-xs font-bold text-zinc-600 dark:text-zinc-400 mb-1.5 block select-none"
                  >
                    Price (per unit)
                  </Label>
                  <Input
                    id="price"
                    type="number"
                    placeholder="0.00"
                    className="w-full bg-zinc-100/80 dark:bg-[#0b1d30]/80 border border-gray-300 dark:border-[#1B3C61] rounded-xl transition-colors focus-within:!border-[#67C090] text-sm font-semibold text-zinc-900 dark:text-zinc-100"
                    {...register("price", {
                      required: "Unit price valuation is required",
                      min: {
                        value: 1,
                        message: "Price allocation must be positive",
                      },
                    })}
                  />
                  {errors.price && (
                    <p className="text-red-500 dark:text-red-400 text-[11px] font-bold tracking-wide uppercase mt-1.5 ml-1 select-none">
                      {errors.price.message}
                    </p>
                  )}
                </div>
                <div>
                  <Label
                    htmlFor="quantity"
                    className="text-xs font-bold text-zinc-600 dark:text-zinc-400 mb-1.5 block select-none"
                  >
                    Ticket Quantity
                  </Label>
                  <Input
                    id="quantity"
                    type="number"
                    placeholder="e.g. 40"
                    className="w-full bg-zinc-100/80 dark:bg-[#0b1d30]/80 border border-gray-300 dark:border-[#1B3C61] rounded-xl transition-colors focus-within:!border-[#67C090] text-sm font-semibold text-zinc-900 dark:text-zinc-100"
                    {...register("quantity", {
                      required: "Inventory batch size quantity required",
                      min: {
                        value: 1,
                        message: "Must allocate at least 1 ticket unit",
                      },
                    })}
                  />
                  {errors.quantity && (
                    <p className="text-red-500 dark:text-red-400 text-[11px] font-bold tracking-wide uppercase mt-1.5 ml-1 select-none">
                      {errors.quantity.message}
                    </p>
                  )}
                </div>
              </motion.div>
              <motion.div
                variants={itemVariants}
                className="w-full border-t border-b border-zinc-200/60 dark:border-[#1a3d61]/80 py-6"
              >
                <Label className="text-sm font-black uppercase tracking-wider text-[#124170] dark:text-[#AAFFC7] block mb-4 select-none">
                  Included Amenities & Perks
                </Label>
                <div className="flex flex-wrap gap-3 mt-2">
                  {AVAILABLE_PERKS.map((perk) => {
                    const isChecked = selectedPerks.includes(perk);
                    return (
                      <label
                        key={perk}
                        className={`flex items-center gap-2 px-4 py-2.5 rounded-full border cursor-pointer transition-all text-xs font-black uppercase tracking-widest select-none ${
                          isChecked
                            ? "border-[#67C090] bg-[#67C090]/10 text-[#124170] dark:text-[#AAFFC7]"
                            : "border-zinc-200/60 dark:border-[#1a3d61] bg-zinc-50 dark:bg-[#0b1d30]/50 text-zinc-500 dark:text-zinc-400 hover:border-zinc-300 dark:hover:border-[#1a3d61]"
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
                          className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center shrink-0 transition-all ${
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
              </motion.div>
              <motion.div variants={itemVariants} className="w-full py-2">
                <Label
                  htmlFor="ticketImage"
                  className="text-xs font-bold text-zinc-600 dark:text-zinc-400 mb-1.5 block select-none"
                >
                  Ticket Promotional Display Banner Image
                </Label>
                <Input
                  id="ticketImage"
                  type="file"
                  accept="image/*"
                  className="w-full h-15 bg-zinc-100/80 dark:bg-[#0b1d30]/80 border border-gray-300 dark:border-[#1B3C61] rounded-xl focus-within:!border-[#67C090] text-zinc-600 dark:text-zinc-300 font-semibold file:text-[#124170] dark:file:text-[#AAFFC7] file:font-black file:uppercase file:text-xs file:tracking-wider file:bg-[#124170]/10 dark:file:bg-[#AAFFC7]/10 file:border-0 file:rounded-xl file:px-4 file:h-8 file:mt-1.5 file:cursor-pointer transition-colors"
                  {...register("ticketImage", {
                    required:
                      "Display target promotional graphic asset required",
                  })}
                />
                {errors.ticketImage && (
                  <p className="text-red-500 dark:text-red-400 text-[11px] font-bold tracking-wide uppercase mt-1.5 ml-1 select-none">
                    {errors.ticketImage.message}
                  </p>
                )}
              </motion.div>
              <motion.div
                variants={itemVariants}
                className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full bg-zinc-50 dark:bg-[#124170]/10 p-6 rounded-2xl border border-zinc-200/60 dark:border-[#1a3d61]/60 mt-4 select-none"
              >
                <div>
                  <Label className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 tracking-wide uppercase block mb-1">
                    Vendor Name (Readonly)
                  </Label>
                  <input
                    value={session?.user?.name || "Authenticating..."}
                    readOnly
                    className="w-full h-10 px-4 rounded-xl bg-zinc-200/50 dark:bg-[#0b1d30]/60 border border-gray-300 dark:border-[#1B3C61] text-[#124170] dark:text-zinc-300 text-sm font-semibold opacity-70 cursor-not-allowed focus:outline-none transition-colors"
                  />
                </div>
                <div>
                  <Label className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 tracking-wide uppercase block mb-1">
                    Vendor Email Profile (Readonly)
                  </Label>
                  <input
                    value={session?.user?.email || "Authenticating..."}
                    readOnly
                    className="w-full h-10 px-4 rounded-xl bg-zinc-200/50 dark:bg-[#0b1d30]/60 border border-gray-300 dark:border-[#1B3C61] text-[#124170] dark:text-zinc-300 text-sm font-semibold opacity-70 cursor-not-allowed focus:outline-none transition-colors"
                  />
                </div>
              </motion.div>
              <motion.div
                variants={itemVariants}
                className="flex items-center justify-end pt-6 border-t border-zinc-200/60 dark:border-[#1a3d61]/60 mt-4"
              >
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full sm:w-auto px-10 h-12 inline-flex items-center justify-center text-xs font-bold tracking-wider uppercase bg-[#124170] dark:bg-[#67C090] text-white dark:text-[#124170] rounded-full shadow-md dark:shadow-none transition-all duration-300 hover:opacity-90 active:scale-[0.985] select-none"
                  radius="full"
                >
                  {isSubmitting ? "Creating System Node..." : "Add Ticket"}
                </Button>
              </motion.div>
            </Form>
          </div>
        </Card>
      </motion.div>
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-[#AAFFC7]/10 dark:bg-[#67C090]/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-[#67C090]/10 dark:bg-[#AAFFC7]/5 rounded-full blur-3xl pointer-events-none" />
    </div>
  );
};

export default AddTicketPage;
