import { Card, Button } from "@heroui/react";

import { getUserSession } from "@/lib/core/session";
import DashboardHeading from "@/components/dashboard/DashboardHeading";
import { getPassengerBookings } from "@/lib/api/bookings";
import BookingCard from "@/components/dashboard/BookingCard";

export default async function MyBookedTicketsPage() {
  const user = await getUserSession();

  const sessionEmail = user?.email;
  console.log("Email in passenger Dashboard: ", sessionEmail);
  const bookings = (await getPassengerBookings(sessionEmail)) || [];

  console.log("Bookings in passenger Dashboard: ", bookings);

  // const handleBookTicket = async () => {
  //   const paymentData = {
  //     paymentAmount:

  //     ticketPrice: ticketPrice.toFixed(2),
  //     eventId,
  //     eventTitle,
  //     quantity,
  //   };

  //   const res = await fetch("/api/checkout_sessions", {
  //     method: "POST",
  //     headers: {
  //       "Content-Type": "application/json",
  //     },
  //     body: JSON.stringify(paymentData),
  //   });
  //   const data = await res.json();
  //   // console.log(data);
  //   if (data?.url) {
  //     window.location.href = data.url;
  //   }
  // };

  return (
    <div className="p-6">
      <DashboardHeading
        title="My Booked Tickets"
        description="Track your pending requests and complete payments for approved travels."
      />

      {bookings.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          {bookings.map((booking) => (
            <BookingCard key={booking?._id} booking={booking} />
          ))}
        </div>
      ) : (
        <div className="mt-12 flex flex-col items-center justify-center p-12 border border-dashed border-[#1a3d61] rounded-3xl bg-[#124170]/5">
          <p className="text-zinc-400 font-bold uppercase tracking-widest">
            No bookings found
          </p>
        </div>
      )}
    </div>
  );
}
