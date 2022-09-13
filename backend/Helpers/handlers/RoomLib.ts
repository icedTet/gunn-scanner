import { Room } from "../../../types/RoomTypes";
export const getRoom = (roomID: string) =>
  MongoDB?.db("Attendance")
    .collection("rooms")
    .findOne({ roomID }) as Promise<Room | null>;
