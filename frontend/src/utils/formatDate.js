import { format } from "date-fns";

export const formatDate = (isoString) => {
  return format(new Date(isoString), "MMMM d, yyyy");
};
