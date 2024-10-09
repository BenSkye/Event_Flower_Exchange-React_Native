import { Types } from "mongoose";

export const roundToStartOfDay = (date: Date) => {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

export const convertToObjectID = (id: string) => {
  return new Types.ObjectId(id)
}

