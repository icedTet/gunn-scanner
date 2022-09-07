import { Socket } from "socket.io";
import { UserCleaners } from "../../../Helpers/Cleaners/UserCleaners";
import { getUser } from "../../../Helpers/DisadusAPIClient/UserAPIs";
import { DisadusUser } from "../../../Helpers/Types/RawDisadusTypes";
import { SocketHandler } from "../../SocketHandler";

export const SPGetUser = {
  event: "user.id",
  run: async (socket: Socket, _, self: string, userID: string) => {
    console.log("user.id", self, userID);
    socket.emit("userResponse", {
      user: UserCleaners.CleanPublicUser(
        (await getUser(userID)) as DisadusUser
      ),
      id: userID,
    });
  },
} as SocketHandler;
export default SPGetUser;
