import { Room } from "../../../types/RoomTypes";
export const getRoom = (roomID: string) =>
  MongoDB?.db("Attendance")
    .collection("rooms")
    .findOne({ roomID }) as Promise<Room | null>;
export const searchRooms = (query: string) =>
  MongoDB?.db("Attendance")
    .collection("rooms")
    .find({ name: { $regex: query, $options: "i" } })
    .toArray() as unknown as Promise<Room[]>;
export const joinRoom = (roomID: string, studentID: string) =>
  MongoDB?.db("Attendance")
    .collection("rooms")
    .updateOne({ roomID }, { $push: { students: studentID } });
export const leaveRoom = (roomID: string, studentID: string) =>
  MongoDB?.db("Attendance")
    .collection("rooms")
    .updateOne({ roomID }, { $pull: { students: studentID } });
