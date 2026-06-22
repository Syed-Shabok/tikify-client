import { updateEvent } from "@/lib/api/events/actions";
import { Button, Form, Input, Label, Modal, TextArea } from "@heroui/react";
import { useForm } from "react-hook-form";
import { FaImage } from "react-icons/fa";
const CATEGORIES = [
  "Music",
  "Tech",
  "Sports",
  "Arts",
  "Business",
  "Food",
  "Other",
];

const LOCATIONS = [
  "New York",
  "San Francisco",
  "London",
  "Dhaka",
  "Tokyo",
  "Berlin",
  "Online",
];
const EditEventModal = ({ isModalOpen, setIsModalOpen, editingEvent }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    // console.log(data?.banner, "data.banner");

    delete data?.banner;
    const updateData = {
      ...data,
    };
    if (data?.banner) {
      const imageFile = data.banner[0];
      const imageUrl = await uploadImage(imageFile);
      updateData.banner = imageUrl;
    }

    const result = await updateEvent(updateData, editingEvent?._id);

    if (result.modifiedCount) {
      toast.success("Event Updated successfully...");
      redirect("/events");
    }
  };

  return (
    <Modal isOpen={isModalOpen} onOpenChange={setIsModalOpen}>
      <Modal.Backdrop>
        <Modal.Container>
          <Modal.Dialog className="dark text-white bg-slate-950 border border-white/10 p-6 rounded-2xl w-full max-w-lg mx-auto">
            <div className="p-6">
              <Form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                {/* Title */}
                <div>
                  <Label className="text-xs font-bold text-zinc-600 dark:text-zinc-400 mb-1.5 block">
                    Ticket Title
                  </Label>
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

                {/* From / To */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-xs font-bold text-zinc-600 dark:text-zinc-400 mb-1.5 block">
                      From
                    </Label>
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
                    <Label className="text-xs font-bold text-zinc-600 dark:text-zinc-400 mb-1.5 block">
                      To
                    </Label>
                    <input
                      defaultValue={editingTicket?.to}
                      placeholder="e.g. Cox's Bazar"
                      className={inputClass}
                      {...register("to", {
                        required: "Destination is required",
                      })}
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
                    <Label className="text-xs font-bold text-zinc-600 dark:text-zinc-400 mb-1.5 block">
                      Transport Type
                    </Label>
                    <select
                      defaultValue={editingTicket?.transportType}
                      className={`${inputClass} cursor-pointer appearance-none`}
                      {...register("transportType", {
                        required: "Transport type required",
                      })}
                    >
                      <option
                        value=""
                        disabled
                        className="bg-white dark:bg-[#091624]"
                      >
                        Select Type
                      </option>
                      {TRANSPORT_TYPES.map((type) => (
                        <option
                          key={type}
                          value={type}
                          className="bg-white dark:bg-[#091624]"
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
                    <Label className="text-xs font-bold text-zinc-600 dark:text-zinc-400 mb-1.5 block">
                      Departure Date & Time
                    </Label>
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
                    <Label className="text-xs font-bold text-zinc-600 dark:text-zinc-400 mb-1.5 block">
                      Price (per unit)
                    </Label>
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
                    <Label className="text-xs font-bold text-zinc-600 dark:text-zinc-400 mb-1.5 block">
                      Ticket Quantity
                    </Label>
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
                  <Label className="text-xs font-bold text-zinc-600 dark:text-zinc-400 mb-3 block">
                    Included Amenities & Perks
                  </Label>
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
                    {loading ? "Saving..." : "Save Changes"}
                  </Button>
                </div>
              </Form>
            </div>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal>
  );
};

export default EditEventModal;
