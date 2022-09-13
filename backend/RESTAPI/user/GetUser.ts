import { NextFunction, Request, Response, Express } from "express";
import { RESTHandler, RESTMethods } from "../../server";
import child_process from "child_process";
import { getUser } from "../../Helpers/handlers/UserLib";
export const GetUserSelf = {
  path: "/user/:userID/",
  method: RESTMethods.GET,
  sendUser: true,
  run: async (req, res, next, _) => {
    const { userID } = req.params;
    if (!userID) {
      if (next) {
        return await next();
      }
      res.status(404).send("User not found");
      return;
    }
    const user = await getUser(userID);
    if (!user) {
      if (next) {
        return await next();
      }
      res.status(404).send("User not found");
      return;
    }
    res.status(200).json(user);
  },
} as RESTHandler;
export default GetUserSelf;
