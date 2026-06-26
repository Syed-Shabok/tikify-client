import { serverFetch } from "../core/server";

export const getVendorStats = async (email) => {
  if (!email) return null;
  return await serverFetch(`/api/vendor/stats/${email}`);
};
