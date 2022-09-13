import { Socket } from "socket.io";
import { cleanUser, getUser } from "../../../Helpers/handlers/UserLib";
import { SocketHandler } from "../../SocketHandler";

export const SPGetUser = {
  event: "user.id",
  run: async (socket: Socket, _, self: string, userID: string) => {
    console.log("user.id", self, userID);
    socket.emit("userResponse", {
      user: await getUser(userID).then(cleanUser),
      id: userID,
    });
  },
} as SocketHandler;
export default SPGetUser;
