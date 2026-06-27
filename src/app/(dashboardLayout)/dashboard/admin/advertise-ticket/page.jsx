import { getAllTicketsForAdmin } from "@/lib/api/admin";
import DashboardHeading from "@/components/dashboard/DashboardHeading";
import AdvertiseTicketsClient from "./AdvertiseTicketsClient";

export const metadata = {
  title: "Advertise Tickets | Admin",
  description: "Manage homepage featured tickets and marketing slots.",
};

export default async function AdvertiseTicketsPage() {
  let allTickets = await getAllTicketsForAdmin();

  if (!Array.isArray(allTickets)) {
    console.error("Failed to load tickets for advertisement page");
    allTickets = [];
  }

  // Marketing Rule: Only "approved" tickets are eligible for advertisement
  const eligibleTickets = allTickets.filter(
    (ticket) => ticket.status === "approved",
  );

  return (
    <div className="p-6 relative overflow-hidden min-h-screen">
      {/* Background Accent Orbs for Marketing Aesthetics */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-amber-500/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#00ADB5]/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="relative z-10">
        <DashboardHeading
          title="Marketing & Advertisements"
          description="Control which vendor routes are featured on the public homepage. Maximum 6 slots available."
        />

        <AdvertiseTicketsClient initialTickets={eligibleTickets} />
      </div>
    </div>
  );
}
