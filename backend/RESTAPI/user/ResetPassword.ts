import {
  getUserByEmail,
  updateUser,
} from "../../Helpers/DisadusAPIClient/UserAPIs";
import TetLib from "../../Helpers/TetLib";
import { RESTMethods, RESTHandler } from "../../server";
import phas from "password-hash-and-salt";
export const UserForgotPassword = {
  path: "/forgotPassword",
  method: RESTMethods.POST,
  sendUser: false,
  run: async (req, res, _) => {
    if (!req.body.email) {
      res.status(400).send("No email address provided");
      return;
    }

    const { email } = req.body;
    const unverifiedUsers = MongoDB!
      .db("UserData")
      .collection("unverifiedUsers");
    const user =
      (await getUserByEmail(email)) ||
      (await unverifiedUsers.findOne({
        email: { $regex: new RegExp(`^${email}$`, "i") },
      }));

    if (!user) {
      res.status(200).send("Email sent");
      return;
    }

    const token = TetLib.genID(16);

    const passwordResets = MongoDB!.db("UserData").collection("passwordResets");
    passwordResets.insertOne({
      token: token,
      userID: user.id,
      time: Date.now(),
    });

    const info = await MailTransporter?.sendMail({
      from: '"Kimiko Kato" <noreply@disadus.app>',
      to: req.body.email,
      subject: "Password Reset",
      text: `If you requested a password reset, please open http://localhost:443/forgotPassword/verify/${token} within the next two hours. If you are not the one who requested this reset, you can safely ignore this email. Do not share this link with anyone.`,
    });

    res.status(200).send("Email sent");
    return;
  },
} as RESTHandler;
// export default UserForgotPassword;

export const UserResetPassword = {
  path: "/forgotPassword/verify/:token",
  method: RESTMethods.POST,
  sendUser: false,
  run: async (req, res, _) => {
    const { email } = req.body;
    const { token } = req.params;

    const unverifiedUsers = MongoDB!
      .db("UserData")
      .collection("unverifiedUsers");
    const user =
      (await getUserByEmail(email)) ||
      (await unverifiedUsers.findOne({
        email: { $regex: new RegExp(`^${email}$`, "i") },
      }));

    if (!user) {
      res.status(401).send("Unauthorized");
      return;
    }

    const passwordResets = MongoDB!.db("UserData").collection("passwordResets");

    const resetRequest = await passwordResets.findOne({
      userID: user.id,
      token: token,
    });

    if (!resetRequest) {
      res.status(401).send("Unauthorized");
      return;
    }

    const now = new Date().getTime();
    if (now > resetRequest.time + 7200000) {
      passwordResets.deleteOne({
        token: token,
      });
      res.status(408).send("Request Timed Out");
      return;
    }

    passwordResets.deleteOne({
      userID: user.id,
    });

    const newPassword = (await new Promise((res, rej) =>
      phas(req.body.newPassword).hash((err, hash) =>
        err ? rej(err) : res(hash)
      )
    ).catch(() => {})) as string;
    if (newPassword) {
      await updateUser(user.id, { $set: { password: newPassword } });
      res.status(200).send("Password changed");
      return;
    }

    res.status(500).send("Internal Server Error");
    return;
  },
} as RESTHandler;
export default UserResetPassword;
