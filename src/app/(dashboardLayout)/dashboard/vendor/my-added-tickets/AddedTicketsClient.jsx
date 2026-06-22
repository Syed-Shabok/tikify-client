"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { VendorTicketCard } from "@/components/dashboard/VendorTicketCard";
import EditTicketModal from "@/components/dashboard/EditTicketModal";

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 100, damping: 15 },
  },
};

const fallbackVariants = {
  hidden: { opacity: 0, scale: 0.96 },
  show: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.4, ease: "easeOut" },
  },
};

const AddedTicketsClient = ({ tickets: initialTickets }) => {
  const [tickets, setTickets] = useState(initialTickets);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTicket, setEditingTicket] = useState(null);

  const handleEditClick = (ticket) => {
    setEditingTicket(ticket);
    setIsModalOpen(true);
  };

  // Update or refresh local UI state on success
  const handleTicketUpdated = (updatedTicketId, updatedData) => {
    setTickets((prev) =>
      prev.map((t) =>
        t._id === updatedTicketId ? { ...t, ...updatedData } : t,
      ),
    );
  };

  const handleTicketDeleted = (deletedId) => {
    setTickets((prev) => prev.filter((ticket) => ticket._id !== deletedId));
  };

  return (
    <div className="mt-8 relative z-10 max-w-7xl mx-auto">
      {tickets.length > 0 ? (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {tickets.map((ticket) => (
            <motion.div key={ticket._id} variants={itemVariants}>
              <VendorTicketCard
                ticket={ticket}
                onEditClick={() => handleEditClick(ticket)}
                onDeleteSuccess={handleTicketDeleted}
              />
            </motion.div>
          ))}
        </motion.div>
      ) : (
        /* Clean Empty fallback presentation state box */
        <motion.div
          variants={fallbackVariants}
          initial="hidden"
          animate="show"
          className="flex flex-col items-center justify-center text-center p-16 border border-zinc-200 dark:border-[#1a3d61] rounded-3xl bg-white/40 dark:bg-[#124170]/5 backdrop-blur-md mt-6 select-none h-[80vh]"
        >
          <p className="text-2xl font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">
            No Tickets Found
          </p>
          <p className="text-base font-semibold text-zinc-500 dark:text-zinc-400 mt-1">
            You haven't listed any transport tickets yet.
          </p>
        </motion.div>
      )}

      {/* TICKET EDIT MODAL */}
      <EditTicketModal
        isOpen={isModalOpen}
        onOpenChange={setIsModalOpen}
        editingTicket={editingTicket}
        onSuccess={handleTicketUpdated}
      />
    </div>
  );
};

export default AddedTicketsClient;
