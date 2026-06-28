import { getTicketById } from "@/lib/api/tickets";
import TicketDetailsClient from "./TicketDetailsClient";

export default async function TicketDetailsPage({ params }) {
  const { id } = await params;
  const ticket = await getTicketById(id);

  if (!ticket || !ticket._id) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#091624] text-[#00ADB5]">
        <h1 className="text-2xl font-bold tracking-widest uppercase">
          Ticket Not Found
        </h1>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-slate-50 dark:bg-[rgb(9,22,36)] relative overflow-hidden transition-colors duration-300 py-24 px-6">
      {/* Background Accent Orbs for Dark Glassmorphism */}
      <div className="absolute top-20 left-10 w-[500px] h-[500px] bg-[#00ADB5]/10 dark:bg-[#124170]/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[400px] h-[400px] bg-[#102226]/40 dark:bg-[#452C20]/20 rounded-full blur-[100px] pointer-events-none" />

      {/* FIX: Changed max-w-5xl to max-w-7xl and added w-full */}
      <div className="relative z-10 max-w-7xl w-full mx-auto">
        <TicketDetailsClient ticket={ticket} />
      </div>
    </div>
  );
}
