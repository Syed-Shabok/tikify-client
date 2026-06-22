import { getUserMadeTickets } from "@/lib/api/tickets";
import { getUserSession } from "@/lib/core/session";
import DashboardHeading from "@/components/dashboard/DashboardHeading";
import AddedTicketsClient from "./AddedTicketsClient";

const AddedTicketsPage = async () => {
  const user = await getUserSession();
  const tickets = (await getUserMadeTickets(user?.email)) || [];

  // const tickets = [];

  return (
    <div className="min-h-screen w-full bg-slate-50 dark:bg-[#091624] px-6 py-12 relative overflow-hidden transition-colors duration-300">
      {/* Structural Dashboard Banner Info segment */}
      <DashboardHeading
        title="My Added Tickets"
        description={`Managing system inventory catalog logs for profile: ${user?.email || "Unknown Vendor"}`}
      />

      {/* Hand off data to the client-side animation controller */}
      <AddedTicketsClient tickets={tickets} />

      {/* Matching Ambient UI Accents */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-[#AAFFC7]/10 dark:bg-[#67C090]/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-[#67C090]/10 dark:bg-[#AAFFC7]/5 rounded-full blur-3xl pointer-events-none" />
    </div>
  );
};

export default AddedTicketsPage;
