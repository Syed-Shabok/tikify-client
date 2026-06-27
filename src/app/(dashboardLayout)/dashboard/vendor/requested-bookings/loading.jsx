import DashboardHeading from "@/components/dashboard/DashboardHeading";

const RequestedBookingsLoadingPage = () => {
  // Array to simulate 5 rows of incoming requests
  const skeletonRows = [...Array(5)];

  return (
    <div className="min-h-screen w-full bg-slate-50 dark:bg-[#091624] px-6 py-12 relative overflow-hidden transition-colors duration-300">
      <DashboardHeading
        title="Requested Bookings"
        description="Fetching reservation data..."
      />

      <div className="relative z-10 mx-auto w-full lg:px-10">
        <div className="mt-8 overflow-hidden rounded-3xl border border-zinc-200/60 dark:border-[#1a3d61] bg-white/70 dark:bg-[#124170]/20 backdrop-blur-xl shadow-2xl animate-pulse">
          {/* Responsive Table Wrapper */}
          <table className="w-full text-left block md:table">
            {/* Desktop Header */}
            <thead className="hidden md:table-header-group bg-zinc-100/80 dark:bg-[#0b1d30]/80 border-b border-zinc-200/60 dark:border-[#1a3d61]">
              <tr>
                <th className="px-6 py-5">
                  <div className="h-3 w-12 bg-zinc-200 dark:bg-[#1a3d61]/60 rounded-full"></div>
                </th>
                <th className="px-6 py-5">
                  <div className="h-3 w-24 bg-zinc-200 dark:bg-[#1a3d61]/60 rounded-full"></div>
                </th>
                <th className="px-6 py-5">
                  <div className="h-3 w-20 bg-zinc-200 dark:bg-[#1a3d61]/60 rounded-full"></div>
                </th>
                <th className="px-6 py-5">
                  <div className="h-3 w-16 mx-auto bg-zinc-200 dark:bg-[#1a3d61]/60 rounded-full"></div>
                </th>
              </tr>
            </thead>

            {/* Table Body */}
            <tbody className="block md:table-row-group divide-y divide-zinc-200/60 dark:divide-[#1a3d61]/50">
              {skeletonRows.map((_, i) => (
                <tr key={i} className="block md:table-row p-4 md:p-0">
                  {/* User Column */}
                  <td className="block md:table-cell px-2 md:px-6 py-3 md:py-5">
                    <div className="flex flex-col md:block">
                      <div className="md:hidden h-2 w-10 bg-zinc-200 dark:bg-[#1a3d61]/40 rounded-full mb-2.5"></div>
                      <div className="h-4 w-32 sm:w-48 bg-zinc-200 dark:bg-[#1a3d61]/60 rounded-md"></div>
                    </div>
                  </td>

                  {/* Ticket Details Column */}
                  <td className="block md:table-cell px-2 md:px-6 py-3 md:py-5">
                    <div className="flex flex-col md:block">
                      <div className="md:hidden h-2 w-20 bg-zinc-200 dark:bg-[#1a3d61]/40 rounded-full mb-2.5"></div>
                      <div className="h-4 w-40 sm:w-56 bg-zinc-200 dark:bg-[#1a3d61]/60 rounded-md mb-2"></div>
                      <div className="h-3 w-24 bg-zinc-200/70 dark:bg-[#1a3d61]/40 rounded-md"></div>
                    </div>
                  </td>

                  {/* Quantity & Price Column */}
                  <td className="block md:table-cell px-2 md:px-6 py-3 md:py-5">
                    <div className="flex items-center justify-between md:block">
                      <div className="md:hidden h-2 w-16 bg-zinc-200 dark:bg-[#1a3d61]/40 rounded-full"></div>
                      <div className="text-right md:text-left">
                        <div className="h-4 w-16 bg-zinc-200 dark:bg-[#1a3d61]/60 rounded-md mb-2 ml-auto md:ml-0"></div>
                        <div className="h-4 w-12 bg-zinc-200/70 dark:bg-[#1a3d61]/40 rounded-md ml-auto md:ml-0"></div>
                      </div>
                    </div>
                  </td>

                  {/* Actions Column */}
                  <td className="block md:table-cell px-2 md:px-6 pt-4 pb-2 md:py-5 text-center border-t border-dashed md:border-none border-zinc-200/60 dark:border-[#1a3d61]/50 mt-3 md:mt-0">
                    <div className="flex items-center md:justify-center justify-start gap-2">
                      <div className="h-8 w-full md:w-16 bg-zinc-200 dark:bg-[#1a3d61]/60 rounded-xl"></div>
                      <div className="h-8 w-full md:w-16 bg-zinc-200 dark:bg-[#1a3d61]/60 rounded-xl"></div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Shared Ambient Theme Decorators */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-[#00ADB5]/10 dark:bg-[#124170]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-[#67C090]/10 dark:bg-[#AAFFC7]/5 rounded-full blur-3xl pointer-events-none" />
    </div>
  );
};

export default RequestedBookingsLoadingPage;
