"use server";

import { protectedFetch } from "../core/server";

export const getVendorStats = async (email) => {
  if (!email) return null;
  return await protectedFetch(`/api/vendor/stats/${email}`);
};
