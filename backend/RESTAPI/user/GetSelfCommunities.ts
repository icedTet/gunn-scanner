import { NextFunction, Request, Response, Express } from "express";
import { DisadusUser } from "../../Helpers/Types/RawDisadusTypes";
import { RESTHandler, RESTMethods } from "../../server";
import child_process from "child_process";
import { getUser, updateUser } from "../../Helpers/DisadusAPIClient/UserAPIs";
import { UserCleaners } from "../../Helpers/Cleaners/UserCleaners";
import {
  getUserCommunities,
  getUserCommunityMetaData,
} from "../../Helpers/DisadusAPIClient/CommunityAPIs";
export const GetUserSelf = {
  path: "/user/@me/communities",
  method: RESTMethods.GET,
  sendUser: true,
  run: async (req, res, next, user) => {
    if (!user) {
      if (next) {
        return await next();
      }
      res.status(404).send("User not found");
      return;
    }
    const communities = await getUserCommunityMetaData(user.id);
    res.status(200).json(communities);
  },
} as RESTHandler;
export default GetUserSelf;
