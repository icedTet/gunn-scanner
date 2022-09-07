import { Socket } from "socket.io";
import { UserCleaners } from "../../../Helpers/Cleaners/UserCleaners";
import { getUser } from "../../../Helpers/DisadusAPIClient/UserAPIs";
import { DisadusUser } from "../../../Helpers/Types/RawDisadusTypes";
import { SocketHandler } from "../../SocketHandler";
export const SPGetUser = {
  event: "user.@self",
  run: async (socket: Socket, _, userID: string) => {
    socket.emit("selfResponse", {
      user: UserCleaners.CleanUser((await getUser(userID)) as DisadusUser),
      // id: userID,
    });
  },
} as SocketHandler;
export default SPGetUser;
