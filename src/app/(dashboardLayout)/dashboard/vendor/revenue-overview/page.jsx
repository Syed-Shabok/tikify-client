import DashboardHeading from "@/components/dashboard/DashboardHeading";
import { getUserSession } from "@/lib/core/session";
import { getVendorStats } from "@/lib/api/vendor";
import RevenueClient from "./RevenueClient";

export default async function RevenueOverviewPage() {
  const user = await getUserSession();

  let stats = await getVendorStats(user?.email);

  // Fallback structure if API fails or user has no sales yet
  if (!stats || stats.error) {
    stats = {
      totalTicketsAdded: 0,
      totalTicketsSold: 0,
      totalRevenue: 0,
      chartData: [],
    };
  }

  return (
    <div className="p-6 relative overflow-hidden min-h-screen">
      {/* Dark Glassmorphism Ambient Orbs */}
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[#00ADB5]/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#AAFFC7]/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative z-10">
        <DashboardHeading
          title="Revenue Overview"
          description="Track your ticket sales, overall platform revenue, and performance metrics."
        />

        <RevenueClient stats={stats} />
      </div>
    </div>
  );
}
