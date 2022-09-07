import { NextFunction, Request, Response } from "express";
import { getUser } from "./DisadusAPIClient/UserAPIs";
import { DisadusUser } from "./Types/RawDisadusTypes";
import { Encryptions, UserTokenTypes } from "./Encryptions";
import { PluginIntent } from "../RESTAPI/plugins/PluginOAuth";

export interface ParsedRequest extends Request {
  user?: DisadusUser;
}
export const ParseUserData = async (req: ParsedRequest) => {
  if (!req || !req.headers || !req.headers.authorization) return null;
  const payload = (await Encryptions.decrypt(
    req.headers.authorization.replace(/[^ ]+ /, "")
  ).catch((_) => {})) as {
    data: Partial<{
      tokenType: UserTokenTypes.PLUGIN;
      userID: string;
      intents: PluginIntent[];
    }>;
    exp: number;
  };
  if (!payload?.data?.userID) return null;
  return {
    user: await getUser(payload.data?.userID),
    intents: payload.data.intents,
    tokenType: payload.data.tokenType,
  };
};
