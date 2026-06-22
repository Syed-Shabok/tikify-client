"use client";

import { deleteTickets } from "@/lib/actions/tickets";
import { AlertDialog, Button } from "@heroui/react";

import toast from "react-hot-toast";
import { FaTrash } from "react-icons/fa";

export function DeleteAlertButton({ ticket, isRejected, onDeleteSuccess }) {
  const handleDelete = async () => {
    // console.log("Ticket ID:", ticket?._id);

    const res = await deleteTickets(ticket?._id);
    // console.log("delete triggered: ", res);

    if (res?.deletedCount > 0) {
      toast.success("Tickets Deleted Successfully.");

      onDeleteSuccess?.(ticket._id);
    }
  };

  return (
    <AlertDialog>
      <Button
        size="sm"
        disabled={isRejected}
        className="w-full font-bold text-xs uppercase tracking-wider rounded-xl transition-all bg-red-500/10 text-red-500 hover:bg-red-500/20 border border-red-500/20"
      >
        <FaTrash className="mr-1" /> Delete
      </Button>

      <AlertDialog.Backdrop>
        <AlertDialog.Container>
          <AlertDialog.Dialog className="sm:max-w-[400px]">
            <AlertDialog.Header>
              <AlertDialog.Heading>
                Delete ticket permanently?
              </AlertDialog.Heading>
            </AlertDialog.Header>

            <AlertDialog.Body>This action cannot be undone.</AlertDialog.Body>

            <AlertDialog.Footer>
              <Button slot="close" variant="tertiary">
                Cancel
              </Button>

              <Button slot="close" variant="danger" onPress={handleDelete}>
                Delete
              </Button>
            </AlertDialog.Footer>
          </AlertDialog.Dialog>
        </AlertDialog.Container>
      </AlertDialog.Backdrop>
    </AlertDialog>
  );
}
