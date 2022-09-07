import { Socket } from "socket.io";
import { UserCleaners } from "../../../Helpers/Cleaners/UserCleaners";
import { getCoursesForUser } from "../../../Helpers/DisadusAPIClient/CommunityCourseAPIs";
import { getUser } from "../../../Helpers/DisadusAPIClient/UserAPIs";
import { DisadusUser } from "../../../Helpers/Types/RawDisadusTypes";
import { SocketHandler } from "../../SocketHandler";
export const SPGetCourses = {
  event: "user.@self.enrolled",
  run: async (socket: Socket, _, userID: string) => {
    const courses = await getCoursesForUser(userID);
    socket.emit("coursesEnrolledResponse", {
      courses,
      id: userID,
    });
  },
} as SocketHandler;
export default SPGetCourses;
