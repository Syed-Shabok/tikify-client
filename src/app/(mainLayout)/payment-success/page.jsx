import { baseUrl } from "@/lib/core/server";
import { stripe } from "@/lib/stripe";
import { Button, Card, CardFooter, CardHeader } from "@heroui/react";
import Link from "next/link";
import { FaArrowRight, FaCheckCircle, FaTicketAlt } from "react-icons/fa";

export default async function PaymentSuccessfulPage({ searchParams }) {
  const { session_id } = await searchParams;

  if (!session_id)
    throw new Error("Please provide a valid session_id (`cs_test_...`)");

  const session = await stripe.checkout.sessions.retrieve(session_id, {
    expand: ["line_items", "payment_intent"],
  });

  const paymentData = {
    amount: session?.metadata?.amount,
    ticketId: session?.metadata?.ticketId,
    ticketTitle: session?.metadata?.ticketTitle,
    quantity: session?.metadata?.quantity,
    email: session?.metadata?.email,
    bookingId: session?.metadata?.bookingId,
    paymentType: "booking",
    transactionId: session?.payment_intent?.id,
    paymentStatus: session?.payment_status,
  };

  // Process the payment on your backend
  const res = await fetch(`${baseUrl}/api/bookings/payments`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(paymentData),
  });
  const data = await res.json();

  return (
    <div className="min-h-[85vh] flex items-center justify-center bg-[#091624] px-6 py-12 relative overflow-hidden transition-colors duration-300">
      {/* Shared Aesthetic Accent Orbs */}
      <div className="absolute top-1/4 -left-20 w-96 h-96 bg-[#00ADB5]/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-[#AAFFC7]/10 rounded-full blur-[100px] pointer-events-none" />

      <Card className="w-full max-w-lg overflow-hidden bg-white/5 dark:bg-[#124170]/20 backdrop-blur-2xl rounded-3xl border border-zinc-200/60 dark:border-[#1a3d61] shadow-2xl p-6 md:p-8 z-10">
        <CardHeader className="flex flex-col gap-2 items-center pb-8 text-center border-b border-[#1a3d61]/50">
          <div className="p-4 bg-[#AAFFC7]/10 rounded-2xl text-[#AAFFC7] border border-[#AAFFC7]/20 mb-4 shadow-[0_0_30px_-5px_rgba(170,255,199,0.3)]">
            <FaCheckCircle size={52} />
          </div>
          <h1 className="text-3xl md:text-4xl font-black tracking-tight text-white">
            Payment Confirmed
          </h1>
          <p className="text-zinc-400 font-medium text-sm mt-2 max-w-[80%] mx-auto">
            Your transaction was successful. Your seats are officially reserved.
          </p>
        </CardHeader>

        <div className="mt-8 bg-[#0b1d30]/60 p-6 rounded-2xl border border-[#1a3d61]">
          <div className="space-y-5">
            {/* Ticket Title */}
            <div className="flex gap-3 items-start border-b border-[#1a3d61]/50 pb-4">
              <div className="w-10 h-10 rounded-xl bg-[#102226] flex items-center justify-center text-[#00ADB5] shrink-0">
                <FaTicketAlt size={18} />
              </div>
              <div>
                <p className="text-[10px] uppercase font-bold text-zinc-500 tracking-widest mb-1">
                  Ticket Details
                </p>
                <h3 className="text-white font-bold text-base leading-snug">
                  {session?.metadata?.ticketTitle || "Premium Route Ticket"}
                </h3>
              </div>
            </div>

            {/* Meta Data Grid */}
            <div className="grid gap-4 pt-2">
              <div className="flex justify-between items-center">
                <span className="text-[11px] uppercase tracking-wider font-bold text-zinc-500">
                  Attendee Email
                </span>
                <span className="text-sm text-zinc-200 font-semibold text-right">
                  {session?.customer_email}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-[11px] uppercase tracking-wider font-bold text-zinc-500">
                  Reserved Seats
                </span>
                <span className="text-sm text-white font-black bg-white/10 px-3 py-1 rounded-lg">
                  {session?.metadata?.quantity || 1} Ticket(s)
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-[11px] uppercase tracking-wider font-bold text-zinc-500">
                  Transaction ID
                </span>
                <span className="text-xs text-[#00ADB5] font-mono font-bold truncate max-w-[180px]">
                  {session?.payment_intent?.id}
                </span>
              </div>
            </div>
          </div>

          {/* Total Amount Footer */}
          <div className="mt-6 pt-5 border-t border-[#1a3d61] flex justify-between items-end">
            <span className="text-[11px] uppercase tracking-wider font-bold text-zinc-500">
              Total Amount Paid
            </span>
            <span className="text-2xl font-black text-[#AAFFC7]">
              ৳{Number(session?.metadata?.amount).toLocaleString()}
            </span>
          </div>
        </div>

        <CardFooter className="flex flex-col sm:flex-row gap-4 pt-8 justify-center px-0">
          <Link
            href="/dashboard/passenger/my-booked-tickets"
            className="w-full sm:w-1/2"
          >
            <Button
              className="w-full bg-[#00ADB5] hover:bg-[#009299] text-[#091624] font-black h-14 rounded-xl shadow-lg transition-all text-xs uppercase tracking-wider"
              endContent={<FaArrowRight className="ml-1" />}
            >
              View My Tickets
            </Button>
          </Link>
          <Link href="/all-tickets" className="w-full sm:w-1/2">
            <Button className="w-full bg-zinc-100/5 hover:bg-zinc-100/10 border border-zinc-200/20 text-zinc-200 font-bold h-14 rounded-xl transition-all text-xs uppercase tracking-wider">
              Browse More
            </Button>
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
