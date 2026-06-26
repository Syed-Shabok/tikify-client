"use server";

import { protectedFetch, serverFetch } from "../core/server";

export const getVendorBookings = async (email) => {
  return await protectedFetch(`/api/bookings/vendor/${email}`);
};

export const getPassengerBookings = async (email) => {
  return await serverFetch(`/api/bookings/passenger/${email}`);
};
