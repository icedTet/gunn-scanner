import { Socket } from "socket.io";
import { getUser } from "../../../Helpers/handlers/UserLib";
import { SocketHandler } from "../../SocketHandler";
export const SPGetUser = {
  event: "user.@self",
  run: async (socket: Socket, _, userID: string) => {
    socket.emit("selfResponse", {
      user: getUser(userID),
      // id: userID,
    });
  },
} as SocketHandler;
export default SPGetUser;
