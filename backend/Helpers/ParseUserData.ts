import { NextFunction, Request, Response } from "express";
import { Encryptions, UserTokenTypes } from "./Encryptions";
import { getUser } from "./handlers/UserLib";
import { User } from "../../types/UserTypes";

export interface ParsedRequest extends Request {
  user?: User;
}
export const ParseUserData = async (req: ParsedRequest) => {
  if (!req || !req.headers || !req.headers.authorization) return null;
  const payload = (await Encryptions.decrypt(
    req.headers.authorization.replace(/[^ ]+ /, "")
  ).catch((_) => {})) as {
    data: Partial<{
      tokenType: UserTokenTypes.PLUGIN;
      userID: string;
      // intents: Pluginin[];
    }>;
    exp: number;
  };
  if (!payload?.data?.userID) return null;
  return {
    user: await getUser(payload.data?.userID),
    // intents: payload.data.intents,
    tokenType: payload.data.tokenType,
  };
};
