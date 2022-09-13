import { User } from "../../../types/UserTypes";

export const getUser = (userID: string) =>
  MongoDB?.db("UserData")
    .collection("users")
    .findOne({ userID }) as Promise<User | null>;
export const cleanUser = (user?: User | null) => {
  if (!user) return null;
  const { userID, firstName, lastName, role } = user;
  return { userID, firstName, lastName, role };
};
