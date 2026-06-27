"use client";

import { useState } from "react";
import { toggleTicketAdvertisement } from "@/lib/api/admin";
import toast from "react-hot-toast";
import { FaBullhorn, FaBan, FaRegStar, FaStar } from "react-icons/fa";

export default function AdvertiseTicketsClient({ initialTickets }) {
  const [tickets, setTickets] = useState(initialTickets);
  const [processingId, setProcessingId] = useState(null);

  // Calculate how many of the 6 slots are currently taken
  const advertisedCount = tickets.filter((t) => t.isAdvertised).length;
  const isMaxedOut = advertisedCount >= 6;

  const handleToggle = async (id, currentAdStatus) => {
    const newAdStatus = !currentAdStatus;

    // Client-side hard block to prevent unnecessary server requests
    if (newAdStatus && isMaxedOut) {
      toast.error("Maximum of 6 tickets are already featured.");
      return;
    }

    try {
      setProcessingId(id);
      const res = await toggleTicketAdvertisement(id, newAdStatus);

      if (res.error || res.message) {
        toast.error(res.message || res.error);
        return;
      }

      if (res.modifiedCount > 0 || res.matchedCount > 0) {
        toast.success(
          newAdStatus
            ? "Ticket successfully pushed to Homepage!"
            : "Advertisement removed.",
        );

        setTickets((prev) =>
          prev.map((ticket) =>
            ticket._id === id
              ? { ...ticket, isAdvertised: newAdStatus }
              : ticket,
          ),
        );
      } else {
        toast.error("Failed to update advertisement status.");
      }
    } catch (error) {
      console.error(error);
      toast.error("A network error occurred.");
    } finally {
      setProcessingId(null);
    }
  };

  if (tickets.length === 0) {
    return (
      <div className="mt-12 flex flex-col items-center justify-center p-16 border border-dashed border-[#1a3d61] rounded-3xl bg-[#124170]/5">
        <p className="text-zinc-400 font-bold uppercase tracking-widest text-center">
          No Approved Tickets Available
          <br />
          <span className="text-xs font-medium opacity-70 mt-2 block">
            Tickets must be approved before they can be advertised.
          </span>
        </p>
      </div>
    );
  }

  return (
    <div className="mt-8">
      {/* Simple Text Counter */}
      <div className="mb-4 flex items-center justify-between bg-[#102226]/40 p-4 rounded-xl border border-[#1a3d61]">
        <div className="flex items-center gap-2 text-sm font-bold text-white uppercase tracking-wider">
          <FaBullhorn className="text-amber-500" />
          <span>Marketing Slots</span>
        </div>
        <div className="text-sm font-black tracking-widest">
          <span className={isMaxedOut ? "text-red-500" : "text-[#00ADB5]"}>
            {advertisedCount}
          </span>
          <span className="text-zinc-500"> / 6</span>
        </div>
      </div>

      {/* Simple HTML Table */}
      <div className="w-full overflow-x-auto rounded-[2rem] border border-[#1a3d61] bg-[#102226]/40 backdrop-blur-xl shadow-2xl custom-scrollbar">
        <table className="w-full text-left text-sm text-zinc-300 min-w-[900px]">
          <thead className="bg-[#0b1d30]/90 text-[10px] uppercase font-black text-[#00ADB5] tracking-widest border-b border-[#1a3d61]">
            <tr>
              <th className="px-6 py-5 rounded-tl-[2rem]">Vendor</th>
              <th className="px-6 py-5">Ticket Info</th>
              <th className="px-6 py-5">Fare & Qty</th>
              <th className="px-6 py-5">Status</th>
              <th className="px-6 py-5 text-right rounded-tr-[2rem]">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#1a3d61]/50">
            {tickets.map((ticket) => (
              <tr
                key={ticket._id}
                className={`transition-colors ${
                  ticket.isAdvertised
                    ? "bg-amber-500/5 hover:bg-amber-500/10"
                    : "hover:bg-white/5"
                }`}
              >
                {/* Vendor Column */}
                <td className="px-6 py-5 align-middle">
                  <p className="font-bold text-white tracking-wide">
                    {ticket.vendorName}
                  </p>
                  <p className="text-xs text-zinc-500 mt-0.5">
                    {ticket.vendorEmail}
                  </p>
                </td>

                {/* Ticket Info Column */}
                <td className="px-6 py-5 align-middle">
                  <p className="font-bold text-white text-sm line-clamp-1 mb-1">
                    {ticket.title || ticket.ticketTitle}
                  </p>
                  <p className="text-xs text-zinc-400 font-medium">
                    {ticket.from} <span className="text-[#00ADB5]">→</span>{" "}
                    {ticket.to}
                  </p>
                  <span className="inline-block mt-2 text-[9px] font-black uppercase tracking-widest bg-[#124170]/40 border border-[#1a3d61] text-[#AAFFC7] px-2 py-0.5 rounded-md">
                    {ticket.transportType}
                  </span>
                </td>

                {/* Fare & Qty Column */}
                <td className="px-6 py-5 align-middle">
                  <p className="font-black text-[#AAFFC7]">৳{ticket.price}</p>
                  <p className="text-xs text-zinc-500 mt-0.5">
                    Qty:{" "}
                    <span className="text-zinc-300 font-bold">
                      {ticket.quantity}
                    </span>
                  </p>
                </td>

                {/* Ad Status Column */}
                <td className="px-6 py-5 align-middle">
                  {ticket.isAdvertised ? (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 text-[10px] font-black uppercase tracking-widest border rounded-full shadow-sm bg-amber-500/10 text-amber-500 border-amber-500/20">
                      <FaStar size={10} /> Featured
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 text-[10px] font-black uppercase tracking-widest border rounded-full shadow-sm bg-zinc-500/10 text-zinc-400 border-zinc-500/20">
                      Standard
                    </span>
                  )}
                </td>

                {/* Action Column */}
                <td className="px-6 py-5 align-middle text-right">
                  <button
                    onClick={() =>
                      handleToggle(ticket._id, ticket.isAdvertised)
                    }
                    disabled={
                      (isMaxedOut && !ticket.isAdvertised) ||
                      processingId !== null
                    }
                    className={`inline-flex items-center justify-center gap-2 h-9 px-4 text-[10px] font-black uppercase tracking-widest shadow-md transition-all rounded-lg disabled:opacity-50 disabled:cursor-not-allowed ${
                      ticket.isAdvertised
                        ? "bg-red-500/10 text-red-500 border border-red-500/30 hover:bg-red-500 hover:text-white"
                        : "bg-[#00ADB5]/10 text-[#00ADB5] border border-[#00ADB5]/30 hover:bg-[#00ADB5] hover:text-[#091624]"
                    }`}
                  >
                    {processingId === ticket._id ? (
                      <span className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin" />
                    ) : ticket.isAdvertised ? (
                      <FaBan size={10} />
                    ) : (
                      <FaRegStar size={10} />
                    )}
                    <span>
                      {ticket.isAdvertised ? "Remove Ad" : "Advertise"}
                    </span>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
