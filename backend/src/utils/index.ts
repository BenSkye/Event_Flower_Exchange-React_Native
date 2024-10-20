import { Types } from "mongoose";

export const roundToStartOfDay = (date: Date) => {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

export const convertToObjectID = (id: string) => {
  return new Types.ObjectId(id)
}

export const selectedObject = (select: string[]) => {
  return select.join(" ");
};

export const convertToISOString = (dateString: string) => {
  // Parse the input string
  const date = new Date(dateString);

  // Convert to ISO string
  const isoString = date.toISOString();

  // Replace 'Z' with '+00:00'
  return isoString.replace('Z', '+00:00');
}


export const convertToISO8601 = (dateString: string) => {
  // Parse the input string
  const date = new Date(dateString);

  // Get the ISO string
  const isoString = date.toISOString();

  // Replace 'Z' with the offset for Vietnam (+07:00)
  return isoString.replace('Z', '+07:00');
}