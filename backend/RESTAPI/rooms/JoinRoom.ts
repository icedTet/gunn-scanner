import { NextFunction, Request, Response, Express } from "express";
import { RESTHandler, RESTMethods } from "../../server";
import child_process from "child_process";
export const GetUserSelf = {
  path: "/rooms/@me/",
  method: RESTMethods.POST,
  sendUser: true,
  run: async (req, res, next, user) => {
    if (!user) {
      if (next) {
        return await next();
      }
      res.status(404).send("User not found");
      return;
    }
    res.status(200).json(user)
  },
} as RESTHandler;
export default GetUserSelf;
