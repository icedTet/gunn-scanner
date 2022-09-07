import { DisadusUser } from "../../Helpers/Types/RawDisadusTypes";
import { RESTHandler, RESTMethods } from "../../server";
import {
  getUser,
  getUserByUsername,
  updateUser,
} from "../../Helpers/DisadusAPIClient/UserAPIs";
import { UserCleaners } from "../../Helpers/Cleaners/UserCleaners";
export const UpdateUser = {
  path: "/user/@me/update",
  method: RESTMethods.POST,
  sendUser: true,
  run: async (req, res, next, user) => {
    if (!user) {
      res.status(401).send("Unauthorized");
      return;
    }
    let data = req.body;
    //Declare all allowed properties
    let allowedUpdateProps = {
      theme: data.theme,
      openLinkStyle: data.openLinkStyle,
      bio: data.bio,
      firstName: data.firstName,
      lastName: data.lastName,
      username: data.username,
      devMode: data.devMode,
      pluginMode: data.pluginMode,
    } as {
      theme?: string;
      openLinkStyle?: string;
      bio?: string;
      firstName?: string;
      lastName?: string;
      username?: string;
      devMode?: boolean;
      pluginMode?: boolean;
    };
    //Delete all properties that are not used in allowedUpdateProps
    for (let prop in allowedUpdateProps) {
      if (
        !data.hasOwnProperty(prop) ||
        data[prop] === undefined ||
        data[prop] === null
      ) {
        //@ts-expect-error
        delete allowedUpdateProps[prop];
      }
    }
    if (allowedUpdateProps.username) {
      let otherUser = await getUserByUsername(allowedUpdateProps.username);
      if (otherUser && otherUser.id !== user.id) {
        res.status(400).send({
          success: false,
          error: "Username already taken",
        });
        return;
      }
      if (allowedUpdateProps.username.length < 3) {
        res.status(400).send("Username must be at least 3 characters");
        return;
      }
      if (allowedUpdateProps.username.length > 32) {
        res.status(400).send("Username must be less than 32 characters");
        return;
      }
      if (!/^[a-zA-Z0-9_\-]+$/.test(allowedUpdateProps.username)) {
        res.status(400).send({
          success: false,
          error:
            "Username can only contain letters, numbers, underscores and dashes",
        });
        return;
      }
    }
    //UserID from URL path
    const urlUserID = req.path.split("/")[2];
    if (
      urlUserID !== user.id &&
      urlUserID !== "@me" &&
      (user.staffLevel !== 5)
    ) {
      return res.status(403).send({
        success: false,
        error: "Forbidden",
      });
    }

    const userID = req.path.split("/");
    await updateUser(user.id, { $set: allowedUpdateProps });

    return res.status(200).send({
      success: true,
      message: "User updated",
      user: UserCleaners.CleanUser((await getUser(user.id)) as DisadusUser),
    });
  },
} as RESTHandler;
export default UpdateUser;
