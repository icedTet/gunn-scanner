import { NextFunction, Request, Response, Express } from "express";
import { RESTHandler, RESTMethods } from "../../server";
import child_process from "child_process";
export const GetUserSelf = {
  path: "/rooms/",
  method: RESTMethods.GET,
  sendUser: false,
  run: async (req, res, next, user) => {
    
    res.status(200).json(user);
  },
} as RESTHandler;
export default GetUserSelf;
