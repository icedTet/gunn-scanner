import { NextFunction, Request, Response, Express } from "express";
import { RESTHandler, RESTMethods } from "../../server";
import phas from "password-hash-and-salt";
import { Encryptions } from "../../Helpers/Encryptions";
import { getUser } from "../../Helpers/handlers/UserLib";
export const GetUserSelf = {
  path: "/auth/login/",
  method: RESTMethods.POST,
  sendUser: false,
  run: async (req, res, next, _) => {
    const { username, password } = req.body;
    if (!username || !password) {
      res.status(400).send("Missing username or password");
      return;
    }
    const user = await getUser(username);
    if (!user) {
      res.status(404).send("User not found");
      return;
    }
    const valid = new Promise((resolve, reject) =>
      phas(password).verifyAgainst(user.password, (err, verified) => {
        if (err) reject(err);
        resolve(verified);
      })
    );
    if (!valid) {
      res.status(401).send("Invalid password");
      return;
    }
    const token = await Encryptions.issueUserToken(user.userID);
    res.status(200).json({ token });
  },
} as RESTHandler;
export default GetUserSelf;
