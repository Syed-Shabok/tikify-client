//src > components > dashboard >BookingCard.jsx >BookingCard >

"use client";

import { Button, Card } from "@heroui/react";
import React from "react";
import { FaCheckCircle, FaClock, FaTimesCircle } from "react-icons/fa";

const BookingCard = ({ booking }) => {
  const handleMakePayment = async () => {
    const paymentData = {
      paymentAmount: booking?.totalPrice,
      ticketId: booking?.ticketId,
      ticketTitle: booking?.ticketTitle,
      vendorName: booking?.vendorName,
      vendorEmail: booking?.vendorEmail,
      bookingId: booking?._id,
      unitPrice: booking?.unitPrice,
      quantity: booking?.bookingQuantity,
      bookingQuantity: booking?.bookingQuantity,
      passengerName: booking?.passengerName,
      passengerEmail: booking?.passengerEmail,
    };

    const res = await fetch("/api/checkout_sessions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(paymentData),
    });
    const data = await res.json();
    console.log("handleMakePayment triggered");
    // console.log(data);
    if (data?.url) {
      window.location.href = data.url;
    }
  };

  return (
    <Card
      key={booking._id}
      className="bg-[#102226]/40 backdrop-blur-xl border border-[#1a3d61] p-5 flex flex-col justify-between h-full rounded-3xl shadow-xl"
    >
      <div>
        <div className="flex justify-between items-start mb-4">
          <h3 className="font-bold text-white text-lg line-clamp-1">
            {booking.ticketTitle}
          </h3>
          <StatusBadge status={booking.status} />
        </div>

        <div className="space-y-2 text-sm text-zinc-400 mb-6 border-l-2 border-[#00ADB5]/30 pl-3">
          <p>
            <span className="text-zinc-500 font-semibold">Route:</span>{" "}
            {booking.from} → {booking.to}
          </p>
          <p>
            <span className="text-zinc-500 font-semibold">Departure:</span>{" "}
            {new Date(booking.departureDateTime).toLocaleString()}
          </p>
          <p>
            <span className="text-zinc-500 font-semibold">Seats:</span>{" "}
            {booking.bookingQuantity}
          </p>
        </div>
      </div>

      <div className="pt-4 border-t border-white/5 flex items-center justify-between">
        <div>
          <p className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold">
            Total
          </p>
          <p className="text-xl font-black text-[#AAFFC7]">
            ৳{booking.totalPrice}
          </p>
        </div>

        {/* Only show Pay Now if Vendor Accepted */}
        {booking.status === "accepted" && (
          <Button
            onPress={handleMakePayment}
            className="bg-[#00ADB5] hover:bg-[#009299] text-[#091624] font-black uppercase text-xs px-6 rounded-xl"
          >
            Pay Now
          </Button>
        )}
      </div>
    </Card>
  );
};

export default BookingCard;

// Helper component for uniform status styling
function StatusBadge({ status }) {
  if (status === "pending")
    return (
      <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 text-amber-500 border border-amber-500/20 text-[10px] font-black uppercase tracking-wider">
        <FaClock /> Pending
      </span>
    );
  if (status === "accepted")
    return (
      <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#AAFFC7]/10 text-[#AAFFC7] border border-[#AAFFC7]/20 text-[10px] font-black uppercase tracking-wider">
        <FaCheckCircle /> Accepted
      </span>
    );
  if (status === "rejected")
    return (
      <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-500/10 text-red-500 border border-red-500/20 text-[10px] font-black uppercase tracking-wider">
        <FaTimesCircle /> Rejected
      </span>
    );
  if (status === "paid")
    return (
      <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#00ADB5]/10 text-[#00ADB5] border border-[#00ADB5]/20 text-[10px] font-black uppercase tracking-wider">
        <FaCheckCircle /> Paid
      </span>
    );
  return null;
}
