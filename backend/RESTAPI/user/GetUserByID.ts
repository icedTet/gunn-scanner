import { NextFunction, Request, Response, Express } from "express";
import { DisadusUser } from "../../Helpers/Types/RawDisadusTypes";
import { RESTHandler, RESTMethods } from "../../server";
import child_process from "child_process";
import { getUser, updateUser } from "../../Helpers/DisadusAPIClient/UserAPIs";
import { UserCleaners } from "../../Helpers/Cleaners/UserCleaners";
export const GetUserByID = {
  path: "/user/:user/",
  method: RESTMethods.GET,
  sendUser: false,
  run: async (req, res, next, _) => {
    const user = await getUser(req.params.user);
    if (!user) {
      if (next) {
        return await next();
      }
      res.status(404).send("User not found");
      return;
    }
    res.status(200).json(UserCleaners.CleanPublicUser(user));
  },
} as RESTHandler;
export default GetUserByID;
