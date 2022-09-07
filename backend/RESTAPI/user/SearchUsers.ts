import { NextFunction, Request, Response, Express } from "express";
import { DisadusUser } from "../../Helpers/Types/RawDisadusTypes";
import { RESTHandler, RESTMethods } from "../../server";
import child_process from "child_process";
import { getUser, updateUser } from "../../Helpers/DisadusAPIClient/UserAPIs";
import { UserCleaners } from "../../Helpers/Cleaners/UserCleaners";
export const SearchUsers = {
  path: "/users",
  method: RESTMethods.GET,
  sendUser: true,
  run: async (req, res, next, user) => {
    if (!user) {
      res.status(401).send("Unauthorized");
      return;
    }
    const query = req.query;
    const includes = query.includes as string;
    const limit = Number(query.limit as string) || 20;
    if (!includes) {
      res.status(400).send({
        success: false,
        error: "No includes provided",
      });
      return;
    }
    const users = (await MongoDB!
      .db("UserData")
      .collection("users")
      .find({
        username: {
          $regex: new RegExp(`${includes}`, "i"),
        },
      })
      .limit(limit)
      .toArray()) as unknown as DisadusUser[] | null;

    res.status(200).send(users?.map((x) => UserCleaners.CleanPublicUser(x)));
  },
} as RESTHandler;
export default SearchUsers;
