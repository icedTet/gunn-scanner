import { Socket } from "socket.io";
import { UserCleaners } from "../../../Helpers/Cleaners/UserCleaners";
import { getUserByUsername } from "../../../Helpers/DisadusAPIClient/UserAPIs";
import { DisadusUser } from "../../../Helpers/Types/RawDisadusTypes";
import { SocketHandler } from "../../SocketHandler";

export const SPGetUserByUsername = {
  event: "user.username",
  run: async (socket: Socket, _, username: string) => {
    socket.emit("getUserByUsername", {
      user: UserCleaners.CleanPublicUser(
        (await getUserByUsername(username)) as DisadusUser
      ),
      username,
    });
  },
} as SocketHandler;
export default SPGetUserByUsername;
